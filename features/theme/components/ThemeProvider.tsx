"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "wishlist-premium-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * O tema vive no `localStorage` e na classe do `<html>`, aplicada antes do
 * primeiro paint pelo script em `app/layout.tsx`. É estado externo ao React,
 * por isso é lido com `useSyncExternalStore` em vez de ser copiado para
 * `useState` dentro de um efeito: evita o render em cascata e mantém as abas
 * abertas sincronizadas entre si.
 */
const listeners = new Set<() => void>();

function readTheme(): Theme {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "light"
      ? "light"
      : "dark";
  } catch {
    // Modo privado ou storage bloqueado: assume-se o modo primário.
    return "dark";
  }
}

function subscribe(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== THEME_STORAGE_KEY) {
      return;
    }

    // Outra aba mudou o tema: acompanhar a classe do `<html>`.
    document.documentElement.classList.toggle("dark", readTheme() === "dark");
    onStoreChange();
  };

  listeners.add(onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

// No servidor não existe `localStorage`; o dark mode é o modo primário (UI-004).
function getServerSnapshot(): Theme {
  return "dark";
}

function applyTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Sem storage o tema não persiste, mas a classe abaixo ainda o aplica.
  }

  document.documentElement.classList.toggle("dark", theme === "dark");

  for (const listener of listeners) {
    listener();
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme: theme,
      setTheme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    }),
    [setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
