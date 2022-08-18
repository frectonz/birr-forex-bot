import { Context } from "grammy";

import {
  CurrencyDataFetcher,
  MongoDBSubscriberGateway,
  ThrowingCurrencyDataValidator,
} from "../adapters";
import {
  FailedToParseCurrencyData,
  FailedToDownloadCurrencyData,
  ThemeNotFound,
} from "../domain";

export async function convertCurrency(ctx: Context) {
  if (!ctx.chat) {
    return ctx.reply(
      "I wasn't able to get the forex data.\n" +
        "If it was an error on my side it will be fixed. Try again after some time."
    );
  }

  try {
    const fetcher = new CurrencyDataFetcher();
    const validator = new ThrowingCurrencyDataValidator();
    const gateway = new MongoDBSubscriberGateway();

    const subscriber = await gateway.getSubscriber(ctx.chat.id);

    if (!subscriber) {
      return ctx.reply(
        "I didn't find you in my subscribers list. Please subscribe to the bot using /start"
      );
    }
    
    if (typeof ctx.match !== "string") {
      throw new Error("`ctx.match` is not a string")
    }

    const input = parseFloat(ctx.match);

    if (!input) {
      return ctx.reply("Please provide an input.")
    }

    const fetchedData = await fetcher.getCurrencyData();
    const data = await validator.validateCurrencyData(fetchedData);

    const allowedCurrencies: { [index: string]: boolean } = {
      "Euro": true,
      "USDollar": true,
      "ChineseYuan": true,
      "IndianRupee": true,
      "PoundSterling": true,
      "KenyanShilling": true,
      "CanadianDollar": true,
    };

    let result = "";
    data.forEach(forex => {
      if (!allowedCurrencies[forex.currency]) {
        return;
      }
      const sellingPrice = input * forex.selling;
      const formatter = new Intl.NumberFormat();
      const formattedInput = formatter.format(input);
      const formattedConversion = formatter.format(sellingPrice);

      result += `\`${formattedInput} ${forex.currency}\` = \`${formattedConversion} Birr\`\n`;
    });

    ctx.reply(result, { parse_mode: "Markdown" });
  } catch (error) {
    if (error instanceof FailedToDownloadCurrencyData) {
      console.error("Failed to download currency data");
    } else if (error instanceof FailedToParseCurrencyData) {
      console.error("Failed to parse currency data");
    } else if (error instanceof ThemeNotFound) {
      console.error("Theme Not Found");
    }

    console.error(error);
    ctx.reply("<b>Something went wrong.</b>\n" + "Don't worry we will fix it", {
      parse_mode: "HTML",
    });
  }
}
