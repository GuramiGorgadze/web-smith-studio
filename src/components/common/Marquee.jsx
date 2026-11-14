import { cn } from "@/lib/cn";
import styles from "./Marquee.module.scss";

/**
 * Infinite horizontal ticker. The list is rendered twice for a seamless loop; the copy is hidden from
 * assistive tech. Pauses on hover and stops entirely for visitors who prefer reduced motion.
 */
export function Marquee({ items, duration = 48, label, className }) {
  return (
    <div className={cn(styles.marquee, className)} role="group" aria-label={label} style={{ "--marquee-duration": `${duration}s` }}>
      <div className={styles.track}>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item} className={styles.item}>
              {item}
            </li>
          ))}
        </ul>
        <ul className={styles.list} aria-hidden="true">
          {items.map((item) => (
            <li key={item} className={styles.item}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
