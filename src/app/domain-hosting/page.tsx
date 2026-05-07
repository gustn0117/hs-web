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
                  <span className="text-[var(--c-sub)]">비용 범위</span>
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

        {/* Hosting cost highlight — below the two cards */}
        <div className="mt-4 rounded-[14px] border border-[var(--c-main)]/20 bg-gradient-to-br from-[var(--c-main-bg)] to-white p-6 md:p-7">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-5 md:gap-8">
            <div className="flex items-baseline gap-2 shrink-0">
              <span className="p-overline">TYPICAL COST</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-[36px] md:text-[44px] font-black text-[var(--c-text)] tnum leading-none">7,000</span>
                <span className="text-[16px] font-bold text-[var(--c-text-2)]">원</span>
                <span className="text-[14px] text-[var(--c-sub)] ml-1">/ 월</span>
                <span className="text-[12.5px] text-[var(--c-sub)] ml-2">정도로 생각하시면 됩니다</span>
              </div>
              <p className="text-[12.5px] md:text-[13px] text-[var(--c-text-2)] leading-[1.7] md:max-w-[420px]">
                소규모 홈페이지는 <strong className="text-[var(--c-text)]">월 7,000원</strong> 안팎이 일반적이에요.
                쇼핑몰·트래픽 많은 사이트는 사양에 따라 월 1~5만원대까지 올라갑니다.
              </p>
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

      {/* External hosting compatibility */}
      <Section
        overline="EXTERNAL HOSTING"
        title="다른 호스팅을 직접 가져오셔도 됩니다"
        subtitle="이미 사용 중인 호스팅이나 원하는 업체가 있다면 그쪽으로 연결할 수 있어요. 다만 제작 방식에 따라 호환되는 호스팅 종류가 달라집니다."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Custom build hosting types */}
          <div className="relative p-7 rounded-[14px] border border-[var(--c-line)] bg-gradient-to-br from-white to-[var(--c-main-bg)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-chip p-chip-point">자체 개발 (Next.js)</span>
            </div>
            <h3 className="text-[18px] md:text-[20px] font-bold tracking-tight mb-2">
              Node.js 실행이 가능한 호스팅이 필요해요
            </h3>
            <p className="text-[13.5px] text-[var(--c-sub)] leading-[1.7] mb-4">
              HS WEB이 만드는 사이트는 Next.js 기반이라 단순 정적 호스팅 외에
              <strong className="text-[var(--c-text)]"> Node.js 런타임</strong>이 동작하는 환경이 필요합니다.
            </p>
            <div className="space-y-1.5 pt-4 border-t border-[var(--c-line)]">
              <p className="text-[11px] font-bold text-[var(--c-sub)] uppercase tracking-wider mb-2">호환 OK</p>
              {[
                "AWS (EC2 · Lightsail · ECS)",
                "Vercel · Netlify",
                "DigitalOcean · Linode",
                "자체 서버 (Docker 가능)",
                "Cloudflare Pages (정적 일부)",
              ].map((h) => (
                <div key={h} className="flex items-center gap-2 text-[13px]">
                  <svg className="w-3.5 h-3.5 text-[var(--c-new)] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[var(--c-text-2)]">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Static / shared hosting */}
          <div className="relative p-7 rounded-[14px] border border-[var(--c-line)] bg-gradient-to-br from-white to-slate-50">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                일반 웹호스팅
              </span>
            </div>
            <h3 className="text-[18px] md:text-[20px] font-bold tracking-tight mb-2">
              가비아·카페24·닷홈 같은 일반 호스팅은
            </h3>
            <p className="text-[13.5px] text-[var(--c-sub)] leading-[1.7] mb-4">
              대부분 <strong className="text-[var(--c-text)]">PHP/MySQL 기반</strong>의 정적·공유 호스팅이라
              Next.js는 그대로 올릴 수 없습니다. 단, 일부 상위 플랜은 Node.js 지원을 별도 제공합니다.
            </p>
            <div className="space-y-1.5 pt-4 border-t border-[var(--c-line)]">
              <p className="text-[11px] font-bold text-[var(--c-sub)] uppercase tracking-wider mb-2">상황별 안내</p>
              {[
                { ok: false, t: "기본 웹호스팅 플랜 (월 3~7천원대)" },
                { ok: true, t: "Node.js 지원 플랜 (가비아 g클라우드 등)" },
                { ok: false, t: "워드프레스 전용 호스팅" },
                { ok: true, t: "VPS · 클라우드 서버 옵션" },
              ].map((h) => (
                <div key={h.t} className="flex items-center gap-2 text-[13px]">
                  {h.ok ? (
                    <svg className="w-3.5 h-3.5 text-[var(--c-new)] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-[var(--c-hot)] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-[var(--c-text-2)]">{h.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="rounded-[12px] border border-[var(--c-line)] bg-white p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 rounded-[8px] bg-[var(--c-main-bg)] text-[var(--c-main)] flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-[var(--c-text)] mb-1.5">제작 방식에 따라 호환 호스팅이 달라집니다</p>
              <ul className="list-none m-0 space-y-1 text-[13px] text-[var(--c-sub)] leading-[1.7]">
                <li>• <strong className="text-[var(--c-text-2)]">자체 개발 (HS WEB 방식):</strong> Node.js 실행 가능한 호스팅 필요. 성능·SEO·확장성에서 유리</li>
                <li>• <strong className="text-[var(--c-text-2)]">정적 사이트:</strong> 일반 웹호스팅에도 올릴 수 있지만 동적 기능에 한계</li>
                <li>• <strong className="text-[var(--c-text-2)]">워드프레스 등 PHP 기반:</strong> 일반 웹호스팅이면 대부분 호환</li>
              </ul>
              <p className="text-[12.5px] text-[var(--c-sub)] mt-3 leading-[1.7]">
                이미 쓰고 계신 호스팅이 있다면 사양 알려주세요. <strong className="text-[var(--c-text)]">호환 여부와 옮기는 방법</strong>을 무료로 점검해드립니다.
              </p>
            </div>
          </div>
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
