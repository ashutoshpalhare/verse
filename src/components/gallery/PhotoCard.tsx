import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { Photo } from "../../types/photo";
import { useGalleryStore } from "../../lib/store/gallery-store";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onClick: () => void;
}

export const PhotoCard = memo(({ photo, index, onClick }: PhotoCardProps) => {
  const toggleFavorite = useGalleryStore((state) => state.toggleFavorite);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : {
        duration: 0.35,
        delay: Math.min(index * 0.035, 0.6),
        ease: [0.23, 1, 0.32, 1],
      }}
      className="group relative overflow-hidden rounded-[18px] border border-white/10 bg-secondary/20 shadow-2xl"
    >
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={`Open photo: ${photo.title}`}
        className="relative block w-full cursor-pointer overflow-hidden text-left focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        {...(!reduceMotion ? { whileHover: { scale: 1.015 }, whileTap: { scale: 0.99 } } : {})}
      >
        <div className="aspect-auto overflow-hidden">
          <img
            src={photo.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className={cn(
              "h-full w-full object-cover",
              !reduceMotion && "transition-transform duration-700 ease-out group-hover:scale-110 group-focus-visible:scale-105"
            )}
          />
        </div>

        <div className={cn(
          "absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 text-white sm:p-6",
          "opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        )}>
          <h3 className="font-sans text-base font-bold tracking-tight uppercase sm:text-xl">
            {photo.title}
          </h3>
          {photo.description && (
            <p className="mt-1 line-clamp-2 text-xs text-white/75 sm:text-sm">
              {photo.description}
            </p>
          )}
          <span className="mt-3 text-[9px] font-medium tracking-[0.2em] text-white/70 uppercase">
            {photo.date}
          </span>
        </div>
      </motion.button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={photo.isFavorite ? `Remove ${photo.title} from favorites` : `Add ${photo.title} to favorites`}
        aria-pressed={photo.isFavorite}
        onClick={() => toggleFavorite(photo.id)}
        className={cn(
          "absolute right-3 top-3 z-20 h-10 w-10 rounded-full border border-white/15 bg-black/65 text-white shadow-lg backdrop-blur-md",
          "opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100",
          photo.isFavorite && "text-red-400 sm:opacity-100"
        )}
      >
        <Heart className={cn("h-4 w-4", photo.isFavorite && "fill-current")} />
      </Button>
    </motion.div>
  );
});

PhotoCard.displayName = "PhotoCard";
