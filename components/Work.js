import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import WorkDeck from "@/components/WorkDeck";
import AccentTitle from "@/components/AccentTitle";
import { getSiteData } from "@/lib/siteData";
import { fill } from "@/lib/format";

export default async function Work() {
  const { projects, copy } = await getSiteData();
  const c = copy.work;
  const vars = { total: projects.length, featured: projects.filter((p) => p.featured).length };

  return (
    <section id="work" className="relative overflow-hidden py-14 md:py-32">
      <div className="pointer-events-none absolute -right-24 top-32 h-80 w-80 animate-blob rounded-full bg-brand-pink/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-5" data-aos="fade-up">
        <p className="eyebrow">{c.eyebrow}</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-6xl">
            <AccentTitle t={c.title} />
          </h2>
          <Link href="/work" className="btn-gradient !px-5 !py-2.5 sm:!px-7 sm:!py-3">
            {fill(c.cta, vars)} <ArrowUpRight size={18} />
          </Link>
        </div>
        <p className="mt-3 max-w-md text-sm text-fg/60">{fill(c.note, vars)}</p>
      </div>

      <WorkDeck />
    </section>
  );
}
