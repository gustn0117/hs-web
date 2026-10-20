import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICE_SITES, getServiceSite, serviceSiteUrl } from "@/lib/service-sites";
import { PageHead, Band, GlossaryList, CtaBand } from "../parts";

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
  const title = `${site.titleLead} 용어 풀이 | ${site.siteName}`;
  return {
    title: { absolute: title },
    description: "상담하면서 자주 나오는 말들을 쉬운 말로 풀었습니다.",
    alternates: { canonical: `${serviceSiteUrl(slug)}/glossary` },
    openGraph: { type: "website", title, siteName: site.siteName, locale: "ko_KR" },
  };
}

export default async function GlossaryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getServiceSite(slug);
  if (!site || !site.glossary) notFound();

  return (
    <>
      <PageHead
        breadcrumb="용어 풀이"
        overline="용어 풀이"
        title="상담하면서 자주 나오는 말들"
        lead="몰라도 진행에는 문제없습니다. 다만 알고 계시면 견적서를 읽기가 훨씬 수월합니다."
      />
      <Band>
        <GlossaryList site={site} />
      </Band>
      <CtaBand siteName={site.siteName} />
    </>
  );
}
