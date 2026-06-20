# CLAUDE.md — Agent Marketplace

Spec-first (D-011). Curated, monetized marketplace for agents/MCP servers/workflows. Project #7; **build LAST (Year 3)** on top of #1/#3/#4.

## Golden rules
1. Respect DECISION_LOG.md (D-004 Postgres+pgvector; D-005 TS; D-006 monorepo; D-007 open-core; D-010 no training on customer data).
2. **Trust is existential:** only security-reviewed (reuse #3 lint) listings are installable; permission disclosure + consumer approval; sandboxed runtime (#1); takedown path.
3. **Reuse the platform:** install → #1; supply/lint → #3; observability → #4; payouts → Stripe Connect. Don't rebuild these.
4. **Curate** — quality over volume (avoid GPT-Store trap).
5. **Flywheel is the metric** (supply↔demand), not features. Don't launch before both sides are seeded.
6. Tenant-scope (`org_id`+RLS); audit installs/payouts/takedowns; update spec on change.

## Context to load
[README](./README.md) → [VISION](./VISION.md) (why last) → [ARCHITECTURE](./ARCHITECTURE.md) → [DATABASE](./DATABASE.md) → [API_DESIGN](./API_DESIGN.md) → [SECURITY](./SECURITY.md)/[GUARDRAILS](./GUARDRAILS.md) → [TASKS](./TASKS.md)/[SPRINTS](./SPRINTS.md).

## Stack
Next.js+TS+Tailwind+shadcn · NestJS · Postgres+pgvector+FTS · **Stripe Connect** · reuse #1 (install) / #3 (lint) / #4 (observability) · Claude via abstraction (discovery/review-assist) · Turborepo+pnpm.

## Commands (once code exists)
`pnpm dev` · `pnpm test` · `docker compose up`.

## DoD
Typed · tested · review-gated (only approved installable) · payouts auditable · RLS-safe · spec updated.

## Don'ts
Don't allow unreviewed listings to install; don't rebuild #1/#3/#4; don't launch before seeding both sides; don't let ranking become pay-to-win.
