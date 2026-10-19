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

View leads on the VPS: `DB_PATH=/var/lib/expecto-api/bookings.db /opt/node-v22/bin/node /opt/expecto-api/server/leads.mjs`.
Back up `bookings.db` (e.g. nightly `sqlite3 /var/lib/expecto-api/bookings.db ".backup /root/backups/bookings.db"`).
