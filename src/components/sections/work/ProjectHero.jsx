import { ArrowLeft } from "lucide-react";
import { BackdropGlow } from "@/components/common/BackdropGlow";
import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { WindowFrame } from "@/components/common/WindowFrame";
import { ProjectThumb } from "@/components/sections/work/ProjectThumb";
import { Badge } from "@/components/ui";
import { useContent, useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import styles from "./ProjectHero.module.scss";

/** Case-study header: title, quick facts and a large illustration of the site inside a browser window. */
export function ProjectHero({ project }) {
  const { t } = useI18n();
  const text = useContent().sections.work;

  return (
    <header className={styles.hero}>
      <BackdropGlow variant="hero" />
      <Container>
        <Reveal className={styles.head}>
          <Link to="/work" className={styles.back}>
            <ArrowLeft size={16} aria-hidden="true" />
            {text.allWork}
          </Link>

          <div className={styles.badges}>
            <Badge variant="outline">{project.categoryLabel}</Badge>
            {project.isConcept ? <Badge variant="muted">{text.concept}</Badge> : null}
          </div>

          <h1 className={styles.title}>{project.name}</h1>
          <p className={styles.tagline}>{project.tagline}</p>

          <dl className={styles.meta}>
            <div className={styles.metaItem}>
              <dt>{text.year}</dt>
              <dd>{project.year}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt>{text.services}</dt>
              <dd>{project.services.join(", ")}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt>{text.type}</dt>
              <dd>{project.isConcept ? text.conceptProject : text.clientProject}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={140} className={styles.frame}>
          <WindowFrame url={`${project.slug}.example`} label={t(text.windowLabel, { project: project.name })}>
            <ProjectThumb project={project} />
          </WindowFrame>
        </Reveal>
      </Container>
    </header>
  );
}
