"use client";

import { useState, useEffect, useCallback } from "react";
import AdminHeader from "../components/AdminHeader";

interface ClientInfo {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  projects: { id: string; name: string; status: string }[];
}

interface TaskItem {
  id: string;
  clientId: string;
  clientName: string;
  projectName: string;
  task: string;
  done: boolean;
}

function todayTitle() {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function todayShort() {
  const d = new Date();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} (${days[d.getDay()]})`;
}

export default function DailyPage() {
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients ?? []);
      }
    } catch { /* */ }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const filtered = search.trim()
    ? clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search))
    : [];

  const selectClient = (c: ClientInfo) => {
    setSelectedClient(c);
    setSearch(c.name);
    setShowDropdown(false);
    if (c.projects.length === 1) setSelectedProject(c.projects[0].name);
    else setSelectedProject("");
  };

  const addTask = () => {
    if (!selectedClient || !taskInput.trim()) return;
    const newTask: TaskItem = {
      id: crypto.randomUUID(),
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      projectName: selectedProject || selectedClient.projects[0]?.name || "-",
      task: taskInput.trim(),
      done: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setTaskInput("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // 클라이언트별로 그룹핑
  const grouped = tasks.reduce<Record<string, TaskItem[]>>((acc, t) => {
    const key = `${t.clientId}-${t.projectName}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const handlePrint = () => {
    const groupHtml = Object.values(grouped).map((items) => {
      const client = clients.find((c) => c.id === items[0].clientId);
      const rows = items.map((t, i) => `
        <tr>
          <td class="c" style="width:30px">${i + 1}</td>
          <td class="l">${t.task}</td>
          <td class="c" style="width:50px">${t.done ? "완료" : ""}</td>
        </tr>`).join("");

      return `
        <div class="client-block">
          <div class="client-header">
            <div class="client-name">${items[0].clientName}</div>
            <div class="client-meta">
              <span>프로젝트: ${items[0].projectName}</span>
              ${client?.phone ? `<span>연락처: ${client.phone}</span>` : ""}
            </div>
          </div>
          <table>
            <thead><tr><th style="width:30px">No.</th><th>작업 내용</th><th style="width:50px">완료</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    }).join("");

    const doneCount = tasks.filter((t) => t.done).length;

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8" /><title>데일리 워크시트 - ${todayShort()}</title>
<style>
@page { size: A4; margin: 15mm 18mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; color: #222; font-size: 10pt; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
td, th { border: 1px solid #bbb; padding: 6px 10px; font-size: 9pt; }
th { background: #f0ece6; font-weight: 700; text-align: center; font-size: 8.5pt; }
.c { text-align: center; }
.l { text-align: left; }
.top-line { border-top: 3px solid #222; padding-top: 6px; margin-bottom: 4px; display: flex; justify-content: space-between; }
.top-line span { font-size: 8pt; color: #888; }
.title-wrap { text-align: center; margin: 24px 0 20px; }
.title-wrap h1 { font-size: 20pt; font-weight: 900; letter-spacing: 6px; }
.title-wrap p { font-size: 9pt; color: #666; margin-top: 4px; }
.summary { display: flex; justify-content: flex-end; gap: 16px; margin-bottom: 20px; font-size: 9pt; color: #555; }
.summary strong { color: #222; }
.client-block { margin-bottom: 20px; }
.client-header { background: #f5f3ef; border: 1px solid #d4cbbf; border-bottom: none; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; }
.client-name { font-size: 10pt; font-weight: 800; color: #2c2418; }
.client-meta { font-size: 8pt; color: #8a7e6b; display: flex; gap: 12px; }
.footer { text-align: center; border-top: 1px solid #ccc; padding-top: 8px; margin-top: 24px; font-size: 7.5pt; color: #999; }
.memo-area { border: 1px solid #bbb; padding: 12px; min-height: 80px; margin-top: 8px; }
.memo-area p { font-size: 8.5pt; color: #888; }
</style></head><body>
<div class="top-line">
  <span>HS WEB · Daily Worksheet</span>
  <span>${todayShort()}</span>
</div>
<div class="title-wrap">
  <h1>데일리 워크시트</h1>
  <p>DAILY WORKSHEET</p>
</div>
<div class="summary">
  <span>총 <strong>${tasks.length}</strong>건</span>
  <span>완료 <strong>${doneCount}</strong>건</span>
  <span>미완료 <strong>${tasks.length - doneCount}</strong>건</span>
</div>
${groupHtml}
<div style="margin-top: 20px">
  <p style="font-size:9pt;font-weight:700;color:#2c2418;margin-bottom:4px">메모</p>
  <div class="memo-area"><p>&nbsp;</p></div>
</div>
<div class="footer">HS WEB | ${todayTitle()} 업무 일지</div>
<script>window.onload=function(){window.print();}<\/script>
</body></html>`);
    win.document.close();
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)]">데일리 워크시트</h2>
            <p className="text-[var(--color-gray)] text-sm mt-1">{todayTitle()} — 오늘의 할 일을 관리하세요.</p>
          </div>
          <button
            onClick={handlePrint}
            disabled={tasks.length === 0}
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer border-none shadow-sm disabled:opacity-30"
          >
            PDF 출력
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 입력 영역 */}
          <div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              {/* 클라이언트 검색 */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-gray)] mb-1.5">클라이언트</label>
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); setSelectedClient(null); }}
                    onFocus={() => search && setShowDropdown(true)}
                    placeholder="이름 또는 연락처 검색"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                  />
                  {showDropdown && filtered.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                      {filtered.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => selectClient(c)}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors cursor-pointer bg-transparent border-none text-sm"
                        >
                          <span className="font-medium text-[var(--color-dark)]">{c.name}</span>
                          {c.phone && <span className="text-[var(--color-gray)] ml-2">{c.phone}</span>}
                          {c.projects.length > 0 && (
                            <span className="text-xs text-[var(--color-accent)] ml-2">{c.projects[0].name}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 선택된 클라이언트 정보 + 프로젝트 */}
              {selectedClient && (
                <div className="p-3 bg-blue-50 rounded-lg text-xs space-y-1 border border-blue-100">
                  <p className="font-bold text-[var(--color-dark)]">{selectedClient.name}</p>
                  {selectedClient.phone && <p className="text-[var(--color-gray)]">{selectedClient.phone}</p>}
                  {selectedClient.projects.length > 0 && <p className="text-[var(--color-accent)]">프로젝트: {selectedClient.projects.map(p => p.name).join(", ")}</p>}
                </div>
              )}

              {selectedClient && selectedClient.projects.length > 1 && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-gray)] mb-1.5">프로젝트</label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="">선택하세요</option>
                    {selectedClient.projects.map((p) => (
                      <option key={p.id} value={p.name}>{p.name} ({p.status})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* 할 일 입력 */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-gray)] mb-1.5">할 일</label>
                <input
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  placeholder={selectedClient ? "작업 내용 입력 후 Enter" : "클라이언트를 먼저 선택하세요"}
                  disabled={!selectedClient}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              <button
                onClick={addTask}
                disabled={!selectedClient || !taskInput.trim()}
                className="w-full py-2.5 bg-[var(--color-dark)] text-white rounded-lg text-sm font-semibold cursor-pointer border-none disabled:opacity-30 transition-opacity"
              >
                할 일 추가
              </button>
            </div>
          </div>

          {/* 워크시트 미리보기 */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              {/* 헤더 */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-dark)]">워크시트</h3>
                  <p className="text-xs text-[var(--color-gray)] mt-0.5">{todayShort()}</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[var(--color-gray)]">총 <strong className="text-[var(--color-dark)]">{tasks.length}</strong>건</span>
                  <span className="text-emerald-600">완료 <strong>{tasks.filter(t => t.done).length}</strong></span>
                  <span className="text-amber-600">미완료 <strong>{tasks.filter(t => !t.done).length}</strong></span>
                </div>
              </div>

              {tasks.length === 0 ? (
                <div className="px-6 py-16 text-center text-[var(--color-gray)] text-sm">
                  클라이언트를 선택하고 할 일을 추가하세요.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {Object.entries(grouped).map(([key, items]) => {
                    const client = clients.find((c) => c.id === items[0].clientId);
                    return (
                      <div key={key}>
                        {/* 클라이언트 헤더 */}
                        <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-[var(--color-dark)]">{items[0].clientName}</span>
                            <span className="text-xs text-[var(--color-gray)]">{items[0].projectName}</span>
                          </div>
                          {client?.phone && (
                            <span className="text-xs text-[var(--color-gray)]">{client.phone}</span>
                          )}
                        </div>
                        {/* 작업 목록 */}
                        {items.map((t, idx) => (
                          <div key={t.id} className="px-6 py-2.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                            <span className="text-xs text-[var(--color-gray)] w-5 text-center">{idx + 1}</span>
                            <button
                              onClick={() => toggleTask(t.id)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all bg-transparent ${
                                t.done ? "bg-emerald-500 border-emerald-500" : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              {t.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                            </button>
                            <span className={`flex-1 text-sm ${t.done ? "line-through text-[var(--color-gray)]" : "text-[var(--color-dark)]"}`}>
                              {t.task}
                            </span>
                            <button
                              onClick={() => removeTask(t.id)}
                              className="text-[var(--color-gray)] hover:text-red-500 cursor-pointer bg-transparent border-none text-sm opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
