import { cva } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./Button.module.scss";

export const buttonVariants = cva(styles.base, {
  variants: {
    variant: {
      default: styles.default,
      secondary: styles.secondary,
      outline: styles.outline,
      ghost: styles.ghost,
      link: styles.link,
      inverse: styles.inverse,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
      icon: styles.icon,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

/**
 * shadcn-style button: variants and sizes through `cva`, `asChild` through Radix Slot.
 * Use `loading` to show a spinner and block repeat clicks while something is in flight.
 */
export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  iconRight,
  children,
  disabled,
  type = "button",
  ref,
  ...props
}) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    return (
      <Slot.Root ref={ref} className={classes} data-slot="button" {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-slot="button"
      {...props}
    >
      {loading ? <LoaderCircle className={styles.spinner} size={18} aria-hidden="true" /> : null}
      {children}
      {iconRight ? (
        <span className={styles.iconRight} aria-hidden="true">
          {iconRight}
        </span>
      ) : null}
    </button>
  );
}
