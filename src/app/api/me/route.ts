import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(cookieHeader.split("; ").map(c => c.split("=")));

  const role = cookies["role"];
  const username = cookies["username"]; 
  return NextResponse.json({ role, username });
}
