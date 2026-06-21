# Architecture — Agent Marketplace

Publish security-reviewed listings, discover/search, one-click install (mcp.json), rate, meter usage, compute creator revenue share.

**Shape:** a pure-TypeScript **engine** (`engine/src`, zero-network, zero-dep) wrapped by thin adapters: engine/ (engine), mcp-server/ (MCP server), web/ (Next.js app).

- **Engine = single source of truth.** Surfaces never duplicate logic; they call the engine.
- Generated copies (e.g. `web/lib/engine`) are produced by a sync script and kept in lock-step (drift-checked in CI).
- Real external services (LLM, embeddings, Stripe, Postgres/pgvector, OTel) are swapped in behind interfaces/env; nothing is required to run the dev/test path.

Key modules: `types`, `security`, `search`, `catalog`, `payouts`, `index`.

See the root `ARCHITECTURE.md` for the full product/scale design.
