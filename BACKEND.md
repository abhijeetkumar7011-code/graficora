# Going dynamic (backend)

Everything the site shows lives in **one object**: `defaultSiteData` at the bottom of `lib/content.js`.
Every page reads it through **one function**: `getSiteData()` in `lib/siteData.js`.
Components never import content directly (server components call `getSiteData()`, client components call `useSiteData()`).

So going dynamic means changing **one function** (`fetchRemote`), nothing else.

## What `defaultSiteData` contains

| key | what it is |
|---|---|
| `site` | name, designer, role, tagline, intro, email, whatsapp, location, socials |
| `stats`, `aboutStats`, `skills`, `journey`, `testimonials`, `about` | home + about content |
| `services`, `process` | service cards (`icon` must be a name from the icon map in `components/ServicesDeck.js`), process steps |
| `models` | 3D showcase items (`file` URL or built-in `shape`, `title`, `category`, `year`, `description`, `polys`, `tools`, `icon`); model files can live in Supabase Storage, just use the public URL in `file` (CORS must allow your site) |
| `projects`, `categories` | portfolio items (`featured: true` => shown on the home page deck), filter chips |
| `manifesto`, `principles`, `funFacts` | /about page |
| `contactWords`, `budgets`, `timelines`, `nextSteps`, `faqs` | /contact page |
| `copy` | every heading / button / hint (`nav`, `hero`, `work`, `services`, `aboutPage`, `contactPage`, `footer`, `seo`, ...) |

Titles in `copy` are `{ pre, accent, post }` (the `accent` part gets the gradient).
Strings may use `{name}`, `{role}`, `{year}`, `{total}`, `{featured}` tokens.

## Step 1: table (Supabase SQL editor)

```sql
create table site_content (
  key   text primary key,   -- "site", "services", "projects", "copy", ...
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table site_content enable row level security;
create policy "public read" on site_content for select using (true);
-- writes: only from the Supabase dashboard / a service-role admin page
```

Seed it from the current defaults (run once, e.g. in a script):

```js
import { defaultSiteData } from "./lib/content.js";
const rows = Object.entries(defaultSiteData).map(([key, value]) => ({ key, value }));
await supabase.from("site_content").upsert(rows);
```

## Step 2: turn on `fetchRemote()`

Open `lib/siteData.js`, uncomment the example inside `fetchRemote()`, add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `.env.local` (see `.env.example`).

* Only store the keys you want to control. Missing keys fall back to the defaults.
* Plain objects are merged deeply (change only `copy.work.title.accent`, the rest of `copy` stays).
* Arrays (`services`, `projects`, ...) are replaced as a whole.
* If the backend is down, the site silently falls back to the defaults.
* Pages re-generate at most every 60 s (`revalidate` in `app/layout.js`), so edits go live without a redeploy.

## Later: real tables

If you prefer proper tables (`projects`, `services` with a `position` column, images in Supabase Storage),
just build the same shape inside `fetchRemote()`:

```js
const { data: projects } = await sb.from("projects").select("*").order("position");
return { projects };
```

Project images: put the file URL in `projects[].image` (add the Supabase host to `images.remotePatterns` in `next.config.mjs`).
