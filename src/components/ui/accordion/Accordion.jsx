import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./Accordion.module.scss";

export function Accordion({ className, ...props }) {
  return <AccordionPrimitive.Root className={cn(styles.root, className)} data-slot="accordion" {...props} />;
}

export function AccordionItem({ className, ...props }) {
  return <AccordionPrimitive.Item className={cn(styles.item, className)} data-slot="accordion-item" {...props} />;
}

export function AccordionTrigger({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className={styles.header}>
      <AccordionPrimitive.Trigger className={cn(styles.trigger, className)} data-slot="accordion-trigger" {...props}>
        <span>{children}</span>
        <span className={styles.icon} aria-hidden="true">
          <Plus size={18} strokeWidth={1.75} />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content className={styles.content} data-slot="accordion-content" {...props}>
      <div className={cn(styles.inner, className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
