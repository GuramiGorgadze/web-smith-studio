import { cn } from "@/lib/cn";
import styles from "./Card.module.scss";

export function Card({ className, ...props }) {
  return <div className={cn(styles.card, className)} data-slot="card" {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn(styles.header, className)} data-slot="card-header" {...props} />;
}

export function CardTitle({ className, as: Tag = "h3", ...props }) {
  return <Tag className={cn(styles.title, className)} data-slot="card-title" {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn(styles.description, className)} data-slot="card-description" {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn(styles.content, className)} data-slot="card-content" {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn(styles.footer, className)} data-slot="card-footer" {...props} />;
}
