"use client";

import { useEffect, useRef } from "react";

const logos = [
  { name: "CAFE BRAND", weight: "font-black tracking-wider" },
  { name: "FASHION Co.", weight: "font-light tracking-widest uppercase" },
  { name: "MEDICAL+", weight: "font-bold tracking-tight" },
  { name: "Tech Startup", weight: "font-medium italic" },
  { name: "F&B GROUP", weight: "font-extrabold tracking-wide" },
  { name: "BEAUTY LAB", weight: "font-semibold tracking-[3px] uppercase" },
];

export default function ClientLogos() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-14 border-b border-gray-100" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="fade-up text-center text-[var(--color-gray-light)] text-sm font-medium mb-8 uppercase tracking-[2px]">
          신뢰할 수 있는 파트너사
        </p>
        <div className="fade-up flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className={`text-gray-300 text-lg ${logo.weight} select-none hover:text-gray-400 transition-colors duration-300`}
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
