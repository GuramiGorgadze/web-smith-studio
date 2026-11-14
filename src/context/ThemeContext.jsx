import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "wss-theme";
const DARK_COLOR = "#0d0c10";
const LIGHT_COLOR = "#fafaff";

const ThemeContext = createContext(null);

function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
  } catch {
    return "dark";
  }
}

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/**
 * Light / dark / system theme. The first paint is handled by the inline script in index.html;
 * this provider keeps React, <html data-theme> and localStorage in sync afterwards.
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);
  const [system, setSystem] = useState(systemTheme);

  const resolvedTheme = theme === "system" ? system : theme;

  useEffect(() => {
    const list = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => setSystem(list.matches ? "light" : "dark");
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", resolvedTheme);
    root.style.colorScheme = resolvedTheme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", resolvedTheme === "light" ? LIGHT_COLOR : DARK_COLOR);
  }, [resolvedTheme]);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode, blocked cookies). The theme still applies for this visit.
    }
  }, []);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>.");
  return context;
}
