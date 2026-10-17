"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Hand } from "lucide-react";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/**
 * Generic draggable, infinite 3D deck.
 * props: items, renderCard(item, i, isActive), sizes {compact:{w,h,gap}, full:{w,h,gap}},
 *        onTapActive(item, i) — fired when the already-focused card is tapped, label, hint.
 * Drag / swipe with inertia, tap to focus, arrows / dots / keyboard, idle drift.
 */
export default function DragDeck({ items, renderCard, sizes, onTapActive, label = "Carousel", hint = "Drag · fling · tap a card", bigNumber = true }) {
  const N = items.length;
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState(0);

  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const bigRef = useRef(null);
  const tapRef = useRef(onTapActive);
  tapRef.current = onTapActive;
  const st = useRef({ off: 0, vel: 0, sv: 0, drag: false, target: null, hover: false, lastX: 0, lastT: 0, moved: 0, downEl: null, active: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setCompact(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const size = compact ? sizes.compact : sizes.full;

  /* ------------------------------- engine ------------------------------- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const s = st.current;
    const step = size.w + size.gap;
    const total = N * step;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wrap = (v) => ((((v % total) + total) % total) + total / 2) % total - total / 2;

    let raf = 0;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(stage);

    const positionOf = (i) => wrap(i * step - s.off);

    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      if (!visible) {
        last = t;
        return;
      }
      const dt = Math.min(32, t - last) / 16.667;
      last = t;
      const prev = s.off;

      if (!s.drag) {
        if (s.target !== null) {
          s.off += (s.target - s.off) * Math.min(1, 0.11 * dt);
          if (Math.abs(s.target - s.off) < 0.4) {
            s.off = s.target;
            s.target = null;
          }
        } else {
          s.off += s.vel * dt;
          s.vel *= Math.pow(0.94, dt);
          if (Math.abs(s.vel) < 0.04) {
            s.vel = 0;
            if (!reduce && !s.hover) s.off += 0.45 * dt;
          }
        }
      }

      // smoothed real velocity -> skew
      const v = (s.off - prev) / dt;
      s.sv += (v - s.sv) * 0.18;
      const skew = clamp(s.sv * -0.35, -10, 10);

      const vw = stage.clientWidth;
      const half = vw / 2;
      let best = 0;
      let bestD = Infinity;

      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const x = positionOf(i);
        const ax = Math.abs(x);
        if (ax < bestD) {
          bestD = ax;
          best = i;
        }
        const k = clamp(x / (half * 0.95), -1, 1);
        const ak = Math.abs(k);
        const rot = -k * 42;
        const scale = 1.08 - ak * 0.36;
        const z = -ak * 220;
        const y = ak * ak * 26;
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${rot.toFixed(2)}deg) skewX(${skew.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = String(clamp(1 - Math.max(0, ax - half * 0.35) / (half * 1.35), 0.12, 1));
        el.style.zIndex = String(100 - Math.round(ax / 8));
      }

      if (best !== s.active) {
        s.active = best;
        setActive(best);
      }
      if (bigRef.current) bigRef.current.style.transform = `translate3d(${(-s.off * 0.12) % 60}px,0,0)`;
    };
    raf = requestAnimationFrame(tick);

    /* ---------- input ---------- */
    const onDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      s.drag = true;
      s.target = null;
      s.vel = 0;
      s.moved = 0;
      s.lastX = e.clientX;
      s.lastT = performance.now();
      s.downEl = e.target;
      try {
        stage.setPointerCapture(e.pointerId);
      } catch {}
      stage.style.cursor = "grabbing";
    };
    const onMove = (e) => {
      if (!s.drag) return;
      const now = performance.now();
      const dx = e.clientX - s.lastX;
      const dtf = Math.max(1, now - s.lastT) / 16.667;
      s.off -= dx;
      s.vel = clamp(-dx / dtf, -70, 70) * 0.7 + s.vel * 0.3;
      s.moved += Math.abs(dx);
      s.lastX = e.clientX;
      s.lastT = now;
    };
    const onUp = (e) => {
      if (!s.drag) return;
      s.drag = false;
      stage.style.cursor = "";
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {}
      // a pause before release kills the fling
      if (performance.now() - s.lastT > 90) s.vel = 0;
      if (e.type === "pointerup" && s.moved < 7) {
        const card = s.downEl && s.downEl.closest ? s.downEl.closest("[data-i]") : null;
        if (card) {
          const i = Number(card.dataset.i);
          if (i === s.active && Math.abs(positionOf(i)) < 40 && tapRef.current) {
            tapRef.current(items[i], i);
          } else {
            s.target = s.off + positionOf(i);
            s.vel = 0;
          }
        }
      }
    };
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical wheel keeps scrolling the page
      e.preventDefault();
      s.target = null;
      s.off += e.deltaX;
    };
    const onEnter = () => (s.hover = true);
    const onLeave = () => (s.hover = false);

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("mouseenter", onEnter);
    stage.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("mouseenter", onEnter);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, [size.w, size.gap, N]);

  /* ------------------------- buttons / keyboard ------------------------- */
  const goTo = useCallback(
    (i) => {
      const s = st.current;
      const step = size.w + size.gap;
      const total = N * step;
      const wrap = (v) => ((((v % total) + total) % total) + total / 2) % total - total / 2;
      const idx = ((i % N) + N) % N;
      s.target = s.off + wrap(idx * step - s.off);
      s.vel = 0;
    },
    [size.w, size.gap, N]
  );

  const onKey = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(st.current.active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(st.current.active - 1);
    }
  };

  return (
    <div className="relative mt-6 sm:mt-12">
      {bigNumber && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
          <div ref={bigRef} className="will-change-transform">
            <span key={active} className="block animate-pop font-display text-[11rem] font-extrabold leading-none text-outline sm:text-[22rem]">
              {String(active + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 sm:h-[560px] sm:w-[560px]" aria-hidden="true">
        <div className="absolute inset-0 animate-spin-slower rounded-full border border-dashed border-fg/20" />
        <div className="absolute inset-[12%] animate-spin-slow rounded-full border border-fg/10 [animation-direction:reverse]" />
        <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 animate-spin-slower rounded-full bg-brand-orange shadow-[0_0_20px_rgb(var(--c3)/0.9)]" />
      </div>

      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        onKeyDown={onKey}
        className="marquee-fade relative cursor-grab select-none overflow-hidden outline-none [perspective:1100px] [touch-action:pan-y]"
        style={{ height: size.h + 70 }}
      >
        {items.map((item, i) => (
          <article
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            data-i={i}
            className="absolute left-1/2 top-1/2 will-change-transform [transform-style:preserve-3d]"
            style={{ width: size.w, height: size.h, marginLeft: -size.w / 2, marginTop: -size.h / 2 }}
          >
            {renderCard(item, i, i === active)}
          </article>
        ))}
      </div>

      <div className="relative mt-2 flex flex-col items-center gap-4 sm:mt-6">
        <div className="glass inline-flex items-center gap-1 rounded-full p-1.5">
          <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous" className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-fg/10 active:scale-90">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to item ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-gradient-to-r from-brand-violet via-brand-pink to-brand-orange" : "w-2 bg-fg/25 hover:bg-fg/45"
                }`}
              />
            ))}
          </div>
          <button type="button" onClick={() => goTo(active + 1)} aria-label="Next" className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-fg/10 active:scale-90">
            <ChevronRight size={20} />
          </button>
        </div>
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-fg/45 sm:text-xs">
          <Hand size={14} /> {hint}
        </p>
      </div>
    </div>
  );
}
