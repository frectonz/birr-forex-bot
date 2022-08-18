import { Bot } from "grammy";

import {
  listThemes,
  getHelpText,
  changeTheme,
  addSubscriber,
  removeSubscriber,
  getCurrentDayForEx,
  convertCurrency,
} from "./handlers";

export default function makeBot(token: string) {
  const bot = new Bot(token);

  bot.api.setMyCommands([
    {
      command: "start",
      description:
        "Subscribe to receiving ForEx rates of ETB for the current day",
    },
    {
      command: "help",
      description: "Show help message",
    },
    {
      command: "stop",
      description: "Unsubscribe from receiving ForEx rates",
    },
    {
      command: "today",
      description: "Get today's ForEx rates",
    },
    {
      command: "theme",
      description: "Change the theme of the image",
    },
    {
      command: "convert",
      description: "Convert ETB input to other currencies"
    }
  ]);

  bot.command("start", addSubscriber);
  bot.command("today", getCurrentDayForEx);
  bot.command("stop", removeSubscriber);
  bot.command("help", getHelpText);
  bot.command("theme", listThemes);
  bot.command("convert", convertCurrency);

  bot.on("callback_query:data", changeTheme);
  return bot;
}
