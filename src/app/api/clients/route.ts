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

  const password_hash = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from("clients")
    .insert({
      username,
      password_hash,
      name,
      email: email || null,
      phone: phone || null,
      memo: memo || null,
    })
    .select(
      "id, username, name, email, phone, memo, is_active, created_at, updated_at"
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ client: data }, { status: 201 });
}
