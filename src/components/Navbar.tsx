"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);


  const links = [
    { href: "/services", label: "서비스" },
    { href: "/portfolio", label: "포트폴리오" },
    { href: "/process", label: "제작 과정" },
    { href: "/pricing", label: "가격 안내" },
    { href: "/domain-hosting", label: "도메인·호스팅" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-gray-200/50 shadow-[0_1px_20px_rgba(0,0,0,0.04)]"
          : "bg-white"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex justify-between items-center">
        <Link href="/" className="text-[1.5rem] font-extrabold tracking-tight no-underline text-[var(--color-dark)]">
          HS <span className="gradient-text">WEB</span>
        </Link>

        <ul className="hidden md:flex gap-8 items-center list-none">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative no-underline font-medium text-[0.95rem] transition-colors pb-1 ${
                  pathname === link.href
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-gray)] hover:text-[var(--color-dark)]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transition-transform duration-300 origin-left ${
                    pathname === link.href ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-lg font-semibold text-[0.95rem] no-underline bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02]"
            >
              견적문의
            </Link>
          </li>
        </ul>

        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-transparent border-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴 열기"
        >
          <span className={`w-6 h-[2px] bg-[var(--color-dark)] transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`w-6 h-[2px] bg-[var(--color-dark)] transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-[2px] bg-[var(--color-dark)] transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile menu panel — full height */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 패널 헤더 */}
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-gray-100">
          <span className="text-[1.25rem] font-extrabold tracking-tight text-[var(--color-dark)]">
            HS <span className="gradient-text">WEB</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer bg-transparent border-none transition-colors"
            aria-label="메뉴 닫기"
          >
            <svg className="w-5 h-5 text-[var(--color-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 메뉴 목록 */}
        <nav className="flex flex-col flex-1 overflow-y-auto px-4 py-6 gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[0.95rem] no-underline font-semibold transition-colors ${
                pathname === link.href
                  ? "bg-blue-50 text-[var(--color-primary)]"
                  : "text-[var(--color-dark)] hover:bg-gray-50"
              }`}
            >
              {link.label}
              <svg className={`w-4 h-4 ${pathname === link.href ? "text-[var(--color-primary)]" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </nav>

        {/* 하단 CTA */}
        <div className="px-4 py-4 border-t border-gray-100 space-y-2">
          <a
            href="tel:010-3319-2509"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[var(--color-dark)] border border-gray-200 font-semibold text-sm no-underline"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            010-3319-2509
          </a>
          <Link
            href="/contact"
            className="block text-center bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white py-3 rounded-xl font-semibold no-underline"
          >
            견적문의
          </Link>
        </div>
      </div>
    </nav>
  );
}
