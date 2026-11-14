import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import styles from "./ThemeToggle.module.scss";

const options = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
];

/** Light / dark / system switcher built on the Radix dropdown menu. */
export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { ui } = useI18n();
  const TriggerIcon = resolvedTheme === "light" ? Sun : Moon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={styles.trigger} aria-label={ui.theme.change}>
          <TriggerIcon size={18} aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          {options.map(({ value, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon size={16} aria-hidden="true" />
              {ui.theme[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Menu variant: the three choices side by side, the current one marked. */
export function ThemeSegmented({ className }) {
  const { theme, setTheme } = useTheme();
  const { ui } = useI18n();

  return (
    <div role="group" aria-label={ui.theme.change} className={cn(styles.segmented, className)}>
      {options.map(({ value, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          aria-label={ui.theme[value]}
          title={ui.theme[value]}
          className={cn(styles.option, theme === value && styles.current)}
          onClick={() => setTheme(value)}
        >
          <Icon size={16} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
