"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// three.js only loads in the browser, and only when WebGL exists
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

export default function HeroScene() {
  const ref = useRef(null);
  const [supported, setSupported] = useState(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setSupported(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setSupported(false);
    }
  }, []);

  // pause rendering when the hero scrolls out of view (saves battery)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {supported === true && <Hero3D active={active} />}
      {supported === false && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-72 w-72 animate-float rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange opacity-80 blur-[2px]" />
        </div>
      )}
    </div>
  );
}
