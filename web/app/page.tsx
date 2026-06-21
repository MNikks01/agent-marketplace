"use client";

import { useState, useEffect, useCallback } from "react";

type Pricing = { model: string; priceUsd?: number; perCallUsd?: number };
type Listing = {
  id: string; slug: string; name: string; type: string; summary: string; tags: string[];
  author: string; pricing: Pricing; ratingAvg: number; ratingCount: number; installs: number; reviewStatus: string;
};

const TYPES = ["", "agent", "mcp-server", "workflow"];

function priceLabel(p: Pricing) {
  return p.model === "free" ? "Free" : p.model === "flat" ? `$${p.priceUsd}` : `$${p.perCallUsd}/call`;
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [installConfig, setInstallConfig] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [showPublish, setShowPublish] = useState(false);
  const [pub, setPub] = useState({ name: "", type: "mcp-server", summary: "", author: "", tags: "", command: "", permissions: "" });

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    const res = await fetch("/api/listings?" + params.toString());
    setListings((await res.json()).listings);
  }, [q, type]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-side initial data load
    load();
  }, [load]);

  async function install(slug: string) {
    setMsg("");
    setInstallConfig(null);
    const res = await fetch("/api/install", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug }) });
    const d = await res.json();
    if (!res.ok) return setMsg(d.error?.message ?? "Install failed");
    setInstallConfig(JSON.stringify(d.config, null, 2));
    load();
  }

  async function publish() {
    setMsg("");
    const res = await fetch("/api/publish", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...pub,
        tags: pub.tags.split(",").map((t) => t.trim()).filter(Boolean),
        permissions: pub.permissions.split(",").map((t) => t.trim()).filter(Boolean),
        command: pub.command || undefined,
      }),
    });
    const d = await res.json();
    if (!res.ok) return setMsg(d.error?.message ?? "Publish failed");
    setMsg(`Published "${d.listing.name}" — review: ${d.listing.reviewStatus}${d.listing.reviewNotes?.length ? ` (${d.listing.reviewNotes.join("; ")})` : ""}`);
    setPub({ name: "", type: "mcp-server", summary: "", author: "", tags: "", command: "", permissions: "" });
    load();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Agent Marketplace</h1>
        <button type="button" onClick={() => setShowPublish((s) => !s)} className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">
          {showPublish ? "Close" : "Publish a listing"}
        </button>
      </div>
      <p className="mt-2 text-zinc-500">
        Discover and install security-reviewed agents, MCP servers, and workflows. One-click install returns a ready
        <code> mcp.json</code> fragment.
      </p>

      <div className="mt-6 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="search…" placeholder="search…" className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type" className="rounded-md border border-zinc-300 px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          {TYPES.map((t) => <option key={t} value={t}>{t || "all types"}</option>)}
        </select>
      </div>

      {showPublish && (
        <section className="mt-4 space-y-2 rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-800">
          <div className="grid grid-cols-2 gap-2">
            <input value={pub.name} onChange={(e) => setPub({ ...pub, name: e.target.value })} aria-label="name" placeholder="name" className="rounded-md border border-zinc-300 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900" />
            <select value={pub.type} onChange={(e) => setPub({ ...pub, type: e.target.value })} aria-label="Listing type" className="rounded-md border border-zinc-300 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900">
              <option>mcp-server</option><option>agent</option><option>workflow</option>
            </select>
            <input value={pub.author} onChange={(e) => setPub({ ...pub, author: e.target.value })} aria-label="author" placeholder="author" className="rounded-md border border-zinc-300 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900" />
            <input value={pub.tags} onChange={(e) => setPub({ ...pub, tags: e.target.value })} aria-label="tags (comma-sep)" placeholder="tags (comma-sep)" className="rounded-md border border-zinc-300 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900" />
            <input value={pub.command} onChange={(e) => setPub({ ...pub, command: e.target.value })} aria-label="launch command (e.g. npx)" placeholder="launch command (e.g. npx)" className="rounded-md border border-zinc-300 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900" />
            <input value={pub.permissions} onChange={(e) => setPub({ ...pub, permissions: e.target.value })} aria-label="permissions (comma-sep)" placeholder="permissions (comma-sep)" className="rounded-md border border-zinc-300 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900" />
          </div>
          <input value={pub.summary} onChange={(e) => setPub({ ...pub, summary: e.target.value })} aria-label="summary" placeholder="summary" className="w-full rounded-md border border-zinc-300 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900" />
          <button type="button" onClick={publish} className="rounded-md bg-black px-4 py-2 font-medium text-white dark:bg-white dark:text-black">Publish (runs security review)</button>
        </section>
      )}

      {msg && <p role="alert" aria-live="polite" className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{msg}</p>}
      {installConfig && (
        <div className="mt-4">
          <div className="text-xs font-medium text-zinc-500">Install — merge into your mcp.json:</div>
          <pre className="mt-1 overflow-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900">{installConfig}</pre>
        </div>
      )}

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        {listings.map((l) => (
          <div key={l.id} className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{l.name}</h2>
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{l.type}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">{l.summary}</p>
            <div className="mt-2 text-xs text-zinc-500">
              by {l.author} · ★{l.ratingAvg.toFixed(1)} ({l.ratingCount}) · {l.installs} installs · {priceLabel(l.pricing)}
            </div>
            <button type="button" onClick={() => install(l.slug)} className="mt-3 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white">
              Install
            </button>
          </div>
        ))}
        {listings.length === 0 && <p className="text-sm text-zinc-500">No listings match.</p>}
      </section>
    </main>
  );
}
