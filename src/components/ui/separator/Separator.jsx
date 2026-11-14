import { Separator as SeparatorPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./Separator.module.scss";

export function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(styles.separator, className)}
      data-slot="separator"
      {...props}
    />
  );
}
