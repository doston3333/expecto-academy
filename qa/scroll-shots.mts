import { chromium } from "playwright";
import { mkdirSync } from "node:fs";


const BASE = "http://127.0.0.1:5173/?qa=1";
const OUT = new URL("./shots/", import.meta.url).pathname;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
mkdirSync(OUT, { recursive: true });

async function shoot(width: number, height: number, label: string, stops: number[]) {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  const total = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
  for (const stop of stops) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.round(total * stop));
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}${label}-${String(stop).replace(".", "_")}.png` });
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  console.log(`${label}: horizontal overflow = ${overflow}, total scroll = ${total}`);
  await browser.close();
}

await shoot(1440, 900, "desktop", [0, 0.04, 0.08, 0.11, 0.14, 0.17, 0.2, 0.23, 0.26, 0.3, 0.34, 0.38, 0.42, 0.46, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.86, 0.92, 0.97]);
await shoot(390, 844, "mobile", [0, 0.08, 0.16, 0.24, 0.32, 0.42, 0.52, 0.62, 0.72, 0.82, 0.97]);
