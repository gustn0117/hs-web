import { services } from "@/lib/services";
import { getPortfolioItems } from "@/lib/portfolio";
import { getPublishedPosts } from "@/lib/posts";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
  category?: string;
}

export const revalidate = 600;

export async function GET() {
  const now = new Date().toUTCString();

  // 포트폴리오는 최근에 올린 것이 앞에 오도록 한다.
  let portfolioItems: FeedItem[] = [];
  try {
    const items = await getPortfolioItems();
    portfolioItems = items
      .filter((i) => i.seq > 0)
      .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
      .map((i) => ({
        title: `${i.title} | ${i.category || "홈페이지 제작"} 제작 사례`,
        link: `${SITE_URL}/portfolio/${i.seq}`,
        description: i.description || `${i.title} 제작 사례입니다.`,
        pubDate: i.updatedAt ? new Date(i.updatedAt).toUTCString() : undefined,
        category: i.category || "홈페이지 제작 사례",
      }));
  } catch {
    // DB 연결 실패 시 포트폴리오 없이 내보낸다.
  }

  // 정보공유 글은 가장 최근 것이 앞에 오도록 맨 앞에 붙인다.
  let postItems: FeedItem[] = [];
  try {
    const posts = await getPublishedPosts();
    postItems = posts
      .filter((p) => p.seq > 0)
      .map((p) => ({
        title: p.title,
        link: `${SITE_URL}/insights/${p.seq}`,
        description: p.summary || p.title,
        pubDate: p.publishedAt ? new Date(p.publishedAt).toUTCString() : undefined,
        category: p.category || "홈페이지 제작 정보",
      }));
  } catch {
    // DB 연결 실패 시 정보공유 없이 내보낸다.
  }

  const items: FeedItem[] = [
    ...postItems,
    {
      title: "웹·업무 시스템을 만드는 하온",
      link: SITE_URL,
      description:
        "웹·업무 시스템을 만드는 하온. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션 개발까지.",
    },
    ...services.map((s) => ({
      title: `${s.title} - ${s.subtitle}`,
      link: `${SITE_URL}/services/${s.slug}`,
      description: s.description,
    })),
    {
      title: "포트폴리오 - 홈페이지 제작 사례",
      link: `${SITE_URL}/portfolio`,
      description:
        "다양한 산업군의 클라이언트와 함께한 반응형 홈페이지, 쇼핑몰, 랜딩페이지 프로젝트를 소개합니다.",
    },
    {
      title: "홈페이지 제작 가격 안내",
      link: `${SITE_URL}/pricing`,
      description:
        "프로젝트 규모에 맞는 합리적인 가격을 제안합니다. Basic, Professional, Enterprise 패키지.",
    },
    {
      title: "홈페이지 진행 절차",
      link: `${SITE_URL}/process`,
      description:
        "필요한 정보를 제공받고, 초안을 제작해 보내드리며, 피드백 과정을 거쳐 완성합니다. 4단계 진행 절차를 안내합니다.",
    },
    {
      title: "무료 상담 · 문의하기",
      link: `${SITE_URL}/contact`,
      description:
        "홈페이지 제작, 쇼핑몰 구축, 랜딩페이지 제작 무료 상담을 받아보세요.",
    },
    ...portfolioItems,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} - 웹·업무 시스템 제작</title>
    <link>${SITE_URL}</link>
    <description>웹·업무 시스템을 만드는 하온. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 기술 마케팅.</description>
    <language>ko</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>${SITE_NAME}</generator>
    <copyright>${SITE_NAME}</copyright>
    <image>
      <url>${SITE_URL}/brand/haon-logo.png</url>
      <title>${SITE_NAME} - 웹·업무 시스템 제작</title>
      <link>${SITE_URL}</link>
    </image>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <description>${escapeXml(item.description)}</description>${item.category ? `
      <category>${escapeXml(item.category)}</category>` : ""}
      <pubDate>${item.pubDate || now}</pubDate>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
