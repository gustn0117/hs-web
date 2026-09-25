import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { PageShell, Section } from "@/components/PageShell";

const SITE_URL = "https://hsweb.pics";

export const metadata: Metadata = {
  title: "홈페이지·프로그램, AI로 만들면 되는 거 아닌가?",
  description:
    "AI가 코드를 만드는 것과 실제 서비스를 안정적으로 운영하는 것은 다릅니다. 시스템 설계, 데이터베이스, 서버, 보안, 외부 API, 유지보수 관점에서 차이를 설명합니다.",
  keywords: [
    "AI 홈페이지 제작",
    "AI 프로그램 개발",
    "AI 코딩",
    "웹 개발자 역할",
    "데이터베이스 설계",
    "웹 서비스 보안",
    "홈페이지 유지보수",
  ],
  alternates: { canonical: `${SITE_URL}/ai-development` },
  openGraph: {
    type: "article",
    title: "홈페이지·프로그램, AI로 만들면 되는 거 아닌가?",
    description: "AI는 개발을 빠르게 하지만, 안정적인 서비스에는 설계·검증·운영 역량이 필요합니다.",
    url: `${SITE_URL}/ai-development`,
    siteName: "HS WEB 웹에이전시",
    locale: "ko_KR",
    images: [{ url: `${SITE_URL}/insights/ai-development.webp`, alt: "AI와 웹 서비스 시스템 설계" }],
  },
};

type Topic = {
  number: string;
  title: string;
  paragraphs: ReactNode[];
  points?: string[];
  takeaway: ReactNode;
};

const topics: Topic[] = [
  {
    number: "01",
    title: "홈페이지도 결국 하나의 시스템입니다",
    paragraphs: [
      "일반적인 홈페이지나 웹 프로그램도 사용자가 보는 화면만으로 구성되지 않습니다. 요청을 처리하는 백엔드, 데이터를 저장하는 데이터베이스, 프로그램이 실행되는 서버와 파일 스토리지, 도메인·DNS·SSL, 보안과 백업 체계가 서로 연결되어 하나의 서비스를 만듭니다.",
      "화면이 정상적으로 보인다는 사실은 전체 시스템 중 프론트엔드 한 부분이 작동한다는 의미에 가깝습니다. 실제 서비스에서는 요청이 들어오고 데이터가 처리되어 다시 사용자에게 전달되는 전 과정이 안정적이어야 합니다.",
    ],
    points: ["프론트엔드", "백엔드·API", "데이터베이스", "서버·스토리지", "도메인·DNS·SSL", "보안·백업"],
    takeaway: <>사용자 화면 → 애플리케이션 → 데이터베이스 → 서버 인프라까지 전체 흐름을 함께 설계해야 합니다.</>,
  },
  {
    number: "02",
    title: "AI가 만든 코드는 ‘작동’과 ‘운영’을 구분해야 합니다",
    paragraphs: [
      "AI에게 회원가입, 게시판, 관리자 페이지를 요청하면 실제로 동작하는 코드를 빠르게 만들 수 있습니다. 간단한 소개 페이지나 프로토타입이라면 이 장점이 특히 큽니다.",
      "하지만 데이터가 수만 건으로 늘거나 여러 사용자가 동시에 접속하면 상황이 달라집니다. 불필요한 데이터베이스 조회, 과도한 API 요청, 반복 계산 같은 구조는 속도를 떨어뜨리고 서버 비용을 높입니다.",
    ],
    points: ["쿼리 최적화", "인덱스 설계", "캐싱", "비동기 처리", "API 구조", "서버 자원 관리"],
    takeaway: <>처음 한 번 실행되는 코드보다, 트래픽과 데이터가 늘어도 안정적으로 버티는 코드가 중요합니다.</>,
  },
  {
    number: "03",
    title: "데이터베이스 구조는 나중에 바꾸기 어렵습니다",
    paragraphs: [
      "회원, 주문, 결제, 문의, 게시글, 권한 같은 데이터를 어떤 관계로 저장할지는 서비스의 뼈대를 결정합니다. 초기 설계가 잘못되면 기능이 늘어날수록 수정 범위와 오류 가능성도 함께 커집니다.",
      "예를 들어 하나의 회원 테이블에 기업회원, 일반회원, 관리자, 권한등급, 결제정보를 계속 덧붙이면 구조가 복잡해지고 한 기능의 변경이 다른 기능에 영향을 주기 쉬워집니다.",
    ],
    points: ["데이터 관계", "권한 모델", "정합성 규칙", "변경 이력", "확장 가능성", "마이그레이션"],
    takeaway: <>현재 필요한 기능뿐 아니라 향후 추가될 기능과 데이터 이전까지 고려해 구조를 설계해야 합니다.</>,
  },
  {
    number: "04",
    title: "프로그램 구조와 서버 인프라는 함께 봐야 합니다",
    paragraphs: [
      "작은 홈페이지는 하나의 서버로도 충분하지만, 서비스가 성장하면 애플리케이션 서버, 데이터베이스, 파일 스토리지를 분리하거나 트래픽을 여러 서버로 나누어야 할 수 있습니다.",
      "서버 사양만 높인다고 모든 문제가 해결되지는 않습니다. 잘못된 쿼리 하나가 데이터베이스에 큰 부하를 만들고, 비효율적인 이미지 처리 방식이 트래픽 비용을 크게 늘릴 수 있습니다.",
    ],
    points: ["서버 분리", "트래픽 분산", "스토리지 전략", "이미지 최적화", "모니터링", "비용 관리"],
    takeaway: <>애플리케이션의 내부 로직과 실제 운영 인프라는 별개가 아니라 서로 영향을 주는 하나의 설계 영역입니다.</>,
  },
  {
    number: "05",
    title: "보안은 기능 구현보다 더 중요할 수 있습니다",
    paragraphs: [
      "회원정보를 저장한다면 비밀번호 처리, 로그인 세션과 토큰 관리, 관리자 권한 검증, API 노출 범위, 파일 업로드 정책까지 확인해야 합니다.",
      "SQL Injection, XSS, CSRF, 권한 검증 누락 같은 취약점은 화면만 확인해서는 발견하기 어렵습니다. 특히 결제·개인정보·기업 내부 데이터가 포함된 서비스는 단순히 정상 작동한다는 이유만으로 운영해서는 안 됩니다.",
    ],
    points: ["인증·인가", "입력값 검증", "세션·토큰", "파일 업로드", "비밀정보 관리", "보안 로그"],
    takeaway: <>보안은 마지막에 덧붙이는 기능이 아니라 설계와 개발 전 과정에 포함되어야 하는 기본 조건입니다.</>,
  },
  {
    number: "06",
    title: "외부 API는 연결 이후의 상황까지 설계해야 합니다",
    paragraphs: [
      "결제 PG, 문자·알림톡, 이메일, 지도, 소셜 로그인 같은 외부 API는 정상 요청을 한 번 성공시키는 것만으로 연동이 끝나지 않습니다.",
      "요청 실패, 응답 지연, 중복 호출, 외부 서비스 장애가 발생했을 때의 처리 방식이 필요합니다. 특히 결제처럼 동일 요청이 두 번 처리되면 문제가 되는 기능은 중복 방지와 거래 기록 검증이 필수입니다.",
    ],
    points: ["실패 처리", "타임아웃", "재시도 정책", "중복 요청 방지", "장애 대응", "로그·추적"],
    takeaway: <>테스트 환경의 정상 시나리오뿐 아니라 실패와 예외 상황에서도 데이터가 안전하도록 만들어야 합니다.</>,
  },
  {
    number: "07",
    title: "유지보수 가능한 코드인가도 중요합니다",
    paragraphs: [
      "AI가 짧은 시간에 많은 코드를 만들면 비슷한 기능이 여러 곳에 중복되거나 서로 다른 규칙으로 구현될 수 있습니다. 서비스가 커지면 하나를 고치기 위해 여러 파일을 함께 수정해야 하는 구조가 됩니다.",
      "좋은 프로그램은 코드가 적거나 최신 기술을 사용했다는 이유만으로 결정되지 않습니다. 다른 개발자가 넘겨받아도 구조를 이해하고 안전하게 수정할 수 있어야 합니다.",
    ],
    points: ["일관된 폴더 구조", "모듈화", "공통 컴포넌트", "API 규칙", "예외 처리", "문서·테스트"],
    takeaway: <>빠르게 만든 코드보다 변경의 영향을 예측하고 확장할 수 있는 구조가 장기 운영 비용을 줄입니다.</>,
  },
  {
    number: "08",
    title: "개발자는 AI를 사용하면 안 될까요?",
    paragraphs: [
      "오히려 반대입니다. AI는 반복 코드 작성, UI 초안, 오류 분석, 테스트 코드, 문서화 같은 작업을 빠르게 처리해 개발자의 생산성을 크게 높입니다.",
      "중요한 것은 AI 사용 여부가 아니라 누가 결과물을 판단하고 책임질 수 있느냐입니다. 개발자는 전체 시스템 구조를 설계하고, 생성된 코드를 검토하며, 데이터베이스와 서버를 구성하고, 보안과 실제 운영 문제를 해결해야 합니다.",
    ],
    points: ["AI: 초안과 반복 작업", "개발자: 구조 설계", "개발자: 품질 검증", "개발자: 보안 판단", "개발자: 운영 대응", "개발자: 최종 책임"],
    takeaway: <>AI는 개발자를 대체하는 마법의 제작기가 아니라, 개발자가 더 빠르고 효율적으로 일하도록 돕는 강력한 도구입니다.</>,
  },
];

export default function AiDevelopmentPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "정보공유", href: "/insights" }, { label: "AI와 개발" }]}
      overline="AI & DEVELOPMENT"
      title="홈페이지·프로그램, AI로 만들면 되는 거 아닌가?"
      subtitle="AI는 화면과 코드를 빠르게 만들 수 있습니다. 하지만 실제 고객과 데이터가 존재하는 서비스를 안정적으로 운영하려면 설계·검증·운영 역량이 함께 필요합니다."
      stats={[
        { label: "AI의 강점", value: "속도", suffix: "" },
        { label: "개발의 핵심", value: "설계", suffix: "" },
        { label: "운영의 기준", value: "안정성", suffix: "" },
        { label: "최종 책임", value: "사람", suffix: "" },
      ]}
    >
      <div className="overflow-hidden rounded-[18px] border border-[var(--c-line)] bg-white">
        <Image
          src="/insights/ai-development.webp"
          alt="AI를 활용해 웹 서비스의 화면, 코드, 데이터베이스, 서버, 보안을 함께 설계하는 모습"
          width={1280}
          height={800}
          priority
          className="block w-full h-auto"
        />
      </div>

      <section className="max-w-[900px]">
        <p className="text-[16px] md:text-[18px] text-[var(--c-text-2)] leading-[1.9]">
          최근 AI는 화면 제작부터 코드 작성, 데이터베이스 연결까지 상당 부분 수행합니다. 간단한 소개 페이지나
          프로토타입이라면 몇 시간 만에 결과물이 나오기도 합니다. 하지만 <strong className="text-[var(--c-text)]">코드가
          만들어지는 것</strong>과 <strong className="text-[var(--c-text)]">실제로 안정적으로 운영할 수 있는 서비스를
          개발하는 것</strong>은 전혀 다른 문제입니다.
        </p>
        <div className="mt-6 rounded-[14px] border-l-4 border-[var(--c-main)] bg-[var(--c-main-bg)] px-5 py-5 md:px-7">
          <p className="text-[16px] md:text-[18px] font-bold text-[var(--c-text)] leading-[1.7]">
            화면을 만드는 것은 개발의 일부입니다. 실제 서비스는 데이터, 서버, 보안, 장애 대응과 유지보수까지
            포함해 판단해야 합니다.
          </p>
        </div>
      </section>

      {topics.map((topic) => (
        <Section key={topic.number} overline={topic.number} title={topic.title}>
          <div className="rounded-[16px] border border-[var(--c-line)] bg-white p-6 md:p-8">
            <div className="max-w-[920px] space-y-4">
              {topic.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[14.5px] md:text-[15.5px] text-[var(--c-text-2)] leading-[1.85]">
                  {paragraph}
                </p>
              ))}
            </div>

            {topic.points && (
              <ul className="mt-6 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3">
                {topic.points.map((point) => (
                  <li
                    key={point}
                    className="flex min-h-11 items-center gap-2 rounded-[9px] bg-[var(--c-bg-1)] px-3 py-2.5 text-[12.5px] font-semibold text-[var(--c-text-2)]"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c-main)]" />
                    {point}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 border-t border-[var(--c-line)] pt-5">
              <p className="text-[14px] font-bold text-[var(--c-main)] leading-[1.75]">{topic.takeaway}</p>
            </div>
          </div>
        </Section>
      ))}

      <Section overline="CONCLUSION" title="AI냐 개발자냐의 문제가 아닙니다">
        <div className="rounded-[18px] bg-[var(--c-text)] px-6 py-8 text-white md:px-10 md:py-10">
          <p className="max-w-[920px] text-[18px] md:text-[22px] font-bold leading-[1.65] tracking-[-0.02em]">
            앞으로의 개발은 AI를 사용하느냐의 문제가 아니라, AI를 활용하면서도 전체 시스템을 제대로 설계하고
            검증할 수 있는 역량이 있느냐의 문제가 될 가능성이 높습니다.
          </p>
          <p className="mt-5 max-w-[920px] text-[14px] md:text-[15px] text-white/70 leading-[1.85]">
            기업 홈페이지, 쇼핑몰, 예약 시스템, 관리자 프로그램, 사내 시스템처럼 실제 고객과 데이터가 존재하는
            서비스는 데이터베이스 설계, 서버 구조, 내부 로직 최적화, 보안, 트래픽 대응, 장애 처리, 백업,
            유지보수와 확장성까지 확인해야 비로소 안정적으로 운영할 수 있습니다.
          </p>
        </div>
      </Section>
    </PageShell>
  );
}
