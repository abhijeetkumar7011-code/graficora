import { getSiteData } from "@/lib/siteData";
import { fill } from "@/lib/format";
import AccentTitle from "@/components/AccentTitle";
import ModelShowcase from "@/components/ModelShowcase";

// Home page "3D showcase" section. Models come from `models` in lib/content.js.
export default async function Models() {
  const { models = [], copy } = await getSiteData();
  if (!models.length) return null;
  const c = copy.models;

  return (
    <section id="3d" className="relative overflow-hidden py-14 md:py-28">
      <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 animate-blob rounded-full bg-brand-violet/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-5" data-aos="fade-up">
        <p className="eyebrow">{c.eyebrow}</p>
        <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-6xl">
          <AccentTitle t={c.title} />
        </h2>
        <p className="mt-3 max-w-md text-sm text-fg/60">{fill(c.note, { total: models.length })}</p>
      </div>

      <ModelShowcase />
    </section>
  );
}
