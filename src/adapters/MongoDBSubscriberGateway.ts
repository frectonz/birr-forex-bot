import { model, Schema } from "mongoose";

import { Subscriber } from "../domain";
import { SubscriberGateway } from "../ports";

interface SubscriberSchema {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  deleted: boolean;
}

const SubscriberModel = model<SubscriberSchema>(
  "subscriber",
  new Schema<SubscriberSchema>(
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
    const existing = await SubscriberModel.findOne({ id: sub.id });

    if (existing) {
      existing.deleted = false;
      await existing.save();
    } else {
      const subscriber = new SubscriberModel({
        id: sub.id,
        is_bot: sub.is_bot,
        first_name: sub.first_name,
        last_name: sub.last_name,
        username: sub.username,
      });

      await subscriber.save();
    }
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
