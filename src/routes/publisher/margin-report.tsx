import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Tag,
  Clock,
  BookOpen,
  ChevronDown,
  Upload,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Calendar,
  ScrollText,
  Table,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { toast } from "sonner";

export const Route = createFileRoute("/publisher/margin-report")({
  head: () => ({
    meta: [
      { title: "Margin Report — PixelBooks" },
      {
        name: "description",
        content: "Track sales, royalty, receivables and ledger transactions.",
      },
      { property: "og:title", content: "Margin Report — PixelBooks" },
      {
        property: "og:description",
        content: "Track sales, royalty, receivables and ledger transactions.",
      },
    ],
  }),
  component: MarginReportPage,
});

type LedgerRow = {
  id: string;
  date: string;
  type: string;
  ref: string;
  margin: number | null;
  received: number | null;
  balance: number;
  mode: string;
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

const LEDGER_TYPES = ["Margin & Payments Received", "Margin only", "Payments only"] as const;
type LedgerType = (typeof LEDGER_TYPES)[number];

const seed: LedgerRow[] = [
  {
    id: "o",
    date: "01 Apr 2026",
    type: "Opening Balance",
    ref: "-",
    margin: null,
    received: null,
    balance: 6.5,
    mode: "-",
  },
  {
    id: "t2",
    date: "24 Apr 2026",
    type: "Payment - Base Amount",
    ref: "PMT - 983456",
    margin: null,
    received: 74.88,
    balance: 7000.0,
    mode: "UPI",
  },
  {
    id: "t3",
    date: "27 Apr 2026",
    type: "Sale / Rental",
    ref: "Inv_0001833",
    margin: 51935.0,
    received: null,
    balance: 58935.0,
    mode: "Wire Transfer",
  },
  {
    id: "t1",
    date: "28 May 2026",
    type: "Sale / Rental",
    ref: "Inv_0000299",
    margin: 1.95,
    received: null,
    balance: 8425,
    mode: "UPI",
  },
  {
    id: "c",
    date: "04 Jul 2026",
    type: "Closing Balance",
    ref: "-",
    margin: null,
    received: null,
    balance: 8425,
    mode: "-",
  },
];

const PAGE_SIZE = 8;

type TxnItem = {
  id: string;
  title: string;
  publisher: string;
  coverColor: string;
  saleDate: string;
  isbn: string;
  type: string;
  unitPrice: number;
  qty: number;
  netAmount: number;
  marginPayable: number;
};

type TxnDetail = {
  ref: string;
  date: string;
  items: TxnItem[];
};

const TXN_DETAILS: Record<string, TxnDetail> = {
  Inv_0001833: {
    ref: "Inv_0001833",
    date: "27 Apr 2026",
    items: [
      {
        id: "i1",
        title: "Destination...",
        publisher: "DC Books",
        coverColor: "#2d6a4f",
        saleDate: "27 Apr 2026",
        isbn: "—",
        type: "Sale",
        unitPrice: 51935.0,
        qty: 1,
        netAmount: 51935.0,
        marginPayable: 32146.7,
      },
    ],
  },
  Inv_0000299: {
    ref: "Inv_0000299",
    date: "28 May 2026",
    items: [
      {
        id: "i1",
        title: "Destination...",
        publisher: "DC Books",
        coverColor: "#2d6a4f",
        saleDate: "28 May 2026",
        isbn: "—",
        type: "Rental",
        unitPrice: 838.95,
        qty: 1,
        netAmount: 838.95,
        marginPayable: 519.35,
      },
    ],
  },
};

const DETAIL_PAGE_SIZE = 8;

type PaymentDetail = {
  ref: string;
  date: string;
  publisher: string;
  publisherRole: string;
  account: { name: string; number: string; ifsc: string; bank: string };
  amount: number;
  status: string;
  mode: string;
};

const PAYMENT_DETAILS: Record<string, PaymentDetail> = {
  "PMT - 983456": {
    ref: "PMT - 983456",
    date: "24 Apr 2026",
    publisher: "SJ Publications",
    publisherRole: "Publisher",
    account: { name: "sa", number: "12345", ifsc: "HSBC0400005", bank: "HSBC BANK" },
    amount: 74.88,
    status: "Paid",
    mode: "UPI",
  },
};

function formatINR(n: number | null) {
  if (n === null) return "-";
  return `₹${n.toFixed(2)}`;
}

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

function PaymentDetailView({ detail, onBack }: { detail: PaymentDetail; onBack: () => void }) {
  return (
    <div className="p-4 md:p-8">
      {/* Back + heading */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-lg font-semibold leading-tight">Payment Details</h2>
          <p className="text-sm text-muted-foreground">View payment details</p>
        </div>
      </div>

      {/* Main card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {/* Publisher */}
        <div className="flex items-center gap-4 px-6 py-5">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold"
            style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
          >
            {detail.publisher
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div>
            <p className="text-base font-semibold">{detail.publisher}</p>
            <p className="text-sm text-muted-foreground">{detail.publisherRole}</p>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Account + Amount cards */}
        <div className="grid gap-4 p-6 md:grid-cols-2">
          {/* Account Details */}
          <div className="rounded-xl border border-border bg-background p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Account Details</span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--brand) 10%, transparent)",
                  color: "var(--brand)",
                }}
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M5 8.5l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Active Bank Account
              </span>
            </div>
            <p className="mb-3 text-base font-semibold">{detail.account.name}</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{detail.account.number}</p>
              <p>{detail.account.ifsc}</p>
              <p>{detail.account.bank}</p>
            </div>
          </div>

          {/* Amount */}
          <div className="rounded-xl border border-border bg-background p-5">
            <div className="mb-4">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--brand) 10%, transparent)",
                  color: "var(--brand)",
                }}
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M5 8.5l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {detail.status}
              </span>
            </div>
            <p className="mb-2 text-sm text-muted-foreground">Amount Paid</p>
            <p className="text-2xl font-bold">₹{detail.amount.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Transaction fields */}
        <div className="grid gap-4 p-6 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Transaction Mode
            </label>
            <div className="relative">
              <div className="flex h-14 w-full items-center rounded-xl border border-border bg-background px-4 text-sm text-muted-foreground">
                {detail.mode}
              </div>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Transaction Date
            </label>
            <div className="flex h-14 w-full items-center rounded-xl border border-border bg-background px-4 text-sm text-muted-foreground">
              {detail.date}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Transaction Ref#
            </label>
            <div className="flex h-14 w-full items-center rounded-xl border border-border bg-background px-4 text-sm text-muted-foreground">
              {detail.ref}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookCover({ color, size = 40 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.4)} viewBox="0 0 40 56" fill="none" aria-hidden>
      <rect width="40" height="56" rx="3" fill={color} />
      <rect x="5" y="8" width="22" height="2.5" rx="1" fill="white" fillOpacity="0.7" />
      <rect x="5" y="13" width="16" height="2" rx="1" fill="white" fillOpacity="0.4" />
      <rect x="5" y="28" width="30" height="18" rx="2" fill="white" fillOpacity="0.12" />
    </svg>
  );
}

function TransactionDetail({ detail, onBack }: { detail: TxnDetail; onBack: () => void }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(detail.items.length / DETAIL_PAGE_SIZE));
  const paged = detail.items.slice((page - 1) * DETAIL_PAGE_SIZE, page * DETAIL_PAGE_SIZE);
  const totalMargin = detail.items.reduce((s, i) => s + i.marginPayable, 0);

  return (
    <div className="p-4 md:p-8">
      {/* Back + heading */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-lg font-semibold leading-tight">Trans. Ref: {detail.ref}</h2>
          <p className="text-sm text-muted-foreground">{detail.date}</p>
        </div>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="py-4 pl-5 pr-4">Title</th>
                <th className="py-4 pr-4">Sale Date</th>
                <th className="py-4 pr-4">ISBN</th>
                <th className="py-4 pr-4">Type</th>
                <th className="py-4 pr-4">Unit Price</th>
                <th className="py-4 pr-4">Qty</th>
                <th className="py-4 pr-4">Net Amount</th>
                <th className="py-4 pr-5">Margin Payable</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                    No items found.
                  </td>
                </tr>
              ) : (
                paged.map((item) => (
                  <tr key={item.id} className="border-b border-border/60">
                    <td className="py-4 pl-5 pr-4">
                      <div className="flex items-center gap-3">
                        <BookCover color={item.coverColor} />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.publisher}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{item.saleDate}</td>
                    <td className="py-4 pr-4 text-muted-foreground">{item.isbn}</td>
                    <td className="py-4 pr-4">{item.type}</td>
                    <td className="py-4 pr-4">₹{item.unitPrice.toFixed(2)}</td>
                    <td className="py-4 pr-4">{item.qty}</td>
                    <td className="py-4 pr-4">₹{item.netAmount.toFixed(2)}</td>
                    <td className="py-4 pr-5 font-semibold">₹{item.marginPayable.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          <p className="text-sm text-muted-foreground">
            Showing {detail.items.length === 0 ? 0 : (page - 1) * DETAIL_PAGE_SIZE + 1}
            {detail.items.length > 1
              ? `–${Math.min(page * DETAIL_PAGE_SIZE, detail.items.length)}`
              : ""}{" "}
            from {detail.items.length} results
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-0.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40"
            >
              «&nbsp;Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors"
                style={
                  p === page
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
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-0.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40"
            >
              Next&nbsp;»
            </button>
          </div>
        </div>

        {/* Total margin footer */}
        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          <span className="text-sm font-semibold">Total Margin</span>
          <span className="text-base font-bold">₹{totalMargin.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function MarginReportPage() {
  const [preset, setPreset] = useState<Preset>("MTD");
  const [presetOpen, setPresetOpen] = useState(false);
  const [from, setFrom] = useState("2026-07-01");
  const [to, setTo] = useState("2026-07-04");
  const [selectedTxn, setSelectedTxn] = useState<TxnDetail | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetail | null>(null);
  const [ledgerType, setLedgerType] = useState<LedgerType>("Margin & Payments Received");
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
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

  const rows = seed;
  const dataRows = rows.filter((r) => r.type !== "Opening Balance" && r.type !== "Closing Balance");
  const opening = rows.find((r) => r.type === "Opening Balance");
  const closing = rows.find((r) => r.type === "Closing Balance");

  const totalPages = Math.max(1, Math.ceil(dataRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = dataRows.slice(start, start + PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    const nums: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) nums.push(i);
      else if (nums[nums.length - 1] !== "…") nums.push("…");
    }
    return nums;
  }, [totalPages, currentPage]);

  const rangeLabel = `${new Date(from).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} – ${new Date(to).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;

  return (
    <AppShell title="Margin Report" subtitle="Track your sales, royalty and payments in one place.">
      {selectedTxn ? (
        <TransactionDetail detail={selectedTxn} onBack={() => setSelectedTxn(null)} />
      ) : selectedPayment ? (
        <PaymentDetailView detail={selectedPayment} onBack={() => setSelectedPayment(null)} />
      ) : (
        <div className="space-y-6 p-4 md:p-8">
          {/* Total Receivable Till Date — Premium Card */}
          <div
            className="relative overflow-hidden rounded-2xl p-px"
            style={{ background: "linear-gradient(135deg, oklch(0.72 0.17 160), oklch(0.55 0.14 200), oklch(0.62 0.15 260))" }}
          >
            <div className="relative rounded-[15px] bg-card p-5 sm:p-6">
              {/* Subtle background glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{ background: "radial-gradient(ellipse at 10% 50%, oklch(0.72 0.17 160), transparent 60%), radial-gradient(ellipse at 90% 50%, oklch(0.62 0.15 260), transparent 60%)" }}
              />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Label + Amount */}
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
                  >
                    <Wallet size={22} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Total Receivable Till Date
                    </p>
                    <p className="mt-0.5 text-3xl font-extrabold tracking-tight text-foreground">
                      ₹8,425
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      All-time cumulative balance · unaffected by range filters
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden h-10 w-px bg-border sm:block self-center" />

                {/* Right: Info pillars */}
                <div className="flex items-center gap-6 sm:shrink-0">
                  <div className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Last Payout</p>
                    <p className="mt-1 text-sm font-bold text-foreground">24 Mar 2026</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">₹3,200 disbursed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                        className={`flex w-full items-center px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer ${
                          p === preset ? "font-bold text-brand bg-secondary/60" : "text-foreground"
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

          {/* Compact Period Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard icon={Tag} label="Total Sales" value="₹0.00" />
            <StatCard icon={Clock} label="Total Royalty Amount" value="₹0.00" />
          </div>

          {/* Ledger */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
              <div>
                <h2 className="text-base font-semibold">Ledger Report</h2>
                <p className="text-xs text-muted-foreground">{rangeLabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLedgerOpen((v) => !v)}
                    className="flex h-11 w-full items-center justify-between gap-6 rounded-lg border border-border bg-card px-3 text-sm font-medium sm:w-60 cursor-pointer"
                  >
                    <span className="truncate">{ledgerType}</span>
                    <ChevronDown size={15} className="text-muted-foreground shrink-0" />
                  </button>
                  {ledgerOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
                      {LEDGER_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setLedgerType(t);
                            setLedgerOpen(false);
                          }}
                          className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary cursor-pointer ${
                            t === ledgerType ? "font-semibold text-foreground bg-secondary/50" : "text-muted-foreground"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setExportOpen((v) => !v)}
                    className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                  >
                    <Upload size={15} />
                    <span>Export</span>
                    <ChevronDown size={14} />
                  </button>
                  {exportOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setExportOpen(false);
                          toast.success("Downloading Publisher Margin Report (PDF)...");
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
                          toast.success("Downloading Publisher Margin Report (Excel)...");
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

            {/* Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-4 pl-6 pr-4 font-semibold">Trans. Date</th>
                    <th className="py-4 pr-4 font-semibold">Trans. Type</th>
                    <th className="py-4 pr-4 font-semibold">Trans. Ref</th>
                    <th className="py-4 pr-4 font-semibold">Margin</th>
                    <th className="py-4 pr-4 font-semibold">Payments Received</th>
                    <th className="py-4 pr-4 font-semibold">Balance</th>
                    <th className="py-4 pr-4 font-semibold">Trans. Mode</th>
                    <th className="py-4 pr-6" />
                  </tr>
                </thead>
                <tbody>
                  {opening && (
                    <tr className="border-b border-border/60 bg-secondary/20 font-medium">
                      <td className="py-4 pl-6 pr-4">{opening.date}</td>
                      <td className="py-4 pr-4">{opening.type}</td>
                      <td className="py-4 pr-4 text-muted-foreground">{opening.ref}</td>
                      <td className="py-4 pr-4 text-muted-foreground">
                        {formatINR(opening.margin)}
                      </td>
                      <td className="py-4 pr-4 text-muted-foreground">
                        {formatINR(opening.received)}
                      </td>
                      <td className="py-4 pr-4">{formatINR(opening.balance)}</td>
                      <td className="py-4 pr-4 text-muted-foreground">{opening.mode}</td>
                      <td className="py-4 pr-6" />
                    </tr>
                  )}
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-14 text-center text-sm text-muted-foreground">
                        No matching results found. Try changing the filters or date range.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((r) => {
                      const isClickable = r.type === "Sale / Rental" && !!TXN_DETAILS[r.ref];
                      const isPayment =
                        r.type === "Payment - Base Amount" && !!PAYMENT_DETAILS[r.ref];
                      const isActionable = isClickable || isPayment;
                      return (
                        <tr
                          key={r.id}
                          onClick={() => {
                            if (isClickable) setSelectedTxn(TXN_DETAILS[r.ref]);
                            else if (isPayment) setSelectedPayment(PAYMENT_DETAILS[r.ref]);
                          }}
                          className={`group border-b border-border/60 transition-colors hover:bg-secondary/40 ${
                            isActionable ? "cursor-pointer" : ""
                          }`}
                        >
                          <td className="py-4 pl-6 pr-4">{r.date}</td>
                          <td className="py-4 pr-4">{r.type}</td>
                          <td className="py-4 pr-4 text-muted-foreground">{r.ref}</td>
                          <td className="py-4 pr-4">{formatINR(r.margin)}</td>
                          <td className="py-4 pr-4">{formatINR(r.received)}</td>
                          <td className="py-4 pr-4 font-medium">{formatINR(r.balance)}</td>
                          <td className="py-4 pr-4 text-muted-foreground">{r.mode}</td>
                          <td className="py-4 pr-6 text-right">
                            {isActionable && (
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                                <ChevronRight size={16} />
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                  {closing && (
                    <tr className="bg-secondary/20 font-medium">
                      <td className="py-4 pl-6 pr-4">{closing.date}</td>
                      <td className="py-4 pr-4">{closing.type}</td>
                      <td className="py-4 pr-4 text-muted-foreground">{closing.ref}</td>
                      <td className="py-4 pr-4 text-muted-foreground">
                        {formatINR(closing.margin)}
                      </td>
                      <td className="py-4 pr-4 text-muted-foreground">
                        {formatINR(closing.received)}
                      </td>
                      <td className="py-4 pr-4">{formatINR(closing.balance)}</td>
                      <td className="py-4 pr-4 text-muted-foreground">{closing.mode}</td>
                      <td className="py-4 pr-6" />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <ul className="divide-y divide-border/60 md:hidden">
              {opening && (
                <li className="flex items-center justify-between bg-secondary/20 p-4 text-sm font-medium">
                  <span>{opening.type}</span>
                  <span>{formatINR(opening.balance)}</span>
                </li>
              )}
              {pageItems.length === 0 && (
                <li className="py-10 text-center text-sm text-muted-foreground">
                  No matching results found.
                </li>
              )}
              {pageItems.map((r) => (
                <li key={r.id} className="space-y-1 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.type}</span>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Ref: {r.ref}</span>
                    <span>{r.mode}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span>Margin: {formatINR(r.margin)}</span>
                    <span>Received: {formatINR(r.received)}</span>
                    <span className="font-semibold">{formatINR(r.balance)}</span>
                  </div>
                </li>
              ))}
              {closing && (
                <li className="flex items-center justify-between bg-secondary/20 p-4 text-sm font-medium">
                  <span>{closing.type}</span>
                  <span>{formatINR(closing.balance)}</span>
                </li>
              )}
            </ul>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
              <p className="text-xs text-muted-foreground">
                {dataRows.length === 0
                  ? "0 transactions"
                  : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, dataRows.length)} of ${dataRows.length}`}
              </p>
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <button
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
      )}
    </AppShell>
  );
}
