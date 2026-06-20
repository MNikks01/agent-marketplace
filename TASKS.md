# Agent Marketplace — TASKS

Maps to [USER_STORIES.md](./USER_STORIES.md)/[SPRINTS.md](./SPRINTS.md). Built LAST (Year 3). DoD: typed · tested · RLS-safe · review-gated · spec updated.

## E1 — Foundation (assumes #1/#3/#4 exist)
- [ ] Monorepo reuse; auth + creator/consumer accounts/roles; RBAC/RLS

## E2 — Catalog & discovery (MVP)
- [ ] Listings model (agent/mcp_server/workflow); categories; visibility/status
- [ ] Embeddings + pgvector + FTS hybrid search; popularity/rating sort
- [ ] Listing detail (docs, permissions, pricing, review status)
- [ ] Ratings & reviews

## E3 — Publish & install (MVP)
- [ ] Creator publishing flow (seed from #3-generated servers)
- [ ] **One-click install into ContextOS (#1)** + uninstall
- [ ] Permission disclosure + consumer approval on install

## E4 — Trust & review (V1)
- [ ] Security review pipeline (reuse #3 lint + manual queue)
- [ ] Approval gating (only approved installable); takedown/kill-switch
- [ ] Verified/certified badges (V2)

## E5 — Economy (V1)
- [ ] Stripe Connect onboarding + KYC; revenue share + payouts
- [ ] Usage metering (per install/run via #4); transactions
- [ ] Creator analytics (installs/usage/revenue); fraud detection

## E6 — Workflows & private (V2)
- [ ] Workflow listings; bundles/collections
- [ ] Private/org marketplaces; approval workflows
- [ ] Marketplace-as-MCP (search/install tools)

## E7 — Enterprise (V3)
- [ ] Private registries; license/compliance; SSO/audit; partner program

## E8 — Launch (Year 3)
- [ ] Seed supply (from #3 + #1 power users) + demand (from #1 user base) BEFORE public launch
- [ ] Curated initial catalog; creator program; PH/HN
