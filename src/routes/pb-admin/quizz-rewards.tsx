import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  ArrowLeft,
  Calendar as CalendarIcon,
  Sparkles,
  TicketPercent,
  ChevronRight,
  CalendarDays,
  Copy,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import { DropdownSelect } from "@/components/ui/dropdown-select";
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

export const Route = createFileRoute("/pb-admin/quizz-rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — PixelBooks Admin" },
      {
        name: "description",
        content: "Manage reward coupon codes, discount percentages, and campaign durations in PixelBooks.",
      },
    ],
  }),
  component: CouponCodePage,
});

export interface CouponItem {
  id: string;
  code: string;
  duration: string; // e.g. "Jul 24 – Jul 31, 2026"
  startDate: string;
  endDate: string;
  discountPercentage: string; // e.g. "32%"
  rewardPoints: number;
  description: string;
  actionStatus: "In Use" | "Expired" | "Available";
  status: boolean; // toggle state
}

const INITIAL_COUPONS: CouponItem[] = [
  {
    id: "coup-1",
    code: "JFTBGNG320",
    duration: "Jul 24 – Jul 31, 2026",
    startDate: "2026-07-24",
    endDate: "2026-07-31",
    discountPercentage: "32%",
    rewardPoints: 500,
    description: "Special reader reward coupon code for summer literary festival.",
    actionStatus: "In Use",
    status: true,
  },
  {
    id: "coup-2",
    code: "PXBOOK2026",
    duration: "Jul 01 – Aug 15, 2026",
    startDate: "2026-07-01",
    endDate: "2026-08-15",
    discountPercentage: "25%",
    rewardPoints: 750,
    description: "Back to school reward coupon for academic eBook bundles.",
    actionStatus: "Available",
    status: true,
  },
  {
    id: "coup-3",
    code: "SPRING2026",
    duration: "Jan 01 – Mar 31, 2026",
    startDate: "2026-01-01",
    endDate: "2026-03-31",
    discountPercentage: "15%",
    rewardPoints: 300,
    description: "Spring festival promotional discount code.",
    actionStatus: "Expired",
    status: false,
  },
];

export function CouponCodePage() {
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All Status" | "Active" | "Inactive" | "Expired">("All Status");

  // Active editing item (null = creating new coupon)
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    if (!code || code === "COUPON CODE") return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied coupon code "${code}" to clipboard!`);
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev));
    }, 2000);
  };

  // Form State matching screenshot 2
  const [couponCodeInput, setCouponCodeInput] = useState("COUPON CODE");
  const [percentageInput, setPercentageInput] = useState("");
  const [rewardPointsInput, setRewardPointsInput] = useState("");
  const [startDateInput, setStartDateInput] = useState("2026-07-24");
  const [endDateInput, setEndDateInput] = useState("2026-07-31");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date("2026-07-24T00:00:00"),
    to: new Date("2026-07-31T00:00:00"),
  });
  const [descriptionInput, setDescriptionInput] = useState("");

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      const sStr = format(range.from, "yyyy-MM-dd");
      setStartDateInput(sStr);
    }
    if (range?.to) {
      const eStr = format(range.to, "yyyy-MM-dd");
      setEndDateInput(eStr);
    } else if (range?.from) {
      const sStr = format(range.from, "yyyy-MM-dd");
      setEndDateInput(sStr);
    }
  };

  // Filtered Coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      // Status filter
      if (statusFilter === "Active" && (!c.status || c.actionStatus === "Expired")) return false;
      if (statusFilter === "Inactive" && (c.status || c.actionStatus === "Expired")) return false;
      if (statusFilter === "Expired" && c.actionStatus !== "Expired") return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const term = searchQuery.toLowerCase().trim();
      return (
        c.code.toLowerCase().includes(term) ||
        c.discountPercentage.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
      );
    });
  }, [coupons, searchQuery, statusFilter]);

  // Generate random promo coupon code
  const handleGenerateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let generated = "";
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCouponCodeInput(generated);
    toast.success(`Generated new coupon code: ${generated}`);
  };

  // Toggle status
  const handleToggleStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.status;
          toast.success(`Coupon status updated to ${next ? "Active" : "Inactive"}`);
          return { ...item, status: next };
        }
        return item;
      })
    );
  };

  // Open Edit Coupon screen for clicked row
  const handleOpenEditCoupon = (item: CouponItem) => {
    setEditingCoupon(item);
    setCouponCodeInput(item.code);
    setPercentageInput(item.discountPercentage.replace("%", ""));
    setRewardPointsInput(String(item.rewardPoints || "500"));
    const sStr = item.startDate || "2026-07-24";
    const eStr = item.endDate || "2026-07-31";
    setStartDateInput(sStr);
    setEndDateInput(eStr);
    const fromD = new Date(sStr + "T00:00:00");
    const toD = new Date(eStr + "T00:00:00");
    setDateRange({
      from: isValid(fromD) ? fromD : undefined,
      to: isValid(toD) ? toD : undefined,
    });
    setDescriptionInput(item.description || "");
    setViewMode("create");
  };

  // Open Add New Coupon form
  const handleOpenAddNewCoupon = () => {
    setEditingCoupon(null);
    resetForm();
    handleGenerateCode(); // auto generate initial code
    setViewMode("create");
  };

  // Submit Save/Create Form
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim() || couponCodeInput === "COUPON CODE") {
      toast.error("Please enter or generate a Coupon Code.");
      return;
    }

    const formatMonthDay = (dateStr: string) => {
      if (!dateStr) return "Jul 24";
      const d = new Date(dateStr + "T00:00:00");
      return isValid(d) ? format(d, "MMM dd, yyyy") : dateStr;
    };

    const pct = percentageInput.trim() ? `${percentageInput.replace("%", "")}%` : "10%";
    const pts = parseInt(rewardPointsInput, 10) || 500;

    if (editingCoupon) {
      // Update existing item
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: couponCodeInput,
                discountPercentage: pct,
                rewardPoints: pts,
                duration: `${formatMonthDay(startDateInput)} – ${formatMonthDay(endDateInput)}`,
                startDate: startDateInput,
                endDate: endDateInput,
                description: descriptionInput || c.description,
              }
            : c
        )
      );
      toast.success(`Coupon code "${couponCodeInput}" updated successfully!`);
    } else {
      // Add new item
      const newCoupon: CouponItem = {
        id: `coup-${Date.now()}`,
        code: couponCodeInput,
        duration: `${formatMonthDay(startDateInput)} – ${formatMonthDay(endDateInput)}`,
        startDate: startDateInput,
        endDate: endDateInput,
        discountPercentage: pct,
        rewardPoints: pts,
        description: descriptionInput || "Reward points redemption coupon.",
        actionStatus: "In Use",
        status: true,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      toast.success(`Coupon code "${couponCodeInput}" created successfully!`);
    }

    resetForm();
    setViewMode("list");
  };

  const resetForm = () => {
    setCouponCodeInput("COUPON CODE");
    setPercentageInput("");
    setRewardPointsInput("");
    setStartDateInput("2026-07-24");
    setEndDateInput("2026-07-31");
    setDateRange({
      from: new Date("2026-07-24T00:00:00"),
      to: new Date("2026-07-31T00:00:00"),
    });
    setDescriptionInput("");
    setEditingCoupon(null);
  };

  const pageTitle =
    viewMode === "create"
      ? editingCoupon
        ? `Edit Reward — ${editingCoupon.code}`
        : "Create Reward"
      : "Rewards";

  const pageSubtitle =
    viewMode === "create"
      ? "Generate reward coupon codes, configure discounts, and set redemption dates."
      : "Manage promotional coupons, discount rates, reward points redemption, and usage status.";

  return (
    <AppShell title={pageTitle} subtitle={pageSubtitle}>
      <div className="p-4 sm:p-6 md:p-8 space-y-6 w-full">
        {viewMode === "list" ? (
          /* ========================================================================
           * MAIN COUPON CODE LISTING VIEW - FULL WIDTH (Matching Screenshot 1)
           * ======================================================================== */
          <>
            {/* Top Toolbar matching screenshot design */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-2xs w-full">
              {/* Search Box */}
              <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3.5 shadow-none transition-colors focus-within:border-[var(--brand)]">
                <Search size={16} className="mr-2 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>

              {/* Status Filter Dropdown & Add Coupon Button */}
              <div className="flex items-center gap-3">
                <DropdownSelect
                  value={statusFilter}
                  options={["All Status", "Active", "Inactive", "Expired"]}
                  onChange={(v) => setStatusFilter(v as any)}
                  className="min-w-[130px]"
                />

                <button
                  onClick={handleOpenAddNewCoupon}
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-2xs transition-opacity hover:opacity-90 shrink-0 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Coupon</span>
                </button>
              </div>
            </div>

            {/* Coupons Table Container - Full Width */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="px-6 py-4 min-w-[220px] font-semibold">Coupon Code</th>
                      <th className="px-6 py-4 whitespace-nowrap font-semibold">Coupon Duration</th>
                      <th className="px-6 py-4 whitespace-nowrap font-semibold">Discount</th>
                      <th className="px-6 py-4 whitespace-nowrap font-semibold">Action</th>
                      <th className="px-6 py-4 whitespace-nowrap font-semibold">Enable/Disable</th>
                      <th className="px-6 py-4 w-10 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredCoupons.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <TicketPercent size={32} className="text-muted-foreground/60" />
                            <p className="font-medium text-sm">No coupons found</p>
                            <p className="text-xs text-muted-foreground">
                              Click "+ Add Coupon" to generate your first coupon code.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCoupons.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => handleOpenEditCoupon(item)}
                          className="group cursor-pointer border-b border-border/60 transition-colors hover:bg-secondary/50"
                        >
                          {/* Coupon Code Monospace Pill Column matching screenshot */}
                          <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="inline-flex h-10 min-w-[170px] items-center justify-between gap-3 rounded-lg bg-muted/60 pl-3.5 pr-2 text-xs font-bold tracking-wider text-foreground border border-border/60 shadow-2xs font-mono">
                              <span>{item.code}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(item.code)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-card hover:text-foreground transition-colors cursor-pointer"
                                title="Copy coupon code"
                                aria-label="Copy coupon code"
                              >
                                {copiedCode === item.code ? (
                                  <Check size={14} className="text-emerald-500 shrink-0" />
                                ) : (
                                  <Copy size={14} className="shrink-0" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Coupon Duration Column */}
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground text-sm">
                            {item.duration}
                          </td>

                          {/* Discount Column */}
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground text-sm">
                            {item.discountPercentage}
                          </td>

                          {/* Action Status Pill Column */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center rounded-full bg-muted/80 px-3 py-1 text-xs font-semibold text-muted-foreground">
                              {item.actionStatus}
                            </span>
                          </td>

                          {/* Current Status Switch Toggle Column */}
                          <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <Switch
                              checked={item.status}
                              onCheckedChange={() => handleToggleStatus(item.id)}
                              className="data-[state=checked]:bg-[var(--brand)] shadow-xs"
                            />
                          </td>

                          {/* Chevron Arrow Column */}
                          <td className="px-6 py-4 text-right">
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

            {/* Pagination Footer matching screenshot design */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 w-full">
              <div className="text-xs sm:text-sm text-foreground font-normal">
                Showing <span className="font-semibold">{filteredCoupons.length}</span> from{" "}
                <span className="font-semibold">{filteredCoupons.length}</span> results
              </div>

              <div className="flex items-center gap-1.5 self-center sm:self-auto text-xs sm:text-sm">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-muted-foreground transition-colors opacity-40 pointer-events-none"
                >
                  « Previous
                </button>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg font-bold bg-[var(--sidebar-highlight)] text-[var(--brand)] border border-[var(--brand)]/30"
                >
                  1
                </button>

                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-muted-foreground transition-colors opacity-40 pointer-events-none"
                >
                  Next »
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================
           * CREATE / EDIT COUPON FORM VIEW (Matching Screenshot 2)
           * ======================================================================== */
          <div className="space-y-6 w-full">
            {/* Back Navigation Control Style matching Section 8 of style guide */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setViewMode("list");
                  setEditingCoupon(null);
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
                aria-label="Back to Rewards"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-sm font-normal text-foreground">
                Back to Rewards
              </span>
            </div>

            {/* Main Form Wrapper */}
            <form onSubmit={handleSaveCoupon} className="space-y-6 w-full">
              {/* Card Container Box */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-2xs space-y-6 w-full">
                {/* Form 2-Column Grid matching screenshot 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {/* Coupon Code with Generate Code Button & Copy Option */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Coupon Code <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={couponCodeInput}
                          onChange={(e) => setCouponCodeInput(e.target.value)}
                          placeholder="COUPON CODE"
                          className="w-full h-11 rounded-lg border border-border bg-muted/30 pl-3.5 pr-10 text-sm font-bold tracking-wider text-foreground outline-none focus:border-[var(--brand)] font-mono uppercase"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (couponCodeInput.trim() && couponCodeInput !== "COUPON CODE") {
                              handleCopyCode(couponCodeInput);
                            } else {
                              toast.error("Please enter or generate a coupon code first");
                            }
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-card hover:text-foreground transition-colors cursor-pointer"
                          title="Copy coupon code"
                          aria-label="Copy coupon code"
                        >
                          {copiedCode === couponCodeInput ? (
                            <Check size={14} className="text-emerald-500 shrink-0" />
                          ) : (
                            <Copy size={14} className="shrink-0" />
                          )}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateCode}
                        className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-xs font-semibold text-white shadow-2xs transition-opacity hover:opacity-90 shrink-0 cursor-pointer whitespace-nowrap"
                      >
                        <Sparkles size={14} />
                        <span>Generate Code</span>
                      </button>
                    </div>
                  </div>

                  {/* Percentage % */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Percentage % <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={percentageInput}
                      onChange={(e) => setPercentageInput(e.target.value)}
                      placeholder="Enter Percentage"
                      className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                    />
                  </div>

                  {/* Reward Points */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Reward Points <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={rewardPointsInput}
                      onChange={(e) => setRewardPointsInput(e.target.value)}
                      placeholder="Enter Reward Points"
                      className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                    />
                  </div>

                  {/* Start Date - End Date (Single Calendar with From/To Range Selection) */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Start Date - End Date <span className="text-red-500">*</span>
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex h-11 w-full items-center justify-between rounded-lg border border-border bg-card px-3.5 text-sm text-foreground hover:bg-secondary/40 focus:outline-none focus:border-[var(--brand)] transition-colors cursor-pointer shadow-none"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <CalendarDays size={18} className="text-muted-foreground shrink-0" />
                            <span className="truncate text-xs sm:text-sm font-medium">
                              {dateRange?.from ? (
                                dateRange.to ? (
                                  <>
                                    <span className="font-semibold text-foreground">{format(dateRange.from, "MMM dd, yyyy")}</span>
                                    <span className="text-muted-foreground mx-1.5">to</span>
                                    <span className="font-semibold text-foreground">{format(dateRange.to, "MMM dd, yyyy")}</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="font-semibold text-foreground">{format(dateRange.from, "MMM dd, yyyy")}</span>
                                    <span className="text-muted-foreground ml-1.5">(Select end date)</span>
                                  </>
                                )
                              ) : (
                                <span className="text-muted-foreground">Select date range</span>
                              )}
                            </span>
                          </div>
                          <ChevronDown size={16} className="text-muted-foreground shrink-0 ml-2" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-4 bg-card border-border shadow-xl rounded-xl">
                        {/* Selected status header inside popover */}
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

                        {/* Single Calendar with range mode */}
                        <Calendar
                          mode="range"
                          defaultMonth={dateRange?.from || new Date("2026-07-01")}
                          selected={dateRange}
                          onSelect={handleDateRangeSelect}
                          numberOfMonths={1}
                          className="rounded-md border-0"
                        />

                        {/* Quick Presets */}
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
                              handleDateRangeSelect({
                                from: startOfMonth(today),
                                to: endOfMonth(today),
                              });
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

                {/* Coupon Description */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Coupon Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    placeholder="Enter Description"
                    rows={4}
                    className="w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-[var(--brand)] resize-none"
                  />
                </div>
              </div>

              {/* Form Action Buttons - Outside Card Box */}
              <div className="flex items-center justify-end gap-3 pt-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("list");
                    setEditingCoupon(null);
                  }}
                  className="inline-flex h-11 items-center justify-center px-6 rounded-lg border border-border bg-card text-sm font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center px-6 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                >
                  {editingCoupon ? "Save Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
