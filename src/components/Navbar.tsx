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
    { href: "/client", label: "사이트 관리" },
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
        className={`md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`md:hidden fixed top-[72px] right-0 bottom-0 w-[280px] bg-white shadow-2xl z-40 flex flex-col py-6 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col flex-1 overflow-y-auto px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-3.5 rounded-xl text-[0.95rem] no-underline font-medium transition-colors ${
                pathname === link.href
                  ? "bg-blue-50 text-[var(--color-primary)]"
                  : "text-[var(--color-dark)] hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pt-4 border-t border-gray-100">
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
