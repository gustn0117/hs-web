import { cookies } from "next/headers";
import crypto from "crypto";

const CLIENT_AUTH_SECRET = process.env.CLIENT_AUTH_SECRET || "hs-web-client-secret-key-2024";
const CLIENT_COOKIE_NAME = "hs-client-token";

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
  if (isNaN(age) || age > 24 * 60 * 60 * 1000) return { valid: false };

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
