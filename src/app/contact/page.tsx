import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { PageShell, Section } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "무료 상담 · 문의하기 - 홈페이지 제작 견적 문의",
  description:
    "홈페이지 제작, 쇼핑몰 구축, 랜딩페이지 제작 무료 상담을 받아보세요. 프로젝트 규모에 맞는 맞춤 견적을 24시간 내 안내드립니다.",
  keywords: ["홈페이지 제작 문의", "홈페이지 제작 견적", "웹사이트 제작 상담", "홈페이지 제작 비용"],
  alternates: { canonical: "https://hsweb.pics/contact" },
};

const CONTACT_INFO = [
  {
    label: "전화",
    value: "010-3319-2509",
    sub: "평일 10:00 ~ 19:00",
    href: "tel:010-3319-2509",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    label: "응답 시간",
    value: "24시간 이내",
    sub: "평일 업무 시간 기준 1시간 이내",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "담당자",
    value: "심현수",
    sub: "HS WEB 대표",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "문의하기" }]}
      overline="GET IN TOUCH"
      title="어떤 프로젝트든 편하게 문의하세요."
      subtitle="프로젝트 정보를 남겨주시면 24시간 이내 담당자가 회신해드립니다. 첫 상담은 무료입니다."
      stats={[
        { label: "응답 시간", value: "1", suffix: "시간 이내" },
        { label: "무료 상담", value: "100", suffix: "%" },
        { label: "문의 유형", value: "7", suffix: "개 분야" },
        { label: "견적 제공", value: "24", suffix: "시간 내" },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <main className="space-y-10">
          <Section>
            <div className="p-card overflow-hidden">
              <div className="px-6 py-5 border-b border-[var(--c-line)] bg-[var(--c-bg-1)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex w-2 h-2 rounded-full bg-[var(--c-new)] animate-pulse" />
                  <p className="text-[13px] font-semibold text-[var(--c-text)]">지금 접수 가능</p>
                </div>
                <p className="text-[12px] text-[var(--c-sub)]">필수 항목(*)만 입력하셔도 상담 가능합니다.</p>
              </div>
              <div className="p-6">
                <ContactForm />
              </div>
            </div>
          </Section>
        </main>

        <aside className="space-y-4">
          {/* Contact info list */}
          <div className="p-card overflow-hidden">
            <div className="p-section-head">
              <h2>연락처</h2>
            </div>
            <ul className="list-none">
              {CONTACT_INFO.map((c) => (
                <li key={c.label} className="px-5 py-4 border-b border-[var(--c-line)] last:border-b-0 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[var(--c-bg-2)] text-[var(--c-text)] flex items-center justify-center shrink-0">
                    {c.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-[var(--c-sub)] tracking-wider uppercase mb-0.5">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-[14px] font-bold text-[var(--c-text)] no-underline hover:text-[var(--c-main)] tnum">{c.value}</a>
                    ) : (
                      <p className="text-[14px] font-bold text-[var(--c-text)]">{c.value}</p>
                    )}
                    <p className="text-[11.5px] text-[var(--c-sub)] mt-0.5 leading-[1.5]">{c.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Dark card: quick call */}
          <div className="p-6 rounded-[14px] bg-[var(--c-text)] text-white">
            <h3 className="text-[14px] font-bold mb-2">급하게 상담이 필요하신가요?</h3>
            <p className="text-[12.5px] text-white/70 leading-[1.6] mb-4">
              바로 전화 주세요. 업무 시간 내 1시간 이내 연결됩니다.
            </p>
            <a
              href="tel:010-3319-2509"
              className="inline-flex items-center justify-center w-full h-11 rounded-[10px] bg-white text-[var(--c-text)] font-bold text-[14px] tnum no-underline hover:bg-[var(--c-bg-2)] transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              010-3319-2509
            </a>
          </div>

          {/* Privacy note */}
          <div className="p-4 rounded-[10px] border border-[var(--c-line)] bg-[var(--c-bg-1)]">
            <p className="text-[11.5px] text-[var(--c-sub)] leading-[1.7]">
              <strong className="text-[var(--c-text)]">개인정보 보호</strong>
              <br />
              입력하신 정보는 상담 목적 외에 사용되지 않으며, 법적 보관 기간 이후 자동 파기됩니다.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
