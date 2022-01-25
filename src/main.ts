import express from "express";
import { webhookCallback } from "grammy";

import makeBot from "./bot";
import { makeWebhookHandle } from "./handlers";
import { connectToDB } from "./helpers/connectToDB";
import { getPort, getDomain, getBotToken } from "./helpers/envHelpers";

const PORT = getPort();
const domain = getDomain();
const token = getBotToken();

const bot = makeBot(token);

const app = express();

connectToDB();

app.use(express.json());

app.get("/webhook", makeWebhookHandle(bot));
app.use(`/${token}`, webhookCallback(bot, "express"));

app.listen(PORT, async () => {
  await bot.api.setWebhook(`https://${domain}/${token}`);
  console.log(`Listening on port ${PORT}...`);
});
