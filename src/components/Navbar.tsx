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
    { href: "/testimonials", label: "고객 후기" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white ${
        scrolled ? "shadow-[0_1px_12px_rgba(0,0,0,0.06)]" : ""
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex justify-between items-center">
        <Link href="/" className="text-[1.5rem] font-extrabold tracking-tight no-underline text-[var(--color-dark)]">
          HS <span className="text-[var(--color-primary)]">WEB</span>
        </Link>

        <ul className="hidden md:flex gap-8 items-center list-none">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`no-underline font-medium text-[0.95rem] transition-colors ${
                  pathname === link.href
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-gray)] hover:text-[var(--color-dark)]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-lg font-semibold text-[0.95rem] no-underline bg-[var(--color-dark)] text-white hover:bg-[var(--color-dark-2)] transition-colors"
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
          <span className="w-6 h-[2px] bg-[var(--color-dark)]" />
          <span className="w-6 h-[2px] bg-[var(--color-dark)]" />
          <span className="w-6 h-[2px] bg-[var(--color-dark)]" />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-8">
          <button
            className="absolute top-6 right-6 text-[var(--color-dark)] text-2xl bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xl no-underline font-medium ${
                pathname === link.href ? "text-[var(--color-primary)]" : "text-[var(--color-dark)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-[var(--color-dark)] text-white px-8 py-3 rounded-lg font-semibold no-underline"
          >
            견적문의
          </Link>
        </div>
      )}
    </nav>
  );
}
