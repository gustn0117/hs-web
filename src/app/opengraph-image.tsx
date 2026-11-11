import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * 카카오톡·슬랙·문자로 주소를 보낼 때 뜨는 썸네일.
 *
 * 흰 바탕에 로고와 「하온」만 둔다. 카톡은 이 그림 아래에 제목과 설명을
 * 따로 붙여 주므로, 그림에까지 설명을 채우면 같은 말이 두 번 나온다.
 *
 * 이 파일 하나가 사이트 전체(/, /portfolio, /pricing, /client …)의
 * 썸네일이다. 페이지마다 따로 두지 않는다.
 */
export const runtime = "nodejs";
export const alt = "하온 — 홈페이지·업무 시스템 제작";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 로고를 그림 안에 박아 넣는다. 주소로 걸면 그릴 때마다 또 받아 와야 한다. */
function markDataUri(): string | null {
  try {
    const buf = readFileSync(join(process.cwd(), "public/brand/haon-mark.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    // 파일을 못 읽어도 썸네일은 떠야 한다. 그때는 글자만 나간다.
    return null;
  }
}

export default async function Image() {
  const mark = markDataUri();

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
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "38px" }}>
          {mark ? (
            // 161x240 비율 그대로
            <img src={mark} width={113} height={168} alt="" />
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: "132px",
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "-5px",
              lineHeight: 1,
            }}
          >
            하온
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "46px",
            fontSize: "21px",
            fontWeight: 600,
            color: "#8a8a90",
            letterSpacing: "9px",
          }}
        >
          HAON SOFTWARE SOLUTIONS
        </div>
      </div>
    ),
    { ...size },
  );
}
