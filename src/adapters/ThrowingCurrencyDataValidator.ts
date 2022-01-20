import { CurrencyDataValidator } from "../ports";
import { CurrencyData, FailedToParseCurrencyData } from "../domain";

export class ThrowingCurrencyDataValidator implements CurrencyDataValidator {
  async validateCurrencyData(data: any): Promise<CurrencyData> {
    if (!data) {
      throw new FailedToParseCurrencyData();
    }

    for (const elm of data) {
      if (!elm.buying || !elm.selling || !elm.currency) {
        throw new FailedToParseCurrencyData();
      }
    }

    return data as CurrencyData;
  }
}
