import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";
import styles from "./IconTile.module.scss";

/** Rounded square that frames an icon. Pass an icon `name` from the data files or any node as `children`. */
export function IconTile({ name, size = 22, className, children }) {
  return <span className={cn(styles.tile, className)}>{children ?? <Icon name={name} size={size} />}</span>;
}
