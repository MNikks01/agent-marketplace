import { NextResponse } from "next/server";
import { getMarketplace } from "@/lib/marketplace-store";
import type { ListingType } from "@/lib/engine/types";

export const runtime = "nodejs";

// Browse or search approved listings. ?q= for search, ?type= to filter.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  const type = (url.searchParams.get("type") as ListingType | null) ?? undefined;
  const mkt = getMarketplace();
  const listings = q ? mkt.search(q, type ? { type } : undefined) : mkt.list(type ? { type } : undefined);
  return NextResponse.json({ listings });
}
