"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Hand, X } from "lucide-react";
import { useSiteData } from "@/components/SiteDataProvider";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

/** Live 3D viewer for places like a modal. On phones, a swipe scrolls the page until the user taps "Tap to rotate". */
export default function ModelPreview({ model, className = "" }) {
  const { copy } = useSiteData();
  const c = copy.models;
  const [coarse, setCoarse] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    try {
      const cv = document.createElement("canvas");
      setSupported(!!(cv.getContext("webgl2") || cv.getContext("webgl")));
    } catch {
      setSupported(false);
    }
  }, []);

  useEffect(() => setEngaged(false), [model.slug]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-0 h-48 w-48 rounded-full bg-brand-violet/25 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-brand-orange/20 blur-3xl" />
      </div>
      {supported ? (
        <ModelViewer model={model} interactive={!coarse || engaged} zoom={!coarse || engaged} loadingLabel={c.loading} failTitle={c.failed} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="h-40 w-40 animate-float rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange opacity-70" />
        </div>
      )}
      {coarse && supported && (
        <button
          type="button"
          onClick={() => setEngaged((e) => !e)}
          className="glass absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
        >
          {engaged ? <X size={15} /> : <Hand size={15} className="text-brand-pink" />} {engaged ? c.done : c.tapToInteract}
        </button>
      )}
      {!coarse && (
        <p className="pointer-events-none absolute bottom-3 left-1/2 max-w-[90%] -translate-x-1/2 truncate rounded-full bg-black/30 px-3 py-1 text-xs text-white/90 backdrop-blur-md">{c.hint}</p>
      )}
    </div>
  );
}
