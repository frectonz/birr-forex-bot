import { model, Schema, Document, Types } from "mongoose";

import { Subscriber } from "../domain";
import { SubscriberGateway, ThemeType } from "../ports";

interface SubscriberSchema {
  id: number;
  first_name: string;
  last_name: string;
  deleted: boolean;
  username: string;
  title: string;
  type: "private" | "group" | "supergroup" | "channel";
  theme: ThemeType;
}

const SubscriberModel = model<SubscriberSchema>(
  "subscriber",
  new Schema<SubscriberSchema>(
    {
      id: Number,
      first_name: String,
      last_name: String,
      username: String,
      title: String,
      type: String,
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
        type: sub.type,
        theme: sub.theme,
      });

      if (sub.type === "private") {
        subscriber.first_name = sub.first_name;
        subscriber.last_name = sub.last_name;
        subscriber.username = sub.username;
      } else if (sub.type === "group") {
        subscriber.title = sub.title;
      } else if (sub.type === "supergroup") {
        subscriber.title = sub.title;
        subscriber.username = sub.username;
      } else if (sub.type === "channel") {
        subscriber.title = sub.title;
      }

      await subscriber.save();
    }
  }

  async getSubscribers(): Promise<Subscriber[]> {
    const subscribers = await SubscriberModel.find({ deleted: false });
    return subscribers.map(documentToObject);
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
      return documentToObject(data);
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

function documentToObject(
  sub: Document<unknown, any, SubscriberSchema> &
    SubscriberSchema & {
      _id: Types.ObjectId;
    }
): Subscriber {
  if (sub.type === "channel") {
    return {
      id: sub.id,
      title: sub.title,
      theme: sub.theme,
      type: sub.type,
    };
  } else if (sub.type === "group") {
    return {
      id: sub.id,
      title: sub.title,
      theme: sub.theme,
      type: sub.type,
    };
  } else if (sub.type === "supergroup") {
    return {
      id: sub.id,
      title: sub.title,
      username: sub.username,
      theme: sub.theme,
      type: sub.type,
    };
  } else {
    return {
      id: sub.id,
      first_name: sub.first_name,
      last_name: sub.last_name,
      username: sub.username,
      theme: sub.theme,
      type: sub.type,
    };
  }
}
