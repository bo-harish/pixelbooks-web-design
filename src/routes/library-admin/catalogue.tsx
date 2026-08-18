import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Star,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { BookCover } from "@/components/ui/book-cover";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/library-admin/catalogue")({
  component: LibraryCataloguePage,
});

interface Purchase {
  copies: number;
  purchaseDate: string;
}

interface LibraryBook {
  id: string;
  title: string;
  publisher: string;
  copies: number;
  purchaseDate: string;
  status: "Active" | "Inactive";
  initials: string;
  cover: string;
  author: string;
  category: string;
  isbn: string;
  rating: number;
  description: string;
  purchases?: Purchase[];
}

// Initial 18 mock books following the classical titles shown in the screenshot
const initialBooks: LibraryBook[] = [
  {
    id: "lib-1",
    title: "The Innocents Abroad",
    publisher: "PixelBooks",
    copies: 1,
    purchaseDate: "23 Mar 2026",
    status: "Active",
    initials: "TIA",
    cover: "linear-gradient(135deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
    author: "Mark Twain",
    category: "Travel & History",
    isbn: "9780199540013",
    rating: 4.5,
    description:
      "Mark Twain's classic travelogue detailing his journey through Europe and the Holy Land aboard the steamship Quaker City.",
  },
  {
    id: "lib-2",
    title: "Life on the Mississippi",
    publisher: "PixelBooks",
    copies: 500,
    purchaseDate: "08 Jan 2026",
    status: "Active",
    initials: "LOM",
    cover: "linear-gradient(135deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
    author: "Mark Twain",
    category: "Memoir",
    isbn: "9780199537549",
    rating: 4.8,
    description:
      "A memoir by Mark Twain of his days as a steamboat pilot on the Mississippi River before the American Civil War.",
  },
  {
    id: "lib-3",
    title: "On Growth and Form",
    publisher: "PixelBooks",
    copies: 1,
    purchaseDate: "03 Dec 2025",
    status: "Active",
    initials: "OGF",
    cover: "linear-gradient(135deg, oklch(0.5 0.1 60), oklch(0.32 0.06 60))",
    author: "D'Arcy Wentworth Thompson",
    category: "Science & Biology",
    isbn: "9780521437769",
    rating: 4.7,
    description:
      "A mathematical beauty of biology, analyzing the way things grow and the shapes they take.",
  },
  {
    id: "lib-4",
    title: "Of the Just Shaping of Letters",
    publisher: "PixelBooks",
    copies: 3,
    purchaseDate: "03 Dec 2025",
    status: "Active",
    initials: "OJS",
    cover: "linear-gradient(135deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
    author: "Albrecht Dürer",
    category: "Art & Typography",
    isbn: "9780486213064",
    rating: 4.2,
    description:
      "A historic treatise on the geometric construction of Roman capitals and alphabets.",
    purchases: [
      { copies: 2, purchaseDate: "03 Dec 2025" },
      { copies: 1, purchaseDate: "10 Nov 2025" },
    ],
  },
  {
    id: "lib-5",
    title: "Knowledge for the Time",
    publisher: "PixelBooks",
    copies: 5,
    purchaseDate: "08 Dec 2025",
    status: "Active",
    initials: "KFT",
    cover: "linear-gradient(135deg, oklch(0.5 0.12 200), oklch(0.32 0.07 200))",
    author: "John Timbs",
    category: "Reference",
    isbn: "9781019041857",
    rating: 4.0,
    description:
      "A manual of information on historical, scientific, and literary developments of the 19th century.",
    purchases: [
      { copies: 3, purchaseDate: "08 Dec 2025" },
      { copies: 2, purchaseDate: "20 Oct 2025" },
    ],
  },
  {
    id: "lib-6",
    title: "Gulliver's Travels Into Several Remote Regions of the World",
    publisher: "PixelBooks",
    copies: 3,
    purchaseDate: "03 Dec 2025",
    status: "Active",
    initials: "GTR",
    cover: "linear-gradient(135deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
    author: "Jonathan Swift",
    category: "Satire & Fiction",
    isbn: "9780199535736",
    rating: 4.6,
    description:
      "A classic satirical novel in four parts, recounting Lemuel Gulliver's voyages to fantastical civilizations.",
  },
  {
    id: "lib-7",
    title: "Common Sense",
    publisher: "PixelBooks",
    copies: 10,
    purchaseDate: "14 Nov 2025",
    status: "Active",
    initials: "CMS",
    cover: "linear-gradient(135deg, oklch(0.55 0.14 240), oklch(0.32 0.09 240))",
    author: "Thomas Paine",
    category: "Political Science",
    isbn: "9780486296029",
    rating: 4.5,
    description:
      "A highly influential pamphlet advocating independence from Great Britain to the people in the Thirteen Colonies.",
  },
  {
    id: "lib-8",
    title: "A Tangled Tale",
    publisher: "PixelBooks",
    copies: 2,
    purchaseDate: "12 Oct 2025",
    status: "Inactive",
    initials: "ATT",
    cover: "linear-gradient(135deg, oklch(0.5 0.13 10), oklch(0.32 0.08 10))",
    author: "Lewis Carroll",
    category: "Mathematics & Humor",
    isbn: "1646502779",
    rating: 4.3,
    description:
      "A series of humorous stories incorporating mathematical puzzles and knots to solve.",
  },
  {
    id: "lib-9",
    title: "The Elements of Style",
    publisher: "PixelBooks",
    copies: 25,
    purchaseDate: "01 Oct 2025",
    status: "Active",
    initials: "STY",
    cover: "linear-gradient(135deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
    author: "William Strunk Jr.",
    category: "Writing Guide",
    isbn: "9780205309023",
    rating: 4.9,
    description:
      "The definitive manual of writing style in American English, including rules of composition and usage.",
  },
  {
    id: "lib-10",
    title: "Meditations",
    publisher: "PixelBooks",
    copies: 50,
    purchaseDate: "15 Sep 2025",
    status: "Active",
    initials: "MED",
    cover: "linear-gradient(135deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
    author: "Marcus Aurelius",
    category: "Philosophy",
    isbn: "9780140449334",
    rating: 4.9,
    description:
      "A series of personal writings by the Roman Emperor Marcus Aurelius, recording his private notes to himself and ideas on Stoic philosophy.",
    purchases: [
      { copies: 30, purchaseDate: "15 Sep 2025" },
      { copies: 20, purchaseDate: "01 Aug 2025" },
    ],
  },
  {
    id: "lib-11",
    title: "The Republic",
    publisher: "PixelBooks",
    copies: 15,
    purchaseDate: "10 Aug 2025",
    status: "Inactive",
    initials: "REP",
    cover: "linear-gradient(135deg, oklch(0.5 0.1 60), oklch(0.32 0.06 60))",
    author: "Plato",
    category: "Philosophy",
    isbn: "9780872201361",
    rating: 4.8,
    description:
      "A Socratic dialogue concerning justice, the order and character of the just city-state, and the just man.",
  },
  {
    id: "lib-12",
    title: "A Brief History of Time",
    publisher: "PixelBooks",
    copies: 30,
    purchaseDate: "04 Aug 2025",
    status: "Active",
    initials: "BHT",
    cover: "linear-gradient(135deg, oklch(0.5 0.12 200), oklch(0.32 0.07 200))",
    author: "Stephen Hawking",
    category: "Cosmology",
    isbn: "9780553380163",
    rating: 4.7,
    description:
      "A landmark popular-science book on cosmology, explaining complex astrophysics theories to general readers.",
    purchases: [
      { copies: 15, purchaseDate: "04 Aug 2025" },
      { copies: 10, purchaseDate: "15 Jul 2025" },
      { copies: 5, purchaseDate: "01 Jun 2025" },
    ],
  },
  {
    id: "lib-13",
    title: "The Art of War",
    publisher: "PixelBooks",
    copies: 8,
    purchaseDate: "22 Jul 2025",
    status: "Active",
    initials: "WAR",
    cover: "linear-gradient(135deg, oklch(0.5 0.13 10), oklch(0.32 0.08 10))",
    author: "Sun Tzu",
    category: "Military Strategy",
    isbn: "9781590302255",
    rating: 4.6,
    description:
      "An ancient Chinese military treatise attributed to Sun Tzu, detailing strategies for warfare and conflict management.",
  },
  {
    id: "lib-14",
    title: "Pride and Prejudice",
    publisher: "PixelBooks",
    copies: 4,
    purchaseDate: "11 Jun 2025",
    status: "Inactive",
    initials: "PAP",
    cover: "linear-gradient(135deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
    author: "Jane Austen",
    category: "Romance & Fiction",
    isbn: "9780141439518",
    rating: 4.8,
    description:
      "A romantic novel of manners following the character development of Elizabeth Bennet.",
  },
  {
    id: "lib-15",
    title: "Frankenstein",
    publisher: "PixelBooks",
    copies: 12,
    purchaseDate: "30 May 2025",
    status: "Active",
    initials: "FRK",
    cover: "linear-gradient(135deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
    author: "Mary Shelley",
    category: "Gothic Horror",
    isbn: "9780486282114",
    rating: 4.5,
    description:
      "The story of Victor Frankenstein, a young scientist who creates a sapient creature in an unorthodox scientific experiment.",
  },
  {
    id: "lib-16",
    title: "Walden",
    publisher: "PixelBooks",
    copies: 6,
    purchaseDate: "18 May 2025",
    status: "Inactive",
    initials: "WAL",
    cover: "linear-gradient(135deg, oklch(0.5 0.1 60), oklch(0.32 0.06 60))",
    author: "Henry David Thoreau",
    category: "Philosophy & Nature",
    isbn: "9780486284958",
    rating: 4.4,
    description:
      "A reflection upon simple living in natural surroundings, detailing Thoreau's experiences over two years in a cabin near Walden Pond.",
  },
  {
    id: "lib-17",
    title: "The Wealth of Nations",
    publisher: "PixelBooks",
    copies: 20,
    purchaseDate: "02 May 2025",
    status: "Active",
    initials: "WON",
    cover: "linear-gradient(135deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
    author: "Adam Smith",
    category: "Economics",
    isbn: "9780199535927",
    rating: 4.6,
    description:
      "The magnum opus of the Scottish economist, discussing the economic and social mechanisms of the Industrial Revolution.",
  },
  {
    id: "lib-18",
    title: "Great Expectations",
    publisher: "PixelBooks",
    copies: 15,
    purchaseDate: "14 Apr 2025",
    status: "Inactive",
    initials: "GEX",
    cover: "linear-gradient(135deg, oklch(0.5 0.13 10), oklch(0.32 0.08 10))",
    author: "Charles Dickens",
    category: "Victorian Fiction",
    isbn: "9780141439563",
    rating: 4.5,
    description:
      "The education of an orphan nicknamed Pip, tracking his growth and personal development in Victorian England.",
  },
];

function LibraryCataloguePage() {
  const PRESETS = ["MTD", "QTD", "YTD", "Last 30 days", "Custom"] as const;
  type Preset = (typeof PRESETS)[number];

  const [books, setBooks] = useState<LibraryBook[]>(initialBooks);
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Inactive">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  const [readerBook, setReaderBook] = useState<LibraryBook | null>(null);

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
        <div className="flex flex-col xl:flex-row xl:items-center gap-2.5 rounded-xl border border-border bg-card p-4 overflow-x-auto">
          {/* Main Search Bar */}
          <div className="relative flex-1 min-w-[200px] w-full max-w-md">
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
              const next = tab === "All Statuses" ? "All" : tab === "Active Status" ? "Active" : "Inactive";
              setActiveTab(next as "All" | "Active" | "Inactive");
              setPage(1);
            }}
            searchable
            searchPlaceholder="Search status..."
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
                  <th className="py-4 pl-4 pr-6 font-semibold" />
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
                              <BookCover
                                initials={book.initials}
                                coverGradient={book.cover}
                                title={book.title}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <span className="font-semibold text-foreground block truncate max-w-sm md:max-w-md lg:max-w-lg">
                                  {book.title}
                                </span>
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

                          {/* Action Button & Chevron */}
                          <td className="py-4 pl-4 pr-6 text-right">
                            <div className="inline-flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReaderBook(book);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-opacity hover:opacity-90 shadow-sm"
                                style={{
                                  backgroundColor: "var(--brand)",
                                  color: "var(--brand-contrast)",
                                }}
                              >
                                <BookOpen size={13} />
                                <span>Read eBook</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpand(book.id);
                                }}
                                className="p-1 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
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

      {/* eBook Reader Overlay Modal */}
      {readerBook && (
        <Dialog open={!!readerBook} onOpenChange={() => setReaderBook(null)}>
          <DialogContent
            className="p-0 overflow-hidden flex flex-col bg-card border border-border"
            style={{
              width: "min(92vw, 60.71vh)",
              height: "calc(min(92vw, 60.71vh) * 1.4)",
            }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <BookCover
                  initials={readerBook.initials}
                  coverGradient={readerBook.cover}
                  title={readerBook.title}
                  size="xs"
                />
                <div>
                  <DialogTitle className="text-base font-semibold leading-none">
                    {readerBook.title}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    by {readerBook.author} • {readerBook.publisher}
                  </p>
                </div>
              </div>
            </div>

            {/* Reader Mock Area */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-serif font-bold text-center border-b pb-4 border-border/60">
                Chapter 1: The Adventure Begins
              </h2>

              <div className="font-serif leading-relaxed text-foreground space-y-4 text-justify">
                <p>
                  To the general reader, the history of this voyage needs no introduction. It is the
                  record of a pleasure excursion which was successful and satisfactory to the
                  highest degree. It was a new project in its conception, and its execution was a
                  triumph of management.
                </p>
                <p>
                  For months we had been planning our itinerary, checking maps, and debating routes.
                  The steamer lay at anchor in the harbor, her sails folded, her boilers humming
                  with latent energy. On deck, passengers conversed in eager groups, pointing toward
                  the open sea that lay beyond the harbor walls.
                </p>
                <p>
                  The air was crisp and filled with the scent of salt spray. The sun rose in
                  majestic splendor, painting the horizon in shades of orange and gold. We felt the
                  subtle vibrations of the engines underfoot, a signal that our journey into the
                  unknown was finally about to commence.
                </p>
                <p>
                  Every cabin was filled with the promise of exploration. Books were opened,
                  journals initialized, and cameras inspected. We were, indeed, pilgrims on our way
                  to see the ancient world, and our hearts beat with anticipation.
                </p>
              </div>

              <div className="pt-8 flex justify-center">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Finished reading page 1 of 324</span>
                </div>
              </div>
            </div>

            {/* Reader Footer Controls */}
            <div className="px-6 py-4 border-t border-border bg-secondary/20 flex items-center justify-between text-xs text-muted-foreground">
              <span>ISBN: {readerBook.isbn}</span>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded hover:bg-secondary transition-all">
                  « Previous Page
                </button>
                <span className="font-medium text-foreground">Page 1 / 324</span>
                <button className="p-1 rounded hover:bg-secondary transition-all">
                  Next Page »
                </button>
              </div>
              <div className="flex items-center gap-1">
                <span>★ {readerBook.rating.toFixed(1)}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AppShell>
  );
}
