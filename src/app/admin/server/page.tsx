"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import AdminHeader from "../components/AdminHeader";

// ─── Types ───

interface MetricResult<T> {
  available: boolean;
  data?: T;
  error?: string;
}

interface MemoryData {
  totalGB: number;
  usedGB: number;
  availableGB: number;
  usagePercent: number;
}

interface CpuData {
  load1: number;
  load5: number;
  load15: number;
  cores: number;
  usagePercent: number;
}

interface UptimeData {
  days: number;
  hours: number;
  minutes: number;
}

interface NetworkInterface {
  name: string;
  rxBytes: number;
  txBytes: number;
  rxHuman: string;
  txHuman: string;
}

interface DiskData {
  totalGB: number;
  usedGB: number;
  availableGB: number;
  usagePercent: number;
}

interface PortData {
  port: number;
  protocol: string;
}

interface DockerContainer {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
  ports: { public: number; private: number; type: string }[];
  cpuPercent?: number;
  memoryUsageMB?: number;
  memoryLimitMB?: number;
  networkRxBytes?: number;
  networkTxBytes?: number;
  networkRxHuman?: string;
  networkTxHuman?: string;
  sizeRw?: number;
  sizeRootFs?: number;
  sizeHuman?: string;
}

interface DiskBreakdownItem {
  name: string;
  type: "project" | "database" | "docker" | "other";
  sizeBytes: number;
  sizeHuman: string;
}

interface DockerDiskData {
  available: boolean;
  data?: {
    images: { sizeBytes: number; sizeHuman: string; count: number };
    volumes: { sizeBytes: number; sizeHuman: string; count: number };
    buildCache: { sizeBytes: number; sizeHuman: string };
  };
}

interface ServerMetrics {
  system: {
    memory: MetricResult<MemoryData>;
    cpu: MetricResult<CpuData>;
    uptime: MetricResult<UptimeData>;
    network: MetricResult<NetworkInterface[]>;
    disk: MetricResult<DiskData>;
    ports: MetricResult<PortData[]>;
  };
  docker: {
    available: boolean;
    containers?: DockerContainer[];
    error?: string;
  };
  diskBreakdown?: {
    projects: MetricResult<DiskBreakdownItem[]>;
    databases: MetricResult<DiskBreakdownItem[]>;
    dockerDisk: DockerDiskData;
  };
}

interface MonthlyAnalytics {
  month: string;
  site: string;
  uniqueVisitors: number;
  totalViews: number;
}

interface TodayStat {
  site: string;
  uniqueVisitors: number;
  totalViews: number;
}

interface AnalyticsData {
  monthly: MonthlyAnalytics[];
  today: TodayStat[];
}

const WELL_KNOWN_PORTS: Record<number, string> = {
  22: "SSH",
  25: "SMTP",
  53: "DNS",
  80: "HTTP",
  443: "HTTPS",
  2375: "Docker",
  2376: "Docker TLS",
  3000: "Node.js",
  3306: "MySQL",
  5432: "PostgreSQL",
  6379: "Redis",
  8000: "Kong",
  8080: "HTTP Proxy",
  8443: "Kong SSL",
  9090: "Prometheus",
  27017: "MongoDB",
};

const REFRESH_INTERVAL = 30000;

const INFRA_GROUPS: { key: string; label: string; match: (name: string) => boolean }[] = [
  { key: "supabase", label: "Supabase", match: (n) => n.startsWith("supabase") },
  { key: "system", label: "시스템 서비스", match: (n) => ["auto-deployer", "webhook-server", "cloudflared", "watchtower", "nginx", "caddy", "traefik"].some((s) => n.startsWith(s)) },
];

function getContainerGroup(name: string): string | null {
  for (const g of INFRA_GROUPS) {
    if (g.match(name)) return g.key;
  }
  return null;
}

// Colors: slate base with critical-only emphasis
function statusColor(percent: number): string {
  if (percent >= 80) return "#dc2626"; // red-600
  if (percent >= 60) return "#d97706"; // amber-600
  return "#0f172a"; // slate-900
}

function statusBg(percent: number): string {
  if (percent >= 80) return "#fef2f2"; // red-50
  if (percent >= 60) return "#fffbeb"; // amber-50
  return "#f8fafc"; // slate-50
}

function statusLabel(percent: number): string {
  if (percent >= 80) return "위험";
  if (percent >= 60) return "주의";
  return "정상";
}

function containerStateBadge(state: string): { label: string; cls: string } {
  switch (state) {
    case "running":
      return { label: "실행", cls: "bg-emerald-50 text-emerald-700 border border-emerald-100" };
    case "exited":
      return { label: "중지", cls: "bg-red-50 text-red-700 border border-red-100" };
    case "restarting":
      return { label: "재시작", cls: "bg-amber-50 text-amber-700 border border-amber-100" };
    default:
      return { label: state, cls: "bg-slate-100 text-slate-600 border border-slate-200" };
  }
}

function formatMemoryMB(mb: number): string {
  if (mb >= 1024) return (mb / 1024).toFixed(1) + " GB";
  return Math.round(mb) + " MB";
}

function isPhysicalInterface(name: string): boolean {
  return name.startsWith("eth") || name.startsWith("ens") || name.startsWith("enp") || name.startsWith("wlan");
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + units[i];
}

// ─── Radial gauge ───
function RadialGauge({ percent, label, sub, color }: { percent: number; label: string; sub?: string; color?: string }) {
  const strokePct = Math.min(Math.max(percent, 0), 100);
  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (strokePct / 100) * c;
  const tone = color ?? statusColor(percent);
  return (
    <div className="relative w-[110px] h-[110px] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth="9"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[20px] font-bold text-slate-900 tabular-nums leading-none">{label}</p>
        {sub && <p className="text-[10px] text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) * 0.5;
    const cp2x = p0.x + (p1.x - p0.x) * 0.5;
    d += ` C ${cp1x} ${p0.y}, ${cp2x} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export default function ServerMonitoring() {
  const [data, setData] = useState<ServerMetrics | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showVirtualInterfaces, setShowVirtualInterfaces] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [serverRes, analyticsRes] = await Promise.all([
        fetch("/api/admin/server"),
        fetch("/api/admin/analytics"),
      ]);
      if (serverRes.ok) {
        setData(await serverRes.json());
        setLastUpdated(new Date());
      }
      if (analyticsRes.ok) {
        setAnalytics(await analyticsRes.json());
      }
    } catch {
      // keep previous data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(() => fetchData(true), REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  const handleRefresh = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    fetchData(true);
    intervalRef.current = setInterval(() => fetchData(true), REFRESH_INTERVAL);
  };

  // Build visitor trend (sum across sites by month)
  const visitorTrend = useMemo(() => {
    if (!analytics) return [];
    const map = new Map<string, number>();
    analytics.monthly.forEach((m) => {
      map.set(m.month, (map.get(m.month) ?? 0) + m.uniqueVisitors);
    });
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([month, count]) => ({ month, count }));
  }, [analytics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminHeader />
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="animate-pulse space-y-5">
            <div className="h-7 bg-slate-200 rounded w-48" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-44 bg-white rounded-xl border border-slate-200" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-72 bg-white rounded-xl border border-slate-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminHeader />
        <div className="text-center py-20 text-slate-500">서버 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const { system, docker } = data;
  const runningCount = docker.containers?.filter((c) => c.state === "running").length ?? 0;
  const totalCount = docker.containers?.length ?? 0;

  const containerPublicPorts = new Set<number>();
  docker.containers?.forEach((c) => c.ports.forEach((p) => containerPublicPorts.add(p.public)));
  const hostPorts = system.ports.data?.filter((p) => !containerPublicPorts.has(p.port)) ?? [];

  const physicalInterfaces = system.network.data?.filter((i) => isPhysicalInterface(i.name)) ?? [];
  const virtualInterfaces = system.network.data?.filter((i) => !isPhysicalInterface(i.name)) ?? [];

  const projectContainers: DockerContainer[] = [];
  const infraGroups: Map<string, DockerContainer[]> = new Map();
  docker.containers?.forEach((c) => {
    const groupKey = getContainerGroup(c.name);
    if (groupKey) {
      if (!infraGroups.has(groupKey)) infraGroups.set(groupKey, []);
      infraGroups.get(groupKey)!.push(c);
    } else {
      projectContainers.push(c);
    }
  });

  // Visitor sparkline
  const sparkW = 200;
  const sparkH = 60;
  const sparkMax = Math.max(...visitorTrend.map((m) => m.count), 1);
  const sparkPoints = visitorTrend.map((m, i, arr) => ({
    x: 4 + (i / Math.max(arr.length - 1, 1)) * (sparkW - 8),
    y: sparkH - 4 - (m.count / sparkMax) * (sparkH - 12),
  }));
  const sparkPath = buildSmoothPath(sparkPoints);
  const sparkAreaPath =
    sparkPoints.length > 0
      ? `${sparkPath} L ${sparkPoints[sparkPoints.length - 1].x} ${sparkH - 4} L ${sparkPoints[0].x} ${sparkH - 4} Z`
      : "";

  const todayTotalVisitors = analytics?.today.reduce((s, t) => s + t.uniqueVisitors, 0) ?? 0;
  const todayTotalViews = analytics?.today.reduce((s, t) => s + t.totalViews, 0) ?? 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">서버 모니터링</h2>
            <p className="text-slate-500 text-sm mt-1">
              {lastUpdated ? (
                <>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {lastUpdated.toLocaleTimeString("ko-KR")} 갱신
                  </span>
                  <span className="mx-2 text-slate-300">·</span>
                  30초마다 자동 갱신
                </>
              ) : (
                "데이터 수집 중..."
              )}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-xs px-3 h-8 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992V4.356M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            새로고침
          </button>
        </div>

        {/* System gauges (4) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* CPU */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">CPU</h3>
              {system.cpu.available && system.cpu.data && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: statusBg(system.cpu.data.usagePercent), color: statusColor(system.cpu.data.usagePercent) }}
                >
                  {statusLabel(system.cpu.data.usagePercent)}
                </span>
              )}
            </div>
            {system.cpu.available && system.cpu.data ? (
              <>
                <RadialGauge
                  percent={system.cpu.data.usagePercent}
                  label={`${system.cpu.data.usagePercent}%`}
                  sub={`Load ${system.cpu.data.load1}`}
                />
                <p className="text-[11px] text-slate-500 text-center mt-3 tabular-nums">{system.cpu.data.cores}코어</p>
              </>
            ) : (
              <p className="text-slate-400 text-sm py-10 text-center">측정 불가</p>
            )}
          </div>

          {/* Memory */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">메모리</h3>
              {system.memory.available && system.memory.data && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: statusBg(system.memory.data.usagePercent), color: statusColor(system.memory.data.usagePercent) }}
                >
                  {statusLabel(system.memory.data.usagePercent)}
                </span>
              )}
            </div>
            {system.memory.available && system.memory.data ? (
              <>
                <RadialGauge
                  percent={system.memory.data.usagePercent}
                  label={`${system.memory.data.usagePercent}%`}
                  sub={`${system.memory.data.usedGB} GB`}
                />
                <p className="text-[11px] text-slate-500 text-center mt-3 tabular-nums">전체 {system.memory.data.totalGB} GB</p>
              </>
            ) : (
              <p className="text-slate-400 text-sm py-10 text-center">측정 불가</p>
            )}
          </div>

          {/* Disk */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">디스크</h3>
              {system.disk.available && system.disk.data && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: statusBg(system.disk.data.usagePercent), color: statusColor(system.disk.data.usagePercent) }}
                >
                  {statusLabel(system.disk.data.usagePercent)}
                </span>
              )}
            </div>
            {system.disk.available && system.disk.data ? (
              <>
                <RadialGauge
                  percent={system.disk.data.usagePercent}
                  label={`${system.disk.data.usagePercent}%`}
                  sub={`${system.disk.data.usedGB} GB`}
                />
                <p className="text-[11px] text-slate-500 text-center mt-3 tabular-nums">남은 {system.disk.data.availableGB} GB</p>
              </>
            ) : (
              <p className="text-slate-400 text-sm py-10 text-center">측정 불가</p>
            )}
          </div>

          {/* Uptime */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">업타임</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">정상</span>
            </div>
            {system.uptime.available && system.uptime.data ? (
              <div className="flex flex-col items-center justify-center h-[110px]">
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-bold text-slate-900 tabular-nums leading-none">{system.uptime.data.days}</span>
                  <span className="text-sm text-slate-500 font-medium">일</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 tabular-nums">
                  {system.uptime.data.hours}시간 {system.uptime.data.minutes}분
                </p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm py-10 text-center">측정 불가</p>
            )}
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <span>컨테이너</span>
              <span className="text-slate-900 font-bold tabular-nums">{runningCount}/{totalCount}</span>
            </div>
          </div>
        </div>

        {/* Disk breakdown + Visitor analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Disk breakdown */}
          {data.diskBreakdown && (
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-baseline justify-between mb-5">
                <h3 className="text-sm font-semibold text-slate-900">디스크 사용량 상세</h3>
                <p className="text-xs text-slate-500">프로젝트·DB 단위</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Projects */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-slate-700">프로젝트</h4>
                    {data.diskBreakdown.projects.available && data.diskBreakdown.projects.data && (
                      <span className="text-[11px] text-slate-500 tabular-nums">
                        {formatBytes(data.diskBreakdown.projects.data.reduce((s, i) => s + i.sizeBytes, 0))} · {data.diskBreakdown.projects.data.length}개
                      </span>
                    )}
                  </div>
                  {data.diskBreakdown.projects.available && data.diskBreakdown.projects.data ? (
                    <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                      {data.diskBreakdown.projects.data.map((item, i) => {
                        const max = data.diskBreakdown!.projects.data![0].sizeBytes;
                        const pct = max > 0 ? (item.sizeBytes / max) * 100 : 0;
                        return (
                          <div key={item.name}>
                            <div className="flex items-center justify-between text-[11px] mb-0.5">
                              <span className="text-slate-700 font-medium truncate mr-2">
                                <span className="text-slate-400 mr-1.5 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                                {item.name}
                              </span>
                              <span className="text-slate-500 shrink-0 tabular-nums">{item.sizeHuman}</span>
                            </div>
                            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-slate-900" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs py-4 text-center">{data.diskBreakdown.projects.error || "조회 불가"}</p>
                  )}
                </div>

                {/* Databases */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-slate-700">데이터베이스</h4>
                    {data.diskBreakdown.databases.available && data.diskBreakdown.databases.data && (
                      <span className="text-[11px] text-slate-500 tabular-nums">
                        {formatBytes(data.diskBreakdown.databases.data.reduce((s, i) => s + i.sizeBytes, 0))} · {data.diskBreakdown.databases.data.length}개
                      </span>
                    )}
                  </div>
                  {data.diskBreakdown.databases.available && data.diskBreakdown.databases.data ? (
                    <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                      {data.diskBreakdown.databases.data.map((item, i) => {
                        const max = data.diskBreakdown!.databases.data![0].sizeBytes;
                        const pct = max > 0 ? (item.sizeBytes / max) * 100 : 0;
                        return (
                          <div key={item.name}>
                            <div className="flex items-center justify-between text-[11px] mb-0.5">
                              <span className="text-slate-700 font-mono truncate mr-2">
                                <span className="text-slate-400 mr-1.5 tabular-nums font-sans">{String(i + 1).padStart(2, "0")}</span>
                                {item.name}
                              </span>
                              <span className="text-slate-500 shrink-0 tabular-nums">{item.sizeHuman}</span>
                            </div>
                            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-slate-600" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs py-4 text-center">{data.diskBreakdown.databases.error || "조회 불가"}</p>
                  )}
                </div>
              </div>

              {/* Docker disk */}
              {data.diskBreakdown.dockerDisk.available && data.diskBreakdown.dockerDisk.data && (
                <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-slate-100">
                  <div className="text-center">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">이미지</p>
                    <p className="text-base font-bold text-slate-900 tabular-nums">{data.diskBreakdown.dockerDisk.data.images.sizeHuman}</p>
                    <p className="text-[10px] text-slate-500 tabular-nums">{data.diskBreakdown.dockerDisk.data.images.count}개</p>
                  </div>
                  <div className="text-center border-l border-r border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">볼륨</p>
                    <p className="text-base font-bold text-slate-900 tabular-nums">{data.diskBreakdown.dockerDisk.data.volumes.sizeHuman}</p>
                    <p className="text-[10px] text-slate-500 tabular-nums">{data.diskBreakdown.dockerDisk.data.volumes.count}개</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">캐시</p>
                    <p className="text-base font-bold text-slate-900 tabular-nums">{data.diskBreakdown.dockerDisk.data.buildCache.sizeHuman}</p>
                    <p className="text-[10px] text-slate-400">build</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Visitor analytics */}
          {analytics && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">방문자 추이</h3>
                <p className="text-xs text-slate-500">최근 6개월</p>
              </div>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[26px] font-bold text-slate-900 tabular-nums leading-none">{todayTotalVisitors}</span>
                <span className="text-sm text-slate-500">명</span>
                <span className="text-xs text-slate-500 ml-2">오늘 · 전체 사이트</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-4 tabular-nums">{todayTotalViews.toLocaleString()} 페이지뷰</p>

              {/* Sparkline */}
              {visitorTrend.length > 0 ? (
                <svg viewBox={`0 0 ${sparkW} ${sparkH}`} className="w-full h-auto" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="visitor-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0f172a" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {sparkAreaPath && <path d={sparkAreaPath} fill="url(#visitor-area)" />}
                  <path d={sparkPath} fill="none" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
                  {sparkPoints.length > 0 && (
                    <circle cx={sparkPoints[sparkPoints.length - 1].x} cy={sparkPoints[sparkPoints.length - 1].y} r="2.5" fill="#0f172a" />
                  )}
                </svg>
              ) : (
                <p className="text-slate-400 text-xs py-6 text-center">데이터 없음</p>
              )}

              {/* Today's site list */}
              {analytics.today.length > 0 && (
                <ul className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 list-none m-0 max-h-[160px] overflow-y-auto">
                  {analytics.today
                    .sort((a, b) => b.uniqueVisitors - a.uniqueVisitors)
                    .map((s) => (
                      <li key={s.site} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-700 truncate flex-1">{s.site}</span>
                        <span className="text-slate-900 font-bold tabular-nums ml-2">{s.uniqueVisitors}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Docker services */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">서비스 현황</h3>
              <p className="text-xs text-slate-500 mt-0.5">Docker 컨테이너</p>
            </div>
            {docker.available && (
              <span className="text-xs text-slate-500 tabular-nums">
                <span className="text-emerald-700 font-bold">{runningCount}</span>
                <span className="text-slate-400"> / </span>
                <span className="text-slate-700 font-bold">{totalCount}</span>
                <span className="ml-1">실행 중</span>
              </span>
            )}
          </div>

          {!docker.available ? (
            <div className="px-5 py-8 text-center">
              <p className="text-slate-500 text-sm">Docker 소켓에 연결할 수 없습니다.</p>
              <p className="text-slate-400 text-xs mt-1">docker-compose.yml 볼륨 마운트 확인</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {/* Project containers */}
              {projectContainers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {projectContainers.map((c) => {
                    const badge = containerStateBadge(c.state);
                    const isRunning = c.state === "running";
                    const memPercent = c.memoryUsageMB && c.memoryLimitMB
                      ? Math.min((c.memoryUsageMB / c.memoryLimitMB) * 100, 100)
                      : 0;

                    return (
                      <div
                        key={c.id}
                        className={`rounded-lg border p-4 transition-all ${
                          isRunning ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50/50 opacity-70"
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{c.name}</h4>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 truncate mb-3 font-mono">
                          {c.image.split("@")[0].split("/").pop()}
                        </p>

                        {/* Ports */}
                        {c.ports.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {c.ports.map((p) => {
                              const serviceName = WELL_KNOWN_PORTS[p.public] || WELL_KNOWN_PORTS[p.private];
                              return (
                                <span
                                  key={`${p.public}:${p.private}`}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-mono"
                                >
                                  <span className="text-slate-700 font-semibold">{p.public}</span>
                                  <span className="text-slate-300">→</span>
                                  <span className="text-slate-500">{p.private}</span>
                                  {serviceName && <span className="text-slate-400 ml-0.5 font-sans">{serviceName}</span>}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Resource bars */}
                        {isRunning && (c.cpuPercent !== undefined || c.memoryUsageMB !== undefined) && (
                          <div className="space-y-2">
                            {c.cpuPercent !== undefined && (
                              <div>
                                <div className="flex items-center justify-between text-[10px] mb-0.5">
                                  <span className="text-slate-500">CPU</span>
                                  <span className="font-bold tabular-nums" style={{ color: statusColor(c.cpuPercent) }}>{c.cpuPercent}%</span>
                                </div>
                                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(c.cpuPercent, 100)}%`, background: statusColor(c.cpuPercent) }} />
                                </div>
                              </div>
                            )}
                            {c.memoryUsageMB !== undefined && (
                              <div>
                                <div className="flex items-center justify-between text-[10px] mb-0.5">
                                  <span className="text-slate-500">메모리</span>
                                  <span className="font-bold tabular-nums" style={{ color: c.memoryLimitMB ? statusColor(memPercent) : "#0f172a" }}>
                                    {formatMemoryMB(c.memoryUsageMB)}
                                    {c.memoryLimitMB ? ` / ${formatMemoryMB(c.memoryLimitMB)}` : ""}
                                  </span>
                                </div>
                                {c.memoryLimitMB && memPercent > 0 && (
                                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all" style={{ width: `${memPercent}%`, background: statusColor(memPercent) }} />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Network + Disk */}
                        {isRunning && (c.networkRxHuman || c.sizeHuman) && (
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
                            {c.networkRxHuman && c.networkTxHuman && (
                              <span className="flex items-center gap-2 font-mono">
                                <span>↓ {c.networkRxHuman}</span>
                                <span>↑ {c.networkTxHuman}</span>
                              </span>
                            )}
                            {c.sizeHuman && <span className="tabular-nums">{c.sizeHuman}</span>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Infra groups */}
              {INFRA_GROUPS.map((group) => {
                const containers = infraGroups.get(group.key);
                if (!containers || containers.length === 0) return null;

                const groupRunning = containers.filter((c) => c.state === "running").length;
                const totalCpu = containers.reduce((sum, c) => sum + (c.cpuPercent ?? 0), 0);
                const totalMem = containers.reduce((sum, c) => sum + (c.memoryUsageMB ?? 0), 0);
                const isExpanded = expandedGroups.has(group.key);

                return (
                  <div key={group.key} className="rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleGroup(group.key)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/50 border-none cursor-pointer hover:bg-slate-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                          {group.label.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-slate-900">{group.label}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            <span className="text-emerald-700 font-bold">{groupRunning}</span>
                            <span className="text-slate-400"> / {containers.length} 실행 중</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
                          {totalCpu > 0 && (
                            <span>
                              CPU <span className="font-bold text-slate-900 tabular-nums">{Math.round(totalCpu * 10) / 10}%</span>
                            </span>
                          )}
                          {totalMem > 0 && (
                            <span>
                              MEM <span className="font-bold text-slate-900 tabular-nums">{formatMemoryMB(totalMem)}</span>
                            </span>
                          )}
                        </div>
                        <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                              <th className="text-left py-2 px-4 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">이름</th>
                              <th className="text-center py-2 px-3 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">상태</th>
                              <th className="text-left py-2 px-3 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">포트</th>
                              <th className="text-right py-2 px-3 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">CPU</th>
                              <th className="text-right py-2 px-3 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">메모리</th>
                              <th className="text-right py-2 px-4 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">디스크</th>
                            </tr>
                          </thead>
                          <tbody>
                            {containers.map((c) => {
                              const badge = containerStateBadge(c.state);
                              return (
                                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                  <td className="py-2 px-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-slate-900 font-medium font-mono truncate max-w-[180px]">{c.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 text-center">
                                    <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded ${badge.cls}`}>{badge.label}</span>
                                  </td>
                                  <td className="py-2 px-3 text-slate-700 font-mono text-[11px]">
                                    {c.ports.length > 0 ? c.ports.map((p) => `${p.public}:${p.private}`).join(", ") : "-"}
                                  </td>
                                  <td className="py-2 px-3 text-right text-slate-900 tabular-nums">
                                    {c.cpuPercent !== undefined ? `${c.cpuPercent}%` : "-"}
                                  </td>
                                  <td className="py-2 px-3 text-right text-slate-900 tabular-nums">
                                    {c.memoryUsageMB !== undefined ? formatMemoryMB(c.memoryUsageMB) : "-"}
                                  </td>
                                  <td className="py-2 px-4 text-right text-slate-500 tabular-nums">{c.sizeHuman ?? "-"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom: ports + network */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Host ports */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">호스트 포트</h3>
              <p className="text-xs text-slate-500">컨테이너 외</p>
            </div>
            {hostPorts.length === 0 ? (
              <p className="text-slate-400 text-sm py-6 text-center">없음</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {hostPorts.map((p) => {
                  const label = WELL_KNOWN_PORTS[p.port];
                  return (
                    <span
                      key={p.port}
                      className="inline-flex items-center gap-1.5 px-2.5 h-7 bg-slate-50 border border-slate-200 rounded text-xs"
                    >
                      <span className="font-mono font-bold text-slate-900 tabular-nums">{p.port}</span>
                      {label && <span className="text-slate-500">{label}</span>}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Network traffic */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">네트워크 트래픽</h3>
              <p className="text-xs text-slate-500">물리 인터페이스</p>
            </div>

            {!system.network.available ? (
              <p className="text-slate-400 text-sm py-6 text-center">측정 불가</p>
            ) : (
              <div>
                {physicalInterfaces.length === 0 && virtualInterfaces.length === 0 ? (
                  <p className="text-slate-400 text-sm py-6 text-center">데이터 없음</p>
                ) : (
                  <>
                    <ul className="space-y-2 list-none m-0">
                      {physicalInterfaces.map((iface) => (
                        <li key={iface.name} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <span className="text-slate-900 font-bold font-mono text-sm">{iface.name}</span>
                          <div className="flex items-center gap-3 text-xs font-mono text-slate-700">
                            <span>↓ {iface.rxHuman}</span>
                            <span className="w-px h-3 bg-slate-200" />
                            <span>↑ {iface.txHuman}</span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {virtualInterfaces.length > 0 && (
                      <>
                        <button
                          onClick={() => setShowVirtualInterfaces(!showVirtualInterfaces)}
                          className="w-full flex items-center justify-center gap-1 mt-3 py-2 text-xs text-slate-500 hover:text-slate-900 cursor-pointer border-none bg-transparent transition-colors"
                        >
                          {showVirtualInterfaces ? "가상 인터페이스 접기" : `가상 인터페이스 ${virtualInterfaces.length}개 보기`}
                          <svg className={`w-3 h-3 transition-transform ${showVirtualInterfaces ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        {showVirtualInterfaces && (
                          <ul className="mt-1 space-y-1.5 list-none m-0">
                            {virtualInterfaces.map((iface) => (
                              <li key={iface.name} className="flex items-center justify-between py-1.5">
                                <span className="text-slate-500 font-mono text-[11px]">{iface.name}</span>
                                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                                  <span>↓ {iface.rxHuman}</span>
                                  <span>↑ {iface.txHuman}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
