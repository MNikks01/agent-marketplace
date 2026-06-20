# AGENTS.md — Agent Marketplace

Standard agent-instructions file. Claude-specific: [CLAUDE.md](./CLAUDE.md). Architecture: [AGENT_DESIGN.md](./AGENT_DESIGN.md).

## Project
Curated, monetized marketplace for agents/MCP servers/workflows. Spec-first (D-011). Built LAST (Year 3) on #1/#3/#4.

## Setup
```bash
pnpm install
docker compose up -d   # Postgres+pgvector, otel
pnpm db:migrate
pnpm dev
```

## Conventions
- TS everywhere; Turborepo+pnpm. Reuse #1 (install) / #3 (security lint, supply) / #4 (observability) / `packages/{llm,db}`.
- `org_id`+RLS; listing `status` gates install (only `approved`). Stripe Connect for payouts.
- pgvector + FTS for discovery. Problem+json errors.

## Build & test
`pnpm test` · `pnpm test:e2e` · `pnpm lint && pnpm typecheck`. Heavily test review-gating + payout flows (trust + money).

## Rules of engagement
1. Only security-reviewed listings install; permission disclosure + consumer approval; sandboxed runtime.
2. Reuse platform pieces (#1/#3/#4); don't rebuild.
3. Curate; quality-based ranking (no pay-to-win).
4. Audit installs/payouts/takedowns; tenant isolation.
5. Don't launch before supply + demand are seeded.
6. Update specs on change.

## Where things live
Arch: [ARCHITECTURE.md](./ARCHITECTURE.md) · Data: [DATABASE.md](./DATABASE.md) · API: [API_DESIGN.md](./API_DESIGN.md) · Trust: [SECURITY.md](./SECURITY.md)/[GUARDRAILS.md](./GUARDRAILS.md) · Work: [TASKS.md](./TASKS.md)/[SPRINTS.md](./SPRINTS.md) · Strategy: [VISION.md](./VISION.md) (why last).

## MCP
MCP servers are a core listing type (from #3); install into #1's hub. Optionally exposes `search_marketplace`/`install_listing` via MCP. See [mcp.json](./mcp.json), [MCP.md](./MCP.md).
