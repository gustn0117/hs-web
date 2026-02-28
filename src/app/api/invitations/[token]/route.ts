import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: "토큰이 필요합니다." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("invitations")
    .select("id, client_id, token, expires_at, used_at, clients(name)")
    .eq("token", token)
    .single();

  if (error || !data) {
    return NextResponse.json({ valid: false, error: "유효하지 않은 초대 링크입니다." }, { status: 404 });
  }

  if (data.used_at) {
    return NextResponse.json({ valid: false, error: "이미 사용된 초대 링크입니다." }, { status: 400 });
  }

  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: "만료된 초대 링크입니다." }, { status: 400 });
  }

  const clients = data.clients as unknown as { name: string } | null;
  const clientName = clients?.name || "";

  return NextResponse.json({
    valid: true,
    clientName,
  });
}
