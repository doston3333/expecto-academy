// Nightly backup: a consistent copy of the database plus the journal, kept on disk for 30 days
// and sent to the Telegram chat, so a copy lives off this server too. Run by expecto-backup.timer.
import { DatabaseSync } from "node:sqlite";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const DB_PATH = process.env.DB_PATH ?? "./data/bookings.db";
const JOURNAL_PATH = process.env.JOURNAL_PATH ?? join(dirname(DB_PATH), "bookings.jsonl");
const BACKUP_DIR = process.env.BACKUP_DIR ?? join(dirname(DB_PATH), "backups");
const KEEP_DAYS = 30;
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = process.env.TELEGRAM_CHAT_ID;

const stamp = new Date().toISOString().slice(0, 10);
mkdirSync(BACKUP_DIR, { recursive: true });

const files = [];
const dbCopy = join(BACKUP_DIR, `bookings-${stamp}.db`);
rmSync(dbCopy, { force: true });
const db = new DatabaseSync(DB_PATH, { readOnly: true });
db.exec(`VACUUM INTO '${dbCopy.replaceAll("'", "''")}'`);
const count = db.prepare("SELECT COUNT(*) AS n FROM bookings").get().n;
db.close();
files.push(dbCopy);

if (existsSync(JOURNAL_PATH)) {
  const journalCopy = join(BACKUP_DIR, `bookings-${stamp}.jsonl`);
  copyFileSync(JOURNAL_PATH, journalCopy);
  files.push(journalCopy);
}

const cutoff = Date.now() - KEEP_DAYS * 86_400_000;
for (const name of readdirSync(BACKUP_DIR)) {
  const day = /^bookings-(\d{4}-\d{2}-\d{2})\./.exec(name)?.[1];
  if (day && Date.parse(day) < cutoff) rmSync(join(BACKUP_DIR, name));
}

console.log(`backed up ${count} bookings to ${BACKUP_DIR}`);

if (TG_TOKEN && TG_CHAT) {
  for (const file of files) {
    const form = new FormData();
    form.set("chat_id", TG_CHAT);
    form.set("disable_notification", "true");
    if (file === dbCopy) form.set("caption", `Nightly backup · ${count} bookings`);
    form.set("document", new Blob([readFileSync(file)]), basename(file));
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendDocument`, { method: "POST", body: form });
    if (!res.ok) {
      console.error(`telegram upload failed for ${basename(file)}: ${res.status}`);
      process.exitCode = 1;
    }
  }
}
