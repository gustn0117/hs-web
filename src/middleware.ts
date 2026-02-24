import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const token = request.cookies.get("hs-admin-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    const timestamp = parseInt(parts[0], 10);
    if (isNaN(timestamp) || Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("hs-admin-token");
      return response;
    }
  }

  // Client portal protection
  if (pathname.startsWith("/client/dashboard") || pathname.startsWith("/client/api")) {
    const token = request.cookies.get("hs-client-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/client", request.url));
    }

    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) {
      return NextResponse.redirect(new URL("/client", request.url));
    }

    const payload = token.substring(0, lastDot);
    const parts = payload.split(":");
    if (parts.length !== 2) {
      return NextResponse.redirect(new URL("/client", request.url));
    }

    const timestamp = parseInt(parts[1], 10);
    if (isNaN(timestamp) || Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      const response = NextResponse.redirect(new URL("/client", request.url));
      response.cookies.delete("hs-client-token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path+", "/client/dashboard/:path*"],
};
