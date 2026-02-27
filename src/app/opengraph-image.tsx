import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "HS WEB - 홈페이지 제작 전문 웹에이전시";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #0f1a2d 40%, #1e293b 100%)",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        {/* Blue accent line at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #2563eb, #3b82f6, #2563eb)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              fontSize: "64px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            <span>HS</span>
            <span style={{ color: "#2563eb" }}>WEB</span>
          </div>
          {/* Divider */}
          <div
            style={{
              width: "60px",
              height: "3px",
              background: "#2563eb",
              borderRadius: "2px",
            }}
          />
          {/* Main text */}
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#e2e8f0",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            홈페이지 제작 전문 웹에이전시
          </div>
          {/* Sub text */}
          <div
            style={{
              fontSize: "18px",
              color: "#94a3b8",
              textAlign: "center",
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            반응형 웹디자인 · 쇼핑몰 구축 · 랜딩페이지 · 기술 마케팅
          </div>
          {/* URL */}
          <div
            style={{
              fontSize: "16px",
              color: "#2563eb",
              marginTop: "12px",
              fontWeight: 600,
            }}
          >
            hsweb.pics
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
