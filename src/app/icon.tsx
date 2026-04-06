import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0f172a",
          borderRadius: "7px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 악센트 라인 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
          }}
        />
        <span
          style={{
            fontSize: "19px",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-1px",
            fontFamily: "sans-serif",
            marginTop: "1px",
          }}
        >
          H
        </span>
      </div>
    ),
    { ...size }
  );
}
