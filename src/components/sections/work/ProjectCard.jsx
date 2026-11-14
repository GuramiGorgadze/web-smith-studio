import { ArrowUpRight } from "lucide-react";
import { ProjectThumb } from "@/components/sections/work/ProjectThumb";
import { Badge } from "@/components/ui";
import { useContent } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import styles from "./ProjectCard.module.scss";

/** Portfolio card: illustrated thumbnail, badges, name and one-line summary. The whole card is a link. */
export function ProjectCard({ project }) {
  const text = useContent().sections.work;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <ProjectThumb project={project} />
        <span className={styles.open} aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>

      <div className={styles.meta}>
        <Badge variant="outline">{project.categoryLabel}</Badge>
        {project.isConcept ? <Badge variant="muted">{text.concept}</Badge> : null}
      </div>

      <h3 className={styles.title}>
        <Link to={`/work/${project.slug}`} className={styles.link}>
          {project.name}
        </Link>
      </h3>
      <p className={styles.summary}>{project.tagline}</p>
      <p className={styles.services}>{project.services.join(" · ")}</p>
    </article>
  );
}
