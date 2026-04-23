import type { Metadata } from "next";
import { PageShell, DefaultSidebar, Section } from "@/components/PageShell";

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
    duration: "1~2일",
    outcome: "기획안 · 견적서",
    desc: "프로젝트 목표, 타겟 사용자, 필요 기능을 파악하고 범위를 명확히 합니다.",
    deliverables: ["요구사항 정의서", "와이어프레임 초안", "견적서 및 제안서"],
  },
  {
    n: "02",
    title: "계약 · 자료 전달",
    duration: "1~3일",
    outcome: "계약서 · 자료 수집",
    desc: "계약 체결 후 로고, 이미지, 텍스트 등 필요한 자료를 전달받습니다. 자료 전달 완료 시점부터 실제 제작 일정이 시작됩니다.",
    deliverables: ["전자 계약서", "자료 체크리스트", "프로젝트 일정표"],
  },
  {
    n: "03",
    title: "UI/UX 디자인",
    duration: "3~7일",
    outcome: "디자인 시안 2~3종",
    desc: "브랜드 아이덴티티에 맞는 UI/UX를 설계합니다. 메인 + 주요 내부 페이지 시안을 제공하고 2~3회 수정이 포함됩니다.",
    deliverables: ["메인 페이지 시안", "내부 페이지 시안", "반응형 모바일 시안"],
  },
  {
    n: "04",
    title: "개발 · 퍼블리싱",
    duration: "5~14일",
    outcome: "스테이징 사이트",
    desc: "확정된 디자인을 기반으로 반응형 퍼블리싱과 기능 개발을 진행합니다. 크로스 브라우저 호환성을 보장합니다.",
    deliverables: ["반응형 HTML/CSS", "백엔드 연동", "관리자 페이지 (해당 시)"],
  },
  {
    n: "05",
    title: "테스트 · 런칭",
    duration: "1~3일",
    outcome: "실 서비스 배포",
    desc: "전체 페이지 QA, 성능 테스트, SEO 기본 설정 후 도메인 연결과 호스팅 배포를 진행합니다.",
    deliverables: ["QA 리포트", "SEO 기본 설정", "운영 가이드"],
  },
  {
    n: "06",
    title: "유지보수 · 운영",
    duration: "1~6개월",
    outcome: "지속적 지원",
    desc: "런칭 후 플랜별 무상 유지보수 기간 동안 텍스트/이미지 수정, 간단한 기능 개선을 지원합니다.",
    deliverables: ["유지보수 지원", "보안 업데이트", "성능 모니터링"],
  },
];

export default function ProcessPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "제작 과정" }]}
      title="홈페이지 제작 과정"
      caption="상담부터 런칭, 유지보수까지. HS WEB의 6단계 제작 프로세스를 확인하세요."
      sidebar={<DefaultSidebar />}
    >
      <Section title="6단계 프로세스">
        <div>
          <div className="hidden md:grid grid-cols-[60px_1fr_100px_160px_80px] px-4 py-2 text-[11px] font-semibold text-[var(--color-muted)] bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
            <span className="text-center">단계</span>
            <span>내용</span>
            <span className="text-center">기간</span>
            <span>결과물</span>
            <span className="text-center">상세</span>
          </div>
          {steps.map((s, i) => (
            <details key={s.n} className="border-b border-[var(--color-border)] last:border-b-0" open={i === 0}>
              <summary className="md:grid md:grid-cols-[60px_1fr_100px_160px_80px] flex items-center gap-3 px-4 py-3 cursor-pointer list-none hover:bg-[var(--color-bg-alt)]">
                <span className="hidden md:inline text-center text-[13px] font-bold text-[var(--color-point)] tnum">{s.n}</span>
                <div className="flex-1 min-w-0">
                  <span className="md:hidden text-[11px] font-bold text-[var(--color-point)] tnum mr-2">{s.n}</span>
                  <span className="text-[13px] font-semibold">{s.title}</span>
                  <p className="text-[11px] text-[var(--color-muted)] mt-0.5 truncate md:hidden">{s.desc}</p>
                </div>
                <span className="hidden md:inline text-center text-[12px] text-[var(--color-text-2)] tnum">{s.duration}</span>
                <span className="hidden md:inline text-[12px] text-[var(--color-text-2)] truncate">{s.outcome}</span>
                <span className="hidden md:inline text-center text-[12px] text-[var(--color-point)] font-semibold">펼치기 ↓</span>
              </summary>
              <div className="px-4 pb-4 md:pl-[80px]">
                <p className="text-[13px] text-[var(--color-text-2)] leading-relaxed mb-3">{s.desc}</p>
                <div className="border-t border-[var(--color-border)] pt-3">
                  <p className="text-[11px] font-semibold text-[var(--color-muted)] mb-1.5">주요 결과물</p>
                  <ul className="list-none grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-2)]">
                        <svg className="w-3 h-3 text-[var(--color-point)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section title="플랜별 소요 기간">
        <div className="overflow-x-auto">
          <table className="p-table min-w-[600px]">
            <thead>
              <tr>
                <th>구분</th>
                <th className="tnum">최소</th>
                <th className="tnum">평균</th>
                <th className="tnum">최대</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold">Basic (5P)</td>
                <td className="tnum">7일</td>
                <td className="tnum">10일</td>
                <td className="tnum">14일</td>
                <td className="text-[12px] text-[var(--color-muted)]">자료 전달 완료 후</td>
              </tr>
              <tr>
                <td className="font-semibold">Professional (10P)</td>
                <td className="tnum">14일</td>
                <td className="tnum">21일</td>
                <td className="tnum">28일</td>
                <td className="text-[12px] text-[var(--color-muted)]">관리자 페이지 포함</td>
              </tr>
              <tr>
                <td className="font-semibold">Enterprise</td>
                <td className="tnum">4주</td>
                <td className="tnum">8주</td>
                <td className="tnum">12주+</td>
                <td className="text-[12px] text-[var(--color-muted)]">범위에 따라 상이</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </PageShell>
  );
}
