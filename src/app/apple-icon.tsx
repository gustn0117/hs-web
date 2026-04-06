import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#0f172a",
          borderRadius: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 상단 악센트 라인 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
          }}
        />
        <span
          style={{
            fontSize: "100px",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-4px",
            fontFamily: "sans-serif",
            marginTop: "4px",
          }}
        >
          H
        </span>
      </div>
    ),
    { ...size }
  );
}
