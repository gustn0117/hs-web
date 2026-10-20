import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/services";
import { SERVICE_SITES, getServiceSite, serviceSiteUrl } from "@/lib/service-sites";
import { PageHead, Band, DeliverableCards, FeatureGrid, CtaBand } from "../parts";

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
  const title = `${site.titleLead} 서비스 소개 | ${site.siteName}`;
  return {
    title: { absolute: title },
    description: "무엇을 하는 작업인지, 무엇이 포함되는지 정리했습니다.",
    alternates: { canonical: `${serviceSiteUrl(slug)}/about` },
    openGraph: { type: "website", title, siteName: site.siteName, locale: "ko_KR" },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getServiceSite(slug);
  const service = getServiceBySlug(slug);
  if (!site || !service || !site.concept) notFound();
  const c = site.concept;

  return (
    <>
      <PageHead
        breadcrumb="서비스 소개"
        overline="서비스 소개"
        title={c.plain}
        lead={`이걸 업계에서는 ${c.term}이라고 부릅니다.`}
      />

      <Band>
        <p className="text-[15px] md:text-[17px] text-[var(--c-text-2)] leading-[1.95] max-w-[760px]">
          {c.detail}
        </p>
        <ul className="list-none m-0 p-0 mt-10 grid gap-px bg-[var(--c-line)] border border-[var(--c-line)] md:grid-cols-3">
          {c.points.map((pt) => (
            <li key={pt.label} className="bg-white px-5 py-6">
              <p className="text-[14.5px] font-bold text-[var(--c-text)]">{pt.label}</p>
              <p className="mt-2 text-[13px] text-[var(--c-sub)] leading-[1.8]">{pt.desc}</p>
            </li>
          ))}
        </ul>
      </Band>

      <Band overline="작업 범위" title="무엇을 해드리는지" tone="soft">
        <DeliverableCards site={site} />
      </Band>

      <Band overline="포함 사항" title="기본으로 들어가는 것들">
        <FeatureGrid service={service} />
        <div className="mt-8">
          <p className="text-[12px] font-bold text-[var(--c-main)] mb-2.5">사용하는 기술</p>
          <ul className="list-none m-0 p-0 flex flex-wrap gap-1.5">
            {service.technologies.map((t) => (
              <li
                key={t}
                className="inline-flex items-center h-7 px-2.5 bg-[var(--c-bg-2)] text-[12px] font-semibold text-[var(--c-text-2)]"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Band>

      <CtaBand siteName={site.siteName} />
    </>
  );
}
