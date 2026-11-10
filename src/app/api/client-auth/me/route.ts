import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  getAuthenticatedClientId,
  generateClientToken,
  CLIENT_COOKIE_NAME,
  clientCookieOptions,
} from "@/lib/client-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const clientId = await getAuthenticatedClientId();

  if (!clientId) {
    return NextResponse.json(
      { error: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  const [clientResult, projectsResult, hostingResult, domainsResult, paymentsResult, marketingResult] =
    await Promise.all([
      supabase
        .from("clients")
        .select("id, username, name, email, phone, memo, is_active, created_at, updated_at")
        .eq("id", clientId)
        .single(),
      supabase
        .from("projects")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false }),
      supabase
        .from("hosting")
        .select("*")
        .eq("client_id", clientId)
        .order("start_date", { ascending: false }),
      supabase
        .from("domains")
        .select("*")
        .eq("client_id", clientId)
        .order("domain_name", { ascending: true }),
      supabase
        .from("payments")
        .select("*")
        .eq("client_id", clientId)
        .order("payment_date", { ascending: false }),
      supabase
        .from("marketing")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false }),
    ]);

  if (clientResult.error || !clientResult.data) {
    return NextResponse.json(
      { error: "클라이언트 정보를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const response = NextResponse.json({
    client: clientResult.data,
    projects: projectsResult.data ?? [],
    hosting: hostingResult.data ?? [],
    domains: domainsResult.data ?? [],
    payments: paymentsResult.data ?? [],
    marketing: marketingResult.data ?? [],
  });

  // 포털을 열 때마다 기한을 다시 30일로 늘린다. 계속 쓰는 사람은
  // 다시 로그인할 일이 없고, 한 달 넘게 안 들어온 사람만 풀린다.
  response.cookies.set(CLIENT_COOKIE_NAME, generateClientToken(clientId), clientCookieOptions);

  return response;
}
