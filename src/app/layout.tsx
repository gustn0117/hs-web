import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const SITE_URL = "https://hsweb.pics";
const SITE_NAME = "하온";
/** 검색 결과에 표시되는 사이트 이름. 구글은 WebSite 구조화 데이터와 og:site_name을 본다. */
const SITE_DISPLAY_NAME = "하온 소프트웨어 솔루션";
const DEFAULT_DESCRIPTION =
  "웹·업무 시스템을 만드는 하온. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션 개발까지. 합리적인 가격과 무료 유지보수로 비즈니스 성장에 필요한 모든 웹 솔루션을 제공합니다.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "홈페이지·업무 시스템 제작 | 하온 HAON - 쇼핑몰, 랜딩페이지, CRM",
    template: "%s | 하온",
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
    "하온",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/icon.png?v=3", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=3",
    // app/apple-icon.png 은 확장자까지 붙은 주소로 서비스된다. /apple-icon 은 404다.
    apple: "/apple-icon.png?v=3",
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
    title: "홈페이지·업무 시스템 제작 | 하온 HAON",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_DISPLAY_NAME,
    locale: "ko_KR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "하온 HAON - 웹·업무 시스템 제작",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "홈페이지·업무 시스템 제작 | 하온 HAON",
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
