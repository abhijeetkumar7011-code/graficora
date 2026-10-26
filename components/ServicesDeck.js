"use client";

import { Hexagon, Share2, Printer, LayoutTemplate, Box, Clapperboard, Orbit } from "lucide-react";
import DragDeck from "@/components/DragDeck";
import { useSiteData } from "@/components/SiteDataProvider";

// icon names used in `services[].icon` (lib/content.js or your backend)
const icons = { Hexagon, Share2, Printer, LayoutTemplate, Box, Clapperboard, Orbit };

const SIZES = {
  compact: { w: 236, h: 290, gap: 16 },
  full: { w: 330, h: 390, gap: 28 },
};

export default function ServicesDeck() {
  const { services, copy } = useSiteData();
  const c = copy.services;

  return (
    <DragDeck
      items={services}
      sizes={SIZES}
      label={c.deckLabel}
      hint={c.hint}
      renderCard={(s, i, isActive) => {
        const Icon = icons[s.icon] || Hexagon;
        return (
          <div
            className={`card-flat relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-5 transition-shadow duration-500 sm:rounded-[2.25rem] sm:p-8 ${
              isActive ? "shadow-[0_20px_70px_rgb(var(--c2)/0.35)]" : ""
            }`}
            style={{
              borderColor: isActive ? "rgb(var(--c2) / 0.6)" : undefined,
              background: "linear-gradient(var(--glass-bg-hover), var(--glass-bg-hover)), var(--page-bg)",
            }}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange opacity-30 blur-2xl" />
            <span className="absolute right-5 top-4 font-display text-4xl font-extrabold text-outline sm:right-7 sm:top-6 sm:text-6xl">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div
              className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange text-white transition duration-500 sm:h-[72px] sm:w-[72px] sm:rounded-3xl ${
                isActive ? "scale-110 -rotate-6" : ""
              }`}
            >
              <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>

            <h3 className="relative mt-5 font-display text-xl font-bold leading-tight sm:mt-8 sm:text-3xl">{s.title}</h3>
            <p className="relative mt-2 text-xs leading-relaxed text-fg/65 sm:mt-4 sm:text-base">{s.text}</p>

            <div className="relative mt-auto flex items-center gap-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-fg/50 sm:text-xs">
              <span className={`h-1 rounded-full bg-gradient-to-r from-brand-violet via-brand-pink to-brand-orange transition-all duration-500 ${isActive ? "w-14" : "w-6"}`} />
              {isActive ? c.selected : c.tapOther}
            </div>
          </div>
        );
      }}
    />
  );
}
