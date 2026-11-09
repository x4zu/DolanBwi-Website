"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LANDSCAPES } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

/**
 * Four landscape families as sticky stacked sheets: each new sheet slides up over
 * the previous one, which recedes (scale + dim) — the explanation reads card by card.
 */
export function LandscapeStack() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const sheets = gsap.utils.toArray<HTMLElement>("[data-land-sheet]");
      sheets.forEach((sheet, i) => {
        const next = sheets[i + 1];
        if (next) {
          gsap.to(sheet.querySelector("[data-land-card]"), {
            scale: 0.9,
            opacity: 0.35,
            filter: "blur(2px)",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
        }
        gsap.fromTo(
          sheet.querySelector("[data-land-art]"),
          { y: 80, rotate: -2 },
          { y: -40, rotate: 0, ease: "none", scrollTrigger: { trigger: sheet, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="lanskap" className="relative bg-navy text-white">
      <div className="px-6 pt-24 pb-10 md:px-12 md:pt-32">
        <p className="mb-5 flex items-center gap-3 font-display text-xs tracking-[0.2em] text-sulfur uppercase">
          <span className="h-px w-8 bg-sulfur" /> Bab 04 · Lanskap
        </p>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-display text-[44px] leading-[0.92] tracking-[-0.03em] uppercase md:text-[72px]">
            Empat Wajah <br />
            <span className="font-serif font-normal text-coral normal-case italic">Satu Kabupaten</span>
          </h2>
          <p className="max-w-sm text-[15px] leading-6 font-light text-white/65">
            Kenapa Banyuwangi begitu beragam? Karena dalam jarak beberapa jam saja, tanahnya naik dari terumbu karang ke kawah 2.000-an meter.
          </p>
        </div>
      </div>

      {LANDSCAPES.map((l, i) => (
        <div key={l.name} data-land-sheet className="sticky top-0 flex h-svh items-center px-4 py-6 md:px-10 md:py-10">
          <div
            data-land-card
            className="relative grid h-full w-full origin-top items-center gap-6 overflow-hidden rounded-[32px] bg-night p-6 ring-1 ring-white/10 will-change-transform md:p-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12 lg:p-14"
          >
            <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-tosca/15 blur-[120px]" />
            <div data-land-art className="relative h-[34svh] w-full will-change-transform md:h-[42svh] lg:h-[70%]">
              <Image src={l.image} alt={l.name} fill quality={90} sizes="(min-width: 1024px) 55vw, 92vw" className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-4 text-[11px] tracking-[0.25em] uppercase">
                <span className="font-display text-sm text-sulfur">{String(i + 1).padStart(2, "0")} / 04</span>
                <span className="h-px w-8 bg-white/30" />
                <span className="text-tosca">{l.subtitle}</span>
              </div>
              <h3 className="mt-4 font-display text-[40px] leading-none tracking-[-0.03em] uppercase md:text-[64px]">{l.name}</h3>
              <p className="mt-5 max-w-lg text-[15px] leading-7 font-light text-white/75 md:text-[17px]">{l.text}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {l.spots.map((s) => (
                  <li key={s} className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[11px] text-white/85">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
      <div className="h-[20svh]" aria-hidden />
    </section>
  );
}
