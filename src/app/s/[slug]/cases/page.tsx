import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICE_SITES, getServiceSite, serviceSiteUrl } from "@/lib/service-sites";
import { getPortfolioItems } from "@/lib/portfolio";
import { PageHead, Band, CaseGrid, CtaBand } from "../parts";

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
  const title = `${site.titleLead} 제작 사례 | ${site.siteName}`;
  return {
    title: { absolute: title },
    description: "실제로 만들어 드린 사례를 모았습니다.",
    alternates: { canonical: `${serviceSiteUrl(slug)}/cases` },
    openGraph: { type: "website", title, siteName: site.siteName, locale: "ko_KR" },
  };
}

export default async function CasesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getServiceSite(slug);
  if (!site || !site.showcaseCategories) notFound();

  const items = (await getPortfolioItems()).filter((it) =>
    site.showcaseCategories!.includes(it.category)
  );

  return (
    <>
      <PageHead
        breadcrumb="제작 사례"
        overline="제작 사례"
        title="이렇게 만들어 드렸습니다"
        lead={`${items.length}건을 모았습니다. 각 사례를 누르면 무엇을 어떻게 만들었는지 자세히 볼 수 있습니다.`}
      />
      <Band>
        <CaseGrid items={items} />
        <p className="mt-8 text-[13.5px]">
          <a
            href="https://hsweb.pics/portfolio"
            className="text-[var(--c-main)] font-semibold underline underline-offset-2"
          >
            HS WEB 전체 제작 사례 보기
          </a>
        </p>
      </Band>
      <CtaBand siteName={site.siteName} />
    </>
  );
}
