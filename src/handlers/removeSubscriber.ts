import { Context } from "grammy";
import { MongoDBSubscriberGateway } from "../adapters";

const gateway = new MongoDBSubscriberGateway();

export async function removeSubscriber(ctx: Context) {
  try {
    if (ctx.chat) {
      await gateway.removeSubscriber(ctx.chat.id);

      ctx.reply(
        "You have successfully unsubscribed.\n" +
          "We are sorry to see you go." +
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
    console.error(error);
    ctx.reply(
      "<b>I think something went wrong.</b>\n" +
        "If it was an error on my side it will be fixed. Try again after some time.",
      {
        parse_mode: "HTML",
      }
    );
  }
}
