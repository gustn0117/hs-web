"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PortalIcon, {
  type PortalIconName,
} from "@/components/client/PortalIcon";
import {
  PortalLoading,
  PortalErrorState,
} from "@/components/client/PortalState";
import PortalIllustration from "@/components/client/PortalIllustration";
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

const STATUS_MARK: Record<string, string> = {
  상담중: "markActive",
  진행중: "markActive",
  완료: "markDone",
  유지보수: "markDone",
};

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
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
  });
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
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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
  return Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
}

function getNextRenewalDate(
  endDate: string | null,
  billingCycle: string,
): string | null {
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

function getRenewalBadge(d: number): { text: string; cls: string } {
  if (d < 0) return { text: `${Math.abs(d)}일 지남`, cls: "markUrgent" };
  if (d <= 7) return { text: `D-${d}`, cls: "markUrgent" };
  if (d <= 30) return { text: `D-${d}`, cls: "markActive" };
  return { text: `D-${d}`, cls: "markDone" };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHead({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="portal-section-head">
      <h2>{title}</h2>
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
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const [accountCopied, setAccountCopied] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const router = useRouter();
  const handleNative = useCallback(() => setInApp(true), []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

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

  if (loading) return <PortalLoading />;
  if (error || !data)
    return (
      <PortalErrorState
        message={error || "잠시 후 다시 시도하거나 로그인해 주세요."}
      />
    );

  // Compute alerts
  const alerts: { type: "warning" | "danger"; message: string }[] = [];
  data.hosting.forEach((h) => {
    const renewal = getNextRenewalDate(h.end_date, h.billing_cycle);
    const d = renewal ? daysUntil(renewal) : null;
    if (isExpired(h.end_date) && !h.auto_renew)
      alerts.push({ type: "danger", message: `호스팅 "${h.provider}" 만료됨` });
    else if (d !== null && d >= 0 && d <= 30) {
      alerts.push({
        type: "warning",
        message: `호스팅 "${h.provider}" ${d}일 후 갱신 예정`,
      });
    }
  });
  data.domains.forEach((d) => {
    if (isExpired(d.expires_date))
      alerts.push({
        type: "danger",
        message: `도메인 "${d.domain_name}" 만료됨`,
      });
    else if (isExpiringSoon(d.expires_date)) {
      const days = daysUntil(d.expires_date);
      alerts.push({
        type: "warning",
        message: `도메인 "${d.domain_name}" ${days}일 후 만료`,
      });
    }
  });
  data.payments.forEach((p) => {
    if (p.status === "overdue")
      alerts.push({
        type: "danger",
        message: `미납 결제: ${p.description || p.type} (${formatAmount(p.amount)})`,
      });
  });

  const totalPending = data.payments
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .reduce((s, p) => s + Number(p.amount), 0);
  const activeProjects = data.projects.filter(
    (p) => p.status === "진행중" || p.status === "상담중",
  ).length;

  const tabConfig: { key: TabKey; label: string; icon: PortalIconName }[] = [
    { key: "overview", label: "홈", icon: "home" },
    { key: "projects", label: "프로젝트", icon: "project" },
    { key: "payments", label: "결제", icon: "wallet" },
    { key: "products", label: "서비스", icon: "bag" },
    { key: "settings", label: "내 정보", icon: "settings" },
  ];
  const pageTitles: Record<TabKey, { title: string; description: string }> = {
    overview: {
      title: `${data.client.name}님, 안녕하세요`,
      description: "오늘도 하온과 함께, 편안하게 관리하세요.",
    },
    projects: {
      title: "내 프로젝트",
      description: "만들어가는 과정부터 운영까지, 한눈에 확인하세요.",
    },
    payments: {
      title: "결제 내역",
      description: "결제할 금액과 지난 내역을 확인하세요.",
    },
    products: {
      title: "하온 서비스",
      description: "비즈니스에 필요한 다음 작업을 만나보세요.",
    },
    settings: {
      title: "내 정보",
      description: "계정과 앱 설정을 편하게 관리하세요.",
    },
  };
  const changeTab = (tab: TabKey) => {
    if (tab === activeTab) return;
    void tapFeedback();
    setActiveTab(tab);
    setAlertsOpen(false);
    setActionError("");
  };
  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText("1002163026503");
      setAccountCopied(true);
      setTimeout(() => setAccountCopied(false), 2000);
    } catch {
      setActionError(
        "계좌를 복사하지 못했어요. 계좌번호를 길게 눌러 복사해 주세요.",
      );
    }
  };
  const handleConfirmPayment = async (paymentId: string) => {
    setConfirmingId(paymentId);
    setActionError("");
    try {
      const res = await fetch("/api/client-auth/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      if (!res.ok) throw new Error();
      setData((prev) =>
        prev
          ? {
              ...prev,
              payments: prev.payments.map((p) =>
                p.id === paymentId ? { ...p, status: "confirming" } : p,
              ),
            }
          : prev,
      );
    } catch {
      setActionError(
        "입금 확인을 요청하지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setConfirmingId(null);
    }
  };
  const viewAll = (tab: TabKey) => (
    <button className="portal-text-button" onClick={() => changeTab(tab)}>
      전체 보기
      <PortalIcon name="arrow" />
    </button>
  );
  const projectRow = (project: Project, index: number, expanded = false) => (
    <Link
      key={project.id}
      href={`/client/dashboard/projects/${project.id}`}
      className={`portal-project-row pressRow ${expanded ? "is-expanded" : ""}`}
    >
      <span
        className={`portal-icon-box tone-${index % 3 === 0 ? "blue" : index % 3 === 1 ? "purple" : "green"}`}
      >
        <PortalIcon name="project" />
      </span>
      <span className="portal-row-copy">
        <span className="portal-row-title">{project.name}</span>
        <span className="portal-row-description">
          {project.website_url?.replace(/^https?:\/\//, "") ||
            project.platform ||
            project.tech_stack ||
            "프로젝트를 준비하고 있어요"}
        </span>
        {expanded && project.started_at && (
          <span className="portal-row-description">
            {formatShortDate(project.started_at)} 시작
            {project.completed_at
              ? ` · ${formatShortDate(project.completed_at)} 완료`
              : ""}
          </span>
        )}
      </span>
      <span
        className={`portal-badge ${STATUS_MARK[project.status] || "markDone"}`}
      >
        {project.status}
      </span>
      <PortalIcon name="arrow" className="portal-row-chevron" />
    </Link>
  );
  const paymentRow = (payment: Payment, actionable = false) => {
    const status = PAYMENT_STATUS[payment.status] || {
      label: payment.status,
      mark: "markDone",
    };
    const unpaid = payment.status === "pending" || payment.status === "overdue";
    return (
      <div
        key={payment.id}
        className={`portal-payment-row ${actionable ? "is-actionable" : ""}`}
      >
        <span
          className={`portal-icon-box ${unpaid ? "tone-orange" : "tone-gray"}`}
        >
          <PortalIcon name="receipt" />
        </span>
        <div className="portal-row-copy">
          <p className="portal-row-title">
            {payment.description || payment.type}
          </p>
          <p className="portal-row-description">
            {formatShortDate(payment.payment_date)} · {status.label}
          </p>
        </div>
        <p className={`portal-payment-amount ${unpaid ? "is-pending" : ""}`}>
          {formatAmount(payment.amount)}
        </p>
        {actionable && unpaid && (
          <button
            onClick={() => handleConfirmPayment(payment.id)}
            disabled={confirmingId === payment.id}
            className="portal-button portal-button-small portal-button-soft portal-payment-action"
          >
            {confirmingId === payment.id ? "요청 중…" : "입금했어요"}
          </button>
        )}
        {actionable && payment.status === "confirming" && (
          <span className="portal-badge markActive portal-payment-action">
            확인 중
          </span>
        )}
      </div>
    );
  };
  const renderOverview = () => {
    const soon: { kind: string; name: string; days: number; date: string }[] =
      [];
    data.hosting.forEach((hosting) => {
      const date = hosting.auto_renew
        ? getNextRenewalDate(hosting.end_date, hosting.billing_cycle)
        : hosting.end_date;
      const days = date ? daysUntil(date) : null;
      if (date && days !== null && days <= 60)
        soon.push({ kind: "호스팅", name: hosting.provider, days, date });
    });
    data.domains.forEach((domain) => {
      const days = daysUntil(domain.expires_date);
      if (domain.expires_date && days !== null && days <= 60)
        soon.push({
          kind: "도메인",
          name: domain.domain_name,
          days,
          date: domain.expires_date,
        });
    });
    soon.sort((a, b) => a.days - b.days);
    return (
      <div className="portal-home-grid">
        <section className="portal-card portal-summary-card">
          <div className="portal-card-topline">
            <span className="portal-eyebrow">나의 결제 현황</span>
            <span
              className={`portal-badge ${totalPending > 0 ? "markActive" : "markSuccess"}`}
            >
              {totalPending > 0 ? "결제 예정" : "미결제 없음"}
            </span>
          </div>
          <div
            className={`portal-summary-main ${totalPending >= 10_000_000 ? "has-large-amount" : ""}`}
          >
            <div>
              <p className="portal-summary-label">
                {totalPending > 0
                  ? "결제할 금액"
                  : "지금은 결제할 금액이 없어요"}
              </p>
              <p className="portal-big-amount">
                <CountUpAmount value={totalPending} />
              </p>
            </div>
            <PortalIllustration
              kind={totalPending > 0 ? "wallet" : "success"}
            />
          </div>
          <p className="portal-summary-note">
            {totalPending > 0
              ? "입금 후 알려주시면 하온이 확인해 드릴게요."
              : "필요한 소식이 생기면 여기에서 알려드릴게요."}
          </p>
          <div className="portal-button-group">
            <button
              className="portal-button portal-button-primary"
              onClick={() => changeTab("payments")}
            >
              {totalPending > 0 ? "결제 내역 확인하기" : "지난 결제 내역 보기"}
              <PortalIcon name="arrow" />
            </button>
            {totalPending > 0 && (
              <button
                className="portal-button portal-button-soft"
                onClick={copyAccount}
              >
                {accountCopied ? "복사했어요" : "계좌 복사"}
              </button>
            )}
          </div>
        </section>

        <section className="portal-card portal-service-summary">
          <SectionHead title="관리 중인 서비스" />
          <div className="portal-service-stats">
            {(
              [
                {
                  label: "프로젝트",
                  value: data.projects.length,
                  icon: "project",
                  tone: "blue",
                  action: () => changeTab("projects"),
                },
                {
                  label: "호스팅",
                  value: data.hosting.length,
                  icon: "server",
                  tone: "purple",
                  action: () =>
                    document
                      .getElementById("portal-operations")
                      ?.scrollIntoView({ block: "start" }),
                },
                {
                  label: "도메인",
                  value: data.domains.length,
                  icon: "globe",
                  tone: "green",
                  action: () =>
                    document
                      .getElementById("portal-operations")
                      ?.scrollIntoView({ block: "start" }),
                },
              ] as const
            ).map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="portal-stat-item"
              >
                <span className={`portal-icon-box tone-${item.tone}`}>
                  <PortalIcon name={item.icon} />
                </span>
                <span className="portal-stat-label">{item.label}</span>
                <span className="portal-stat-value">
                  {item.value}
                  <small>개</small>
                </span>
              </button>
            ))}
          </div>
          <div className="portal-service-note">
            <span className="portal-status-dot" />
            <span>
              {activeProjects > 0
                ? `${activeProjects}개의 프로젝트를 함께 만들고 있어요`
                : "하온이 서비스 운영을 함께할게요"}
            </span>
          </div>
        </section>

        <section className="portal-quick-menu" aria-label="빠른 메뉴">
          {(
            [
              {
                tab: "projects",
                icon: "project",
                label: "내 프로젝트",
                tone: "blue",
              },
              {
                tab: "payments",
                icon: "wallet",
                label: "결제 관리",
                tone: "purple",
              },
              {
                tab: "products",
                icon: "sparkles",
                label: "서비스 신청",
                tone: "orange",
              },
              {
                tab: "settings",
                icon: "shield",
                label: "계정 관리",
                tone: "green",
              },
            ] as const
          ).map((item) => (
            <button key={item.tab} onClick={() => changeTab(item.tab)}>
              <span className={`portal-icon-box tone-${item.tone}`}>
                <PortalIcon name={item.icon} />
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </section>

        <section className="portal-card">
          <SectionHead title="내 프로젝트" action={viewAll("projects")} />
          {data.projects.length > 0 ? (
            data.projects
              .slice(0, 3)
              .map((project, index) => projectRow(project, index))
          ) : (
            <EmptyState
              icon="M4 5h16v14H4zM8 9l3 3-3 3m6 0h3"
              message="첫 프로젝트를 기다리고 있어요"
            />
          )}
        </section>
        <section className="portal-card">
          <SectionHead title="최근 결제" action={viewAll("payments")} />
          {data.payments.length > 0 ? (
            [...data.payments]
              .sort((a, b) =>
                (b.payment_date || "").localeCompare(a.payment_date || ""),
              )
              .slice(0, 3)
              .map((payment) => paymentRow(payment))
          ) : (
            <EmptyState
              icon="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6m-6 4h6"
              message="아직 결제 내역이 없어요"
            />
          )}
        </section>

        <section
          className="portal-card portal-operations"
          id="portal-operations"
        >
          <SectionHead
            title="서비스 운영 현황"
            action={<span className="portal-eyebrow">호스팅 · 도메인</span>}
          />
          {data.hosting.length === 0 && data.domains.length === 0 ? (
            <EmptyState
              icon="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3v18"
              message="등록된 호스팅과 도메인이 없어요"
            />
          ) : (
            <div className="portal-operation-grid">
              {data.hosting.map((hosting) => {
                const date = hosting.auto_renew
                  ? getNextRenewalDate(hosting.end_date, hosting.billing_cycle)
                  : hosting.end_date;
                const days = daysUntil(date);
                const badge = days !== null ? getRenewalBadge(days) : null;
                return (
                  <div className="portal-operation-item" key={hosting.id}>
                    <span className="portal-icon-box tone-purple">
                      <PortalIcon name="server" />
                    </span>
                    <div className="portal-row-copy">
                      <p className="portal-row-title">
                        {hosting.provider || "호스팅"}
                      </p>
                      <p className="portal-row-description">
                        {hosting.plan || "호스팅"} ·{" "}
                        {formatAmount(hosting.amount)}/
                        {hosting.billing_cycle === "monthly" ? "월" : "연"}
                      </p>
                      {date && (
                        <p className="portal-row-description">
                          {formatShortDate(date)}{" "}
                          {hosting.auto_renew ? "갱신" : "만료"}
                        </p>
                      )}
                    </div>
                    {badge && (
                      <span className={`portal-badge ${badge.cls}`}>
                        {badge.text}
                      </span>
                    )}
                  </div>
                );
              })}
              {data.domains.map((domain) => {
                const days = daysUntil(domain.expires_date);
                const badge = days !== null ? getRenewalBadge(days) : null;
                return (
                  <div className="portal-operation-item" key={domain.id}>
                    <span className="portal-icon-box tone-green">
                      <PortalIcon name="globe" />
                    </span>
                    <div className="portal-row-copy">
                      <p className="portal-row-title">{domain.domain_name}</p>
                      <p className="portal-row-description">
                        {domain.registrar || "도메인"}
                      </p>
                      {domain.expires_date && (
                        <p className="portal-row-description">
                          {formatShortDate(domain.expires_date)} 만료
                        </p>
                      )}
                    </div>
                    {badge && (
                      <span className={`portal-badge ${badge.cls}`}>
                        {badge.text}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {soon.length > 0 && (
            <div className="portal-renewal-note">
              <PortalIcon name="clock" />
              <span>
                {soon[0].name}{" "}
                {soon[0].days < 0
                  ? `만료일이 ${Math.abs(soon[0].days)}일 지났어요`
                  : `갱신일까지 ${soon[0].days}일 남았어요`}
              </span>
            </div>
          )}
        </section>
        <button
          className="portal-discover-banner"
          onClick={() => changeTab("products")}
        >
          <span className="portal-icon-box tone-blue">
            <PortalIcon name="sparkles" />
          </span>
          <span>
            <strong>다음 아이디어도, 하온과 함께</strong>
            <span>비즈니스에 필요한 서비스를 둘러보세요</span>
          </span>
          <PortalIcon name="arrow" />
        </button>
      </div>
    );
  };
  const renderProjects = () => (
    <div className="portal-projects-content">
      <div className="portal-project-summary">
        <span className="portal-icon-box tone-blue">
          <PortalIcon name="project" />
        </span>
        <div>
          <p>함께 만들어가는 프로젝트</p>
          <strong>
            {data.projects.length}
            <small>개</small>
          </strong>
        </div>
        <span className="portal-badge markActive">
          진행 중 {activeProjects}개
        </span>
      </div>
      <section className="portal-card">
        <SectionHead
          title="전체 프로젝트"
          action={
            <span className="portal-eyebrow">{data.projects.length}개</span>
          }
        />
        {data.projects.length ? (
          data.projects.map((project, index) =>
            projectRow(project, index, true),
          )
        ) : (
          <EmptyState
            icon="M4 5h16v14H4zM8 9l3 3-3 3m6 0h3"
            message="아직 등록된 프로젝트가 없어요"
          />
        )}
      </section>
      <button
        className="portal-discover-banner"
        onClick={() => changeTab("products")}
      >
        <span className="portal-icon-box tone-purple">
          <PortalIcon name="sparkles" />
        </span>
        <span>
          <strong>새로운 프로젝트를 시작해 볼까요?</strong>
          <span>원하는 서비스를 골라 간편하게 신청하세요</span>
        </span>
        <PortalIcon name="arrow" />
      </button>
    </div>
  );
  const renderPayments = () => {
    const paid = data.payments
      .filter((payment) => payment.status === "paid")
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    const confirming = data.payments
      .filter((payment) => payment.status === "confirming")
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    const sorted = [...data.payments].sort((a, b) => {
      const order: Record<string, number> = {
        overdue: 0,
        pending: 1,
        confirming: 2,
        paid: 3,
      };
      return (
        (order[a.status] ?? 9) - (order[b.status] ?? 9) ||
        (b.payment_date || "").localeCompare(a.payment_date || "")
      );
    });
    return (
      <div className="portal-payments-content">
        <section className="portal-card portal-payment-summary">
          <div className="portal-card-topline">
            <span className="portal-eyebrow">결제할 금액</span>
            <span className="portal-icon-box tone-blue">
              <PortalIcon name="wallet" />
            </span>
          </div>
          <p className="portal-big-amount">
            <CountUpAmount value={totalPending} />
          </p>
          <div className="portal-payment-totals">
            <div>
              <span>결제 완료</span>
              <strong>{formatAmount(paid)}</strong>
            </div>
            <div>
              <span>입금 확인 중</span>
              <strong>{formatAmount(confirming)}</strong>
            </div>
          </div>
        </section>
        <section className="portal-card portal-bank-card">
          <span className="portal-bank-icon">W</span>
          <div className="portal-row-copy">
            <p className="portal-eyebrow">우리은행 · 예금주 심현수</p>
            <p className="portal-bank-account">1002-163-026503</p>
          </div>
          <button
            className="portal-button portal-button-small portal-button-soft"
            onClick={copyAccount}
          >
            {accountCopied ? "복사했어요" : "계좌 복사"}
          </button>
        </section>
        <section className="portal-card portal-payment-history">
          <SectionHead
            title="전체 결제 내역"
            action={
              <span className="portal-eyebrow">{data.payments.length}건</span>
            }
          />
          {sorted.length ? (
            sorted.map((payment) => paymentRow(payment, true))
          ) : (
            <EmptyState
              icon="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6m-6 4h6"
              message="아직 결제 내역이 없어요"
            />
          )}
        </section>
        <p className="portal-payment-help">
          <PortalIcon name="shield" />
          입금 확인은 담당자가 확인한 후 반영돼요.
        </p>
      </div>
    );
  };
  const renderSettings = () => (
    <div className="portal-settings-grid">
      <SettingsTab username={data.client.username} />
      <div className="portal-settings-aside">
        <AppSettings username={data.client.username} />
        <button className="portal-logout-button" onClick={handleLogout}>
          <PortalIcon name="logout" />
          로그아웃
        </button>
        {!inApp && (
          <Link className="portal-main-link" href="/">
            하온 홈페이지 방문하기
            <PortalIcon name="arrow" />
          </Link>
        )}
      </div>
    </div>
  );
  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "projects":
        return renderProjects();
      case "payments":
        return renderPayments();
      case "products":
        return <ProductsPanel />;
      case "settings":
        return renderSettings();
    }
  };
  const navigation = (location: "side" | "bottom") => (
    <nav
      className={`portal-${location}-nav`}
      aria-label={location === "side" ? "고객센터 탐색" : "고객센터 메뉴"}
    >
      {tabConfig.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => changeTab(tab.key)}
          aria-current={activeTab === tab.key ? "page" : undefined}
        >
          <span className="portal-nav-icon">
            <PortalIcon name={tab.icon} />
          </span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <div className="portal-app">
      <NativeBridge onNative={handleNative} />
      <header className="appHeader portal-header">
        <div className="portal-header-inner">
          <button
            className="portal-brand"
            onClick={() => changeTab("overview")}
            aria-label="하온 고객센터 홈"
          >
            <Image
              src="/brand/haon-mark.png"
              alt=""
              width={40}
              height={40}
              priority
            />
            <span>
              하온<span className="portal-brand-caption">고객센터</span>
            </span>
          </button>
          <div className="portal-header-actions">
            <div className="portal-notification-wrap">
              <button
                className="portal-icon-button"
                aria-label={`알림 ${alerts.length}개`}
                aria-expanded={alertsOpen}
                aria-controls="portal-notifications"
                onClick={() => setAlertsOpen(!alertsOpen)}
              >
                <PortalIcon name="bell" />
                {alerts.length > 0 && (
                  <span className="portal-notification-dot" />
                )}
              </button>
              {alertsOpen && (
                <section
                  className="portal-notifications"
                  id="portal-notifications"
                  aria-label="알림"
                >
                  <div className="portal-section-head">
                    <h2>
                      알림 <span>{alerts.length}</span>
                    </h2>
                    <button
                      className="portal-icon-button"
                      onClick={() => setAlertsOpen(false)}
                      aria-label="알림 닫기"
                    >
                      <PortalIcon name="close" />
                    </button>
                  </div>
                  {alerts.length ? (
                    alerts.map((alert, index) => (
                      <div
                        className={`portal-notification-item ${alert.type === "danger" ? "is-urgent" : ""}`}
                        key={index}
                      >
                        <PortalIcon name="clock" />
                        <p>{alert.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="portal-no-notifications">
                      새로운 알림이 없어요.
                    </p>
                  )}
                </section>
              )}
            </div>
            <button
              className="portal-avatar"
              onClick={() => changeTab("settings")}
              aria-label="내 정보 열기"
            >
              {data.client.name.charAt(0)}
            </button>
          </div>
        </div>
      </header>
      <div className="portal-layout">
        <aside className="portal-sidebar">
          <p className="portal-sidebar-label">MY HAON</p>
          {navigation("side")}
          <div className="portal-sidebar-note">
            <PortalIcon name="shield" />
            <strong>운영은 하온에게 맡기세요</strong>
            <p>
              프로젝트부터 운영까지
              <br />
              가장 가까운 비즈니스 파트너
            </p>
          </div>
          <button className="portal-sidebar-logout" onClick={handleLogout}>
            <PortalIcon name="logout" />
            로그아웃
          </button>
        </aside>
        <main className="portal-main" id="portal-main">
          <div className="portal-page-heading">
            <div>
              <p className="portal-page-overline">
                {activeTab === "overview" ? "MY BUSINESS PARTNER" : "MY HAON"}
              </p>
              <h1>
                {pageTitles[activeTab].title}
                {activeTab === "overview" && (
                  <span className="portal-greeting-dot">.</span>
                )}
              </h1>
              <p>{pageTitles[activeTab].description}</p>
            </div>
            {activeTab === "overview" && (
              <span className="portal-heading-status">
                <span className="portal-status-dot" />
                나의 비즈니스 한눈에 보기
              </span>
            )}
          </div>
          {actionError && (
            <div role="alert" className="portal-feedback-error">
              {actionError}
            </div>
          )}
          {accountCopied && (
            <div role="status" className="portal-toast">
              <PortalIcon name="check" />
              계좌번호를 복사했어요
            </div>
          )}
          <div key={activeTab} className="tabPanel">
            {renderActiveTab()}
          </div>
          <footer className="portal-footer">
            <span>HAON</span>
            <p>더 나은 비즈니스, 더 가까운 하온</p>
          </footer>
        </main>
      </div>
      {navigation("bottom")}
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
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
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
        setMessage({
          type: "error",
          text: result.error || "수정에 실패했습니다.",
        });
      } else {
        setMessage({
          type: "success",
          text: result.message || "정보가 수정되었습니다.",
        });
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

  const inputClass =
    "w-full px-4 py-2.5 border border-[var(--p-line)] rounded-xl text-sm text-[var(--color-dark)] bg-[var(--p-bg-sunk)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 focus:bg-white transition-all placeholder:text-[var(--p-faint)]";
  const labelClass = "portal-field-label";

  const EyeToggle = ({
    show,
    onToggle,
  }: {
    show: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--p-faint)] hover:text-[var(--p-ink-2)] bg-transparent border-none cursor-pointer p-1"
    >
      {show ? (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )}
    </button>
  );

  return (
    <div className="portal-account-settings">
      {/* Profile card */}
      <div className="portal-card portal-profile-card">
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="portal-profile-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[var(--color-dark)] font-bold">@{username}</p>
            <p className="text-[var(--color-gray)] text-xs mt-0.5">
              계정 정보를 관리할 수 있습니다
            </p>
          </div>
        </div>
      </div>

      {/* Settings form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {message && (
          <div
            role={message.type === "error" ? "alert" : "status"}
            className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
              message.type === "success"
                ? "bg-[var(--p-bg-sunk)] text-[var(--p-ink)] border border-[var(--p-line)]"
                : "bg-[var(--p-bg-sunk)] text-[var(--p-ink)] border border-[var(--p-line)]"
            }`}
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {message.type === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              )}
            </svg>
            {message.text}
          </div>
        )}

        {/* Current password - verification */}
        <div className="portal-card">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="portal-settings-title">본인 확인</h4>
          </div>
          <div>
            <label htmlFor="settings-current-password" className={labelClass}>
              현재 비밀번호
            </label>
            <div className="relative">
              <input
                id="settings-current-password"
                autoComplete="current-password"
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호를 입력하세요"
                className={`${inputClass} pr-10`}
              />
              <EyeToggle
                show={showCurrentPw}
                onToggle={() => setShowCurrentPw(!showCurrentPw)}
              />
            </div>
          </div>
        </div>

        {/* Change fields */}
        <div className="portal-card">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="portal-settings-title">변경 정보</h4>
            <span className="text-[var(--color-gray)] text-xs ml-auto">
              변경할 항목만 수정
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="settings-username" className={labelClass}>
                아이디
              </label>
              <input
                id="settings-username"
                autoComplete="username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="새 아이디 (3자 이상)"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="settings-new-password" className={labelClass}>
                  새 비밀번호
                </label>
                <div className="relative">
                  <input
                    id="settings-new-password"
                    autoComplete="new-password"
                    type={showNewPw ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="4자 이상"
                    className={`${inputClass} pr-10`}
                  />
                  <EyeToggle
                    show={showNewPw}
                    onToggle={() => setShowNewPw(!showNewPw)}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="settings-confirm-password"
                  className={labelClass}
                >
                  비밀번호 확인
                </label>
                <input
                  id="settings-confirm-password"
                  autoComplete="new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="다시 입력"
                  disabled={!newPassword}
                  className={`${inputClass} ${
                    confirmPassword && confirmPassword !== newPassword
                      ? "!border-[var(--p-line-firm)]"
                      : ""
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
          className="portal-button portal-button-primary portal-save-button"
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
    <div className="portal-empty-state">
      <div className="portal-empty-icon">
        <svg
          className="w-7 h-7 text-[var(--p-faint)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <p className="text-[var(--color-gray)] text-sm">{message}</p>
    </div>
  );
}
