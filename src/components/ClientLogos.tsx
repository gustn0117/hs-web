"use client";

const logosRow1 = [
  { name: "CAFE BRAND", weight: "font-black tracking-wider" },
  { name: "FASHION Co.", weight: "font-light tracking-widest uppercase" },
  { name: "MEDICAL+", weight: "font-bold tracking-tight" },
  { name: "Tech Startup", weight: "font-medium italic" },
  { name: "F&B GROUP", weight: "font-extrabold tracking-wide" },
  { name: "BEAUTY LAB", weight: "font-semibold tracking-[3px] uppercase" },
  { name: "EDU PLUS", weight: "font-black tracking-tight" },
  { name: "DESIGN STUDIO", weight: "font-light tracking-widest" },
];

const logosRow2 = [
  { name: "HEALTH CLINIC", weight: "font-bold tracking-wide" },
  { name: "REAL ESTATE Pro", weight: "font-light italic tracking-wider" },
  { name: "FINANCE HQ", weight: "font-extrabold tracking-tight uppercase" },
  { name: "TRAVEL & Co.", weight: "font-medium tracking-widest" },
  { name: "SPORTS GEAR", weight: "font-black tracking-wide uppercase" },
  { name: "PET CARE+", weight: "font-semibold tracking-wider" },
  { name: "AUTO MOTORS", weight: "font-bold tracking-[2px] uppercase" },
  { name: "LEGAL FIRM", weight: "font-light tracking-widest italic" },
];

function LogoItem({ name, weight }: { name: string; weight: string }) {
  return (
    <div className="mx-4 px-7 py-3.5 bg-gray-50/80 border border-gray-100 rounded-xl inline-flex items-center gap-3 hover:bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/8 hover:scale-105 transition-all duration-300 cursor-default select-none group">
      <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] opacity-40 group-hover:opacity-100 transition-opacity duration-300 shrink-0" />
      <span className={`text-gray-400 text-lg ${weight} group-hover:text-[var(--color-dark)] transition-colors duration-300 whitespace-nowrap`}>
        {name}
      </span>
    </div>
  );
}

export default function ClientLogos() {
  return (
    <section className="py-16 border-b border-gray-100 overflow-hidden relative">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="text-center mb-8">
        <p className="text-[var(--color-gray-light)] text-sm font-medium uppercase tracking-[2px]">
          신뢰할 수 있는 파트너사
        </p>
        <p className="text-[var(--color-gray)] text-[0.82rem] mt-1">
          다양한 산업군의 기업과 함께 성장합니다
        </p>
      </div>

      {/* Row 1 - scrolls left */}
      <div className="marquee-container mb-4">
        <div className="marquee-track">
          {[...logosRow1, ...logosRow1].map((logo, i) => (
            <LogoItem key={`r1-${i}`} name={logo.name} weight={logo.weight} />
          ))}
        </div>
      </div>

      {/* Row 2 - scrolls right (reverse) */}
      <div className="marquee-container">
        <div className="marquee-track-reverse">
          {[...logosRow2, ...logosRow2].map((logo, i) => (
            <LogoItem key={`r2-${i}`} name={logo.name} weight={logo.weight} />
          ))}
        </div>
      </div>
    </section>
  );
}
