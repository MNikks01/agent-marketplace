# Database schema — Agent Marketplace

**MVP:** in-memory stores (per-process), so the dev/test path needs no database.

**Production (planned, DECISION_LOG D-004):** PostgreSQL + **pgvector**, tenant-scoped with row-level security (`org_id`).
- Listings, reviews, installs, usage, payouts (Stripe Connect).
See the root `DATABASE.md` for the full schema.
