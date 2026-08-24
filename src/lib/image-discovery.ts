import { Photo } from "../types/photo";
import imageManifest from "../generated/image-manifest.json";

export const discoverLocalImages = (): Photo[] => {
  return imageManifest.map((filename) => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");

    const id = btoa(filename).replace(/=/g, "");

    const title = nameWithoutExt
      .split(/[-_]/)
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(" ");

    const imageUrl = `${
      import.meta.env.BASE_URL.replace(/\/$/, "")
    }/images/${encodeURIComponent(filename)}`;

    return {
      id,
      imageUrl,
      title,
      description: "Personal portrait",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).toUpperCase(),
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };
  });
};