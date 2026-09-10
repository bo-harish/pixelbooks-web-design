import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { ThemeContext, type Theme } from "@/hooks/theme-context";
const STORAGE_KEY = "pixelbooks-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isPbWeb = pathname.startsWith("/pb-web");

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isPbWeb) {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    } else {
      root.classList.toggle("dark", theme === "dark");
      root.style.colorScheme = theme;
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme, isPbWeb]);

  const toggle = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
