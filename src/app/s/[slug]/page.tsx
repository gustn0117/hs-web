import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/services";
import { SERVICE_SITES, getServiceSite, serviceSiteUrl } from "@/lib/service-sites";
import { getPortfolioItems } from "@/lib/portfolio";
import { DeviceFrames } from "./Placeholders";
import { Band, AudienceCards, DeliverableCards, CaseGrid, CtaBand } from "./parts";

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
  const service = getServiceBySlug(slug);
  if (!site || !service) return {};

  const url = serviceSiteUrl(slug);
  const title = `${site.titleLead} — ${site.heroTitle}`;
  const description = `${site.heroLead} ${service.description}`.slice(0, 155);

  return {
    title: { absolute: title },
    description,
    keywords: site.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: site.siteName,
      locale: "ko_KR",
    },
    robots: { index: true, follow: true },
  };
}

export default async function ServiceSiteHome({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = getServiceSite(slug);
  const service = getServiceBySlug(slug);
  if (!site || !service) notFound();

  const showcase = site.showcaseCategories
    ? (await getPortfolioItems())
        .filter((it) => site.showcaseCategories!.includes(it.category))
        .slice(0, 3)
    : [];

  return (
    <>
      <section className="bg-[#0b1220] text-white">
        <div className="max-w-[1280px] mx-auto px-5 py-16 md:py-24">
          <p className="text-[13px] font-bold text-white/55">{service.title}</p>
          <h1 className="mt-3 text-[30px] md:text-[46px] font-extrabold leading-[1.22] tracking-[-0.035em] max-w-[820px]">
            {site.heroTitle}
          </h1>
          <p className="mt-5 text-[15px] md:text-[17px] text-white/70 leading-[1.8] max-w-[640px]">
            {site.heroLead}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-[50px] px-7 bg-white text-[#0b1220] text-[15px] font-extrabold no-underline hover:bg-white/90 transition-colors"
            >
              상담 신청
            </Link>
            {site.concept && (
              <Link
                href="/about"
                className="inline-flex items-center justify-center h-[50px] px-7 border border-white/40 text-white text-[15px] font-bold no-underline hover:bg-white/10 transition-colors"
              >
                서비스 자세히 보기
              </Link>
            )}
          </div>
          <ul className="list-none m-0 p-0 mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {service.tags.map((t) => (
              <li key={t} className="text-[13px] text-white/55">
                {t}
              </li>
            ))}
          </ul>

          {site.concept && (
            <div className="mt-14">
              <DeviceFrames tone="dark" />
            </div>
          )}
        </div>
      </section>

      <Band overline="이런 경우에" title="이럴 때 필요한 작업입니다">
        <AudienceCards site={site} />
      </Band>

      <Band overline="작업 범위" title="무엇을 해드리는지" tone="soft">
        <DeliverableCards site={site} />
        {site.steps && (
          <p className="mt-6 text-[13.5px]">
            <Link
              href="/process"
              className="text-[var(--c-main)] font-semibold underline underline-offset-2"
            >
              진행 절차 자세히 보기
            </Link>
          </p>
        )}
      </Band>

      {showcase.length > 0 && (
        <Band overline="제작 사례" title="이렇게 만들어 드렸습니다">
          <CaseGrid items={showcase} />
          <p className="mt-6 text-[13.5px]">
            <Link
              href="/cases"
              className="text-[var(--c-main)] font-semibold underline underline-offset-2"
            >
              사례 더 보기
            </Link>
          </p>
        </Band>
      )}

      <Band overline="비용" title="금액은 이렇게 정해집니다" tone="soft">
        <div className="border-l-4 border-[var(--c-main)] bg-white px-5 py-5 md:px-7">
          <p className="text-[15px] md:text-[16px] text-[var(--c-text)] leading-[1.85]">{site.priceNote}</p>
        </div>
        <p className="mt-6 text-[13.5px]">
          <Link
            href="/pricing"
            className="text-[var(--c-main)] font-semibold underline underline-offset-2"
          >
            가격 기준 자세히 보기
          </Link>
        </p>
      </Band>

      <CtaBand siteName={site.siteName} />
    </>
  );
}
