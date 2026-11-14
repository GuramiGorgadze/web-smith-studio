import { ArrowRight } from "lucide-react";
import { GradientText } from "@/components/common/GradientText";
import { PageHero } from "@/components/common/PageHero";
import { Section } from "@/components/common/Section";
import { Seo } from "@/components/layout/Seo";
import { FinalCta } from "@/components/sections/cta/FinalCta";
import { ServiceAnchorNav } from "@/components/sections/services/ServiceAnchorNav";
import { ServiceDetail } from "@/components/sections/services/ServiceDetail";
import { IncludedSection } from "@/components/sections/shared/IncludedSection";
import { ButtonLink } from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import { breadcrumbJsonLd } from "@/lib/structuredData";

/** Everything the studio builds, one detailed block per service. */
export default function ServicesPage() {
  const i18n = useI18n();
  const { services, pages } = i18n.content;
  const text = pages.services;

  return (
    <>
      <Seo
        title={text.seoTitle}
        description={text.seoDescription}
        path="/services"
        jsonLd={breadcrumbJsonLd(i18n, [{ name: text.seoTitle, path: "/services" }])}
      />

      <PageHero
        eyebrow={text.eyebrow}
        title={
          <>
            {text.titleLead} <GradientText>{text.titleHighlight}</GradientText>
          </>
        }
        description={text.description}
        actions={
          <>
            <ButtonLink to="/contact" size="lg" iconRight={<ArrowRight size={18} />}>
              {text.primary}
            </ButtonLink>
            <ButtonLink to="/pricing" variant="outline" size="lg">
              {text.secondary}
            </ButtonLink>
          </>
        }
      />

      <ServiceAnchorNav />

      <Section spacing="none" aria-label={text.sectionLabel}>
        {services.map((service, index) => (
          <ServiceDetail key={service.slug} service={service} index={index} />
        ))}
      </Section>

      <IncludedSection />
      <FinalCta />
    </>
  );
}
