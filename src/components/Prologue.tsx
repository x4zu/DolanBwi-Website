"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT =
  "Banyuwangi adalah kabupaten paling timur di Pulau Jawa — tempat matahari pertama kali menyentuh Jawa setiap pagi. Di satu wilayah ini bertemu gunung api aktif, savana, hutan tertua, dan dua lautan yang berbeda watak. Gulir pelan, dan kenali ia lapis demi lapis.";

const FACTS = [
  { value: 5782, suffix: " km²", label: "Luas wilayah" },
  { value: 175, suffix: " km", label: "Garis pantai" },
  { value: 3, suffix: "", label: "Taman nasional" },
  { value: 2386, suffix: " m", label: "Bibir Kawah Ijen" },
];

const fmt = (n: number) => Math.round(n).toLocaleString("id-ID");

/**
 * Pinned introduction: the statement lights up word by word while a photo window
 * grows from a small porthole to a full-bleed frame and the key numbers count up.
 */
export function Prologue() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 1024px)", reduce: "(prefers-reduced-motion: reduce)" },
        (c) => {
          const { desktop, reduce } = c.conditions as { desktop: boolean; reduce: boolean };
          if (reduce) return;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: el, start: "top top", end: "+=260%", pin: true, scrub: 0.8, anticipatePin: 1 },
          });
          tl.fromTo("[data-pro-word]", { opacity: 0.12 }, { opacity: 1, stagger: 0.04, duration: 0.6 }, 0)
            .fromTo(
              "[data-pro-window]",
              { clipPath: desktop ? "inset(22% 18% 22% 18% round 999px)" : "inset(28% 10% 28% 10% round 999px)" },
              { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1 },
              0.15,
            )
            .fromTo("[data-pro-photo]", { scale: 1.35 }, { scale: 1, duration: 1.15 }, 0.15)
            .fromTo("[data-pro-caption]", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25 }, 0.95);

          el.querySelectorAll<HTMLElement>("[data-pro-count]").forEach((node, i) => {
            const target = Number(node.dataset.proCount);
            const o = { v: 0 };
            node.textContent = "0"; // SSR shows the final value; start from 0 once scrubbing owns it
            tl.to(o, { v: target, duration: 0.5, onUpdate: () => (node.textContent = fmt(o.v)) }, 0.55 + i * 0.08);
          });
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="mengenal" className="relative overflow-hidden bg-sand text-ink">
      <div className="grid min-h-svh items-center gap-10 px-6 py-24 md:px-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-0">
        <div className="relative z-10">
          <p className="mb-6 flex items-center gap-3 font-display text-xs tracking-[0.2em] text-coral uppercase">
            <span className="h-px w-8 bg-coral" /> Bab 01 · Mengenal
          </p>
          <h2 className="font-display text-[44px] leading-[0.92] tracking-[-0.03em] uppercase md:text-[72px] xl:text-[88px]">
            Ujung Timur <br />
            <span className="font-serif font-normal tracking-[-0.01em] text-coral normal-case italic">Pulau Jawa</span>
          </h2>
          <p className="mt-8 max-w-[34ch] text-[22px] leading-[1.35] font-light tracking-[-0.015em] md:text-[28px]">
            {STATEMENT.split(" ").map((w, i) => (
              <span key={i} data-pro-word className="inline-block pr-[0.25em]">
                {w}
              </span>
            ))}
          </p>
          <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-8 gap-y-6 border-t border-ink/10 pt-8 sm:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dd className="font-display text-3xl tracking-[-0.02em] text-ink">
                  <span data-pro-count={f.value}>{fmt(f.value)}</span>
                  <span className="text-coral">{f.suffix}</span>
                </dd>
                <dt className="mt-1 text-[10px] tracking-[0.18em] text-ink/55 uppercase">{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative h-[60svh] lg:h-[82svh]">
          <div data-pro-window className="absolute inset-0 overflow-hidden rounded-[28px] bg-night">
            <div data-pro-photo className="absolute inset-0 will-change-transform">
              <Image
                src="/images/bwi/ijen-sunrise.jpg"
                alt="Matahari terbit di atas Kawah Ijen"
                fill
                quality={90}
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
            <div data-pro-caption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-white md:p-8">
              <div>
                <div className="text-[10px] tracking-[0.25em] text-sulfur uppercase">Sunrise of Java</div>
                <div className="mt-1 font-display text-2xl tracking-[-0.02em] uppercase md:text-3xl">Fajar di Kawah Ijen</div>
              </div>
              <div className="text-right text-[11px] leading-5 text-white/70">
                8°03′ LS
                <br />
                114°14′ BT
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
