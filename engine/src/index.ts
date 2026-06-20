// Agent Marketplace engine — publish (security-reviewed) listings (agents / MCP servers /
// workflows), discover/search, install, rate, meter usage, and compute creator revenue share.
// Self-contained + zero-network.

import { Catalog, type PublishInput } from "./catalog.ts";
import { creatorPayout, marketplaceFee } from "./payouts.ts";
import type { InstallArtifact, Listing, ListingType, ScoredListing } from "./types.ts";

export class Marketplace {
  private catalog = new Catalog();

  publish(input: PublishInput): Listing {
    return this.catalog.publish(input);
  }
  get(idOrSlug: string): Listing | undefined {
    return this.catalog.get(idOrSlug);
  }
  list(filter?: { type?: ListingType; includeFlagged?: boolean }): Listing[] {
    return this.catalog.list(filter);
  }
  search(query: string, filter?: { type?: ListingType }): ScoredListing[] {
    return this.catalog.search(query, filter);
  }
  rate(idOrSlug: string, stars: number): Listing {
    return this.catalog.rate(idOrSlug, stars);
  }
  install(idOrSlug: string): InstallArtifact {
    return this.catalog.install(idOrSlug);
  }
  recordUsage(idOrSlug: string, grossUsd: number): void {
    this.catalog.recordUsage(idOrSlug, grossUsd);
  }
  /** Total revenue share owed to a creator across their listings. */
  earnings(author: string, share?: number): { gross: number; payout: number; fee: number } {
    const gross = this.catalog.grossForAuthor(author);
    return { gross, payout: creatorPayout(gross, share), fee: marketplaceFee(gross, share) };
  }
}

export { Catalog } from "./catalog.ts";
export { reviewListing } from "./security.ts";
export { creatorPayout, marketplaceFee } from "./payouts.ts";
export type { PublishInput } from "./catalog.ts";
export type { InstallArtifact, Listing, ListingType, Pricing, ScoredListing } from "./types.ts";
