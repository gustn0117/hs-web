import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--c-line)] bg-[var(--c-bg-1)] mt-24">
      <div className="max-w-[1200px] mx-auto px-5 py-16">
        {/* Top CTA band */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-12 border-b border-[var(--c-line)] mb-12">
          <div>
            <h3 className="p-h2 mb-2">홈페이지가 필요하신가요?</h3>
            <p className="text-[14px] text-[var(--c-sub)]">지금 상담 신청하시면 24시간 이내 회신드립니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="tel:010-3319-2509" className="p-btn p-btn-lg tnum">010-3319-2509</a>
            <Link href="/contact" className="p-btn p-btn-dark p-btn-lg">견적 문의</Link>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-1.5 no-underline mb-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-[8px] bg-[var(--c-text)] text-white font-extrabold text-[13px]">H</span>
              <span className="text-[17px] font-extrabold tracking-tight text-[var(--c-text)]">HS WEB</span>
            </Link>
            <p className="text-[13px] text-[var(--c-sub)] leading-[1.7] max-w-[340px] mb-4">
              홈페이지 제작부터 운영까지, 비즈니스 성장에 필요한 모든 웹 솔루션을 제공합니다.
            </p>
            <dl className="grid grid-cols-[52px_1fr] gap-y-1 text-[13px]">
              <dt className="text-[var(--c-sub)]">대표</dt>
              <dd className="text-[var(--c-text-2)]">심현수</dd>
              <dt className="text-[var(--c-sub)]">연락처</dt>
              <dd className="text-[var(--c-text-2)] tnum">010-3319-2509</dd>
              <dt className="text-[var(--c-sub)]">운영</dt>
              <dd className="text-[var(--c-text-2)]">평일 10:00 — 19:00</dd>
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

        <div className="pt-6 border-t border-[var(--c-line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px] text-[var(--c-sub)]">
          <p>© 2026 HS WEB. All rights reserved.</p>
          <p className="tnum">hsweb.pics</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[13px] font-bold text-[var(--c-text)] mb-3">{title}</h4>
      <ul className="list-none space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[13px] text-[var(--c-sub)] no-underline hover:text-[var(--c-text)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
