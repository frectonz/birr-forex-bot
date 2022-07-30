import { CurrencyData, ThemeNotFound } from "../domain";
import { ImageGenerator, ThemeType, themes } from "../ports";

export class SVGImageGenerator implements ImageGenerator {
  async generateForExImage(
    data: CurrencyData,
    themeKey: ThemeType
  ): Promise<string> {
    const theme = themes.get(themeKey);

    if (!theme) {
      throw new ThemeNotFound();
    }

    return data.reduce((acc, forex) => {
      return acc
        .replace(`|${forex.currency}|*`, `${forex.buying.toString()} Birr`)
        .replace(`|${forex.currency}|`, `${forex.selling.toString()} Birr`);
    }, theme.template);
  }
}
