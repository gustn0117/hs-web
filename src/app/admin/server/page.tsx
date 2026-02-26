"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  sizeRw?: number;
  sizeRootFs?: number;
  sizeHuman?: string;
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
}

// ─── Constants ───

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

// Infrastructure container group definitions
const INFRA_GROUPS: { key: string; label: string; icon: string; match: (name: string) => boolean }[] = [
  { key: "supabase", label: "Supabase", icon: "db", match: (n) => n.startsWith("supabase") },
  { key: "system", label: "시스템 서비스", icon: "sys", match: (n) => ["auto-deployer", "webhook-server", "cloudflared", "watchtower", "nginx", "caddy", "traefik"].some((s) => n.startsWith(s)) },
];

function getContainerGroup(name: string): string | null {
  for (const g of INFRA_GROUPS) {
    if (g.match(name)) return g.key;
  }
  return null;
}

// ─── Helpers ───

function progressColor(percent: number): string {
  if (percent >= 80) return "bg-red-500";
  if (percent >= 60) return "bg-amber-500";
  return "bg-emerald-500";
}

function progressTextColor(percent: number): string {
  if (percent >= 80) return "text-red-600";
  if (percent >= 60) return "text-amber-600";
  return "text-emerald-600";
}

function containerStateBadge(state: string): { label: string; dot: string; border: string } {
  switch (state) {
    case "running":
      return { label: "실행 중", dot: "bg-emerald-500", border: "border-emerald-200" };
    case "exited":
      return { label: "중지됨", dot: "bg-red-500", border: "border-red-200" };
    case "restarting":
      return { label: "재시작", dot: "bg-amber-500", border: "border-amber-200" };
    default:
      return { label: state, dot: "bg-gray-400", border: "border-gray-200" };
  }
}

function formatMemoryMB(mb: number): string {
  if (mb >= 1024) return (mb / 1024).toFixed(1) + " GB";
  return Math.round(mb) + " MB";
}

function getPortServiceName(port: number): string | undefined {
  return WELL_KNOWN_PORTS[port];
}

function isPhysicalInterface(name: string): boolean {
  return name.startsWith("eth") || name.startsWith("ens") || name.startsWith("enp") || name.startsWith("wlan");
}

// ─── Component ───

export default function ServerMonitoring() {
  const [data, setData] = useState<ServerMetrics | null>(null);
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
      const res = await fetch("/api/admin/server");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastUpdated(new Date());
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

  // ─── Loading ───
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-light)]">
        <AdminHeader />
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error ───
  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--color-light)]">
        <AdminHeader />
        <div className="text-center py-20 text-[var(--color-gray)]">
          서버 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const { system, docker } = data;
  const runningCount = docker.containers?.filter((c) => c.state === "running").length ?? 0;
  const totalCount = docker.containers?.length ?? 0;

  // Build set of container public ports for host-port filtering
  const containerPublicPorts = new Set<number>();
  docker.containers?.forEach((c) => c.ports.forEach((p) => containerPublicPorts.add(p.public)));

  // Host-only ports (not belonging to any container)
  const hostPorts = system.ports.data?.filter((p) => !containerPublicPorts.has(p.port)) ?? [];

  // Network interfaces split
  const physicalInterfaces = system.network.data?.filter((i) => isPhysicalInterface(i.name)) ?? [];
  const virtualInterfaces = system.network.data?.filter((i) => !isPhysicalInterface(i.name)) ?? [];

  // Group containers: projects vs infrastructure
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

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)]">서버 모니터링</h2>
            <p className="text-[var(--color-gray)] text-sm mt-1">서버 상태를 실시간으로 확인하세요.</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-[var(--color-gray)] text-xs">
                {lastUpdated.toLocaleTimeString("ko-KR")} 갱신
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-[var(--color-gray)] text-sm rounded-xl cursor-pointer hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <svg
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                />
              </svg>
              새로고침
            </button>
          </div>
        </div>

        {/* ===== System Overview Cards ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* CPU */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <p className="text-[var(--color-gray)] text-xs">CPU 부하</p>
                {system.cpu.available && system.cpu.data ? (
                  <p className="text-[var(--color-dark)] text-2xl font-bold">{system.cpu.data.load1}</p>
                ) : (
                  <p className="text-[var(--color-gray)] text-sm">측정 불가</p>
                )}
              </div>
            </div>
            {system.cpu.available && system.cpu.data && (
              <>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${progressColor(system.cpu.data.usagePercent)}`}
                    style={{ width: `${Math.min(system.cpu.data.usagePercent, 100)}%` }}
                  />
                </div>
                <p className="text-[var(--color-gray)] text-xs mt-2">{system.cpu.data.cores}코어 · {system.cpu.data.usagePercent}%</p>
              </>
            )}
          </div>

          {/* Memory */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                </svg>
              </div>
              <div>
                <p className="text-[var(--color-gray)] text-xs">메모리</p>
                {system.memory.available && system.memory.data ? (
                  <p className="text-[var(--color-dark)] text-2xl font-bold">
                    {system.memory.data.usedGB}<span className="text-sm font-normal">/{system.memory.data.totalGB} GB</span>
                  </p>
                ) : (
                  <p className="text-[var(--color-gray)] text-sm">측정 불가</p>
                )}
              </div>
            </div>
            {system.memory.available && system.memory.data && (
              <>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${progressColor(system.memory.data.usagePercent)}`}
                    style={{ width: `${Math.min(system.memory.data.usagePercent, 100)}%` }}
                  />
                </div>
                <p className="text-[var(--color-gray)] text-xs mt-2">{system.memory.data.usagePercent}% 사용</p>
              </>
            )}
          </div>

          {/* Disk */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
              </div>
              <div>
                <p className="text-[var(--color-gray)] text-xs">디스크</p>
                {system.disk.available && system.disk.data ? (
                  <p className="text-[var(--color-dark)] text-2xl font-bold">
                    {system.disk.data.usedGB}<span className="text-sm font-normal">/{system.disk.data.totalGB} GB</span>
                  </p>
                ) : (
                  <p className="text-[var(--color-gray)] text-sm">측정 불가</p>
                )}
              </div>
            </div>
            {system.disk.available && system.disk.data && (
              <>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${progressColor(system.disk.data.usagePercent)}`}
                    style={{ width: `${Math.min(system.disk.data.usagePercent, 100)}%` }}
                  />
                </div>
                <p className="text-[var(--color-gray)] text-xs mt-2">{system.disk.data.usagePercent}% 사용 · {system.disk.data.availableGB}GB 남음</p>
              </>
            )}
          </div>

          {/* Uptime */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[var(--color-gray)] text-xs">업타임</p>
                {system.uptime.available && system.uptime.data ? (
                  <p className="text-[var(--color-dark)] text-2xl font-bold">
                    {system.uptime.data.days}<span className="text-sm font-normal">일</span>{" "}
                    {system.uptime.data.hours}<span className="text-sm font-normal">시간</span>
                  </p>
                ) : (
                  <p className="text-[var(--color-gray)] text-sm">측정 불가</p>
                )}
              </div>
            </div>
            {system.uptime.available && system.uptime.data && (
              <p className="text-[var(--color-gray)] text-xs mt-5">
                {system.uptime.data.days}일 {system.uptime.data.hours}시간 {system.uptime.data.minutes}분
              </p>
            )}
          </div>
        </div>

        {/* ===== Services (Docker Containers) ===== */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-dark)] font-semibold text-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
              </svg>
              서비스 현황
            </h3>
            {docker.available && (
              <span className="text-sm text-[var(--color-gray)]">
                <span className="text-emerald-600 font-semibold">{runningCount}</span>/{totalCount} 실행 중
              </span>
            )}
          </div>

          {!docker.available ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
              <p className="text-[var(--color-gray)] text-sm">Docker 소켓에 연결할 수 없습니다.</p>
              <p className="text-[var(--color-gray)] text-xs mt-1">docker-compose.yml에 볼륨 마운트를 확인하세요.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* ── Project Containers (individual cards) ── */}
              {projectContainers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectContainers.map((c) => {
                    const badge = containerStateBadge(c.state);
                    const isRunning = c.state === "running";
                    const memPercent = c.memoryUsageMB && c.memoryLimitMB
                      ? Math.min((c.memoryUsageMB / c.memoryLimitMB) * 100, 100)
                      : 0;

                    return (
                      <div
                        key={c.id}
                        className={`bg-white border-2 rounded-2xl p-5 shadow-sm transition-all ${
                          isRunning ? badge.border : "border-gray-200 opacity-60"
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${badge.dot}`} />
                            <h4 className="text-[var(--color-dark)] font-semibold text-sm truncate">{c.name}</h4>
                          </div>
                          <span className="text-xs text-[var(--color-gray)] shrink-0 ml-2">{badge.label}</span>
                        </div>

                        {/* Image */}
                        <p className="text-xs text-[var(--color-gray)] truncate mb-3 font-mono">
                          {c.image.split("@")[0].split("/").pop()}
                        </p>

                        {/* Ports */}
                        {c.ports.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {c.ports.map((p) => {
                              const serviceName = getPortServiceName(p.public) || getPortServiceName(p.private);
                              return (
                                <span key={`${p.public}:${p.private}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                                  <span className="text-blue-700 font-mono font-medium">{p.public}</span>
                                  <span className="text-blue-400">→</span>
                                  <span className="text-blue-600 font-mono">{p.private}</span>
                                  {serviceName && <span className="text-blue-500 font-sans ml-0.5">{serviceName}</span>}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Resource Bars */}
                        {isRunning && (c.cpuPercent !== undefined || c.memoryUsageMB !== undefined) && (
                          <div className="space-y-3 mb-3">
                            {c.cpuPercent !== undefined && (
                              <div>
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-[var(--color-gray)]">CPU</span>
                                  <span className={`font-semibold ${progressTextColor(c.cpuPercent)}`}>{c.cpuPercent}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full transition-all ${progressColor(c.cpuPercent)}`} style={{ width: `${Math.min(c.cpuPercent, 100)}%` }} />
                                </div>
                              </div>
                            )}
                            {c.memoryUsageMB !== undefined && (
                              <div>
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-[var(--color-gray)]">메모리</span>
                                  <span className={`font-semibold ${progressTextColor(memPercent)}`}>
                                    {formatMemoryMB(c.memoryUsageMB)}{c.memoryLimitMB ? ` / ${formatMemoryMB(c.memoryLimitMB)}` : ""}
                                  </span>
                                </div>
                                {c.memoryLimitMB && memPercent > 0 && (
                                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all ${progressColor(memPercent)}`} style={{ width: `${memPercent}%` }} />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          {c.sizeHuman ? (
                            <span className="text-xs text-[var(--color-gray)] flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                              </svg>
                              {c.sizeHuman}
                            </span>
                          ) : <span />}
                          <span className="text-xs text-[var(--color-gray)]">{c.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Infrastructure Groups (collapsible summaries) ── */}
              {INFRA_GROUPS.map((group) => {
                const containers = infraGroups.get(group.key);
                if (!containers || containers.length === 0) return null;

                const groupRunning = containers.filter((c) => c.state === "running").length;
                const totalCpu = containers.reduce((sum, c) => sum + (c.cpuPercent ?? 0), 0);
                const totalMem = containers.reduce((sum, c) => sum + (c.memoryUsageMB ?? 0), 0);
                const isExpanded = expandedGroups.has(group.key);

                return (
                  <div key={group.key} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    {/* Group Header (clickable) */}
                    <button
                      onClick={() => toggleGroup(group.key)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-transparent border-none cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${group.key === "supabase" ? "bg-emerald-50" : "bg-gray-100"}`}>
                          {group.key === "supabase" ? (
                            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.657-5.657A8.014 8.014 0 015 6.5a8 8 0 1116 0c0 1.12-.23 2.186-.643 3.157M11.42 15.17l2.496 4.715c.179.338.588.5.95.378l3.347-1.116a.75.75 0 00.462-.937l-1.525-4.065M11.42 15.17L15.15 11.4" />
                            </svg>
                          )}
                        </div>
                        <div className="text-left">
                          <h4 className="text-[var(--color-dark)] font-semibold text-sm">{group.label}</h4>
                          <p className="text-xs text-[var(--color-gray)] mt-0.5">
                            <span className="text-emerald-600 font-medium">{groupRunning}</span>/{containers.length} 실행 중
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Summary stats */}
                        <div className="hidden sm:flex items-center gap-3 text-xs text-[var(--color-gray)]">
                          {totalCpu > 0 && (
                            <span>CPU <span className="font-semibold text-[var(--color-dark)]">{Math.round(totalCpu * 10) / 10}%</span></span>
                          )}
                          {totalMem > 0 && (
                            <span>메모리 <span className="font-semibold text-[var(--color-dark)]">{formatMemoryMB(totalMem)}</span></span>
                          )}
                        </div>
                        <svg
                          className={`w-4 h-4 text-[var(--color-gray)] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded container list */}
                    {isExpanded && (
                      <div className="border-t border-gray-200">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left py-2.5 px-4 text-[var(--color-gray)] font-medium">이름</th>
                                <th className="text-center py-2.5 px-3 text-[var(--color-gray)] font-medium">상태</th>
                                <th className="text-left py-2.5 px-3 text-[var(--color-gray)] font-medium">포트</th>
                                <th className="text-right py-2.5 px-3 text-[var(--color-gray)] font-medium">CPU</th>
                                <th className="text-right py-2.5 px-3 text-[var(--color-gray)] font-medium">메모리</th>
                                <th className="text-right py-2.5 px-4 text-[var(--color-gray)] font-medium">디스크</th>
                              </tr>
                            </thead>
                            <tbody>
                              {containers.map((c) => {
                                const badge = containerStateBadge(c.state);
                                return (
                                  <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="py-2.5 px-4">
                                      <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badge.dot}`} />
                                        <span className="text-[var(--color-dark)] font-medium truncate max-w-[180px]">{c.name}</span>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3 text-center">
                                      <span className="text-[var(--color-gray)]">{badge.label}</span>
                                    </td>
                                    <td className="py-2.5 px-3 text-[var(--color-dark-2)]">
                                      {c.ports.length > 0
                                        ? c.ports.map((p) => `${p.public}:${p.private}`).join(", ")
                                        : "-"}
                                    </td>
                                    <td className="py-2.5 px-3 text-right text-[var(--color-dark)] tabular-nums">
                                      {c.cpuPercent !== undefined ? `${c.cpuPercent}%` : "-"}
                                    </td>
                                    <td className="py-2.5 px-3 text-right text-[var(--color-dark)] tabular-nums">
                                      {c.memoryUsageMB !== undefined ? formatMemoryMB(c.memoryUsageMB) : "-"}
                                    </td>
                                    <td className="py-2.5 px-4 text-right text-[var(--color-gray)] tabular-nums">
                                      {c.sizeHuman ?? "-"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== Bottom Grid: Host Ports + Network ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Host Services (ports not from containers) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[var(--color-dark)] font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              호스트 포트
            </h3>

            {hostPorts.length === 0 ? (
              <p className="text-[var(--color-gray)] text-sm py-2 text-center">컨테이너 외 호스트 포트 없음</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {hostPorts.map((p) => {
                  const label = WELL_KNOWN_PORTS[p.port];
                  return (
                    <span
                      key={p.port}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    >
                      <span className="font-mono font-semibold text-[var(--color-dark)]">{p.port}</span>
                      {label && (
                        <span className="text-[var(--color-gray)] font-sans">{label}</span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Network Traffic */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[var(--color-dark)] font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              네트워크 트래픽
            </h3>

            {!system.network.available ? (
              <p className="text-[var(--color-gray)] text-sm py-4 text-center">측정 불가</p>
            ) : (
              <div className="space-y-0">
                {/* Physical interfaces */}
                {physicalInterfaces.map((iface) => (
                  <div
                    key={iface.name}
                    className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-[var(--color-dark)] font-medium font-mono text-sm">{iface.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-xs">
                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                        </svg>
                        <span className="text-[var(--color-dark-2)] font-mono">{iface.rxHuman}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs">
                        <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                        </svg>
                        <span className="text-[var(--color-dark-2)] font-mono">{iface.txHuman}</span>
                      </span>
                    </div>
                  </div>
                ))}

                {/* Virtual interfaces toggle */}
                {virtualInterfaces.length > 0 && (
                  <>
                    <button
                      onClick={() => setShowVirtualInterfaces(!showVirtualInterfaces)}
                      className="w-full flex items-center justify-center gap-1 py-2 text-xs text-[var(--color-accent)] font-medium hover:bg-gray-50 rounded-lg cursor-pointer border-none bg-transparent transition-colors mt-1"
                    >
                      {showVirtualInterfaces ? "가상 인터페이스 접기" : `가상 인터페이스 ${virtualInterfaces.length}개 보기`}
                      <svg
                        className={`w-3.5 h-3.5 transition-transform ${showVirtualInterfaces ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {showVirtualInterfaces && (
                      <div className="mt-1 space-y-0">
                        {virtualInterfaces.map((iface) => (
                          <div
                            key={iface.name}
                            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                          >
                            <span className="text-[var(--color-gray)] font-mono text-xs">{iface.name}</span>
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1 text-xs">
                                <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                                </svg>
                                <span className="text-[var(--color-gray)] font-mono">{iface.rxHuman}</span>
                              </span>
                              <span className="flex items-center gap-1 text-xs">
                                <svg className="w-3 h-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                                </svg>
                                <span className="text-[var(--color-gray)] font-mono">{iface.txHuman}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
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
