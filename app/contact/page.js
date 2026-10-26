import Navbar from "@/components/Navbar";
import AosInit from "@/components/AosInit";
import ContactPage from "@/components/ContactPage";
import { getSiteData } from "@/lib/siteData";
import { fill, baseVars } from "@/lib/format";

export async function generateMetadata() {
  const { site, copy } = await getSiteData();
  const v = baseVars(site);
  return { title: fill(copy.seo.contact.title, v), description: fill(copy.seo.contact.description, v) };
}

export default function Contact() {
  return (
    <>
      <AosInit />
      <Navbar />
      <ContactPage />
    </>
  );
}
