import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import { ButtonLink } from "@/components/ui";
import { useContent, useI18n } from "@/i18n/I18nContext";
import styles from "./AboutStory.module.scss";

/** The studio's story on the left, a quick-facts card on the right. */
export function AboutStory() {
  const { t } = useI18n();
  const { about, sections } = useContent();
  const text = sections.aboutStory;

  return (
    <Section id="story" spacing="tight" aria-labelledby="story-heading">
      <div className={styles.layout}>
        <Reveal className={styles.copy}>
          <SectionHeading eyebrow={about.story.eyebrow} titleId="story-heading" title={about.story.title} />
          <div className={styles.text}>
            {about.story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className={styles.aside}>
          <SpotlightCard className={styles.card} role="group" aria-label={text.glance}>
            <dl className={styles.facts}>
              {about.facts.map((fact) => (
                <div key={fact.label} className={styles.fact}>
                  <dt className={styles.label}>{fact.label}</dt>
                  {/* Some values are marks such as {founded}, filled in from the studio facts. */}
                  <dd className={styles.value}>{t(fact.value)}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink to="/contact" variant="outline" iconRight={<ArrowRight size={16} />}>
              {text.cta}
            </ButtonLink>
          </SpotlightCard>
        </Reveal>
      </div>
    </Section>
  );
}
