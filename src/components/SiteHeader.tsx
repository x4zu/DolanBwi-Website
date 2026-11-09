"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/icons";
import { cn } from "@/lib/utils";

const CHAPTER_LINKS = [
  ["#mengenal", "Mengenal"],
  ["#jelajah", "Destinasi"],
  ["#sehari", "24 Jam"],
  ["#lanskap", "Lanskap"],
  ["#etika", "Etika"],
] as const;

/** Fixed header: transparent at top of hero, hidden while flying through the door, glass pill afterwards. */
export function SiteHeader() {
  const [mode, setMode] = useState<"top" | "hidden" | "solid">("top");

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("hero");
      const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight : 0;
      const y = window.scrollY;
      if (y < 60) setMode("top");
      else if (y < heroEnd + 40) setMode("hidden");
      else setMode("solid");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: mode === "hidden" ? -120 : 0, opacity: mode === "hidden" ? 0 : 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-6"
    >
      <div
        className={cn(
          "mx-auto grid grid-cols-2 items-center gap-4 rounded-full px-3 py-2 text-white transition-[background,box-shadow,backdrop-filter] duration-700 md:grid-cols-[1fr_auto_1fr]",
          mode === "solid" && "bg-night/75 shadow-[0_10px_40px_rgba(5,8,26,0.35)] ring-1 ring-white/10 backdrop-blur-xl",
        )}
      >
        <a href="#hero" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur">
            <LogoMark className="h-[18px] w-[18px] text-sulfur" />
          </span>
          <span className="flex flex-col leading-none whitespace-nowrap">
            <span className="text-[13px] font-semibold tracking-[0.18em] uppercase">DolanBwi</span>
            <span className="mt-1 hidden text-[9px] tracking-[0.3em] text-white/60 uppercase sm:block">Banyuwangi Escape</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1 text-[11px] font-medium tracking-[0.14em] uppercase backdrop-blur-md md:flex">
          {CHAPTER_LINKS.map(([href, label]) => (
            <a key={href} href={href} className="rounded-full px-3.5 py-2 text-white/75 transition-colors hover:bg-white/10 hover:text-sulfur">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3 pr-2 text-[11px] font-medium tracking-[0.12em] uppercase">
          <a href="#mengenal" className="rounded-full border border-white/25 px-4 py-2 transition-colors hover:border-sulfur hover:text-sulfur">
            Mulai Jelajah
          </a>
        </div>
      </div>
    </motion.header>
  );
}
