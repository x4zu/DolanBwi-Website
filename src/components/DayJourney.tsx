"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JOURNEY } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

/**
 * "Sehari di Banyuwangi": a pinned horizontal story. Vertical scroll moves through
 * full-screen panels from midnight on Ijen to turtles at night; each photo drifts
 * inside its frame (parallax) and the copy slides in as its panel arrives.
 */
export function DayJourney() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;
    const ctx = gsap.context(() => {
      const distance = () => tr.scrollWidth - window.innerWidth;
      const move = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            const i = Math.min(JOURNEY.length - 1, Math.round(self.progress * (JOURNEY.length - 1)));
            if (clock.current && clock.current.textContent !== JOURNEY[i].time) clock.current.textContent = JOURNEY[i].time;
          },
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-day-panel]").forEach((panel) => {
        gsap.fromTo(
          panel.querySelector("[data-day-photo]"),
          { xPercent: -12 },
          { xPercent: 12, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: move, start: "left right", end: "right left", scrub: true } },
        );
        gsap.from(panel.querySelectorAll("[data-day-copy]"), {
          y: 60,
          opacity: 0,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, containerAnimation: move, start: "left 70%", end: "left 20%", scrub: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="sehari" className="relative h-svh overflow-hidden bg-night text-white">
      <div ref={track} className="flex h-full will-change-transform">
        {/* intro panel */}
        <div className="relative flex h-full w-screen shrink-0 flex-col justify-center px-6 md:w-[70vw] md:px-12 lg:px-20">
          <p className="mb-6 flex items-center gap-3 font-display text-xs tracking-[0.2em] text-sulfur uppercase">
            <span className="h-px w-8 bg-sulfur" /> Bab 03 · Sehari Penuh
          </p>
          <h2 className="font-display text-[52px] leading-[0.9] tracking-[-0.03em] uppercase md:text-[96px] xl:text-[120px]">
            24 Jam di <br />
            <span className="font-serif font-normal tracking-[-0.01em] text-coral normal-case italic">Banyuwangi</span>
          </h2>
          <p className="mt-8 max-w-md text-[17px] leading-7 font-light text-white/70">
            Dari api biru tengah malam hingga penyu yang mendarat di pantai gelap — begini satu hari bisa berjalan di kabupaten ini. Terus
            gulir ke bawah; ceritanya bergerak ke samping.
          </p>
        </div>

        {JOURNEY.map((s, i) => (
          <article key={s.time} data-day-panel className="relative h-full w-screen shrink-0 overflow-hidden md:w-[88vw] lg:w-[78vw]">
            <div data-day-photo className="absolute inset-y-0 -inset-x-[14%] will-change-transform">
              <Image src={s.image} alt={s.title} fill quality={90} sizes="(min-width: 1024px) 110vw, 130vw" className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/10" />
            <div className="absolute inset-y-0 left-0 w-px bg-white/10" />

            <div className="relative flex h-full flex-col justify-end px-6 pb-28 md:px-12 md:pb-32 lg:px-16">
              <div data-day-copy className="font-display text-[88px] leading-none tracking-[-0.04em] text-white/90 md:text-[160px] xl:text-[200px]">
                {s.time}
              </div>
              <div data-day-copy className="mt-2 flex items-center gap-3 text-[11px] tracking-[0.22em] text-sulfur uppercase">
                <span className="font-display text-sm text-white/50">{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px w-8 bg-sulfur/60" />
                {s.place}
              </div>
              <h3 data-day-copy className="mt-4 font-serif text-4xl text-white italic md:text-5xl">
                {s.title}
              </h3>
              <p data-day-copy className="mt-4 max-w-xl text-[15px] leading-7 font-light text-white/80 md:text-[17px]">
                {s.text}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* clock + progress */}
      <div className="pointer-events-none absolute inset-x-6 bottom-8 z-10 flex items-center gap-5 md:inset-x-12">
        <span ref={clock} className="w-16 font-display text-lg text-sulfur tabular-nums">
          {JOURNEY[0].time}
        </span>
        <div className="relative h-px flex-1 bg-white/15">
          <div ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-tosca via-sulfur to-coral" />
          {JOURNEY.map((s, i) => (
            <span
              key={s.time}
              className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-night"
              style={{ left: `${(i / (JOURNEY.length - 1)) * 100}%` }}
            />
          ))}
        </div>
        <span className="hidden text-[10px] tracking-[0.2em] text-white/50 uppercase md:block">Gulir</span>
      </div>
    </section>
  );
}
