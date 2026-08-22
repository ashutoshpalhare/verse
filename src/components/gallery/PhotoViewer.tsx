import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ChevronLeft, ChevronRight, Edit2, Check } from "lucide-react";
import { Photo } from "../../types/photo";
import { useGalleryStore } from "../../lib/store/gallery-store";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface PhotoViewerProps {
  photo: Photo | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  total: number;
}

export function PhotoViewer({ photo, onClose, onNext, onPrev, currentIndex, total }: PhotoViewerProps) {
  const toggleFavorite = useGalleryStore((state) => state.toggleFavorite);
  const updatePhotoMetadata = useGalleryStore((state) => state.updatePhotoMetadata);
  const [showMetadata, setShowMetadata] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (photo) {
      setEditTitle(photo.title);
      setEditDescription(photo.description);
    }
  }, [photo]);

  // Swipe handling
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  
  const bind = useGesture({
    onDrag: ({ active, movement: [mx, my], direction: [dx, dy], velocity: [vx, vy], cancel }) => {
      if (active) {
        api.start({ x: mx, y: my, immediate: true });
      } else {
        if (Math.abs(mx) > 100 && vx > 0.5) {
          mx > 0 ? onPrev() : onNext();
          api.start({ x: 0, y: 0, immediate: false });
        } else if (my > 150 && vy > 0.5) {
          onClose();
        } else {
          api.start({ x: 0, y: 0, immediate: false });
        }
      }
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "f") photo && toggleFavorite(photo.id);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev, photo, toggleFavorite]);

  const handleSaveMetadata = () => {
    if (photo) {
      updatePhotoMetadata(photo.id, {
        title: editTitle,
        description: editDescription
      });
      setIsEditing(false);
    }
  };

  if (!photo) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-3xl"
    >
      {/* Background Blur Image */}
      <div 
        className="absolute inset-0 z-0 opacity-20 blur-[100px] scale-150 pointer-events-none"
        style={{ backgroundImage: `url(${photo.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Top Header */}
      <div className="relative z-10 flex w-full items-center justify-between p-6">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-black tracking-[-0.02em] text-white uppercase leading-none">
              AP <span className="text-white/40">VERSE</span>
            </span>
            <span className="text-[7px] font-bold tracking-[0.2em] text-white/20 uppercase mt-0.5">
              Visual Universe
            </span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">
            {currentIndex + 1} / {total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full transition-colors",
              photo.isFavorite ? "text-red-500" : "text-white/70"
            )}
            onClick={() => toggleFavorite(photo.id)}
          >
            <Heart className={cn("h-5 w-5", photo.isFavorite && "fill-current")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Photo Area */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-4 md:p-12 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          className="absolute left-6 z-20 hidden h-12 w-12 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white md:flex"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <animated.div
          {...bind()}
          style={{ x, y, touchAction: 'none' }}
          className="relative max-h-full max-w-full shadow-2xl"
        >
          <motion.img
            key={photo.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            src={photo.imageUrl}
            alt={photo.title}
            className="max-h-[60vh] md:max-h-[70vh] w-auto rounded-lg object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          />
        </animated.div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          className="absolute right-6 z-20 hidden h-12 w-12 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white md:flex"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Metadata */}
      <AnimatePresence>
        {showMetadata && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative z-10 w-full p-8 md:p-12"
          >
            <div className="mx-auto max-w-2xl text-center">
              {isEditing ? (
                <div className="space-y-4 max-w-lg mx-auto">
                  <Input 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="bg-white/5 border-white/10 text-center text-2xl font-black tracking-tighter uppercase"
                  />
                  <Textarea 
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="bg-white/5 border-white/10 text-center text-sm text-white/60"
                  />
                  <div className="flex justify-center gap-2">
                    <Button onClick={handleSaveMetadata} size="sm" className="bg-white text-black font-bold uppercase tracking-widest hover:bg-white/90">
                      <Check className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" className="text-white/40 uppercase tracking-widest text-[10px]">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-sans text-3xl font-black tracking-tighter text-white uppercase md:text-5xl">
                    {photo.title}
                  </h2>
                  <p className="mt-3 text-sm text-white/60 md:text-base max-w-lg mx-auto">
                    {photo.description}
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <span className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase border border-white/10 px-3 py-1 rounded-full">
                      {photo.date}
                    </span>
                    <Button 
                      onClick={() => setIsEditing(true)}
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase hover:text-white"
                    >
                      <Edit2 className="mr-2 h-3 w-3" /> Edit info
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
