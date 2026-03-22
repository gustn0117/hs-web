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
          background: "linear-gradient(135deg, #2563eb, #3b82f6)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "-0.5px",
          fontFamily: "sans-serif",
        }}
      >
        H
      </div>
    ),
    { ...size }
  );
}
