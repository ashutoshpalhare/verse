import { Photo } from "../types/photo";

/**
 * Discovers images in the /public/images directory using Vite's glob import.
 * This happens at build time.
 */
export const discoverLocalImages = (): Photo[] => {
  // Use Vite's glob to find all images in the public/images folder
  // Note: /public is served as root / in Vite, so we glob relative to src/lib
  const imageModules = import.meta.glob([
    "/public/images/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  ], { eager: true, as: 'url' });

  return Object.entries(imageModules).map(([path, url]) => {
    // Extract filename without path and extension
    const filename = path.split('/').pop() || '';
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    
    // Stable ID based on filename
    const id = btoa(filename).replace(/=/g, "");
    
    // Format title: "photo-001" -> "Photo 001"
    const title = nameWithoutExt
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Correct URL for public assets, respecting the deployment base path
    const imageUrl = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/${filename}`;

    return {
      id,
      imageUrl,
      title,
      description: "Personal portrait",
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      }).toUpperCase(),
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };
  });
};
