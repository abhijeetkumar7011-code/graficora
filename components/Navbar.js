"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useSiteData } from "@/components/SiteDataProvider";

export default function Navbar() {
  const { site, copy } = useSiteData();
  const { links, projects, cta } = copy.nav;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls = "text-sm text-fg/70 transition hover:text-fg";
  const active = (href) => (pathname === href ? "!text-fg font-semibold" : "");
  // "/#id" scrolls the home page (works from any page); plain paths are real pages
  const isPage = (href) => !href.includes("#");

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        className={`glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3 transition-all duration-300 ${
          scrolled ? "shadow-2xl" : ""
        }`}
      >
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          <span className="gradient-text">{site.name}</span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              {isPage(l.href) ? (
                <Link href={l.href} className={`${linkCls} ${active(l.href)}`}>
                  {l.label}
                </Link>
              ) : (
                <a href={l.href} className={linkCls}>
                  {l.label}
                </a>
              )}
            </li>
          ))}
          <li>
            <Link href={projects.href} className={`${linkCls} ${active(projects.href)}`}>
              {projects.label}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href={cta.href} className="btn-gradient hidden !py-2 md:inline-flex">
            {cta.label}
          </Link>
          <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-5xl rounded-3xl p-6 md:hidden">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block text-base text-fg/80">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link href={projects.href} onClick={() => setOpen(false)} className="block text-base text-fg/80">
                {projects.label}
              </Link>
            </li>
            <li>
              <a href={cta.href} onClick={() => setOpen(false)} className="btn-gradient w-full">
                {cta.label}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
