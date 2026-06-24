# Agent Marketplace — engine (Phase A) ✅

## Install & CLI

search, install, and publish marketplace listings (security-reviewed). Requires Node ≥18.

```bash
npm i -g @mnikks01/agentmarket    # then run `agentmarket …`, or use npx without installing:
npx @mnikks01/agentmarket list
npx @mnikks01/agentmarket search "payments stripe"
npx @mnikks01/agentmarket install stripe-mcp     # prints the mcp.json fragment
npx @mnikks01/agentmarket publish listing.json
```


The core engine for project #7, the ecosystem layer. Creators **publish** listings (agents /
MCP servers / workflows) that pass an automated **security review**; consumers **discover**,
**install** (one-click), and **rate** them; **usage metering** drives **creator revenue share**.
Pure TypeScript, **Node 24 native TS, zero-network**.

## Status: Phase A built + tested (2026-06-21)
- ✅ **Listings** — agents / mcp-servers / workflows with pricing (free / flat / usage), tags, versions.
- ✅ **Security review** — flags untrusted launch commands + risky permissions; flagged listings are hidden from discovery and blocked from install (the trust layer).
- ✅ **Discovery** — weighted lexical search (name > tags > summary) + popularity/quality boost; approved-only by default.
- ✅ **Install** — returns a ready-to-merge `mcp.json` fragment for mcp-servers; increments install count.
- ✅ **Ratings** — running average + count.
- ✅ **Revenue share** — usage metering → creator payout (default 80%) + marketplace fee.
- ✅ **15/15 tests pass** (`scripts/test.ts`).

## Run it
```bash
node scripts/demo.ts   # publish (one gets flagged), search, install, rate, payout
node scripts/test.ts   # 15 assertions
```

## API
```ts
import { Marketplace } from "./src/index.ts";
const mkt = new Marketplace();
mkt.publish({ name, type, summary, author, tags, pricing, install });  // security-reviewed
mkt.search("payments");                 // ScoredListing[] (approved only)
mkt.install("stripe-mcp");              // InstallArtifact (mcp.json fragment); throws if flagged
mkt.rate("stripe-mcp", 5);
mkt.recordUsage("stripe-mcp", 120);
mkt.earnings("alice");                  // { gross, payout, fee }
```

## Structure
```
src/
  types.ts      # Listing, Pricing, InstallArtifact, ...
  security.ts   # reviewListing() — the trust gate
  search.ts     # weighted lexical discovery
  catalog.ts    # publish / list / search / get / rate / install / metering
  payouts.ts    # revenue share
  index.ts      # Marketplace facade
scripts/
  demo.ts / test.ts
```

## Next
- **MCP server** (`search_marketplace` / `get_listing` / `install_listing`) and **web** (browse, search, listing detail, publish, install).
- Production: Postgres + RLS, real payments/payouts (Stripe Connect), deeper security review (static analysis + sandbox), versioning.

> Per the docs this is built **last** — a marketplace needs distribution (#1) + supply (#3) + trust (#4) first, or it's a ghost town. The engine here is the catalog/review/payout core that layer sits on.
