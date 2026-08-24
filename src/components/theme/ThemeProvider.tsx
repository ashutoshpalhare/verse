import React, { useEffect } from 'react';
import { useThemeStore } from '../../lib/store/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-cinematic', 'theme-midnight', 'theme-obsidian', 'theme-emerald', 'theme-crimson');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  return <>{children}</>;
}
