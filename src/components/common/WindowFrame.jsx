import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./WindowFrame.module.scss";

/** A browser window around illustrated content. Used for the tour and the project thumbnails. */
export function WindowFrame({ url, label, className, bodyClassName, children }) {
  return (
    <figure className={cn(styles.window, className)} aria-label={label}>
      <div className={styles.chrome} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.url}>
          <Lock size={11} strokeWidth={2.25} />
          <span className={styles.urlText}>{url}</span>
        </span>
        <span className={styles.dots} style={{ visibility: "hidden" }}>
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className={cn(styles.body, bodyClassName)}>{children}</div>
    </figure>
  );
}
