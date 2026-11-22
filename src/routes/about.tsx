import { createFileRoute } from "@tanstack/react-router";
import { BottomNavigation } from "../components/gallery/BottomNavigation";
import { Mail, ExternalLink } from "lucide-react";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Ashutosh Palhare | AP VERSE" },
      { name: "description", content: "Meet Ashutosh Palhare, developer and creator of AP VERSE, a cinematic public portrait gallery and visual collection." },
      { name: "author", content: "Ashutosh Palhare" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "About Ashutosh Palhare | AP VERSE" },
      { property: "og:description", content: "Meet the developer and creator behind AP VERSE." },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "https://ashutoshpalhare.github.io/verse/about/" },
      { property: "og:site_name", content: "AP VERSE" },
      { property: "og:image", content: "https://github.com/ashutoshpalhare.png?size=1200" },
      { property: "og:image:alt", content: "Ashutosh Palhare profile portrait" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About Ashutosh Palhare | AP VERSE" },
      { name: "twitter:description", content: "Meet the developer and creator behind AP VERSE." },
      { name: "twitter:image", content: "https://github.com/ashutoshpalhare.png?size=1200" },
    ],
    links: [{ rel: "canonical", href: "https://ashutoshpalhare.github.io/verse/about/" }],
  }),
});

function AboutPage() {
  const socialLinks = [
    { name: "GitHub", icon: SiGithub, url: "https://github.com/ashutoshpalhare" },
    { name: "Twitter", icon: SiX, url: "https://twitter.com/ashu_palhare" },
    { name: "LinkedIn", icon: ExternalLink, url: "https://linkedin.com/in/ashutoshpalhare" },
    { name: "Email", icon: Mail, url: "mailto:ashutosh@example.com" },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-32">
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/50 py-6 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <h1 className="font-sans text-3xl font-black tracking-tighter uppercase">ABOUT</h1>
        </div>
      </header>
      <div className="container mx-auto max-w-2xl px-6 pt-12 space-y-16">
        <section className="flex flex-col items-center text-center space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Avatar className="h-40 w-40 border-2 border-white/10 ring-4 ring-white/5">
              <AvatarImage src="https://github.com/ashutoshpalhare.png" alt="Ashutosh Palhare" />
              <AvatarFallback className="bg-white/5 text-4xl font-black">AP</AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight uppercase">ASHUTOSH PALHARE</h2>
            <p className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">Visionary behind the Universe</p>
          </div>
          <p className="text-lg text-white/60 font-medium leading-relaxed max-w-lg">
            A developer and designer crafting cinematic digital experiences. AP VERSE is a public visual gallery showcasing portraits and moments captured across time.
          </p>
          <div className="flex gap-4 pt-4">
            {socialLinks.map((link) => (
              <Button key={link.name} variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-white/5" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer"><link.icon className="h-5 w-5" /></a>
              </Button>
            ))}
          </div>
        </section>
        <section className="space-y-8">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-8 space-y-6 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-white/10 transition-colors" />
            <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-white/40">THE UNIVERSE</h3>
            <p className="text-white/70 leading-relaxed font-medium">
              AP VERSE is designed as a cinematic public visual collection. Favorites and edited photo details are stored locally in each visitor's browser; there is no account or cloud sync.
            </p>
          </div>
        </section>
        <p className="text-center text-[8px] font-bold tracking-[0.6em] text-white/10 uppercase">AP VERSE · DESIGNED BY ASHUTOSH PALHARE</p>
      </div>
      <BottomNavigation />
    </main>
  );
}
