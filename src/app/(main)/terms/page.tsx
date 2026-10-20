import type { Metadata } from "next";
import { PageShell, Section } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "이용약관",
  description: "HS WEB 웹사이트 및 홈페이지 제작 서비스 이용약관입니다.",
  alternates: { canonical: "https://hsweb.pics/terms" },
};

const sections = [
  { title: "제1조 (목적)", content: '본 약관은 HS WEB(이하 "회사")이 제공하는 웹사이트 제작 및 관련 서비스(이하 "서비스")의 이용에 관한 기본적인 사항을 규정함을 목적으로 합니다.' },
  { title: "제2조 (용어의 정의)", items: ['"서비스"란 회사가 제공하는 웹사이트 기획, 디자인, 개발, 유지보수 등 일체의 서비스를 의미합니다.', '"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 고객을 의미합니다.', '"계약"이란 서비스 이용을 위해 회사와 이용자 간에 체결하는 계약을 의미합니다.'] },
  { title: "제3조 (약관의 효력 및 변경)", items: ["본 약관은 서비스 이용 시점부터 효력이 발생합니다.", "회사는 관련 법령에 위배되지 않는 범위에서 약관을 변경할 수 있으며, 변경된 약관은 웹사이트에 공지함으로써 효력이 발생합니다.", "이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다."] },
  { title: "제4조 (서비스 이용 계약)", items: ["이용자는 회사가 제공하는 양식에 따라 서비스 이용을 신청할 수 있습니다.", "회사는 이용자의 요구사항을 검토한 후 견적서 및 계약서를 제공합니다.", "계약은 양 당사자의 서명(또는 전자서명)으로 성립합니다."] },
  { title: "제5조 (서비스 제공 범위)", items: ["회사는 계약서에 명시된 범위 내에서 서비스를 제공합니다.", "계약 범위 외 추가 작업이 필요한 경우, 별도 협의 및 추가 비용이 발생할 수 있습니다.", "제공되는 서비스의 구체적인 내용과 일정은 계약서에 따릅니다."] },
  { title: "제6조 (대금 지급)", items: ["서비스 대금은 계약서에 명시된 방식에 따라 지급합니다.", "계약금 50%, 잔금 50%의 분할 지급을 원칙으로 합니다.", "대금 미지급 시 서비스 제공이 중단될 수 있습니다."] },
  { title: "제7조 (지식재산권)", items: ["제작 완료 후 납품된 결과물의 소유권은 이용자에게 귀속됩니다.", "소스코드 및 디자인 원본 파일은 100% 이용자에게 제공됩니다.", "회사는 포트폴리오 목적으로 제작 결과물을 활용할 수 있으며, 이용자의 요청 시 제외할 수 있습니다."] },
  { title: "제8조 (유지보수)", items: ["무상 유지보수 기간 및 범위는 계약서에 명시된 내용을 따릅니다.", "무상 유지보수 기간 이후에는 별도 협의를 통해 유지보수 계약을 체결할 수 있습니다.", "유지보수 범위를 초과하는 기능 추가 또는 대규모 변경은 별도 비용이 발생할 수 있습니다."] },
  { title: "제9조 (면책사항)", items: ["회사는 천재지변, 전쟁, 기타 불가항력으로 인한 서비스 제공 불가에 대해 책임을 지지 않습니다.", "이용자의 귀책사유로 발생한 손해에 대해 회사는 책임을 지지 않습니다.", "제3자가 제공하는 서비스(호스팅, 도메인 등)와 관련된 문제는 해당 제3자의 약관을 따릅니다."] },
  { title: "제10조 (분쟁 해결)", items: ["본 약관과 관련된 분쟁은 상호 협의를 통해 해결함을 원칙으로 합니다.", "협의가 이루어지지 않을 경우, 관련 법령에 따른 관할 법원에서 해결합니다."] },
];

export default function TermsPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "이용약관" }]}
      overline="LEGAL"
      title="이용약관"
      subtitle="최종 수정일: 2026년 2월 1일"
      dense
    >
      <Section>
        <div className="p-card p-8 md:p-10 space-y-8 text-[14px] text-[var(--c-text-2)] leading-[1.8]">
          {sections.map((s, i) => (
            <div key={i} className={i > 0 ? "pt-6 border-t border-[var(--c-line)]" : ""}>
              <h3 className="text-[16px] font-bold text-[var(--c-text)] mb-3">{s.title}</h3>
              {s.content && <p>{s.content}</p>}
              {s.items && (
                <ol className="list-decimal list-outside pl-5 space-y-1 mt-2">
                  {s.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
