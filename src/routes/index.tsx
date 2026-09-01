import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldAlert,
  BookOpen,
  Library,
  Users,
  ArrowRight,
  BookMarked,
  Settings,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePublisherType } from "@/hooks/use-publisher-type";
import { useLibraryAdminType } from "@/hooks/use-library-admin-type";

export const Route = createFileRoute("/")({
  component: WorkspaceSelector,
});

function WorkspaceSelector() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [publisherType, setPublisherType] = usePublisherType();
  const [libraryAdminType, setLibraryAdminType] = useLibraryAdminType();

  // Background visual sparkle/orb positions
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const roles = [
    {
      id: "pb-admin",
      title: "PB Admin",
      subtitle: "System Administrator",
      description:
        "Manage global settings, onboard publishers & library accounts, approve promo codes, and monitor overall platform health.",
      icon: ShieldAlert,
      path: "/pb-admin",
      color: "oklch(0.60 0.18 30)", // warm coral
      shadow: "rgba(224, 86, 36, 0.15)",
      badge: "System Controller",
    },
    {
      id: "publisher",
      title: "Publisher",
      subtitle: "Content & Royalty Manager",
      description:
        "Onboard e-books, manage price tiers, set promotional codes, and view granular sales and royalty reports.",
      icon: BookMarked,
      path: "/publisher",
      color: "oklch(0.55 0.11 195)", // brand teal
      shadow: "rgba(4, 150, 180, 0.15)",
      badge: "Anya Ramanathan · Pro",
    },
    {
      id: "author",
      title: "Author",
      subtitle: "Writer & Content Creator",
      description:
        "Publish eBooks, manage manuscripts, track sales royalties, set pricing tiers, and monitor reader analytics.",
      icon: BookOpen,
      path: "/author",
      color: "oklch(0.62 0.15 155)", // emerald green
      shadow: "rgba(16, 185, 129, 0.15)",
      badge: "Author Workspace",
    },
    {
      id: "library-admin",
      title: "Library Admin",
      subtitle: "Institution Administrator",
      description:
        "Manage student accounts, allocate license budgets, control borrowing limits, and monitor reading completion statistics.",
      icon: Library,
      path: "/library-admin",
      color: "oklch(0.55 0.13 260)", // royal blue/purple
      shadow: "rgba(79, 70, 229, 0.15)",
      badge: "Vimala College Portal",
    },
    {
      id: "library-user",
      title: "Library User Login",
      subtitle: "Student & Reader Portal",
      description:
        "Access institutional digital library, read assigned e-books in the interactive reader, track progress, and manage student profile.",
      icon: GraduationCap,
      path: "/library-user/login",
      color: "oklch(0.58 0.17 330)", // magenta pink
      shadow: "rgba(219, 39, 119, 0.15)",
      badge: "Ananya Roy · Student",
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background px-6 py-12 md:px-12 md:py-20 flex flex-col justify-between">
      {/* Decorative ambient glowing orbs */}
      {mounted && (
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full blur-[120px] opacity-40 transition-all duration-1000"
            style={{
              backgroundColor: hoveredCard
                ? roles.find((r) => r.id === hoveredCard)?.color
                : "var(--brand)",
            }}
          />
          <div
            className="absolute bottom-[-15%] right-[-10%] h-[60%] w-[60%] rounded-full blur-[140px] opacity-35"
            style={{ backgroundColor: "var(--sidebar-highlight)" }}
          />
        </div>
      )}

      {/* Header */}
      <header className="mx-auto w-full max-w-7xl 2xl:max-w-[1500px] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" id="landing-logo-link" className="flex items-center gap-3 shrink-0">
            <img src="/logo-app-icon.png" alt="PixelBooks App Icon" className="h-9 w-9 object-contain" />
            <span className="font-extrabold text-2xl tracking-tight text-foreground">PixelBooks</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-secondary/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Workspace Selector
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto my-auto w-full max-w-7xl 2xl:max-w-[1500px] py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75">
            New UI Design: Select Your Workspace
          </h1>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {roles.map((role) => {
            const Icon = role.icon;
            const isHovered = hoveredCard === role.id;
            return (
              <Link
                key={role.id}
                to={role.path}
                onMouseEnter={() => setHoveredCard(role.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-border/80 hover:shadow-xl cursor-pointer select-none text-foreground no-underline"
                style={{
                  boxShadow: isHovered ? `0 16px 36px -12px ${role.shadow}` : undefined,
                }}
              >
                <div className="space-y-5">
                  {/* Top action row / Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors"
                      style={{
                        color: role.color,
                        backgroundColor: `color-mix(in oklab, ${role.color} 10%, transparent)`,
                      }}
                    >
                      {role.badge}
                    </span>
                    <span className="text-[11px] text-muted-foreground/80 font-medium">Portal</span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `color-mix(in oklab, ${role.color} 12%, transparent)`,
                        color: role.color,
                      }}
                    >
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground leading-tight group-hover:text-foreground">
                        {role.title}
                      </h2>
                      <p className="text-xs text-muted-foreground/90 font-medium">
                        {role.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground/80 leading-relaxed min-h-[64px]">
                    {role.description}
                  </p>
                </div>

                {/* Footer, User Type Dropdown & Navigation */}
                <div className="mt-8 pt-4 border-t border-border/40 space-y-4">
                  {role.id === "publisher" && (
                    <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        User Type
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary/70 transition-colors cursor-pointer shadow-2xs"
                          >
                            <span className="truncate">{publisherType}</span>
                            <ChevronDown size={14} className="text-muted-foreground shrink-0" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setPublisherType("Complete Publisher");
                            }}
                            className="text-xs font-medium cursor-pointer"
                          >
                            Complete Publisher
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setPublisherType("Library-Only Publisher");
                            }}
                            className="text-xs font-medium cursor-pointer"
                          >
                            Library-Only Publisher
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                  {role.id === "library-admin" && (
                    <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        User Type
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary/70 transition-colors cursor-pointer shadow-2xs"
                          >
                            <span className="truncate">{libraryAdminType}</span>
                            <ChevronDown size={14} className="text-muted-foreground shrink-0" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setLibraryAdminType("Complete Library Admin");
                            }}
                            className="text-xs font-medium cursor-pointer"
                          >
                            Complete Library Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setLibraryAdminType("Standard Library Admin");
                            }}
                            className="text-xs font-medium cursor-pointer"
                          >
                            Standard Library Admin
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                  <div
                    id={`btn-portal-go-${role.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold text-white transition-all hover:shadow-md"
                    style={{
                      backgroundColor: role.color,
                      boxShadow: isHovered ? `0 4px 12px ${role.shadow}` : undefined,
                    }}
                  >
                    Enter Workspace
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-7xl 2xl:max-w-[1500px] border-t border-border/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/80">
        <div>© 2026 PixelBooks. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Platform Status
          </a>
        </div>
      </footer>
    </div>
  );
}

