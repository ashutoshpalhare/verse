import { useEffect } from "react";
import { discoverLocalImages } from "../lib/image-discovery";
import { useGalleryStore } from "../lib/store/gallery-store";

/**
 * Hydrates the shared gallery store from the build-time image manifest.
 * Call from every route that needs photos so direct URL visits work too.
 */
export function useGalleryPhotos() {
  const setPhotos = useGalleryStore((state) => state.setPhotos);

  useEffect(() => {
    setPhotos(discoverLocalImages());
  }, [setPhotos]);
}
