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
      className={`fixed bottom-[30px] right-[30px] w-12 h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white border-none rounded-[14px] text-xl cursor-pointer shadow-[0_4px_20px_rgba(37,99,235,0.4)] z-[999] transition-all hover:-translate-y-1 ${
        visible ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      aria-label="맨 위로"
    >
      ↑
    </button>
  );
}
