import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/services";
import { SERVICE_SITES, getServiceSite, serviceSiteUrl } from "@/lib/service-sites";
import { PageHead, Band, FaqList, CtaBand } from "../parts";

export const revalidate = 3600;

export function generateStaticParams() {
  return SERVICE_SITES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = getServiceSite(slug);
  if (!site) return {};
  const title = `${site.titleLead} 자주 묻는 질문 | ${site.siteName}`;
  return {
    title: { absolute: title },
    description: "상담 전에 자주 받는 질문을 모았습니다.",
    alternates: { canonical: `${serviceSiteUrl(slug)}/faq` },
    openGraph: { type: "website", title, siteName: site.siteName, locale: "ko_KR" },
  };
}

export default async function FaqPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getServiceSite(slug);
  const service = getServiceBySlug(slug);
  if (!site || !service) notFound();

  const faqs = [...site.extraFaqs, ...service.faqs];
  const url = serviceSiteUrl(slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}/faq#faq`,
    mainEntity: site.extraFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHead
        breadcrumb="자주 묻는 질문"
        overline="자주 묻는 질문"
        title="미리 알아두면 좋은 것들"
        lead="여기에 없는 것은 전화나 문의로 물어보시면 바로 답변드립니다."
      />
      <Band>
        <FaqList faqs={faqs} />
      </Band>
      <CtaBand siteName={site.siteName} />
    </>
  );
}
