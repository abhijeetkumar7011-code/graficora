"use client";

import { createContext, useContext } from "react";
import { fill, baseVars } from "@/lib/format";

const SiteDataContext = createContext(null);

export function SiteDataProvider({ value, children }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

/** All site content for client components: const { site, projects, copy } = useSiteData(); */
export function useSiteData() {
  const v = useContext(SiteDataContext);
  if (!v) throw new Error("useSiteData must be used inside <SiteDataProvider> (see app/layout.js)");
  return v;
}

/** t("{total} projects", { total: 12 }) with {name}, {role}, {year}... always available. */
export function useFill() {
  const { site } = useSiteData();
  return (str, vars) => fill(str, { ...baseVars(site), ...vars });
}
