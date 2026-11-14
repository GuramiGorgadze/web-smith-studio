import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./FloatingChip.module.scss";

/** Small glassy label that floats around illustrated windows ("a plan in 48 hours"). */
export function FloatingChip({ icon, className, style, children }) {
  return (
    <span className={cn(styles.chip, className)} style={style}>
      <span className={styles.icon} aria-hidden="true">
        {icon ?? <Check size={12} strokeWidth={3} />}
      </span>
      {children}
    </span>
  );
}
