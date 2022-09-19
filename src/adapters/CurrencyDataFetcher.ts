import fetch from "node-fetch";

import { CurrencyDataProvider } from "../ports";
import { FailedToDownloadCurrencyData } from "../domain";

const URL = "https://birru.up.railway.app/";

export class CurrencyDataFetcher implements CurrencyDataProvider {
  private data: any;

  async getCurrencyData(): Promise<any> {
    if (this.data) {
      return this.data;
    }

    try {
      const res = await fetch(URL);
      this.data = await res.json();
      return this.data;
    } catch {
      throw new FailedToDownloadCurrencyData();
    }
  }
}
