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
    <section className="py-16 border-b border-gray-100 overflow-hidden relative">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <p className="text-center text-[var(--color-gray-light)] text-sm font-medium mb-10 uppercase tracking-[2px]">
        신뢰할 수 있는 파트너사
      </p>
      <div className="marquee-container">
        <div className="marquee-track">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="mx-5 px-8 py-4 bg-gray-50/80 border border-gray-100 rounded-xl inline-flex items-center gap-3 hover:bg-white hover:border-[var(--color-primary)]/30 hover:shadow-lg hover:shadow-emerald-500/8 hover:scale-105 transition-all duration-300 cursor-default select-none group"
            >
              {/* Decorative dot */}
              <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] opacity-40 group-hover:opacity-100 transition-opacity duration-300 shrink-0" />
              <span className={`text-gray-400 text-lg ${logo.weight} group-hover:text-[var(--color-dark)] transition-colors duration-300 whitespace-nowrap`}>
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
