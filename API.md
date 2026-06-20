# Agent Marketplace — API reference

_Generated from the source; see each subproject's README for usage._

## MCP server tools

Served over stdio JSON-RPC (`mcp-server/src/server.ts`).

| Tool | Description |
|------|-------------|
| `search_marketplace` | Search the marketplace for agents, MCP servers, and workflows. Returns approved listings only.… |
| `get_listing` | Get a listing's details by slug.… |
| `install_listing` | Install a listing — returns a ready-to-merge mcp.json fragment (or config). Blocked if it failed security review.… |
| `publish_listing` | Publish a new listing. It runs an automated security review; risky listings are flagged and not installable.… |

## Web HTTP API

Next.js route handlers under `web/app/api`.

| Endpoint | Methods |
|----------|---------|
| `/api/install` | POST |
| `/api/listings` | GET |
| `/api/publish` | POST |

> All inputs are validated; errors return a JSON `{ error: { message } }` with an appropriate status. No secrets are logged. See `.github/SECURITY.md`.