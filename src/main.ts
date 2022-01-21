import express from "express";
import { webhookCallback } from "grammy";

import makeBot from "./bot";
import { connectToDB } from "./helpers/connectToDB";
import { getBotToken, getDomain, getPort } from "./helpers/envHelpers";

const PORT = getPort();
const domain = getDomain();
const token = getBotToken();

const { bot, sendDailyForExData } = makeBot(token);

const app = express();

connectToDB();

app.use(express.json());

app.get("/sendData", (_, res) => {
  res.send("OK");
  sendDailyForExData();
});

app.use(`/${token}`, webhookCallback(bot, "express"));

app.listen(PORT, async () => {
  await bot.api.setWebhook(`https://${domain}/${token}`);
  console.log(`Listening on port ${PORT}...`);
});
