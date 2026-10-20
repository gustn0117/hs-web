import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, getAllServiceSlugs, services } from "@/lib/services";
import ServiceDetailClient from "./ServiceDetailClient";

const SITE_URL = "https://hsweb.pics";

// SEO keyword map per service slug
const SEO_KEYWORDS: Record<string, string[]> = {
  "responsive-web": [
    "반응형 홈페이지 제작",
    "홈페이지 제작",
    "홈페이지 제작 업체",
    "반응형 웹디자인",
    "모바일 웹사이트",
    "기업 홈페이지 제작",
    "웹사이트 제작",
  ],
  ecommerce: [
    "쇼핑몰 제작",
    "쇼핑몰 구축",
    "온라인 쇼핑몰",
    "쇼핑몰 제작 업체",
    "PG 결제 연동",
    "카페24 대안",
    "쇼핑몰 개발",
  ],
  "landing-page": [
    "랜딩페이지 제작",
    "랜딩페이지 디자인",
    "전환율 최적화",
    "마케팅 페이지",
    "광고 랜딩페이지",
    "원페이지 제작",
  ],
  "web-app": [
    "웹 애플리케이션 개발",
    "웹앱 제작",
    "React 개발",
    "Next.js 개발",
    "SPA 개발",
    "프론트엔드 개발",
  ],
  cms: [
    "CMS 구축",
    "콘텐츠 관리 시스템",
    "관리자 페이지 제작",
    "맞춤형 CMS",
    "워드프레스 대안",
    "CMS 개발",
  ],
  enterprise: [
    "기업 관리 시스템",
    "ERP 개발",
    "CRM 개발",
    "업무 자동화",
    "기업 맞춤 시스템",
    "사내 시스템 개발",
  ],
  marketing: [
    "기술 마케팅",
    "SEO 최적화",
    "검색엔진 최적화",
    "백링크 구축",
    "SEO 대행",
    "검색 순위 최적화",
    "구글 SEO",
    "네이버 SEO",
  ],
};

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const title = `${service.title} - 홈페이지 제작 전문`;
  const description = service.description;
  const url = `${SITE_URL}/services/${slug}`;
  const keywords = SEO_KEYWORDS[slug] ?? [];

  return {
    title,
    description,
    keywords: [...keywords, "HS WEB", "웹에이전시"],
    alternates: { canonical: url },
    openGraph: {
      title: `${service.title} | HS WEB`,
      description,
      url,
      type: "website",
      siteName: "HS WEB",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | HS WEB`,
      description,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const currentIdx = services.findIndex((s) => s.slug === slug);
  const prev = currentIdx > 0 ? services[currentIdx - 1] : null;
  const next = currentIdx < services.length - 1 ? services[currentIdx + 1] : null;

  // JSON-LD: Service + FAQPage schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        description: service.description,
        url: `${SITE_URL}/services/${slug}`,
        provider: {
          "@type": "Organization",
          name: "HS WEB",
          url: SITE_URL,
        },
        areaServed: { "@type": "Country", name: "KR" },
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "홈",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "서비스",
            item: `${SITE_URL}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: `${SITE_URL}/services/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceDetailClient
        service={service}
        prevService={prev ? { slug: prev.slug, title: prev.title } : null}
        nextService={next ? { slug: next.slug, title: next.title } : null}
      />
    </>
  );
}
