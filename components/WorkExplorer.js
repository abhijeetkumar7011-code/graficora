"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Hand, ArrowUpRight, MoveHorizontal, MoveDiagonal2, MoveVertical, Move } from "lucide-react";
import dynamic from "next/dynamic";
import ProjectArt from "@/components/ProjectArt";
import ModelCover from "@/components/ModelCover";
import { fmtOf } from "@/components/ModelShowcase";
import { useSiteData, useFill } from "@/components/SiteDataProvider";

// the live 3D viewer only loads when a 3D project is opened
const ModelPreview = dynamic(() => import("@/components/ModelPreview"), { ssr: false });

/* ---------------------------------------------------------------------------
   Free-direction project explorer.
   - The page never scrolls. Wheel / touch-drag / mouse-drag / arrow keys pan an infinite
     (wrap-around) plane of project cards in ANY direction.
   - The plane is tilted in 3D and re-tilts with velocity.
   - Everything per-frame is written straight to the DOM (no React re-renders while moving).
--------------------------------------------------------------------------- */

// Two layouts: full-size cards on desktop, compact cards (more of the wall per screen) on phones.
const makeLayout = (COLS, ROWS, CW, CH, CARD_W, CARD_H) => ({ COLS, ROWS, CW, CH, CARD_W, CARD_H, W: COLS * CW, H: ROWS * CH });
const LAYOUTS = {
  desktop: makeLayout(7, 5, 380, 330, 330, 312),
  mobile: makeLayout(6, 6, 244, 226, 208, 200),
};

// maps a position into [-size/2, size/2) so the plane repeats forever
const wrap = (v, size) => ((((v + size / 2) % size) + size) % size) - size / 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const MODES = [
  { id: "diag", label: "Diagonal", Icon: MoveDiagonal2 },
  { id: "side", label: "Sideways", Icon: MoveHorizontal },
  { id: "vert", label: "Vertical", Icon: MoveVertical },
  { id: "free", label: "Free", Icon: Move },
];

export default function WorkExplorer() {
  const { projects: baseProjects, models = [], categories, copy } = useSiteData();
  // 3D models are projects too: they sit in the same wall (category "3D") and open in a live viewer
  const projects = useMemo(
    () => [...baseProjects, ...models.map((m) => ({ ...m, kind: "model", model: m, category: "3D", subtitle: m.category, tools: m.tools || [] }))],
    [baseProjects, models]
  );
  const ex = copy.explorer;
  const t = useFill();
  const [ready, setReady] = useState(false);
  const [cat, setCat] = useState("All");
  const [mode, setMode] = useState("diag");
  const [selected, setSelected] = useState(null); // slug
  const [dragging, setDragging] = useState(false);
  const [compact, setCompact] = useState(false);
  const layout = compact ? LAYOUTS.mobile : LAYOUTS.desktop;

  const modeRef = useRef(mode);
  const selectedRef = useRef(selected);
  modeRef.current = mode;
  selectedRef.current = selected;

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const bgTextRef = useRef(null);
  const cellRefs = useRef([]);

  const cells = useMemo(() => {
    const { COLS, ROWS, CW, CH, W, H } = layout;
    const out = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      out.push({
        key: i,
        project: projects[(row * 5 + col) % projects.length],
        bx: col * CW - W / 2 + CW / 2,
        by: row * CH - H / 2 + CH / 2 + (col % 2 ? CH * 0.32 : 0),
      });
    }
    return out;
  }, [layout, projects]);

  const open = useCallback((slug) => {
    setSelected(slug);
    try {
      history.replaceState(null, "", `#${slug}`);
    } catch {}
  }, []);

  const close = useCallback(() => {
    setSelected(null);
    try {
      history.replaceState(null, "", window.location.pathname);
    } catch {}
  }, []);

  const step = useCallback(
    (dir) => {
      const i = projects.findIndex((p) => p.slug === selectedRef.current);
      if (i < 0) return;
      open(projects[(i + dir + projects.length) % projects.length].slug);
    },
    [open, projects]
  );

  // lock page scroll while this view is mounted + deep link (#slug)
  useEffect(() => {
    document.documentElement.classList.add("no-scroll");
    const h = decodeURIComponent(window.location.hash.slice(1));
    if (projects.some((p) => p.slug === h)) setSelected(h);
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    setReady(true);
    return () => {
      mq.removeEventListener("change", apply);
      document.documentElement.classList.remove("no-scroll");
    };
  }, []);

  // ------------------------- motion engine -------------------------
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const { W, H } = layout;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 }; // inertia after a drag
    const sv = { x: 0, y: 0 }; // smoothed per-frame velocity (drives tilt)
    const drag = { active: false, id: null, lx: 0, ly: 0, moved: 0, slug: null };
    let lastInput = performance.now();
    let raf = 0;
    let last = performance.now();

    const touch = () => (lastInput = performance.now());

    const onWheel = (e) => {
      if (selectedRef.current) return;
      e.preventDefault();
      touch();
      const k = e.deltaMode === 1 ? 16 : 1;
      const dx = e.deltaX * k;
      const dy = e.deltaY * k;
      const d = (Math.abs(dy) >= Math.abs(dx) ? dy : dx) * 1.1;
      switch (modeRef.current) {
        case "side":
          target.x -= d;
          break;
        case "vert":
          target.y -= d;
          break;
        case "free":
          target.x -= dx;
          target.y -= dy;
          break;
        default: // diagonal
          target.x -= d * 0.87;
          target.y -= d * 0.5;
      }
    };

    const onDown = (e) => {
      if (selectedRef.current || (e.pointerType === "mouse" && e.button !== 0)) return;
      drag.active = true;
      drag.id = e.pointerId;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      drag.moved = 0;
      drag.slug = e.target.closest?.("[data-slug]")?.getAttribute("data-slug") || null;
      vel.x = vel.y = 0;
      touch();
      setDragging(true);
      try {
        root.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onMove = (e) => {
      if (!drag.active || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.lx;
      const dy = e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      target.x += dx * 1.25;
      target.y += dy * 1.25;
      vel.x = dx * 0.9;
      vel.y = dy * 0.9;
      touch();
    };

    const onUp = (e) => {
      if (!drag.active || e.pointerId !== drag.id) return;
      drag.active = false;
      setDragging(false);
      try {
        root.releasePointerCapture(e.pointerId);
      } catch {}
      // a tap (not a drag) on a card opens it
      if (drag.moved < 8 && drag.slug) {
        vel.x = vel.y = 0;
        open(drag.slug);
      }
    };

    const onKey = (e) => {
      if (selectedRef.current) {
        if (e.key === "Escape") close();
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
        return;
      }
      const s = 300;
      const map = { ArrowLeft: [s, 0], ArrowRight: [-s, 0], ArrowUp: [0, s], ArrowDown: [0, -s] };
      const m = map[e.key];
      if (m) {
        e.preventDefault();
        target.x += m[0];
        target.y += m[1];
        touch();
      }
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);
    window.addEventListener("keydown", onKey);

    const tick = (now) => {
      const dt = Math.min(48, now - last) / 16.67;
      last = now;

      if (!drag.active) {
        // inertia after release
        target.x += vel.x * dt;
        target.y += vel.y * dt;
        vel.x *= Math.pow(0.94, dt);
        vel.y *= Math.pow(0.94, dt);
        // gentle idle drift so the wall feels alive
        if (!reduced && !selectedRef.current && now - lastInput > 3000) {
          target.x -= 0.45 * dt;
          target.y -= 0.22 * dt;
        }
      }

      const px = pos.x;
      const py = pos.y;
      pos.x += (target.x - pos.x) * Math.min(1, 0.1 * dt);
      pos.y += (target.y - pos.y) * Math.min(1, 0.1 * dt);
      sv.x += ((pos.x - px) / dt - sv.x) * 0.12;
      sv.y += ((pos.y - py) / dt - sv.y) * 0.12;

      // dynamic 3D tilt: leans into the direction of travel
      const speed = Math.hypot(sv.x, sv.y);
      const amt = reduced ? 0.25 : 1;
      const rx = 24 + clamp(speed * 0.45, 0, 12) * amt;
      const ry = clamp(sv.x * -0.35, -16, 16) * amt;
      const rz = -12 + clamp(sv.y * 0.22, -8, 8) * amt;
      stage.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;

      const cs = cellRefs.current;
      for (let i = 0; i < cs.length; i++) {
        const el = cs[i];
        const c = cells[i];
        if (!el || !c) continue; // refs can briefly outnumber cells while the layout switches
        const x = wrap(c.bx + pos.x, W);
        const y = wrap(c.by + pos.y, H);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        // fade out near the wrap seam so cards never visibly "pop"
        const e = Math.max(Math.abs(x) / (W / 2), Math.abs(y) / (H / 2));
        const o = e < 0.8 ? 1 : Math.max(0, 1 - (e - 0.8) / 0.2);
        el.style.opacity = o.toFixed(2);
        el.style.visibility = o <= 0.01 ? "hidden" : "visible";
      }

      if (bgTextRef.current) {
        bgTextRef.current.style.transform = `translate3d(${(pos.x * 0.05).toFixed(1)}px, ${(pos.y * 0.05).toFixed(1)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, [cells, layout, open, close, step]);

  const current = projects.find((p) => p.slug === selected) || null;

  return (
    <>
      <div
        ref={rootRef}
        aria-label="Project explorer. Drag, scroll or use arrow keys to move in any direction."
        className={`fixed inset-0 touch-none select-none overflow-hidden ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {/* giant outlined word that drifts slowly behind the wall */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div ref={bgTextRef} className="font-display text-[22vw] font-extrabold leading-none text-outline opacity-40">
            WORK
          </div>
        </div>

        <div
          className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          style={{ perspective: "1500px", perspectiveOrigin: "50% 42%" }}
        >
          <div
            ref={stageRef}
            className="absolute left-1/2 top-1/2 h-0 w-0"
            style={{ transformStyle: "preserve-3d", transform: "rotateX(24deg) rotateZ(-12deg)" }}
          >
            {cells.map((c, i) => {
              const p = c.project;
              const dim = cat !== "All" && p.category !== cat;
              return (
                <div
                  key={c.key}
                  ref={(el) => (cellRefs.current[i] = el)}
                  className="absolute will-change-transform"
                  style={{ width: layout.CARD_W, height: layout.CARD_H, left: -layout.CARD_W / 2, top: -layout.CARD_H / 2, transformStyle: "preserve-3d" }}
                >
                  <button
                    type="button"
                    data-slug={p.slug}
                    aria-label={`${p.title} — ${p.category}`}
                    onClick={(e) => {
                      if (e.detail === 0) open(p.slug); // keyboard activation
                    }}
                    className={`card-flat group block h-full w-full overflow-hidden ${compact ? "rounded-2xl" : "rounded-3xl"} text-left transition duration-500 hover:[transform:translateZ(80px)_scale(1.06)] ${
                      dim ? "pointer-events-none opacity-[0.12] saturate-0" : ""
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {p.kind === "model" ? (
                        <ModelCover model={p.model} index={i} className="absolute inset-0 h-full w-full" />
                      ) : (
                        <ProjectArt art={p.art} className="absolute inset-0 h-full w-full" />
                      )}
                      <span className="absolute left-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">{p.category}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-5 sm:py-4">
                      <h3 className="truncate font-display text-xs font-semibold sm:text-base">{p.title}</h3>
                      <span className="shrink-0 text-[10px] text-fg/50 sm:text-xs">{p.year}</span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* edge vignette in the page colour */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 48%, transparent 52%, var(--page-bg) 100%)", opacity: 0.9 }}
        />
      </div>

      {/* ------------------------------ HUD ------------------------------ */}
      <div className="pointer-events-none fixed inset-x-0 top-[5.25rem] z-40 flex justify-center sm:hidden">
        <div className="glass flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-fg/70">
          <Hand size={12} /> {ex.hintPhone}
        </div>
      </div>

      <div className="pointer-events-none fixed left-6 top-24 z-40 hidden sm:block">
        <div className="glass rounded-3xl px-6 py-4">
          <p className="eyebrow !mb-1">{ex.eyebrow}</p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            The <span className="gradient-text">wall</span> of work
          </h1>
          <p className="mt-1 text-sm text-fg/60">{t(ex.subtitle, { total: projects.length })}</p>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-3 px-3 sm:bottom-5 sm:px-4">
        <div className="pointer-events-auto glass flex max-w-full gap-1.5 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none]">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                cat === c ? "bg-gradient-to-r from-brand-violet via-brand-pink to-brand-orange text-white" : "text-fg/70 hover:text-fg"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="glass pointer-events-none fixed bottom-6 left-6 z-40 hidden items-center gap-2 rounded-full px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] text-fg/65 lg:flex">
        <Hand size={14} /> {ex.hintDesktop}
      </div>

      <div className="pointer-events-auto fixed bottom-5 right-5 z-40 hidden flex-col items-end gap-2 lg:flex">
        <span className="text-[10px] uppercase tracking-[0.25em] text-fg/45">Scroll direction</span>
        <div className="glass flex gap-1 rounded-full p-1.5">
          {MODES.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              title={label}
              aria-label={`${label} scrolling`}
              aria-pressed={mode === id}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                mode === id ? "bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange text-white" : "text-fg/65 hover:text-fg"
              }`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* ----------------------------- detail ----------------------------- */}
      {current && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={current.title}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={close} />
          <div
            key={current.slug}
            className="relative grid max-h-[92dvh] w-full max-w-5xl animate-pop overflow-y-auto rounded-[1.5rem] sm:rounded-[2rem] border border-fg/10 bg-[var(--page-bg)] shadow-2xl md:grid-cols-[1.3fr_1fr]"
          >
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px]">
              {current.kind === "model" ? (
                <ModelPreview key={current.slug} model={current.model} className="absolute inset-0 h-full w-full" />
              ) : (
                <ProjectArt art={current.art} className="absolute inset-0 h-full w-full" />
              )}
            </div>
            <div className="flex flex-col p-5 sm:p-9">
              <div className="flex items-center justify-between pr-12">
                <span className="rounded-full border border-fg/15 bg-fg/5 px-3 py-1 text-xs">
                  {current.category}
                  {current.kind === "model" && ` · ${fmtOf(current.model)}`}
                </span>
                <span className="text-sm text-fg/50">{current.year}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold leading-tight sm:mt-5 sm:text-4xl">{current.title}</h2>
              <p className="mt-3 text-sm text-fg/65 sm:mt-4 sm:text-base">{current.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-6">
                {(current.tools || []).map((t) => (
                  <span key={t} className="rounded-full bg-gradient-to-r from-brand-violet/15 via-brand-pink/15 to-brand-orange/15 px-3 py-1 text-xs text-fg/80 ring-1 ring-fg/10">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-3 pt-6 sm:pt-8">
                <Link href="/#contact" className="btn-gradient !px-5 !py-2.5 sm:!px-7 sm:!py-3">
                  Start a project<span className="hidden sm:inline"> like this</span> <ArrowUpRight size={16} />
                </Link>
                <div className="ml-auto flex shrink-0 gap-2">
                  <button onClick={() => step(-1)} aria-label="Previous project" className="glass flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => step(1)} aria-label="Next project" className="glass flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
            <button onClick={close} aria-label="Close" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65">
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
