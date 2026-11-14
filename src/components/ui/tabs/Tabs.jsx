import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import styles from "./Tabs.module.scss";

export function Tabs({ className, ...props }) {
  return <TabsPrimitive.Root className={cn(styles.root, className)} data-slot="tabs" {...props} />;
}

export function TabsList({ className, ...props }) {
  return <TabsPrimitive.List className={cn(styles.list, className)} data-slot="tabs-list" {...props} />;
}

export function TabsTrigger({ className, ...props }) {
  return <TabsPrimitive.Trigger className={cn(styles.trigger, className)} data-slot="tabs-trigger" {...props} />;
}

export function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content className={cn(styles.content, className)} data-slot="tabs-content" {...props} />;
}
