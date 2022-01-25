import { Bot, InputFile } from "grammy";

import {
  GetCurrencyDataUseCase,
  FailedToParseCurrencyData,
  FailedToDownloadCurrencyData,
} from "../domain";
import {
  SVGImageGenerator,
  CurrencyDataFetcher,
  MongoDBSubscriberGateway,
  ThrowingCurrencyDataValidator,
} from "../adapters";

const gateway = new MongoDBSubscriberGateway();

export function makeDailyForExDataSender(bot: Bot) {
  return async () => {
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

      const subscribers = await gateway.getSubscribers();

      subscribers.forEach(async (sub) => {
        await bot.api.sendPhoto(sub.id, new InputFile(image), {
          caption: "Here are today's ForEx buying rates for ETB",
        });

        await bot.api.sendPhoto(sub.id, new InputFile(image), {
          caption: "Here are today's ForEx selling rates for ETB",
        });
      });
    } catch (error) {
      if (error instanceof FailedToDownloadCurrencyData) {
        console.log("Failed to download currency data");
      } else if (error instanceof FailedToParseCurrencyData) {
        console.log("Failed to parse currency data");
      }
      console.log(error);
    }
  };
}
