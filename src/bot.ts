import { Bot } from "grammy";

import {
  getHelpText,
  addSubscriber,
  removeSubscriber,
  getCurrentDayForEx,
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
  ]);

  bot.command("start", addSubscriber);
  bot.command("today", getCurrentDayForEx);
  bot.command("stop", removeSubscriber);
  bot.command("help", getHelpText);

  return bot;
}
