import { cookies } from "next/headers";
import crypto from "crypto";

const CLIENT_AUTH_SECRET = process.env.CLIENT_AUTH_SECRET || "hs-web-client-secret-key-2024";
const CLIENT_COOKIE_NAME = "hs-client-token";

/**
 * 고객 포털 로그인이 유지되는 기간.
 *
 * 포털은 고객이 홈 화면에 깔아 두고 쓰는 앱이다. 하루마다 로그인이 풀리면
 * 아이디·비밀번호를 기억하는 사람이 없어서 결국 카톡으로 돌아간다. 그래서
 * 길게 두고, 열 때마다 다시 30일로 늘려 준다(/api/client-auth/me).
 */
export const CLIENT_SESSION_MS = 30 * 24 * 60 * 60 * 1000;
export const CLIENT_SESSION_SECONDS = CLIENT_SESSION_MS / 1000;

/** 로그인 쿠키를 심을 때 쓰는 공통 설정. 여러 곳에서 똑같이 써야 한다. */
export const clientCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: CLIENT_SESSION_SECONDS,
  path: "/",
} as const;

export function generateClientToken(clientId: string): string {
  const timestamp = Date.now().toString();
  const payload = `${clientId}:${timestamp}`;
  const hmac = crypto.createHmac("sha256", CLIENT_AUTH_SECRET);
  hmac.update(payload);
  const hash = hmac.digest("hex");
  return `${payload}.${hash}`;
}

export function verifyClientToken(token: string): { valid: boolean; clientId?: string } {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return { valid: false };

  const payload = token.substring(0, lastDot);
  const hash = token.substring(lastDot + 1);

  const parts = payload.split(":");
  if (parts.length !== 2) return { valid: false };

  const [clientId, timestamp] = parts;

  const age = Date.now() - parseInt(timestamp, 10);
  if (isNaN(age) || age > CLIENT_SESSION_MS) return { valid: false };

  const hmac = crypto.createHmac("sha256", CLIENT_AUTH_SECRET);
  hmac.update(payload);
  const expectedHash = hmac.digest("hex");

  try {
    const valid = crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
    return valid ? { valid: true, clientId } : { valid: false };
  } catch {
    return { valid: false };
  }
}

export async function getAuthenticatedClientId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_COOKIE_NAME)?.value;
  if (!token) return null;
  const result = verifyClientToken(token);
  return result.valid ? result.clientId! : null;
}

export { CLIENT_COOKIE_NAME };
