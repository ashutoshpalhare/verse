import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Photo } from "../../types/photo";

interface PhotoMetadata {
  title?: string;
  description?: string;
}

export interface ArchiveImportPayload {
  version: 1;
  favorites: string[];
  metadataOverrides: Record<string, PhotoMetadata>;
}

interface GalleryState {
  photos: Photo[];
  favorites: string[];
  viewMode: "grid" | "masonry";
  searchQuery: string;
  metadataOverrides: Record<string, PhotoMetadata>;
  setPhotos: (photos: Photo[], pruneOrphans?: boolean) => void;
  toggleFavorite: (id: string) => void;
  updatePhotoMetadata: (id: string, metadata: PhotoMetadata) => void;
  setViewMode: (mode: "grid" | "masonry") => void;
  setSearchQuery: (query: string) => void;
  importArchiveData: (payload: ArchiveImportPayload) => void;
  resetArchiveData: () => void;
}

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
      // Keep the app usable when browser storage is unavailable or full.
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window !== "undefined") window.localStorage.removeItem(name);
    } catch {
      // Ignore storage access failures; in-memory state remains available.
    }
  },
};

function sanitizeFavorites(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0))];
}

function sanitizeMetadata(value: unknown): Record<string, PhotoMetadata> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Record<string, PhotoMetadata> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!id || id === "__proto__" || id === "constructor" || id === "prototype" || !raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const item = raw as Record<string, unknown>;
    const metadata: PhotoMetadata = {};
    if (typeof item["title"] === "string") metadata.title = item.title.slice(0, 300);
    if (typeof item["description"] === "string") metadata.description = item.description.slice(0, 5000);
    if (Object.keys(metadata).length) result[id] = metadata;
  }
  return result;
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set) => ({
      photos: [],
      favorites: [],
      viewMode: "masonry",
      searchQuery: "",
      metadataOverrides: {},

      setPhotos: (photos, pruneOrphans = true) =>
        set((state) => {
          const validIds = new Set(photos.map((photo) => photo.id));
          const legacyToStable = new Map<string, string>();

          for (const photo of photos) {
            for (const legacyId of photo.legacyIds ?? []) {
              legacyToStable.set(legacyId, photo.id);
            }
          }

          const migrateId = (id: string) => legacyToStable.get(id) ?? id;
          const favorites = pruneOrphans
            ? [...new Set(state.favorites.map(migrateId).filter((id) => validIds.has(id)))]
            : [...new Set(state.favorites.map(migrateId))];

          let metadataOverrides = state.metadataOverrides;
          if (pruneOrphans) {
            metadataOverrides = {};
            // Apply legacy entries first so an already-migrated stable entry wins.
            const entries = Object.entries(state.metadataOverrides).sort(
              ([left], [right]) => Number(validIds.has(left)) - Number(validIds.has(right)),
            );
            for (const [oldId, metadata] of entries) {
              const id = migrateId(oldId);
              if (validIds.has(id)) {
                metadataOverrides[id] = { ...metadataOverrides[id], ...metadata };
              }
            }
          } else {
            metadataOverrides = Object.fromEntries(
              Object.entries(state.metadataOverrides).map(([id, metadata]) => [migrateId(id), metadata]),
            );
          }

          return {
            photos: photos.map((photo) => ({
              ...photo,
              isFavorite: favorites.includes(photo.id),
            })),
            favorites,
            metadataOverrides,
          };
        }),
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((favoriteId) => favoriteId !== id)
            : [...state.favorites, id],
        })),
      updatePhotoMetadata: (id, metadata) =>
        set((state) => ({
          metadataOverrides: {
            ...state.metadataOverrides,
            [id]: { ...state.metadataOverrides[id], ...metadata },
          },
        })),
      setViewMode: (viewMode) => set({ viewMode }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      importArchiveData: (payload) =>
        set((state) => ({
          favorites: [...new Set([...state.favorites, ...sanitizeFavorites(payload.favorites)])],
          metadataOverrides: {
            ...state.metadataOverrides,
            ...sanitizeMetadata(payload.metadataOverrides),
          },
        })),
      resetArchiveData: () => set({ favorites: [], metadataOverrides: {} }),
    }),
    {
      name: "nova-gallery-storage",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        viewMode: state.viewMode,
        metadataOverrides: state.metadataOverrides,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<GalleryState>;
        return {
          ...currentState,
          favorites: sanitizeFavorites(persisted.favorites),
          viewMode: persisted.viewMode === "grid" ? "grid" : "masonry",
          metadataOverrides: sanitizeMetadata(persisted.metadataOverrides),
        };
      },
    },
  ),
);
