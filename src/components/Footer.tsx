"use client";

import Link from "next/link";
import { useState } from "react";

const footerSections = [
  {
    title: "서비스",
    links: [
      { label: "반응형 홈페이지", href: "/services" },
      { label: "쇼핑몰 구축", href: "/services" },
      { label: "랜딩페이지", href: "/services" },
      { label: "웹 애플리케이션", href: "/services" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "포트폴리오", href: "/portfolio" },
      { label: "제작 과정", href: "/process" },
      { label: "가격 안내", href: "/pricing" },
      { label: "문의하기", href: "/contact" },
    ],
  },
  {
    title: "고객지원",
    links: [
      { label: "개인정보처리방침", href: "#" },
      { label: "이용약관", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "블로그", href: "#" },
    ],
  },
];

const socialIcons = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "Blog",
    href: "#",
    icon: (
      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
  {
    name: "KakaoTalk",
    href: "#",
    icon: (
      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3c-5.076 0-9.193 3.416-9.193 7.63 0 2.713 1.804 5.092 4.504 6.44-.141.504-.907 3.242-.94 3.458 0 0-.018.172.091.237.109.065.237.031.237.031.312-.043 3.623-2.378 4.195-2.79.357.053.724.08 1.106.08 5.076 0 9.193-3.416 9.193-7.63S17.076 3 12 3z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    alert("구독 신청이 완료되었습니다!");
    setEmail("");
  };

  return (
    <footer className="relative">
      {/* Top gradient line */}
      <div className="h-0.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />

      <div className="bg-[var(--color-dark)] pt-14 pb-8 relative overflow-hidden">
        {/* Animated gradient background overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-accent), var(--color-primary))",
            backgroundSize: "400% 400%",
            animation: "bg-gradient-shift 15s ease infinite",
          }}
        />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="text-[1.3rem] font-extrabold text-white no-underline inline-block mb-4"
              >
                HS <span className="gradient-text">WEB</span>
              </Link>
              <p className="text-[var(--color-gray-light)] text-[0.9rem] leading-relaxed max-w-[280px] mb-6">
                감각적인 디자인과 최신 기술력으로 비즈니스 성장을 돕는 웹 전문
                에이전시입니다.
              </p>

              {/* Newsletter */}
              <form onSubmit={handleNewsletter} className="flex gap-2 max-w-[300px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 구독"
                  required
                  className="input-glow flex-1 px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white text-[0.85rem] focus:outline-none focus:border-[var(--color-primary)] transition-colors placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  className="btn-ripple px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-emerald-600 text-white rounded-lg text-[0.85rem] font-semibold border-none cursor-pointer hover:shadow-md hover:shadow-emerald-500/20 transition-all"
                >
                  구독
                </button>
              </form>
            </div>

            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-white font-semibold mb-4 text-[0.95rem]">
                  {section.title}
                </h4>
                <ul className="list-none space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="link-underline-slide text-[var(--color-gray-light)] no-underline text-[0.9rem] hover:text-[var(--color-primary)] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[var(--color-gray-light)] text-[0.85rem]">
              &copy; 2026 HS WEB. All rights reserved.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  title={s.name}
                  className="w-9 h-9 bg-white/[0.06] rounded-lg flex items-center justify-center text-[var(--color-gray-light)] no-underline hover:bg-[var(--color-primary)] hover:text-white hover:scale-110 hover:rotate-6 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-[0.75rem]">
              Made with care by HS WEB Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
