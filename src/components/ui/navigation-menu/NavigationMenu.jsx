import { ChevronDown } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./NavigationMenu.module.scss";

/** Desktop navigation with animated dropdown viewport (Radix NavigationMenu). */
export function NavigationMenu({ className, children, ...props }) {
  return (
    <NavigationMenuPrimitive.Root className={cn(styles.root, className)} data-slot="navigation-menu" {...props}>
      {children}
      <div className={styles.viewportWrap}>
        <NavigationMenuPrimitive.Viewport className={styles.viewport} />
      </div>
    </NavigationMenuPrimitive.Root>
  );
}

export function NavigationMenuList({ className, ...props }) {
  return <NavigationMenuPrimitive.List className={cn(styles.list, className)} {...props} />;
}

export function NavigationMenuItem(props) {
  return <NavigationMenuPrimitive.Item {...props} />;
}

export function NavigationMenuTrigger({ className, children, ...props }) {
  return (
    <NavigationMenuPrimitive.Trigger className={cn(styles.trigger, className)} {...props}>
      {children}
      <ChevronDown size={14} className={styles.chevron} aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  );
}

export function NavigationMenuContent({ className, ...props }) {
  return <NavigationMenuPrimitive.Content className={cn(styles.content, className)} {...props} />;
}

/** `unstyled` skips the pill styling, for rich links that bring their own layout (like the services menu). */
export function NavigationMenuLink({ className, unstyled = false, ...props }) {
  return <NavigationMenuPrimitive.Link className={cn(!unstyled && styles.link, className)} {...props} />;
}
