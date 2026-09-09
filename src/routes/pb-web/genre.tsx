import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PbWebHeader } from "@/components/pb-web-header";
import { PbWebFooter } from "@/components/pb-web-footer";
import { categoryColumns } from "./data";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Browse Genres");
  const [cartCount] = useState(2);
  const [unreadNotifications] = useState(1);

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

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col justify-between selection:bg-[#137365]/20 selection:text-[#137365] pb-web-portal">
      {/* Top Header Navbar */}
      <PbWebHeader
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
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
                    <a
                      href="#"
                      className="text-left text-[13.5px] font-normal leading-snug transition-all duration-150 cursor-pointer block w-full py-1 text-foreground/85 hover:text-[#137365] hover:translate-x-1"
                    >
                      {genre}
                    </a>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <PbWebFooter />
    </div>
  );
}
