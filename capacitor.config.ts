import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";

/**
 * 고객센터 iOS 앱.
 *
 * 포털은 서버에서 그려 내려오고 API 를 쓰기 때문에 정적 파일로 묶어 앱에
 * 넣을 수가 없다. 그래서 앱은 실제 주소를 띄우고, 웹으로 못 하는 일(알림,
 * 지문·Face ID, 상태바)만 네이티브로 처리한다.
 *
 * app-shell/ 은 주소를 못 불러올 때 보여줄 화면이다.
 */
const config: CapacitorConfig = {
  appId: "com.haonlabs.customer",
  appName: "하온 고객센터",
  webDir: "app-shell",
  ios: {
    // 상태바(시계·배터리) 아래부터 그리게 한다. never 로 두면 맨 위 내용이
    // 시계에 가린다.
    contentInset: "always",
    backgroundColor: "#0a2a5eff",
  },
  server: {
    url: "https://haonlabs.com/client/dashboard",
    // 우리 도메인 밖으로는 앱 안에서 못 넘어가게 한다. 밖으로 나가는 링크는
    // 사파리로 열린다.
    allowNavigation: ["haonlabs.com", "www.haonlabs.com"],
  },
  plugins: {
    SplashScreen: {
      // 아래 NativeBridge 가 화면이 준비되면 직접 숨긴다. 그래도 그 코드가
      // 안 돌 수가 있으니(자바스크립트 오류, 연결 끊김) 시간이 지나면
      // 저절로 사라지게 둔다 — 안 그러면 시작 화면에서 영영 멈춘다.
      launchAutoHide: true,
      launchShowDuration: 3000,
      backgroundColor: "#0a2a5eff",
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Keyboard: {
      // 키보드가 뜨면 화면(웹뷰)을 그만큼 줄인다. body 만 줄이면 아래
      // 탭 바처럼 화면에 고정된 것이 키보드 뒤로 숨는다.
      resize: KeyboardResize.Native,
    },
  },
};

export default config;
