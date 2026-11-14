import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/context/ThemeContext";

/** Sonner toaster themed with the site's CSS variables. Mount once near the app root. */
export function Toaster(props) {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme}
      position="bottom-right"
      closeButton
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border-strong)",
        "--success-bg": "var(--popover)",
        "--success-text": "var(--popover-foreground)",
        "--success-border": "color-mix(in srgb, var(--success) 40%, var(--border-strong))",
        "--error-bg": "var(--popover)",
        "--error-text": "var(--popover-foreground)",
        "--error-border": "color-mix(in srgb, var(--destructive) 45%, var(--border-strong))",
        "--border-radius": "16px",
        fontFamily: "var(--font-sans)",
      }}
      {...props}
    />
  );
}
