import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ThemeType = "cinematic" | "midnight" | "obsidian" | "emerald" | "crimson";

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  resetTheme: () => void;
}

const THEMES: ThemeType[] = ["cinematic", "midnight", "obsidian", "emerald", "crimson"];

const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return typeof window === "undefined" ? null : window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(name, value);
    } catch {
      // Keep in-memory preferences usable when storage is unavailable.
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window !== "undefined") window.localStorage.removeItem(name);
    } catch {
      // Ignore storage access failures.
    }
  },
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "cinematic",
      setTheme: (theme) => set({ theme }),
      resetTheme: () => set({ theme: "cinematic" }),
    }),
    {
      name: "nova-gallery-theme",
      storage: createJSONStorage(() => safeStorage),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<ThemeState>;
        return {
          ...currentState,
          theme: THEMES.includes(persisted.theme as ThemeType)
            ? (persisted.theme as ThemeType)
            : "cinematic",
        };
      },
    },
  ),
);
