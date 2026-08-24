import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeType = 'cinematic' | 'midnight' | 'obsidian' | 'emerald' | 'crimson';

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'cinematic',
      setTheme: (theme: ThemeType) => set({ theme }),
    }),
    {
      name: 'nova-gallery-theme',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
