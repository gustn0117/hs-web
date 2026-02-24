import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateClientToken, CLIENT_COOKIE_NAME } from "@/lib/client-auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "아이디와 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !client) {
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  if (!client.is_active) {
    return NextResponse.json(
      { error: "비활성화된 계정입니다. 관리자에게 문의하세요." },
      { status: 403 }
    );
  }

  const match = await bcrypt.compare(password, client.password_hash);
  if (!match) {
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const token = generateClientToken(client.id);
  const response = NextResponse.json({ success: true, name: client.name });

  response.cookies.set(CLIENT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return response;
}
