import { chromium } from "playwright";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:5173/?qa=1", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const total = await page.evaluate(() => document.body.scrollHeight);
console.log("reduced-motion page height:", total);
for (const [i, stop] of [0, 0.25, 0.5, 0.75, 0.97].entries()) {
  await page.evaluate(`window.scrollTo({ top: ${Math.round((total - 900) * stop)}, behavior: "instant" })`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `qa/shots/reduced-${i}.png` });
}
await browser.close();
