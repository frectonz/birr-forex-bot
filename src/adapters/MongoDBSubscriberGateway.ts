import { Subscriber } from "../domain";
import { SubscriberGateway } from "../ports";

import { model, Schema } from "mongoose";

const SubscriberModel = model(
  "subscriber",
  new Schema(
    {
      id: Number,
      is_bot: Boolean,
      first_name: String,
      last_name: String,
      username: String,
      deleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  )
);

export class MongoDBSubscriberGateway implements SubscriberGateway {
  async addSubscriber(sub: Subscriber): Promise<void> {
    const subscriber = new SubscriberModel({
      id: sub.id,
      is_bot: sub.is_bot,
      first_name: sub.first_name,
      last_name: sub.last_name,
      username: sub.username,
    });

    await subscriber.save();
  }

  async getSubscribers(): Promise<Subscriber[]> {
    const subscribers = await SubscriberModel.find({ deleted: false });
    return subscribers.map((sub) => {
      return {
        id: sub.id,
        is_bot: sub.is_bot,
        first_name: sub.first_name,
        last_name: sub.last_name,
        username: sub.username,
      } as Subscriber;
    });
  }

  async removeSubscriber(id: number): Promise<void> {
    await SubscriberModel.updateOne(
      { id },
      {
        $set: {
          deleted: true,
        },
      }
    );
  }
}
