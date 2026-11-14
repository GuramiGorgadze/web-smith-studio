import { GradientText } from "@/components/common/GradientText";
import { PageHero } from "@/components/common/PageHero";
import { Section } from "@/components/common/Section";
import { Seo } from "@/components/layout/Seo";
import { FinalCta } from "@/components/sections/cta/FinalCta";
import { ConceptNotice } from "@/components/sections/work/ConceptNotice";
import { WorkGrid } from "@/components/sections/work/WorkGrid";
import { useI18n } from "@/i18n/I18nContext";
import { Rich } from "@/i18n/Rich";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import styles from "./WorkPage.module.scss";

/** Portfolio overview with category filters. All projects are concepts until real case studies replace them. */
export default function WorkPage() {
  const i18n = useI18n();
  const text = i18n.content.pages.work;

  return (
    <>
      <Seo
        title={text.seoTitle}
        description={text.seoDescription}
        path="/work"
        jsonLd={breadcrumbJsonLd(i18n, [{ name: text.seoTitle, path: "/work" }])}
      />

      <PageHero
        eyebrow={text.eyebrow}
        title={
          <>
            {text.titleLead} <GradientText>{text.titleHighlight}</GradientText>
          </>
        }
        description={text.description}
      />

      <Section spacing="tight" aria-label={text.sectionLabel}>
        <div className={styles.stack}>
          <ConceptNotice>
            <Rich text={text.notice} />
          </ConceptNotice>
          <WorkGrid />
        </div>
      </Section>

      <FinalCta variant="work" showSteps={false} />
    </>
  );
}
