import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import fs from "fs";
import http from "http";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

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

// ─── Helpers ───

const HOST_PROC = "/host/proc";
const HOST_ROOTFS = "/host/rootfs";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + units[i];
}

function readProcFile(path: string): string | null {
  try {
    return fs.readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}

// ─── System Metrics ───

function getMemoryInfo(): MetricResult<MemoryData> {
  const content = readProcFile(`${HOST_PROC}/meminfo`);
  if (!content) return { available: false, error: "meminfo를 읽을 수 없습니다" };

  try {
    const lines = content.split("\n");
    const getValue = (key: string): number => {
      const line = lines.find((l) => l.startsWith(key + ":"));
      if (!line) return 0;
      return parseInt(line.split(/\s+/)[1], 10); // kB
    };

    const totalKB = getValue("MemTotal");
    const availableKB = getValue("MemAvailable");
    const totalGB = totalKB / 1048576;
    const availableGB = availableKB / 1048576;
    const usedGB = totalGB - availableGB;
    const usagePercent = totalGB > 0 ? (usedGB / totalGB) * 100 : 0;

    return {
      available: true,
      data: {
        totalGB: Math.round(totalGB * 10) / 10,
        usedGB: Math.round(usedGB * 10) / 10,
        availableGB: Math.round(availableGB * 10) / 10,
        usagePercent: Math.round(usagePercent * 10) / 10,
      },
    };
  } catch {
    return { available: false, error: "meminfo 파싱 실패" };
  }
}

function getCpuLoad(): MetricResult<CpuData> {
  const loadavg = readProcFile(`${HOST_PROC}/loadavg`);
  if (!loadavg) return { available: false, error: "loadavg를 읽을 수 없습니다" };

  try {
    const parts = loadavg.trim().split(/\s+/);
    const load1 = parseFloat(parts[0]);
    const load5 = parseFloat(parts[1]);
    const load15 = parseFloat(parts[2]);

    // Count CPU cores
    let cores = 1;
    const cpuinfo = readProcFile(`${HOST_PROC}/cpuinfo`);
    if (cpuinfo) {
      const matches = cpuinfo.match(/^processor\s*:/gm);
      if (matches) cores = matches.length;
    }

    const usagePercent = Math.min((load1 / cores) * 100, 100);

    return {
      available: true,
      data: {
        load1: Math.round(load1 * 100) / 100,
        load5: Math.round(load5 * 100) / 100,
        load15: Math.round(load15 * 100) / 100,
        cores,
        usagePercent: Math.round(usagePercent * 10) / 10,
      },
    };
  } catch {
    return { available: false, error: "loadavg 파싱 실패" };
  }
}

function getUptime(): MetricResult<UptimeData> {
  const content = readProcFile(`${HOST_PROC}/uptime`);
  if (!content) return { available: false, error: "uptime을 읽을 수 없습니다" };

  try {
    const seconds = parseFloat(content.trim().split(/\s+/)[0]);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return { available: true, data: { days, hours, minutes } };
  } catch {
    return { available: false, error: "uptime 파싱 실패" };
  }
}

function getNetworkTraffic(): MetricResult<NetworkInterface[]> {
  // Try host PID 1's network namespace first (more accurate than /host/proc/net/dev
  // which shows container's network namespace)
  const hostNetDev = readProcFile(`${HOST_PROC}/1/net/dev`);
  const content = hostNetDev || readProcFile(`${HOST_PROC}/net/dev`);
  if (!content) return { available: false, error: "net/dev를 읽을 수 없습니다" };

  try {
    const lines = content.trim().split("\n").slice(2); // skip 2 header lines
    const interfaces: NetworkInterface[] = [];

    for (const line of lines) {
      const [namePart, rest] = line.split(":");
      if (!rest) continue;
      const name = namePart.trim();
      if (name === "lo") continue; // skip loopback

      const fields = rest.trim().split(/\s+/);
      const rxBytes = parseInt(fields[0], 10);
      const txBytes = parseInt(fields[8], 10);

      interfaces.push({
        name,
        rxBytes,
        txBytes,
        rxHuman: formatBytes(rxBytes),
        txHuman: formatBytes(txBytes),
      });
    }

    // Sort: physical interfaces first (eth/ens), then bridges, then virtual
    interfaces.sort((a, b) => {
      const order = (n: string) => {
        if (n.startsWith("eth") || n.startsWith("ens") || n.startsWith("enp")) return 0;
        if (n.startsWith("br-") || n.startsWith("docker") || n.startsWith("veth")) return 2;
        return 1;
      };
      return order(a.name) - order(b.name) || a.name.localeCompare(b.name);
    });

    return { available: true, data: interfaces };
  } catch {
    return { available: false, error: "net/dev 파싱 실패" };
  }
}

function getDiskUsage(): MetricResult<DiskData> {
  try {
    let output: string;
    try {
      output = execSync(`df -BG ${HOST_ROOTFS} 2>/dev/null`, {
        timeout: 5000,
        encoding: "utf-8",
      });
    } catch {
      try {
        output = execSync("df -BG / 2>/dev/null", {
          timeout: 5000,
          encoding: "utf-8",
        });
      } catch {
        return { available: false, error: "df 명령어 실행 실패" };
      }
    }

    const lines = output.trim().split("\n");
    if (lines.length < 2) return { available: false, error: "df 출력 파싱 실패" };

    // Handle case where df output wraps to two lines
    const dataLine = lines.slice(1).join(" ");
    const fields = dataLine.trim().split(/\s+/);

    const totalGB = parseInt(fields[1], 10);
    const usedGB = parseInt(fields[2], 10);
    const availableGB = parseInt(fields[3], 10);
    const usagePercent = totalGB > 0 ? (usedGB / totalGB) * 100 : 0;

    return {
      available: true,
      data: {
        totalGB,
        usedGB,
        availableGB,
        usagePercent: Math.round(usagePercent * 10) / 10,
      },
    };
  } catch {
    return { available: false, error: "디스크 정보 수집 실패" };
  }
}

function getListeningPorts(): MetricResult<PortData[]> {
  const ports = new Set<string>();

  // Try host PID 1's network namespace for accurate host ports
  for (const [file, protocol] of [
    [`${HOST_PROC}/1/net/tcp`, "tcp"],
    [`${HOST_PROC}/1/net/tcp6`, "tcp6"],
    [`${HOST_PROC}/net/tcp`, "tcp"],
    [`${HOST_PROC}/net/tcp6`, "tcp6"],
  ] as const) {
    const content = readProcFile(file);
    if (!content) continue;

    const lines = content.trim().split("\n").slice(1); // skip header
    for (const line of lines) {
      const fields = line.trim().split(/\s+/);
      if (fields.length < 4) continue;

      const state = fields[3];
      if (state !== "0A") continue; // 0A = LISTEN

      const localAddr = fields[1];
      const portHex = localAddr.split(":")[1];
      const port = parseInt(portHex, 16);

      if (port > 0) {
        ports.add(`${port}:${protocol}`);
      }
    }
  }

  const result: PortData[] = Array.from(ports)
    .map((entry) => {
      const [port, protocol] = entry.split(":");
      return { port: parseInt(port, 10), protocol };
    })
    .sort((a, b) => a.port - b.port);

  // Deduplicate: if both tcp and tcp6 have same port, keep just one entry
  const seen = new Map<number, PortData>();
  for (const p of result) {
    if (!seen.has(p.port)) {
      seen.set(p.port, p);
    }
  }

  return {
    available: result.length > 0,
    data: Array.from(seen.values()),
    ...(!result.length && { error: "리스닝 포트를 찾을 수 없습니다" }),
  };
}

// ─── Docker Metrics ───

function dockerRequest<T>(path: string): Promise<T | null> {
  return new Promise((resolve) => {
    try {
      const req = http.request(
        {
          socketPath: "/var/run/docker.sock",
          path,
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(data) as T);
            } catch {
              resolve(null);
            }
          });
        }
      );
      req.on("error", () => resolve(null));
      req.setTimeout(5000, () => {
        req.destroy();
        resolve(null);
      });
      req.end();
    } catch {
      resolve(null);
    }
  });
}

interface DockerContainerRaw {
  Id: string;
  Names: string[];
  Image: string;
  State: string;
  Status: string;
  Ports: { IP?: string; PrivatePort: number; PublicPort?: number; Type: string }[];
  Created: number;
  SizeRw?: number;
  SizeRootFs?: number;
}

interface DockerStatsRaw {
  cpu_stats: {
    cpu_usage: { total_usage: number };
    system_cpu_usage: number;
    online_cpus: number;
  };
  precpu_stats: {
    cpu_usage: { total_usage: number };
    system_cpu_usage: number;
  };
  memory_stats: {
    usage: number;
    limit: number;
  };
}

async function getDockerContainers(): Promise<{
  available: boolean;
  containers?: DockerContainer[];
  error?: string;
}> {
  const raw = await dockerRequest<DockerContainerRaw[]>(
    "/containers/json?all=true&size=true"
  );

  if (!raw || !Array.isArray(raw)) {
    return { available: false, error: "Docker 소켓에 연결할 수 없습니다" };
  }

  const containers: DockerContainer[] = raw.map((c) => ({
    id: c.Id.slice(0, 12),
    name: (c.Names[0] || "").replace(/^\//, ""),
    image: c.Image,
    state: c.State,
    status: c.Status,
    ports: (c.Ports || [])
      .filter((p) => p.PublicPort)
      .map((p) => ({
        public: p.PublicPort!,
        private: p.PrivatePort,
        type: p.Type,
      })),
    sizeRw: c.SizeRw ?? undefined,
    sizeRootFs: c.SizeRootFs ?? undefined,
    sizeHuman: c.SizeRw != null ? formatBytes(c.SizeRw) : undefined,
  }));

  // Fetch stats for running containers (max 10, with timeout)
  const running = containers.filter((c) => c.state === "running").slice(0, 10);

  const statsPromises = running.map(async (container) => {
    const stats = await dockerRequest<DockerStatsRaw>(
      `/containers/${container.id}/stats?stream=false`
    );
    if (!stats || !stats.cpu_stats || !stats.memory_stats) return;

    const cpuDelta =
      stats.cpu_stats.cpu_usage.total_usage -
      stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta =
      stats.cpu_stats.system_cpu_usage -
      stats.precpu_stats.system_cpu_usage;
    const cpuPercent =
      systemDelta > 0
        ? (cpuDelta / systemDelta) * (stats.cpu_stats.online_cpus || 1) * 100
        : 0;

    container.cpuPercent = Math.round(cpuPercent * 10) / 10;
    container.memoryUsageMB =
      Math.round((stats.memory_stats.usage / 1048576) * 10) / 10;
    container.memoryLimitMB =
      Math.round((stats.memory_stats.limit / 1048576) * 10) / 10;
  });

  // Wait max 8 seconds for all stats
  await Promise.race([
    Promise.allSettled(statsPromises),
    new Promise((resolve) => setTimeout(resolve, 8000)),
  ]);

  // Sort: running first, then by name
  containers.sort((a, b) => {
    if (a.state === "running" && b.state !== "running") return -1;
    if (a.state !== "running" && b.state === "running") return 1;
    return a.name.localeCompare(b.name);
  });

  return { available: true, containers };
}

// ─── Main Handler ───

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  const [memory, cpu, uptime, network, disk, ports, docker] =
    await Promise.all([
      getMemoryInfo(),
      getCpuLoad(),
      getUptime(),
      getNetworkTraffic(),
      getDiskUsage(),
      getListeningPorts(),
      getDockerContainers(),
    ]);

  return NextResponse.json({
    system: { memory, cpu, uptime, network, disk, ports },
    docker,
  });
}
