import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySeq, getPublishedPosts, Post } from "@/lib/posts";
import { Breadcrumb } from "@/components/PageShell";

const SITE_URL = "https://hsweb.pics";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    return posts.filter((p) => p.seq > 0).map((p) => ({ id: String(p.seq) }));
  } catch {
    return [];
  }
}

async function load(param: string): Promise<Post | null> {
  if (!/^\d+$/.test(param)) return null;
  const post = await getPostBySeq(Number(param));
  return post?.published ? post : null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await load(id);
  if (!post) return { title: "글을 찾을 수 없습니다", robots: { index: false, follow: false } };

  const url = `${SITE_URL}/insights/${post.seq}`;
  // 지역이 있으면 제목에도 넣어 지역 검색에 걸리게 한다.
  const title = post.region ? `${post.title} | ${post.region} 홈페이지 제작 정보` : `${post.title} | 홈페이지 제작 정보`;

  return {
    title,
    description: post.summary || post.title,
    keywords: [post.title, post.category, post.region, ...post.tags, "홈페이지 제작", "HS WEB"].filter(Boolean) as string[],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary || post.title,
      url,
      siteName: "HS WEB 웹에이전시",
      locale: "ko_KR",
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary || post.title,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

/** 본문 형식: "## 소제목", "- 목록", 나머지는 문단 */
function Body({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];

  const flush = (key: string) => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={key} className="list-disc pl-5 my-4 space-y-2 text-[15px] text-[var(--c-text-2)] leading-[1.8]">
        {list.map((li, i) => (
          <li key={i}>{li}</li>
        ))}
      </ul>
    );
    list = [];
  };

  text.split("\n").forEach((raw, i) => {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      flush(`ul-${i}`);
      blocks.push(
        <h2 key={i} className="text-[20px] md:text-[24px] font-extrabold tracking-[-0.03em] text-[var(--c-text)] mt-10 first:mt-0 mb-3">
          {line.slice(3)}
        </h2>
      );
      return;
    }
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      return;
    }
    flush(`ul-${i}`);
    if (line) {
      blocks.push(
        <p key={i} className="my-3 text-[15px] md:text-[16px] text-[var(--c-text-2)] leading-[1.85]">
          {line}
        </p>
      );
    }
  });
  flush("ul-last");

  return <>{blocks}</>;
}

function fmtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default async function InsightDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await load(id);
  if (!post) notFound();

  const all = await getPublishedPosts();
  const related = all.filter((p) => p.id !== post.id).slice(0, 3);
  const url = `${SITE_URL}/insights/${post.seq}`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      headline: post.title,
      description: post.summary || post.title,
      url,
      inLanguage: "ko-KR",
      datePublished: post.publishedAt || undefined,
      dateModified: post.updatedAt || undefined,
      image: post.coverImage || undefined,
      keywords: [post.category, post.region, ...post.tags].filter(Boolean).join(", ") || undefined,
      author: { "@type": "Organization", name: "HS WEB", url: SITE_URL },
      publisher: { "@type": "Organization", name: "HS WEB", url: SITE_URL },
      // 지역을 지정한 글은 해당 지역을 대상으로 한다고 알린다.
      ...(post.region
        ? {
            contentLocation: { "@type": "Place", name: post.region },
            spatialCoverage: { "@type": "Place", name: post.region },
            about: { "@type": "Thing", name: `${post.region} 홈페이지 제작` },
          }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "정보공유", item: `${SITE_URL}/insights` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  // FAQ가 있으면 AI 답변과 검색 결과에 인용되기 쉽도록 별도로 알린다.
  if (post.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
      />

      <article className="bg-white">
        <div className="max-w-[820px] mx-auto px-5 pt-8 pb-16 md:pt-10 md:pb-24">
          <Breadcrumb items={[{ label: "정보공유", href: "/insights" }, { label: post.title }]} />

          <div className="mt-8 flex items-center gap-2 text-[13px] text-[var(--c-sub)]">
            {post.category && <span className="font-semibold text-[var(--c-main)]">{post.category}</span>}
            {post.region && <span>{post.region}</span>}
            <span className="tnum">{fmtDate(post.publishedAt)}</span>
          </div>

          <h1 className="mt-3 text-[28px] md:text-[40px] font-extrabold tracking-[-0.035em] leading-[1.25] text-[var(--c-text)]">
            {post.title}
          </h1>

          <div className="mt-6 border-t-2 border-[var(--c-text)]" />

          {/* 핵심 요약 — 검색 결과와 AI 답변에 인용되기 좋은 자리 */}
          {post.summary && (
            <div className="mt-6 bg-[var(--c-main-bg)] border-l-[3px] border-[var(--c-main)] px-5 py-4">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-main)] mb-1.5">한 줄 요약</p>
              <p className="text-[15px] md:text-[16px] text-[var(--c-text-2)] leading-[1.8] m-0">{post.summary}</p>
            </div>
          )}

          <div className="mt-8">
            <Body text={post.content} />
          </div>

          {post.faq.length > 0 && (
            <section className="mt-12">
              <h2 className="text-[20px] md:text-[24px] font-extrabold tracking-[-0.03em] text-[var(--c-text)] mb-4">
                자주 묻는 질문
              </h2>
              <dl className="m-0 border-t border-[var(--c-line)]">
                {post.faq.map((f, i) => (
                  <div key={i} className="border-b border-[var(--c-line)] py-5">
                    <dt className="text-[15px] md:text-[16px] font-bold text-[var(--c-text)]">Q. {f.q}</dt>
                    <dd className="mt-2 ml-0 text-[15px] text-[var(--c-text-2)] leading-[1.8] whitespace-pre-line">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span key={t} className="inline-flex items-center h-7 px-2.5 rounded-full bg-[var(--c-bg-2)] text-[var(--c-sub)] text-[12px]">
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 bg-[var(--c-main)] text-white px-6 py-7 md:px-8 md:py-8">
            <p className="text-[18px] md:text-[20px] font-extrabold">
              {post.region ? `${post.region}에서 홈페이지 제작을 준비 중이신가요?` : "홈페이지 제작을 준비 중이신가요?"}
            </p>
            <p className="mt-2 text-[14px] text-white/75 leading-[1.7]">
              249,000원부터 시작하고, 간단한 수정은 기간 제한 없이 무료로 지원합니다.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Link href="/contact" className="inline-flex items-center h-11 px-5 bg-white text-[var(--c-main)] text-[14px] font-extrabold no-underline hover:bg-white/90 transition-colors">
                상담 신청
              </Link>
              <a href="tel:010-3319-2509" className="inline-flex items-center h-11 px-5 border border-white/40 text-white text-[14px] font-bold no-underline hover:bg-white/10 transition-colors tnum">
                010-3319-2509
              </a>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-[17px] font-extrabold text-[var(--c-text)] mb-3">다른 글</h2>
              <ul className="list-none m-0 p-0 border-t border-[var(--c-line)]">
                {related.map((r) => (
                  <li key={r.id} className="border-b border-[var(--c-line)]">
                    <Link href={`/insights/${r.seq}`} className="block py-4 no-underline group">
                      <span className="block text-[15px] font-bold text-[var(--c-text)] group-hover:text-[var(--c-main)] transition-colors">
                        {r.title}
                      </span>
                      {r.summary && <span className="block mt-1 text-[13px] text-[var(--c-sub)] line-clamp-1">{r.summary}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
