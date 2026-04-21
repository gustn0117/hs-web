import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // favicon.ico → icon (동적 파비콘 재사용, 캐시 재검증 강제)
  if (pathname === "/favicon.ico") {
    const response = NextResponse.rewrite(new URL("/icon", request.url));
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    return response;
  }

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

  // Page view tracking (public pages only, fire-and-forget)
  const shouldTrack =
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/client") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".");

  if (shouldTrack) {
    const trackUrl = new URL("/api/track", request.url);
    fetch(trackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
        "cf-connecting-ip": request.headers.get("cf-connecting-ip") || "",
        "x-real-ip": request.headers.get("x-real-ip") || "",
        "user-agent": request.headers.get("user-agent") || "",
      },
      body: JSON.stringify({ site: "hs-web", path: pathname }),
    }).catch(() => {});
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/favicon.ico", "/admin/:path+", "/client/dashboard/:path*", "/((?!_next|api|favicon).*)"],
};
