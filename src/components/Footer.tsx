import Link from "next/link";

const footerSections = [
  {
    title: "서비스",
    links: [
      { label: "반응형 홈페이지", href: "/services/responsive-web" },
      { label: "쇼핑몰 구축", href: "/services/ecommerce" },
      { label: "랜딩페이지", href: "/services/landing-page" },
      { label: "기술 마케팅", href: "/services/marketing" },
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
      { label: "사이트 관리", href: "/client" },
      { label: "고객 후기", href: "/testimonials" },
      { label: "FAQ", href: "#" },
    ],
  },
];

export default function Footer() {
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
