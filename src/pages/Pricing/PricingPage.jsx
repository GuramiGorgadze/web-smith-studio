import { ArrowRight } from "lucide-react";
import { GradientText } from "@/components/common/GradientText";
import { PageHero } from "@/components/common/PageHero";
import { Section } from "@/components/common/Section";
import { Seo } from "@/components/layout/Seo";
import { FinalCta } from "@/components/sections/cta/FinalCta";
import { EstimatorSection } from "@/components/sections/home/EstimatorSection";
import { FaqSection } from "@/components/sections/home/FaqSection";
import { PricingPrinciples } from "@/components/sections/pricing/PricingPrinciples";
import { PricingTable } from "@/components/sections/pricing/PricingTable";
import { IncludedSection } from "@/components/sections/shared/IncludedSection";
import { ButtonLink } from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structuredData";

/** Packages, how pricing works, the live estimator and the FAQ, all on one page. */
export default function PricingPage() {
  const i18n = useI18n();
  const { faqs, pages } = i18n.content;
  const text = pages.pricing;

  return (
    <>
      <Seo
        title={text.seoTitle}
        description={text.seoDescription}
        path="/pricing"
        jsonLd={[breadcrumbJsonLd(i18n, [{ name: text.seoTitle, path: "/pricing" }]), faqJsonLd(faqs.items)]}
      />

      <PageHero
        align="center"
        eyebrow={text.eyebrow}
        title={
          <>
            {text.titleLead} <GradientText>{text.titleHighlight}</GradientText>
          </>
        }
        description={text.description}
        actions={
          <>
            <ButtonLink to="#estimator" size="lg" iconRight={<ArrowRight size={18} />}>
              {text.primary}
            </ButtonLink>
            <ButtonLink to="/contact" variant="outline" size="lg">
              {text.secondary}
            </ButtonLink>
          </>
        }
      />

      <Section id="packages" spacing="tight" aria-labelledby="packages-heading">
        <h2 id="packages-heading" className="srOnly">
          {text.packagesHeading}
        </h2>
        <PricingTable estimatorTo="#estimator" />
      </Section>

      <PricingPrinciples />
      <EstimatorSection packagesTo="#packages" />
      <IncludedSection />
      <FaqSection tone="default" />
      <FinalCta />
    </>
  );
}
