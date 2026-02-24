import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { sanitizeForDb } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pmid: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { pmid } = await params;

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("id", pmid)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ payment: data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pmid: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { pmid } = await params;
  const body = await request.json();

  const { error: updateError } = await supabase
    .from("payments")
    .update(sanitizeForDb(body))
    .eq("id", pmid);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("id", pmid)
    .single();

  return NextResponse.json({ payment: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pmid: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { pmid } = await params;

  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", pmid);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
