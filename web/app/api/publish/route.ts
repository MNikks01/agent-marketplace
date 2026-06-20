import { NextResponse } from "next/server";
import { getMarketplace } from "@/lib/marketplace-store";
import type { ListingType } from "@/lib/engine/types";

export const runtime = "nodejs";

const TYPES = ["agent", "mcp-server", "workflow"];

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const { name, type, summary, author } = body as { name?: string; type?: string; summary?: string; author?: string };
  if (!name || !type || !TYPES.includes(type) || !summary || !author) {
    return NextResponse.json({ error: { message: `Need name, type (${TYPES.join("|")}), summary, author.` } }, { status: 400 });
  }
  const command = body.command as string | undefined;
  const args = (body.args as string[] | undefined) ?? [];
  const permissions = (body.permissions as string[] | undefined) ?? [];
  const tags = (body.tags as string[] | undefined) ?? [];
  const install = command ? { mcp: { command, args }, permissions } : { permissions };
  const listing = getMarketplace().publish({ name, type: type as ListingType, summary, author, tags, install });
  return NextResponse.json({ listing });
}
