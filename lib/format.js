// "{total} projects" + { total: 12 } -> "12 projects". Unknown tokens are left as-is.
export function fill(str, vars = {}) {
  return String(str ?? "").replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
}

// Tokens every string can use without passing them in.
export function baseVars(site) {
  return { name: site.name, role: site.role, intro: site.intro, designer: site.designer, email: site.email, year: new Date().getFullYear() };
}
