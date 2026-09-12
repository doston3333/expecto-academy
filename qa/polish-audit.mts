import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.QA_BASE ?? "http://127.0.0.1:5173/?qa=1";
const OUT = "qa/polish/";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME });

async function audit(width: number, height: number, label: string) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 240)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 240));
  });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${OUT}${label}-hero.png` });

  const data = await page.evaluate(`(() => {
    const r = (el) => {
      const b = el.getBoundingClientRect();
      return { tag: el.tagName, text: (el.textContent||"").trim().slice(0,40), w: Math.round(b.width), h: Math.round(b.height), x: Math.round(b.x), y: Math.round(b.y) };
    };
    const small = [...document.querySelectorAll("a,button,input,[role=button]")].filter((e) => {
      const b = e.getBoundingClientRect();
      return b.width > 0 && b.height > 0 && (b.width < 44 || b.height < 44);
    }).map(r).slice(0, 25);

    const tinyType = [...document.querySelectorAll("p,span,a,button,h1,h2,h3,li")].filter((e) => {
      const s = parseFloat(getComputedStyle(e).fontSize);
      const b = e.getBoundingClientRect();
      return b.width > 0 && s > 0 && s < 12 && (e.textContent||"").trim().length > 2;
    }).slice(0, 15).map((e) => ({ text: (e.textContent||"").trim().slice(0,36), size: getComputedStyle(e).fontSize }));

    const fonts = [...new Set([...document.querySelectorAll("*")].slice(0,400).map((e) => getComputedStyle(e).fontFamily.split(",")[0].replace(/"/g,"")))];

    const headings = [...document.querySelectorAll("h1,h2,h3")].slice(0,20).map((h) => ({
      tag: h.tagName, text: h.textContent.trim().slice(0,50), size: getComputedStyle(h).fontSize, weight: getComputedStyle(h).fontWeight
    }));

    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    const nav = document.querySelector("header");
    const navH = nav ? Math.round(nav.getBoundingClientRect().height) : 0;
    const h1 = document.querySelector("h1");
    const h1top = h1 ? Math.round(h1.getBoundingClientRect().top) : 0;

    const pointerless = [...document.querySelectorAll("a,button")].filter((e) => {
      const c = getComputedStyle(e).cursor;
      return c !== "pointer" && e.getBoundingClientRect().width > 0;
    }).map((e) => (e.textContent||e.getAttribute("aria-label")||e.tagName).trim().slice(0,40)).slice(0,15);

    return { small, tinyType, fonts, headings, overflow, navH, h1top, pointerless, scrollH: document.body.scrollHeight };
  })()`);

  console.log("\\n====", label, width + "x" + height, "====");
  console.log(JSON.stringify(data, null, 1));
  if (errors.length) console.log("ERRORS", errors);

  const total = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
  for (const [name, stop] of [["film", 0.12], ["method", 0.32], ["oath", 0.48], ["archive", 0.62], ["tuition", 0.82], ["closer", 0.97]]) {
    await page.evaluate(`window.scrollTo({top: ${Math.round(total * stop)}, behavior: "instant"})`);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}${label}-${name}.png` });
  }
  await page.close();
}

await audit(1440, 900, "d");
await audit(768, 1024, "t");
await audit(390, 844, "m");
await browser.close();
