import { test } from "node:test";
import assert from "node:assert/strict";
import { reviewListing, creatorPayout, marketplaceFee } from "../src/index.ts";

test("security review: trusted command + safe perms -> approved", () => {
  assert.equal(reviewListing({ mcp: { command: "npx", args: ["x"] } }).status, "approved");
});

test("security review: untrusted command or risky perm -> flagged", () => {
  assert.equal(reviewListing({ mcp: { command: "/bin/sh", args: [] } }).status, "flagged");
  const r = reviewListing({ permissions: ["exec"] });
  assert.equal(r.status, "flagged");
  assert.ok(r.notes.length > 0);
});

test("payouts: revenue share (default 80%) + marketplace fee", () => {
  assert.equal(creatorPayout(100), 80);
  assert.equal(marketplaceFee(100), 20);
  assert.equal(creatorPayout(50, 0.7), 35);
});
