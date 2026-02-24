import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; did: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { did } = await params;

  const { data, error } = await supabase
    .from("domains")
    .select("*")
    .eq("id", did)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ domain: data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; did: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { did } = await params;
  const body = await request.json();

  const { data, error } = await supabase
    .from("domains")
    .update(body)
    .eq("id", did)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ domain: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; did: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { did } = await params;

  const { error } = await supabase
    .from("domains")
    .delete()
    .eq("id", did);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
