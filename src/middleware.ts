import { NextRequest, NextResponse } from "next/server";

/** 서비스별 전용 사이트. 예) marketing.hsweb.pics → /s/marketing */
const SERVICE_HOSTS = new Set([
  "responsive-web",
  "ecommerce",
  "landing-page",
  "web-app",
  "cms",
  "enterprise",
  "marketing",
]);

function serviceSlugOf(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (!host.endsWith(".hsweb.pics")) return null;
  const sub = host.slice(0, -".hsweb.pics".length);
  return SERVICE_HOSTS.has(sub) ? sub : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const serviceSlug = serviceSlugOf(request);
  if (serviceSlug && !pathname.startsWith("/s/")) {
    // 이미지·폰트 같은 파일은 본 사이트와 같은 경로에서 그대로 내려준다.
    const isMeta = pathname === "/sitemap.xml" || pathname === "/robots.txt";
    if (!pathname.includes(".") || isMeta) {
      const url = request.nextUrl.clone();
      url.pathname = `/s/${serviceSlug}${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
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
  matcher: ["/admin/:path+", "/client/dashboard/:path*", "/((?!_next|api|favicon).*)"],
};
