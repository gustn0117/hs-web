import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, DefaultSidebar, Section } from "@/components/PageShell";
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
  } catch {
    /* noop */
  }

  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));

  return (
    <PageShell
      breadcrumb={[{ label: "포트폴리오" }]}
      title="포트폴리오"
      caption={`HS WEB이 제작한 ${items.length}개의 프로젝트를 확인하세요.`}
      sidebar={<DefaultSidebar />}
    >
      {/* Category filter */}
      {categories.length > 0 && (
        <section className="border border-[var(--color-border)] bg-white">
          <div className="flex items-center gap-0 overflow-x-auto">
            <button className="p-tab active">전체 <span className="text-[11px] text-[var(--color-muted)] ml-1 tnum">{items.length}</span></button>
            {categories.map((cat) => {
              const count = items.filter((i) => i.category === cat).length;
              return (
                <button key={cat} className="p-tab">
                  {cat}
                  <span className="text-[11px] text-[var(--color-muted)] ml-1 tnum">{count}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <Section title={`전체 프로젝트 (${items.length})`}>
        {items.length === 0 ? (
          <div className="p-4">
            <div className="p-empty">
              포트폴리오가 곧 업데이트됩니다.{" "}
              <Link href="/contact" className="text-[var(--color-point)] font-semibold">견적 문의하기</Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="hidden md:grid grid-cols-[40px_80px_1fr_160px_100px_80px] px-4 py-2 text-[11px] font-semibold text-[var(--color-muted)] bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
              <span className="text-center">번호</span>
              <span>분류</span>
              <span>프로젝트명</span>
              <span>클라이언트</span>
              <span className="text-right">등록일</span>
              <span className="text-center">상세</span>
            </div>
            {items.map((p, i) => (
              <Link
                key={p.id}
                href={`/portfolio/${p.id}`}
                className="md:grid md:grid-cols-[40px_80px_1fr_160px_100px_80px] flex items-center gap-3 px-4 py-2.5 text-[13px] no-underline text-[var(--color-text)] border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg-alt)]"
              >
                <span className="hidden md:inline text-center text-[11px] text-[var(--color-muted)] tnum">
                  {String(items.length - i).padStart(3, "0")}
                </span>
                <span className="hidden md:inline">
                  <span className="p-chip">{p.category || "기타"}</span>
                </span>
                <span className="font-semibold truncate flex-1 min-w-0">
                  {p.title}
                  {p.featured && <span className="ml-1.5 p-chip p-chip-point">HOT</span>}
                  {p.tags?.slice(0, 2).map((t) => (
                    <span key={t} className="ml-1 p-chip hidden md:inline-flex">{t}</span>
                  ))}
                </span>
                <span className="hidden md:inline text-[12px] text-[var(--color-text-2)] truncate">{p.client || "-"}</span>
                <span className="hidden md:inline text-right text-[11px] text-[var(--color-muted)] tnum">{fmtDate(p.createdAt)}</span>
                <span className="hidden md:inline text-center text-[12px] text-[var(--color-point)] font-semibold">보기 →</span>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
