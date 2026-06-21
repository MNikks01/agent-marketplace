# API contracts — Agent Marketplace

_Derived from source. See root `API.md` and each subproject README._

## MCP tools
- `search_marketplace`
- `get_listing`
- `install_listing`
- `publish_listing`

## Web HTTP API
- `GET /api/listings`
- `POST /api/install`
- `POST /api/publish`

> Inputs are validated; errors return `{ error: { message } }` with an appropriate status.
