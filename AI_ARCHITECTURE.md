# Agent Marketplace — AI ARCHITECTURE

Light AI use (it's a marketplace, not an AI engine). Builds on AI_STACK_GUIDE.md.

## Where AI is used
| Use | Task | Model |
|-----|------|-------|
| **Semantic discovery** | Embed listings → match consumer intent to capabilities | embeddings |
| Listing summarization | Generate clear summaries/tags from creator submissions | cheap (Sonnet/Haiku) |
| Review assist | LLM pre-screen for security/quality issues (augments manual + #3 lint) | reasoning |
| Recommendations | "you might also want" from usage/embeddings | embeddings + light ML |
| Quality scoring (V2) | Score listing docs/safety | LLM-as-judge |

## Embeddings / search
pgvector on listing embeddings (modest scale) + FTS → hybrid discovery. Provider-abstracted embeddings (`packages/llm`).

## The listings ARE the AI
The catalog's value is AI agents/MCP servers/workflows. Their AI behavior lives in the listed artifacts (built with #3, run via #1, observed via #4) — the marketplace itself is mostly classic SaaS + a little AI for discovery/review.

## Review assist
LLM + #3 security lint pre-screen submissions (flag injection-unsafe descriptions, missing auth, dangerous tools) → human reviewer confirms. Scales trust.

## Cost
Minimal AI COGS (embeddings + occasional review/summarize calls). Track per-listing.

## Guardrails
Review-assist is advisory (humans approve); discovery ranking resists pay-to-win; see [GUARDRAILS.md](./GUARDRAILS.md).
