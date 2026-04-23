import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--c-line)] bg-[var(--c-bg-1)]">
      {/* Newsletter band */}
      <div className="border-b border-[var(--c-line)]">
        <div className="max-w-[1280px] mx-auto px-5 py-16 md:py-20 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <p className="p-overline mb-3">GET IN TOUCH</p>
            <h2 className="p-h1-xl mb-3">
              새 프로젝트를<br />
              시작할 준비가 되셨나요?
            </h2>
            <p className="text-[15px] text-[var(--c-sub)] leading-[1.7] max-w-[520px]">
              상담 신청하시면 24시간 이내 담당자가 회신드립니다.<br />
              전화 상담은 평일 업무시간 내 1시간 이내 연결 가능합니다.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/contact" className="p-btn p-btn-dark p-btn-xl !w-[200px]">
              무료 상담 신청
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a href="tel:010-3319-2509" className="p-btn p-btn-xl !w-[200px] tnum">
              010-3319-2509
            </a>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1280px] mx-auto px-5 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10">
          <div className="col-span-2">
            <Link href="/" className="flex items-baseline gap-1.5 no-underline mb-4 group">
              <span className="text-[18px] font-extrabold tracking-[-0.035em] text-[var(--c-text)] group-hover:text-[var(--c-main)] transition-colors">
                HS WEB
              </span>
              <span className="text-[10px] font-semibold text-[var(--c-sub)] tracking-[0.15em] uppercase hidden sm:inline">
                Web Agency
              </span>
            </Link>
            <p className="text-[13.5px] text-[var(--c-sub)] leading-[1.75] max-w-[360px] mb-5">
              홈페이지 제작부터 운영까지, 비즈니스 성장에 필요한 모든 웹 솔루션을 제공하는 전문 웹에이전시입니다.
            </p>
            <dl className="grid grid-cols-[60px_1fr] gap-y-1.5 text-[13px] max-w-[320px]">
              <dt className="text-[var(--c-sub)]">대표</dt>
              <dd className="text-[var(--c-text-2)] font-medium">심현수</dd>
              <dt className="text-[var(--c-sub)]">연락처</dt>
              <dd className="text-[var(--c-text-2)] font-semibold tnum">010-3319-2509</dd>
              <dt className="text-[var(--c-sub)]">운영</dt>
              <dd className="text-[var(--c-text-2)] font-medium">평일 10:00 — 19:00</dd>
              <dt className="text-[var(--c-sub)]">사이트</dt>
              <dd className="text-[var(--c-text-2)] font-medium tnum">hsweb.pics</dd>
            </dl>

            {/* Quick badges */}
            <div className="mt-6 flex flex-wrap gap-1.5">
              <span className="p-chip">SSL 보안</span>
              <span className="p-chip">SEO 기본</span>
              <span className="p-chip">반응형</span>
              <span className="p-chip">전자 계약</span>
            </div>
          </div>

          <FooterCol
            title="서비스"
            links={[
              { label: "반응형 홈페이지", href: "/services/responsive-web" },
              { label: "쇼핑몰 구축", href: "/services/ecommerce" },
              { label: "랜딩페이지", href: "/services/landing-page" },
              { label: "웹 애플리케이션", href: "/services/web-app" },
              { label: "CMS 시스템", href: "/services/cms" },
              { label: "기술 마케팅", href: "/services/marketing" },
            ]}
          />
          <FooterCol
            title="회사"
            links={[
              { label: "포트폴리오", href: "/portfolio" },
              { label: "제작 과정", href: "/process" },
              { label: "가격 안내", href: "/pricing" },
              { label: "도메인·호스팅", href: "/domain-hosting" },
              { label: "고객 후기", href: "/testimonials" },
            ]}
          />
          <FooterCol
            title="고객지원"
            links={[
              { label: "문의하기", href: "/contact" },
              { label: "사이트 관리", href: "/client" },
              { label: "이용약관", href: "/terms" },
              { label: "개인정보처리방침", href: "/privacy" },
            ]}
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--c-line)]">
        <div className="max-w-[1280px] mx-auto px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px] text-[var(--c-sub)]">
          <p>© 2026 HS WEB. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-[var(--c-sub)] no-underline hover:text-[var(--c-text)]">이용약관</Link>
            <span className="text-[var(--c-line-3)]">|</span>
            <Link href="/privacy" className="text-[var(--c-sub)] no-underline hover:text-[var(--c-text)] font-semibold">개인정보처리방침</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[13px] font-bold text-[var(--c-text)] mb-4">{title}</h4>
      <ul className="list-none space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[13px] text-[var(--c-sub)] no-underline hover:text-[var(--c-text)] p-anim-link"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
