import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./Sheet.module.scss";

/** Slide-over panel built on the Radix Dialog primitive (focus trap, Esc, scroll lock included). */
export function Sheet(props) {
  return <DialogPrimitive.Root {...props} />;
}

export function SheetTrigger(props) {
  return <DialogPrimitive.Trigger {...props} />;
}

export function SheetClose(props) {
  return <DialogPrimitive.Close {...props} />;
}

export function SheetContent({
  className,
  children,
  side = "right",
  showClose = true,
  closeLabel = "Close menu",
  ...props
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={styles.overlay} data-slot="sheet-overlay" />
      <DialogPrimitive.Content
        className={cn(styles.content, side === "left" ? styles.left : styles.right, className)}
        data-slot="sheet-content"
        {...props}
      >
        {children}
        {showClose ? (
          <DialogPrimitive.Close className={styles.close} aria-label={closeLabel}>
            <X size={20} aria-hidden="true" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }) {
  return <div className={cn(styles.header, className)} data-slot="sheet-header" {...props} />;
}

export function SheetTitle({ className, ...props }) {
  return <DialogPrimitive.Title className={cn(styles.title, className)} data-slot="sheet-title" {...props} />;
}

export function SheetDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description className={cn(styles.description, className)} data-slot="sheet-description" {...props} />
  );
}
