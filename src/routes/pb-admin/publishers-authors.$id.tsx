import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Copy,
  Check,
  Building2,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  BookOpen,
  ChevronRight,
  Landmark,
  MapPin,
  Mail,
  Phone,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Percent,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/publishers-authors/$id")({
  component: PublisherAuthorDetailPage,
});

type EntityRole = "Publisher" | "Author";
type EntityStatus = "Approved" | "Rejected" | "Pending";

interface AccountDetails {
  id: string;
  name: string;
  type: EntityRole;
  gstNumber: string;
  panCard: string;
  commissionRate: string;
  profileUrl: string;
  status: EntityStatus;

  // Bank Details
  accountHolderName: string;
  bankAccountNumber: string;
  ifscCode: string;
  bankName: string;

  // Address
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;

  // Contact Details
  email: string;
  phone: string;

  // Stats
  totalSales: string;
  totalPurchased: number;
  royaltyPayable: string;
  lastPaymentDate: string;
  totalPublished: number;
}

const MOCK_ACCOUNTS_MAP: Record<string, AccountDetails> = {
  "pa-4": {
    id: "pa-4",
    name: "QA-TBH Publishers",
    type: "Publisher",
    gstNumber: "27ABCDE1234F1Z1",
    panCard: "QAZXS1234R",
    commissionRate: "16%",
    profileUrl: "https://pixelbooksapp.com/TBH-Publisher",
    status: "Approved",
    accountHolderName: "Tharvi",
    bankAccountNumber: "1234567890",
    ifscCode: "ICIC0003972",
    bankName: "ICICI BANK LIMITED, Kakkanad - Smartcity",
    addressLine1: "MG Road",
    addressLine2: "-",
    city: "Kochi",
    state: "Kerala",
    pincode: "682045",
    email: "nimisha+50@brandoptics.com",
    phone: "8889996663",
    totalSales: "₹630.00",
    totalPurchased: 3,
    royaltyPayable: "₹45.00",
    lastPaymentDate: "22 Jul 2026",
    totalPublished: 11,
  },
  "pa-1": {
    id: "pa-1",
    name: "Werley Nortreus",
    type: "Author",
    gstNumber: "32AAAAA0000A1Z5",
    panCard: "WERLN9988P",
    commissionRate: "15%",
    profileUrl: "https://pixelbooksapp.com/werley-nortreus",
    status: "Approved",
    accountHolderName: "Werley Nortreus",
    bankAccountNumber: "987654321098",
    ifscCode: "HDFC0001234",
    bankName: "HDFC BANK, Hazratganj - Lucknow",
    addressLine1: "12 Civil Lines",
    addressLine2: "Near Clock Tower",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226001",
    email: "werley.n@authors.org",
    phone: "7778889990",
    totalSales: "₹1,250.00",
    totalPurchased: 12,
    royaltyPayable: "₹187.50",
    lastPaymentDate: "15 Jul 2026",
    totalPublished: 6,
  },
};

const MOCK_TITLES = [
  {
    id: "b-1",
    title: "Elsaunderajoseph",
    category: "General & Literary Fiction",
    isbn: "-",
    author: "LaTeX with hyperref",
    dop: "01 Jan 2025",
    language: "English",
    price: "₹5482.00",
    status: "Published",
    coverGradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    initials: "EL",
  },
  {
    id: "b-2",
    title: "Principles of Modern Literary Studies",
    category: "Academic & Professional",
    isbn: "978-3-16-148410-0",
    author: "Dr. K. R. Varma",
    dop: "15 Feb 2025",
    language: "English",
    price: "₹450.00",
    status: "Published",
    coverGradient: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
    initials: "PL",
  },
  {
    id: "b-3",
    title: "Heritage of South India",
    category: "History & Culture",
    isbn: "978-81-7023-112-9",
    author: "Nair & Associates",
    dop: "10 Mar 2025",
    language: "Malayalam",
    price: "₹380.00",
    status: "Published",
    coverGradient: "linear-gradient(135deg, #854d0e 0%, #ca8a04 100%)",
    initials: "HS",
  },
  {
    id: "b-4",
    title: "Digital Ecosystems & Publishers",
    category: "Computer Science",
    isbn: "978-93-5012-445-1",
    author: "TBH Editorial Board",
    dop: "05 Apr 2025",
    language: "English",
    price: "₹890.00",
    status: "Published",
    coverGradient: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
    initials: "DE",
  },
];

function PublisherAuthorDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const initialData: AccountDetails = MOCK_ACCOUNTS_MAP[id] || {
    id: id || "pa-4",
    name: "QA-TBH Publishers",
    type: "Publisher",
    gstNumber: "27ABCDE1234F1Z1",
    panCard: "QAZXS1234R",
    commissionRate: "16%",
    profileUrl: `https://pixelbooksapp.com/${id}`,
    status: "Approved",
    accountHolderName: "Tharvi",
    bankAccountNumber: "1234567890",
    ifscCode: "ICIC0003972",
    bankName: "ICICI BANK LIMITED, Kakkanad - Smartcity",
    addressLine1: "MG Road",
    addressLine2: "-",
    city: "Kochi",
    state: "Kerala",
    pincode: "682045",
    email: "nimisha+50@brandoptics.com",
    phone: "8889996663",
    totalSales: "₹630.00",
    totalPurchased: 3,
    royaltyPayable: "₹45.00",
    lastPaymentDate: "22 Jul 2026",
    totalPublished: 11,
  };

  const [account, setAccount] = useState<AccountDetails>(initialData);
  const [copied, setCopied] = useState(false);
  const [salesTimeframe, setSalesTimeframe] = useState("Monthly");
  const [purchasedTimeframe, setPurchasedTimeframe] = useState("Monthly");
  const [publishedTimeframe, setPublishedTimeframe] = useState("Monthly");

  // Title Search query
  const [titleSearch, setTitleSearch] = useState("");

  const filteredTitles = useMemo(() => {
    if (!titleSearch.trim()) return MOCK_TITLES;
    const q = titleSearch.toLowerCase();
    return MOCK_TITLES.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q) ||
        t.isbn.toLowerCase().includes(q)
    );
  }, [titleSearch]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(account.profileUrl);
    setCopied(true);
    toast.success("Profile URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = (newStatus: EntityStatus) => {
    setAccount((prev) => ({ ...prev, status: newStatus }));
    toast.success(`Account status updated to ${newStatus}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppShell
      title={`${account.type} Preview`}
      subtitle={`Detailed overview, verified records, and active catalogue for ${account.name}.`}
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Back Navigation Control Style matching Section 8 of style guide */}
        <div className="flex items-center gap-3 mb-4">
          <Link
            to="/pb-admin/publishers-authors"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft size={16} />
          </Link>
          <span className="text-sm font-semibold text-foreground">
            Back to Publisher / Author
          </span>
        </div>

        {/* Top Profile Banner Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Entity Avatar & Core Details */}
            <div className="flex items-start gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-[var(--sidebar-highlight)] text-[var(--brand)] shadow-inner">
                {account.type === "Publisher" ? (
                  <Building2 size={30} />
                ) : (
                  <User size={30} />
                )}
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)] text-white text-[9px] font-bold ring-2 ring-card">
                  {account.type[0]}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-lg font-extrabold text-foreground">
                    {account.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    {account.type === "Publisher" ? <Building2 size={11} /> : <User size={11} />}
                    {account.type}
                  </span>
                </div>

                {/* GST, PAN & Commission Chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-3 py-1">
                    <ShieldCheck size={13} className="text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">GST:</span>
                    <span className="font-bold text-foreground font-mono">{account.gstNumber}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-3 py-1">
                    <CreditCard size={13} className="text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">PAN:</span>
                    <span className="font-bold text-foreground font-mono">{account.panCard}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400">
                    <Percent size={13} />
                    <span className="font-medium">Commission Rate:</span>
                    <span className="font-bold">{account.commissionRate}</span>
                  </div>
                </div>

                {/* Profile URL Link & Copy Action */}
                <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-medium">Profile URL:</span>
                  <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1">
                    <a
                      href={account.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs font-medium text-[var(--brand)] hover:underline truncate max-w-[280px] sm:max-w-md"
                    >
                      {account.profileUrl}
                    </a>
                    <button
                      onClick={handleCopyUrl}
                      className="inline-flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                      title="Copy Profile URL"
                    >
                      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                    <a
                      href={account.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="Open Profile URL"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Dropdown Button on Top Right */}
            <div className="shrink-0 pt-2 lg:pt-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex h-10 items-center justify-between gap-2.5 rounded-full px-4 text-xs font-bold shadow-xs transition-all outline-none cursor-pointer border ${account.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                        : account.status === "Rejected"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                      }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {account.status === "Approved" && <CheckCircle2 size={15} />}
                      {account.status === "Rejected" && <XCircle size={15} />}
                      {account.status === "Pending" && <Clock size={15} />}
                      <span>{account.status}</span>
                    </div>
                    <ChevronDown size={14} className="opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("Pending")}
                    className="cursor-pointer text-xs font-semibold text-amber-600 dark:text-amber-400 gap-2"
                  >
                    <Clock size={14} />
                    <span>Pending</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("Approved")}
                    className="cursor-pointer text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-2"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approved</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("Rejected")}
                    className="cursor-pointer text-xs font-semibold text-rose-600 dark:text-rose-400 gap-2"
                  >
                    <XCircle size={14} />
                    <span>Rejected</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* 3 Information Cards Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Bank Details Card */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-border/80 pb-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <Landmark size={15} />
              </span>
              <h2 className="text-sm font-bold text-foreground">Bank Details</h2>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="rounded-lg border border-border/40 bg-muted/30 p-2.5">
                <span className="text-muted-foreground block text-[11px] font-medium">Account Holder Name</span>
                <span className="font-bold text-foreground">{account.accountHolderName}</span>
              </div>
              <div className="rounded-lg border border-border/40 bg-muted/30 p-2.5">
                <span className="text-muted-foreground block text-[11px] font-medium">Bank Account Number</span>
                <span className="font-bold text-foreground font-mono text-sm">{account.bankAccountNumber}</span>
              </div>
              <div className="rounded-lg border border-border/40 bg-muted/30 p-2.5">
                <span className="text-muted-foreground block text-[11px] font-medium">IFSC Code</span>
                <span className="font-bold text-foreground font-mono">{account.ifscCode}</span>
              </div>
              <div className="rounded-lg border border-border/40 bg-muted/30 p-2.5">
                <span className="text-muted-foreground block text-[11px] font-medium">Bank Name</span>
                <span className="font-bold text-foreground">{account.bankName}</span>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-border/80 pb-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <MapPin size={15} />
              </span>
              <h2 className="text-sm font-bold text-foreground">Address</h2>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="rounded-lg border border-border/40 bg-muted/30 p-2.5">
                <span className="text-muted-foreground block text-[11px] font-medium">Address Line 1</span>
                <span className="font-bold text-foreground">{account.addressLine1}</span>
              </div>
              <div className="rounded-lg border border-border/40 bg-muted/30 p-2.5">
                <span className="text-muted-foreground block text-[11px] font-medium">Address Line 2</span>
                <span className="font-bold text-foreground">{account.addressLine2}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-border/40 bg-muted/30 p-2.5">
                  <span className="text-muted-foreground block text-[11px] font-medium">City</span>
                  <span className="font-bold text-foreground">{account.city}</span>
                </div>
                <div className="rounded-lg border border-border/40 bg-muted/30 p-2.5">
                  <span className="text-muted-foreground block text-[11px] font-medium">State</span>
                  <span className="font-bold text-foreground">{account.state}</span>
                </div>
              </div>
              <div className="rounded-lg border border-border/40 bg-muted/30 p-2.5">
                <span className="text-muted-foreground block text-[11px] font-medium">Pincode</span>
                <span className="font-bold text-foreground font-mono">{account.pincode}</span>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-border/80 pb-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <Mail size={15} />
              </span>
              <h2 className="text-sm font-bold text-foreground">Contact Details</h2>
            </div>
            <div className="space-y-3 text-xs">
              <div className="rounded-lg border border-border/40 bg-muted/30 p-3 space-y-1">
                <span className="text-muted-foreground block text-[11px] font-medium flex items-center gap-1.5">
                  <Mail size={12} className="text-muted-foreground" /> Email Address
                </span>
                <a
                  href={`mailto:${account.email}`}
                  className="font-bold text-foreground hover:text-[var(--brand)] underline underline-offset-2 break-all block"
                >
                  {account.email}
                </a>
              </div>
              <div className="rounded-lg border border-border/40 bg-muted/30 p-3 space-y-1">
                <span className="text-muted-foreground block text-[11px] font-medium flex items-center gap-1.5">
                  <Phone size={12} className="text-muted-foreground" /> Phone Number
                </span>
                <span className="font-bold text-foreground font-mono text-sm">{account.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards Row (4 Cards) matching Style Guide Section 1 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Sales */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs hover:shadow-md transition-shadow min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <BookOpen size={18} />
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-7 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-[11px] font-semibold text-foreground hover:bg-secondary outline-none cursor-pointer">
                    <span>{salesTimeframe}</span>
                    <ChevronDown size={12} className="text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {["Monthly", "Quarterly", "Yearly"].map((t) => (
                    <DropdownMenuItem key={t} onClick={() => setSalesTimeframe(t)} className="text-xs font-medium cursor-pointer">
                      {t}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Total Sales
              </span>
              <span className="text-2xl font-extrabold text-foreground">{account.totalSales}</span>
            </div>
          </div>

          {/* Total eBooks Purchased */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs hover:shadow-md transition-shadow min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <ShoppingBag size={18} />
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-7 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-[11px] font-semibold text-foreground hover:bg-secondary outline-none cursor-pointer">
                    <span>{purchasedTimeframe}</span>
                    <ChevronDown size={12} className="text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {["Monthly", "Quarterly", "Yearly"].map((t) => (
                    <DropdownMenuItem key={t} onClick={() => setPurchasedTimeframe(t)} className="text-xs font-medium cursor-pointer">
                      {t}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Total eBooks Purchased
              </span>
              <span className="text-2xl font-extrabold text-foreground">{account.totalPurchased}</span>
            </div>
          </div>

          {/* Royalty Payable */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs hover:shadow-md transition-shadow min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Landmark size={18} />
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Payable
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Royalty Payable
              </span>
              <span className="text-2xl font-extrabold text-foreground">{account.royaltyPayable}</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Last payment Date <span className="font-bold text-foreground">{account.lastPaymentDate}</span>
              </p>
            </div>
          </div>

          {/* Total eBooks Published */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs hover:shadow-md transition-shadow min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <BookOpen size={18} />
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-7 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-[11px] font-semibold text-foreground hover:bg-secondary outline-none cursor-pointer">
                    <span>{publishedTimeframe}</span>
                    <ChevronDown size={12} className="text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {["Monthly", "Quarterly", "Yearly"].map((t) => (
                    <DropdownMenuItem key={t} onClick={() => setPublishedTimeframe(t)} className="text-xs font-medium cursor-pointer">
                      {t}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Total eBooks Published
              </span>
              <span className="text-2xl font-extrabold text-foreground">{account.totalPublished}</span>
            </div>
          </div>
        </div>

        {/* Titles Section Table */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-extrabold text-foreground">Titles</h2>
              <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                20 eBooks
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Titles Box */}
              <label className="relative flex h-10 items-center rounded-lg border border-border bg-card px-3 min-w-[200px]">
                <Search size={14} className="mr-2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search titles..."
                  value={titleSearch}
                  onChange={(e) => setTitleSearch(e.target.value)}
                  className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                />
              </label>

              <Link
                to="/pb-admin/titles"
                className="flex h-10 items-center justify-center rounded-lg bg-[var(--brand)] px-4 text-xs font-semibold text-white shadow-xs hover:opacity-90 transition-opacity shrink-0"
              >
                View All eBooks
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4 md:px-6">Title</th>
                    <th className="py-3.5 px-4">ISBN</th>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">DOP</th>
                    <th className="py-3.5 px-4">Language</th>
                    <th className="py-3.5 px-4">Sale Price</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 pr-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTitles.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-muted-foreground text-xs font-medium">
                        No titles matching "{titleSearch}"
                      </td>
                    </tr>
                  ) : (
                    filteredTitles.map((book) => (
                      <tr
                        key={book.id}
                        onClick={() => navigate({ to: "/pb-admin/titles/$bookId", params: { bookId: book.id } })}
                        className="group cursor-pointer transition-colors hover:bg-muted/30"
                      >
                        {/* Title + Cover Thumbnail matching Section 6 of Style Guide */}
                        <td className="py-4 px-4 md:px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className="relative flex h-14 w-9 shrink-0 flex-col items-center justify-center rounded-md text-[10px] font-bold text-white shadow-xs ring-1 ring-black/10 overflow-hidden"
                              style={{ background: book.coverGradient }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                              <span className="relative z-10 text-[10px] font-extrabold tracking-wider">
                                {book.initials}
                              </span>
                            </div>

                            <div className="min-w-0 flex-1 space-y-1">
                              <p className="font-semibold text-sm leading-snug text-foreground transition-colors group-hover:text-[var(--brand)]">
                                {book.title}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium">
                                {book.category}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ISBN */}
                        <td className="py-4 px-4 text-muted-foreground font-mono text-xs">{book.isbn}</td>

                        {/* Author */}
                        <td className="py-4 px-4 font-semibold text-foreground text-xs">{book.author}</td>

                        {/* DOP */}
                        <td className="py-4 px-4 text-muted-foreground text-xs">{book.dop}</td>

                        {/* Language */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground">
                            {book.language}
                          </span>
                        </td>

                        {/* Sale Price */}
                        <td className="py-4 px-4 font-bold text-foreground text-xs">{book.price}</td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={12} />
                            Published
                          </span>
                        </td>

                        {/* Chevron */}
                        <td className="py-4 px-4 pr-6 text-right text-muted-foreground group-hover:text-foreground">
                          <ChevronRight size={18} className="inline transition-transform group-hover:translate-x-0.5" />
                        </td>
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
