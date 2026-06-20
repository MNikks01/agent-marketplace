// Core types for the Agent Marketplace engine. Creators publish listings (agents,
// MCP servers, workflows); consumers discover, install, rate; usage drives revenue share.

export type ListingType = "agent" | "mcp-server" | "workflow";

export type Pricing =
  | { model: "free" }
  | { model: "flat"; priceUsd: number }
  | { model: "usage"; perCallUsd: number };

export type ReviewStatus = "pending" | "approved" | "flagged";

export interface InstallSpec {
  // For mcp-server listings: how to wire it into an MCP host.
  mcp?: { command: string; args: string[] };
  // Capabilities the listing requests (drives the security review).
  permissions?: string[];
}

export interface Listing {
  id: string;
  slug: string;
  name: string;
  type: ListingType;
  summary: string;
  tags: string[];
  author: string;
  version: string;
  pricing: Pricing;
  install: InstallSpec;
  ratingAvg: number;
  ratingCount: number;
  installs: number;
  reviewStatus: ReviewStatus;
  reviewNotes: string[];
  createdAt: string;
}

export interface ScoredListing extends Listing {
  score: number;
}

export interface InstallArtifact {
  listingId: string;
  type: ListingType;
  // For mcp-server: a ready-to-merge mcp.json fragment.
  config: Record<string, unknown>;
}
