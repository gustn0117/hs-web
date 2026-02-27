import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 | HS WEB",
  description: "HS WEB의 개인정보 수집, 이용, 보호에 관한 방침입니다.",
};

const sections = [
  {
    title: "제1조 (개인정보의 수집 항목 및 방법)",
    content:
      "회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.",
    subsections: [
      {
        subtitle: "수집 항목",
        items: [
          "필수 항목: 이름, 이메일 주소, 전화번호",
          "선택 항목: 회사명, 프로젝트 관련 요구사항",
        ],
      },
      {
        subtitle: "수집 방법",
        items: [
          "웹사이트 문의 폼을 통한 직접 입력",
          "이메일, 전화 등 상담 과정에서의 수집",
        ],
      },
    ],
  },
  {
    title: "제2조 (개인정보의 수집 및 이용 목적)",
    content: "수집된 개인정보는 다음의 목적으로 이용됩니다.",
    items: [
      "서비스 상담 및 계약 체결",
      "프로젝트 진행 과정에서의 커뮤니케이션",
      "서비스 완료 후 유지보수 안내",
      "서비스 개선 및 신규 서비스 안내",
    ],
  },
  {
    title: "제3조 (개인정보의 보유 및 이용 기간)",
    content:
      "회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 경우에는 명시된 기간 동안 보유합니다.",
    items: [
      "계약 또는 청약 철회 등에 관한 기록: 5년 (전자상거래법)",
      "대금 결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)",
      "소비자의 불만 또는 분쟁 처리에 관한 기록: 3년 (전자상거래법)",
    ],
  },
  {
    title: "제4조 (개인정보의 제3자 제공)",
    content:
      "회사는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.",
    items: [
      "이용자가 사전에 동의한 경우",
      "법령의 규정에 의하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우",
    ],
  },
  {
    title: "제5조 (개인정보의 파기 절차 및 방법)",
    subsections: [
      {
        subtitle: "파기 절차",
        items: [
          "이용자가 서비스 이용 등을 위해 입력한 정보는 목적 달성 후 별도의 DB로 옮겨져 일정 기간 저장된 후 파기됩니다.",
        ],
      },
      {
        subtitle: "파기 방법",
        items: [
          "전자적 파일 형태: 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제",
          "종이 문서: 분쇄기로 분쇄하거나 소각",
        ],
      },
    ],
  },
  {
    title: "제6조 (개인정보의 안전성 확보 조치)",
    content:
      "회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.",
    items: [
      "개인정보 접근 권한의 제한 및 관리",
      "개인정보의 암호화 처리",
      "보안 프로그램의 설치 및 갱신",
      "개인정보 취급 직원의 최소화 및 교육",
    ],
  },
  {
    title: "제7조 (이용자의 권리와 행사 방법)",
    content:
      "이용자는 언제든지 자신의 개인정보에 대해 다음의 권리를 행사할 수 있습니다.",
    items: [
      "개인정보 열람 요구",
      "오류 등이 있을 경우 정정 요구",
      "삭제 요구",
      "처리 정지 요구",
    ],
  },
  {
    title: "제8조 (쿠키의 운용 및 거부)",
    content:
      "회사는 이용자에게 맞춤 서비스를 제공하기 위해 쿠키를 사용할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키를 허용하거나 거부할 수 있습니다.",
  },
  {
    title: "제9조 (개인정보 보호책임자)",
    content:
      "회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만 처리 및 피해 구제를 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.",
    items: [
      "개인정보 보호책임자: HS WEB 대표",
      "연락처: 문의하기 페이지를 통해 연락",
    ],
  },
  {
    title: "제10조 (방침의 변경)",
    content:
      "본 개인정보처리방침은 법령, 정책 또는 보안 기술의 변경에 따라 내용이 추가, 삭제 및 수정될 수 있으며, 변경 시 웹사이트를 통해 공지합니다.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-[72px] min-h-screen bg-[var(--color-light)]">
      {/* Hero */}
      <div className="bg-[var(--color-dark)] py-16 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern pointer-events-none opacity-[0.04]" />
        <div className="max-w-[800px] mx-auto px-6 relative z-10 text-center">
          <p className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-[3px] mb-3">
            PRIVACY POLICY
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            개인정보처리방침
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
                {section.subsections?.map((sub, si) => (
                  <div key={si} className="ml-[34px] mt-3">
                    <h3 className="text-[var(--color-dark-2)] font-semibold text-sm mb-2">
                      {sub.subtitle}
                    </h3>
                    <ol className="space-y-1.5">
                      {sub.items.map((item, j) => (
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
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/terms"
            className="text-[var(--color-accent)] text-sm font-medium no-underline hover:underline"
          >
            ← 이용약관 보기
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
