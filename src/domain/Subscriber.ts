import { ThemeType } from "../ports";

export type Subscriber =
  | PrivateSubscriber
  | GroupSubscriber
  | SuperGroupSubscriber
  | ChannelSubscriber;

interface PrivateSubscriber extends SubscriberBase {
  first_name: string;
  last_name: string;
  username: string;
  type: "private";
}

interface GroupSubscriber extends SubscriberBase {
  title: string;
  type: "group";
}

interface SuperGroupSubscriber extends SubscriberBase {
  title: string;
  username: string;
  type: "supergroup";
}

interface ChannelSubscriber extends SubscriberBase {
  title: string;
  type: "channel";
}

interface SubscriberBase {
  id: number;
  theme: ThemeType;
}
