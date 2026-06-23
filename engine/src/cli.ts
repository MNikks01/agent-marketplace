#!/usr/bin/env node
// Agent Marketplace CLI — search, install, and publish agents / MCP servers / workflows.
// Listing definitions persist in ./marketplace.json (an array of PublishInput); the
// catalog is rebuilt from them each run, so security review re-runs deterministically.
// Seeds a small demo catalog on first use.
//
//   agentmarket list                  # all approved listings
//   agentmarket search "<query>"      # ranked results
//   agentmarket install <id|slug>     # print the install (mcp.json) fragment
//   agentmarket publish <listing.json># security-review + add a listing to the store

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Marketplace } from "./index.ts";
import type { PublishInput } from "./index.ts";

const STORE = process.env.MARKETPLACE_STORE || "./marketplace.json";

const DEMO: PublishInput[] = [
  {
    name: "Stripe MCP",
    type: "mcp-server",
    summary: "Manage Stripe — customers, invoices, payouts — over MCP.",
    author: "alice",
    tags: ["payments", "stripe", "billing"],
    pricing: { model: "usage", perCallUsd: 0.002 },
    install: { mcp: { command: "npx", args: ["stripe-mcp"] }, permissions: ["network"] },
  },
  {
    name: "GitHub Triage Agent",
    type: "agent",
    summary: "Triage GitHub issues: label, prioritize, and route.",
    author: "bob",
    tags: ["github", "issues", "automation"],
    pricing: { model: "flat", priceUsd: 9 },
    install: { permissions: ["network"] },
  },
];

const HELP = `agentmarket — curated marketplace for agents / MCP servers / workflows

Usage:
  agentmarket list                    all approved listings
  agentmarket search "<query>"        ranked search results
  agentmarket install <id|slug>       print the install (mcp.json) fragment
  agentmarket publish <listing.json>  security-review + add a listing (PublishInput JSON)

Store: ${STORE}  (override with MARKETPLACE_STORE)
`;

function loadInputs(): PublishInput[] {
  if (!existsSync(STORE)) {
    writeFileSync(STORE, JSON.stringify(DEMO, null, 2));
    return DEMO;
  }
  return JSON.parse(readFileSync(STORE, "utf8")) as PublishInput[];
}

function buildMarket(inputs: PublishInput[]): Marketplace {
  const mkt = new Marketplace();
  for (const input of inputs) {
    try {
      mkt.publish(input);
    } catch {
      /* skip malformed entries */
    }
  }
  return mkt;
}

function main(): void {
  const [cmd, ...rest] = process.argv.slice(2);
  const mkt = buildMarket(loadInputs());

  switch (cmd) {
    case "list": {
      const listings = mkt.list({ includeFlagged: true });
      for (const l of listings) {
        const notes = l.reviewNotes.length ? ` (${l.reviewNotes.join("; ")})` : "";
        process.stdout.write(`• ${l.name} [${l.type}] · ${l.reviewStatus}${notes}\n`);
      }
      if (listings.length === 0) process.stdout.write("(empty catalog)\n");
      return;
    }
    case "search": {
      const q = rest.join(" ");
      if (!q) return usage('agentmarket search "<query>"');
      const hits = mkt.search(q);
      for (const l of hits) process.stdout.write(`• ${l.name} [${l.type}] — score ${l.score.toFixed(2)}\n`);
      if (hits.length === 0) process.stdout.write("(no matches)\n");
      return;
    }
    case "install": {
      const id = rest[0];
      if (!id) return usage("agentmarket install <id|slug>");
      try {
        process.stdout.write(JSON.stringify(mkt.install(id), null, 2) + "\n");
      } catch (e) {
        process.stderr.write(`✗ blocked: ${(e as Error).message}\n`);
        process.exit(1);
      }
      return;
    }
    case "publish": {
      const file = rest[0];
      if (!file) return usage("agentmarket publish <listing.json>");
      const input = JSON.parse(readFileSync(resolve(file), "utf8")) as PublishInput;
      const listing = new Marketplace().publish(input); // review the new listing in isolation
      const inputs = loadInputs();
      inputs.push(input);
      writeFileSync(STORE, JSON.stringify(inputs, null, 2));
      const notes = listing.reviewNotes.length ? ` (${listing.reviewNotes.join("; ")})` : "";
      process.stdout.write(`✓ published "${listing.name}" · review: ${listing.reviewStatus}${notes}\n`);
      return;
    }
    default:
      process.stdout.write(HELP);
      process.exit(cmd ? 1 : 0);
  }
}

function usage(line: string): void {
  process.stderr.write(`✗ usage: ${line}\n`);
  process.exit(1);
}

try {
  main();
} catch (e) {
  process.stderr.write(`✗ ${(e as Error).message}\n`);
  process.exit(1);
}
