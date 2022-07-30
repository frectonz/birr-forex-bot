import { ThemeType } from "../ports";

export interface Subscriber {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  theme: ThemeType;
}
