# Agent Marketplace — web app

The storefront for [`../engine`](../engine): **browse + search** listings, **install** (one-click → `mcp.json` fragment), and **publish** (runs the automated security review). Next.js 16 + Tailwind. No keys needed.

## Status: built + API-verified (2026-06-21)
- ✅ `next build` compiles + typechecks (engine synced into `lib/engine/`).
- ✅ `GET /api/listings` (browse + `?q=` search + `?type=`), `POST /api/install`, `POST /api/publish`.
- ✅ End-to-end via `scripts/smoke-api.mjs`: 4 seeded listings, search ranks Stripe MCP first, install → mcp.json fragment, publishing a risky listing → flagged + hidden, install of flagged → 409 blocked.
- 🔲 Visual UI renders + wired — **verify locally** (`npm run dev`); not click-tested headlessly.

## Run it
```bash
npm install
npm run dev          # http://localhost:3000 — browse, search, install, publish
# headless API proof:
npm run build
PORT=3990 npx next start &
BASE=http://localhost:3990 node scripts/smoke-api.mjs
```

## Structure
```
app/
  page.tsx              # search · listing cards · install (mcp.json) · publish form
  api/listings          # browse + search (?q=, ?type=)
  api/install           # slug -> mcp.json fragment (409 if flagged)
  api/publish           # publish a listing (runs security review)
lib/
  engine/               # GENERATED from ../engine/src (sync-to-web.mjs)
  marketplace-store.ts  # process-global Marketplace + seed catalog
scripts/smoke-api.mjs   # end-to-end API proof
```

## To go live (production swaps)
- Postgres + RLS for the catalog; **Stripe Connect** for creator payouts; real usage metering.
- Deeper security review (static analysis + sandbox + signatures); versioning; one-click install into ContextOS (#1).
- `lib/engine/` is generated — edit `../engine/src` and run `node ../engine/scripts/sync-to-web.mjs`.
