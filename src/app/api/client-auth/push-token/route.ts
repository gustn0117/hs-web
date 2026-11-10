import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthenticatedClientId } from "@/lib/client-auth";

export const dynamic = "force-dynamic";

/**
 * 앱이 받아 온 기기 토큰을 등록한다.
 *
 * 앱을 열 때마다 부른다. 애플이 토큰을 바꿔 주기도 하고, 기기를 바꾸면
 * 새 토큰이 나오기 때문이다. 같은 토큰이면 본 시각만 새로 적는다.
 */
export async function POST(request: Request) {
  const clientId = await getAuthenticatedClientId();
  if (!clientId) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { token, platform, app_version } = await request.json();

  if (typeof token !== "string" || token.trim().length < 16) {
    return NextResponse.json({ error: "기기 토큰이 올바르지 않습니다." }, { status: 400 });
  }

  const { error } = await supabase.from("device_tokens").upsert(
    {
      client_id: clientId,
      token: token.trim(),
      platform: platform === "android" ? "android" : "ios",
      app_version: typeof app_version === "string" ? app_version.slice(0, 32) : null,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "token" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

/** 로그아웃하거나 알림을 끄면 이 기기로는 더 보내지 않는다. */
export async function DELETE(request: Request) {
  const clientId = await getAuthenticatedClientId();
  if (!clientId) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { token } = await request.json();
  if (typeof token !== "string" || !token.trim()) {
    return NextResponse.json({ error: "기기 토큰이 없습니다." }, { status: 400 });
  }

  const { error } = await supabase
    .from("device_tokens")
    .delete()
    .eq("client_id", clientId)
    .eq("token", token.trim());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
