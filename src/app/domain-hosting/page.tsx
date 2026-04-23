import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, DefaultSidebar, Section } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "도메인 & 호스팅이란?",
  description: "도메인과 호스팅이 무엇인지, 웹사이트 유지에 왜 필요한지 쉽고 자세하게 설명합니다.",
  alternates: { canonical: "https://hsweb.pics/domain-hosting" },
};

export default function DomainHostingPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "도메인·호스팅" }]}
      title="도메인 & 호스팅이란?"
      caption="웹사이트를 만든 후에도 인터넷에서 작동하려면 도메인과 호스팅이 모두 필요합니다."
      sidebar={<DefaultSidebar />}
    >
      <Section title="핵심 개념 비교">
        <div className="overflow-x-auto">
          <table className="p-table min-w-[600px]">
            <thead>
              <tr>
                <th>구분</th>
                <th>도메인 (Domain)</th>
                <th>호스팅 (Hosting)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold">비유</td>
                <td>집의 <strong>주소</strong></td>
                <td>집의 <strong>건물</strong></td>
              </tr>
              <tr>
                <td className="font-semibold">역할</td>
                <td>사람이 기억할 수 있는 사이트 이름 (hsweb.pics)</td>
                <td>사이트 파일을 저장하고 방문자에게 전달</td>
              </tr>
              <tr>
                <td className="font-semibold">예시</td>
                <td className="tnum">hsweb.pics / naver.com</td>
                <td>가비아, 카페24, AWS 등</td>
              </tr>
              <tr>
                <td className="font-semibold">비용</td>
                <td className="tnum">연 3천~3만원</td>
                <td className="tnum">월 7천~5만원</td>
              </tr>
              <tr>
                <td className="font-semibold">갱신</td>
                <td>매년 1회</td>
                <td>매월 또는 매년</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="왜 둘 다 필요한가요?">
        <div>
          {[
            {
              title: "도메인만 있는 경우",
              status: "접속 불가",
              statusType: "warn",
              desc: "주소는 있지만 건물이 없습니다. 접속해도 페이지가 열리지 않습니다.",
            },
            {
              title: "호스팅만 있는 경우",
              status: "접근 불가",
              statusType: "warn",
              desc: "건물은 있지만 주소가 없습니다. 숫자 IP로만 접속 가능해 사용자가 찾을 수 없습니다.",
            },
            {
              title: "둘 다 있는 경우",
              status: "정상",
              statusType: "ok",
              desc: "도메인을 입력하면 호스팅 서버의 사이트가 정상 표시됩니다. 우리가 매일 쓰는 웹사이트의 동작 방식입니다.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 px-4 py-3 border-b border-[var(--color-border)] last:border-b-0"
            >
              <span
                className={`p-chip shrink-0 ${
                  item.statusType === "ok" ? "p-chip-point" : ""
                }`}
              >
                {item.status}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[var(--color-text)]">{item.title}</p>
                <p className="text-[12px] text-[var(--color-text-2)] leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="접속 흐름 (주소창 입력 → 사이트 표시)">
        <ol className="list-none">
          {[
            { n: "01", t: "주소 입력", d: "사용자가 브라우저에 hsweb.pics를 입력합니다." },
            { n: "02", t: "DNS 변환", d: "DNS 서버가 도메인을 실제 IP 주소(예: 123.45.67.89)로 변환합니다." },
            { n: "03", t: "서버 응답", d: "호스팅 서버가 사이트 파일(HTML/CSS/이미지)을 보냅니다." },
            { n: "04", t: "사이트 표시", d: "브라우저가 받은 파일을 렌더링해 화면에 표시합니다." },
          ].map((step) => (
            <li key={step.n} className="p-row">
              <span className="w-8 text-[12px] font-bold text-[var(--color-point)] tnum">{step.n}</span>
              <span className="font-semibold w-24 shrink-0">{step.t}</span>
              <span className="flex-1 text-[12px] text-[var(--color-text-2)]">{step.d}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="자주 묻는 질문">
        <div>
          {[
            { q: "도메인과 호스팅 없이 사이트를 운영할 수 있나요?", a: "인터넷에서 접속 가능한 사이트를 운영하려면 도메인과 호스팅은 필수입니다. 제작 비용과 별개로, 사이트가 살아있으려면 매년/매월 유지해야 합니다." },
            { q: "도메인을 갱신하지 않으면 어떻게 되나요?", a: "만료되면 해당 주소로 접속할 수 없게 됩니다. 일정 기간이 지나면 다른 사람이 등록할 수 있으므로 중요한 도메인은 반드시 갱신하세요." },
            { q: "호스팅을 해지하면 사이트가 삭제되나요?", a: "네, 호스팅 서버에 저장된 파일이 삭제되므로 사이트에 접속할 수 없게 됩니다. HS WEB 제작 사이트는 소스 코드를 별도 보관해 재배포가 가능합니다." },
            { q: "도메인과 호스팅을 직접 관리해야 하나요?", a: "아닙니다. HS WEB에서 등록, 설정, 갱신까지 대행해드립니다." },
            { q: "이미 가지고 있는 도메인을 사용할 수 있나요?", a: "물론입니다. 기존 도메인을 그대로 연결해드립니다. DNS 설정만 변경하면 되므로 추가 비용은 없습니다." },
          ].map((faq, i) => (
            <details key={i} className="border-b border-[var(--color-border)] last:border-b-0">
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer list-none hover:bg-[var(--color-bg-alt)]">
                <span className="text-[12px] font-bold text-[var(--color-point)] tnum">Q{i + 1}</span>
                <span className="text-[13px] font-semibold flex-1">{faq.q}</span>
                <svg className="w-3.5 h-3.5 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="px-4 pb-3 pl-[52px] text-[12px] text-[var(--color-text-2)] leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </Section>

      <Section title="HS WEB 대행 안내">
        <div className="p-4 text-[13px] text-[var(--color-text-2)] leading-relaxed">
          <p>HS WEB에서는 도메인 등록과 호스팅 설정을 <strong className="text-[var(--color-point)]">실비로 대행</strong>해드립니다.</p>
          <p className="mt-1">별도 대행 수수료 없이 투명하게 안내드리며, 갱신 시기에도 자동으로 알림을 보내드립니다.</p>
          <div className="mt-3 flex items-center gap-2">
            <Link href="/contact" className="p-btn p-btn-point no-underline">상담 신청</Link>
            <a href="tel:010-3319-2509" className="p-btn tnum no-underline">010-3319-2509</a>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
