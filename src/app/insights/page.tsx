import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { PageShell } from "@/components/PageShell";

const SITE_URL = "https://hsweb.pics";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "정보공유 - 홈페이지 제작 정보와 사례 이야기",
  description:
    "홈페이지 제작 비용, 도메인·호스팅, 검색 노출처럼 실제로 자주 받는 질문을 정리했습니다. HS WEB이 현장에서 겪은 기준으로 씁니다.",
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
      {posts.length === 0 ? (
        <div className="border border-[var(--c-line)] bg-white py-16 text-center">
          <p className="text-[14px] text-[var(--c-sub)]">아직 올라온 글이 없습니다.</p>
        </div>
      ) : (
        <>
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
                  <h2 className="mt-2 text-[19px] md:text-[22px] font-extrabold tracking-[-0.03em] text-[var(--c-text)] group-hover:text-[var(--c-main)] transition-colors">
                    {p.title}
                  </h2>
                  {p.summary && (
                    <p className="mt-2 text-[14px] md:text-[15px] text-[var(--c-sub)] leading-[1.7] line-clamp-2">{p.summary}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </PageShell>
  );
}
