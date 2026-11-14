import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./Label.module.scss";

/** Accessible label. Add `required` to show a visible required marker. */
export function Label({ className, required = false, children, ...props }) {
  return (
    <LabelPrimitive.Root className={cn(styles.label, className)} data-slot="label" {...props}>
      {children}
      {required ? (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      ) : null}
    </LabelPrimitive.Root>
  );
}
