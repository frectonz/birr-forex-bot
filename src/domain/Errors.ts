export class FailedToParseCurrencyData extends Error {
  constructor() {
    super();
    this.name = "FailedToParseCurrencyData";
  }
}

export class FailedToDownloadCurrencyData extends Error {
  constructor() {
    super();
    this.name = "FailedToDownloadCurrencyData";
  }
}
