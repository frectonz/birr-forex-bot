import { readFileSync } from "fs";
import { CurrencyData } from "../domain";
import { ImageGenerator } from "../ports";

const TEMPLATE = readFileSync("./templates/template.svg", "utf-8");

export class SVGImageGenerator implements ImageGenerator {
  async generateForExImage(data: CurrencyData): Promise<string> {
    return data.reduce((acc, forex) => {
      return acc
        .replace(`|${forex.currency}|*`, `${forex.buying.toString()} Birr`)
        .replace(`|${forex.currency}|`, `${forex.selling.toString()} Birr`);
    }, TEMPLATE);
  }
}
