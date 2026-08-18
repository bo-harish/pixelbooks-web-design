import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { usePublisherType } from "@/hooks/use-publisher-type";
import {
  Tag,
  BookMarked,
  ChevronDown,
  Upload,
  ChevronLeft,
  ChevronRight,
  Search,
  ScrollText,
  Table,
  X,
  Calendar,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/publisher/sales-report")({
  head: () => ({
    meta: [
      { title: "Sales Report — PixelBooks" },
      { name: "description", content: "Track book sales, rentals, discounts and net revenue." },
      { property: "og:title", content: "Sales Report — PixelBooks" },
      {
        property: "og:description",
        content: "Track book sales, rentals, discounts and net revenue.",
      },
    ],
  }),
  component: SalesReportPage,
});

type SalesRow = {
  id: string;
  title: string;
  subtitle?: string;
  saleDate: string;
  isbn: string;
  type: "Sale" | "Rental";
  rentalPeriod: string;
  unitPrice: number;
  qty: number;
  publisherDiscount: number;
  platformDiscount: number;
  tax: number;
  netSales: number;
};

const PRESETS = [
  "MTD",
  "QTD",
  "YTD",
  "Current FY",
  "Last FY",
  "Last 30 days",
  "Custom",
] as const;
type Preset = (typeof PRESETS)[number];

const VIEW_MODES = ["Detailed", "Consolidated"] as const;
type ViewMode = (typeof VIEW_MODES)[number];

const SALE_TYPES = ["Sale & Rental", "Sale only", "Rental only"] as const;
type SaleType = (typeof SALE_TYPES)[number];

const seed: SalesRow[] = [
  {
    id: "s1",
    title: "NEP 2020 - Policy Formulation In...",
    subtitle: "Reference",
    saleDate: "28 May 2026",
    isbn: "—",
    type: "Sale",
    rentalPeriod: "—",
    unitPrice: 3.0,
    qty: 1,
    publisherDiscount: 0,
    platformDiscount: 0,
    tax: 0.15,
    netSales: 3.15,
  },
];

const PAGE_SIZE = 8;
const DEFAULT_PRESET: Preset = "MTD";
const DEFAULT_VIEW: ViewMode = "Detailed";
const DEFAULT_SALE_TYPE: SaleType = "Sale & Rental";

function formatINR(n: number) {
  return `₹${n.toFixed(2)}`;
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md justify-between min-h-[128px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
          style={{
            backgroundColor: "var(--sidebar-highlight)",
            color: "var(--brand)",
          }}
        >
          <Icon size={18} />
        </span>
      </div>
      <div>
        <p className="text-2xl font-extrabold text-foreground tracking-tight">
          {value}
        </p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function SalesReportPage() {
  const [publisherType] = usePublisherType();
  const navigate = useNavigate();

  useEffect(() => {
    if (publisherType === "Library-Only Publisher") {
      navigate({ to: "/publisher/catalogue", replace: true });
    }
  }, [publisherType, navigate]);

  if (publisherType === "Library-Only Publisher") {
    return null;
  }

  const [preset, setPreset] = useState<Preset>(DEFAULT_PRESET);
  const [presetOpen, setPresetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW);
  const [saleType, setSaleType] = useState<SaleType>(DEFAULT_SALE_TYPE);
  const [exportOpen, setExportOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("2026-07-01");
  const [to, setTo] = useState("2026-07-04");
  const [page, setPage] = useState(1);

  const handlePresetSelect = (opt: Preset) => {
    setPreset(opt);
    setPresetOpen(false);
    setPage(1);

    if (opt === "MTD") {
      setFrom("2026-07-01");
      setTo("2026-07-04");
    } else if (opt === "QTD") {
      setFrom("2026-07-01");
      setTo("2026-07-04");
    } else if (opt === "YTD") {
      setFrom("2026-01-01");
      setTo("2026-07-04");
    } else if (opt === "Current FY") {
      setFrom("2026-04-01");
      setTo("2027-03-31");
    } else if (opt === "Last FY") {
      setFrom("2025-04-01");
      setTo("2026-03-31");
    } else if (opt === "Last 30 days") {
      setFrom("2026-06-04");
      setTo("2026-07-04");
    }
  };

  const hasActiveFilters =
    query.trim().length > 0 ||
    viewMode !== DEFAULT_VIEW ||
    saleType !== DEFAULT_SALE_TYPE ||
    preset !== DEFAULT_PRESET;

  function resetFilters() {
    setQuery("");
    setViewMode(DEFAULT_VIEW);
    setSaleType(DEFAULT_SALE_TYPE);
    setPreset(DEFAULT_PRESET);
    setFrom("2026-07-01");
    setTo("2026-07-04");
    setPage(1);
  }

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return seed.filter((r) => {
      if (saleType === "Sale only" && r.type !== "Sale") return false;
      if (saleType === "Rental only" && r.type !== "Rental") return false;
      if (!q) return true;
      return r.title.toLowerCase().includes(q) || r.isbn.toLowerCase().includes(q);
    });
  }, [query, saleType]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = rows.slice(start, start + PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    const nums: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) nums.push(i);
      else if (nums[nums.length - 1] !== "…") nums.push("…");
    }
    return nums;
  }, [totalPages, currentPage]);

  const totalNet = rows.reduce((s, r) => s + r.netSales, 0);
  const totalBooks = rows.reduce((s, r) => s + r.qty, 0);

  return (
    <AppShell title="Sales Report" subtitle="Track book sales, rentals and net revenue.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Top Header Row with Date Range Filter Controls placed ABOVE stat boxes */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card border border-border rounded-xl p-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                backgroundColor: "var(--sidebar-highlight)",
                color: "var(--brand)",
              }}
            >
              <Calendar size={16} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">Date Range & Period</h3>
              <p className="text-xs text-muted-foreground">Select period to update summary metrics</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Preset Dropdown with Current FY, Last FY, Custom, etc. */}
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
                <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className={`flex w-full items-center px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer ${p === preset ? "font-bold text-brand bg-secondary/60" : "text-foreground"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Pickers */}
            <div className="flex items-center gap-2">
              <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3 shadow-2xs">
                <input
                  type="date"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setPreset("Custom");
                  }}
                  className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                />
              </label>
              <span className="text-xs font-medium text-muted-foreground">to</span>
              <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3 shadow-2xs">
                <input
                  type="date"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    setPreset("Custom");
                  }}
                  className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Compact Stat cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StatCard icon={Tag} label="Total Sales" value={formatINR(totalNet)} subtitle="Net Period Sales" />
          <StatCard icon={BookMarked} label="Total Books Sold" value={String(totalBooks)} subtitle="Units Sold" />
        </div>

        {/* Filters & Export Card */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 min-w-[240px] max-w-sm">
              <Search size={15} className="mr-2 text-muted-foreground shrink-0" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by title, ISBN"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>

            {/* Filter Dropdowns & Export Button */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Select
                value={viewMode}
                onValueChange={(value) => {
                  setViewMode(value as ViewMode);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 w-36 rounded-lg bg-card shadow-none">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  {VIEW_MODES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={saleType}
                onValueChange={(value) => {
                  setSaleType(value as SaleType);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 w-40 rounded-lg bg-card shadow-none">
                  <SelectValue placeholder="Sale type" />
                </SelectTrigger>
                <SelectContent>
                  {SALE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Export Button with Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExportOpen((v) => !v)}
                  className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                  disabled={rows.length === 0}
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
                        toast.success("Downloading Sales Report (PDF)...");
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
                        toast.success("Downloading Sales Report (Excel)...");
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
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-9 items-center rounded-md border border-border bg-card px-3 text-xs font-medium transition-colors hover:bg-secondary cursor-pointer"
            >
              Clear Filters
            </button>

            {query.trim().length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium cursor-pointer"
              >
                Search: {query.trim()}
                <X size={13} className="text-muted-foreground" />
              </button>
            )}

            {viewMode !== DEFAULT_VIEW && (
              <button
                type="button"
                onClick={() => {
                  setViewMode(DEFAULT_VIEW);
                  setPage(1);
                }}
                className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium cursor-pointer"
              >
                {viewMode}
                <X size={13} className="text-muted-foreground" />
              </button>
            )}

            {saleType !== DEFAULT_SALE_TYPE && (
              <button
                type="button"
                onClick={() => {
                  setSaleType(DEFAULT_SALE_TYPE);
                  setPage(1);
                }}
                className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium cursor-pointer"
              >
                {saleType}
                <X size={13} className="text-muted-foreground" />
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                  <th className="py-4 pr-4 font-semibold">Sale Date</th>
                  <th className="py-4 pr-4 font-semibold">ISBN</th>
                  <th className="py-4 pr-4 font-semibold">Type</th>
                  <th className="py-4 pr-4 font-semibold">Rental Period</th>
                  <th className="py-4 pr-4 font-semibold">Unit Price</th>
                  <th className="py-4 pr-4 font-semibold">Qty</th>
                  <th className="py-4 pr-4 font-semibold">Publisher Discount</th>
                  <th className="py-4 pr-4 font-semibold">Platform Discount</th>
                  <th className="py-4 pr-4 font-semibold">Tax</th>
                  <th className="py-4 pr-6 text-right font-semibold">Net Sales</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-14 text-center text-sm text-muted-foreground">
                      No matching results found. Try changing the filters or date range.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-border/60 transition-colors hover:bg-secondary/40"
                    >
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-12 w-9 shrink-0 items-center justify-center rounded-sm text-[9px] font-bold text-white shadow-sm"
                            style={{
                              background: "linear-gradient(135deg, #4a9fd4, #2d7ab5)",
                            }}
                          >
                            NEP
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{r.title}</p>
                            {r.subtitle && (
                              <p className="text-xs text-muted-foreground">{r.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-muted-foreground">{r.saleDate}</td>
                      <td className="py-4 pr-4 text-muted-foreground">{r.isbn}</td>
                      <td className="py-4 pr-4 text-muted-foreground">{r.type}</td>
                      <td className="py-4 pr-4 text-muted-foreground">{r.rentalPeriod || "—"}</td>
                      <td className="py-4 pr-4">{formatINR(r.unitPrice)}</td>
                      <td className="py-4 pr-4">{r.qty}</td>
                      <td className="py-4 pr-4">{formatINR(r.publisherDiscount)}</td>
                      <td className="py-4 pr-4">{formatINR(r.platformDiscount)}</td>
                      <td className="py-4 pr-4">{formatINR(r.tax)}</td>
                      <td className="py-4 pr-6 text-right font-medium">{formatINR(r.netSales)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-secondary/30 text-sm font-semibold">
                  <td className="py-4 pl-6 pr-4">Total</td>
                  <td colSpan={9}></td>
                  <td className="py-4 pr-6 text-right">{formatINR(totalNet)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile */}
          <ul className="divide-y divide-border/60 md:hidden">
            {pageItems.length === 0 && (
              <li className="py-10 text-center text-sm text-muted-foreground">
                No matching results found.
              </li>
            )}
            {pageItems.map((r) => (
              <li key={r.id} className="space-y-1 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.title}</span>
                  <span className="text-xs text-muted-foreground">{r.saleDate}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{r.isbn}</span>
                  <span>{r.type}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span>Qty: {r.qty}</span>
                  <span className="font-semibold">{formatINR(r.netSales)}</span>
                </div>
              </li>
            ))}
            <li className="flex items-center justify-between bg-secondary/30 p-4 text-sm font-semibold">
              <span>Total</span>
              <span>{formatINR(totalNet)}</span>
            </li>
          </ul>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p className="text-xs text-muted-foreground">
              {rows.length === 0
                ? "0 transactions"
                : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, rows.length)} of ${rows.length}`}
            </p>
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage((n) => Math.max(1, n - 1))}
                    className="flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                </PaginationItem>
                {pageNumbers.map((n, i) =>
                  n === "…" ? (
                    <PaginationItem key={`e-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={n}>
                      <PaginationLink
                        isActive={n === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(n);
                        }}
                        href="#"
                        style={
                          n === currentPage
                            ? {
                              backgroundColor: "var(--brand)",
                              color: "var(--brand-contrast)",
                              borderColor: "transparent",
                            }
                            : undefined
                        }
                      >
                        {n}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((n) => Math.min(totalPages, n + 1))}
                    className="flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium disabled:opacity-40 cursor-pointer"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
