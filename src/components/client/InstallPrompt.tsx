"use client";

import { useEffect, useState } from "react";
import { isNativeApp } from "@/lib/native";

type InstallEvent = Event & { prompt: () => Promise<void> };

const DISMISS_KEY = "haon-client-install-dismissed";

function remember() {
  try {
    localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // 저장이 막힌 브라우저면 다음에 또 보이는 것뿐이다
  }
}

/**
 * 「홈 화면에 추가」 안내.
 *
 * 안드로이드·크롬은 브라우저가 설치 창을 띄워 주니 버튼 하나만 둔다.
 * 아이폰 사파리는 그런 창이 없어서 공유 버튼을 누르라고 알려 줘야 한다.
 * 이미 깔아서 열었거나 한 번 닫은 사람에게는 다시 보이지 않는다.
 */
export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [iosGuide, setIosGuide] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      if (isNativeApp()) return;
      e.preventDefault();
      setInstallEvent(e as InstallEvent);
      setHidden(false);
    };
    const onInstalled = () => setHidden(true);

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // 그리기가 끝난 뒤에 살펴본다. 바로 상태를 바꾸면 한 번 더 그리게 된다.
    const check = setTimeout(() => {
      // 앱으로 열었으면 이미 깔려 있는 것이다.
      const standalone =
        isNativeApp() ||
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

      let dismissed = false;
      try {
        dismissed = localStorage.getItem(DISMISS_KEY) === "1";
      } catch {
        // 못 읽으면 안 닫은 것으로 본다
      }

      if (standalone || dismissed) return;

      if (/iphone|ipad|ipod/i.test(window.navigator.userAgent)) {
        setIosGuide(true);
        setHidden(false);
      }
    }, 0);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      clearTimeout(check);
    };
  }, []);

  if (hidden) return null;

  const close = () => {
    remember();
    setHidden(true);
  };

  const install = async () => {
    if (!installEvent) return;
    remember();
    setHidden(true);
    await installEvent.prompt();
  };

  return (
    <div className="bg-[#0a2a5e] text-white">
      <div className="max-w-[560px] mx-auto flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold tracking-[-0.02em]">
            휴대폰에 고객센터를 깔아두세요
          </p>
          <p className="mt-0.5 text-[12.5px] leading-[1.6] text-white/70">
            {iosGuide
              ? "아래 공유 버튼을 누르고 「홈 화면에 추가」를 고르세요."
              : "아이콘을 눌러 바로 열 수 있습니다."}
          </p>
        </div>

        {installEvent && (
          <button
            type="button"
            onClick={install}
            className="shrink-0 min-h-[40px] px-4 rounded-lg border-0 bg-white text-[#0a2a5e] text-[13px] font-extrabold cursor-pointer"
          >
            추가
          </button>
        )}

        <button
          type="button"
          onClick={close}
          aria-label="안내 닫기"
          className="shrink-0 grid place-items-center w-10 h-10 rounded-lg border-0 bg-transparent text-white/60 cursor-pointer hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
