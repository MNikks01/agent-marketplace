# Agent Marketplace — SECURITY

Trust is existential — we distribute third-party code that runs in customers' workflows. Baseline: contextos/SECURITY.md.

- **Listing security review:** every listing/version reviewed before approval — automated (reuse #3 security lint: auth, no embedded secrets, injection-aware, safe DB, sandboxable) + manual for higher-risk items. Only `approved` listings installable.
- **Permission disclosure:** each listing declares required tools/permissions/scopes; consumer explicitly approves on install (least privilege).
- **Sandboxed execution:** installed items run sandboxed in #1's runtime (no ambient FS/network/secrets); HITL on destructive tools.
- **Takedowns:** rapid removal of malicious/compromised listings; affected installs flagged.
- **Payout fraud/abuse:** Stripe Connect KYC; fraud detection on usage/payouts; gaming-resistant ranking.
- **RBAC + audit:** creator/consumer/admin roles; immutable audit of reviews, installs, payouts, takedowns.
- **Secrets:** creator/consumer credentials in vault; never in listings.
- **Tenant isolation:** `org_id`+RLS; private marketplaces scoped (V2).
- **Data (D-010):** no training on customer data; listing artifacts scanned for secrets.
- **Compliance:** marketplace ToS, creator agreement, DMCA/abuse process; SOC 2 (via platform); license compliance (V3).
- **Threats:** (1) malicious listing → review + sandbox + permission disclosure + takedown; (2) supply-chain (compromised update) → version review + opt-in updates; (3) payout fraud → KYC + detection; (4) ranking manipulation → quality-based ranking + anti-gaming.

**Trust assets:** security-reviewed badge, permission transparency, sandboxing, ratings, observability (#4). Curation (not a dumping ground) is the differentiator vs. GPT-Store-style stores.
