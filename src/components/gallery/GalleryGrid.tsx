import Masonry from "react-masonry-css";
import { Photo } from "../../types/photo";
import { useGalleryStore } from "../../lib/store/gallery-store";
import { PhotoCard } from "./PhotoCard";

interface GalleryGridProps {
  photos: Photo[];
  onClickPhoto: (index: number) => void;
}

export function GalleryGrid({ photos, onClickPhoto }: GalleryGridProps) {
  const viewMode = useGalleryStore((state) => state.viewMode);

  const breakpointColumns = {
    default: 5,
    1536: 5,
    1280: 4,
    1024: 3,
    768: 2,
    640: 2,
  };

  if (viewMode === 'masonry') {
    return (
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto gap-4"
        columnClassName="bg-clip-padding flex flex-col gap-4"
      >
        {photos.map((photo, index) => (
          <PhotoCard key={photo.id} photo={photo} index={index} onClick={() => onClickPhoto?.(index)} />
        ))}
      </Masonry>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {photos.map((photo, index) => (
        <PhotoCard key={photo.id} photo={photo} index={index} onClick={() => onClickPhoto?.(index)} />
      ))}
    </div>
  );
}
