import { Context, InputFile } from "grammy";

import {
  SVGImageGenerator,
  CurrencyDataFetcher,
  ThrowingCurrencyDataValidator,
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

    const useCase = new GetCurrencyDataUseCase(
      fetcher,
      validator,
      imageGenerator
    );

    const image = await useCase.getCurrencyData();

    await ctx.replyWithPhoto(new InputFile(image), {
      caption: "Here are today's ForEx rates for ETB",
    });
  } catch (error) {
    if (error instanceof FailedToDownloadCurrencyData) {
      console.error("Failed to download currency data");
    } else if (error instanceof FailedToParseCurrencyData) {
      console.error("Failed to parse currency data");
    }

    console.error(error);
    ctx.reply("<b>Something went wrong.</b>\n" + "Don't worry we will fix it", {
      parse_mode: "HTML",
    });
  }
}
