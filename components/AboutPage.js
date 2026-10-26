"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Coffee, Headphones, Pencil, Sun, MapPin, Mail, MousePointer2, Quote, Sparkles } from "lucide-react";
import Tilt from "@/components/Tilt";
import AccentTitle from "@/components/AccentTitle";
import { useSiteData } from "@/components/SiteDataProvider";

const factIcons = { Coffee, Headphones, Pencil, Sun };

/* ---------------------------------------------------------------- helpers */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

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
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1600);
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

/* One scroll listener drives every scroll-linked effect on the page (progress bar, giant text, manifesto, timeline). */
function useScrollEffects(fns) {
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const vh = window.innerHeight;
      fns.current.forEach((f) => f(vh));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [fns]);
}

/* ---------------------------------------------------------------- page */

export default function AboutPage() {
  const { site, about, aboutStats, skills, journey, testimonials, manifesto, principles, funFacts, copy } = useSiteData();
  const c = copy.aboutPage;
  const initials = site.designer
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const ringId = useId().replace(/:/g, "");
  const [statsRef, statsSeen] = useInView(0.35);
  const [skillsRef, skillsSeen] = useInView(0.25);

  // refs touched by the scroll engine
  const barRef = useRef(null);
  const heroRef = useRef(null);
  const giantRef = useRef(null);
  const giantA = useRef(null);
  const giantB = useRef(null);
  const manifestoRef = useRef(null);
  const wordRefs = useRef([]);
  const timelineRef = useRef(null);
  const lineRef = useRef(null);
  const fns = useRef([]);

  const words = manifesto.split(" ");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    fns.current = [
      // top progress bar
      () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? clamp(window.scrollY / max) : 0})`;
      },
      // giant text lines slide in opposite directions as you scroll
      () => {
        if (reduce || !giantRef.current) return;
        const t = giantRef.current.getBoundingClientRect().top;
        if (giantA.current) giantA.current.style.transform = `translate3d(${t * 0.55}px,0,0)`;
        if (giantB.current) giantB.current.style.transform = `translate3d(${-t * 0.55}px,0,0)`;
      },
      // manifesto: words light up one by one
      (vh) => {
        const el = manifestoRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const p = reduce ? 1 : clamp((vh * 0.85 - r.top) / (vh * 0.4 + r.height));
        const n = wordRefs.current.length;
        wordRefs.current.forEach((w, i) => {
          if (w) w.style.opacity = i / n < p ? "1" : "0.16";
        });
      },
      // timeline: gradient line fills with scroll
      (vh) => {
        const el = timelineRef.current;
        if (!el || !lineRef.current) return;
        const r = el.getBoundingClientRect();
        const p = clamp((vh * 0.6 - r.top) / r.height);
        lineRef.current.style.transform = `scaleY(${p})`;
      },
    ];
    // run once after assigning (the hook ran before the array was filled)
    window.dispatchEvent(new Event("resize"));
  }, []);

  useScrollEffects(fns);

  // cursor spotlight in the hero (CSS vars, no re-render)
  const onHeroMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <main className="relative overflow-x-clip">
      {/* scroll progress */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-gradient-to-r from-brand-violet via-brand-pink to-brand-orange" />
      </div>

      {/* =============================== HERO =============================== */}
      <section ref={heroRef} onPointerMove={onHeroMove} className="relative overflow-hidden" style={{ "--mx": "70%", "--my": "30%" }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), rgb(var(--c2) / 0.2), transparent 65%)" }}
        />
        <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 animate-blob rounded-full bg-brand-violet/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 animate-blob rounded-full bg-brand-orange/20 blur-3xl [animation-delay:4s]" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 pb-16 pt-28 sm:pt-32 lg:min-h-screen lg:grid-cols-[1.15fr_1fr] lg:gap-6 lg:pb-24 lg:pt-36">
          <div className="relative z-10">
            <p data-aos="fade-up" className="eyebrow">
              {c.eyebrow}
            </p>
            <h1 className="font-display text-[3rem] font-extrabold leading-[0.98] tracking-tight sm:text-7xl xl:text-8xl">
              {about.headline.map((w, i) => (
                <span
                  key={w}
                  data-aos="fade-up"
                  data-aos-delay={100 + i * 120}
                  className={`block w-fit cursor-default transition duration-300 hover:-translate-y-1.5 hover:-rotate-2 ${
                    i === 1 ? "gradient-text" : i === 2 ? "text-outline" : ""
                  }`}
                >
                  {w}
                </span>
              ))}
            </h1>
            <p data-aos="fade-up" data-aos-delay="450" className="mt-5 max-w-md text-sm text-fg/70 sm:mt-8 sm:text-lg">
              {about.bio}
            </p>
            <div data-aos="fade-up" data-aos-delay="550" className="mt-6 flex flex-wrap items-center gap-3 sm:mt-10">
              <Link href={c.primary.href} className="btn-gradient !px-6 !py-2.5 sm:!px-7 sm:!py-3">
                {c.primary.label} <ArrowUpRight size={16} />
              </Link>
              <Link href={c.secondary.href} className="btn-ghost !px-6 !py-2.5 sm:!px-7 sm:!py-3">
                {c.secondary.label}
              </Link>
              <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs text-fg/75">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                {about.status}
              </span>
            </div>
          </div>

          {/* portrait with orbiting planets */}
          <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[420px]" data-aos="zoom-in" data-aos-delay="200">
            <Tilt max={12} radius="rounded-full">
              <div className="relative aspect-square w-full">
                {/* orbits */}
                <div className="absolute inset-0 animate-spin-slower">
                  <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-brand-orange shadow-[0_0_24px_rgb(var(--c3)/0.9)]" />
                </div>
                <div className="absolute inset-[7%] animate-spin-slow [animation-direction:reverse]">
                  <span className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-brand-violet shadow-[0_0_20px_rgb(var(--c1)/0.9)]" />
                </div>
                <div className="absolute inset-[3%] rounded-full border border-dashed border-fg/20" />
                <div className="absolute inset-[10%] rounded-full border border-fg/10" />

                {/* rotating text */}
                <div className="absolute inset-[13%]">
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
                  {/* avatar — swap for <Image src="/me.jpg" fill className="object-cover" /> */}
                  <div className="absolute inset-[17%] overflow-hidden rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange shadow-[0_0_70px_rgb(var(--c2)/0.5)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.45),transparent_55%)]" />
                    <div className="absolute inset-0 flex items-center justify-center font-display text-6xl font-extrabold text-white sm:text-8xl">
                      {initials}
                    </div>
                  </div>
                </div>

                {/* floating chips */}
                {about.floaters.map((f, i) => (
                  <span
                    key={f}
                    className={`glass absolute animate-float rounded-full px-3 py-1.5 text-[10px] font-semibold sm:px-4 sm:py-2 sm:text-xs ${
                      ["left-0 top-[8%]", "right-0 top-[14%]", "left-[2%] bottom-[10%]", "right-[2%] bottom-[6%]"][i % 4]
                    }`}
                    style={{ animationDelay: `${i * 0.9}s` }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </Tilt>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-fg/40 lg:flex">
          <MousePointer2 size={14} /> Scroll
        </div>
      </section>

      {/* ============================ GIANT TEXT ============================ */}
      <section ref={giantRef} className="relative overflow-hidden py-8 sm:py-14" aria-hidden="true">
        <div ref={giantA} className="flex w-max -rotate-2 gap-8 whitespace-nowrap font-display text-6xl font-extrabold leading-none will-change-transform sm:text-8xl md:text-[9rem]" style={{ marginLeft: "-30vw" }}>
          {[...about.marquee, ...about.marquee].map((w, i) => (
            <span key={i} className={i % 2 ? "text-outline" : "gradient-text"}>
              {w}
            </span>
          ))}
        </div>
        <div ref={giantB} className="mt-2 flex w-max -rotate-2 gap-8 whitespace-nowrap font-display text-6xl font-extrabold leading-none will-change-transform sm:mt-4 sm:text-8xl md:text-[9rem]" style={{ marginLeft: "-90vw" }}>
          {[...about.marquee, ...about.marquee].reverse().map((w, i) => (
            <span key={i} className={i % 2 ? "gradient-text" : "text-outline"}>
              {w}
            </span>
          ))}
        </div>
      </section>

      {/* ============================ MANIFESTO ============================ */}
      <section className="mx-auto w-full max-w-5xl px-5 py-14 sm:py-28">
        <p className="eyebrow">{c.manifestoEyebrow}</p>
        <p ref={manifestoRef} className="font-display text-[1.65rem] font-bold leading-[1.2] sm:text-5xl sm:leading-[1.15] md:text-6xl">
          {words.map((w, i) => (
            <span
              key={i}
              ref={(el) => (wordRefs.current[i] = el)}
              className="inline-block pr-[0.28em] transition-opacity duration-300"
              style={{ opacity: 0.16 }}
            >
              {w}
            </span>
          ))}
        </p>
      </section>

      {/* ============================== STATS ============================== */}
      <section ref={statsRef} className="mx-auto w-full max-w-6xl px-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {aboutStats.map((s, i) => (
            <div
              key={s.label}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="glass glass-hover relative overflow-hidden rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-8"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange opacity-25 blur-2xl" />
              <div className="font-display text-4xl font-extrabold gradient-text sm:text-6xl">
                <CountUp to={s.value} suffix={s.suffix} run={statsSeen} />
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-fg/55 sm:mt-2 sm:text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================= JOURNEY ============================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-32">
        <div data-aos="fade-up">
          <p className="eyebrow">{c.journeyEyebrow}</p>
          <h2 className="font-display text-3xl font-bold sm:text-5xl md:text-6xl">
            <AccentTitle t={c.journeyTitle} />
          </h2>
        </div>

        <div ref={timelineRef} className="relative mt-10 space-y-5 sm:mt-16 sm:space-y-10">
          {/* track + scroll-filled line */}
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-fg/10 md:left-1/2" />
          <div ref={lineRef} className="absolute bottom-0 left-[10px] top-0 w-[3px] origin-top scale-y-0 rounded-full bg-gradient-to-b from-brand-violet via-brand-pink to-brand-orange md:left-[calc(50%-1px)]" />

          {journey.map((j, i) => {
            const right = i % 2 === 1;
            return (
              <div
                key={j.year}
                data-aos="fade-up"
                className={`relative pl-10 md:w-1/2 md:pl-0 ${right ? "md:ml-auto md:pl-14" : "md:pr-14"}`}
              >
                <span
                  className={`absolute top-6 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange shadow-[0_0_22px_rgb(var(--c2)/0.6)] ${
                    right ? "md:left-[-12px]" : "md:left-auto md:right-[-12px]"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
                <div className={`glass glass-hover rounded-2xl p-5 sm:rounded-3xl sm:p-7 ${right ? "" : "md:text-right"}`}>
                  <div className="font-display text-4xl font-extrabold gradient-text sm:text-5xl">{j.year}</div>
                  <h3 className="mt-2 font-display text-lg font-semibold sm:text-xl">{j.title}</h3>
                  <p className="mt-1 text-sm text-fg/65">{j.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================= PRINCIPLES ============================= */}
      <section className="mx-auto w-full max-w-4xl px-5 pb-16 sm:pb-32">
        <div data-aos="fade-up" className="mb-8 sm:mb-14">
          <p className="eyebrow">{c.rulesEyebrow}</p>
          <h2 className="font-display text-3xl font-bold sm:text-5xl md:text-6xl">
            <AccentTitle t={c.rulesTitle} />
          </h2>
        </div>

        <div className="pb-4">
          {principles.map((p, i) => (
            <div key={p.n} className="sticky mb-5 sm:mb-8" style={{ top: `calc(5.5rem + ${i * 14}px)` }}>
              <div
                className="relative overflow-hidden rounded-[1.75rem] border p-6 shadow-2xl shadow-black/20 sm:rounded-[2.25rem] sm:p-10"
                style={{
                  borderColor: "var(--glass-border)",
                  background: "linear-gradient(var(--glass-bg-hover), var(--glass-bg-hover)), var(--page-bg)",
                }}
              >
                <span className="pointer-events-none absolute right-4 top-3 font-display text-[4rem] font-extrabold leading-none text-outline sm:-right-4 sm:-top-8 sm:text-[11rem]">
                  {p.n}
                </span>
                <h3 className="relative max-w-[68%] font-display text-2xl font-bold sm:max-w-[80%] sm:text-4xl">{p.title}</h3>
                <p className="relative mt-3 max-w-lg text-sm text-fg/70 sm:mt-5 sm:text-lg">{p.text}</p>
                <div className="relative mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-brand-violet via-brand-pink to-brand-orange sm:mt-8" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================== SKILLS ============================== */}
      <section ref={skillsRef} className="mx-auto w-full max-w-6xl px-5 pb-16 sm:pb-32">
        <div className="glass relative overflow-hidden rounded-[2rem] p-5 sm:rounded-[2.5rem] sm:p-12" data-aos="fade-up">
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-brand-violet/20 blur-3xl" />
          <div className="mb-6 flex items-center gap-3 sm:mb-10">
            <Sparkles className="text-brand-orange" size={22} />
            <h2 className="font-display text-2xl font-bold sm:text-4xl">{c.toolbox}</h2>
          </div>
          <div className="grid gap-x-12 gap-y-5 sm:gap-y-7 md:grid-cols-2">
            {skills.map((s, i) => (
              <div key={s.name}>
                <div className="mb-2 flex items-baseline justify-between text-sm font-medium">
                  <span>{s.name}</span>
                  <span className="font-display text-fg/60">
                    <CountUp to={s.level} suffix="%" run={skillsSeen} />
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-fg/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-violet via-brand-pink to-brand-orange"
                    style={{
                      width: skillsSeen ? `${s.level}%` : "0%",
                      transition: `width 1.6s cubic-bezier(.2,.8,.2,1) ${i * 120}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== FUN FACTS ============================== */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:pb-32">
        <div data-aos="fade-up">
          <p className="eyebrow">{c.factsEyebrow}</p>
          <h2 className="font-display text-3xl font-bold sm:text-5xl md:text-6xl">
            <AccentTitle t={c.factsTitle} />
          </h2>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-fg/45">
            <span className="hidden sm:inline">{c.factsHintDesktop}</span>
            <span className="sm:hidden">{c.factsHintPhone}</span>
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-4">
          {funFacts.map((f, i) => (
            <FlipCard key={f.front} fact={f} index={i} />
          ))}
        </div>
      </section>

      {/* ============================ TESTIMONIALS ============================ */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:pb-32">
        <div className="snap-row flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0">
          {testimonials.map((t, i) => (
            <figure key={i} data-aos="fade-up" data-aos-delay={i * 100} className="glass w-[84%] shrink-0 snap-center rounded-2xl p-5 sm:rounded-3xl sm:p-8 md:w-auto">
              <Quote className="mb-3 text-brand-pink sm:mb-4" size={24} />
              <blockquote className="text-fg/80">{t.text}</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="text-fg/50"> · {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ================================ CTA ================================ */}
      <section id="cta" className="mx-auto w-full max-w-6xl px-5 pb-24 sm:pb-32">
        <div className="glass relative overflow-hidden rounded-[2rem] p-6 text-center sm:rounded-[3rem] sm:p-16" data-aos="zoom-in">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 animate-blob rounded-full bg-brand-violet/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 animate-blob rounded-full bg-brand-orange/30 blur-3xl [animation-delay:4s]" />
          <p className="eyebrow relative">{c.ctaEyebrow}</p>
          <h2 className="relative font-display text-[2.1rem] font-extrabold leading-[1.05] sm:text-6xl md:text-7xl">
            <AccentTitle t={c.ctaTitle} />
          </h2>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
            <a href={`mailto:${site.email}`} className="btn-gradient !px-6 !py-3 sm:!px-8 sm:!py-4">
              <Mail size={18} /> {c.ctaPrimary}
            </a>
            <Link href={c.ctaSecondary.href} className="btn-ghost !px-6 !py-3 sm:!px-8 sm:!py-4">
              {c.ctaSecondary.label} <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-10">
            {Object.entries(site.socials).map(([k, url]) => (
              <a
                key={k}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-fg/15 bg-fg/5 px-4 py-1.5 text-xs capitalize text-fg/75 transition hover:bg-fg/10 hover:text-fg"
              >
                {k}
              </a>
            ))}
          </div>
          <p className="relative mt-5 flex items-center justify-center gap-2 text-xs text-fg/50">
            <MapPin size={14} className="text-brand-pink" /> {site.location}
          </p>
        </div>
      </section>
    </main>
  );
}

/* ---------------------------------------------------------------- flip card */

function FlipCard({ fact, index }) {
  const [flipped, setFlipped] = useState(false);
  const Icon = factIcons[fact.icon] || Sparkles;
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      data-aos="fade-up"
      data-aos-delay={index * 100}
      className="group aspect-[4/5] w-full text-left [perspective:1000px] sm:aspect-square"
    >
      <span
        className={`relative block h-full w-full transition-transform duration-700 [transform-style:preserve-3d] sm:group-hover:[transform:rotateY(180deg)] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* front */}
        <span className="glass absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[1.5rem] p-4 text-center [backface-visibility:hidden] sm:rounded-[2rem]">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange text-white sm:h-16 sm:w-16">
            <Icon size={26} />
          </span>
          <span className="font-display text-lg font-bold sm:text-xl">{fact.front}</span>
          <span className="text-[10px] uppercase tracking-widest text-fg/40">flip</span>
        </span>
        {/* back */}
        <span
          className="absolute inset-0 flex items-center justify-center rounded-[1.5rem] p-4 text-center text-sm font-semibold leading-snug text-white [backface-visibility:hidden] [transform:rotateY(180deg)] sm:rounded-[2rem] sm:p-6 sm:text-lg"
          style={{ background: "linear-gradient(135deg, rgb(var(--c1)), rgb(var(--c2)) 55%, rgb(var(--c3)))" }}
        >
          {fact.back}
        </span>
      </span>
    </button>
  );
}
