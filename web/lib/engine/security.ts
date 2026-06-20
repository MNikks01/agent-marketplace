// GENERATED from engine/src/security.ts — DO NOT EDIT.
// Source of truth: engine/src. Regenerate: node engine/scripts/sync-to-web.mjs

// Automated security review — the trust layer. Flags risky listings for manual review
// before they go live. (Production: + static analysis, sandbox runs, signature checks.)

import type { InstallSpec, ReviewStatus } from "./types";

const TRUSTED_COMMANDS = new Set(["node", "npx", "python", "python3", "deno", "bun"]);
const RISKY_PERMISSIONS = new Set(["exec", "filesystem-write", "secrets", "network-unrestricted", "shell"]);

export function reviewListing(install: InstallSpec): { status: ReviewStatus; notes: string[] } {
  const notes: string[] = [];

  if (install.mcp && !TRUSTED_COMMANDS.has(install.mcp.command)) {
    notes.push(`untrusted launch command: "${install.mcp.command}" (expected node/npx/python/deno/bun)`);
  }
  for (const perm of install.permissions ?? []) {
    if (RISKY_PERMISSIONS.has(perm)) notes.push(`requests risky permission: "${perm}" — needs manual review`);
  }

  return { status: notes.length ? "flagged" : "approved", notes };
}
