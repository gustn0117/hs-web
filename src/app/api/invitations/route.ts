import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const client_id = searchParams.get("client_id");

  if (!client_id) {
    return NextResponse.json({ error: "client_id는 필수입니다." }, { status: 400 });
  }

  const { data } = await supabase
    .from("invitations")
    .select("id, token, expires_at, created_at, used_at")
    .eq("client_id", client_id)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ invitation: null });
  }

  return NextResponse.json({
    invitation: data,
    url: `https://hsweb.pics/register/${data.token}`,
    expires_at: data.expires_at,
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const { client_id } = body;

  if (!client_id) {
    return NextResponse.json({ error: "client_id는 필수입니다." }, { status: 400 });
  }

  // Check client exists
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, name, username")
    .eq("id", client_id)
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "클라이언트를 찾을 수 없습니다." }, { status: 404 });
  }

  // If client already has username, they're already registered
  if (client.username) {
    return NextResponse.json({ error: "이미 등록된 클라이언트입니다." }, { status: 400 });
  }

  // Delete existing unused invitations for this client
  await supabase
    .from("invitations")
    .delete()
    .eq("client_id", client_id)
    .is("used_at", null);

  // Generate new token
  const token = crypto.randomBytes(32).toString("hex");
  const expires_at = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("invitations")
    .insert({ client_id, token, expires_at })
    .select("id, token, expires_at, created_at")
    .single();

  if (error) {
    console.error("Invitation insert error:", JSON.stringify(error));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const url = `https://hsweb.pics/register/${token}`;

  return NextResponse.json({
    invitation: data,
    url,
    expires_at: data.expires_at,
  }, { status: 201 });
}
