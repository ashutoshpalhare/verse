import { useMemo, useRef } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Smartphone,
  Zap,
  Database,
  Palette,
  Check,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Heart,
  Image as ImageIcon,
  FileJson,
} from "lucide-react";
import { toast } from "sonner";
import { BottomNavigation } from "../components/gallery/BottomNavigation";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { useThemeStore, ThemeType } from "../lib/store/theme-store";
import { usePreferencesStore } from "../lib/store/preferences-store";
import { useGalleryStore, ArchiveImportPayload } from "../lib/store/gallery-store";
import { useGalleryPhotos } from "../hooks/use-gallery-photos";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

export const Route = createFileRoute("/settings")({
  component: Settings,
  head: () => ({ meta: [
    { title: "Settings | AP VERSE" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
});

const THEMES: { id: ThemeType; name: string; color: string }[] = [
  { id: "cinematic", name: "Cinematic", color: "bg-white" },
  { id: "midnight", name: "Midnight", color: "bg-blue-500" },
  { id: "obsidian", name: "Obsidian", color: "bg-zinc-800" },
  { id: "emerald", name: "Emerald", color: "bg-emerald-500" },
  { id: "crimson", name: "Crimson", color: "bg-red-500" },
];

function validateArchivePayload(value: unknown): ArchiveImportPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("The selected file is not a valid AP VERSE archive.");
  }
  const data = value as Record<string, unknown>;
  if (
    data["version"] !== 1 ||
    !Array.isArray(data["favorites"]) ||
    !data.favorites.every((item) => typeof item === "string") ||
    !data["metadataOverrides"] ||
    typeof data.metadataOverrides !== "object" ||
    Array.isArray(data.metadataOverrides)
  ) {
    throw new Error("Unsupported archive format or invalid archive data.");
  }

  for (const item of Object.values(data.metadataOverrides)) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("Archive contains invalid photo metadata.");
    }
    const metadata = item as Record<string, unknown>;
    if (
      (metadata["title"] !== undefined && typeof metadata.title !== "string") ||
      (metadata["description"] !== undefined && typeof metadata.description !== "string")
    ) {
      throw new Error("Archive contains invalid photo metadata.");
    }
  }

  return {
    version: 1,
    favorites: data.favorites,
    metadataOverrides: data.metadataOverrides as ArchiveImportPayload["metadataOverrides"],
  };
}

function Settings() {
  useGalleryPhotos();
  const { theme, setTheme, resetTheme } = useThemeStore();
  const {
    fluidAnimations,
    interfaceScale,
    setFluidAnimations,
    setInterfaceScale,
    resetPreferences,
  } = usePreferencesStore();
  const { photos, favorites, metadataOverrides, importArchiveData, resetArchiveData } =
    useGalleryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const favoriteCount = useMemo(
    () => favorites.filter((id) => photos.some((photo) => photo.id === id)).length,
    [favorites, photos],
  );
  const metadataCount = Object.keys(metadataOverrides).length;
  const archiveSize = useMemo(
    () =>
      new Blob([
        JSON.stringify({
          favorites,
          metadataOverrides,
        }) ?? "{}",
      ]).size,
    [favorites, metadataOverrides],
  );

  const handleExport = () => {
    const payload: ArchiveImportPayload & { exportedAt: string; app: string } = {
      app: "AP VERSE",
      version: 1,
      exportedAt: new Date().toISOString(),
      favorites,
      metadataOverrides,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2) ?? "{}"], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ap-verse-archive-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Archive export downloaded.");
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Archive file is too large. Maximum size is 5 MB.");
      return;
    }
    try {
      const payload = validateArchivePayload(JSON.parse(await file.text()));
      importArchiveData(payload);
      toast.success("Archive data imported and merged with this device.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not import this archive.");
    }
  };

  const handleResetSettings = () => {
    resetTheme();
    resetPreferences();
    toast.success("Appearance settings restored to defaults.");
  };

  const handleResetArchive = () => {
    resetArchiveData();
    toast.success("Favorites and photo metadata cleared from this browser.");
  };

  return (
    <main className="min-h-screen bg-background pb-32 text-foreground transition-colors duration-500">
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/50 py-8 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex flex-col">
            <h1 className="font-sans text-3xl font-black uppercase leading-none tracking-tighter">
              AP <span className="text-white/40">VERSE</span>
            </h1>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
              AP'S VISUAL UNIVERSE
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl space-y-12 px-6 pt-8">
        <section>
          <h2 className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
            Archive Profile
          </h2>
          <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-6">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-white/10">
              <img
                src="https://github.com/ashutoshpalhare.png"
                alt="Ashutosh Palhare"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight">Ashutosh Palhare</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                LOCAL PROFILE
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-6 flex items-center gap-3">
            <Palette className="h-4 w-4 text-white/40" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
              Interface Themes
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {THEMES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={theme === item.id}
                onClick={() => setTheme(item.id)}
                className={cn(
                  "relative flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-300",
                  theme === item.id
                    ? "border-white/20 bg-white/10 ring-1 ring-white/20"
                    : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/8",
                )}
              >
                <span className={cn("mb-3 h-4 w-4 rounded-full", item.color)} />
                <span className="text-xs font-bold uppercase tracking-tight">{item.name}</span>
                {theme === item.id && (
                  <motion.span layoutId="theme-check" className="absolute right-4 top-4">
                    <Check className="h-3 w-3 text-white" />
                  </motion.span>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
            Universe Parameters
          </h2>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-white/40" />
              <div>
                <p className="text-sm font-medium">Fluid Animations</p>
                <p className="text-xs text-white/35">Reduce motion and transitions when disabled</p>
              </div>
            </div>
            <Switch
              checked={fluidAnimations}
              onCheckedChange={setFluidAnimations}
              aria-label="Enable fluid animations"
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-white/40" />
                <span className="text-sm font-medium">Interface Scale</span>
              </div>
              <span className="text-xs tabular-nums text-white/50">{interfaceScale}%</span>
            </div>
            <Slider
              value={[interfaceScale]}
              min={80}
              max={120}
              step={5}
              onValueChange={(value) => setInterfaceScale(value[0] ?? 100)}
              aria-label="Interface scale"
            />
            <div className="flex justify-between text-[10px] text-white/30">
              <span>80%</span>
              <span>100%</span>
              <span>120%</span>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Database className="h-4 w-4 text-white/40" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
              Archive Metrics
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric icon={<ImageIcon className="h-4 w-4" />} label="Portraits" value={photos.length.toLocaleString()} />
            <Metric icon={<Heart className="h-4 w-4" />} label="Favorites" value={favoriteCount.toLocaleString()} />
            <Metric icon={<FileJson className="h-4 w-4" />} label="Metadata" value={metadataCount.toLocaleString()} />
            <Metric icon={<Database className="h-4 w-4" />} label="Backup size" value={formatBytes(archiveSize)} />
          </div>
          <p className="text-xs leading-relaxed text-white/35">
            Favorites and edited photo details are stored in this browser only. There is no cloud
            sync. Export a backup before clearing browser data or moving to another device.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              onClick={handleExport}
              className="h-12 rounded-xl bg-white text-black hover:bg-white/90"
            >
              <Download className="mr-2 h-4 w-4" /> Export archive
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-12 rounded-xl border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
            >
              <Upload className="mr-2 h-4 w-4" /> Import archive
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="hidden"
              aria-label="Choose AP VERSE archive file"
            />
          </div>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
              Reset Controls
            </h2>
            <p className="mt-2 text-xs text-white/35">
              Appearance preferences and archive data are reset independently.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="h-12 w-full rounded-xl border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset appearance settings
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset appearance settings?</AlertDialogTitle>
                <AlertDialogDescription>
                  Theme, animation preference, and interface scale will return to their defaults.
                  Your favorites and photo metadata will remain untouched.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetSettings}>Reset settings</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="h-12 w-full rounded-xl border-red-500/20 bg-red-500/5 text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear favorites & photo metadata
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear local archive data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently clears this browser's favorites and edited photo titles and
                  descriptions. Original photos are not deleted. Export a backup first if needed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep my data</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetArchive}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear archive data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        <p className="pt-4 text-center text-[8px] font-bold uppercase tracking-[0.6em] text-white/10">
          AP VERSE V1.0.42 · LOCAL-FIRST ARCHIVE
        </p>
      </div>

      <BottomNavigation />
    </main>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-white/35">{icon}<span className="text-[9px] font-bold uppercase tracking-widest">{label}</span></div>
      <p className="mt-3 break-all text-xl font-black tabular-nums">{value}</p>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
