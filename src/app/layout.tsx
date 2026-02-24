import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "HS WEB | 웹사이트 제작 전문 - 홈페이지 제작, 반응형 웹디자인",
  description:
    "HS WEB은 고품질 홈페이지 제작, 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지 제작 전문 웹에이전시입니다. 합리적인 가격으로 최고의 결과물을 제공합니다.",
  keywords:
    "홈페이지 제작, 웹사이트 제작, 반응형 웹디자인, 쇼핑몰 제작, 랜딩페이지, 웹에이전시, HS WEB",
  authors: [{ name: "HS WEB" }],
  openGraph: {
    type: "website",
    title: "HS WEB | 웹사이트 제작 전문",
    description:
      "고품질 홈페이지 제작, 반응형 웹디자인, 쇼핑몰 구축 전문 웹에이전시",
    url: "https://hsweb.pics",
    siteName: "HS WEB",
    locale: "ko_KR",
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
              "@type": "WebDesign",
              name: "HS WEB",
              description:
                "고품질 홈페이지 제작, 반응형 웹디자인, 쇼핑몰 구축 전문 웹에이전시",
              url: "https://hsweb.pics",
              address: {
                "@type": "PostalAddress",
                addressLocality: "서울",
                addressCountry: "KR",
              },
            }),
          }}
        />
      </head>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
