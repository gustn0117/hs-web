// 이미지가 준비되기 전까지 자리만 잡아두는 빗금 썸네일.
// 나중에 실제 이미지를 넣으면 이 자리에 그대로 들어간다.
export default function ThumbPlaceholder({ ratio = "aspect-[16/10]" }: { ratio?: string }) {
  return (
    <div
      aria-hidden
      className={`w-full ${ratio} bg-[var(--c-bg-2)] border-b border-[var(--c-line)]`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 9px, rgba(15,23,42,0.07) 9px 10px)",
      }}
    />
  );
}
