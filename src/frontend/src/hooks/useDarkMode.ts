import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "agrilife-dark-mode";

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY, String(isDark));
    } catch {
      // ignore
    }
  }, [isDark]);

  const toggle = useCallback((value: boolean) => {
    setIsDark(value);
  }, []);

  return { isDark, toggle };
}
