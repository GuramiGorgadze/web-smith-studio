import { ArrowLeft } from "lucide-react";
import { ArrowLink } from "@/components/common/ArrowLink";
import { BackdropGlow } from "@/components/common/BackdropGlow";
import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { WindowFrame } from "@/components/common/WindowFrame";
import { ProjectThumb } from "@/components/sections/work/ProjectThumb";
import { Badge } from "@/components/ui";
import { useContent, useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import styles from "./ProjectHero.module.scss";

/**
 * Case-study header: title, quick facts and a large picture of the site inside a browser window.
 * A client project with a `domain` shows its real address in the window and links to the live site.
 */
export function ProjectHero({ project }) {
  const { t, ui } = useI18n();
  const text = useContent().sections.work;
  const live = !project.isConcept && Boolean(project.domain);

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

          {live ? (
            <ArrowLink href={`https://${project.domain}`}>
              {text.visit}
              <span className="srOnly">{ui.newTab}</span>
            </ArrowLink>
          ) : null}
        </Reveal>

        <Reveal delay={140} className={styles.frame}>
          <WindowFrame
            url={project.domain ?? `${project.slug}.example`}
            label={t(live ? text.liveWindowLabel : text.windowLabel, { project: project.name })}
          >
            <ProjectThumb project={project} priority sizes="(min-width: 1280px) 1200px, 100vw" />
          </WindowFrame>
        </Reveal>
      </Container>
    </header>
  );
}
