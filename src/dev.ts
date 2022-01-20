import makeBot from "./bot";
import { getBotToken } from "./helpers/envHelpers";

const bot = makeBot(getBotToken());

console.log("Bot started...");
bot.start();
