# Agent Marketplace — API DESIGN

REST. Conventions per contextos/API_DESIGN.md.

## Discovery & install (consumer)
```
GET    /v1/listings?q=&category=&type=&sort=popularity|rating|new   (semantic+keyword)
GET    /v1/listings/:id                 (detail: docs, ratings, permissions, pricing, review status)
POST   /v1/listings/:id/install         ({org_id}) -> installs into ContextOS (#1)
DELETE /v1/installs/:id                 (uninstall)
POST   /v1/listings/:id/ratings         ({stars, review})
```

## Publishing & earning (creator)
```
POST   /v1/listings                     (create draft: type, source ref)
POST   /v1/listings/:id/versions        (new version; triggers review)
GET    /v1/listings/:id/review-status
PATCH  /v1/listings/:id                  (pricing, docs, visibility)
GET    /v1/creator/analytics            (installs, usage, revenue)
POST   /v1/creator/connect              (Stripe Connect onboarding)
GET    /v1/creator/payouts
```

## Review & governance
```
GET    /v1/admin/review-queue           POST /v1/admin/listings/:id/approve|reject
POST   /v1/admin/listings/:id/takedown
POST   /v1/orgs/:id/private-marketplace  (V2)
GET    /v1/orgs/:id/audit-logs
```

## Billing/economy
```
GET    /v1/billing/usage                POST /v1/webhooks/stripe
```

## Integrations
Install → ContextOS (#1) install API/MCP. Review → reuse #3 security lint. Runtime → observed via #4. Payouts → Stripe Connect.

## Errors
problem+json: `listing-not-approved` (403), `review-pending` (409), `payout-account-missing` (402).
