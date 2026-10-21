"use client";

import { Suspense, useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * GA4(gtag.js) 설치.
 *
 * - 측정 ID가 없으면 아무것도 싣지 않는다. 가짜 ID로 배포되는 일이 없게 한다.
 * - 개발·미리보기에서는 켜지 않아 운영 통계에 테스트 방문이 섞이지 않는다.
 * - 자동 page_view를 끄고 주소가 바뀔 때마다 직접 한 번만 보낸다.
 *   (SPA 이동까지 세려면 이 방식이 필요하다. GA4 관리 화면에서
 *    향상된 측정의 "브라우저 기록 변경"을 꺼야 중복 집계되지 않는다.)
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** 주소에 토큰이나 개인 정보가 담기는 구역은 보내지 않는다. */
const PRIVATE_PREFIXES = ["/admin", "/client", "/contract", "/register"];

function isPrivate(pathname: string) {
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/** gtag.js가 아직 안 떴어도 큐에 쌓이도록 직접 dataLayer에 넣는다. */
function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (isPrivate(pathname)) return;

    const qs = searchParams.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    // 같은 주소로 다시 그려져도 두 번 세지 않는다.
    if (lastSent.current === path) return;
    lastSent.current = path;

    gtag("event", "page_view", {
      page_location: `${window.location.origin}${path}`,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  const pathname = usePathname();

  if (!GA_ID || process.env.NODE_ENV !== "production") return null;
  if (isPrivate(pathname)) return null;

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { send_page_view: false });`}
      </Script>
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
    </>
  );
}
