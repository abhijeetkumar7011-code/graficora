import Navbar from "@/components/Navbar";
import AosInit from "@/components/AosInit";
import AboutPage from "@/components/AboutPage";
import { getSiteData } from "@/lib/siteData";
import { fill, baseVars } from "@/lib/format";

export async function generateMetadata() {
  const { site, copy } = await getSiteData();
  const v = baseVars(site);
  return { title: fill(copy.seo.about.title, v), description: fill(copy.seo.about.description, v) };
}

export default function About() {
  return (
    <>
      <AosInit />
      <Navbar />
      <AboutPage />
    </>
  );
}
