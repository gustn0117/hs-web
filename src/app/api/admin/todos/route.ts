import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** YYYY-MM-DD 형식만 통과시킨다 (or 필터 문자열에 그대로 들어가므로 필수). */
function asDate(value: string | null): string | null {
  return value && DATE_RE.test(value) ? value : null;
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = asDate(searchParams.get("from"));
  const to = asDate(searchParams.get("to"));
  const includeUnscheduled = searchParams.get("includeUnscheduled") === "1";

  let query = supabase.from("dashboard_todos").select("*");

  if (from && to) {
    query = includeUnscheduled
      ? query.or(`due_date.is.null,and(due_date.gte.${from},due_date.lte.${to})`)
      : query.gte("due_date", from).lte("due_date", to);
  }

  const { data, error } = await query
    .order("done", { ascending: true })
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ todos: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
  }

  const dueDate =
    typeof body.due_date === "string" ? asDate(body.due_date) : null;
  if (typeof body.due_date === "string" && !dueDate) {
    return NextResponse.json({ error: "날짜 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const { data: maxRow } = await supabase
    .from("dashboard_todos")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextPosition = (maxRow?.position ?? 0) + 1;

  const { data, error } = await supabase
    .from("dashboard_todos")
    .insert({
      text,
      memo: typeof body.memo === "string" ? body.memo : null,
      due_date: dueDate,
      position: nextPosition,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ todo: data });
}
