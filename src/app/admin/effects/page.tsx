import AdminHeader from "../components/AdminHeader";
import EffectsShowcase from "./EffectsShowcase";

export const metadata = {
  title: "이펙트 라이브러리 — 관리자",
  robots: { index: false, follow: false },
};

export default function AdminEffectsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[11px] font-black text-slate-400 tracking-[0.18em] uppercase mb-1.5">
              EFFECTS LIBRARY · INTERNAL
            </p>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">이펙트 라이브러리</h2>
            <p className="text-slate-500 text-sm mt-1">
              React · Next.js로 구현 가능한 인터랙션·애니메이션 카탈로그. 호버·등장·텍스트·데코 카테고리별 라이브 데모.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-amber-50 border border-amber-100 text-[11px] font-bold text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            관리자 전용 · 외부 노출 안 됨
          </span>
        </div>

        <EffectsShowcase />
      </div>
    </div>
  );
}
