import { createFileRoute } from "@tanstack/react-router";
import { useGalleryStore } from "../lib/store/gallery-store";
import { GalleryGrid } from "../components/gallery/GalleryGrid";
import { BottomNavigation } from "../components/gallery/BottomNavigation";
import { PhotoViewer } from "../components/gallery/PhotoViewer";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useGalleryPhotos } from "../hooks/use-gallery-photos";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favorites")({
  component: Favorites,
  head: () => ({
    meta: [
      { title: "Favorites | AP VERSE" },
      { name: "description", content: "Your locally curated favorite portraits in AP VERSE." },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
});

function Favorites() {
  const { photos, favorites, metadataOverrides } = useGalleryStore();
  useGalleryPhotos();
  
  const favoritePhotos = useMemo(() => {
    return photos
      .filter(p => favorites.includes(p.id))
      .map(photo => ({
        ...photo,
        isFavorite: true,
        title: metadataOverrides[photo.id]?.title || photo.title,
        description: metadataOverrides[photo.id]?.description || photo.description
      }));
  }, [photos, favorites, metadataOverrides]);

  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const selectedPhotoIndex = selectedPhotoId
    ? favoritePhotos.findIndex((photo) => photo.id === selectedPhotoId)
    : -1;

  useEffect(() => {
    if (selectedPhotoId && selectedPhotoIndex < 0) setSelectedPhotoId(null);
  }, [selectedPhotoId, selectedPhotoIndex]);

  const handleOpenViewer = (index: number) => {
    const photo = favoritePhotos[index];
    if (photo) setSelectedPhotoId(photo.id);
  };
  const handleCloseViewer = () => setSelectedPhotoId(null);

  const handleNext = () => {
    if (selectedPhotoIndex >= 0 && favoritePhotos.length > 0) {
      setSelectedPhotoId(favoritePhotos[(selectedPhotoIndex + 1) % favoritePhotos.length]!.id);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex >= 0 && favoritePhotos.length > 0) {
      setSelectedPhotoId(favoritePhotos[(selectedPhotoIndex - 1 + favoritePhotos.length) % favoritePhotos.length]!.id);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-32">
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/50 py-8 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4">
            <Heart className="h-6 w-6 text-red-500 fill-current" />
            <div className="flex flex-col">
              <h1 className="font-sans text-3xl font-black tracking-tighter uppercase leading-none">FAVORITES</h1>
              <p className="mt-1 text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase">
                CURATED MOMENTS
              </p>
            </div>
          </div>
          <div className="mt-6 inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-1">
            <span className="text-[9px] font-bold tracking-[0.2em] text-white/60 uppercase">
              {favoritePhotos.length} CURATED SHOTS
            </span>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-6 pt-8">
        {favoritePhotos.length > 0 ? (
          <GalleryGrid photos={favoritePhotos} onClickPhoto={handleOpenViewer} />
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6 ring-1 ring-white/10"
            >
              <Heart className="h-8 w-8 text-white/10" />
            </motion.div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-white/40">Empty Archive</h2>
            <p className="text-sm text-white/20 mt-3 max-w-[200px]">Start favoriting portraits to build your curated universe.</p>
          </div>
        )}
      </div>

      <BottomNavigation />

      <AnimatePresence>
        {selectedPhotoIndex >= 0 && favoritePhotos[selectedPhotoIndex] && (
          <PhotoViewer
            photo={favoritePhotos[selectedPhotoIndex]!}
            currentIndex={selectedPhotoIndex}
            total={favoritePhotos.length}
            onClose={handleCloseViewer}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
