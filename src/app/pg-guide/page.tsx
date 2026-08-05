import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "PG(전자결제) 연동 안내",
  description:
    "HS WEB의 PG(전자결제) 연동 작업 범위 안내. KG이니시스·토스페이먼츠·나이스페이먼츠·카카오페이·포트원 등 국내 주요 PG 연동은 기술적으로 모두 지원합니다. 사업자 등록·통신판매업 신고·PG 심사 등 법적 요건은 고객이 직접 진행하셔야 합니다.",
  keywords: [
    "PG 연동",
    "전자결제",
    "KG이니시스",
    "토스페이먼츠",
    "나이스페이먼츠",
    "카카오페이",
    "포트원",
    "결제 연동",
    "통신판매업 신고",
    "정보통신사업자",
  ],
  alternates: { canonical: "https://hsweb.pics/pg-guide" },
};

const PROVIDERS = [
  { name: "KG이니시스", tag: "국내 최대", desc: "이커머스·서비스 전반에서 가장 널리 쓰이는 종합 PG.", note: "카드·계좌·간편결제 통합" },
  { name: "토스페이먼츠", tag: "심플·개발자 친화", desc: "문서/샌드박스가 잘 정리돼 있어 연동 속도가 빠릅니다.", note: "정산 UI가 깔끔" },
  { name: "나이스페이먼츠", tag: "안정형", desc: "오래된 사업자·전통 유통망과 잘 맞는 종합 PG.", note: "다양한 결제 수단" },
  { name: "카카오페이", tag: "간편결제", desc: "카카오 사용자 대상 원탭 결제에 강합니다.", note: "정기결제 지원" },
  { name: "네이버페이", tag: "간편결제", desc: "네이버 검색·쇼핑 유입 고객에게 결제 마찰이 낮습니다.", note: "장바구니 연동 가능" },
  { name: "포트원 (아임포트)", tag: "통합 게이트웨이", desc: "여러 PG를 하나의 API로 묶어주는 통합 서비스.", note: "PG 이중화·전환에 유리" },
];

const CLIENT_TODOS = [
  {
    n: "01",
    t: "사업자 등록증",
    d: "개인 · 개인사업자 · 법인 어느 형태여도 가능합니다. 사업자 등록 없이 실제 결제를 받는 서비스는 오픈할 수 없습니다.",
    tip: "쇼핑몰이라면 업태에 \"전자상거래\" 또는 \"통신판매\" 포함이 일반적입니다.",
  },
  {
    n: "02",
    t: "통신판매업 신고",
    d: "온라인으로 상품·서비스를 판매한다면 관할 구청·시청에 통신판매업 신고를 하셔야 합니다. 신고 후 신고번호를 홈페이지 하단에 표기해야 합니다.",
    tip: "직전 년 매출 4,800만원 미만·간이과세자는 면제 대상이 될 수 있습니다.",
  },
  {
    n: "03",
    t: "부가통신사업자 신고 (해당 시)",
    d: "정보통신망을 이용한 유료 서비스 제공 규모가 일정 요건을 넘으면 과학기술정보통신부에 신고해야 합니다. 대부분의 소규모 사이트는 해당되지 않습니다.",
    tip: "일반 쇼핑몰·홈페이지는 대체로 대상이 아닙니다. 필요 시 안내해드립니다.",
  },
  {
    n: "04",
    t: "PG사 계약 · 심사 통과",
    d: "각 PG사가 요구하는 서류(사업자등록증·통장사본·대표자 신분증·홈페이지 등)를 제출하고 심사를 통과하셔야 결제 키(MID/키값)가 발급됩니다.",
    tip: "심사는 PG사 담당자가 직접 진행합니다. HS WEB이 대행하거나 통과를 보장할 수 없습니다.",
  },
  {
    n: "05",
    t: "홈페이지 필수 표시",
    d: "PG 심사와 법적 요건을 위해 반드시 표기되어야 하는 항목들입니다. HS WEB에서 페이지 자체는 만들어 드리지만, 문구·정책 내용은 사업자님이 결정·검토해 주셔야 합니다.",
    tip: "사업자정보 · 이용약관 · 개인정보처리방침 · 환불/취소 정책 · 통신판매업 신고번호 · 대표자 · 소재지 · 연락처",
  },
];

const PROCESS = [
  { n: "01", t: "결제 정책 결정", d: "받을 결제 수단(카드/계좌이체/간편결제/정기결제), 예상 결제 금액대, 정산 주기 등을 함께 정합니다." },
  { n: "02", t: "PG사 선택 · 계약", d: "사업 특성에 맞는 PG를 추천드립니다. 실제 계약·서류 제출·심사는 사업자님이 직접 진행합니다." },
  { n: "03", t: "테스트 연동", d: "PG사가 제공하는 샌드박스(테스트) 환경으로 결제 창·성공/실패 처리·환불까지 코드 연동을 완료합니다." },
  { n: "04", t: "실 결제 전환", d: "심사 통과 후 발급된 실 결제 키를 적용해 배포합니다. 첫 실 결제 100원 테스트로 최종 확인합니다." },
];

const FAQS = [
  {
    q: "심사도 대신 진행해 주시나요?",
    a: "죄송하지만 PG 심사는 대행이 불가능합니다. 각 PG사는 실제 사업자 본인(대표자)이 서류를 제출하고 통화·전자서명을 진행하도록 정하고 있습니다. 이건 어느 개발사·에이전시를 가더라도 마찬가지입니다. 필요하시면 서류 준비 방법과 예상 심사 흐름은 상세히 안내해 드립니다.",
  },
  {
    q: "사업자가 아직 없어도 개발부터 가능한가요?",
    a: "네, 개발과 테스트 환경 연동까지는 사업자 없이도 진행 가능합니다. 다만 실제 결제(라이브)를 오픈하려면 사업자 등록 · 통신판매업 신고 · PG 심사 통과가 반드시 선행되어야 합니다. 사이트 오픈 일정을 잡으실 때 심사 기간(보통 3~10 영업일)을 고려해 주세요.",
  },
  {
    q: "어느 PG사가 좋은가요?",
    a: "정답은 없습니다. 예상 결제 건수·금액대, 정산 속도, 카드사 수수료, 부가서비스(정기결제·에스크로·해외카드) 필요 여부에 따라 달라집니다. 상담 시 사업 규모를 여쭤보고 2~3곳을 추려 비교해 드립니다. 정하기 어렵다면 포트원 같은 통합 게이트웨이로 시작해 이후 PG를 교체·병행하는 방식도 좋습니다.",
  },
  {
    q: "여러 PG를 동시에 붙일 수 있나요?",
    a: "가능합니다. 실제로 규모가 커진 서비스는 결제 실패율 · 수수료 협상력을 이유로 2개 이상의 PG를 병행 운영하는 경우가 많습니다. 포트원 같은 통합 게이트웨이를 사용하면 코드 변경 없이 PG를 스위칭 · 이중화할 수 있어 확장에 유리합니다.",
  },
  {
    q: "정기결제(구독)도 지원하나요?",
    a: "네, 지원합니다. 다만 정기결제는 PG사마다 별도 계약 · 별도 심사가 필요한 경우가 대부분입니다. 일반 결제 심사와 별개로 진행되므로 오픈 일정 산정 시 반영해 주세요. HS WEB에서는 빌링키 발급 · 결제 재시도 · 결제 실패 알림까지 코드로 구현해 드립니다.",
  },
  {
    q: "수수료는 얼마나 되나요?",
    a: "PG · 카드사 · 사업 유형에 따라 다르지만 카드결제 기준 대략 2.5% ~ 3.5% 사이가 일반적입니다. 매출이 커지면 협상으로 낮출 수 있습니다. HS WEB은 개발사이므로 수수료 자체를 조정해 드릴 수는 없고, 매출 규모와 카테고리 기준으로 어떤 PG가 유리한지 안내드립니다.",
  },
  {
    q: "결제 실패나 환불 처리는 어떻게 되나요?",
    a: "결제 성공·실패·환불·부분취소까지 코드로 처리되며, 어드민에서도 확인·환불 처리를 할 수 있게 개발해 드립니다. 다만 실제 환불의 최종 승인·정산은 PG사에서 처리하므로 처리 시점은 PG사 정책을 따릅니다.",
  },
  {
    q: "PG 없이 계좌이체·현금결제로만 운영해도 되나요?",
    a: "됩니다. 소규모 서비스나 B2B 위주라면 무통장입금·수기 결제만으로 시작하시는 분들도 많습니다. 이 경우 PG 심사·계약 없이 곧바로 오픈할 수 있고, 추후 매출이 늘면 PG를 붙이는 방식도 가능합니다.",
  },
];

export default function PgGuidePage() {
  return (
    <PageShell
      breadcrumb={[{ label: "PG(전자결제) 연동 안내" }]}
      overline="PAYMENT · PG INTEGRATION"
      title="PG 결제 연동, 어디까지 해드릴까요?"
      subtitle="국내 주요 PG(KG이니시스 · 토스페이먼츠 · 나이스 · 카카오페이 · 포트원 등) 연동은 기술적으로 모두 지원합니다. 다만 사업자 등록 · 통신판매업 신고 · PG 심사 등 법적 요건은 사업자님이 직접 진행하셔야 합니다."
      stats={[
        { label: "PG 기술 연동", value: "100", suffix: "% 지원" },
        { label: "지원 PG", value: "6", suffix: "곳+" },
        { label: "테스트 연동", value: "샌드박스", suffix: " 기본" },
        { label: "심사 · 서류", value: "직접", suffix: " 진행" },
      ]}
    >
      {/* SPLIT — 우리가 하는 일 vs 고객이 하실 일 (핵심) */}
      <Section
        overline="SCOPE"
        title="우리가 하는 일 vs 사업자님이 직접 하실 일"
        subtitle="이 구분은 어느 개발사를 가더라도 동일합니다. PG 심사는 사업 실체 확인 절차라서 대행이 불가능합니다."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* HS WEB — dark card */}
          <div className="p-6 md:p-8 rounded-[16px] border-2 border-[var(--c-text)] bg-[var(--c-text)] text-white">
            <div className="flex items-baseline justify-between mb-5 gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/60 mb-2">HS WEB</p>
                <h3 className="text-[20px] font-bold tracking-tight">기술 연동은 전부 처리</h3>
              </div>
              <span className="inline-flex items-center h-[24px] px-3 rounded-full bg-white/10 text-white/80 text-[11px] font-bold tracking-wider border border-white/15">
                포함
              </span>
            </div>
            <p className="text-[13.5px] text-white/75 leading-[1.75] mb-5">
              PG사 문서 확인부터 결제 창 · 성공/실패 · 취소/환불 · 웹훅까지 코드 레벨에서 완결합니다.
              샌드박스 환경으로 실제 결제 없이 흐름을 먼저 검증해 드립니다.
            </p>
            <ul className="list-none space-y-2.5">
              {[
                "PG SDK · REST API 연동 (프론트 + 서버)",
                "카드 · 계좌이체 · 간편결제 · 가상계좌 처리",
                "결제 성공/실패/취소/부분환불 로직",
                "웹훅(Webhook) 수신 · 결제 상태 동기화",
                "어드민 결제 내역 · 환불 처리 UI",
                "샌드박스(테스트) 환경 검증",
                "정기결제(빌링키) · 결제 재시도 · 실패 알림",
                "실 결제 전환 후 100원 라이브 테스트",
              ].map((it) => (
                <li key={it} className="flex items-start gap-2.5 text-[13.5px] text-white/90 leading-[1.6]">
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>
          </div>

          {/* Client — light card */}
          <div className="p-6 md:p-8 rounded-[16px] border border-[var(--c-line)] bg-white">
            <div className="flex items-baseline justify-between mb-5 gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-sub)] mb-2">CLIENT · 사업자</p>
                <h3 className="text-[20px] font-bold tracking-tight text-[var(--c-text)]">서류·심사는 직접 진행</h3>
              </div>
              <span className="inline-flex items-center h-[24px] px-3 rounded-full bg-[var(--c-bg-2)] text-[var(--c-text-2)] text-[11px] font-bold tracking-wider border border-[var(--c-line)]">
                필수
              </span>
            </div>
            <p className="text-[13.5px] text-[var(--c-text-2)] leading-[1.75] mb-5">
              PG사는 <strong>실제 사업 실체 확인(KYC)</strong>을 이유로 대표자 본인이 직접 서류를 제출·통화하도록 정하고 있습니다.
              어느 개발사에 맡기시더라도 이 부분은 사업자님이 직접 하셔야 합니다.
            </p>
            <ul className="list-none space-y-2.5">
              {[
                "사업자 등록증 (개인·법인 무관)",
                "통신판매업 신고 (관할 구청)",
                "부가통신사업자 신고 (해당 사업만)",
                "PG사와의 계약 체결",
                "심사 서류 제출 (사업자·통장·신분증·홈페이지)",
                "심사 담당자 확인 통화 · 전자서명",
                "정산 계좌 등록 · 세금계산서 요건",
                "환불·이용약관·개인정보처리방침 문구 검토",
              ].map((it) => (
                <li key={it} className="flex items-start gap-2.5 text-[13.5px] text-[var(--c-text-2)] leading-[1.6]">
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-[var(--c-sub)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reinforcement — the key message */}
        <div className="mt-6 p-5 md:p-6 rounded-[12px] bg-[var(--c-bg-1)] border border-[var(--c-line)]">
          <div className="flex items-start gap-3.5">
            <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[var(--c-line)]">
              <svg className="w-4 h-4 text-[var(--c-text-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </span>
            <p className="flex-1 text-[13.5px] text-[var(--c-text-2)] leading-[1.75]">
              <strong className="text-[var(--c-text)]">이 구분은 저희만의 정책이 아닙니다.</strong>{" "}
              「전자금융거래법」 · 「전자상거래법」 · 각 카드사 규정이 <strong>실제 사업자 본인 확인</strong>을 요구하기 때문입니다.
              대행을 광고하는 업체가 있다면 오히려 계약 위반이나 명의 문제를 유발할 수 있어 유의하셔야 합니다.
            </p>
          </div>
        </div>
      </Section>

      {/* SUPPORTED — PG providers */}
      <Section
        overline="SUPPORTED"
        title="지원하는 PG (국내 기준)"
        subtitle="대부분의 국내 PG는 연동 방식이 표준화되어 있어, 아래 목록 외에도 REST API·SDK가 공개된 PG라면 모두 연동 가능합니다."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROVIDERS.map((p) => (
            <div key={p.name} className="p-6 rounded-[14px] border border-[var(--c-line)] bg-white">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-[16px] font-bold tracking-tight text-[var(--c-text)]">{p.name}</h4>
                <span className="inline-flex items-center h-[20px] px-2 rounded-full bg-[var(--c-bg-2)] text-[var(--c-text-2)] text-[10.5px] font-bold tracking-wider">
                  {p.tag}
                </span>
              </div>
              <p className="text-[13px] text-[var(--c-sub)] leading-[1.7] mb-3">{p.desc}</p>
              <p className="text-[12px] text-[var(--c-text-2)] pt-3 border-t border-[var(--c-line)] leading-[1.6]">
                <span className="font-semibold">특징 · </span>
                {p.note}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[13px] text-[var(--c-sub)] leading-[1.7]">
          해외 결제(Stripe · PayPal 등) 연동도 가능합니다. 다만 해외 PG는 국내 사업자 요건과는 별개로{" "}
          <strong className="text-[var(--c-text-2)]">각 국가의 KYC/AML 절차</strong>가 있어 심사 방식이 다릅니다.
        </p>
      </Section>

      {/* CHECKLIST — what the client must prepare */}
      <Section
        overline="CHECKLIST · 사업자 준비 사항"
        title="사업자님이 준비하셔야 하는 것"
        subtitle="아래는 대부분의 PG사가 공통적으로 요구하는 항목입니다. PG사별로 세부 서류가 조금씩 다를 수 있어, 계약 시 담당자 안내를 함께 확인하세요."
      >
        <div className="space-y-3">
          {CLIENT_TODOS.map((t) => (
            <div key={t.n} className="p-6 md:p-7 rounded-[14px] border border-[var(--c-line)] bg-white">
              <div className="grid grid-cols-[48px_1fr] gap-4 md:gap-6 items-start">
                <p className="text-[22px] md:text-[26px] font-black tracking-tight text-[var(--c-line-3)] tnum leading-none pt-1">
                  {t.n}
                </p>
                <div>
                  <h4 className="text-[16px] md:text-[17px] font-bold text-[var(--c-text)] mb-2 tracking-tight">
                    {t.t}
                  </h4>
                  <p className="text-[13.5px] text-[var(--c-text-2)] leading-[1.75] mb-3">{t.d}</p>
                  <div className="flex items-start gap-2 text-[12.5px] text-[var(--c-sub)] leading-[1.65] pt-3 border-t border-[var(--c-line)]">
                    <span className="shrink-0 font-bold text-[var(--c-main)]">TIP</span>
                    <span>{t.tip}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* PROCESS */}
      <Section
        overline="HOW IT WORKS"
        title="연동은 어떤 순서로 진행되나요?"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PROCESS.map((s) => (
            <div key={s.n} className="p-6 rounded-[14px] border border-[var(--c-line)] bg-white">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-main)] tnum mb-3">STEP {s.n}</p>
              <h4 className="text-[15px] font-bold text-[var(--c-text)] mb-2">{s.t}</h4>
              <p className="text-[13px] text-[var(--c-sub)] leading-[1.7]">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-5 md:p-6 rounded-[14px] border border-[var(--c-line)] bg-[var(--c-bg-1)] flex items-start gap-3.5">
          <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[var(--c-line)]">
            <svg className="w-4 h-4 text-[var(--c-text-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <p className="flex-1 text-[13.5px] text-[var(--c-text-2)] leading-[1.75]">
            <strong className="text-[var(--c-text)]">PG 심사 기간은 보통 3~10 영업일</strong>이 걸립니다. 오픈 일정이 촉박하다면 개발 착수 시점에 PG 계약도 함께 시작하시는 것을 권장합니다.
            개발과 심사는 동시에 진행할 수 있어 병목이 되지 않습니다.
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <Section overline="FAQ" title="자주 묻는 질문">
        <div className="border-t border-[var(--c-line)]">
          {FAQS.map((item, i) => (
            <details key={i} className="border-b border-[var(--c-line)] group">
              <summary className="flex items-start justify-between py-5 cursor-pointer list-none gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-[13px] font-bold text-[var(--c-main)] tnum mt-0.5">Q{i + 1}</span>
                  <span className="text-[15px] font-semibold text-[var(--c-text)] leading-[1.5]">{item.q}</span>
                </div>
                <svg className="w-5 h-5 text-[var(--c-sub)] shrink-0 group-open:rotate-180 transition-transform mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="pb-5 pl-7 sm:pl-[40px] text-[14px] text-[var(--c-sub)] leading-[1.75]">{item.a}</div>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="p-8 md:p-10 rounded-[18px] bg-[var(--c-text)] text-white text-center">
          <p className="text-[11px] font-bold text-white/60 tracking-[0.15em] uppercase mb-3">CONTACT</p>
          <h3 className="text-[24px] md:text-[30px] font-bold tracking-tight mb-3">결제 연동이 필요한 프로젝트가 있으신가요?</h3>
          <p className="text-[14px] text-white/70 leading-[1.7] mb-7 max-w-[560px] mx-auto">
            사업 특성에 맞는 PG를 추천드리고, 심사에 필요한 서류·홈페이지 요건까지 함께 안내해 드립니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-[10px] bg-white text-[var(--c-text)] font-bold text-[14px] no-underline hover:bg-[var(--c-bg-2)] transition-colors"
            >
              상담 신청
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-[10px] bg-white/10 text-white font-bold text-[14px] no-underline hover:bg-white/15 transition-colors border border-white/15"
            >
              가격 안내 보기
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
