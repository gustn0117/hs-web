export function CustomBuildIllustration() {
  return (
    <svg viewBox="0 0 400 360" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="cb-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b6ecb" />
          <stop offset="100%" stopColor="#1e4b9a" />
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
          <stop offset="0%" stopColor="rgba(36,89,176,0.3)" />
          <stop offset="100%" stopColor="rgba(36,89,176,0)" />
        </radialGradient>
        <filter id="cb-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <circle cx="200" cy="200" r="170" fill="url(#cb-glow)" />

      {/* Floor grid */}
      <g opacity="0.15" stroke="#2459b0" strokeWidth="0.7" fill="none">
        <path d="M 60 280 L 340 200 M 80 308 L 360 228 M 40 252 L 320 172" />
        <path d="M 140 130 L 300 310 M 100 150 L 260 330 M 180 110 L 340 290" />
      </g>

      {/* Ground shadow */}
      <ellipse cx="200" cy="320" rx="120" ry="16" fill="rgba(10,42,94,0.3)" filter="url(#cb-shadow)" />

      {/* Stacked code cube tower (3 layers) */}
      <g transform="translate(200 100)">
        {[0, 1, 2].map((i) => {
          const y = i * 60;
          // Each layer slightly offset for "stacked" feel
          const offsetX = i === 1 ? 6 : i === 2 ? -4 : 0;
          return (
            <g key={i} transform={`translate(${offsetX} ${y})`}>
              {/* Top */}
              <path d="M 0 0 L 70 24 L 0 48 L -70 24 Z" fill="url(#cb-top)" />
              {/* Left */}
              <path d="M -70 24 L -70 50 L 0 78 L 0 48 Z" fill="url(#cb-left)" />
              {/* Right */}
              <path d="M 0 48 L 0 78 L 70 50 L 70 24 Z" fill="url(#cb-right)" />

              {/* Edges */}
              <path d="M -70 24 L 0 48 L 70 24 M 0 48 L 0 78" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />

              {/* Code symbols on faces */}
              <g transform="translate(-50 38) skewY(20)" opacity="0.85">
                <text x="0" y="0" fontFamily="ui-monospace, Consolas, monospace" fontSize="10" fontWeight="700" fill="rgba(255,255,255,0.9)">
                  {i === 0 ? "{ }" : i === 1 ? "</>" : "[]"}
                </text>
              </g>
              <g transform="translate(20 36) skewY(-20)" opacity="0.7">
                <text x="0" y="0" fontFamily="ui-monospace, Consolas, monospace" fontSize="10" fontWeight="700" fill="rgba(255,255,255,0.85)">
                  {i === 0 ? "fn()" : i === 1 ? "API" : "DB"}
                </text>
              </g>
            </g>
          );
        })}
      </g>

      {/* Floating code snippet card (top) */}
      <g transform="translate(80 30)" filter="url(#cb-shadow)">
        <rect x="0" y="0" width="120" height="50" rx="6" fill="#0c0e14" />
        <rect x="6" y="6" width="6" height="2" fill="#28c840" />
        <text x="6" y="22" fontFamily="ui-monospace, Consolas, monospace" fontSize="8" fill="#c792ea">
          const
        </text>
        <text x="32" y="22" fontFamily="ui-monospace, Consolas, monospace" fontSize="8" fill="#82aaff">
          app
        </text>
        <text x="50" y="22" fontFamily="ui-monospace, Consolas, monospace" fontSize="8" fill="#fff">
          = build()
        </text>
        <text x="6" y="36" fontFamily="ui-monospace, Consolas, monospace" fontSize="8" fill="#89ddff">
          ↳ custom
        </text>
        <text x="6" y="46" fontFamily="ui-monospace, Consolas, monospace" fontSize="8" fill="#c3e88d">
          ✓ ready
        </text>
      </g>

      {/* Star badge "100% Custom" */}
      <g transform="translate(290 110)">
        <circle cx="0" cy="0" r="30" fill="#0a2a5e" />
        <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <text x="0" y="-3" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="9" fontWeight="900" fill="#fff">
          100%
        </text>
        <text x="0" y="9" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="7" fontWeight="700" fill="rgba(255,255,255,0.7)">
          CUSTOM
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
  return (
    <svg viewBox="0 0 600 220" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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
      <rect x="240" y="200" width="120" height="10" rx="2" fill="#0f172a" />

      {/* Pillar */}
      <rect x="294" y="50" width="12" height="155" fill="url(#sc-pillar)" />

      {/* Beam (slightly tilted to the LEFT — favoring custom) */}
      <g transform="translate(300 50) rotate(-8)">
        <rect x="-200" y="-3" width="400" height="6" rx="2" fill="#0f172a" />
        {/* Pivot */}
        <circle cx="0" cy="0" r="6" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      </g>

      {/* Custom (heavier, lower) — left side */}
      <g transform="translate(110 110)">
        <line x1="0" y1="-58" x2="0" y2="0" stroke="#0f172a" strokeWidth="1.5" />
        <ellipse cx="0" cy="0" rx="56" ry="6" fill="#0f172a" />
        <path d="M -56 0 L -50 12 L 50 12 L 56 0 Z" fill="url(#sc-platter-l)" />

        {/* Stack of items */}
        <g transform="translate(0 -8)">
          <rect x="-30" y="-30" width="60" height="22" rx="3" fill="#fff" />
          <text x="0" y="-22" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="7" fontWeight="900" fill="#0a2a5e">
            CUSTOM
          </text>
          <text x="0" y="-12" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="6" fill="#475569">
            speed · seo · ux
          </text>
          <rect x="-22" y="-44" width="44" height="14" rx="2" fill="#2459b0" />
          <text x="0" y="-34" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="6.5" fontWeight="800" fill="#fff">
            제어 100%
          </text>
        </g>
        <text x="0" y="34" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="11" fontWeight="900" fill="#0a2a5e">
          자체 개발
        </text>
      </g>

      {/* Platform (lighter, higher) — right side */}
      <g transform="translate(490 50)">
        <line x1="0" y1="-2" x2="0" y2="50" stroke="#0f172a" strokeWidth="1.5" />
        <ellipse cx="0" cy="50" rx="56" ry="6" fill="#0f172a" />
        <path d="M -56 50 L -50 62 L 50 62 L 56 50 Z" fill="url(#sc-platter-r)" />

        {/* One stock box */}
        <g transform="translate(0 42)">
          <rect x="-28" y="-30" width="56" height="22" rx="3" fill="#fff" stroke="#cbd5e1" strokeWidth="0.6" />
          <text x="0" y="-22" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="7" fontWeight="900" fill="#475569">
            PLATFORM
          </text>
          <text x="0" y="-12" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="6" fill="#94a3b8">
            template · 종속
          </text>
        </g>
        <text x="0" y="84" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="11" fontWeight="900" fill="#475569">
          플랫폼
        </text>
      </g>

      {/* Title arrow at center top */}
      <g transform="translate(300 28)">
        <text x="0" y="0" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="9" fontWeight="900" fill="#0a2a5e" letterSpacing="2">
          비교
        </text>
      </g>
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
