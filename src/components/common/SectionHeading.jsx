import { Eyebrow } from "@/components/common/Eyebrow";
import { cn } from "@/lib/cn";
import styles from "./SectionHeading.module.scss";

/**
 * Eyebrow + title + description block used at the top of every section.
 * `title` can be a node so parts of it can use <GradientText>.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  actions,
  titleId,
  className,
}) {
  return (
    <header className={cn(styles.heading, styles[align], className)}>
      {eyebrow ? <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow> : null}
      <Tag id={titleId} className={styles.title}>
        {title}
      </Tag>
      {description ? <p className={styles.description}>{description}</p> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
