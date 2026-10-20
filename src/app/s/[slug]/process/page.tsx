import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICE_SITES, getServiceSite, serviceSiteUrl } from "@/lib/service-sites";
import { PageHead, Band, StepList, CtaBand } from "../parts";

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
  const title = `${site.titleLead} 진행 절차 | ${site.siteName}`;
  return {
    title: { absolute: title },
    description: "문의부터 공개까지 어떤 순서로 진행되는지 단계별로 안내합니다.",
    alternates: { canonical: `${serviceSiteUrl(slug)}/process` },
    openGraph: { type: "website", title, siteName: site.siteName, locale: "ko_KR" },
  };
}

export default async function ProcessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getServiceSite(slug);
  if (!site || !site.steps) notFound();

  return (
    <>
      <PageHead
        breadcrumb="진행 절차"
        overline="진행 절차"
        title="이런 순서로 진행합니다"
        lead="각 단계마다 확인받고 넘어갑니다. 중간에 방향이 바뀌어도 되돌리기 쉽게 작게 쪼개 진행합니다."
      />
      <Band>
        <StepList site={site} />
      </Band>
      <CtaBand siteName={site.siteName} />
    </>
  );
}
