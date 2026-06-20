// A process-global Marketplace for the web app (dev/MVP), seeded with a starter catalog.
// Production: Postgres + RLS + Stripe Connect payouts.

import { Marketplace } from "@/lib/engine/index";

const g = globalThis as unknown as { __amkt?: Marketplace };

function seeded(): Marketplace {
  const m = new Marketplace();
  m.publish({ name: "Stripe MCP", type: "mcp-server", summary: "Manage Stripe customers, invoices, and payouts over MCP.", author: "alice", tags: ["payments", "stripe", "billing"], pricing: { model: "usage", perCallUsd: 0.002 }, install: { mcp: { command: "npx", args: ["stripe-mcp"] }, permissions: ["network"] } });
  m.publish({ name: "GitHub Triage Agent", type: "agent", summary: "Triage GitHub issues: label, prioritize, and route automatically.", author: "bob", tags: ["github", "issues", "automation"], pricing: { model: "flat", priceUsd: 9 }, install: { permissions: ["network"] } });
  m.publish({ name: "Postgres MCP", type: "mcp-server", summary: "Query and inspect a Postgres database over MCP.", author: "carol", tags: ["database", "postgres", "sql"], install: { mcp: { command: "npx", args: ["pg-mcp"] }, permissions: ["network"] } });
  m.publish({ name: "Slack Notifier", type: "workflow", summary: "Post alerts and summaries to Slack channels.", author: "dave", tags: ["slack", "notifications"], pricing: { model: "free" }, install: { permissions: ["network"] } });
  // ratings/usage for realism
  m.rate("stripe-mcp", 5); m.rate("stripe-mcp", 4); m.recordUsage("stripe-mcp", 120);
  m.rate("github-triage-agent", 4);
  m.install("postgres-mcp");
  return m;
}

export function getMarketplace(): Marketplace {
  if (!g.__amkt) g.__amkt = seeded();
  return g.__amkt;
}
