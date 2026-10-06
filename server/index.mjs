// Expecto Academy booking API. No dependencies — needs Node 22.13+ (built-in node:sqlite).
//   POST /api/bookings   store a booking request
//   GET  /api/health     liveness check
import { DatabaseSync } from "node:sqlite";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const PORT = Number(process.env.PORT ?? 8787);
const HOST = process.env.HOST ?? "127.0.0.1";
const DB_PATH = process.env.DB_PATH ?? "./data/bookings.db";
const ORIGINS = (process.env.ALLOWED_ORIGINS ?? "https://expecto-academy.uz,https://www.expecto-academy.uz")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = process.env.TELEGRAM_CHAT_ID;
const RATE_LIMIT = 8; // bookings per IP per hour
const MAX_BODY = 8 * 1024;

mkdirSync(dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at         TEXT NOT NULL,
    name               TEXT NOT NULL,
    school             TEXT NOT NULL,
    grade              TEXT NOT NULL,
    english_level      TEXT NOT NULL,
    contact_preference TEXT NOT NULL,
    telegram           TEXT NOT NULL,
    phone              TEXT NOT NULL,
    source             TEXT NOT NULL,
    page               TEXT NOT NULL,
    status             TEXT NOT NULL DEFAULT 'new'
  )
`);
const insert = db.prepare(`
  INSERT INTO bookings (created_at, name, school, grade, english_level, contact_preference, telegram, phone, source, page)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const GRADES = ["9", "10", "11", "12", "Graduated"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Not sure"];

/** Returns a clean record, or an error string. Mirrors the checks in src/lib/booking.ts. */
function validate(body) {
  const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const name = str(body.name, 100);
  const school = str(body.school, 150);
  const grade = str(body.grade, 20);
  const level = str(body.englishLevel, 30);
  const pref = str(body.contactPreference, 10);
  const telegram = str(body.telegram, 40);
  const phone = str(body.phone, 30);
  const source = str(body.source, 40).replace(/[^\w:-]/g, "") || "unknown";
  const page = str(body.page, 300);

  if (name.length < 2) return "name";
  if (school.length < 2) return "school";
  if (!GRADES.includes(grade)) return "grade";
  if (!LEVELS.includes(level)) return "englishLevel";
  if (pref !== "call" && pref !== "telegram") return "contactPreference";
  const digits = phone.replace(/\D/g, "");
  if (!/^998\d{9}$/.test(digits)) return "phone";
  const handleOk = /^@[A-Za-z][A-Za-z0-9_]{4,31}$/.test(telegram);
  if (telegram ? !handleOk : pref === "telegram") return "telegram";

  return { name, school, grade, level, pref, telegram, phone: `+${digits}`, source, page };
}

const hits = new Map(); // ip -> timestamps
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of hits) if (times.every((t) => now - t >= 3_600_000)) hits.delete(ip);
}, 600_000).unref();

async function notify(b) {
  if (!TG_TOKEN || !TG_CHAT) return;
  const how = b.pref === "call" ? "📞 CALL" : "💬 TELEGRAM";
  const text = [
    `New booking — ${how}`,
    `${b.name} · grade ${b.grade} · ${b.school}`,
    `English: ${b.level}`,
    `Phone: ${b.phone}`,
    b.telegram ? `Telegram: ${b.telegram}` : null,
    `From: ${b.source}`,
  ]
    .filter(Boolean)
    .join("\n");
  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT, text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("telegram notify failed:", res.status);
  } catch (err) {
    console.error("telegram notify failed:", err.message);
  }
}

function send(res, status, data, cors) {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store", ...cors });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let tooLarge = false;
    const chunks = [];
    req.on("data", (c) => {
      if (tooLarge) return;
      size += c.length;
      if (size > MAX_BODY) {
        tooLarge = true;
        chunks.length = 0;
      } else chunks.push(c);
    });
    req.on("end", () =>
      tooLarge ? reject(Object.assign(new Error("too large"), { status: 413 })) : resolve(Buffer.concat(chunks).toString("utf8")),
    );
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  const origin = req.headers.origin;
  const cors = ORIGINS.includes(origin ?? "")
    ? { "Access-Control-Allow-Origin": origin, Vary: "Origin", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" }
    : {};
  const { pathname } = new URL(req.url ?? "/", "http://x");

  if (pathname === "/api/health") return send(res, 200, { ok: true }, cors);
  if (pathname !== "/api/bookings") return send(res, 404, { error: "not found" }, cors);
  if (req.method === "OPTIONS") {
    res.writeHead(204, cors);
    return res.end();
  }
  if (req.method !== "POST") return send(res, 405, { error: "method not allowed" }, cors);
  if (origin && !cors["Access-Control-Allow-Origin"]) return send(res, 403, { error: "origin not allowed" }, cors);

  // Behind one trusted proxy (Traefik/Caddy) the proxy appends the real client address to X-Forwarded-For.
  // Read the LAST entry: anything before it was supplied by the client and can be forged.
  const ip = (req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "").toString().split(",").at(-1).trim();
  if (limited(ip)) return send(res, 429, { error: "too many requests" }, cors);

  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch (err) {
    return send(res, err.status ?? 400, { error: err.status === 413 ? "too large" : "invalid json" }, cors);
  }
  if (!body || typeof body !== "object") return send(res, 400, { error: "invalid json" }, cors);

  const b = validate(body);
  if (typeof b === "string") return send(res, 422, { error: "invalid", field: b }, cors);

  try {
    const { lastInsertRowid } = insert.run(new Date().toISOString(), b.name, b.school, b.grade, b.level, b.pref, b.telegram, b.phone, b.source, b.page);
    void notify(b);
    send(res, 201, { ok: true, id: Number(lastInsertRowid) }, cors);
  } catch (err) {
    console.error("insert failed:", err);
    send(res, 500, { error: "server error" }, cors);
  }
});

server.listen(PORT, HOST, () => console.log(`booking api on http://${HOST}:${PORT} → ${DB_PATH}`));
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => server.close(() => (db.close(), process.exit(0))));
}
