import "./globals.css";
import "aos/dist/aos.css";
import { Syne, Inter, Caveat } from "next/font/google";
import { getSiteData } from "@/lib/siteData";
import { fill, baseVars } from "@/lib/format";
import { SiteDataProvider } from "@/components/SiteDataProvider";

const display = Syne({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand", weight: ["600"] });

// Once content comes from a backend, pages are re-generated at most this often (seconds).
export const revalidate = 60;

export async function generateMetadata() {
  const { site, copy } = await getSiteData();
  const v = baseVars(site);
  return { title: fill(copy.seo.home.title, v), description: fill(copy.seo.home.description, v) };
}

// Runs before first paint: saved choice wins, otherwise follow the OS setting. Prevents a flash of the wrong theme.
const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default async function RootLayout({ children }) {
  const data = await getSiteData();
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-body antialiased">
        <SiteDataProvider value={data}>{children}</SiteDataProvider>
      </body>
    </html>
  );
}
