export function DomainIllustration() {
  return (
    <svg viewBox="0 0 400 360" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="dom-face-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b6ecb" />
          <stop offset="100%" stopColor="#2459b0" />
        </linearGradient>
        <linearGradient id="dom-face-left" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e4b9a" />
          <stop offset="100%" stopColor="#0a2a5e" />
        </linearGradient>
        <linearGradient id="dom-face-right" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2459b0" />
          <stop offset="100%" stopColor="#123a7f" />
        </linearGradient>
        <linearGradient id="dom-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f4f6fb" />
        </linearGradient>
        <radialGradient id="dom-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(36, 89, 176, 0.3)" />
          <stop offset="100%" stopColor="rgba(36, 89, 176, 0)" />
        </radialGradient>
        <filter id="dom-soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
          <feOffset dx="0" dy="6" result="offset" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.28" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="dom-ground" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* Ambient glow */}
      <circle cx="200" cy="200" r="170" fill="url(#dom-glow)" />

      {/* Floor grid (isometric) */}
      <g opacity="0.18" stroke="#2459b0" strokeWidth="0.7" fill="none">
        <path d="M 60 250 L 340 170 M 80 278 L 360 198 M 40 222 L 320 142" />
        <path d="M 140 120 L 300 300 M 100 140 L 260 320 M 180 100 L 340 280" />
      </g>

      {/* Ground shadow */}
      <ellipse cx="200" cy="300" rx="110" ry="16" fill="rgba(10,42,94,0.3)" filter="url(#dom-ground)" />

      {/* Isometric cube (the "house") */}
      <g transform="translate(200 180)">
        {/* Top face */}
        <path d="M 0 -70 L 85 -30 L 0 10 L -85 -30 Z" fill="url(#dom-face-top)" />
        {/* Left face */}
        <path d="M -85 -30 L -85 55 L 0 95 L 0 10 Z" fill="url(#dom-face-left)" />
        {/* Right face */}
        <path d="M 0 10 L 0 95 L 85 55 L 85 -30 Z" fill="url(#dom-face-right)" />

        {/* Edges */}
        <path d="M -85 -30 L 0 10 L 85 -30 M 0 10 L 0 95" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />

        {/* Door on left face */}
        <rect x="-55" y="10" width="32" height="50" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" transform="skewY(25)" />

        {/* Windows on right face */}
        <rect x="20" y="5" width="22" height="18" fill="rgba(194, 222, 255, 0.45)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" transform="skewY(-25)" />
        <rect x="52" y="-10" width="22" height="18" fill="rgba(194, 222, 255, 0.45)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" transform="skewY(-25)" />
      </g>

      {/* Pin dropped into top */}
      <g transform="translate(200 110)" filter="url(#dom-soft-shadow)">
        <circle cx="0" cy="0" r="12" fill="#ef4444" />
        <circle cx="0" cy="-1" r="5" fill="#fee2e2" />
        <path d="M 0 10 L 0 24" stroke="#ef4444" strokeWidth="2" />
      </g>

      {/* Floating URL pill */}
      <g transform="translate(100 50)" filter="url(#dom-soft-shadow)">
        <rect x="0" y="0" width="200" height="38" rx="9" fill="url(#dom-card)" stroke="#dde2ea" strokeWidth="1" />
        <circle cx="16" cy="19" r="4" fill="#28c840" />
        <text x="30" y="24" fontFamily="ui-monospace, Consolas, monospace" fontSize="14" fontWeight="600" fill="#0a2a5e">
          https://hsweb.pics
        </text>
      </g>

      {/* Dotted connector */}
      <path d="M 200 88 Q 200 98 200 110" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="3 4" fill="none" />
    </svg>
  );
}

export function HostingIllustration() {
  return (
    <svg viewBox="0 0 400 360" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="host-face-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="host-face-left" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="host-face-right" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="host-led" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#28c840" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
        <radialGradient id="host-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(94, 234, 212, 0.25)" />
          <stop offset="100%" stopColor="rgba(94, 234, 212, 0)" />
        </radialGradient>
        <filter id="host-ground" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="host-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient */}
      <circle cx="200" cy="200" r="170" fill="url(#host-glow)" />

      {/* Grid floor */}
      <g opacity="0.16" stroke="#64748b" strokeWidth="0.7" fill="none">
        <path d="M 60 260 L 340 180 M 80 288 L 360 208 M 40 232 L 320 152" />
        <path d="M 140 130 L 300 310 M 100 150 L 260 330 M 180 110 L 340 290" />
      </g>

      {/* Ground shadow */}
      <ellipse cx="200" cy="310" rx="115" ry="17" fill="rgba(15,23,42,0.35)" filter="url(#host-ground)" />

      {/* Stacked server rack (3 units) */}
      <g transform="translate(200 105)">
        {[0, 1, 2].map((i) => {
          const y = i * 58;
          return (
            <g key={i} transform={`translate(0 ${y})`}>
              {/* Top */}
              <path d={`M 0 0 L 85 28 L 0 56 L -85 28 Z`} fill="url(#host-face-top)" />
              {/* Left */}
              <path d={`M -85 28 L -85 50 L 0 78 L 0 56 Z`} fill="url(#host-face-left)" />
              {/* Right */}
              <path d={`M 0 56 L 0 78 L 85 50 L 85 28 Z`} fill="url(#host-face-right)" />

              {/* LED row on front (left face) */}
              <g transform="translate(-60 44) skewY(20)">
                {[0, 1, 2, 3, 4].map((j) => (
                  <circle
                    key={j}
                    cx={j * 11}
                    cy="0"
                    r="2.2"
                    fill={j % 2 === 0 ? "url(#host-led)" : "#1e293b"}
                    filter={j % 2 === 0 ? "url(#host-glow-filter)" : undefined}
                  />
                ))}
              </g>

              {/* Vents on right face */}
              <g transform="translate(12 42)" stroke="rgba(255,255,255,0.25)" strokeWidth="1">
                <path d="M 0 0 L 60 -18" />
                <path d="M 0 7 L 60 -11" />
                <path d="M 0 14 L 60 -4" />
              </g>

              {/* Edges */}
              <path d={`M -85 28 L 0 56 L 85 28 M 0 56 L 0 78`} stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
            </g>
          );
        })}
      </g>

      {/* Data packets floating up */}
      <g opacity="0.95">
        <rect x="85" y="80" width="32" height="18" rx="3" fill="#0d9488" />
        <text x="101" y="93" textAnchor="middle" fontFamily="ui-monospace" fontSize="10" fontWeight="700" fill="#fff">
          HTML
        </text>
      </g>
      <g opacity="0.95">
        <rect x="285" y="60" width="30" height="18" rx="3" fill="#0ea5e9" />
        <text x="300" y="73" textAnchor="middle" fontFamily="ui-monospace" fontSize="10" fontWeight="700" fill="#fff">
          CSS
        </text>
      </g>
      <g opacity="0.95">
        <rect x="290" y="140" width="22" height="18" rx="3" fill="#eab308" />
        <text x="301" y="153" textAnchor="middle" fontFamily="ui-monospace" fontSize="10" fontWeight="700" fill="#fff">
          JS
        </text>
      </g>

      {/* Data flow arcs */}
      <g stroke="rgba(94, 234, 212, 0.55)" strokeWidth="1.3" fill="none" strokeDasharray="3 4">
        <path d="M 101 100 Q 150 130 190 160" />
        <path d="M 300 80 Q 260 120 220 150" />
        <path d="M 301 160 Q 260 170 220 180" />
      </g>

      {/* Cloud icon at top */}
      <g transform="translate(200 50)" opacity="0.95">
        <path
          d="M -28 10 C -38 10 -38 -5 -28 -5 C -28 -18 -8 -20 -2 -8 C 4 -20 28 -18 28 -5 C 38 -5 38 10 28 10 Z"
          fill="#e2e8f0"
          stroke="#94a3b8"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}

export function NetworkFlow() {
  return (
    <svg viewBox="0 0 800 200" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="flow-pipe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(36, 89, 176, 0)" />
          <stop offset="50%" stopColor="rgba(36, 89, 176, 0.6)" />
          <stop offset="100%" stopColor="rgba(36, 89, 176, 0)" />
        </linearGradient>
        <radialGradient id="flow-node" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbe4f5" />
        </radialGradient>
        <filter id="flow-drop" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
          <feOffset dx="0" dy="4" result="o" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.25" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Pipe */}
      <path d="M 60 120 L 740 120" stroke="url(#flow-pipe)" strokeWidth="3" strokeDasharray="6 6" />

      {/* Animated packets */}
      <circle r="5" fill="#2459b0">
        <animateMotion path="M 60 120 L 740 120" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle r="4" fill="#0a2a5e" opacity="0.6">
        <animateMotion path="M 60 120 L 740 120" dur="4s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle r="4" fill="#2459b0" opacity="0.4">
        <animateMotion path="M 60 120 L 740 120" dur="4s" begin="2s" repeatCount="indefinite" />
      </circle>

      {/* 4 nodes — icons only (labels live in cards below) */}
      {[
        { cx: 100, icon: "browser" },
        { cx: 300, icon: "dns" },
        { cx: 500, icon: "server" },
        { cx: 700, icon: "site" },
      ].map((n, i) => (
        <g key={i} transform={`translate(${n.cx} 120)`} filter="url(#flow-drop)">
          {/* Base platform */}
          <ellipse cx="0" cy="36" rx="44" ry="8" fill="rgba(10,42,94,0.08)" />
          {/* Node */}
          <circle cx="0" cy="0" r="32" fill="url(#flow-node)" stroke="#cad3e5" strokeWidth="1.2" />
          <circle cx="0" cy="-4" r="26" fill="#fff" />
          {/* Icon */}
          {n.icon === "browser" && (
            <g transform="translate(-14 -18)">
              <rect x="0" y="0" width="28" height="22" rx="3" fill="none" stroke="#0a2a5e" strokeWidth="1.8" />
              <path d="M 0 6 L 28 6" stroke="#0a2a5e" strokeWidth="1.8" />
              <circle cx="4" cy="3" r="1" fill="#ef4444" />
              <circle cx="8" cy="3" r="1" fill="#eab308" />
              <circle cx="12" cy="3" r="1" fill="#22c55e" />
            </g>
          )}
          {n.icon === "dns" && (
            <g transform="translate(0 -7)" stroke="#0a2a5e" strokeWidth="1.8" fill="none">
              <circle cx="0" cy="0" r="13" />
              <ellipse cx="0" cy="0" rx="6" ry="13" />
              <path d="M -13 0 L 13 0" />
            </g>
          )}
          {n.icon === "server" && (
            <g transform="translate(-12 -16)">
              <rect x="0" y="0" width="24" height="8" rx="1.5" fill="none" stroke="#0a2a5e" strokeWidth="1.6" />
              <rect x="0" y="11" width="24" height="8" rx="1.5" fill="none" stroke="#0a2a5e" strokeWidth="1.6" />
              <rect x="0" y="22" width="24" height="8" rx="1.5" fill="none" stroke="#0a2a5e" strokeWidth="1.6" />
              <circle cx="19" cy="4" r="1.3" fill="#22c55e" />
              <circle cx="19" cy="15" r="1.3" fill="#22c55e" />
              <circle cx="19" cy="26" r="1.3" fill="#22c55e" />
            </g>
          )}
          {n.icon === "site" && (
            <g transform="translate(-14 -15)">
              <rect x="0" y="0" width="28" height="22" rx="2" fill="#2459b0" />
              <rect x="3" y="3" width="10" height="3" fill="#fff" opacity="0.95" />
              <rect x="3" y="8" width="22" height="2" fill="#fff" opacity="0.6" />
              <rect x="3" y="12" width="22" height="2" fill="#fff" opacity="0.6" />
              <rect x="3" y="16" width="14" height="2" fill="#fff" opacity="0.6" />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

export function HeroGlobe() {
  return (
    <svg viewBox="0 0 280 280" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <radialGradient id="globe-surface" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#5b87dc" />
          <stop offset="55%" stopColor="#2459b0" />
          <stop offset="100%" stopColor="#0a2a5e" />
        </radialGradient>
        <radialGradient id="globe-highlight" cx="0.3" cy="0.3" r="0.3">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="globe-atmos" cx="0.5" cy="0.5" r="0.5">
          <stop offset="85%" stopColor="rgba(36,89,176,0)" />
          <stop offset="95%" stopColor="rgba(36,89,176,0.35)" />
          <stop offset="100%" stopColor="rgba(36,89,176,0)" />
        </radialGradient>
        <filter id="globe-drop" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
          <feOffset dx="0" dy="10" result="o" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Orbit rings */}
      <ellipse cx="140" cy="140" rx="130" ry="32" fill="none" stroke="rgba(36,89,176,0.22)" strokeWidth="1.2" transform="rotate(-20 140 140)" />
      <ellipse cx="140" cy="140" rx="120" ry="45" fill="none" stroke="rgba(36,89,176,0.14)" strokeWidth="1" strokeDasharray="2 4" transform="rotate(25 140 140)" />

      {/* Atmosphere glow */}
      <circle cx="140" cy="140" r="105" fill="url(#globe-atmos)" />

      {/* Globe */}
      <g filter="url(#globe-drop)">
        <circle cx="140" cy="140" r="92" fill="url(#globe-surface)" />

        {/* Latitude lines */}
        <g fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
          <ellipse cx="140" cy="140" rx="92" ry="22" />
          <ellipse cx="140" cy="140" rx="92" ry="48" />
          <ellipse cx="140" cy="140" rx="92" ry="72" />
          <line x1="140" y1="48" x2="140" y2="232" />
          <ellipse cx="140" cy="140" rx="40" ry="92" />
          <ellipse cx="140" cy="140" rx="72" ry="92" />
        </g>

        {/* Continents (stylized blobs) */}
        <g fill="rgba(255,255,255,0.32)">
          <path d="M 90 110 Q 95 95 112 95 Q 125 97 128 112 Q 128 125 118 130 Q 100 130 92 122 Z" />
          <path d="M 152 105 Q 175 100 185 118 Q 185 132 170 135 Q 155 128 150 118 Z" />
          <path d="M 115 160 Q 130 155 148 170 Q 150 185 135 190 Q 115 183 110 172 Z" />
          <path d="M 165 168 Q 185 170 190 188 Q 180 200 165 195 Q 158 180 160 175 Z" />
        </g>

        {/* Highlight */}
        <circle cx="140" cy="140" r="92" fill="url(#globe-highlight)" />
      </g>

      {/* Connection pins */}
      <g>
        <circle cx="110" cy="110" r="5" fill="#ffffff" />
        <circle cx="110" cy="110" r="5" fill="#2459b0" opacity="0.6">
          <animate attributeName="r" values="5;14;5" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2.6s" repeatCount="indefinite" />
        </circle>
      </g>
      <g>
        <circle cx="180" cy="128" r="4" fill="#ffffff" />
        <circle cx="180" cy="128" r="4" fill="#2459b0" opacity="0.6">
          <animate attributeName="r" values="4;12;4" dur="2.6s" begin="0.9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2.6s" begin="0.9s" repeatCount="indefinite" />
        </circle>
      </g>
      <g>
        <circle cx="145" cy="180" r="4" fill="#ffffff" />
        <circle cx="145" cy="180" r="4" fill="#2459b0" opacity="0.6">
          <animate attributeName="r" values="4;12;4" dur="2.6s" begin="1.7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2.6s" begin="1.7s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Satellite / floating chip */}
      <g transform="translate(230 70)">
        <rect x="0" y="0" width="36" height="24" rx="4" fill="#0a2a5e" stroke="#fff" strokeWidth="1.5" />
        <circle cx="10" cy="12" r="2" fill="#22c55e" />
        <rect x="16" y="9" width="14" height="2" fill="#ffffff" opacity="0.7" />
        <rect x="16" y="13" width="10" height="2" fill="#ffffff" opacity="0.5" />
        <path d="M 8 24 L 8 30 M 28 24 L 28 30" stroke="#0a2a5e" strokeWidth="1.5" />
        <path d="M 4 30 L 32 30" stroke="#0a2a5e" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function ServerStack3D() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="ss-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
        </linearGradient>
        <linearGradient id="ss-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
        </linearGradient>
        <linearGradient id="ss-right" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
        <radialGradient id="ss-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(94,234,212,0.35)" />
          <stop offset="100%" stopColor="rgba(94,234,212,0)" />
        </radialGradient>
      </defs>

      <circle cx="150" cy="150" r="120" fill="url(#ss-glow)" />

      <g transform="translate(150 80)">
        {[0, 1, 2, 3].map((i) => {
          const y = i * 42;
          return (
            <g key={i} transform={`translate(0 ${y})`}>
              {/* Top */}
              <path d="M 0 0 L 70 24 L 0 48 L -70 24 Z" fill="url(#ss-top)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
              {/* Left */}
              <path d="M -70 24 L -70 40 L 0 64 L 0 48 Z" fill="url(#ss-left)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
              {/* Right */}
              <path d="M 0 48 L 0 64 L 70 40 L 70 24 Z" fill="url(#ss-right)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />

              {/* LEDs */}
              <g transform="translate(-54 36) skewY(20)">
                {[0, 1, 2, 3].map((j) => (
                  <circle key={j} cx={j * 10} cy="0" r="2" fill={j === i % 4 ? "#22c55e" : "rgba(255,255,255,0.3)"} />
                ))}
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
