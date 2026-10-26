import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, Award, Sparkles, Users, Zap } from "lucide-react";
import HeroScene from "@/components/HeroScene";
import ProjectArt from "@/components/ProjectArt";
import { getSiteData } from "@/lib/siteData";

/*
  Hero: copy on the left, a character / 3D scene on the right with an orbit ring, two project cards and a handwritten note.
  Full width and fluid (clamp / vw / vh), so it fits one screen from phones to ultrawide.
  Everything comes from lib/content.js: `site` (tagline, intro, heroImage), `stats`, `copy.hero`, `projects`.
  `site.heroImage` = "/hero-character.png" (a transparent PNG/WebP in /public). Leave it empty and the 3D orb scene is shown instead.
*/

const STAT_ICONS = [Sparkles, Users, Award, Zap];

// tagline -> 3 lines; the last word of line 2 gets the gradient, the last line gets a hand-drawn underline
function Headline({ text }) {
  const w = text.split(" ");
  const lines = [w.slice(0, 3), w.slice(3, 5), w.slice(5)].filter((l) => l.length);
  return (
    <h1
      data-aos="fade-up"
      data-aos-delay="100"
      className="mt-5 font-display text-[length:clamp(2.9rem,min(5.1vw,10.5vh),9rem)] font-extrabold leading-[0.98] tracking-[-0.04em] sm:mt-7"
    >
      {lines.map((l, i) => {
        const isLast = i === lines.length - 1;
        const accent = i === 1 || (lines.length < 3 && isLast);
        const head = accent ? l.slice(0, -1).join(" ") : l.join(" ");
        return (
          <span key={i} className="relative block w-fit lg:whitespace-nowrap">
            {head}
            {accent && head && " "}
            {accent && <span className="gradient-text italic">{l[l.length - 1]}</span>}
            {isLast && (
              <svg viewBox="0 0 280 14" fill="none" aria-hidden className="absolute -bottom-[0.14em] left-[4%] h-[0.16em] w-[72%]">
                <defs>
                  <linearGradient id="hero-underline" x1="0" x2="1">
                    <stop offset="0" stopColor="rgb(var(--c1))" />
                    <stop offset="0.6" stopColor="rgb(var(--c2))" />
                    <stop offset="1" stopColor="rgb(var(--c3))" />
                  </linearGradient>
                </defs>
                <path d="M3 9 C 40 2, 90 12, 140 6 S 230 3, 277 7" stroke="url(#hero-underline)" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M40 12 C 90 8, 150 13, 210 9" stroke="url(#hero-underline)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              </svg>
            )}
          </span>
        );
      })}
    </h1>
  );
}

function FloatCard({ p, pos, rot, delay = 0 }) {
  if (!p) return null;
  return (
    <Link
      href={`/work#${p.slug}`}
      aria-label={`${p.title} — ${p.category}`}
      className={`pointer-events-auto absolute z-20 w-[7.6rem] transition-transform duration-300 hover:z-30 hover:!scale-105 sm:w-[9rem] lg:w-[clamp(150px,12vw,260px)] ${pos}`}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <div className="glass animate-float rounded-2xl p-1.5 sm:p-2 lg:rounded-3xl lg:p-[clamp(8px,0.7vw,14px)]" style={{ animationDelay: `${delay}s` }}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl lg:rounded-2xl">
          <ProjectArt art={p.art} className="absolute inset-0 h-full w-full" />
        </div>
        <p className="mt-1.5 px-0.5 text-[9px] uppercase tracking-wider text-fg/55 lg:text-[length:clamp(10px,0.72vw,13px)]">{p.category}</p>
        <p className="truncate px-0.5 font-display text-[11px] font-bold sm:text-xs lg:text-[length:clamp(13px,0.95vw,18px)]">{p.title}</p>
      </div>
    </Link>
  );
}

export default async function Hero() {
  const { site, stats, projects, copy } = await getSiteData();
  const h = copy.hero;
  const byslug = (s) => projects.find((p) => p.slug === s);
  const [ca, cb] = (h.cards || []).map(byslug);
  const proof = stats[1] ? `${stats[1].value} ${stats[1].label.toLowerCase()}` : null;

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* backdrop glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-24 h-72 w-72 animate-blob rounded-full bg-brand-violet/25 blur-3xl lg:h-[28vw] lg:w-[28vw]" />
        <div className="absolute -right-20 top-1/3 h-80 w-80 animate-blob rounded-full bg-brand-pink/20 blur-3xl [animation-delay:4s] lg:h-[34vw] lg:w-[34vw]" />
      </div>

      <div className="relative z-10 grid flex-1 items-center gap-2 px-[5vw] pt-28 sm:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-[2vw] lg:px-[4vw] lg:pt-[max(6rem,12vh)]">
        {/* ------------------------------ copy ------------------------------ */}
        <div className="lg:max-w-[50vw]">
          <div data-aos="fade-up" className="glass inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] text-fg/80 sm:px-4 sm:py-2 sm:text-xs lg:text-[length:clamp(12px,0.9vw,16px)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.25)]" />
            <Sparkles size={13} className="text-brand-orange" />
            {h.badge}
          </div>

          <Headline text={site.tagline} />

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-5 max-w-md text-sm text-fg/70 sm:mt-7 sm:text-base lg:mt-[3vh] lg:max-w-[min(34vw,36rem)] lg:text-[length:clamp(0.95rem,min(1.1vw,2vh),1.35rem)] lg:leading-relaxed"
          >
            {site.intro}
          </p>

          <div data-aos="fade-up" data-aos-delay="300" className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4 lg:mt-[3.4vh]">
            <a href={h.primary.href} className="btn-gradient !px-6 !py-3 lg:!px-[clamp(26px,2vw,40px)] lg:!py-[clamp(13px,1vw,20px)] lg:!text-[length:clamp(14px,1vw,18px)]">
              {h.primary.label} <ArrowDownRight size={18} />
            </a>
            <a href={h.secondary.href} className="btn-ghost !px-6 !py-3 lg:!px-[clamp(26px,2vw,40px)] lg:!py-[clamp(13px,1vw,20px)] lg:!text-[length:clamp(14px,1vw,18px)]">
              {h.secondary.label}
            </a>
            {proof && (
              <span className="flex items-center gap-3 text-xs text-fg/70 sm:text-sm">
                <span className="flex">
                  <i className="h-7 w-7 rounded-full border-2 border-[var(--page-bg)] bg-brand-violet sm:h-8 sm:w-8" />
                  <i className="-ml-2.5 h-7 w-7 rounded-full border-2 border-[var(--page-bg)] bg-brand-pink sm:h-8 sm:w-8" />
                  <i className="-ml-2.5 h-7 w-7 rounded-full border-2 border-[var(--page-bg)] bg-brand-orange sm:h-8 sm:w-8" />
                </span>
                {proof}
              </span>
            )}
          </div>
        </div>

        {/* ------------------------------ art ------------------------------ */}
        <div className="pointer-events-none relative mx-auto mt-4 h-[380px] w-full max-w-[34rem] sm:h-[460px] sm:max-w-[40rem] lg:mx-0 lg:mt-0 lg:h-[clamp(420px,66vh,780px)] lg:max-w-none">
          {/* big soft disc behind the figure */}
          <div className="absolute left-1/2 top-1/2 aspect-square h-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-violet/55 via-brand-pink/40 to-brand-orange/30 blur-[2px]" />
          <div className="absolute left-1/2 top-1/2 aspect-square h-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-pink/30 blur-3xl" />

          {/* orbit ring: back half behind the figure, front half in front */}
          <svg viewBox="0 0 600 500" className="absolute inset-0 z-0 h-full w-full" fill="none" aria-hidden>
            <g transform="rotate(-16 300 250)">
              <ellipse cx="300" cy="250" rx="285" ry="105" stroke="rgb(var(--c1) / 0.55)" strokeWidth="2" />
            </g>
          </svg>

          {/* the figure: your own artwork, or the 3D orb scene as fallback */}
          {site.heroImage ? (
            <div className="absolute inset-0 z-10 animate-float-slow">
              <Image src={site.heroImage} alt={site.designer} fill priority sizes="(min-width:1024px) 50vw, 90vw" className="object-contain object-bottom drop-shadow-[0_30px_60px_rgb(var(--c2)/0.35)]" />
            </div>
          ) : (
            <div className="absolute inset-0 z-10">
              <HeroScene />
            </div>
          )}

          <svg viewBox="0 0 600 500" className="absolute inset-0 z-20 h-full w-full" fill="none" aria-hidden>
            <g transform="rotate(-16 300 250)">
              <path d="M15 250 A 285 105 0 0 0 585 250" stroke="rgb(var(--c2) / 0.9)" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>

          {/* little 3D bits */}
          <span
            className="absolute right-[24%] top-[2%] z-20 h-[clamp(22px,2.6vw,48px)] w-[clamp(22px,2.6vw,48px)] animate-float-slow rounded-full shadow-[0_10px_30px_rgb(var(--c1)/0.5)]"
            style={{ background: "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.9), transparent 32%), rgb(var(--c1))" }}
          />
          <span className="absolute bottom-[26%] left-[10%] z-20 h-[clamp(34px,4.2vw,76px)] w-[clamp(34px,4.2vw,76px)] animate-float rounded-full border-[clamp(8px,1vw,16px)] border-brand-orange shadow-[0_12px_30px_rgb(var(--c3)/0.45)]" />

          <FloatCard p={ca} rot={-8} delay={0} pos="left-0 top-[4%] lg:left-[2%] lg:top-[3%]" />
          <FloatCard p={cb} rot={5} delay={1.5} pos="right-0 top-[44%] lg:right-0 lg:top-[26%]" />

          {/* handwritten note */}
          <div className="absolute bottom-[3%] right-[2%] z-20 flex items-end gap-2 text-fg/80">
            <svg viewBox="0 0 60 40" className="mb-6 h-8 w-12 -rotate-12 lg:h-[clamp(30px,2.6vw,50px)] lg:w-[clamp(44px,4vw,76px)]" fill="none" aria-hidden>
              <path d="M56 36 C 40 36, 18 30, 8 8 M8 8 l-1 11 M8 8 l10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="max-w-[9rem] -rotate-6 font-hand text-lg leading-tight lg:max-w-[18vw] lg:text-[length:clamp(20px,1.9vw,36px)]">{h.note}</p>
          </div>
        </div>
      </div>

      {/* ------------------------------ stats ------------------------------ */}
      <div
        data-aos="fade-up"
        data-aos-delay="400"
        className="glass relative z-10 mx-[5vw] mb-4 mt-3 grid grid-cols-2 gap-y-4 rounded-2xl p-4 sm:rounded-3xl sm:p-5 lg:mx-[4vw] lg:mb-[3vh] lg:mt-[1vh] lg:grid-cols-[repeat(4,1fr)_auto] lg:gap-0 lg:px-[clamp(20px,1.6vw,36px)] lg:py-[clamp(14px,2vh,26px)]"
      >
        {stats.map((s, i) => {
          const I = STAT_ICONS[i % STAT_ICONS.length];
          return (
            <div key={s.label} className={`flex items-center gap-3 sm:gap-4 lg:px-[1.6vw] ${i ? "lg:border-l lg:border-fg/10" : "lg:pl-0"}`}>
              <I className="h-6 w-6 shrink-0 text-brand-pink lg:h-[clamp(24px,1.9vw,36px)] lg:w-[clamp(24px,1.9vw,36px)]" />
              <div>
                <div className="font-display text-xl font-bold leading-none sm:text-2xl lg:text-[length:clamp(24px,2vw,40px)]">{s.value}</div>
                <div className="mt-1 text-[9px] uppercase leading-tight tracking-wide text-fg/55 sm:text-[11px] lg:text-[length:clamp(10px,0.75vw,14px)] lg:tracking-[0.12em]">{s.label}</div>
              </div>
            </div>
          );
        })}
        <div className="hidden items-center gap-3 border-l border-fg/10 pl-[1.6vw] text-xs uppercase tracking-[0.2em] text-fg/70 lg:flex">
          {h.scroll}
          <span className="relative h-10 w-6 rounded-full border-[1.5px] border-fg/50">
            <span className="absolute left-1/2 top-2 h-2 w-[3px] -translate-x-1/2 animate-float rounded bg-brand-pink" />
          </span>
        </div>
      </div>
    </section>
  );
}
