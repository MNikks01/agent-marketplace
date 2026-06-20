// Tests for the Agent Marketplace engine — review, discovery, install, ratings, payouts.
import { Marketplace, reviewListing, creatorPayout } from "../src/index.ts";

let fails = 0;
function ok(cond: boolean, label: string) {
  console.log(`${cond ? "✓" : "✗"} ${label}`);
  if (!cond) fails++;
}
const approx = (a: number, b: number) => Math.abs(a - b) < 1e-9;

// --- security review ---
ok(reviewListing({ mcp: { command: "npx", args: ["x"] } }).status === "approved", "trusted command -> approved");
ok(reviewListing({ mcp: { command: "/bin/sh", args: [] } }).status === "flagged", "untrusted command -> flagged");
ok(reviewListing({ permissions: ["exec"] }).status === "flagged", "risky permission -> flagged");

const mkt = new Marketplace();
const stripe = mkt.publish({ name: "Stripe MCP", type: "mcp-server", summary: "Stripe payments over MCP", author: "alice", tags: ["payments", "stripe"], pricing: { model: "usage", perCallUsd: 0.002 }, install: { mcp: { command: "npx", args: ["stripe-mcp"] } } });
mkt.publish({ name: "GitHub Triage Agent", type: "agent", summary: "Triage issues", author: "bob", tags: ["github"], install: {} });
const shell = mkt.publish({ name: "Shell Runner", type: "mcp-server", summary: "runs shell", author: "mallory", install: { mcp: { command: "/bin/sh", args: [] }, permissions: ["exec"] } });

ok(stripe.reviewStatus === "approved" && shell.reviewStatus === "flagged", "publish runs security review");

// --- discovery: flagged hidden by default ---
ok(mkt.list().length === 2, "list() hides flagged by default");
ok(mkt.list({ includeFlagged: true }).length === 3, "includeFlagged shows all");
ok(mkt.list({ type: "agent" }).length === 1, "filter by type");

// --- search ---
const hits = mkt.search("payments");
ok(hits[0]?.slug === "stripe-mcp", "search 'payments' ranks Stripe MCP first");
ok(!mkt.search("shell").some((l) => l.slug === "shell-runner"), "flagged listing excluded from search");

// --- install ---
const art = mkt.install("stripe-mcp");
ok(art.type === "mcp-server" && (art.config as any).mcpServers["stripe-mcp"].command === "npx", "install returns mcp.json fragment");
ok(mkt.get("stripe-mcp")!.installs === 1, "install increments counter");
let blocked = false;
try { mkt.install(shell.slug); } catch { blocked = true; }
ok(blocked, "install of flagged listing is blocked");

// --- ratings ---
mkt.rate("stripe-mcp", 5);
mkt.rate("stripe-mcp", 3);
ok(approx(mkt.get("stripe-mcp")!.ratingAvg, 4) && mkt.get("stripe-mcp")!.ratingCount === 2, "ratings average correctly");

// --- payouts ---
mkt.recordUsage("stripe-mcp", 100);
const e = mkt.earnings("alice");
ok(e.gross === 100 && approx(e.payout, 80) && approx(e.fee, 20), "revenue share: $100 -> $80 creator / $20 fee");
ok(creatorPayout(50, 0.7) === 35, "creatorPayout respects custom share");

console.log(fails === 0 ? "\n✅ Agent Marketplace engine: all tests passed" : `\n❌ ${fails} failed`);
process.exit(fails === 0 ? 0 : 1);
