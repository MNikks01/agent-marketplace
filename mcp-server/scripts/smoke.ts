// Drives the Agent Marketplace MCP server over stdio JSON-RPC.
import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const child = spawn("node", [resolve(here, "../src/server.ts")], { stdio: ["pipe", "pipe", "inherit"] });

let buf = "";
const pending = new Map<number, (m: any) => void>();
child.stdout.on("data", (chunk) => {
  buf += chunk.toString();
  let nl: number;
  while ((nl = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (!line) continue;
    let msg: any;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)!(msg); pending.delete(msg.id); }
  }
});
const send = (o: any) => child.stdin.write(JSON.stringify(o) + "\n");
const request = (id: number, method: string, params?: any) =>
  new Promise<any>((res) => { pending.set(id, res); send({ jsonrpc: "2.0", id, method, params }); });
function assert(c: boolean, l: string) { if (!c) { console.error(`✗ ${l}`); child.kill(); process.exit(1); } console.log(`✓ ${l}`); }
const txt = (m: any) => m.result?.content?.[0]?.text ?? "";

const init = await request(1, "initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "smoke", version: "1.0.0" } });
assert(init.result?.serverInfo?.name === "agent-marketplace", `initialize -> ${init.result?.serverInfo?.name}`);
send({ jsonrpc: "2.0", method: "notifications/initialized" });

const names = ((await request(2, "tools/list", {})).result?.tools ?? []).map((t: any) => t.name);
assert(["search_marketplace", "get_listing", "install_listing", "publish_listing"].every((n) => names.includes(n)), `tools/list -> ${names.join(", ")}`);

assert(/Stripe MCP/.test(txt(await request(3, "tools/call", { name: "search_marketplace", arguments: { query: "payments" } }))), "search 'payments' -> Stripe MCP");

assert(/"command": "npx"/.test(txt(await request(4, "tools/call", { name: "install_listing", arguments: { slug: "stripe-mcp" } }))), "install stripe-mcp -> mcp.json fragment");

const pub = txt(await request(5, "tools/call", { name: "publish_listing", arguments: { name: "Shell Runner", type: "mcp-server", summary: "runs shell", author: "mallory", command: "/bin/sh", permissions: ["exec"] } }));
assert(/flagged/.test(pub), "publish risky listing -> flagged");

const blocked = txt(await request(6, "tools/call", { name: "install_listing", arguments: { slug: "shell-runner" } }));
assert(/security review/.test(blocked), "install flagged listing -> blocked");

child.kill();
console.log("\n✅ Agent Marketplace MCP server works end-to-end over MCP.");
