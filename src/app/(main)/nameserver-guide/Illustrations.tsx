/**
 * SVG illustrations for the nameserver-guide page.
 * Monochrome slate + indigo accent. Subtle SMIL animations.
 */

const C = {
  text: "#0f172a",
  text2: "#475569",
  sub: "#64748b",
  sub2: "#94a3b8",
  line: "#e2e8f0",
  line2: "#cbd5e1",
  bg1: "#f8fafc",
  bg2: "#f1f5f9",
  main: "#4f46e5",
  mainLight: "#eef2ff",
  white: "#ffffff",
} as const;

/* ─────────────────────────────────────────────────
 * 1) Main concept diagram — Domain → Signpost → Server
 *    "도메인이 어디로 가야 할지 표지판이 안내한다"
 * ───────────────────────────────────────────────── */
export function SignpostFlowDiagram() {
  return (
    <svg
      viewBox="0 0 760 280"
      className="w-full h-auto"
      role="img"
      aria-label="도메인이 네임서버를 거쳐 호스팅 서버로 안내되는 흐름"
    >
      <defs>
        <linearGradient id="ns-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bg1} />
          <stop offset="100%" stopColor={C.white} />
        </linearGradient>
        <linearGradient id="ns-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.white} />
          <stop offset="100%" stopColor={C.bg2} />
        </linearGradient>
        <linearGradient id="ns-srv-new" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.text} />
          <stop offset="100%" stopColor={C.text2} />
        </linearGradient>
        <linearGradient id="ns-srv-old" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.line2} />
          <stop offset="100%" stopColor={C.line} />
        </linearGradient>
        <filter id="ns-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
          <feOffset dy="2" />
          <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
          <feComposite in2="SourceAlpha" operator="in" />
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id="ns-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={C.main} />
        </marker>
        <marker id="ns-arrow-mute" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={C.sub2} />
        </marker>
      </defs>

      <rect x="0" y="0" width="760" height="280" fill="url(#ns-bg)" rx="14" />

      {/* ── Left: Domain card ──────────────────────────── */}
      <g transform="translate(40 90)" filter="url(#ns-shadow)">
        <rect x="0" y="0" width="160" height="100" rx="12" fill="url(#ns-card)" stroke={C.line} />
        <text x="80" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.main} letterSpacing="1.5">DOMAIN</text>
        <text x="80" y="58" textAnchor="middle" fontSize="16" fontWeight="800" fill={C.text} fontFamily="ui-monospace,SFMono-Regular,Menlo,monospace">yourdomain</text>
        <text x="80" y="78" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.text2} fontFamily="ui-monospace,SFMono-Regular,Menlo,monospace">.com</text>
        <text x="80" y="96" textAnchor="middle" fontSize="9" fill={C.sub}>주소 · 이름</text>
      </g>

      {/* arrow domain → signpost */}
      <path d="M 205 140 L 295 140" stroke={C.main} strokeWidth="2" fill="none" markerEnd="url(#ns-arrow)" />
      <circle r="3" fill={C.main}>
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M 205 140 L 295 140" />
        <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" />
      </circle>

      {/* ── Center: Signpost (Nameserver) ──────────────── */}
      <g transform="translate(300 60)">
        {/* Pole */}
        <rect x="76" y="100" width="8" height="120" fill={C.text2} rx="2" />
        <rect x="68" y="216" width="24" height="6" rx="2" fill={C.text} />

        {/* Top sign — main label */}
        <g filter="url(#ns-shadow)">
          <rect x="20" y="20" width="120" height="44" rx="10" fill={C.text} />
          <text x="80" y="38" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.sub2} letterSpacing="1.4">NAMESERVER</text>
          <text x="80" y="56" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.white}>표지판</text>
        </g>

        {/* Arrow pointing right (to new server) */}
        <g>
          <rect x="40" y="76" width="120" height="22" rx="4" fill={C.main} />
          <polygon points="160,76 180,87 160,98" fill={C.main} />
          <text x="92" y="91" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.white} letterSpacing="0.5">새 호스팅</text>
        </g>
      </g>

      {/* arrow signpost → new server */}
      <path d="M 500 140 L 580 140" stroke={C.main} strokeWidth="2" fill="none" markerEnd="url(#ns-arrow)" />
      <circle r="3" fill={C.main}>
        <animateMotion dur="2.4s" begin="0.6s" repeatCount="indefinite" path="M 500 140 L 580 140" />
        <animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
      </circle>

      {/* ── Right: New Server ──────────────────────────── */}
      <g transform="translate(585 80)" filter="url(#ns-shadow)">
        <rect x="0" y="0" width="130" height="120" rx="12" fill="url(#ns-srv-new)" />
        {/* server racks */}
        <g opacity="0.55">
          <rect x="14" y="18" width="102" height="14" rx="3" fill={C.white} opacity="0.18" />
          <circle cx="22" cy="25" r="2" fill="#22c55e" />
          <rect x="14" y="38" width="102" height="14" rx="3" fill={C.white} opacity="0.18" />
          <circle cx="22" cy="45" r="2" fill="#22c55e" />
          <rect x="14" y="58" width="102" height="14" rx="3" fill={C.white} opacity="0.18" />
          <circle cx="22" cy="65" r="2" fill="#22c55e" />
        </g>
        <text x="65" y="93" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.sub2} letterSpacing="1.4">NEW HOSTING</text>
        <text x="65" y="110" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.white}>새 서버</text>
      </g>

      {/* old server (muted, dashed) */}
      <g transform="translate(585 215)" opacity="0.55">
        <rect x="0" y="0" width="90" height="44" rx="8" fill="url(#ns-srv-old)" stroke={C.line2} strokeDasharray="4 3" />
        <text x="45" y="22" textAnchor="middle" fontSize="8" fontWeight="700" fill={C.sub} letterSpacing="1.2">OLD</text>
        <text x="45" y="36" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.sub}>옛 서버</text>
      </g>
      {/* strike line through old */}
      <line x1="585" y1="237" x2="675" y2="237" stroke={C.sub} strokeWidth="1.2" strokeLinecap="round" />

      {/* Labels under arrows */}
      <text x="250" y="160" textAnchor="middle" fontSize="10" fontWeight="600" fill={C.sub}>물어봄</text>
      <text x="540" y="160" textAnchor="middle" fontSize="10" fontWeight="600" fill={C.sub}>안내됨</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────
 * 2) Before/After comparison
 * ───────────────────────────────────────────────── */
export function BeforeAfterDiagram() {
  return (
    <svg
      viewBox="0 0 720 220"
      className="w-full h-auto"
      role="img"
      aria-label="네임서버 변경 전후 비교"
    >
      <defs>
        <linearGradient id="ba-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.white} />
          <stop offset="100%" stopColor={C.bg1} />
        </linearGradient>
        <marker id="ba-arrow-mute" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={C.sub2} />
        </marker>
        <marker id="ba-arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={C.main} />
        </marker>
      </defs>

      <rect x="0" y="0" width="720" height="220" fill="url(#ba-bg)" rx="14" />

      {/* ── BEFORE (top) ──────────────────────────────── */}
      <g transform="translate(0 28)">
        <text x="30" y="0" fontSize="10" fontWeight="700" fill={C.sub} letterSpacing="1.4">BEFORE · 변경 전</text>

        {/* domain */}
        <rect x="30" y="14" width="120" height="42" rx="8" fill={C.white} stroke={C.line} />
        <text x="90" y="32" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.sub} letterSpacing="1">DOMAIN</text>
        <text x="90" y="48" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.text} fontFamily="ui-monospace,monospace">yourdomain.com</text>

        {/* arrow */}
        <line x1="155" y1="35" x2="245" y2="35" stroke={C.sub2} strokeWidth="1.5" markerEnd="url(#ba-arrow-mute)" />

        {/* old NS */}
        <rect x="250" y="14" width="170" height="42" rx="8" fill={C.bg2} stroke={C.line} />
        <text x="335" y="32" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.sub} letterSpacing="1">기존 네임서버</text>
        <text x="335" y="48" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.text2} fontFamily="ui-monospace,monospace">ns.gabia.co.kr</text>

        {/* arrow */}
        <line x1="425" y1="35" x2="515" y2="35" stroke={C.sub2} strokeWidth="1.5" markerEnd="url(#ba-arrow-mute)" />

        {/* old server */}
        <rect x="520" y="14" width="160" height="42" rx="8" fill={C.bg2} stroke={C.line} />
        <text x="600" y="32" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.sub} letterSpacing="1">옛 호스팅</text>
        <text x="600" y="48" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.text2}>가비아 서버</text>
      </g>

      {/* divider */}
      <line x1="30" y1="116" x2="690" y2="116" stroke={C.line} strokeDasharray="3 4" />

      {/* ── AFTER (bottom) ────────────────────────────── */}
      <g transform="translate(0 142)">
        <text x="30" y="0" fontSize="10" fontWeight="700" fill={C.main} letterSpacing="1.4">AFTER · 변경 후</text>

        {/* domain (unchanged) */}
        <rect x="30" y="14" width="120" height="42" rx="8" fill={C.white} stroke={C.line} />
        <text x="90" y="32" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.sub} letterSpacing="1">DOMAIN</text>
        <text x="90" y="48" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.text} fontFamily="ui-monospace,monospace">yourdomain.com</text>

        {/* arrow */}
        <line x1="155" y1="35" x2="245" y2="35" stroke={C.main} strokeWidth="2" markerEnd="url(#ba-arrow-active)" />

        {/* NEW NS (highlighted) */}
        <rect x="250" y="14" width="170" height="42" rx="8" fill={C.mainLight} stroke={C.main} strokeWidth="1.5" />
        <text x="335" y="32" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.main} letterSpacing="1">새 네임서버 ✓</text>
        <text x="335" y="48" textAnchor="middle" fontSize="10" fontWeight="800" fill={C.text} fontFamily="ui-monospace,monospace">xxx.ns.cloudflare.com</text>

        {/* arrow */}
        <line x1="425" y1="35" x2="515" y2="35" stroke={C.main} strokeWidth="2" markerEnd="url(#ba-arrow-active)" />

        {/* new server */}
        <rect x="520" y="14" width="160" height="42" rx="8" fill={C.text} />
        <text x="600" y="32" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.sub2} letterSpacing="1">새 호스팅</text>
        <text x="600" y="48" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.white}>새 서버</text>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────
 * 3) Checklist illustration — preparation
 * ───────────────────────────────────────────────── */
export function ChecklistIllustration() {
  return (
    <svg viewBox="0 0 360 320" className="w-full h-auto" role="img" aria-label="네임서버 변경 전 준비물">
      <defs>
        <linearGradient id="cl-clip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bg1} />
          <stop offset="100%" stopColor={C.white} />
        </linearGradient>
        <filter id="cl-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
          <feOffset dy="3" />
          <feComponentTransfer><feFuncA type="linear" slope="0.12" /></feComponentTransfer>
          <feComposite in2="SourceAlpha" operator="in" />
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g filter="url(#cl-shadow)">
        {/* clipboard */}
        <rect x="40" y="40" width="280" height="260" rx="14" fill="url(#cl-clip)" stroke={C.line} />
        {/* clip top */}
        <rect x="130" y="20" width="100" height="32" rx="6" fill={C.text} />
        <rect x="155" y="14" width="50" height="14" rx="4" fill={C.text2} />

        {/* title */}
        <text x="180" y="84" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.main} letterSpacing="1.4">PREPARE</text>
        <text x="180" y="106" textAnchor="middle" fontSize="15" fontWeight="800" fill={C.text}>변경 전 준비물</text>

        {/* divider */}
        <line x1="64" y1="124" x2="296" y2="124" stroke={C.line} />

        {/* items */}
        {[
          { y: 152, t: "도메인 등록업체 로그인", s: "가비아·후이즈 등 도메인 산 곳 계정" },
          { y: 200, t: "새 네임서버 주소 2개", s: "이전할 호스팅이 안내한 ns 주소" },
          { y: 248, t: "기존 DNS 레코드 백업", s: "A · MX · TXT 메모/캡처" },
        ].map((it, i) => (
          <g key={i}>
            {/* check circle */}
            <circle cx="80" cy={it.y} r="11" fill={C.text} />
            <path d={`M 74 ${it.y} l 4 4 l 8 -8`} stroke={C.white} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="104" y={it.y - 3} fontSize="13" fontWeight="700" fill={C.text}>{it.t}</text>
            <text x="104" y={it.y + 14} fontSize="11" fill={C.sub}>{it.s}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────
 * 4) Propagation map — DNS spread visualization
 * ───────────────────────────────────────────────── */
export function PropagationMap() {
  // Approximated dots for major world regions
  const dots = [
    { x: 470, y: 130, delay: 0,    label: "Seoul" },
    { x: 455, y: 140, delay: 0.2 },
    { x: 425, y: 145, delay: 0.4 },
    { x: 380, y: 175, delay: 0.6 },
    { x: 250, y: 110, delay: 0.8 },
    { x: 200, y: 130, delay: 1.0 },
    { x: 145, y: 160, delay: 1.2 },
    { x: 105, y: 120, delay: 1.4 },
    { x: 175, y: 240, delay: 1.6 },
    { x: 510, y: 230, delay: 1.8 },
    { x: 540, y: 105, delay: 2.0 },
  ];

  return (
    <svg viewBox="0 0 600 320" className="w-full h-auto" role="img" aria-label="전 세계 DNS 전파 모식도">
      <defs>
        <linearGradient id="pm-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bg1} />
          <stop offset="100%" stopColor={C.white} />
        </linearGradient>
        <radialGradient id="pm-glow">
          <stop offset="0%" stopColor={C.main} stopOpacity="0.35" />
          <stop offset="100%" stopColor={C.main} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="600" height="320" fill="url(#pm-bg)" rx="14" />

      {/* World silhouette — abstract continent blobs */}
      <g fill={C.line2} opacity="0.55">
        {/* North America */}
        <path d="M70,120 q 20,-30 60,-22 q 30,5 50,25 q 10,15 -5,30 q -25,18 -55,10 q -45,-10 -50,-43 z" />
        {/* South America */}
        <path d="M160,200 q 8,-10 22,-8 q 14,2 20,16 q 5,18 -3,32 q -10,14 -25,8 q -18,-9 -14,-48 z" />
        {/* Europe */}
        <path d="M250,100 q 14,-12 34,-8 q 22,4 32,16 q 6,14 -4,22 q -22,12 -42,6 q -22,-8 -20,-36 z" />
        {/* Africa */}
        <path d="M275,165 q 10,-6 26,-2 q 18,6 22,28 q 4,30 -8,42 q -16,12 -28,-2 q -22,-22 -12,-66 z" />
        {/* Asia */}
        <path d="M350,90 q 30,-20 80,-10 q 60,8 100,40 q 12,18 -8,30 q -50,16 -110,10 q -70,-8 -62,-70 z" />
        {/* Oceania */}
        <path d="M490,220 q 18,-6 38,-2 q 14,4 16,16 q 0,12 -16,16 q -22,4 -34,-6 q -10,-10 -4,-24 z" />
      </g>

      {/* Origin pulse (Korea) */}
      <g>
        <circle cx="470" cy="130" r="6" fill={C.main} />
        <circle cx="470" cy="130" r="6" fill="none" stroke={C.main} strokeWidth="2">
          <animate attributeName="r" values="6;40" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="470" cy="130" r="6" fill="none" stroke={C.main} strokeWidth="2">
          <animate attributeName="r" values="6;40" dur="2.6s" begin="1.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="2.6s" begin="1.3s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Spreading dots */}
      {dots.map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r="4" fill={C.text}>
            <animate attributeName="opacity" values="0;0;1" dur="3.4s" begin={`${d.delay}s`} repeatCount="indefinite" keyTimes="0;0.2;1" />
          </circle>
          <circle cx={d.x} cy={d.y} r="4" fill="none" stroke={C.main} strokeOpacity="0.5">
            <animate attributeName="r" values="4;12" dur="1.6s" begin={`${d.delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="1.6s" begin={`${d.delay}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Legend */}
      <g transform="translate(28 28)">
        <circle cx="8" cy="8" r="4" fill={C.main} />
        <text x="22" y="12" fontSize="11" fontWeight="700" fill={C.text}>변경 시점 (한국)</text>
      </g>
      <g transform="translate(28 52)">
        <circle cx="8" cy="8" r="4" fill={C.text} />
        <text x="22" y="12" fontSize="11" fontWeight="700" fill={C.text2}>점점 퍼지는 DNS 캐시</text>
      </g>

      {/* Timeline footer */}
      <g transform="translate(28 280)">
        <text fontSize="10" fontWeight="700" fill={C.sub} letterSpacing="1.2">TIMELINE</text>
        <text y="18" fontSize="11" fill={C.text2}>몇 분 내 → 수 시간 → 최대 24~48시간 (전 세계 완전 전파)</text>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────
 * 5) Three-piece concept icons (도메인 · 네임서버 · 호스팅)
 * ───────────────────────────────────────────────── */
export function DomainPieceIcon() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-auto">
      <defs>
        <linearGradient id="dp-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.white} />
          <stop offset="100%" stopColor={C.bg2} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="120" height="120" fill="url(#dp-grad)" rx="14" />
      {/* envelope */}
      <g transform="translate(22 36)">
        <rect x="0" y="0" width="76" height="50" rx="6" fill={C.white} stroke={C.text} strokeWidth="2" />
        <polyline points="0,0 38,28 76,0" fill="none" stroke={C.text} strokeWidth="2" strokeLinejoin="round" />
        {/* address line */}
        <line x1="12" y1="40" x2="64" y2="40" stroke={C.line2} strokeWidth="2" strokeLinecap="round" />
      </g>
      <text x="60" y="104" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.sub} letterSpacing="1">주소 · DOMAIN</text>
    </svg>
  );
}

export function SignpostPieceIcon() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-auto">
      <defs>
        <linearGradient id="sp-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.white} />
          <stop offset="100%" stopColor={C.bg2} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="120" height="120" fill="url(#sp-grad)" rx="14" />

      {/* Pole (drawn behind signs) */}
      <rect x="41" y="26" width="4" height="56" fill={C.text2} rx="1.5" />

      {/* Top sign — dark, pointing right */}
      <path d="M 39 28 L 75 28 L 83 36 L 75 44 L 39 44 Z" fill={C.text} />

      {/* Bottom sign — main color, pointing right */}
      <path d="M 39 50 L 75 50 L 83 58 L 75 66 L 39 66 Z" fill={C.main} />

      {/* Pole base */}
      <rect x="33" y="78" width="20" height="4" rx="1" fill={C.text} />

      {/* Ground line */}
      <line x1="22" y1="84" x2="64" y2="84" stroke={C.line2} strokeWidth="1" strokeDasharray="2 3" />

      <text x="60" y="104" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.sub} letterSpacing="1">표지판 · NAMESERVER</text>
    </svg>
  );
}

export function ServerPieceIcon() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-auto">
      <defs>
        <linearGradient id="srv-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.white} />
          <stop offset="100%" stopColor={C.bg2} />
        </linearGradient>
        <linearGradient id="srv-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.text} />
          <stop offset="100%" stopColor={C.text2} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="120" height="120" fill="url(#srv-grad)" rx="14" />
      {/* server building */}
      <g transform="translate(28 26)">
        <rect x="0" y="0" width="64" height="68" rx="6" fill="url(#srv-body)" />
        {/* racks */}
        <rect x="8" y="10" width="48" height="10" rx="2" fill={C.white} opacity="0.16" />
        <circle cx="14" cy="15" r="1.6" fill="#22c55e" />
        <rect x="8" y="24" width="48" height="10" rx="2" fill={C.white} opacity="0.16" />
        <circle cx="14" cy="29" r="1.6" fill="#22c55e" />
        <rect x="8" y="38" width="48" height="10" rx="2" fill={C.white} opacity="0.16" />
        <circle cx="14" cy="43" r="1.6" fill="#22c55e" />
        <rect x="8" y="52" width="48" height="10" rx="2" fill={C.white} opacity="0.16" />
        <circle cx="14" cy="57" r="1.6" fill="#22c55e" />
      </g>
      <text x="60" y="104" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.sub} letterSpacing="1">건물 · HOSTING</text>
    </svg>
  );
}
