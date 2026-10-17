# Graficora — Designer Portfolio

Next.js 14 + Tailwind + AOS + lucide-react. Glassmorphic, gradient-accent, fully responsive.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Pages & sections

- **Home** (`app/page.js`): Hero (3D orbit) → Work (draggable 3D deck of featured projects) → Services (infinite carousel + process) → About (bento) → Contact.
- **/work** (`components/WorkExplorer.js`): no page scroll. Wheel, drag, touch and arrow keys pan an endless wall of projects in any direction; it tilts in 3D with speed. Bottom-right switch picks wheel direction (Diagonal / Sideways / Vertical / Free). Category chips dim non-matching cards; tap a card for details; Esc closes, ←/→ browse. Deep links: `/work#kinetic-type`. Grid size: `COLS`, `ROWS`, `CW`, `CH` at the top of the file.
- **/about** (`components/AboutPage.js`): full About page — cursor-spotlight hero with orbiting portrait, scroll-driven giant text, word-by-word manifesto, scroll-filled timeline, sticky stacking principle cards, animated skill bars, tap/hover flip cards, CTA. Copy lives in `lib/content.js`. Navbar "About" opens it; the home About section links to it with "Full story".
- **Services** (`components/ServicesDeck.js`): draggable infinite 3D deck — drag/swipe with inertia, tap a card to focus, arrows/dots/keyboard, idle drift. Card size: `SIZES` at the top; content from `services` in `lib/content.js`.
- **/contact** (`components/ContactPage.js`): rotating-word hero with live IST clock, 4-step brief builder (services → budget/timeline → details → review) that sends via email (`mailto:`) or WhatsApp (`wa.me`) or copies the brief, contact channels, what-happens-next, FAQ. Edit `site.email`, `site.whatsapp` (country code + number), `budgets`, `timelines`, `nextSteps`, `faqs`, `contactWords` in `lib/content.js`. Swap `mailto:` for Formspree/Resend/Supabase when a backend is wanted.
- **Featured work** (`components/WorkDeck.js` on top of the generic `components/DragDeck.js`): only projects with `featured: true` in `lib/content.js` show on the home page (keep ~6); tap the centre card to open it in /work. `DragDeck` can be reused for any card set.
- **About** (`components/About.js`): all copy, stats, skills, journey live in `lib/content.js` (`about`, `aboutStats`, `skills`, `journey`). Replace the initials circle with `<Image src="/me.jpg" />` for a real photo.
- **Add a project:** push an object into `projects` in `lib/content.js` (`slug`, `title`, `category`, `year`, `description`, `tools`, and `art` or `image`). **Add a service:** add to `services` and, if it uses a new lucide icon, to the `icons` map in `components/ServicesDeck.js`.

## Themes (dark + light)

- Toggle sits in the navbar. Choice is saved in `localStorage`; first visit follows the OS setting. An inline script in `app/layout.js` sets `html[data-theme]` before paint, so there is no flash.
- All colours are CSS variables in `app/globals.css` (`:root[data-theme="dark" | "light"]`): `--fg`, `--c1/--c2/--c3` (brand gradient), page glow colours and glass tokens. Tailwind maps them as `text-fg`, `from-brand-violet`, etc. (`tailwind.config.js`), so change a palette in one place.
- Light palette is "sunset candy": electric blue → raspberry pink → tangerine on a peach-cream background with blue/pink/lilac glows. The gradient goes *through* pink on purpose; blue straight to orange turns muddy. Tweak `--c1/--c2/--c3` and `--page-glow-*` in `globals.css`.
- Use `text-fg/NN` (not `text-white/NN`) in new components so they work in both themes.
- The 3D hero has its own per-theme palette: `PALETTES` in `components/Hero3D.js`.

## Mobile

- Phones (<640px) get compact cards, smaller type/paddings, a single-column hero (copy → 3D scene → stats) and swipeable rows for journey/testimonials in About.
- `/work` switches to a smaller wall layout on phones (`LAYOUTS.mobile` in `components/WorkExplorer.js`); drag in any direction, tap a card to open it. The category bar respects the iPhone safe area, the modal uses `dvh` so it fits under browser toolbars.
- Tested at 360, 390 and 768px widths: no horizontal scroll.

## Visuals

- **Hero 3D** — `components/Hero3D.js` (react-three-fiber). Tilted orbit of design objects (camera, artboard, pen, knots, gems), mouse parallax, pauses off-screen, respects reduced-motion, falls back to a gradient orb without WebGL. Speed: `0.28` in `MainOrbit`; tilt: `rotation` in `Scene`; objects: `ITEMS` array.
- **Project covers** — `components/ProjectArt.js` has original illustrated mockups. Real work: add `image: "/work/file.jpg"` to a project in `lib/content.js` and it replaces the illustration.
- Cards have mouse-follow 3D tilt + glare (`Tilt` in `components/Work.js`).

## Content: one place

- **All text and data lives in `lib/content.js`** (exported together as `defaultSiteData`): brand name, designer name, email, WhatsApp, socials, services, projects, testimonials, FAQs **and every heading / button label** (`copy`). Change it there and it changes on every page, in the navbar, footers, page titles, the WhatsApp/email brief, everywhere.
- Components never import that file. Pages read it through `getSiteData()` (`lib/siteData.js`); client components use `useSiteData()` (`components/SiteDataProvider.js`).
- To fetch from a backend later, implement `fetchRemote()` in `lib/siteData.js`. Remote values are merged over the defaults. Full plan with SQL: **`BACKEND.md`**.
- Colours/animations: `tailwind.config.js` + `app/globals.css` (theme tokens). Real project images: `projects[].image`.
- Not in `copy` yet: the small labels inside the /contact brief builder steps (in `components/ContactPage.js`).

## Deploy

Push to GitHub → import on Vercel. Contact form `mailto:` use karta hai (no backend needed);
Formspree / Resend se replace kar sakte ho.
