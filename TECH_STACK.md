# Agent Marketplace — TECH STACK

Portfolio stack (D-003–D-009); emphases:

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js + TS + Tailwind + shadcn | Marketplace browse/search/listing/creator dashboards |
| Backend | NestJS (TS) | Catalog/review/install/metering services |
| DB | PostgreSQL + **pgvector** | Listings + semantic search (D-004) |
| Search | pgvector + Postgres FTS | Semantic + keyword discovery |
| **Payments** | **Stripe Connect** | Two-sided: charge consumers, pay out creators (revenue share) |
| Security review | Reuse #3 security lint + manual queue | Trust pipeline |
| Install | ContextOS (#1) install API/MCP | One-click into real workflows |
| Observability | Agent Monitoring (#4) | Runtime monitoring of installed items |
| AI | Claude via abstraction | Semantic search, listing summaries, review assist (D-003) |
| Cloud/CI | Managed PaaS; Docker; GitHub Actions | D-009 |
| Monorepo | Turborepo + pnpm | Reuse #1/#3/#4 packages (D-006) |

## Notable
- **Stripe Connect** for marketplace payouts (the economy).
- **Reuses #1 (install), #3 (supply + security lint), #4 (observability)** — minimal new infra; it's an assembly/ecosystem layer.
- pgvector for semantic listing discovery.

## Why
A marketplace is mostly catalog + trust + payments + integration glue on the existing platform — well within reach once #1/#3/#4 exist. The hard part is *go-to-market* (network effects), not tech.
