import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useGalleryStore } from "../lib/store/gallery-store";
import { discoverLocalImages } from "../lib/image-discovery";
import { GalleryHeader } from "../components/gallery/GalleryHeader";
import { GalleryGrid } from "../components/gallery/GalleryGrid";
import { BottomNavigation } from "../components/gallery/BottomNavigation";
import { PhotoViewer } from "../components/gallery/PhotoViewer";
import { AnimatePresence, motion } from "framer-motion";
import { ImageOff, RefreshCw } from "lucide-react";
import { SplashScreen } from "../components/layout/SplashScreen";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
 head: () => ({
  meta: [
    {
      title: "AP VERSE — AP's Visual Universe",
    },
    {
      name: "description",
      content:
        "AP VERSE — a cinematic personal portrait gallery and visual universe of Ashutosh Palhare.",
    },
    {
      name: "author",
      content: "Ashutosh Palhare",
    },
    {
      name: "robots",
      content: "index, follow",
    },

    // Open Graph
    {
      property: "og:title",
      content: "AP VERSE — AP's Visual Universe",
    },
    {
      property: "og:description",
      content:
        "A cinematic personal portrait gallery and visual universe of Ashutosh Palhare.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://ashutoshpalhare.github.io/verse/",
    },
    {
      property: "og:site_name",
      content: "AP VERSE",
    },

    // Twitter / X
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "AP VERSE — AP's Visual Universe",
    },
    {
      name: "twitter:description",
      content:
        "A cinematic personal portrait gallery and visual universe by Ashutosh Palhare.",
    },
  ],
}),
});

function Index() {
  const { photos, setPhotos, favorites, metadataOverrides, searchQuery } = useGalleryStore();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const discovered = discoverLocalImages();
    setPhotos(discovered);
  }, [setPhotos]);

  const processedPhotos = useMemo(() => {
    return photos.map(photo => ({
      ...photo,
      isFavorite: favorites.includes(photo.id),
      title: metadataOverrides[photo.id]?.title || photo.title,
      description: metadataOverrides[photo.id]?.description || photo.description
    })).filter(photo => {
      const search = searchQuery.toLowerCase();
      return photo.title.toLowerCase().includes(search) || 
             photo.description.toLowerCase().includes(search);
    });
  }, [photos, favorites, metadataOverrides, searchQuery]);

  const handleOpenViewer = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseViewer = () => {
    setSelectedPhotoIndex(null);
  };

  const handleNext = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % processedPhotos.length);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + processedPhotos.length) % processedPhotos.length);
    }
  };

  return (
    <>
      <SplashScreen onComplete={() => setShowSplash(false)} />
      
      <main className="min-h-screen bg-background text-foreground pb-32">
        <GalleryHeader />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: showSplash ? 0 : 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 pt-8"
        >
          {processedPhotos.length > 0 ? (
            <GalleryGrid photos={processedPhotos} onClickPhoto={handleOpenViewer} />
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-8 ring-1 ring-white/10">
                <ImageOff className="h-10 w-10 text-white/20" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">
                AP VERSE IS EMPTY
              </h2>
              <p className="text-sm text-white/40 max-w-xs mb-8 leading-relaxed">
                Add your portraits to the <code className="bg-white/10 px-2 py-0.5 rounded text-white/60">/images</code> folder and build your visual universe.
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold tracking-[0.2em] uppercase px-8 h-12 transition-all"
              >
                <RefreshCw className="mr-2 h-3 w-3" /> Refresh Universe
              </Button>
            </div>
          )}
        </motion.div>

        <BottomNavigation />

        <AnimatePresence>
          {selectedPhotoIndex !== null && processedPhotos[selectedPhotoIndex] && (
            <PhotoViewer
              photo={processedPhotos[selectedPhotoIndex]!}
              currentIndex={selectedPhotoIndex}
              total={processedPhotos.length}
              onClose={handleCloseViewer}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
