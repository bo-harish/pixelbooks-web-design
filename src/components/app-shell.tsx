import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookMarked,
  FileUp,
  Library,
  TicketPercent,
  TrendingUp,
  BarChart3,
  Landmark,
  LifeBuoy,
  ChevronDown,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  LogOut,
  Settings,
  UserCircle,
  ShoppingBag,
  ShoppingCart,
  Store,
  FileEdit,
  Users,
  GraduationCap,
  Building2,
  Inbox,
  Image as ImageIcon,
  BadgePercent,
  HelpCircle,
  Megaphone,
  ClipboardList,
  BookOpen,
  Eye,
  Code2,
  Network,
  FolderTree,
  Sparkles,
  ShieldCheck,
  UserCheck,
  GitMerge,
  Copy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "@/hooks/theme-context";
import { useAdminMode } from "@/hooks/use-admin-mode";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { NotificationsPopover } from "@/components/notifications-popover";
import { getHeaderProfile, getProfileRoute } from "@/components/headers/get-header-profile";
import { toast } from "sonner";
import { usePublisherType, type PublisherUserType } from "@/hooks/use-publisher-type";
import { useLibraryAdminType, type LibraryAdminUserType } from "@/hooks/use-library-admin-type";


type NavItem = {
  label: string;
  icon: LucideIcon;
  to: string;
  badge?: string;
  subItems?: { label: string; to: string; icon: LucideIcon }[];
};

type NavSection = { heading: string; items: NavItem[] };

export function getRoleTheme(pathname: string) {
  if (pathname.startsWith("/pb-admin")) {
    return {
      color: "oklch(0.60 0.18 30)", // warm coral
      bgLight: "color-mix(in oklab, oklch(0.60 0.18 30) 14%, transparent)",
      name: "PB Admin",
    };
  }
  if (pathname.startsWith("/library-admin")) {
    return {
      color: "oklch(0.55 0.13 260)", // royal blue/purple
      bgLight: "color-mix(in oklab, oklch(0.55 0.13 260) 14%, transparent)",
      name: "Library Admin",
    };
  }
  if (pathname.startsWith("/author") || (typeof window !== "undefined" && window.location.search.includes("role=author"))) {
    return {
      color: "oklch(0.62 0.15 155)", // emerald green
      bgLight: "color-mix(in oklab, oklch(0.62 0.15 155) 14%, transparent)",
      name: "Author",
    };
  }
  return {
    color: "oklch(0.55 0.11 195)", // brand teal
    bgLight: "color-mix(in oklab, oklch(0.55 0.11 195) 14%, transparent)",
    name: "Publisher",
  };
}

function normalizePath(p: string) {
  if (!p) return "";
  const trimmed = p.trim();
  if (trimmed.length > 1 && trimmed.endsWith("/")) {
    return trimmed.slice(0, -1);
  }
  return trimmed;
}

function isActivePath(pathname: string, to: string) {
  const normPath = normalizePath(pathname);
  const normTo = normalizePath(to);

  if (normTo === "/") return normPath === "/";
  if (normTo === "/library-admin" || normTo === "/publisher" || normTo === "/author" || normTo === "/pb-admin") {
    return normPath === normTo;
  }
  return normPath === normTo || normPath.startsWith(`${normTo}/`);
}

function useHideRetailBookStore() {
  const [hide, setHide] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pb_hide_retail_bookstore") === "true";
    }
    return false;
  });

  useEffect(() => {
    const handleStorage = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      if (typeof customEvent.detail === "boolean") {
        setHide(customEvent.detail);
      } else if (typeof window !== "undefined") {
        setHide(localStorage.getItem("pb_hide_retail_bookstore") === "true");
      }
    };

    window.addEventListener("pb-hide-bookstore-change", handleStorage);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("pb-hide-bookstore-change", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return hide;
}

function getSections(
  pathname: string,
  adminMode?: "retail" | "library",
  hideRetailBookStore?: boolean,
  publisherUserType?: PublisherUserType,
  libraryAdminUserType?: LibraryAdminUserType
): NavSection[] {
  if (pathname.startsWith("/pb-admin")) {
    if (adminMode === "library" || pathname.startsWith("/pb-admin-lib")) {
      return [
        {
          heading: "Main",
          items: [
            { label: "Dashboard", icon: LayoutDashboard, to: "/pb-admin-lib" },
          ],
        },
        {
          heading: "Manage Library",
          items: [
            { label: "Libraries", icon: Users, to: "/pb-admin-lib/libraries" },
            { label: "Manage Orders", icon: ShoppingBag, to: "/pb-admin-lib/orders" },
            { label: "eBook Assignment", icon: BookOpen, to: "/pb-admin-lib/catalogue" },
            { label: "Clone Library", icon: Copy, to: "/pb-admin-lib/clone" },
          ],
        },
      ];
    }

    return [
      {
        heading: "Main",
        items: [
          { label: "Dashboard", icon: LayoutDashboard, to: "/pb-admin" },
        ],
      },
      {
        heading: "Reports",
        items: [
          { label: "Margin/Royalty Report", icon: Landmark, to: "/pb-admin/margin-report" },
          { label: "Sales Report", icon: BarChart3, to: "/pb-admin/sales-report" },
        ],
      },
      {
        heading: "Analytics",
        items: [
          { label: "Views", icon: Eye, to: "/pb-admin/views-report" },
          { label: "Abandoned Carts", icon: ShoppingCart, to: "/pb-admin/cart-view" },
          { label: "Book Cart Analysis", icon: ShoppingBag, to: "/pb-admin/cart-analysis" },
        ],
      },
      {
        heading: "Pricing & Promotions",
        items: [
          { label: "Commission Rates", icon: Landmark, to: "/pb-admin/commission-rates" },
          { label: "Promo Codes", icon: TicketPercent, to: "/pb-admin/promo-codes" },
        ],
      },
      {
        heading: "Catalogue",
        items: [
          { label: "Titles", to: "/pb-admin/titles", icon: BookOpen },
          { label: "Bundles", to: "/pb-admin/bundles", icon: Library },
          { label: "Categories", to: "/pb-admin/categories", icon: FolderTree },
          { label: "Featured Collections", to: "/pb-admin/featured-collections", icon: Sparkles },
        ],
      },
      {
        heading: "People",
        items: [
          { label: "Publisher/Author", to: "/pb-admin/publishers-authors", icon: Building2 },
          { label: "Customers", to: "/pb-admin/customers", icon: Users },
          { label: "Admin Users", to: "/pb-admin/admin-users", icon: ShieldCheck },
        ],
      },
      {
        heading: "Authors",
        items: [
          { label: "Author Management", to: "/pb-admin/author-management", icon: UserCheck },
          { label: "Merge Authors", to: "/pb-admin/merge-authors", icon: GitMerge },
        ],
      },
      {
        heading: "Marketing",
        items: [
          { label: "Schema & Meta", icon: Code2, to: "/pb-admin/marketing/schema-meta" },
          { label: "Sitemap", icon: Network, to: "/pb-admin/marketing/sitemap" },
          { label: "Audit Log", icon: ClipboardList, to: "/pb-admin/audit-log" },
        ],
      },
      {
        heading: "Banners",
        items: [
          { label: "Image Banners", icon: ImageIcon, to: "/pb-admin/ad-banners/image" },
          { label: "Popup Banners", icon: BadgePercent, to: "/pb-admin/ad-banners/popup" },
        ],
      },
      {
        heading: "Quizzes & Rewards",
        items: [
          { label: "Quizzes", icon: HelpCircle, to: "/pb-admin/quizzes-rewards" },
          { label: "Rewards", icon: TicketPercent, to: "/pb-admin/quizz-rewards" },
        ],
      },
      {
        heading: "Settings",
        items: [{ label: "Settings", icon: Settings, to: "/pb-admin/settings" }],
      },
    ];
  }

  if (pathname.startsWith("/library-admin")) {
    const isStandardAdmin = libraryAdminUserType === "Standard Library Admin";
    return (
      [
        {
          heading: "Main",
          items: [
            { label: "Dashboard", icon: LayoutDashboard, to: "/library-admin" },
            { label: "Reports", icon: BarChart3, to: "/library-admin/reports" },
          ],
        },
        {
          heading: "Inventory & Content",
          items: (
            [
              { label: "Catalogue", icon: BookMarked, to: "/library-admin/catalogue" },
              { label: "Manage Borrowings", icon: FileEdit, to: "/library-admin/manage-ebooks" },
              !hideRetailBookStore && !isStandardAdmin && { label: "Book Store", icon: Store, to: "/library-admin/book-store" },
              !isStandardAdmin && { label: "Banners", icon: ImageIcon, to: "/library-admin/banners" },
            ] as (NavItem | false)[]
          ).filter(Boolean) as NavItem[],
        },
        !isStandardAdmin && {
          heading: "Operations",
          items: [
            { label: "Orders", icon: ShoppingBag, to: "/library-admin/orders" },
            { label: "Requests", icon: Inbox, to: "/library-admin/requests" },
          ],
        },
        {
          heading: "Users & Structure",
          items: [
            { label: "Courses", icon: GraduationCap, to: "/library-admin/courses" },
            { label: "Library Users", icon: Users, to: "/library-admin/users" },
            { label: "Departments", icon: Building2, to: "/library-admin/departments" },
          ],
        },
        {
          heading: "Support",
          items: [{ label: "Support", icon: LifeBuoy, to: "/library-admin/support" }],
        },
      ] as (NavSection | false)[]
    ).filter(Boolean) as NavSection[];
  }


  if (pathname.startsWith("/author") || (typeof window !== "undefined" && window.location.search.includes("role=author"))) {
    return [
      {
        heading: "Main",
        items: [
          { label: "Dashboard", icon: LayoutDashboard, to: "/author" },
          { label: "eBook Catalogue", icon: BookMarked, to: "/publisher/catalogue" },
          { label: "Catalogue Import", icon: FileUp, to: "/publisher/catalogue-import" },
          { label: "eBook Bundles", icon: Library, to: "/publisher/bundles" },
          { label: "Promo Codes", icon: TicketPercent, to: "/publisher/promo-codes" },
        ],
      },
      {
        heading: "Reports",
        items: [
          { label: "Royalty Report", icon: TrendingUp, to: "/publisher/margin-report?role=author" },
          { label: "Sales Report", icon: BarChart3, to: "/publisher/sales-report" },
        ],
      },
      {
        heading: "Payment",
        items: [{ label: "Bank Accounts", icon: Landmark, to: "/publisher/bank-accounts" }],
      },
      {
        heading: "Utilities",
        items: [{ label: "Support", icon: LifeBuoy, to: "/publisher/support" }],
      },
    ];
  }

  const isLibraryOnlyPublisher = publisherUserType === "Library-Only Publisher";
  return [
    {
      heading: "Main",
      items: (
        [
          !isLibraryOnlyPublisher && { label: "Dashboard", icon: LayoutDashboard, to: "/publisher" },
          { label: "eBook Catalogue", icon: BookMarked, to: "/publisher/catalogue" },
          { label: "Catalogue Import", icon: FileUp, to: "/publisher/catalogue-import" },
          !isLibraryOnlyPublisher && { label: "eBook Bundles", icon: Library, to: "/publisher/bundles" },
          !isLibraryOnlyPublisher && { label: "Promo Codes", icon: TicketPercent, to: "/publisher/promo-codes" },
        ] as (NavItem | false)[]
      ).filter(Boolean) as NavItem[],
    },
    !isLibraryOnlyPublisher && {
      heading: "Reports",
      items: [
        { label: "Margin Report", icon: TrendingUp, to: "/publisher/margin-report" },
        { label: "Sales Report", icon: BarChart3, to: "/publisher/sales-report" },
      ],
    },
    !isLibraryOnlyPublisher && {
      heading: "Payment",
      items: [{ label: "Bank Accounts", icon: Landmark, to: "/publisher/bank-accounts" }],
    },
    {
      heading: "Utilities",
      items: [{ label: "Support", icon: LifeBuoy, to: "/publisher/support" }],
    },
  ].filter(Boolean) as NavSection[];
}


function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <img
      src="/logo-app-icon.png"
      alt="PixelBooks App Icon"
      className={`object-contain shrink-0 ${className}`}
    />
  );
}

const COLLAPSE_KEY = "pb.sidebar.collapsed";

function useCollapsed() {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(COLLAPSE_KEY);
      if (stored !== null) {
        setCollapsed(stored === "1");
      }
    }
  }, []);

  const updateCollapsed = (v: boolean | ((prev: boolean) => boolean)) => {
    setCollapsed((prev) => {
      const next = typeof v === "function" ? v(prev) : v;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      }
      return next;
    });
  };

  return { collapsed, setCollapsed: updateCollapsed };
}

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-4 pt-6 pb-6",
        collapsed ? "justify-center px-3" : "px-6",
      ].join(" ")}
    >
      {collapsed ? (
        <Link
          to="/"
          id="sidebar-logo-link-collapsed"
          className="flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
        >
          <Logo className="h-7 w-7" />
        </Link>
      ) : (
        <Link to="/" id="sidebar-logo-link-expanded" className="flex items-center gap-2.5 group">
          <Logo className="h-7 w-7 transition-transform group-hover:scale-105 shrink-0" />
          <span className="font-bold text-lg tracking-tight text-foreground">PixelBooks</span>
        </Link>
      )}
    </div>
  );
}

function NavRow({
  item,
  active,
  collapsed,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const roleTheme = getRoleTheme(pathname);
  const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
  const isChildActive = hasSubItems && item.subItems!.some((sub) => isActivePath(pathname, sub.to));
  const isParentOrChildActive = active || isChildActive;

  const [expanded, setExpanded] = useState<boolean>(isParentOrChildActive);

  useEffect(() => {
    if (isChildActive) {
      setExpanded(true);
    }
  }, [isChildActive]);

  const handleLinkClick = (e: React.MouseEvent) => {
    if (hasSubItems && !collapsed) {
      e.preventDefault();
      setExpanded((prev) => !prev);
    } else {
      if (onNavigate) onNavigate();
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const content = (
    <div className="space-y-1">
      <div className="relative flex items-center">
        <Link
          to={item.to}
          onClick={handleLinkClick}
          className={[
            "group relative flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-[14.5px] font-medium transition-all",
            collapsed ? "justify-center" : "",
            isParentOrChildActive
              ? "text-sidebar-accent-foreground shadow-sm"
              : "text-sidebar-foreground/85 hover:bg-secondary hover:text-sidebar-foreground",
          ].join(" ")}
          style={
            isParentOrChildActive
              ? {
                backgroundColor: "var(--sidebar-highlight)",
                boxShadow: "0 6px 20px -12px var(--brand-glow)",
              }
              : undefined
          }
        >
          {isParentOrChildActive && (
            <span
              className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full transition-all"
              style={{ backgroundColor: "var(--brand)" }}
            />
          )}
          <Icon
            size={19}
            strokeWidth={isParentOrChildActive ? 2.25 : 1.9}
            className={isParentOrChildActive ? "" : "text-muted-foreground group-hover:text-sidebar-foreground"}
            style={isParentOrChildActive ? { color: "var(--sidebar-highlight-icon)" } : undefined}
          />
          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
          {!collapsed && item.badge && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
            >
              {item.badge}
            </span>
          )}
        </Link>
        {!collapsed && hasSubItems && (
          <button
            type="button"
            onClick={toggleExpand}
            className="absolute right-2 p-1 text-muted-foreground hover:text-sidebar-foreground transition-colors rounded-md"
            aria-label={expanded ? "Collapse menu" : "Expand menu"}
          >
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {!collapsed && hasSubItems && expanded && (
        <ul className="mt-1 ml-4 space-y-1 pl-2.5 border-l border-border/40">
          {item.subItems!.map((subItem) => {
            const SubIcon = subItem.icon;
            const subActive = isActivePath(pathname, subItem.to);
            return (
              <li key={subItem.label}>
                <Link
                  to={subItem.to}
                  onClick={onNavigate}
                  className={[
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13.5px] font-medium transition-all",
                    subActive
                      ? "text-sidebar-accent-foreground shadow-sm bg-[var(--sidebar-highlight)] font-semibold"
                      : "text-sidebar-foreground/80 hover:bg-secondary hover:text-sidebar-foreground",
                  ].join(" ")}
                  style={
                    subActive
                      ? {
                        boxShadow: "0 6px 20px -12px var(--brand-glow)",
                      }
                      : undefined
                  }
                >
                  <SubIcon
                    size={16}
                    strokeWidth={subActive ? 2.25 : 1.8}
                    className={
                      subActive ? "" : "text-muted-foreground group-hover:text-sidebar-foreground"
                    }
                    style={subActive ? { color: "var(--sidebar-highlight-icon)" } : undefined}
                  />
                  <span className="truncate">{subItem.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
  if (!collapsed) return content;
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-2">
        {item.label}
        {item.badge && (
          <span
            className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            {item.badge}
          </span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarBody({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isPBAdmin = pathname.startsWith("/pb-admin");
  const [adminMode, setAdminMode] = useAdminMode();
  const hideBookStore = useHideRetailBookStore();
  const [publisherType] = usePublisherType();
  const [libraryAdminType] = useLibraryAdminType();
  const currentSections = getSections(pathname, adminMode, hideBookStore, publisherType, libraryAdminType);


  const handleModeSwitch = (newMode: "retail" | "library") => {
    setAdminMode(newMode);
    if (newMode === "retail" && pathname.startsWith("/pb-admin-lib")) {
      navigate({ to: "/pb-admin" });
    } else if (newMode === "library" && !pathname.startsWith("/pb-admin-lib") && pathname.startsWith("/pb-admin")) {
      navigate({ to: "/pb-admin-lib" });
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <nav className="flex-1 overflow-y-auto px-3">
        {isPBAdmin && !collapsed && (
          <div className="mb-6 px-3">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/55">
              Mode
            </p>
            <div className="flex items-center gap-1 rounded-full border border-sidebar-border p-1">
              <button
                onClick={() => handleModeSwitch("retail")}
                aria-pressed={adminMode === "retail"}
                className={[
                  "flex-1 rounded-full py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer",
                  adminMode === "retail"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground",
                ].join(" ")}
              >
                Retail
              </button>
              <button
                onClick={() => handleModeSwitch("library")}
                aria-pressed={adminMode === "library"}
                className={[
                  "flex-1 rounded-full py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer",
                  adminMode === "library"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground",
                ].join(" ")}
              >
                Library
              </button>
            </div>
          </div>
        )}
        {currentSections.map((section) => (
          <div key={section.heading} className="mb-6">
            {!collapsed ? (
              <div className="flex items-center gap-2 px-3 pb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {section.heading}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
            ) : (
              <div className="mx-3 mb-2 h-px bg-border" />
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.label}>
                  <NavRow
                    item={item}
                    active={isActivePath(pathname, item.to)}
                    collapsed={collapsed}
                    pathname={pathname}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </TooltipProvider>
  );
}

function ProfileDropdown() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const roleTheme = getRoleTheme(pathname);
  const headerProfile = getHeaderProfile(pathname);
  const isLibraryAdmin = pathname.startsWith("/library-admin");
  const isPBAdmin = pathname.startsWith("/pb-admin");
  const isAuthor = pathname.startsWith("/author") || (typeof window !== "undefined" && window.location.search.includes("role=author"));
  const [publisherType] = usePublisherType();
  const [libraryAdminType] = useLibraryAdminType();

  const userTypeLabel = isPBAdmin
    ? "Admin"
    : isLibraryAdmin
      ? libraryAdminType
      : isAuthor
        ? "Author"
        : publisherType;

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    toast.success("Successfully logged out");
    navigate({ to: "/" });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-left transition-all hover:bg-secondary hover:border-border/80 cursor-pointer">
            <div className="relative flex shrink-0">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: roleTheme.bgLight,
                  color: roleTheme.color,
                  boxShadow: `0 0 0 2px color-mix(in oklab, ${roleTheme.color} 40%, transparent)`,
                }}
              >
                {headerProfile.initials}
              </span>
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card"
                style={{ backgroundColor: roleTheme.color }}
                title={`${roleTheme.name} Online`}
              />
            </div>
            <span className="hidden min-w-0 sm:flex sm:flex-col sm:items-start gap-0.5">
              <span className="block truncate text-sm font-semibold text-foreground leading-tight">
                {headerProfile.name}
              </span>
              <span
                className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                style={{
                  backgroundColor: isPBAdmin
                    ? "color-mix(in oklab, oklch(0.60 0.18 30) 16%, transparent)"
                    : isLibraryAdmin
                      ? "color-mix(in oklab, oklch(0.55 0.13 260) 12%, transparent)"
                      : isAuthor
                        ? "color-mix(in oklab, oklch(0.62 0.15 155) 16%, transparent)"
                        : "var(--sidebar-highlight)",
                  color: isPBAdmin
                    ? "oklch(0.60 0.18 30)"
                    : isLibraryAdmin
                      ? "oklch(0.55 0.13 260)"
                      : isAuthor
                        ? "oklch(0.62 0.15 155)"
                        : "var(--sidebar-accent-foreground)",
                }}
              >
                {userTypeLabel}
              </span>
            </span>
            <ChevronDown size={14} className="hidden text-muted-foreground sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center justify-between text-xs font-semibold">
            <span>My account</span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: roleTheme.bgLight, color: roleTheme.color }}
            >
              {roleTheme.name}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={getProfileRoute(pathname)}>
              <UserCircle size={16} className="mr-2" /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/publisher/settings">
              <Settings size={16} className="mr-2" /> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/" id="profile-dropdown-btn-switch-workspace">
              <LayoutDashboard size={16} className="mr-2" /> Switch Workspace
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setShowLogoutModal(true);
            }}
            className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-500/10 focus:text-red-600 dark:focus:text-red-400"
          >
            <LogOut size={16} className="mr-2" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="max-w-md gap-0 p-0 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="p-6 space-y-4">
            {/* Header Badge & Title */}
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--danger) 14%, transparent)",
                  color: "var(--danger)",
                }}
              >
                <LogOut size={22} />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  Confirm Log Out
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Logged in as <span className="font-semibold text-foreground">{headerProfile.name}</span> ({headerProfile.role})
                </DialogDescription>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Are you sure you want to log out of your <span className="font-medium text-foreground">{headerProfile.role}</span> account? You will need to sign in again to access your workspace.
            </p>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "var(--danger)" }}
              >
                <LogOut size={15} />
                Log Out
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="border-t border-sidebar-border px-3 py-2">
      {!collapsed && <p className="text-[10px] text-muted-foreground">v2.1.12</p>}
    </div>
  );
}

function DesktopSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { pathname } = useLocation();
  const roleTheme = getRoleTheme(pathname);
  return (
    <aside
      className="relative hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:sticky md:top-0 md:flex"
      style={{ width: collapsed ? 72 : 280 }}
    >
      {/* Top 3px Workspace Role Accent Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] transition-colors duration-300 z-20"
        style={{ backgroundColor: roleTheme.color }}
      />
      <div className="flex items-center justify-between">
        <SidebarBrand collapsed={collapsed} />
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mr-2 flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>
      <SidebarBody collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}

function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { pathname } = useLocation();
  const roleTheme = getRoleTheme(pathname);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="relative flex w-[280px] flex-col bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden overflow-hidden"
      >
        {/* Top 3px Workspace Role Accent Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] transition-colors duration-300 z-20"
          style={{ backgroundColor: roleTheme.color }}
        />
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarBrand collapsed={false} />
        <SidebarBody collapsed={false} onNavigate={() => onOpenChange(false)} />
        <SidebarFooter collapsed={false} />
      </SheetContent>
    </Sheet>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function AppShell({
  title,
  subtitle,
  pageIcon,
  children,
}: {
  title: string;
  subtitle?: string;
  pageIcon?: ReactNode;
  children: ReactNode;
}) {
  const { collapsed, setCollapsed } = useCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { pathname } = useLocation();
  const isPBAdmin = pathname.startsWith("/pb-admin");
  const roleTheme = getRoleTheme(pathname);

  useEffect(() => {
    const updateCount = () => {
      const stored = localStorage.getItem("pixelbooks_cart_count");
      setCartCount(stored ? parseInt(stored, 10) : 0);
    };

    updateCount();

    window.addEventListener("pixelbooks_cart_updated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("pixelbooks_cart_updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DesktopSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
      <main className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <header className="relative sticky top-0 z-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/85 px-4 py-4 backdrop-blur md:px-8 md:py-5">
          {/* Top 3px Workspace Role Accent Bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] transition-colors duration-300"
            style={{ backgroundColor: roleTheme.color }}
          />
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground md:hidden"
                  aria-label="Open menu"
                >
                  <Menu size={18} />
                </button>
              </SheetTrigger>
            </Sheet>
            <div className="flex items-center gap-3 min-w-0">
              {pageIcon && (
                <div className="shrink-0">{pageIcon}</div>
              )}
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
                {subtitle && (
                  <p className="mt-0.5 hidden truncate text-sm text-muted-foreground sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <ThemeToggle />
            {!isPBAdmin && cartCount > 0 && (
              <Link
                to="/library-admin/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-all cursor-pointer shadow-sm"
                title={`${cartCount} items in cart`}
              >
                <ShoppingCart size={18} />
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white ring-2 ring-background">
                  {cartCount}
                </span>
              </Link>
            )}
            <NotificationsPopover />
            <ProfileDropdown />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
