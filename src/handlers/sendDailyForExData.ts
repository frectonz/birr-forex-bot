import { Bot, InputFile } from "grammy";
import { Request, Response } from "express";

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

export function makeWebhookHandle(bot: Bot, webhookSecret: string) {
  return (req: Request, res: Response) => {
    const SECRET = req.headers["SECRET"];

    console.log(req.headers);
    console.log(webhookSecret);

    if (SECRET === webhookSecret) {
      res.send("OK");
      sendForExData(bot);
    } else {
      res.status(401).send("UNAUTHORIZED");
    }
  };
}

const gateway = new MongoDBSubscriberGateway();

async function sendForExData(bot: Bot) {
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
        caption: "Here are today's ForEx rates for ETB",
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
}
