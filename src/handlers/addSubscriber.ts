import { Context } from "grammy";
import { MongoDBSubscriberGateway } from "../adapters";

const gateway = new MongoDBSubscriberGateway();

export async function addSubscriber(ctx: Context) {
  try {
    if (ctx.chat) {
      if (ctx.chat.type === "private") {
        await gateway.addSubscriber({
          id: ctx.chat.id,
          first_name: ctx.chat.first_name,
          last_name: ctx.chat.last_name || "",
          username: ctx.chat.username || "",
          theme: "dark",
          type: "private",
        });
      } else if (ctx.chat.type === "group") {
        await gateway.addSubscriber({
          id: ctx.chat.id,
          title: ctx.chat.title,
          theme: "dark",
          type: "group",
        });
      } else if (ctx.chat.type === "supergroup") {
        await gateway.addSubscriber({
          id: ctx.chat.id,
          title: ctx.chat.title,
          username: ctx.chat.username || "",
          theme: "dark",
          type: "supergroup",
        });
      } else if (ctx.chat.type === "channel") {
        await gateway.addSubscriber({
          id: ctx.chat.id,
          title: ctx.chat.title,
          theme: "dark",
          type: "channel",
        });
      }

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
