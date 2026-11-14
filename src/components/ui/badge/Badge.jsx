import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";
import styles from "./Badge.module.scss";

export const badgeVariants = cva(styles.base, {
  variants: {
    variant: {
      default: styles.default,
      outline: styles.outline,
      solid: styles.solid,
      success: styles.success,
      muted: styles.muted,
    },
  },
  defaultVariants: { variant: "default" },
});

/** Small status label. `dot` adds a pulsing indicator in front of the text. */
export function Badge({ className, variant, dot = false, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} data-slot="badge" {...props}>
      {dot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
