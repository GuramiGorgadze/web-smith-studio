import { Seo } from "@/components/layout/Seo";
import { FinalCta } from "@/components/sections/cta/FinalCta";
import { EstimatorSection } from "@/components/sections/home/EstimatorSection";
import { FaqSection } from "@/components/sections/home/FaqSection";
import { Hero } from "@/components/sections/home/Hero";
import { PricingSection } from "@/components/sections/home/PricingSection";
import { ProcessTour } from "@/components/sections/home/ProcessTour";
import { ServicesGrid } from "@/components/sections/home/ServicesGrid";
import { StatsStrip } from "@/components/sections/home/StatsStrip";
import { TechMarquee } from "@/components/sections/home/TechMarquee";
import { WorkShowcase } from "@/components/sections/home/WorkShowcase";
import { useI18n } from "@/i18n/I18nContext";
import { faqJsonLd, organizationJsonLd } from "@/lib/structuredData";

/** Landing page: every section of the story, from promise to proof to price to the next step. */
export default function HomePage() {
  const i18n = useI18n();

  return (
    <>
      <Seo path="/" jsonLd={[organizationJsonLd(i18n), faqJsonLd(i18n.content.faqs.items)]} />
      <Hero />
      <StatsStrip />
      <TechMarquee />
      <ServicesGrid />
      <ProcessTour />
      <WorkShowcase />
      <EstimatorSection />
      <PricingSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
