// List bookings:  node server/leads.mjs [--csv] [--new]
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(process.env.DB_PATH ?? "./data/bookings.db", { readOnly: true });
const onlyNew = process.argv.includes("--new");
const rows = db.prepare(`SELECT * FROM bookings ${onlyNew ? "WHERE status = 'new'" : ""} ORDER BY id DESC`).all();

if (process.argv.includes("--csv")) {
  const cols = rows[0] ? Object.keys(rows[0]) : [];
  const cell = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  console.log(cols.join(","));
  for (const r of rows) console.log(cols.map((c) => cell(r[c])).join(","));
} else {
  console.table(rows.map(({ page, ...r }) => r));
}
