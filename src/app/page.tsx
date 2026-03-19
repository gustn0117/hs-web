import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import Portfolio from "@/components/Portfolio";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import { getPortfolioItems, PortfolioItem } from "@/lib/portfolio";

export const revalidate = 60;

export default async function Home() {
  let items: PortfolioItem[] = [];
  try {
    items = await getPortfolioItems();
  } catch {
    // 빌드 시 DB 접근 불가 시 빈 배열
  }

  return (
    <>
      <Hero />
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
