import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("quotations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ quotations: data });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("quotations")
    .insert({
      quote_number: body.quote_number,
      quote_date: body.quote_date,
      manager: body.manager,
      validity: body.validity,
      include_vat: body.include_vat,
      items: body.items,
      specs: body.specs,
      notes: body.notes,
      subtotal: body.subtotal,
      vat: body.vat,
      total: body.total,
      status: body.status || "issued",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ quotation: data });
}
