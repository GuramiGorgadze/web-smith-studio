import { cn } from "@/lib/cn";
import styles from "./Input.module.scss";

export function Input({ className, type = "text", ref, ...props }) {
  return <input ref={ref} type={type} className={cn(styles.field, className)} data-slot="input" {...props} />;
}

export function Textarea({ className, rows = 5, ref, ...props }) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(styles.field, styles.textarea, className)}
      data-slot="textarea"
      {...props}
    />
  );
}
