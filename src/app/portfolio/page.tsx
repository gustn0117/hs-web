import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/PageShell";
import { getPortfolioItems, PortfolioItem } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "포트폴리오 - 홈페이지 제작 사례",
  description:
    "HS WEB이 제작한 홈페이지 포트폴리오를 확인하세요. 다양한 산업군의 클라이언트와 함께한 반응형 홈페이지, 쇼핑몰, 랜딩페이지 프로젝트를 소개합니다.",
  keywords: ["홈페이지 제작 포트폴리오", "웹사이트 제작 사례", "홈페이지 디자인 포트폴리오", "웹에이전시 포트폴리오"],
  alternates: { canonical: "https://hsweb.pics/portfolio" },
};

function fmtDate(iso: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default async function PortfolioPage() {
  let items: PortfolioItem[] = [];
  try {
    items = await getPortfolioItems();
  } catch { /* noop */ }

  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
  const featured = items.find((i) => i.featured) || items[0];
  const rest = featured ? items.filter((i) => i.id !== featured.id) : items;

  return (
    <PageShell
      breadcrumb={[{ label: "포트폴리오" }]}
      overline="PORTFOLIO"
      title="숫자로 증명하는 작업물."
      subtitle="실제 클라이언트와 함께한 프로젝트를 확인하세요. 각 프로젝트의 배경과 결과를 투명하게 공개합니다."
      stats={[
        { label: "총 프로젝트", value: String(items.length), suffix: "건" },
        { label: "분야", value: String(categories.length || 0), suffix: "개" },
        { label: "평균 만족도", value: "5.0", suffix: "/ 5.0" },
        { label: "재의뢰율", value: "95", suffix: "%" },
      ]}
    >
      {items.length === 0 ? (
        <div className="p-card p-12 text-center">
          <p className="text-[15px] text-[var(--c-sub)] mb-4">포트폴리오가 곧 업데이트됩니다.</p>
          <Link href="/contact" className="p-btn p-btn-dark">첫 프로젝트 상담 신청</Link>
        </div>
      ) : (
        <>
          {/* Featured work — magazine hero */}
          {featured && (
            <Section>
              <Link href={`/portfolio/${featured.id}`} className="no-underline block group">
                <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-stretch">
                  <div className="p-showcase !rounded-[16px] relative min-h-[320px]">
                    {featured.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featured.thumbnail} alt={featured.title} />
                    ) : (
                      <div className="w-full h-full bg-[var(--c-bg-2)]" />
                    )}
                    <span className="absolute top-5 left-5 b-hot">FEATURED</span>
                  </div>
                  <div className="flex flex-col justify-center py-4">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="p-chip p-chip-point">{featured.category || "프로젝트"}</span>
                      <span className="text-[12px] text-[var(--c-sub)] tnum">{fmtDate(featured.createdAt)}</span>
                    </div>
                    <h2 className="text-[30px] md:text-[38px] font-bold tracking-[-0.035em] leading-[1.2] mb-4">
                      {featured.title}
                    </h2>
                    <p className="text-[15px] text-[var(--c-text-2)] leading-[1.7] mb-6 max-w-[520px]">
                      {featured.description || featured.client || "프로젝트 상세 페이지에서 자세한 내용을 확인하세요."}
                    </p>
                    {featured.tags && featured.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {featured.tags.slice(0, 5).map((t) => (
                          <span key={t} className="p-chip">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--c-text)] p-anim-link">
                      프로젝트 자세히 보기
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </Section>
          )}

          {/* Category filter + list */}
          {rest.length > 0 && (
            <Section overline="ALL WORKS" title={`전체 프로젝트 ${items.length}`}>
              {categories.length > 0 && (
                <div className="flex items-center gap-0 overflow-x-auto border-b border-[var(--c-line)] mb-6">
                  <button className="p-tab active">전체 <span className="text-[11px] text-[var(--c-sub-2)] ml-1 tnum">{items.length}</span></button>
                  {categories.map((cat) => {
                    const count = items.filter((i) => i.category === cat).length;
                    return (
                      <button key={cat} className="p-tab">
                        {cat}
                        <span className="text-[11px] text-[var(--c-sub-2)] ml-1 tnum">{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/portfolio/${p.id}`}
                    className="group no-underline block"
                  >
                    <div className="p-showcase !aspect-square !rounded-[12px] mb-3 relative">
                      {p.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumbnail} alt={p.title} />
                      ) : (
                        <div className="w-full h-full bg-[var(--c-bg-2)]" />
                      )}
                      <span className="absolute top-3 left-3 p-chip !bg-white/95 !border-white/95">
                        {p.category || "기타"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[var(--c-sub)] mb-1">
                      <span className="tnum">{String(rest.length - i).padStart(3, "0")}</span>
                      <span>·</span>
                      <span className="tnum">{fmtDate(p.createdAt)}</span>
                    </div>
                    <h3 className="text-[17px] font-bold tracking-tight text-[var(--c-text)] line-clamp-1 group-hover:underline underline-offset-2 mb-0.5">
                      {p.title}
                    </h3>
                    <p className="text-[13px] text-[var(--c-sub)] line-clamp-1">{p.client || p.description || "-"}</p>
                  </Link>
                ))}
              </div>
            </Section>
          )}
        </>
      )}
    </PageShell>
  );
}
