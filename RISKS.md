# Agent Marketplace — RISKS

| Type | Risk | L×I | Mitigation |
|------|------|-----|------------|
| Business | **Cold-start / ghost town** (THE risk) | H×H | Build LAST; seed supply (#3) + demand (#1) + subsidize flywheel; curate |
| Business | Two-sided complexity for a solo/small team | M×H | Reuse #1/#3/#4; launch only when platform is ready; small curated start |
| Trust | Malicious/low-quality listings (GPT-Store trap) | M×H | Mandatory security review + curation + sandbox + permissions + takedown |
| Economy | Payout fraud / ranking gaming | M×M | Stripe Connect KYC + fraud detection + quality-based ranking |
| Tech | Install reliability / dependency on #1/#4 | M×M | Reversible installs; graceful dependency degradation |
| Market | GPT Store / official MCP registry dominate distribution | M×H | Curation + one-click-into-real-workflow (#1) + revenue share differentiate |
| Market | MCP/agent ecosystem matures slower than hoped | M×H | Sequencing (Year 3) hedges timing; only build when demand is proven |
| Legal | IP/licensing/abuse of listings | M×M | ToS, creator agreement, DMCA, license metadata (V3) |

**Top:** cold-start (solved by sequencing + seeding + curation) and trust (solved by review + sandbox + curation).
**Kill criteria:** if the platform (#1) hasn't reached the distribution needed to seed demand, **do not launch** — defer until it has, or keep marketplace features as private/org registries only. A marketplace without distribution is the classic startup graveyard.
