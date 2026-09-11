import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Check,
  Plus,
  X,
  Sparkles,
  Save,
  RotateCcw,
  BookOpen,
  Building2,
  Feather,
  Layers,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BookCover } from "@/components/ui/book-cover";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { toast } from "sonner";
import {
  getCollectionById,
  getCollectionBookIds,
  updateCollectionBooks,
  FEATURED_CATALOGUE_BOOKS,
  ALL_CATEGORIES,
  ALL_SUB_CATEGORIES,
  ALL_PUBLISHERS,
  ALL_AUTHORS,
  type FeaturedBook,
} from "@/lib/featured-collections-data";

export const Route = createFileRoute("/pb-admin/featured-collections_/$id/books")({
  head: () => ({
    meta: [
      { title: "Manage Collection Books — PixelBooks Admin" },
      {
        name: "description",
        content: "Add and remove titles, search catalogue, and filter by category, publisher, and author.",
      },
    ],
  }),
  component: ManageCollectionBooksPage,
});

function ManageCollectionBooksPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  // Retrieve current collection details
  const collection = useMemo(() => {
    return (
      getCollectionById(id) || {
        id,
        name: "Featured Collection",
        views: 0,
        avgSalesMonthly: 0,
        status: "Enabled" as const,
        description: "Curated collection of featured titles",
        bookCount: 0,
        designLayout: "A1 Design" as const,
        sorting: "1",
      }
    );
  }, [id]);

  // Selected books state initialized from stored collection data
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>(() => {
    return getCollectionBookIds(id);
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("All Sub Categories");
  const [selectedPublisher, setSelectedPublisher] = useState<string>("All Publishers");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("All Authors");

  // Track if any changes have been made
  const [hasChanges, setHasChanges] = useState(false);

  // Sync if id changes
  useEffect(() => {
    setSelectedBookIds(getCollectionBookIds(id));
    setHasChanges(false);
  }, [id]);

  // Map of full book objects for currently selected books
  const selectedBooks = useMemo(() => {
    return selectedBookIds
      .map((bookId) => FEATURED_CATALOGUE_BOOKS.find((b) => b.id === bookId))
      .filter((b): b is FeaturedBook => b !== undefined);
  }, [selectedBookIds]);

  // Subcategories filtered dynamically based on Category selection
  const availableSubCategories = useMemo(() => {
    if (selectedCategory === "All Categories") {
      return ALL_SUB_CATEGORIES;
    }
    const matching = FEATURED_CATALOGUE_BOOKS.filter(
      (b) => b.category.toLowerCase() === selectedCategory.toLowerCase()
    ).map((b) => b.subCategory);
    const unique = Array.from(new Set(matching));
    return ["All Sub Categories", ...unique];
  }, [selectedCategory]);

  // Reset SubCategory if not valid for selected Category
  useEffect(() => {
    if (
      selectedCategory !== "All Categories" &&
      selectedSubCategory !== "All Sub Categories" &&
      !availableSubCategories.includes(selectedSubCategory)
    ) {
      setSelectedSubCategory("All Sub Categories");
    }
  }, [selectedCategory, selectedSubCategory, availableSubCategories]);

  // Candidate catalogue books filtered by Search and 4 Dropdowns
  const filteredCandidateBooks = useMemo(() => {
    return FEATURED_CATALOGUE_BOOKS.filter((book) => {
      // Category filter
      if (
        selectedCategory !== "All Categories" &&
        book.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Sub Category filter
      if (
        selectedSubCategory !== "All Sub Categories" &&
        book.subCategory.toLowerCase() !== selectedSubCategory.toLowerCase()
      ) {
        return false;
      }

      // Publisher filter
      if (
        selectedPublisher !== "All Publishers" &&
        book.publisher.toLowerCase() !== selectedPublisher.toLowerCase()
      ) {
        return false;
      }

      // Author filter
      if (
        selectedAuthor !== "All Authors" &&
        book.author.toLowerCase() !== selectedAuthor.toLowerCase()
      ) {
        return false;
      }

      // Text search query (Title, Author, Publisher, ISBN, Category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = book.title.toLowerCase().includes(q);
        const matchesAuthor = book.author.toLowerCase().includes(q);
        const matchesPublisher = book.publisher.toLowerCase().includes(q);
        const matchesIsbn = book.isbn.toLowerCase().includes(q);
        const matchesCategory = book.category.toLowerCase().includes(q);
        const matchesSubCategory = book.subCategory.toLowerCase().includes(q);

        if (
          !matchesTitle &&
          !matchesAuthor &&
          !matchesPublisher &&
          !matchesIsbn &&
          !matchesCategory &&
          !matchesSubCategory
        ) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedSubCategory, selectedPublisher, selectedAuthor]);

  // Toggle book selection (Add or Remove)
  const handleToggleBook = (bookId: string) => {
    setSelectedBookIds((prev) => {
      const exists = prev.includes(bookId);
      const next = exists ? prev.filter((b) => b !== bookId) : [...prev, bookId];
      const targetBook = FEATURED_CATALOGUE_BOOKS.find((b) => b.id === bookId);
      if (exists) {
        toast.info(`Removed "${targetBook?.title || "Book"}" from collection`);
      } else {
        toast.success(`Added "${targetBook?.title || "Book"}" to collection`);
      }
      return next;
    });
    setHasChanges(true);
  };

  // Explicit remove handler from Top Section
  const handleRemoveBook = (bookId: string) => {
    setSelectedBookIds((prev) => prev.filter((b) => b !== bookId));
    const targetBook = FEATURED_CATALOGUE_BOOKS.find((b) => b.id === bookId);
    toast.info(`Removed "${targetBook?.title || "Book"}" from collection`);
    setHasChanges(true);
  };

  // Clear all selected books
  const handleClearAllSelected = () => {
    if (selectedBookIds.length === 0) return;
    setSelectedBookIds([]);
    toast.info("Cleared all selected titles from this collection");
    setHasChanges(true);
  };

  // Add all filtered books
  const handleAddAllFiltered = () => {
    const unselectedFilteredIds = filteredCandidateBooks
      .map((b) => b.id)
      .filter((id) => !selectedBookIds.includes(id));

    if (unselectedFilteredIds.length === 0) return;

    setSelectedBookIds((prev) => [...prev, ...unselectedFilteredIds]);
    toast.success(`Added ${unselectedFilteredIds.length} titles to collection`);
    setHasChanges(true);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedSubCategory("All Sub Categories");
    setSelectedPublisher("All Publishers");
    setSelectedAuthor("All Authors");
  };

  const isAnyFilterActive =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All Categories" ||
    selectedSubCategory !== "All Sub Categories" ||
    selectedPublisher !== "All Publishers" ||
    selectedAuthor !== "All Authors";

  // Save changes
  const handleSaveChanges = () => {
    updateCollectionBooks(id, selectedBookIds);
    toast.success("Featured Collection updated successfully!", {
      description: `${selectedBookIds.length} titles saved to "${collection.name}".`,
    });
    setHasChanges(false);
    navigate({ to: "/pb-admin/featured-collections" });
  };

  return (
    <AppShell
      title="Featured Collections"
      subtitle={`Manage titles assigned to "${collection.name}"`}
    >
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
        {/* Page Top Navigation & Header Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/pb-admin/featured-collections"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
              aria-label="Back to Featured Collections"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {collection.name}
                </h1>
                <span className="inline-flex items-center rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-xs font-medium text-foreground">
                  {collection.designLayout || "A1 Design"}
                </span>
                {collection.status && (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      collection.status === "Enabled"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {collection.status}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add or remove titles for this featured collection • {selectedBookIds.length} titles currently selected
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/pb-admin/featured-collections"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer shadow-2xs"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSaveChanges}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-[var(--brand)]/90 cursor-pointer"
            >
              <Save size={14} />
              <span>Save Changes</span>
              {hasChanges && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* TOP SECTION: Currently Selected Titles with Book Cover Photo */}
        <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)] shadow-2xs">
                <Sparkles size={16} />
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-foreground">
                  Currently Selected Titles
                </h2>
                <p className="text-xs text-muted-foreground">
                  Books displayed to users in this featured collection
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <span className="inline-flex items-center rounded-full bg-[var(--sidebar-highlight)] px-3 py-1 text-xs font-bold text-[var(--brand)] border border-[var(--brand)]/20 shadow-2xs">
                {selectedBooks.length} {selectedBooks.length === 1 ? "Book" : "Books"} Selected
              </span>

              {selectedBooks.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllSelected}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors cursor-pointer"
                  title="Remove all books from this collection"
                >
                  <Trash2 size={13} />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Selected Books Showcase */}
          {selectedBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border border-dashed border-border/80 bg-secondary/15">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-3">
                <BookOpen size={22} />
              </div>
              <p className="text-sm font-semibold text-foreground">No Titles Selected Yet</p>
              <p className="text-xs text-muted-foreground max-w-md mt-1">
                Browse available catalogue books below and click "+ Add to Collection" to feature them in this section.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 pt-1">
              {selectedBooks.map((book) => (
                <div
                  key={book.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-border/90 bg-card p-3 transition-all hover:border-[var(--brand)]/50 hover:shadow-xs"
                >
                  {/* Quick Remove Button (Top Right corner badge) */}
                  <button
                    type="button"
                    onClick={() => handleRemoveBook(book.id)}
                    className="absolute -right-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:bg-rose-500 hover:text-white hover:border-rose-500 cursor-pointer"
                    title={`Remove "${book.title}"`}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>

                  {/* Book Cover Photo Showcase */}
                  <div className="flex items-center justify-center py-2">
                    <BookCover
                      initials={book.initials}
                      coverGradient={book.coverGradient}
                      title={book.title}
                      size="md"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="mt-2 text-center space-y-1">
                    <p
                      className="font-semibold text-xs text-foreground line-clamp-2 leading-tight group-hover:text-[var(--brand)] transition-colors"
                      title={book.title}
                    >
                      {book.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate" title={book.author}>
                      {book.author}
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="inline-block max-w-[110px] truncate text-[10px] font-medium text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-md">
                        {book.category}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button Action */}
                  <button
                    type="button"
                    onClick={() => handleRemoveBook(book.id)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-border bg-secondary/30 px-2 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/30 cursor-pointer"
                  >
                    <X size={11} />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEARCH & FILTERS TOOLBAR: Search + 4 Dropdowns (Category, Sub Category, Publisher, Author) */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Search & Filter Catalogue
            </h3>
            {isAnyFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* 1. Search Box (Takes 4 cols on large) */}
            <div className="lg:col-span-4">
              <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3 shadow-2xs">
                <Search size={15} className="mr-2 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, publisher, ISBN..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
            </div>

            {/* 2. Category Dropdown (2 cols) */}
            <div className="lg:col-span-2">
              <DropdownSelect
                value={selectedCategory}
                options={ALL_CATEGORIES}
                onChange={(v) => setSelectedCategory(v)}
                searchable
                searchPlaceholder="Search category..."
                className="w-full"
              />
            </div>

            {/* 3. Sub Category Dropdown (2 cols) */}
            <div className="lg:col-span-2">
              <DropdownSelect
                value={selectedSubCategory}
                options={availableSubCategories}
                onChange={(v) => setSelectedSubCategory(v)}
                searchable
                searchPlaceholder="Search subcategory..."
                className="w-full"
              />
            </div>

            {/* 4. Publisher Dropdown (2 cols) */}
            <div className="lg:col-span-2">
              <DropdownSelect
                value={selectedPublisher}
                options={ALL_PUBLISHERS}
                onChange={(v) => setSelectedPublisher(v)}
                searchable
                searchPlaceholder="Search publisher..."
                className="w-full"
              />
            </div>

            {/* 5. Author Dropdown (2 cols) */}
            <div className="lg:col-span-2">
              <DropdownSelect
                value={selectedAuthor}
                options={ALL_AUTHORS}
                onChange={(v) => setSelectedAuthor(v)}
                searchable
                searchPlaceholder="Search author..."
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* AVAILABLE CATALOGUE TITLES SECTION */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
          {/* Section Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border px-6 py-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                Available Catalogue Titles
              </h2>
              <p className="text-xs text-muted-foreground">
                Showing {filteredCandidateBooks.length} books matching filter criteria
              </p>
            </div>

            {filteredCandidateBooks.length > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAddAllFiltered}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer shadow-2xs"
                >
                  <CheckCheck size={14} className="text-[var(--brand)]" />
                  <span>Add All Filtered</span>
                </button>
              </div>
            )}
          </div>

          {/* Books Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Title & Entities</th>
                  <th className="py-4 pr-4 font-semibold">Category & Sub Category</th>
                  <th className="py-4 pr-4 font-semibold">ISBN</th>
                  <th className="py-4 pr-4 font-semibold text-right">Price</th>
                  <th className="py-4 pr-4 font-semibold text-center">Collection Status</th>
                  <th className="py-4 pr-6 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCandidateBooks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                      No books found matching the current search & filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCandidateBooks.map((b) => {
                    const isSelected = selectedBookIds.includes(b.id);
                    return (
                      <tr
                        key={b.id}
                        className={`group border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40 ${
                          isSelected ? "bg-[var(--sidebar-highlight)]/30" : ""
                        }`}
                      >
                        {/* Title Section Layout matching PixelBooks Style Guide Section 6 */}
                        <td className="py-4 pl-6 pr-4">
                          <div className="flex items-start gap-3.5">
                            <BookCover
                              initials={b.initials}
                              coverGradient={b.coverGradient}
                              title={b.title}
                              size="sm"
                            />
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <p className="font-semibold text-sm leading-snug text-foreground transition-colors group-hover:text-[var(--brand)]">
                                {b.title}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                {/* Author Chip */}
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2.5 py-0.5 shadow-2xs">
                                  <Feather size={11} className="text-emerald-600 dark:text-emerald-400" />
                                  <span className="text-[11.5px] font-medium text-foreground">
                                    {b.author}
                                  </span>
                                </div>

                                {/* Publisher Chip */}
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                                  <Building2 size={11} className="shrink-0 text-muted-foreground/80" />
                                  <span>{b.publisher}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category & Sub Category */}
                        <td className="py-4 pr-4">
                          <div className="space-y-1">
                            <span className="inline-block rounded-md border border-border bg-card px-2 py-0.5 text-xs font-semibold text-foreground">
                              {b.category}
                            </span>
                            <p className="text-[11px] text-muted-foreground font-medium">
                              {b.subCategory}
                            </p>
                          </div>
                        </td>

                        {/* ISBN */}
                        <td className="py-4 pr-4 text-xs font-mono text-muted-foreground">
                          {b.isbn}
                        </td>

                        {/* Price */}
                        <td className="py-4 pr-4 text-right font-semibold text-foreground text-sm">
                          ₹{b.price}
                        </td>

                        {/* Collection Status Pill */}
                        <td className="py-4 pr-4 text-center">
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                              <Check size={12} strokeWidth={2.5} />
                              <span>In Collection</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground border border-border">
                              Not Added
                            </span>
                          )}
                        </td>

                        {/* Action Column */}
                        <td className="py-4 pr-6 text-right whitespace-nowrap">
                          {isSelected ? (
                            <button
                              type="button"
                              onClick={() => handleToggleBook(b.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors hover:bg-rose-500 hover:text-white cursor-pointer shadow-2xs"
                            >
                              <X size={13} />
                              <span>Remove</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleBook(b.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[var(--brand)]/90 cursor-pointer"
                            >
                              <Plus size={13} strokeWidth={2.5} />
                              <span>Add to Collection</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-border px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Showing {filteredCandidateBooks.length} available books • {selectedBookIds.length} currently selected for this collection
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveChanges}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[var(--brand)] px-4 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[var(--brand)]/90 cursor-pointer"
              >
                <Save size={13} />
                <span>Save and Return</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
