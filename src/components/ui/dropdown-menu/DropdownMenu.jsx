import { Check } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./DropdownMenu.module.scss";

export function DropdownMenu(props) {
  return <DropdownMenuPrimitive.Root {...props} />;
}

export function DropdownMenuTrigger(props) {
  return <DropdownMenuPrimitive.Trigger {...props} />;
}

export function DropdownMenuContent({ className, sideOffset = 8, align = "end", ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        align={align}
        collisionPadding={12}
        className={cn(styles.content, className)}
        data-slot="dropdown-menu-content"
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuLabel({ className, ...props }) {
  return <DropdownMenuPrimitive.Label className={cn(styles.label, className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }) {
  return <DropdownMenuPrimitive.Separator className={cn(styles.separator, className)} {...props} />;
}

export function DropdownMenuItem({ className, ...props }) {
  return <DropdownMenuPrimitive.Item className={cn(styles.item, className)} data-slot="dropdown-menu-item" {...props} />;
}

export function DropdownMenuRadioGroup(props) {
  return <DropdownMenuPrimitive.RadioGroup {...props} />;
}

export function DropdownMenuRadioItem({ className, children, ...props }) {
  return (
    <DropdownMenuPrimitive.RadioItem className={cn(styles.item, className)} {...props}>
      {children}
      <DropdownMenuPrimitive.ItemIndicator className={styles.indicator}>
        <Check size={16} aria-hidden="true" />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.RadioItem>
  );
}
