/**
 * 앱 안에서만 할 수 있는 일들.
 *
 * 같은 코드가 사파리에서도 돌기 때문에 전부 "앱이 아니면 아무것도 안 함"
 * 으로 빠져나간다. 그래서 웹에서 열어도 깨지지 않는다.
 */

import { Capacitor } from "@capacitor/core";

export function isNativeApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/**
 * 키보드가 오르내릴 때 body 에 표시를 붙인다.
 *
 * 아래 탭 바가 키보드 위에 떠서 입력칸을 가리는 걸 막으려는 것이다.
 * 숨기는 건 CSS 가 한다(portal.css). 정리 함수를 돌려준다.
 */
export async function watchKeyboard(): Promise<() => void> {
  if (!isNativeApp()) return () => {};
  try {
    const { Keyboard } = await import("@capacitor/keyboard");
    const on = await Keyboard.addListener("keyboardWillShow", () => {
      document.body.classList.add("keyboard-open");
    });
    const off = await Keyboard.addListener("keyboardWillHide", () => {
      document.body.classList.remove("keyboard-open");
    });
    return () => {
      void on.remove();
      void off.remove();
      document.body.classList.remove("keyboard-open");
    };
  } catch {
    return () => {};
  }
}

/**
 * 앱이 다시 앞으로 올 때 알려준다.
 *
 * 앱은 닫아도 메모리에 남아 있어서, 며칠 뒤에 열어도 그때 받아 둔 내용이
 * 그대로 보인다. 결제 상태가 바뀌었는데 옛 화면을 보고 있으면 안 되니
 * 돌아올 때마다 다시 받는다. 정리 함수를 돌려준다.
 */
export async function onAppResume(run: () => void): Promise<() => void> {
  if (!isNativeApp()) return () => {};
  try {
    const { App } = await import("@capacitor/app");
    const sub = await App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) run();
    });
    return () => void sub.remove();
  } catch {
    return () => {};
  }
}

/** 탭을 옮길 때 손끝에 주는 짧은 진동. 안 되면 그냥 넘어간다. */
export async function tapFeedback(): Promise<void> {
  if (!isNativeApp()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // 진동이 없는 기기이거나 꺼 둔 것뿐이다
  }
}

/** 시작 화면을 걷는다. 포털이 그려진 뒤에 부른다. */
export async function hideSplashScreen(): Promise<void> {
  if (!isNativeApp()) return;
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();
  } catch {
    // 못 숨겨도 설정해 둔 시간이 지나면 저절로 사라진다
  }
}

/**
 * 알림 허락을 받고 기기 토큰을 서버에 등록한다.
 *
 * 허락을 안 해 줘도 앱은 그대로 쓸 수 있어야 하니 조용히 넘어간다.
 * 돌려주는 값은 지금 알림을 받을 수 있는 상태인지다.
 */
export async function enablePushNotifications(): Promise<boolean> {
  if (!isNativeApp()) return false;

  const { PushNotifications } = await import("@capacitor/push-notifications");

  let status = await PushNotifications.checkPermissions();
  if (status.receive === "prompt" || status.receive === "prompt-with-rationale") {
    status = await PushNotifications.requestPermissions();
  }
  if (status.receive !== "granted") return false;

  // 토큰은 등록을 건 뒤 이벤트로 온다. 먼저 받을 준비를 하고 등록한다.
  await PushNotifications.addListener("registration", (token) => {
    void fetch("/api/client-auth/push-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.value, platform: Capacitor.getPlatform() }),
    });
  });

  await PushNotifications.addListener("registrationError", () => {
    // 등록이 안 되면 알림만 못 받는다. 쓰는 데는 지장이 없다.
  });

  await PushNotifications.register();
  return true;
}

/** 이 기기가 지문·Face ID 를 쓸 수 있는지. */
export async function canUseBiometrics(): Promise<boolean> {
  if (!isNativeApp()) return false;
  try {
    const { NativeBiometric } = await import("@capgo/capacitor-native-biometric");
    const result = await NativeBiometric.isAvailable();
    return result.isAvailable;
  } catch {
    return false;
  }
}

const BIOMETRIC_SERVER = "haonlabs.com";

/** 지문·Face ID 로 열 수 있게 아이디·비밀번호를 기기 금고에 넣어 둔다. */
export async function saveBiometricLogin(username: string, password: string): Promise<boolean> {
  if (!(await canUseBiometrics())) return false;
  try {
    const { NativeBiometric } = await import("@capgo/capacitor-native-biometric");
    await NativeBiometric.setCredentials({ username, password, server: BIOMETRIC_SERVER });
    return true;
  } catch {
    return false;
  }
}

/** 기기 금고에서 빼낸다. 로그아웃하거나 생체 로그인을 끌 때 부른다. */
export async function clearBiometricLogin(): Promise<void> {
  if (!isNativeApp()) return;
  try {
    const { NativeBiometric } = await import("@capgo/capacitor-native-biometric");
    await NativeBiometric.deleteCredentials({ server: BIOMETRIC_SERVER });
  } catch {
    // 애초에 없었으면 그만이다
  }
}

/**
 * 지문·Face ID 로 확인한 뒤 저장해 둔 아이디·비밀번호를 돌려준다.
 * 사람이 취소하거나 저장해 둔 게 없으면 null 이다.
 */
export async function loginWithBiometrics(): Promise<{ username: string; password: string } | null> {
  if (!(await canUseBiometrics())) return null;
  try {
    const { NativeBiometric } = await import("@capgo/capacitor-native-biometric");
    await NativeBiometric.verifyIdentity({
      reason: "고객센터에 로그인합니다",
      title: "하온 고객센터",
      subtitle: "",
      description: "",
    });
    const saved = await NativeBiometric.getCredentials({ server: BIOMETRIC_SERVER });
    if (!saved?.username || !saved?.password) return null;
    return { username: saved.username, password: saved.password };
  } catch {
    return null;
  }
}
