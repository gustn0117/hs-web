import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* paths (except /admin itself which is the login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const token = request.cookies.get("hs-admin-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Verify token structure (timestamp.hash)
    const parts = token.split(".");
    if (parts.length !== 2) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Check token age (24 hours)
    const timestamp = parseInt(parts[0], 10);
    if (isNaN(timestamp) || Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("hs-admin-token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path+"],
};
