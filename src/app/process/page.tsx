import type { Metadata } from "next";
import { PageShell, Section } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "홈페이지 제작 과정 - 상담부터 런칭까지 체계적 프로세스",
  description:
    "HS WEB의 홈페이지 제작 과정을 확인하세요. 상담 & 기획, UI/UX 디자인, 프론트엔드 개발, 테스트, 런칭까지 체계적인 프로세스로 최상의 결과물을 만들어냅니다.",
  keywords: ["홈페이지 제작 과정", "홈페이지 제작 절차", "웹사이트 개발 프로세스", "홈페이지 제작 기간"],
  alternates: { canonical: "https://hsweb.pics/process" },
};

const steps = [
  {
    n: "01",
    title: "상담 · 요구사항 분석",
    outcome: "기획안 · 견적서",
    desc: "프로젝트 목표, 타겟 사용자, 필요 기능을 파악하고 범위를 명확히 합니다. 레퍼런스 분석 후 기획안과 견적서를 전달합니다.",
    deliverables: ["요구사항 정의서", "와이어프레임 초안", "견적서 · 제안서"],
  },
  {
    n: "02",
    title: "계약 · 자료 수집",
    outcome: "계약서 · 자료 체크",
    desc: "계약 체결 후 로고, 이미지, 텍스트 등 필요한 자료를 전달받습니다.",
    deliverables: ["전자 계약서", "자료 체크리스트", "프로젝트 일정표"],
  },
  {
    n: "03",
    title: "UI/UX 디자인",
    outcome: "디자인 시안 2~3종",
    desc: "브랜드 아이덴티티에 맞는 UI/UX를 설계합니다. 메인 + 주요 내부 페이지 시안을 제공하고 2~3회 수정이 포함됩니다.",
    deliverables: ["메인 페이지 시안", "내부 페이지 시안", "반응형 모바일 시안"],
  },
  {
    n: "04",
    title: "개발 · 퍼블리싱",
    outcome: "스테이징 사이트",
    desc: "확정된 디자인을 기반으로 반응형 퍼블리싱과 기능 개발을 진행합니다. 크로스 브라우저 호환성을 보장합니다.",
    deliverables: ["반응형 HTML/CSS", "백엔드 연동", "관리자 페이지 (해당 시)"],
  },
  {
    n: "05",
    title: "테스트 · 런칭",
    outcome: "실 서비스 배포",
    desc: "전체 페이지 QA, 성능 테스트, SEO 기본 설정 후 도메인 연결과 호스팅 배포를 진행합니다.",
    deliverables: ["QA 리포트", "SEO 기본 설정", "운영 가이드"],
  },
  {
    n: "06",
    title: "유지보수 · 운영",
    outcome: "지속적 지원",
    desc: "런칭 후 간단한 텍스트·이미지·콘텐츠 수정은 기간 제한 없이 계속 무료로 지원합니다.",
    deliverables: ["유지보수 지원", "보안 업데이트", "성능 모니터링"],
  },
];

export default function ProcessPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "제작 과정" }]}
      overline="HOW IT WORKS"
      title="상담부터 런칭, 운영까지."
      subtitle="모든 프로젝트는 동일한 체계로 진행됩니다. 각 단계마다 고객과 공유하며 투명하게."
      stats={[
        { label: "총 단계", value: "6", suffix: "단계" },
        { label: "시안 수정", value: "2~3", suffix: "회 포함" },
        { label: "소스코드", value: "100", suffix: "% 제공" },
        { label: "재의뢰율", value: "95", suffix: "%" },
      ]}
    >
      {/* Visual timeline */}
      <Section overline="TIMELINE" title="6단계 프로세스">
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
