import Link from "next/link";
import type { NavItem } from "./ServiceNav";

const PHONE = "010-3319-2509";

/** 서비스 전용 사이트의 꼬리말. 본 사이트 꼬리말과 같은 결로 맞춘다. */
export function ServiceFooter({ siteName, nav }: { siteName: string; nav: NavItem[] }) {
  return (
    <footer className="border-t border-[var(--c-line)] bg-white">
      <div className="max-w-[1280px] mx-auto px-5 py-12 grid gap-8 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <p className="text-[16px] font-extrabold tracking-[-0.035em] text-[var(--c-text)]">{siteName}</p>
          <p className="mt-3 text-[13px] text-[var(--c-sub)] leading-[1.9]">
            하온이 운영하는 서비스 전용 사이트입니다.
            <br />
            대표 심현수 · 평일 10:00 — 19:00
          </p>
          <a
            href={`tel:${PHONE}`}
            className="inline-block mt-4 text-[17px] font-extrabold text-[var(--c-text)] no-underline tnum"
          >
            {PHONE}
          </a>
        </div>

        <div>
          <p className="text-[12px] font-bold text-[var(--c-sub-2)] tracking-wider">메뉴</p>
          <ul className="list-none m-0 p-0 mt-3">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="block py-1 text-[13.5px] text-[var(--c-text-2)] no-underline hover:text-[var(--c-main)] transition-colors"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[12px] font-bold text-[var(--c-sub-2)] tracking-wider">하온</p>
          <ul className="list-none m-0 p-0 mt-3">
            {[
              { href: "https://hsweb.pics", label: "본 사이트" },
              { href: "https://hsweb.pics/portfolio", label: "전체 제작 사례" },
              { href: "https://hsweb.pics/insights", label: "정보공유" },
              { href: "https://hsweb.pics/contact", label: "전체 서비스 문의" },
            ].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block py-1 text-[13.5px] text-[var(--c-text-2)] no-underline hover:text-[var(--c-main)] transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--c-line)]">
        <div className="max-w-[1280px] mx-auto px-5 py-4 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[var(--c-sub-2)]">
          <span>© {new Date().getFullYear()} 하온. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <a
              href="https://hsweb.pics/terms"
              className="text-[var(--c-sub-2)] no-underline hover:text-[var(--c-main)] transition-colors"
            >
              이용약관
            </a>
            <a
              href="https://hsweb.pics/privacy"
              className="text-[var(--c-sub-2)] no-underline hover:text-[var(--c-main)] transition-colors"
            >
              개인정보처리방침
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
