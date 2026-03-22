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
          background: "linear-gradient(135deg, #2563eb, #3b82f6)",
          borderRadius: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "90px",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-3px",
            fontFamily: "sans-serif",
          }}
        >
          H
        </span>
      </div>
    ),
    { ...size }
  );
}
