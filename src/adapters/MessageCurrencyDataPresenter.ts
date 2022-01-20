import { Context, InputFile } from "grammy";

import { CurrencyDataPresenter } from "../ports/CurrencyDataPresenter";

export class MessageCurrencyDataPresenter implements CurrencyDataPresenter {
  private ctx: Context;
  private buyingImage: string;
  private sellingImage: string;
  constructor(ctx: Context) {
    this.ctx = ctx;
    this.buyingImage = "";
    this.sellingImage = "";
  }

  setBuyingImage(filename: string) {
    this.buyingImage = filename;
  }

  setSellingImage(filename: string) {
    this.sellingImage = filename;
  }

  async sendMessage() {
    await this.ctx.replyWithPhoto(new InputFile(this.buyingImage), {
      caption: "Here are today's ForEx buying rates for ETB",
    });

    await this.ctx.replyWithPhoto(new InputFile(this.sellingImage), {
      caption: "Here are today's ForEx selling rates for ETB",
    });
  }
}
