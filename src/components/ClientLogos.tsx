"use client";

const logos = [
  { name: "CAFE BRAND", weight: "font-black tracking-wider" },
  { name: "FASHION Co.", weight: "font-light tracking-widest uppercase" },
  { name: "MEDICAL+", weight: "font-bold tracking-tight" },
  { name: "Tech Startup", weight: "font-medium italic" },
  { name: "F&B GROUP", weight: "font-extrabold tracking-wide" },
  { name: "BEAUTY LAB", weight: "font-semibold tracking-[3px] uppercase" },
  { name: "EDU PLUS", weight: "font-black tracking-tight" },
  { name: "DESIGN STUDIO", weight: "font-light tracking-widest" },
];

export default function ClientLogos() {
  return (
    <section className="py-14 border-b border-gray-100 overflow-hidden">
      <p className="text-center text-[var(--color-gray-light)] text-sm font-medium mb-8 uppercase tracking-[2px]">
        신뢰할 수 있는 파트너사
      </p>
      <div className="marquee-container">
        <div className="marquee-track">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="glass-colored mx-4 px-8 py-4 rounded-xl inline-flex items-center gap-3 hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-105 transition-all duration-300 cursor-default select-none"
            >
              <span className={`text-gray-400 text-lg ${logo.weight} hover:text-[var(--color-primary)] transition-colors whitespace-nowrap`}>
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
