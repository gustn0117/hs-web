import Script from "next/script";

/**
 * 하람 마케팅 자체 방문 추적.
 *
 * 발급받은 태그를 그대로 쓴다. 수집기가 첫 방문과 경로 이동, 보이는 탭의
 * heartbeat를 스스로 처리하므로 여기서 페이지뷰를 따로 부르지 않는다.
 *
 * 공개 페이지 틀에만 넣는다. 관리자·고객 포털·계약·가입 구역은 주소에
 * 토큰이 담길 수 있어 싣지 않는다.
 */
export default function HaramAnalytics() {
  return (
    <Script
      id="haram-analytics"
      strategy="afterInteractive"
      src="https://haram-analytics.hsweb.pics/tracker.js"
      data-site="oGqTfZvjNmPELotvPqEWSXdq"
      referrerPolicy="no-referrer"
    />
  );
}
