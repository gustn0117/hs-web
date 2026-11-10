import crypto from "crypto";
import { supabase } from "@/lib/supabase";

/**
 * 고객 휴대폰으로 알림 보내기 (애플 APNs).
 *
 * 애플은 JWT 로 신원을 확인한다. 개발자 계정에서 받은 키 파일(.p8)과 키 ID,
 * 팀 ID 가 있어야 한다. 셋 중 하나라도 없으면 조용히 아무것도 안 보낸다 —
 * 알림이 안 간다고 결제나 신청 처리가 막히면 안 되기 때문이다.
 *
 * 필요한 환경변수 (.env.production):
 *   APNS_KEY_ID      개발자 계정 > Keys 에서 만든 키의 ID
 *   APNS_TEAM_ID     개발자 계정 오른쪽 위에 보이는 10자리
 *   APNS_PRIVATE_KEY .p8 파일 내용 전체 (줄바꿈은 \n 으로)
 *   APNS_BUNDLE_ID   기본값 com.haonlabs.customer
 *   APNS_PRODUCTION  운영이면 true, 테스트 빌드면 비워 둔다
 */

const BUNDLE_ID = process.env.APNS_BUNDLE_ID || "com.haonlabs.customer";

function apnsHost() {
  return process.env.APNS_PRODUCTION === "true"
    ? "https://api.push.apple.com"
    : "https://api.sandbox.push.apple.com";
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/** 애플에 보낼 신분증. 한 시간까지 쓸 수 있어서 그 안에는 다시 만들지 않는다. */
let cachedToken: { value: string; madeAt: number } | null = null;

function apnsAuthToken(): string | null {
  const keyId = process.env.APNS_KEY_ID;
  const teamId = process.env.APNS_TEAM_ID;
  const privateKey = process.env.APNS_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!keyId || !teamId || !privateKey) return null;

  // 애플은 한 시간 넘은 토큰을 거절한다. 55분에 새로 만든다.
  if (cachedToken && Date.now() - cachedToken.madeAt < 55 * 60 * 1000) {
    return cachedToken.value;
  }

  const header = base64url(JSON.stringify({ alg: "ES256", kid: keyId }));
  const claims = base64url(JSON.stringify({ iss: teamId, iat: Math.floor(Date.now() / 1000) }));
  const signer = crypto.createSign("SHA256");
  signer.update(`${header}.${claims}`);
  const signature = base64url(signer.sign({ key: privateKey, dsaEncoding: "ieee-p1363" }));

  const value = `${header}.${claims}.${signature}`;
  cachedToken = { value, madeAt: Date.now() };
  return value;
}

export interface PushMessage {
  title: string;
  body: string;
  /** 누르면 열릴 포털 안쪽 주소. 비우면 그냥 앱이 열린다. */
  path?: string;
}

/**
 * 한 고객이 가진 기기 모두에 보낸다.
 *
 * 보낸 결과는 돌려주되, 실패해도 예외를 던지지 않는다. 부르는 쪽(결제 확인,
 * 신청 처리)이 알림 때문에 멈추면 안 된다.
 */
export async function sendToClient(clientId: string, message: PushMessage) {
  const auth = apnsAuthToken();
  if (!auth) return { sent: 0, skipped: "애플 키가 설정되지 않음" };

  const { data: devices } = await supabase
    .from("device_tokens")
    .select("token")
    .eq("client_id", clientId)
    .eq("platform", "ios");

  if (!devices?.length) return { sent: 0, skipped: "등록된 기기 없음" };

  const payload = JSON.stringify({
    aps: {
      alert: { title: message.title, body: message.body },
      sound: "default",
    },
    path: message.path ?? "/client/dashboard",
  });

  let sent = 0;
  const dead: string[] = [];

  await Promise.all(
    devices.map(async (device) => {
      try {
        const res = await fetch(`${apnsHost()}/3/device/${device.token}`, {
          method: "POST",
          headers: {
            authorization: `bearer ${auth}`,
            "apns-topic": BUNDLE_ID,
            "apns-push-type": "alert",
            "apns-priority": "10",
            "content-type": "application/json",
          },
          body: payload,
        });
        if (res.ok) {
          sent += 1;
        } else if (res.status === 410 || res.status === 400) {
          // 앱을 지웠거나 토큰이 더 이상 쓸모없다는 뜻이다. 치운다.
          dead.push(device.token);
        }
      } catch {
        // 네트워크가 흔들린 것뿐일 수 있으니 토큰은 그대로 둔다
      }
    })
  );

  if (dead.length) {
    await supabase.from("device_tokens").delete().in("token", dead);
  }

  return { sent, removed: dead.length };
}
