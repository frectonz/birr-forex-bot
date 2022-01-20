import {
  ImageGenerator,
  CurrencyDataProvider,
  CurrencyDataValidator,
} from "../ports";
import { CurrencyDataPresenter } from "../ports";
import { convertSvgToPng } from "../helpers/svgToPng";

export class GetCurrencyDataUseCase {
  private imageGenerator: ImageGenerator;
  private dataFetcher: CurrencyDataProvider;
  private dataValidator: CurrencyDataValidator;
  private presenter: CurrencyDataPresenter;

  constructor(
    fetcher: CurrencyDataProvider,
    validator: CurrencyDataValidator,
    imageGenerator: ImageGenerator,
    presenter: CurrencyDataPresenter
  ) {
    this.dataFetcher = fetcher;
    this.dataValidator = validator;
    this.imageGenerator = imageGenerator;
    this.presenter = presenter;
  }

  async getCurrencyData() {
    console.log("fetching data...");
    const fetchedData = await this.dataFetcher.getCurrencyData();
    console.log("validating data...");
    const data = await this.dataValidator.validateCurrencyData(fetchedData);

    const buying_image = await this.imageGenerator.generateBuyingImage(data);
    const selling_image = await this.imageGenerator.generateSellingImage(data);

    await convertSvgToPng(buying_image, "buying.png");
    await convertSvgToPng(selling_image, "selling.png");

    this.presenter.setBuyingImage("buying.png");
    this.presenter.setSellingImage("selling.png");
  }
}
