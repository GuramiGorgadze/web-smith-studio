import { CheckList } from "@/components/common/CheckList";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import { ConceptNotice } from "@/components/sections/work/ConceptNotice";
import { Badge } from "@/components/ui";
import { useContent } from "@/i18n/I18nContext";
import { Rich } from "@/i18n/Rich";
import styles from "./ProjectBody.module.scss";

/** The story of a project: the brief, the approach step by step, and a sidebar of highlights and tools. */
export function ProjectBody({ project }) {
  const text = useContent().sections.work;

  return (
    <Section spacing="tight" aria-label={text.detailsLabel}>
      <div className={styles.layout}>
        <div className={styles.story}>
          <Reveal as="section" className={styles.block} aria-labelledby="brief-title">
            <h2 id="brief-title" className={styles.heading}>
              {text.brief}
            </h2>
            <p className={styles.lead}>{project.brief}</p>
          </Reveal>

          <Reveal as="section" className={styles.block} aria-labelledby="approach-title">
            <h2 id="approach-title" className={styles.heading}>
              {text.approach}
            </h2>
            <ol className={styles.steps}>
              {project.approach.map((step, index) => (
                <li key={step} className={styles.step}>
                  <span className={styles.number} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          {project.isConcept ? (
            <Reveal>
              <ConceptNotice>
                <Rich text={text.conceptNote} vars={{ project: project.name }} />
              </ConceptNotice>
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={120} className={styles.aside} role="group" aria-label={text.summaryLabel}>
          <SpotlightCard className={styles.panel}>
            <h2 className={styles.panelHeading}>{text.highlights}</h2>
            <CheckList items={project.highlights} />
          </SpotlightCard>

          <div className={styles.group}>
            <h2 className={styles.panelHeading}>{text.services}</h2>
            <ul className={styles.chips}>
              {project.services.map((service) => (
                <li key={service}>
                  <Badge variant="outline">{service}</Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.group}>
            <h2 className={styles.panelHeading}>{text.builtWith}</h2>
            <ul className={styles.chips}>
              {project.stack.map((tool) => (
                <li key={tool}>
                  <Badge variant="muted">{tool}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
