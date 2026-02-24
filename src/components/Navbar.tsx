"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "#services", label: "서비스" },
    { href: "#portfolio", label: "포트폴리오" },
    { href: "#process", label: "제작 과정" },
    { href: "#pricing", label: "가격 안내" },
    { href: "#testimonials", label: "고객 후기" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-400 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl py-3 shadow-[0_1px_20px_rgba(0,0,0,0.08)]"
          : "py-[18px]"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
        <a href="#" className={`text-[1.6rem] font-extrabold tracking-tight no-underline transition-colors ${scrolled ? "text-[var(--color-dark)]" : "text-white"}`}>
          HS <span className="text-[var(--color-accent)]">WEB</span>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-9 items-center list-none">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`no-underline font-medium text-[0.95rem] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[var(--color-accent)] after:transition-all hover:after:w-full ${
                  scrolled ? "text-[var(--color-gray)] hover:text-[var(--color-dark)]" : "text-white/85"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className={`px-6 py-2.5 rounded-full font-semibold text-[0.95rem] no-underline transition-all hover:-translate-y-0.5 ${
                scrolled
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white text-[var(--color-primary)]"
              }`}
            >
              상담 문의
            </a>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-transparent border-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴 열기"
        >
          <span className={`w-6 h-[2px] transition-all ${scrolled ? "bg-[var(--color-dark)]" : "bg-white"}`} />
          <span className={`w-6 h-[2px] transition-all ${scrolled ? "bg-[var(--color-dark)]" : "bg-white"}`} />
          <span className={`w-6 h-[2px] transition-all ${scrolled ? "bg-[var(--color-dark)]" : "bg-white"}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-0 bg-[var(--color-dark)] z-50 flex flex-col items-center justify-center gap-8">
          <button
            className="absolute top-6 right-6 text-white text-2xl bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/85 text-xl no-underline font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-semibold no-underline"
            onClick={() => setMobileOpen(false)}
          >
            상담 문의
          </a>
        </div>
      )}
    </nav>
  );
}
