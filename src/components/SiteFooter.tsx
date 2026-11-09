import { CHAPTERS, LANDSCAPES } from "@/data/site";
import { GithubIcon, LogoMark } from "@/components/icons";
import credits from "@/data/credits.json";
import type { PhotoCredit } from "@/types";

const PHOTO_CREDITS = credits as Record<string, PhotoCredit>;

const STORY = [
  ["#mengenal", "01", "Mengenal Banyuwangi"],
  ["#jelajah", "02", "Sembilan Destinasi"],
  ["#sehari", "03", "24 Jam di Banyuwangi"],
  ["#lanskap", "04", "Empat Lanskap"],
  ["#etika", "05", "Datang sebagai Tamu"],
] as const;

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-navy pt-20 pb-8 font-sans text-white">
      <div className="pointer-events-none absolute -top-px left-0 h-px w-full bg-gradient-to-r from-transparent via-coral/60 to-transparent" />
      <div className="px-6 md:px-12 lg:px-32">
        <div className="border-b border-white/10 pb-14">
          <p className="font-display text-xs tracking-[0.2em] text-sulfur uppercase">Akhir cerita · awal perjalanan</p>
          <a href="#hero" className="group mt-4 block font-display text-[48px] leading-[0.92] tracking-[-0.03em] uppercase md:text-[96px]">
            Kembali ke <span className="font-serif font-normal text-coral normal-case italic transition-colors group-hover:text-sulfur">pintu</span>
          </a>
        </div>

        <div className="grid gap-12 border-b border-white/10 py-14 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h4 className="mb-5 font-display text-base tracking-[0.02em] uppercase">Alur Cerita</h4>
            <ul className="space-y-3">
              {STORY.map(([href, n, label]) => (
                <li key={href}>
                  <a href={href} className="flex items-baseline gap-3 text-[15px] text-white/80 transition-colors hover:text-sulfur">
                    <span className="font-display text-xs text-coral">{n}</span> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-5 font-display text-base tracking-[0.02em] uppercase">Destinasi</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-[15px] text-white/80">
              {CHAPTERS.map((c) => (
                <li key={c.slug}>{c.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-5 font-display text-base tracking-[0.02em] uppercase">Lanskap</h4>
            <ul className="space-y-4">
              {LANDSCAPES.map((l) => (
                <li key={l.name}>
                  <div className="font-display text-[10px] tracking-[0.14em] text-sulfur uppercase">{l.subtitle}</div>
                  <div className="mt-1 text-[15px] text-white/80">{l.name}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <details className="group border-b border-white/10 py-6">
          <summary className="cursor-pointer list-none text-xs tracking-[0.15em] text-white/50 uppercase transition-colors hover:text-sulfur">
            Kredit Foto · Wikimedia Commons <span className="inline-block transition-transform group-open:rotate-45">+</span>
          </summary>
          <ul className="mt-5 grid gap-x-8 gap-y-2 text-[11px] leading-4 text-white/45 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(PHOTO_CREDITS).map(([slug, c]) => (
              <li key={slug}>
                <a href={c.source} target="_blank" rel="noreferrer" className="hover:text-white">
                  {c.title.replace(/\.jpe?g$/i, "")}
                </a>{" "}
                — {c.author || "Unknown"} · {c.license}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-white/40">Ilustrasi pintu dan zona lanskap: aset milik DolanBwi.</p>
        </details>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[14px] text-white/60 md:flex-row">
          <span className="flex items-center gap-3">
            <LogoMark className="h-5 w-5 text-sulfur" /> © 2026 DolanBwi · Sunrise of Java
          </span>
          <span className="text-white/40">Panduan jelajah Banyuwangi, Jawa Timur</span>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-6 text-[13px] text-white/60 sm:flex-row sm:gap-6">
          <a
            href="https://www.x2zu.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-sulfur"
          >
            Made By <span className="font-semibold text-white">Reivan Elsyafir Pratama</span>
          </a>
          <a
            href="https://github.com/x4zu/DolanBwi-Website"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Source code di GitHub"
            title="Source code di GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-sulfur hover:text-sulfur"
          >
            <GithubIcon className="h-[18px] w-[18px]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
