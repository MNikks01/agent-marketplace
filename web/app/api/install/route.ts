import { NextResponse } from "next/server";
import { getMarketplace } from "@/lib/marketplace-store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { slug } = await req.json().catch(() => ({}) as { slug?: string });
  if (!slug) return NextResponse.json({ error: { message: "slug required" } }, { status: 400 });
  try {
    const artifact = getMarketplace().install(slug);
    return NextResponse.json(artifact);
  } catch (e) {
    return NextResponse.json({ error: { message: (e as Error).message } }, { status: 409 });
  }
}
