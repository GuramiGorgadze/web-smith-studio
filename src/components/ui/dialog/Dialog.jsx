import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./Dialog.module.scss";

export function Dialog(props) {
  return <DialogPrimitive.Root {...props} />;
}

export function DialogTrigger(props) {
  return <DialogPrimitive.Trigger {...props} />;
}

export function DialogClose(props) {
  return <DialogPrimitive.Close {...props} />;
}

export function DialogContent({ className, children, showClose = true, closeLabel = "Close", ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={styles.overlay} data-slot="dialog-overlay" />
      <DialogPrimitive.Content className={cn(styles.content, className)} data-slot="dialog-content" {...props}>
        {children}
        {showClose ? (
          <DialogPrimitive.Close className={styles.close} aria-label={closeLabel}>
            <X size={18} aria-hidden="true" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn(styles.header, className)} data-slot="dialog-header" {...props} />;
}

export function DialogFooter({ className, ...props }) {
  return <div className={cn(styles.footer, className)} data-slot="dialog-footer" {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return <DialogPrimitive.Title className={cn(styles.title, className)} data-slot="dialog-title" {...props} />;
}

export function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description className={cn(styles.description, className)} data-slot="dialog-description" {...props} />
  );
}
