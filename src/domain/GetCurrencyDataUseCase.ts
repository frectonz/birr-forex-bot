import {
  ImageGenerator,
  CurrencyDataProvider,
  CurrencyDataValidator,
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

  async getCurrencyData(): Promise<Buffer> {
    console.log("fetching data...");
    const fetchedData = await this.dataFetcher.getCurrencyData();
    console.log("validating data...");
    const data = await this.dataValidator.validateCurrencyData(fetchedData);
    console.log("generating image...");
    const image = await this.imageGenerator.generateForExImage(data);
    return await convertSvgToPng(image);
  }
}
