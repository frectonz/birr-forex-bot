import puppeteer from "puppeteer";

export async function convertSvgToPng(svg: string) {
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

  const image = await page.screenshot({
    clip: { x: 8, y: 8, width: 2000, height: 1500 },
  });

  await browser.close();

  return image as Buffer;
}
