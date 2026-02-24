"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-7 right-7 w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-indigo-600 text-white border-none rounded-xl cursor-pointer shadow-lg shadow-indigo-500/20 z-[999] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/30 hover:rotate-12 flex items-center justify-center ${
        visible ? "opacity-100 visible scale-100 animate-pulse-glow" : "opacity-0 invisible scale-75"
      }`}
      aria-label="맨 위로"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  );
}
