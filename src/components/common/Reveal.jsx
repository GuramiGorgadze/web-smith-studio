import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";
import styles from "./Reveal.module.scss";

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({ as: Tag = "div", delay = 0, className, style, children, ...props }) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={cn(styles.reveal, inView && styles.visible, className)}
      style={{ "--reveal-delay": `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
