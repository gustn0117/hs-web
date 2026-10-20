export function CustomBuildIllustration() {
  return (
    <svg viewBox="0 0 400 360" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="cb-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4a7cd0" />
          <stop offset="100%" stopColor="#2459b0" />
        </linearGradient>
        <linearGradient id="cb-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e4b9a" />
          <stop offset="100%" stopColor="#0a2a5e" />
        </linearGradient>
        <linearGradient id="cb-right" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2459b0" />
          <stop offset="100%" stopColor="#123a7f" />
        </linearGradient>
        <radialGradient id="cb-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(36,89,176,0.28)" />
          <stop offset="100%" stopColor="rgba(36,89,176,0)" />
        </radialGradient>
        <filter id="cb-floor-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <circle cx="200" cy="190" r="160" fill="url(#cb-glow)" />

      {/* Floor grid */}
      <g opacity="0.18" stroke="#2459b0" strokeWidth="0.7" fill="none">
        <path d="M 60 290 L 340 210 M 80 318 L 360 238" />
        <path d="M 140 140 L 300 320 M 100 160 L 260 340 M 180 120 L 340 300" />
      </g>

      {/* Ground shadow */}
      <ellipse cx="200" cy="320" rx="100" ry="14" fill="rgba(10,42,94,0.32)" filter="url(#cb-floor-shadow)" />

      {/*
        Stacked tower of 3 isometric cubes (Lego-style).
        One cube spans 78 units (top diamond 48 + side face 30).
        For physical stacking, each next cube sits on top — y offset by -30 (side height).
        We draw bottom-up (largest y first), but render order is also bottom-first so upper cubes overlap.
      */}
      <g transform="translate(200 178)">
        {[
          { offsetX: 0,  symbol: "{ }",  side: "DB" },   // bottom
          { offsetX: -4, symbol: "</>", side: "API" },   // middle
          { offsetX: 4,  symbol: "fn()", side: "UI" },   // top
        ].map((layer, i) => {
          const y = -i * 30; // each layer 30px up (= side face height)
          return (
            <g key={i} transform={`translate(${layer.offsetX} ${y})`}>
              {/* Left face */}
              <path d="M -70 24 L -70 54 L 0 78 L 0 48 Z" fill="url(#cb-left)" />
              {/* Right face */}
              <path d="M 0 48 L 0 78 L 70 54 L 70 24 Z" fill="url(#cb-right)" />
              {/* Top */}
              <path d="M 0 0 L 70 24 L 0 48 L -70 24 Z" fill="url(#cb-top)" />

              {/* Edge highlights */}
              <path
                d="M -70 24 L 0 48 L 70 24 M 0 48 L 0 78"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1"
                fill="none"
              />

              {/* Code symbol on left face */}
              <text
                x="-44"
                y="48"
                fontFamily="ui-monospace, Consolas, monospace"
                fontSize="11"
                fontWeight="800"
                fill="rgba(255,255,255,0.85)"
                transform="skewY(20)"
              >
                {layer.symbol}
              </text>
              {/* Code symbol on right face */}
              <text
                x="22"
                y="50"
                fontFamily="ui-monospace, Consolas, monospace"
                fontSize="11"
                fontWeight="800"
                fill="rgba(255,255,255,0.75)"
                transform="skewY(-20)"
              >
                {layer.side}
              </text>
            </g>
          );
        })}
      </g>

      {/* "100% CUSTOM" badge — top right, separated from tower */}
      <g transform="translate(330 60)">
        <circle cx="0" cy="0" r="34" fill="#0a2a5e" />
        <circle cx="0" cy="0" r="34" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <circle cx="0" cy="0" r="29" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeDasharray="2 3" />
        <text x="0" y="-2" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="11" fontWeight="900" fill="#fff">
          100%
        </text>
        <text x="0" y="11" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="7" fontWeight="700" fill="rgba(255,255,255,0.75)" letterSpacing="1.5">
          CUSTOM
        </text>
      </g>

      {/* Connection line from badge to top of tower */}
      <path
        d="M 305 76 Q 270 80 218 110"
        stroke="rgba(10,42,94,0.35)"
        strokeWidth="1"
        strokeDasharray="2 3"
        fill="none"
      />

      {/* Caption pill bottom */}
      <g transform="translate(200 360)">
        <text x="0" y="-12" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="10" fontWeight="700" fill="#0a2a5e" letterSpacing="1">
          Next.js · React · TypeScript
        </text>
      </g>
    </svg>
  );
}

export function PlatformBoxIllustration() {
  return (
    <svg viewBox="0 0 400 360" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="pb-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="pb-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="pb-right" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <radialGradient id="pb-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(100,116,139,0.25)" />
          <stop offset="100%" stopColor="rgba(100,116,139,0)" />
        </radialGradient>
        <filter id="pb-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <circle cx="200" cy="200" r="170" fill="url(#pb-glow)" />

      {/* Floor grid */}
      <g opacity="0.13" stroke="#64748b" strokeWidth="0.7" fill="none">
        <path d="M 60 270 L 340 190 M 80 298 L 360 218 M 40 242 L 320 162" />
        <path d="M 140 120 L 300 300 M 100 140 L 260 320 M 180 100 L 340 280" />
      </g>

      {/* Shadow */}
      <ellipse cx="200" cy="310" rx="120" ry="16" fill="rgba(15,23,42,0.3)" filter="url(#pb-shadow)" />

      {/* Big package box (single, locked) */}
      <g transform="translate(200 130)">
        {/* Top */}
        <path d="M 0 0 L 100 36 L 0 72 L -100 36 Z" fill="url(#pb-top)" />
        {/* Left */}
        <path d="M -100 36 L -100 90 L 0 144 L 0 72 Z" fill="url(#pb-left)" />
        {/* Right */}
        <path d="M 0 72 L 0 144 L 100 90 L 100 36 Z" fill="url(#pb-right)" />

        {/* Tape/strap on top */}
        <path d="M -100 36 L 0 72 L 100 36" stroke="rgba(217,119,6,0.6)" strokeWidth="3" fill="none" />
        <path d="M 0 0 L 0 72" stroke="rgba(217,119,6,0.4)" strokeWidth="2" fill="none" strokeDasharray="3 3" />

        {/* Edges */}
        <path d="M -100 36 L 0 72 L 100 36 M 0 72 L 0 144" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none" />

        {/* Front label */}
        <g transform="translate(-50 90) skewY(20)">
          <rect x="0" y="0" width="60" height="22" rx="2" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
          <text x="30" y="9" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="6.5" fontWeight="800" fill="rgba(255,255,255,0.85)" letterSpacing="1">
            TEMPLATE
          </text>
          <text x="30" y="17" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="5.5" fontWeight="600" fill="rgba(255,255,255,0.6)">
            v.2.4 · stock
          </text>
        </g>

        {/* Lock on right face (vendor lock-in) */}
        <g transform="translate(35 75) skewY(-20)">
          <rect x="-7" y="-2" width="14" height="11" rx="1.5" fill="#fbbf24" />
          <path d="M -4 -2 v -4 a 4 4 0 0 1 8 0 v 4" fill="none" stroke="#92400e" strokeWidth="1.4" />
          <circle cx="0" cy="3" r="1.4" fill="#92400e" />
        </g>
      </g>

      {/* Subscription / billing icon (top right) */}
      <g transform="translate(310 80)" filter="url(#pb-shadow)">
        <rect x="-30" y="-22" width="60" height="44" rx="6" fill="#fff" stroke="#cbd5e1" strokeWidth="0.8" />
        <text x="0" y="-6" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="6" fontWeight="700" fill="#94a3b8" letterSpacing="0.5">
          MONTHLY
        </text>
        <text x="0" y="8" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="11" fontWeight="900" fill="#0f172a">
          ₩₩₩
        </text>
        <text x="0" y="18" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="5" fontWeight="600" fill="#64748b">
          recurring
        </text>
      </g>

      {/* "Limited" stamp */}
      <g transform="translate(80 80) rotate(-12)">
        <rect x="-32" y="-10" width="64" height="20" rx="2" fill="none" stroke="#dc2626" strokeWidth="1.5" />
        <text x="0" y="3" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="8" fontWeight="900" fill="#dc2626" letterSpacing="2">
          LIMITED
        </text>
      </g>
    </svg>
  );
}

export function ScalesIllustration() {
  /*
   * 정확한 기하 계산:
   *  - 피벗 (300, 60), 빔 길이 좌우 각 220
   *  - tilt -8° 회전 → cos(-8°)≈0.9903, sin(-8°)≈-0.1392
   *  - 좌측 빔 끝 = (300 + (-220)·cos, 60 + (-220)·sin) ≈ (82, 91)
   *  - 우측 빔 끝 = (300 + 220·cos,  60 + 220·sin)  ≈ (518, 29)
   * 끈은 빔 끝에서 정확히 시작해 접시 중앙으로 연결.
   */
  const tilt = -8; // degrees
  const cos = Math.cos((tilt * Math.PI) / 180);
  const sin = Math.sin((tilt * Math.PI) / 180);
  const pivotX = 300;
  const pivotY = 60;
  const beamLen = 220;
  const lx = pivotX - beamLen * cos;
  const ly = pivotY - beamLen * sin;
  const rx = pivotX + beamLen * cos;
  const ry = pivotY + beamLen * sin;
  // 접시 위치(빔 끝에서 아래로 떨어진 위치)
  const lPlateY = 145; // custom (lower)
  const rPlateY = 90; // platform (higher)

  return (
    <svg viewBox="0 0 600 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="sc-pillar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a2a5e" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="sc-platter-l" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b6ecb" />
          <stop offset="100%" stopColor="#1e4b9a" />
        </linearGradient>
        <linearGradient id="sc-platter-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Base */}
      <rect x="240" y="210" width="120" height="10" rx="2" fill="#0f172a" />
      {/* Pillar */}
      <rect x="294" y="60" width="12" height="155" fill="url(#sc-pillar)" />

      {/* Beam (rotated around pivot) */}
      <g transform={`translate(${pivotX} ${pivotY}) rotate(${tilt})`}>
        <rect x={-beamLen} y="-3" width={beamLen * 2} height="6" rx="2" fill="#0f172a" />
      </g>
      {/* Pivot circle (drawn after beam to overlap) */}
      <circle cx={pivotX} cy={pivotY} r="6" fill="#fff" stroke="#0f172a" strokeWidth="2" />

      {/* ── LEFT side: 자체 개발 (heavier, plate lower) ── */}
      {/* String from beam end → plate */}
      <line x1={lx} y1={ly} x2={lx} y2={lPlateY} stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
      {/* Plate */}
      <g transform={`translate(${lx} ${lPlateY})`}>
        <ellipse cx="0" cy="0" rx="56" ry="6" fill="#0f172a" />
        <path d="M -56 0 L -50 12 L 50 12 L 56 0 Z" fill="url(#sc-platter-l)" />
        {/* Stack on plate */}
        <g>
          <rect x="-30" y="-26" width="60" height="22" rx="3" fill="#fff" stroke="#cbd5e1" strokeWidth="0.6" />
          <text x="0" y="-17" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="7" fontWeight="900" fill="#0a2a5e">
            CUSTOM
          </text>
          <text x="0" y="-7" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="6" fill="#475569">
            speed · seo · ux
          </text>
          <rect x="-22" y="-42" width="44" height="14" rx="2" fill="#2459b0" />
          <text x="0" y="-32" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="6.5" fontWeight="800" fill="#fff">
            제어 100%
          </text>
        </g>
        <text x="0" y="38" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="11" fontWeight="900" fill="#0a2a5e">
          자체 개발
        </text>
      </g>

      {/* ── RIGHT side: 플랫폼 (lighter, plate higher) ── */}
      <line x1={rx} y1={ry} x2={rx} y2={rPlateY} stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
      <g transform={`translate(${rx} ${rPlateY})`}>
        <ellipse cx="0" cy="0" rx="56" ry="6" fill="#0f172a" />
        <path d="M -56 0 L -50 12 L 50 12 L 56 0 Z" fill="url(#sc-platter-r)" />
        <g>
          <rect x="-28" y="-26" width="56" height="22" rx="3" fill="#fff" stroke="#cbd5e1" strokeWidth="0.6" />
          <text x="0" y="-17" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="7" fontWeight="900" fill="#475569">
            PLATFORM
          </text>
          <text x="0" y="-7" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="6" fill="#94a3b8">
            template · 종속
          </text>
        </g>
        <text x="0" y="38" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="11" fontWeight="900" fill="#475569">
          플랫폼
        </text>
      </g>

      {/* Title at top center */}
      <text x="300" y="36" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="9" fontWeight="900" fill="#0a2a5e" letterSpacing="2">
        비교
      </text>
    </svg>
  );
}

export function OwnershipKey() {
  return (
    <svg viewBox="0 0 300 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="ok-shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b6ecb" />
          <stop offset="100%" stopColor="#0a2a5e" />
        </linearGradient>
        <linearGradient id="ok-key" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <radialGradient id="ok-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(36,89,176,0.25)" />
          <stop offset="100%" stopColor="rgba(36,89,176,0)" />
        </radialGradient>
        <filter id="ok-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <ellipse cx="150" cy="220" rx="100" ry="10" fill="rgba(10,42,94,0.18)" filter="url(#ok-shadow)" />
      <circle cx="150" cy="120" r="100" fill="url(#ok-glow)" />

      {/* Shield */}
      <g transform="translate(150 110)" filter="url(#ok-shadow)">
        <path
          d="M 0 -70 L 50 -50 L 50 10 Q 50 50 0 75 Q -50 50 -50 10 L -50 -50 Z"
          fill="url(#ok-shield)"
        />
        <path
          d="M 0 -70 L 50 -50 L 50 10 Q 50 50 0 75 Q -50 50 -50 10 L -50 -50 Z"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
        />
        {/* Inner check */}
        <path d="M -18 5 L -4 18 L 22 -10" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Key (overlay, rotated) */}
      <g transform="translate(220 60) rotate(40)" filter="url(#ok-shadow)">
        <circle cx="0" cy="0" r="14" fill="url(#ok-key)" />
        <circle cx="0" cy="0" r="6" fill="#0f172a" />
        <rect x="13" y="-3" width="40" height="6" fill="url(#ok-key)" />
        <rect x="42" y="3" width="6" height="8" fill="url(#ok-key)" />
        <rect x="50" y="3" width="4" height="6" fill="url(#ok-key)" />
      </g>

      {/* Caption */}
      <text x="150" y="215" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="10" fontWeight="900" fill="#0a2a5e" letterSpacing="1">
        100% 소유 · 이전 가능
      </text>
    </svg>
  );
}
