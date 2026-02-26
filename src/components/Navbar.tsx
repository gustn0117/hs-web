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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const links = [
    { href: "/services", label: "서비스" },
    { href: "/portfolio", label: "포트폴리오" },
    { href: "/process", label: "제작 과정" },
    { href: "/pricing", label: "가격 안내" },
    { href: "/testimonials", label: "고객 후기" },
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

      <div
        className={`md:hidden fixed inset-0 top-[72px] bg-white/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center gap-8 transition-all duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-xl no-underline font-medium transition-all duration-300 ${
              pathname === link.href ? "text-[var(--color-primary)]" : "text-[var(--color-dark)]"
            }`}
            style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms", transform: mobileOpen ? "translateY(0)" : "translateY(20px)" }}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/contact"
          className="bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white px-8 py-3 rounded-lg font-semibold no-underline"
          style={{ transitionDelay: mobileOpen ? `${links.length * 50}ms` : "0ms" }}
        >
          견적문의
        </Link>
      </div>
    </nav>
  );
}
