import { cache } from "react";
import { defaultSiteData } from "@/lib/content";

/**
 * SINGLE DOOR for all site content.
 *
 * Today: returns the defaults from lib/content.js.
 * Later: implement fetchRemote() (Supabase, REST, CMS...) and return an object
 * shaped like defaultSiteData. You can return only the parts that changed,
 * everything missing falls back to the defaults, so you can migrate one block at a time.
 *
 * Runs on the server (cached per request). Pages revalidate every `revalidate` seconds
 * (see app/layout.js), so edits in the backend show up without a redeploy.
 */
async function fetchRemote() {
  // Recommended: one Supabase table `site_content (key text primary key, value jsonb)`.
  // Each row = one top-level key of defaultSiteData ("site", "services", "projects", "copy", ...).
  // See BACKEND.md for the SQL. Then:
  //
  //   npm i @supabase/supabase-js        (and add the two env vars from .env.example)
  //
  //   import { createClient } from "@supabase/supabase-js";   // move this import to the top of the file
  //   const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  //   const { data, error } = await sb.from("site_content").select("key, value");
  //   if (error) throw error;
  //   return Object.fromEntries(data.map((r) => [r.key, r.value]));
  //
  // Any key you do not store keeps its default from lib/content.js.
  return null;
}

// plain objects merge deeply, arrays and primitives from the backend replace the defaults
function merge(base, extra) {
  if (Array.isArray(extra) || typeof extra !== "object" || extra === null) return extra ?? base;
  const out = { ...base };
  for (const k of Object.keys(extra)) {
    out[k] = k in base && base[k] && typeof base[k] === "object" && !Array.isArray(base[k]) ? merge(base[k], extra[k]) : extra[k] ?? base[k];
  }
  return out;
}

export const getSiteData = cache(async () => {
  try {
    const remote = await fetchRemote();
    return remote ? merge(defaultSiteData, remote) : defaultSiteData;
  } catch (err) {
    console.error("[siteData] remote fetch failed, using defaults:", err);
    return defaultSiteData;
  }
});
