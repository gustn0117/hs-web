import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("clients")
    .select(
      "id, username, name, email, phone, memo, is_active, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ clients: data });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const { username, password, name, email, phone, memo } = body;

  if (!username || !password || !name) {
    return NextResponse.json(
      { error: "username, password, name은 필수입니다." },
      { status: 400 }
    );
  }

  let password_hash: string;
  try {
    password_hash = await bcrypt.hash(password, 12);
  } catch (err) {
    console.error("bcrypt hash error:", err);
    return NextResponse.json(
      { error: "비밀번호 해싱에 실패했습니다." },
      { status: 500 }
    );
  }

  const { error: insertError } = await supabase.from("clients").insert({
    username,
    password_hash,
    name,
    email: email || null,
    phone: phone || null,
    memo: memo || null,
  });

  if (insertError) {
    console.error("Supabase insert error:", JSON.stringify(insertError));
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { data, error: selectError } = await supabase
    .from("clients")
    .select(
      "id, username, name, email, phone, memo, is_active, created_at, updated_at"
    )
    .eq("username", username)
    .single();

  if (selectError) {
    console.error("Supabase select error:", JSON.stringify(selectError));
    return NextResponse.json({ client: { username, name } }, { status: 201 });
  }

  return NextResponse.json({ client: data }, { status: 201 });
}
