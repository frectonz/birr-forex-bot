import { Context } from "grammy";

import {
  SVGImageGenerator,
  CurrencyDataFetcher,
  ThrowingCurrencyDataValidator,
  MessageCurrencyDataPresenter,
} from "../adapters";
import {
  GetCurrencyDataUseCase,
  FailedToParseCurrencyData,
  FailedToDownloadCurrencyData,
} from "../domain";

export async function getCurrentDayForEx(ctx: Context) {
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
    ctx.reply("<b>Something went wrong.</b>\n" + "Don't worry we will fix it", {
      parse_mode: "HTML",
    });
  }
}
