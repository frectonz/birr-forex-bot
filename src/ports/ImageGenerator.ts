import { CurrencyData } from "../domain";

export interface ImageGenerator {
  generateBuyingImage(data: CurrencyData): Promise<string>;
  generateSellingImage(data: CurrencyData): Promise<string>;
}
