"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface PortfolioFormData {
  title: string;
  category: string;
  client: string;
  date: string;
  description: string;
  content: string;
  thumbnail: string;
  images: string[];
  tags: string;
  url: string;
  featured: boolean;
  order: number;
}

interface Props {
  initialData?: PortfolioFormData;
  editId?: string;
}

const CATEGORIES = [
  "브랜드 홈페이지",
  "쇼핑몰",
  "기업 홈페이지",
  "랜딩페이지",
  "웹 애플리케이션",
  "CMS",
  "기업 관리 시스템",
  "기타",
];

export default function PortfolioForm({ initialData, editId }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<PortfolioFormData>(
    initialData || {
      title: "",
      category: "",
      client: "",
      date: "",
      description: "",
      content: "",
      thumbnail: "",
      images: [],
      tags: "",
      url: "",
      featured: false,
      order: 999,
    }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("업로드 실패");
    const data = await res.json();
    return data.path;
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadFile(file);
      setForm((prev) => ({ ...prev, thumbnail: path }));
    } catch {
      setError("썸네일 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const paths: string[] = [];
      for (const file of Array.from(files)) {
        const path = await uploadFile(file);
        paths.push(path);
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...paths] }));
    } catch {
      setError("갤러리 이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = editId ? `/api/portfolio/${editId}` : "/api/portfolio";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "저장에 실패했습니다.");
      }

      router.push("/admin/portfolio");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[var(--color-dark)] text-[0.95rem] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all placeholder:text-gray-400";
  const labelClass = "block text-[var(--color-dark-2)] text-sm font-medium mb-2";

  return (
    <form onSubmit={handleSubmit} className="max-w-[800px] space-y-5">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>제목 *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="프로젝트 제목"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>카테고리 *</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className={inputClass}
          >
            <option value="">선택해주세요</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>클라이언트</label>
          <input
            type="text"
            value={form.client}
            onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))}
            placeholder="클라이언트 이름"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>날짜</label>
          <input
            type="text"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            placeholder="2024-03"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>짧은 설명 (카드용)</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="포트폴리오 카드에 표시될 짧은 설명"
          rows={2}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <label className={labelClass}>상세 내용 (상세페이지용)</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          placeholder="프로젝트에 대한 상세한 설명을 작성하세요. 줄바꿈을 사용할 수 있습니다."
          rows={6}
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Thumbnail */}
      <div>
        <label className={labelClass}>썸네일 이미지</label>
        <div className="flex items-start gap-4">
          {form.thumbnail && (
            <div className="w-32 h-20 rounded-lg overflow-hidden border border-gray-200 shrink-0">
              <img src={form.thumbnail} alt="썸네일" className="w-full h-full object-cover" />
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-[var(--color-gray)] text-sm hover:bg-gray-200 hover:border-gray-300 transition-all cursor-pointer disabled:opacity-50"
          >
            {uploading ? "업로드 중..." : form.thumbnail ? "변경" : "이미지 선택"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Gallery */}
      <div>
        <label className={labelClass}>갤러리 이미지</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {form.images.map((img, i) => (
            <div key={i} className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200 group">
              <img src={img} alt={`갤러리 ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(i)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs border-none cursor-pointer"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-[var(--color-gray)] text-sm hover:bg-gray-200 hover:border-gray-300 transition-all cursor-pointer disabled:opacity-50"
        >
          {uploading ? "업로드 중..." : "+ 이미지 추가"}
        </button>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryUpload}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>태그 (콤마 구분)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
            placeholder="React, Next.js, Tailwind CSS"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>라이브 사이트 URL</label>
          <input
            type="url"
            value={form.url}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
            placeholder="https://example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>정렬 순서</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
            className={inputClass}
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
              className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer"
            />
            <span className="text-[var(--color-dark-2)] text-sm font-medium">추천 프로젝트</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white rounded-xl font-semibold border-none cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              저장 중...
            </>
          ) : editId ? (
            "수정 완료"
          ) : (
            "추가하기"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/portfolio")}
          className="px-8 py-3 bg-gray-100 border border-gray-200 text-[var(--color-gray)] rounded-xl font-semibold cursor-pointer transition-all hover:bg-gray-200"
        >
          취소
        </button>
      </div>
    </form>
  );
}
