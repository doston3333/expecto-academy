# Expecto Academy

Landing page for Expecto Academy — Digital SAT prep for students in Uzbekistan who need a scholarship-ready score.

Cream paper and forest green. Product-demo layout inspired by SpaceFS. Original four houses (Aurelion, Veridian, Noctis, Amberfell). English copy.

## Stack

- Vite 8, React 19, TypeScript
- Tailwind CSS v4
- Motion + Lenis

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle
npm run preview  # serve the build
```

## Notes

- Primary CTA ("Book a session") opens a booking dialog on the landing page (`src/site/Booking.tsx`). It collects name, school, grade, English level, phone, Telegram username and whether to call or write on Telegram, then POSTs JSON to `VITE_LEAD_ENDPOINT`.
- Set `VITE_LEAD_ENDPOINT` (see `.env.example`) to any endpoint that accepts a JSON POST — Formspree, a Google Apps Script, your own server. On GitHub Pages add it as a repository **variable** with the same name. Without it, production shows a "message us on Telegram" fallback instead of silently dropping the lead; `npm run dev` simulates a successful submit.
- Telegram (`@Expecto_Academy`) remains a secondary contact in the footer and in the dialog's fallback.
- `prefers-reduced-motion` pauses Lenis, magnetic buttons, and the pinned SAT window.
