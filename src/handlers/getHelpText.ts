import { Context } from "grammy";

export async function getHelpText(ctx: Context) {
  ctx.reply(
    "This bot 🤖 sends ForEx rates for <b>ETB</b> daily to its subscribers. \n" +
      "You can stop this by sending this command /stop",
    {
      parse_mode: "HTML",
    }
  );
}
