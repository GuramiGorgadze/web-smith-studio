import { ArrowRight } from "lucide-react";
import { GradientText } from "@/components/common/GradientText";
import { PageHero } from "@/components/common/PageHero";
import { Seo } from "@/components/layout/Seo";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { DisciplinesSection } from "@/components/sections/about/DisciplinesSection";
import { ValuesSection } from "@/components/sections/about/ValuesSection";
import { FinalCta } from "@/components/sections/cta/FinalCta";
import { ButtonLink } from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import { breadcrumbJsonLd } from "@/lib/structuredData";

/** Who we are, what we believe and what we bring to a project. */
export default function AboutPage() {
  const i18n = useI18n();
  const text = i18n.content.pages.about;

  return (
    <>
      <Seo
        title={text.seoTitle}
        description={text.seoDescription}
        path="/about"
        jsonLd={breadcrumbJsonLd(i18n, [{ name: text.seoTitle, path: "/about" }])}
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
            <ButtonLink to="/work" variant="outline" size="lg">
              {text.secondary}
            </ButtonLink>
          </>
        }
      />

      <AboutStory />
      <ValuesSection />
      <DisciplinesSection />
      <FinalCta variant="about" />
    </>
  );
}
