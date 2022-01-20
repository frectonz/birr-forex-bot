import { Bot } from "grammy";

import {
  SVGImageGenerator,
  CurrencyDataFetcher,
  ThrowingCurrencyDataValidator,
  MessageCurrencyDataPresenter,
} from "./adapters";
import {
  GetCurrencyDataUseCase,
  FailedToParseCurrencyData,
  FailedToDownloadCurrencyData,
} from "./domain";

export default function makeBot(token: string) {
  const bot = new Bot(token);

  bot.api.setMyCommands([
    {
      command: "start",
      description:
        "Subscribe to receiving ForEx rates of ETB for the current day",
    },
    {
      command: "help",
      description: "Show help message",
    },
    {
      command: "stop",
      description: "Unsubscribe from receiving ForEx rates",
    },
  ]);

  bot.command("start", async (ctx) => {
    ctx.reply(
      "You have successfully subscribed 🎉.\n" +
        "From now on you will receive daily messages with the current day's ForEx rate for <b>ETB</b>.\n" +
        "If you want to unsubscribe stop the bot /stop.",
      {
        parse_mode: "HTML",
      }
    );
  });

  bot.command("help", async (ctx) => {
    ctx.reply(
      "This bot 🤖 sends ForEx rate for <b>ETB</b> daily to its subscribers. \n" +
        "You can stop this by sending this command /stop",
      {
        parse_mode: "HTML",
      }
    );
  });

  bot.command("do", async (ctx) => {
    console.log("from: ", ctx.from);

    try {
      const fetcher = new CurrencyDataFetcher();
      const imageGenerator = new SVGImageGenerator();
      const validator = new ThrowingCurrencyDataValidator();
      const presenter = new MessageCurrencyDataPresenter(ctx);

      const useCase = new GetCurrencyDataUseCase(
        fetcher,
        validator,
        imageGenerator,
        presenter
      );

      await useCase.getCurrencyData();
      await presenter.sendMessage();
    } catch (error) {
      if (error instanceof FailedToDownloadCurrencyData) {
        console.log("Failed to download currency data");
      } else if (error instanceof FailedToParseCurrencyData) {
        console.log("Failed to parse currency data");
      }

      console.log(error);
      ctx.reply(
        "<b>Something went wrong.</b>\n" + "Don't worry we will fix it"
      );
    }
  });

  return bot;
}
