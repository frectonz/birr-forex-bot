import puppeteer from "puppeteer";

export const BUYING_IMAGE = "buying.png";
export const SELLING_IMAGE = "selling.png";

export async function convertSvgToPng(svg: string, filename: string) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--incognito", "--no-sandbox", "--single-process", "--no-zygote"],
  });

  const page = await browser.newPage();

  const loaded = page.waitForNavigation({
    waitUntil: "load",
  });
  await page.setContent(svg);
  await loaded;

  await page.screenshot({
    path: filename,
    clip: { x: 8, y: 8, width: 1000, height: 1500 },
  });

  await browser.close();
}
