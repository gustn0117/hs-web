import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관",
  description: "HS WEB 웹사이트 및 홈페이지 제작 서비스 이용약관입니다.",
  alternates: { canonical: "https://hsweb.pics/terms" },
};

const sections = [
  {
    title: "제1조 (목적)",
    content:
      '본 약관은 HS WEB(이하 "회사")이 제공하는 웹사이트 제작 및 관련 서비스(이하 "서비스")의 이용에 관한 기본적인 사항을 규정함을 목적으로 합니다.',
  },
  {
    title: "제2조 (용어의 정의)",
    items: [
      '"서비스"란 회사가 제공하는 웹사이트 기획, 디자인, 개발, 유지보수 등 일체의 서비스를 의미합니다.',
      '"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 고객을 의미합니다.',
      '"계약"이란 서비스 이용을 위해 회사와 이용자 간에 체결하는 계약을 의미합니다.',
    ],
  },
  {
    title: "제3조 (약관의 효력 및 변경)",
    items: [
      "본 약관은 서비스 이용 시점부터 효력이 발생합니다.",
      "회사는 관련 법령에 위배되지 않는 범위에서 약관을 변경할 수 있으며, 변경된 약관은 웹사이트에 공지함으로써 효력이 발생합니다.",
      "이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.",
    ],
  },
  {
    title: "제4조 (서비스의 내용)",
    content: "회사는 다음과 같은 서비스를 제공합니다.",
    items: [
      "웹사이트 기획 및 컨설팅",
      "UI/UX 디자인",
      "프론트엔드 및 백엔드 개발",
      "웹사이트 유지보수 및 관리",
      "도메인 및 호스팅 관련 안내",
    ],
  },
  {
    title: "제5조 (계약의 성립)",
    items: [
      "서비스 이용 계약은 이용자의 상담 신청과 회사의 승낙으로 성립됩니다.",
      "구체적인 서비스 범위, 비용, 일정 등은 별도의 계약서를 통해 정합니다.",
      "회사는 정당한 사유가 있는 경우 계약 체결을 거절할 수 있습니다.",
    ],
  },
  {
    title: "제6조 (비용 및 결제)",
    items: [
      "서비스 비용은 프로젝트의 범위와 요구사항에 따라 별도 협의됩니다.",
      "결제 방식과 일정은 계약서에 명시된 내용을 따릅니다.",
      "계약 후 이용자의 사유로 취소 시, 진행 단계에 따라 환불 규정이 적용됩니다.",
    ],
  },
  {
    title: "제7조 (지식재산권)",
    items: [
      "제작 완료 후 납품된 결과물의 소유권은 이용자에게 귀속됩니다.",
      "소스코드 및 디자인 원본 파일은 100% 이용자에게 제공됩니다.",
      "회사는 포트폴리오 목적으로 제작 결과물을 활용할 수 있으며, 이용자의 요청 시 제외할 수 있습니다.",
    ],
  },
  {
    title: "제8조 (유지보수)",
    items: [
      "무상 유지보수 기간 및 범위는 계약서에 명시된 내용을 따릅니다.",
      "무상 유지보수 기간 이후에는 별도 협의를 통해 유지보수 계약을 체결할 수 있습니다.",
      "유지보수 범위를 초과하는 기능 추가 또는 대규모 변경은 별도 비용이 발생할 수 있습니다.",
    ],
  },
  {
    title: "제9조 (면책사항)",
    items: [
      "회사는 천재지변, 전쟁, 기타 불가항력으로 인한 서비스 제공 불가에 대해 책임을 지지 않습니다.",
      "이용자의 귀책사유로 발생한 손해에 대해 회사는 책임을 지지 않습니다.",
      "제3자가 제공하는 서비스(호스팅, 도메인 등)와 관련된 문제는 해당 제3자의 약관을 따릅니다.",
    ],
  },
  {
    title: "제10조 (분쟁 해결)",
    items: [
      "본 약관과 관련된 분쟁은 상호 협의를 통해 해결함을 원칙으로 합니다.",
      "협의가 이루어지지 않을 경우, 관련 법령에 따른 관할 법원에서 해결합니다.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="pt-[72px] min-h-screen bg-[var(--color-light)]">
      {/* Hero */}
      <div className="bg-[var(--color-dark)] py-16 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern pointer-events-none opacity-[0.04]" />
        <div className="max-w-[800px] mx-auto px-6 relative z-10 text-center">
          <p className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-[3px] mb-3">
            TERMS OF SERVICE
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            이용약관
          </h1>
          <p className="text-gray-400 text-sm">
            최종 수정일: 2026년 2월 1일
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 md:p-10">
            {sections.map((section, i) => (
              <div
                key={i}
                className={`${i > 0 ? "mt-8 pt-8 border-t border-gray-100" : ""}`}
              >
                <h2 className="text-[var(--color-dark)] font-bold text-base mb-3 flex items-start gap-2.5">
                  <span className="w-6 h-6 bg-[var(--color-dark)] text-white rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {section.title}
                </h2>
                {section.content && (
                  <p className="text-[var(--color-gray)] text-[0.9rem] leading-relaxed ml-[34px] mb-3">
                    {section.content}
                  </p>
                )}
                {section.items && (
                  <ol className="ml-[34px] space-y-2">
                    {section.items.map((item, j) => (
                      <li
                        key={j}
                        className="text-[var(--color-dark-2)] text-[0.9rem] leading-relaxed flex items-start gap-2.5"
                      >
                        <span className="text-[var(--color-accent)] text-xs font-bold mt-1 shrink-0">
                          {j + 1}.
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/privacy"
            className="text-[var(--color-accent)] text-sm font-medium no-underline hover:underline"
          >
            개인정보처리방침 보기 →
          </Link>
          <Link
            href="/"
            className="text-[var(--color-gray)] text-sm no-underline hover:text-[var(--color-dark)] transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
