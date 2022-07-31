import puppeteer, { Browser } from "puppeteer";
import { ThemeInfo } from "../ports";

let browser: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ["--incognito", "--no-sandbox", "--single-process", "--no-zygote"],
    });
    return browser;
  }

  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

export async function convertSvgToPng(svg: string, themeInfo: ThemeInfo) {
  const browser = await getBrowser();

  const page = await browser.newPage();

  const loaded = page.waitForNavigation({
    waitUntil: "load",
  });
  await page.setContent(svg);
  await loaded;

  const image = await page.screenshot({
    clip: { x: 8, y: 8, width: themeInfo.width, height: themeInfo.height },
  });

  page.close();

  return image as Buffer;
}
