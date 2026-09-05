import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  X,
  Bell,
  ShoppingCart,
  ChevronDown,
  Menu,
  TrendingUp,
  Flame,
  BookOpen,
  User,
  GraduationCap,
  Layers,
  Library,
  Shield,
  LogOut,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";
import { categoryColumns, sampleBooksByGenre, trendingSearches } from "@/routes/pb-web/data";

export interface PbWebHeaderProps {
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  onSearchSubmit?: (query?: string) => void;
  onCategoryClick?: (category: string) => void;
  cartCount?: number;
  unreadNotifications?: number;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function PbWebHeader({
  searchQuery: externalSearchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  onCategoryClick,
  cartCount = 2,
  unreadNotifications: initialUnreadNotifications = 1,
  activeTab,
  onTabChange,
}: PbWebHeaderProps) {
  const navigate = useNavigate();

  // Internal search state fallback if controlled props not provided
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const isControlledSearch = externalSearchQuery !== undefined;
  const currentSearchQuery = isControlledSearch ? externalSearchQuery : internalSearchQuery;

  const handleQueryChange = (val: string) => {
    if (onSearchQueryChange) {
      onSearchQueryChange(val);
    } else {
      setInternalSearchQuery(val);
    }
  };

  const [unreadNotifications, setUnreadNotifications] = useState(initialUnreadNotifications);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global shortcut to focus search (⌘K or Ctrl+K) & click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Matched genres for live search dropdown
  const matchingGenres = useMemo(() => {
    if (!currentSearchQuery.trim()) return [];
    const q = currentSearchQuery.toLowerCase();
    return categoryColumns.flat().filter((item) => item.toLowerCase().includes(q));
  }, [currentSearchQuery]);

  // Matched sample books for live search dropdown
  const matchingBooks = useMemo(() => {
    if (!currentSearchQuery.trim()) return [];
    const q = currentSearchQuery.toLowerCase();
    const allBooks = Object.entries(sampleBooksByGenre).flatMap(([genre, books]) =>
      books.map((b) => ({ ...b, genre }))
    );
    return allBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q)
    );
  }, [currentSearchQuery]);

  const handleSearch = (queryToSearch?: string) => {
    const q = (queryToSearch ?? currentSearchQuery).trim();
    if (!q) return;
    setIsSearchOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(q);
    } else {
      navigate({ to: "/pb-web/genre" });
      toast.info(`Searching for "${q}"`, {
        description: "Redirecting to bookstore catalogue...",
      });
    }
  };

  const handleGenreClick = (genre: string) => {
    setIsSearchOpen(false);
    if (onCategoryClick) {
      onCategoryClick(genre);
    } else {
      navigate({ to: "/pb-web/genre" });
      toast.info(`Browsing "${genre}" titles`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 xl:gap-10 min-w-0">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1.5 -ml-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>

          <Link
            to="/pb-web/genre"
            id="header-website-logo"
            className="flex items-center shrink-0 transition-opacity hover:opacity-90"
            title="PixelBooks"
          >
            <img
              src="/logo.png"
              alt="PixelBooks Logo"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-[13.5px] xl:text-[14px] font-medium shrink-0">
            <Link
              to="/pb-web/genre"
              className="whitespace-nowrap text-muted-foreground/70 hover:text-foreground transition-colors py-1.5"
            >
              Home
            </Link>

            {onTabChange ? (
              <button
                type="button"
                onClick={() => onTabChange("Browse Genres")}
                className={`whitespace-nowrap transition-colors py-1.5 cursor-pointer ${
                  activeTab === "Browse Genres"
                    ? "font-bold text-foreground"
                    : "text-muted-foreground/70 hover:text-foreground"
                }`}
              >
                Browse Genres
              </button>
            ) : (
              <Link
                to="/pb-web/genre"
                className="whitespace-nowrap text-muted-foreground/70 hover:text-foreground transition-colors py-1.5"
              >
                Browse Genres
              </Link>
            )}

            <Link
              to="/library-admin"
              className="whitespace-nowrap text-muted-foreground/70 hover:text-foreground transition-colors py-1.5"
            >
              For Institutes
            </Link>
            <Link
              to="/publisher"
              className="whitespace-nowrap text-muted-foreground/70 hover:text-foreground transition-colors py-1.5"
            >
              For Publishers
            </Link>
            <Link
              to="/author"
              className="whitespace-nowrap text-muted-foreground/70 hover:text-foreground transition-colors py-1.5"
            >
              For Authors
            </Link>
            <button
              type="button"
              onClick={() =>
                toast.info("Customer Support", {
                  description:
                    "Reach our academic reading & publishing support team 24/7 at support@pixelbooks.com",
                })
              }
              className="whitespace-nowrap text-muted-foreground/70 hover:text-foreground transition-colors py-1.5 cursor-pointer"
            >
              Support
            </button>
          </nav>
        </div>

        {/* Right Header Controls: Compact Search & Action Icons */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 xl:gap-5 shrink-0 ml-auto">
          {/* Search Box */}
          <div
            ref={searchContainerRef}
            className="relative w-40 sm:w-52 md:w-60 lg:w-64 xl:w-72 2xl:w-80 transition-all"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="group relative flex h-11 w-full items-center rounded-full border-[1.6px] border-border/80 bg-card/90 shadow-2xs hover:border-emerald-500/50 hover:bg-card focus-within:border-emerald-600 focus-within:bg-background focus-within:ring-4 focus-within:ring-emerald-500/15 focus-within:shadow-md transition-all pl-3.5 pr-1.5"
            >
              {/* Search Icon */}
              <Search
                size={17}
                className="text-muted-foreground group-focus-within:text-emerald-600 transition-colors shrink-0"
              />

              {/* Input */}
              <input
                ref={searchInputRef}
                type="text"
                value={currentSearchQuery}
                onChange={(e) => {
                  handleQueryChange(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search by title, author or ISBN"
                className="h-full w-full bg-transparent px-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/75 placeholder:truncate focus:outline-none font-normal"
              />

              {/* Right controls: Clear (X) + ⌘K badge + Emerald Action Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                {currentSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      handleQueryChange("");
                      searchInputRef.current?.focus();
                    }}
                    className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}

                <kbd className="hidden xl:inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground/80 bg-muted border border-border/80 select-none">
                  ⌘K
                </kbd>

                <button
                  type="submit"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xs transition-all cursor-pointer"
                  title="Search"
                >
                  <Search size={14} strokeWidth={2.5} />
                </button>
              </div>
            </form>

            {/* Live Interactive Search Results Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full mt-2.5 right-0 sm:right-auto sm:left-0 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px] max-w-[92vw] z-50 rounded-2xl border border-border/90 bg-popover text-popover-foreground shadow-2xl p-4 backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150">
                {/* Empty state: Trending Searches */}
                {!currentSearchQuery.trim() ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2.5 uppercase tracking-wider">
                        <TrendingUp size={14} /> Popular Searches
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {trendingSearches.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              handleQueryChange(tag);
                              handleSearch(tag);
                            }}
                            className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-foreground hover:border-emerald-500/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors cursor-pointer"
                          >
                            <Flame size={12} className="text-amber-500" />
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Active Search Results */
                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/60">
                      <span>Results for "{currentSearchQuery}"</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {matchingGenres.length} genres · {matchingBooks.length} titles
                      </span>
                    </div>

                    {/* Matching Categories */}
                    {matchingGenres.length > 0 && (
                      <div>
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Matching Genres ({matchingGenres.length})
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {matchingGenres.slice(0, 8).map((genre) => (
                            <button
                              key={genre}
                              type="button"
                              onClick={() => handleGenreClick(genre)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:border-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
                            >
                              <BookOpen size={12} className="text-emerald-500" />
                              {genre}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Books */}
                    {matchingBooks.length > 0 && (
                      <div>
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Suggested Titles ({matchingBooks.length})
                        </div>
                        <div className="space-y-2">
                          {matchingBooks.slice(0, 4).map((book, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleGenreClick(book.genre)}
                              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-secondary/70 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`h-9 w-7 rounded bg-gradient-to-br ${book.gradient} flex items-center justify-center text-[7px] font-bold text-white shrink-0`}
                                >
                                  eBook
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-foreground truncate">
                                    {book.title}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground truncate">
                                    by {book.author} · {book.genre}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                                {book.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchingGenres.length === 0 && matchingBooks.length === 0 && (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        No genres or books found matching "{currentSearchQuery}".
                      </div>
                    )}
                  </div>
                )}

                {/* Dropdown Footer */}
                <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Press <kbd className="font-semibold text-foreground">ESC</kbd> to exit</span>
                  <button
                    type="button"
                    onClick={() => handleSearch()}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                  >
                    Search all categories →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <button
            type="button"
            onClick={() => {
              setUnreadNotifications(0);
              toast.info("Notifications", {
                description:
                  "New edition of 'Foundation Mathematics JEE' is now available in your digital library.",
              });
            }}
            className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
            title="Notifications"
          >
            <Bell size={19} />
            {unreadNotifications > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Vertical Divider */}
          <div className="h-5 w-[1px] bg-border/80 shrink-0" />

          {/* Cart Icon */}
          <button
            type="button"
            onClick={() => navigate({ to: "/pb-web/cart" })}
            className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
            title="Shopping Cart"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Vertical Divider */}
          <div className="h-5 w-[1px] bg-border/80 shrink-0" />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                id="website-user-dropdown"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground hover:text-emerald-600 transition-colors cursor-pointer select-none shrink-0 whitespace-nowrap"
              >
                <span>Hi, Harish K</span>
                <ChevronDown size={14} className="text-muted-foreground shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                Harish K (harishknair@gmail.com)
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate({ to: "/pb-web/accounts" })}
                className="text-xs flex items-center gap-2 cursor-pointer font-semibold"
              >
                <User size={15} className="text-[var(--brand)]" />
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate({ to: "/library-user/login" })}
                className="text-xs flex items-center gap-2 cursor-pointer"
              >
                <GraduationCap size={15} className="text-pink-500" />
                Library User Reader
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate({ to: "/author" })}
                className="text-xs flex items-center gap-2 cursor-pointer"
              >
                <BookOpen size={15} className="text-emerald-500" />
                Author Workspace
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate({ to: "/publisher" })}
                className="text-xs flex items-center gap-2 cursor-pointer"
              >
                <Layers size={15} className="text-teal-500" />
                Publisher Portal
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate({ to: "/library-admin" })}
                className="text-xs flex items-center gap-2 cursor-pointer"
              >
                <Library size={15} className="text-indigo-500" />
                Library Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate({ to: "/pb-admin" })}
                className="text-xs flex items-center gap-2 cursor-pointer"
              >
                <Shield size={15} className="text-orange-500" />
                PB Admin
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate({ to: "/" })}
                className="text-xs flex items-center gap-2 cursor-pointer text-muted-foreground"
              >
                <LogOut size={14} />
                Workspace Selector
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-6">
          <div className="flex items-center gap-2 mb-8">
            <img src="/logo.png" alt="PixelBooks Logo" className="h-8 w-auto object-contain" />
          </div>
          <nav className="flex flex-col gap-2 text-sm font-medium">
            <Link
              to="/pb-web/genre"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors"
            >
              Home
            </Link>

            {onTabChange ? (
              <button
                type="button"
                onClick={() => {
                  onTabChange("Browse Genres");
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left py-2.5 px-3 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "Browse Genres"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "hover:bg-secondary"
                }`}
              >
                Browse Genres
              </button>
            ) : (
              <Link
                to="/pb-web/genre"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors"
              >
                Browse Genres
              </Link>
            )}

            <Link
              to="/library-admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors"
            >
              For Institutes
            </Link>
            <Link
              to="/publisher"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors"
            >
              For Publishers
            </Link>
            <Link
              to="/author"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors"
            >
              For Authors
            </Link>
            <button
              type="button"
              onClick={() => {
                toast.info("Customer Support: support@pixelbooks.com");
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            >
              Support
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
