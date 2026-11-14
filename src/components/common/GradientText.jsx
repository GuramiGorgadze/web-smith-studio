import { cn } from "@/lib/cn";
import styles from "./GradientText.module.scss";

/** Inline text painted with the brand gradient. */
export function GradientText({ as: Tag = "span", className, ...props }) {
  return <Tag className={cn(styles.gradient, className)} {...props} />;
}
