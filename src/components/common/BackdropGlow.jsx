import { cn } from "@/lib/cn";
import styles from "./BackdropGlow.module.scss";

/**
 * Decorative background: a soft brand glow plus a faint grid that fades out.
 * Sits behind its (relatively positioned) parent's content.
 */
export function BackdropGlow({ variant = "hero", grid = true, className }) {
  return (
    <div className={cn(styles.backdrop, styles[variant], className)} aria-hidden="true">
      <div className={styles.glow} />
      <div className={styles.glowSecondary} />
      {grid ? <div className={styles.grid} /> : null}
    </div>
  );
}
