import { test } from "node:test";
import assert from "node:assert/strict";
import { Marketplace } from "../src/index.ts";

test("publish (reviewed) -> discover -> install -> rate -> earnings; flagged is blocked", () => {
  const mkt = new Marketplace();
  mkt.publish({ name: "Stripe MCP", type: "mcp-server", summary: "Stripe payments over MCP", author: "alice", tags: ["payments", "stripe"], pricing: { model: "usage", perCallUsd: 0.002 }, install: { mcp: { command: "npx", args: ["stripe-mcp"] } } });
  mkt.publish({ name: "GitHub Triage Agent", type: "agent", summary: "Triage issues", author: "bob", tags: ["github"], install: {} });
  const shell = mkt.publish({ name: "Shell Runner", type: "mcp-server", summary: "runs shell", author: "mallory", install: { mcp: { command: "/bin/sh", args: [] }, permissions: ["exec"] } });

  // discovery hides flagged by default
  assert.equal(mkt.list().length, 2);
  assert.equal(mkt.list({ includeFlagged: true }).length, 3);

  // search ranks the relevant listing first; flagged excluded
  assert.equal(mkt.search("payments")[0]?.slug, "stripe-mcp");
  assert.ok(!mkt.search("shell").some((l) => l.slug === "shell-runner"));

  // install returns an mcp.json fragment + counts
  const art = mkt.install("stripe-mcp");
  assert.equal((art.config as { mcpServers: Record<string, { command: string }> }).mcpServers["stripe-mcp"].command, "npx");
  assert.equal(mkt.get("stripe-mcp")?.installs, 1);

  // installing a flagged listing is blocked
  assert.throws(() => mkt.install(shell.slug));

  // ratings + revenue share
  mkt.rate("stripe-mcp", 5);
  mkt.rate("stripe-mcp", 3);
  assert.equal(mkt.get("stripe-mcp")?.ratingAvg, 4);
  mkt.recordUsage("stripe-mcp", 100);
  const e = mkt.earnings("alice");
  assert.equal(e.gross, 100);
  assert.equal(e.payout, 80);
});
