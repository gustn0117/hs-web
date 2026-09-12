import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.text === "string") update.text = body.text;
  if (typeof body.done === "boolean") update.done = body.done;
  if ("memo" in body) update.memo = body.memo;
  if (typeof body.position === "number") update.position = body.position;
  if ("due_date" in body) {
    const raw = body.due_date;
    if (raw === null) {
      update.due_date = null;
    } else if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      update.due_date = raw;
    } else {
      return NextResponse.json(
        { error: "날짜 형식이 올바르지 않습니다." },
        { status: 400 }
      );
    }
  }

  const { data, error } = await supabase
    .from("dashboard_todos")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ todo: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabase
    .from("dashboard_todos")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
