"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MousePointer2 } from "lucide-react";
import { HERO_CARDS } from "@/data/site";
import type { HeroProgress, PointerState } from "./DoorScene";

gsap.registerPlugin(ScrollTrigger);

const DoorScene = dynamic(() => import("./DoorScene"), { ssr: false });

export function DoorHero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<HeroProgress>({ value: 0 });
  const pointer = useRef<PointerState>({ x: 0, y: 0 });
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            progress.current.value = self.progress;
          },
          onToggle: (self) => setActive(self.isActive || self.progress < 1),
        },
      });
      tl.to("[data-hero-title]", { opacity: 0, y: -80, filter: "blur(10px)", duration: 0.12 }, 0)
        .to("[data-hero-bottom]", { opacity: 0, y: 60, duration: 0.1 }, 0)
        .to("[data-hero-hint]", { opacity: 0, duration: 0.04 }, 0)
        .fromTo("[data-hero-welcome]", { opacity: 0, scale: 0.9, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.1 }, 0.5)
        .to("[data-hero-welcome]", { opacity: 0, scale: 1.25, filter: "blur(14px)", duration: 0.1 }, 0.7)
        .fromTo("[data-hero-fade]", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.9)
        .set({}, {}, 1);

      gsap.from("[data-hero-intro]", { opacity: 0, y: 40, duration: 1.4, ease: "expo.out", stagger: 0.12, delay: 0.3 });
    }, el);

    return () => {
      window.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="hero" className="relative h-[460vh] bg-night">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* WebGL door */}
        <div className={`absolute inset-0 transition-opacity duration-[1600ms] ${ready ? "opacity-100" : "opacity-0"}`}>
          <DoorScene progress={progress} pointer={pointer} active={active} onReady={() => setReady(true)} />
        </div>

        {/* cinematic vignette + grain */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,transparent_35%,rgba(5,8,26,0.85)_100%)]" />
        <div className="grain pointer-events-none absolute inset-0 overflow-hidden" />

        {/* headline */}
        <div data-hero-title className="pointer-events-none absolute inset-x-0 top-[17vh] px-6 md:top-[22vh] md:px-12 lg:px-24">
          <p data-hero-intro className="mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-sulfur">
            <span className="h-px w-8 bg-sulfur" />
            Sunrise of Java
          </p>
          <h1 data-hero-intro className="max-w-[12ch] text-[44px] drop-shadow-[0_4px_30px_rgba(5,8,26,0.7)] leading-[0.98] font-light tracking-[-0.03em] text-white md:text-6xl lg:text-[76px]">
            Di Balik <span className="font-serif text-[1.12em] italic text-sulfur">Pintu</span> Ini, <br className="hidden md:block" />
            Banyuwangi Menanti
          </h1>
        </div>

        {/* bottom row: highlight + cards */}
        <div data-hero-bottom className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-8 px-6 pb-8 md:px-12 md:pb-12">
          <div data-hero-intro className="max-w-md">
            <div className="mb-4 flex items-center gap-4">
              <span className="h-px w-8 bg-coral" />
              <span className="font-display text-xs font-medium uppercase tracking-[0.12em] text-coral">Panduan Jelajah</span>
            </div>
            <p className="mb-6 text-[17px] leading-7 font-light text-white/85 md:text-[19px]">
              Bukan katalog paket — ini cerita. Gulir dan ikuti Banyuwangi bab demi bab: dari kawah api biru, hutan dan savana,
              hingga pantai tempat penyu pulang.
            </p>
            <a
              href="#mengenal"
              className="pointer-events-auto group inline-flex items-center gap-3 rounded-full bg-coral px-7 py-4 text-sm font-medium text-night transition-all duration-500 hover:bg-sulfur hover:shadow-[0_0_40px_rgba(244,201,93,0.45)]"
            >
              Mulai Menjelajah
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </div>

          <div data-hero-intro className="hidden gap-4 xl:flex">
            {HERO_CARDS.map((c) => (
              <article
                key={c.title}
                className="group relative h-[230px] w-[170px] overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/50 2xl:h-[260px] 2xl:w-[190px]"
              >
                <Image src={c.image} alt={c.title} fill quality={90} sizes="190px" className="object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-lg leading-6 tracking-[-0.02em] text-white uppercase">{c.title}</h3>
                  <p className="mt-1 text-[11px] leading-4 text-white/70">{c.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* scroll hint */}
        <div data-hero-hint className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 lg:flex">
          <MousePointer2 className="h-4 w-4 animate-bounce" />
          <span className="text-[10px] tracking-[0.3em] uppercase">Gulir untuk membuka</span>
        </div>

        {/* mid-flight welcome */}
        <div data-hero-welcome className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0">
          <span className="mb-3 text-[11px] tracking-[0.4em] text-white/80 uppercase">Selamat datang di</span>
          <span className="font-serif text-6xl leading-none text-white italic drop-shadow-[0_4px_40px_rgba(0,0,0,0.5)] md:text-8xl">Bumi Blambangan</span>
        </div>

        {/* fade into the next section */}
        <div data-hero-fade className="pointer-events-none absolute inset-0 bg-sand opacity-0" />
      </div>
    </section>
  );
}
