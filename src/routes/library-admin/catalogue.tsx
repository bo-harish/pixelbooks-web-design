import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { BookCover } from "@/components/ui/book-cover";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  initialLibraryBooks,
  type LibraryBook,
  type Purchase,
} from "@/lib/library-catalogue-data";

export const Route = createFileRoute("/library-admin/catalogue")({
  component: LibraryCataloguePage,
});

function LibraryCataloguePage() {
  const PRESETS = ["MTD", "QTD", "YTD", "Last 30 days", "Custom"] as const;
  type Preset = (typeof PRESETS)[number];

  const [books, setBooks] = useState<LibraryBook[]>(initialLibraryBooks);
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Inactive">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);

  // Date Preset states matching margin-report
  const [preset, setPreset] = useState<Preset>("YTD");
  const [presetOpen, setPresetOpen] = useState(false);
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState("2026-07-11");

  const PAGE_SIZE = 6;

  // Toggle switch status
  const handleToggleStatus = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const nextStatus = b.status === "Active" ? "Inactive" : "Active";
          toast.success(`"${b.title}" is now ${nextStatus}`);
          return { ...b, status: nextStatus };
        }
        return b;
      }),
    );
  };

  // Date Preset handler matching margin-report calculation patterns
  const handlePresetSelect = (p: Preset) => {
    setPreset(p);
    setPresetOpen(false);

    const today = new Date("2026-07-11");
    let fromDate = new Date("2026-07-11");
    const toDate = new Date("2026-07-11");

    if (p === "MTD") {
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (p === "QTD") {
      const quarter = Math.floor(today.getMonth() / 3);
      fromDate = new Date(today.getFullYear(), quarter * 3, 1);
    } else if (p === "YTD") {
      fromDate = new Date(today.getFullYear(), 0, 1);
    } else if (p === "Last 30 days") {
      fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 30);
    } else {
      return; // Custom
    }

    const formatDate = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    setFrom(formatDate(fromDate));
    setTo(formatDate(toDate));
    setPage(1);
  };

  // Filter & Search Logic
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      // Date Range Filter
      const pDate = new Date(b.purchaseDate);
      const fromDate = new Date(from);
      const toDate = new Date(to);
      pDate.setHours(0, 0, 0, 0);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      const matchesDate = pDate >= fromDate && pDate <= toDate;
      if (!matchesDate) return false;

      // Tab Status Filter
      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Active" && b.status === "Active") ||
        (activeTab === "Inactive" && b.status === "Inactive");

      // Search Text Filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        b.title.toLowerCase().includes(query) ||
        b.publisher.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.isbn.includes(query);

      return matchesTab && matchesSearch;
    });
  }, [books, activeTab, searchQuery, from, to]);

  // Pagination Logic
  const totalResults = filteredBooks.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + PAGE_SIZE);

  // Chevron click logic
  const toggleExpand = (bookId: string) => {
    setExpandedBookId((prev) => (prev === bookId ? null : bookId));
  };

  return (
    <AppShell
      title="Catalogue"
      subtitle="Overview of digital catalogue, copies, and active availability."
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Single Line Filter Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center gap-2.5 rounded-xl border border-border bg-card p-4 relative z-10">
          {/* Main Search Bar */}
          <div className="relative flex-1 min-w-[240px] w-full max-w-2xl lg:max-w-3xl">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, ISBN, author..."
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
          </div>

          {/* Status Dropdown Filter */}
          <DropdownSelect
            value={activeTab === "All" ? "All Statuses" : `${activeTab} Status`}
            options={["All Statuses", "Active Status", "Inactive Status"]}
            onChange={(tab) => {
              const next =
                tab === "All Statuses" ? "All" : tab === "Active Status" ? "Active" : "Inactive";
              setActiveTab(next as "All" | "Active" | "Inactive");
              setPage(1);
            }}
            searchable
            searchPlaceholder="Search status..."
            align="left"
            className="w-full sm:w-auto min-w-[130px] shrink-0"
          />

          {/* Right Aligned Date Filter Group */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 xl:ml-auto">
            {/* Preset Dropdown */}
            <div className="relative shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setPresetOpen((v) => !v)}
                className="flex h-11 w-full sm:w-auto items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground cursor-pointer min-w-[100px]"
              >
                <span>{preset}</span>
                <ChevronDown size={15} className="text-muted-foreground" />
              </button>
              {presetOpen && (
                <div className="absolute right-0 z-20 mt-1.5 w-36 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className={`flex w-full items-center px-3.5 py-2 text-left text-sm transition-colors hover:bg-secondary ${p === preset ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Date Pickers */}
            <div className="flex items-center gap-1.5 shrink-0">
              <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-2.5">
                <input
                  type="date"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setPreset("Custom");
                    setPage(1);
                  }}
                  className="bg-transparent text-xs outline-none text-foreground cursor-pointer"
                />
              </label>
              <span className="text-xs font-medium text-muted-foreground">to</span>
              <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-2.5">
                <input
                  type="date"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    setPreset("Custom");
                    setPage(1);
                  }}
                  className="bg-transparent text-xs outline-none text-foreground cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Catalogue List / Table Container */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Purchased Books</th>
                  <th className="py-4 px-4 font-semibold text-center">Copies</th>
                  <th className="py-4 px-4 font-semibold text-center">Purchase Date</th>
                  <th className="py-4 px-4 font-semibold text-center">Enable/Disable</th>
                  <th className="py-4 pl-4 pr-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedBooks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-sm text-muted-foreground">
                      No eBooks found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedBooks.map((book) => {
                    const isExpanded = expandedBookId === book.id;
                    return (
                      <>
                        {" "}
                        <tr
                          key={book.id}
                          onClick={() => toggleExpand(book.id)}
                          className={`transition-colors hover:bg-secondary/40 cursor-pointer ${
                            isExpanded ? "bg-secondary/20" : ""
                          }`}
                        >
                          {/* Book Details */}
                          <td className="py-4 pl-6 pr-4">
                            <div className="flex items-center gap-4">
                              <Link
                                to="/library-admin/catalogue/$bookId"
                                params={{ bookId: book.id }}
                                onClick={(e) => e.stopPropagation()}
                                className="shrink-0 transition-transform hover:scale-105"
                              >
                                <BookCover
                                  initials={book.initials}
                                  coverGradient={book.cover}
                                  title={book.title}
                                  size="sm"
                                />
                              </Link>
                              <div className="min-w-0">
                                <Link
                                  to="/library-admin/catalogue/$bookId"
                                  params={{ bookId: book.id }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="font-semibold text-foreground hover:text-[var(--brand)] transition-colors block truncate max-w-sm md:max-w-md lg:max-w-lg cursor-pointer"
                                >
                                  {book.title}
                                </Link>
                                <span className="text-xs text-muted-foreground block">
                                  {book.publisher}
                                </span>
                              </div>
                            </div>
                          </td>
                          {/* Copies */}
                          <td className="py-4 px-4 text-center font-medium text-foreground">
                            <div className="flex flex-col items-center gap-0.5 justify-center">
                              <span>{book.copies}</span>
                              {book.purchases && book.purchases.length > 1 && (
                                <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-semibold bg-sky-50 text-sky-700 border border-sky-100 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/40 mt-1 uppercase tracking-wide">
                                  {book.purchases.length} Purchases
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Purchase Date */}
                          <td className="py-4 px-4 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-0.5 justify-center">
                              <span>{book.purchaseDate}</span>
                              {book.purchases && book.purchases.length > 1 && (
                                <span className="text-[10px] text-muted-foreground/60 italic">
                                  +{book.purchases.length - 1} earlier dates
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status Toggle Switch */}
                          <td className="py-4 px-4">
                            <div
                              className="flex items-center justify-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Switch
                                checked={book.status === "Active"}
                                onCheckedChange={() => handleToggleStatus(book.id)}
                              />
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 pl-4 pr-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <Link
                                to="/library-admin/catalogue/$bookId"
                                params={{ bookId: book.id }}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary hover:text-[var(--brand)] shadow-2xs"
                              >
                                <Eye size={13} className="text-muted-foreground" />
                                <span>View Details</span>
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpand(book.id);
                                }}
                                className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                                aria-label={isExpanded ? "Collapse row" : "Expand row"}
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Expandable Info Area */}
                        {isExpanded && (
                          <tr className="bg-secondary/10">
                            <td colSpan={5} className="p-6 border-b border-border/60">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                                    Author
                                  </span>
                                  <p className="text-sm font-medium text-foreground">
                                    {book.author}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                                    Category / Genre
                                  </span>
                                  <p className="text-sm font-medium text-foreground">
                                    {book.category}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                                    ISBN-13 Reference
                                  </span>
                                  <p className="text-sm font-medium text-foreground">{book.isbn}</p>
                                </div>
                                <div className="md:col-span-2 space-y-1 pt-2">
                                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                                    eBook Synopsis
                                  </span>
                                  <p className="text-xs leading-relaxed text-muted-foreground max-w-2xl">
                                    {book.description}
                                  </p>
                                </div>

                                {/* Purchase Breakdown Section */}
                                <div className="md:col-span-1 space-y-2 pt-2 border-t md:border-t-0 md:border-l md:pl-6 border-border/80">
                                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                                    Purchase History Breakdown
                                  </span>
                                  {book.purchases && book.purchases.length > 0 ? (
                                    <div className="space-y-1.5">
                                      {book.purchases.map((purchase, pIdx) => (
                                        <div
                                          key={pIdx}
                                          className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0"
                                        >
                                          <span className="font-semibold text-foreground">
                                            {purchase.copies}{" "}
                                            {purchase.copies === 1 ? "copy" : "copies"}
                                          </span>
                                          <span className="text-muted-foreground">
                                            {purchase.purchaseDate}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between text-xs py-1">
                                      <span className="font-semibold text-foreground">
                                        {book.copies} {book.copies === 1 ? "copy" : "copies"}
                                      </span>
                                      <span className="text-muted-foreground">
                                        {book.purchaseDate}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Full Details Link Row */}
                                <div className="md:col-span-3 flex items-center justify-between pt-4 mt-2 border-t border-border/60">
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="font-semibold text-foreground">Rating:</span>
                                    <span className="inline-flex items-center gap-1 font-medium text-foreground">
                                      <Star size={12} className="fill-amber-400 text-amber-400" />
                                      {book.rating.toFixed(1)} / 5.0
                                    </span>
                                  </div>
                                  <Link
                                    to="/library-admin/catalogue/$bookId"
                                    params={{ bookId: book.id }}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)]/10 hover:bg-[var(--brand)]/20 text-[var(--brand)] px-3.5 py-1.5 text-xs font-bold transition-colors"
                                  >
                                    <span>View Full Title & License Details</span>
                                    <ChevronRight size={14} />
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Results & Pagination Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
          {/* Results count text */}
          <div className="text-sm font-medium text-muted-foreground">
            Showing {paginatedBooks.length} from {totalResults} results
          </div>

          {/* Custom Styled Pagination bar */}
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <span>«</span> Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isPageActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    isPageActive
                      ? "bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              Next <span>»</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
