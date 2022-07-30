import { model, Schema } from "mongoose";

import { Subscriber } from "../domain";
import { SubscriberGateway, ThemeType } from "../ports";

interface SubscriberSchema {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  deleted: boolean;
  theme: ThemeType;
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
      theme: {
        type: String,
        default: "dark",
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
        theme: sub.theme || "dark",
      };
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

  async getSubscriber(id: number): Promise<Subscriber | null> {
    const data = await SubscriberModel.findOne({ id });

    if (!data) {
      return null;
    } else {
      return {
        id: data.id,
        is_bot: data.is_bot,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        theme: data.theme || "dark",
      };
    }
  }

  async changeTheme(id: number, theme: ThemeType): Promise<void> {
    await SubscriberModel.updateOne(
      { id },
      {
        $set: {
          theme,
        },
      }
    );
  }
}
