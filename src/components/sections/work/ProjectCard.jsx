import { ArrowUpRight } from "lucide-react";
import { ProjectThumb } from "@/components/sections/work/ProjectThumb";
import { Badge } from "@/components/ui";
import { useContent } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import { cn } from "@/lib/cn";
import styles from "./ProjectCard.module.scss";

// How wide the picture is shown, so the browser downloads the right screenshot size.
const pictureSizes = {
  stack: "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw",
  wide: "(min-width: 768px) 60vw, 100vw",
};

/**
 * Portfolio card: picture, badges, name and one-line summary. The whole card is a link.
 * `layout="wide"` puts the picture and the words side by side and adds the longer summary: for a project
 * shown on its own, so a single card fills the row instead of leaving half of it empty.
 */
export function ProjectCard({ project, layout = "stack" }) {
  const text = useContent().sections.work;
  const wide = layout === "wide";

  return (
    <article className={cn(styles.card, wide && styles.wide)}>
      <div className={styles.media}>
        <ProjectThumb project={project} sizes={pictureSizes[layout] ?? pictureSizes.stack} />
        <span className={styles.open} aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>

      <div className={styles.body}>
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
        {wide ? <p className={styles.detail}>{project.summary}</p> : null}
        <p className={styles.services}>{project.services.join(" · ")}</p>
      </div>
    </article>
  );
}
