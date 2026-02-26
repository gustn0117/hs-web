"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 bg-[var(--color-dark)] relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-[0.04]" />

      <div className="max-w-[600px] mx-auto px-6 text-center relative z-10">
        <h2 className="text-[2.2rem] md:text-[2.6rem] font-extrabold text-white mb-4 tracking-tight leading-tight">
          프로젝트를 시작할
          <br />
          준비가 되셨나요?
        </h2>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          무료 상담을 통해 맞춤 견적과 전략을 제안해드립니다.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 bg-white text-[var(--color-dark)] px-9 py-4 rounded-xl font-bold text-[1.05rem] hover:shadow-2xl transition-all duration-300 no-underline hover:scale-[1.02]"
          >
            무료 상담 신청
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <a
            href="tel:010-0000-0000"
            className="inline-flex items-center gap-2 text-gray-300 border border-white/15 px-9 py-4 rounded-xl font-semibold hover:bg-white/5 transition-all duration-300 no-underline"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            전화 상담
          </a>
        </div>
      </div>
    </section>
  );
}
