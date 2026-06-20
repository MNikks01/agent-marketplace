# Agent Marketplace — PRICING

Marketplace economics: **take-rate** on transactions + creator revenue share. D-008.

## Model
- **Consumers** pay for paid listings (one-time, subscription, or usage-based — set by creator).
- **Creators** earn revenue share; platform takes a **take-rate** (e.g., 15–30% — tune for competitiveness vs. sustainability).
- **Free listings** allowed (adoption + funnel; creators may monetize via reputation/upsell).

## Consumer-side tiers (via ContextOS #1)
| | Free | Pro/Team (via #1) | Enterprise |
|---|---|---|---|
| Browse/install free listings | ✅ | ✅ | ✅ |
| Install paid listings | pay per listing | pay per listing | + private marketplace |
| Private/org marketplace | — | — | ✅ |

## Creator-side
- Free to publish (after passing review).
- Set pricing per listing (free / paid / usage).
- Revenue share payout via **Stripe Connect** (platform take-rate applied).
- Premium creator tools/analytics could be a paid creator tier (later).

## Logic
- Marketplace revenue = take-rate × GMV → grows with the ecosystem, not seats.
- Generous to creators early (lower take-rate / promotions) to **seed supply** (cold-start).
- Curation/quality (not volume) drives consumer trust → demand → GMV.
- Enterprise private marketplaces = subscription (via #1).

## Cold-start pricing tactics
Early: reduced/zero take-rate + featured placement + payouts guarantees to attract first creators; consumer credits to drive first installs. The flywheel needs subsidizing to start (classic marketplace economics).
