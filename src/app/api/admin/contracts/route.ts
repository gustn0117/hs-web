import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ contracts: data });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  // 6자리 인증 코드 생성
  const signToken = String(Math.floor(100000 + Math.random() * 900000));

  const d = new Date();
  const contractNumber = `CT-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 900) + 100)}`;

  const { data, error } = await supabase
    .from("contracts")
    .insert({
      contract_number: contractNumber,
      quotation_id: body.quotation_id || null,
      client_name: body.client_name,
      client_company: body.client_company || null,
      client_phone: body.client_phone || null,
      client_email: body.client_email || null,
      project_name: body.project_name,
      project_scope: body.project_scope || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      total_amount: body.total_amount,
      payment_terms: body.payment_terms || [],
      terms: body.terms,
      items: body.items || [],
      specs: body.specs || [],
      sign_token: signToken,
      status: "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ contract: data });
}
