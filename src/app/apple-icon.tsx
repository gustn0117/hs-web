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
          background: "linear-gradient(135deg, #0f1a2d, #1e293b)",
          borderRadius: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        <span
          style={{
            fontSize: "56px",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-2px",
          }}
        >
          HS
        </span>
      </div>
    ),
    { ...size }
  );
}
