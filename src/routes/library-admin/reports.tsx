import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Calendar,
  X,
  BarChart3,
  Upload,
  ArrowUpDown,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/library-admin/reports")({
  component: LibraryAdminReportsPage,
});

interface ReportItem {
  id: string;
  title: string;
  isbn: string;
  publisher: string;
  category: string;
  borrowCount: number;
  readProgress: number;
  publishedDate: string;
}

const REPORT_DATA: ReportItem[] = [
  {
    id: "r1",
    title: "A Complete History of...",
    isbn: "1176559435",
    publisher: "PixelBooks",
    category: "Academic & Educational",
    borrowCount: 36,
    readProgress: 7.0,
    publishedDate: "2025-06-12",
  },
  {
    id: "r2",
    title: "A Connecticut Yankee i...",
    isbn: "9780451529589",
    publisher: "PixelBooks",
    category: "Regional & Language-B...",
    borrowCount: 4,
    readProgress: 3.67,
    publishedDate: "2024-05-18",
  },
  {
    id: "r3",
    title: "Knowledge for the Time",
    isbn: "9781019041857",
    publisher: "PixelBooks",
    category: "Reference",
    borrowCount: 2,
    readProgress: 1.0,
    publishedDate: "2026-01-10",
  },
  {
    id: "r4",
    title: "Gulliver's Travels Into S...",
    isbn: "9789360212377",
    publisher: "PixelBooks",
    category: "Fiction",
    borrowCount: 5,
    readProgress: 0.2,
    publishedDate: "2023-11-22",
  },
  {
    id: "r5",
    title: "Roughing It",
    isbn: "9780451531100",
    publisher: "PixelBooks",
    category: "Travel & Tourism",
    borrowCount: 1,
    readProgress: 0.0,
    publishedDate: "2025-09-05",
  },
  {
    id: "r6",
    title: "Of the Just Shaping of L...",
    isbn: "9700000037103",
    publisher: "PixelBooks",
    category: "Academic & Educational",
    borrowCount: 5,
    readProgress: 0.0,
    publishedDate: "2025-02-14",
  },
  {
    id: "r7",
    title: "On Growth and Form",
    isbn: "0486671356",
    publisher: "PixelBooks",
    category: "Academic & Educational",
    borrowCount: 8,
    readProgress: 0.0,
    publishedDate: "2024-12-01",
  },
  {
    id: "r8",
    title: "Life on the Mississippi",
    isbn: "9781542846929",
    publisher: "PixelBooks",
    category: "Travel & Tourism",
    borrowCount: 2,
    readProgress: 0.0,
    publishedDate: "2023-08-30",
  },
  {
    id: "r9",
    title: "A Tangled Tale",
    isbn: "1646502779",
    publisher: "PixelBooks",
    category: "Academic & Educational",
    borrowCount: 10,
    readProgress: 0.0,
    publishedDate: "2026-03-01",
  },
  {
    id: "r10",
    title: "An Essay on Profession...",
    isbn: "9781022880023",
    publisher: "PixelBooks",
    category: "Reference",
    borrowCount: 2,
    readProgress: 0.0,
    publishedDate: "2025-05-09",
  },
  {
    id: "r11",
    title: "Introduction to Calculus",
    isbn: "9780131429222",
    publisher: "Pearson",
    category: "Academic & Educational",
    borrowCount: 14,
    readProgress: 18.5,
    publishedDate: "2026-02-28",
  },
  {
    id: "r12",
    title: "The Great Gatsby",
    isbn: "9780743273565",
    publisher: "Scribner",
    category: "Fiction",
    borrowCount: 22,
    readProgress: 45.2,
    publishedDate: "2025-10-15",
  },
  {
    id: "r13",
    title: "World Atlas & Geography",
    isbn: "9781465451187",
    publisher: "Dorling Kindersley",
    category: "Reference",
    borrowCount: 9,
    readProgress: 12.0,
    publishedDate: "2024-07-04",
  },
  {
    id: "r14",
    title: "Chronicles of Travel",
    isbn: "9780062060624",
    publisher: "HarperCollins",
    category: "Travel & Tourism",
    borrowCount: 6,
    readProgress: 9.8,
    publishedDate: "2025-11-01",
  },
];

interface UserEngagementDetail {
  user: string;
  borrowCount: number;
  returnCount: number;
  readProgress: number;
}

const getReportDetails = (item: ReportItem): UserEngagementDetail[] => {
  if (item.id === "r1" || item.title.startsWith("A Complete History")) {
    return [
      { user: "ACHARYA", borrowCount: 1, returnCount: 1, readProgress: 0 },
      { user: "Anaina", borrowCount: 1, returnCount: 1, readProgress: 0 },
      { user: "Asha", borrowCount: 11, returnCount: 11, readProgress: 0 },
      { user: "DIVYA", borrowCount: 2, returnCount: 2, readProgress: 0 },
      { user: "Nimisha", borrowCount: 17, returnCount: 17, readProgress: 0 },
      { user: "Niya", borrowCount: 2, returnCount: 2, readProgress: 56 },
      { user: "PREETH", borrowCount: 1, returnCount: 1, readProgress: 0 },
      { user: "SURYA", borrowCount: 1, returnCount: 1, readProgress: 0 },
    ];
  }

  // Generate deterministic details for other books
  const users = [
    "ACHARYA",
    "Anaina",
    "Asha",
    "DIVYA",
    "Nimisha",
    "Niya",
    "PREETH",
    "SURYA",
    "John Doe",
    "Jane Smith",
  ];
  const detailsCount = Math.min(8, Math.max(2, item.borrowCount));
  const details: UserEngagementDetail[] = [];
  let remaining = item.borrowCount;

  for (let i = 0; i < detailsCount; i++) {
    const isLast = i === detailsCount - 1;
    const share = isLast ? remaining : Math.max(1, Math.floor(remaining / (detailsCount - i)));
    remaining -= share;
    if (share <= 0) continue;

    details.push({
      user: users[i % users.length],
      borrowCount: share,
      returnCount: Math.max(0, share - (i % 2)),
      readProgress: Math.min(100, Math.floor(item.readProgress * (1.2 - i * 0.15))),
    });
  }

  return details;
};

const PRESETS = ["All Time", "MTD", "QTD", "YTD", "Last 30 days", "Custom"] as const;
type Preset = (typeof PRESETS)[number];

export function LibraryAdminReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTitle, setSelectedTitle] = useState<string>("All");
  const [fromDate, setFromDate] = useState("2026-07-01");
  const [toDate, setToDate] = useState("2026-07-11");
  const [preset, setPreset] = useState<Preset>("MTD");
  const [presetOpen, setPresetOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof ReportItem>("borrowCount");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Selected item detail sub-page view
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [detailsSearchQuery, setDetailsSearchQuery] = useState("");
  const [detailsSortField, setDetailsSortField] =
    useState<keyof UserEngagementDetail>("borrowCount");
  const [detailsSortDirection, setDetailsSortDirection] = useState<"asc" | "desc">("desc");
  const [detailsPage, setDetailsPage] = useState(1);
  const detailsPageSize = 10;

  // Dynamic filter sets for dropdowns
  const publishers = useMemo(() => {
    const set = new Set(REPORT_DATA.map((r) => r.publisher));
    return ["All", ...Array.from(set)];
  }, []);

  const categories = useMemo(() => {
    const set = new Set(REPORT_DATA.map((r) => r.category));
    return ["All", ...Array.from(set)];
  }, []);

  const titles = useMemo(() => {
    const set = new Set(REPORT_DATA.map((r) => r.title));
    return ["All", ...Array.from(set)];
  }, []);

  const publisherOptions = useMemo(() => {
    return publishers.map((p) => (p === "All" ? "All Publishers" : p));
  }, [publishers]);

  const categoryOptions = useMemo(() => {
    return categories.map((c) => (c === "All" ? "All Categories" : c));
  }, [categories]);

  const titleOptions = useMemo(() => {
    return titles.map((t) => (t === "All" ? "All Titles" : t));
  }, [titles]);

  // Preset Date range selection logic matching banners.tsx
  const handlePresetSelect = (p: Preset) => {
    setPreset(p);
    setPresetOpen(false);

    if (p === "All Time") {
      setFromDate("");
      setToDate("");
      setPage(1);
      return;
    }

    const today = new Date("2026-07-11");
    let from = new Date("2026-07-11");
    const to = new Date("2026-07-11");

    if (p === "MTD") {
      from = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (p === "QTD") {
      const currentMonth = today.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      from = new Date(today.getFullYear(), quarterStartMonth, 1);
    } else if (p === "YTD") {
      from = new Date(today.getFullYear(), 0, 1);
    } else if (p === "Last 30 days") {
      from.setDate(today.getDate() - 30);
    }

    setFromDate(from.toISOString().split("T")[0]);
    setToDate(to.toISOString().split("T")[0]);
    setPage(1);
  };

  // Clear filters
  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedPublisher("All");
    setSelectedCategory("All");
    setSelectedTitle("All");
    setFromDate("");
    setToDate("");
    setPreset("All Time");
    setPage(1);
    toast.info("All report filters cleared");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedPublisher !== "All" ||
    selectedCategory !== "All" ||
    selectedTitle !== "All" ||
    fromDate !== "" ||
    toDate !== "" ||
    preset !== "All Time";

  // Sorting handler
  const handleSort = (field: keyof ReportItem) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setPage(1);
  };

  // Filter & Sort Logic
  const filteredAndSortedData = useMemo(() => {
    let result = [...REPORT_DATA];

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.isbn.toLowerCase().includes(q) ||
          r.publisher.toLowerCase().includes(q),
      );
    }

    // Dropdown filters
    if (selectedPublisher !== "All") {
      result = result.filter((r) => r.publisher === selectedPublisher);
    }
    if (selectedCategory !== "All") {
      result = result.filter((r) => r.category === selectedCategory);
    }
    if (selectedTitle !== "All") {
      result = result.filter((r) => r.title === selectedTitle);
    }

    // Date range
    if (fromDate) {
      result = result.filter((r) => r.publishedDate >= fromDate);
    }
    if (toDate) {
      result = result.filter((r) => r.publishedDate <= toDate);
    }

    // Sorting
    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });

    return result;
  }, [
    searchQuery,
    selectedPublisher,
    selectedCategory,
    selectedTitle,
    fromDate,
    toDate,
    sortField,
    sortDirection,
  ]);

  // Pagination calculation
  const totalResults = filteredAndSortedData.length;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, page]);

  const handleExport = () => {
    toast.success("Excel report exported successfully!");
  };

  // User Engagement Details data
  const detailsData = useMemo(() => {
    if (!selectedReport) return [];
    return getReportDetails(selectedReport);
  }, [selectedReport]);

  const filteredAndSortedDetails = useMemo(() => {
    let result = [...detailsData];

    // Search query filter
    if (detailsSearchQuery.trim()) {
      const q = detailsSearchQuery.toLowerCase();
      result = result.filter((d) => d.user.toLowerCase().includes(q));
    }

    // Sorting
    result.sort((a, b) => {
      let valA = a[detailsSortField];
      let valB = b[detailsSortField];

      if (typeof valA === "string") {
        valA = (valA as string).toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return detailsSortDirection === "asc" ? -1 : 1;
      if (valA > valB) return detailsSortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [detailsData, detailsSearchQuery, detailsSortField, detailsSortDirection]);

  // Paginated details data
  const totalDetailsResults = filteredAndSortedDetails.length;
  const paginatedDetailsData = useMemo(() => {
    const start = (detailsPage - 1) * detailsPageSize;
    return filteredAndSortedDetails.slice(start, start + detailsPageSize);
  }, [filteredAndSortedDetails, detailsPage]);

  const handleDetailsSort = (field: keyof UserEngagementDetail) => {
    if (detailsSortField === field) {
      setDetailsSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setDetailsSortField(field);
      setDetailsSortDirection("desc");
    }
    setDetailsPage(1);
  };

  const handleDetailsExport = () => {
    toast.success("Excel report for Title Wise Engagement exported successfully!");
  };

  if (selectedReport) {
    return (
      <AppShell title="Title Wise Engagement Report">
        <div className="p-4 md:p-8 space-y-6">
          {/* Back button */}
          <button
            onClick={() => {
              setSelectedReport(null);
              setDetailsSearchQuery("");
              setDetailsPage(1);
            }}
            className="flex items-center gap-2 text-sm font-normal text-slate-700 dark:text-slate-200 hover:text-foreground mb-4 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to User Engagement Summary Report
          </button>

          {/* Top Actions Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Details Search input */}
              <label className="relative flex h-10 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full sm:max-w-xs flex-1 md:flex-none">
                <Search size={16} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  value={detailsSearchQuery}
                  onChange={(e) => {
                    setDetailsSearchQuery(e.target.value);
                    setDetailsPage(1);
                  }}
                  className="w-full bg-transparent pl-2 text-xs outline-none text-foreground"
                />
              </label>

              {/* Export details button */}
              <button
                onClick={handleDetailsExport}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] text-white px-4 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shrink-0"
              >
                <span>Export Data</span>
              </button>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-card border border-border rounded-xl p-5 text-sm select-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-12">
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex items-start">
                  <span className="text-muted-foreground min-w-[80px] font-semibold">Title:</span>
                  <span className="text-foreground font-semibold flex-1 leading-relaxed">
                    {selectedReport.title}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-muted-foreground min-w-[80px] font-semibold">ISBN:</span>
                  <span className="text-foreground font-semibold flex-1 font-mono leading-relaxed">
                    {selectedReport.isbn}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex items-start">
                  <span className="text-muted-foreground min-w-[85px] font-semibold">
                    Publisher:
                  </span>
                  <span className="text-foreground font-semibold flex-1 leading-relaxed">
                    {selectedReport.publisher}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-muted-foreground min-w-[85px] font-semibold">
                    Category:
                  </span>
                  <span className="text-foreground font-semibold flex-1 leading-relaxed">
                    {selectedReport.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
                    <th
                      onClick={() => handleDetailsSort("user")}
                      className="pb-3 pr-4 font-semibold cursor-pointer hover:text-foreground transition-colors"
                    >
                      <span className="flex items-center gap-1">
                        User
                        <ArrowUpDown size={12} className="text-muted-foreground" />
                      </span>
                    </th>
                    <th
                      onClick={() => handleDetailsSort("borrowCount")}
                      className="pb-3 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors text-center"
                    >
                      <span className="flex items-center justify-center gap-1">
                        Borrow Count
                        <ArrowUpDown size={12} className="text-muted-foreground" />
                      </span>
                    </th>
                    <th
                      onClick={() => handleDetailsSort("returnCount")}
                      className="pb-3 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors text-center"
                    >
                      <span className="flex items-center justify-center gap-1">
                        Return Count
                        <ArrowUpDown size={12} className="text-muted-foreground" />
                      </span>
                    </th>
                    <th
                      onClick={() => handleDetailsSort("readProgress")}
                      className="pb-3 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors text-center"
                    >
                      <span className="flex items-center justify-center gap-1">
                        Read Progress(%)
                        <ArrowUpDown size={12} className="text-muted-foreground" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedDetailsData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <BarChart3 size={32} className="text-muted-foreground/60" />
                          <p className="font-semibold text-sm">No report records found</p>
                          <p className="text-xs">Adjust your search query.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedDetailsData.map((d, index) => (
                      <tr
                        key={`${d.user}-${index}`}
                        className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/10"
                      >
                        <td className="py-3.5 pr-4 text-sm font-semibold text-foreground">
                          {d.user}
                        </td>
                        <td className="py-3.5 px-4 text-sm text-center text-foreground font-medium">
                          {d.borrowCount}
                        </td>
                        <td className="py-3.5 px-4 text-sm text-center text-foreground font-medium">
                          {d.returnCount}
                        </td>
                        <td className="py-3.5 px-4 text-sm text-center text-foreground font-medium">
                          {d.readProgress}%
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Pagination Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground select-none pt-2">
            <div>
              Showing {Math.min(totalDetailsResults, (detailsPage - 1) * detailsPageSize + 1)} to{" "}
              {Math.min(totalDetailsResults, detailsPage * detailsPageSize)} of{" "}
              {totalDetailsResults} results
            </div>
            {totalDetailsResults > detailsPageSize && (
              <div className="flex items-center gap-2">
                <button
                  disabled={detailsPage === 1}
                  onClick={() => setDetailsPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-border bg-slate-50 dark:bg-card/50 text-slate-700 dark:text-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-secondary/40 font-semibold cursor-pointer transition-colors"
                >
                  &lt;&lt; Previous
                </button>
                {Array.from({ length: Math.ceil(totalDetailsResults / detailsPageSize) }).map(
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => setDetailsPage(i + 1)}
                      className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold transition-colors cursor-pointer ${
                        detailsPage === i + 1
                          ? "bg-[var(--sidebar-highlight)] text-[var(--brand)] border border-[var(--brand)]/10"
                          : "border border-border hover:bg-secondary/40 text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ),
                )}
                <button
                  disabled={detailsPage === Math.ceil(totalDetailsResults / detailsPageSize)}
                  onClick={() => setDetailsPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-slate-50 dark:bg-card/50 text-slate-700 dark:text-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-secondary/40 font-semibold cursor-pointer transition-colors"
                >
                  Next &gt;&gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="User Engagement Summary Report">
      <div className="p-4 md:p-8 space-y-6">
        {/* Toolbar matching 2-row layout with searchable dropdowns */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          {/* Top Row: Search Bar (Left) + Date Range & Actions (Right) */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Main Search Bar */}
            <div className="relative flex-1 w-full max-w-md">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
              />
            </div>

            {/* Date Filters & Export Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              {/* Preset Dropdown */}
              <div className="relative shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPresetOpen((v) => !v)}
                  className="flex h-11 w-full sm:w-auto items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground cursor-pointer min-w-[100px]"
                >
                  <span>{preset === "All Time" ? "All Time" : preset}</span>
                  <ChevronDown size={15} className="text-muted-foreground shrink-0" />
                </button>
                {presetOpen && (
                  <div className="absolute right-0 z-20 mt-1.5 w-36 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePresetSelect(p)}
                        className={`flex w-full items-center px-3.5 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                          p === preset ? "font-semibold text-foreground" : "text-muted-foreground"
                        }`}
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
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
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
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setPreset("Custom");
                      setPage(1);
                    }}
                    className="bg-transparent text-xs outline-none text-foreground cursor-pointer"
                  />
                </label>
              </div>

              {/* Clear Filters button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex h-11 items-center gap-1.5 rounded-lg border border-dashed border-border bg-card px-3 text-xs font-semibold text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-900/50 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer justify-center shrink-0"
                >
                  <X size={14} className="shrink-0" />
                  <span>Clear</span>
                </button>
              )}

              {/* Compact Export Data Icon-Only Button */}
              <button
                type="button"
                onClick={handleExport}
                title="Export Data"
                className="h-11 w-11 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                <Upload size={16} />
              </button>
            </div>
          </div>

          {/* Bottom Row: Publisher, Category & Title Searchable Dropdown Filters in One Line */}
          <div className="flex items-center gap-2.5 pt-3 border-t border-border/60 overflow-x-auto">
            {/* Publisher Dropdown */}
            <DropdownSelect
              value={selectedPublisher === "All" ? "All Publishers" : selectedPublisher}
              options={publisherOptions}
              onChange={(label) => {
                setSelectedPublisher(label === "All Publishers" ? "All" : label);
                setPage(1);
              }}
              searchable
              searchPlaceholder="Search publisher..."
              className="min-w-[150px] shrink-0"
            />

            {/* Category Dropdown */}
            <DropdownSelect
              value={selectedCategory === "All" ? "All Categories" : selectedCategory}
              options={categoryOptions}
              onChange={(label) => {
                setSelectedCategory(label === "All Categories" ? "All" : label);
                setPage(1);
              }}
              searchable
              searchPlaceholder="Search category..."
              className="min-w-[160px] shrink-0"
            />

            {/* Title Dropdown */}
            <DropdownSelect
              value={selectedTitle === "All" ? "All Titles" : selectedTitle}
              options={titleOptions}
              onChange={(label) => {
                setSelectedTitle(label === "All Titles" ? "All" : label);
                setPage(1);
              }}
              searchable
              searchPlaceholder="Search title..."
              className="min-w-[160px] shrink-0"
            />
          </div>
        </div>

        {/* Table Data container */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
                  <th
                    onClick={() => handleSort("title")}
                    className="pb-3 pr-4 font-semibold cursor-pointer hover:text-foreground transition-colors w-72"
                  >
                    <span className="flex items-center gap-1">
                      Title
                      <ArrowUpDown size={12} className="text-muted-foreground" />
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("isbn")}
                    className="pb-3 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      ISBN
                      <ArrowUpDown size={12} className="text-muted-foreground" />
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("publisher")}
                    className="pb-3 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      Publisher
                      <ArrowUpDown size={12} className="text-muted-foreground" />
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("category")}
                    className="pb-3 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      Category
                      <ArrowUpDown size={12} className="text-muted-foreground" />
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("borrowCount")}
                    className="pb-3 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors text-center"
                  >
                    <span className="flex items-center justify-center gap-1">
                      Borrow Count
                      <ArrowUpDown size={12} className="text-muted-foreground" />
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("readProgress")}
                    className="pb-3 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors text-center"
                  >
                    <span className="flex items-center justify-center gap-1">
                      Read Progress (%)
                      <ArrowUpDown size={12} className="text-muted-foreground" />
                    </span>
                  </th>
                  <th className="pb-3 pl-4 pr-2 font-semibold text-right w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <BarChart3 size={32} className="text-muted-foreground/60" />
                        <p className="font-semibold text-sm">No report records found</p>
                        <p className="text-xs">Adjust your active filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedReport(row)}
                      className="group border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/30 cursor-pointer"
                    >
                      {/* Title */}
                      <td
                        className="py-3.5 pr-4 font-semibold text-foreground text-sm truncate max-w-[200px]"
                        title={row.title}
                      >
                        {row.title}
                      </td>

                      {/* ISBN */}
                      <td className="py-3.5 px-4 text-sm text-muted-foreground font-mono">
                        {row.isbn}
                      </td>

                      {/* Publisher */}
                      <td className="py-3.5 px-4 text-sm text-foreground">{row.publisher}</td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-sm text-foreground">{row.category}</td>

                      {/* Borrow Count */}
                      <td className="py-3.5 px-4 text-sm text-center text-foreground font-medium">
                        {row.borrowCount}
                      </td>

                      {/* Read Progress */}
                      <td className="py-3.5 px-4 text-sm text-center text-foreground font-medium">
                        {row.readProgress}%
                      </td>

                      {/* Row Chevron (Details open on row click) */}
                      <td className="py-3.5 pl-4 pr-2 text-right">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                          <ChevronRight size={16} />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Pagination controls */}
        <div className="flex items-center justify-between text-xs text-muted-foreground select-none pt-2">
          <div>
            Showing {Math.min(totalResults, (page - 1) * pageSize + 1)} to{" "}
            {Math.min(totalResults, page * pageSize)} of {totalResults} results
          </div>
          {totalResults > pageSize && (
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-border bg-slate-50 dark:bg-card/50 text-slate-700 dark:text-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-secondary/40 font-semibold cursor-pointer transition-colors"
              >
                &lt;&lt; Previous
              </button>
              {Array.from({ length: Math.ceil(totalResults / pageSize) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold transition-colors cursor-pointer ${
                    page === i + 1
                      ? "bg-[var(--sidebar-highlight)] text-[var(--brand)] border border-[var(--brand)]/10"
                      : "border border-border hover:bg-secondary/40 text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === Math.ceil(totalResults / pageSize)}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-border bg-slate-50 dark:bg-card/50 text-slate-700 dark:text-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-secondary/40 font-semibold cursor-pointer transition-colors"
              >
                Next &gt;&gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
