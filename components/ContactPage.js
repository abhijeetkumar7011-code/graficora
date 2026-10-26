"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Copy,
  Dribbble,
  Hexagon,
  Share2,
  Printer,
  LayoutTemplate,
  Box,
  Clapperboard,
  Orbit,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import Marquee from "@/components/Marquee";
import AccentTitle from "@/components/AccentTitle";
import { useSiteData, useFill } from "@/components/SiteDataProvider";

const icons = { Hexagon, Share2, Printer, LayoutTemplate, Box, Clapperboard, Orbit };

const STEPS = ["Services", "Budget", "About you", "Send"];

const field =
  "w-full rounded-2xl border border-fg/10 bg-fg/5 px-5 py-3.5 text-sm text-fg placeholder-fg/40 outline-none backdrop-blur-md transition focus:border-brand-pink/60 focus:bg-fg/10";

/* ------------------------------------------------------------ small pieces */

function useLiveClock(timeZone, openHour, closeHour) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  const time = now.toLocaleTimeString("en-IN", { timeZone, hour: "2-digit", minute: "2-digit", hour12: true });
  const hour = Number(now.toLocaleString("en-GB", { timeZone, hour: "2-digit", hour12: false })) % 24;
  return { time, online: hour >= openHour && hour < closeHour };
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-300 active:scale-95 ${
        active
          ? "border-transparent bg-gradient-to-r from-brand-violet via-brand-pink to-brand-orange text-white shadow-[0_0_24px_rgb(var(--c2)/0.4)]"
          : "border-fg/15 bg-fg/5 text-fg/80 hover:bg-fg/10"
      }`}
    >
      {children}
    </button>
  );
}

function CopyButton({ text, label = "Copy", className = "" }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement("textarea");
      t.value = text;
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand("copy");
      } catch {}
      t.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };
  return (
    <button type="button" onClick={copy} className={className}>
      {done ? <Check size={16} /> : <Copy size={16} />} {done ? "Copied!" : label}
    </button>
  );
}

/* ------------------------------------------------------------ brief builder */

function BriefBuilder() {
  const { site, services, budgets, timelines } = useSiteData();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState([]);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const topRef = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggle = (t) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const valid = [
    picked.length > 0,
    Boolean(budget && timeline),
    Boolean(form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.message.trim().length > 3),
    true,
  ];

  const brief = useMemo(
    () =>
      [
        `Hi ${site.name}! I'm ${form.name || "…"}.`,
        "",
        `I need: ${picked.join(", ") || "—"}`,
        `Budget: ${budget || "—"}`,
        `Timeline: ${timeline || "—"}`,
        "",
        form.message,
        "",
        `Reply to: ${form.email || "—"}`,
      ].join("\n"),
    [picked, budget, timeline, form]
  );

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`Project enquiry from ${form.name}`)}&body=${encodeURIComponent(brief)}`;
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(brief)}`;

  const go = (n) => {
    setStep(n);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const pct = (step / (STEPS.length - 1)) * 100;

  return (
    <div ref={topRef} id="brief" className="glass relative scroll-mt-28 overflow-hidden rounded-[2rem] p-5 sm:rounded-[2.5rem] sm:p-10 md:p-12">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-blob rounded-full bg-brand-pink/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 animate-blob rounded-full bg-brand-violet/25 blur-3xl [animation-delay:4s]" />

      {/* progress */}
      <div className="relative">
        <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-fg/50">
          <span>
            Step {step + 1} / {STEPS.length}
          </span>
          <span className="gradient-text">{STEPS[step]}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-fg/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-violet via-brand-pink to-brand-orange transition-all duration-700 ease-out"
            style={{ width: `${Math.max(8, pct)}%` }}
          />
        </div>
      </div>

      {/* steps */}
      <div key={step} className="relative mt-7 min-h-[300px] animate-pop sm:mt-10">
        {step === 0 && (
          <div>
            <h3 className="font-display text-2xl font-bold sm:text-4xl">
              What do you <span className="gradient-text">need</span>?
            </h3>
            <p className="mt-2 text-sm text-fg/60">Pick one or more.</p>
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {services.map((s) => {
                const Icon = icons[s.icon] || Hexagon;
                const on = picked.includes(s.title);
                return (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => toggle(s.title)}
                    aria-pressed={on}
                    className={`group relative flex flex-col items-start gap-3 rounded-2xl border p-3.5 text-left transition duration-300 active:scale-95 sm:rounded-3xl sm:p-5 ${
                      on ? "border-brand-pink/70 bg-brand-pink/10 shadow-[0_0_30px_rgb(var(--c2)/0.25)]" : "border-fg/10 bg-fg/5 hover:-translate-y-1 hover:bg-fg/10"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-white transition duration-300 sm:h-12 sm:w-12 sm:rounded-2xl ${
                        on ? "scale-110 bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange" : "bg-fg/20"
                      }`}
                    >
                      <Icon size={20} />
                    </span>
                    <span className="text-[13px] font-semibold leading-snug sm:text-sm">{s.title}</span>
                    {on && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-brand-violet to-brand-orange text-white">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h3 className="font-display text-2xl font-bold sm:text-4xl">
                Budget <span className="gradient-text">range</span>
              </h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {budgets.map((b) => (
                  <Chip key={b} active={budget === b} onClick={() => setBudget(b)}>
                    {b}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold sm:text-4xl">
                When do you <span className="gradient-text">need it</span>?
              </h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {timelines.map((t) => (
                  <Chip key={t} active={timeline === t} onClick={() => setTimeline(t)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-display text-2xl font-bold sm:text-4xl">
              Tell me about <span className="gradient-text">you</span>
            </h3>
            <div className="mt-6 space-y-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <input className={field} name="name" placeholder="Your name" value={form.name} onChange={onChange} autoComplete="name" />
                <input className={field} type="email" name="email" placeholder="Your email" value={form.email} onChange={onChange} autoComplete="email" />
              </div>
              <textarea className={`${field} min-h-[130px] resize-none sm:min-h-[160px]`} name="message" placeholder="What's the idea? Any links, references or deadlines..." value={form.message} onChange={onChange} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-display text-2xl font-bold sm:text-4xl">
              Looks <span className="gradient-text">great</span>. Send it!
            </h3>

            {/* receipt-style summary */}
            <div className="mt-6 rounded-2xl border border-dashed border-fg/25 bg-fg/5 p-4 sm:rounded-3xl sm:p-6">
              <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-fg/45">From</dt>
                  <dd className="mt-0.5 font-medium">
                    {form.name} · <span className="text-fg/70">{form.email}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-fg/45">Budget · Timeline</dt>
                  <dd className="mt-0.5 font-medium">
                    {budget} · {timeline}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-fg/45">Needs</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {picked.map((p) => (
                      <span key={p} className="rounded-full bg-gradient-to-r from-brand-violet via-brand-pink to-brand-orange px-3 py-1 text-xs font-semibold text-white">
                        {p}
                      </span>
                    ))}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-fg/45">Message</dt>
                  <dd className="mt-0.5 whitespace-pre-wrap text-fg/80">{form.message}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <a href={mailto} className="btn-gradient !py-3.5">
                <Send size={16} /> Send by email
              </a>
              <a href={wa} target="_blank" rel="noreferrer" className="btn-ghost !py-3.5">
                <MessageCircle size={16} /> WhatsApp
              </a>
              <CopyButton text={brief} label="Copy brief" className="btn-ghost !py-3.5" />
            </div>
            <p className="mt-3 text-xs text-fg/45">Your email app or WhatsApp opens with everything pre-filled. Nothing is stored on this site.</p>
          </div>
        )}
      </div>

      {/* nav */}
      <div className="relative mt-6 flex items-center justify-between gap-3 sm:mt-8">
        <button
          type="button"
          onClick={() => go(step - 1)}
          disabled={step === 0}
          className="btn-ghost !px-5 !py-2.5 disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowLeft size={16} /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => valid[step] && go(step + 1)}
            disabled={!valid[step]}
            className="btn-gradient !px-6 !py-2.5 disabled:pointer-events-none disabled:opacity-40 sm:!px-8 sm:!py-3"
          >
            {step === STEPS.length - 2 ? "Review" : "Next"} <ArrowRight size={16} />
          </button>
        ) : (
          <button type="button" onClick={() => { setStep(0); setPicked([]); setBudget(""); setTimeline(""); setForm({ name: "", email: "", message: "" }); }} className="text-xs font-semibold uppercase tracking-[0.2em] text-fg/50 transition hover:text-fg">
            Start over
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ page */

export default function ContactPage() {
  const { site, contactWords, nextSteps, faqs, copy } = useSiteData();
  const c = copy.contactPage;
  const fillT = useFill();
  const ringId = useId().replace(/:/g, "");
  const heroRef = useRef(null);
  const clock = useLiveClock(c.timezone, c.openHour, c.closeHour);
  const [wordIdx, setWordIdx] = useState(0);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setWordIdx((i) => (i + 1) % contactWords.length), 2200);
    return () => clearInterval(id);
  }, []);

  const onHeroMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const channelIcons = { whatsapp: MessageCircle, instagram: Instagram, behance: Palette, dribbble: Dribbble, linkedin: Linkedin };
  const channels = c.channels.map((ch) => ({
    ...ch,
    Icon: channelIcons[ch.key] || Sparkles,
    href: ch.key === "whatsapp" ? `https://wa.me/${site.whatsapp}` : site.socials[ch.key],
  }));

  return (
    <main className="relative overflow-x-clip">
      {/* ============================ HERO ============================ */}
      <section ref={heroRef} onPointerMove={onHeroMove} className="relative overflow-hidden" style={{ "--mx": "30%", "--my": "40%" }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), rgb(var(--c2) / 0.2), transparent 65%)" }}
        />
        <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 animate-blob rounded-full bg-brand-pink/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 animate-blob rounded-full bg-brand-violet/25 blur-3xl [animation-delay:4s]" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-14 pt-28 sm:pt-32 lg:min-h-[88vh] lg:grid-cols-[1.3fr_1fr] lg:pb-20 lg:pt-36">
          <div className="relative z-10">
            <div data-aos="fade-up" className="glass mb-5 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full px-4 py-2 text-xs text-fg/80 sm:mb-8">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${clock?.online === false ? "bg-amber-400" : "bg-emerald-400"}`} />
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${clock?.online === false ? "bg-amber-500" : "bg-emerald-500"}`} />
                </span>
                {clock?.online === false ? c.offline : c.online}
              </span>
              {clock && (
                <span className="inline-flex items-center gap-1.5 text-fg/55">
                  <Clock3 size={13} /> {clock.time} {c.timezoneLabel}
                </span>
              )}
            </div>

            <h1 className="font-display text-[3rem] font-extrabold leading-[0.98] tracking-tight sm:text-7xl xl:text-8xl">
              <span data-aos="fade-up" className="block">
                {c.heroLead}
              </span>
              <span className="relative block h-[1.05em] overflow-hidden">
                <span key={wordIdx} className="gradient-text absolute left-0 top-0 block animate-pop whitespace-nowrap">
                  {contactWords[wordIdx]}
                </span>
              </span>
              <span data-aos="fade-up" data-aos-delay="150" className="block text-outline">
                {c.heroTail}
              </span>
            </h1>

            <p data-aos="fade-up" data-aos-delay="250" className="mt-5 max-w-md text-sm text-fg/70 sm:mt-8 sm:text-lg">
              {c.heroText}
            </p>

            <div data-aos="fade-up" data-aos-delay="350" className="mt-6 flex flex-wrap items-center gap-3 sm:mt-9">
              <a href="#brief" className="btn-gradient !px-6 !py-2.5 sm:!px-7 sm:!py-3">
                {c.start} <ArrowDown size={16} />
              </a>
              <a href={`mailto:${site.email}`} className="btn-ghost !px-6 !py-2.5 sm:!px-7 sm:!py-3">
                <Mail size={16} /> {site.email}
              </a>
            </div>
          </div>

          {/* rotating "say hello" button */}
          <div className="relative mx-auto aspect-square w-[240px] sm:w-[340px]" data-aos="zoom-in" data-aos-delay="200">
            <div className="absolute inset-0 animate-spin-slower">
              <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-brand-orange shadow-[0_0_24px_rgb(var(--c3)/0.9)]" />
            </div>
            <div className="absolute inset-[6%] animate-spin-slow [animation-direction:reverse]">
              <span className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-brand-violet shadow-[0_0_20px_rgb(var(--c1)/0.9)]" />
            </div>
            <div className="absolute inset-[3%] rounded-full border border-dashed border-fg/20" />

            <svg viewBox="0 0 200 200" className="absolute inset-[10%] h-[80%] w-[80%] animate-spin-slow text-fg/75">
              <defs>
                <path id={ringId} d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
              </defs>
              <text fontSize="11.5" fontWeight="700" fill="currentColor" letterSpacing="2">
                <textPath href={`#${ringId}`} textLength="510" lengthAdjust="spacing">
                  {c.ring}
                </textPath>
              </text>
            </svg>

            <a
              href="#brief"
              aria-label={c.start}
              className="group absolute inset-[30%] flex items-center justify-center rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange text-white shadow-[0_0_70px_rgb(var(--c2)/0.55)] transition duration-500 hover:scale-110"
            >
              <ArrowDown className="transition duration-500 group-hover:translate-y-1" size={44} strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </section>

      {/* ============================ BRIEF ============================ */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-16 sm:pb-28">
        <div data-aos="fade-up" className="mb-6 sm:mb-10">
          <p className="eyebrow">{c.briefEyebrow}</p>
          <h2 className="font-display text-3xl font-bold sm:text-5xl md:text-6xl">
            <AccentTitle t={c.briefTitle} />
          </h2>
        </div>
        <div data-aos="fade-up">
          <BriefBuilder />
        </div>
      </section>

      {/* ============================ CHANNELS ============================ */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:pb-28">
        <div data-aos="fade-up">
          <p className="eyebrow">{c.chatEyebrow}</p>
          <h2 className="font-display text-3xl font-bold sm:text-5xl md:text-6xl">
            <AccentTitle t={c.chatTitle} />
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
          {/* email tile: click to copy */}
          <div data-aos="fade-up" className="glass relative col-span-2 flex flex-col justify-between gap-6 overflow-hidden rounded-[1.75rem] p-5 sm:rounded-[2.25rem] sm:p-8 lg:row-span-2">
            <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange opacity-30 blur-2xl" />
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange text-white sm:h-14 sm:w-14">
                <Mail size={24} />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-fg/50">Email</p>
              <a href={`mailto:${site.email}`} className="mt-1 block break-all font-display text-2xl font-bold transition hover:text-brand-pink sm:text-3xl">
                {site.email}
              </a>
              <p className="mt-2 flex items-center gap-2 text-sm text-fg/60">
                <MapPin size={15} className="text-brand-pink" /> {site.location}
              </p>
            </div>
            <CopyButton text={site.email} label="Copy email" className="btn-ghost relative w-fit !py-2.5" />
          </div>

          {channels.map(({ label, sub, href, Icon }, i) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              data-aos="fade-up"
              data-aos-delay={(i + 1) * 80}
              className="glass group relative flex flex-col justify-between gap-6 overflow-hidden rounded-[1.5rem] p-4 transition duration-300 hover:-translate-y-1.5 hover:bg-fg/10 sm:rounded-[2rem] sm:p-6"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-fg/10 transition duration-300 group-hover:bg-gradient-to-br group-hover:from-brand-violet group-hover:via-brand-pink group-hover:to-brand-orange group-hover:text-white sm:h-12 sm:w-12 sm:rounded-2xl">
                  <Icon size={20} />
                </span>
                <ArrowUpRight size={18} className="text-fg/40 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand-pink" />
              </div>
              <div>
                <div className="font-display text-lg font-bold sm:text-xl">{label}</div>
                <div className="text-xs text-fg/55 sm:text-sm">{sub}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ============================ NEXT STEPS ============================ */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:pb-28">
        <div data-aos="fade-up">
          <p className="eyebrow">{c.nextEyebrow}</p>
          <h2 className="font-display text-3xl font-bold sm:text-5xl md:text-6xl">
            <AccentTitle t={c.nextTitle} />
          </h2>
        </div>
        <div className="relative mt-8 grid gap-3 sm:mt-12 sm:gap-5 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-[44px] hidden h-px bg-gradient-to-r from-brand-violet via-brand-pink to-brand-orange md:block" />
          {nextSteps.map((s, i) => (
            <div key={s.n} data-aos="fade-up" data-aos-delay={i * 120} className="glass glass-hover relative rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-8">
              <div className="font-display text-5xl font-extrabold text-outline sm:text-6xl">{s.n}</div>
              <h3 className="mt-3 font-display text-lg font-bold sm:text-xl">{s.title}</h3>
              <p className="mt-1.5 text-sm text-fg/65">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ FAQ ============================ */}
      <section className="mx-auto w-full max-w-3xl px-5 pb-16 sm:pb-28">
        <div data-aos="fade-up" className="mb-6 sm:mb-10">
          <p className="eyebrow">{c.faqEyebrow}</p>
          <h2 className="font-display text-3xl font-bold sm:text-5xl md:text-6xl">
            <AccentTitle t={c.faqTitle} />
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} data-aos="fade-up" data-aos-delay={i * 60} className="glass overflow-hidden rounded-2xl sm:rounded-3xl">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-7 sm:py-5"
                >
                  <span className="font-display text-base font-semibold sm:text-lg">{f.q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition duration-300 ${
                      isOpen ? "rotate-45 bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange text-white" : "bg-fg/10"
                    }`}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-fg/70 sm:px-7 sm:pb-6 sm:text-base">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================ MARQUEE + FOOTER ============================ */}
      <div className="-rotate-2 scale-105 pb-10 sm:pb-16" aria-hidden="true">
        <Marquee speed={40} fade={false} gapPx={48}>
          {c.marquee.map((w, i) => (
            <span key={w} className="flex items-center gap-8 font-display text-5xl font-extrabold leading-none sm:gap-12 sm:text-7xl md:text-8xl">
              <span className={i % 2 ? "text-outline" : "gradient-text"}>{w}</span>
              <Sparkles className="shrink-0 text-brand-orange" size={40} />
            </span>
          ))}
        </Marquee>
      </div>

      <footer className="px-5 pb-10 text-center text-xs text-fg/40">
        {fillT(copy.footer)}
      </footer>
    </main>
  );
}
