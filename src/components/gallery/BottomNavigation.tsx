import { Home, Heart, Settings, User } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../lib/utils";

export function BottomNavigation() {
  const location = useLocation();
  
  const navItems = [
    { label: "Gallery", icon: Home, to: "/" },
    { label: "Favorites", icon: Heart, to: "/favorites" },
    { label: "About", icon: User, to: "/about" },
    { label: "Settings", icon: Settings, to: "/settings" },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 z-40 w-[90%] max-w-md -translate-x-1/2 sm:bottom-8">
      <div className="flex items-center justify-around rounded-full border border-white/10 bg-black/60 p-2 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "group flex flex-col items-center gap-1 rounded-full px-4 py-2 transition-all duration-300",
                isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
              <span className="text-[8px] font-bold tracking-[0.2em] uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
