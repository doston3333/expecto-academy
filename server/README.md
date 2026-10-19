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

## Deploy (the old VPS, behind Dokploy's Traefik)

It runs as a systemd service on `172.17.0.1:8790` (the docker bridge, so it is not public) and Traefik terminates HTTPS, the same way the other host services on that box are wired.

1. No new DNS: it rides on `desk.expecto-academy.uz`, which already points at the VPS.
2. On the VPS (Node 22.13+ is at `/opt/node-v22`):

       useradd -r -s /usr/sbin/nologin expecto
       mkdir -p /opt/expecto-api/server /var/lib/expecto-api && chown expecto /var/lib/expecto-api
       # copy server/*.mjs to /opt/expecto-api/server/
       printf 'HOST=172.17.0.1\nPORT=8790\nDB_PATH=/var/lib/expecto-api/bookings.db\n' > /etc/expecto-api.env
       cp server/expecto-api.service /etc/systemd/system/ && systemctl enable --now expecto-api

3. Copy `server/traefik-expecto-api.yml` to `/etc/dokploy/traefik/dynamic/expecto-api.yml` (Traefik reloads it by itself). It sends only `/api/bookings` on the desk host to this service.
4. Check: `curl -X POST https://desk.expecto-academy.uz/api/bookings -H 'Content-Type: application/json' -d '{}'` answers `{"error":"invalid","field":"name"}`.
5. GitHub repo variable `VITE_LEAD_ENDPOINT` = `https://desk.expecto-academy.uz/api/bookings`, then re-run the Pages deploy.

Keep nginx disabled on this box: it grabs port 80 at boot, Traefik then fails to start, and the nightly `docker system prune -af` deletes the stopped container (that took every site down on 18 Oct 2026).

## Not losing a booking

Every booking is kept in up to three places, and any one is enough to recover it:

1. **Journal**: `bookings.jsonl` next to the database. It's written and fsynced before the database insert.
2. **SQLite**: `bookings.db`. If it can't be opened or written, the API keeps answering from the journal.
3. **Telegram**: each booking is sent to the chat, with a ⚠️ line if the database or the journal failed. If both disk copies fail, the API still answers success once Telegram has the booking.

The landing page retries a failed send twice (after 1 s and 3 s) before it shows an error.

**Nightly backup** (`expecto-backup.timer`, 03:30 server time): makes a consistent copy of the database and the journal in `/var/lib/expecto-api/backups`, keeps 30 days, and sends both files to the Telegram chat, so a copy also lives off the server.

    cp server/expecto-backup.{service,timer} /etc/systemd/system/ && systemctl daemon-reload && systemctl enable --now expecto-backup.timer

**Recover** after a database problem: copy the latest `backups/bookings-*.db` back to `bookings.db` (or let the API create a fresh one). Then add back anything newer from the journal:

    DB_PATH=/var/lib/expecto-api/bookings.db /opt/node-v22/bin/node /opt/expecto-api/server/replay.mjs          # dry run
    DB_PATH=/var/lib/expecto-api/bookings.db /opt/node-v22/bin/node /opt/expecto-api/server/replay.mjs --apply

View leads on the VPS: `DB_PATH=/var/lib/expecto-api/bookings.db /opt/node-v22/bin/node /opt/expecto-api/server/leads.mjs`.
