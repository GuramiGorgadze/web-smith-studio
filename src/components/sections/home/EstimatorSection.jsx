import { BackdropGlow } from "@/components/common/BackdropGlow";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProjectEstimator } from "@/components/sections/home/estimator/ProjectEstimator";
import { useContent } from "@/i18n/I18nContext";
import styles from "./EstimatorSection.module.scss";

/** "Try it live": an interactive project estimator. `packagesTo` overrides where its "packages" link points. */
export function EstimatorSection({ tone = "default", packagesTo }) {
  const { sections } = useContent();
  const text = sections.estimator;

  return (
    <Section id="estimator" tone={tone} aria-labelledby="estimator-heading">
      <BackdropGlow variant="section" />
      <Reveal>
        <SectionHeading
          eyebrow={text.eyebrow}
          titleId="estimator-heading"
          title={text.title}
          description={text.description}
        />
      </Reveal>
      <Reveal delay={100} className={styles.tool}>
        <ProjectEstimator packagesTo={packagesTo} />
      </Reveal>
    </Section>
  );
}
