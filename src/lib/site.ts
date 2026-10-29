/**
 * 사이트 기본 정보 한 곳. 주소가 바뀌면 여기만 고친다.
 *
 * 대표 주소는 haonlabs.com 이다. hsweb.pics 로 들어와도 같은 내용이 나오지만
 * 모든 canonical 이 haonlabs.com 을 가리키므로 검색엔진은 한쪽만 색인한다.
 */

export const SITE_URL = "https://haonlabs.com";
export const SITE_HOST = "haonlabs.com";

/** 예전 대표 주소. 지금도 같은 앱을 서비스하지만 색인은 SITE_URL 로 모은다. */
export const LEGACY_SITE_URL = "https://hsweb.pics";
export const LEGACY_SITE_HOST = "hsweb.pics";

export const SITE_NAME = "하온";
/** 검색 결과에 표시되는 사이트 이름. 구글은 WebSite 구조화 데이터와 og:site_name 을 본다. */
export const SITE_DISPLAY_NAME = "하온 소프트웨어 솔루션";

export const DEFAULT_DESCRIPTION =
  "웹·업무 시스템을 만드는 하온. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션 개발까지. 합리적인 가격과 무료 유지보수로 비즈니스 성장에 필요한 모든 웹 솔루션을 제공합니다.";

export const OWNER_NAME = "심현수";
export const CONTACT_PHONE = "010-3319-2509";
/** 구조화 데이터용 E.164 표기 */
export const CONTACT_PHONE_E164 = "+82-10-3319-2509";
export const BUSINESS_HOURS = "평일 10:00 — 19:00";

/** 주소를 절대 주소로 만든다. abs("/pricing") → "https://haonlabs.com/pricing" */
export function abs(path = ""): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * 링크 공유 미리보기에 쓰이는 기본 이미지.
 *
 * Next 는 페이지가 openGraph 를 직접 선언하면 부모의 openGraph 를 통째로 갈아끼운다.
 * 그래서 openGraph 를 덮어쓰는 페이지는 images 를 반드시 다시 넣어야 하고,
 * 빠뜨리면 카카오톡·네이버 공유에서 썸네일이 사라진다.
 */
export const OG_IMAGE = {
  url: abs("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: "하온 HAON - 웹·업무 시스템 제작",
};

/**
 * 네이버 서치어드바이저 사이트 인증 코드.
 *
 * 코드는 사이트(도메인)마다 다르다. 배열에 여러 개를 넣으면 meta 태그가 그만큼 나가고
 * 네이버는 자기 코드만 찾으므로 두 도메인을 동시에 등록해 둘 수 있다.
 * 서버에서만 추가하고 싶으면 .env.production 에 NAVER_SITE_VERIFICATION 을 쉼표로 넣는다.
 */
const NAVER_CODES = [
  // hsweb.pics 용 (기존 등록분)
  "9e9ba54205fecadd9d81829473d63ad96fbf0fef",
  // haonlabs.com 용 (2026-10-29 등록분)
  "dcfa6b04f3d6d687d9c153f80127a2a5d3b006b0",
];

export const NAVER_SITE_VERIFICATION: string[] = [
  ...NAVER_CODES,
  ...(process.env.NAVER_SITE_VERIFICATION ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
];
