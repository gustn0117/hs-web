import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const SITE_URL = "https://hsweb.pics";
const SITE_NAME = "HS WEB";
const DEFAULT_DESCRIPTION =
  "홈페이지 제작 전문 웹에이전시 HS WEB. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션 개발까지. 합리적인 가격, 무료 유지보수, SEO 최적화 기본 적용.";

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
  alternates: {
    canonical: SITE_URL,
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
    siteName: SITE_NAME,
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
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
    other: {
      "naver-site-verification": ["YOUR_NAVER_VERIFICATION_CODE"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://hsweb.pics/#organization",
                  name: "HS WEB",
                  url: "https://hsweb.pics",
                  logo: "https://hsweb.pics/icon",
                  description:
                    "홈페이지 제작 전문 웹에이전시. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션 개발.",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "서울",
                    addressCountry: "KR",
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    url: "https://hsweb.pics/contact",
                    availableLanguage: "Korean",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://hsweb.pics/#website",
                  url: "https://hsweb.pics",
                  name: "HS WEB",
                  publisher: { "@id": "https://hsweb.pics/#organization" },
                  inLanguage: "ko-KR",
                },
                {
                  "@type": "ProfessionalService",
                  "@id": "https://hsweb.pics/#service",
                  name: "HS WEB 홈페이지 제작",
                  provider: { "@id": "https://hsweb.pics/#organization" },
                  serviceType: "홈페이지 제작",
                  areaServed: { "@type": "Country", name: "KR" },
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "웹사이트 제작 서비스",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "반응형 홈페이지 제작",
                          description: "PC, 태블릿, 모바일 모든 디바이스에서 완벽한 반응형 홈페이지 제작",
                          url: "https://hsweb.pics/services/responsive-web",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "쇼핑몰 구축",
                          description: "PG 결제 연동, 상품 관리, 회원 시스템 포함 온라인 쇼핑몰 구축",
                          url: "https://hsweb.pics/services/ecommerce",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "랜딩페이지 제작",
                          description: "전환율 극대화 고성능 랜딩페이지 제작",
                          url: "https://hsweb.pics/services/landing-page",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "기술 마케팅",
                          description: "검색엔진 최적화(SEO), 백링크 구축, 기술적 마케팅",
                          url: "https://hsweb.pics/services/marketing",
                        },
                      },
                    ],
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
