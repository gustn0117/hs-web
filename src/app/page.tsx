import Link from "next/link";
import { getPortfolioItems } from "@/lib/portfolio";
import HeroBanner from "@/components/home/HeroBanner";

export const revalidate = 60;

/** 히어로 바로 아래에 겹쳐 올라오는 카드 */
const OVERLAP_CARDS = [
  {
    title: "합리적인 가격",
    desc: "249,000원부터 시작합니다. 불필요한 비용 없이 실속 있게.",
    href: "/pricing",
    icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "무료 유지보수",
    desc: "텍스트·이미지·콘텐츠 수정은 기간 제한 없이 무료로 지원합니다.",
    href: "/why-hs-web",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
  {
    title: "소스코드 100% 제공",
    desc: "납품 후 저작권을 모두 넘겨드립니다. 어디로든 옮길 수 있습니다.",
    href: "/custom-development",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
  },
];

/** 원형 아이콘 바로가기 */
const QUICK_LINKS = [
  { label: "반응형 홈페이지", href: "/services/responsive-web", icon: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" },
  { label: "쇼핑몰 구축", href: "/services/ecommerce", icon: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" },
  { label: "랜딩페이지", href: "/services/landing-page", icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" },
  { label: "웹 애플리케이션", href: "/services/web-app", icon: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" },
  { label: "CMS 시스템", href: "/services/cms", icon: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" },
  { label: "기업 관리 시스템", href: "/services/enterprise", icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" },
  { label: "기술 마케팅", href: "/services/marketing", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
  { label: "문의하기", href: "/contact", icon: "M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" },
];

export default async function Home() {
  const items = await getPortfolioItems();
  const works = items.slice(0, 5);
  const [lead, ...rest] = works;

  return (
    <>
      <HeroBanner />

      {/* 히어로에 겹쳐 올라오는 카드 */}
      <section className="relative z-20 -mt-24 md:-mt-28">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="bg-white shadow-[0_20px_60px_-25px_rgba(10,42,94,0.35)] grid grid-cols-1 md:grid-cols-3">
            {OVERLAP_CARDS.map((c, i) => (
              <Link
                key={c.title}
                href={c.href}
                className={`group flex items-start gap-4 px-6 py-7 md:px-8 md:py-9 no-underline transition-colors hover:bg-[var(--c-bg-1)] ${
                  i !== 0 ? "md:border-l border-t md:border-t-0 border-[var(--c-line)]" : ""
                }`}
              >
                <span className="shrink-0 w-12 h-12 rounded-xl bg-[var(--c-main-soft)] text-[var(--c-main)] inline-flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-[17px] font-extrabold text-[var(--c-text)] group-hover:text-[var(--c-main)] transition-colors">
                    {c.title}
                  </span>
                  <span className="block mt-1.5 text-[14px] text-[var(--c-sub)] leading-[1.65]">{c.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 가운데 정렬 한 줄 문구 */}
      <section className="py-20 md:py-28">
        <div className="max-w-[860px] mx-auto px-5 text-center">
          <h2 className="text-[26px] md:text-[40px] font-extrabold tracking-[-0.035em] leading-[1.3] text-[var(--c-text)]">
            웹사이트는 비용이 아니라 매출입니다.
          </h2>
          <p className="mt-6 text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-[var(--c-main)]">
            Our Mission
          </p>
          <p className="mt-5 text-[15px] md:text-[17px] text-[var(--c-sub)] leading-[1.85]">
            보기 좋은 화면을 넘어, 문의가 들어오고 매출이 오르는 웹사이트를 만듭니다.
            <br className="hidden md:block" />
            디자이너이자 개발자인 대표가 처음부터 끝까지 직접 맡습니다.
          </p>
        </div>
      </section>

      {/* 원형 아이콘 바로가기 */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-y-8">
            {QUICK_LINKS.map((q) => (
              <Link key={q.href} href={q.href} className="group flex flex-col items-center gap-3 no-underline">
                <span className="w-[68px] h-[68px] md:w-[84px] md:h-[84px] rounded-full bg-[var(--c-bg-2)] text-[var(--c-text-2)] inline-flex items-center justify-center transition-colors group-hover:bg-[var(--c-main)] group-hover:text-white">
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={q.icon} />
                  </svg>
                </span>
                <span className="text-[12px] md:text-[13px] font-bold text-[var(--c-text-2)] text-center leading-[1.4] keep">
                  {q.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 최근 작업물 — 모자이크 */}
      {lead && (
        <section className="pb-20 md:pb-28">
          <div className="max-w-[1280px] mx-auto px-5">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="text-[24px] md:text-[34px] font-extrabold tracking-[-0.035em] text-[var(--c-text)]">
                최근 작업물을 확인해 보세요.
              </h2>
              <Link
                href="/portfolio"
                className="shrink-0 inline-flex items-center gap-2 text-[14px] font-bold text-[var(--c-text-2)] hover:text-[var(--c-main)] no-underline transition-colors"
              >
                자세히보기
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4">
              <Link href={`/portfolio/${lead.id}`} className="group block no-underline">
                <div className="aspect-[16/11] bg-[var(--c-bg-2)] overflow-hidden">
                  {lead.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={lead.thumbnail}
                      alt={lead.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="pt-4">
                  <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-[var(--c-main-soft)] text-[var(--c-main)] text-[11px] font-bold">
                    {lead.category}
                  </span>
                  <p className="mt-2.5 text-[19px] md:text-[22px] font-extrabold text-[var(--c-text)] group-hover:text-[var(--c-main)] transition-colors">
                    {lead.title}
                  </p>
                  <p className="mt-1 text-[14px] text-[var(--c-sub)]">{lead.client}</p>
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-4 content-start">
                {rest.map((p) => (
                  <Link key={p.id} href={`/portfolio/${p.id}`} className="group block no-underline">
                    <div className="aspect-[4/3] bg-[var(--c-bg-2)] overflow-hidden">
                      {p.thumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <p className="mt-3 text-[14px] md:text-[15px] font-bold text-[var(--c-text)] group-hover:text-[var(--c-main)] transition-colors leading-[1.45]">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[var(--c-sub)]">{p.client}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

    </>
  );
}
