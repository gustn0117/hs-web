"use client";

import { useEffect, useState, useRef, KeyboardEvent } from "react";

interface Todo {
  id: string;
  text: string;
  done: boolean;
  memo: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export default function DashboardTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [memoDrafts, setMemoDrafts] = useState<Record<string, string>>({});
  const [savingMemo, setSavingMemo] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "done">("active");
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/todos");
      const data = await res.json();
      setTodos(data.todos ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addTodo = async () => {
    const trimmed = text.trim();
    if (!trimmed || adding) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTodos((prev) => [...prev, data.todo]);
      setText("");
      inputRef.current?.focus();
    } catch {
      alert("추가 실패");
    } finally {
      setAdding(false);
    }
  };

  const toggleDone = async (todo: Todo) => {
    const optimistic = todos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t));
    setTodos(optimistic);
    try {
      const res = await fetch(`/api/admin/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !todo.done }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setTodos(todos);
    }
  };

  const removeTodo = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    const prev = todos;
    setTodos(todos.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/admin/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setTodos(prev);
      alert("삭제 실패");
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Initialize draft if not yet
        const todo = todos.find((t) => t.id === id);
        if (todo) {
          setMemoDrafts((d) => ({ ...d, [id]: todo.memo ?? "" }));
        }
      }
      return next;
    });
  };

  const saveMemo = async (id: string) => {
    const draft = memoDrafts[id] ?? "";
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    if ((todo.memo ?? "") === draft) return; // no change

    setSavingMemo(id);
    try {
      const res = await fetch(`/api/admin/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memo: draft || null }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? data.todo : t)));
    } catch {
      alert("메모 저장 실패");
    } finally {
      setSavingMemo(null);
    }
  };

  const onMemoKey = (e: KeyboardEvent<HTMLTextAreaElement>, id: string) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      saveMemo(id);
    }
  };

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTodo();
    }
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const activeCount = todos.filter((t) => !t.done).length;
  const doneCount = todos.length - activeCount;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">체크리스트</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {todos.length === 0
              ? "할 일을 추가해보세요"
              : `진행 ${activeCount}건 · 완료 ${doneCount}건`}
          </p>
        </div>
        <div className="flex bg-slate-50 border border-slate-200 rounded-md p-0.5 shrink-0">
          {([
            ["active", "진행"],
            ["all", "전체"],
            ["done", "완료"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-2.5 h-7 text-[11px] rounded transition-colors border-0 cursor-pointer ${
                filter === key
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "bg-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Add input */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md border border-slate-300 shrink-0" />
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="새 할 일 입력 후 Enter"
            className="flex-1 bg-transparent border-0 text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
          />
          {text.trim() && (
            <button
              onClick={addTodo}
              disabled={adding}
              className="text-xs px-2.5 h-7 inline-flex items-center rounded bg-slate-900 text-white border-0 cursor-pointer hover:bg-slate-800 disabled:opacity-50"
            >
              {adding ? "추가 중" : "추가"}
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="px-5 py-8">
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 bg-slate-100 rounded-md" />
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-slate-500">
            {filter === "active"
              ? "진행 중인 할 일이 없습니다."
              : filter === "done"
              ? "완료한 할 일이 없습니다."
              : "할 일을 추가해보세요."}
          </p>
        </div>
      ) : (
        <ul className="list-none m-0 divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
          {filtered.map((t) => {
            const isExpanded = expanded.has(t.id);
            const hasMemo = !!t.memo && t.memo.trim().length > 0;
            const draft = memoDrafts[t.id] ?? "";
            const draftDirty = (t.memo ?? "") !== draft;
            return (
              <li key={t.id} className="group">
                <div className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleDone(t)}
                    className={`mt-0.5 w-4 h-4 rounded-md border shrink-0 flex items-center justify-center cursor-pointer transition-colors ${
                      t.done
                        ? "bg-slate-900 border-slate-900"
                        : "bg-white border-slate-300 hover:border-slate-500"
                    }`}
                    aria-label={t.done ? "완료 해제" : "완료 표시"}
                  >
                    {t.done && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug ${
                        t.done ? "text-slate-400 line-through" : "text-slate-900"
                      }`}
                    >
                      {t.text}
                    </p>
                    {hasMemo && !isExpanded && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {t.memo}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleExpand(t.id)}
                      title={hasMemo ? "메모 보기/편집" : "메모 추가"}
                      className={`w-7 h-7 inline-flex items-center justify-center rounded transition-colors cursor-pointer bg-transparent border-0 ${
                        hasMemo
                          ? "text-slate-700 hover:bg-slate-200"
                          : "text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-200"
                      } ${isExpanded ? "bg-slate-200 opacity-100" : ""}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeTodo(t.id)}
                      title="삭제"
                      className="w-7 h-7 inline-flex items-center justify-center rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-0 opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Memo editor */}
                {isExpanded && (
                  <div className="px-5 pb-3 pl-12">
                    <textarea
                      value={draft}
                      onChange={(e) => setMemoDrafts((d) => ({ ...d, [t.id]: e.target.value }))}
                      onKeyDown={(e) => onMemoKey(e, t.id)}
                      onBlur={() => saveMemo(t.id)}
                      placeholder="메모 입력... (⌘+Enter 저장)"
                      rows={3}
                      className="w-full text-[12.5px] text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 resize-y focus:outline-none focus:border-slate-400 placeholder:text-slate-400"
                    />
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-slate-400">
                        {savingMemo === t.id
                          ? "저장 중..."
                          : draftDirty
                          ? "저장되지 않음"
                          : t.memo
                          ? `수정: ${new Date(t.updated_at).toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
                          : "메모 없음"}
                      </span>
                      {draftDirty && (
                        <button
                          onClick={() => saveMemo(t.id)}
                          className="text-[11px] px-2 h-6 inline-flex items-center rounded bg-slate-900 text-white border-0 cursor-pointer hover:bg-slate-800"
                        >
                          저장
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
