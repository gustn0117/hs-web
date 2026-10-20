import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ThumbPlaceholder from "@/components/ThumbPlaceholder";
import { getPublishedPosts } from "@/lib/posts";
import { GUIDES } from "@/lib/guides";
import { PageShell } from "@/components/PageShell";

const SITE_URL = "https://hsweb.pics";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "정보공유 - 홈페이지 제작 정보와 가이드",
  description:
    "홈페이지 제작 비용, 진행 절차, 도메인·호스팅, 네임서버 변경, 검색엔진 최적화, PG 연동까지 실제로 자주 받는 질문을 정리했습니다. HS WEB이 현장에서 겪은 기준으로 씁니다.",
  alternates: { canonical: `${SITE_URL}/insights` },
  openGraph: {
    type: "website",
    title: "정보공유 | HS WEB",
    description: "홈페이지 제작에 필요한 정보와 사례를 정리한 글 모음입니다.",
    url: `${SITE_URL}/insights`,
    siteName: "HS WEB 웹에이전시",
    locale: "ko_KR",
  },
};

function fmtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default async function InsightsPage() {
  const posts = await getPublishedPosts();
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];
  const regions = [...new Set(posts.map((p) => p.region).filter(Boolean))];

  return (
    <PageShell
      breadcrumb={[{ label: "정보공유" }]}
      title="정보공유"
      subtitle="홈페이지 제작을 준비하며 자주 묻는 것들을 현장 기준으로 정리했습니다."
    >
      {posts.length > 0 && (
        <section className="mb-14">
          <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--c-text)] mb-4">새 글</h2>
          {(categories.length > 0 || regions.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5 mb-6">
              {categories.map((c) => (
                <span key={c} className="inline-flex items-center h-7 px-2.5 rounded-full bg-[var(--c-main-soft)] text-[var(--c-main)] text-[12px] font-semibold">
                  {c}
                </span>
              ))}
              {regions.map((r) => (
                <span key={r} className="inline-flex items-center h-7 px-2.5 rounded-full bg-[var(--c-bg-2)] text-[var(--c-text-2)] text-[12px]">
                  {r}
                </span>
              ))}
            </div>
          )}

          <ul className="list-none m-0 p-0 border-t border-[var(--c-line)]">
            {posts.map((p) => (
              <li key={p.id} className="border-b border-[var(--c-line)]">
                <Link href={`/insights/${p.seq}`} className="block py-6 no-underline group">
                  <div className="flex items-center gap-2 text-[12px] text-[var(--c-sub)]">
                    {p.category && <span className="font-semibold text-[var(--c-main)]">{p.category}</span>}
                    {p.region && <span>{p.region}</span>}
                    <span className="tnum">{fmtDate(p.publishedAt)}</span>
                  </div>
                  <h3 className="mt-2 text-[19px] md:text-[22px] font-extrabold tracking-[-0.03em] text-[var(--c-text)] group-hover:text-[var(--c-main)] transition-colors">
                    {p.title}
                  </h3>
                  {p.summary && (
                    <p className="mt-2 text-[14px] md:text-[15px] text-[var(--c-sub)] leading-[1.7] line-clamp-2">{p.summary}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--c-text)]">제작 가이드</h2>
        <p className="mt-1.5 text-[14px] text-[var(--c-sub)] leading-[1.7]">
          제작을 준비하거나 홈페이지를 운영하며 자주 막히는 부분을 주제별로 정리해뒀습니다.
        </p>

        <ul className="list-none m-0 p-0 mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="flex flex-col h-full border border-[var(--c-line)] bg-white no-underline group hover:border-[var(--c-main)] transition-colors"
              >
                {g.image ? (
                  <Image
                    src={g.image}
                    alt=""
                    width={640}
                    height={400}
                    className="w-full aspect-[16/10] object-cover border-b border-[var(--c-line)]"
                  />
                ) : (
                  <ThumbPlaceholder />
                )}
                <div className="flex-1 px-5 py-4">
                  <span className="block text-[12px] font-semibold text-[var(--c-main)]">{g.tag}</span>
                  <span className="block mt-1.5 text-[15px] md:text-[16px] font-bold text-[var(--c-text)] group-hover:text-[var(--c-main)] transition-colors">
                    {g.title}
                  </span>
                  <span className="block mt-1.5 text-[13.5px] text-[var(--c-sub)] leading-[1.7]">{g.summary}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
