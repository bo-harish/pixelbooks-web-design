import { useState, useRef, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate, useMatch, Outlet } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Building2,
  User,
  Feather,
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
  ExternalLink,
  ShieldCheck,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Percent,
  Calendar,
  Search,
  X,
  Save,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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

  // Auto-Approval Permissions
  allowWithoutApproval?: boolean;
  autoApproveLibraries?: string[];
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
    allowWithoutApproval: false,
    autoApproveLibraries: [],
  },
  "pa-2": {
    id: "pa-2",
    name: "qa test pub",
    type: "Publisher",
    gstNumber: "27AAACD9988E1Z4",
    panCard: "QATEST1234P",
    commissionRate: "16%",
    profileUrl: "https://pixelbooksapp.com/qa-test-pub",
    status: "Approved",
    accountHolderName: "QA Test Pub Bank",
    bankAccountNumber: "554433221100",
    ifscCode: "SBIN0004321",
    bankName: "STATE BANK OF INDIA, Main Branch",
    addressLine1: "Tech Park Phase 1",
    addressLine2: "Infopark",
    city: "Kochi",
    state: "Kerala",
    pincode: "682042",
    email: "qatestpub@pixelbooks.org",
    phone: "9876543210",
    totalSales: "₹2,450.00",
    totalPurchased: 8,
    royaltyPayable: "₹392.00",
    lastPaymentDate: "28 Jul 2026",
    totalPublished: 14,
    allowWithoutApproval: true,
    autoApproveLibraries: [
      "Central Public Library (CPL)",
      "National Academic Library (NAL)",
    ],
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

const ALL_LIBRARIES = [
  { id: "lib-1", name: "Central Public Library (CPL)", city: "New Delhi" },
  { id: "lib-2", name: "National Academic Library (NAL)", city: "Mumbai" },
  { id: "lib-3", name: "State Digital Library Network", city: "Kochi" },
  { id: "lib-4", name: "City Knowledge Center", city: "Bengaluru" },
  { id: "lib-5", name: "Metro Public Library System", city: "Chennai" },
  { id: "lib-6", name: "University of Science & Tech Library", city: "Hyderabad" },
  { id: "lib-7", name: "Global E-Resource Library", city: "Kolkata" },
];

function LibraryMultiSelectDropdown({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (newSelected: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredLibraries = useMemo(() => {
    if (!searchTerm.trim()) return ALL_LIBRARIES;
    const q = searchTerm.toLowerCase();
    return ALL_LIBRARIES.filter(
      (lib) => lib.name.toLowerCase().includes(q) || lib.city.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const toggleLibrary = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((item) => item !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === ALL_LIBRARIES.length) {
      onChange([]);
    } else {
      onChange(ALL_LIBRARIES.map((l) => l.name));
    }
  };

  const isAllSelected = selected.length === ALL_LIBRARIES.length && ALL_LIBRARIES.length > 0;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Area */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border bg-card p-2 text-sm font-medium transition-colors cursor-pointer shadow-2xs ${isOpen ? "border-[var(--brand)] ring-1 ring-[var(--brand)]" : "border-border hover:bg-secondary/30"
          }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selected.length === 0 ? (
            <span className="text-muted-foreground text-xs font-normal px-2">
              Select one or more libraries...
            </span>
          ) : (
            selected.map((libName) => (
              <span
                key={libName}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--brand)]"
              >
                <span>{libName}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLibrary(libName);
                  }}
                  className="rounded-md hover:bg-[var(--brand)]/20 p-0.5 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0 px-1">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline pr-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <ChevronDown
            size={16}
            className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-72 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl flex flex-col">
          {/* Search Box Header */}
          <div className="p-2.5 border-b border-border bg-card sticky top-0 z-10 space-y-2">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search libraries by name..."
                autoFocus
                className="w-full h-9 pl-9 pr-8 text-xs rounded-lg border border-border bg-secondary/40 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Select All Row */}
            <div className="flex items-center justify-between px-1 text-xs">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] font-semibold text-[var(--brand)] hover:underline cursor-pointer"
              >
                {isAllSelected ? "Deselect All" : "Select All Libraries"}
              </button>
              <span className="text-[11px] text-muted-foreground font-medium">
                {selected.length} of {ALL_LIBRARIES.length} selected
              </span>
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-52 py-1 divide-y divide-border/30">
            {filteredLibraries.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                No matching libraries found.
              </div>
            ) : (
              filteredLibraries.map((lib) => {
                const checked = selected.includes(lib.name);
                return (
                  <label
                    key={lib.id}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors cursor-pointer hover:bg-secondary/60 ${
                      checked ? "bg-[var(--brand)]/5 font-semibold text-foreground" : "text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleLibrary(lib.name)}
                        className="h-4 w-4 rounded border-border text-[var(--brand)] focus:ring-[var(--brand)] accent-[var(--brand)] cursor-pointer"
                      />
                      <span className="truncate">{lib.name}</span>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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

  // Permissions Draft State & Confirmation Dialog
  const [draftAllowWithoutApproval, setDraftAllowWithoutApproval] = useState<boolean>(
    !!initialData.allowWithoutApproval
  );
  const [draftAutoApproveLibraries, setDraftAutoApproveLibraries] = useState<string[]>(
    initialData.autoApproveLibraries || []
  );
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);

  const handleOpenSaveConfirmation = () => {
    if (draftAllowWithoutApproval && draftAutoApproveLibraries.length === 0) {
      toast.error("Please select at least one library before saving auto-approval permissions.");
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSavePermissions = () => {
    setAccount((prev) => ({
      ...prev,
      allowWithoutApproval: draftAllowWithoutApproval,
      autoApproveLibraries: draftAutoApproveLibraries,
    }));
    setIsConfirmDialogOpen(false);
    toast.success(`Publishing permissions for "${account.name}" saved successfully.`);
  };

  // Date Range Filter States matching margin-report
  const [presetFilter, setPresetFilter] = useState("MTD");
  const [presetFilterOpen, setPresetFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-31");

  const isTitlesActive = useMatch({ from: "/pb-admin/publishers-authors/$id/titles", shouldThrow: false });
  if (isTitlesActive) {
    return <Outlet />;
  }

  const handlePresetSelect = (opt: string) => {
    setPresetFilter(opt);
    setPresetFilterOpen(false);
    if (opt === "MTD") {
      setStartDate("2026-07-01");
      setEndDate("2026-07-31");
    } else if (opt === "QTD") {
      setStartDate("2026-04-01");
      setEndDate("2026-07-31");
    } else if (opt === "YTD") {
      setStartDate("2026-01-01");
      setEndDate("2026-07-31");
    } else if (opt === "Last 30 Days") {
      setStartDate("2026-07-01");
      setEndDate("2026-07-31");
    }
  };


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
          <span className="text-sm font-normal text-foreground">
            Back to Publisher / Author
          </span>
        </div>

        {/* Top Profile Banner Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs transition-shadow hover:shadow-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Block: Circular Avatar + Name + Metadata */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Circular Soft Avatar matching role colors */}
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-2xs border ${account.type === "Publisher"
                  ? "bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-500/20"
                  : "bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20"
                  }`}
              >
                {account.type === "Publisher" ? <Building2 size={28} /> : <Feather size={28} />}
              </div>

              <div className="space-y-2">
                {/* Name, Role & Status Dropdown */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl font-extrabold text-foreground tracking-tight">
                    {account.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    {account.type === "Publisher" ? <Building2 size={12} /> : <Feather size={12} />}
                    <span>{account.type}</span>
                  </span>

                  {/* Status Dropdown Pill */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`ml-1 flex h-7 items-center justify-between gap-1.5 rounded-full px-3 text-[11px] font-bold shadow-2xs transition-all outline-none cursor-pointer border ${account.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                          : account.status === "Rejected"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                          }`}
                      >
                        <div className="flex items-center gap-1">
                          {account.status === "Approved" && <CheckCircle2 size={12} />}
                          {account.status === "Rejected" && <XCircle size={12} />}
                          {account.status === "Pending" && <Clock size={12} />}
                          <span>{account.status}</span>
                        </div>
                        <ChevronDown size={12} className="opacity-70" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-36">
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

                {/* Quick Contact & Location Info Line matching reference screenshot */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={13} className="text-muted-foreground/80" />
                    <span>{account.email}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={13} className="text-muted-foreground/80" />
                    <span>+91 {account.phone}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} className="text-muted-foreground/80" />
                    <span>{account.city}, {account.state}</span>
                  </span>
                </div>

                {/* GST & PAN row (hidden when auto-approval is enabled) */}
                {!draftAllowWithoutApproval && (
                  <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-2.5 py-0.5">
                      <ShieldCheck size={12} className="text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">GST:</span>
                      <span className="font-bold text-foreground font-mono text-[11px]">{account.gstNumber}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-2.5 py-0.5">
                      <CreditCard size={12} className="text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">PAN:</span>
                      <span className="font-bold text-foreground font-mono text-[11px]">{account.panCard}</span>
                    </div>
                  </div>
                )}

                {/* Profile URL on a dedicated new line (hidden when auto-approval is enabled) */}
                {!draftAllowWithoutApproval && (
                  <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                    <span className="text-muted-foreground font-medium text-[11.5px]">Profile URL:</span>
                    <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 shadow-2xs">
                      <a
                        href={account.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[11px] font-medium text-[var(--brand)] hover:underline truncate max-w-[280px] sm:max-w-md"
                      >
                        {account.profileUrl}
                      </a>
                      <button
                        onClick={handleCopyUrl}
                        className="inline-flex h-4 w-4 items-center justify-center rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Copy Profile URL"
                      >
                        {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                      </button>
                      <a
                        href={account.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-4 w-4 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                        title="Open Profile URL"
                      >
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Block: Active Commission Rate Box (hidden when auto-approval is enabled) */}
            {!draftAllowWithoutApproval && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 p-4.5 min-w-[260px] shrink-0">
                <div className="flex items-center gap-3.5">
                  {/* Teal percent icon box */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-2xs">
                    <Percent size={20} strokeWidth={2.5} />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                      Active Commission Rate
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-foreground tracking-tight">
                        {account.commissionRate}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 size={10} />
                        <span>DEFAULT BASE</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Cards Grid */}
        <div className={`grid grid-cols-1 gap-4 ${draftAllowWithoutApproval ? "md:grid-cols-2" : "lg:grid-cols-3"}`}>
          {/* Bank Details Card (hidden when auto-approval is enabled) */}
          {!draftAllowWithoutApproval && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shadow-2xs">
                    <Landmark size={22} />
                  </span>
                  <div>
                    <h2 className="text-sm font-extrabold text-foreground leading-tight">Bank Details</h2>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Primary Bank Account</p>
                  </div>
                </div>

                {/* Inner Gray Block */}
                <div className="rounded-xl border border-border/50 bg-muted/40 p-4 space-y-3.5">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Bank Name & Branch
                    </span>
                    <span className="text-sm font-extrabold text-foreground mt-0.5 block">{account.bankName}</span>
                  </div>

                  <div className="border-t border-border/50 pt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Account Holder Name
                    </span>
                    <span className="text-sm font-extrabold text-foreground mt-0.5 block">{account.accountHolderName}</span>
                  </div>

                  <div className="border-t border-border/50 pt-3 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Account Number
                      </span>
                      <span className="text-sm font-extrabold font-mono text-foreground mt-0.5 block">
                        {account.bankAccountNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                        IFSC Code
                      </span>
                      <span className="text-sm font-extrabold font-mono text-foreground mt-0.5 block">
                        {account.ifscCode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Address Card */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shadow-2xs">
                  <MapPin size={22} />
                </span>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground leading-tight">Registered Address</h2>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{account.city}, {account.state}</p>
                </div>
              </div>

              {/* Inner Gray Block */}
              <div className="rounded-xl border border-border/50 bg-muted/40 p-4 space-y-3.5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Street Address
                  </span>
                  <span className="text-sm font-extrabold text-foreground mt-0.5 block">
                    {account.addressLine1} {account.addressLine2 !== "-" ? `, ${account.addressLine2}` : ""}
                  </span>
                </div>

                <div className="border-t border-border/50 pt-3 grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      City
                    </span>
                    <span className="text-xs font-extrabold text-foreground mt-0.5 block">{account.city}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      State
                    </span>
                    <span className="text-xs font-extrabold text-foreground mt-0.5 block">{account.state}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Pincode
                    </span>
                    <span className="text-xs font-extrabold font-mono text-foreground mt-0.5 block">{account.pincode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/12 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 shadow-2xs">
                  <Mail size={22} />
                </span>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground leading-tight">Contact Information</h2>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">Primary Representative</p>
                </div>
              </div>

              {/* Inner Gray Block */}
              <div className="rounded-xl border border-border/50 bg-muted/40 p-4 space-y-3.5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${account.email}`}
                    className="text-sm font-extrabold text-foreground hover:text-[var(--brand)] underline underline-offset-2 break-all mt-0.5 block"
                  >
                    {account.email}
                  </a>
                </div>

                <div className="border-t border-border/50 pt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Phone Number
                  </span>
                  <span className="text-sm font-extrabold font-mono text-foreground mt-0.5 block">{account.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Publishing Approvals & Permissions Card (For Publishers) */}
        {account.type === "Publisher" && (
          <div className="rounded-xl border border-border bg-card p-5 md:p-6 space-y-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 shadow-2xs">
                  <ShieldCheck size={22} />
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-foreground leading-tight">
                    Publishing Approvals & Permissions
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Configure direct publishing rules and library auto-approval settings for this publisher.
                  </p>
                </div>
              </div>
              {account.allowWithoutApproval ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
                  <CheckCircle2 size={13} />
                  Auto-Publish Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20 self-start sm:self-auto">
                  <Clock size={13} />
                  Approval Required
                </span>
              )}
            </div>

            <div className="space-y-4">
              {/* Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                <input
                  type="checkbox"
                  checked={draftAllowWithoutApproval}
                  onChange={(e) => setDraftAllowWithoutApproval(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-[var(--brand)] focus:ring-[var(--brand)] accent-[var(--brand)] cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-sm font-extrabold text-foreground group-hover:text-[var(--brand)] transition-colors">
                    Allow Publisher to Publish Books Without Approval
                  </span>
                  <p className="text-xs text-muted-foreground">
                    When enabled, books uploaded by this publisher will automatically bypass manual Super Admin verification and will be available exclusively to the selected libraries below. These books will not be available to any other libraries or in the retail store.
                  </p>
                </div>
              </label>

              {/* Multi-Select Dropdown (When enabled) */}
              {draftAllowWithoutApproval && (
                <div className="space-y-2 pt-1 pl-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <span>Select Authorized Libraries</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-muted-foreground font-medium">
                      {draftAutoApproveLibraries.length} libraries selected
                    </span>
                  </div>

                  <LibraryMultiSelectDropdown
                    selected={draftAutoApproveLibraries}
                    onChange={(newLibs) => setDraftAutoApproveLibraries(newLibs)}
                  />

                  {draftAutoApproveLibraries.length === 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-1">
                      <span>⚠️ Please select at least one library for auto-approval to take effect.</span>
                    </p>
                  )}
                </div>
              )}

              {/* Action Footer Row with Save Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground font-medium">
                  {draftAllowWithoutApproval
                    ? `${draftAutoApproveLibraries.length} libraries selected for auto-publishing`
                    : ""}
                </span>

                <button
                  type="button"
                  onClick={handleOpenSaveConfirmation}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-5 text-xs font-bold text-white shadow-2xs transition-all hover:opacity-90 active:scale-98 cursor-pointer shrink-0 self-end sm:self-auto"
                >
                  <Save size={15} />
                  <span>Save Permissions</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-xl p-6 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck size={20} className="text-[var(--brand)]" />
                <span>Confirm Publishing Permissions</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Are you sure you want to save these publishing approval settings for <strong>{account.name}</strong>?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 my-3">
              <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-foreground">Auto-Publish Mode:</span>
                  {draftAllowWithoutApproval ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 size={12} /> Enabled (Bypass Approval)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      <Clock size={12} /> Disabled (Requires Approval)
                    </span>
                  )}
                </div>

                {draftAllowWithoutApproval && (
                  <div className="border-t border-border/60 pt-2.5 space-y-1.5 text-xs">
                    <span className="font-semibold text-muted-foreground block">
                      Authorized Libraries ({draftAutoApproveLibraries.length}):
                    </span>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pt-0.5">
                      {draftAutoApproveLibraries.length === 0 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold italic text-[11px]">
                          No libraries selected
                        </span>
                      ) : (
                        draftAutoApproveLibraries.map((lib) => (
                          <span
                            key={lib}
                            className="inline-flex items-center rounded-md bg-[var(--brand)]/10 text-[var(--brand)] px-2 py-0.5 text-[11px] font-semibold"
                          >
                            {lib}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {draftAllowWithoutApproval
                  ? "Confirming will allow this publisher to upload and publish books directly to selected libraries without Super Admin verification. Once enabled, these books will be available exclusively to the selected libraries and will not be available to any other libraries or in the retail store."
                  : "Confirming will enforce standard manual Super Admin review for all titles uploaded by this publisher."}
              </p>
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
              <button
                type="button"
                onClick={() => setIsConfirmDialogOpen(false)}
                className="h-10 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSavePermissions}
                className="h-10 rounded-lg bg-[var(--brand)] px-5 text-xs font-bold text-white shadow-2xs hover:opacity-90 transition-all cursor-pointer"
              >
                Confirm & Save
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sections below Publishing Approvals (hidden when auto-approval is enabled) */}
        {!draftAllowWithoutApproval && (
          <>
            {/* Royalty Payable Section (Placed Above Stat Boxes) */}
            <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shadow-2xs">
                    <Landmark size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {account.type === "Publisher" ? "Margin Payable" : "Royalty Payable"}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-emerald-500/12 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        Payable
                      </span>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-3 mt-1">
                      <span className="text-3xl font-extrabold text-foreground">{account.royaltyPayable}</span>
                      <span className="text-xs text-muted-foreground">
                        Last payment date: <strong className="text-foreground">{account.lastPaymentDate}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/pb-admin/margin-report"
                  className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-xs font-bold shadow-2xs transition-opacity hover:opacity-90 cursor-pointer shrink-0 self-start sm:self-center"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  <CreditCard size={15} />
                  <span>{account.type === "Publisher" ? "View Margin Report" : "View Royalty Report"}</span>
                </Link>
              </div>
            </div>

            {/* Date Range Filter Bar (Outside Filter matching margin-report) */}
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between shadow-2xs">
              <div>
                <h3 className="text-sm font-bold text-foreground">Performance Overview</h3>
                <p className="text-xs text-muted-foreground">Filter sales & publishing metrics by date range</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* MTD Preset Dropdown */}
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
                      {["MTD", "QTD", "YTD", "Last 30 Days", "Custom"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handlePresetSelect(opt)}
                          className={`flex w-full items-center px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer ${opt === presetFilter ? "font-bold text-[var(--brand)] bg-secondary/60" : "text-foreground"
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

            {/* Stat Cards Row (3 Redesigned Cards matching requested style) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Total Sales */}
              <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs hover:shadow-md transition-shadow min-h-[140px]">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total Sales
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shadow-2xs">
                    <DollarSign size={22} />
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-extrabold tracking-tight text-foreground">{account.totalSales}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Total revenue in period</p>
                </div>
              </div>

              {/* Total eBooks Sold */}
              <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs hover:shadow-md transition-shadow min-h-[140px]">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total eBooks Sold
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shadow-2xs">
                    <ShoppingBag size={22} />
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-extrabold tracking-tight text-foreground">{account.totalPurchased}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">eBooks sold in period</p>
                </div>
              </div>

              {/* Total eBooks Published */}
              <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs hover:shadow-md transition-shadow min-h-[140px]">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total eBooks Published
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/12 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 shadow-2xs">
                    <BookOpen size={22} />
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-extrabold tracking-tight text-foreground">{account.totalPublished}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Active published titles</p>
                </div>
              </div>
            </div>

            {/* Titles Section Table */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-extrabold text-foreground">Recent Purchases</h2>
                  <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                    5 eBooks
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/pb-admin/publishers-authors/$id/titles"
                    params={{ id }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)] hover:underline transition-all group shrink-0"
                  >
                    <span>View All eBooks</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
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
                      {MOCK_TITLES.map((book) => (
                        <tr
                          key={book.id}
                          onClick={() => navigate({ to: "/pb-admin/titles/$bookId", params: { bookId: book.id } })}
                          className="group cursor-pointer transition-colors hover:bg-secondary/50"
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
