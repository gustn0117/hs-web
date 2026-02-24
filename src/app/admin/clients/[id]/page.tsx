"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/app/admin/components/AdminHeader";

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

interface Client {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  memo: string;
  is_active: boolean;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  website_url: string;
  tech_stack: string;
  admin_url: string;
  admin_id: string;
  admin_pw: string;
  status: string;
  description: string;
  started_at: string;
  completed_at: string;
}

interface Hosting {
  id: string;
  provider: string;
  plan: string;
  amount: number;
  billing_cycle: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  memo: string;
}

interface Domain {
  id: string;
  domain_name: string;
  registrar: string;
  registered_date: string;
  expires_date: string;
  auto_renew: boolean;
  nameservers: string;
  memo: string;
}

interface Payment {
  id: string;
  payment_date: string;
  type: string;
  description: string;
  amount: number;
  status: string;
  memo: string;
}

type TabKey = "projects" | "hosting" | "domains" | "payments";

// ---------------------------------------------------------------------------
// Shared style constants
// ---------------------------------------------------------------------------

const inputClass =
  "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[var(--color-dark)] text-[0.95rem] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all placeholder:text-gray-400";
const labelClass =
  "block text-[var(--color-dark-2)] text-sm font-medium mb-2";
const cardClass =
  "bg-white border border-gray-200 rounded-xl p-5 shadow-sm";
const btnPrimary =
  "px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white rounded-xl text-sm font-semibold border-none cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed";
const btnSecondary =
  "px-5 py-2.5 bg-gray-100 border border-gray-200 text-[var(--color-gray)] rounded-xl text-sm font-semibold cursor-pointer transition-all hover:bg-gray-200";
const btnDanger =
  "px-3 py-1.5 bg-red-50 border border-red-200 text-red-500 text-[0.8rem] rounded-lg cursor-pointer hover:bg-red-100 transition-all";
const btnSmall =
  "px-3 py-1.5 bg-gray-100 border border-gray-200 text-[var(--color-gray)] text-[0.8rem] rounded-lg cursor-pointer hover:bg-gray-200 hover:text-[var(--color-dark)] transition-all";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isWithin30Days(dateStr: string): boolean {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return diff >= 0 && diff <= 30 * 24 * 60 * 60 * 1000;
}

function isExpired(dateStr: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() < Date.now();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatAmount(amount: number): string {
  return Number(amount).toLocaleString() + "원";
}

const PROJECT_STATUS_COLORS: Record<string, string> = {
  "상담중": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "진행중": "bg-blue-50 text-blue-700 border border-blue-200",
  "완료": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "유지보수": "bg-purple-50 text-purple-700 border border-purple-200",
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  paid: { label: "완료", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  pending: { label: "대기", cls: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  overdue: { label: "미납", cls: "bg-red-50 text-red-700 border border-red-200" },
};

// ---------------------------------------------------------------------------
// Default form data factories
// ---------------------------------------------------------------------------

const defaultProjectForm = (): Omit<Project, "id"> => ({
  name: "",
  website_url: "",
  tech_stack: "",
  admin_url: "",
  admin_id: "",
  admin_pw: "",
  status: "상담중",
  description: "",
  started_at: "",
  completed_at: "",
});

const defaultHostingForm = (): Omit<Hosting, "id"> => ({
  provider: "",
  plan: "",
  amount: 0,
  billing_cycle: "monthly",
  start_date: "",
  end_date: "",
  auto_renew: false,
  memo: "",
});

const defaultDomainForm = (): Omit<Domain, "id"> => ({
  domain_name: "",
  registrar: "",
  registered_date: "",
  expires_date: "",
  auto_renew: false,
  nameservers: "",
  memo: "",
});

const defaultPaymentForm = (): Omit<Payment, "id"> => ({
  payment_date: "",
  type: "제작비",
  description: "",
  amount: 0,
  status: "pending",
  memo: "",
});

// ===========================================================================
// Main component
// ===========================================================================

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;

  // --- Client state ---
  const [client, setClient] = useState<Client | null>(null);
  const [clientLoading, setClientLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(false);
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    memo: "",
    is_active: true,
    password: "",
  });

  // --- Tab state ---
  const [activeTab, setActiveTab] = useState<TabKey>("projects");

  // --- Projects state ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState(defaultProjectForm());

  // --- Hosting state ---
  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [hostingLoading, setHostingLoading] = useState(false);
  const [showHostingForm, setShowHostingForm] = useState(false);
  const [editingHostingId, setEditingHostingId] = useState<string | null>(null);
  const [hostingForm, setHostingForm] = useState(defaultHostingForm());

  // --- Domains state ---
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainsLoading, setDomainsLoading] = useState(false);
  const [showDomainForm, setShowDomainForm] = useState(false);
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null);
  const [domainForm, setDomainForm] = useState(defaultDomainForm());

  // --- Payments state ---
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState(defaultPaymentForm());

  // =========================================================================
  // Data fetching
  // =========================================================================

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      if (!res.ok) return;
      const data = await res.json();
      setClient(data.client ?? data);
    } catch {
      console.error("클라이언트 정보를 불러오는데 실패했습니다.");
    } finally {
      setClientLoading(false);
    }
  }, [clientId]);

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/projects`);
      const data = await res.json();
      setProjects(data.projects ?? []);
    } catch {
      console.error("프로젝트 목록을 불러오는데 실패했습니다.");
    } finally {
      setProjectsLoading(false);
    }
  }, [clientId]);

  const fetchHostings = useCallback(async () => {
    setHostingLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/hosting`);
      const data = await res.json();
      setHostings(data.hosting ?? []);
    } catch {
      console.error("호스팅 목록을 불러오는데 실패했습니다.");
    } finally {
      setHostingLoading(false);
    }
  }, [clientId]);

  const fetchDomains = useCallback(async () => {
    setDomainsLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/domains`);
      const data = await res.json();
      setDomains(data.domains ?? []);
    } catch {
      console.error("도메인 목록을 불러오는데 실패했습니다.");
    } finally {
      setDomainsLoading(false);
    }
  }, [clientId]);

  const fetchPayments = useCallback(async () => {
    setPaymentsLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/payments`);
      const data = await res.json();
      setPayments(data.payments ?? []);
    } catch {
      console.error("결제 목록을 불러오는데 실패했습니다.");
    } finally {
      setPaymentsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  useEffect(() => {
    if (activeTab === "projects") fetchProjects();
    else if (activeTab === "hosting") fetchHostings();
    else if (activeTab === "domains") fetchDomains();
    else if (activeTab === "payments") fetchPayments();
  }, [activeTab, fetchProjects, fetchHostings, fetchDomains, fetchPayments]);

  // =========================================================================
  // Client edit handlers
  // =========================================================================

  const startEditClient = () => {
    if (!client) return;
    setClientForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      memo: client.memo || "",
      is_active: client.is_active,
      password: "",
    });
    setEditingClient(true);
  };

  const saveClient = async () => {
    const body: Record<string, unknown> = {
      name: clientForm.name,
      email: clientForm.email,
      phone: clientForm.phone,
      memo: clientForm.memo,
      is_active: clientForm.is_active,
    };
    if (clientForm.password) body.password = clientForm.password;

    const res = await fetch(`/api/clients/${clientId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      setClient(data.client ?? data);
      setEditingClient(false);
    }
  };

  // =========================================================================
  // Projects CRUD
  // =========================================================================

  const openProjectAdd = () => {
    setProjectForm(defaultProjectForm());
    setEditingProjectId(null);
    setShowProjectForm(true);
  };

  const openProjectEdit = (p: Project) => {
    setProjectForm({
      name: p.name || "",
      website_url: p.website_url || "",
      tech_stack: p.tech_stack || "",
      admin_url: p.admin_url || "",
      admin_id: p.admin_id || "",
      admin_pw: p.admin_pw || "",
      status: p.status || "상담중",
      description: p.description || "",
      started_at: p.started_at ?? "",
      completed_at: p.completed_at ?? "",
    });
    setEditingProjectId(p.id);
    setShowProjectForm(true);
  };

  const saveProject = async () => {
    if (editingProjectId) {
      const res = await fetch(`/api/clients/${clientId}/projects/${editingProjectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      });
      if (res.ok) {
        const data = await res.json();
        const updated = data.project ?? data;
        setProjects((prev) => prev.map((p) => (p.id === editingProjectId ? updated : p)));
      }
    } else {
      const res = await fetch(`/api/clients/${clientId}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => [...prev, data.project ?? data]);
      }
    }
    setShowProjectForm(false);
    setEditingProjectId(null);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("이 프로젝트를 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/clients/${clientId}/projects/${id}`, { method: "DELETE" });
    if (res.ok) setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // =========================================================================
  // Hosting CRUD
  // =========================================================================

  const openHostingAdd = () => {
    setHostingForm(defaultHostingForm());
    setEditingHostingId(null);
    setShowHostingForm(true);
  };

  const openHostingEdit = (h: Hosting) => {
    setHostingForm({
      provider: h.provider || "",
      plan: h.plan || "",
      amount: h.amount,
      billing_cycle: h.billing_cycle || "monthly",
      start_date: h.start_date ?? "",
      end_date: h.end_date ?? "",
      auto_renew: h.auto_renew,
      memo: h.memo || "",
    });
    setEditingHostingId(h.id);
    setShowHostingForm(true);
  };

  const saveHosting = async () => {
    if (editingHostingId) {
      const res = await fetch(`/api/clients/${clientId}/hosting/${editingHostingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hostingForm),
      });
      if (res.ok) {
        const data = await res.json();
        const updated = data.hosting ?? data;
        setHostings((prev) => prev.map((h) => (h.id === editingHostingId ? updated : h)));
      }
    } else {
      const res = await fetch(`/api/clients/${clientId}/hosting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hostingForm),
      });
      if (res.ok) {
        const data = await res.json();
        setHostings((prev) => [...prev, data.hosting ?? data]);
      }
    }
    setShowHostingForm(false);
    setEditingHostingId(null);
  };

  const deleteHosting = async (id: string) => {
    if (!confirm("이 호스팅 정보를 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/clients/${clientId}/hosting/${id}`, { method: "DELETE" });
    if (res.ok) setHostings((prev) => prev.filter((h) => h.id !== id));
  };

  // =========================================================================
  // Domains CRUD
  // =========================================================================

  const openDomainAdd = () => {
    setDomainForm(defaultDomainForm());
    setEditingDomainId(null);
    setShowDomainForm(true);
  };

  const openDomainEdit = (d: Domain) => {
    setDomainForm({
      domain_name: d.domain_name || "",
      registrar: d.registrar || "",
      registered_date: d.registered_date ?? "",
      expires_date: d.expires_date ?? "",
      auto_renew: d.auto_renew,
      nameservers: d.nameservers || "",
      memo: d.memo || "",
    });
    setEditingDomainId(d.id);
    setShowDomainForm(true);
  };

  const saveDomain = async () => {
    if (editingDomainId) {
      const res = await fetch(`/api/clients/${clientId}/domains/${editingDomainId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(domainForm),
      });
      if (res.ok) {
        const data = await res.json();
        const updated = data.domain ?? data;
        setDomains((prev) => prev.map((d) => (d.id === editingDomainId ? updated : d)));
      }
    } else {
      const res = await fetch(`/api/clients/${clientId}/domains`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(domainForm),
      });
      if (res.ok) {
        const data = await res.json();
        setDomains((prev) => [...prev, data.domain ?? data]);
      }
    }
    setShowDomainForm(false);
    setEditingDomainId(null);
  };

  const deleteDomain = async (id: string) => {
    if (!confirm("이 도메인 정보를 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/clients/${clientId}/domains/${id}`, { method: "DELETE" });
    if (res.ok) setDomains((prev) => prev.filter((d) => d.id !== id));
  };

  // =========================================================================
  // Payments CRUD
  // =========================================================================

  const openPaymentAdd = () => {
    setPaymentForm(defaultPaymentForm());
    setEditingPaymentId(null);
    setShowPaymentForm(true);
  };

  const openPaymentEdit = (p: Payment) => {
    setPaymentForm({
      payment_date: p.payment_date ?? "",
      type: p.type || "제작비",
      description: p.description || "",
      amount: p.amount,
      status: p.status || "pending",
      memo: p.memo || "",
    });
    setEditingPaymentId(p.id);
    setShowPaymentForm(true);
  };

  const savePayment = async () => {
    if (editingPaymentId) {
      const res = await fetch(`/api/clients/${clientId}/payments/${editingPaymentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentForm),
      });
      if (res.ok) {
        const data = await res.json();
        const updated = data.payment ?? data;
        setPayments((prev) => prev.map((p) => (p.id === editingPaymentId ? updated : p)));
      }
    } else {
      const res = await fetch(`/api/clients/${clientId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentForm),
      });
      if (res.ok) {
        const data = await res.json();
        setPayments((prev) => [...prev, data.payment ?? data]);
      }
    }
    setShowPaymentForm(false);
    setEditingPaymentId(null);
  };

  const deletePayment = async (id: string) => {
    if (!confirm("이 결제 내역을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/clients/${clientId}/payments/${id}`, { method: "DELETE" });
    if (res.ok) setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  // =========================================================================
  // Inline form component
  // =========================================================================

  const FormCard = ({
    title,
    onSave,
    onCancel,
    children,
  }: {
    title: string;
    onSave: () => void;
    onCancel: () => void;
    children: React.ReactNode;
  }) => (
    <div className={`${cardClass} mb-5 border-[var(--color-primary)]/20`}>
      <h4 className="text-[var(--color-dark)] font-semibold mb-4">{title}</h4>
      {children}
      <div className="flex gap-3 mt-5">
        <button onClick={onSave} className={btnPrimary}>저장</button>
        <button onClick={onCancel} className={btnSecondary}>취소</button>
      </div>
    </div>
  );

  // =========================================================================
  // Tab renderers
  // =========================================================================

  const renderProjectsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[var(--color-dark)] font-semibold">
          프로젝트
          <span className="text-[var(--color-gray)] font-normal text-sm ml-2">
            {projects.length}건
          </span>
        </h3>
        <button onClick={openProjectAdd} className={btnPrimary}>+ 추가</button>
      </div>

      {showProjectForm && (
        <FormCard
          title={editingProjectId ? "프로젝트 수정" : "새 프로젝트"}
          onSave={saveProject}
          onCancel={() => { setShowProjectForm(false); setEditingProjectId(null); }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>프로젝트명 *</label>
              <input className={inputClass} placeholder="프로젝트명" value={projectForm.name} onChange={(e) => setProjectForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>상태</label>
              <select className={inputClass} value={projectForm.status} onChange={(e) => setProjectForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="상담중">상담중</option>
                <option value="진행중">진행중</option>
                <option value="완료">완료</option>
                <option value="유지보수">유지보수</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>웹사이트 URL</label>
              <input className={inputClass} placeholder="https://example.com" value={projectForm.website_url} onChange={(e) => setProjectForm((p) => ({ ...p, website_url: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>기술 스택</label>
              <input className={inputClass} placeholder="Next.js, React, ..." value={projectForm.tech_stack} onChange={(e) => setProjectForm((p) => ({ ...p, tech_stack: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>관리자 URL</label>
              <input className={inputClass} placeholder="https://example.com/admin" value={projectForm.admin_url} onChange={(e) => setProjectForm((p) => ({ ...p, admin_url: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>관리자 ID</label>
              <input className={inputClass} placeholder="admin ID" value={projectForm.admin_id} onChange={(e) => setProjectForm((p) => ({ ...p, admin_id: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>관리자 PW</label>
              <input className={inputClass} placeholder="admin PW" value={projectForm.admin_pw} onChange={(e) => setProjectForm((p) => ({ ...p, admin_pw: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>시작일</label>
              <input type="date" className={inputClass} value={projectForm.started_at} onChange={(e) => setProjectForm((p) => ({ ...p, started_at: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>완료일</label>
              <input type="date" className={inputClass} value={projectForm.completed_at} onChange={(e) => setProjectForm((p) => ({ ...p, completed_at: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className={labelClass}>설명</label>
            <textarea className={`${inputClass} resize-y`} rows={3} placeholder="프로젝트에 대한 설명" value={projectForm.description} onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
        </FormCard>
      )}

      {projectsLoading ? (
        <div className="text-center py-10 text-[var(--color-gray)]">로딩 중...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-gray)]">
          <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
          </svg>
          등록된 프로젝트가 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.id} className={cardClass}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[var(--color-dark)] font-semibold text-[0.95rem]">{p.name}</h4>
                    <span className={`px-2.5 py-0.5 text-[0.7rem] font-semibold rounded-full whitespace-nowrap ${PROJECT_STATUS_COLORS[p.status] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                      {p.status}
                    </span>
                  </div>
                  {p.website_url && (
                    <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] text-sm no-underline hover:underline break-all">
                      {p.website_url}
                    </a>
                  )}
                </div>
                <div className="flex gap-1.5 ml-3 shrink-0">
                  <button onClick={() => openProjectEdit(p)} className={btnSmall}>수정</button>
                  <button onClick={() => deleteProject(p.id)} className={btnDanger}>삭제</button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {p.tech_stack && (
                  <div>
                    <span className="text-[var(--color-gray)] text-xs block">기술 스택</span>
                    <span className="text-[var(--color-dark-2)]">{p.tech_stack}</span>
                  </div>
                )}
                {p.admin_url && (
                  <div>
                    <span className="text-[var(--color-gray)] text-xs block">관리자 URL</span>
                    <a href={p.admin_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline truncate block">{p.admin_url}</a>
                  </div>
                )}
                {p.admin_id && (
                  <div>
                    <span className="text-[var(--color-gray)] text-xs block">관리자 ID</span>
                    <span className="text-[var(--color-dark-2)]">{p.admin_id}</span>
                  </div>
                )}
                {p.admin_pw && (
                  <div>
                    <span className="text-[var(--color-gray)] text-xs block">관리자 PW</span>
                    <span className="text-[var(--color-dark-2)]">{p.admin_pw}</span>
                  </div>
                )}
                {p.started_at && (
                  <div>
                    <span className="text-[var(--color-gray)] text-xs block">시작일</span>
                    <span className="text-[var(--color-dark-2)]">{p.started_at}</span>
                  </div>
                )}
                {p.completed_at && (
                  <div>
                    <span className="text-[var(--color-gray)] text-xs block">완료일</span>
                    <span className="text-[var(--color-dark-2)]">{p.completed_at}</span>
                  </div>
                )}
              </div>
              {p.description && (
                <p className="mt-3 pt-3 border-t border-gray-100 text-[var(--color-gray)] text-sm">{p.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderHostingTab = () => (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[var(--color-dark)] font-semibold">
          호스팅
          <span className="text-[var(--color-gray)] font-normal text-sm ml-2">{hostings.length}건</span>
        </h3>
        <button onClick={openHostingAdd} className={btnPrimary}>+ 추가</button>
      </div>

      {showHostingForm && (
        <FormCard
          title={editingHostingId ? "호스팅 수정" : "새 호스팅"}
          onSave={saveHosting}
          onCancel={() => { setShowHostingForm(false); setEditingHostingId(null); }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>호스팅 업체 *</label>
              <input className={inputClass} placeholder="카페24, AWS, ..." value={hostingForm.provider} onChange={(e) => setHostingForm((p) => ({ ...p, provider: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>플랜</label>
              <input className={inputClass} placeholder="Basic, Pro, ..." value={hostingForm.plan} onChange={(e) => setHostingForm((p) => ({ ...p, plan: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>금액 (원)</label>
              <input type="number" className={inputClass} placeholder="0" value={hostingForm.amount || ""} onChange={(e) => setHostingForm((p) => ({ ...p, amount: Number(e.target.value) }))} />
            </div>
            <div>
              <label className={labelClass}>결제 주기</label>
              <select className={inputClass} value={hostingForm.billing_cycle} onChange={(e) => setHostingForm((p) => ({ ...p, billing_cycle: e.target.value }))}>
                <option value="monthly">월간</option>
                <option value="yearly">연간</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>시작일</label>
              <input type="date" className={inputClass} value={hostingForm.start_date} onChange={(e) => setHostingForm((p) => ({ ...p, start_date: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>만료일</label>
              <input type="date" className={inputClass} value={hostingForm.end_date} onChange={(e) => setHostingForm((p) => ({ ...p, end_date: e.target.value }))} />
            </div>
          </div>
          <div className="mb-4">
            <label className={labelClass}>메모</label>
            <textarea className={`${inputClass} resize-y`} rows={2} placeholder="호스팅 관련 메모" value={hostingForm.memo} onChange={(e) => setHostingForm((p) => ({ ...p, memo: e.target.value }))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={hostingForm.auto_renew} onChange={(e) => setHostingForm((p) => ({ ...p, auto_renew: e.target.checked }))} className="w-4 h-4 rounded accent-[var(--color-primary)]" />
            <span className="text-[var(--color-dark-2)] text-sm">자동 갱신</span>
          </label>
        </FormCard>
      )}

      {hostingLoading ? (
        <div className="text-center py-10 text-[var(--color-gray)]">로딩 중...</div>
      ) : hostings.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-gray)]">
          <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" />
          </svg>
          등록된 호스팅 정보가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {hostings.map((h) => (
            <div key={h.id} className={cardClass}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-[var(--color-dark)] font-semibold text-[0.95rem]">{h.provider}</h4>
                  {h.plan && <p className="text-[var(--color-gray)] text-sm">{h.plan}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {h.auto_renew && (
                    <span className="px-2 py-0.5 text-[0.7rem] font-semibold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">자동갱신</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-[var(--color-gray)]">금액</span>
                  <span className="text-[var(--color-dark)] font-semibold">
                    {formatAmount(h.amount)} / {h.billing_cycle === "monthly" ? "월" : "년"}
                  </span>
                </div>
                {h.start_date && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-gray)]">시작일</span>
                    <span className="text-[var(--color-dark-2)]">{h.start_date}</span>
                  </div>
                )}
                {h.end_date && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-gray)]">만료일</span>
                    <span className={`font-medium ${isExpired(h.end_date) ? "text-red-600" : isWithin30Days(h.end_date) ? "text-orange-500" : "text-[var(--color-dark-2)]"}`}>
                      {h.end_date}
                      {isExpired(h.end_date) && <span className="ml-1 text-[0.7rem]">(만료됨)</span>}
                      {!isExpired(h.end_date) && isWithin30Days(h.end_date) && <span className="ml-1 text-[0.7rem]">(만료 임박)</span>}
                    </span>
                  </div>
                )}
              </div>
              {h.memo && <p className="text-[var(--color-gray)] text-sm mb-3 bg-gray-50 rounded-lg px-3 py-2">{h.memo}</p>}

              <div className="flex gap-1.5 pt-3 border-t border-gray-100">
                <button onClick={() => openHostingEdit(h)} className={btnSmall}>수정</button>
                <button onClick={() => deleteHosting(h.id)} className={btnDanger}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDomainsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[var(--color-dark)] font-semibold">
          도메인
          <span className="text-[var(--color-gray)] font-normal text-sm ml-2">{domains.length}건</span>
        </h3>
        <button onClick={openDomainAdd} className={btnPrimary}>+ 추가</button>
      </div>

      {showDomainForm && (
        <FormCard
          title={editingDomainId ? "도메인 수정" : "새 도메인"}
          onSave={saveDomain}
          onCancel={() => { setShowDomainForm(false); setEditingDomainId(null); }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>도메인명 *</label>
              <input className={inputClass} placeholder="example.com" value={domainForm.domain_name} onChange={(e) => setDomainForm((p) => ({ ...p, domain_name: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>등록기관</label>
              <input className={inputClass} placeholder="가비아, 후이즈, ..." value={domainForm.registrar} onChange={(e) => setDomainForm((p) => ({ ...p, registrar: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>등록일</label>
              <input type="date" className={inputClass} value={domainForm.registered_date} onChange={(e) => setDomainForm((p) => ({ ...p, registered_date: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>만료일</label>
              <input type="date" className={inputClass} value={domainForm.expires_date} onChange={(e) => setDomainForm((p) => ({ ...p, expires_date: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>네임서버</label>
              <input className={inputClass} placeholder="ns1.example.com, ns2.example.com" value={domainForm.nameservers} onChange={(e) => setDomainForm((p) => ({ ...p, nameservers: e.target.value }))} />
            </div>
          </div>
          <div className="mb-4">
            <label className={labelClass}>메모</label>
            <textarea className={`${inputClass} resize-y`} rows={2} placeholder="도메인 관련 메모" value={domainForm.memo} onChange={(e) => setDomainForm((p) => ({ ...p, memo: e.target.value }))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={domainForm.auto_renew} onChange={(e) => setDomainForm((p) => ({ ...p, auto_renew: e.target.checked }))} className="w-4 h-4 rounded accent-[var(--color-primary)]" />
            <span className="text-[var(--color-dark-2)] text-sm">자동 갱신</span>
          </label>
        </FormCard>
      )}

      {domainsLoading ? (
        <div className="text-center py-10 text-[var(--color-gray)]">로딩 중...</div>
      ) : domains.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-gray)]">
          <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          등록된 도메인이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {domains.map((d) => (
            <div key={d.id} className={cardClass}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-[var(--color-dark)] font-semibold text-[0.95rem]">{d.domain_name}</h4>
                  {d.registrar && <p className="text-[var(--color-gray)] text-sm">{d.registrar}</p>}
                </div>
                {d.auto_renew && (
                  <span className="px-2 py-0.5 text-[0.7rem] font-semibold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">자동갱신</span>
                )}
              </div>

              <div className="space-y-2 text-sm mb-3">
                {d.registered_date && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-gray)]">등록일</span>
                    <span className="text-[var(--color-dark-2)]">{d.registered_date}</span>
                  </div>
                )}
                {d.expires_date && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-gray)]">만료일</span>
                    <span className={`font-medium ${isExpired(d.expires_date) ? "text-red-600" : isWithin30Days(d.expires_date) ? "text-orange-500" : "text-[var(--color-dark-2)]"}`}>
                      {d.expires_date}
                      {isExpired(d.expires_date) && <span className="ml-1 text-[0.7rem]">(만료됨)</span>}
                      {!isExpired(d.expires_date) && isWithin30Days(d.expires_date) && <span className="ml-1 text-[0.7rem]">(만료 임박)</span>}
                    </span>
                  </div>
                )}
                {d.nameservers && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-gray)]">네임서버</span>
                    <span className="text-[var(--color-dark-2)] text-right max-w-[60%]">{d.nameservers}</span>
                  </div>
                )}
              </div>
              {d.memo && <p className="text-[var(--color-gray)] text-sm mb-3 bg-gray-50 rounded-lg px-3 py-2">{d.memo}</p>}

              <div className="flex gap-1.5 pt-3 border-t border-gray-100">
                <button onClick={() => openDomainEdit(d)} className={btnSmall}>수정</button>
                <button onClick={() => deleteDomain(d.id)} className={btnDanger}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPaymentsTab = () => {
    const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
    const totalPending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);
    const totalOverdue = payments.filter((p) => p.status === "overdue").reduce((s, p) => s + Number(p.amount), 0);

    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[var(--color-dark)] font-semibold">
            결제 내역
            <span className="text-[var(--color-gray)] font-normal text-sm ml-2">{payments.length}건</span>
          </h3>
          <button onClick={openPaymentAdd} className={btnPrimary}>+ 추가</button>
        </div>

        {/* Payment summary */}
        {payments.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-center">
              <p className="text-emerald-600 text-[0.7rem] font-medium mb-0.5">완료</p>
              <p className="text-emerald-700 font-bold text-sm">{formatAmount(totalPaid)}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-center">
              <p className="text-yellow-600 text-[0.7rem] font-medium mb-0.5">대기</p>
              <p className="text-yellow-700 font-bold text-sm">{formatAmount(totalPending)}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">
              <p className="text-red-500 text-[0.7rem] font-medium mb-0.5">미납</p>
              <p className="text-red-700 font-bold text-sm">{formatAmount(totalOverdue)}</p>
            </div>
          </div>
        )}

        {showPaymentForm && (
          <FormCard
            title={editingPaymentId ? "결제 수정" : "새 결제"}
            onSave={savePayment}
            onCancel={() => { setShowPaymentForm(false); setEditingPaymentId(null); }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>금액 (원) *</label>
                <input type="number" className={inputClass} placeholder="0" value={paymentForm.amount || ""} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: Number(e.target.value) }))} />
              </div>
              <div>
                <label className={labelClass}>유형</label>
                <select className={inputClass} value={paymentForm.type} onChange={(e) => setPaymentForm((p) => ({ ...p, type: e.target.value }))}>
                  <option value="제작비">제작비</option>
                  <option value="호스팅">호스팅</option>
                  <option value="도메인">도메인</option>
                  <option value="유지보수">유지보수</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>결제일</label>
                <input type="date" className={inputClass} value={paymentForm.payment_date} onChange={(e) => setPaymentForm((p) => ({ ...p, payment_date: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>상태</label>
                <select className={inputClass} value={paymentForm.status} onChange={(e) => setPaymentForm((p) => ({ ...p, status: e.target.value }))}>
                  <option value="paid">완료</option>
                  <option value="pending">대기</option>
                  <option value="overdue">미납</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>설명</label>
                <input className={inputClass} placeholder="결제 설명" value={paymentForm.description} onChange={(e) => setPaymentForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className={labelClass}>메모</label>
              <textarea className={`${inputClass} resize-y`} rows={2} placeholder="결제 관련 메모" value={paymentForm.memo} onChange={(e) => setPaymentForm((p) => ({ ...p, memo: e.target.value }))} />
            </div>
          </FormCard>
        )}

        {paymentsLoading ? (
          <div className="text-center py-10 text-[var(--color-gray)]">로딩 중...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-gray)]">
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            등록된 결제 내역이 없습니다.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-[var(--color-gray)] font-medium">결제일</th>
                    <th className="text-left py-3 px-4 text-[var(--color-gray)] font-medium">유형</th>
                    <th className="text-left py-3 px-4 text-[var(--color-gray)] font-medium">설명</th>
                    <th className="text-right py-3 px-4 text-[var(--color-gray)] font-medium">금액</th>
                    <th className="text-center py-3 px-4 text-[var(--color-gray)] font-medium">상태</th>
                    <th className="text-right py-3 px-4 text-[var(--color-gray)] font-medium">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const statusInfo = PAYMENT_STATUS_MAP[p.status] ?? {
                      label: p.status,
                      cls: "bg-gray-100 text-gray-600 border border-gray-200",
                    };
                    return (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-[var(--color-dark-2)]">{p.payment_date}</td>
                        <td className="py-3 px-4 text-[var(--color-dark-2)]">{p.type}</td>
                        <td className="py-3 px-4 text-[var(--color-gray)]">{p.description || "-"}</td>
                        <td className="py-3 px-4 text-[var(--color-dark)] font-semibold text-right">
                          {formatAmount(p.amount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 text-[0.7rem] font-semibold rounded-full ${statusInfo.cls}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button onClick={() => openPaymentEdit(p)} className={btnSmall}>수정</button>
                            <button onClick={() => deletePayment(p.id)} className={btnDanger}>삭제</button>
                          </div>
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
  };

  // =========================================================================
  // Tab configuration
  // =========================================================================

  const tabConfig: { key: TabKey; label: string; count: number; icon: string }[] = [
    { key: "projects", label: "프로젝트", count: projects.length, icon: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" },
    { key: "hosting", label: "호스팅", count: hostings.length, icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" },
    { key: "domains", label: "도메인", count: domains.length, icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" },
    { key: "payments", label: "결제", count: payments.length, icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "projects": return renderProjectsTab();
      case "hosting": return renderHostingTab();
      case "domains": return renderDomainsTab();
      case "payments": return renderPaymentsTab();
    }
  };

  // =========================================================================
  // Main render
  // =========================================================================

  if (clientLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-light)]">
        <AdminHeader />
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full" />
                <div>
                  <div className="h-5 bg-gray-200 rounded w-40 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-12 bg-gray-100 rounded-lg" />
                <div className="h-12 bg-gray-100 rounded-lg" />
                <div className="h-12 bg-gray-100 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-[var(--color-light)]">
        <AdminHeader />
        <div className="text-center py-20">
          <p className="text-[var(--color-gray)] mb-4">클라이언트를 찾을 수 없습니다.</p>
          <Link href="/admin/clients" className="text-[var(--color-accent)] no-underline font-semibold hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          href="/admin/clients"
          className="text-[var(--color-gray)] no-underline hover:text-[var(--color-dark)] transition-colors flex items-center gap-1 text-sm mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          클라이언트 목록
        </Link>

        {/* ===== Client info card ===== */}
        <div className={`${cardClass} mb-6`}>
          {editingClient ? (
            <div>
              <h3 className="text-[var(--color-dark)] font-semibold mb-5">클라이언트 정보 수정</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>이름</label>
                  <input className={inputClass} value={clientForm.name} onChange={(e) => setClientForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>이메일</label>
                  <input type="text" className={inputClass} value={clientForm.email} onChange={(e) => setClientForm((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>전화번호</label>
                  <input type="text" className={inputClass} value={clientForm.phone} onChange={(e) => setClientForm((p) => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>비밀번호 (변경 시에만)</label>
                  <input type="password" className={inputClass} placeholder="변경할 비밀번호 입력" value={clientForm.password} onChange={(e) => setClientForm((p) => ({ ...p, password: e.target.value }))} />
                </div>
              </div>
              <div className="mb-4">
                <label className={labelClass}>메모</label>
                <textarea className={`${inputClass} resize-y`} rows={3} value={clientForm.memo} onChange={(e) => setClientForm((p) => ({ ...p, memo: e.target.value }))} />
              </div>
              <div className="flex items-center gap-4 mb-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={clientForm.is_active} onChange={(e) => setClientForm((p) => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 rounded accent-[var(--color-primary)]" />
                  <span className="text-[var(--color-dark-2)] text-sm">활성 계정</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button onClick={saveClient} className={btnPrimary}>저장</button>
                <button onClick={() => setEditingClient(false)} className={btnSecondary}>취소</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 ${client.is_active ? "bg-gradient-to-br from-[var(--color-primary)] to-blue-600" : "bg-gray-400"}`}>
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h2 className="text-xl font-bold text-[var(--color-dark)]">{client.name}</h2>
                      <span className={`px-2.5 py-0.5 text-[0.7rem] font-semibold rounded-full ${client.is_active ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                        {client.is_active ? "활성" : "비활성"}
                      </span>
                    </div>
                    <p className="text-[var(--color-gray)] text-sm">@{client.username}</p>
                  </div>
                </div>
                <button onClick={startEditClient} className={btnSmall}>수정</button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
                {client.email && (
                  <div>
                    <span className="text-[var(--color-gray)] text-xs block mb-0.5">이메일</span>
                    <span className="text-[var(--color-dark)] text-sm">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div>
                    <span className="text-[var(--color-gray)] text-xs block mb-0.5">전화번호</span>
                    <span className="text-[var(--color-dark)] text-sm">{client.phone}</span>
                  </div>
                )}
                <div>
                  <span className="text-[var(--color-gray)] text-xs block mb-0.5">등록일</span>
                  <span className="text-[var(--color-dark)] text-sm">
                    {formatDate(client.created_at)}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-gray)] text-xs block mb-0.5">아이디</span>
                  <span className="text-[var(--color-dark)] text-sm">{client.username}</span>
                </div>
              </div>

              {client.memo && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-[var(--color-gray)] text-xs block mb-1">메모</span>
                  <p className="text-[var(--color-dark-2)] text-sm whitespace-pre-wrap bg-gray-50 rounded-lg px-3 py-2">{client.memo}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== Tab bar ===== */}
        <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer bg-transparent whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[var(--color-primary)] text-[var(--color-dark)]"
                  : "border-transparent text-[var(--color-gray)] hover:text-[var(--color-dark)] hover:border-gray-300"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 text-[0.65rem] font-semibold rounded-full ${
                  activeTab === tab.key
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-gray-200 text-[var(--color-gray)]"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ===== Tab content ===== */}
        {renderActiveTab()}
      </div>
    </div>
  );
}
