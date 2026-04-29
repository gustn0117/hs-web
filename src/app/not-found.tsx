import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  description: "요청하신 페이지를 찾을 수 없습니다. URL을 확인하거나 홈으로 돌아가세요.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-5 py-20">
      <div className="max-w-[520px] w-full text-center">
        <p className="text-[12px] font-bold text-[var(--c-sub)] tracking-[0.18em] uppercase mb-4">404 NOT FOUND</p>
        <h1 className="text-[44px] md:text-[64px] font-black tracking-[-0.04em] text-[var(--c-text)] leading-[1.05] mb-5">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="text-[15px] text-[var(--c-sub)] leading-[1.7] mb-10">
          입력하신 주소가 잘못되었거나, 페이지가 이동·삭제되었을 수 있습니다.
          <br />
          홈으로 돌아가서 원하는 정보를 찾아보세요.
        </p>

        <div className="flex items-center gap-2 justify-center flex-wrap mb-10">
          <Link href="/" className="p-btn p-btn-dark p-btn-lg">
            홈으로
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link href="/contact" className="p-btn p-btn-lg">
            문의하기
          </Link>
        </div>

        <div className="pt-8 border-t border-[var(--c-line)]">
          <p className="text-[11px] font-bold text-[var(--c-sub-2)] tracking-wider uppercase mb-4">자주 찾는 페이지</p>
          <ul className="list-none flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px]">
            {[
              { href: "/services", label: "서비스" },
              { href: "/portfolio", label: "포트폴리오" },
              { href: "/pricing", label: "가격" },
              { href: "/process", label: "제작 과정" },
              { href: "/domain-hosting", label: "도메인·호스팅" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[var(--c-text-2)] hover:text-[var(--c-main)] no-underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
