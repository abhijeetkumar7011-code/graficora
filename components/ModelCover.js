"use client";

import { Box } from "lucide-react";
import { modelIcons, fmtOf } from "@/components/ModelShowcase";

const BG = [
  "from-brand-violet via-brand-pink to-brand-orange",
  "from-brand-pink via-brand-orange to-brand-violet",
  "from-brand-orange via-brand-pink to-brand-violet",
];

/**
 * Lightweight cover for a 3D model (no WebGL): gradient, glossy icon, orbit rings.
 * Used where many cards are on screen at once (the /work wall). The live viewer opens in the detail view.
 */
export default function ModelCover({ model, index = 0, className = "" }) {
  const I = modelIcons[model.icon] || Box;
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${BG[index % 3]} ${className}`}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.7) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
      <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40" style={{ transform: "translate(-50%,-50%) rotateX(70deg)" }} />
      <div className="absolute left-1/2 top-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-white/50" />
      <div className="absolute left-1/2 top-1/2 flex h-[34%] w-[34%] min-h-12 min-w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[28%] bg-white/25 text-white shadow-[0_10px_40px_rgba(0,0,0,.25)] ring-1 ring-white/50 backdrop-blur-md">
        <I className="h-1/2 w-1/2" />
      </div>
      <span className="absolute bottom-2 right-2 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md sm:bottom-3 sm:right-3 sm:px-2.5 sm:text-[11px]">
        3D · {fmtOf(model)}
      </span>
    </div>
  );
}
