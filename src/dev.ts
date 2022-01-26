import makeBot from "./bot";

import { getBotToken } from "./helpers/env";
import { connectToDB } from "./helpers/connectToDB";

connectToDB();

const bot = makeBot(getBotToken());

console.log("Bot started...");
bot.start();
