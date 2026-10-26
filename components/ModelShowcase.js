"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Atom, Box, ChevronLeft, ChevronRight, Cuboid, Gem, Grid3x3, Hand, Maximize2, Minimize2, Orbit, Pause, Play, RefreshCcw, Shapes, X } from "lucide-react";
import { useSiteData } from "@/components/SiteDataProvider";

// three.js + loaders only download when the section is about to scroll into view
const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

// `icon` in a model entry must be one of these lucide names
export const modelIcons = { Atom, Box, Cuboid, Gem, Orbit, Shapes };

export const fmtOf = (m) => (m.format ? m.format : m.file ? m.file.split("?")[0].split(".").pop() : "live").toUpperCase();

const TILE_GRADIENTS = ["from-brand-violet to-brand-pink", "from-brand-pink to-brand-orange", "from-brand-orange to-brand-violet"];

function IconBtn({ label, onClick, active, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={`glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:scale-105 sm:h-10 sm:w-10 ${
        active ? "!border-brand-pink/70 text-brand-pink" : "text-fg/80"
      }`}
    >
      {children}
    </button>
  );
}

export default function ModelShowcase() {
  const { models = [], copy } = useSiteData();
  const c = copy.models;

  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const [wire, setWire] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [engaged, setEngaged] = useState(false); // phone: user chose to take over touch
  const [coarse, setCoarse] = useState(false);
  const [zoomOn, setZoomOn] = useState(false); // desktop: wheel-zoom only after the stage is clicked
  const [resetKey, setResetKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [supported, setSupported] = useState(true);

  const rootRef = useRef(null);
  const model = models[idx] || models[0];
  const count = models.length;

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    try {
      const cv = document.createElement("canvas");
      setSupported(!!(cv.getContext("webgl2") || cv.getContext("webgl")));
    } catch {
      setSupported(false);
    }
  }, []);

  // load when near the viewport, pause rendering when off-screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: "300px" });
    const vis = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    near.observe(el);
    vis.observe(el);
    return () => {
      near.disconnect();
      vis.disconnect();
    };
  }, []);

  // expanded mode: lock page scroll, Esc closes. The stage keeps its slot in the page (see `slot` below),
  // so nothing around it jumps when it goes fullscreen and back.
  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setExpanded(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const go = useCallback(
    (d) => {
      setIdx((i) => (i + d + count) % count);
      setResetKey((k) => k + 1);
    },
    [count]
  );

  const toggleExpanded = () => {
    setExpanded((e) => !e);
    setResetKey((k) => k + 1); // re-frame after the size change
  };

  if (!model) return null;

  const interactive = !coarse || engaged || expanded;
  const Icon = modelIcons[model.icon] || Box;

  return (
    <div ref={rootRef} className="relative mx-auto mt-8 w-full max-w-6xl px-4 sm:px-5 md:mt-14">
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
        {/* ------------------------------ stage ------------------------------ */}
        {/* `slot` always keeps its height; the stage inside either fills it or covers the screen */}
        <div className="slot relative h-[clamp(320px,98vw,460px)] animate-pop sm:h-[480px] lg:h-[580px]">
          <div
            className={expanded ? "fixed inset-0 z-[70] h-[100dvh] p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-[max(0.625rem,env(safe-area-inset-top))] sm:p-6" : "absolute inset-0"}
            style={expanded ? { background: "var(--page-bg)" } : undefined}
          >
            <div
              className="glass relative h-full w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2.25rem]"
              onPointerDown={() => setZoomOn(true)}
              onPointerLeave={() => !coarse && setZoomOn(false)}
            >
              {/* studio backdrop */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-10 top-0 h-48 w-48 rounded-full bg-brand-violet/25 blur-3xl sm:h-64 sm:w-64" />
                <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-brand-orange/20 blur-3xl sm:h-64 sm:w-64" />
                <div
                  className="absolute inset-0 opacity-[0.35]"
                  style={{
                    backgroundImage: "radial-gradient(rgb(var(--fg) / 0.25) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                  }}
                />
              </div>

              {supported && mounted ? (
                <ModelViewer
                  model={model}
                  active={visible || expanded}
                  interactive={interactive}
                  zoom={interactive && (zoomOn || coarse || expanded)}
                  auto={auto}
                  wireframe={wire}
                  resetKey={resetKey}
                  loadingLabel={c.loading}
                  failTitle={c.failed}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="h-40 w-40 animate-float rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange opacity-70 blur-[2px] sm:h-48 sm:w-48" />
                </div>
              )}

              {/* top-left: what am I looking at */}
              <div className="pointer-events-none absolute left-2.5 top-2.5 flex max-w-[34%] items-center gap-2 sm:left-5 sm:top-5 sm:max-w-[60%]">
                <span className="glass rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider text-fg/80 sm:px-3 sm:text-xs">{fmtOf(model)}</span>
                <span className="glass hidden truncate rounded-full px-3 py-1 text-xs text-fg/70 sm:inline-block">{model.title}</span>
              </div>

              {/* top-right: controls (a row on phones, a column on larger screens) */}
              <div className="absolute right-2.5 top-2.5 flex gap-1.5 sm:right-5 sm:top-5 sm:flex-col sm:gap-2">
                <IconBtn label={c.controls.wire} active={wire} onClick={() => setWire((w) => !w)}>
                  <Grid3x3 size={16} />
                </IconBtn>
                <IconBtn label={c.controls.reset} onClick={() => setResetKey((k) => k + 1)}>
                  <RefreshCcw size={15} />
                </IconBtn>
                <IconBtn label={auto ? c.controls.pause : c.controls.play} active={auto} onClick={() => setAuto((a) => !a)}>
                  {auto ? <Pause size={16} /> : <Play size={16} />}
                </IconBtn>
                <IconBtn label={expanded ? c.controls.collapse : c.controls.expand} onClick={toggleExpanded}>
                  {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </IconBtn>
              </div>

              {/* fullscreen: switch models without leaving */}
              {expanded && (
                <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-3 sm:bottom-5">
                  <IconBtn label={c.controls.prev} onClick={() => go(-1)}>
                    <ChevronLeft size={18} />
                  </IconBtn>
                  <span className="glass max-w-[55%] truncate rounded-full px-4 py-2 text-xs font-semibold sm:text-sm">{model.title}</span>
                  <IconBtn label={c.controls.next} onClick={() => go(1)}>
                    <ChevronRight size={18} />
                  </IconBtn>
                </div>
              )}

              {/* phone: swipes scroll the page until the user opts in */}
              {!expanded && coarse && supported && (
                <button
                  type="button"
                  onClick={() => setEngaged((e) => !e)}
                  className="glass absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                >
                  {engaged ? <X size={15} /> : <Hand size={15} className="text-brand-pink" />} {engaged ? c.done : c.tapToInteract}
                </button>
              )}
              {!expanded && !coarse && (
                <p className="pointer-events-none absolute bottom-4 left-1/2 max-w-[90%] -translate-x-1/2 truncate rounded-full bg-black/30 px-3 py-1 text-xs text-white/90 backdrop-blur-md">
                  {c.hint}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ----------------------------- info + list ----------------------------- */}
        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
          {/* picker: swipe row on phones (right under the stage), tiles on desktop */}
          <div
            role="tablist"
            aria-label={c.listLabel}
            className="snap-row -mx-4 order-1 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 sm:-mx-5 sm:px-5 lg:order-2 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-3 lg:overflow-visible lg:px-0"
          >
            {models.map((m, i) => {
              const I = modelIcons[m.icon] || Box;
              const on = i === idx;
              return (
                <button
                  key={m.slug}
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setIdx(i);
                    setResetKey((k) => k + 1);
                  }}
                  className={`glass-hover card-flat group flex w-[9.5rem] shrink-0 snap-start items-center gap-2.5 rounded-2xl border p-2.5 text-left sm:w-[10.5rem] sm:gap-3 sm:p-3 lg:w-auto ${
                    on ? "!border-brand-pink/70" : ""
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white transition sm:h-10 sm:w-10 ${
                      TILE_GRADIENTS[i % 3]
                    } ${on ? "scale-100" : "scale-90 opacity-70 group-hover:opacity-100"}`}
                  >
                    <I size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold sm:text-sm">{m.title}</span>
                    <span className="block text-[11px] text-fg/50">{fmtOf(m)}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div key={model.slug} className="glass order-2 animate-pop rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-7 lg:order-1">
            <div className="flex items-center justify-between">
              <span className="text-xs tabular-nums text-fg/50">
                {String(idx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                <IconBtn label={c.controls.prev} onClick={() => go(-1)}>
                  <ChevronLeft size={18} />
                </IconBtn>
                <IconBtn label={c.controls.next} onClick={() => go(1)}>
                  <ChevronRight size={18} />
                </IconBtn>
              </div>
            </div>

            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-pink sm:mt-4 sm:text-xs sm:tracking-[0.25em]">
              {model.category} · {model.year}
            </p>
            <h3 className="mt-1 font-display text-xl font-bold sm:text-3xl">{model.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg/65 sm:mt-3">{model.description}</p>

            <dl className="mt-4 grid grid-cols-2 gap-2.5 text-xs sm:mt-5 sm:gap-3">
              {model.polys && (
                <div className="card-flat rounded-2xl p-3">
                  <dt className="text-fg/50">{c.specs.polys}</dt>
                  <dd className="mt-0.5 font-semibold">{model.polys}</dd>
                </div>
              )}
              <div className="card-flat rounded-2xl p-3">
                <dt className="text-fg/50">{c.specs.format}</dt>
                <dd className="mt-0.5 font-semibold">{fmtOf(model)}</dd>
              </div>
            </dl>

            {model.tools?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {model.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-fg/15 bg-fg/5 px-3 py-1 text-[11px] text-fg/70">
                    {tool}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href={`/work#${model.slug}`} className="text-sm font-semibold text-brand-pink hover:underline">
                {c.openInWork} →
              </Link>
              {model.project && (
                <Link href={`/work#${model.project}`} className="text-sm font-semibold text-fg/70 hover:underline">
                  {c.caseStudy} →
                </Link>
              )}
            </div>
          </div>

          <Link href={c.cta.href} className="btn-gradient order-3 w-full lg:self-start">
            <Icon size={17} /> {c.cta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
