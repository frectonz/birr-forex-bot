import {
  ImageGenerator,
  CurrencyDataProvider,
  CurrencyDataValidator,
} from "../ports";
import {
  BUYING_IMAGE,
  SELLING_IMAGE,
  convertSvgToPng,
} from "../helpers/svgToPng";

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

  async getCurrencyData() {
    console.log("fetching data...");
    const fetchedData = await this.dataFetcher.getCurrencyData();
    console.log("validating data...");
    const data = await this.dataValidator.validateCurrencyData(fetchedData);

    const buying_image = await this.imageGenerator.generateBuyingImage(data);
    const selling_image = await this.imageGenerator.generateSellingImage(data);

    await convertSvgToPng(buying_image, BUYING_IMAGE);
    await convertSvgToPng(selling_image, SELLING_IMAGE);
  }
}
