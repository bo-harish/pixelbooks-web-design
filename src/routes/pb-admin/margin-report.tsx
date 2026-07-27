import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  BookMarked,
  CreditCard,
  Clock,
  Landmark,
  Building2,
  Users,
  Upload,
  ScrollText,
  Table,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/margin-report")({
  head: () => ({
    meta: [
      { title: "Margin / Royalty Report — PixelBooks Admin" },
      {
        name: "description",
        content: "Track sales, royalty, receivables and ledger transactions.",
      },
    ],
  }),
  component: AdminMarginReportPage,
});

export type EntityType = "Publisher" | "Author";

export type RoyaltyRow = {
  id: string;
  name: string;
  type: EntityType;
  totalSales: number;
  commissionRate: number; // e.g. 15, 20, 16
  royaltyAmount: number;
  dueAmount: number;
  avatarLetter: string;
  openingBalance?: number;
  closingBalance?: number;
  tdsBreakdown?: string;
};

// Seed dataset matching screenshot exact values
const initialReportData: RoyaltyRow[] = [
  {
    id: "r-1",
    name: "Werley Nortreus",
    type: "Author",
    totalSales: 13536.18,
    commissionRate: 15,
    royaltyAmount: 1962.0,
    dueAmount: 1962.0,
    avatarLetter: "WN",
    openingBalance: 0.0,
    closingBalance: 1962.0,
    tdsBreakdown: "(1890.00 + 72.00 TDS)",
  },
  {
    id: "r-2",
    name: "RJ Authors",
    type: "Author",
    totalSales: 7300.59,
    commissionRate: 20,
    royaltyAmount: 359.64,
    dueAmount: 2293.47,
    avatarLetter: "RJ",
    openingBalance: 2053.77,
    closingBalance: 2293.47,
    tdsBreakdown: "(2219.61 + 73.86 TDS)",
  },
  {
    id: "r-3",
    name: "Cambridge University Press",
    type: "Publisher",
    totalSales: 5536.02,
    commissionRate: 16,
    royaltyAmount: 816.22,
    dueAmount: 8189.11,
    avatarLetter: "CU",
    openingBalance: 7372.89,
    closingBalance: 8189.11,
    tdsBreakdown: "(7920.00 + 269.11 TDS)",
  },
  {
    id: "r-4",
    name: "AQW",
    type: "Publisher",
    totalSales: 4200.82,
    commissionRate: 16,
    royaltyAmount: 600.12,
    dueAmount: 749.97,
    avatarLetter: "AQ",
    openingBalance: 149.85,
    closingBalance: 749.97,
    tdsBreakdown: "(720.00 + 29.97 TDS)",
  },
  {
    id: "r-5",
    name: "Cengage & Pearson",
    type: "Publisher",
    totalSales: 3985.83,
    commissionRate: 16,
    royaltyAmount: 569.4,
    dueAmount: 773.89,
    avatarLetter: "CP",
    openingBalance: 204.49,
    closingBalance: 773.89,
    tdsBreakdown: "(750.00 + 23.89 TDS)",
  },
  {
    id: "r-6",
    name: "Meadows Publishers",
    type: "Publisher",
    totalSales: 3713.78,
    commissionRate: 16,
    royaltyAmount: 524.55,
    dueAmount: 102441.5,
    avatarLetter: "MP",
    openingBalance: 101916.95,
    closingBalance: 102441.5,
    tdsBreakdown: "(98900.00 + 3541.50 TDS)",
  },
  {
    id: "r-7",
    name: "Veena",
    type: "Publisher",
    totalSales: 3619.5,
    commissionRate: 16,
    royaltyAmount: 487.5,
    dueAmount: 33709.57,
    avatarLetter: "VN",
    openingBalance: 33222.07,
    closingBalance: 33709.57,
    tdsBreakdown: "(32550.00 + 1159.57 TDS)",
  },
  {
    id: "r-8",
    name: "APK Publishers",
    type: "Publisher",
    totalSales: 2800.0,
    commissionRate: 16,
    royaltyAmount: 375.0,
    dueAmount: 7194.0,
    avatarLetter: "AP",
    openingBalance: 6819.0,
    closingBalance: 7194.0,
    tdsBreakdown: "(6950.00 + 244.00 TDS)",
  },
  {
    id: "r-9",
    name: "Louisa May Alcott",
    type: "Author",
    totalSales: 2400.0,
    commissionRate: 20,
    royaltyAmount: 240.0,
    dueAmount: 920.13,
    avatarLetter: "LA",
    openingBalance: 680.13,
    closingBalance: 920.13,
    tdsBreakdown: "(880.00 + 40.13 TDS)",
  },
  {
    id: "r-10",
    name: "Aisha Publishers",
    type: "Publisher",
    totalSales: 1680.0,
    commissionRate: 16,
    royaltyAmount: 225.0,
    dueAmount: 3260.76,
    avatarLetter: "AI",
    openingBalance: 3035.76,
    closingBalance: 3260.76,
    tdsBreakdown: "(3150.00 + 110.76 TDS)",
  },
];

type LedgerRowItem = {
  id: string;
  date: string;
  type: string;
  ref: string;
  debit: number | null;
  credit: number | null;
  balance: number;
  mode: string;
  items?: {
    title: string;
    saleDate: string;
    isbn: string;
    type: string;
    unitPrice: number;
    qty: number;
    netAmount: number;
    marginPayable: number;
  }[];
};

const sampleEntityLedgers: Record<string, LedgerRowItem[]> = {
  "r-2": [
    {
      id: "leg-r2-1",
      date: "13 Jul 2026",
      type: "Sale / Rental",
      ref: "Inv_0002380",
      debit: null,
      credit: 239.79,
      balance: 2293.56,
      mode: "UPI",
      items: [
        {
          title: "Monsoon Reads Collection Vol 1",
          saleDate: "13 Jul 2026",
          isbn: "978-3-16-148410-0",
          type: "Sale",
          unitPrice: 1198.95,
          qty: 1,
          netAmount: 1198.95,
          marginPayable: 239.79,
        },
      ],
    },
    {
      id: "leg-r2-2",
      date: "14 Jul 2026",
      type: "Sale / Rental",
      ref: "Inv_0002385",
      debit: null,
      credit: 119.85,
      balance: 2293.47,
      mode: "UPI",
      items: [
        {
          title: "Love Poems & Dreams",
          saleDate: "14 Jul 2026",
          isbn: "978-0-12-345678-9",
          type: "Rental",
          unitPrice: 599.25,
          qty: 1,
          netAmount: 599.25,
          marginPayable: 119.85,
        },
      ],
    },
  ],
  "r-1": [
    {
      id: "leg-r1-1",
      date: "10 Jul 2026",
      type: "Sale / Rental",
      ref: "Inv_0001833",
      debit: null,
      credit: 1962.0,
      balance: 1962.0,
      mode: "Wire Transfer",
      items: [
        {
          title: "Destination Unknown & Untold Stories",
          saleDate: "10 Jul 2026",
          isbn: "978-1-56619-909-4",
          type: "Sale",
          unitPrice: 13536.18,
          qty: 1,
          netAmount: 13536.18,
          marginPayable: 1962.0,
        },
      ],
    },
  ],
};

type BankAccountDetail = {
  holderName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  status: string;
};

const sampleBankAccounts: Record<string, BankAccountDetail> = {
  "r-2": {
    holderName: "Anu",
    accountNumber: "12345678",
    ifsc: "SBIN0001489",
    bankName: "STATE BANK OF INDIA",
    status: "Active Bank Account",
  },
  "r-1": {
    holderName: "Werley Nortreus",
    accountNumber: "9876543210",
    ifsc: "HDFC0001234",
    bankName: "HDFC BANK",
    status: "Active Bank Account",
  },
  "r-3": {
    holderName: "Cambridge University Press India Pvt Ltd",
    accountNumber: "4567890123",
    ifsc: "HSBC0400005",
    bankName: "HSBC BANK",
    status: "Active Bank Account",
  },
};

type PaymentHistoryRow = {
  id: string;
  date: string;
  type: string;
  ref: string;
  amount: number;
  balance: number;
  mode: string;
};

const initialPaymentHistories: Record<string, PaymentHistoryRow[]> = {
  "r-2": [
    {
      id: "ph-r2-1",
      date: "24 Apr 2026",
      type: "Royalty Payout",
      ref: "PMT-983456",
      amount: 1933.83,
      balance: 0.0,
      mode: "UPI",
    },
    {
      id: "ph-r2-2",
      date: "15 May 2026",
      type: "Royalty Payout",
      ref: "PMT-984102",
      amount: 750.0,
      balance: 0.0,
      mode: "Bank Transfer",
    },
  ],
  "r-1": [
    {
      id: "ph-r1-1",
      date: "20 May 2026",
      type: "Royalty Payout",
      ref: "PMT-871200",
      amount: 3500.0,
      balance: 0.0,
      mode: "Wire Transfer",
    },
  ],
};

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
const drCrOptions = ["Dr & Cr", "Debit (Dr)", "Credit (Cr)"] as const;

function StatCard({
  icon: Icon,
  label,
  value,
  pill,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  pill?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
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
        {pill && (
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
            style={{
              backgroundColor: `color-mix(in oklch, var(--success) 12%, transparent)`,
              color: "var(--success)",
            }}
          >
            {pill}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

const PAGE_SIZE = 8;

function AdminMarginReportPage() {
  const [data, setData] = useState<RoyaltyRow[]>(initialReportData);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<(typeof filterTypeOptions)[number]>("Publishers & Authors");
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [presetFilter, setPresetFilter] = useState<(typeof presetOptions)[number]>("MTD");
  const [presetFilterOpen, setPresetFilterOpen] = useState(false);

  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-22");
  const [exportOpen, setExportOpen] = useState(false);
  const [page, setPage] = useState(1);

  const handlePresetSelect = (opt: (typeof presetOptions)[number]) => {
    setPresetFilter(opt);
    setPresetFilterOpen(false);
    setPage(1);

    if (opt === "MTD") {
      setStartDate("2026-07-01");
      setEndDate("2026-07-22");
    } else if (opt === "QTD") {
      setStartDate("2026-07-01");
      setEndDate("2026-07-22");
    } else if (opt === "YTD") {
      setStartDate("2026-01-01");
      setEndDate("2026-07-22");
    } else if (opt === "Current FY") {
      setStartDate("2026-04-01");
      setEndDate("2027-03-31");
    } else if (opt === "Last FY") {
      setStartDate("2025-04-01");
      setEndDate("2026-03-31");
    } else if (opt === "Last 30 days") {
      setStartDate("2026-06-22");
      setEndDate("2026-07-22");
    }
  };

  // Detailed Entity Ledger View state
  const [activeLedgerEntity, setActiveLedgerEntity] = useState<RoyaltyRow | null>(null);
  const [drCrFilter, setDrCrFilter] = useState<(typeof drCrOptions)[number]>("Dr & Cr");
  const [drCrFilterOpen, setDrCrFilterOpen] = useState(false);

  // Dedicated Add Payment Page View state
  const [activeAddPaymentEntity, setActiveAddPaymentEntity] = useState<RoyaltyRow | null>(null);
  const [paymentHistories, setPaymentHistories] = useState<Record<string, PaymentHistoryRow[]>>(initialPaymentHistories);

  // Add Payment Form inputs
  const [formPaymentType, setFormPaymentType] = useState("Royalty Payout");
  const [formTxnMode, setFormTxnMode] = useState("UPI");
  const [formTxnDate, setFormTxnDate] = useState("2026-07-22");
  const [formTxnRef, setFormTxnRef] = useState("");
  const [formAmountPaid, setFormAmountPaid] = useState("");

  // Selected Invoice Detail modal state
  const [selectedInvoice, setSelectedInvoice] = useState<LedgerRowItem | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Filtered data calculation for main page
  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (typeFilter === "Publishers" && row.type !== "Publisher") return false;
      if (typeFilter === "Authors" && row.type !== "Author") return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        return row.name.toLowerCase().includes(q) || row.type.toLowerCase().includes(q);
      }
      return true;
    });
  }, [data, typeFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const handleOpenAddPaymentPage = (row: RoyaltyRow) => {
    setActiveAddPaymentEntity(row);
    setFormAmountPaid(row.dueAmount.toString());
    setFormTxnRef(`PMT-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleSubmitAddPaymentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAddPaymentEntity) return;

    const amt = parseFloat(formAmountPaid) || 0;
    if (amt <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    const refNo = formTxnRef.trim() || `PMT-${Math.floor(100000 + Math.random() * 900000)}`;

    // Update entity due amount in data state
    setData((prev) =>
      prev.map((r) =>
        r.id === activeAddPaymentEntity.id
          ? { ...r, dueAmount: Math.max(0, r.dueAmount - amt) }
          : r
      )
    );

    // Append new payment item to history for this entity
    const newHistoryRow: PaymentHistoryRow = {
      id: `ph-new-${Date.now()}`,
      date: formTxnDate ? new Date(formTxnDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "22 Jul 2026",
      type: formPaymentType,
      ref: refNo,
      amount: amt,
      balance: 0.0,
      mode: formTxnMode,
    };

    setPaymentHistories((prev) => ({
      ...prev,
      [activeAddPaymentEntity.id]: [newHistoryRow, ...(prev[activeAddPaymentEntity.id] || [])],
    }));

    // Update local active entity due amount
    setActiveAddPaymentEntity((prev) =>
      prev ? { ...prev, dueAmount: Math.max(0, prev.dueAmount - amt) } : null
    );

    toast.success(`Payment of ₹${amt.toLocaleString("en-IN")} recorded for ${activeAddPaymentEntity.name}!`);
  };

  const handleOpenInvoiceDetail = (item: LedgerRowItem) => {
    setSelectedInvoice(item);
    setInvoiceModalOpen(true);
  };

  // Render 1: Full "Royalty Report - Add Payment" Page View
  if (activeAddPaymentEntity) {
    const bank = sampleBankAccounts[activeAddPaymentEntity.id] || {
      holderName: activeAddPaymentEntity.name,
      accountNumber: "12345678",
      ifsc: "SBIN0001489",
      bankName: "STATE BANK OF INDIA",
      status: "Active Bank Account",
    };

    const historyRows = paymentHistories[activeAddPaymentEntity.id] || [];

    const baseAmount = (activeAddPaymentEntity.dueAmount * 0.968).toFixed(2);
    const tdsAmount = (activeAddPaymentEntity.dueAmount * 0.032).toFixed(2);

    const isPublisher = activeAddPaymentEntity.type === "Publisher";
    const pageTitle = isPublisher ? "Margin Report - Add Payment" : "Royalty Report - Add Payment";
    const pageSubtitle = isPublisher
      ? "Record payout settlement transactions & view account details for publisher."
      : "Record payout settlement transactions & view account details for author.";

    return (
      <AppShell title={pageTitle} subtitle={pageSubtitle}>
        <div className="space-y-6 p-4 md:p-8">
          {/* Top Entity Header Card */}
          <div className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-4 md:p-5 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveAddPaymentEntity(null)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
              title="Back"
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
                {activeAddPaymentEntity.avatarLetter}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground leading-snug">
                    {activeAddPaymentEntity.name}
                  </h2>
                  <span
                    className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      backgroundColor: "color-mix(in oklab, var(--brand) 10%, transparent)",
                      color: "var(--brand)",
                    }}
                  >
                    {activeAddPaymentEntity.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isPublisher ? "Add Margin Payment" : "Add Royalty Payment"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Details & Due Amount Cards (2 Grid Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Card: Account Details */}
            <div className="rounded-xl border border-border bg-card p-5 relative shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted-foreground">Account Details</span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/70">
                  <CheckCircle2 size={13} />
                  {bank.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-foreground">{bank.holderName}</p>
                <p className="text-xs text-muted-foreground font-mono">{bank.accountNumber}</p>
                <p className="text-xs text-muted-foreground font-mono">{bank.ifsc}</p>
                <p className="text-xs text-muted-foreground uppercase font-semibold">{bank.bankName}</p>
              </div>
            </div>

            {/* Right Card: Due Amount */}
            <div className="rounded-xl border border-border bg-card p-5 relative shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/70">
                  <XCircle size={13} />
                  Pending
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Due Amount</p>
                <p className="text-3xl font-bold tracking-tight text-foreground mt-1">
                  ₹{activeAddPaymentEntity.dueAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  (Base Amount - {baseAmount} + TDS - {tdsAmount})
                </p>
              </div>
            </div>
          </div>

          {/* Add Payment Form Controls Row */}
          <form onSubmit={handleSubmitAddPaymentForm} className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {/* Payment Type */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Payment Type<span className="text-rose-500">*</span>
                </label>
                <select
                  value={formPaymentType}
                  onChange={(e) => setFormPaymentType(e.target.value)}
                  className="w-full h-11 px-3 bg-card border border-border rounded-lg text-sm outline-none text-foreground"
                >
                  <option value="Royalty Payout">Royalty Payout</option>
                  <option value="Advance Settlement">Advance Settlement</option>
                  <option value="Bonus Payout">Bonus Payout</option>
                </select>
              </div>

              {/* Transaction Mode */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Transaction Mode<span className="text-rose-500">*</span>
                </label>
                <select
                  value={formTxnMode}
                  onChange={(e) => setFormTxnMode(e.target.value)}
                  className="w-full h-11 px-3 bg-card border border-border rounded-lg text-sm outline-none text-foreground"
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              {/* Transaction Date */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Transaction Date<span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formTxnDate}
                  onChange={(e) => setFormTxnDate(e.target.value)}
                  className="w-full h-11 px-3 bg-card border border-border rounded-lg text-sm outline-none text-foreground"
                />
              </div>

              {/* Transaction Ref */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Transaction Ref#<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Reference Number"
                  value={formTxnRef}
                  onChange={(e) => setFormTxnRef(e.target.value)}
                  className="w-full h-11 px-3 bg-card border border-border rounded-lg text-sm outline-none text-foreground font-mono placeholder:font-sans"
                />
              </div>

              {/* Amount Paid */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Amount Paid<span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter Amount"
                  value={formAmountPaid}
                  onChange={(e) => setFormAmountPaid(e.target.value)}
                  className="w-full h-11 px-3 bg-card border border-border rounded-lg text-sm font-semibold outline-none text-foreground"
                />
              </div>
            </div>

            {/* Action Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="h-11 px-6 rounded-lg text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                Add Payment
              </button>
            </div>
          </form>

          {/* Payment History Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-base font-bold text-foreground">Payment History</h3>
              <div className="flex items-center gap-2">
                {/* MTD Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setPresetFilterOpen((v) => !v)}
                    className="flex h-11 w-full sm:w-44 items-center justify-between gap-6 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer"
                  >
                    <span>{presetFilter}</span>
                    <ChevronDown size={15} className="text-muted-foreground shrink-0" />
                  </button>
                  {presetFilterOpen && (
                    <div className="absolute right-0 z-30 mt-2 w-full sm:w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-44">
                      {presetOptions.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setPresetFilter(p);
                            setPresetFilterOpen(false);
                          }}
                          className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary cursor-pointer ${
                            p === presetFilter ? "font-semibold text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <label className="relative flex h-10 items-center rounded-lg border border-border bg-card px-3">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent text-xs outline-none"
                  />
                </label>
                <label className="relative flex h-10 items-center rounded-lg border border-border bg-card px-3">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent text-xs outline-none"
                  />
                </label>
              </div>
            </div>

            {/* Payment History Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="py-4 pl-6 pr-4 font-semibold">Trans. Date</th>
                      <th className="py-4 pr-4 font-semibold">Trans. Type</th>
                      <th className="py-4 pr-4 font-semibold">Trans. Ref</th>
                      <th className="py-4 pr-4 font-semibold">Credit</th>
                      <th className="py-4 pr-4 font-semibold">Balance</th>
                      <th className="py-4 pr-6 font-semibold">Trans. Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {historyRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                          No payment history available for the selected period.
                        </td>
                      </tr>
                    ) : (
                      historyRows.map((row) => (
                        <tr key={row.id} className="hover:bg-secondary/50 transition-colors">
                          <td className="py-4 pl-6 pr-4 text-foreground whitespace-nowrap">{row.date}</td>
                          <td className="py-4 pr-4 font-medium text-foreground">{row.type}</td>
                          <td className="py-4 pr-4 font-mono text-xs text-foreground font-semibold">
                            {row.ref}
                          </td>
                          <td className="py-4 pr-4 font-bold text-foreground">
                            ₹{row.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 pr-4 text-muted-foreground">
                            ₹{row.balance.toFixed(2)}
                          </td>
                          <td className="py-4 pr-6 text-foreground">{row.mode}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // Render 2: Full "Royalty Report - Ledger" Page View
  if (activeLedgerEntity) {
    const ledgerRows = sampleEntityLedgers[activeLedgerEntity.id] || [
      {
        id: `leg-gen-1`,
        date: "13 Jul 2026",
        type: "Sale / Rental",
        ref: "Inv_0002380",
        debit: null,
        credit: activeLedgerEntity.royaltyAmount,
        balance: activeLedgerEntity.dueAmount,
        mode: "UPI",
        items: [
          {
            title: "Selected Catalog Titles & Ebooks",
            saleDate: "13 Jul 2026",
            isbn: "978-0-10-987654-3",
            type: "Sale",
            unitPrice: activeLedgerEntity.totalSales,
            qty: 1,
            netAmount: activeLedgerEntity.totalSales,
            marginPayable: activeLedgerEntity.royaltyAmount,
          },
        ],
      },
    ];

    const openingBal = activeLedgerEntity.openingBalance ?? 0;
    const closingBal = activeLedgerEntity.dueAmount;
    const tdsText = activeLedgerEntity.tdsBreakdown || `(${(closingBal * 0.95).toFixed(2)} + ${(closingBal * 0.05).toFixed(2)} TDS)`;

    const isPublisherLedger = activeLedgerEntity.type === "Publisher";
    const ledgerTitle = isPublisherLedger ? "Margin Report - Ledger" : "Royalty Report - Ledger";
    const ledgerSubtitle = isPublisherLedger
      ? "Inspect debit/credit ledger history and sales margin breakdown for publisher."
      : "Inspect debit/credit ledger history and sales royalty breakdown for author.";

    return (
      <AppShell title={ledgerTitle} subtitle={ledgerSubtitle}>
        <div className="space-y-6 p-4 md:p-8">
          {/* Top Entity Header Card */}
          <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-xs space-y-4">
            {/* Row 1: Back Button + Avatar + Name + Type Tag */}
            <div className="flex items-center gap-3.5 border-b border-border/60 pb-3.5">
              <button
                type="button"
                onClick={() => setActiveLedgerEntity(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
                title="Back to Margin Report"
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
                  {activeLedgerEntity.avatarLetter}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground leading-snug">
                      {activeLedgerEntity.name}
                    </h2>
                    <span
                      className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                      style={{
                        backgroundColor: "color-mix(in oklab, var(--brand) 10%, transparent)",
                        color: "var(--brand)",
                      }}
                    >
                      {activeLedgerEntity.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ledger Report
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2: Filters on Left, Actions on Right */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Left: Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Dr & Cr Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDrCrFilterOpen((v) => !v)}
                    className="flex h-11 w-full sm:w-40 items-center justify-between gap-6 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer"
                  >
                    <span>{drCrFilter}</span>
                    <ChevronDown size={15} className="text-muted-foreground shrink-0" />
                  </button>
                  {drCrFilterOpen && (
                    <div className="absolute right-0 z-30 mt-2 w-full sm:w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-40">
                      {drCrOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setDrCrFilter(opt);
                            setDrCrFilterOpen(false);
                          }}
                          className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary cursor-pointer ${
                            opt === drCrFilter ? "font-semibold text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* MTD Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setPresetFilterOpen((v) => !v)}
                    className="flex h-11 w-full sm:w-44 items-center justify-between gap-6 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer"
                  >
                    <span>{presetFilter}</span>
                    <ChevronDown size={15} className="text-muted-foreground shrink-0" />
                  </button>
                  {presetFilterOpen && (
                    <div className="absolute right-0 z-30 mt-2 w-full sm:w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-44">
                      {presetOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setPresetFilter(opt);
                            setPresetFilterOpen(false);
                          }}
                          className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary cursor-pointer ${
                            opt === presetFilter ? "font-semibold text-foreground" : "text-muted-foreground"
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
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </label>
                  <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </label>
                </div>
              </div>

              {/* Right: Export & Add Payment Buttons */}
              <div className="flex items-center gap-2.5">
                {/* Export Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setExportOpen((v) => !v)}
                    className="flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                  >
                    <Upload size={15} />
                    <span>Export</span>
                    <ChevronDown size={14} />
                  </button>
                  {exportOpen && (
                    <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setExportOpen(false);
                          toast.success("Downloading Ledger Report (PDF)...");
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
                          toast.success("Downloading Ledger Report (Excel)...");
                        }}
                        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary cursor-pointer"
                      >
                        <Table size={15} className="text-muted-foreground" />
                        <span>Export Excel</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Add Payment Button */}
                <button
                  type="button"
                  onClick={() => handleOpenAddPaymentPage(activeLedgerEntity)}
                  className="flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  <span>Add Payment</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ledger Table Container */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-4 pl-6 pr-4 font-semibold">Trans. Date</th>
                    <th className="py-4 pr-4 font-semibold">Trans. Type</th>
                    <th className="py-4 pr-4 font-semibold">Trans. Ref</th>
                    <th className="py-4 pr-4 font-semibold">Debit</th>
                    <th className="py-4 pr-4 font-semibold">Credit</th>
                    <th className="py-4 pr-4 font-semibold">Balance</th>
                    <th className="py-4 pr-6 font-semibold">Trans. Mode</th>
                    <th className="py-4 pr-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {/* Opening Balance Row */}
                  <tr className="border-b border-border/60 bg-secondary/20">
                    <td className="py-4 pl-6 pr-4 text-foreground">01 Jul 2026</td>
                    <td className="py-4 pr-4 font-semibold text-foreground">Opening Balance</td>
                    <td className="py-4 pr-4 text-muted-foreground">-</td>
                    <td className="py-4 pr-4 text-muted-foreground">-</td>
                    <td className="py-4 pr-4 text-muted-foreground">-</td>
                    <td className="py-4 pr-4 font-bold text-foreground">
                      ₹{openingBal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 pr-6 text-muted-foreground">-</td>
                    <td className="py-4 pr-4"></td>
                  </tr>

                  {/* Transaction Rows */}
                  {ledgerRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50"
                    >
                      <td className="py-4 pl-6 pr-4 text-foreground whitespace-nowrap">{row.date}</td>
                      <td className="py-4 pr-4 font-medium text-foreground">{row.type}</td>
                      <td className="py-4 pr-4">
                        <button
                          type="button"
                          onClick={() => handleOpenInvoiceDetail(row)}
                          className="font-mono text-xs font-semibold text-foreground hover:underline hover:text-brand cursor-pointer"
                        >
                          {row.ref}
                        </button>
                      </td>
                      <td className="py-4 pr-4 text-muted-foreground">
                        {row.debit !== null ? `₹${row.debit.toFixed(2)}` : "-"}
                      </td>
                      <td className="py-4 pr-4 font-medium text-foreground">
                        {row.credit !== null ? `₹${row.credit.toFixed(2)}` : "-"}
                      </td>
                      <td className="py-4 pr-4 font-bold text-foreground">
                        ₹{row.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 pr-6 text-foreground">{row.mode}</td>
                      <td className="py-4 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenInvoiceDetail(row)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {ledgerRows.length} from {ledgerRows.length} results
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground disabled:opacity-40"
                >
                  «&nbsp;Previous
                </button>
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold"
                  style={{
                    backgroundColor: "color-mix(in oklab, var(--brand) 12%, transparent)",
                    color: "var(--brand)",
                  }}
                >
                  1
                </button>
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground disabled:opacity-40"
                >
                  Next&nbsp;»
                </button>
              </div>
            </div>
          </div>

          {/* Closing Balance Card matching screenshot */}
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">22 Jul 2026</span>
              <span className="text-base font-bold text-foreground">Closing Balance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-foreground">
                ₹{closingBal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-normal text-muted-foreground font-mono">
                {tdsText}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Detail Dialog Modal */}
        <Dialog open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
          <DialogContent className="max-w-3xl bg-card border border-border p-6 rounded-xl text-foreground">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold flex items-center justify-between">
                <span>Trans. Ref: {selectedInvoice?.ref}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Transaction Date: {selectedInvoice?.date} • Mode: {selectedInvoice?.mode}
              </DialogDescription>
            </DialogHeader>

            {selectedInvoice && (
              <div className="space-y-4 pt-2">
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border text-left font-semibold uppercase tracking-wider text-muted-foreground">
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Sale Date</th>
                        <th className="py-3 px-4">ISBN</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4 text-right">Unit Price</th>
                        <th className="py-3 px-4 text-center">Qty</th>
                        <th className="py-3 px-4 text-right">Net Amount</th>
                        <th className="py-3 px-4 text-right">Margin Payable</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {(selectedInvoice.items || [
                        {
                          title: "Monsoon Reads Collection Vol 1",
                          saleDate: selectedInvoice.date,
                          isbn: "978-3-16-148410-0",
                          type: "Sale",
                          unitPrice: 1198.95,
                          qty: 1,
                          netAmount: 1198.95,
                          marginPayable: selectedInvoice.credit || 239.79,
                        },
                      ]).map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-4 font-medium text-foreground">{item.title}</td>
                          <td className="py-3 px-4 text-muted-foreground">{item.saleDate}</td>
                          <td className="py-3 px-4 font-mono text-muted-foreground">{item.isbn}</td>
                          <td className="py-3 px-4">{item.type}</td>
                          <td className="py-3 px-4 text-right">₹{item.unitPrice.toFixed(2)}</td>
                          <td className="py-3 px-4 text-center">{item.qty}</td>
                          <td className="py-3 px-4 text-right font-medium">₹{item.netAmount.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-bold text-foreground">
                            ₹{item.marginPayable.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs font-semibold text-muted-foreground">Total Royalty Accrued</span>
                  <span className="text-sm font-bold text-foreground">
                    ₹{(selectedInvoice.credit || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </AppShell>
    );
  }

  // Render Main Margin/Royalty Report View
  return (
    <AppShell title="Margin / Royalty Report" subtitle="Track sales, royalty and payments of publishers & authors.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Top Highlight Banner: Total Outstanding Payable (Due) Till Date */}
        <div className="rounded-xl border border-amber-200/80 bg-amber-500/10 dark:bg-amber-950/30 dark:border-amber-800/40 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400">
              <Landmark size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Total Payable (Due) Till Date
                </h2>
                <span className="inline-flex items-center rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                  All-Time Cumulative Balance
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-0.5">
                ₹425,668.27
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Cumulative net unpaid balance across all publishers & authors. Unaffected by date range filters.
              </p>
            </div>
          </div>
        </div>

        {/* Top Header Row with Date Range & Entity Filter Controls */}
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            icon={Clock}
            label="Total Royalty Amount"
            value="₹7,043.83"
          />
          <StatCard
            icon={Building2}
            label="Total Publisher"
            value="165"
          />
          <StatCard
            icon={Users}
            label="Total Author"
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by author or publisher"
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
                  className="flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  <Upload size={15} />
                  <span>Export</span>
                  <ChevronDown size={14} />
                </button>
                {exportOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setExportOpen(false);
                        toast.success("Downloading Margin/Royalty report (PDF)...");
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
                        toast.success("Downloading Margin/Royalty report (Excel)...");
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
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Publisher / Author</th>
                  <th className="py-4 pr-4 font-semibold">Total Sales</th>
                  <th className="py-4 pr-4 font-semibold text-center">Commission %</th>
                  <th className="py-4 pr-4 font-semibold">Royalty Amount</th>
                  <th className="py-4 pr-4 font-semibold">Due Amount (Till Date)</th>
                  <th className="py-4 pr-4 font-semibold text-center">Payment</th>
                  <th className="py-4 pr-6 font-semibold text-center">Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                      No records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50"
                    >
                      {/* Publisher / Author Name & Type */}
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
                      <td className="py-4 pr-4 font-medium text-foreground whitespace-nowrap">
                        ₹{row.totalSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Commission % */}
                      <td className="py-4 pr-4 text-center font-medium text-foreground">
                        {row.commissionRate}%
                      </td>

                      {/* Royalty Amount */}
                      <td className="py-4 pr-4 font-medium text-foreground whitespace-nowrap">
                        ₹{row.royaltyAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Due Amount (Till Date) */}
                      <td className="py-4 pr-4 font-medium text-foreground whitespace-nowrap">
                        ₹{row.dueAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Payment Action Button */}
                      <td className="py-4 pr-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenAddPaymentPage(row)}
                          className="h-9 px-4 rounded-lg text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                          style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                        >
                          Add Payment
                        </button>
                      </td>

                      {/* Ledger Button */}
                      <td className="py-4 pr-6 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveLedgerEntity(row)}
                          className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                        >
                          <span>Ledger</span>
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
                className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer"
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
                className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer"
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
