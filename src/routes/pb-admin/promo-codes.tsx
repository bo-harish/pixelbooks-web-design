import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  ArrowLeft,
  Calendar as CalendarIcon,
  TicketPercent,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  CalendarDays,
  Sparkles,
  Building2,
  Feather,
  Copy,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import { format, isValid, addDays, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/promo-codes")({
  head: () => ({
    meta: [
      { title: "Promo Code — PixelBooks Admin" },
      {
        name: "description",
        content: "Manage promotional discount codes, approval status, and campaign durations in PixelBooks.",
      },
    ],
  }),
  component: PromoCodePage,
});

export type PromoStatus = "Approved" | "Pending" | "Rejected";
export type CreatorType = "Publisher" | "Author";

export interface PromoCodeItem {
  id: string;
  code: string;
  creatorType: CreatorType;
  publisherOrAuthorName: string;
  ebookName: string;
  duration: string;
  startDate: string;
  endDate: string;
  discount: string;
  targetEntity: string;
  status: PromoStatus;
  minimumAmount?: string;
  description?: string;
}

const INITIAL_PROMO_CODES: PromoCodeItem[] = [
  {
    id: "pc-1",
    code: "FHXDJWW963",
    creatorType: "Author",
    publisherOrAuthorName: "Ruskin Bond",
    ebookName: "1 Epub",
    duration: "Aug 03 – Aug 10, 2026",
    startDate: "2026-08-03",
    endDate: "2026-08-10",
    discount: "50 %",
    targetEntity: "1 Epub",
    status: "Approved",
    minimumAmount: "₹500",
    description: "Special author promo code for 1 Epub edition.",
  },
  {
    id: "pc-2",
    code: "PAFPQRC584",
    creatorType: "Publisher",
    publisherOrAuthorName: "Penguin India",
    ebookName: "Little Miracles-english",
    duration: "Aug 03 – Aug 03, 2026",
    startDate: "2026-08-03",
    endDate: "2026-08-03",
    discount: "5%",
    targetEntity: "Little Miracles-english",
    status: "Approved",
    minimumAmount: "₹299",
    description: "Publisher release promo code for Little Miracles English.",
  },
  {
    id: "pc-3",
    code: "FUZONVN032",
    creatorType: "Publisher",
    publisherOrAuthorName: "Rupa Publications",
    ebookName: "Kleine Wunder-german",
    duration: "Aug 03 – Aug 03, 2026",
    startDate: "2026-08-03",
    endDate: "2026-08-03",
    discount: "5%",
    targetEntity: "Kleine Wunder-german",
    status: "Approved",
    minimumAmount: "₹299",
    description: "German edition launch discount promo code.",
  },
  {
    id: "pc-4",
    code: "RWCBGAJ90122",
    creatorType: "Publisher",
    publisherOrAuthorName: "HarperCollins",
    ebookName: "Fragmented Control (The Salvation of Tempestria Book 4)",
    duration: "Aug 23 – Aug 24, 2026",
    startDate: "2026-08-23",
    endDate: "2026-08-24",
    discount: "23%",
    targetEntity: "Fragmented Control (The Salvation of Tempestria Book 4)",
    status: "Pending",
    minimumAmount: "₹499",
    description: "Pre-order campaign promo code for Tempestria Book 4.",
  },
  {
    id: "pc-5",
    code: "DBLCHXL056",
    creatorType: "Publisher",
    publisherOrAuthorName: "Oxford University Press",
    ebookName: "Aix-Marseille University,",
    duration: "Jul 31 – Aug 21, 2026",
    startDate: "2026-07-31",
    endDate: "2026-08-21",
    discount: "23%",
    targetEntity: "Aix-Marseille University,",
    status: "Rejected",
    minimumAmount: "₹1,000",
    description: "Institutional academic literature campaign promo code.",
  },
];

const TYPE_FILTER_OPTIONS = ["Publisher & Author", "All Types", "Publisher", "Author"];
const STATUS_FILTER_OPTIONS = ["All Status", "Approved", "Pending", "Rejected"];

function DropdownSelect<T extends string>({
  value,
  options,
  onChange,
  className = "min-w-[160px]",
  searchable = false,
  searchPlaceholder = "Search...",
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return options;
    const q = searchTerm.toLowerCase().trim();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, searchable, searchTerm]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setSearchTerm("");
        }}
        className={`flex h-11 items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 text-sm font-medium transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] cursor-pointer shadow-2xs ${className}`}
      >
        <span className="truncate text-foreground">{value}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-30 mt-2 max-h-64 min-w-40 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg flex flex-col py-1"
          onMouseLeave={() => setOpen(false)}
        >
          {searchable && (
            <div className="p-2 border-b border-border bg-card sticky top-0 z-10">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-2.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  autoFocus
                  className="w-full h-8 pl-8 pr-2 text-xs rounded-md border border-border bg-secondary/50 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto max-h-48 py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2.5 text-center text-xs text-muted-foreground">
                No results found
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                  className={`block w-full px-3.5 py-2 text-left text-xs font-medium hover:bg-secondary transition-colors cursor-pointer ${
                    opt === value
                      ? "font-bold text-[var(--brand)] bg-secondary/60"
                      : "text-foreground"
                  }`}
                >
                  <span className="truncate">{opt}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PromoCodePage() {
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>(INITIAL_PROMO_CODES);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("Publisher & Author");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy promo code helper
  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Copied "${code}" to clipboard!`);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 1500);
  };

  // Form State Matching Exact User Screenshot
  const [editingItem, setEditingItem] = useState<PromoCodeItem | null>(null);
  const [publisherAuthorType, setPublisherAuthorType] = useState<CreatorType>("Publisher");
  const [selectedPublisherOrAuthor, setSelectedPublisherOrAuthor] = useState("Choose from list");
  const [selectedEbook, setSelectedEbook] = useState("Choose eBook");
  const [percentageInput, setPercentageInput] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [minimumAmountInput, setMinimumAmountInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [startDateInput, setStartDateInput] = useState("2026-08-03");
  const [endDateInput, setEndDateInput] = useState("2026-08-10");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date("2026-08-03T00:00:00"),
    to: new Date("2026-08-10T00:00:00"),
  });

  // Filtered List
  const filteredItems = useMemo(() => {
    return promoCodes.filter((item) => {
      if (typeFilter === "Publisher" && item.creatorType !== "Publisher") return false;
      if (typeFilter === "Author" && item.creatorType !== "Author") return false;
      if (statusFilter !== "All Status" && item.status !== statusFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.code.toLowerCase().includes(q) ||
        item.targetEntity.toLowerCase().includes(q) ||
        item.creatorType.toLowerCase().includes(q) ||
        item.publisherOrAuthorName.toLowerCase().includes(q)
      );
    });
  }, [promoCodes, typeFilter, statusFilter, searchQuery]);

  // Handle Date Range Selection
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      setStartDateInput(format(range.from, "yyyy-MM-dd"));
    }
    if (range?.to) {
      setEndDateInput(format(range.to, "yyyy-MM-dd"));
    } else if (range?.from) {
      setEndDateInput(format(range.from, "yyyy-MM-dd"));
    }
  };

  // Change Status inline from dropdown
  const handleChangeStatus = (id: string, newStatus: PromoStatus) => {
    setPromoCodes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    toast.success(`Status updated to ${newStatus}`);
  };

  // Open Form for Adding New
  const handleOpenAdd = () => {
    setEditingItem(null);
    setPublisherAuthorType("Publisher");
    setSelectedPublisherOrAuthor("Choose from list");
    setSelectedEbook("Choose eBook");
    setPercentageInput("");
    setPromoCodeInput(`PROMO${Math.floor(100000 + Math.random() * 900000)}`);
    setMinimumAmountInput("");
    setDescriptionInput("");
    setStartDateInput("2026-08-03");
    setEndDateInput("2026-08-10");
    setDateRange({
      from: new Date("2026-08-03T00:00:00"),
      to: new Date("2026-08-10T00:00:00"),
    });
    setViewMode("form");
  };

  // Open Form for Editing Row
  const handleOpenEdit = (item: PromoCodeItem) => {
    setEditingItem(item);
    setPublisherAuthorType(item.creatorType);
    setSelectedPublisherOrAuthor(item.publisherOrAuthorName || "Choose from list");
    setSelectedEbook(item.ebookName || "Choose eBook");
    setPercentageInput(item.discount.replace(/%/g, "").trim());
    setPromoCodeInput(item.code);
    setMinimumAmountInput(item.minimumAmount || "₹500");
    setDescriptionInput(item.description || "Special promotional discount code.");
    setStartDateInput(item.startDate);
    setEndDateInput(item.endDate);

    const fromD = new Date(item.startDate + "T00:00:00");
    const toD = new Date(item.endDate + "T00:00:00");
    setDateRange({
      from: isValid(fromD) ? fromD : undefined,
      to: isValid(toD) ? toD : undefined,
    });
    setViewMode("form");
  };

  // Save Promo Code
  const handleSavePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) {
      toast.error("Please enter a valid Promo Code.");
      return;
    }

    const formatRangeStr = (fromStr: string, toStr: string) => {
      const f = new Date(fromStr);
      const t = new Date(toStr);
      if (!isValid(f) || !isValid(t)) return "Aug 03 – Aug 10, 2026";
      const fFormatted = format(f, "MMM dd");
      const tFormatted = format(t, "MMM dd, yyyy");
      return `${fFormatted} – ${tFormatted}`;
    };

    const durationStr = formatRangeStr(startDateInput, endDateInput);
    const formattedDiscount = percentageInput ? `${percentageInput}%` : "10%";
    const targetStr = selectedEbook !== "Choose eBook" ? selectedEbook : selectedPublisherOrAuthor !== "Choose from list" ? selectedPublisherOrAuthor : "All eBooks";

    if (editingItem) {
      setPromoCodes((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                code: promoCodeInput.toUpperCase(),
                creatorType: publisherAuthorType,
                publisherOrAuthorName: selectedPublisherOrAuthor !== "Choose from list" ? selectedPublisherOrAuthor : "National Book Trust",
                ebookName: selectedEbook !== "Choose eBook" ? selectedEbook : "General eBook",
                targetEntity: targetStr,
                discount: formattedDiscount,
                startDate: startDateInput,
                endDate: endDateInput,
                duration: durationStr,
                minimumAmount: minimumAmountInput || "₹500",
                description: descriptionInput || "Promotional discount code.",
              }
            : item
        )
      );
      toast.success(`Promo code "${promoCodeInput.toUpperCase()}" updated successfully!`);
    } else {
      const newItem: PromoCodeItem = {
        id: `pc-${Date.now()}`,
        code: promoCodeInput.toUpperCase(),
        creatorType: publisherAuthorType,
        publisherOrAuthorName: selectedPublisherOrAuthor !== "Choose from list" ? selectedPublisherOrAuthor : "National Book Trust",
        ebookName: selectedEbook !== "Choose eBook" ? selectedEbook : "General eBook",
        targetEntity: targetStr,
        discount: formattedDiscount,
        status: "Approved",
        startDate: startDateInput,
        endDate: endDateInput,
        duration: durationStr,
        minimumAmount: minimumAmountInput || "₹500",
        description: descriptionInput || "Promotional discount code.",
      };
      setPromoCodes((prev) => [newItem, ...prev]);
      toast.success(`Promo code "${promoCodeInput.toUpperCase()}" created successfully!`);
    }

    setViewMode("list");
  };

  return (
    <AppShell
      title="Promo Code"
      subtitle="Manage promotional discount codes, approval status, and campaign durations."
      pageIcon={
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
          <TicketPercent size={20} />
        </div>
      }
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-6 w-full">
        {viewMode === "list" ? (
          <>
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-2xs w-full">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by promo code, title"
                  className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] text-foreground"
                />
              </div>

              {/* Right Group: Filters & Action Button */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                {/* Publisher & Author Filter Dropdown */}
                <DropdownSelect
                  value={typeFilter}
                  options={TYPE_FILTER_OPTIONS}
                  onChange={setTypeFilter}
                  className="w-full sm:w-auto min-w-[160px]"
                />

                {/* All Status Filter Dropdown */}
                <DropdownSelect
                  value={statusFilter}
                  options={STATUS_FILTER_OPTIONS}
                  onChange={setStatusFilter}
                  className="w-full sm:w-auto min-w-[140px]"
                />

                {/* + Add Promo Code Button */}
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-[var(--brand)]/90 cursor-pointer shrink-0"
                >
                  <Plus size={16} />
                  <span>Add Promo Code</span>
                </button>
              </div>
            </div>

            {/* Table Card Container */}
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs w-full">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold tracking-wider text-foreground/80 bg-secondary/15">
                      <th className="py-4 pl-6 pr-4 font-bold">Promo Code</th>
                      <th className="py-4 pr-4 font-bold">Promo Duration</th>
                      <th className="py-4 pr-4 font-bold">Discount</th>
                      <th className="py-4 pr-4 font-bold">eBook/Publisher/Author</th>
                      <th className="py-4 pr-4 font-bold text-center">Action</th>
                      <th className="py-4 pr-6 font-bold">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">
                          No promo codes found matching your selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => (
                        <tr
                          key={item.id}
                          className="transition-colors hover:bg-secondary/40"
                        >
                          {/* Promo Code Column */}
                          <td className="py-4 pl-6 pr-4 align-middle">
                            <div className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-secondary/30 px-3 py-1.5 text-xs font-mono font-bold tracking-wider text-foreground shadow-2xs">
                              {item.creatorType === "Publisher" ? (
                                <span title="Publisher" className="inline-flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                  <Building2 size={14} className="shrink-0" />
                                </span>
                              ) : (
                                <span title="Author" className="inline-flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                  <Feather size={14} className="shrink-0" />
                                </span>
                              )}
                              <span>{item.code}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyCode(item.code, item.id);
                                }}
                                className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer ml-0.5"
                                title="Copy Promo Code"
                              >
                                {copiedId === item.id ? (
                                  <Check size={13} className="text-emerald-500 shrink-0" />
                                ) : (
                                  <Copy size={13} className="shrink-0" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Promo Duration Column */}
                          <td className="py-4 pr-4 text-sm font-medium text-foreground whitespace-nowrap align-middle">
                            {item.duration}
                          </td>

                          {/* Discount Column */}
                          <td className="py-4 pr-4 text-sm font-bold text-foreground whitespace-nowrap align-middle">
                            {item.discount}
                          </td>

                          {/* eBook/Publisher/Author Column */}
                          <td className="py-4 pr-4 text-sm font-medium text-foreground align-middle max-w-xs">
                            <span className="line-clamp-2">{item.targetEntity}</span>
                          </td>

                          {/* Action Column */}
                          <td className="py-4 pr-4 text-center align-middle whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer shadow-2xs"
                            >
                              View/Edit
                            </button>
                          </td>

                          {/* Current Status Dropdown Column */}
                          <td className="py-4 pr-6 align-middle whitespace-nowrap">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="outline-none cursor-pointer">
                                {item.status === "Approved" && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60 shadow-2xs">
                                    <CheckCircle2 size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                                    <span>Approved</span>
                                    <ChevronDown size={12} className="ml-0.5 opacity-75" />
                                  </span>
                                )}
                                {item.status === "Pending" && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60 shadow-2xs">
                                    <AlertTriangle size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
                                    <span>Pending</span>
                                    <ChevronDown size={12} className="ml-0.5 opacity-75" />
                                  </span>
                                )}
                                {item.status === "Rejected" && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60 shadow-2xs">
                                    <XCircle size={14} className="shrink-0 text-rose-600 dark:text-rose-400" />
                                    <span>Rejected</span>
                                    <ChevronDown size={12} className="ml-0.5 opacity-75" />
                                  </span>
                                )}
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36 bg-card border-border shadow-lg rounded-xl py-1">
                                <DropdownMenuItem
                                  onClick={() => handleChangeStatus(item.id, "Approved")}
                                  className="cursor-pointer px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                >
                                  <CheckCircle2 size={13} className="mr-2" /> Approved
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleChangeStatus(item.id, "Pending")}
                                  className="cursor-pointer px-3 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                                >
                                  <AlertTriangle size={13} className="mr-2" /> Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleChangeStatus(item.id, "Rejected")}
                                  className="cursor-pointer px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                >
                                  <XCircle size={13} className="mr-2" /> Rejected
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="flex items-center justify-between border-t border-border bg-secondary/10 px-6 py-4">
                <span className="text-xs text-muted-foreground">
                  Showing <strong className="text-foreground">{filteredItems.length}</strong> from <strong className="text-foreground">{promoCodes.length}</strong> promo codes
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Page 1 of 1
                </span>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================
           * ADD / EDIT PROMO CODE FORM VIEW (MATCHING ATTACHED SCREENSHOT)
           * ======================================================================== */
          <div className="space-y-6 w-full max-w-5xl mx-auto">
            {/* Header Navigation matching screenshot header */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary cursor-pointer shadow-2xs"
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-xl font-bold text-foreground">
                {editingItem ? "Edit Promo Code" : "Create Promo Code"}
              </h2>
            </div>

            {/* Form Card Container */}
            <form onSubmit={handleSavePromoCode} className="space-y-6 w-full">
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-2xs space-y-6">
                
                {/* Row 1: Publisher/Author Dropdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Publisher/Author<span className="text-red-500">*</span>
                    </label>
                    <DropdownSelect
                      value={publisherAuthorType}
                      options={["Publisher", "Author"] as CreatorType[]}
                      onChange={(v) => {
                        setPublisherAuthorType(v as CreatorType);
                        setSelectedPublisherOrAuthor("Choose from list");
                      }}
                      className="w-full"
                    />
                  </div>
                  <div />
                </div>

                {/* Row 2: Publisher or Author Selection + eBook */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      {publisherAuthorType}<span className="text-red-500">*</span>
                    </label>
                    <DropdownSelect
                      value={selectedPublisherOrAuthor}
                      options={
                        publisherAuthorType === "Publisher"
                          ? ["Choose from list", "National Book Trust", "Penguin India", "Rupa Publications", "HarperCollins", "Oxford University Press"]
                          : ["Choose from list", "Ruskin Bond", "Arundhati Roy", "Chetan Bhagat", "Vikram Seth", "Jhumpa Lahiri"]
                      }
                      onChange={setSelectedPublisherOrAuthor}
                      className="w-full"
                      searchable
                      searchPlaceholder={`Search ${publisherAuthorType}...`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      eBook
                    </label>
                    <DropdownSelect
                      value={selectedEbook}
                      options={[
                        "Choose eBook",
                        "All eBooks",
                        "1 Epub",
                        "Little Miracles-english",
                        "Kleine Wunder-german",
                        "Fragmented Control (The Salvation of Tempestria Book 4)",
                        "Aix-Marseille University,",
                      ]}
                      onChange={setSelectedEbook}
                      className="w-full"
                      searchable
                      searchPlaceholder="Search eBook..."
                    />
                  </div>
                </div>

                {/* Row 3: Percentage % + Promo Code with Generate Code link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Percentage %<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={percentageInput}
                      onChange={(e) => setPercentageInput(e.target.value)}
                      placeholder="Enter Percentage"
                      className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Promo Code<span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                          placeholder="PROMO CODE"
                          className="w-full h-11 rounded-lg border border-border/80 bg-secondary/30 px-3.5 text-sm font-mono font-bold uppercase text-foreground outline-none focus:border-[var(--brand)] placeholder:text-muted-foreground/60 placeholder:font-normal"
                        />
                        {promoCodeInput && (
                          <button
                            type="button"
                            onClick={() => handleCopyCode(promoCodeInput, "form-code")}
                            className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
                            title="Copy Code"
                          >
                            {copiedId === "form-code" ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setPromoCodeInput(`PROMO${Math.floor(100000 + Math.random() * 900000)}`)}
                        className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-xs font-semibold text-white shadow-2xs transition-opacity hover:opacity-90 shrink-0 cursor-pointer whitespace-nowrap"
                      >
                        <Sparkles size={14} />
                        <span>Generate Code</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Row 4: Minimum Amount + Start Date-End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Minimum Amount<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={minimumAmountInput}
                      onChange={(e) => setMinimumAmountInput(e.target.value)}
                      placeholder="Select Minimum Amount"
                      className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Start Date-End Date<span className="text-red-500">*</span>
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex h-11 w-full items-center justify-between rounded-lg border border-border bg-card px-3.5 text-sm text-foreground hover:bg-secondary/40 focus:outline-none focus:border-[var(--brand)] transition-colors cursor-pointer shadow-none"
                        >
                          <span className="truncate text-sm font-normal text-foreground">
                            {dateRange?.from ? (
                              dateRange.to ? (
                                `${format(dateRange.from, "MMM dd, yyyy")} to ${format(dateRange.to, "MMM dd, yyyy")}`
                              ) : (
                                format(dateRange.from, "MMM dd, yyyy")
                              )
                            ) : (
                              <span className="text-muted-foreground font-normal">Choose Date</span>
                            )}
                          </span>
                          <CalendarDays size={18} className="text-muted-foreground shrink-0 ml-2" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-auto p-4 bg-card border-border shadow-xl rounded-xl">
                        <div className="flex items-center justify-between pb-3 mb-2 border-b border-border text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">From:</span>
                            <span className="font-semibold text-foreground">
                              {dateRange?.from ? format(dateRange.from, "MMM dd, yyyy") : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">To:</span>
                            <span className="font-semibold text-foreground">
                              {dateRange?.to ? format(dateRange.to, "MMM dd, yyyy") : "—"}
                            </span>
                          </div>
                        </div>

                        <Calendar
                          mode="range"
                          defaultMonth={dateRange?.from || new Date("2026-08-01")}
                          selected={dateRange}
                          onSelect={handleDateRangeSelect}
                          numberOfMonths={1}
                          className="rounded-md border-0"
                        />

                        <div className="pt-3 mt-2 border-t border-border flex flex-wrap items-center justify-between gap-1.5 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              const today = new Date();
                              const next7 = addDays(today, 7);
                              handleDateRangeSelect({ from: today, to: next7 });
                            }}
                            className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-colors font-medium cursor-pointer"
                          >
                            Next 7 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const today = new Date();
                              const next30 = addDays(today, 30);
                              handleDateRangeSelect({ from: today, to: next30 });
                            }}
                            className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-colors font-medium cursor-pointer"
                          >
                            Next 30 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const today = new Date();
                              const startM = startOfMonth(today);
                              const endM = endOfMonth(today);
                              handleDateRangeSelect({ from: startM, to: endM });
                            }}
                            className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-colors font-medium cursor-pointer"
                          >
                            This Month
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Row 5: Promo Code Description */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Promo Code Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    placeholder="Enter Description"
                    className="w-full rounded-lg border border-border bg-card p-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] placeholder:text-muted-foreground resize-y min-h-[90px]"
                  />
                </div>
              </div>

              {/* Form Action Buttons matching screenshot bottom */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg px-6 py-2.5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  {editingItem ? "Save Changes" : "Create Promo Code"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
