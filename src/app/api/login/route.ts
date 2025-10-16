

//   import { NextRequest, NextResponse } from "next/server";

// const USERS = [
//   { username: "admin",      password: "1234", role: "admin" },
//   { username: "teamMember", password: "1234", role: "ta_member" },
//   { username: "panel",      password: "1234", role: "panelist" },
// ];

// export async function POST(req: NextRequest) {
//   const { username, password } = await req.json();

//   const user = USERS.find(u => u.username === username && u.password === password);
//   if (!user) {
//     return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
//   }

//   const res = NextResponse.json({ ok: true, role: user.role });

//   // NOTE: In dev over http://localhost, consider secure: false so cookies stick.
//   const cookieOpts = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // <- important for localhost
//     sameSite: "lax" as const,
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7,
//   };

//   res.cookies.set("dj_token", "FAKE_TOKEN_12345", cookieOpts);
//   res.cookies.set("role", user.role, cookieOpts);
//   res.cookies.set("username", user.username, cookieOpts); // ✅ add this

//   return res;
// }


import { NextRequest, NextResponse } from "next/server";

const USERS = [
  { username: "admin",      password: "1234", role: "admin" },
  { username: "teamMember", password: "1234", role: "ta_member" },
  { username: "panel",      password: "1234", role: "panelist" },
];

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, role: user.role });

  // 🍪 Secure cookies for backend checks
  const secureCookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // false on localhost
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };

  res.cookies.set("dj_token", "FAKE_TOKEN_12345", secureCookieOpts);
  res.cookies.set("role", user.role, secureCookieOpts);
  res.cookies.set("username", user.username, secureCookieOpts);

  // 🍪 Add a non-HttpOnly cookie for frontend access control
  res.cookies.set("role_ui", user.role, {
    httpOnly: false, // ✅ must be false so client JS can read it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
