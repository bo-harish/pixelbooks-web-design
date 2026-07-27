import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Calendar as CalendarIcon,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/audit-log")({
  head: () => ({
    meta: [
      { title: "Audit Log — PixelBooks Admin" },
      {
        name: "description",
        content: "Track system activity, user authentication events, and data modification audit logs in PixelBooks Admin.",
      },
    ],
  }),
  component: AuditLogPage,
});

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  isoDate: string;
  user: string;
  message: string;
  app: string;
  module: string;
  event: string;
  action: string;
  requestedData: Record<string, any>;
  auditInfo: {
    ipAddress: string;
    browserInfo: string;
  };
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-1",
    timestamp: "25 Jul 2026, 12:21 AM",
    isoDate: "2026-07-25",
    user: "Business Admin",
    message: "BusinessAdmin 'Business Admin' has successfully signed in.",
    app: "Login",
    module: "Login",
    event: "Fetch",
    action: "Write",
    requestedData: {
      LoginId: null,
      Mobile: 6374024010,
      Email: null,
      Password: null,
      LibraryId: null,
      UserType: "customer",
      BusinessName: "PixelBooks",
      DeviceId: null,
      LoginType: {
        Id: 1,
        Value: "WebLogin",
      },
      ExternalLogin: null,
      IsMobile: false,
    },
    auditInfo: {
      ipAddress: "103.156.209.165, 104.23.216.74:10529",
      browserInfo:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
  },
  {
    id: "log-2",
    timestamp: "24 Jul 2026, 5:13 PM",
    isoDate: "2026-07-24",
    user: "Business Admin",
    message: "Login OTP 126113 generated for User Id: 2271",
    app: "Login",
    module: "Login",
    event: "Fetch",
    action: "Write",
    requestedData: {
      UserId: 2271,
      OtpCode: "126113",
      Channel: "SMS",
      ExpirySeconds: 300,
      AttemptCount: 1,
    },
    auditInfo: {
      ipAddress: "103.156.209.165",
      browserInfo:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    },
  },
  {
    id: "log-3",
    timestamp: "24 Jul 2026, 5:12 PM",
    isoDate: "2026-07-24",
    user: "Business Admin",
    message: "The book 'John M Upton' (ID: 4629) has been approved.",
    app: "Business Admin",
    module: "eBook",
    event: "Update",
    action: "Write",
    requestedData: {
      BookId: 4629,
      Title: "John M Upton",
      Status: "Approved",
      ApprovedBy: "Business Admin",
      ApprovalTimestamp: "2026-07-24T17:12:00Z",
      RoyaltySharePercentage: 15,
    },
    auditInfo: {
      ipAddress: "103.156.209.165, 104.23.216.74:10529",
      browserInfo:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
  },
  {
    id: "log-4",
    timestamp: "24 Jul 2026, 5:12 PM",
    isoDate: "2026-07-24",
    user: "Business Admin",
    message: "Category 'Fantasy Fiction' status updated to Enabled.",
    app: "Business Admin",
    module: "Category",
    event: "Update",
    action: "Write",
    requestedData: {
      CategoryId: "cat-1",
      CategoryName: "Fantasy Fiction",
      PreviousStatus: "Disabled",
      NewStatus: "Enabled",
      UpdatedBy: "Business Admin",
    },
    auditInfo: {
      ipAddress: "103.156.209.165",
      browserInfo:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
  },
  {
    id: "log-5",
    timestamp: "24 Jul 2026, 4:45 PM",
    isoDate: "2026-07-24",
    user: "Publisher Manager",
    message: "New Bundle 'Summer Tech Essentials 2026' created.",
    app: "Publisher Portal",
    module: "Bundle",
    event: "Create",
    action: "Write",
    requestedData: {
      BundleId: "bdl-902",
      Title: "Summer Tech Essentials 2026",
      BookCount: 5,
      BundlePrice: 149.99,
      CreatedBy: "Publisher Manager",
    },
    auditInfo: {
      ipAddress: "198.51.100.42",
      browserInfo:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    },
  },
  {
    id: "log-6",
    timestamp: "24 Jul 2026, 3:30 PM",
    isoDate: "2026-07-24",
    user: "Business Admin",
    message: "Promo Code 'SUMMER25' updated with discount 25%.",
    app: "Business Admin",
    module: "Promo Code",
    event: "Update",
    action: "Write",
    requestedData: {
      PromoCode: "SUMMER25",
      DiscountPercentage: 25,
      ValidFrom: "2026-07-01",
      ValidTo: "2026-08-31",
      MaxRedemptions: 500,
    },
    auditInfo: {
      ipAddress: "103.156.209.165",
      browserInfo: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  },
  {
    id: "log-7",
    timestamp: "24 Jul 2026, 2:15 PM",
    isoDate: "2026-07-24",
    user: "Library Admin",
    message: "Library User 'Stanford Central' subscription renewed.",
    app: "Library Admin",
    module: "Customer",
    event: "Update",
    action: "Write",
    requestedData: {
      LibraryId: "lib-301",
      LibraryName: "Stanford Central",
      SubscriptionPlan: "Enterprise Academic",
      RenewalDate: "2026-07-24",
    },
    auditInfo: {
      ipAddress: "172.56.21.90",
      browserInfo: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    },
  },
  {
    id: "log-8",
    timestamp: "24 Jul 2026, 1:05 PM",
    isoDate: "2026-07-24",
    user: "System Admin",
    message: "Commission rate for Publisher ID 'pub-44' updated to 12.5%.",
    app: "Business Admin",
    module: "Commission Rate",
    event: "Update",
    action: "Write",
    requestedData: {
      PublisherId: "pub-44",
      OldRate: 15.0,
      NewRate: 12.5,
      EffectiveDate: "2026-08-01",
    },
    auditInfo: {
      ipAddress: "104.23.216.74",
      browserInfo: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0.0.0",
    },
  },
  {
    id: "log-9",
    timestamp: "24 Jul 2026, 11:30 AM",
    isoDate: "2026-07-24",
    user: "Business Admin",
    message: "Admin user 'sarah.j@pixelbooks.com' permissions updated.",
    app: "Business Admin",
    module: "Admin User",
    event: "Update",
    action: "Write",
    requestedData: {
      AdminUserId: "usr-882",
      AddedPermissions: ["reports_analytics", "commission_rates"],
      Role: "Analytics Manager",
    },
    auditInfo: {
      ipAddress: "103.156.209.165",
      browserInfo: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115.0.0.0",
    },
  },
  {
    id: "log-10",
    timestamp: "24 Jul 2026, 09:15 AM",
    isoDate: "2026-07-24",
    user: "Business Admin",
    message: "Author profile 'Dr. Amanda Vance' merged into ID: 8812.",
    app: "Business Admin",
    module: "Author",
    event: "Update",
    action: "Write",
    requestedData: {
      SourceAuthorId: "auth-551",
      TargetAuthorId: "auth-8812",
      TitlesTransferred: 4,
    },
    auditInfo: {
      ipAddress: "103.156.209.165",
      browserInfo: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115.0.0.0",
    },
  },
];

const APPLICATION_OPTIONS = [
  "Select Application",
  "Login",
  "Business Admin",
  "Publisher Portal",
  "Library Admin",
  "Library User",
];

const MODULE_OPTIONS = [
  "Select Analytics",
  "Login",
  "eBook",
  "Category",
  "Bundle",
  "Customer",
  "Promo Code",
  "Commission Rate",
  "Admin User",
  "Author",
];

const EVENT_OPTIONS = [
  "Select Event",
  "Fetch",
  "Update",
  "Create",
  "Delete",
  "Sign In",
  "OTP Generation",
];

function AuditLogPage() {
  const [logs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [appFilter, setAppFilter] = useState("Select Application");
  const [moduleFilter, setModuleFilter] = useState("Select Analytics");
  const [eventFilter, setEventFilter] = useState("Select Event");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [expandedLogIds, setExpandedLogIds] = useState<string[]>(["log-1"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  const itemsPerPage = 10;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (dateRange) count++;
    if (appFilter !== "Select Application") count++;
    if (moduleFilter !== "Select Analytics") count++;
    if (eventFilter !== "Select Event") count++;
    return count;
  }, [dateRange, appFilter, moduleFilter, eventFilter]);

  const toggleRowExpanded = (id: string) => {
    setExpandedLogIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDateRange("");
    setAppFilter("Select Application");
    setModuleFilter("Select Analytics");
    setEventFilter("Select Event");
    setCurrentPage(1);
    toast.success("Filters reset");
  };

  const handleCopyJson = (id: string, jsonData: object, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    setCopiedLogId(id);
    toast.success("Requested Data JSON copied to clipboard!");
    setTimeout(() => {
      setCopiedLogId(null);
    }, 2000);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      if (appFilter !== "Select Application" && item.app !== appFilter) return false;
      if (moduleFilter !== "Select Analytics" && item.module !== moduleFilter) return false;
      if (eventFilter !== "Select Event" && item.event !== eventFilter) return false;

      if (dateRange) {
        if (!item.isoDate.includes(dateRange) && !item.timestamp.includes(dateRange)) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesUser = item.user.toLowerCase().includes(query);
        const matchesMessage = item.message.toLowerCase().includes(query);
        const matchesApp = item.app.toLowerCase().includes(query);
        const matchesModule = item.module.toLowerCase().includes(query);
        const matchesEvent = item.event.toLowerCase().includes(query);
        if (
          !matchesUser &&
          !matchesMessage &&
          !matchesApp &&
          !matchesModule &&
          !matchesEvent
        ) {
          return false;
        }
      }

      return true;
    });
  }, [logs, searchQuery, dateRange, appFilter, moduleFilter, eventFilter]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  return (
    <AppShell
      title="Audit Log"
      subtitle="Track system activity, user authentication events, and data modification audit trails"
    >
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-5">
        {/* Search & Expandable Filters Toolbar Bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search audit logs by user, message, app..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-xs font-medium outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
          </div>

          {/* Filter Toggle Button (Right of Search) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsFiltersOpen((prev) => !prev)}
              className={`flex h-11 items-center gap-2 rounded-lg border px-4 text-xs font-semibold transition-all cursor-pointer outline-none ${
                isFiltersOpen || activeFilterCount > 0
                  ? "border-[var(--brand)] bg-[var(--sidebar-highlight)] text-[var(--brand)]"
                  : "border-border bg-card text-foreground hover:bg-secondary/40"
              }`}
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)] text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
              {isFiltersOpen ? (
                <ChevronUp size={14} className="ml-0.5" />
              ) : (
                <ChevronDown size={14} className="ml-0.5" />
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex h-11 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
                title="Reset all filters"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable Filters Panel */}
        {isFiltersOpen && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Date Range Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Date Range
                </label>
                <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3 cursor-pointer transition-colors focus-within:border-[var(--brand)]">
                  <input
                    type="text"
                    placeholder="Pick a date range"
                    value={dateRange}
                    onChange={(e) => {
                      setDateRange(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <CalendarIcon size={16} className="text-muted-foreground shrink-0 ml-2" />
                </label>
              </div>

              {/* Application Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Application
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] cursor-pointer"
                    >
                      <span className="truncate">{appFilter}</span>
                      <ChevronDown size={15} className="shrink-0 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px] rounded-lg bg-card border-border shadow-lg py-1 z-50">
                    {APPLICATION_OPTIONS.map((opt) => (
                      <DropdownMenuItem
                        key={opt}
                        onClick={() => {
                          setAppFilter(opt);
                          setCurrentPage(1);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer ${
                          appFilter === opt
                            ? "font-semibold text-foreground bg-[var(--sidebar-highlight)]"
                            : "text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        <span>{opt}</span>
                        {appFilter === opt && (
                          <Check size={14} className="text-[var(--brand)]" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Module Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Module
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] cursor-pointer"
                    >
                      <span className="truncate">{moduleFilter}</span>
                      <ChevronDown size={15} className="shrink-0 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px] rounded-lg bg-card border-border shadow-lg py-1 z-50">
                    {MODULE_OPTIONS.map((opt) => (
                      <DropdownMenuItem
                        key={opt}
                        onClick={() => {
                          setModuleFilter(opt);
                          setCurrentPage(1);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer ${
                          moduleFilter === opt
                            ? "font-semibold text-foreground bg-[var(--sidebar-highlight)]"
                            : "text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        <span>{opt}</span>
                        {moduleFilter === opt && (
                          <Check size={14} className="text-[var(--brand)]" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Event Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Event
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] cursor-pointer"
                    >
                      <span className="truncate">{eventFilter}</span>
                      <ChevronDown size={15} className="shrink-0 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px] rounded-lg bg-card border-border shadow-lg py-1 z-50">
                    {EVENT_OPTIONS.map((opt) => (
                      <DropdownMenuItem
                        key={opt}
                        onClick={() => {
                          setEventFilter(opt);
                          setCurrentPage(1);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer ${
                          eventFilter === opt
                            ? "font-semibold text-foreground bg-[var(--sidebar-highlight)]"
                            : "text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        <span>{opt}</span>
                        {eventFilter === opt && (
                          <Check size={14} className="text-[var(--brand)]" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Chips Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs font-medium text-muted-foreground mr-1">Active filters:</span>

            {dateRange && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-2xs">
                <span>Date: {dateRange}</span>
                <button
                  type="button"
                  onClick={() => setDateRange("")}
                  className="rounded-full p-0.5 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {appFilter !== "Select Application" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-2xs">
                <span>App: {appFilter}</span>
                <button
                  type="button"
                  onClick={() => setAppFilter("Select Application")}
                  className="rounded-full p-0.5 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {moduleFilter !== "Select Analytics" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-2xs">
                <span>Module: {moduleFilter}</span>
                <button
                  type="button"
                  onClick={() => setModuleFilter("Select Analytics")}
                  className="rounded-full p-0.5 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {eventFilter !== "Select Event" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-2xs">
                <span>Event: {eventFilter}</span>
                <button
                  type="button"
                  onClick={() => setEventFilter("Select Event")}
                  className="rounded-full p-0.5 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-medium text-[var(--brand)] hover:underline ml-1 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Audit Log Table Container */}
        <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-semibold text-foreground bg-muted/20">
                  <th className="py-4 px-6 w-[45%]">Log</th>
                  <th className="py-4 px-6 w-[15%]">App</th>
                  <th className="py-4 px-6 w-[15%]">Module</th>
                  <th className="py-4 px-6 w-[12%]">Event</th>
                  <th className="py-4 px-6 w-[10%]">Action</th>
                  <th className="py-4 px-4 w-[3%] text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((entry) => {
                    const isExpanded = expandedLogIds.includes(entry.id);
                    return (
                      <tr key={entry.id} className="group border-b border-border/60 last:border-b-0">
                        <td colSpan={6} className="p-0">
                          {/* Parent Row */}
                          <div
                            onClick={() => toggleRowExpanded(entry.id)}
                            className={`flex items-start justify-between w-full py-4 px-6 transition-colors cursor-pointer hover:bg-secondary/50 ${
                              isExpanded ? "bg-muted/20" : ""
                            }`}
                          >
                            <div className="grid grid-cols-12 w-full items-start gap-4">
                              {/* Log Column */}
                              <div className="col-span-5 space-y-0.5 pr-2">
                                <span className="text-[11px] font-medium text-muted-foreground block">
                                  {entry.timestamp}
                                </span>
                                <span className="text-xs font-semibold text-foreground block">
                                  {entry.user}
                                </span>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                                  {entry.message}
                                </p>
                              </div>

                              {/* App Column */}
                              <div className="col-span-2 text-xs font-medium text-foreground pt-0.5">
                                {entry.app}
                              </div>

                              {/* Module Column */}
                              <div className="col-span-2 text-xs font-medium text-foreground pt-0.5">
                                {entry.module}
                              </div>

                              {/* Event Column */}
                              <div className="col-span-1 text-xs font-medium text-foreground pt-0.5">
                                {entry.event}
                              </div>

                              {/* Action Column */}
                              <div className="col-span-1 text-xs font-medium text-foreground pt-0.5">
                                {entry.action}
                              </div>

                              {/* Expand Toggle Column */}
                              <div className="col-span-1 text-right pt-0.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRowExpanded(entry.id);
                                  }}
                                  className="p-1 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
                                  aria-label="Toggle audit log detail"
                                >
                                  {isExpanded ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Full-Width Section */}
                          {isExpanded && (
                            <div className="w-full bg-muted/10 border-t border-border/50 p-6 space-y-4">
                              {/* Requested Data Card (Full Width) */}
                              <div className="w-full rounded-xl border border-border bg-card p-5 space-y-3 shadow-2xs">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                                    <Terminal size={14} className="text-muted-foreground" />
                                    Requested Data
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      handleCopyJson(entry.id, entry.requestedData, e)
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
                                  >
                                    {copiedLogId === entry.id ? (
                                      <>
                                        <Check size={12} className="text-emerald-500" />
                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                          Copied
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy size={12} />
                                        <span>Copy JSON</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <div className="w-full rounded-xl border border-border/70 bg-muted/30 p-4 font-mono text-xs text-foreground overflow-x-auto">
                                  <pre className="text-xs font-mono leading-relaxed text-foreground whitespace-pre">
                                    {JSON.stringify(entry.requestedData, null, 2)}
                                  </pre>
                                </div>
                              </div>

                              {/* Audit Info Card (Full Width) */}
                              <div className="w-full rounded-xl border border-border bg-card p-5 space-y-3 shadow-2xs">
                                <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                                  <ShieldCheck size={14} className="text-muted-foreground" />
                                  Audit Info
                                </h4>

                                <div className="w-full rounded-xl border border-border/70 bg-muted/30 p-4 space-y-2 text-xs text-foreground">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                    <span className="font-semibold text-muted-foreground shrink-0 min-w-[90px]">
                                      IP Address:
                                    </span>
                                    <span className="font-mono text-foreground">
                                      {entry.auditInfo.ipAddress}
                                    </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                                    <span className="font-semibold text-muted-foreground shrink-0 min-w-[90px]">
                                      Browser Info:
                                    </span>
                                    <span className="font-mono text-foreground break-all">
                                      {entry.auditInfo.browserInfo}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Terminal size={32} className="text-muted-foreground/50" />
                        <p className="text-base font-medium">No audit logs found</p>
                        <p className="text-xs">
                          Try adjusting your search query or filter options.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
          <div className="text-xs sm:text-sm text-foreground font-normal">
            Showing <span className="font-semibold">{paginatedLogs.length}</span> from{" "}
            <span className="font-semibold">{filteredLogs.length}</span> results
          </div>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronsLeft size={15} />
              Previous
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
              (pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Next
              <ChevronsRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
