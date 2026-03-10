import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, type, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "이름과 연락처는 필수입니다." }, { status: 400 });
    }

    const { error } = await supabase.from("inquiries").insert({
      name,
      phone,
      email: email || null,
      type: type || null,
      message: message || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inquiries: data });
}
