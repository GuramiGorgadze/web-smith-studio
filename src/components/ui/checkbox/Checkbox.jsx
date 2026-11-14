import { Check } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./Checkbox.module.scss";

export function Checkbox({ className, ...props }) {
  return (
    <CheckboxPrimitive.Root className={cn(styles.root, className)} data-slot="checkbox" {...props}>
      <CheckboxPrimitive.Indicator className={styles.indicator}>
        <Check size={14} strokeWidth={3} aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
