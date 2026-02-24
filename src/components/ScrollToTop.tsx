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
      className={`fixed bottom-7 right-7 w-11 h-11 bg-[var(--color-primary)] text-white border-none rounded-xl text-lg cursor-pointer shadow-md z-[999] transition-all hover:-translate-y-1 hover:shadow-lg ${
        visible ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      aria-label="맨 위로"
    >
      ↑
    </button>
  );
}
