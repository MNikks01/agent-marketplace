# Agent Marketplace — MCP server

Exposes [`../engine`](../engine) over **MCP**, so any MCP host/agent can discover, install,
and publish marketplace listings.

## Status: works end-to-end (verified over MCP, 2026-06-21)
- ✅ Seeds a small catalog so discovery is never empty.
- ✅ Tools: `search_marketplace`, `get_listing`, `install_listing`, `publish_listing`.
- ✅ Driven over real stdio JSON-RPC (`scripts/smoke.ts`) — incl. the flag→block trust flow.

## Tools
| Tool | Input | Returns |
|------|-------|---------|
| `search_marketplace` | `{ query, type? }` | ranked approved listings |
| `get_listing` | `{ slug }` | listing details |
| `install_listing` | `{ slug }` | `mcp.json` fragment (blocked if flagged) |
| `publish_listing` | `{ name, type, summary, author, tags?, command?, args?, permissions? }` | publish result + review status |

## Run it
```bash
npm install
node src/server.ts     # speaks MCP over stdio
npm run smoke
```
Add to Claude Desktop via [`mcp.json`](./mcp.json) (absolute path to `src/server.ts`).
