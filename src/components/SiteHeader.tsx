"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV: { label: string; href: string }[] = [
  { label: "서비스", href: "/services" },
  { label: "포트폴리오", href: "/portfolio" },
  { label: "가격", href: "/pricing" },
  { label: "진행 절차", href: "/process" },
  { label: "정보", href: "/domain-hosting" },
  { label: "후기", href: "/testimonials" },
  { label: "문의", href: "/contact" },
];

const PANEL_GROUPS: { key: string; items: { href: string; label: string }[] }[] = [
  {
    key: "서비스",
    items: [
      { href: "/services/responsive-web", label: "반응형 홈페이지" },
      { href: "/services/ecommerce", label: "쇼핑몰 구축" },
      { href: "/services/landing-page", label: "랜딩페이지" },
      { href: "/services/web-app", label: "웹 애플리케이션" },
      { href: "/services/cms", label: "CMS 시스템" },
      { href: "/services/enterprise", label: "기업 관리 시스템" },
      { href: "/services/marketing", label: "기술 마케팅" },
    ],
  },
  {
    key: "정보",
    items: [
      { href: "/process", label: "진행 절차" },
      { href: "/custom-development", label: "자체 개발 vs 플랫폼" },
      { href: "/domain-hosting", label: "도메인·호스팅" },
      { href: "/nameserver-guide", label: "네임서버 변경 가이드" },
      { href: "/seo", label: "검색엔진 최적화" },
      { href: "/pg-guide", label: "PG(전자결제) 연동 안내" },
    ],
  },
  {
    key: "회사",
    items: [
      { href: "/why-hs-web", label: "HS WEB을 선택하는 이유" },
      { href: "/portfolio", label: "포트폴리오" },
      { href: "/pricing", label: "가격 안내" },
      { href: "/testimonials", label: "고객 후기" },
      { href: "/contact", label: "문의하기" },
      { href: "/client", label: "고객 포털" },
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
  const current = PANEL_GROUPS.find((g) => g.key === group) ?? PANEL_GROUPS[0];

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
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="전체메뉴"
          className={`absolute top-0 right-0 h-full w-full sm:w-[560px] lg:w-[720px] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="bg-[var(--c-main)] text-white px-6 py-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70">Menu</p>
              <p className="text-[22px] font-extrabold mt-1">전체메뉴</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="전체메뉴 닫기"
              className="w-10 h-10 inline-flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-[130px_1fr] sm:grid-cols-[180px_1fr]">
            <ul className="list-none m-0 p-0 border-r border-[var(--c-line)] bg-[var(--c-bg-1)] overflow-y-auto">
              {PANEL_GROUPS.map((g) => (
                <li key={g.key}>
                  <button
                    type="button"
                    onMouseEnter={() => setGroup(g.key)}
                    onClick={() => setGroup(g.key)}
                    className={`w-full text-left px-5 py-4 text-[15px] cursor-pointer bg-transparent border-0 transition-colors ${
                      group === g.key
                        ? "text-[var(--c-main)] font-extrabold bg-white"
                        : "text-[var(--c-text-2)] font-bold hover:bg-white/70"
                    }`}
                  >
                    {g.key}
                  </button>
                </li>
              ))}
            </ul>

            <div className="overflow-y-auto px-6 py-6">
              <p className="text-[17px] font-extrabold text-[var(--c-text)] pb-3 border-b-2 border-[var(--c-text)]">{current.key}</p>
              <ul className="list-none m-0 p-0 mt-4 grid sm:grid-cols-2 gap-x-6">
                {current.items.map((it) => (
                  <li key={it.href} className="border-b border-[var(--c-line)]">
                    <Link
                      href={it.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-[15px] text-[var(--c-text-2)] hover:text-[var(--c-main)] no-underline transition-colors"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--c-line)] px-6 py-4 flex items-center justify-between gap-3">
            <a href="tel:010-3319-2509" className="text-[15px] font-extrabold text-[var(--c-text)] no-underline tnum">010-3319-2509</a>
            <Link href="/contact" onClick={() => setOpen(false)} className="p-btn p-btn-point no-underline">상담 신청</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
