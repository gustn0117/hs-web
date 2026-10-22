import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import HaramAnalytics from "@/components/HaramAnalytics";

/** hsweb.pics 본 사이트의 공통 틀. 서비스 전용 사이트(/s/*)는 자기 틀을 따로 쓴다. */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://hsweb.pics/#organization",
                name: "하온",
                url: "https://hsweb.pics",
                logo: "https://hsweb.pics/icon",
                description:
                  "웹·업무 시스템 제작. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션 개발.",
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
                name: "하온 소프트웨어 솔루션",
                alternateName: ["하온", "하온 홈페이지 제작"],
                publisher: { "@id": "https://hsweb.pics/#organization" },
                inLanguage: "ko-KR",
              },
              {
                "@type": "ProfessionalService",
                "@id": "https://hsweb.pics/#service",
                name: "하온 홈페이지 제작",
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
      <SiteHeader />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
      <GoogleAnalytics />
      <HaramAnalytics />
    </>
  );
}
