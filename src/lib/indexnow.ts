/**
 * IndexNow — 페이지가 새로 생기거나 바뀌면 검색엔진에 바로 알린다.
 * 네이버는 2023년 7월부터 지원하며, 같은 요청이 빙에도 전달된다.
 * 구글은 IndexNow를 지원하지 않아 사이트맵 방식을 그대로 쓴다.
 *
 * 소유권 증명: https://hsweb.pics/${INDEXNOW_KEY}.txt 에 키와 같은 값이 들어 있어야 한다.
 */

export const SITE_URL = "https://hsweb.pics";
export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "a4bf141d931bbc0c3ccf2f27200b6601";

const ENDPOINTS = [
  "https://searchadvisor.naver.com/indexnow",
  "https://api.indexnow.org/indexnow",
];

export interface IndexNowResult {
  endpoint: string;
  status: number | string;
  ok: boolean;
}

/** 최대 10,000개까지 한 번에 보낼 수 있다. */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult[]> {
  const urlList = [...new Set(urls)].filter((u) => u.startsWith(SITE_URL)).slice(0, 10000);
  if (urlList.length === 0) return [];

  const body = JSON.stringify({
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  });

  return Promise.all(
    ENDPOINTS.map(async (endpoint) => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body,
          signal: AbortSignal.timeout(10000),
        });
        // 200 성공, 202 접수됨(검증 대기)
        return { endpoint, status: res.status, ok: res.status === 200 || res.status === 202 };
      } catch (e) {
        return { endpoint, status: e instanceof Error ? e.name : "error", ok: false };
      }
    })
  );
}

/** 포트폴리오 한 건이 바뀌었을 때 알릴 주소들 */
export function portfolioUrls(seq?: number): string[] {
  const urls = [`${SITE_URL}/portfolio`];
  if (seq && seq > 0) urls.push(`${SITE_URL}/portfolio/${seq}`);
  return urls;
}
