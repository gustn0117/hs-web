"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-24 bg-[var(--color-dark)]">
      {/* Background effects */}
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-30" />
      <div className="absolute top-10 right-[15%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-[10%] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 left-[30%] w-3 h-3 bg-blue-400 rounded-full opacity-20 animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-1/3 right-[25%] w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-float" style={{ animationDelay: "3s" }} />
      {/* Geometric decorations */}
      <div className="absolute top-[20%] left-[8%] w-12 h-12 border border-blue-500/10 rounded-lg animate-rotate-slow pointer-events-none" />
      <div className="absolute bottom-[15%] right-[12%] w-8 h-8 border border-blue-500/10 rounded-full animate-float pointer-events-none" style={{ animationDelay: "4s" }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Gradient border animated wrapper */}
        <div className="gradient-border-animated-dark">
          <div className="text-center py-16 px-6">
            {/* Urgency badge */}
            <div className="inline-flex items-center gap-2 bg-amber-500/15 backdrop-blur-sm border border-amber-400/20 px-5 py-2.5 rounded-full text-amber-300 text-[0.85rem] font-semibold mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
              이번 달 무료 상담 잔여: 3건
            </div>

            {/* Main badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-blue-300 text-[0.85rem] font-semibold mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              무료 상담 진행 중
            </div>

            <h2 className="text-[2.4rem] md:text-[2.8rem] font-extrabold text-white mb-5 tracking-tight">
              프로젝트를 시작할
              <br />
              <span className="shimmer-text">준비가 되셨나요?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-[500px] mx-auto leading-relaxed">
              지금 무료 상담을 신청하시면 맞춤 견적과 전략을 제안해드립니다.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/contact"
                className="btn-ripple group inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white px-9 py-4 rounded-xl font-bold text-[1.05rem] hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300 no-underline"
              >
                무료 상담 신청
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <a
                href="tel:010-0000-0000"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-9 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 no-underline"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                전화 상담
              </a>
            </div>

            {/* Trust points */}
            <div className="mt-8 flex justify-center gap-6 flex-wrap">
              {[
                { icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "부담 없이 결정" },
                { icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", text: "견적 24h 이내 발송" },
                { icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42", text: "무료 디자인 시안" },
              ].map((tp) => (
                <div key={tp.text} className="flex items-center gap-2 text-gray-400 text-[0.82rem]">
                  <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={tp.icon} />
                  </svg>
                  {tp.text}
                </div>
              ))}
            </div>

            {/* Mini stats */}
            <div className="mt-12 flex justify-center gap-8 md:gap-12 flex-wrap">
              {[
                { num: "24h", label: "평균 응답 시간" },
                { num: "100%", label: "맞춤 제작" },
                { num: "A/S", label: "무상 유지보수" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-white font-extrabold text-xl">{s.num}</div>
                  <div className="text-gray-500 text-[0.8rem] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
