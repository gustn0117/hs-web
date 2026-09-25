"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 상단은 처음 온 사람이 바로 찾는 것만 둔다. 나머지는 전체메뉴에 있다.
const NAV: { label: string; href: string }[] = [
  { label: "서비스", href: "/services" },
  { label: "포트폴리오", href: "/portfolio" },
  { label: "가격", href: "/pricing" },
  { label: "정보공유", href: "/insights" },
  { label: "후기", href: "/testimonials" },
  { label: "문의", href: "/contact" },
];

const I = {
  web: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z",
  cart: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z",
  rocket: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
  phone: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
  layers: "M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3",
  building: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  chart: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  route: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z",
  code: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
  server: "M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z",
  dns: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
  search: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  card: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
  star: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  folder: "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z",
  chat: "M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
  user: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  shield: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
};

const PANEL_GROUPS: { key: string; items: { href: string; label: string; icon: string }[] }[] = [
  {
    key: "서비스",
    items: [
      { href: "/services/responsive-web", label: "반응형 홈페이지", icon: I.web },
      { href: "/services/ecommerce", label: "쇼핑몰 구축", icon: I.cart },
      { href: "/services/landing-page", label: "랜딩페이지", icon: I.rocket },
      { href: "/services/web-app", label: "웹 애플리케이션", icon: I.phone },
      { href: "/services/cms", label: "CMS 시스템", icon: I.layers },
      { href: "/services/enterprise", label: "기업 관리 시스템", icon: I.building },
      { href: "/services/marketing", label: "기술 마케팅", icon: I.chart },
    ],
  },
  {
    key: "가이드",
    items: [
      { href: "/insights", label: "정보공유", icon: I.folder },
      { href: "/process", label: "진행 절차", icon: I.route },
      { href: "/custom-development", label: "자체 개발 vs 플랫폼", icon: I.code },
      { href: "/domain-hosting", label: "도메인·호스팅", icon: I.server },
      { href: "/nameserver-guide", label: "네임서버 변경 가이드", icon: I.dns },
      { href: "/seo", label: "검색엔진 최적화", icon: I.search },
      { href: "/pg-guide", label: "PG(전자결제) 연동", icon: I.card },
    ],
  },
  {
    key: "회사",
    items: [
      { href: "/why-hs-web", label: "HS WEB을 선택하는 이유", icon: I.star },
      { href: "/portfolio", label: "포트폴리오", icon: I.folder },
      { href: "/pricing", label: "가격 안내", icon: I.card },
      { href: "/testimonials", label: "고객 후기", icon: I.chat },
      { href: "/client", label: "고객 포털", icon: I.shield },
    ],
  },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState(PANEL_GROUPS[0].key);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const close = () => setOpen(false);
  const scrollToGroup = (key: string) => {
    setGroup(key);
    document.getElementById(`pg-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--c-line)]">
        <div className="max-w-[1280px] mx-auto px-5 h-[72px] md:h-[88px] grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link href="/" className="flex items-baseline gap-1.5 no-underline">
            <span className="text-[20px] md:text-[22px] font-extrabold tracking-[-0.04em] text-[var(--c-text)]">HS WEB</span>
            <span className="hidden sm:inline text-[10px] font-semibold text-[var(--c-sub)] tracking-[0.18em] uppercase">Web Agency</span>
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-7">
            {NAV.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className={`relative text-[16px] no-underline transition-colors py-2 ${
                  active(m.href)
                    ? "text-[var(--c-main)] font-extrabold"
                    : "text-[var(--c-text)] font-bold hover:text-[var(--c-main)]"
                }`}
              >
                {m.label}
                {active(m.href) && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[3px] bg-[var(--c-main)] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <a
              href="tel:010-3319-2509"
              className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-bold text-[var(--c-text)] no-underline hover:text-[var(--c-main)] transition-colors tnum"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              010-3319-2509
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="전체메뉴 열기"
              className="w-11 h-11 inline-flex items-center justify-center text-[var(--c-text)] hover:bg-[var(--c-bg-2)] rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 전체메뉴 패널 */}
      <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          onClick={close}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="전체메뉴"
          className={`absolute top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-[0_0_60px_-10px_rgba(0,0,0,0.35)] transition-transform duration-300 flex flex-col ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* 상단 밴드 */}
          <div className="bg-[var(--c-text)] text-white px-5 h-14 flex items-center justify-between shrink-0">
            <span className="text-[12.5px] font-semibold tracking-[0.28em]">HS WEB</span>
            <button
              type="button"
              onClick={close}
              aria-label="전체메뉴 닫기"
              className="w-8 h-8 -mr-1.5 inline-flex items-center justify-center text-white/70 hover:text-white cursor-pointer bg-transparent border-0 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 본문 */}
          <div className="flex-1 min-h-0 grid grid-cols-[84px_1fr]">
            <nav className="border-r border-[var(--c-line)] py-4">
              {PANEL_GROUPS.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => scrollToGroup(g.key)}
                  className={`w-full text-left px-4 py-2.5 text-[12.5px] cursor-pointer bg-transparent border-0 transition-colors ${
                    group === g.key ? "text-[var(--c-text)] font-bold" : "text-[var(--c-sub)] hover:text-[var(--c-text)]"
                  }`}
                >
                  {g.key}
                </button>
              ))}
            </nav>

            <div className="overflow-y-auto px-5 py-4">
              {PANEL_GROUPS.map((g) => (
                <section key={g.key} id={`pg-${g.key}`} className="mb-7 last:mb-2">
                  <p className="text-[13px] font-bold text-[var(--c-text)] pb-2 border-b border-[var(--c-line)]">{g.key}</p>
                  <ul className="list-none m-0 p-0 mt-1.5">
                    {g.items.map((it) => {
                      const on = active(it.href);
                      return (
                        <li key={it.href}>
                          <Link
                            href={it.href}
                            onClick={close}
                            className={`flex items-center gap-2.5 h-10 pl-3 border-l-2 no-underline transition-colors ${
                              on
                                ? "border-[var(--c-main)] text-[var(--c-text)] font-bold"
                                : "border-transparent text-[var(--c-text-2)] hover:text-[var(--c-main)]"
                            }`}
                          >
                            <svg
                              className={`w-[17px] h-[17px] shrink-0 ${on ? "text-[var(--c-main)]" : "text-[var(--c-sub-2)]"}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d={it.icon} />
                            </svg>
                            <span className="text-[13.5px]">{it.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          {/* 하단 */}
          <div className="border-t border-[var(--c-line)] px-5 py-3 flex items-center justify-between gap-3">
            <a href="tel:010-3319-2509" className="text-[13.5px] font-bold text-[var(--c-text)] no-underline tnum">
              010-3319-2509
            </a>
            <Link
              href="/contact"
              onClick={close}
              className="inline-flex items-center h-9 px-4 bg-[var(--c-main)] text-white text-[13px] font-bold no-underline hover:opacity-90 transition-opacity"
            >
              상담 신청
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
