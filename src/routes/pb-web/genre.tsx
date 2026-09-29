import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Search, Star, X } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PbWebHeader } from "@/components/pb-web-header";
import { PbWebFooter } from "@/components/pb-web-footer";
import { Checkbox } from "@/components/ui/checkbox";
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

const INITIAL_AUTHORS = [
  "A. M. Shinas",
  "Abdulla Anchillathu",
  "Abhinash Thundumannil",
  "Abraham Mathew",
  "Adarsh V.G",
];

const MORE_AUTHORS = [
  "Akhil P. Dharmajan",
  "Amal K.",
  "Arundhati Roy",
  "Benyamin",
  "Chetan Bhagat",
  "Dr. A. P. J. Abdul Kalam",
  "K. R. Meera",
  "Madhavikutty",
  "O. V. Vijayan",
  "Vaikom Muhammad Basheer",
];

const FILTER_CATEGORIES = [
  "Academic & Educational",
  "Children's Literature",
  "Crime, Thriller, Mystery",
  "Fiction",
  "History",
  "JEE",
  "Literature & Poems",
  "NEET",
  "Non-Fiction",
  "Reference",
];

const FILTER_LANGUAGES = [
  "English",
  "Malayalam",
  "Hindi",
  "Tamil",
  "Sanskrit",
  "Arabic",
];

const FILTER_PRICES = [
  "Free",
  "Under ₹199",
  "₹200 to ₹499",
  "₹500 to ₹999",
  "₹1,000 & Above",
];

const FILTER_REVIEWS = [
  { rating: 4, label: "4★ & above" },
  { rating: 3, label: "3★ & above" },
  { rating: 2, label: "2★ & above" },
  { rating: 1, label: "1★ & above" },
];

function PixelBooksWebsitePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Browse Genres");
  const [cartCount] = useState(2);
  const [unreadNotifications] = useState(1);

  // Filter sidebar states
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    authors: true,
    categories: false,
    languages: false,
    prices: false,
    customerReview: false,
  });

  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Search input for authors and categories within filters
  const [authorSearchTerm, setAuthorSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleAuthor = (author: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(author) ? prev.filter((a) => a !== author) : [...prev, author]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const togglePrice = (price: string) => {
    setSelectedPrices((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
    );
  };

  const activeFiltersCount =
    selectedAuthors.length +
    selectedCategories.length +
    selectedLanguages.length +
    selectedPrices.length +
    (selectedRating !== null ? 1 : 0);

  const handleApplyFilters = () => {
    toast.success("Filters applied", {
      description: `Showing results with ${activeFiltersCount} filter${activeFiltersCount === 1 ? "" : "s"} active.`,
    });
  };

  const handleClearAllFilters = () => {
    setSelectedAuthors([]);
    setSelectedCategories([]);
    setSelectedLanguages([]);
    setSelectedPrices([]);
    setSelectedRating(null);
    setAuthorSearchTerm("");
    setCategorySearchTerm("");
    setSearchQuery("");
  };

  // All combined authors for search
  const allAuthors = useMemo(() => {
    return [...INITIAL_AUTHORS, ...MORE_AUTHORS];
  }, []);

  // Filtered authors matching authorSearchTerm
  const searchedAuthors = useMemo(() => {
    const q = authorSearchTerm.trim().toLowerCase();
    if (!q) return [];
    return allAuthors.filter((author) => author.toLowerCase().includes(q));
  }, [allAuthors, authorSearchTerm]);

  // Filtered categories matching categorySearchTerm
  const searchedCategories = useMemo(() => {
    const q = categorySearchTerm.trim().toLowerCase();
    if (!q) return FILTER_CATEGORIES;
    return FILTER_CATEGORIES.filter((cat) => cat.toLowerCase().includes(q));
  }, [categorySearchTerm]);

  // Search filter across categories
  const filteredColumns = useMemo(() => {
    let cols = categoryColumns;

    if (selectedCategories.length > 0) {
      cols = cols.map((col) =>
        col.filter((item) =>
          selectedCategories.some(
            (cat) =>
              item.toLowerCase().includes(cat.toLowerCase()) ||
              cat.toLowerCase().includes(item.toLowerCase())
          )
        )
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cols = cols.map((col) =>
        col.filter((item) => item.toLowerCase().includes(q))
      );
    }

    return cols;
  }, [searchQuery, selectedCategories]);

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

        {/* 2-Column Section: Left Filter Sidebar, Right eBooks Categories & Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start pb-12">
          {/* Left Sidebar Filter */}
          <aside className="w-full lg:w-[260px] xl:w-[280px] shrink-0 lg:sticky lg:top-4">
            <div className="rounded-xl border border-stone-200/90 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40 shadow-xs overflow-hidden">
              {/* Filter Title Header */}
              <div className="px-5 py-4 flex items-center justify-between border-b border-stone-200/90 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/70">
                <h3 className="font-bold text-[17px] text-foreground tracking-tight">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearAllFilters}
                    className="text-xs text-[#137365] hover:underline font-semibold cursor-pointer"
                  >
                    Clear all ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Section 1: Authors */}
              <div className="border-b border-stone-200/90 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => toggleSection("authors")}
                  className="w-full flex items-center justify-between px-5 py-3.5 cursor-pointer text-left font-bold text-[14px] text-foreground hover:text-[#137365] transition-colors select-none group"
                >
                  <span className="flex items-center gap-2">
                    Authors
                    {selectedAuthors.length > 0 && (
                      <span className="text-[11px] font-semibold bg-[#137365]/10 text-[#137365] px-1.5 py-0.5 rounded-full">
                        {selectedAuthors.length}
                      </span>
                    )}
                  </span>
                  {expandedSections.authors ? (
                    <ChevronDown className="w-4 h-4 text-foreground/80 transition-transform group-hover:text-[#137365]" strokeWidth={2.5} />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-foreground/80 transition-transform group-hover:text-[#137365]" strokeWidth={2.5} />
                  )}
                </button>
                {expandedSections.authors && (
                  <div className="px-5 pb-4 space-y-2.5">
                    {/* Author Search Box */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={authorSearchTerm}
                        onChange={(e) => setAuthorSearchTerm(e.target.value)}
                        placeholder="Search authors..."
                        className="w-full pl-8 pr-7 py-1.5 text-xs rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-[#137365] text-foreground placeholder:text-muted-foreground"
                      />
                      {authorSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setAuthorSearchTerm("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    {/* Author List - Shown while searching or if selected */}
                    {authorSearchTerm.trim() ? (
                      searchedAuthors.length > 0 ? (
                        <div className="max-h-48 overflow-y-auto space-y-2 pt-1 pr-1">
                          {searchedAuthors.map((author) => (
                            <div key={author} className="flex items-center gap-2.5">
                              <Checkbox
                                id={`author-${author}`}
                                checked={selectedAuthors.includes(author)}
                                onCheckedChange={() => toggleAuthor(author)}
                                className="h-4 w-4 rounded-[3px] border-stone-300 dark:border-stone-600 bg-white data-[state=checked]:bg-[#137365] data-[state=checked]:border-[#137365] data-[state=checked]:text-white shadow-none focus-visible:ring-[#137365]"
                              />
                              <label
                                htmlFor={`author-${author}`}
                                className="text-[13.5px] text-foreground/85 hover:text-foreground cursor-pointer select-none leading-none font-normal"
                              >
                                {author}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground/70 italic py-1">
                          No authors found
                        </p>
                      )
                    ) : selectedAuthors.length > 0 ? (
                      <div className="space-y-2 pt-1">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Selected Authors:
                        </p>
                        {selectedAuthors.map((author) => (
                          <div key={author} className="flex items-center gap-2.5">
                            <Checkbox
                              id={`author-${author}`}
                              checked={true}
                              onCheckedChange={() => toggleAuthor(author)}
                              className="h-4 w-4 rounded-[3px] border-stone-300 dark:border-stone-600 bg-white data-[state=checked]:bg-[#137365] data-[state=checked]:border-[#137365] data-[state=checked]:text-white shadow-none focus-visible:ring-[#137365]"
                            />
                            <label
                              htmlFor={`author-${author}`}
                              className="text-[13.5px] text-foreground/85 hover:text-foreground cursor-pointer select-none leading-none font-normal"
                            >
                              {author}
                            </label>
                          </div>
                        ))}
                        <p className="text-[11.5px] text-muted-foreground pt-1">
                          Type in the search box above to find more authors.
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Section 2: Categories */}
              <div className="border-b border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => toggleSection("categories")}
                  className="w-full flex items-center justify-between px-5 py-3.5 cursor-pointer text-left font-bold text-[14px] text-foreground hover:text-[#137365] transition-colors select-none group"
                >
                  <span className="flex items-center gap-2">
                    Categories
                    {selectedCategories.length > 0 && (
                      <span className="text-[11px] font-semibold bg-[#137365]/10 text-[#137365] px-1.5 py-0.5 rounded-full">
                        {selectedCategories.length}
                      </span>
                    )}
                  </span>
                  {expandedSections.categories ? (
                    <ChevronDown className="w-4 h-4 text-foreground/80 transition-transform group-hover:text-[#137365]" strokeWidth={2.5} />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-foreground/80 transition-transform group-hover:text-[#137365]" strokeWidth={2.5} />
                  )}
                </button>
                {expandedSections.categories && (
                  <div className="px-5 pb-4 space-y-2.5">
                    {/* Category Search Box */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={categorySearchTerm}
                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                        placeholder="Search categories..."
                        className="w-full pl-8 pr-7 py-1.5 text-xs rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-[#137365] text-foreground placeholder:text-muted-foreground"
                      />
                      {categorySearchTerm && (
                        <button
                          type="button"
                          onClick={() => setCategorySearchTerm("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    {/* Category List */}
                    {searchedCategories.length > 0 ? (
                      <div className="max-h-52 overflow-y-auto space-y-2 pt-1 pr-1">
                        {searchedCategories.map((cat) => (
                          <div key={cat} className="flex items-center gap-2.5">
                            <Checkbox
                              id={`cat-${cat}`}
                              checked={selectedCategories.includes(cat)}
                              onCheckedChange={() => toggleCategory(cat)}
                              className="h-4 w-4 rounded-[3px] border-stone-300 dark:border-stone-600 bg-white data-[state=checked]:bg-[#137365] data-[state=checked]:border-[#137365] data-[state=checked]:text-white shadow-none focus-visible:ring-[#137365]"
                            />
                            <label
                              htmlFor={`cat-${cat}`}
                              className="text-[14px] text-foreground/85 hover:text-foreground cursor-pointer select-none leading-none font-normal"
                            >
                              {cat}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground/70 italic py-1">
                        No categories found
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Section 3: Languages */}
              <div className="border-b border-stone-200/90 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => toggleSection("languages")}
                  className="w-full flex items-center justify-between px-5 py-3.5 cursor-pointer text-left font-bold text-[14px] text-foreground hover:text-[#137365] transition-colors select-none group"
                >
                  <span className="flex items-center gap-2">
                    Languages
                    {selectedLanguages.length > 0 && (
                      <span className="text-[11px] font-semibold bg-[#137365]/10 text-[#137365] px-1.5 py-0.5 rounded-full">
                        {selectedLanguages.length}
                      </span>
                    )}
                  </span>
                  {expandedSections.languages ? (
                    <ChevronDown className="w-4 h-4 text-foreground/80 transition-transform group-hover:text-[#137365]" strokeWidth={2.5} />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-foreground/80 transition-transform group-hover:text-[#137365]" strokeWidth={2.5} />
                  )}
                </button>
                {expandedSections.languages && (
                  <div className="px-5 pb-4 space-y-2.5">
                    {FILTER_LANGUAGES.map((lang) => (
                      <div key={lang} className="flex items-center gap-2.5">
                        <Checkbox
                          id={`lang-${lang}`}
                          checked={selectedLanguages.includes(lang)}
                          onCheckedChange={() => toggleLanguage(lang)}
                          className="h-4 w-4 rounded-[3px] border-stone-300 dark:border-stone-600 bg-white data-[state=checked]:bg-[#137365] data-[state=checked]:border-[#137365] data-[state=checked]:text-white shadow-none focus-visible:ring-[#137365]"
                        />
                        <label
                          htmlFor={`lang-${lang}`}
                          className="text-[14px] text-foreground/85 hover:text-foreground cursor-pointer select-none leading-none font-normal"
                        >
                          {lang}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 4: Prices */}
              <div className="border-b border-stone-200/90 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => toggleSection("prices")}
                  className="w-full flex items-center justify-between px-5 py-3.5 cursor-pointer text-left font-bold text-[14px] text-foreground hover:text-[#137365] transition-colors select-none group"
                >
                  <span className="flex items-center gap-2">
                    Prices
                    {selectedPrices.length > 0 && (
                      <span className="text-[11px] font-semibold bg-[#137365]/10 text-[#137365] px-1.5 py-0.5 rounded-full">
                        {selectedPrices.length}
                      </span>
                    )}
                  </span>
                  {expandedSections.prices ? (
                    <ChevronDown className="w-4 h-4 text-foreground/80 transition-transform group-hover:text-[#137365]" strokeWidth={2.5} />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-foreground/80 transition-transform group-hover:text-[#137365]" strokeWidth={2.5} />
                  )}
                </button>
                {expandedSections.prices && (
                  <div className="px-5 pb-4 space-y-2.5">
                    {FILTER_PRICES.map((price) => (
                      <div key={price} className="flex items-center gap-2.5">
                        <Checkbox
                          id={`price-${price}`}
                          checked={selectedPrices.includes(price)}
                          onCheckedChange={() => togglePrice(price)}
                          className="h-4 w-4 rounded-[3px] border-stone-300 dark:border-stone-600 bg-white data-[state=checked]:bg-[#137365] data-[state=checked]:border-[#137365] data-[state=checked]:text-white shadow-none focus-visible:ring-[#137365]"
                        />
                        <label
                          htmlFor={`price-${price}`}
                          className="text-[14px] text-foreground/85 hover:text-foreground cursor-pointer select-none leading-none font-normal"
                        >
                          {price}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 5: Customer Review */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection("customerReview")}
                  className="w-full flex items-center justify-between px-5 py-3.5 cursor-pointer text-left font-bold text-[14px] text-foreground hover:text-[#137365] transition-colors select-none group"
                >
                  <span className="flex items-center gap-2">
                    Customer Reviews
                    {selectedRating !== null && (
                      <span className="text-[11px] font-semibold bg-[#137365]/10 text-[#137365] px-1.5 py-0.5 rounded-full">
                        1
                      </span>
                    )}
                  </span>
                  {expandedSections.customerReview ? (
                    <ChevronDown className="w-4 h-4 text-foreground/80 transition-transform group-hover:text-[#137365]" strokeWidth={2.5} />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-foreground/80 transition-transform group-hover:text-[#137365]" strokeWidth={2.5} />
                  )}
                </button>
                {expandedSections.customerReview && (
                  <div className="px-5 pb-4 space-y-2">
                    {FILTER_REVIEWS.map((rev) => {
                      const isSelected = selectedRating === rev.rating;
                      return (
                        <button
                          key={rev.rating}
                          type="button"
                          onClick={() => setSelectedRating(isSelected ? null : rev.rating)}
                          className={`w-full flex items-center gap-2 py-1 px-2 -mx-2 rounded hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left cursor-pointer ${
                            isSelected
                              ? "bg-[#137365]/10 text-[#137365] font-semibold"
                              : "text-foreground/85"
                          }`}
                        >
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < rev.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-stone-300 dark:text-stone-600"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-[13.5px]">& up</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Action Footer: Apply & Reset Buttons */}
              <div className="p-4 border-t border-stone-200/90 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/70 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-semibold rounded-lg bg-[#137365] hover:bg-[#0f5c51] text-white shadow-xs transition-colors cursor-pointer"
                >
                  Apply Filters
                  {activeFiltersCount > 0 && (
                    <span className="text-[11px] font-bold bg-white/20 text-white px-1.5 py-0.2 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1 font-medium transition-colors cursor-pointer"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Right Main Content: Category Header & Grid */}
          <div className="flex-1 min-w-0 w-full">
            {/* Category Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  Categories
                </h2>
                {(searchQuery || activeFiltersCount > 0) && (
                  <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-0.5 rounded-full border border-border">
                    {totalResults} matching
                  </span>
                )}
              </div>
              {(searchQuery || activeFiltersCount > 0) && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <X size={13} /> Clear all filters
                </button>
              )}
            </div>

            {/* Active Filters Badges Bar */}
            {activeFiltersCount > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Applied:</span>
                {selectedAuthors.map((author) => (
                  <span
                    key={author}
                    className="inline-flex items-center gap-1 text-xs bg-stone-100 dark:bg-stone-800 text-foreground px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700"
                  >
                    Author: {author}
                    <button
                      onClick={() => toggleAuthor(author)}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 text-xs bg-stone-100 dark:bg-stone-800 text-foreground px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700"
                  >
                    Category: {cat}
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1 text-xs bg-stone-100 dark:bg-stone-800 text-foreground px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700"
                  >
                    {lang}
                    <button
                      onClick={() => toggleLanguage(lang)}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedPrices.map((price) => (
                  <span
                    key={price}
                    className="inline-flex items-center gap-1 text-xs bg-stone-100 dark:bg-stone-800 text-foreground px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700"
                  >
                    {price}
                    <button
                      onClick={() => togglePrice(price)}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedRating !== null && (
                  <span className="inline-flex items-center gap-1 text-xs bg-stone-100 dark:bg-stone-800 text-foreground px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700">
                    {selectedRating}★ & up
                    <button
                      onClick={() => setSelectedRating(null)}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* 4-Column eBooks Category Grid with vertical dividers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 lg:gap-y-0 lg:divide-x lg:divide-border/60">
              {filteredColumns.map((column, colIdx) => (
                <div
                  key={colIdx}
                  className={`space-y-3.5 ${
                    colIdx === 0
                      ? "lg:pr-5 xl:pr-7"
                      : colIdx === 3
                      ? "lg:pl-5 xl:pl-7"
                      : "lg:px-5 xl:px-7"
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <PbWebFooter />
    </div>
  );
}
