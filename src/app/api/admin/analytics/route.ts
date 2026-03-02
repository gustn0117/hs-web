import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  // 최근 6개월 시작일
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  const startDate = sixMonthsAgo.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("page_views")
    .select("site, visited_at, visitor_hash")
    .gte("visited_at", startDate);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 월별 집계
  const monthlyMap: Record<
    string,
    Record<string, { visitors: Set<string>; views: number }>
  > = {};

  for (const row of data || []) {
    const month = row.visited_at.slice(0, 7); // YYYY-MM
    const { site, visitor_hash } = row;

    if (!monthlyMap[month]) monthlyMap[month] = {};
    if (!monthlyMap[month][site])
      monthlyMap[month][site] = { visitors: new Set(), views: 0 };

    monthlyMap[month][site].visitors.add(visitor_hash);
    monthlyMap[month][site].views += 1;
  }

  const monthly: {
    month: string;
    site: string;
    uniqueVisitors: number;
    totalViews: number;
  }[] = [];

  for (const [month, sites] of Object.entries(monthlyMap)) {
    for (const [site, stats] of Object.entries(sites)) {
      monthly.push({
        month,
        site,
        uniqueVisitors: stats.visitors.size,
        totalViews: stats.views,
      });
    }
  }

  monthly.sort(
    (a, b) => a.month.localeCompare(b.month) || a.site.localeCompare(b.site)
  );

  // 오늘 통계
  const today = new Date().toISOString().slice(0, 10);
  const todayRows = (data || []).filter((r) => r.visited_at === today);
  const todayMap: Record<string, { visitors: Set<string>; views: number }> = {};

  for (const row of todayRows) {
    if (!todayMap[row.site])
      todayMap[row.site] = { visitors: new Set(), views: 0 };
    todayMap[row.site].visitors.add(row.visitor_hash);
    todayMap[row.site].views += 1;
  }

  const todayStats = Object.entries(todayMap).map(([site, s]) => ({
    site,
    uniqueVisitors: s.visitors.size,
    totalViews: s.views,
  }));

  return NextResponse.json({ monthly, today: todayStats });
}
