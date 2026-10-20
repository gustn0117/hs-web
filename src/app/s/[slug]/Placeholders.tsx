// 사진이 준비되기 전까지 자리만 잡아두는 빗금 블록.
// 실제 이미지가 생기면 이 자리에 그대로 넣으면 된다.

const LIGHT =
  "repeating-linear-gradient(135deg, transparent 0 9px, rgba(15,23,42,0.07) 9px 10px)";
const DARK =
  "repeating-linear-gradient(135deg, transparent 0 11px, rgba(255,255,255,0.13) 11px 13px)";

export function Hatch({
  className = "",
  tone = "light",
  label,
}: {
  className?: string;
  tone?: "light" | "dark";
  label?: string;
}) {
  return (
    <div
      aria-hidden
      className={`relative flex items-center justify-center ${
        tone === "dark" ? "bg-white/[0.04]" : "bg-[var(--c-bg-2)]"
      } ${className}`}
      style={{ backgroundImage: tone === "dark" ? DARK : LIGHT }}
    >
      {label && (
        <span
          className={`text-[11px] font-semibold tracking-wide ${
            tone === "dark" ? "text-white/35" : "text-[var(--c-sub-2)]"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/** PC·태블릿·휴대폰에서 같은 화면이 어떻게 달라지는지 보여주는 자리 */
export function DeviceFrames({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const border = tone === "dark" ? "border-white/20" : "border-[var(--c-line-2)]";
  const label = tone === "dark" ? "text-white/40" : "text-[var(--c-sub)]";
  return (
    <div className="flex items-end justify-center gap-3 md:gap-5">
      <div className="flex-1 max-w-[560px]">
        <div className={`border ${border} p-1.5`}>
          <Hatch tone={tone} className="aspect-[16/10]" label="PC 화면" />
        </div>
        <p className={`mt-2 text-center text-[11px] ${label}`}>PC · 1280px 이상</p>
      </div>
      <div className="w-[22%] max-w-[150px] hidden sm:block">
        <div className={`border ${border} p-1.5`}>
          <Hatch tone={tone} className="aspect-[3/4]" />
        </div>
        <p className={`mt-2 text-center text-[11px] ${label}`}>태블릿 · 768px</p>
      </div>
      <div className="w-[16%] max-w-[96px]">
        <div className={`border ${border} p-1`}>
          <Hatch tone={tone} className="aspect-[9/19]" />
        </div>
        <p className={`mt-2 text-center text-[11px] ${label}`}>휴대폰 · 390px</p>
      </div>
    </div>
  );
}
