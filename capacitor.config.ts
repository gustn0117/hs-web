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
    // 웹뷰가 화면 끝까지 그린다. 시계와 홈 인디케이터는 CSS 의
    // env(safe-area-inset-*) 로 피한다 — portal.css 의 .appHeader 와
    // 아래 탭 바가 그 일을 한다.
    //
    // always 로 두면 웹뷰를 안전 영역 밖으로 한 번 밀어내는데, CSS 가 그걸
    // 모르고 또 밀어서 아래쪽 여백이 두 배(68pt)가 된다. 시뮬레이터에서
    // 재 보고 never 로 바꿨다.
    contentInset: "never",
    // 위 설정이면 웹뷰가 화면을 다 덮어서 이 색은 거의 안 보인다.
    // 당겨서 튕길 때만 잠깐 드러난다.
    backgroundColor: "#ffffffff",
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
      // 시작 화면 그림이 검정 바탕이라 여기도 맞춘다. 안 맞추면 그림이
      // 뜨기 전에 흰 화면이 한 번 번쩍인다.
      backgroundColor: "#000000ff",
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
