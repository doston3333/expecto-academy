// Copy bookings from the journal into the database when the database missed them
// (it was down, corrupted, or restored from an older backup). Safe to run any number of times.
//   node server/replay.mjs            show what is missing
//   node server/replay.mjs --apply    insert it
import { DatabaseSync } from "node:sqlite";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const DB_PATH = process.env.DB_PATH ?? "./data/bookings.db";
const JOURNAL_PATH = process.env.JOURNAL_PATH ?? join(dirname(DB_PATH), "bookings.jsonl");
const apply = process.argv.includes("--apply");

if (!existsSync(JOURNAL_PATH)) {
  console.log(`no journal at ${JOURNAL_PATH}`);
  process.exit(0);
}

const entries = readFileSync(JOURNAL_PATH, "utf8")
  .split("\n")
  .filter(Boolean)
  .flatMap((line, i) => {
    try {
      return [JSON.parse(line)];
    } catch {
      console.warn(`skipping unreadable journal line ${i + 1}`);
      return [];
    }
  });

const db = new DatabaseSync(DB_PATH, { readOnly: !apply });
const exists = db.prepare("SELECT 1 FROM bookings WHERE created_at = ? AND phone = ?");
const insert = apply
  ? db.prepare(`
      INSERT INTO bookings (created_at, name, school, grade, english_level, contact_preference, telegram, phone, source, page)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
  : null;

const missing = entries.filter((e) => !exists.get(e.created_at, e.phone));
for (const e of missing) {
  console.log(`${apply ? "restored" : "missing "}  ${e.created_at}  ${e.name}  ${e.phone}`);
  insert?.run(e.created_at, e.name, e.school, e.grade, e.level, e.pref, e.telegram ?? "", e.phone, e.source, e.page ?? "");
}
console.log(`${entries.length} in journal, ${missing.length} ${apply ? "restored" : "missing from the database"}`);
