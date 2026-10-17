"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import DragDeck from "@/components/DragDeck";
import ProjectArt from "@/components/ProjectArt";
import { useSiteData } from "@/components/SiteDataProvider";

const SIZES = {
  compact: { w: 262, h: 310, gap: 16 },
  full: { w: 400, h: 430, gap: 28 },
};

export default function WorkDeck() {
  const router = useRouter();
  const { projects, copy } = useSiteData();
  const c = copy.work;
  // only projects flagged `featured: true` appear here (memoised so the deck engine keeps a stable reference)
  const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);

  return (
    <DragDeck
      items={featured}
      sizes={SIZES}
      label={c.deckLabel}
      hint={c.hint}
      onTapActive={(p) => router.push(`/work#${p.slug}`)}
      renderCard={(p, _i, isActive) => (
        <div
          className={`relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border transition-shadow duration-500 sm:rounded-[2.25rem] ${
            isActive ? "shadow-[0_20px_70px_rgb(var(--c2)/0.35)]" : "shadow-xl shadow-black/20"
          }`}
          style={{
            borderColor: isActive ? "rgb(var(--c2) / 0.6)" : "var(--glass-border)",
            background: "linear-gradient(var(--glass-bg-hover), var(--glass-bg-hover)), var(--page-bg)",
          }}
        >
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {p.image ? (
              <Image src={p.image} alt={p.title} fill sizes="400px" className="object-cover" draggable={false} />
            ) : (
              <ProjectArt art={p.art} className="absolute inset-0 h-full w-full" />
            )}
            <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] text-white backdrop-blur-md sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs">
              {p.category}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 p-4 sm:p-6">
            <div className="min-w-0">
              <h3 className="truncate font-display text-base font-bold sm:text-2xl">{p.title}</h3>
              <p className="mt-0.5 text-[11px] text-fg/55 sm:text-sm">
                {p.year} · {isActive ? c.tapActive : c.tapOther}
              </p>
            </div>
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange text-white transition duration-500 sm:h-12 sm:w-12 ${
                isActive ? "scale-100 rotate-0" : "scale-75 opacity-60 -rotate-45"
              }`}
            >
              <ArrowUpRight size={20} />
            </span>
          </div>
        </div>
      )}
    />
  );
}
