import { ArrowDownRight, Sparkles } from "lucide-react";
import HeroScene from "@/components/HeroScene";
import { getSiteData } from "@/lib/siteData";

export default async function Hero() {
  const { site, stats, copy } = await getSiteData();
  const words = site.tagline.split(" ");

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 animate-blob rounded-full bg-brand-violet/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 bottom-10 h-72 w-72 animate-blob rounded-full bg-brand-pink/20 blur-3xl [animation-delay:4s]" />

      {/* On phones the layout is a single column: copy → 3D scene → stats. On desktop the scene sits behind the copy. */}
      <div className="section relative z-10 flex flex-col justify-center !pb-10 !pt-28 sm:!pt-32 lg:static lg:min-h-screen lg:!py-32 lg:!pt-40">
        <div className="relative z-10 lg:max-w-[52%]">
          <div
            data-aos="fade-up"
            className="glass mb-5 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] text-fg/80 sm:mb-8 sm:px-4 sm:py-2 sm:text-xs"
          >
            <Sparkles size={13} className="text-brand-orange" />
            {copy.hero.badge}
          </div>

          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl"
          >
            {words.slice(0, 4).join(" ")}
            <br />
            <span className="gradient-text">{words.slice(4).join(" ")}</span>
          </h1>

          <p data-aos="fade-up" data-aos-delay="200" className="mt-4 max-w-md text-sm text-fg/70 sm:mt-8 sm:text-base md:text-lg">
            {site.intro}
          </p>

          <div data-aos="fade-up" data-aos-delay="300" className="mt-6 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
            <a href={copy.hero.primary.href} className="btn-gradient !px-6 !py-2.5 sm:!px-7 sm:!py-3">
              {copy.hero.primary.label} <ArrowDownRight size={18} />
            </a>
            <a href={copy.hero.secondary.href} className="btn-ghost !px-6 !py-2.5 sm:!px-7 sm:!py-3">
              {copy.hero.secondary.label}
            </a>
          </div>
        </div>

        {/* 3D orbit scene. pointer-events off so links stay clickable and the page scrolls under a thumb. */}
        <div className="pointer-events-none relative -mx-5 mt-2 h-[300px] sm:h-[380px] lg:absolute lg:inset-y-0 lg:-right-[3%] lg:left-auto lg:z-0 lg:mx-0 lg:mt-0 lg:h-auto lg:w-[62%]">
          <HeroScene />
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="glass relative z-10 mt-4 grid grid-cols-4 gap-1 rounded-2xl p-3 sm:mt-10 sm:gap-6 sm:rounded-3xl sm:p-6 lg:mt-20"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-xl font-bold gradient-text sm:text-3xl md:text-4xl">{s.value}</div>
              <div className="mt-0.5 text-[9px] uppercase leading-tight tracking-wide text-fg/55 sm:mt-1 sm:text-xs sm:tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
