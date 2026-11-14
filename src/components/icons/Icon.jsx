import { iconMap } from "@/components/icons/iconMap";

/**
 * Renders a Lucide icon by its short name from the data files.
 * Decorative by default (aria-hidden); pass `label` to expose it to screen readers.
 */
export function Icon({ name, size = 20, strokeWidth = 1.75, label, className }) {
  const Component = iconMap[name];
  if (!Component) return null;

  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
    />
  );
}
