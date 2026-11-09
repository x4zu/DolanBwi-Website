"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lightbulb } from "lucide-react";
import { CHAPTERS } from "@/data/site";
import { scrollToY } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;
const N = CHAPTERS.length;

/**
 * Expanded "explore" experience: a pinned, scroll-driven guide. Every 100vh of scroll
 * advances one chapter that explains what the place is, where, when to go and what to do.
 */
export function ExploreBanyuwangi() {
  const outer = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const raw = self.progress * N;
        const i = Math.min(N - 1, Math.floor(raw));
        setIndex(i);
        stage.current?.style.setProperty("--kp", String(Math.min(1, raw - i)));
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  const goTo = (i: number) => {
    const el = outer.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const step = (el.offsetHeight - window.innerHeight) / N;
    scrollToY(top + step * i + step * 0.35);
  };

  const c = CHAPTERS[index];

  return (
    <section id="jelajah" className="relative bg-night text-white">
      {/* intro */}
      <div className="relative overflow-hidden px-6 pt-28 pb-16 md:px-12 md:pt-36">
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-tosca/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 left-[-10%] h-[420px] w-[420px] rounded-full bg-coral/15 blur-[120px]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 font-display text-xs tracking-[0.18em] text-sulfur uppercase">
              <span className="h-px w-8 bg-sulfur" /> Bab 02 · Destinasi
            </p>
            <h2 className="font-display text-[52px] leading-[0.92] tracking-[-0.03em] uppercase md:text-[88px] lg:text-[120px]">
              Jelajahi <br />
              <span className="font-serif font-normal tracking-[-0.01em] text-coral normal-case italic">Banyuwangi</span>
            </h2>
          </div>
          <div className="max-w-md lg:justify-self-end">
            <p className="text-[17px] leading-7 font-light text-white/75">
              Sembilan destinasi, satu kabupaten di ujung timur Jawa. Gulir pelan — setiap layar menjelaskan <em className="text-white">apa</em>{" "}
              tempat itu, <em className="text-white">di mana</em>, <em className="text-white">kapan</em> terbaik ke sana, dan apa yang bisa kamu lakukan.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                ["9", "Destinasi"],
                ["5.782", "km² luas"],
                ["175", "km garis pantai"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-3xl text-sulfur">{v}</div>
                  <div className="mt-1 text-[10px] tracking-[0.18em] text-white/50 uppercase">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* pinned chapters */}
      <div ref={outer} className="relative">
        {/* 100vh of scroll per chapter (N = 9) */}
        <div className="h-[900vh]" aria-hidden />
        <div ref={stage} className="absolute inset-0">
          <div className="sticky top-0 h-svh overflow-hidden [--kp:0]">
            {/* photo layer */}
            <AnimatePresence initial={false}>
              <motion.div
                key={c.slug}
                className="absolute inset-0"
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0.6 }}
                transition={{ duration: 1.1, ease: EASE }}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  priority={index === 0}
                  quality={90}
                  sizes="100vw"
                  className="object-cover [transform:scale(calc(1.14-var(--kp)*0.12))] transition-transform duration-300 ease-out"
                />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/95 via-night/55 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/90 via-transparent to-night/40" />

            {/* chapter rail (desktop) */}
            <nav className="absolute top-1/2 right-6 z-10 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
              {CHAPTERS.map((ch, i) => (
                <button
                  key={ch.slug}
                  type="button"
                  onClick={() => goTo(i)}
                  className={cn(
                    "group flex items-center justify-end gap-3 text-right text-[11px] tracking-[0.12em] uppercase transition-colors duration-500",
                    i === index ? "text-white" : "text-white/40 hover:text-white/80",
                  )}
                >
                  <span className={cn("transition-all duration-500", i === index ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>{ch.name}</span>
                  <span className="font-display text-xs">{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("h-px transition-all duration-500", i === index ? "w-10 bg-coral" : "w-4 bg-white/30")} />
                </button>
              ))}
            </nav>

            {/* content */}
            <div className="relative z-10 flex h-full flex-col justify-center px-6 pt-20 pb-24 md:px-12 lg:pr-[38%] xl:pr-[42%]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={c.slug}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={{ show: { transition: { staggerChildren: 0.06 } }, exit: { opacity: 0, y: -20, transition: { duration: 0.35 } } }}
                >
                  <motion.div variants={item} className="mb-4 flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase">
                    <span className="font-display text-sm text-sulfur">
                      {String(index + 1).padStart(2, "0")} <span className="text-white/40">/ {String(N).padStart(2, "0")}</span>
                    </span>
                    <span className="h-px w-8 bg-white/30" />
                    <span className="text-tosca">{c.category}</span>
                  </motion.div>
                  <motion.h3 variants={item} className="font-display text-[46px] leading-[0.95] tracking-[-0.03em] uppercase md:text-[72px] lg:text-[96px]">
                    {c.name}
                  </motion.h3>
                  <motion.p variants={item} className="mt-3 font-serif text-2xl text-coral italic md:text-3xl">
                    {c.tagline}
                  </motion.p>
                  <motion.p variants={item} className="mt-5 max-w-xl text-[14px] leading-6 font-light text-white/80 md:text-[16px] md:leading-7">
                    {c.description}
                  </motion.p>
                  <motion.dl variants={item} className="mt-7 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-5 md:grid-cols-4">
                    {c.facts.map((f) => (
                      <div key={f.label}>
                        <dt className="text-[10px] tracking-[0.16em] text-white/45 uppercase">{f.label}</dt>
                        <dd className="mt-1 text-[13px] leading-5 font-medium text-white">{f.value}</dd>
                      </div>
                    ))}
                  </motion.dl>
                  <motion.ul variants={item} className="mt-6 flex max-w-xl flex-wrap gap-2">
                    {c.activities.map((a) => (
                      <li key={a} className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[11px] text-white/85 backdrop-blur-sm">
                        {a}
                      </li>
                    ))}
                  </motion.ul>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* gallery + trivia (desktop) */}
            <div className="absolute right-[7%] bottom-[12%] z-10 hidden w-[30%] max-w-[420px] lg:block xl:right-[19%]">
              <AnimatePresence mode="wait">
                <motion.div key={c.slug} initial="hidden" animate="show" exit="exit" variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } }, exit: { opacity: 0, transition: { duration: 0.3 } } }}>
                  <div className="grid grid-cols-3 gap-3">
                    {c.gallery.map((g, i) => (
                      <motion.div
                        key={g}
                        variants={{ hidden: { opacity: 0, y: 40, rotate: i - 1 }, show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.9, ease: EASE } } }}
                        className={cn("relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-white/20", i === 1 && "-translate-y-6")}
                      >
                        <Image src={g} alt={`${c.name} ${i + 1}`} fill quality={90} sizes="(min-width: 1536px) 140px, 120px" className="object-cover" />
                      </motion.div>
                    ))}
                  </div>
                  <motion.div variants={item} className="mt-5 flex gap-3 rounded-2xl border border-white/10 bg-night/60 p-4 backdrop-blur-md">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-sulfur" />
                    <div>
                      <div className="text-[10px] tracking-[0.18em] text-sulfur uppercase">Tips Dolan</div>
                      <p className="mt-1 text-[13px] leading-5 text-white/80">{c.trivia}</p>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* progress */}
            <div className="absolute inset-x-6 bottom-8 z-10 flex items-center gap-4 md:inset-x-12">
              <span className="text-[10px] tracking-[0.2em] text-white/50 uppercase">Jelajah</span>
              <div className="h-px flex-1 bg-white/15">
                <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-tosca via-sulfur to-coral" />
              </div>
              <div className="flex gap-1.5 xl:hidden">
                {CHAPTERS.map((ch, i) => (
                  <button key={ch.slug} type="button" aria-label={ch.name} onClick={() => goTo(i)} className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-coral" : "w-1.5 bg-white/30")} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
