import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Check,
  Info,
  LoaderCircle,
  ImageOff,
} from "lucide-react";
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (!photo) return;
    setEditTitle(photo.title);
    setEditDescription(photo.description);
    setIsEditing(false);
    setImageLoaded(false);
    setImageFailed(false);
  }, [photo?.id]);

  // Lock the page behind the viewer without losing its exact scroll position.
  useEffect(() => {
    if (!photo) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [photo?.id]);

  // Swipe handling: horizontal swipes navigate; a deliberate downward swipe closes.
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useGesture({
    onDrag: ({ active, movement: [mx, my], last }) => {
      if (active) {
        api.start({ x: mx * 0.55, y: my * 0.35, immediate: true });
        return;
      }
      if (last && Math.abs(mx) > 90 && Math.abs(mx) > Math.abs(my)) {
        mx > 0 ? onPrev() : onNext();
      } else if (last && my > 140 && my > Math.abs(mx)) {
        onClose();
      }
      api.start({ x: 0, y: 0, immediate: false });
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        !!target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (isEditable || e.altKey || e.ctrlKey || e.metaKey || e.repeat) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key.toLowerCase() === "f" && photo) {
        e.preventDefault();
        toggleFavorite(photo.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev, photo, toggleFavorite]);

  const handleSaveMetadata = () => {
    if (!photo) return;
    updatePhotoMetadata(photo.id, {
      title: editTitle.trim() || photo.title,
      description: editDescription.trim(),
    });
    setIsEditing(false);
  };

  if (!photo) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer: ${photo.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-hidden bg-black/95 backdrop-blur-3xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 scale-150 opacity-20 blur-[100px]"
        style={{ backgroundImage: `url(${photo.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />

      {/* Compact header stays visible at every viewport size. */}
      <header className="relative z-20 flex w-full shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <div className="flex shrink-0 flex-col">
            <span className="text-[11px] font-black uppercase leading-none tracking-[-0.02em] text-white">
              AP <span className="text-white/40">VERSE</span>
            </span>
            <span className="mt-1 text-[7px] font-bold uppercase tracking-[0.2em] text-white/30">
              Visual Universe
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">
            {currentIndex + 1} / {total}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={photo.isFavorite ? "Remove from favorites" : "Add to favorites"}
            onClick={() => toggleFavorite(photo.id)}
            className={cn(
              "h-9 w-9 rounded-full sm:h-10 sm:w-10",
              photo.isFavorite ? "text-red-500" : "text-white/70 hover:text-white"
            )}
          >
            <Heart className={cn("h-5 w-5", photo.isFavorite && "fill-current")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={showMetadata ? "Hide photo details" : "Show photo details"}
            aria-pressed={showMetadata}
            onClick={() => setShowMetadata((value) => !value)}
            className="h-9 w-9 rounded-full text-white/70 hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
          >
            <Info className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close photo viewer"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Image gets the available viewport height; metadata never pushes it off-screen. */}
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-2 pb-2 sm:px-5 sm:pb-4 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous photo"
          onClick={onPrev}
          className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-white/5 text-white/75 hover:bg-white/10 hover:text-white md:flex"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <animated.div
          {...bind()}
          style={{ x, y, touchAction: "pan-y" }}
          className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden"
        >
          {!imageLoaded && !imageFailed && (
            <div className="absolute inset-0 flex items-center justify-center" aria-label="Loading photo">
              <LoaderCircle className="h-7 w-7 animate-spin text-white/45" />
            </div>
          )}

          {imageFailed ? (
            <div className="flex flex-col items-center gap-3 text-center text-white/50" role="status">
              <ImageOff className="h-9 w-9" />
              <p className="text-xs uppercase tracking-[0.2em]">This photo could not be loaded</p>
            </div>
          ) : (
            <motion.img
              key={photo.id}
              src={photo.imageUrl}
              alt={photo.title}
              draggable={false}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageFailed(true);
                setImageLoaded(false);
              }}
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: imageLoaded ? 1 : 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="h-auto w-auto max-h-full max-w-full select-none rounded-md object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] sm:rounded-lg"
            />
          )}
        </animated.div>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Next photo"
          onClick={onNext}
          className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-white/5 text-white/75 hover:bg-white/10 hover:text-white md:flex"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {showMetadata && (
          <motion.aside
            key="photo-metadata"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-20 max-h-[30dvh] shrink-0 overflow-y-auto border-t border-white/10 bg-black/45 px-4 py-3 backdrop-blur-xl sm:px-8 sm:py-4 lg:absolute lg:bottom-6 lg:right-6 lg:max-h-[65vh] lg:w-[320px] lg:rounded-2xl lg:border lg:bg-black/45 lg:p-6"
          >
            <MetadataPanel
              photo={photo}
              align="center"
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editDescription={editDescription}
              setEditDescription={setEditDescription}
              onSave={handleSaveMetadata}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface MetadataPanelProps {
  photo: Photo;
  align: "left" | "center";
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  editTitle: string;
  setEditTitle: (value: string) => void;
  editDescription: string;
  setEditDescription: (value: string) => void;
  onSave: () => void;
}

function MetadataPanel({
  photo,
  align,
  isEditing,
  setIsEditing,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  onSave,
}: MetadataPanelProps) {
  const centered = align === "center";

  if (isEditing) {
    return (
      <div className={cn("space-y-3", centered && "mx-auto max-w-lg")}>
        <Input
          aria-label="Photo title"
          value={editTitle}
          onChange={(event) => setEditTitle(event.target.value)}
          className={cn(
            "border-white/10 bg-white/5 text-lg font-black uppercase tracking-tighter text-white sm:text-2xl",
            centered ? "text-center" : "text-left"
          )}
        />
        <Textarea
          aria-label="Photo description"
          value={editDescription}
          onChange={(event) => setEditDescription(event.target.value)}
          className={cn(
            "border-white/10 bg-white/5 text-sm text-white/70",
            centered ? "text-center" : "text-left"
          )}
        />
        <div className={cn("flex gap-2", centered ? "justify-center" : "justify-start")}>
          <Button onClick={onSave} size="sm" className="bg-white font-bold uppercase tracking-widest text-black hover:bg-white/90">
            <Check className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button
            onClick={() => setIsEditing(false)}
            variant="ghost"
            size="sm"
            className="text-[10px] uppercase tracking-widest text-white/50"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={centered ? "text-center" : "text-left"}>
      <h2 className={cn(
        "font-sans text-xl font-black uppercase tracking-tighter text-white sm:text-2xl",
        centered && "sm:text-3xl lg:text-2xl"
      )}>
        {photo.title}
      </h2>
      {photo.description && (
        <p className={cn("mt-2 text-xs leading-relaxed text-white/60 sm:text-sm", centered && "mx-auto max-w-lg")}>
          {photo.description}
        </p>
      )}
      <div className={cn("mt-3 flex flex-wrap items-center gap-3", centered ? "justify-center" : "justify-start")}>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-white/40">
          {photo.date}
        </span>
        <Button
          onClick={() => setIsEditing(true)}
          variant="ghost"
          size="sm"
          className="h-8 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 hover:text-white"
        >
          <Edit2 className="mr-2 h-3 w-3" /> Edit info
        </Button>
      </div>
    </div>
  );
}
