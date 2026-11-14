import { useCallback } from "react";
import { cn } from "@/lib/cn";
import styles from "./SpotlightCard.module.scss";

/**
 * Card whose border and surface light up under the pointer.
 * The pointer position is written straight to CSS variables, so it never triggers a React re-render.
 */
export function SpotlightCard({ as: Tag = "div", className, children, ...props }) {
  const onPointerMove = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);

  return (
    <Tag className={cn(styles.card, className)} onPointerMove={onPointerMove} {...props}>
      {children}
    </Tag>
  );
}
