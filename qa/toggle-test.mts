import { chromium } from "playwright";
const BASE = process.env.QA_BASE ?? "http://127.0.0.1:5173/?qa=1";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const before = await page.evaluate(() => ({
  cinema: document.querySelector(".xc-page")?.getAttribute("data-cinema"),
  height: document.body.scrollHeight,
  arts: document.querySelectorAll(".xc-art").length,
}));
// jump mid-page, then toggle off
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
await page.waitForTimeout(600);
await page.locator('button[role="switch"]').scrollIntoViewIfNeeded();
await page.locator('button[role="switch"]').click();
await page.waitForTimeout(800);
const after = await page.evaluate(() => ({
  cinema: document.querySelector(".xc-page")?.getAttribute("data-cinema"),
  height: document.body.scrollHeight,
  switchChecked: document.querySelector('button[role="switch"]')?.getAttribute("aria-checked"),
  visibleArt: [...document.querySelectorAll(".xc-art")].filter(e => getComputedStyle(e).display !== "none").length,
}));
await page.screenshot({ path: "qa/shots/toggle-off.png" });
// toggle back on
await page.locator('button[role="switch"]').click();
await page.waitForTimeout(800);
const back = await page.evaluate(() => ({
  cinema: document.querySelector(".xc-page")?.getAttribute("data-cinema"),
  height: document.body.scrollHeight,
  switchChecked: document.querySelector('button[role="switch"]')?.getAttribute("aria-checked"),
}));
await page.screenshot({ path: "qa/shots/toggle-on.png" });
console.log(JSON.stringify({ before, after, back }, null, 1));
await browser.close();
