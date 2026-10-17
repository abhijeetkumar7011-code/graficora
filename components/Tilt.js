"use client";

import { useRef } from "react";

// Mouse-follow 3D tilt + moving glare. Put AOS on a wrapper so transforms don't clash.
export default function Tilt({ children, className = "", max = 14, radius = "rounded-3xl", glare = true }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * max}deg) rotateX(${(0.5 - y) * max}deg) scale3d(1.02,1.02,1.02)`;
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      {glare && (
        <div
          className={`pointer-events-none absolute inset-0 ${radius} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
          style={{
            background:
              "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.22), transparent 45%)",
          }}
        />
      )}
    </div>
  );
}
