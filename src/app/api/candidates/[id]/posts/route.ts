import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const r = await fetch(`https://dummyjson.com/posts?userId=${params.id}`, { cache: "no-store" });
  if (!r.ok) return NextResponse.json({ error: "Posts fetch failed" }, { status: 502 });
  const j = await r.json();
  return NextResponse.json(j);
}
