"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/services", label: "서비스" },
  { href: "/portfolio", label: "포트폴리오" },
  { href: "/process", label: "제작 과정" },
  { href: "/pricing", label: "가격" },
  { href: "/domain-hosting", label: "도메인·호스팅" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top announcement bar */}
      <div className="hidden md:block bg-[var(--c-text)] text-white">
        <div className="max-w-[1280px] mx-auto px-5 h-[34px] flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center h-[18px] px-1.5 bg-white/10 rounded text-[10px] font-bold tracking-wider">NEW</span>
            <span className="text-white/85">홈페이지 제작 249,000원부터 · 무료 유지보수 1개월 포함</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:010-3319-2509"
              className="flex items-center gap-1.5 text-white/85 hover:text-white no-underline tnum"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              010-3319-2509
            </a>
            <span className="text-white/20">|</span>
            <Link href="/client" className="text-white/85 hover:text-white no-underline">
              사이트 관리
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled
            ? "glass border-b border-[var(--c-line)]"
            : "bg-white border-b border-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between h-[68px]">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 no-underline group">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-[var(--c-text)] text-white font-extrabold text-[14px] leading-none tracking-tight group-hover:bg-[var(--c-main)] transition-colors">
                H
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[17px] font-extrabold tracking-[-0.035em] text-[var(--c-text)]">
                  HS WEB
                </span>
                <span className="text-[9.5px] font-semibold text-[var(--c-sub)] tracking-[0.15em] uppercase mt-0.5">
                  Web Agency
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              {links.map((link) => {
                const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative inline-flex items-center h-10 px-3.5 rounded-[8px] text-[14px] font-medium no-underline transition-all ${
                      active
                        ? "text-[var(--c-text)] font-semibold"
                        : "text-[var(--c-text-2)] hover:text-[var(--c-text)] hover:bg-[var(--c-bg-2)]"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[var(--c-text)] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/portfolio"
              className="inline-flex items-center h-10 px-3 text-[13px] font-medium text-[var(--c-text-2)] hover:text-[var(--c-text)] no-underline"
            >
              포트폴리오 보기
            </Link>
            <Link href="/contact" className="p-btn p-btn-dark">
              견적 문의
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-[8px] hover:bg-[var(--c-bg-2)] bg-transparent border-0 cursor-pointer"
            aria-label="메뉴"
          >
            <svg className="w-5 h-5 text-[var(--c-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile panel */}
      <aside
        className={`lg:hidden fixed top-0 right-0 bottom-0 w-[320px] bg-white z-50 border-l border-[var(--c-line)] transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between h-[64px] px-5 border-b border-[var(--c-line)]">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 no-underline">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-[var(--c-text)] text-white font-extrabold text-[13px]">H</span>
            <span className="text-[16px] font-extrabold tracking-tight text-[var(--c-text)]">HS WEB</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 inline-flex items-center justify-center rounded-[8px] hover:bg-[var(--c-bg-2)] bg-transparent border-0 cursor-pointer"
            aria-label="닫기"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 h-12 rounded-[10px] text-[15px] no-underline ${
                  active ? "bg-[var(--c-bg-2)] text-[var(--c-text)] font-semibold" : "text-[var(--c-text)]"
                }`}
              >
                {link.label}
                <svg className="w-4 h-4 text-[var(--c-sub-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            );
          })}
          <Link
            href="/client"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between px-4 h-12 rounded-[10px] text-[15px] no-underline text-[var(--c-text-2)] mt-2 pt-2 border-t border-[var(--c-line)]"
          >
            사이트 관리
            <svg className="w-4 h-4 text-[var(--c-sub-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </Link>
        </nav>

        <div className="p-4 border-t border-[var(--c-line)] space-y-2">
          <a href="tel:010-3319-2509" className="p-btn w-full tnum">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            010-3319-2509
          </a>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="p-btn p-btn-dark w-full">
            견적 문의
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </aside>
    </>
  );
}
