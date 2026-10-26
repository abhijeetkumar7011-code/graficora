// Ek hi jagah se pura site ka content badlo.
// Friend ka naam, services, projects, links — sab yahin.

export const site = {
  name: "Graficora",
  designer: "Your Friend's Name",
  role: "Graphic Designer · 3D · Motion",
  tagline: "I turn ideas into visuals people remember.",
  // Hero artwork: a transparent PNG/WebP in /public, e.g. "/hero-character.png". Empty = the 3D orb scene is shown instead.
  heroImage: "",
  intro:
    "Logos, brand systems, 3D renders, video edits and motion graphics — designed with intent, delivered on time. Let's make your brand impossible to scroll past.",
  email: "hello@example.com",
  whatsapp: "919999999999", // country code + number, no + or spaces (used for wa.me links)
  location: "India · Working worldwide",
  socials: {
    instagram: "https://instagram.com/",
    behance: "https://behance.net/",
    dribbble: "https://dribbble.com/",
    linkedin: "https://linkedin.com/",
  },
};

export const stats = [
  { value: "120+", label: "Projects delivered" },
  { value: "60+", label: "Happy clients" },
  { value: "5 yrs", label: "Design experience" },
  { value: "48h", label: "Avg. first draft" },
];

// icon = lucide-react icon name (must also be added to the `icons` map in components/Services.js)
export const services = [
  {
    icon: "Hexagon",
    title: "Logo & Brand Identity",
    text: "Memorable marks, colour systems and typography that make your brand look consistent everywhere.",
  },
  {
    icon: "Share2",
    title: "Social Media Design",
    text: "Scroll-stopping posts, carousels and reel covers that match your brand voice.",
  },
  {
    icon: "Printer",
    title: "Print & Packaging",
    text: "Posters, brochures, visiting cards and packaging — print-ready, colour-accurate files.",
  },
  {
    icon: "LayoutTemplate",
    title: "UI & Web Graphics",
    text: "Banners, landing page visuals and app graphics that feel polished and modern.",
  },
  {
    icon: "Box",
    title: "3D Modeling & Renders",
    text: "Product renders, packaging mockups and stylised 3D scenes with studio-grade lighting.",
  },
  {
    icon: "Clapperboard",
    title: "Video Editing",
    text: "Reels, promos and long-form edits — tight cuts, colour grade, sound design and captions.",
  },
  {
    icon: "Orbit",
    title: "Motion Graphics",
    text: "Logo reveals, kinetic typography and animated explainers that make your brand move.",
  },
];

// featured: true => shown in the home page deck (keep it to ~6). All projects appear on /work.
// art = illustrated demo cover (see components/ProjectArt.js).
// Real work ke liye `image: "/work/xyz.jpg"` add karo (public/work/ me daalo) — image art ko override karti hai.
export const projects = [
  {
    slug: "nova-coffee",
    featured: true,
    title: "Nova Coffee Rebrand",
    category: "Branding",
    year: "2026",
    art: "coffee",
    description:
      "Full identity refresh for a specialty roaster: wordmark, monogram, packaging palette and a warm, glossy visual language.",
    tools: ["Illustrator", "Photoshop", "Figma"],
  },
  {
    slug: "pulse-fitness",
    featured: true,
    title: "Pulse Fitness Campaign",
    category: "Social Media",
    year: "2026",
    art: "fitness",
    description:
      "A 30-day challenge campaign: carousel templates, story frames and a high-energy neon pulse motif across every post.",
    tools: ["Photoshop", "Figma"],
  },
  {
    slug: "aurora-skincare",
    title: "Aurora Skincare Packaging",
    category: "Packaging",
    year: "2025",
    art: "skincare",
    description:
      "Serum bottle and night-cream jar packaging with a soft aurora gradient system and print-ready dielines.",
    tools: ["Illustrator", "Blender"],
  },
  {
    slug: "orbit-summit",
    title: "Orbit Tech Summit Poster",
    category: "Print",
    year: "2025",
    art: "poster",
    description:
      "Event poster series for a tech summit — cosmic illustration, bold type and a flexible grid for banners and tickets.",
    tools: ["Illustrator", "Photoshop"],
  },
  {
    slug: "kala-studio",
    title: "Kala Studio Identity",
    category: "Branding",
    year: "2025",
    art: "studio",
    description:
      "Monogram, letterhead and business card system for a creative studio, designed for foil and emboss finishes.",
    tools: ["Illustrator", "InDesign"],
  },
  {
    slug: "zest-juice",
    featured: true,
    title: "Zest Juice Label Design",
    category: "Packaging",
    year: "2024",
    art: "juice",
    description:
      "Cold-pressed juice bottle label with a bright citrus palette and an easy-to-extend flavour system.",
    tools: ["Illustrator", "Photoshop"],
  },
  {
    slug: "aero-box",
    featured: true,
    title: "Aero Gadget Box Mockup",
    category: "3D",
    year: "2026",
    art: "box3d",
    description:
      "Photoreal 3D packaging mockup for a gadget launch — modelled, lit and rendered with soft studio lighting and glossy materials.",
    tools: ["Blender", "Photoshop"],
  },
  {
    slug: "lowpoly-isle",
    title: "Lowpoly Isle Scene",
    category: "3D",
    year: "2026",
    art: "lowpoly",
    description:
      "A stylised low-poly island environment: faceted terrain, sunset lighting and a calm, game-ready mood.",
    tools: ["Blender", "After Effects"],
  },
  {
    slug: "wanderlust-film",
    featured: true,
    title: "Wanderlust Travel Film",
    category: "Video",
    year: "2026",
    art: "film",
    description:
      "A 90-second travel film: rhythm-driven cuts, cinematic colour grade, sound design and subtle speed ramps.",
    tools: ["Premiere Pro", "DaVinci Resolve"],
  },
  {
    slug: "beat-drop-reels",
    title: "Beat Drop Reels",
    category: "Video",
    year: "2025",
    art: "reel",
    description:
      "Vertical short-form edit pack: beat-synced cuts, animated captions and hooks designed to hold attention in the first second.",
    tools: ["Premiere Pro", "After Effects"],
  },
  {
    slug: "orbit-reveal",
    title: "Orbit Logo Reveal",
    category: "Motion",
    year: "2026",
    art: "reveal",
    description:
      "A looping logo sting: orbiting shapes snap into the mark with eased, satisfying motion. Delivered in 16:9 and 9:16.",
    tools: ["After Effects"],
  },
  {
    slug: "kinetic-type",
    featured: true,
    title: "Kinetic Type Promo",
    category: "Motion",
    year: "2025",
    art: "kinetic",
    description:
      "Typography-driven promo where every word slides, scales and snaps on the beat. Built to loop on social.",
    tools: ["After Effects", "Illustrator"],
  },
];

// 3D SHOWCASE (home page section #3d). Each entry is one model shown in a live, rotatable viewer.
//   file:  "/models/name.glb"  -> put the file in public/models/. Supported: glb, gltf (best, keeps materials/textures), obj, stl, fbx.
//          Any size / unit / position works: the viewer auto-centres and scales it.
//   shape: "knot" | "gyro" | "crystal" | "vase" -> built-in demo shape, used when there is no `file`.
//   icon:  lucide name for the picker tile — Box, Gem, Orbit, Atom, Cuboid, Shapes.
//   polys / tools / project are optional (`project` = slug in `projects`, adds a "Case study" link).
// These four are placeholders: swap them for real work.
export const models = [
  {
    slug: "ribbon-knot",
    title: "Ribbon Knot",
    category: "Abstract form",
    year: "2026",
    icon: "Shapes",
    file: "/models/ribbon-knot.glb",
    polys: "20k tris",
    description:
      "A glossy candy-coloured trefoil knot, exported straight from Blender as a GLB. This is a real file loaded in the browser — drag to spin it.",
    tools: ["Blender", "glTF"],
  },
  {
    slug: "gyro-core",
    title: "Gyro Core",
    category: "Motion study",
    year: "2026",
    icon: "Orbit",
    shape: "gyro",
    polys: "14k tris",
    description: "Three nested rings spinning around a glowing core. Built to explore layered rotation and glossy metal-plastic materials.",
    tools: ["Blender", "Cinema 4D"],
  },
  {
    slug: "crystal-bloom",
    title: "Crystal Bloom",
    category: "Stylised",
    year: "2025",
    icon: "Gem",
    shape: "crystal",
    polys: "2k tris",
    description: "A faceted low-poly crystal with an emissive core — a quick look at flat shading and light bounce.",
    tools: ["Blender"],
  },
  {
    slug: "studio-vase",
    title: "Studio Vase",
    category: "Product",
    year: "2025",
    icon: "Cuboid",
    shape: "vase",
    polys: "8k tris",
    description: "A lathe-modelled ceramic vase with ribbed detail, lit like a product shot for a home-decor brand.",
    tools: ["Blender", "Substance Painter"],
  },
];

export const categories = ["All", "Branding", "Social Media", "Packaging", "Print", "3D", "Video", "Motion"];

export const process = [
  { step: "01", title: "Discover", text: "We talk goals, audience and references." },
  { step: "02", title: "Concept", text: "Moodboards and rough directions." },
  { step: "03", title: "Design", text: "Polished visuals with your feedback." },
  { step: "04", title: "Deliver", text: "All final files, ready to use." },
];

/* ----------------------------- About ----------------------------- */

export const about = {
  headline: ["Designer.", "Animator.", "Storyteller."],
  bio: "I'm a graphic designer who believes good design is clarity with personality. I started with logos and posters, fell in love with 3D and motion, and now build brands that look great, move well and actually do their job.",
  quote: "If it doesn't make you stop scrolling, it's not done yet.",
  status: "Open for freelance projects",
  ring: "GRAPHIC DESIGNER • 3D ARTIST • MOTION • VIDEO EDITOR • ",
  floaters: ["Branding", "3D", "Motion", "Video"],
  marquee: ["DESIGN", "MOTION", "3D", "VIDEO", "BRAND", "STORY"],
};

// value must be a number (animated count-up). suffix is appended.
export const aboutStats = [
  { value: 120, suffix: "+", label: "Projects delivered" },
  { value: 60, suffix: "+", label: "Happy clients" },
  { value: 5, suffix: " yrs", label: "Experience" },
  { value: 48, suffix: "h", label: "First draft" },
];

// level = 0–100 (ring fill)
export const skills = [
  { name: "Photoshop", level: 95 },
  { name: "Illustrator", level: 92 },
  { name: "Figma", level: 88 },
  { name: "Blender", level: 78 },
  { name: "After Effects", level: 85 },
  { name: "Premiere Pro", level: 82 },
];

export const journey = [
  { year: "2020", title: "Started freelancing", text: "First logos and social posts for local businesses." },
  { year: "2022", title: "Brand identity focus", text: "Full identity systems for startups and studios." },
  { year: "2024", title: "Added 3D & motion", text: "Blender renders and After Effects animations join the toolkit." },
  { year: "2026", title: "Video & storytelling", text: "End-to-end campaigns: concept, design, motion and edit." },
];

export const testimonials = [
  {
    name: "Client Name",
    role: "Founder, Brand",
    text: "Placeholder testimonial — replace with a real client review. Super fast, super creative.",
  },
  {
    name: "Client Name",
    role: "Marketing Lead, Company",
    text: "Placeholder testimonial — the design completely changed how our brand looks online.",
  },
];

/* ------------------------------------------------------------------
   /about page extras — edit freely
------------------------------------------------------------------- */
export const manifesto =
  "I don't just make things pretty. I make them clear, loud and impossible to forget. Every pixel has a job, every frame has a reason, and every brand deserves a story worth following.";

export const principles = [
  { n: "01", title: "Idea before pixels", text: "Ten minutes of thinking saves ten hours of polishing. I start with the message, then the visuals." },
  { n: "02", title: "Details are the design", text: "Spacing, kerning, easing curves, light direction — the small stuff is what makes people feel quality." },
  { n: "03", title: "Motion has meaning", text: "Nothing moves just because it can. Every animation guides the eye or tells a piece of the story." },
  { n: "04", title: "Built to be used", text: "Clean layered files, every format you need, brand rules you can actually follow. Delivered, not just designed." },
];

// icon must exist in the `factIcons` map in components/AboutPage.js
export const funFacts = [
  { icon: "Coffee", front: "Fuel", back: "Strong chai. No chai, no concepts." },
  { icon: "Headphones", front: "Soundtrack", back: "Lo-fi beats while designing, loud bass while rendering." },
  { icon: "Pencil", front: "First step", back: "Every project starts as an ugly pencil sketch." },
  { icon: "Sun", front: "Favourite colour", back: "Orange — specifically the golden-hour kind." },
];

/* ------------------------------------------------------------------
   /contact page — edit freely
------------------------------------------------------------------- */
export const contactWords = ["a logo.", "a reel.", "a brand.", "a 3D render.", "some magic."];

export const budgets = ["Under ₹10k", "₹10k – 25k", "₹25k – 60k", "₹60k+", "Not sure yet"];
export const timelines = ["ASAP (under a week)", "2 – 4 weeks", "I'm flexible"];

export const nextSteps = [
  { n: "01", title: "I reply within 24h", text: "A real reply from a real person, with questions if I need them." },
  { n: "02", title: "Quick call + quote", text: "A short chat to lock scope, timeline and a clear price." },
  { n: "03", title: "First draft in 48h", text: "You see real work fast, then we refine it together." },
];

export const faqs = [
  { q: "How much does a project cost?", a: "It depends on scope. A logo and a full brand identity are very different jobs. Share your budget range in the brief and I'll tell you honestly what's possible." },
  { q: "How many revisions do I get?", a: "Two full rounds are included in every package. More are possible, we'll agree on that upfront so there are no surprises." },
  { q: "What files will I receive?", a: "Everything you need: layered source files, print-ready PDFs, web-optimised PNG/SVG, and video in the formats your platforms need." },
  { q: "Do you work with clients outside India?", a: "Yes. I work across time zones with clients worldwide, over email, WhatsApp or video calls." },
  { q: "How do payments work?", a: "A 50% advance to start, the rest on delivery. UPI, bank transfer and international options are available." },
];

/* ==================================================================
   UI COPY — every heading, button label and hint shown on the site.
   Titles are { pre, accent, post }: `accent` is rendered with the gradient.
   {tokens} like {total}, {featured}, {name}, {year} are filled in at render time.
=================================================================== */
export const copy = {
  nav: {
    // links without "#" are real pages (get an "active" state); "/#id" scrolls the home page
    links: [
      { href: "/#work", label: "Work" },
      { href: "/#3d", label: "3D" },
      { href: "/#services", label: "Services" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
    projects: { href: "/work", label: "All projects" },
    cta: { href: "/contact", label: "Hire me" },
  },

  footer: "© {year} {name}. Designed with care.",

  seo: {
    home: { title: "{name} — {role}", description: "{intro}" },
    about: { title: "About — {name}", description: "The story, the process and the person behind the pixels." },
    work: { title: "All projects — {name}", description: "Drag, scroll and explore every project in any direction." },
    contact: { title: "Contact — {name}", description: "Start a project: build a quick brief, or just say hello." },
  },

  hero: {
    badge: "Available for new projects",
    primary: { label: "View my work", href: "#work" },
    secondary: { label: "Let's talk", href: "/contact" },
    scroll: "Scroll",
    note: "Graphic · 3D · Motion designer", // handwritten note next to the artwork
    // slugs from `projects` shown as two floating cards next to the artwork (first = top left, second = right)
    cards: ["nova-coffee", "orbit-reveal"],
  },

  work: {
    eyebrow: "Featured work",
    title: { pre: "Projects that ", accent: "speak", post: " for themselves" },
    cta: "See all {total} projects",
    note: "{featured} hand-picked pieces. The rest live in the full explorer.",
    deckLabel: "Featured projects, drag or use arrow keys",
    hint: "Drag · fling · tap the centre card to open",
    tapActive: "Tap to open",
    tapOther: "Tap to focus",
  },

  models: {
    eyebrow: "3D showcase",
    title: { pre: "Step ", accent: "inside", post: " the model" },
    note: "{total} real-time 3D pieces. Spin, zoom and inspect them right in your browser.",
    listLabel: "Choose a 3D model",
    hint: "Drag to rotate · click, then scroll to zoom",
    hintTouch: "Drag to rotate · pinch to zoom",
    tapToInteract: "Tap to rotate",
    done: "Done",
    loading: "Loading model",
    failed: "Couldn't load this model",
    caseStudy: "Read the case study",
    openInWork: "Open in all projects",
    specs: { polys: "Geometry", format: "Format" },
    controls: {
      expand: "Full screen",
      collapse: "Exit full screen",
      pause: "Pause rotation",
      play: "Auto-rotate",
      wire: "Wireframe",
      reset: "Reset view",
      prev: "Previous model",
      next: "Next model",
    },
    cta: { label: "Need a 3D project?", href: "/contact" },
  },

  services: {
    eyebrow: "What I do",
    title: { pre: "Services built for ", accent: "growth", post: "" },
    deckLabel: "Services, drag or use arrow keys",
    hint: "Drag · fling · tap a card",
    selected: "Selected",
    tapOther: "Tap to focus",
  },

  explorer: {
    eyebrow: "All projects",
    hintPhone: "Drag any direction",
    hintDesktop: "Drag · Scroll · Arrow keys",
    subtitle: "{total} projects · endless in every direction",
  },

  aboutHome: {
    eyebrow: "About me",
    title: { pre: "The person ", accent: "behind", post: " the pixels" },
    primary: { label: "See my work", href: "/work" },
    secondary: { label: "Full story", href: "/about" },
    reply: "Replies within 24h",
    toolbox: "My toolbox",
    journeyEyebrow: "Journey",
    journeyTitle: { pre: "How I got ", accent: "here", post: "" },
  },

  aboutPage: {
    eyebrow: "About me",
    primary: { label: "See my work", href: "/work" },
    secondary: { label: "Let's talk", href: "/contact" },
    manifestoEyebrow: "Manifesto",
    journeyEyebrow: "Journey",
    journeyTitle: { pre: "How I got ", accent: "here", post: "" },
    rulesEyebrow: "How I work",
    rulesTitle: { pre: "Four rules I ", accent: "never", post: " break" },
    toolbox: "My toolbox",
    factsEyebrow: "Off the clock",
    factsTitle: { pre: "A few ", accent: "random", post: " facts" },
    factsHintDesktop: "Hover a card to flip it",
    factsHintPhone: "Tap a card to flip it",
    ctaEyebrow: "Got an idea?",
    ctaTitle: { pre: "Let's make something ", accent: "unforgettable", post: "" },
    ctaPrimary: "Say hello",
    ctaSecondary: { label: "Browse projects", href: "/work" },
  },

  contactHome: {
    eyebrow: "Contact",
    title: { pre: "Have a project? ", accent: "Let's create.", post: "" },
    text: "Tell me about your idea and I'll get back within 24 hours.",
    briefLink: "Plan it properly with the brief builder",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    messagePlaceholder: "Tell me about your project...",
    submit: "Send message",
  },

  contactPage: {
    online: "Online, replying fast",
    offline: "Offline now, replying in the morning",
    timezone: "Asia/Kolkata", // IANA name, used for the live clock
    timezoneLabel: "IST",
    openHour: 9, // "online" between these hours (24h clock, in the timezone above)
    closeHour: 23,
    heroLead: "Let's make",
    heroTail: "Together.",
    heroText: "Tell me what you're building. Use the quick brief below, or just say hi. Either way you'll hear back within 24 hours.",
    start: "Start a brief",
    briefEyebrow: "Project brief",
    briefTitle: { pre: "Four quick steps, ", accent: "zero", post: " forms" },
    chatEyebrow: "Prefer to just chat?",
    chatTitle: { pre: "Find me ", accent: "anywhere", post: "" },
    nextEyebrow: "What happens next",
    nextTitle: { pre: "From hello to ", accent: "first draft", post: "" },
    faqEyebrow: "FAQ",
    faqTitle: { pre: "Good ", accent: "questions", post: "" },
    marquee: ["SAY HELLO", "NAMASTE", "HOLA", "BONJOUR", "CIAO"],
    ring: "SAY HELLO • LET'S TALK • START A PROJECT • ",
    channels: [
      { key: "whatsapp", label: "WhatsApp", sub: "Fastest reply" },
      { key: "instagram", label: "Instagram", sub: "DMs open" },
      { key: "behance", label: "Behance", sub: "Case studies" },
      { key: "dribbble", label: "Dribbble", sub: "Shots & experiments" },
      { key: "linkedin", label: "LinkedIn", sub: "Let's connect" },
    ],
  },
};

/* ==================================================================
   THE ONE OBJECT THE APP READS.
   lib/siteData.js hands this to every page. To go dynamic, return the
   same shape from your backend (partial objects are merged over these defaults).
=================================================================== */
export const defaultSiteData = {
  site,
  stats,
  services,
  process,
  projects,
  models,
  categories,
  about,
  aboutStats,
  skills,
  journey,
  testimonials,
  manifesto,
  principles,
  funFacts,
  contactWords,
  budgets,
  timelines,
  nextSteps,
  faqs,
  copy,
};
