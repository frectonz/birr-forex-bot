import { Context } from "grammy";
import { MongoDBSubscriberGateway } from "../adapters";

const gateway = new MongoDBSubscriberGateway();

export async function addSubscriber(ctx: Context) {
  try {
    if (ctx.from) {
      await gateway.addSubscriber({
        id: ctx.from.id,
        is_bot: ctx.from.is_bot,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name || "",
        username: ctx.from.username || "",
      });

      ctx.reply(
        "You have successfully subscribed 🎉.\n" +
          "From now on you will receive daily messages with the current day's ForEx rate for <b>ETB</b>.\n" +
          "If you want to unsubscribe stop the bot by sending the command /stop.",
        {
          parse_mode: "HTML",
        }
      );
    } else {
      ctx.reply(
        "I wasn't able to add you to the subscribers list.\n" +
          "If it was an error on my side it will be fixed. Try again after some time."
      );
    }
  } catch (error) {
    console.log(error);
    ctx.reply(
      "<b>I think something went wrong.</b>\n" +
        "If it was an error on my side it will be fixed. Try again after some time.",
      {
        parse_mode: "HTML",
      }
    );
  }
}
