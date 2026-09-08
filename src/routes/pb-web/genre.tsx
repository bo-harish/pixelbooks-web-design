import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Star,
  ExternalLink,
  Sparkles,
  Check,
  X,
  ShoppingBag,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { PbWebHeader } from "@/components/pb-web-header";
import { PbWebFooter } from "@/components/pb-web-footer";
import { categoryColumns, sampleBooksByGenre } from "./data";

export const Route = createFileRoute("/pb-web/genre")({
  head: () => ({
    meta: [
      { title: "Browse Genres — PixelBooks Web Site" },
      {
        name: "description",
        content: "Discover eBooks across Academic, Literature, Science, Fiction, and Competition Exam genres on PixelBooks.",
      },
    ],
  }),
  component: PixelBooksWebsitePage,
});

function PixelBooksWebsitePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Browse Genres");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(2);
  const [unreadNotifications, setUnreadNotifications] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search filter across categories
  const filteredColumns = useMemo(() => {
    if (!searchQuery.trim()) return categoryColumns;
    const q = searchQuery.toLowerCase();
    return categoryColumns.map((col) =>
      col.filter((item) => item.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const totalResults = useMemo(() => {
    return filteredColumns.reduce((acc, col) => acc + col.length, 0);
  }, [filteredColumns]);

  const handleSearchSubmit = (queryToSearch?: string) => {
    const q = (queryToSearch ?? searchQuery).trim();
    if (!q) return;
    toast.info(`Searching for "${q}"`, {
      description: `Found ${totalResults} matching category/book results.`,
    });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedGenre(category);
    toast.info(`Browsing "${category}" titles`, {
      description: "Showing popular publications and digital editions in this genre.",
    });
  };

  const handleAddToCart = (bookTitle: string) => {
    setCartCount((prev) => prev + 1);
    toast.success("Added to cart", {
      description: `"${bookTitle}" was added to your reading cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col justify-between selection:bg-[#137365]/20 selection:text-[#137365] pb-web-portal">
      {/* Top Header Navbar */}
      <PbWebHeader
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onCategoryClick={handleCategoryClick}
        cartCount={cartCount}
        unreadNotifications={unreadNotifications}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl 2xl:max-w-[1500px] px-4 sm:px-8 md:px-12 py-8 flex-1">
        {/* Hero Banner: Full-span 5-book composition with subtle grey overlay */}
        <div className="relative w-full h-36 sm:h-44 md:h-52 lg:h-56 rounded-2xl overflow-hidden bg-[#e5e7eb] dark:bg-[#1a1f26] flex items-center shadow-xs border border-stone-200/80 dark:border-stone-800 mb-8">
          {/* Background image spanning full width with all 5 books */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/genre-hero-books.jpg"
              alt="PixelBooks Genre Collection: All 5 books spanning full banner width"
              className="h-full w-full object-cover object-center scale-100 transition-transform duration-700 hover:scale-[1.02]"
            />
            {/* Subtle soft grey overlay on the right for typographic clarity */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-900/10 to-slate-900/40 dark:to-black/60" />
          </div>

          {/* Right Typography Section - Single prominent Genre title */}
          <div className="relative z-10 ml-auto w-full md:w-1/2 flex items-center justify-center py-4 px-4 pointer-events-none">
            <h1 className="select-none text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black tracking-widest uppercase text-white/50 dark:text-white/45 drop-shadow-[0_2px_14px_rgba(0,0,0,0.4)] transition-all duration-300 leading-none">
              Genre
            </h1>
          </div>
        </div>

        {/* Category Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              eBooks Categories
            </h2>
            {searchQuery && (
              <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-0.5 rounded-full border border-border">
                {totalResults} matching
              </span>
            )}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X size={13} /> Clear filter
            </button>
          )}
        </div>

        {/* 4-Column eBooks Category Grid with vertical dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 lg:gap-y-0 lg:divide-x lg:divide-border/60 pb-12">
          {filteredColumns.map((column, colIdx) => (
            <div
              key={colIdx}
              className={`space-y-3.5 ${colIdx === 0 ? "lg:pr-8" : colIdx === 3 ? "lg:pl-8" : "lg:px-8"
                }`}
            >
              {column.length === 0 ? (
                <p className="text-xs text-muted-foreground/60 italic py-2">
                  No matching genres
                </p>
              ) : (
                column.map((genre) => (
                  <div key={genre} className="group">
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(genre)}
                      className={`text-left text-[13.5px] font-normal leading-snug transition-all duration-150 cursor-pointer block w-full py-1 ${selectedGenre === genre
                        ? "text-[#137365] font-semibold translate-x-1"
                        : "text-foreground/85 hover:text-[#137365] hover:translate-x-1"
                        }`}
                    >
                      {genre}
                    </button>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Selected Genre Preview Drawer */}
      <Sheet open={!!selectedGenre} onOpenChange={(open) => !open && setSelectedGenre(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg p-6 overflow-y-auto">
          <SheetHeader className="text-left mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#137365] uppercase tracking-wider">
              <BookOpen size={15} /> Genre Showcase
            </div>
            <SheetTitle className="text-2xl font-bold text-foreground">
              {selectedGenre}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Explore curated e-books, recommended syllabus guides, and verified institutional titles.
            </SheetDescription>
          </SheetHeader>

          {/* Book items in the selected genre */}
          <div className="space-y-4">
            {(sampleBooksByGenre[selectedGenre || ""] || [
              {
                title: `${selectedGenre} — Volume 1 Comprehensive Reader`,
                author: "PixelBooks Editorial Panel",
                rating: 4.8,
                price: "₹399",
                tag: "Digital Edition",
                gradient: "from-teal-600 to-emerald-900",
                isbn: "978-0-13-468699-8",
              },
              {
                title: `Selected Works and Research in ${selectedGenre}`,
                author: "Academic Contributors & Fellows",
                rating: 4.6,
                price: "₹450",
                tag: "Institutional License",
                gradient: "from-blue-600 to-indigo-950",
                isbn: "978-0-13-468700-1",
              },
            ]).map((book, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-white p-4 shadow-xs transition-all hover:border-[#137365]/40 hover:shadow-sm flex gap-4"
              >
                {/* Book Mini Cover */}
                {book.cover ? (
                  <div className="h-28 w-20 shrink-0 rounded-lg overflow-hidden border border-border/80 shadow-md bg-muted">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`h-28 w-20 shrink-0 rounded-lg bg-gradient-to-br ${book.gradient} p-2 flex flex-col justify-between text-white shadow-sm`}
                  >
                    <div className="text-[9px] font-bold uppercase tracking-wider line-clamp-2">
                      {book.tag}
                    </div>
                    <div className="text-[10px] font-extrabold line-clamp-3 leading-tight">
                      {book.title}
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <span className="inline-block text-[10px] font-semibold text-pbgreen-dark bg-pbgreen-light border border-pbgreen-border px-2 py-0.5 rounded-md mb-1.5">
                      {book.tag}
                    </span>
                    <h4 className="text-sm font-bold text-foreground line-clamp-2 leading-tight">
                      {book.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">by {book.author}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-foreground">
                        {book.price}
                      </span>
                      <div className="flex items-center text-xs text-amber-500 font-semibold gap-0.5">
                        <Star size={12} fill="currentColor" /> {book.rating}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(book.title)}
                      className="inline-flex items-center gap-1.5 rounded-lg text-white px-3 py-1.5 text-xs font-semibold shadow-2xs transition-opacity hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: "#137365" }}
                    >
                      <ShoppingBag size={13} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between gap-3">
            <button
              onClick={() => setSelectedGenre(null)}
              className="w-full rounded-lg border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
            >
              Close Showcase
            </button>
            <button
              onClick={() => {
                toast.success(`Opening full ${selectedGenre} catalogue`);
                setSelectedGenre(null);
              }}
              className="w-full rounded-lg bg-foreground text-background py-2 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              View All Titles
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Footer */}
      <PbWebFooter />
    </div>
  );
}
