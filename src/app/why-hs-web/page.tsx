import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "왜 HS WEB인가 — 더 저렴한 이유 · 자체 코딩 · 워크플로우",
  description:
    "왜 HS WEB이 다른 업체보다 저렴한지, 자체 코딩으로 만든 사이트의 장점은 무엇인지, 그리고 어떤 흐름으로 함께 만드는지 한 페이지에 정리했습니다.",
  alternates: { canonical: "https://hsweb.pics/why-hs-web" },
};

const PRICE_REASONS = [
  {
    n: "01",
    title: "1인 전담 구조",
    desc: "대표가 기획·디자인·개발을 모두 직접 진행합니다. 중간 단계의 마진과 커뮤니케이션 비용이 없습니다.",
    impact: "전통적 분업 구조의 30~50% 비용 절감",
  },
  {
    n: "02",
    title: "자체 인프라 운영",
    desc: "외부 서버 임대 없이 직접 운영하는 서버에 배포합니다. 호스팅 마진을 받지 않아 월 7,000원부터 가능합니다.",
    impact: "월 호스팅 비용 30,000원 → 7,000원",
  },
  {
    n: "03",
    title: "사무실·영업 비용 0원",
    desc: "사무실 임대료, 영업 인력, 광고 대행료 같은 고정비를 운영하지 않습니다. 그 비용을 가격에 반영하지 않습니다.",
    impact: "동일 결과물 대비 약 50% 가격대",
  },
  {
    n: "04",
    title: "솔직한 가격",
    desc: "워드프레스 업체의 '월 운영비 30만원' 같은 보수적 청구가 없습니다. 결과물 인도 시 정산이 끝나며, 콘텐츠 수정은 평생 무료입니다.",
    impact: "초기 비용만 발생, 운영비 별도 없음",
  },
];

const CODING_BENEFITS = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "압도적 성능",
    desc: "Next.js + React 기반으로 페이지 로딩 0.5~1초. 워드프레스 사이트(평균 3~5초) 대비 5배 빠릅니다.",
    metric: "Lighthouse 90+",
  },
  {
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    title: "SEO 친화 구조",
    desc: "메타 태그, sitemap.xml, robots.txt, 구조화 데이터(Schema.org) 등 검색엔진 최적화가 코드 단에서 완벽 적용됩니다.",
    metric: "Google 친화 100%",
  },
  {
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    title: "보안 안정성",
    desc: "워드프레스 플러그인의 알려진 보안 취약점이 존재하지 않습니다. 필요한 코드만 동작해 공격 표면이 작습니다.",
    metric: "취약 플러그인 0개",
  },
  {
    icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6",
    title: "자유로운 확장",
    desc: "관리자 페이지, API 연동, 결제 시스템, 회원 관리 등 어떤 기능도 자유롭게 추가할 수 있습니다. 플러그인 호환성 걱정 없음.",
    metric: "기능 한계 없음",
  },
  {
    icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25zm0 2.25v6m0 0h.008v.008H12v-.008z",
    title: "100% 소유권",
    desc: "소스코드를 통째로 인도받습니다. 다른 업체로 옮기거나 직접 운영하셔도 됩니다. 종속되지 않는 자산입니다.",
    metric: "소스코드 전체 인도",
  },
  {
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
    title: "검색 상위 가능성",
    desc: "코드 단의 SEO가 잘 되어 있어야 마케팅 효율도 올라갑니다. 처음부터 검색에 친화적인 구조로 만듭니다.",
    metric: "구글·네이버 친화",
  },
];

const FAQS = [
  {
    cat: "가격",
    q: "정말 249,000원에 홈페이지 제작이 가능한가요?",
    a: "네, 일반 랜딩페이지 1장 기준의 시작가입니다. 1인 운영 구조와 자체 인프라 덕분에 가능한 가격이며, 결과물 품질은 일반 업체의 500만원짜리와 동등합니다. 페이지 수, 쇼핑몰·관리자 페이지·DB 연동 등 기능 범위에 따라 견적이 조정됩니다.",
  },
  {
    cat: "가격",
    q: "정말 운영비가 0원인가요? 숨겨진 비용은 없나요?",
    a: "운영비·관리비 명목의 정기 청구는 없습니다. 결과물 인도 시 정산이 끝나며, 콘텐츠 수정(텍스트·이미지)은 평생 무료로 지원합니다. 단 도메인 갱신비(연 3,000~30,000원)와 호스팅 비용(월 7,000원~)은 실비로 발생합니다. 모두 시중 최저가 수준입니다.",
  },
  {
    cat: "가격",
    q: "다른 업체는 1,000만원이라는데, 결과물 품질 차이가 없을까요?",
    a: "외관과 기능만 봐서는 거의 차이가 없습니다. 오히려 자체 코딩으로 만든 사이트가 속도·SEO·보안 면에서 더 우수한 경우가 많습니다. 가격 차이의 본질은 결과물이 아니라 비용 구조 차이입니다(인건비·사무실·영업·광고비 등). 의심되시면 포트폴리오에서 실제 작업물을 확인해보시거나, 다른 업체 견적과 직접 비교해보시기 바랍니다.",
  },
  {
    cat: "자체 코딩",
    q: "워드프레스로 만들면 안 되나요? 더 쉽지 않나요?",
    a: "워드프레스는 콘텐츠 직접 관리가 쉽다는 장점이 있지만, 성능·SEO·보안·유지보수에서 본질적 한계가 있습니다. 평균 페이지 로딩 3~5초(자체 코딩은 0.5~1초), 플러그인 보안 취약점, 사이트 무거움, 플러그인 호환성 문제 등. 단순 블로그가 아닌 비즈니스용 사이트라면 자체 코딩을 강력히 권장합니다.",
  },
  {
    cat: "자체 코딩",
    q: "Next.js·React 같은 최신 기술로 만든다는 게 어떤 의미인가요?",
    a: "Next.js는 Vercel(현재 가장 빠르게 성장하는 웹 프레임워크), React는 Facebook·Netflix·Airbnb 등 글로벌 기업들이 사용하는 표준 기술입니다. 검증된 최신 기술 스택으로 만들기 때문에 5년 후에도 유지보수 가능하고, 어떤 개발자에게 넘겨도 이어 작업할 수 있는 자산이 됩니다.",
  },
  {
    cat: "자체 코딩",
    q: "소스코드를 정말 다 인도받을 수 있나요?",
    a: "네, 100% 인도합니다. GitHub 저장소를 통째로 넘겨드리거나, 압축 파일로 전달합니다. 다른 개발사로 옮기시거나 직접 운영하셔도 됩니다. 한 번 받으신 코드는 영구히 소유하시는 자산입니다. HS WEB에 종속될 일이 없습니다.",
  },
  {
    cat: "워크플로우",
    q: "프로젝트 정보가 정리되어 있지 않은데 시작할 수 있을까요?",
    a: "물론입니다. 많은 클라이언트가 비슷한 상황입니다. 첫 상담에서 무엇이 필요한지 함께 정리하고, 자료가 없는 부분(텍스트 작성, 이미지 준비 등)은 같이 풀어나갑니다. 부담 갖지 마시고 연락해주세요.",
  },
  {
    cat: "워크플로우",
    q: "총 제작 기간은 얼마나 걸리나요?",
    a: "일반 랜딩페이지는 약 1~2주, 5~10페이지 기업 홈페이지는 2~4주, 쇼핑몰이나 관리자 페이지가 포함되는 경우 4~8주 정도입니다. 정확한 일정은 첫 상담 후 견적서와 함께 확정합니다. 급한 일정이 있으시면 우선 처리도 가능합니다.",
  },
  {
    cat: "워크플로우",
    q: "디자인이 마음에 안 들면 어떻게 하나요?",
    a: "초안 단계에서 2~3회 수정이 기본 포함됩니다. 색상·레이아웃·폰트·이미지 등 자유롭게 의견 주시면 함께 다듬어 갑니다. 만약 큰 방향 변경이 필요하다면 별도 협의 후 진행하며, 디자인 시안 전 단계에서 취소하시는 경우 전액 환불 가능합니다.",
  },
  {
    cat: "유지보수",
    q: "런칭 후 텍스트·이미지 수정은 어떻게 요청하나요?",
    a: "카톡·이메일·전화로 편하게 요청해주시면 됩니다. 보통 1~2일 이내 처리되며, 콘텐츠 수정(텍스트·이미지·간단한 추가)은 평생 무료입니다. 신규 기능 추가나 큰 구조 변경은 별도 견적으로 진행됩니다.",
  },
  {
    cat: "결제",
    q: "결제는 어떻게 진행되나요?",
    a: "계약 체결 시 50%, 최종 납품 후 잔금 50% 지급이 기본입니다. Enterprise급은 단계별 정산도 가능합니다. 전자 계약서로 진행하며, 세금계산서 발행 가능합니다.",
  },
  {
    cat: "결제",
    q: "환불 정책은 어떻게 되나요?",
    a: "디자인 시안 전 단계에서 취소 시 전액 환불, 이후 단계는 진행 정도에 따라 부분 환불합니다. 정확한 환불 조건은 계약서에 명시되어 있어 투명합니다. 일반 업체처럼 '계약 후 환불 불가' 같은 조항은 없습니다.",
  },
];

const WORKFLOW_STEPS = [
  {
    n: 1,
    title: "정보 제공",
    summary: "필요한 정보를 받습니다",
    detail: "프로젝트 목적·타깃·내용을 알려주세요. 자료(로고·이미지·텍스트)가 정리되어 있지 않아도 괜찮습니다. 함께 정리하며 시작합니다.",
    time: "1~3일",
  },
  {
    n: 2,
    title: "초안 제작",
    summary: "디자인 + 구조 초안",
    detail: "전달받은 정보로 사이트의 디자인과 구조 초안을 만듭니다. 메인 + 내부 페이지 + 모바일 화면까지 한 번에 잡습니다.",
    time: "3~7일",
  },
  {
    n: 3,
    title: "초안 전달 · 피드백",
    summary: "함께 다듬어 나갑니다",
    detail: "완성된 초안을 보내드리고, 마음에 드는 부분과 수정하고 싶은 부분을 자유롭게 알려주세요. 디자인 확정까지 2~3회 수정이 포함됩니다.",
    time: "3~7일",
  },
  {
    n: 4,
    title: "제작 완료 · 전달",
    summary: "사이트 완성 · 운영 시작",
    detail: "확정된 시안을 기반으로 개발을 마무리하고 점검 후 실제 사이트로 배포합니다. 도메인 연결과 운영 가이드까지 함께 전달합니다.",
    time: "5~10일",
  },
];

const HERO_PROOFS = [
  { v: "249,000원~", l: "랜딩페이지 1장 시작가" },
  { v: "0원/월", l: "관리비·운영비 별도 청구 없음" },
  { v: "소스 전체", l: "완성 후 100% 인도" },
];

const LANDING_SUMMARY = [
  {
    title: "가격이 낮은 이유",
    desc: "중간 영업·사무실·호스팅 마진을 걷어내고 제작자가 직접 진행합니다.",
    metric: "약 50%",
    label: "동일 결과물 대비 가격대",
  },
  {
    title: "결과가 좋은 이유",
    desc: "템플릿이 아니라 필요한 기능만 직접 코딩해 빠르고 가볍게 만듭니다.",
    metric: "5배",
    label: "워드프레스 대비 체감 속도",
  },
  {
    title: "맡기기 쉬운 이유",
    desc: "자료가 덜 준비되어도 상담에서 구조를 잡고 초안부터 같이 다듬습니다.",
    metric: "2~3주",
    label: "일반 홈페이지 제작 기간",
  },
];

const QUICK_LINKS = [
  { href: "#price", label: "가격 구조" },
  { href: "#code", label: "자체 코딩" },
  { href: "#workflow", label: "진행 방식" },
  { href: "#faq", label: "FAQ" },
];

export default function WhyHsWebPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative min-h-[760px] overflow-hidden bg-slate-950 text-white">
        <Image
          src="/why-hs-web/hero-code-screens.webp"
          alt="사람 없이 검은 코드 화면이 표시된 모니터, 태블릿, 노트북과 서버 인프라를 보여주는 HS WEB 히어로 이미지"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] opacity-95"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.9)_32%,rgba(2,6,23,0.5)_64%,rgba(2,6,23,0.16)_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(680px_380px_at_18%_28%,rgba(36,89,176,0.34),transparent_72%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-slate-950 via-slate-950/82 to-transparent pointer-events-none" />

        <div className="relative max-w-[1120px] mx-auto px-6 min-h-[760px] flex items-center">
          <div className="w-full max-w-[670px] pt-28 pb-28 md:pt-36 md:pb-32">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white/80 backdrop-blur-md mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              1인 전담 · 자체 코딩 · 자체 인프라
            </div>
            <h1 className="text-[40px] md:text-[66px] font-black tracking-[-0.045em] leading-[1.04] mb-6">
              홈페이지 제작,
              <br />
              더 가볍고 합리적으로.
            </h1>
            <p className="text-[15px] md:text-[19px] text-white/76 leading-[1.75] max-w-[610px] mb-9">
              HS WEB은 불필요한 대행 구조를 줄이고, 직접 코딩한 빠른 웹사이트를 만듭니다.
              낮은 가격의 이유와 좋은 결과의 이유가 같은 곳에서 시작됩니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center max-w-[430px] sm:max-w-none">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-13 px-7 rounded-[10px] bg-white text-slate-950 font-bold text-[15px] no-underline hover:bg-slate-100 transition-colors"
              >
                무료 상담 받기
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="#price"
                className="inline-flex items-center justify-center gap-2 h-13 px-7 rounded-[10px] bg-white/10 text-white font-semibold text-[15px] no-underline border border-white/20 hover:bg-white/15 transition-colors backdrop-blur-md"
              >
                가격 구조 보기
              </Link>
            </div>

            <div className="mt-11 grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-[650px]">
              {HERO_PROOFS.map((s) => (
                <div key={s.v} className="rounded-[10px] border border-white/12 bg-slate-950/34 px-4 py-4 backdrop-blur-md">
                  <p className="text-[22px] font-black tabular-nums leading-none">{s.v}</p>
                  <p className="mt-2 text-[11px] font-semibold text-white/58 leading-[1.45]">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {QUICK_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-8 items-center rounded-full border border-white/12 bg-white/[0.07] px-3 text-[12px] font-bold text-white/70 no-underline hover:bg-white/12 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUE SUMMARY */}
      <section className="relative z-10 -mt-20 bg-transparent">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {LANDING_SUMMARY.map((item) => (
              <div key={item.title} className="rounded-[16px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
                <p className="text-[11px] font-bold text-indigo-600 tracking-[0.16em] uppercase mb-4">
                  {item.title}
                </p>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-[32px] md:text-[38px] font-black tracking-[-0.04em] text-slate-950 tabular-nums">
                    {item.metric}
                  </span>
                  <span className="pb-1.5 text-[12px] font-bold text-slate-500">{item.label}</span>
                </div>
                <p className="text-[13.5px] text-slate-600 leading-[1.7]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 1 — 왜 저렴한가 */}
      <section id="price" className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1120px] mx-auto px-6 pt-28 pb-20 md:pt-32 md:pb-28">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold text-indigo-600 tracking-[0.18em] uppercase mb-3">
              SECTION 01 · 가격의 비밀
            </p>
            <h2 className="text-[30px] md:text-[42px] font-bold tracking-[-0.03em] text-slate-900 leading-[1.2] mb-4">
              왜 다른 업체보다 저렴할까요?
            </h2>
            <p className="text-[15px] md:text-[16px] text-slate-600 leading-[1.7] max-w-[640px] mx-auto">
              결과물이 부실해서가 아닙니다.
              <br className="hidden sm:inline" />
              일반적인 업체의 비용 구조를 단순화하고, 그만큼을 가격에 반영합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-8 lg:gap-12 items-center mb-12">
            <figure className="relative overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
              <Image
                src="/why-hs-web/price-structure.webp"
                alt="복잡한 일반 웹 에이전시 구조와 HS WEB의 직접 제작 구조를 비교하는 시각 이미지"
                width={1672}
                height={941}
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 640px"
                className="w-full aspect-[16/9] object-cover"
              />
              <figcaption className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-2 text-[11px] font-bold">
                <span className="inline-flex min-h-8 items-center justify-center rounded-[8px] bg-white/85 px-3 text-slate-500 backdrop-blur">
                  여러 단계의 비용 구조
                </span>
                <span className="inline-flex min-h-8 items-center justify-center rounded-[8px] bg-slate-950/90 px-3 text-white backdrop-blur">
                  직접 제작 · 직접 운영
                </span>
              </figcaption>
            </figure>
            <div className="lg:pl-2">
              <p className="text-[13px] font-bold text-indigo-600 tracking-[0.16em] uppercase mb-3">
                이해 포인트
              </p>
              <h3 className="text-[24px] md:text-[30px] font-bold tracking-[-0.03em] text-slate-900 leading-[1.2] mb-4">
                가격 차이는 결과물보다
                <br className="hidden sm:block" />
                {" "}
                구조 차이에서 납니다.
              </h3>
              <p className="text-[14.5px] text-slate-600 leading-[1.8] mb-6">
                일반 업체는 팀·사무실·영업·호스팅 마진이 가격에 얹힙니다.
                HS WEB은 제작자와 클라이언트가 바로 연결되고, 서버도 직접 운영해
                꼭 필요한 비용만 남깁니다.
              </p>
              <div className="space-y-3">
                {[
                  "기획·디자인·개발을 한 사람이 끝까지 담당",
                  "외부 호스팅 마진 없이 자체 인프라 운영",
                  "월 운영비 대신 결과물 중심으로 정산",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 border-l-2 border-indigo-500 pl-4">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                    <p className="text-[13.5px] font-semibold text-slate-700 leading-[1.6]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 비교 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-12">
            {/* 일반 업체 */}
            <div className="p-7 md:p-8 rounded-[16px] border border-slate-200 bg-white">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-slate-400 mb-3">
                일반 웹 에이전시
              </p>
              <p className="text-[22px] md:text-[24px] font-bold text-slate-700 leading-[1.3] mb-5">
                평균 500만~1,500만원
              </p>
              <ul className="space-y-2.5 list-none m-0">
                {[
                  "기획자·디자이너·개발자 분업 → 인건비 3배",
                  "사무실 임대료 · 영업팀 운영",
                  "광고 대행료 · 마케팅 비용",
                  "외부 서버 호스팅 마진",
                  "월 운영비 30만원~ 별도 청구",
                ].map((it) => (
                  <li key={it} className="flex items-start gap-2 text-[13px] text-slate-500">
                    <svg className="w-3.5 h-3.5 shrink-0 mt-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {it}
                  </li>
                ))}
              </ul>
            </div>

            {/* HS WEB */}
            <div className="p-7 md:p-8 rounded-[16px] border-2 border-slate-900 bg-slate-900 text-white relative overflow-hidden">
              <span className="absolute -top-3 -right-3 inline-flex items-center gap-1 h-7 px-3 rounded-full bg-indigo-500 text-white text-[11px] font-bold tracking-wider rotate-3 shadow-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                HS WEB
              </span>
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/60 mb-3">
                같은 결과 · 더 합리적
              </p>
              <p className="text-[22px] md:text-[24px] font-bold leading-[1.3] mb-5">
                249,000원부터
              </p>
              <ul className="space-y-2.5 list-none m-0">
                {[
                  "1인 전담 — 인건비 1배만 발생",
                  "사무실·영업·광고 없음",
                  "자체 서버 직접 운영",
                  "호스팅 월 7,000원 원가 수준",
                  "운영비 0원 · 콘텐츠 수정 평생 무료",
                ].map((it) => (
                  <li key={it} className="flex items-start gap-2 text-[13.5px] text-white/90 font-medium">
                    <svg className="w-3.5 h-3.5 shrink-0 mt-1 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4가지 가격 이유 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PRICE_REASONS.map((r) => (
              <div key={r.n} className="p-6 rounded-[14px] border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-[14px] font-bold text-indigo-500 tnum">{r.n}</span>
                  <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">{r.title}</h3>
                </div>
                <p className="text-[13.5px] text-slate-600 leading-[1.7] mb-3">{r.desc}</p>
                <div className="inline-flex items-center h-7 px-3 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                  {r.impact}
                </div>
              </div>
            ))}
          </div>

          {/* Trust box — 의심하시는 분들에게 */}
          <div className="mt-12 relative overflow-hidden rounded-[18px] bg-slate-900 text-white p-7 md:p-10">
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                background:
                  "radial-gradient(500px 250px at 100% 0%, rgba(255,255,255,0.6) 0%, transparent 60%)",
              }}
            />
            <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-8 items-start">
              <div>
                <span className="inline-flex items-center h-7 px-3 rounded-full bg-white/10 text-white text-[11px] font-bold tracking-[0.14em] uppercase mb-5">
                  TRUST · 의심해도 괜찮습니다
                </span>
                <h3 className="text-[24px] md:text-[30px] font-bold tracking-[-0.02em] leading-[1.25] mb-4">
                  &ldquo;가격이 너무 싸서 의심되시나요?&rdquo;
                </h3>
                <p className="text-[14px] md:text-[15px] text-white/75 leading-[1.75]">
                  많이 받는 질문입니다. 합리적인 의심입니다.<br />
                  대신 결과물과 사후 보장으로 답해드립니다.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "이미 충분히 검증된 경험",
                    desc: "수많은 홈페이지·랜딩페이지·관리자 페이지·웹 프로그램을 직접 개발해 운영해왔습니다. 포트폴리오에서 실제 라이브 사이트를 확인하실 수 있습니다.",
                  },
                  {
                    title: "소스코드 100% 인도",
                    desc: "완성된 사이트의 소스코드를 통째로 받으십니다. 본인의 자산으로 영구 소유하시고, 어떤 개발사로 옮기셔도 그대로 이어 작업이 가능합니다.",
                  },
                  {
                    title: "다른 업체에서도 동일 서비스 가능",
                    desc: "표준 기술(Next.js · React)로 만들기 때문에 다른 개발자도 이어받아 유지보수할 수 있습니다. HS WEB에 종속될 일이 없어 안심하시고 시작하셔도 됩니다.",
                  },
                ].map((t, i) => (
                  <div key={t.title} className="flex items-start gap-4">
                    <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/15 text-white text-[13px] font-bold tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[15px] md:text-[16px] font-bold text-white mb-1.5 tracking-tight">
                        {t.title}
                      </h4>
                      <p className="text-[12.5px] md:text-[13px] text-white/65 leading-[1.75]">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA strip */}
            <div className="relative mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p className="text-[13px] text-white/65">
                실제 작업물부터 확인해보세요. 그 후 판단하셔도 늦지 않습니다.
              </p>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-[10px] bg-white text-slate-900 font-bold text-[13px] no-underline hover:bg-slate-100 transition-colors"
              >
                포트폴리오 확인
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — 자체 코딩 장점 */}
      <section id="code" className="bg-white border-b border-slate-200">
        <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold text-indigo-600 tracking-[0.18em] uppercase mb-3">
              SECTION 02 · 코딩의 가치
            </p>
            <h2 className="text-[30px] md:text-[42px] font-bold tracking-[-0.03em] text-slate-900 leading-[1.2] mb-4">
              자체 코딩만의 차이
            </h2>
            <p className="text-[15px] md:text-[16px] text-slate-600 leading-[1.7] max-w-[640px] mx-auto">
              워드프레스·플랫폼 솔루션이 아니라
              <br className="hidden sm:inline" />
              Next.js · React로 처음부터 직접 만듭니다. 6가지가 결정적으로 달라집니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.88fr_1.12fr] gap-8 lg:gap-10 items-center mb-12">
            <div className="order-2 lg:order-1">
              <p className="text-[13px] font-bold text-indigo-600 tracking-[0.16em] uppercase mb-3">
                이해 포인트
              </p>
              <h3 className="text-[24px] md:text-[30px] font-bold tracking-[-0.03em] text-slate-900 leading-[1.2] mb-4">
                필요한 코드만 남기면
                <br className="hidden sm:block" />
                {" "}
                사이트가 가벼워집니다.
              </h3>
              <p className="text-[14.5px] text-slate-600 leading-[1.8] mb-6">
                템플릿·플러그인 방식은 쓰지 않는 기능까지 함께 실리기 쉽습니다.
                자체 코딩은 목적에 맞는 구조만 설계해 속도, SEO, 보안, 확장성에서
                더 오래 버티는 자산이 됩니다.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["빠른 로딩", "SEO 구조", "보안 안정성", "자유 확장"].map((item) => (
                  <div key={item} className="h-11 rounded-[10px] border border-slate-200 bg-slate-50 flex items-center justify-center text-[13px] font-bold text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <figure className="relative order-1 lg:order-2 overflow-hidden rounded-[18px] border border-slate-200 bg-slate-950 shadow-sm">
              <Image
                src="/why-hs-web/custom-code.webp"
                alt="무거운 템플릿 구조에서 가벼운 자체 코드 구조로 전환되어 빠른 반응형 사이트가 되는 시각 이미지"
                width={1672}
                height={941}
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 620px"
                className="w-full aspect-[16/9] object-cover"
              />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-800 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                자체 코딩 구조
              </div>
            </figure>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CODING_BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className="p-6 md:p-7 rounded-[16px] border border-slate-200 bg-white hover:border-slate-900 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-[10px] bg-slate-900 text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                    </svg>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-[17px] font-bold text-slate-900 tracking-tight mb-2">{b.title}</h3>
                <p className="text-[13.5px] text-slate-600 leading-[1.7] mb-4">{b.desc}</p>
                <div className="inline-flex items-center h-6 px-2.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  ✓ {b.metric}
                </div>
              </div>
            ))}
          </div>

          {/* 핵심 카피 */}
          <div className="mt-10 p-7 md:p-8 rounded-[16px] bg-slate-50 border border-slate-200">
            <p className="text-[13.5px] md:text-[15px] text-slate-700 leading-[1.8]">
              <strong className="text-slate-900">워드프레스 사이트가 무겁고 느린 건</strong>{" "}
              플랫폼의 모든 기능을 다 담아야 하기 때문입니다.
              자체 코딩은 <strong className="text-slate-900">정말 필요한 코드만</strong> 들어갑니다.
              그래서 빠르고, 보안이 단단하고, 어떤 기능도 자유롭게 추가할 수 있습니다.
            </p>
          </div>

          <div className="mt-8 rounded-[18px] bg-slate-950 text-white p-7 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 overflow-hidden relative">
            <div className="absolute inset-0 p-bg-grid-dots opacity-[0.06] pointer-events-none" />
            <div className="relative">
              <p className="text-[11px] font-bold text-emerald-300 tracking-[0.16em] uppercase mb-3">
                맞춤 기능까지 고려한다면
              </p>
              <h3 className="text-[24px] md:text-[30px] font-bold tracking-[-0.03em] leading-[1.2] mb-2">
                처음부터 코드로 만드는 편이 더 오래 갑니다.
              </h3>
              <p className="text-[13.5px] md:text-[14.5px] text-white/65 leading-[1.7] max-w-[620px]">
                관리자, 예약, 결제, 회원, API 연동처럼 이후에 필요한 기능도 같은 구조 위에서 확장할 수 있습니다.
              </p>
            </div>
            <Link
              href="/contact"
              className="relative inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[10px] bg-white text-slate-950 text-[14px] font-bold no-underline hover:bg-slate-100 transition-colors shrink-0"
            >
              기능 상담하기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3 — 워크플로우 */}
      <section id="workflow" className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold text-indigo-600 tracking-[0.18em] uppercase mb-3">
              SECTION 03 · 함께 만드는 방법
            </p>
            <h2 className="text-[30px] md:text-[42px] font-bold tracking-[-0.03em] text-slate-900 leading-[1.2] mb-4">
              어떻게 진행되나요?
            </h2>
            <p className="text-[15px] md:text-[16px] text-slate-600 leading-[1.7] max-w-[640px] mx-auto">
              정보를 받아 초안을 만들고, 피드백으로 다듬어 완성합니다.
              <br className="hidden sm:inline" />
              단계마다 무엇을 진행하는지 투명하게 공유합니다.
            </p>
          </div>

          <figure className="relative overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm mb-12">
            <Image
              src="/why-hs-web/workflow.webp"
              alt="정보 제공, 초안 제작, 피드백, 런칭으로 이어지는 HS WEB 제작 흐름 이미지"
              width={1672}
              height={941}
              loading="eager"
              sizes="(max-width: 1100px) 100vw, 1100px"
              className="w-full aspect-[16/7] object-cover object-center"
            />
            <figcaption className="absolute inset-x-4 bottom-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-bold">
              {["정보 제공", "초안 제작", "피드백 반영", "런칭 · 전달"].map((label) => (
                <span key={label} className="inline-flex min-h-8 items-center justify-center rounded-[8px] bg-white/85 px-3 text-slate-800 backdrop-blur">
                  {label}
                </span>
              ))}
            </figcaption>
          </figure>

          {/* Workflow timeline — rich cards with gradient header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 relative">
            {WORKFLOW_STEPS.map((s, i) => (
              <div key={s.n} className="relative group">
                {/* Connector arrow — desktop only, between cards */}
                {i < WORKFLOW_STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-[68px] w-8 h-8 items-center justify-center z-10 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                )}

                <div className="h-full rounded-[18px] bg-white border border-slate-200 overflow-hidden group-hover:border-slate-900 group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all">
                  {/* Header — dark with big number */}
                  <div className="relative px-6 pt-5 pb-4 bg-gradient-to-br from-slate-900 to-slate-700 text-white overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-[0.07] pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(120px 80px at 100% 0%, rgba(255,255,255,0.8) 0%, transparent 60%)",
                      }}
                    />
                    <div className="relative flex items-start justify-between">
                      <span className="text-[44px] md:text-[52px] font-black leading-none tnum tracking-tighter">
                        0{s.n}
                      </span>
                      <span className="inline-flex items-center h-5 px-2 rounded-full bg-white/15 text-white text-[9px] font-bold tracking-[0.14em] uppercase mt-2">
                        Step
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col h-[calc(100%-90px)]">
                    <p className="text-[10.5px] font-bold text-indigo-600 tracking-[0.14em] uppercase mb-2">
                      {s.summary}
                    </p>
                    <h3 className="text-[17px] md:text-[18px] font-bold text-slate-900 tracking-tight mb-3">
                      {s.title}
                    </h3>
                    <p className="text-[13px] text-slate-600 leading-[1.7] mb-5 flex-1">
                      {s.detail}
                    </p>

                    {/* Duration */}
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                      <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[10px] text-slate-500 font-semibold">예상 소요</span>
                      <span className="ml-auto text-[12.5px] font-bold text-slate-900 tabular-nums">
                        {s.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom — strong metric cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM12 15a3 3 0 100-6 3 3 0 000 6z",
                title: "투명한 진행",
                desc: "각 단계마다 진행 상황·일정을 실시간 공유합니다",
                metric: "100%",
                label: "공유율",
              },
              {
                icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "빠른 응답",
                desc: "업무 시간 내 문의는 1시간 이내 답변드립니다",
                metric: "1시간",
                label: "이내",
              },
              {
                icon: "M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9",
                title: "수정 무료",
                desc: "콘텐츠 수정(텍스트·이미지)은 평생 무료입니다",
                metric: "평생",
                label: "무료",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="group rounded-[16px] bg-white border border-slate-200 p-5 md:p-6 hover:border-slate-900 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-[12px] bg-slate-900 text-white group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                    </svg>
                  </span>
                  <span className="inline-flex items-baseline gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[12px] font-bold">
                    <span className="text-[16px] tabular-nums">{c.metric}</span>
                    <span className="text-[10px] font-semibold text-slate-500">{c.label}</span>
                  </span>
                </div>
                <h4 className="text-[15.5px] font-bold text-slate-900 mb-1.5 tracking-tight">{c.title}</h4>
                <p className="text-[12.5px] text-slate-500 leading-[1.7]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white border-b border-slate-200">
        <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold text-indigo-600 tracking-[0.18em] uppercase mb-3">
              SECTION 04 · 자주 묻는 질문
            </p>
            <h2 className="text-[30px] md:text-[42px] font-bold tracking-[-0.03em] text-slate-900 leading-[1.2] mb-4">
              궁금하신 점을 정리했습니다
            </h2>
            <p className="text-[15px] md:text-[16px] text-slate-600 leading-[1.7] max-w-[640px] mx-auto">
              가격·자체 코딩·워크플로우·유지보수·결제까지
              <br className="hidden sm:inline" />
              실제로 많이 들어오는 질문들을 한 번에 정리했습니다.
            </p>
          </div>

          {/* Category-grouped FAQ */}
          <div className="max-w-[860px] mx-auto space-y-10">
            {Array.from(new Set(FAQS.map((f) => f.cat))).map((cat) => {
              const items = FAQS.filter((f) => f.cat === cat);
              return (
                <div key={cat}>
                  {/* Category header */}
                  <div className="flex items-baseline gap-3 mb-4 px-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-[12px] font-bold tabular-nums">
                      {items.length}
                    </span>
                    <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">
                      {cat}
                    </h3>
                    <span className="flex-1 h-px bg-slate-200" />
                  </div>

                  {/* Accordion list */}
                  <div className="rounded-[14px] border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
                    {items.map((item, idx) => {
                      const globalIdx = FAQS.indexOf(item);
                      return (
                        <details key={idx} className="group">
                          <summary className="flex items-start justify-between gap-4 px-5 md:px-6 py-5 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <span className="text-[11px] font-bold text-slate-400 tnum mt-1 shrink-0 w-7">
                                Q{String(globalIdx + 1).padStart(2, "0")}
                              </span>
                              <span className="text-[15px] font-semibold text-slate-900 leading-[1.55]">
                                {item.q}
                              </span>
                            </div>
                            <svg
                              className="w-5 h-5 text-slate-400 shrink-0 group-open:rotate-180 group-open:text-slate-900 transition-all mt-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </summary>
                          <div className="px-5 md:px-6 pb-5 pl-[60px] text-[14px] text-slate-600 leading-[1.8] bg-slate-50/40">
                            {item.a}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Still curious */}
          <div className="mt-8 text-center">
            <p className="text-[13px] text-slate-500 mb-3">더 궁금한 점이 있으신가요?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-[10px] bg-slate-900 text-white text-[13.5px] font-bold no-underline hover:bg-slate-800 transition-colors"
            >
              직접 물어보기
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 p-bg-grid-dots opacity-[0.06] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(600px 300px at 50% 0%, rgba(79,70,229,0.25) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-[1100px] mx-auto px-6 py-20 md:py-28 text-center">
          <p className="text-[11px] font-bold text-white/60 tracking-[0.2em] uppercase mb-5">
            READY TO START
          </p>
          <h2 className="text-[30px] md:text-[42px] font-bold tracking-[-0.03em] leading-[1.2] mb-4">
            상담은 무료, 시작은 부담 없이.
          </h2>
          <p className="text-[15px] md:text-[16px] text-white/70 leading-[1.7] mb-10 max-w-[560px] mx-auto">
            프로젝트 정보가 정리되어 있지 않아도 괜찮습니다.
            대화를 통해 함께 정리합니다. 24시간 이내 회신드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-[420px] sm:max-w-none mx-auto">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 h-13 px-7 rounded-[10px] bg-white text-slate-900 font-bold text-[15px] no-underline hover:bg-slate-100 transition-colors"
            >
              무료 상담 신청
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="tel:010-3319-2509"
              className="inline-flex items-center justify-center gap-2 h-13 px-7 rounded-[10px] bg-white/10 text-white font-semibold text-[15px] no-underline border border-white/20 hover:bg-white/15 transition-colors tnum"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              010-3319-2509
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
