import { Subscriber } from "../domain/Subscriber";

export interface SubscriberGateway {
  addSubscriber(sub: Subscriber): Promise<void>;
  getSubscribers(): Promise<Subscriber[]>;
  removeSubscriber(id: number): Promise<void>;
}
