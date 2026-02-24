import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { sanitizeForDb } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; hid: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { hid } = await params;

  const { data, error } = await supabase
    .from("hosting")
    .select("*")
    .eq("id", hid)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ hosting: data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; hid: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { hid } = await params;
  const body = await request.json();

  const { error: updateError } = await supabase
    .from("hosting")
    .update(sanitizeForDb(body))
    .eq("id", hid);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { data } = await supabase
    .from("hosting")
    .select("*")
    .eq("id", hid)
    .single();

  return NextResponse.json({ hosting: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; hid: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { hid } = await params;

  const { error } = await supabase
    .from("hosting")
    .delete()
    .eq("id", hid);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
