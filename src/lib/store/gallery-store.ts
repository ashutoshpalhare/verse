import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Photo } from '../../types/photo';

interface PhotoMetadata {
  title?: string;
  description?: string;
}

interface GalleryState {
  photos: Photo[];
  favorites: string[];
  viewMode: 'grid' | 'masonry';
  searchQuery: string;
  metadataOverrides: Record<string, PhotoMetadata>;
  
  setPhotos: (photos: Photo[]) => void;
  toggleFavorite: (id: string) => void;
  updatePhotoMetadata: (id: string, metadata: PhotoMetadata) => void;
  setViewMode: (mode: 'grid' | 'masonry') => void;
  setSearchQuery: (query: string) => void;
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set) => ({
      photos: [],
      favorites: [],
      viewMode: 'masonry',
      searchQuery: '',
      metadataOverrides: {},

      setPhotos: (photos: Photo[]) => set({ photos }),
      
      toggleFavorite: (id: string) => set((state) => {
        const isFavorite = state.favorites.includes(id);
        const newFavorites = isFavorite 
          ? state.favorites.filter(favId => favId !== id)
          : [...state.favorites, id];
        
        return { favorites: newFavorites };
      }),

      updatePhotoMetadata: (id: string, metadata: PhotoMetadata) => set((state) => ({
        metadataOverrides: {
          ...state.metadataOverrides,
          [id]: {
            ...state.metadataOverrides[id],
            ...metadata
          }
        }
      })),

      setViewMode: (viewMode: 'grid' | 'masonry') => set({ viewMode }),
      setSearchQuery: (searchQuery: string) => set({ searchQuery }),
    }),
    {
      name: 'nova-gallery-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        favorites: state.favorites, 
        viewMode: state.viewMode,
        metadataOverrides: state.metadataOverrides 
      }),
    }
  )
);
