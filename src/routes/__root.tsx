import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Wrench, ArrowLeft, LayoutDashboard } from "lucide-react";
import { AppShell } from "@/components/app-shell";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/hooks/use-theme";

function NotFoundComponent() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  const content = (
    <div className="flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950/20 px-4 py-16 relative overflow-hidden min-h-[60vh] rounded-2xl border border-dashed border-border/80 bg-card/30">
      {/* Soft gradient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[var(--brand)]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center p-4">
        {/* Animated Draft/Blueprint Illustration */}
        <div className="mx-auto w-20 h-20 rounded-full bg-[var(--brand)]/10 dark:bg-[var(--brand)]/20 flex items-center justify-center text-[var(--brand)] mb-6 animate-pulse">
          <Wrench size={36} className="stroke-[1.5]" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Design in Progress
        </h1>

        {/* Divider */}
        <div className="mx-auto my-4 h-0.5 w-10 rounded bg-[var(--brand)]/40" />

        {/* Subtitle */}
        <p className="text-xs leading-relaxed text-muted-foreground max-w-sm mx-auto">
          We are currently designing and refining the user experience for this section of the
          PixelBooks portal. New mockup reviews and interactive views are coming soon.
        </p>
      </div>
    </div>
  );

  const isInPortal =
    pathname.startsWith("/library-admin") ||
    pathname.startsWith("/publisher") ||
    pathname.startsWith("/pb-admin");

  if (isInPortal) {
    return (
      <AppShell title="Design in Progress">
        <div className="p-4 md:p-8">{content}</div>
      </AppShell>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 relative overflow-hidden">
      {content}
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
    // Auto-recover from stale dynamic chunk 404s after new deployments
    const isChunkLoadFailed =
      error?.message?.includes("Failed to fetch dynamically imported module") ||
      error?.message?.includes("error loading dynamically imported module") ||
      error?.name === "ChunkLoadError";

    if (isChunkLoadFailed && typeof window !== "undefined") {
      const key = "pb_chunk_reload_" + window.location.pathname;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PixelBooks UI Design" },
      {
        name: "description",
        content:
          "PixelBooks UI workspace.",
      },
      { name: "author", content: "PixelBooks" },
      { property: "og:title", content: "PixelBooks UI Design" },
      {
        property: "og:description",
        content:
          "PixelBooks UI Design",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PixelBooks UI Design" },
      {
        name: "twitter:description",
        content:
          "PixelBooks UI Design",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});
function RootShell({ children }: { children: ReactNode }) {
  const themeScript = `(function(){try{var path=window.location.pathname;var root=document.documentElement;if(path.indexOf('/pb-web')===0){root.classList.remove('dark');root.style.colorScheme='light';return;}var key='pixelbooks-theme';var stored=localStorage.getItem(key);var theme=(stored==='dark'||stored==='light')?stored:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');root.classList.toggle('dark',theme==='dark');root.style.colorScheme=theme;}catch(e){}})();`;
  const preloadErrorScript = `window.addEventListener('vite:preloadError',function(){window.location.reload();});`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: preloadErrorScript }} suppressHydrationWarning />
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
