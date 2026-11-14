import { cn } from "@/lib/cn";
import styles from "./Container.module.scss";

/** Centered page column. `size` picks the max width. */
export function Container({ as: Tag = "div", size = "default", className, ...props }) {
  return <Tag className={cn(styles.container, styles[size], className)} {...props} />;
}
