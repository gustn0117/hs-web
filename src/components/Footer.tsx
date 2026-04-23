import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] mt-8">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-6 text-[12px]">
          <div className="col-span-2">
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-[var(--color-point)] text-white font-bold text-[11px]">H</span>
              <span className="text-[14px] font-bold text-[var(--color-text)]">HS WEB</span>
            </div>
            <p className="text-[var(--color-muted)] leading-relaxed">
              홈페이지 제작 전문 웹에이전시
            </p>
            <dl className="mt-3 grid grid-cols-[60px_1fr] gap-y-1 text-[12px]">
              <dt className="text-[var(--color-muted)]">대표</dt>
              <dd className="text-[var(--color-text-2)]">심현수</dd>
              <dt className="text-[var(--color-muted)]">연락처</dt>
              <dd className="text-[var(--color-text-2)] tnum">010-3319-2509</dd>
            </dl>
          </div>

          <FooterCol
            title="서비스"
            links={[
              { label: "반응형 홈페이지", href: "/services/responsive-web" },
              { label: "쇼핑몰 구축", href: "/services/ecommerce" },
              { label: "랜딩페이지", href: "/services/landing-page" },
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

        <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[var(--color-muted)]">
          <p>© 2026 HS WEB. All rights reserved.</p>
          <p className="tnum">Biz: 010-3319-2509 · HSWEB.PICS</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[var(--color-text)] font-semibold mb-2 text-[12px]">{title}</h4>
      <ul className="list-none space-y-1.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[var(--color-text-2)] no-underline hover:text-[var(--color-point)] text-[12px]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
