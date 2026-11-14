import { ArrowRight } from "lucide-react";
import { BackdropGlow } from "@/components/common/BackdropGlow";
import { Eyebrow } from "@/components/common/Eyebrow";
import { GradientText } from "@/components/common/GradientText";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { ButtonLink } from "@/components/ui";
import { useContent } from "@/i18n/I18nContext";
import styles from "./FinalCta.module.scss";

/**
 * Closing call to action, reused at the bottom of every marketing page.
 * `variant` ("about", "work" or "project") swaps in the wording written for that page in
 * sections.finalCta.variants; everything it does not list stays as the default.
 */
export function FinalCta({ variant, showSteps = true }) {
  const { sections } = useContent();
  const base = sections.finalCta;
  const text = { ...base, ...(variant ? base.variants[variant] : null) };

  return (
    <Section id="start" aria-labelledby="cta-title" spacing="tight">
      <Reveal className={styles.panel}>
        <BackdropGlow variant="cta" />

        <div className={styles.copy}>
          <Eyebrow>{text.eyebrow}</Eyebrow>
          <h2 id="cta-title" className={styles.title}>
            {text.titleLead} <GradientText>{text.titleHighlight}</GradientText>
          </h2>
          <p className={styles.description}>{text.description}</p>
          <div className={styles.actions}>
            <ButtonLink to={text.primary.to} size="lg" iconRight={<ArrowRight size={18} />}>
              {text.primary.label}
            </ButtonLink>
            <ButtonLink to={text.secondary.to} variant="outline" size="lg">
              {text.secondary.label}
            </ButtonLink>
          </div>
        </div>

        {showSteps ? (
          <ol className={styles.steps}>
            {base.steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </li>
            ))}
          </ol>
        ) : null}
      </Reveal>
    </Section>
  );
}
