import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./Switch.module.scss";

export function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root className={cn(styles.root, className)} data-slot="switch" {...props}>
      <SwitchPrimitive.Thumb className={styles.thumb} data-slot="switch-thumb" />
    </SwitchPrimitive.Root>
  );
}
