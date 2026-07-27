import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  BookMarked,
  Tag,
  Building2,
  Users,
  Upload,
  ScrollText,
  Table,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/sales-report")({
  head: () => ({
    meta: [
      { title: "Sales Report — PixelBooks Admin" },
      {
        name: "description",
        content: "Track eBook sales, quantity, discounts, tax, and net revenue across publishers & authors.",
      },
    ],
  }),
  component: AdminSalesReportPage,
});

export type EntityType = "Publisher" | "Author";

export type SalesReportRow = {
  id: string;
  name: string;
  type: EntityType;
  avatarLetter: string;
  totalSales: number;
  qty: number;
  pubAuthDiscount: number;
  platformDiscount: number;
  tax: number;
  netSales: number;
};

export type SalesDetailItem = {
  id: string;
  title: string;
  category: string;
  coverGradient: string;
  saleDate: string;
  isbn: string;
  type: "Sale" | "Rental";
  rentalPeriod: string;
  unitPrice: number;
  qty: number;
  pubAuthDiscount: number;
  platformDiscount: number;
  tax: number;
  netSales: number;
};

// Dataset matching screenshot exact figures
const initialSalesData: SalesReportRow[] = [
  {
    id: "sr-1",
    name: "Werley Nortreus",
    type: "Author",
    avatarLetter: "WN",
    totalSales: 13536.18,
    qty: 4,
    pubAuthDiscount: 0.0,
    platformDiscount: 0.0,
    tax: 456.2,
    netSales: 13536.18,
  },
  {
    id: "sr-2",
    name: "Cambridge University Press",
    type: "Publisher",
    avatarLetter: "CU",
    totalSales: 5536.02,
    qty: 6,
    pubAuthDiscount: 0.0,
    platformDiscount: 0.0,
    tax: 94.55,
    netSales: 5536.02,
  },
  {
    id: "sr-3",
    name: "AQW",
    type: "Publisher",
    avatarLetter: "AQ",
    totalSales: 4200.82,
    qty: 3,
    pubAuthDiscount: 0.0,
    platformDiscount: 0.0,
    tax: 200.04,
    netSales: 4200.82,
  },
  {
    id: "sr-4",
    name: "Cengage & Pearson",
    type: "Publisher",
    avatarLetter: "CP",
    totalSales: 3985.83,
    qty: 5,
    pubAuthDiscount: 23.97,
    platformDiscount: 0.0,
    tax: 189.8,
    netSales: 3985.83,
  },
  {
    id: "sr-5",
    name: "Meadows Publishers",
    type: "Publisher",
    avatarLetter: "MP",
    totalSales: 3713.78,
    qty: 4,
    pubAuthDiscount: 0.0,
    platformDiscount: 0.0,
    tax: 216.78,
    netSales: 3713.78,
  },
  {
    id: "sr-6",
    name: "Veena",
    type: "Publisher",
    avatarLetter: "VN",
    totalSales: 3619.5,
    qty: 3,
    pubAuthDiscount: 0.0,
    platformDiscount: 100.0,
    tax: 469.5,
    netSales: 3619.5,
  },
  {
    id: "sr-7",
    name: "APK Publishers",
    type: "Publisher",
    avatarLetter: "AP",
    totalSales: 2800.0,
    qty: 1,
    pubAuthDiscount: 0.0,
    platformDiscount: 0.0,
    tax: 300.0,
    netSales: 2800.0,
  },
  {
    id: "sr-8",
    name: "RJ Authors",
    type: "Author",
    avatarLetter: "RJ",
    totalSales: 7300.59,
    qty: 8,
    pubAuthDiscount: 15.0,
    platformDiscount: 50.0,
    tax: 310.2,
    netSales: 7300.59,
  },
  {
    id: "sr-9",
    name: "Louisa May Alcott",
    type: "Author",
    avatarLetter: "LA",
    totalSales: 2400.0,
    qty: 2,
    pubAuthDiscount: 0.0,
    platformDiscount: 0.0,
    tax: 120.0,
    netSales: 2400.0,
  },
  {
    id: "sr-10",
    name: "Aisha Publishers",
    type: "Publisher",
    avatarLetter: "AI",
    totalSales: 1680.0,
    qty: 2,
    pubAuthDiscount: 0.0,
    platformDiscount: 0.0,
    tax: 84.0,
    netSales: 1680.0,
  },
  {
    id: "sr-11",
    name: "Oxford University Press",
    type: "Publisher",
    avatarLetter: "OU",
    totalSales: 8950.0,
    qty: 7,
    pubAuthDiscount: 50.0,
    platformDiscount: 0.0,
    tax: 447.5,
    netSales: 8950.0,
  },
  {
    id: "sr-12",
    name: "HarperCollins India",
    type: "Publisher",
    avatarLetter: "HC",
    totalSales: 6420.0,
    qty: 5,
    pubAuthDiscount: 0.0,
    platformDiscount: 120.0,
    tax: 321.0,
    netSales: 6420.0,
  },
];

// Sample eBooks sales breakdown items for Werley Nortreus (exact matching screenshot)
const werleyNortreusItems: SalesDetailItem[] = [
  {
    id: "eb-1",
    title: "DiggyPOD Inc 5 x 7 Book Template",
    category: "General & Literary Fiction",
    coverGradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    saleDate: "21 Jul 2026",
    isbn: "97898295487705",
    type: "Sale",
    rentalPeriod: "—",
    unitPrice: 600.0,
    qty: 1,
    pubAuthDiscount: 0.0,
    platformDiscount: 0.0,
    tax: 30.0,
    netSales: 630.0,
  },
  {
    id: "eb-2",
    title: "The Glass Palace Chronicle",
    category: "General & Literary Fiction",
    coverGradient: "linear-gradient(135deg, #d97706, #b45309)",
    saleDate: "21 Jul 2026",
    isbn: "—",
    type: "Sale",
    rentalPeriod: "—",
    unitPrice: 8523.98,
    qty: 1,
    pubAuthDiscount: 0.0,
    platformDiscount: 0.0,
    tax: 426.2,
    netSales: 8950.18,
  },
  {
    id: "eb-3",
    title: "Als Manuskript Gedruckt",
    category: "General & Literary Fiction",
    coverGradient: "linear-gradient(135deg, #ca8a04, #854d0e)",
    saleDate: "21 Jul 2026",
    isbn: "9783663060246",
    type: "Sale",
    rentalPeriod: "—",
    unitPrice: 2456.0,
    qty: 1,
    pubAuthDiscount: 0.0,
    platformDiscount: 0.0,
    tax: 0.0,
    netSales: 2456.0,
  },
  {
    id: "eb-4",
    title: "History of the English People, Volume VII / The Revolution, 1683-1760;...",
    category: "General & Literary Fiction",
    coverGradient: "linear-gradient(135deg, #9333ea, #6b21a8)",
    saleDate: "20 Jul 2026",
    isbn: "—",
    type: "Rental",
    rentalPeriod: "1 Year",
    unitPrice: 1500.0,
    qty: 1,
    pubAuthDiscount: 0.0,
    platformDiscount: 0.0,
    tax: 0.0,
    netSales: 1500.0,
  },
];

const filterTypeOptions = ["Publishers & Authors", "Publishers", "Authors"] as const;
const presetOptions = [
  "MTD",
  "QTD",
  "YTD",
  "Current FY",
  "Last FY",
  "Last 30 days",
  "Custom",
] as const;

const viewModeOptions = ["Detailed", "Consolidated"] as const;
const saleTypeOptions = ["Sale & Rental", "Sale only", "Rental only"] as const;

const PAGE_SIZE = 8;

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-xs flex flex-col justify-between">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
          style={{
            backgroundColor: "var(--sidebar-highlight)",
            color: "var(--brand)",
          }}
        >
          <Icon size={16} />
        </span>
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

function AdminSalesReportPage() {
  const [selectedEntity, setSelectedEntity] = useState<SalesReportRow | null>(null);

  // Main page filters
  const [typeFilter, setTypeFilter] = useState<(typeof filterTypeOptions)[number]>("Publishers & Authors");
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [presetFilter, setPresetFilter] = useState<(typeof presetOptions)[number]>("MTD");
  const [presetFilterOpen, setPresetFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-23");
  const [searchQuery, setSearchQuery] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Detail page state
  const [detailSearch, setDetailSearch] = useState("");
  const [detailViewMode, setDetailViewMode] = useState("Detailed");
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const [detailSaleType, setDetailSaleType] = useState("Sale & Rental");
  const [detailSaleTypeOpen, setDetailSaleTypeOpen] = useState(false);
  const [detailPreset, setDetailPreset] = useState("MTD");
  const [detailPresetOpen, setDetailPresetOpen] = useState(false);
  const [detailStartDate, setDetailStartDate] = useState("2026-07-01");
  const [detailEndDate, setDetailEndDate] = useState("2026-07-23");
  const [detailExportOpen, setDetailExportOpen] = useState(false);
  const [detailPage, setDetailPage] = useState(1);

  const handlePresetSelect = (opt: (typeof presetOptions)[number]) => {
    setPresetFilter(opt);
    setPresetFilterOpen(false);
    setPage(1);

    if (opt === "MTD") {
      setStartDate("2026-07-01");
      setEndDate("2026-07-23");
    } else if (opt === "QTD") {
      setStartDate("2026-07-01");
      setEndDate("2026-07-23");
    } else if (opt === "YTD") {
      setStartDate("2026-01-01");
      setEndDate("2026-07-23");
    } else if (opt === "Current FY") {
      setStartDate("2026-04-01");
      setEndDate("2027-03-31");
    } else if (opt === "Last FY") {
      setStartDate("2025-04-01");
      setEndDate("2026-03-31");
    } else if (opt === "Last 30 days") {
      setStartDate("2026-06-23");
      setEndDate("2026-07-23");
    }
  };

  const handleDetailPresetSelect = (opt: string) => {
    setDetailPreset(opt);
    setDetailPresetOpen(false);
    setDetailPage(1);

    if (opt === "MTD") {
      setDetailStartDate("2026-07-01");
      setDetailEndDate("2026-07-23");
    } else if (opt === "QTD") {
      setDetailStartDate("2026-07-01");
      setDetailEndDate("2026-07-23");
    } else if (opt === "YTD") {
      setDetailStartDate("2026-01-01");
      setDetailEndDate("2026-07-23");
    } else if (opt === "Current FY") {
      setDetailStartDate("2026-04-01");
      setDetailEndDate("2027-03-31");
    } else if (opt === "Last FY") {
      setDetailStartDate("2025-04-01");
      setDetailEndDate("2026-03-31");
    } else if (opt === "Last 30 days") {
      setDetailStartDate("2026-06-23");
      setDetailEndDate("2026-07-23");
    }
  };

  const filtered = useMemo(() => {
    return initialSalesData.filter((row) => {
      if (typeFilter === "Publishers" && row.type !== "Publisher") return false;
      if (typeFilter === "Authors" && row.type !== "Author") return false;
      if (searchQuery.trim()) {
        return row.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      }
      return true;
    });
  }, [typeFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  // Detail View Rendering (Matching exact screenshot provided by user)
  if (selectedEntity) {
    const detailItems = werleyNortreusItems.filter((item) => {
      if (detailSaleType === "Sale only" && item.type !== "Sale") return false;
      if (detailSaleType === "Rental only" && item.type !== "Rental") return false;
      if (detailSearch.trim()) {
        const q = detailSearch.toLowerCase().trim();
        return item.title.toLowerCase().includes(q) || item.isbn.toLowerCase().includes(q);
      }
      return true;
    });

    const totalNetSalesDetail = detailItems.reduce((acc, i) => acc + i.netSales, 0);
    const detailTotalPages = Math.max(1, Math.ceil(detailItems.length / PAGE_SIZE));
    const currentDetailPage = Math.min(detailPage, detailTotalPages);
    const detailStart = (currentDetailPage - 1) * PAGE_SIZE;
    const detailPageItems = detailItems.slice(detailStart, detailStart + PAGE_SIZE);

    const discountColumnTitle = selectedEntity.type === "Author" ? "Author Discount" : "Publisher Discount";

    return (
      <AppShell title="Sales Report" subtitle={`Detailed sales breakdown for ${selectedEntity.name}.`}>
        <div className="space-y-6 p-4 md:p-8">
          {/* Top Entity Header & Filters Combined Card matching margin-report.tsx */}
          <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-xs space-y-4">
            {/* Row 1: Back Button + Avatar + Name + Type Tag */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setSelectedEntity(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
                  title="Back to Sales Report"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-2xs"
                    style={{
                      backgroundColor: "var(--sidebar-highlight)",
                      color: "var(--brand)",
                    }}
                  >
                    {selectedEntity.avatarLetter}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-foreground leading-snug">
                        {selectedEntity.name}
                      </h2>
                      <span
                        className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                        style={{
                          backgroundColor: "color-mix(in oklab, var(--brand) 10%, transparent)",
                          color: "var(--brand)",
                        }}
                      >
                        {selectedEntity.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Total: {werleyNortreusItems.length} eBooks
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Search, View Mode, Sale Type, Preset, Date Pickers & Export Button */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Input */}
              <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 min-w-[200px]">
                <Search size={15} className="mr-2 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={detailSearch}
                  onChange={(e) => {
                    setDetailSearch(e.target.value);
                    setDetailPage(1);
                  }}
                  placeholder="Search by title, ISBN"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
                />
              </label>

              {/* View Mode Dropdown (Detailed / Consolidated) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDetailViewOpen((v) => !v)}
                  className="flex h-11 min-w-[120px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer"
                >
                  <span>{detailViewMode}</span>
                  <ChevronDown size={15} className="text-muted-foreground shrink-0" />
                </button>
                {detailViewOpen && (
                  <div className="absolute left-0 z-30 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
                    {viewModeOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setDetailViewMode(opt);
                          setDetailViewOpen(false);
                        }}
                        className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary cursor-pointer ${
                          opt === detailViewMode ? "font-semibold text-foreground bg-secondary/50" : "text-muted-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sale Type Dropdown (Sale & Rental / Sale only / Rental only) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDetailSaleTypeOpen((v) => !v)}
                  className="flex h-11 min-w-[140px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer"
                >
                  <span>{detailSaleType}</span>
                  <ChevronDown size={15} className="text-muted-foreground shrink-0" />
                </button>
                {detailSaleTypeOpen && (
                  <div className="absolute left-0 z-30 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
                    {saleTypeOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setDetailSaleType(opt);
                          setDetailSaleTypeOpen(false);
                          setDetailPage(1);
                        }}
                        className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary cursor-pointer ${
                          opt === detailSaleType ? "font-semibold text-foreground bg-secondary/50" : "text-muted-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Preset Dropdown (MTD / QTD / YTD...) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDetailPresetOpen((v) => !v)}
                  className="flex h-11 min-w-[120px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer"
                >
                  <span>{detailPreset}</span>
                  <ChevronDown size={15} className="text-muted-foreground shrink-0" />
                </button>
                {detailPresetOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
                    {presetOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleDetailPresetSelect(opt)}
                        className={`flex w-full items-center px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer ${
                          opt === detailPreset ? "font-bold text-brand bg-secondary/60" : "text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Pickers */}
              <div className="flex items-center gap-2">
                <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3">
                  <input
                    type="date"
                    value={detailStartDate}
                    onChange={(e) => {
                      setDetailStartDate(e.target.value);
                      setDetailPreset("Custom");
                    }}
                    className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                  />
                </label>
                <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3">
                  <input
                    type="date"
                    value={detailEndDate}
                    onChange={(e) => {
                      setDetailEndDate(e.target.value);
                      setDetailPreset("Custom");
                    }}
                    className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                  />
                </label>
              </div>

              {/* Export Button */}
              <div className="relative ml-auto">
                <button
                  type="button"
                  onClick={() => setDetailExportOpen((v) => !v)}
                  className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  <Upload size={15} />
                  <span>Export</span>
                  <ChevronDown size={14} />
                </button>
                {detailExportOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDetailExportOpen(false);
                        toast.success(`Exporting Sales Report PDF for ${selectedEntity.name}...`);
                      }}
                      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary cursor-pointer"
                    >
                      <ScrollText size={15} className="text-muted-foreground" />
                      <span>Export PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDetailExportOpen(false);
                        toast.success(`Exporting Sales Report Excel for ${selectedEntity.name}...`);
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

          {/* Detailed Data Table */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                    <th className="py-4 pr-4 font-semibold">Sale Date</th>
                    <th className="py-4 pr-4 font-semibold">ISBN</th>
                    <th className="py-4 pr-4 font-semibold">Type</th>
                    <th className="py-4 pr-4 font-semibold">Rental Period</th>
                    <th className="py-4 pr-4 font-semibold">Unit Price</th>
                    <th className="py-4 pr-4 font-semibold text-center">Qty</th>
                    <th className="py-4 pr-4 font-semibold">{discountColumnTitle}</th>
                    <th className="py-4 pr-4 font-semibold">Platform Discount</th>
                    <th className="py-4 pr-4 font-semibold">Tax</th>
                    <th className="py-4 pr-6 text-right font-semibold">Net Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {detailPageItems.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-16 text-center text-sm text-muted-foreground">
                        No eBook sales found matching filters.
                      </td>
                    </tr>
                  ) : (
                    detailPageItems.map((item) => (
                      <tr key={item.id} className="transition-colors hover:bg-secondary/50">
                        {/* Book Cover + Title + Category Subtext */}
                        <td className="py-4 pl-6 pr-4">
                          <div className="flex items-center gap-3 max-w-xs">
                            <div
                              className="flex h-12 w-9 shrink-0 items-center justify-center rounded-sm text-[9px] font-bold text-white shadow-xs"
                              style={{ background: item.coverGradient }}
                            >
                              eBook
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                            </div>
                          </div>
                        </td>

                        {/* Sale Date */}
                        <td className="py-4 pr-4 text-foreground text-sm whitespace-nowrap">
                          {item.saleDate}
                        </td>

                        {/* ISBN */}
                        <td className="py-4 pr-4 whitespace-nowrap">
                          {item.isbn !== "—" && item.isbn !== "-" ? (
                            <span className="inline-flex items-center rounded-md bg-secondary/80 px-2.5 py-1 text-xs font-mono font-medium text-foreground">
                              {item.isbn}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>

                        {/* Type */}
                        <td className="py-4 pr-4 text-foreground text-sm whitespace-nowrap">
                          {item.type}
                        </td>

                        {/* Rental Period */}
                        <td className="py-4 pr-4 text-foreground text-sm whitespace-nowrap">
                          {item.rentalPeriod}
                        </td>

                        {/* Unit Price */}
                        <td className="py-4 pr-4 font-medium text-foreground whitespace-nowrap">
                          ₹{item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Qty */}
                        <td className="py-4 pr-4 text-center font-medium text-foreground">
                          {item.qty}
                        </td>

                        {/* Discount */}
                        <td className="py-4 pr-4 text-foreground whitespace-nowrap">
                          ₹{item.pubAuthDiscount.toFixed(2)}
                        </td>

                        {/* Platform Discount */}
                        <td className="py-4 pr-4 text-foreground whitespace-nowrap">
                          ₹{item.platformDiscount.toFixed(2)}
                        </td>

                        {/* Tax */}
                        <td className="py-4 pr-4 text-foreground whitespace-nowrap">
                          ₹{item.tax.toFixed(2)}
                        </td>

                        {/* Net Sales */}
                        <td className="py-4 pr-6 text-right font-bold text-foreground whitespace-nowrap">
                          ₹{item.netSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Row */}
            <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {detailItems.length === 0 ? 0 : detailStart + 1} from {detailItems.length} results
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentDetailPage === 1}
                  onClick={() => setDetailPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer text-muted-foreground"
                >
                  «&nbsp;Previous
                </button>
                {Array.from({ length: detailTotalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDetailPage(p)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors cursor-pointer"
                    style={
                      p === currentDetailPage
                        ? {
                            backgroundColor: "color-mix(in oklab, var(--brand) 12%, transparent)",
                            color: "var(--brand)",
                          }
                        : undefined
                    }
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentDetailPage === detailTotalPages}
                  onClick={() => setDetailPage((p) => Math.min(detailTotalPages, p + 1))}
                  className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer text-muted-foreground"
                >
                  Next&nbsp;»
                </button>
              </div>
            </div>

            {/* Bottom Total Footer Row */}
            <div className="flex items-center justify-between border-t border-border bg-secondary/20 px-6 py-4">
              <span className="text-sm font-bold text-foreground">Total</span>
              <span className="text-base font-extrabold text-foreground">
                ₹{totalNetSalesDetail.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // Main Sales Report Overview View
  return (
    <AppShell title="Sales Report" subtitle="Track eBook sales, discounts and revenue across publishers & authors.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Top Header Row with Date Range Filter Controls placed ABOVE the 4 stat boxes */}
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
              <h3 className="text-sm font-bold text-foreground">Report Filters & Date Range</h3>
              <p className="text-xs text-muted-foreground">Select entity type and period to update summary metrics</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter 1: Publishers & Authors */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setTypeFilterOpen((v) => !v)}
                className="flex h-11 min-w-[170px] items-center justify-between gap-4 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer shadow-2xs"
              >
                <span>{typeFilter}</span>
                <ChevronDown size={15} className="text-muted-foreground shrink-0" />
              </button>
              {typeFilterOpen && (
                <div className="absolute left-0 sm:right-0 z-30 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
                  {filterTypeOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setTypeFilter(opt);
                        setTypeFilterOpen(false);
                        setPage(1);
                      }}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary cursor-pointer ${
                        opt === typeFilter ? "font-semibold text-foreground bg-secondary/50" : "text-muted-foreground"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 2: Preset Dropdown with Current FY, Last FY, Custom, etc. */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPresetFilterOpen((v) => !v)}
                className="flex h-11 min-w-[130px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer shadow-2xs"
              >
                <span>{presetFilter}</span>
                <ChevronDown size={15} className="text-muted-foreground shrink-0" />
              </button>
              {presetFilterOpen && (
                <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
                  {presetOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handlePresetSelect(opt)}
                      className={`flex w-full items-center px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer ${
                        opt === presetFilter ? "font-bold text-brand bg-secondary/60" : "text-foreground"
                      }`}
                    >
                      {opt}
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
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPresetFilter("Custom");
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
                    setPresetFilter("Custom");
                  }}
                  className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Tag}
            label="Total Sales"
            value="₹48,896.46"
          />
          <StatCard
            icon={BookMarked}
            label="Total Books Sold"
            value="44"
          />
          <StatCard
            icon={Building2}
            label="Total Publishers"
            value="165"
          />
          <StatCard
            icon={Users}
            label="Total Authors"
            value="13"
          />
        </div>

        {/* Toolbar Filters White Card Container */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 min-w-[240px] max-w-sm">
              <Search size={15} className="mr-2 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by eBook Name, Author"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>

            {/* Export Button inline row */}
            <div className="flex items-center gap-2.5">
              {/* Export Button with Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExportOpen((v) => !v)}
                  className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
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

        {/* Data Table Card */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Publisher / Author</th>
                  <th className="py-4 pr-4 font-semibold">Total Sales</th>
                  <th className="py-4 pr-4 font-semibold text-center">Qty</th>
                  <th className="py-4 pr-4 font-semibold">Pub/Auth Discount</th>
                  <th className="py-4 pr-4 font-semibold">Platform Discount</th>
                  <th className="py-4 pr-4 font-semibold">Tax</th>
                  <th className="py-4 pr-4 font-semibold">Net Sales</th>
                  <th className="py-4 pr-6 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-sm text-muted-foreground">
                      No records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedEntity(row)}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40 cursor-pointer group"
                    >
                      {/* Publisher / Author Name & Avatar */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: "var(--sidebar-highlight)",
                              color: "var(--brand)",
                            }}
                          >
                            {row.avatarLetter}
                          </span>
                          <div>
                            <p className="font-semibold text-foreground text-sm">{row.name}</p>
                            <p className="text-xs text-muted-foreground">{row.type}</p>
                          </div>
                        </div>
                      </td>

                      {/* Total Sales */}
                      <td className="py-4 pr-4 font-semibold text-foreground whitespace-nowrap">
                        ₹{row.totalSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Qty */}
                      <td className="py-4 pr-4 text-center font-medium text-foreground">
                        {row.qty}
                      </td>

                      {/* Pub/Auth Discount */}
                      <td className="py-4 pr-4 text-foreground whitespace-nowrap">
                        ₹{row.pubAuthDiscount.toFixed(2)}
                      </td>

                      {/* Platform Discount */}
                      <td className="py-4 pr-4 text-foreground whitespace-nowrap">
                        ₹{row.platformDiscount.toFixed(2)}
                      </td>

                      {/* Tax */}
                      <td className="py-4 pr-4 text-foreground whitespace-nowrap">
                        ₹{row.tax.toFixed(2)}
                      </td>

                      {/* Net Sales */}
                      <td className="py-4 pr-4 font-semibold text-foreground whitespace-nowrap">
                        ₹{row.netSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Action Arrow */}
                      <td className="py-4 pr-6 text-right">
                        <ChevronRight size={16} className="text-muted-foreground/60 transition-colors group-hover:text-foreground" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {filtered.length === 0
                ? "0 results"
                : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} from ${filtered.length} results`}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer text-muted-foreground"
              >
                «&nbsp;Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors cursor-pointer"
                  style={
                    p === currentPage
                      ? {
                          backgroundColor: "color-mix(in oklab, var(--brand) 12%, transparent)",
                          color: "var(--brand)",
                        }
                      : undefined
                  }
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer text-muted-foreground"
              >
                Next&nbsp;»
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
