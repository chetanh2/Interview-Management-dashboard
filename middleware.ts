// import { NextResponse, NextRequest } from "next/server";

// export const config = {
//   matcher: ["/admin/:path*", "/ta_member/:path*", "/panelist/:path*"],
// };

// export function middleware(req: NextRequest) {
//   const role = req.cookies.get("role")?.value;
//   const token = req.cookies.get("dj_token")?.value;

//   // Not logged in? Send to /login
//   if (!token || !role) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   const pathname = req.nextUrl.pathname;

//   // Enforce role-based access
//   if (pathname.startsWith("/admin") && role !== "admin") {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
//   if (pathname.startsWith("/ta_member") && role !== "ta_member") {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
//   if (pathname.startsWith("/panelist") && role !== "panelist") {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }


// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export const config = {
  // Only guard the role-specific dashboards.
  matcher: ["/admin/:path*", "/ta_member/:path*", "/panelist/:path*"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get("role")?.value;
  const token = req.cookies.get("dj_token")?.value;

  // Public routes (DO NOT guard)
  const publicPaths = ["/login", "/register"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p))
    || pathname.startsWith("/_next")
    || pathname.startsWith("/api")           // allow API; guard inside handlers if needed
    || pathname.startsWith("/images")
    || pathname === "/favicon.ico";

  if (isPublic) return NextResponse.next();

  // Not logged in? Send to /login
  if (!token || !role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Enforce role-based dashboard access
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));      // go home, home will redirect by role
  }
  if (pathname.startsWith("/ta_member") && role !== "ta_member") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/panelist") && role !== "panelist") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
