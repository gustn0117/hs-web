/*
 * 고객센터 앱의 서비스 워커.
 *
 * 두 가지만 한다. 껍데기(아이콘·정적 파일)를 캐시해서 두 번째 열 때
 * 빠르게 뜨게 하고, 연결이 끊기면 안내 화면을 내보낸다.
 *
 * /api/ 는 절대 캐시하지 않는다. 로그인 정보와 결제 내역이 지나는 길이라,
 * 캐시가 남으면 다른 사람 휴대폰에서 지난 자료가 보일 수 있다.
 */

const VERSION = "haon-client-v1";
const SHELL = `${VERSION}-shell`;
const PAGES = `${VERSION}-pages`;
const OFFLINE = "/client-offline.html";

const SHELL_FILES = [
  OFFLINE,
  "/client-manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // 화면 이동: 먼저 서버에 물어보고, 안 되면 마지막으로 본 화면, 그것도
  // 없으면 안내 화면을 준다.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGES).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match(OFFLINE);
        })
    );
    return;
  }

  // 정적 파일은 이름에 해시가 붙어 있어 내용이 바뀌면 이름도 바뀐다.
  // 그래서 캐시에 있으면 그대로 써도 된다.
  if (url.pathname.startsWith("/_next/static/") || SHELL_FILES.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(SHELL).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
  }
});
