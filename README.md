# Hard 75 tracker

Hard 75 tracker for Dylan and Neil. It runs on Cloudflare Workers, with D1 for data and KV for photos (or R2 if it's enabled). You can install it on a phone from the browser.

Live: https://hard75.nihal-mitta.workers.dev

## Layout
- `src/index.js`: API routes (auth, days, workouts, water, food, photos, connections)
- `src/rules.js`: challenge rules (2 × 45 min, one outdoor, 1 gallon, 10 pages, diet, photo) and per-person config
- `src/providers.js`: Strava / Garmin / Hevy integrations
- `public/`: the app (plain HTML/CSS/JS, no build step), manifest and service worker
- `migrations/`: D1 schema

## Develop
```bash
npm install
npm run db:migrate:local
npm run dev            # http://localhost:8787  (local passwords live in .dev.vars)
```

## Deploy
```bash
npx wrangler deploy
npm run db:migrate:remote   # after adding a new migration
```

## Secrets
```bash
npx wrangler secret put DYLAN_PASSWORD
npx wrangler secret put NEIL_PASSWORD
# SESSION_SECRET is already set; changing it logs everyone out
```

### Strava
1. Create an app at https://www.strava.com/settings/api
2. Set **Authorization Callback Domain** to `hard75.nihal-mitta.workers.dev`
3. `npx wrangler secret put STRAVA_CLIENT_ID` and `npx wrangler secret put STRAVA_CLIENT_SECRET`

Only one person needs to create the Strava app; both people connect through it. New Strava apps start at an athlete capacity of 1 (owner only), so raise it on the API settings page (self-serve upgrade to up to 10 athletes) before the second person connects.

### Hevy
You don't need to set anything on the server. Each person pastes their own API key under Settings → Connected apps. The key comes from the Hevy app → Settings → Developer, which needs Hevy Pro.

### Garmin
Garmin's API requires joining the [Garmin Connect Developer Program](https://developer.garmin.com/gc-developer-program/) and getting approved.
1. Once approved, set `GARMIN_CLIENT_ID` and `GARMIN_CLIENT_SECRET` as secrets
2. Set the OAuth redirect to `https://hard75.nihal-mitta.workers.dev/api/oauth/garmin/callback`
3. In the portal, point the **Activity summary** push/ping endpoint (and deregistration) to `https://hard75.nihal-mitta.workers.dev/api/garmin/push`

Garmin integration has **not** been tested against a live account yet, because that needs approved developer credentials.

Without Garmin approval, the easier route is to link Garmin Connect to Strava. Watch workouts then show up through the Strava import.

## Rules as implemented
- Each workout block needs **≥ 45 min total**. A block can hold several workouts, and their full recorded time is added up. Time over 45 min shows as "extra".
- There is no minimum time between the two workout blocks.
- At least one block with a logged workout must be marked **Outdoor**.
- Water: 1 US gallon (3,785 mL).
- Reading: a book title and ≥ 10 pages.
- Diet: "stuck to diet" = Yes. Dylan must also answer "No" to sugar. Neil's calorie counter is for tracking only and doesn't affect completion.
- Progress photo: at least 1 per day.
