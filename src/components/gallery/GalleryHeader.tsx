import { Search, Grid, LayoutGrid, User } from "lucide-react";
import { useGalleryStore } from "../../lib/store/gallery-store";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Link } from "@tanstack/react-router";
import { Input } from "../ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

export function GalleryHeader() {
  const { photos, viewMode, setViewMode, setSearchQuery } = useGalleryStore();
  const [isSearching, setIsSearching] = useState(false);
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/50 py-6 backdrop-blur-xl">
      <div className="container mx-auto px-6 flex items-end justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-sans text-3xl font-black tracking-tighter uppercase sm:text-4xl leading-none">
              AP <span className="text-white/40">VERSE</span>
            </h1>
            <p className="mt-1 text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase">
              AP'S VISUAL UNIVERSE
            </p>
          </motion.div>
          <div className="mt-4 inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-1">
            <span className="text-[9px] font-bold tracking-[0.2em] text-white/60 uppercase">
              {photos.length} PORTRAITS
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {isSearching && (
              <Input
                autoFocus
                placeholder="SEARCH UNIVERSE..."
                className="h-10 w-40 md:w-64 bg-white/5 border-white/10 rounded-full px-5 text-[10px] font-bold tracking-widest uppercase"
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !isSearching && setIsSearching(false)}
              />
            )}
            <Button 
              onClick={() => setIsSearching(!isSearching)}
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-11 w-11 rounded-full transition-all",
                isSearching ? "bg-white text-black" : "bg-white/5 text-white/70 hover:bg-white/10"
              )}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex rounded-full bg-white/5 p-1.5 border border-white/5">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewMode('grid')}
              className={cn(
                "h-8 w-8 rounded-full transition-all",
                viewMode === 'grid' ? "bg-white/10 text-white" : "text-white/40"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewMode('masonry')}
              className={cn(
                "h-8 w-8 rounded-full transition-all",
                viewMode === 'masonry' ? "bg-white/10 text-white" : "text-white/40"
              )}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all border border-white/5" asChild>
            <Link to="/about">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
