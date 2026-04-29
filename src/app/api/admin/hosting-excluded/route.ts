import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const [projectsRes, clientsRes] = await Promise.all([
    supabase
      .from("projects")
      .select(
        "id, client_id, name, status, hosting_excluded, hosting_excluded_reason, hosting_excluded_at"
      )
      .eq("hosting_excluded", true)
      .order("hosting_excluded_at", { ascending: false }),
    supabase.from("clients").select("id, name"),
  ]);

  if (projectsRes.error) {
    return NextResponse.json({ error: projectsRes.error.message }, { status: 500 });
  }

  const clientMap = new Map((clientsRes.data ?? []).map((c) => [c.id, c.name]));

  const items = (projectsRes.data ?? []).map((p) => ({
    id: p.id,
    project_name: p.name,
    project_status: p.status,
    client_id: p.client_id,
    client_name: clientMap.get(p.client_id) ?? "알 수 없음",
    reason: p.hosting_excluded_reason ?? "",
    excluded_at: p.hosting_excluded_at,
  }));

  return NextResponse.json({ items });
}
