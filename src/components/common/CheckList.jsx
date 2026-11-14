import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./CheckList.module.scss";

/** Bulleted list with gradient check marks. */
export function CheckList({ items, className, tone = "default" }) {
  return (
    <ul className={cn(styles.list, tone === "muted" && styles.muted, className)}>
      {items.map((item) => (
        <li key={item} className={styles.item}>
          <span className={styles.mark} aria-hidden="true">
            <Check size={12} strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
