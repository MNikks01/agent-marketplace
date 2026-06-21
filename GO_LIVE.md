# Go-live checklist — Agent Marketplace

> **Nothing here is needed for the dev/test path** — `npm test`, the demos, and the smoke tests all run **offline with no keys**. This is only for shipping to production.

## 1. Environment variables
| Variable | When | Unlocks |
|----------|------|---------|
| `DATABASE_URL` | production | persist listings/installs/usage (Postgres + RLS) vs in-memory |
| `STRIPE_* (Connect)` | production | creator payouts via Stripe Connect |

Set these in the host's settings (Vercel project env), never in committed files. `.env` is gitignored.

## 2. Deploy
- **Web app** → Vercel: `cd web && vercel --prod` (or connect the repo in the Vercel dashboard, root = `web/`). Add the env vars above.
- **MCP server** → runs on Node ≥ 24 anywhere; add to Claude Desktop / Cursor via `mcp-server/mcp.json` (no env needed (search_marketplace / install_listing / publish_listing; seeds a catalog)).
- Provision Postgres + pgvector when enabling the production data layer.

## 3. Production swaps (flip dev → prod behind existing interfaces)
- in-memory catalog → Postgres + RLS
- revenue-share accounting → Stripe Connect payouts
- automated review → + deeper static analysis / sandbox

## 4. Verify after deploy
- `curl https://<your-deploy>/api/health` → `{"status":"ok"}`
- Run the smoke against the live URL: `BASE=https://<your-deploy> node web/scripts/smoke-api.mjs`
- Re-run `npm test` on the deploy commit (CI does this automatically).

## 5. Enforce CI on GitHub (branch protection)
> Adopt a **feature-branch → PR** flow first. Branch protection requires checks to pass *before merge*, which conflicts with pushing straight to `main`. Run this **after CI has run once** on `main` (so the checks exist). Solo-friendly: requires green CI, no second reviewer, owner not locked out.

```bash
gh api -X PUT repos/MNikks01/agent-marketplace/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["typecheck + unit + integration","mcp server contract smoke","web build","e2e (playwright)"] },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```
(Add the `CodeQL` check too once it appears in the branch-protection check list.)
