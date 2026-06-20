# Agent Marketplace — OBSERVABILITY

Baseline: contextos/OBSERVABILITY.md. Installed items observed via Agent Monitoring (#4).

- **Marketplace metrics:** listings (total/approved/pending), searches, install conversion, ratings distribution, review queue time, takedowns.
- **Economy metrics:** GMV, take-rate revenue, creator payouts, paying consumers, revenue per listing, churn.
- **Two-sided health:** supply growth (new listings/creators) vs. demand growth (installs/consumers) — the flywheel balance.
- **Installed-item runtime:** observed via #4 (usage, errors, cost) — surfaced to creators (analytics) + consumers.
- **Logs/traces:** OTel on marketplace services; install/payout audit.
- **Dashboards:** flywheel (supply vs. demand), economy (GMV/payouts), review pipeline, quality (ratings/failures), search performance.
- **Alerts:** review backlog, install failures, payout errors, fraud signals, supply/demand imbalance, malicious-listing reports.
- **SLO:** search p95 < 1s; install success high + reversible; payouts accurate/auditable.
- Marketplace health = network-effect health; instrument the flywheel, not just uptime.
