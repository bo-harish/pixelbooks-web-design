import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronRight,
  Search,
  ChevronDown,
  Building2,
  User,
  Percent,
  Sparkles,
  Users,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/pb-admin/commission-rates")({
  component: CommissionRates,
});

interface CommissionItem {
  id: string;
  name: string;
  type: "Publisher" | "Author";
  rate: string;
  rateValue: number;
  isCustom: boolean;
  date: string;
  avatarBg: string;
  email: string;
  location: string;
}

const commissionData: CommissionItem[] = [
  {
    id: "1",
    name: "Werley Nortreus",
    type: "Author",
    rate: "15%",
    rateValue: 15,
    isCustom: false,
    date: "14 Jul 2026",
    avatarBg: "oklch(0.55 0.11 195)",
    email: "werley@brandoptics.com",
    location: "Noida, India",
  },
  {
    id: "2",
    name: "RJ Authors",
    type: "Author",
    rate: "18%",
    rateValue: 18,
    isCustom: true,
    date: "10 Jul 2026",
    avatarBg: "oklch(0.55 0.15 260)",
    email: "rj.authors@brandoptics.com",
    location: "Delhi, India",
  },
  {
    id: "3",
    name: "QA-TBH Publishers",
    type: "Publisher",
    rate: "15%",
    rateValue: 15,
    isCustom: false,
    date: "10 Jul 2026",
    avatarBg: "oklch(0.50 0.12 150)",
    email: "qa.tbh@brandoptics.com",
    location: "Mumbai, India",
  },
  {
    id: "4",
    name: "Abu",
    type: "Publisher",
    rate: "12.5%",
    rateValue: 12.5,
    isCustom: true,
    date: "10 Jul 2026",
    avatarBg: "oklch(0.55 0.13 320)",
    email: "abu@brandoptics.com",
    location: "Bengaluru, India",
  },
  {
    id: "5",
    name: "qa test pub",
    type: "Publisher",
    rate: "15%",
    rateValue: 15,
    isCustom: false,
    date: "10 Jul 2026",
    avatarBg: "oklch(0.52 0.08 230)",
    email: "qatest@brandoptics.com",
    location: "Chennai, India",
  },
  {
    id: "6",
    name: "Veena",
    type: "Publisher",
    rate: "20%",
    rateValue: 20,
    isCustom: true,
    date: "10 Jul 2026",
    avatarBg: "oklch(0.55 0.13 260)",
    email: "veena@brandoptics.com",
    location: "Hyderabad, India",
  },
  {
    id: "7",
    name: "QA",
    type: "Publisher",
    rate: "15%",
    rateValue: 15,
    isCustom: false,
    date: "10 Jul 2026",
    avatarBg: "oklch(0.48 0.10 200)",
    email: "qa@brandoptics.com",
    location: "Pune, India",
  },
  {
    id: "8",
    name: "QA-TBH Publishers And Distributors",
    type: "Publisher",
    rate: "15%",
    rateValue: 15,
    isCustom: false,
    date: "10 Jul 2026",
    avatarBg: "oklch(0.52 0.12 170)",
    email: "distributors@brandoptics.com",
    location: "Kolkata, India",
  },
  {
    id: "9",
    name: "OBook Publication",
    type: "Publisher",
    rate: "14%",
    rateValue: 14,
    isCustom: true,
    date: "10 Jul 2026",
    avatarBg: "oklch(0.58 0.14 80)",
    email: "obook@brandoptics.com",
    location: "Ahmedabad, India",
  },
  {
    id: "10",
    name: "SP Publications",
    type: "Publisher",
    rate: "15%",
    rateValue: 15,
    isCustom: false,
    date: "10 Jul 2026",
    avatarBg: "oklch(0.50 0.14 275)",
    email: "sp.pub@brandoptics.com",
    location: "Jaipur, India",
  },
];

function CommissionRates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [publisherFilter, setPublisherFilter] = useState("Publisher & Author");
  const [publisherFilterOpen, setPublisherFilterOpen] = useState(false);

  const [rateFilter, setRateFilter] = useState("Rate Type");
  const [rateFilterOpen, setRateFilterOpen] = useState(false);

  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [newCommissionRate, setNewCommissionRate] = useState("");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredData = commissionData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      publisherFilter === "Publisher & Author" || item.type === publisherFilter;

    const matchesRateType =
      rateFilter === "Rate Type" ||
      rateFilter === "All" ||
      (rateFilter === "Default Rate" && !item.isCustom) ||
      (rateFilter === "Other Rate" && item.isCustom);

    return matchesSearch && matchesRole && matchesRateType;
  });

  const handleUpdateCommission = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCommissionModalOpen(false);
    setNewCommissionRate("");
  };

  return (
    <AppShell
      title="Commission Rates"
      subtitle="View and manage commission rates across your network."
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md justify-between min-h-[128px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Enrolled
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <Users size={18} />
              </span>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-foreground tracking-tight">
                {commissionData.length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Publishers & Authors</p>
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md justify-between min-h-[128px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Avg Commission
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Percent size={18} />
              </span>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                15.4%
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Network Average Rate</p>
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md justify-between min-h-[128px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Default Base Rate
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <TrendingUp size={18} />
              </span>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 tracking-tight">
                15.0%
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Standard Platform Commission</p>
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md justify-between min-h-[128px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Custom Override Rates
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Sparkles size={18} />
              </span>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                {commissionData.filter((d) => d.isCustom).length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Special Tier Contracts</p>
            </div>
          </div>
        </div>

        {/* Top Controls: Search & Filters */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1 w-full lg:max-w-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Publisher or Author name..."
                className="h-11 w-full rounded-lg border border-border bg-white dark:bg-card pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] text-foreground"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center md:gap-3 w-full lg:w-auto">
            {/* Publisher & Author Custom Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => {
                  setPublisherFilterOpen(!publisherFilterOpen);
                  setRateFilterOpen(false);
                }}
                className="flex h-11 w-full items-center justify-between gap-4 rounded-lg border border-border bg-card px-3.5 text-sm font-medium sm:w-52 text-foreground cursor-pointer transition-colors hover:bg-secondary/40"
              >
                <span className="truncate">{publisherFilter}</span>
                <ChevronDown size={15} className="text-muted-foreground shrink-0" />
              </button>
              {publisherFilterOpen && (
                <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-52 py-1">
                  {["Publisher & Author", "Publisher", "Author"].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPublisherFilter(p);
                        setPublisherFilterOpen(false);
                      }}
                      className={`flex w-full items-center px-3.5 py-2 text-left text-sm transition-colors hover:bg-secondary/60 cursor-pointer ${
                        p === publisherFilter
                          ? "font-semibold text-[var(--brand)] bg-[var(--brand)]/5"
                          : "text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rate Type Custom Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => {
                  setRateFilterOpen(!rateFilterOpen);
                  setPublisherFilterOpen(false);
                }}
                className="flex h-11 w-full items-center justify-between gap-4 rounded-lg border border-border bg-card px-3.5 text-sm font-medium sm:w-40 text-foreground cursor-pointer transition-colors hover:bg-secondary/40"
              >
                <span className="truncate">{rateFilter}</span>
                <ChevronDown size={15} className="text-muted-foreground shrink-0" />
              </button>
              {rateFilterOpen && (
                <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-40 py-1">
                  {["Rate Type", "All", "Default Rate", "Other Rate"].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setRateFilter(p);
                        setRateFilterOpen(false);
                      }}
                      className={`flex w-full items-center px-3.5 py-2 text-left text-sm transition-colors hover:bg-secondary/60 cursor-pointer ${
                        p === rateFilter
                          ? "font-semibold text-[var(--brand)] bg-[var(--brand)]/5"
                          : "text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bulk Update Action */}
            <button
              onClick={() => setIsCommissionModalOpen(true)}
              className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[var(--brand)] text-white px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] shadow-xs cursor-pointer"
            >
              <SlidersHorizontal size={16} />
              Bulk Update Rates
            </button>
          </div>
        </div>

        {/* Table Listing */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 px-6 font-semibold">Publisher / Author Name</th>
                  <th className="py-3.5 px-6 font-semibold whitespace-nowrap text-center">
                    Commission Rate
                  </th>
                  <th className="py-3.5 px-6 font-semibold">Date Updated</th>
                  <th className="py-3.5 pr-6 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground text-sm">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() =>
                        navigate({
                          to: "/pb-admin/commission-rates/$id",
                          params: { id: item.id },
                        })
                      }
                      className="group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/50"
                    >
                      {/* Column 1: Publisher / Author Name with pb-admin/publishers-authors exact profile pic style */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-2xs"
                            style={{ background: item.avatarBg }}
                          >
                            {getInitials(item.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-[var(--brand)] transition-colors">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                              {item.type === "Publisher" ? (
                                <Building2 size={11} className="inline text-muted-foreground/80" />
                              ) : (
                                <User size={11} className="inline text-muted-foreground/80" />
                              )}
                              <span>{item.type}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Commission Rate (Uniform Width Highlighted Badge) */}
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center justify-between w-[150px] px-3.5 py-1.5 rounded-xl border border-border bg-card shadow-2xs group-hover:border-[var(--brand)]/40 transition-colors">
                          <span className="text-base font-extrabold text-foreground tracking-tight">
                            {item.rate}
                          </span>
                          {item.isCustom ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <Sparkles size={9} />
                              Custom
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Default
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 3: Date */}
                      <td className="py-4 px-6 font-medium text-muted-foreground text-xs sm:text-sm">
                        {item.date}
                      </td>

                      {/* Column 4: Chevron matching publisher/catalogue style */}
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
        </div>

        {/* Footer Pagination Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
          <span className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredData.length}</span>{" "}
            from <span className="font-semibold text-foreground">{commissionData.length}</span>{" "}
            results
          </span>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-muted-foreground opacity-50 cursor-not-allowed">
              <span>Previous</span>
            </button>
            <button className="h-8 w-8 rounded-lg text-xs font-semibold border transition-all bg-[var(--brand)] text-white border-[var(--brand)]">
              1
            </button>
            <button className="h-8 w-8 rounded-lg text-xs font-semibold border transition-all bg-card text-muted-foreground border-border hover:bg-secondary/40 hover:text-foreground">
              2
            </button>
            <button className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors cursor-pointer">
              <span>Next</span>
            </button>
          </div>
        </div>

        {/* Set Commission Modal Dialog */}
        <Dialog open={isCommissionModalOpen} onOpenChange={setIsCommissionModalOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-xl shadow-xl p-6">
            <div className="border-b border-border pb-4 mb-4">
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                Set Bulk Commission Rate
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Apply a uniform commission rate percentage to selected user categories.
              </p>
            </div>

            <form onSubmit={handleUpdateCommission} className="space-y-5 text-sm">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Select User Type
                  </label>
                  <div className="relative">
                    <select
                      value={publisherFilter !== "Publisher & Author" ? publisherFilter : "Publisher"}
                      onChange={(e) => setPublisherFilter(e.target.value)}
                      className="h-11 w-full appearance-none rounded-lg border border-border bg-card px-3.5 text-sm focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)] text-foreground font-medium"
                    >
                      <option value="Publisher">All Publishers</option>
                      <option value="Author">All Authors</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Rate Filter Scope
                  </label>
                  <div className="relative">
                    <select
                      value={rateFilter !== "Rate Type" ? rateFilter : ""}
                      onChange={(e) => setRateFilter(e.target.value || "Rate Type")}
                      className="h-11 w-full appearance-none rounded-lg border border-border bg-card px-3.5 text-sm focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)] text-foreground font-medium"
                    >
                      <option value="">All Rates</option>
                      <option value="Default Rate">Default Rates Only</option>
                      <option value="Other Rate">Custom Override Rates</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  <label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    New Commission Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={newCommissionRate}
                      onChange={(e) => setNewCommissionRate(e.target.value)}
                      placeholder="e.g. 15"
                      className="h-11 w-full rounded-lg border border-border bg-card pl-3.5 pr-10 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)] focus:border-[var(--brand)]"
                      required
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="absolute right-3 text-muted-foreground font-bold text-sm">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setIsCommissionModalOpen(false)}
                  className="h-10 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-muted-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[var(--brand)] text-white px-6 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                >
                  Apply Rate
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
