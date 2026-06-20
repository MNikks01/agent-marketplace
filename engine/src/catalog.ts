// The catalog: publish (security-reviewed), discover/search, get, rate, install, meter usage.
// In-memory for the engine/MVP; production persists to Postgres with RLS + payments.

import { randomUUID } from "node:crypto";
import { reviewListing } from "./security.ts";
import { scoreListings } from "./search.ts";
import type { InstallArtifact, Listing, ListingType, Pricing, ScoredListing } from "./types.ts";

export interface PublishInput {
  name: string;
  type: ListingType;
  summary: string;
  author: string;
  tags?: string[];
  version?: string;
  pricing?: Pricing;
  install?: Listing["install"];
}

function slugify(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "listing";
}

export class Catalog {
  private listings = new Map<string, Listing>();
  private usageGross = new Map<string, number>(); // listingId -> gross USD

  publish(input: PublishInput): Listing {
    const review = reviewListing(input.install ?? {});
    const listing: Listing = {
      id: randomUUID(),
      slug: slugify(input.name),
      name: input.name,
      type: input.type,
      summary: input.summary,
      tags: input.tags ?? [],
      author: input.author,
      version: input.version ?? "0.1.0",
      pricing: input.pricing ?? { model: "free" },
      install: input.install ?? {},
      ratingAvg: 0,
      ratingCount: 0,
      installs: 0,
      reviewStatus: review.status,
      reviewNotes: review.notes,
      createdAt: new Date().toISOString(),
    };
    this.listings.set(listing.id, listing);
    return listing;
  }

  get(idOrSlug: string): Listing | undefined {
    return this.listings.get(idOrSlug) ?? [...this.listings.values()].find((l) => l.slug === idOrSlug);
  }

  // Discovery defaults to approved listings only (trust). Pass includeFlagged for moderation views.
  list(filter?: { type?: ListingType; includeFlagged?: boolean }): Listing[] {
    return [...this.listings.values()]
      .filter((l) => (filter?.includeFlagged ? true : l.reviewStatus === "approved"))
      .filter((l) => (filter?.type ? l.type === filter.type : true));
  }

  search(query: string, filter?: { type?: ListingType }): ScoredListing[] {
    return scoreListings(query, this.list({ type: filter?.type }));
  }

  rate(idOrSlug: string, stars: number): Listing {
    const l = this.must(idOrSlug);
    if (stars < 1 || stars > 5) throw new Error("rating must be 1-5");
    l.ratingAvg = (l.ratingAvg * l.ratingCount + stars) / (l.ratingCount + 1);
    l.ratingCount += 1;
    return l;
  }

  install(idOrSlug: string): InstallArtifact {
    const l = this.must(idOrSlug);
    if (l.reviewStatus === "flagged") throw new Error(`"${l.name}" failed security review; install blocked`);
    l.installs += 1;
    const config =
      l.type === "mcp-server" && l.install.mcp
        ? { mcpServers: { [l.slug]: l.install.mcp } }
        : { listing: l.slug, type: l.type };
    return { listingId: l.id, type: l.type, config };
  }

  recordUsage(idOrSlug: string, grossUsd: number): void {
    const l = this.must(idOrSlug);
    this.usageGross.set(l.id, (this.usageGross.get(l.id) ?? 0) + grossUsd);
  }

  grossForAuthor(author: string): number {
    let total = 0;
    for (const l of this.listings.values()) if (l.author === author) total += this.usageGross.get(l.id) ?? 0;
    return total;
  }

  private must(idOrSlug: string): Listing {
    const l = this.get(idOrSlug);
    if (!l) throw new Error(`listing not found: ${idOrSlug}`);
    return l;
  }
}
