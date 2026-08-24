import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: Math.min(index * 0.05, 1),
        ease: [0.23, 1, 0.32, 1]
      }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-[18px] border border-white/5 bg-secondary/20 shadow-2xl transition-all duration-500"
    >
      <div className="aspect-auto overflow-hidden">
        <motion.img
          src={photo.imageUrl}
          alt={photo.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          initial={false}
          animate={{ filter: isHovered ? "brightness(0.7)" : "brightness(1)" }}
        />
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 text-white"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="font-sans text-xl font-bold tracking-tight uppercase">
                {photo.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-white/70">
                {photo.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">
                  {photo.date}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full transition-colors",
                    photo.isFavorite ? "text-red-500 hover:text-red-600" : "text-white/70 hover:text-white"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(photo.id);
                  }}
                >
                  <Heart className={cn("h-4 w-4", photo.isFavorite && "fill-current")} />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {photo.isFavorite && !isHovered && (
        <div className="absolute top-4 right-4">
          <Heart className="h-4 w-4 fill-red-500 text-red-500 drop-shadow-lg" />
        </div>
      )}
    </motion.div>
  );
});

PhotoCard.displayName = "PhotoCard";
