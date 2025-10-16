import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const r = await fetch(`https://dummyjson.com/todos?userId=${params.id}`, { cache: "no-store" });
  if (!r.ok) return NextResponse.json({ error: "Todos fetch failed" }, { status: 502 });
  const j = await r.json();
  return NextResponse.json(j);
}
