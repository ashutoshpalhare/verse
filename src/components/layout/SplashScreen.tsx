import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for fade out
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute h-[500px] w-[500px] rounded-full bg-white/20 blur-[120px]"
          />

          <div className="relative z-10 text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-[-0.05em] text-white uppercase">
                AP <span className="text-white/40">VERSE</span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-[10px] md:text-xs font-bold tracking-[0.5em] text-white/30 uppercase"
            >
              AP'S VISUAL UNIVERSE
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
