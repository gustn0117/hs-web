import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const SITE_URL = "https://hsweb.pics";
const SITE_NAME = "HS WEB";
/** 검색 결과에 표시되는 사이트 이름. 구글은 WebSite 구조화 데이터와 og:site_name을 본다. */
const SITE_DISPLAY_NAME = "HS WEB 웹에이전시";
const DEFAULT_DESCRIPTION =
  "홈페이지 제작 전문 웹에이전시 HS WEB. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션 개발까지. 합리적인 가격과 무료 유지보수로 비즈니스 성장에 필요한 모든 웹 솔루션을 제공합니다.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "홈페이지 제작 전문 웹에이전시 | HS WEB - 반응형 웹사이트, 쇼핑몰 구축",
    template: "%s | HS WEB",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "홈페이지 제작",
    "홈페이지 제작 업체",
    "홈페이지 제작 비용",
    "웹사이트 제작",
    "반응형 웹디자인",
    "쇼핑몰 제작",
    "쇼핑몰 구축",
    "랜딩페이지 제작",
    "홈페이지 리뉴얼",
    "웹에이전시",
    "웹사이트 디자인",
    "기업 홈페이지",
    "모바일 웹사이트",
    "SEO 최적화",
    "기술 마케팅",
    "HS WEB",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/apple-icon?v=2",
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  other: {
    "theme-color": "#0f1a2d",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": SITE_NAME,
  },
  openGraph: {
    type: "website",
    title: "홈페이지 제작 전문 웹에이전시 | HS WEB",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_DISPLAY_NAME,
    locale: "ko_KR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "HS WEB - 홈페이지 제작 전문 웹에이전시",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "홈페이지 제작 전문 웹에이전시 | HS WEB",
    description: DEFAULT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    other: {
      "naver-site-verification": ["9e9ba54205fecadd9d81829473d63ad96fbf0fef"],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className={`${notoSansKR.variable} antialiased`} style={{ fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
