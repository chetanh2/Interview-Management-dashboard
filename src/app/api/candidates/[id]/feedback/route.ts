// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   const role = cookies().get("role")?.value;
//   if (!(role === "admin" || role === "panelist")) {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

//   const body = await req.json();
//   if (!body?.title || !body?.body) {
//     return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//   }

//   // Simulate persistence (in real app, write to DB)
//   const fakeId = Math.floor(Math.random() * 1_000_000);
//   return NextResponse.json({ ok: true, id: fakeId, candidateId: Number(params.id) });
// }


import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const role = cookies().get("role")?.value;

  // ✅ Only panelist can submit
  if (role !== "panelist") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  if (!body?.overallScore || !body?.strengths || !body?.improvements) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  // Server-side validation (defense in depth)
  const s = Number(body.overallScore);
  if (!Number.isInteger(s) || s < 1 || s > 10) {
    return NextResponse.json({ error: "Score must be an integer 1–10." }, { status: 400 });
  }
  if (String(body.strengths).trim().length < 10 || String(body.improvements).trim().length < 10) {
    return NextResponse.json({ error: "Text inputs must be at least 10 characters." }, { status: 400 });
  }

  // Simulate persistence
  const fakeId = Math.floor(Math.random() * 1_000_000);
  return NextResponse.json({ ok: true, id: fakeId, candidateId: Number(params.id) });
}
