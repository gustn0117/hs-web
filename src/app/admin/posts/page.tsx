"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";

interface Faq {
  q: string;
  a: string;
}

interface Post {
  id: string;
  seq: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  region: string;
  regionDetail: string;
  faq: Faq[];
  published: boolean;
  publishedAt: string;
  updatedAt: string;
}

const EMPTY = {
  title: "",
  summary: "",
  content: "",
  category: "",
  tags: "",
  region: "",
  regionDetail: "",
  faq: [] as Faq[],
  published: false,
};

const CONTENT_GUIDE = `## 소제목
문단 내용을 씁니다.

- 목록은 이렇게 적습니다
- 한 줄에 하나씩

## 다음 소제목
내용을 이어서 씁니다.`;

const inputCls =
  "w-full px-3 py-2 border border-slate-200 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors";
const labelCls = "block text-[12px] font-semibold text-slate-600 mb-1.5";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      setMsg("목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const reset = () => {
    setForm({ ...EMPTY });
    setEditingId(null);
  };

  const edit = (p: Post) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      summary: p.summary,
      content: p.content,
      category: p.category,
      tags: (p.tags ?? []).join(", "),
      region: p.region,
      regionDetail: p.regionDetail,
      faq: p.faq ?? [],
      published: p.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    if (!form.title.trim()) {
      setMsg("제목을 입력해주세요.");
      return;
    }
    setSaving(true);
    setMsg(null);
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      faq: form.faq.filter((f) => f.q.trim() && f.a.trim()),
    };
    try {
      const res = await fetch(editingId ? `/api/admin/posts/${editingId}` : "/api/admin/posts", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setMsg(editingId ? "수정했습니다." : "등록했습니다. 공개 상태면 검색엔진에도 알렸습니다.");
      reset();
      fetchPosts();
    } catch {
      setMsg("저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Post) => {
    if (!confirm(`"${p.title}" 글을 삭제할까요?`)) return;
    const res = await fetch(`/api/admin/posts/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((x) => x.id !== p.id));
      if (editingId === p.id) reset();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-8 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">정보공유 글 관리</h2>
          <p className="text-sm text-slate-500 mt-1">
            공개하면 사이트맵·RSS에 자동으로 들어가고 네이버·빙에 색인 요청이 나갑니다.
          </p>
        </div>

        {msg && (
          <div className="px-4 py-3 bg-white border border-slate-200 text-[13px] text-slate-700 flex items-center justify-between gap-3">
            {msg}
            <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer bg-transparent border-0">닫기</button>
          </div>
        )}

        {/* 작성 / 수정 */}
        <div className="bg-white border border-slate-200 p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-slate-900">{editingId ? "글 수정" : "새 글 작성"}</h3>
            {editingId && (
              <button onClick={reset} className="text-[12px] text-slate-500 hover:text-slate-900 cursor-pointer bg-transparent border-0">
                새 글로 전환
              </button>
            )}
          </div>

          <div>
            <label className={labelCls}>제목 *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="예) 홈페이지 제작 비용, 무엇이 금액을 바꾸나" />
          </div>

          <div>
            <label className={labelCls}>한 줄 요약 (검색 결과와 AI 답변에 쓰입니다 · 80~120자 권장)</label>
            <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} className={`${inputCls} resize-y`} placeholder="이 글이 무엇을 알려주는지 한 문장으로 적습니다." />
            <p className="mt-1 text-[11px] text-slate-400 tnum">{form.summary.length}자</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>카테고리</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} placeholder="제작 정보" />
            </div>
            <div>
              <label className={labelCls}>지역 (지역 검색용)</label>
              <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputCls} placeholder="예) 서울 강남구" />
            </div>
            <div>
              <label className={labelCls}>태그 (쉼표로 구분)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} placeholder="홈페이지 제작, 비용" />
            </div>
          </div>

          <div>
            <label className={labelCls}>본문</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={16} className={`${inputCls} resize-y font-mono leading-[1.7]`} placeholder={CONTENT_GUIDE} />
            <p className="mt-1 text-[11px] text-slate-400">
              &quot;## 소제목&quot;은 제목으로, &quot;- 내용&quot;은 목록으로 표시됩니다. · {form.content.length}자
            </p>
          </div>

          {/* FAQ */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelCls + " mb-0"}>자주 묻는 질문 (AI 답변에 인용되기 좋습니다)</label>
              <button
                onClick={() => setForm({ ...form, faq: [...form.faq, { q: "", a: "" }] })}
                className="text-[12px] font-semibold text-[var(--color-primary)] hover:underline cursor-pointer bg-transparent border-0"
              >
                + 질문 추가
              </button>
            </div>
            {form.faq.length === 0 ? (
              <p className="text-[12px] text-slate-400 py-2">질문을 추가하면 글 하단에 표시되고 구조화 데이터로도 나갑니다.</p>
            ) : (
              <div className="space-y-2">
                {form.faq.map((f, i) => (
                  <div key={i} className="border border-slate-100 p-3 relative">
                    <button
                      onClick={() => setForm({ ...form, faq: form.faq.filter((_, x) => x !== i) })}
                      aria-label="질문 삭제"
                      className="absolute top-2 right-2 text-slate-300 hover:text-red-500 cursor-pointer bg-transparent border-0"
                    >
                      ×
                    </button>
                    <input
                      value={f.q}
                      onChange={(e) => setForm({ ...form, faq: form.faq.map((x, xi) => (xi === i ? { ...x, q: e.target.value } : x)) })}
                      className={`${inputCls} mb-2`}
                      placeholder="질문"
                    />
                    <textarea
                      value={f.a}
                      onChange={(e) => setForm({ ...form, faq: form.faq.map((x, xi) => (xi === i ? { ...x, a: e.target.value } : x)) })}
                      rows={3}
                      className={`${inputCls} resize-y`}
                      placeholder="답변"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-slate-900 cursor-pointer" />
              공개 (체크하면 사이트에 노출되고 색인 요청이 나갑니다)
            </label>
            <button
              onClick={save}
              disabled={saving}
              className="h-9 px-5 bg-slate-900 text-white text-[13px] font-bold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0 transition-colors"
            >
              {saving ? "저장 중…" : editingId ? "수정 저장" : "등록"}
            </button>
          </div>
        </div>

        {/* 목록 */}
        <div className="bg-white border border-slate-200">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-slate-900">
              글 목록 <span className="text-slate-400 font-medium">{posts.length}건</span>
            </h3>
          </div>
          {loading ? (
            <p className="px-5 py-8 text-center text-[13px] text-slate-400">불러오는 중…</p>
          ) : posts.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-slate-400">아직 글이 없습니다.</p>
          ) : (
            <ul className="list-none m-0 p-0 divide-y divide-slate-100">
              {posts.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <span className={`shrink-0 inline-flex items-center h-6 px-2 text-[11px] font-semibold rounded-full ${p.published ? "bg-emerald-100/60 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                    {p.published ? "공개" : "비공개"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-slate-900 truncate">{p.title}</p>
                    <p className="text-[11.5px] text-slate-500 truncate">
                      {[p.category, p.region, p.published ? `/insights/${p.seq}` : null].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  {p.published && (
                    <a href={`/insights/${p.seq}`} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[12px] text-slate-500 hover:text-slate-900 no-underline">
                      보기
                    </a>
                  )}
                  <button onClick={() => edit(p)} className="shrink-0 text-[12px] text-slate-600 hover:text-slate-900 cursor-pointer bg-transparent border-0">수정</button>
                  <button onClick={() => remove(p)} className="shrink-0 text-[12px] text-red-500 hover:text-red-700 cursor-pointer bg-transparent border-0">삭제</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-[12px] text-slate-400">
          공개한 글은 <Link href="/insights" className="underline underline-offset-2">/insights</Link> 목록에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
