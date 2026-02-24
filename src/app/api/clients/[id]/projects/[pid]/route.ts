import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { sanitizeForDb } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pid: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { pid } = await params;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", pid)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pid: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { pid } = await params;
  const body = await request.json();

  const { error: updateError } = await supabase
    .from("projects")
    .update(sanitizeForDb(body))
    .eq("id", pid);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", pid)
    .single();

  return NextResponse.json({ project: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pid: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { pid } = await params;

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", pid);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
