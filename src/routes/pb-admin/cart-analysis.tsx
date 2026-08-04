import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ShoppingCart,
  BookOpen,
  Upload,
  ScrollText,
  Table,
  Calendar,
  TrendingUp,
  Building2,
  Feather,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Percent,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BookCover } from "@/components/ui/book-cover";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/cart-analysis")({
  head: () => ({
    meta: [
      { title: "Book Cart Analysis — PixelBooks Admin" },
      {
        name: "description",
        content: "Analyze book additions to cart, purchase conversion rates, and abandoned cart items across catalog titles.",
      },
    ],
  }),
  component: CartAnalysisPage,
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CartAnalysisItem {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  coverGradient: string;
  initials: string;
  timesAddedToCart: number;
  totalPurchases: number;
  notPurchased: number;
  lastAddedDate: string;
  lastPurchasedDate: string;
}

// ── Sample Data ───────────────────────────────────────────────────────────────

const cartAnalysisData: CartAnalysisItem[] = [
  {
    id: "ca-1",
    title: "A Beautiful Crime: A Novel",
    author: "John M Upton",
    publisher: "Harper Perennial",
    category: "Crime, Thriller, Mystery",
    coverGradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    initials: "AB",
    timesAddedToCart: 48,
    totalPurchases: 35,
    notPurchased: 13,
    lastAddedDate: "23 Jul 2026",
    lastPurchasedDate: "22 Jul 2026",
  },
  {
    id: "ca-2",
    title: "The Lean Startup",
    author: "Elsaundra Joseph",
    publisher: "Aisha Publishers",
    category: "Business",
    coverGradient: "linear-gradient(135deg, #be123c, #f43f5e)",
    initials: "LS",
    timesAddedToCart: 42,
    totalPurchases: 30,
    notPurchased: 12,
    lastAddedDate: "23 Jul 2026",
    lastPurchasedDate: "21 Jul 2026",
  },
  {
    id: "ca-3",
    title: "A Marginal Jew",
    author: "Anonymous",
    publisher: "Anonymous User",
    category: "Biography",
    coverGradient: "linear-gradient(135deg, #134e4a, #14b8a6)",
    initials: "MJ",
    timesAddedToCart: 36,
    totalPurchases: 22,
    notPurchased: 14,
    lastAddedDate: "22 Jul 2026",
    lastPurchasedDate: "20 Jul 2026",
  },
  {
    id: "ca-4",
    title: "History of the English People, Volume VII",
    author: "Arthur Conan Doyle",
    publisher: "HarperCollins India",
    category: "History",
    coverGradient: "linear-gradient(135deg, #9333ea, #6b21a8)",
    initials: "HE",
    timesAddedToCart: 31,
    totalPurchases: 25,
    notPurchased: 6,
    lastAddedDate: "21 Jul 2026",
    lastPurchasedDate: "21 Jul 2026",
  },
  {
    id: "ca-5",
    title: "A Comet Appears",
    author: "National Learning Corp",
    publisher: "Cambridge University Press",
    category: "JEE",
    coverGradient: "linear-gradient(135deg, #9d174d, #ec4899)",
    initials: "CA",
    timesAddedToCart: 28,
    totalPurchases: 19,
    notPurchased: 9,
    lastAddedDate: "21 Jul 2026",
    lastPurchasedDate: "19 Jul 2026",
  },
  {
    id: "ca-6",
    title: "A Concise History of Computers",
    author: "Dr. Evelyn Reed",
    publisher: "Orange Publishers",
    category: "Computer Application",
    coverGradient: "linear-gradient(135deg, #1e3a8a, #6366f1)",
    initials: "CH",
    timesAddedToCart: 25,
    totalPurchases: 18,
    notPurchased: 7,
    lastAddedDate: "20 Jul 2026",
    lastPurchasedDate: "18 Jul 2026",
  },
  {
    id: "ca-7",
    title: "A Gift of Ghosts (Tassamara Book 1)",
    author: "Sarah Jenkins",
    publisher: "Fingerprint Publishing",
    category: "Fictions",
    coverGradient: "linear-gradient(135deg, #7f1d1d, #ef4444)",
    initials: "GG",
    timesAddedToCart: 22,
    totalPurchases: 14,
    notPurchased: 8,
    lastAddedDate: "19 Jul 2026",
    lastPurchasedDate: "17 Jul 2026",
  },
  {
    id: "ca-8",
    title: "A little princess, being the whole story of Sara Crewe",
    author: "Glenn H. Curtiss",
    publisher: "Kinder Publications",
    category: "Oscar Wilde",
    coverGradient: "linear-gradient(135deg, #713f12, #ca8a04)",
    initials: "LP",
    timesAddedToCart: 20,
    totalPurchases: 16,
    notPurchased: 4,
    lastAddedDate: "19 Jul 2026",
    lastPurchasedDate: "18 Jul 2026",
  },
  {
    id: "ca-9",
    title: "A Man for Every Purpose",
    author: "Dr. Ashok Alex",
    publisher: "Cambridge University Press",
    category: "NEET",
    coverGradient: "linear-gradient(135deg, #0c4a6e, #0ea5e9)",
    initials: "ME",
    timesAddedToCart: 18,
    totalPurchases: 11,
    notPurchased: 7,
    lastAddedDate: "18 Jul 2026",
    lastPurchasedDate: "15 Jul 2026",
  },
  {
    id: "ca-10",
    title: "The Glass Palace Chronicle",
    author: "Werley Nortreus",
    publisher: "Werley Nortreus",
    category: "General & Literary Fiction",
    coverGradient: "linear-gradient(135deg, #d97706, #b45309)",
    initials: "GP",
    timesAddedToCart: 16,
    totalPurchases: 12,
    notPurchased: 4,
    lastAddedDate: "17 Jul 2026",
    lastPurchasedDate: "16 Jul 2026",
  },
  {
    id: "ca-11",
    title: "Als Manuskript Gedruckt",
    author: "W. J. Baltzell",
    publisher: "Oxford University Press",
    category: "General & Literary Fiction",
    coverGradient: "linear-gradient(135deg, #ca8a04, #854d0e)",
    initials: "AM",
    timesAddedToCart: 14,
    totalPurchases: 9,
    notPurchased: 5,
    lastAddedDate: "17 Jul 2026",
    lastPurchasedDate: "14 Jul 2026",
  },
  {
    id: "ca-12",
    title: "DiggyPOD Inc 5 x 7 Book Template",
    author: "Multiple Authors",
    publisher: "APK Publishers",
    category: "General & Literary Fiction",
    coverGradient: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    initials: "DP",
    timesAddedToCart: 11,
    totalPurchases: 6,
    notPurchased: 5,
    lastAddedDate: "16 Jul 2026",
    lastPurchasedDate: "12 Jul 2026",
  },
];

// ── Constants & Helpers ───────────────────────────────────────────────────────

const presetOptions = ["MTD", "QTD", "YTD", "Current FY", "Last FY", "Last 30 days", "Custom"] as const;
const PAGE_SIZE = 10;

function applyPresetDates(opt: string, setStart: (v: string) => void, setEnd: (v: string) => void) {
  if (opt === "MTD") { setStart("2026-07-01"); setEnd("2026-07-23"); }
  else if (opt === "QTD") { setStart("2026-07-01"); setEnd("2026-07-23"); }
  else if (opt === "YTD") { setStart("2026-01-01"); setEnd("2026-07-23"); }
  else if (opt === "Current FY") { setStart("2026-04-01"); setEnd("2027-03-31"); }
  else if (opt === "Last FY") { setStart("2025-04-01"); setEnd("2026-03-31"); }
  else if (opt === "Last 30 days") { setStart("2026-06-23"); setEnd("2026-07-23"); }
}

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  accent,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  sublabel?: string;
  accent?: string;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-4 sm:p-5 transition-shadow hover:shadow-md justify-between min-h-[110px] sm:min-h-[120px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{
            backgroundColor: accent ? `color-mix(in oklab, ${accent} 12%, transparent)` : "var(--sidebar-highlight)",
            color: accent ?? "var(--brand)",
          }}
        >
          <Icon size={18} />
        </span>
      </div>
      <div>
        <p className="text-2xl font-extrabold tracking-tight text-foreground">{value}</p>
        {sublabel && <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
}

function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPage(Math.max(1, page - 1))}
        className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer text-muted-foreground"
      >
        «&nbsp;Previous
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPage(p)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors cursor-pointer"
          style={p === page ? { backgroundColor: "color-mix(in oklab, var(--brand) 12%, transparent)", color: "var(--brand)" } : undefined}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={page === total}
        onClick={() => onPage(Math.min(total, page + 1))}
        className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer text-muted-foreground"
      >
        Next&nbsp;»
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

function CartAnalysisPage() {
  const [search, setSearch] = useState("");
  const [preset, setPreset] = useState("MTD");
  const [presetOpen, setPresetOpen] = useState(false);
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-23");
  const [exportOpen, setExportOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return cartAnalysisData.filter((item) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.publisher.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [search]);

  // Aggregate stats
  const totalTimesAdded = useMemo(() => filtered.reduce((acc, i) => acc + i.timesAddedToCart, 0), [filtered]);
  const totalPurchases = useMemo(() => filtered.reduce((acc, i) => acc + i.totalPurchases, 0), [filtered]);
  const totalNotPurchased = useMemo(() => filtered.reduce((acc, i) => acc + i.notPurchased, 0), [filtered]);
  const conversionRate = useMemo(() => (totalTimesAdded > 0 ? ((totalPurchases / totalTimesAdded) * 100).toFixed(1) : "0.0"), [totalTimesAdded, totalPurchases]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage = Math.min(page, totalPages);
  const pageStart = (curPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <AppShell
      title="Book Cart Analysis"
      subtitle="Analyze book additions to cart, purchase conversion rates, and abandoned cart items across catalog titles."
      pageIcon={
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 shadow-2xs">
          <ShoppingBag size={20} />
        </div>
      }
    >
      <div className="space-y-6 p-4 sm:p-6 md:p-8 w-full">

        {/* Filter header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
            >
              <Calendar size={17} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">Analysis Filters & Date Range</h3>
              <p className="text-xs text-muted-foreground">Select date range to update cart metrics</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Preset Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPresetOpen((v) => !v)}
                className="flex h-11 min-w-[130px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer shadow-2xs"
              >
                <span>{preset}</span>
                <ChevronDown size={15} className="text-muted-foreground shrink-0" />
              </button>
              {presetOpen && (
                <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1">
                  {presetOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setPreset(opt);
                        setPresetOpen(false);
                        setPage(1);
                        applyPresetDates(opt, setStartDate, setEndDate);
                      }}
                      className={`flex w-full items-center px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer ${opt === preset ? "font-bold text-brand bg-secondary/60" : "text-foreground"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date inputs */}
            <div className="flex items-center gap-2">
              <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3 shadow-2xs">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPreset("Custom");
                  }}
                  className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                />
              </label>
              <span className="text-xs font-medium text-muted-foreground">to</span>
              <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3 shadow-2xs">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPreset("Custom");
                  }}
                  className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={ShoppingCart}
            label="Total Times Added"
            value={totalTimesAdded.toLocaleString("en-IN")}
            sublabel="Cart additions count"
            accent="#3b82f6"
          />
          <StatCard
            icon={CheckCircle2}
            label="Total Purchases"
            value={totalPurchases.toLocaleString("en-IN")}
            sublabel="Completed purchases"
            accent="#10b981"
          />
          <StatCard
            icon={XCircle}
            label="Not Purchased"
            value={totalNotPurchased.toLocaleString("en-IN")}
            sublabel="Abandoned in cart"
            accent="#f59e0b"
          />
          <StatCard
            icon={Percent}
            label="Conversion Rate"
            value={`${conversionRate}%`}
            sublabel="Purchase conversion"
            accent="#6366f1"
          />
        </div>

        {/* Search & Export Toolbar */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3.5 shadow-none transition-colors focus-within:border-[var(--brand)] max-w-md">
            <Search size={16} className="mr-2 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, author, publisher..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
            />
          </label>

          {/* Export Dropdown */}
          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setExportOpen((v) => !v)}
              className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-2xs transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
            >
              <Upload size={15} />
              <span>Export</span>
              <ChevronDown size={14} />
            </button>
            {exportOpen && (
              <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1">
                <button
                  type="button"
                  onClick={() => {
                    setExportOpen(false);
                    toast.success("Downloading Cart Analysis (PDF)...");
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary cursor-pointer"
                >
                  <ScrollText size={15} className="text-muted-foreground" />
                  <span>Export PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExportOpen(false);
                    toast.success("Downloading Cart Analysis (Excel)...");
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary cursor-pointer"
                >
                  <Table size={15} className="text-muted-foreground" />
                  <span>Export Excel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20">
                  <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                  <th className="py-4 pr-4 font-semibold text-center whitespace-nowrap">Times Added </th>
                  <th className="py-4 pr-4 font-semibold text-center whitespace-nowrap">Purchases</th>
                  <th className="py-4 pr-4 font-semibold text-center whitespace-nowrap">Not Purchased</th>
                  <th className="py-4 pr-4 font-semibold text-center whitespace-nowrap">Conversion Rate</th>
                  <th className="py-4 pr-4 font-semibold whitespace-nowrap">Last Added</th>
                  <th className="py-4 pr-6 font-semibold whitespace-nowrap">Last Purchased</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                      No titles found matching your search or filters.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((item) => (
                    <tr
                      key={item.id}
                      className="group border-b border-border/60 transition-colors hover:bg-secondary/50"
                    >
                      {/* Structured Title Cell Layout */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4 max-w-[480px]">
                          {/* Book cover thumbnail */}
                          <BookCover
                            initials={item.initials}
                            coverGradient={item.coverGradient}
                            title={item.title}
                            size="sm"
                          />

                          {/* Title & Entity Chips */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="font-semibold text-sm leading-snug text-foreground transition-colors group-hover:text-[var(--brand)] line-clamp-2">
                              {item.title}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                              {/* Author Chip */}
                              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2 py-0.5 shadow-2xs">
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                  <Feather size={9} />
                                </span>
                                <span className="text-[11px] font-medium text-foreground">{item.author}</span>
                              </div>

                              {/* Publisher Chip */}
                              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2 py-0.5 shadow-2xs">
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                  <Building2 size={9} />
                                </span>
                                <span className="text-[11px] font-medium text-foreground">{item.publisher}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Times Added to Cart */}
                      <td className="px-4 py-4 text-center font-semibold text-foreground whitespace-nowrap">
                        {item.timesAddedToCart}
                      </td>

                      {/* Total Purchases */}
                      <td className="px-4 py-4 text-center font-semibold text-foreground whitespace-nowrap">
                        {item.totalPurchases}
                      </td>

                      {/* Not Purchased */}
                      <td className="px-4 py-4 text-center font-semibold text-foreground whitespace-nowrap">
                        {item.notPurchased}
                      </td>

                      {/* Conversion Rate */}
                      <td className="px-4 py-4 text-center font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                        {item.timesAddedToCart > 0
                          ? `${((item.totalPurchases / item.timesAddedToCart) * 100).toFixed(1)}%`
                          : "0.0%"}
                      </td>

                      {/* Last Added */}
                      <td className="px-4 py-4 text-xs font-normal text-muted-foreground whitespace-nowrap">
                        {item.lastAddedDate}
                      </td>

                      {/* Last Purchased */}
                      <td className="px-6 py-4 text-xs font-normal text-muted-foreground whitespace-nowrap">
                        {item.lastPurchasedDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer & Pagination */}
          <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {filtered.length === 0
                ? "0 results"
                : `Showing ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, filtered.length)} from ${filtered.length} results`}
            </p>
            <Pagination page={curPage} total={totalPages} onPage={setPage} />
          </div>

          {/* Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-secondary/20 px-6 py-4 text-sm font-bold text-foreground">
            <span>Totals Summary</span>
            <div className="flex items-center gap-6 font-semibold">
              <span>Added: {totalTimesAdded}</span>
              <span>Purchased: {totalPurchases}</span>
              <span>Not Purchased: {totalNotPurchased}</span>
              <span>Conversion: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{conversionRate}%</span></span>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
