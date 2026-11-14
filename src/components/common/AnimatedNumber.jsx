import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";

/** Counts up to `value` the first time it is visible. Screen readers get the final value only. */
export function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1400, decimals = 0, className }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const current = useCountUp(value, { active: inView, duration, decimals });
  const final = `${prefix}${value.toFixed(decimals)}${suffix}`;

  return (
    <span ref={ref} className={cn("tabular", className)}>
      <span aria-hidden="true">
        {prefix}
        {current.toFixed(decimals)}
        {suffix}
      </span>
      <span className="srOnly">{final}</span>
    </span>
  );
}
