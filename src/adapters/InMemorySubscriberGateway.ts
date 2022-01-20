import { Subscriber } from "../domain";
import { SubscriberGateway } from "../ports";

export class InMemorySubscriberGateway implements SubscriberGateway {
  private db: Subscriber[];
  constructor() {
    this.db = [];
  }

  async addSubscriber(sub: Subscriber): Promise<void> {
    this.db.push(sub);
    console.log(this.db);
  }

  async getSubscribers(): Promise<Subscriber[]> {
    console.log(this.db);
    return this.db;
  }

  async removeSubscriber(id: number): Promise<void> {
    this.db = this.db.filter((entry) => entry.id !== id);
    console.log(this.db);
  }
}
