"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

type Theme = "light" | "sepia" | "dark" | "night";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_ORDER: Theme[] = ["light", "sepia", "dark", "night"];
const STORAGE_KEY = "mehedihas-theme";

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored && THEME_ORDER.includes(stored)) return stored;
  } catch {
    // ignore — localStorage may be unavailable
  }
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy init reads from localStorage once during the first client render.
  // The inline script in root layout has already set the data-theme attr
  // before React hydrates, so there's no FOUC.
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const isFirstRender = useRef(true);

  // Sync DOM + localStorage whenever the user changes theme (not on mount).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((prev) => {
      const idx = THEME_ORDER.indexOf(prev);
      return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return safe defaults for SSR/prerendering
    return {
      theme: "light" as Theme,
      setTheme: () => {},
      cycleTheme: () => {},
    };
  }
  return context;
}
