import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from("clients")
    .select(
      "id, username, name, email, phone, memo, is_active, created_at, updated_at"
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "클라이언트를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json({ client: data });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { password, name, email, phone, memo, is_active } = body;

  const updateData: Record<string, unknown> = {};

  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (memo !== undefined) updateData.memo = memo;
  if (is_active !== undefined) updateData.is_active = is_active;

  if (password && password.length > 0) {
    updateData.password_hash = await bcrypt.hash(password, 12);
  }

  const { error: updateError } = await supabase
    .from("clients")
    .update(updateData)
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { data, error: selectError } = await supabase
    .from("clients")
    .select(
      "id, username, name, email, phone, memo, is_active, created_at, updated_at"
    )
    .eq("id", id)
    .single();

  if (selectError) {
    return NextResponse.json(
      { error: "클라이언트를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json({ client: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
