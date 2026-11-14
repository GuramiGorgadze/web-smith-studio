import { ArrowLink } from "@/components/common/ArrowLink";
import { Eyebrow } from "@/components/common/Eyebrow";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { ProjectThumb } from "@/components/sections/work/ProjectThumb";
import { useContent } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import styles from "./NextProject.module.scss";

/** Closing link of a case study: the next project, with its illustration. */
export function NextProject({ project }) {
  const text = useContent().sections.work;

  return (
    <Section tone="muted" spacing="tight" aria-labelledby="next-project-title">
      <Reveal className={styles.wrap}>
        <div className={styles.copy}>
          <Eyebrow>{text.next}</Eyebrow>
          <h2 id="next-project-title" className={styles.title}>
            <Link to={`/work/${project.slug}`} className={styles.link}>
              {project.name}
            </Link>
          </h2>
          <p className={styles.tagline}>{project.tagline}</p>
          <ArrowLink to="/work">{text.seeAll}</ArrowLink>
        </div>

        <Link to={`/work/${project.slug}`} className={styles.thumb} tabIndex={-1} aria-hidden="true">
          <ProjectThumb project={project} />
        </Link>
      </Reveal>
    </Section>
  );
}
