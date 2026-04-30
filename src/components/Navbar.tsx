"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SubItem {
  href: string;
  label: string;
  desc?: string;
}

interface MenuItem {
  label: string;
  href?: string;
  children?: SubItem[];
}

const MENU: MenuItem[] = [
  {
    label: "서비스",
    href: "/services",
    children: [
      { href: "/services/responsive-web", label: "반응형 홈페이지", desc: "모든 디바이스 완벽 호환" },
      { href: "/services/ecommerce", label: "쇼핑몰 구축", desc: "PG·재고·회원 풀 패키지" },
      { href: "/services/landing-page", label: "랜딩페이지", desc: "전환율 최적화" },
      { href: "/services/web-app", label: "웹 애플리케이션", desc: "맞춤 기능 개발" },
      { href: "/services/cms", label: "CMS 시스템", desc: "콘텐츠 직접 관리" },
      { href: "/services/enterprise", label: "기업 관리 시스템", desc: "ERP·CRM·자동화" },
      { href: "/services/marketing", label: "기술 마케팅", desc: "SEO·백링크 구축" },
    ],
  },
  { label: "포트폴리오", href: "/portfolio" },
  { label: "가격", href: "/pricing" },
  {
    label: "정보",
    children: [
      { href: "/process", label: "제작 과정", desc: "6단계 체계적 진행" },
      { href: "/domain-hosting", label: "도메인·호스팅", desc: "기본 개념과 비용" },
      { href: "/testimonials", label: "고객 후기", desc: "실제 클라이언트 평가" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
    setOpenMenu(null);
  }, [pathname]);

  const openDropdown = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const isActive = (href?: string) =>
    href ? pathname === href || (href !== "/" && pathname.startsWith(href)) : false;

  const isMenuActive = (m: MenuItem) =>
    isActive(m.href) || (m.children?.some((c) => isActive(c.href)) ?? false);

  return (
    <>
      {/* Top announcement bar */}
      <div className="hidden md:block bg-[var(--c-text)] text-white">
        <div className="max-w-[1280px] mx-auto px-5 h-[34px] flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center h-[18px] px-1.5 bg-white/10 rounded text-[10px] font-bold tracking-wider">NEW</span>
            <span className="text-white/85">홈페이지 제작 249,000원부터 · 간단 수정 평생 무료 지원</span>
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
        <div className="max-w-[1280px] mx-auto px-5 grid grid-cols-[1fr_auto_1fr] items-center h-[68px] gap-4">
          {/* Left: brand */}
          <div className="flex items-center justify-start">
            <Link href="/" className="flex items-baseline gap-1.5 no-underline group">
              <span className="text-[18px] font-extrabold tracking-[-0.035em] text-[var(--c-text)] group-hover:text-[var(--c-main)] transition-colors">
                HS WEB
              </span>
              <span className="text-[10px] font-semibold text-[var(--c-sub)] tracking-[0.15em] uppercase hidden sm:inline">
                Web Agency
              </span>
            </Link>
          </div>

          {/* Center: nav */}
          <nav
            className="hidden lg:flex items-center justify-center gap-0.5"
            onMouseLeave={scheduleClose}
          >
              {MENU.map((m) => {
                const active = isMenuActive(m);
                const hasChildren = !!m.children?.length;
                const isOpen = openMenu === m.label;

                if (!hasChildren) {
                  return (
                    <Link
                      key={m.label}
                      href={m.href!}
                      onMouseEnter={() => openDropdown("")}
                      className={`relative inline-flex items-center h-10 px-3.5 rounded-[8px] text-[14px] font-medium no-underline transition-all ${
                        active
                          ? "text-[var(--c-text)] font-semibold"
                          : "text-[var(--c-text-2)] hover:text-[var(--c-text)] hover:bg-[var(--c-bg-2)]"
                      }`}
                    >
                      {m.label}
                      {active && (
                        <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[var(--c-text)] rounded-full" />
                      )}
                    </Link>
                  );
                }

                return (
                  <div
                    key={m.label}
                    className="relative"
                    onMouseEnter={() => openDropdown(m.label)}
                  >
                    <button
                      onClick={() => setOpenMenu(isOpen ? null : m.label)}
                      onFocus={() => openDropdown(m.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="menu"
                      className={`relative inline-flex items-center gap-1 h-10 px-3.5 rounded-[8px] text-[14px] font-medium border-0 bg-transparent cursor-pointer transition-all ${
                        active
                          ? "text-[var(--c-text)] font-semibold"
                          : "text-[var(--c-text-2)] hover:text-[var(--c-text)] hover:bg-[var(--c-bg-2)]"
                      }`}
                    >
                      {m.label}
                      <svg
                        className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                      {active && (
                        <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[var(--c-text)] rounded-full" />
                      )}
                    </button>

                    {/* Dropdown panel */}
                    {isOpen && (
                      <div
                        role="menu"
                        className="absolute left-0 top-full pt-2 z-50"
                      >
                        <div className="bg-white border border-[var(--c-line)] rounded-[14px] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] overflow-hidden min-w-[280px] py-2">
                          {m.href && (
                            <Link
                              href={m.href}
                              role="menuitem"
                              className="flex items-center justify-between px-4 py-2 mx-2 rounded-[8px] no-underline text-[12.5px] font-bold text-[var(--c-main)] hover:bg-[var(--c-main-bg)] transition-colors"
                            >
                              <span className="tracking-wide uppercase">전체 {m.label}</span>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                              </svg>
                            </Link>
                          )}
                          {m.href && <div className="my-1.5 mx-3 border-t border-[var(--c-line)]" />}
                          <ul className="list-none m-0">
                            {m.children!.map((c) => {
                              const childActive = isActive(c.href);
                              return (
                                <li key={c.href}>
                                  <Link
                                    href={c.href}
                                    role="menuitem"
                                    className={`flex items-start gap-3 px-4 py-2.5 mx-2 rounded-[8px] no-underline transition-colors ${
                                      childActive
                                        ? "bg-[var(--c-bg-2)]"
                                        : "hover:bg-[var(--c-bg-1)]"
                                    }`}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className={`text-[14px] truncate ${childActive ? "font-bold text-[var(--c-text)]" : "font-semibold text-[var(--c-text)]"}`}>
                                        {c.label}
                                      </p>
                                      {c.desc && (
                                        <p className="text-[11.5px] text-[var(--c-sub)] mt-0.5 truncate">{c.desc}</p>
                                      )}
                                    </div>
                                    <svg className="w-3.5 h-3.5 text-[var(--c-sub-2)] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

          {/* Right: CTA + mobile toggle */}
          <div className="flex items-center justify-end gap-2">
            <Link href="/contact" className="hidden lg:inline-flex p-btn p-btn-dark">
              견적 문의
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

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
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />

      {/* Mobile panel */}
      <aside
        className={`lg:hidden fixed top-0 right-0 bottom-0 w-[340px] bg-white z-50 border-l border-[var(--c-line)] transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between h-[64px] px-5 border-b border-[var(--c-line)]">
          <span className="text-[14px] font-bold text-[var(--c-sub)] tracking-wider uppercase">메뉴</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 inline-flex items-center justify-center rounded-[8px] hover:bg-[var(--c-bg-2)] bg-transparent border-0 cursor-pointer"
            aria-label="닫기"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {MENU.map((m) => {
            const active = isMenuActive(m);
            const hasChildren = !!m.children?.length;
            const expanded = mobileExpanded === m.label;

            if (!hasChildren) {
              return (
                <Link
                  key={m.label}
                  href={m.href!}
                  className={`flex items-center justify-between px-4 h-12 rounded-[10px] text-[15px] no-underline mb-0.5 ${
                    active ? "bg-[var(--c-bg-2)] text-[var(--c-text)] font-semibold" : "text-[var(--c-text)]"
                  }`}
                >
                  {m.label}
                  <svg className="w-4 h-4 text-[var(--c-sub-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              );
            }

            return (
              <div key={m.label} className="mb-0.5">
                <button
                  onClick={() => setMobileExpanded(expanded ? null : m.label)}
                  aria-expanded={expanded}
                  className={`w-full flex items-center justify-between px-4 h-12 rounded-[10px] text-[15px] border-0 cursor-pointer bg-transparent transition-colors ${
                    active || expanded
                      ? "text-[var(--c-text)] font-semibold bg-[var(--c-bg-2)]"
                      : "text-[var(--c-text)]"
                  }`}
                >
                  {m.label}
                  <svg
                    className={`w-4 h-4 text-[var(--c-sub-2)] transition-transform ${expanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {expanded && (
                  <ul className="list-none m-0 pl-2 mt-1 space-y-0.5">
                    {m.href && (
                      <li>
                        <Link
                          href={m.href}
                          className="flex items-center justify-between px-4 h-10 rounded-[8px] text-[12.5px] font-bold text-[var(--c-main)] tracking-wider uppercase no-underline hover:bg-[var(--c-main-bg)]"
                        >
                          전체 {m.label}
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </Link>
                      </li>
                    )}
                    {m.children!.map((c) => {
                      const childActive = isActive(c.href);
                      return (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className={`flex items-start justify-between gap-2 px-4 py-2 rounded-[8px] no-underline ${
                              childActive ? "bg-[var(--c-bg-2)]" : "hover:bg-[var(--c-bg-1)]"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className={`text-[14px] truncate ${childActive ? "font-bold text-[var(--c-text)]" : "text-[var(--c-text)]"}`}>
                                {c.label}
                              </p>
                              {c.desc && (
                                <p className="text-[11.5px] text-[var(--c-sub)] truncate">{c.desc}</p>
                              )}
                            </div>
                            <svg className="w-3.5 h-3.5 text-[var(--c-sub-2)] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}

          <Link
            href="/client"
            className="flex items-center justify-between px-4 h-12 rounded-[10px] text-[15px] no-underline text-[var(--c-text-2)] mt-3 pt-3 border-t border-[var(--c-line)]"
          >
            사이트 관리
            <svg className="w-4 h-4 text-[var(--c-sub-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </nav>

        <div className="p-4 border-t border-[var(--c-line)] space-y-2">
          <a href="tel:010-3319-2509" className="p-btn w-full tnum">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            010-3319-2509
          </a>
          <Link href="/contact" className="p-btn p-btn-dark w-full">
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
