import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import Portfolio from "@/components/Portfolio";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import { getPortfolioItems } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default function Home() {
  const items = getPortfolioItems();

  return (
    <>
      <Hero />
      <ClientLogos />
      <Services />
      <TechStack />
      <Portfolio items={items} />
      <WhyUs />
      <Process />
      <Pricing />
      <FAQ />
      <Testimonials />
      <CTA />
    </>
  );
}
