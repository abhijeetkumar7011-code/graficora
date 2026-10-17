import ServicesDeck from "@/components/ServicesDeck";
import AccentTitle from "@/components/AccentTitle";
import { getSiteData } from "@/lib/siteData";

export default async function Services() {
  const { process, copy } = await getSiteData();

  return (
    <section id="services" className="relative overflow-hidden py-14 md:py-32">
      <div className="pointer-events-none absolute -left-24 top-40 h-80 w-80 animate-blob rounded-full bg-brand-violet/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-24 h-80 w-80 animate-blob rounded-full bg-brand-orange/20 blur-3xl [animation-delay:4s]" />

      <div className="relative mx-auto w-full max-w-6xl px-5" data-aos="fade-up">
        <p className="eyebrow">{copy.services.eyebrow}</p>
        <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-6xl">
          <AccentTitle t={copy.services.title} />
        </h2>
      </div>

      <ServicesDeck />

      <div className="relative mx-auto mt-10 grid w-full max-w-6xl grid-cols-2 gap-3 px-5 sm:mt-20 sm:gap-6 md:grid-cols-4">
        {process.map((p, i) => (
          <div key={p.step} data-aos="fade-up" data-aos-delay={i * 100} className="glass rounded-2xl p-4 sm:rounded-3xl sm:p-6">
            <div className="font-display text-2xl font-extrabold gradient-text sm:text-4xl">{p.step}</div>
            <h4 className="mt-1.5 font-display text-base font-semibold sm:mt-3 sm:text-lg">{p.title}</h4>
            <p className="mt-1 text-xs text-fg/60 sm:text-sm">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
