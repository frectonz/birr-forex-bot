import "dotenv/config";
import express from "express";
import { webhookCallback } from "grammy";

import makeBot from "./bot";
import {
  getPort,
  getDomain,
  getBotToken,
  getMongoURI,
  getWebhookSecret,
} from "./helpers/env";
import { makeWebhookHandle } from "./handlers";
import { connectToDB } from "./helpers/connectToDB";

const token = getBotToken();
const mongoURI = getMongoURI();
const bot = makeBot(token);

connectToDB(mongoURI);

if (process.env.NODE_ENV === "production") {
  const PORT = getPort();
  const domain = getDomain();
  const secret = getWebhookSecret();

  const app = express();
  app.use(express.json());
  app.get("/webhook", makeWebhookHandle(bot, secret));
  app.use(`/${token}`, webhookCallback(bot, "express"));

  app.listen(PORT, async () => {
    await bot.api.setWebhook(`https://${domain}/${token}`);
    console.log(`Listening on port ${PORT}...`);
  });
} else {
  console.log("Bot started in development mode...");
  bot.start();
}
