#!/usr/bin/env node
// MCP server for the Agent Marketplace — discover, install, and publish listings from any
// MCP host. stdout is the MCP channel; status -> stderr.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Marketplace } from "../../engine/src/index.ts";

const TYPES = ["agent", "mcp-server", "workflow"] as const;
const mkt = new Marketplace();

// Seed a small catalog so discovery is never empty.
mkt.publish({ name: "Stripe MCP", type: "mcp-server", summary: "Manage Stripe customers, invoices, payouts over MCP.", author: "alice", tags: ["payments", "stripe", "billing"], pricing: { model: "usage", perCallUsd: 0.002 }, install: { mcp: { command: "npx", args: ["stripe-mcp"] }, permissions: ["network"] } });
mkt.publish({ name: "GitHub Triage Agent", type: "agent", summary: "Triage GitHub issues: label, prioritize, route.", author: "bob", tags: ["github", "issues"], pricing: { model: "flat", priceUsd: 9 }, install: { permissions: ["network"] } });
mkt.publish({ name: "Postgres MCP", type: "mcp-server", summary: "Query and inspect a Postgres database over MCP.", author: "carol", tags: ["database", "postgres", "sql"], install: { mcp: { command: "npx", args: ["pg-mcp"] }, permissions: ["network"] } });
console.error(`[agent-marketplace-mcp] seeded ${mkt.list().length} listings`);

const server = new McpServer({ name: "agent-marketplace", version: "0.1.0" });

server.tool(
  "search_marketplace",
  "Search the marketplace for agents, MCP servers, and workflows. Returns approved listings only.",
  { query: z.string(), type: z.enum(TYPES).optional() },
  async ({ query, type }) => {
    const hits = mkt.search(query, type ? { type } : undefined);
    const text = hits.length
      ? hits.map((l) => `- ${l.name} [${l.type}] · ★${l.ratingAvg.toFixed(1)} · ${l.installs} installs · ${pricing(l.pricing)} (score ${l.score.toFixed(1)})`).join("\n")
      : "No matching listings.";
    return { content: [{ type: "text", text }] };
  },
);

server.tool("get_listing", "Get a listing's details by slug.", { slug: z.string() }, async ({ slug }) => {
  const l = mkt.get(slug);
  if (!l) return { content: [{ type: "text", text: `No listing: ${slug}` }] };
  return { content: [{ type: "text", text: `${l.name} [${l.type}] by ${l.author}\n${l.summary}\ntags: ${l.tags.join(", ")} · ★${l.ratingAvg.toFixed(1)} (${l.ratingCount}) · ${l.installs} installs · ${pricing(l.pricing)} · review: ${l.reviewStatus}` }] };
});

server.tool("install_listing", "Install a listing — returns a ready-to-merge mcp.json fragment (or config). Blocked if it failed security review.", { slug: z.string() }, async ({ slug }) => {
  try {
    const art = mkt.install(slug);
    return { content: [{ type: "text", text: JSON.stringify(art.config, null, 2) }] };
  } catch (e) {
    return { content: [{ type: "text", text: (e as Error).message }] };
  }
});

server.tool(
  "publish_listing",
  "Publish a new listing. It runs an automated security review; risky listings are flagged and not installable.",
  { name: z.string(), type: z.enum(TYPES), summary: z.string(), author: z.string(), tags: z.array(z.string()).optional(), command: z.string().optional(), args: z.array(z.string()).optional(), permissions: z.array(z.string()).optional() },
  async ({ name, type, summary, author, tags, command, args, permissions }) => {
    const install = command ? { mcp: { command, args: args ?? [] }, permissions } : { permissions };
    const l = mkt.publish({ name, type, summary, author, tags, install });
    return { content: [{ type: "text", text: `Published "${l.name}" (slug: ${l.slug}) — review: ${l.reviewStatus}${l.reviewNotes.length ? "\n  " + l.reviewNotes.join("\n  ") : ""}` }] };
  },
);

function pricing(p: { model: string; priceUsd?: number; perCallUsd?: number }): string {
  return p.model === "free" ? "free" : p.model === "flat" ? `$${p.priceUsd}` : `$${p.perCallUsd}/call`;
}

await server.connect(new StdioServerTransport());
console.error("[agent-marketplace-mcp] ready");
