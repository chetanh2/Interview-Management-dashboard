// import { NextRequest, NextResponse } from "next/server";

// export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     // ✅ 1. Validate and sanitize the ID to prevent injection or abuse
//     const id = Number(params.id);
//     if (Number.isNaN(id) || id <= 0) {
//       return NextResponse.json({ error: "Invalid candidate ID" }, { status: 400 });
//     }

//     // ✅ 2. Fetch data safely from DummyJSON (no caching for fresh data)
//     const r = await fetch(`https://dummyjson.com/users/${id}`, { cache: "no-store" });

//     if (!r.ok) {
//       return NextResponse.json(
//         { error: `Failed to fetch candidate ${id}` },
//         { status: r.status }
//       );
//     }

//     const u = await r.json();

//     // ✅ 3. Map and return only necessary fields — avoid leaking anything sensitive
//     const user = {
//       id: u.id,
//       firstName: u.firstName,
//       lastName: u.lastName,
//       email: u.email,
//       phone: u.phone,
//       age: u.age,
//       gender: u.gender,
//       image: u.image,
//       company: {
//         name: u.company?.name || null,
//         department: u.company?.department || null,
//         title: u.company?.title || null,
//       },
//     };

//     return NextResponse.json(user);
//   } catch (err: any) {
//     console.error("❌ Candidate API error:", err.message);
//     return NextResponse.json(
//       { error: "Internal Server Error while fetching candidate" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("search") || "").trim();
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 10), 1), 50);
    const skip = Math.max(Number(url.searchParams.get("skip") || 0), 0);

    // Build DummyJSON URL
    const base = q
      ? `https://dummyjson.com/users/search?q=${encodeURIComponent(q)}`
      : `https://dummyjson.com/users`;
    const dummyUrl = `${base}&limit=${limit}&skip=${skip}`;

    const r = await fetch(dummyUrl, { cache: "no-store" });
    if (!r.ok) return NextResponse.json({ error: "Users fetch failed" }, { status: r.status });
    const j = await r.json();

    // Only return minimal fields
    const users = (j.users || j || []).map((u: any) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      image: u.image,
      company: {
        name: u.company?.name || null,
        department: u.company?.department || null,
        title: u.company?.title || null,
      },
    }));

    return NextResponse.json({
      users,
      total: j.total ?? users.length,
      limit,
      skip,
      q,
    });
  } catch (e) {
    return NextResponse.json({ error: "Internal error fetching users" }, { status: 500 });
  }
}
