# Agent Marketplace — DEVOPS

Baseline: contextos/DEVOPS.md. Mostly catalog + economy + integration glue.

- **Environments:** Local (Compose) · Preview · Staging · Prod (managed PaaS; K8s only if needed — D-009).
- **CI/CD:** lint → typecheck → unit → e2e → deploy; canary. Review-pipeline + payout flows heavily tested (money + trust).
- **Integrations:** depends on #1 (install), #3 (lint/supply), #4 (observability), Stripe Connect (payouts) — handle each dependency's outage gracefully.
- **Review pipeline ops:** automated lint runs in CI-like jobs; manual review queue tooling; SLA on review turnaround.
- **Payments ops:** Stripe Connect webhooks; reconciliation; payout schedules; fraud monitoring; idempotent transactions.
- **Data ops:** Postgres + pgvector (listings/search); backups + PITR; audit logs immutable (payouts/takedowns).
- **Deployments:** canary + flags; takedown must be instant (kill-switch path).
- **Runbooks:** malicious-listing takedown · payout reconciliation/dispute · #1/#3/#4 outage degradation · review backlog · Stripe Connect issue · fraud incident.
