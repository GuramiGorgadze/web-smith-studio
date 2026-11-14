import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./ToggleGroup.module.scss";

/**
 * Pill / card style toggle group. `layout="cards"` gives roomy, multi-line items,
 * `layout="pills"` (default) gives compact chips.
 */
export function ToggleGroup({ className, layout = "pills", ...props }) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(styles.root, layout === "cards" ? styles.cards : styles.pills, className)}
      data-slot="toggle-group"
      {...props}
    />
  );
}

export function ToggleGroupItem({ className, ...props }) {
  return <ToggleGroupPrimitive.Item className={cn(styles.item, className)} data-slot="toggle-group-item" {...props} />;
}
