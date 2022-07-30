import { ThemeType } from "./ImageGenerator";
import { Subscriber } from "../domain/Subscriber";

export interface SubscriberGateway {
  addSubscriber(sub: Subscriber): Promise<void>;
  getSubscribers(): Promise<Subscriber[]>;
  removeSubscriber(id: number): Promise<void>;
  getSubscriber(id: number): Promise<Subscriber | null>;
  changeTheme(id: number, theme: ThemeType): Promise<void>;
}
