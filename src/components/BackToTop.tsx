"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 480);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 border border-gold/50 bg-void/90 px-4 py-3 font-sans text-[10px] uppercase tracking-widest text-gold shadow-lg backdrop-blur-sm transition-all hover:border-gold hover:bg-smoke/90 hover:text-ivory md:bottom-8 md:right-8"
      aria-label="Back to top"
    >
      Back to top
    </button>
  );
}
