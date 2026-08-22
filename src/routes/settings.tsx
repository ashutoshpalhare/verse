import { createFileRoute } from "@tanstack/react-router";
import { BottomNavigation } from "../components/gallery/BottomNavigation";
import { Button } from "../components/ui/button";
import { 
  Smartphone, 
  Zap, 
  Database, 
  LogOut,
  Palette,
  Check
} from "lucide-react";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import { useThemeStore, ThemeType } from "../lib/store/theme-store";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

export const Route = createFileRoute("/settings")({
  component: Settings,
  head: () => ({
    meta: [
      { title: "SETTINGS | AP VERSE" },
    ],
  }),
});

const THEMES: { id: ThemeType; name: string; color: string }[] = [
  { id: 'cinematic', name: 'Cinematic', color: 'bg-white' },
  { id: 'midnight', name: 'Midnight', color: 'bg-blue-500' },
  { id: 'obsidian', name: 'Obsidian', color: 'bg-zinc-800' },
  { id: 'emerald', name: 'Emerald', color: 'bg-emerald-500' },
  { id: 'crimson', name: 'Crimson', color: 'bg-red-500' },
];

function Settings() {
  const { theme, setTheme } = useThemeStore();

  return (
    <main className="min-h-screen bg-background text-foreground pb-32 transition-colors duration-500">
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/50 py-8 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex flex-col">
            <h1 className="font-sans text-3xl font-black tracking-tighter uppercase leading-none">
              AP <span className="text-white/40">VERSE</span>
            </h1>
            <p className="mt-1 text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">
              AP'S VISUAL UNIVERSE
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-6 pt-8 space-y-12">
        {/* Profile Section */}
        <section>
          <h2 className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase mb-6">Archive Profile</h2>
          <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-6 border border-white/5">
            <div className="h-16 w-16 rounded-full overflow-hidden border border-white/10">
              <img src="https://github.com/ashutoshpalhare.png" alt="Ashutosh Palhare" className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-lg uppercase tracking-tight">Ashutosh Palhare</h3>
              <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">ADMINISTRATOR</p>
            </div>
            <div className="ml-auto px-3 py-1 rounded-full bg-white/10 border border-white/10">
              <span className="text-[8px] font-bold text-white/60 tracking-widest uppercase">Verified</span>
            </div>
          </div>
        </section>

        {/* Theme Picker */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="h-4 w-4 text-white/40" />
            <h2 className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">Interface Themes</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "relative flex flex-col items-start p-4 rounded-xl border transition-all duration-300 text-left",
                  theme === t.id 
                    ? "bg-white/10 border-white/20 ring-1 ring-white/20" 
                    : "bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10"
                )}
              >
                <div className={cn("h-4 w-4 rounded-full mb-3", t.color)} />
                <span className="text-xs font-bold tracking-tight uppercase">{t.name}</span>
                {theme === t.id && (
                  <motion.div 
                    layoutId="theme-check"
                    className="absolute top-4 right-4"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Gallery Appearance */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase mb-6">Universe Parameters</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-white/40" />
                <span className="text-sm font-medium">Fluid Animations</span>
              </div>
              <Switch checked />
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-white/40" />
                  <span className="text-sm font-medium">Interface Scale</span>
                </div>
                <span className="text-xs text-white/40">100%</span>
              </div>
              <Slider defaultValue={[100]} max={120} min={80} step={5} />
            </div>
          </div>
        </section>

        {/* Storage Stats */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase mb-6">Archive Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/5 p-6 border border-white/5">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Portraits</span>
              <p className="mt-2 text-2xl font-black">ACTIVE</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-6 border border-white/5">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Sync</span>
              <p className="mt-2 text-2xl font-black font-mono">LOCAL</p>
            </div>
          </div>
          <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white/70">
            <Database className="mr-2 h-4 w-4" /> Export Archive Data
          </Button>
        </section>

        {/* Footer actions */}
        <div className="pt-8 space-y-4">
          <Button variant="ghost" className="w-full text-white/30 hover:text-red-500 hover:bg-red-500/5 transition-colors">
            <LogOut className="mr-2 h-4 w-4" /> Reset Settings
          </Button>
          <p className="text-center text-[8px] font-bold tracking-[0.6em] text-white/10 uppercase">
            AP VERSE V1.0.42 · PERSONAL ARCHIVE
          </p>
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}
