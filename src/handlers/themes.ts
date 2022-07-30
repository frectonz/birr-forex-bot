import { Context, InlineKeyboard, InputFile } from "grammy";

import { themes, ThemeType } from "../ports";
import { MongoDBSubscriberGateway } from "../adapters";

export function listThemes(ctx: Context) {
  for (const [themeKey, theme] of themes) {
    ctx.replyWithPhoto(new InputFile(theme.preview), {
      caption: theme.name,
      reply_markup: new InlineKeyboard().text(
        `Change Theme To ${theme.name}`,
        `change-theme:${themeKey}`
      ),
    });
  }
}

export async function changeTheme(ctx: Context) {
  if (!ctx.from) {
    ctx.reply(
      "I wasn't able to change the theme.\n" +
        "If it was an error on my side it will be fixed. Try again after some time."
    );
  } else {
    const themeKey = ctx?.callbackQuery?.data?.split(":")[1] as ThemeType;
    const theme = themes.get(themeKey);

    if (!theme) {
      ctx.reply("Theme not found. Try Again");
    } else {
      const gateway = new MongoDBSubscriberGateway();
      const subscriber = await gateway.getSubscriber(ctx.from.id);

      if (!subscriber) {
        ctx.reply(
          "I didn't find you in my subscribers list. Please subscribe to the bot using /start"
        );
      } else {
        await gateway.changeTheme(ctx.from.id, themeKey);
        ctx.reply(`Theme changed to ${theme.name}`);
      }
    }
  }

  await ctx.answerCallbackQuery();
}
