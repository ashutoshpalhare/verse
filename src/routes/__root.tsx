import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "../components/theme/ThemeProvider";

// In static (GitHub Pages) mode the app mounts into an existing index.html,
// so the root route must not render its own <html>/<body> shell.
const isSpaMode = import.meta.env["VITE_SPA_MODE"] === "true";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
  }),
  component: RootComponent,
});

function AppShell() {
  return (
    <ThemeProvider>
      <Outlet />
      <ScrollRestoration />
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}

function RootComponent() {
  if (isSpaMode) {
    return <AppShell />;
  }

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AppShell />
        <Scripts />
      </body>
    </html>
  );
}
