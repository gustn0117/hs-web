"use client";

import { useEffect } from "react";
import { enablePushNotifications, hideSplashScreen, isNativeApp } from "@/lib/native";

/**
 * 앱으로 열렸을 때만 하는 준비.
 *
 * 알림 허락을 받고 기기 토큰을 등록한다. 사파리로 열면 아무 일도 하지 않는다.
 */
export default function NativeBridge({ onNative }: { onNative?: () => void }) {
  useEffect(() => {
    if (!isNativeApp()) return;
    onNative?.();

    // 화면이 그려졌으니 시작 화면을 걷는다.
    void hideSplashScreen();

    // 알림 허락은 조금 뒤에 묻는다. 열자마자 허락 창이 뜨면 대부분 거절한다.
    const id = setTimeout(() => {
      void enablePushNotifications();
    }, 2500);

    return () => clearTimeout(id);
  }, [onNative]);

  return null;
}
