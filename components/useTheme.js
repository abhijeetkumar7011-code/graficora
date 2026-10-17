"use client";

import { useSyncExternalStore } from "react";

// Reads html[data-theme] (set by the inline script before paint) and stays in sync.
function subscribe(cb) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

const getSnapshot = () => document.documentElement.dataset.theme === "light" ? "light" : "dark";
const getServerSnapshot = () => "dark";

export function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setTheme(next) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
}
