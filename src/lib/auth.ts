import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_PASSWORD = "1234";
const AUTH_SECRET = "hs-web-admin-secret-key-2024";
const AUTH_COOKIE_NAME = "hs-admin-token";

export function generateToken(): string {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac("sha256", AUTH_SECRET);
  hmac.update(timestamp);
  const hash = hmac.digest("hex");
  return `${timestamp}.${hash}`;
}

export function verifyToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestamp, hash] = parts;

  // Token expires after 24 hours
  const age = Date.now() - parseInt(timestamp, 10);
  if (isNaN(age) || age > 24 * 60 * 60 * 1000) return false;

  const hmac = crypto.createHmac("sha256", AUTH_SECRET);
  hmac.update(timestamp);
  const expectedHash = hmac.digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
}

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export { AUTH_COOKIE_NAME };
