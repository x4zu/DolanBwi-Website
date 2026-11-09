"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRINCIPLES } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

/**
 * Closing chapter: a framed photo opens to full-screen as you scroll, then the four
 * principles for visiting respectfully appear one per scroll step.
 */
export function Epilogue() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=320%", pin: true, scrub: 0.8, anticipatePin: 1 },
        });
        tl.fromTo("[data-epi-frame]", { clipPath: "inset(18% 24% 18% 24% round 32px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1 })
          .fromTo("[data-epi-photo]", { scale: 1.3 }, { scale: 1.02, duration: 1.4 }, 0)
          .fromTo("[data-epi-title]", { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5 }, 0.45)
          .to("[data-epi-title]", { opacity: 0.25, duration: 0.3 }, 1.15);
        gsap.utils.toArray<HTMLElement>("[data-epi-rule]").forEach((r, i) => {
          tl.fromTo(r, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.3 }, 1.15 + i * 0.25);
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="etika" className="relative h-svh overflow-hidden bg-night text-white">
      <div data-epi-frame className="absolute inset-0 overflow-hidden">
        <div data-epi-photo className="absolute inset-0 will-change-transform">
          <Image src="/images/bwi/pulau-merah-sunset.jpg" alt="Senja di Pulau Merah" fill quality={90} sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/45 to-night/25" />
      </div>

      <div className="relative flex h-full flex-col justify-between px-6 pt-28 pb-10 md:px-12 md:pt-32 md:pb-14">
        <div data-epi-title className="max-w-4xl">
          <p className="mb-5 flex items-center gap-3 font-display text-xs tracking-[0.2em] text-sulfur uppercase">
            <span className="h-px w-8 bg-sulfur" /> Bab 05 · Pulang Membawa Cerita
          </p>
          <h2 className="font-display text-[48px] leading-[0.92] tracking-[-0.03em] uppercase md:text-[88px] xl:text-[112px]">
            Datanglah <br />
            <span className="font-serif font-normal tracking-[-0.01em] text-sulfur normal-case italic">sebagai tamu</span>
          </h2>
        </div>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} data-epi-rule className="border-t border-white/25 pt-5">
              <span className="font-display text-sm text-coral">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-display text-2xl tracking-[-0.02em] uppercase">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-6 font-light text-white/75">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
