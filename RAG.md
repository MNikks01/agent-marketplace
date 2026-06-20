# Agent Marketplace — RAG

**Not a RAG product.** Retrieval appears only in **discovery** (semantic search over listings). General method: RAG_GUIDE.md.

## Narrow uses
- **Listing discovery:** embed listing descriptions → semantic + keyword (FTS) hybrid search to match consumer intent → capabilities. Modest scale; pgvector.
- **Recommendations:** embedding similarity + usage signals.
- Docs assistant (RAG over marketplace docs) — optional.

## Implementation
pgvector on listing embeddings; hybrid with FTS; provider-abstracted embeddings (`packages/llm`). No heavy RAG pipeline; not in the critical path.

## Note
The *listed items* may be RAG-powered (e.g., a Codebase-Intelligence-backed agent), but the marketplace itself does not run RAG beyond discovery. Heavy RAG lives in codebase-intelligence/RAG.md.
