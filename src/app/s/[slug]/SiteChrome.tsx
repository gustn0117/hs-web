import Link from "next/link";

const PHONE = "010-3319-2509";

/** 서비스 전용 사이트의 머리말. 본 사이트와 달리 메뉴를 두지 않고 한 장에 집중한다. */
export function ServiceHeader({ siteName }: { siteName: string }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--c-line)]">
      <div className="max-w-[1100px] mx-auto px-5 h-[68px] flex items-center justify-between gap-4">
        <Link href="/" className="no-underline">
          <span className="block text-[15px] md:text-[17px] font-extrabold tracking-[-0.03em] text-[var(--c-text)]">
            {siteName}
          </span>
        </Link>
        <div className="flex items-center gap-2.5">
          <a
            href={`tel:${PHONE}`}
            className="hidden sm:inline-flex items-center h-10 px-3 text-[14px] font-bold text-[var(--c-text)] no-underline hover:text-[var(--c-main)] transition-colors tnum"
          >
            {PHONE}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center h-10 px-4 bg-[var(--c-main)] text-white text-[13.5px] font-bold no-underline hover:opacity-90 transition-opacity"
          >
            상담 신청
          </a>
        </div>
      </div>
    </header>
  );
}

export function ServiceFooter({ siteName }: { siteName: string }) {
  return (
    <footer className="border-t border-[var(--c-line)] bg-white">
      <div className="max-w-[1100px] mx-auto px-5 py-10 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-[15px] font-extrabold tracking-[-0.03em] text-[var(--c-text)]">{siteName}</p>
          <p className="mt-2 text-[13px] text-[var(--c-sub)] leading-[1.8]">
            HS WEB이 운영하는 서비스 전용 사이트입니다.
            <br />
            대표 심현수 · 평일 10:00 — 19:00
          </p>
        </div>
        <div className="text-[13px] leading-[2]">
          <a href={`tel:${PHONE}`} className="block text-[var(--c-text)] font-bold no-underline tnum">
            {PHONE}
          </a>
          <a
            href="https://hsweb.pics"
            className="block text-[var(--c-sub)] no-underline hover:text-[var(--c-main)] transition-colors"
          >
            HS WEB 본 사이트
          </a>
          <a
            href="https://hsweb.pics/portfolio"
            className="block text-[var(--c-sub)] no-underline hover:text-[var(--c-main)] transition-colors"
          >
            전체 제작 사례
          </a>
        </div>
      </div>
      <div className="border-t border-[var(--c-line)]">
        <div className="max-w-[1100px] mx-auto px-5 py-4 text-[12px] text-[var(--c-sub-2)]">
          © {new Date().getFullYear()} HS WEB. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
