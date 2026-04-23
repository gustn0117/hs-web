"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/services", label: "서비스" },
  { href: "/portfolio", label: "포트폴리오" },
  { href: "/process", label: "제작 과정" },
  { href: "/pricing", label: "가격 안내" },
  { href: "/domain-hosting", label: "도메인·호스팅" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden md:block border-b border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-8 text-[11px] text-[var(--color-muted)]">
          <div className="flex items-center gap-3">
            <span>대표 심현수</span>
            <span className="text-[var(--color-border-strong)]">|</span>
            <a href="tel:010-3319-2509" className="tnum hover:text-[var(--color-point)] no-underline text-[var(--color-text-2)]">010-3319-2509</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/client" className="hover:text-[var(--color-point)] no-underline text-[var(--color-text-2)]">사이트 관리</Link>
            <span className="text-[var(--color-border-strong)]">|</span>
            <Link href="/contact" className="hover:text-[var(--color-point)] no-underline text-[var(--color-text-2)]">문의하기</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="border-b border-[var(--color-border)] bg-white sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-[52px]">
          <Link href="/" className="flex items-baseline gap-1.5 no-underline">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-sm bg-[var(--color-point)] text-white font-bold text-[13px]">H</span>
            <span className="text-[17px] font-bold tracking-tight text-[var(--color-text)]">HS WEB</span>
            <span className="text-[10px] text-[var(--color-muted)] ml-0.5 hidden sm:inline">홈페이지 제작</span>
          </Link>

          <ul className="hidden md:flex items-center list-none">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`inline-flex items-center h-[52px] px-3.5 text-[13px] no-underline border-b-2 transition-colors ${
                      active
                        ? "text-[var(--color-point)] border-[var(--color-point)] font-semibold bg-[var(--color-point-bg)]/40"
                        : "text-[var(--color-text-2)] border-transparent hover:text-[var(--color-text)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/contact" className="p-btn p-btn-point">견적 문의</Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 inline-flex items-center justify-center border border-[var(--color-border)] bg-white rounded-sm"
            aria-label="메뉴"
          >
            <svg className="w-4 h-4 text-[var(--color-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/30 z-40 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile menu panel */}
      <aside
        className={`md:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 border-l border-[var(--color-border)] transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-[52px] px-4 border-b border-[var(--color-border)]">
          <span className="text-[15px] font-bold">메뉴</span>
          <button onClick={() => setMobileOpen(false)} className="w-7 h-7 inline-flex items-center justify-center" aria-label="닫기">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <ul className="list-none">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 h-11 border-b border-[var(--color-border)] text-[13px] no-underline ${
                    active ? "text-[var(--color-point)] font-semibold bg-[var(--color-point-bg)]" : "text-[var(--color-text)]"
                  }`}
                >
                  {link.label}
                  <svg className="w-3.5 h-3.5 text-[var(--color-muted-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/client"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 h-11 border-b border-[var(--color-border)] text-[13px] no-underline text-[var(--color-text-2)]"
            >
              사이트 관리
              <svg className="w-3.5 h-3.5 text-[var(--color-muted-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </Link>
          </li>
        </ul>
        <div className="p-3 space-y-2">
          <a href="tel:010-3319-2509" className="p-btn w-full">전화 010-3319-2509</a>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="p-btn p-btn-point w-full no-underline">견적 문의</Link>
        </div>
      </aside>
    </>
  );
}
