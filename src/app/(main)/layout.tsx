import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import HaramAnalytics from "@/components/HaramAnalytics";
import { services } from "@/lib/services";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DISPLAY_NAME,
  OWNER_NAME,
  CONTACT_PHONE_E164,
  abs,
} from "@/lib/site";

/** haonlabs.com 본 사이트의 공통 틀. */

/**
 * 사이트 전체에 한 번만 나가는 구조화 데이터.
 * 서비스 목록은 lib/services 에서 끌어오므로 서비스가 늘면 자동으로 따라온다.
 */
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ["하온랩스", "HAON", "HAON Labs"],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: abs("/brand/haon-logo.png"),
        width: 751,
        height: 240,
      },
      image: abs("/opengraph-image"),
      description:
        "웹·업무 시스템 제작. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션 개발.",
      founder: { "@type": "Person", name: OWNER_NAME },
      telephone: CONTACT_PHONE_E164,
      address: {
        "@type": "PostalAddress",
        addressLocality: "서울",
        addressCountry: "KR",
      },
      areaServed: { "@type": "Country", name: "KR" },
      knowsLanguage: ["ko", "en"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: CONTACT_PHONE_E164,
        url: abs("/contact"),
        availableLanguage: "Korean",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_DISPLAY_NAME,
      alternateName: [SITE_NAME, "하온 홈페이지 제작", "하온랩스"],
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "ko-KR",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: "하온 홈페이지 제작",
      url: SITE_URL,
      provider: { "@id": `${SITE_URL}/#organization` },
      serviceType: "홈페이지 제작",
      areaServed: { "@type": "Country", name: "KR" },
      telephone: CONTACT_PHONE_E164,
      priceRange: "₩₩",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "19:00",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "웹사이트 제작 서비스",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            description: s.description,
            url: abs(`/services/${s.slug}`),
            provider: { "@id": `${SITE_URL}/#organization` },
            areaServed: { "@type": "Country", name: "KR" },
          },
        })),
      },
    },
  ],
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
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
