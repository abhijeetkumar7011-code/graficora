"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Quote, ArrowUpRight, MapPin, Clock3, Sparkles } from "lucide-react";
import Tilt from "@/components/Tilt";
import Marquee from "@/components/Marquee";
import AccentTitle from "@/components/AccentTitle";
import { useSiteData } from "@/components/SiteDataProvider";

/* ---------- helpers ---------- */

function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function CountUp({ to, suffix = "", run }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf;
    const t0 = performance.now();
    const dur = 1600;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return (
    <>
      {n}
      {suffix}
    </>
  );
}

function SkillRing({ name, level, run, delay }) {
  const id = useId().replace(/:/g, "");
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2 text-center sm:gap-3">
      <div className="relative h-[68px] w-[68px] sm:h-24 sm:w-24">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgb(var(--c1))" />
              <stop offset=".55" stopColor="rgb(var(--c2))" />
              <stop offset="1" stopColor="rgb(var(--c3))" />
            </linearGradient>
          </defs>
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgb(var(--fg) / 0.1)" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={`url(#${id})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={run ? c * (1 - level / 100) : c}
            style={{ transition: `stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1) ${delay}ms` }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold sm:text-lg">
          <CountUp to={level} suffix="%" run={run} />
        </span>
      </div>
      <span className="text-[11px] font-medium text-fg/80 sm:text-sm">{name}</span>
    </div>
  );
}

// corners of the square: the circular ring never reaches them, so chips never cover the rotating text
const chipPos = ["left-0 top-0", "right-0 top-[3%]", "left-0 bottom-[3%]", "right-0 bottom-0"];

/* ---------- section ---------- */

export default function About() {
  const { site, about, aboutStats, skills, journey, testimonials, copy } = useSiteData();
  const c = copy.aboutHome;
  const initials = site.designer
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const [statsRef, statsSeen] = useInView(0.4);
  const [skillsRef, skillsSeen] = useInView(0.3);
  const ringId = useId().replace(/:/g, "");

  return (
    <section id="about" className="relative overflow-hidden py-14 md:py-32">
      {/* decor */}
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 animate-blob rounded-full bg-brand-pink/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-40 h-96 w-96 animate-blob rounded-full bg-brand-violet/20 blur-3xl [animation-delay:5s]" />

      <div className="relative mx-auto w-full max-w-6xl px-5">
        <div data-aos="fade-up">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-6xl">
            <AccentTitle t={c.title} />
          </h2>
        </div>

        {/* ------------------------------ bento ------------------------------ */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 md:grid-cols-12">
          {/* portrait */}
          <div className="col-span-2 md:col-span-5 md:row-span-2" data-aos="fade-right">
            <Tilt className="h-full" max={10} radius="rounded-[2.5rem]">
              <div className="glass relative flex h-full items-center justify-center overflow-hidden rounded-[2rem] p-3 sm:min-h-[420px] sm:rounded-[2.5rem] sm:p-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(var(--c2)/0.22),transparent_65%)]" />

                <div className="relative aspect-square w-full max-w-[250px] sm:max-w-[380px]">
                  <div className="absolute inset-[8%]">
                  {/* rotating text ring */}
                  <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow text-fg/70">
                    <defs>
                      <path id={ringId} d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
                    </defs>
                    <text fontSize="10.5" fontWeight="700" fill="currentColor" letterSpacing="2">
                      <textPath href={`#${ringId}`} textLength="510" lengthAdjust="spacing">
                        {about.ring}
                      </textPath>
                    </text>
                  </svg>

                  {/* counter-rotating dashed orbit */}
                  <div className="absolute inset-[9%] animate-spin-slower rounded-full border border-dashed border-fg/25" />

                  {/* avatar — replace with <Image src="/me.jpg" .../> */}
                  <div className="absolute inset-[17%] overflow-hidden rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange shadow-[0_0_60px_rgb(var(--c2)/0.45)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.45),transparent_55%)]" />
                    <div className="absolute inset-0 flex items-center justify-center font-display text-5xl font-extrabold text-white sm:text-8xl">
                      {initials}
                    </div>
                  </div>
                  </div>

                  {/* floating skill chips */}
                  {about.floaters.map((f, i) => (
                    <span
                      key={f}
                      className={`glass absolute ${chipPos[i % 4]} animate-float rounded-full px-3 py-1.5 text-[10px] font-semibold sm:px-4 sm:py-2 sm:text-xs`}
                      style={{ animationDelay: `${i * 0.9}s` }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </Tilt>
          </div>

          {/* bio */}
          <div className="glass relative col-span-2 overflow-hidden rounded-[2rem] p-5 sm:rounded-[2.5rem] sm:p-10 md:col-span-7" data-aos="fade-left">
            <div className="font-display text-4xl font-extrabold leading-[1.02] sm:text-6xl">
              <div>{about.headline[0]}</div>
              <div className="gradient-text">{about.headline[1]}</div>
              <div className="text-outline">{about.headline[2]}</div>
            </div>
            <p className="mt-4 max-w-xl text-sm text-fg/70 sm:mt-6 sm:text-base">{about.bio}</p>
            <blockquote className="mt-4 flex sm:mt-6 max-w-xl gap-3 border-l-2 border-brand-pink/60 pl-4 text-sm italic text-fg/75">
              <Quote size={18} className="mt-0.5 shrink-0 text-brand-pink" />
              {about.quote}
            </blockquote>
            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
              <Link href={c.primary.href} className="btn-gradient !px-5 !py-2.5 sm:!px-7 sm:!py-3">
                {c.primary.label} <ArrowUpRight size={16} />
              </Link>
              <Link href={c.secondary.href} className="btn-ghost !px-5 !py-2.5 sm:!px-7 sm:!py-3">
                {c.secondary.label} <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* stats */}
          <div ref={statsRef} className="glass col-span-1 rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-7 md:col-span-4" data-aos="fade-up" data-aos-delay="100">
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-6">
              {aboutStats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-extrabold gradient-text sm:text-4xl">
                    <CountUp to={s.value} suffix={s.suffix} run={statsSeen} />
                  </div>
                  <div className="mt-0.5 text-[9px] uppercase leading-tight tracking-wide text-fg/55 sm:mt-1 sm:text-[11px] sm:tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* status */}
          <div className="glass col-span-1 flex flex-col justify-between gap-4 rounded-[1.5rem] p-4 sm:gap-6 sm:rounded-[2rem] sm:p-7 md:col-span-3" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center gap-2.5 text-xs font-medium sm:gap-3 sm:text-sm">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
              {about.status}
            </div>
            <div className="space-y-1.5 text-[11px] text-fg/65 sm:space-y-2 sm:text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-brand-pink" /> {site.location}
              </div>
              <div className="flex items-center gap-2">
                <Clock3 size={15} className="text-brand-pink" /> {c.reply}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------ toolbox ------------------------------ */}
        <div ref={skillsRef} className="glass mt-3 rounded-[2rem] p-5 sm:mt-5 sm:rounded-[2.5rem] sm:p-10" data-aos="fade-up">
          <div className="mb-5 flex items-center gap-3 sm:mb-8">
            <Sparkles className="text-brand-orange" size={20} />
            <h3 className="font-display text-2xl font-bold">{c.toolbox}</h3>
          </div>
          <div className="grid grid-cols-3 gap-y-5 lg:grid-cols-6 lg:gap-y-8">
            {skills.map((s, i) => (
              <SkillRing key={s.name} name={s.name} level={s.level} run={skillsSeen} delay={i * 120} />
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------ giant marquee ------------------------------ */}
      <div className="mt-12 -rotate-2 scale-105 sm:mt-20" data-aos="fade-up">
        <Marquee speed={45} fade={false} gapPx={48}>
          {about.marquee.map((w, i) => (
            <span key={w} className="flex items-center gap-8 font-display text-5xl font-extrabold leading-none sm:gap-12 sm:text-6xl md:text-8xl">
              <span className={i % 2 ? "text-outline" : "gradient-text"}>{w}</span>
              <Sparkles className="shrink-0 text-brand-orange" size={40} />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="relative mx-auto mt-14 w-full max-w-6xl px-5 sm:mt-24">
        {/* ------------------------------ journey ------------------------------ */}
        <div data-aos="fade-up">
          <p className="eyebrow">{c.journeyEyebrow}</p>
          <h3 className="font-display text-2xl font-bold sm:text-3xl md:text-5xl">
            <AccentTitle t={c.journeyTitle} />
          </h3>
        </div>

        <div className="snap-row relative mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:mt-12 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:pb-0">
          <div className="absolute left-0 right-0 top-[11px] hidden h-px bg-gradient-to-r from-brand-violet via-brand-pink to-brand-orange md:block" />
          {journey.map((j, i) => (
            <div key={j.year} data-aos="fade-up" data-aos-delay={i * 120} className="relative w-[72%] shrink-0 snap-center md:w-auto md:pt-9">
              <span className="absolute left-0 top-0 hidden h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange shadow-[0_0_20px_rgb(var(--c2)/0.55)] md:flex">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
              <div className="glass glass-hover h-full rounded-2xl p-4 sm:rounded-3xl sm:p-6">
                <div className="font-display text-2xl font-extrabold gradient-text sm:text-3xl">{j.year}</div>
                <h4 className="mt-2 font-display text-lg font-semibold">{j.title}</h4>
                <p className="mt-1 text-sm text-fg/60">{j.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ------------------------------ testimonials ------------------------------ */}
        <div className="snap-row mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:mt-20 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0">
          {testimonials.map((t, i) => (
            <figure key={i} data-aos="fade-up" data-aos-delay={i * 100} className="glass w-[82%] shrink-0 snap-center rounded-2xl p-5 sm:rounded-3xl sm:p-8 md:w-auto">
              <Quote className="mb-3 text-brand-pink sm:mb-4" size={24} />
              <blockquote className="text-fg/80">{t.text}</blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="text-fg/50"> · {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
