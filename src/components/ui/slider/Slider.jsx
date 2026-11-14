import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./Slider.module.scss";

/**
 * Single-thumb slider. Pass `aria-label` or `aria-labelledby`: they are forwarded to the thumb,
 * which is the element that carries role="slider".
 */
export function Slider({
  className,
  value,
  defaultValue,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}) {
  const values = value ?? defaultValue ?? [0];

  return (
    <SliderPrimitive.Root
      className={cn(styles.root, className)}
      value={value}
      defaultValue={defaultValue}
      data-slot="slider"
      {...props}
    >
      <SliderPrimitive.Track className={styles.track}>
        <SliderPrimitive.Range className={styles.range} />
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={styles.thumb}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
