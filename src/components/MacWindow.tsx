import Image from "next/image";

/**
 * 맥 창 틀. 제작한 화면을 보여주는 자리에만 쓴다.
 *
 * 값은 macOS Ventura UI 키트에서 그대로 가져왔다.
 * 타이틀바 rgba(252,252,252,0.8) + 블러 13.591px, 아래 두 겹 경계선,
 * 창 조절 버튼 12px, 제목 13px Bold rgba(0,0,0,0.7).
 */
export default function MacWindow({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[10px] bg-[#fcfcfc] shadow-[0_0_0_0.5px_rgba(0,0,0,0.18),0_14px_34px_-14px_rgba(0,0,0,0.35)] ${className}`}
    >
      <div
        className="relative flex h-7 items-center px-2 backdrop-blur-[13.591px]"
        style={{
          background: "rgba(252,252,252,0.8)",
          boxShadow: "0 0.5px 0 0 rgba(0,0,0,0.1), 0 1px 0 0 rgba(0,0,0,0.05)",
        }}
      >
        <span className="flex w-[52px] shrink-0 gap-2">
          <Image src="/mac-ui/close.svg" alt="" width={12} height={12} />
          <Image src="/mac-ui/minimize.svg" alt="" width={12} height={12} />
          <Image src="/mac-ui/zoom.svg" alt="" width={12} height={12} />
        </span>
        {title && (
          <span className="pointer-events-none absolute inset-x-12 truncate text-center text-[13px] font-bold text-[rgba(0,0,0,0.7)]">
            {title}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
