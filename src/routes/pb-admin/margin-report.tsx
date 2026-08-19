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
import { BookCover } from "@/components/ui/book-cover";
import { DropdownSelect } from "@/components/ui/dropdown-select";
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
    id: "r-nbt",
    name: "National Book Trust",
    type: "Publisher",
    totalSales: 2625000.0,
    commissionRate: 11.43,
    royaltyAmount: 300000.0,
    dueAmount: 300000.0,
    avatarLetter: "NB",
    openingBalance: 0.0,
    closingBalance: 300000.0,
    tdsBreakdown: "(285000.00 + 15000.00 TDS)",
  },
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
  "r-nbt": {
    holderName: "National Book Trust India",
    accountNumber: "5678901234",
    ifsc: "SBIN0000691",
    bankName: "STATE BANK OF INDIA",
    status: "Active Bank Account",
  },
};

export type SalesDetailItem = {
  id: string;
  coverGradient?: string;
  title: string;
  genre: string;
  saleDate: string;
  isbn: string;
  unitPrice: number;
  qty: number;
  netAmount: number;
  marginPayable: number;
};

const sampleSalesDetails: Record<string, SalesDetailItem[]> = {
  "r-nbt": [
    {
      id: "sd-nbt-1",
      title: "THE VOICE FROM ROOM 03",
      genre: "Crime, Thriller,...",
      saleDate: "03 Aug 2026",
      isbn: "-",
      unitPrice: 5250.0,
      qty: 500,
      netAmount: 2625000.0,
      marginPayable: 300000.0,
      coverGradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
  ],
  "r-1": [
    {
      id: "sd-r1-1",
      title: "DESTINATION UNKNOWN & UNTOLD STORIES",
      genre: "Fiction, Mystery",
      saleDate: "10 Jul 2026",
      isbn: "978-1-56619-909-4",
      unitPrice: 13536.18,
      qty: 1,
      netAmount: 13536.18,
      marginPayable: 1962.0,
      coverGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    },
  ],
  "r-2": [
    {
      id: "sd-r2-1",
      title: "MONSOON READS COLLECTION VOL 1",
      genre: "Romance, Poetry",
      saleDate: "13 Jul 2026",
      isbn: "978-3-16-148410-0",
      unitPrice: 1198.95,
      qty: 5,
      netAmount: 5994.75,
      marginPayable: 239.79,
      coverGradient: "linear-gradient(135deg, #065f46 0%, #047857 100%)",
    },
    {
      id: "sd-r2-2",
      title: "LOVE POEMS & DREAMS",
      genre: "Poetry, Literary",
      saleDate: "14 Jul 2026",
      isbn: "978-0-12-345678-9",
      unitPrice: 652.92,
      qty: 2,
      netAmount: 1305.84,
      marginPayable: 119.85,
      coverGradient: "linear-gradient(135deg, #831843 0%, #9d174d 100%)",
    },
  ],
  "r-3": [
    {
      id: "sd-r3-1",
      title: "ADVANCED COMPUTER SCIENCE & AI",
      genre: "Academic, Technology",
      saleDate: "02 Aug 2026",
      isbn: "978-0-521-85002-5",
      unitPrice: 2768.01,
      qty: 2,
      netAmount: 5536.02,
      marginPayable: 816.22,
      coverGradient: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)",
    },
  ],
};

const getSalesDetailsForEntity = (entity: RoyaltyRow): SalesDetailItem[] => {
  if (sampleSalesDetails[entity.id]) {
    return sampleSalesDetails[entity.id];
  }
  return [
    {
      id: `sd-gen-${entity.id}`,
      title: `${entity.name.toUpperCase()} CATALOG EDITION 01`,
      genre: "General Literature, Academic",
      saleDate: "03 Aug 2026",
      isbn: "978-93-5287-100-1",
      unitPrice: entity.totalSales,
      qty: 1,
      netAmount: entity.totalSales,
      marginPayable: entity.royaltyAmount,
      coverGradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
  ];
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
      type: "Base Payment",
      ref: "PMT-983456",
      amount: 1933.83,
      balance: 0.0,
      mode: "UPI",
    },
    {
      id: "ph-r2-2",
      date: "15 May 2026",
      type: "TDS",
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
      type: "Base Payment",
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

  // Dedicated Sales Details View state
  const [activeSalesDetailsEntity, setActiveSalesDetailsEntity] = useState<RoyaltyRow | null>(null);
  const [salesSearchQuery, setSalesSearchQuery] = useState("");
  const [salesPresetFilter, setSalesPresetFilter] = useState<(typeof presetOptions)[number]>("MTD");
  const [salesPresetFilterOpen, setSalesPresetFilterOpen] = useState(false);
  const [salesStartDate, setSalesStartDate] = useState("2026-08-01");
  const [salesEndDate, setSalesEndDate] = useState("2026-08-04");

  // Dedicated Add Payment Page View state
  const [activeAddPaymentEntity, setActiveAddPaymentEntity] = useState<RoyaltyRow | null>(null);
  const [paymentHistories, setPaymentHistories] = useState<Record<string, PaymentHistoryRow[]>>(initialPaymentHistories);

  // Add Payment Form inputs
  const [formPaymentType, setFormPaymentType] = useState("Base Payment");
  const [formTxnMode, setFormTxnMode] = useState("UPI");
  const [formTxnDate, setFormTxnDate] = useState("2026-07-22");
  const [formTxnRef, setFormTxnRef] = useState("");
  const [formAmountPaid, setFormAmountPaid] = useState("");

  // Selected Invoice Detail modal state
  const [selectedInvoice, setSelectedInvoice] = useState<LedgerRowItem | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [activeLedgerTxnDetail, setActiveLedgerTxnDetail] = useState<{ row: LedgerRowItem; entity: RoyaltyRow } | null>(null);

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
      type: activeAddPaymentEntity.type === "Publisher" ? "Margin Settlement" : formPaymentType,
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

  // Render 3: Full "Ledger Report - Transaction Details" Page View (Matching Screenshot)
  if (activeLedgerTxnDetail) {
    const { row: txn, entity } = activeLedgerTxnDetail;
    const isPublisher = entity.type === "Publisher";
    const totalMarginAmount = isPublisher ? 300000.0 : (entity.royaltyAmount || 1962.0);

    return (
      <AppShell
        title="Ledger Report - Transaction Details"
        subtitle="View line items, ISBN details, sales quantities, and margin calculations for this transaction."
      >
        <div className="space-y-6 p-4 md:p-8">
          {/* Top Control Bar matching screenshot */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Back Arrow + Trans Ref + Date */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveLedgerTxnDetail(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
                title="Back to Ledger"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                  Trans. Ref: {txn.ref}
                </h2>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {txn.date}
                </p>
              </div>
            </div>

            {/* Right: Download Invoice Button */}
            <button
              type="button"
              onClick={() => toast.success(`Downloading Invoice ${txn.ref}...`)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground shadow-2xs transition-colors hover:bg-secondary/60 cursor-pointer self-start sm:self-auto"
            >
              <Upload size={15} className="rotate-180 text-muted-foreground" />
              <span>Download Invoice</span>
            </button>
          </div>

          {/* Main Line Items Table Card (Following PixelBooks Style Guide) */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                    <th className="py-4 pr-4 font-semibold">Sale Date</th>
                    <th className="py-4 pr-4 font-semibold">ISBN</th>
                    <th className="py-4 pr-4 font-semibold">Type</th>
                    <th className="py-4 pr-4 font-semibold">Unit Price</th>
                    <th className="py-4 pr-4 font-semibold">Qty</th>
                    <th className="py-4 pr-4 font-semibold">Net Amount</th>
                    <th className="py-4 pr-6 font-semibold">{isPublisher ? "Margin Payable" : "Royalty Payable"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr className="group border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3.5">
                        <BookCover
                          initials="VR"
                          coverGradient="linear-gradient(135deg, #0f172a, #1e293b)"
                          title="THE VOICE FROM ROOM 03"
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs uppercase text-foreground leading-snug tracking-wide group-hover:text-[var(--brand)] transition-colors">
                            THE VOICE FROM ROOM 03
                          </p>
                          <p className="text-[11.5px] text-muted-foreground mt-0.5 font-medium">
                            Crime, Thriller,...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-xs text-foreground font-medium whitespace-nowrap">
                      {txn.date}
                    </td>
                    <td className="py-4 pr-4 text-xs text-muted-foreground font-medium">
                      —
                    </td>
                    <td className="py-4 pr-4 text-xs text-foreground font-medium">
                      Sale
                    </td>
                    <td className="py-4 pr-4 text-xs text-foreground font-medium whitespace-nowrap">
                      ₹5,250.00
                    </td>
                    <td className="py-4 pr-4 text-xs text-foreground font-medium">
                      500
                    </td>
                    <td className="py-4 pr-4 text-xs font-bold text-foreground whitespace-nowrap">
                      ₹2,625,000.00
                    </td>
                    <td className="py-4 pr-6 text-xs font-bold text-foreground whitespace-nowrap">
                      ₹{totalMarginAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground font-medium">
                Showing 1 from 1 results
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <button type="button" disabled className="disabled:opacity-30 cursor-not-allowed">
                  «&nbsp;Previous
                </button>
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--sidebar-highlight)] text-[var(--brand)] font-bold">
                  1
                </span>
                <button type="button" disabled className="disabled:opacity-30 cursor-not-allowed">
                  Next&nbsp;»
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Summary Card matching screenshot */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-2xs">
            <span className="text-sm font-semibold text-foreground">
              {isPublisher ? "Total Margin" : "Total Royalty"}
            </span>
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              ₹{totalMarginAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </AppShell>
    );
  }

  // Render 0: Full "Margin Report - Sales Details" Page View
  if (activeSalesDetailsEntity) {
    const salesItemsAll = getSalesDetailsForEntity(activeSalesDetailsEntity);

    const filteredSalesItems = salesItemsAll.filter((item) => {
      if (!salesSearchQuery.trim()) return true;
      const q = salesSearchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.isbn.toLowerCase().includes(q) ||
        item.genre.toLowerCase().includes(q)
      );
    });

    const totalMarginPayable = filteredSalesItems.reduce((acc, curr) => acc + curr.marginPayable, 0);

    return (
      <AppShell
        title={activeSalesDetailsEntity.name}
        subtitle={`${activeSalesDetailsEntity.type === "Publisher" ? "Margin Report" : "Royalty Report"} - Sales Details`}
      >
        <div className="space-y-6 p-4 md:p-8">
          {/* Back to Margin / Royalty Report Link */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveSalesDetailsEntity(null)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
              aria-label={`Back to ${activeSalesDetailsEntity.type === "Publisher" ? "Margin Report" : "Royalty Report"}`}
            >
              <ArrowLeft size={16} />
            </button>
            <span className="text-sm font-normal text-foreground">
              Back to {activeSalesDetailsEntity.type === "Publisher" ? "Margin Report" : "Royalty Report"}
            </span>
          </div>

          {/* Filter Controls Row: Search + MTD + Date Pickers + Export Button */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-card border border-border rounded-xl p-4 shadow-2xs">
            {/* Search Input */}
            <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 min-w-[240px] max-w-md">
              <Search size={15} className="mr-2 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={salesSearchQuery}
                onChange={(e) => setSalesSearchQuery(e.target.value)}
                placeholder="Search by eBook Name, ISBN, Author"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* MTD Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSalesPresetFilterOpen((v) => !v)}
                  className="flex h-11 min-w-[130px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer shadow-2xs"
                >
                  <span>{salesPresetFilter}</span>
                  <ChevronDown size={15} className="text-muted-foreground shrink-0" />
                </button>
                {salesPresetFilterOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
                    {presetOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSalesPresetFilter(opt);
                          setSalesPresetFilterOpen(false);
                        }}
                        className={`flex w-full items-center px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer ${opt === salesPresetFilter ? "font-bold text-brand bg-secondary/60" : "text-foreground"
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Range Pickers */}
              <div className="flex items-center gap-2">
                <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3 shadow-2xs">
                  <input
                    type="date"
                    value={salesStartDate}
                    onChange={(e) => setSalesStartDate(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                  />
                </label>
                <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3 shadow-2xs">
                  <input
                    type="date"
                    value={salesEndDate}
                    onChange={(e) => setSalesEndDate(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                  />
                </label>
              </div>

              {/* Export Button */}
              <button
                type="button"
                onClick={() => toast.success("Exporting sales details report...")}
                className="flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer ml-auto sm:ml-0"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                    <th className="py-4 pr-4 font-semibold">Sale Date</th>
                    <th className="py-4 pr-4 font-semibold">ISBN</th>
                    <th className="py-4 pr-4 font-semibold">Unit Price</th>
                    <th className="py-4 pr-4 font-semibold">Qty</th>
                    <th className="py-4 pr-4 font-semibold">Net Amount</th>
                    <th className="py-4 pr-6 font-semibold">Margin Payable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredSalesItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                        No sales records found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredSalesItems.map((item) => (
                      <tr key={item.id} className="hover:bg-secondary/40 transition-colors">
                        {/* Title Column with Thumbnail Cover */}
                        <td className="py-4 pl-6 pr-4">
                          <div className="flex items-center gap-3.5">
                            {/* Book Cover Thumbnail */}
                            <div
                              className="relative flex h-14 w-10 shrink-0 flex-col justify-between rounded p-1 shadow-sm ring-1 ring-black/15 overflow-hidden"
                              style={{
                                background:
                                  item.coverGradient ||
                                  "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                              }}
                            >
                              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-black/40 via-black/15 to-transparent z-10" />
                              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />
                              <div className="relative z-10 flex flex-col justify-between h-full">
                                <span className="text-[7px] font-extrabold text-white uppercase tracking-tighter opacity-90 line-clamp-2 leading-none">
                                  {item.title}
                                </span>
                                <div className="h-1.5 w-full bg-amber-400/80 rounded-xs" />
                              </div>
                            </div>

                            <div>
                              <p className="font-bold text-foreground text-xs sm:text-sm uppercase tracking-tight">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.genre}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Sale Date */}
                        <td className="py-4 pr-4 font-medium text-foreground whitespace-nowrap">
                          {item.saleDate}
                        </td>

                        {/* ISBN */}
                        <td className="py-4 pr-4 font-mono text-xs text-muted-foreground">
                          {item.isbn}
                        </td>

                        {/* Unit Price */}
                        <td className="py-4 pr-4 font-medium text-foreground whitespace-nowrap">
                          ₹{item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Qty */}
                        <td className="py-4 pr-4 font-medium text-foreground">
                          {item.qty}
                        </td>

                        {/* Net Amount */}
                        <td className="py-4 pr-4 font-medium text-foreground whitespace-nowrap">
                          ₹{item.netAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Margin Payable */}
                        <td className="py-4 pr-6 font-extrabold text-foreground whitespace-nowrap">
                          ₹{item.marginPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Showing {filteredSalesItems.length} from {filteredSalesItems.length} results
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
                  className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold"
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

          {/* Bottom Total Margin Summary Card */}
          <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between shadow-xs">
            <span className="text-sm font-bold text-foreground">Total Margin</span>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
              ₹{totalMarginPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </AppShell>
    );
  }

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
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${isPublisher ? "md:grid-cols-4" : "md:grid-cols-5"} gap-4 items-start`}>
              {/* Payment Type - Only shown for Authors */}
              {!isPublisher && (
                <div className="w-full">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Payment Type<span className="text-rose-500">*</span>
                  </label>
                  <DropdownSelect
                    value={formPaymentType}
                    options={["Base Payment", "TDS"]}
                    onChange={(v) => setFormPaymentType(v)}
                    className="w-full"
                    align="left"
                  />
                </div>
              )}

              {/* Transaction Mode */}
              <div className="w-full">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Transaction Mode<span className="text-rose-500">*</span>
                </label>
                <DropdownSelect
                  value={formTxnMode}
                  options={["UPI", "Bank Transfer (NEFT/RTGS)", "Cheque", "Cash"]}
                  onChange={(v) => setFormTxnMode(v)}
                  className="w-full"
                  align="left"
                />
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
                Submit Payment
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
                          className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary cursor-pointer ${p === presetFilter ? "font-semibold text-foreground" : "text-muted-foreground"
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
                title={`Back to ${isPublisherLedger ? "Margin Report" : "Royalty Report"}`}
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
                    {isPublisherLedger ? "Margin Report - Ledger" : "Royalty Report - Ledger"}
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
                          className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary cursor-pointer ${opt === drCrFilter ? "font-semibold text-foreground" : "text-muted-foreground"
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
                          className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary cursor-pointer ${opt === presetFilter ? "font-semibold text-foreground" : "text-muted-foreground"
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
                      onClick={() => setActiveLedgerTxnDetail({ row, entity: activeLedgerEntity })}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50 cursor-pointer group"
                    >
                      <td className="py-4 pl-6 pr-4 text-foreground whitespace-nowrap">{row.date}</td>
                      <td className="py-4 pr-4 font-medium text-foreground">{row.type}</td>
                      <td className="py-4 pr-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveLedgerTxnDetail({ row, entity: activeLedgerEntity });
                          }}
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
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                          <ChevronRight size={16} />
                        </span>
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
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/40 dark:border-amber-700/50 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400">
              <Landmark size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Total Due Amount (Till Date)
                </h2>
                <span className="inline-flex items-center rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                  All-Time Cumulative Balance
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-700 dark:text-amber-400 mt-0.5">
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
                      className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary cursor-pointer ${opt === typeFilter ? "font-semibold text-foreground bg-secondary/50" : "text-muted-foreground"
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
                      className={`flex w-full items-center px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer ${opt === presetFilter ? "font-bold text-brand bg-secondary/60" : "text-foreground"
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
            label={
              typeFilter === "Publishers"
                ? "Total Margin Amount"
                : typeFilter === "Authors"
                  ? "Total Royalty Amount"
                  : "Total Margin / Royalty Amount"
            }
            value="₹7,043.83"
            subtitle={
              typeFilter === "Publishers"
                ? "Net Period Margin"
                : typeFilter === "Authors"
                  ? "Net Period Royalty"
                  : "Net Period Margin / Royalty"
            }
          />
          <StatCard
            icon={Building2}
            label="Total Publishers"
            value="165"
            subtitle="Active Publishers"
          />
          <StatCard
            icon={Users}
            label="Total Authors"
            value="13"
            subtitle="Active Authors"
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
                  <th className="py-4 pr-4 font-semibold">
                    {typeFilter === "Publishers"
                      ? "Margin Amount"
                      : typeFilter === "Authors"
                        ? "Royalty Amount"
                        : "Margin / Royalty Amount"}
                  </th>
                  <th className="py-4 pr-4 font-semibold">Due Amount (Till Date)</th>
                  <th className="py-4 pr-4 font-semibold text-center">Payment</th>
                  <th className="py-4 pr-4 font-semibold text-center">Ledger</th>
                  <th className="py-4 pr-6 w-10 text-right" />
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
                      onClick={() => setActiveSalesDetailsEntity(row)}
                      className="group border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50 cursor-pointer"
                    >
                      {/* Publisher / Author Name & Type */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          {row.id === "r-nbt" ? (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold p-0.5 overflow-hidden">
                              <span className="text-[8px] font-black tracking-tighter text-rose-700 leading-none">nbt</span>
                            </div>
                          ) : (
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: "var(--sidebar-highlight)",
                                color: "var(--brand)",
                              }}
                            >
                              {row.avatarLetter}
                            </span>
                          )}
                          <div>
                            <p className="font-semibold text-foreground text-sm group-hover:text-[var(--brand)] transition-colors">{row.name}</p>
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
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          ₹{row.dueAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Payment Action Button */}
                      <td className="py-4 pr-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAddPaymentPage(row);
                          }}
                          className="h-9 px-4 rounded-lg text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                          style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                        >
                          Add Payment
                        </button>
                      </td>

                      {/* Ledger Button */}
                      <td className="py-4 pr-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveLedgerEntity(row);
                          }}
                          className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                        >
                          <span>Ledger</span>
                          <ChevronRight size={14} />
                        </button>
                      </td>

                      {/* Next Page Action Chevron Arrow matching publisher/catalogue */}
                      <td className="py-4 pr-6 text-right">
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
