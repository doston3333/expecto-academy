# Booking API

Receives the landing page's booking form and stores it in SQLite. No dependencies; needs **Node 22.13+**.

## Run locally

    node server/index.mjs                 # http://127.0.0.1:8787, data in ./data/bookings.db
    node server/leads.mjs                 # table of bookings
    node server/leads.mjs --csv > leads.csv

## Environment

| Variable | Default | |
|---|---|---|
| `PORT` / `HOST` | `8787` / `127.0.0.1` | keep HOST on loopback behind the proxy |
| `DB_PATH` | `./data/bookings.db` | |
| `ALLOWED_ORIGINS` | `https://expecto-academy.uz,https://www.expecto-academy.uz` | comma-separated CORS list |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | unset | optional — pings a chat the moment a booking arrives |

## Deploy on the VM

1. Point an `api.expecto-academy.uz` **A record** at the VM's IP.
2. Install Node 22.13+ and Caddy. Open ports 80 and 443.
3. `sudo useradd -r -s /usr/sbin/nologin expecto`, then clone the repo to `/opt/expecto-academy`, `mkdir data`, `chown -R expecto /opt/expecto-academy/data`.
4. Create `/etc/expecto-api.env` (mode 600) with any variables above.
5. `sudo cp server/expecto-api.service /etc/systemd/system/ && sudo systemctl enable --now expecto-api`
6. Add `server/Caddyfile` to `/etc/caddy/Caddyfile` and `sudo systemctl reload caddy`.
7. Check: `curl https://api.expecto-academy.uz/api/health`
8. Tell the site where it is — GitHub repo variable `VITE_LEAD_ENDPOINT` = `https://api.expecto-academy.uz/api/bookings`, then re-run the Pages deploy.

Back up `data/bookings.db` (e.g. nightly `sqlite3 data/bookings.db ".backup /backups/bookings.db"`).
