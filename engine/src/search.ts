// Discovery — lexical relevance over name/tags/summary (name + tags weighted higher).

import type { Listing, ScoredListing } from "./types.ts";

function tokenize(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

export function scoreListings(query: string, listings: Listing[]): ScoredListing[] {
  const q = new Set(tokenize(query));
  if (q.size === 0) return listings.map((l) => ({ ...l, score: 0 }));

  return listings
    .map((l) => {
      const name = new Set(tokenize(l.name));
      const tags = new Set(l.tags.flatMap(tokenize));
      const summary = new Set(tokenize(l.summary));
      let score = 0;
      for (const t of q) {
        if (name.has(t)) score += 3;
        if (tags.has(t)) score += 2;
        if (summary.has(t)) score += 1;
      }
      // light boost for popularity/quality
      score += Math.min(l.installs, 100) / 100 + l.ratingAvg / 10;
      return { ...l, score };
    })
    .filter((l) => l.score > 0)
    .sort((a, b) => b.score - a.score);
}
