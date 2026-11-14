import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./Tooltip.module.scss";

export function TooltipProvider({ delayDuration = 250, skipDelayDuration = 400, ...props }) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} {...props} />;
}

export function Tooltip(props) {
  return <TooltipPrimitive.Root {...props} />;
}

export function TooltipTrigger(props) {
  return <TooltipPrimitive.Trigger {...props} />;
}

export function TooltipContent({ className, sideOffset = 8, children, ...props }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(styles.content, className)}
        data-slot="tooltip-content"
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className={styles.arrow} width={12} height={6} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

/** Convenience wrapper: <SimpleTooltip label="Dark mode"><button>..</button></SimpleTooltip> */
export function SimpleTooltip({ label, children, side = "top" }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  );
}
