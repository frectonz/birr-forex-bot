import { Context, InputFile } from "grammy";

import {
  SVGImageGenerator,
  CurrencyDataFetcher,
  MongoDBSubscriberGateway,
  ThrowingCurrencyDataValidator,
} from "../adapters";
import {
  GetCurrencyDataUseCase,
  FailedToParseCurrencyData,
  FailedToDownloadCurrencyData,
  ThemeNotFound,
} from "../domain";

export async function getCurrentDayForEx(ctx: Context) {
  if (!ctx.from) {
    return ctx.reply(
      "I wasn't able to get the forex data.\n" +
        "If it was an error on my side it will be fixed. Try again after some time."
    );
  }

  try {
    const fetcher = new CurrencyDataFetcher();
    const imageGenerator = new SVGImageGenerator();
    const validator = new ThrowingCurrencyDataValidator();
    const gateway = new MongoDBSubscriberGateway();

    const useCase = new GetCurrencyDataUseCase(
      fetcher,
      validator,
      imageGenerator
    );

    const subscriber = await gateway.getSubscriber(ctx.from.id);

    if (!subscriber) {
      return ctx.reply(
        "I didn't find you in my subscribers list. Please subscribe to the bot using /start"
      );
    }

    const image = await useCase.getCurrencyData(subscriber.theme);

    await ctx.replyWithPhoto(new InputFile(image), {
      caption:
        "Here are today's ForEx rates for ETB. You can change the theme using /theme",
    });
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
