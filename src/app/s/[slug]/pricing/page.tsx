import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICE_SITES, getServiceSite, serviceSiteUrl } from "@/lib/service-sites";
import { PageHead, Band, CtaBand } from "../parts";

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
  const title = `${site.titleLead} 가격 | ${site.siteName}`;
  return {
    title: { absolute: title },
    description: "금액이 어떻게 정해지는지와 별도로 드는 비용을 정리했습니다.",
    alternates: { canonical: `${serviceSiteUrl(slug)}/pricing` },
    openGraph: { type: "website", title, siteName: site.siteName, locale: "ko_KR" },
  };
}

const EXTRA = [
  { label: "도메인", desc: "인터넷 주소. 연 2만 원 내외로 매년 갱신합니다." },
  { label: "호스팅", desc: "홈페이지가 올라가는 서버 자리. 규모에 따라 월 1만 원대부터입니다." },
  { label: "SSL 인증서", desc: "주소창 자물쇠 표시. 무료로 발급하지만 설정 작업은 포함됩니다." },
  { label: "유지보수", desc: "글자 수정, 사진 교체 같은 잔손질은 기간 제한 없이 무료입니다." },
  { label: "검색 노출 작업", desc: "네이버·구글 등록과 수집 요청. 코드 안쪽 작업은 기본 포함입니다." },
];

export default async function PricingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getServiceSite(slug);
  if (!site) notFound();

  return (
    <>
      <PageHead
        breadcrumb="가격"
        overline="가격"
        title="금액은 이렇게 정해집니다"
        lead="정해진 표를 먼저 보여드리기보다, 무엇이 금액을 움직이는지 먼저 말씀드립니다."
      />

      <Band>
        <div className="border-l-4 border-[var(--c-main)] bg-[var(--c-main-bg)] px-5 py-6 md:px-7">
          <p className="text-[15px] md:text-[17px] text-[var(--c-text)] leading-[1.85]">{site.priceNote}</p>
        </div>
      </Band>

      <Band overline="별도 비용" title="제작비와 따로 드는 것들" tone="soft" lead="견적서에서 빠지기 쉬운 항목입니다. 계약 전에 확인하시는 편이 좋습니다.">
        <dl className="m-0 border-t border-[var(--c-line)]">
          {EXTRA.map((e) => (
            <div
              key={e.label}
              className="grid gap-1 md:grid-cols-[200px_1fr] md:gap-6 border-b border-[var(--c-line)] py-4"
            >
              <dt className="text-[14.5px] font-bold text-[var(--c-text)]">{e.label}</dt>
              <dd className="m-0 text-[13.5px] text-[var(--c-sub)] leading-[1.85]">{e.desc}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[13.5px] text-[var(--c-sub)]">
          하온 전체 가격 기준은{" "}
          <a
            href="https://hsweb.pics/pricing"
            className="text-[var(--c-main)] font-semibold underline underline-offset-2"
          >
            본 사이트 가격 안내
          </a>
          에서 확인하실 수 있습니다.
        </p>
      </Band>

      <CtaBand siteName={site.siteName} />
    </>
  );
}
