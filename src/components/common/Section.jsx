import { Container } from "@/components/common/Container";
import { cn } from "@/lib/cn";
import styles from "./Section.module.scss";

/**
 * Vertical rhythm wrapper for page sections.
 * `tone="muted"` adds a subtly lifted background band; `divider` draws a hairline on top.
 */
export function Section({ id, tone = "default", divider = false, size = "default", spacing = "default", className, children, ...props }) {
  return (
    <section
      id={id}
      className={cn(styles.section, styles[tone], styles[`space-${spacing}`], divider && styles.divider, className)}
      {...props}
    >
      <Container size={size}>{children}</Container>
    </section>
  );
}
