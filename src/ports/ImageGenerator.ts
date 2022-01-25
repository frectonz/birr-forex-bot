import { CurrencyData } from "../domain";

export interface ImageGenerator {
  generateForExImage(data: CurrencyData): Promise<string>;
}
