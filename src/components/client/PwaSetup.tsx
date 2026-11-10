"use client";

import { useEffect } from "react";

/**
 * 고객센터를 앱처럼 쓰게 해 주는 서비스 워커를 등록한다.
 *
 * 등록이 실패해도 아무 일 없다 — 평소처럼 웹으로 열린다. 그래서 막지 않고
 * 조용히 넘긴다.
 */
export default function PwaSetup() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // 첫 화면이 다 뜬 뒤에 등록한다. 등록이 초기 로딩과 네트워크를
    // 다투지 않게 하려는 것이다.
    const id = setTimeout(() => {
      navigator.serviceWorker.register("/client-sw.js", { scope: "/client/" }).catch(() => {});
    }, 1200);

    return () => clearTimeout(id);
  }, []);

  return null;
}
