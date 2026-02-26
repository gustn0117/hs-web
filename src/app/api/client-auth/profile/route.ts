import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthenticatedClientId } from "@/lib/client-auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const clientId = await getAuthenticatedClientId();
  if (!clientId) {
    return NextResponse.json(
      { error: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { currentPassword, newUsername, newPassword } = body as {
    currentPassword: string;
    newUsername?: string;
    newPassword?: string;
  };

  if (!currentPassword) {
    return NextResponse.json(
      { error: "현재 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  if (!newUsername && !newPassword) {
    return NextResponse.json(
      { error: "변경할 항목을 입력해주세요." },
      { status: 400 }
    );
  }

  // Verify current password
  const { data: client, error: fetchError } = await supabase
    .from("clients")
    .select("id, username, password_hash")
    .eq("id", clientId)
    .single();

  if (fetchError || !client) {
    return NextResponse.json(
      { error: "계정 정보를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const match = await bcrypt.compare(currentPassword, client.password_hash);
  if (!match) {
    return NextResponse.json(
      { error: "현재 비밀번호가 올바르지 않습니다." },
      { status: 403 }
    );
  }

  // Build update object
  const updates: Record<string, string> = {};

  if (newUsername) {
    const trimmed = newUsername.trim();
    if (trimmed.length < 3) {
      return NextResponse.json(
        { error: "아이디는 3자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // Check uniqueness (only if changed)
    if (trimmed !== client.username) {
      const { data: existing } = await supabase
        .from("clients")
        .select("id")
        .eq("username", trimmed)
        .neq("id", clientId)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "이미 사용 중인 아이디입니다." },
          { status: 409 }
        );
      }
      updates.username = trimmed;
    }
  }

  if (newPassword) {
    if (newPassword.length < 4) {
      return NextResponse.json(
        { error: "비밀번호는 4자 이상이어야 합니다." },
        { status: 400 }
      );
    }
    updates.password_hash = await bcrypt.hash(newPassword, 10);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: true, message: "변경사항이 없습니다." });
  }

  const { error: updateError } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", clientId);

  if (updateError) {
    return NextResponse.json(
      { error: "업데이트에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "정보가 수정되었습니다.",
    updatedFields: Object.keys(updates).map((k) =>
      k === "password_hash" ? "password" : k
    ),
  });
}
