import {
  ThemeType,
  ImageGenerator,
  CurrencyDataProvider,
  CurrencyDataValidator,
  themes,
} from "../ports";
import { convertSvgToPng } from "../helpers/svgToPng";

export class GetCurrencyDataUseCase {
  private imageGenerator: ImageGenerator;
  private dataFetcher: CurrencyDataProvider;
  private dataValidator: CurrencyDataValidator;

  constructor(
    fetcher: CurrencyDataProvider,
    validator: CurrencyDataValidator,
    imageGenerator: ImageGenerator
  ) {
    this.dataFetcher = fetcher;
    this.dataValidator = validator;
    this.imageGenerator = imageGenerator;
  }

  async getCurrencyData(theme: ThemeType): Promise<Buffer> {
    const fetchedData = await this.dataFetcher.getCurrencyData();
    const data = await this.dataValidator.validateCurrencyData(fetchedData);
    const svg = await this.imageGenerator.generateForExImage(data, theme);
    const themeInfo = themes.get(theme)!;
    const image = await convertSvgToPng(svg, themeInfo);
    return image;
  }
}
