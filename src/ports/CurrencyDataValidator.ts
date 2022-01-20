import { CurrencyData } from "../domain";

export interface CurrencyDataValidator {
  validateCurrencyData(data: any): Promise<CurrencyData>;
}
