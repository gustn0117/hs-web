import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const { token, username, password, email, phone } = body;

  if (!token || !username || !password) {
    return NextResponse.json(
      { error: "토큰, 아이디, 비밀번호는 필수입니다." },
      { status: 400 }
    );
  }

  if (username.length < 3) {
    return NextResponse.json(
      { error: "아이디는 3자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "비밀번호는 6자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  // Validate token
  const { data: invitation, error: invError } = await supabase
    .from("invitations")
    .select("id, client_id, expires_at, used_at")
    .eq("token", token)
    .single();

  if (invError || !invitation) {
    return NextResponse.json({ error: "유효하지 않은 초대 링크입니다." }, { status: 404 });
  }

  if (invitation.used_at) {
    return NextResponse.json({ error: "이미 사용된 초대 링크입니다." }, { status: 400 });
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return NextResponse.json({ error: "만료된 초대 링크입니다." }, { status: 400 });
  }

  // Check username uniqueness
  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .eq("username", username)
    .single();

  if (existing) {
    return NextResponse.json({ error: "이미 사용 중인 아이디입니다." }, { status: 400 });
  }

  // Hash password
  let password_hash: string;
  try {
    password_hash = await bcrypt.hash(password, 12);
  } catch (err) {
    console.error("bcrypt hash error:", err);
    return NextResponse.json({ error: "비밀번호 처리 중 오류가 발생했습니다." }, { status: 500 });
  }

  // Update client
  const updateData: Record<string, unknown> = {
    username,
    password_hash,
  };
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;

  const { error: updateError } = await supabase
    .from("clients")
    .update(updateData)
    .eq("id", invitation.client_id);

  if (updateError) {
    console.error("Client update error:", JSON.stringify(updateError));
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Mark invitation as used
  await supabase
    .from("invitations")
    .update({ used_at: new Date().toISOString() })
    .eq("id", invitation.id);

  return NextResponse.json({ success: true });
}
