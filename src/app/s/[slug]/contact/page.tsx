import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICE_SITES, getServiceSite, serviceSiteUrl } from "@/lib/service-sites";
import ContactForm from "@/app/(main)/contact/ContactForm";
import { PageHead, Band } from "../parts";

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
  const title = `${site.titleLead} 문의 | ${site.siteName}`;
  return {
    title: { absolute: title },
    description: "연락처와 필요한 내용을 남겨주시면 영업일 기준 24시간 안에 회신드립니다.",
    alternates: { canonical: `${serviceSiteUrl(slug)}/contact` },
    openGraph: { type: "website", title, siteName: site.siteName, locale: "ko_KR" },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getServiceSite(slug);
  if (!site) notFound();

  return (
    <>
      <PageHead
        breadcrumb="문의"
        overline="문의"
        title="어떤 작업이 필요한지 알려주세요"
        lead="영업일 기준 24시간 안에 회신드립니다. 바로 통화를 원하시면 평일 10시부터 19시 사이에 전화 주셔도 됩니다."
      />
      <Band>
        <ContactForm defaultCategory={slug} />
      </Band>
    </>
  );
}
