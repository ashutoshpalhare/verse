import React, { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { useThemeStore } from "../../lib/store/theme-store";
import { usePreferencesStore } from "../../lib/store/preferences-store";

const THEME_CLASSES = [
  "theme-cinematic",
  "theme-midnight",
  "theme-obsidian",
  "theme-emerald",
  "theme-crimson",
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const fluidAnimations = usePreferencesStore((state) => state.fluidAnimations);
  const interfaceScale = usePreferencesStore((state) => state.interfaceScale);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(...THEME_CLASSES);
    root.classList.add(`theme-${theme}`);
    root.dataset.fluidAnimations = String(fluidAnimations);
    root.style.fontSize = `${interfaceScale}%`;
  }, [theme, fluidAnimations, interfaceScale]);

  return (
    <MotionConfig reducedMotion={fluidAnimations ? "user" : "always"}>
      {children}
    </MotionConfig>
  );
}
