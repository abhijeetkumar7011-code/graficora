import Navbar from "@/components/Navbar";
import WorkExplorer from "@/components/WorkExplorer";
import { getSiteData } from "@/lib/siteData";
import { fill, baseVars } from "@/lib/format";

export async function generateMetadata() {
  const { site, copy } = await getSiteData();
  const v = baseVars(site);
  return { title: fill(copy.seo.work.title, v), description: fill(copy.seo.work.description, v) };
}

export default function WorkPage() {
  return (
    <main>
      <Navbar />
      <WorkExplorer />
    </main>
  );
}
