// 이미 만들어둔 안내 페이지들. 정보공유에서 함께 보여주되 주소는 그대로 둔다.
export type Guide = {
  href: string;
  title: string;
  summary: string;
  tag: string;
  /** 썸네일 경로. 비어 있으면 빗금 자리표시자가 대신 들어간다. */
  image: string;
};

export const GUIDES: Guide[] = [
  {
    href: "/process",
    title: "홈페이지 진행 절차",
    summary: "정보 수집부터 초안, 피드백, 완료까지 어떤 순서로 진행되는지 단계별로 정리했습니다.",
    tag: "제작 준비",
    image: "/insights/website-process.webp",
  },
  {
    href: "/custom-development",
    title: "자체 개발 vs 플랫폼",
    summary: "카페24·윅스·워드프레스 같은 플랫폼과 직접 코딩의 차이, 그리고 어느 쪽이 어떤 상황에 맞는지 짚었습니다.",
    tag: "제작 준비",
    image: "/insights/custom-vs-platform.webp",
  },
  {
    href: "/ai-development",
    title: "AI로 만들면 되는 거 아닌가?",
    summary: "AI가 코드를 만드는 것과 실제 서비스를 안정적으로 운영하는 것의 차이를 시스템·보안·유지보수 관점에서 정리했습니다.",
    tag: "개발 상식",
    image: "/insights/ai-development.webp",
  },
  {
    href: "/domain-hosting",
    title: "도메인·호스팅이란?",
    summary: "도메인과 호스팅이 각각 무엇이고 홈페이지를 유지하는 데 왜 둘 다 필요한지 설명합니다.",
    tag: "운영",
    image: "/insights/domain-hosting.webp",
  },
  {
    href: "/nameserver-guide",
    title: "네임서버 변경 가이드",
    summary: "가비아·후이즈·호스팅케이알·카페24 등 등록업체별 메뉴 경로와 전파 시간까지 단계별로 안내합니다.",
    tag: "운영",
    image: "/insights/nameserver-guide.webp",
  },
  {
    href: "/seo",
    title: "검색엔진 최적화(SEO) 안내",
    summary: "검색에 나오게 하려면 무엇이 필요한지, 기본으로 들어가는 작업과 별도 옵션은 어디까지인지 구분했습니다.",
    tag: "운영",
    image: "/insights/seo-guide.webp",
  },
  {
    href: "/pg-guide",
    title: "PG(전자결제) 연동 안내",
    summary: "국내 주요 PG 연동 범위와, 사업자 등록·통신판매업 신고처럼 고객이 직접 진행해야 하는 부분을 정리했습니다.",
    tag: "쇼핑몰",
    image: "/insights/pg-guide.webp",
  },
];
