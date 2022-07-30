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
    const SECRET = req.headers.secret;

    if (SECRET === webhookSecret) {
      res.send("OK");
      sendForExData(bot);
    } else {
      res.status(401).send("UNAUTHORIZED");
    }
  };
}

const gateway = new MongoDBSubscriberGateway();
let lastSavedDay: Date | null = null;

export async function sendForExData(bot: Bot) {
  const today = new Date();
  const itsTheSameDay = lastSavedDay
    ? lastSavedDay.toDateString() === today.toDateString()
    : false;

  if (itsTheSameDay) {
    return;
  } else {
    lastSavedDay = today;
  }

  try {
    const fetcher = new CurrencyDataFetcher();
    const imageGenerator = new SVGImageGenerator();
    const validator = new ThrowingCurrencyDataValidator();

    const useCase = new GetCurrencyDataUseCase(
      fetcher,
      validator,
      imageGenerator
    );

    const image = {
      light: await useCase.getCurrencyData("light"),
      dark: await useCase.getCurrencyData("dark"),
    };

    const subscribers = await gateway.getSubscribers();

    subscribers.forEach(async (sub) => {
      try {
        await bot.api.sendPhoto(sub.id, new InputFile(image[sub.theme]), {
          caption: "Here are today's ForEx rates for ETB",
        });
      } catch (error) {
        console.error(
          "Error sending photo",
          (error as { description: string })?.description
        );
      }
    });
  } catch (error) {
    if (error instanceof FailedToDownloadCurrencyData) {
      console.error("Failed to download currency data");
    } else if (error instanceof FailedToParseCurrencyData) {
      console.error("Failed to parse currency data");
    }
    console.error(error);
  }
}
