import type { MetadataRoute } from "next";
import { SITE_URL, abs } from "@/lib/site";

/** 로그인이 필요하거나 색인될 이유가 없는 구역 */
const PRIVATE_PATHS = [
  "/admin/",
  "/api/",
  "/client/",
  "/contract/",
  "/register/",
  // 내부 시안. 페이지 자체도 noindex 지만 크롤링부터 막아 둔다.
  "/preview/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        // 네이버. 봇 이름을 따로 적어 두면 서치어드바이저 진단에서 '허용'으로 잡힌다.
        userAgent: "Yeti",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        // 다음·카카오
        userAgent: "Daumoa",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: "bingbot",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    // RSS 도 사이트맵 규격에서 유효한 형식이라 함께 알린다.
    sitemap: [abs("/sitemap.xml"), abs("/feed.xml")],
    host: SITE_URL,
  };
}
