import { Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./Select.module.scss";

export function Select(props) {
  return <SelectPrimitive.Root {...props} />;
}

export function SelectValue(props) {
  return <SelectPrimitive.Value {...props} />;
}

export function SelectTrigger({ className, children, ref, ...props }) {
  return (
    <SelectPrimitive.Trigger ref={ref} className={cn(styles.trigger, className)} data-slot="select-trigger" {...props}>
      <span className={styles.value}>{children}</span>
      <SelectPrimitive.Icon asChild>
        <ChevronDown size={18} className={styles.chevron} aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ className, children, position = "popper", ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(styles.content, position === "popper" && styles.popper, className)}
        position={position}
        sideOffset={6}
        collisionPadding={12}
        data-slot="select-content"
        {...props}
      >
        <SelectPrimitive.Viewport className={styles.viewport}>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item className={cn(styles.item, className)} data-slot="select-item" {...props}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className={styles.indicator}>
        <Check size={16} aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
