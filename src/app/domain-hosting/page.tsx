import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/PageShell";
import {
  DomainIllustration,
  HostingIllustration,
  NetworkFlow,
  ServerStack3D,
} from "./Illustrations";

export const metadata: Metadata = {
  title: "도메인 & 호스팅이란?",
  description: "도메인과 호스팅이 무엇인지, 웹사이트 유지에 왜 필요한지 쉽고 자세하게 설명합니다.",
  alternates: { canonical: "https://hsweb.pics/domain-hosting" },
};

export default function DomainHostingPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "도메인·호스팅" }]}
      overline="DOMAIN & HOSTING"
      title="도메인과 호스팅, 왜 필요할까요?"
      subtitle="홈페이지를 만든 뒤에도 인터넷에서 작동하려면 도메인·호스팅이 반드시 필요합니다. 개념과 비용을 쉽게 정리했습니다."
      stats={[
        { label: "도메인 최저가", value: "3,000", suffix: "원/년" },
        { label: "호스팅 최저가", value: "7,000", suffix: "원/월" },
        { label: "대행 수수료", value: "0", suffix: "원" },
        { label: "갱신 알림", value: "자동", suffix: "" },
      ]}
    >
      {/* Concept comparison — 2 big cards with 3D illustrations */}
      <Section overline="CONCEPT" title="집에 비유하면 이렇습니다" subtitle="두 가지 모두 웹사이트 운영에 필수입니다.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Domain card */}
          <div className="relative p-8 rounded-[16px] border border-[var(--c-line)] bg-gradient-to-br from-white to-[var(--c-main-bg)] overflow-hidden group hover:border-[var(--c-main)] transition-colors">
            <div className="relative z-[1]">
              <div className="flex items-center gap-2 mb-5">
                <span className="p-chip p-chip-point">비유 · 주소</span>
                <span className="text-[11px] text-[var(--c-sub)] tracking-widest uppercase">DOMAIN</span>
              </div>
              <h3 className="text-[24px] md:text-[28px] font-bold tracking-tight mb-3">도메인 = 집 주소</h3>
              <p className="text-[14px] text-[var(--c-text-2)] leading-[1.7] mb-6">
                사람이 기억할 수 있는 웹사이트 이름. <br />
                <span className="tnum font-semibold text-[var(--c-text)]">hsweb.pics</span>{" "}
                처럼 브라우저 주소창에 입력하는 문자.
              </p>

              <div className="my-6 -mx-2">
                <DomainIllustration />
              </div>

              <div className="pt-5 border-t border-[var(--c-line)] space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">예시</span>
                  <span className="font-semibold tnum">.com · .co.kr · .kr</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">비용</span>
                  <span className="font-semibold tnum">연 3,000~30,000원</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">갱신</span>
                  <span className="font-semibold">매년 1회</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hosting card */}
          <div className="relative p-8 rounded-[16px] border border-[var(--c-line)] bg-gradient-to-br from-white to-[#eef5f3] overflow-hidden group hover:border-[var(--c-main)] transition-colors">
            <div className="relative z-[1]">
              <div className="flex items-center gap-2 mb-5">
                <span className="p-chip p-chip-point">비유 · 건물</span>
                <span className="text-[11px] text-[var(--c-sub)] tracking-widest uppercase">HOSTING</span>
              </div>
              <h3 className="text-[24px] md:text-[28px] font-bold tracking-tight mb-3">호스팅 = 건물</h3>
              <p className="text-[14px] text-[var(--c-text-2)] leading-[1.7] mb-6">
                사이트 파일을 24시간 저장·전달하는 서버 공간. <br />
                내 컴퓨터 대신 전문 업체의 서버를 빌려 쓰는 것.
              </p>

              <div className="my-6 -mx-2">
                <HostingIllustration />
              </div>

              <div className="pt-5 border-t border-[var(--c-line)] space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">예시</span>
                  <span className="font-semibold">가비아 · 카페24 · AWS</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">비용</span>
                  <span className="font-semibold tnum">월 7,000~50,000원</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">갱신</span>
                  <span className="font-semibold">매월 또는 연간</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Flow diagram — animated network SVG with step cards */}
      <Section overline="HOW IT WORKS" title="접속 흐름" subtitle="주소창 입력부터 사이트 표시까지 4단계.">
        <div className="relative p-card p-6 md:p-10 overflow-hidden bg-gradient-to-br from-white to-[var(--c-main-bg)]">
          {/* Animated network SVG (desktop only) */}
          <div className="hidden md:block mb-6">
            <NetworkFlow />
          </div>

          {/* Step cards — always visible, 1 col mobile / 4 cols desktop, titles align with SVG icons */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { t: "브라우저", d: "주소창에 hsweb.pics 입력" },
              { t: "DNS", d: "도메인을 IP 주소로 변환" },
              { t: "호스팅 서버", d: "사이트 파일 전송" },
              { t: "사이트 표시", d: "브라우저가 화면에 렌더" },
            ].map((s, i) => (
              <div
                key={i}
                className="relative p-4 md:p-5 rounded-[10px] border border-[var(--c-line)] bg-white text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--c-main)] text-white text-[11px] font-bold tnum">
                    {i + 1}
                  </span>
                  <span className="text-[14px] font-bold text-[var(--c-text)]">{s.t}</span>
                </div>
                <p className="text-[12.5px] text-[var(--c-sub)] leading-[1.6]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Scenarios — what happens */}
      <Section overline="SCENARIOS" title="둘 중 하나만 있다면?">
        <div className="space-y-3">
          {[
            {
              title: "도메인만 있는 경우",
              status: "접속 불가",
              bad: true,
              desc: "주소는 있지만 건물(서버)이 없어 접속 시 아무것도 표시되지 않습니다.",
            },
            {
              title: "호스팅만 있는 경우",
              status: "접근 불가",
              bad: true,
              desc: "건물은 있지만 주소가 없어 숫자 IP로만 접속 가능 — 사용자가 찾을 수 없습니다.",
            },
            {
              title: "둘 다 있는 경우",
              status: "정상 운영",
              bad: false,
              desc: "도메인 입력 → 호스팅 서버의 사이트가 정상 표시. 우리가 매일 쓰는 웹사이트의 작동 방식입니다.",
            },
          ].map((s) => (
            <div key={s.title} className="flex items-start gap-4 p-5 md:p-6 rounded-[12px] border border-[var(--c-line)] bg-white">
              <span className={`shrink-0 inline-flex items-center h-7 px-3 rounded-full text-[11px] font-bold tracking-wide ${s.bad ? "bg-[var(--c-hot-bg)] text-[var(--c-hot)] border border-[var(--c-hot)]/20" : "bg-[var(--c-new-bg)] text-[var(--c-new)] border border-[var(--c-new)]/20"}`}>
                {s.status}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-bold text-[var(--c-text)] mb-1">{s.title}</h4>
                <p className="text-[13.5px] text-[var(--c-text-2)] leading-[1.7]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* HS WEB service highlight — dark card with 3D server stack */}
      <Section overline="HS WEB" title="대행 관리 서비스">
        <div className="p-8 md:p-10 rounded-[16px] bg-[var(--c-text)] text-white overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none p-bg-grid-dots opacity-[0.06]" />
          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 items-center">
            <div>
              <h3 className="text-[24px] md:text-[28px] font-bold tracking-tight mb-3">
                도메인·호스팅, HS WEB이 전부 대행합니다.
              </h3>
              <p className="text-[14px] text-white/70 leading-[1.75] max-w-[620px]">
                등록부터 설정, 연간 갱신 알림까지 모두 무료 대행.
                <br />
                실비 외 <strong className="text-white">별도 수수료가 전혀 없습니다.</strong>
              </p>
              <div className="flex flex-wrap gap-2 mt-5 mb-6">
                {["등록 대행", "연간 갱신", "실비 청구", "만료 알림", "DNS 관리"].map((t) => (
                  <span key={t} className="inline-flex items-center h-7 px-3 rounded-full bg-white/10 border border-white/20 text-white text-[12px] font-semibold">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/contact" className="inline-flex items-center justify-center h-12 px-6 rounded-[10px] bg-white text-[var(--c-text)] font-bold text-[14px] no-underline hover:bg-[var(--c-bg-2)] transition-colors">
                  상담 신청
                </Link>
                <a href="tel:010-3319-2509" className="inline-flex items-center justify-center h-12 px-6 rounded-[10px] border border-white/20 text-white font-semibold text-[14px] tnum no-underline hover:bg-white/5 transition-colors">
                  010-3319-2509
                </a>
              </div>
            </div>

            {/* 3D server stack illustration */}
            <div className="hidden md:block">
              <ServerStack3D />
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section overline="FAQ" title="자주 묻는 질문">
        <div className="border-t border-[var(--c-line)]">
          {[
            { q: "도메인과 호스팅 없이 사이트를 운영할 수 있나요?", a: "인터넷에서 접속 가능한 사이트를 운영하려면 도메인과 호스팅은 필수입니다. 제작 비용과 별개로, 사이트가 살아있으려면 매년/매월 유지해야 합니다." },
            { q: "도메인을 갱신하지 않으면 어떻게 되나요?", a: "만료되면 해당 주소로 접속할 수 없게 됩니다. 일정 기간이 지나면 다른 사람이 등록할 수 있으므로 중요한 도메인은 반드시 갱신하세요." },
            { q: "호스팅을 해지하면 사이트가 삭제되나요?", a: "네, 호스팅 서버에 저장된 파일이 삭제되므로 사이트에 접속할 수 없게 됩니다. HS WEB에서 제작한 사이트는 소스 코드를 별도 보관해 재배포가 가능합니다." },
            { q: "도메인·호스팅을 직접 관리해야 하나요?", a: "아닙니다. HS WEB에서 등록, 설정, 갱신까지 모두 대행해드립니다. 고객은 사이트 운영에만 집중하시면 됩니다." },
            { q: "이미 가지고 있는 도메인을 사용할 수 있나요?", a: "물론입니다. 기존 도메인을 그대로 연결해드립니다. DNS 설정만 변경하면 되므로 추가 비용은 없습니다." },
          ].map((faq, i) => (
            <details key={i} className="border-b border-[var(--c-line)] group">
              <summary className="flex items-start justify-between py-5 cursor-pointer list-none gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-[13px] font-bold text-[var(--c-main)] tnum mt-0.5">Q{i + 1}</span>
                  <span className="text-[15px] font-semibold text-[var(--c-text)] leading-[1.5]">{faq.q}</span>
                </div>
                <svg className="w-5 h-5 text-[var(--c-sub)] shrink-0 group-open:rotate-180 transition-transform mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="pb-5 pl-[40px] text-[14px] text-[var(--c-sub)] leading-[1.8]">{faq.a}</div>
            </details>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
