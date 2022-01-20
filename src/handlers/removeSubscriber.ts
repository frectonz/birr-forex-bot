import { Context } from "grammy";
import { InMemorySubscriberGateway } from "../adapters";

const gateway = new InMemorySubscriberGateway();

export async function removeSubscriber(ctx: Context) {
  try {
    if (ctx.from) {
      await gateway.removeSubscriber(ctx.from.id);

      ctx.reply(
        "You have successfully unsubscribed.\n" +
          "We are sorry to see you live." +
          "If you want to re-subscribe start the bot by sending the command /start.",
        {
          parse_mode: "HTML",
        }
      );
    } else {
      ctx.reply(
        "I wasn't able to remove you from the subscribers list.\n" +
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
