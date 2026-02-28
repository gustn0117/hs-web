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
      "id, username, name, email, phone, memo, is_active, created_at, updated_at, projects(id, name, status)"
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

  if (!name) {
    return NextResponse.json(
      { error: "이름은 필수입니다." },
      { status: 400 }
    );
  }

  const insertData: Record<string, unknown> = {
    name,
    email: email || null,
    phone: phone || null,
    memo: memo || null,
  };

  if (username && password) {
    try {
      insertData.username = username;
      insertData.password_hash = await bcrypt.hash(password, 12);
    } catch (err) {
      console.error("bcrypt hash error:", err);
      return NextResponse.json(
        { error: "비밀번호 해싱에 실패했습니다." },
        { status: 500 }
      );
    }
  }

  const { data, error: insertError } = await supabase
    .from("clients")
    .insert(insertData)
    .select("id, username, name, email, phone, memo, is_active, created_at, updated_at")
    .single();

  if (insertError) {
    console.error("Supabase insert error:", JSON.stringify(insertError));
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ client: data }, { status: 201 });
}
