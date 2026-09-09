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
  LogOut,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-white/95 backdrop-blur-md">
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
            to="/"
            id="header-website-logo"
            className="flex items-center shrink-0 transition-opacity hover:opacity-90"
            title="PixelBooks - Workspace Selector"
          >
            <img
              src="/logo.png"
              alt="PixelBooks Logo"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-[26px] pl-4 xl:pl-6 pr-4 xl:pr-6 text-[13.5px] xl:text-[14px] font-medium shrink-0">
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
                className={`whitespace-nowrap transition-colors py-1.5 cursor-pointer ${activeTab === "Browse Genres"
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
              to="#"
              className="whitespace-nowrap text-muted-foreground/70 hover:text-foreground transition-colors py-1.5"
            >
              For Institutes
            </Link>
            <Link
              to="#"
              className="whitespace-nowrap text-muted-foreground/70 hover:text-foreground transition-colors py-1.5"
            >
              For Publishers
            </Link>
            <Link
              to="#"
              className="whitespace-nowrap text-muted-foreground/70 hover:text-foreground transition-colors py-1.5"
            >
              For Authors
            </Link>
            <Link
              to="/pb-web/support"
              className={`whitespace-nowrap transition-colors py-1.5 ${activeTab === "Support"
                ? "font-bold text-foreground"
                : "text-muted-foreground/70 hover:text-foreground"
                }`}
            >
              Support
            </Link>
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
              className="group relative flex h-11 w-full items-center rounded-full border-[1.6px] border-border/80 bg-white shadow-2xs hover:border-[#137365]/40 hover:bg-white focus-within:border-[#137365] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#137365]/15 focus-within:shadow-md transition-all pl-3.5 pr-1.5"
            >
              {/* Search Icon */}
              <Search
                size={17}
                className="text-muted-foreground group-focus-within:text-[#137365] transition-colors shrink-0"
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

              {/* Right controls: Clear (X) + ⌘K badge + Light Green Action Button */}
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
                  className="flex h-8 w-8 items-center justify-center rounded-full active:scale-95 text-white shadow-xs transition-all cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: "#30C047" }}
                  title="Search"
                >
                  <Search size={14} strokeWidth={2.5} />
                </button>
              </div>
            </form>

            {/* Live Interactive Search Results Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full mt-2.5 right-0 sm:right-auto sm:left-0 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px] max-w-[92vw] z-50 rounded-2xl border border-border/90 bg-white text-popover-foreground shadow-2xl p-4 backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150">
                {/* Empty state: Trending Searches */}
                {!currentSearchQuery.trim() ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#137365] mb-2.5 uppercase tracking-wider">
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
                            className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-foreground hover:border-pbgreen-border hover:bg-pbgreen-light hover:text-pbgreen-dark transition-colors cursor-pointer"
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
                      <span className="font-semibold text-[#137365]">
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
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-medium text-foreground hover:border-[#137365] hover:text-[#137365] transition-colors cursor-pointer"
                            >
                              <BookOpen size={12} className="text-[#137365]" />
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
                              <span className="text-xs font-bold text-[#137365] shrink-0">
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
                    className="text-[#137365] hover:text-[#0e5b50] font-semibold cursor-pointer"
                  >
                    Search all categories →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          {/* Notification Bell Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={() => setUnreadNotifications(0)}
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
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={10}
              className="w-[360px] max-w-[calc(100vw-2rem)] p-0 rounded-xl shadow-xl border border-border bg-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bell size={15} className="text-[#137365]" />
                  <span className="text-sm font-bold text-foreground">Notifications</span>
                </div>
              </div>

              {/* Notification list */}
              <div className="max-h-[360px] overflow-y-auto">
                {[
                  {
                    id: "rn1",
                    message: "📦 Your order #CS-4821 has been confirmed! 'NEET Courseware Biology Class-XII' is ready in your library.",
                    category: "Order Confirmed",
                    date: "Today",
                    time: "10:14 AM",
                    unread: true,
                  },
                  {
                    id: "rn2",
                    message: "🎉 PixelBooks has added 12 new Malayalam titles you might love. Explore the collection!",
                    category: "New Arrivals",
                    date: "Today",
                    time: "08:30 AM",
                    unread: true,
                  },
                  {
                    id: "rn3",
                    message: "⬇️ Your offline download for 'Foundation Mathematics JEE' is complete and ready to read.",
                    category: "Download Ready",
                    date: "Yesterday",
                    time: "06:55 PM",
                    unread: true,
                  },
                  {
                    id: "rn4",
                    message: "⚠️ Your session on Desktop Chrome was signed in from a new device. Secure your account if this wasn't you.",
                    category: "Security Alert",
                    date: "Yesterday",
                    time: "02:11 PM",
                    unread: false,
                  },
                ].map((n) => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: n.unread ? "var(--brand)" : "transparent", border: n.unread ? "none" : "1.5px solid var(--border)" }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[12.5px] leading-snug text-foreground">{n.message}</p>
                        <span className="shrink-0 text-[11px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{n.category}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/pb-web/accounts", search: { tab: "notifications" } })}
                  className="text-xs font-semibold transition-colors cursor-pointer"
                  style={{ color: "var(--brand)" }}
                >
                  View All Notifications →
                </button>
              </div>
            </PopoverContent>
          </Popover>

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
              <span
                className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-xs"
                style={{ backgroundColor: "#30C047" }}
              >
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
                className="flex items-center gap-2 text-sm sm:text-[15px] font-semibold text-foreground hover:text-[#137365] transition-colors cursor-pointer select-none shrink-0 whitespace-nowrap py-1 px-2 rounded-lg hover:bg-neutral-100/70"
              >
                <span>Hi, Harish K</span>
                <ChevronDown size={16} className="text-muted-foreground shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 sm:w-64 mt-2.5 p-2 rounded-xl shadow-lg border border-border/80">
              <DropdownMenuItem
                onClick={() => navigate({ to: "/pb-web/accounts", search: { tab: "profile" } })}
                className="text-sm font-medium flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer transition-colors focus:bg-emerald-50 focus:text-[#137365]"
              >
                <User size={18} className="text-[#137365]" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuItem
                onClick={() => navigate({ to: "/" })}
                className="text-sm font-medium flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer text-muted-foreground hover:text-rose-600 focus:text-rose-600 focus:bg-rose-50/70 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-6 bg-white">
          <div className="flex items-center gap-2 mb-8">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center transition-opacity hover:opacity-90"
              title="PixelBooks - Workspace Selector"
            >
              <img src="/logo.png" alt="PixelBooks Logo" className="h-8 w-auto object-contain" />
            </Link>
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
                className={`text-left py-2.5 px-3 rounded-lg transition-colors cursor-pointer ${activeTab === "Browse Genres"
                  ? "bg-pbgreen-light text-pbgreen-dark font-bold"
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
            <Link
              to="/pb-web/support"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors ${activeTab === "Support" ? "font-bold text-foreground bg-secondary/50" : ""
                }`}
            >
              Support
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
