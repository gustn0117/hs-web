"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

interface Todo {
  id: string;
  text: string;
  done: boolean;
  memo: string | null;
  due_date: string | null;
  position: number;
}

interface CalendarEvent {
  id: string;
  type: "payment" | "hosting" | "domain";
  date: string;
  title: string;
  clientId: string | null;
  clientName: string;
  amount: number | null;
  status: string | null;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const EVENT_STYLE: Record<
  CalendarEvent["type"],
  { dot: string; text: string; label: string; href: string }
> = {
  payment: { dot: "bg-amber-500", text: "text-amber-700", label: "결제", href: "/admin/payments" },
  hosting: { dot: "bg-red-500", text: "text-red-700", label: "만료", href: "/admin/clients" },
  domain: { dot: "bg-red-500", text: "text-red-700", label: "만료", href: "/admin/clients" },
};

/** 결제 건은 종류 대신 상태를 보여준다 — 대시보드 다른 섹션과 같은 표기. */
const PAYMENT_STATUS: Record<string, { label: string; text: string }> = {
  paid: { label: "완료", text: "text-emerald-700" },
  confirming: { label: "확인중", text: "text-slate-500" },
  pending: { label: "대기", text: "text-amber-700" },
  overdue: { label: "미납", text: "text-red-700" },
};

/** 로컬 시간 기준 YYYY-MM-DD. toISOString()은 UTC로 밀려서 쓰지 않는다. */
function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function addDays(d: Date, n: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

/** 달력에 그릴 42칸(6주)의 첫 칸 날짜 — 해당 월 1일이 속한 주의 일요일. */
function gridStart(year: number, month: number) {
  const first = new Date(year, month, 1);
  return addDays(first, -first.getDay());
}

function fmtAmount(n: number) {
  if (n >= 100000000) return (n / 100000000).toFixed(n % 100000000 === 0 ? 0 : 1) + "억";
  if (n >= 10000) return (n / 10000).toFixed(n % 10000 === 0 ? 0 : 1) + "만";
  return n.toLocaleString();
}

/** 버튼처럼 좁은 자리에 쓰는 짧은 표기 — 9/15 */
function fmtDayShort(iso: string) {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
}

function fmtDayTitle(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${m}월 ${d}일 (${WEEKDAYS[date.getDay()]})`;
}

export default function DashboardCalendar() {
  const today = useMemo(() => ymd(new Date()), []);
  const [view, setView] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selected, setSelected] = useState(today);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const [showUnscheduled, setShowUnscheduled] = useState(false);
  const [showUnscheduledDone, setShowUnscheduledDone] = useState(false);
  const [openMemoId, setOpenMemoId] = useState<string | null>(null);
  const [memoDraft, setMemoDraft] = useState("");
  const [memoSaving, setMemoSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const days = useMemo(() => {
    const start = gridStart(view.year, view.month);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [view]);

  const rangeFrom = ymd(days[0]);
  const rangeTo = ymd(days[41]);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [todoRes, eventRes] = await Promise.all([
        fetch(`/api/admin/todos?from=${rangeFrom}&to=${rangeTo}&includeUnscheduled=1`),
        fetch(`/api/admin/calendar?from=${rangeFrom}&to=${rangeTo}`),
      ]);
      if (!todoRes.ok || !eventRes.ok) throw new Error("불러오지 못했습니다.");
      const todoData = await todoRes.json();
      const eventData = await eventRes.json();
      setTodos(todoData.todos ?? []);
      setEvents(eventData.events ?? []);
    } catch {
      setError("일정을 불러오지 못했습니다. 새로고침해 주세요.");
    } finally {
      setLoading(false);
    }
  }, [rangeFrom, rangeTo]);

  useEffect(() => {
    load();
  }, [load]);

  const todosByDate = useMemo(() => {
    const map = new Map<string, Todo[]>();
    for (const t of todos) {
      if (!t.due_date) continue;
      const list = map.get(t.due_date);
      if (list) list.push(t);
      else map.set(t.due_date, [t]);
    }
    return map;
  }, [todos]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const list = map.get(e.date);
      if (list) list.push(e);
      else map.set(e.date, [e]);
    }
    return map;
  }, [events]);

  const unscheduled = useMemo(() => todos.filter((t) => !t.due_date), [todos]);
  const unscheduledOpen = useMemo(() => unscheduled.filter((t) => !t.done), [unscheduled]);
  const unscheduledDone = useMemo(() => unscheduled.filter((t) => t.done), [unscheduled]);
  const selectedTodos = todosByDate.get(selected) ?? [];
  const selectedEvents = eventsByDate.get(selected) ?? [];

  const goMonth = (delta: number) => {
    setLoading(true);
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const goToday = () => {
    const now = new Date();
    if (now.getFullYear() !== view.year || now.getMonth() !== view.month) setLoading(true);
    setView({ year: now.getFullYear(), month: now.getMonth() });
    setSelected(today);
  };

  const addTodo = async () => {
    const text = draft.trim();
    if (!text || adding) return;
    setAdding(true);
    const tempId = `temp-${Date.now()}`;
    const optimistic: Todo = {
      id: tempId,
      text,
      done: false,
      memo: null,
      due_date: selected,
      position: Number.MAX_SAFE_INTEGER,
    };
    setTodos((prev) => [...prev, optimistic]);
    setDraft("");
    try {
      const res = await fetch("/api/admin/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, due_date: selected }),
      });
      if (!res.ok) throw new Error();
      const { todo } = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === tempId ? todo : t)));
    } catch {
      setTodos((prev) => prev.filter((t) => t.id !== tempId));
      setDraft(text);
      setError("할 일을 추가하지 못했습니다.");
    } finally {
      setAdding(false);
      inputRef.current?.focus();
    }
  };

  const patchTodo = async (id: string, patch: Partial<Todo>) => {
    const before = todos;
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    try {
      const res = await fetch(`/api/admin/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
    } catch {
      setTodos(before);
      setError("변경 사항을 저장하지 못했습니다.");
    }
  };

  const openMemo = (t: Todo) => {
    if (openMemoId === t.id) {
      setOpenMemoId(null);
      return;
    }
    setOpenMemoId(t.id);
    setMemoDraft(t.memo ?? "");
  };

  const saveMemo = async (id: string) => {
    if (memoSaving) return;
    setMemoSaving(true);
    const value = memoDraft.trim();
    await patchTodo(id, { memo: value || null });
    setMemoSaving(false);
    setOpenMemoId(null);
  };

  const removeTodo = async (id: string) => {
    const before = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/admin/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setTodos(before);
      setError("삭제하지 못했습니다.");
    }
  };

  const openCount = todos.filter((t) => !t.done && t.due_date).length;

  return (
    <div className="bg-white border border-slate-200">
      {/* ── Card header ─────────────────────────── */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap">
            {view.year}년 {view.month + 1}월
          </h3>
          <span className="text-[11px] text-slate-500 truncate">
            {loading ? "불러오는 중…" : openCount > 0 ? `할 일 ${openCount}건 남음` : "할 일 없음"}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => goMonth(-1)}
            aria-label="이전 달"
            className="w-7 h-7 inline-flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={goToday}
            className="h-7 px-2.5 inline-flex items-center border border-slate-200 bg-white text-[11px] text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            오늘
          </button>
          <button
            onClick={() => goMonth(1)}
            aria-label="다음 달"
            className="w-7 h-7 inline-flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="px-5 py-2 bg-red-50/60 border-b border-red-100 flex items-center justify-between gap-3">
          <p className="text-[11px] text-red-700">{error}</p>
          <button
            onClick={() => { setError(null); load(); }}
            className="text-[11px] text-red-700 underline underline-offset-2 cursor-pointer bg-transparent border-0"
          >
            다시 시도
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ── Month grid ────────────────────────── */}
        <div className="p-3 md:p-4">
          <div className="grid grid-cols-7">
            {WEEKDAYS.map((w, i) => (
              <div
                key={w}
                className={`h-7 flex items-center justify-center text-[11px] font-semibold ${
                  i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-slate-400"
                }`}
              >
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-t border-l border-slate-100">
            {days.map((d) => {
              const iso = ymd(d);
              const inMonth = d.getMonth() === view.month;
              const isToday = iso === today;
              const isSelected = iso === selected;
              const dayTodos = todosByDate.get(iso) ?? [];
              const dayEvents = eventsByDate.get(iso) ?? [];
              const marks = [
                ...dayTodos.map((t) => ({ key: t.id, cls: t.done ? "bg-slate-200" : "bg-slate-800" })),
                ...dayEvents.map((e) => ({ key: e.id, cls: EVENT_STYLE[e.type].dot })),
              ];

              return (
                <button
                  key={iso}
                  onClick={() => setSelected(iso)}
                  aria-label={`${d.getMonth() + 1}월 ${d.getDate()}일`}
                  aria-pressed={isSelected}
                  className={`relative min-h-[58px] md:min-h-[68px] border-r border-b border-slate-100 p-1.5 flex flex-col items-start gap-1 text-left cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-slate-50 ring-1 ring-inset ring-slate-900"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`w-5 h-5 inline-flex items-center justify-center text-[11px] tabular-nums ${
                      isToday
                        ? "bg-slate-900 text-white font-semibold rounded-full"
                        : !inMonth
                          ? "text-slate-300"
                          : d.getDay() === 0
                            ? "text-red-500"
                            : d.getDay() === 6
                              ? "text-blue-500"
                              : "text-slate-700"
                    }`}
                  >
                    {d.getDate()}
                  </span>
                  <span className="flex flex-wrap gap-[3px] px-0.5">
                    {marks.slice(0, 4).map((m) => (
                      <span
                        key={m.key}
                        className={`w-1.5 h-1.5 rounded-full ${m.cls} ${inMonth ? "" : "opacity-40"}`}
                      />
                    ))}
                    {marks.length > 4 && (
                      <span className="text-[9px] leading-[6px] text-slate-400 tabular-nums">
                        +{marks.length - 4}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-3 px-0.5 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />할 일
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />결제
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />만료
            </span>
          </div>
        </div>

        {/* ── Day panel ─────────────────────────── */}
        <div className="border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-baseline justify-between gap-2">
            <p className="text-[13px] font-semibold text-slate-900">{fmtDayTitle(selected)}</p>
            {selected === today && (
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">오늘</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[340px] lg:max-h-[420px]">
            {selectedEvents.length > 0 && (
              <ul className="list-none m-0 p-0 divide-y divide-slate-100 border-b border-slate-100">
                {selectedEvents.map((e) => {
                  const style = EVENT_STYLE[e.type];
                  const badge =
                    (e.type === "payment" && e.status && PAYMENT_STATUS[e.status]) || style;
                  const href = e.clientId ? `/admin/clients/${e.clientId}` : style.href;
                  return (
                    <li key={e.id}>
                      <Link
                        href={href}
                        className="flex items-start gap-2 px-4 py-2.5 no-underline hover:bg-slate-50 transition-colors"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mt-[6px] shrink-0 ${style.dot}`} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] text-slate-800 truncate">{e.title}</span>
                          <span className="block text-[11px] text-slate-500 mt-0.5 truncate">
                            {e.clientName}
                            {e.amount !== null && ` · ${fmtAmount(e.amount)}원`}
                          </span>
                        </span>
                        <span className={`text-[10px] font-semibold shrink-0 mt-0.5 ${badge.text}`}>
                          {badge.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {selectedTodos.length > 0 ? (
              <ul className="list-none m-0 p-0 divide-y divide-slate-100">
                {selectedTodos.map((t) => (
                  <li key={t.id} className="group">
                    <div className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => patchTodo(t.id, { done: !t.done })}
                        className="mt-[3px] w-3.5 h-3.5 shrink-0 accent-slate-900 cursor-pointer"
                        aria-label={`${t.text} 완료 표시`}
                      />
                      <button
                        type="button"
                        onClick={() => openMemo(t)}
                        aria-expanded={openMemoId === t.id}
                        className={`flex-1 min-w-0 text-left text-[12px] leading-snug break-words cursor-pointer bg-transparent border-0 p-0 ${
                          t.done ? "text-slate-400 line-through" : "text-slate-800"
                        }`}
                      >
                        {t.text}
                        {t.memo && (
                          <span className="ml-1.5 inline-flex items-center align-middle text-slate-400" title="상세내용 있음">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h4.5M4.5 4.5h15v15h-15z" />
                            </svg>
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => removeTodo(t.id)}
                        aria-label="할 일 삭제"
                        className="shrink-0 w-5 h-5 inline-flex items-center justify-center text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer bg-transparent border-0 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {openMemoId === t.id ? (
                      <div className="px-4 pb-3 pl-[34px]">
                        <textarea
                          value={memoDraft}
                          onChange={(e) => setMemoDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setOpenMemoId(null);
                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveMemo(t.id);
                          }}
                          rows={4}
                          autoFocus
                          placeholder="상세내용을 적어주세요. 줄바꿈도 그대로 저장됩니다."
                          className="w-full px-2.5 py-2 border border-slate-200 text-[12px] text-slate-800 leading-[1.6] placeholder:text-slate-400 focus:outline-none focus:border-slate-900 resize-y transition-colors"
                        />
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <span className="mr-auto text-[11px] text-slate-400">⌘/Ctrl + Enter 로 저장</span>
                          <button
                            type="button"
                            onClick={() => setOpenMemoId(null)}
                            className="h-7 px-2.5 text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer bg-transparent border-0 transition-colors"
                          >
                            닫기
                          </button>
                          <button
                            type="button"
                            onClick={() => saveMemo(t.id)}
                            disabled={memoSaving}
                            className="h-7 px-3 text-[11px] font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0 transition-colors"
                          >
                            {memoSaving ? "저장 중…" : "저장"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      t.memo && (
                        <button
                          type="button"
                          onClick={() => openMemo(t)}
                          className="block w-full text-left px-4 pb-2.5 pl-[34px] text-[11.5px] text-slate-500 leading-[1.6] whitespace-pre-line cursor-pointer bg-transparent border-0 hover:text-slate-700 transition-colors"
                        >
                          {t.memo}
                        </button>
                      )
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              selectedEvents.length === 0 && (
                <p className="px-4 py-8 text-[12px] text-slate-400 text-center">
                  {loading ? "불러오는 중…" : "이 날 일정이 없습니다. 아래에 할 일을 적어보세요."}
                </p>
              )
            )}
          </div>

          {/* ── Quick add ───────────────────────── */}
          <div className="border-t border-slate-100 p-2.5 flex items-center gap-2">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTodo();
                }
              }}
              placeholder={`${fmtDayTitle(selected)}에 할 일 추가`}
              className="flex-1 min-w-0 h-8 px-2.5 border border-slate-200 bg-white text-[12px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
            />
            <button
              onClick={addTodo}
              disabled={!draft.trim() || adding}
              className="h-8 px-3 shrink-0 inline-flex items-center bg-slate-900 text-white text-[12px] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0 transition-colors"
            >
              추가
            </button>
          </div>
        </div>
      </div>

      {/* ── Undated todos ───────────────────────── */}
      {unscheduled.length > 0 && (
        <div className="border-t border-slate-200">
          <button
            onClick={() => setShowUnscheduled((v) => !v)}
            className="w-full px-5 py-2.5 flex items-center justify-between gap-2 bg-white hover:bg-slate-50 cursor-pointer border-0 transition-colors"
          >
            <span className="text-[12px] text-slate-600">
              날짜 미지정{" "}
              <span className="tabular-nums font-semibold text-slate-900">{unscheduled.length}</span>건
              {unscheduledOpen.length > 0 && (
                <span className="text-slate-400"> · 미완료 {unscheduledOpen.length}</span>
              )}
            </span>
            <svg
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUnscheduled ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {showUnscheduled && (
            <div className="border-t border-slate-100">
              {unscheduledOpen.length > 0 ? (
                <ul className="list-none m-0 p-0 divide-y divide-slate-100">
                  {unscheduledOpen.map((t) => (
                    <li key={t.id} className="group flex items-center gap-2.5 px-5 py-2.5 hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => patchTodo(t.id, { done: !t.done })}
                        className="w-3.5 h-3.5 shrink-0 accent-slate-900 cursor-pointer"
                        aria-label={`${t.text} 완료 표시`}
                      />
                      <span className="flex-1 text-[12px] text-slate-800 break-words">{t.text}</span>
                      <button
                        onClick={() => patchTodo(t.id, { due_date: selected })}
                        className="shrink-0 h-6 px-2 inline-flex items-center border border-slate-200 bg-white text-[11px] text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors tabular-nums"
                      >
                        {fmtDayShort(selected)}로
                      </button>
                      <button
                        onClick={() => removeTodo(t.id)}
                        aria-label="할 일 삭제"
                        className="shrink-0 w-5 h-5 inline-flex items-center justify-center text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer bg-transparent border-0 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-4 text-[12px] text-slate-400">날짜를 정할 할 일이 없습니다.</p>
              )}

              {unscheduledDone.length > 0 && (
                <div className="border-t border-slate-100">
                  <button
                    onClick={() => setShowUnscheduledDone((v) => !v)}
                    className="w-full px-5 py-2 flex items-center gap-1.5 bg-slate-50/60 hover:bg-slate-100/60 cursor-pointer border-0 transition-colors"
                  >
                    <svg
                      className={`w-3 h-3 text-slate-400 transition-transform ${showUnscheduledDone ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                    <span className="text-[11px] text-slate-500">
                      완료한 옛 할 일 <span className="tabular-nums">{unscheduledDone.length}</span>건
                    </span>
                  </button>
                  {showUnscheduledDone && (
                    <ul className="list-none m-0 p-0 divide-y divide-slate-100 border-t border-slate-100">
                      {unscheduledDone.map((t) => (
                        <li key={t.id} className="group flex items-center gap-2.5 px-5 py-2 hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() => patchTodo(t.id, { done: !t.done })}
                            className="w-3.5 h-3.5 shrink-0 accent-slate-900 cursor-pointer"
                            aria-label={`${t.text} 완료 표시`}
                          />
                          <span className="flex-1 text-[12px] text-slate-400 line-through break-words">{t.text}</span>
                          <button
                            onClick={() => removeTodo(t.id)}
                            aria-label="할 일 삭제"
                            className="shrink-0 w-5 h-5 inline-flex items-center justify-center text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer bg-transparent border-0 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
