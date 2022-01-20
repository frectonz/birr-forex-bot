import { readFileSync } from "fs";
import { CurrencyData } from "../domain";
import { ImageGenerator } from "../ports";

const SELLING_TEMPLATE = readFileSync(
  "./templates/selling_template.svg",
  "utf-8"
);
const BUYING_TEMPLATE = readFileSync(
  "./templates/buying_template.svg",
  "utf-8"
);

export class SVGImageGenerator implements ImageGenerator {
  async generateSellingImage(data: CurrencyData): Promise<string> {
    return data.reduce((acc, forex) => {
      return acc.replace(
        `|${forex.currency}|`,
        `${forex.selling.toString()} Birr`
      );
    }, SELLING_TEMPLATE);
  }

  async generateBuyingImage(data: CurrencyData): Promise<string> {
    return data.reduce((acc, forex) => {
      return acc.replace(
        `|${forex.currency}|`,
        `${forex.buying.toString()} Birr`
      );
    }, BUYING_TEMPLATE);
  }
}
