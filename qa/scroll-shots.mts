import { chromium } from "playwright";
import { mkdirSync } from "node:fs";


const BASE = process.env.QA_BASE ?? "http://127.0.0.1:5173/?qa=1";
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

// Optional: node qa/scroll-shots.mts 1440x900:d 0.28,0.31 390x844:m 0.05
// overrides the default sweep with custom viewports/stops for spot checks.
const args = process.argv.slice(2);
const custom = args.length
  ? args.reduce<{ w: number; h: number; label: string; stops: number[] }[]>((jobs, arg, i) => {
      const [size, label] = arg.split(":");
      const [w, h] = size.split("x").map(Number);
      const stops = (args[i + 1] ?? "").split(",").map(Number).filter((n) => !Number.isNaN(n));
      if (w && h && stops.length) jobs.push({ w, h, label: label ?? `s${i}`, stops });
      return jobs;
    }, [])
  : [
      { w: 1440, h: 900, label: "desktop", stops: [0, 0.04, 0.08, 0.11, 0.14, 0.17, 0.2, 0.23, 0.26, 0.3, 0.34, 0.38, 0.42, 0.46, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.86, 0.92, 0.97] },
      { w: 390, h: 844, label: "mobile", stops: [0, 0.08, 0.16, 0.24, 0.32, 0.42, 0.52, 0.62, 0.72, 0.82, 0.97] },
    ];

for (const job of custom) await shoot(job.w, job.h, job.label, job.stops);
