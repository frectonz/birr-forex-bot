import "dotenv/config";
import express from "express";
import { webhookCallback } from "grammy";
import mongoose from "mongoose";

import makeBot from "./bot";
import {
  getPort,
  getDomain,
  getBotToken,
  getMongoURI,
  getWebhookSecret,
} from "./helpers/env";
import { makeWebhookHandle, sendForExData } from "./handlers";
import { connectToDB } from "./helpers/connectToDB";
import { closeBrowser } from "./helpers/svgToPng";

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

  const server = app.listen(PORT, async () => {
    await bot.api.setWebhook(`https://${domain}/${token}`);
    console.log(`Listening on port ${PORT}...`);
  });

  process.on("SIGTERM", async () => {
    server.close();
    await mongoose.disconnect();
    await closeBrowser();
    await bot.stop();
    process.exit(0);
  });
} else {
  // set timeout to test webhook functionality
  // setTimeout(() => {
  //   sendForExData(bot);
  // }, 5000);

  console.log("Bot started in development mode...");
  bot.start();
}
