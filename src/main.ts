import express from "express";
import { webhookCallback } from "grammy";

import makeBot from "./bot";
import { getBotToken, getDomain, getPort } from "./helpers/envHelpers";

const PORT = getPort();
const domain = getDomain();
const token = getBotToken();

const bot = makeBot(token);
const app = express();

app.use(express.json());
app.use(`/${token}`, webhookCallback(bot, "express"));

app.listen(PORT, async () => {
  await bot.api.setWebhook(`https://${domain}/${token}`);
  console.log(`Listening on port ${PORT}...`);
});
