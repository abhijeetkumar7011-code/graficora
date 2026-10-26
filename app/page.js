import AosInit from "@/components/AosInit";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Models from "@/components/Models";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <AosInit />
      <Navbar />
      <Hero />
      <Work />
      <Models />
      <Services />
      <About />
      <Contact />
    </main>
  );
}
