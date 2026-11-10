"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProductsPanel from "@/components/client/ProductsPanel";
import { onAppResume, tapFeedback } from "@/lib/native";
import AppSettings from "@/components/client/AppSettings";
import NativeBridge from "@/components/client/NativeBridge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Project {
  id: string;
  name: string;
  website_url: string | null;
  tech_stack: string | null;
  admin_url: string | null;
  admin_id: string | null;
  admin_pw: string | null;
  status: string;
  description: string | null;
  started_at: string | null;
  completed_at: string | null;
  unit_price: number | null;
  platform: string | null;
}

interface Hosting {
  id: string;
  project_id: string | null;
  provider: string;
  plan: string | null;
  amount: number;
  billing_cycle: string;
  start_date: string;
  end_date: string | null;
  auto_renew: boolean;
  memo: string | null;
}

interface Domain {
  id: string;
  project_id: string | null;
  domain_name: string;
  registrar: string | null;
  registered_date: string | null;
  expires_date: string | null;
  auto_renew: boolean;
  nameservers: string | null;
}

interface Payment {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  payment_date: string;
  status: string;
}

interface Marketing {
  id: string;
  project_id: string | null;
  type: string;
  title: string;
  description: string | null;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  memo: string | null;
}

interface ClientInfo {
  id: string;
  name: string;
  username: string;
  email: string | null;
  phone: string | null;
  memo: string | null;
  created_at: string;
}

interface DashboardData {
  client: ClientInfo;
  projects: Project[];
  hosting: Hosting[];
  domains: Domain[];
  payments: Payment[];
  marketing: Marketing[];
}

type TabKey = "overview" | "projects" | "payments" | "products" | "settings";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * 상태를 칠하는 방식.
 *
 * 흑백에서는 색으로 상태를 말할 수 없다. 그래서 중요도에 따라
 * 채우거나(검정), 테두리만 두르거나, 뒤로 물린다(회색). 뜻은 글자가
 * 지고 칠하기는 「지금 봐야 하나」만 전한다. 규칙은 portal.css 에 있다.
 */
const STATUS_MARK: Record<string, string> = {
  "상담중": "markActive",
  "진행중": "markActive",
  "완료": "markDone",
  "유지보수": "markDone",
};

/** 돈은 안 낸 것만 검정으로 채운다. 낸 것은 뒤로 물러나야 한다. */
const PAYMENT_STATUS: Record<string, { label: string; mark: string }> = {
  paid: { label: "완료", mark: "markDone" },
  confirming: { label: "확인 중", mark: "markActive" },
  pending: { label: "대기", mark: "markActive" },
  overdue: { label: "미납", mark: "markUrgent" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatShortDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ko-KR", { year: "2-digit", month: "numeric", day: "numeric" });
}

function formatAmount(amount: number): string {
  return Number(amount).toLocaleString() + "원";
}

/**
 * 숫자를 0 에서부터 세어 올린다.
 *
 * 총 결제액처럼 큰 수에만 쓴다. 프로젝트 2건 같은 작은 수는 올라가는
 * 것이 보이지도 않고 산만하다. 움직임을 꺼 둔 사람에게는 세지 않고
 * 결과만 바로 보여준다.
 */
function CountUpAmount({ value }: { value: number }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || value <= 0) {
      const id = window.setTimeout(() => setShown(value), 0);
      return () => window.clearTimeout(id);
    }

    const DURATION = 900;
    let raf = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / DURATION);
      // 끝에서 천천히 멈춘다. 일정한 속도로 올라가면 기계 같다.
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{formatAmount(shown)}</>;
}

function isExpiringSoon(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
}

function isExpired(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() < Date.now();
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function getNextRenewalDate(endDate: string | null, billingCycle: string): string | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  if (end > now) return endDate;
  const next = new Date(end);
  while (next <= now) {
    if (billingCycle === "yearly") next.setFullYear(next.getFullYear() + 1);
    else next.setMonth(next.getMonth() + 1);
  }
  return next.toISOString().split("T")[0];
}

/**
 * 갱신까지 남은 날을 칠하는 방식.
 *
 * 색을 쓸 때는 빨강·주황·회색으로 급한 정도를 말했다. 흑백에서는
 * 칠하기 세 단계(portal.css)로 같은 말을 한다.
 */
function getRenewalBadge(d: number): { text: string; cls: string } {
  if (d < 0) return { text: `${Math.abs(d)}일 지남`, cls: "markUrgent" };
  if (d <= 7) return { text: `D-${d}`, cls: "markUrgent" };
  if (d <= 30) return { text: `D-${d}`, cls: "markActive" };
  return { text: `D-${d}`, cls: "markDone" };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * 섹션 제목.
 *
 * 전에는 제목마다 아이콘이 붙어 있었는데, 그 아이콘들은 아무것도
 * 알려주지 않았다. 글자와 여백만으로 충분하다.
 */
function SectionHead({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between mb-1">
      <h3 className="text-[13px] font-bold tracking-[-0.01em] text-[var(--p-ink)]">{title}</h3>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ClientDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [inApp, setInApp] = useState(false);
  const [accountCopied, setAccountCopied] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const pull = (first: boolean) =>
      fetch("/api/client-auth/me")
        .then((res) => {
          if (!res.ok) throw new Error("인증 실패");
          return res.json();
        })
        .then(setData)
        .catch(() => {
          // 돌아왔을 때 한 번 실패한 거라면 보던 화면을 지우지 않는다.
          if (first) setError("데이터를 불러올 수 없습니다.");
        })
        .finally(() => {
          if (first) setLoading(false);
        });

    void pull(true);

    // 앱을 다시 열면 그때그때 새로 받는다.
    let stop = () => {};
    void onAppResume(() => void pull(false)).then((s) => {
      stop = s;
    });

    return () => stop();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/client-auth/logout", { method: "POST" });
    router.push("/client");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--p-line)]" />
            <div className="absolute inset-0 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
          </div>
          <p className="text-[var(--color-gray)] text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--p-bg-sunk)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--p-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-[var(--p-sub)] mb-2 font-medium">{error || "오류가 발생했습니다."}</p>
          <p className="text-[var(--color-gray)] text-sm mb-6">세션이 만료되었거나 연결에 문제가 있습니다.</p>
          <button
            onClick={() => router.push("/client")}
            className="px-6 py-2.5 bg-[var(--color-dark)] text-white rounded-xl text-sm font-semibold cursor-pointer border-none hover:bg-[var(--color-dark-2)] transition-colors"
          >
            다시 로그인
          </button>
        </div>
      </div>
    );
  }

  // Compute alerts
  const alerts: { type: "warning" | "danger"; message: string }[] = [];
  data.hosting.forEach((h) => {
    const renewal = getNextRenewalDate(h.end_date, h.billing_cycle);
    const d = renewal ? daysUntil(renewal) : null;
    if (isExpired(h.end_date) && !h.auto_renew) alerts.push({ type: "danger", message: `호스팅 "${h.provider}" 만료됨` });
    else if (d !== null && d >= 0 && d <= 30) {
      alerts.push({ type: "warning", message: `호스팅 "${h.provider}" ${d}일 후 갱신 예정` });
    }
  });
  data.domains.forEach((d) => {
    if (isExpired(d.expires_date)) alerts.push({ type: "danger", message: `도메인 "${d.domain_name}" 만료됨` });
    else if (isExpiringSoon(d.expires_date)) {
      const days = daysUntil(d.expires_date);
      alerts.push({ type: "warning", message: `도메인 "${d.domain_name}" ${days}일 후 만료` });
    }
  });
  data.payments.forEach((p) => {
    if (p.status === "overdue") alerts.push({ type: "danger", message: `미납 결제: ${p.description || p.type} (${formatAmount(p.amount)})` });
  });

  const totalPending = data.payments.filter((p) => p.status === "pending" || p.status === "overdue").reduce((s, p) => s + Number(p.amount), 0);
  const activeProjects = data.projects.filter((p) => p.status === "진행중" || p.status === "상담중").length;

  const tabConfig: { key: TabKey; label: string; short: string; icon: string }[] = [
    { key: "overview", short: "개요", label: "개요", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
    { key: "projects", short: "프로젝트", label: "프로젝트", icon: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" },
    { key: "payments", short: "결제", label: "결제 내역", icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" },
    { key: "products", short: "상품", label: "하온 상품", icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" },
    { key: "settings", short: "설정", label: "설정", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  // =========================================================================
  // Tab renderers
  // =========================================================================

  const renderOverview = () => {
    // 고객이 이 앱을 여는 이유는 거의 하나다 — 「내가 할 일이 있나」.
    // 그래서 할 일부터 세우고, 나머지는 그 아래로 민다.
    const soon: { kind: string; name: string; days: number; date: string }[] = [];

    data.hosting.forEach((h) => {
      const date = getNextRenewalDate(h.end_date, h.billing_cycle);
      const d = date ? daysUntil(date) : null;
      if (date && d !== null && d <= 60) soon.push({ kind: "호스팅", name: h.provider || "호스팅", days: d, date });
    });
    data.domains.forEach((x) => {
      const d = daysUntil(x.expires_date);
      if (x.expires_date && d !== null && d <= 60) soon.push({ kind: "도메인", name: x.domain_name, days: d, date: x.expires_date });
    });
    soon.sort((a, b) => a.days - b.days);

    const nothingYet =
      data.projects.length === 0 && data.payments.length === 0 &&
      data.hosting.length === 0 && data.domains.length === 0;

    return (
      <div className="space-y-10">
        {/* ── 할 일 ─────────────────────────────────────────────
            화면에서 가장 먼저, 가장 크게. 돈이 걸린 것이 있으면
            검정으로 채운 한 덩어리가 되고, 없으면 조용한 테두리가
            된다. 이 대비가 색을 대신한다. */}
        {totalPending > 0 ? (
          <section className="tileIn rounded-2xl bg-[var(--p-ink)] text-white px-6 py-7">
            <p className="text-[12px] text-white/55">내셔야 할 금액</p>
            <p className="mt-1.5 text-[34px] font-bold leading-none tracking-[-0.03em] tabular-nums">
              <CountUpAmount value={totalPending} />
            </p>
            <p className="mt-4 text-[13px] text-white/60 leading-[1.6]">
              우리은행 1002-163-026503
              <br />
              예금주 심현수
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={copyAccount}
                className="pressWide flex-1 min-h-[46px] rounded-xl bg-white text-[var(--p-ink)] text-[14px] font-bold border-none cursor-pointer"
              >
                {accountCopied ? "복사했어요" : "계좌 복사"}
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className="pressWide flex-1 min-h-[46px] rounded-xl bg-transparent text-white text-[14px] font-bold border border-white/35 cursor-pointer"
              >
                입금했어요
              </button>
            </div>
          </section>
        ) : (
          <section className="tileIn rounded-2xl border border-[var(--p-line)] px-6 py-7">
            {soon.length > 0 ? (
              <>
                <p className="text-[12px] text-[var(--p-sub)]">다음 할 일</p>
                <p className="mt-1.5 text-[22px] font-bold leading-tight tracking-[-0.02em] text-[var(--p-ink)]">
                  {formatShortDate(soon[0].date)} {soon[0].kind} 갱신
                </p>
                <p className="mt-2 text-[13px] text-[var(--p-sub)]">
                  {soon[0].name} · {soon[0].days}일 남음
                </p>
              </>
            ) : (
              <>
                <p className="text-[12px] text-[var(--p-sub)]">지금은</p>
                <p className="mt-1.5 text-[22px] font-bold leading-tight tracking-[-0.02em] text-[var(--p-ink)]">
                  하실 일이 없습니다
                </p>
                <p className="mt-2 text-[13px] text-[var(--p-sub)]">낼 돈도, 곧 만료되는 것도 없습니다.</p>
              </>
            )}
          </section>
        )}

        {nothingYet && (
          <p className="py-10 text-center text-[13px] text-[var(--p-sub)] leading-[1.8]">
            아직 등록된 내용이 없습니다.
            <br />
            하온에 문의하시면 바로 올려 드립니다.
          </p>
        )}

        {/* ── 맡긴 것 한 줄 ──────────────────────────────────── */}
        {!nothingYet && (
          <section className="grid grid-cols-3 border-y border-[var(--p-line)]">
            {[
              { label: "프로젝트", value: data.projects.length, note: activeProjects > 0 ? `${activeProjects}건 진행중` : null },
              { label: "호스팅", value: data.hosting.length, note: null },
              { label: "도메인", value: data.domains.length, note: null },
            ].map((x, i) => (
              <div
                key={x.label}
                className={`py-5 text-center ${i > 0 ? "border-l border-[var(--p-line)]" : ""}`}
              >
                <p className="text-[26px] font-bold leading-none tabular-nums text-[var(--p-ink)]">{x.value}</p>
                <p className="mt-1.5 text-[12px] text-[var(--p-sub)]">{x.label}</p>
                {x.note && <p className="mt-0.5 text-[11px] text-[var(--p-ink-2)]">{x.note}</p>}
              </div>
            ))}
          </section>
        )}

        {/* ── 프로젝트 ───────────────────────────────────────── */}
        {data.projects.length > 0 && (
          <section>
            <SectionHead
              title="프로젝트"
              action={
                data.projects.length > 3 ? (
                  <button onClick={() => setActiveTab("projects")} className="pressText text-[12px] font-semibold text-[var(--p-sub)] bg-transparent border-none cursor-pointer">
                    전체 보기
                  </button>
                ) : null
              }
            />
            <div>
              {data.projects.slice(0, 3).map((p) => (
                <Link
                  key={p.id}
                  href={`/client/dashboard/projects/${p.id}`}
                  className="pressRow no-underline flex items-center gap-3 py-4 border-b border-[var(--p-line)] last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-[var(--p-ink)] truncate">{p.name}</p>
                    <p className="mt-0.5 text-[12px] text-[var(--p-sub)] truncate">
                      {p.website_url || p.tech_stack || "준비 중"}
                    </p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-bold ${STATUS_MARK[p.status] || "markDone"}`}>
                    {p.status}
                  </span>
                  <svg className="w-4 h-4 shrink-0 text-[var(--p-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 결제 ───────────────────────────────────────────── */}
        {data.payments.length > 0 && (
          <section>
            <SectionHead
              title="결제"
              action={
                <button onClick={() => setActiveTab("payments")} className="pressText text-[12px] font-semibold text-[var(--p-sub)] bg-transparent border-none cursor-pointer">
                  전체 보기
                </button>
              }
            />
            <div>
              {data.payments.slice(0, 4).map((p) => {
                const st = PAYMENT_STATUS[p.status] || { label: p.status, mark: "markDone" };
                const unpaid = p.status === "pending" || p.status === "overdue";
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 py-4 border-b border-[var(--p-line)] last:border-b-0 ${unpaid ? "rowUrgent pl-3" : ""}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium text-[var(--p-ink)] truncate">{p.description || p.type}</p>
                      <p className="mt-0.5 text-[12px] text-[var(--p-sub)]">
                        {formatShortDate(p.payment_date)} · {st.label}
                      </p>
                    </div>
                    <span className={`shrink-0 text-[15px] tabular-nums ${p.status === "paid" ? "amountDone" : "amountUrgent"}`}>
                      {formatAmount(p.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 운영 ───────────────────────────────────────────
            호스팅과 도메인은 고객에게 「알아서 돌아가는 것」 하나다.
            따로 칸을 나누면 둘 다 반쯤 비어 보인다. */}
        {(data.hosting.length > 0 || data.domains.length > 0) && (
          <section>
            <SectionHead title="운영" />
            <div>
              {data.hosting.map((h) => {
                const date = getNextRenewalDate(h.end_date, h.billing_cycle);
                const d = date ? daysUntil(date) : null;
                const badge = d !== null ? getRenewalBadge(d) : null;
                return (
                  <div key={h.id} className="flex items-center gap-3 py-4 border-b border-[var(--p-line)] last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-[var(--p-ink)] truncate">
                        호스팅 · {h.provider || "-"}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[var(--p-sub)] truncate">
                        {h.plan ? `${h.plan} · ` : ""}
                        {formatAmount(h.amount)}/{h.billing_cycle === "monthly" ? "월" : "연"}
                        {date ? ` · ${formatShortDate(date)} 갱신` : ""}
                      </p>
                    </div>
                    {badge && (
                      <span className={`shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-bold tabular-nums ${badge.cls}`}>
                        {badge.text}
                      </span>
                    )}
                  </div>
                );
              })}
              {data.domains.map((x) => {
                const d = daysUntil(x.expires_date);
                const badge = d !== null ? getRenewalBadge(d) : null;
                return (
                  <div key={x.id} className="flex items-center gap-3 py-4 border-b border-[var(--p-line)] last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-[var(--p-ink)] truncate">{x.domain_name}</p>
                      <p className="mt-0.5 text-[12px] text-[var(--p-sub)] truncate">
                        {x.registrar || "도메인"}
                        {x.expires_date ? ` · ${formatShortDate(x.expires_date)} 만료` : ""}
                      </p>
                    </div>
                    {badge && (
                      <span className={`shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-bold tabular-nums ${badge.cls}`}>
                        {badge.text}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  };

  const renderProjects = () => (
    <div>
      {data.projects.length === 0 ? (
        <EmptyState icon="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" message="등록된 프로젝트가 없습니다." />
      ) : (
        <section>
          <SectionHead title={`프로젝트 ${data.projects.length}`} />
          {data.projects.map((p) => {
            // 기간·기술·운영 현황은 눌러서 들어가면 다 있다. 목록에서까지
            // 다 보여주려다 카드 안에 카드가 겹쳐 있었다. 목록은 목록답게 둔다.
            const span = p.completed_at
              ? `${formatShortDate(p.started_at)} ~ ${formatShortDate(p.completed_at)}`
              : p.started_at
                ? `${formatShortDate(p.started_at)} 시작`
                : null;
            const sub = [span, p.platform].filter(Boolean).join(" · ");
            return (
              <Link
                key={p.id}
                href={`/client/dashboard/projects/${p.id}`}
                className="pressRow no-underline flex items-start gap-3 py-5 border-b border-[var(--p-line)] last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-bold text-[var(--p-ink)] truncate">{p.name}</p>
                  {p.website_url && (
                    <p className="mt-1 text-[13px] text-[var(--p-ink-2)] truncate">{p.website_url}</p>
                  )}
                  {sub && <p className="mt-1 text-[12px] text-[var(--p-sub)] truncate">{sub}</p>}
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-bold ${STATUS_MARK[p.status] || "markDone"}`}>
                  {p.status}
                </span>
                <svg className="w-4 h-4 shrink-0 mt-0.5 text-[var(--p-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );

  const copyAccount = () => {
    navigator.clipboard.writeText("1002163026503");
    setAccountCopied(true);
    setTimeout(() => setAccountCopied(false), 2000);
  };

  const handleConfirmPayment = async (paymentId: string) => {
    setConfirmingId(paymentId);
    try {
      const res = await fetch("/api/client-auth/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      if (res.ok) {
        setData((prev) => prev ? {
          ...prev,
          payments: prev.payments.map((p) => p.id === paymentId ? { ...p, status: "confirming" } : p),
        } : prev);
      }
    } catch { /* ignore */ }
    finally { setConfirmingId(null); }
  };

  const renderPayments = () => {
    const paid = data.payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
    const pending = data.payments.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);
    const overdue = data.payments.filter((p) => p.status === "overdue").reduce((s, p) => s + Number(p.amount), 0);
    const confirming = data.payments.filter((p) => p.status === "confirming").reduce((s, p) => s + Number(p.amount), 0);
    const unpaid = pending + overdue;

    const sorted = [...data.payments].sort((a, b) => {
      const order: Record<string, number> = { overdue: 0, pending: 1, confirming: 2, paid: 3 };
      const diff = (order[a.status] ?? 9) - (order[b.status] ?? 9);
      if (diff !== 0) return diff;
      return (b.payment_date || "").localeCompare(a.payment_date || "");
    });

    return (
      <div className="space-y-9">
        {/* 입금 계좌. 개요에도 검정 덩어리가 있어서 여기서 또 채우면
            같은 것이 두 번 나온다. 여기서는 선으로만 둘러 둔다. */}
        <section className="rounded-2xl border border-[var(--p-line)] px-5 py-4 flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-[var(--p-sub)]">입금 계좌</p>
            <p className="mt-1 text-[15px] font-bold text-[var(--p-ink)] tabular-nums">우리은행 1002-163-026503</p>
            <p className="mt-0.5 text-[12px] text-[var(--p-sub)]">예금주 심현수</p>
          </div>
          <button
            onClick={copyAccount}
            className={`shrink-0 min-h-[40px] px-4 rounded-xl text-[13px] font-bold border cursor-pointer ${
              accountCopied
                ? "bg-[var(--p-fill)] text-[var(--p-sub)] border-transparent"
                : "bg-[var(--p-ink)] text-white border-transparent"
            }`}
          >
            {accountCopied ? "복사함" : "복사"}
          </button>
        </section>

        {data.payments.length === 0 ? (
          <EmptyState icon="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75" message="등록된 결제 내역이 없습니다." />
        ) : (
          <>
            {/* 개요의 석 줄 요약과 같은 생김새로 둔다. 탭마다 모양이
                다르면 같은 앱으로 안 보인다. */}
            <section className="grid grid-cols-3 border-y border-[var(--p-line)]">
              {[
                { label: "완료", amount: paid, urgent: false },
                { label: "확인 중", amount: confirming, urgent: false },
                { label: "미결제", amount: unpaid, urgent: unpaid > 0 },
              ].map((x, i) => (
                <div key={x.label} className={`py-5 px-2 text-center ${i > 0 ? "border-l border-[var(--p-line)]" : ""}`}>
                  <p className={`text-[15px] font-bold leading-none tabular-nums tracking-[-0.02em] ${x.urgent ? "text-[var(--p-ink)]" : "text-[var(--p-sub)]"}`}>
                    {formatAmount(x.amount)}
                  </p>
                  <p className="mt-1.5 text-[12px] text-[var(--p-sub)]">{x.label}</p>
                </div>
              ))}
            </section>

            <section>
              <SectionHead title="결제 내역" />
              {sorted.map((p) => {
                const st = PAYMENT_STATUS[p.status] || { label: p.status, mark: "markDone" };
                const isUnpaid = p.status === "pending" || p.status === "overdue";
                const isConfirming = p.status === "confirming";
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 py-4 border-b border-[var(--p-line)] last:border-b-0 ${isUnpaid ? "rowUrgent pl-3" : ""}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium text-[var(--p-ink)] truncate">
                        {p.description || p.type}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[var(--p-sub)]">
                        {formatShortDate(p.payment_date)} · {p.type} · {st.label}
                      </p>
                    </div>
                    <span className={`shrink-0 text-[15px] tabular-nums ${p.status === "paid" ? "amountDone" : "amountUrgent"}`}>
                      {formatAmount(p.amount)}
                    </span>
                    {isUnpaid && (
                      <button
                        onClick={() => handleConfirmPayment(p.id)}
                        disabled={confirmingId === p.id}
                        className="shrink-0 min-h-[34px] px-3 rounded-lg bg-[var(--p-ink)] text-white text-[12px] font-bold border-none cursor-pointer disabled:opacity-50"
                      >
                        {confirmingId === p.id ? "보내는 중" : "입금했어요"}
                      </button>
                    )}
                    {isConfirming && (
                      <span className="statePop shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-bold markActive">
                        확인 중
                      </span>
                    )}
                  </div>
                );
              })}
            </section>
          </>
        )}
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-4">
      <SettingsTab username={data.client.username} />
      <AppSettings username={data.client.username} />
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview": return renderOverview();
      case "projects": return renderProjects();
      case "payments": return renderPayments();
      case "products": return <ProductsPanel />;
      case "settings": return renderSettings();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <NativeBridge onNative={() => setInApp(true)} />

      {/* Header */}
      <header className="appHeader bg-white border-b border-[var(--p-line)] px-4 sm:px-6 py-3.5 sticky top-0 z-20">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div className="min-w-0">
            <Link href="/client/dashboard" className="no-underline inline-block" aria-label="하온 고객센터">
              <Image
                src="/brand/haon-logo.png"
                alt="하온 HAON Software Solutions"
                width={751}
                height={240}
                priority
                className="h-[26px] w-auto"
              />
            </Link>
            <p className="mt-1 text-[11px] text-[var(--p-sub)] truncate">{data.client.name}님</p>
          </div>
          <div className="flex items-center gap-3">
            {!inApp && (
              <Link
                href="/"
                className="px-3.5 py-2 bg-[var(--p-bg-sunk)] border border-[var(--p-line)] text-[var(--color-gray)] text-sm rounded-xl no-underline hover:bg-[var(--p-fill)] transition-all font-medium"
              >
                메인 사이트
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-[var(--p-bg-sunk)] border border-[var(--p-line)] text-[var(--color-gray)] text-sm rounded-xl cursor-pointer hover:bg-[var(--p-fill)] transition-all font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-[calc(84px+env(safe-area-inset-bottom))] md:pb-8">

        {/* Tab bar */}
        <div className="hidden md:flex gap-1 border-b border-[var(--p-line)] mb-8 overflow-x-auto">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors cursor-pointer bg-transparent whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[var(--color-accent)] text-[var(--color-dark)]"
                  : "border-transparent text-[var(--color-gray)] hover:text-[var(--color-dark)] hover:border-[var(--p-line-firm)]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content — key 가 바뀌면 다시 그려지면서 들어오는 모션이 돈다 */}
        <div key={activeTab} className="tabPanel">
          {renderActiveTab()}
        </div>

        {/* Footer */}
        <div className="mt-12 pb-8 text-center">
          <p className="text-[var(--color-gray-light)] text-xs">
            문의사항이 있으시면 관리자에게 연락해 주세요.
          </p>
        </div>
      </div>

      {/* 좁은 화면용 아래 탭 바 */}
      <nav
        aria-label="고객센터 메뉴"
        className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur border-t border-[var(--p-line)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                void tapFeedback();
                setActiveTab(tab.key);
              }}
              aria-current={activeTab === tab.key ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 min-h-[64px] border-none bg-transparent cursor-pointer transition-colors ${
                activeTab === tab.key ? "text-[var(--color-primary)]" : "text-[var(--color-gray)]"
              }`}
            >
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              <span className="text-[11px] font-semibold tracking-[-0.02em]">{tab.short}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings tab
// ---------------------------------------------------------------------------

function SettingsTab({ username }: { username: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState(username);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword) {
      setMessage({ type: "error", text: "현재 비밀번호를 입력해주세요." });
      return;
    }

    const usernameChanged = newUsername.trim() !== username;
    const passwordChanged = newPassword.length > 0;

    if (!usernameChanged && !passwordChanged) {
      setMessage({ type: "error", text: "변경할 항목이 없습니다." });
      return;
    }

    if (passwordChanged && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "새 비밀번호가 일치하지 않습니다." });
      return;
    }

    if (passwordChanged && newPassword.length < 4) {
      setMessage({ type: "error", text: "비밀번호는 4자 이상이어야 합니다." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/client-auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          ...(usernameChanged && { newUsername: newUsername.trim() }),
          ...(passwordChanged && { newPassword }),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: result.error || "수정에 실패했습니다." });
      } else {
        setMessage({ type: "success", text: result.message || "정보가 수정되었습니다." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMessage({ type: "error", text: "네트워크 오류가 발생했습니다." });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-[var(--p-line)] rounded-xl text-sm text-[var(--color-dark)] bg-[var(--p-bg-sunk)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 focus:bg-white transition-all placeholder:text-[var(--p-faint)]";
  const labelClass = "block text-xs font-medium text-[var(--color-gray)] mb-1.5 uppercase tracking-wide";

  const EyeToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--p-faint)] hover:text-[var(--p-ink-2)] bg-transparent border-none cursor-pointer p-1">
      {show ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      )}
    </button>
  );

  return (
    <div className="max-w-lg mx-auto">
      {/* Profile card */}
      <div className="bg-white border border-[var(--p-line)] rounded-2xl overflow-hidden mb-5">
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--p-ink)] flex items-center justify-center text-white text-lg font-bold shrink-0">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[var(--color-dark)] font-bold">@{username}</p>
            <p className="text-[var(--color-gray)] text-xs mt-0.5">계정 정보를 관리할 수 있습니다</p>
          </div>
        </div>
      </div>

      {/* Settings form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            message.type === "success"
              ? "bg-[var(--p-bg-sunk)] text-[var(--p-ink)] border border-[var(--p-line)]"
              : "bg-[var(--p-bg-sunk)] text-[var(--p-ink)] border border-[var(--p-line)]"
          }`}>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {message.type === "success"
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              }
            </svg>
            {message.text}
          </div>
        )}

        {/* Current password - verification */}
        <div className="bg-white border border-[var(--p-line)] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="text-[13px] font-bold tracking-[-0.01em] text-[var(--p-ink)]">본인 확인</h4>
          </div>
          <div>
            <label className={labelClass}>현재 비밀번호</label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호를 입력하세요"
                className={`${inputClass} pr-10`}
              />
              <EyeToggle show={showCurrentPw} onToggle={() => setShowCurrentPw(!showCurrentPw)} />
            </div>
          </div>
        </div>

        {/* Change fields */}
        <div className="bg-white border border-[var(--p-line)] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="text-[13px] font-bold tracking-[-0.01em] text-[var(--p-ink)]">변경 정보</h4>
            <span className="text-[var(--color-gray)] text-xs ml-auto">변경할 항목만 수정</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>아이디</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="새 아이디 (3자 이상)"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>새 비밀번호</label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="4자 이상"
                    className={`${inputClass} pr-10`}
                  />
                  <EyeToggle show={showNewPw} onToggle={() => setShowNewPw(!showNewPw)} />
                </div>
              </div>
              <div>
                <label className={labelClass}>비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="다시 입력"
                  disabled={!newPassword}
                  className={`${inputClass} ${
                    confirmPassword && confirmPassword !== newPassword ? "!border-[var(--p-line-firm)]" : ""
                  } disabled:opacity-40`}
                />
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-[var(--p-sub)] text-xs mt-1">불일치</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="pressWide w-full py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold cursor-pointer border-none hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "저장 중..." : "변경사항 저장"}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state helper
// ---------------------------------------------------------------------------

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--p-bg-sunk)] flex items-center justify-center">
        <svg className="w-8 h-8 text-[var(--p-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <p className="text-[var(--color-gray)] text-sm">{message}</p>
    </div>
  );
}
