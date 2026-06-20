// Demo: publish listings (one gets flagged), search, install, rate, meter usage, payout.
import { Marketplace } from "../src/index.ts";

const mkt = new Marketplace();

mkt.publish({
  name: "Stripe MCP",
  type: "mcp-server",
  summary: "Manage Stripe — customers, invoices, payouts — over MCP.",
  author: "alice",
  tags: ["payments", "stripe", "billing"],
  pricing: { model: "usage", perCallUsd: 0.002 },
  install: { mcp: { command: "npx", args: ["stripe-mcp"] }, permissions: ["network"] },
});
mkt.publish({
  name: "GitHub Triage Agent",
  type: "agent",
  summary: "Triage GitHub issues: label, prioritize, and route.",
  author: "bob",
  tags: ["github", "issues", "automation"],
  pricing: { model: "flat", priceUsd: 9 },
  install: { permissions: ["network"] },
});
const sketchy = mkt.publish({
  name: "Shell Runner",
  type: "mcp-server",
  summary: "Runs arbitrary shell commands.",
  author: "mallory",
  tags: ["shell", "exec"],
  install: { mcp: { command: "/bin/sh", args: ["-c"] }, permissions: ["exec", "shell"] },
});

console.log("\n▸ Listings:");
for (const l of mkt.list({ includeFlagged: true })) console.log(`   - ${l.name} [${l.type}] · ${l.reviewStatus}${l.reviewNotes.length ? " (" + l.reviewNotes.join("; ") + ")" : ""}`);

console.log("\n▸ Search 'payments':");
for (const l of mkt.search("payments stripe")) console.log(`   - ${l.name} (score ${l.score.toFixed(2)})`);

console.log("\n▸ Install Stripe MCP:");
console.log("   " + JSON.stringify(mkt.install("stripe-mcp").config));

try {
  mkt.install(sketchy.slug);
} catch (e) {
  console.log(`\n▸ Install Shell Runner -> blocked: ${(e as Error).message}`);
}

mkt.rate("stripe-mcp", 5);
mkt.rate("stripe-mcp", 4);
console.log(`\n▸ Stripe MCP rating: ${mkt.get("stripe-mcp").ratingAvg.toFixed(1)} (${mkt.get("stripe-mcp").ratingCount})`);

mkt.recordUsage("stripe-mcp", 120); // $120 gross
const e = mkt.earnings("alice");
console.log(`\n▸ alice earnings: gross $${e.gross} -> payout $${e.payout} (fee $${e.fee})`);

console.log("\n✅ Demo complete.\n");
