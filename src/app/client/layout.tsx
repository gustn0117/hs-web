import type { Metadata, Viewport } from "next";
import InstallPrompt from "@/components/client/InstallPrompt";
import PwaSetup from "@/components/client/PwaSetup";
import "./portal.css";

/**
 * 고객센터는 회사 홈페이지와 다른 앱으로 취급한다.
 *
 * manifest 를 따로 두는 게 핵심이다. 회사 홈페이지 manifest 를 쓰면 고객이
 * 홈 화면에 추가해도 회사 소개가 열린다. 이쪽은 들어가면 바로 자기 현황이
 * 보여야 한다.
 */
export const metadata: Metadata = {
  title: "고객센터 | 하온",
  robots: { index: false, follow: false },
  manifest: "/client-manifest.json",
  // 루트에 깔린 회사 홈페이지용 값들을 고객센터 것으로 덮는다.
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "하온 고객센터",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // 노치 있는 화면에서도 끝까지 쓰고, 안전 영역은 CSS 로 피한다.
  viewportFit: "cover",
  // 머리띠가 흰색이라 상태바도 흰색이어야 이어져 보인다.
  themeColor: "#ffffff",
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="portal">
      <InstallPrompt />
      {children}
      <PwaSetup />
    </div>
  );
}
