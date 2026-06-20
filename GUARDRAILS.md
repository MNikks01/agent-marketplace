# Agent Marketplace — GUARDRAILS

Framework: contextos/GUARDRAILS.md. Curation + trust are the guardrails.

- **Mandatory security review:** automated (reuse #3 lint) + manual; only approved listings publish/install. The core guardrail (curated, not a dumping ground).
- **Permission disclosure + consumer approval:** every listing declares tools/permissions; consumer approves least-privilege scopes on install.
- **Sandboxed execution:** installed items run isolated in #1's runtime; HITL on destructive tools; observability via #4.
- **Injection-aware listings:** MCP servers/agents must treat tool outputs as untrusted (verified in review).
- **Anti-fraud/anti-gaming:** Stripe Connect KYC; payout fraud detection; quality-based (not pay-to-win) ranking; review-manipulation detection.
- **Takedown + kill-switch:** rapid removal of malicious listings; disable affected installs.
- **Content/IP moderation:** ToS, creator agreement, DMCA/abuse process.
- **Tenant isolation:** `org_id`+RLS; private marketplaces scoped.
- **Update safety:** new versions re-reviewed; updates opt-in (no silent breaking/compromise).
- Fail safe: unreviewed → not installable; suspicious → quarantine; reported → investigate + takedown.
