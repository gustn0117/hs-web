import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthenticatedClientId, CLIENT_COOKIE_NAME } from "@/lib/client-auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

/**
 * 앱 안에서 계정을 지운다.
 *
 * 앱스토어는 계정을 만들 수 있는 앱이면 앱 안에서 지울 길도 있어야 한다고
 * 못박아 두었다(심사 지침 5.1.1(v)). 그래서 고객이 직접 누를 수 있게 둔다.
 *
 * 다만 계약·결제 기록은 전자상거래법상 5년을 보관해야 해서 그 자리에서
 * 통째로 지울 수 없다. 그래서 이렇게 한다 — 접속은 즉시 막고, 이름·전화·
 * 메일 같은 개인 연락처는 지우고, 거래 기록만 보존 기간까지 남긴다.
 * 고객에게도 화면에서 그대로 알린다.
 */
export async function DELETE(request: Request) {
  const clientId = await getAuthenticatedClientId();
  if (!clientId) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { password } = await request.json();

  if (typeof password !== "string" || !password) {
    return NextResponse.json({ error: "비밀번호를 입력해주세요." }, { status: 400 });
  }

  const { data: client } = await supabase
    .from("clients")
    .select("id, password_hash, deletion_requested_at")
    .eq("id", clientId)
    .single();

  if (!client) {
    return NextResponse.json({ error: "계정을 찾을 수 없습니다." }, { status: 404 });
  }

  if (!(await bcrypt.compare(password, client.password_hash))) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const now = new Date().toISOString();

  // 비밀번호 자리는 아무 비밀번호로도 열리지 않는 값으로 덮는다. 빈칸으로
  // 두면 bcrypt.compare 가 어떻게 도는지에 기대게 되어 위험하다.
  const { error } = await supabase
    .from("clients")
    .update({
      is_active: false,
      deletion_requested_at: now,
      password_hash: await bcrypt.hash(`deleted:${clientId}:${now}`, 10),
      email: null,
      phone: null,
      updated_at: now,
    })
    .eq("id", clientId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 이 계정으로 가던 알림도 함께 끊는다.
  await supabase.from("device_tokens").delete().eq("client_id", clientId);

  const response = NextResponse.json({ success: true });
  response.cookies.set(CLIENT_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return response;
}
