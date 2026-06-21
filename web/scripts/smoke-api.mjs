// End-to-end web API proof for the Agent Marketplace. No browser, no keys.
const BASE = process.env.BASE || "http://localhost:3990";
const __h = await fetch(BASE + "/api/health").then((r) => r.json()).catch(() => ({}));
if (__h.status !== "ok") throw new Error("health check failed");
console.log("\u2713 /api/health -> ok");
const get = (p) => fetch(BASE + p).then((r) => r.json());
const post = (p, b) => fetch(BASE + p, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });

// 1) browse seeded listings (approved only)
let d = await get("/api/listings");
if (d.listings.length !== 4) throw new Error("expected 4 seeded listings, got " + d.listings.length);
console.log(`✓ /api/listings -> ${d.listings.length} approved listings`);

// 2) search
d = await get("/api/listings?q=payments");
if (d.listings[0]?.slug !== "stripe-mcp") throw new Error("search 'payments' should rank Stripe MCP first");
console.log(`✓ /api/listings?q=payments -> ${d.listings[0].name} first`);

// 3) install -> mcp.json fragment
let r = await post("/api/install", { slug: "stripe-mcp" });
let id = await r.json();
if (!r.ok || !id.config?.mcpServers?.["stripe-mcp"]) throw new Error("install did not return mcp fragment");
console.log(`✓ /api/install stripe-mcp -> mcp.json fragment`);

// 4) publish a risky listing -> flagged
r = await post("/api/publish", { name: "Shell Runner", type: "mcp-server", summary: "runs shell", author: "mallory", command: "/bin/sh", permissions: ["exec"] });
const pub = (await r.json()).listing;
if (pub.reviewStatus !== "flagged") throw new Error("risky listing should be flagged");
console.log(`✓ /api/publish risky -> ${pub.reviewStatus} (${pub.reviewNotes.length} notes)`);

// 5) flagged listing hidden from browse
d = await get("/api/listings");
if (d.listings.some((l) => l.slug === "shell-runner")) throw new Error("flagged listing should be hidden");
console.log(`✓ flagged listing hidden from /api/listings (still ${d.listings.length})`);

// 6) install of flagged -> 409 blocked
r = await post("/api/install", { slug: "shell-runner" });
if (r.status !== 409) throw new Error("install of flagged should be 409, got " + r.status);
console.log(`✓ /api/install flagged -> 409 blocked`);

console.log("\n✅ Agent Marketplace web API end-to-end PASSED");
