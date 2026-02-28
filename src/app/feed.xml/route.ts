import { services } from "@/lib/services";

const SITE_URL = "https://hsweb.pics";
const SITE_NAME = "HS WEB";

export async function GET() {
  const now = new Date().toUTCString();

  const items = [
    {
      title: "홈페이지 제작 전문 웹에이전시 HS WEB",
      link: SITE_URL,
      description:
        "홈페이지 제작 전문 웹에이전시 HS WEB. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션 개발까지.",
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
      title: "홈페이지 제작 과정",
      link: `${SITE_URL}/process`,
      description:
        "상담 & 기획부터 디자인, 개발, 런칭까지 체계적인 프로세스로 최상의 결과물을 만들어냅니다.",
    },
    {
      title: "무료 상담 · 문의하기",
      link: `${SITE_URL}/contact`,
      description:
        "홈페이지 제작, 쇼핑몰 구축, 랜딩페이지 제작 무료 상담을 받아보세요.",
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} - 홈페이지 제작 전문 웹에이전시</title>
    <link>${SITE_URL}</link>
    <description>홈페이지 제작 전문 웹에이전시 HS WEB. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 기술 마케팅.</description>
    <language>ko</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid>${item.link}</guid>
      <description>${escapeXml(item.description)}</description>
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
