"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Send, Instagram, Linkedin, Dribbble, Palette, ArrowUpRight } from "lucide-react";
import AccentTitle from "@/components/AccentTitle";
import { useSiteData, useFill } from "@/components/SiteDataProvider";

export default function Contact() {
  const { site, copy } = useSiteData();
  const t = useFill();
  const c = copy.contactHome;
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Backend nahi chahiye: mail app khulta hai pre-filled message ke saath.
  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  const socials = [
    { href: site.socials.instagram, label: "Instagram", Icon: Instagram },
    { href: site.socials.behance, label: "Behance", Icon: Palette },
    { href: site.socials.dribbble, label: "Dribbble", Icon: Dribbble },
    { href: site.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  ];

  const field =
    "w-full rounded-2xl border border-fg/10 bg-fg/5 px-5 py-3.5 text-sm text-fg placeholder-fg/40 outline-none backdrop-blur-md transition focus:border-brand-pink/60 focus:bg-fg/10";

  return (
    <section id="contact" className="section">
      <div data-aos="fade-up" className="glass rounded-[2rem] p-5 sm:rounded-[2.5rem] sm:p-8 md:p-14">
        <div className="grid gap-8 sm:gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              <AccentTitle t={c.title} />
            </h2>
            <p className="mt-3 text-sm text-fg/65 sm:mt-5 sm:text-base">
              {c.text}
            </p>

            <ul className="mt-5 space-y-3 text-sm text-fg/75 sm:mt-8 sm:space-y-4">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-pink" /> {site.email}
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-brand-pink" /> {site.location}
              </li>
            </ul>

            <Link href="/contact" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-pink transition hover:gap-2.5 sm:mt-7">
              {c.briefLink} <ArrowUpRight size={16} />
            </Link>

            <div className="mt-5 flex gap-2.5 sm:mt-8 sm:gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="glass glass-hover flex h-11 w-11 items-center justify-center rounded-full"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <input className={field} name="name" placeholder={c.namePlaceholder} value={form.name} onChange={onChange} required />
            <input className={field} type="email" name="email" placeholder={c.emailPlaceholder} value={form.email} onChange={onChange} required />
            <textarea className={`${field} min-h-[110px] resize-none sm:min-h-[150px]`} name="message" placeholder={c.messagePlaceholder} value={form.message} onChange={onChange} required />
            <button type="submit" className="btn-gradient w-full">
              {c.submit} <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <footer className="mt-8 text-center sm:mt-14 text-xs text-fg/40">
        {t(copy.footer)}
      </footer>
    </section>
  );
}
