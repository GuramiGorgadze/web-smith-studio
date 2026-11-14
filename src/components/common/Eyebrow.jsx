import { cn } from "@/lib/cn";
import styles from "./Eyebrow.module.scss";

/** Small lowercase mono label that sits above headings. */
export function Eyebrow({ as: Tag = "p", dot = true, className, children, ...props }) {
  return (
    <Tag className={cn(styles.eyebrow, className)} {...props}>
      {dot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {children}
    </Tag>
  );
}
