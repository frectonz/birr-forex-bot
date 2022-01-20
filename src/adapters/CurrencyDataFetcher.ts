import fetch from "node-fetch";

import { CurrencyDataProvider } from "../ports";
import { FailedToDownloadCurrencyData } from "../domain";

const URL = "https://birru.herokuapp.com/";

export class CurrencyDataFetcher implements CurrencyDataProvider {
  async getCurrencyData(): Promise<any> {
    try {
      const res = await fetch(URL);
      const data = await res.json();
      return data;
    } catch {
      throw new FailedToDownloadCurrencyData();
    }
  }
}
