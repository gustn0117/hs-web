import type { Metadata } from "next";
import { PageShell, Section } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "홈페이지 진행 절차 — 정보 수집 · 초안 · 피드백 · 완료",
  description:
    "HS WEB의 홈페이지 제작 진행 절차를 안내합니다. 필요한 정보를 제공받고, 그 정보를 바탕으로 초안을 제작해 보내드리며, 피드백 과정을 거쳐 최종 결과물로 완성합니다.",
  keywords: ["홈페이지 제작 절차", "홈페이지 진행 과정", "웹사이트 제작 순서", "홈페이지 피드백"],
  alternates: { canonical: "https://hsweb.pics/process" },
};

const steps = [
  {
    n: "01",
    title: "정보 제공",
    outcome: "프로젝트 정보 · 자료",
    desc: "프로젝트 목적과 타깃, 원하는 분위기, 사이트에 들어갈 내용을 알려주세요. 보유하신 로고·이미지·텍스트 등 자료가 있으면 함께 전달해주시면 됩니다. 없으면 같이 정리해드립니다.",
    deliverables: ["요구사항 · 참고 사이트", "로고 · 이미지 · 텍스트", "콘텐츠 자료 일체"],
  },
  {
    n: "02",
    title: "초안 제작",
    outcome: "디자인 + 구조 초안",
    desc: "전달받은 정보를 바탕으로 사이트의 디자인과 구조 초안을 제작합니다. 메인 페이지를 중심으로 내부 페이지의 방향성까지 한 번에 잡습니다.",
    deliverables: ["메인 페이지 시안", "내부 페이지 구성안", "반응형 모바일 시안"],
  },
  {
    n: "03",
    title: "초안 전달 · 피드백",
    outcome: "수정 반영 (2~3회)",
    desc: "완성된 초안을 보내드립니다. 마음에 드는 부분과 수정하고 싶은 부분을 자유롭게 알려주시면 함께 다듬어 나갑니다. 디자인이 확정될 때까지 2~3회 수정이 포함됩니다.",
    deliverables: ["피드백 검토", "디자인 수정 반영", "확정 시안 공유"],
  },
  {
    n: "04",
    title: "제작 완료 · 전달",
    outcome: "실 서비스 배포",
    desc: "확정된 시안을 기반으로 개발·퍼블리싱을 마무리하고, 전체 페이지 점검 후 실제 사이트로 배포합니다. 도메인 연결과 운영 가이드까지 함께 전달드립니다.",
    deliverables: ["개발 · QA 점검", "도메인 · 호스팅 연결", "운영 가이드 전달"],
  },
];

export default function ProcessPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "진행 절차" }]}
      overline="HOW IT WORKS"
      title="정보 → 초안 → 피드백 → 완료."
      subtitle="필요한 정보를 받아 초안을 만들고, 함께 피드백하며 다듬어 완성합니다. 단계마다 무엇을 진행하는지 투명하게 공유합니다."
      stats={[
        { label: "진행 단계", value: "4", suffix: "단계" },
        { label: "시안 수정", value: "2~3", suffix: "회 포함" },
        { label: "소스코드", value: "100", suffix: "% 제공" },
        { label: "재의뢰율", value: "95", suffix: "%" },
      ]}
    >
      {/* Visual hero banner */}
      <Section>
        <div className="relative rounded-[16px] overflow-hidden border border-[var(--c-line)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80&auto=format&fit=crop"
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, rgba(10,42,94,0.88) 0%, rgba(30,41,59,0.75) 55%, rgba(30,41,59,0.35) 100%)",
            }}
          />
          <div className="absolute inset-0 p-bg-grid-dots opacity-[0.08] pointer-events-none" />

          <div className="relative p-8 md:p-14 min-h-[240px] md:min-h-[320px] flex flex-col justify-center">
            <p className="text-[11px] font-bold text-white/70 tracking-[0.15em] uppercase mb-4">
              OUR WAY OF WORKING
            </p>
            <h3 className="text-[28px] md:text-[40px] font-black tracking-[-0.03em] text-white leading-[1.15] mb-4 max-w-[640px]">
              정보 주시면 초안 만들고,<br />
              함께 다듬어 완성합니다.
            </h3>
            <p className="text-[14.5px] md:text-[15.5px] text-white/75 leading-[1.75] max-w-[560px]">
              자료가 정리되어 있지 않아도 괜찮습니다. 필요한 정보부터 같이 정리해
              초안을 제작하고, 피드백을 통해 원하는 결과물로 완성해 드립니다.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {["정보 정리 함께", "수정 2~3회 포함", "단계별 공유", "소스코드 이전"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center h-7 px-3 rounded-full bg-white/10 border border-white/20 text-white text-[12px] font-semibold backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Visual timeline */}
      <Section overline="TIMELINE" title="4단계 진행 절차">
        <div className="space-y-3">
          {steps.map((s) => (
            <div key={s.n} className="grid grid-cols-[72px_1fr] md:grid-cols-[120px_1fr] gap-4 md:gap-6 items-start p-6 md:p-7 rounded-[14px] border border-[var(--c-line)] bg-white hover:border-[var(--c-text)] transition-colors group">
              <div>
                <div className="text-[44px] md:text-[56px] font-black tracking-tight leading-none text-[var(--c-line-2)] group-hover:text-[var(--c-main)] transition-colors tnum">
                  {s.n}
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-[18px] md:text-[22px] font-bold tracking-tight">{s.title}</h3>
                  <span className="p-chip p-chip-point">{s.outcome}</span>
                </div>
                <p className="text-[14px] text-[var(--c-text-2)] leading-[1.7] mb-4">{s.desc}</p>
                <ul className="list-none grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1.5">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-1.5 text-[12.5px] text-[var(--c-sub)]">
                      <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--c-main)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Principle highlights */}
      <Section overline="PRINCIPLES" title="프로젝트 운영 원칙" subtitle="HS WEB이 모든 프로젝트에 적용하는 3가지 약속입니다.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              t: "투명한 진행",
              d: "모든 단계의 진행 상황과 일정을 실시간으로 공유합니다. 예상과 다른 이슈는 즉시 알립니다.",
            },
            {
              t: "빠른 커뮤니케이션",
              d: "업무 시간 내 문의는 1시간 이내 답변. 긴급 이슈는 카톡·전화로 즉시 대응합니다.",
            },
            {
              t: "계약서 기반",
              d: "모든 프로젝트는 전자 계약서로 진행되며, 범위·일정·정산이 명확히 기재됩니다.",
            },
          ].map((p, i) => (
            <div key={p.t} className="p-7 rounded-[14px] border border-[var(--c-line)] bg-white hover:border-[var(--c-text)] transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold text-[var(--c-main)] tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 h-px bg-[var(--c-line)]" />
              </div>
              <h3 className="text-[18px] font-bold tracking-tight mb-2">{p.t}</h3>
              <p className="text-[13.5px] text-[var(--c-sub)] leading-[1.7]">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
