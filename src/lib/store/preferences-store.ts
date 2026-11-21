import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PreferencesState {
  fluidAnimations: boolean;
  interfaceScale: number;
  setFluidAnimations: (enabled: boolean) => void;
  setInterfaceScale: (scale: number) => void;
  resetPreferences: () => void;
}

const DEFAULTS = { fluidAnimations: true, interfaceScale: 100 };

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

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setFluidAnimations: (fluidAnimations) => set({ fluidAnimations }),
      setInterfaceScale: (interfaceScale) =>
        set({ interfaceScale: Math.min(120, Math.max(80, Math.round(interfaceScale / 5) * 5)) }),
      resetPreferences: () => set(DEFAULTS),
    }),
    {
      name: "nova-gallery-preferences",
      storage: createJSONStorage(() => safeStorage),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<PreferencesState>;
        return {
          ...currentState,
          fluidAnimations:
            typeof persisted.fluidAnimations === "boolean"
              ? persisted.fluidAnimations
              : DEFAULTS.fluidAnimations,
          interfaceScale:
            typeof persisted.interfaceScale === "number" &&
            Number.isFinite(persisted.interfaceScale)
              ? Math.min(120, Math.max(80, Math.round(persisted.interfaceScale / 5) * 5))
              : DEFAULTS.interfaceScale,
        };
      },
    },
  ),
);
