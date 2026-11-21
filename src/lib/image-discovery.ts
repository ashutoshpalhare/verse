import { Photo } from "../types/photo";
import imageManifest from "../generated/image-manifest.json";

type ManifestImage = {
  id: string;
  filename: string;
  size: number;
  legacyIds: string[];
};

type ImageManifest = {
  version: 2;
  images: ManifestImage[];
};

const manifest = imageManifest as unknown as ImageManifest;

export const discoverLocalImages = (): Photo[] => {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return manifest.images.map((image) => {
    const filename = image.filename.split("/").pop() ?? image.filename;
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const title = nameWithoutExt
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Encode each path segment separately so nested folders remain valid URLs.
    const encodedPath = image.filename.split("/").map(encodeURIComponent).join("/");
    const imageUrl = `${basePath}/images/${encodedPath}`;

    return {
      id: image.id,
      legacyIds: image.legacyIds,
      imageUrl,
      title,
      description: "Personal portrait",
      date: new Date()
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toUpperCase(),
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };
  });
};
