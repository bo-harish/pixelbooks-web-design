import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Users,
  Clock3,
  BookOpen,
  BookMarked,
  ChevronDown,
  Building2,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Tag,
  Library,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/pb-admin-lib/")({
  component: PBAdminLibraryDashboard,
});

/* -------------------------------------------------------------------------- */
/*                                 MOCK DATA                                  */
/* -------------------------------------------------------------------------- */

type LibraryStat = {
  id: string;
  label: string;
  value: string;
  changePct?: string;
  changeLabel?: string;
  icon: LucideIcon;
  defaultRange: string;
};

const libraryStatsData: LibraryStat[] = [
  {
    id: "sales-revenue",
    label: "TOTAL EBOOK SALES",
    value: "₹48,896.46",
    changePct: "-63.56%",
    changeLabel: "lower than last month",
    icon: Tag,
    defaultRange: "Monthly",
  },
  {
    id: "libraries",
    label: "LIBRARIES ONBOARDED",
    value: "3",
    changePct: "-88.89%",
    changeLabel: "lower than last year",
    icon: Building2,
    defaultRange: "Yearly",
  },
  {
    id: "ebooks-purchased",
    label: "TOTAL EBOOKS PURCHASED",
    value: "9,829",
    changePct: "-98.47%",
    changeLabel: "lower than last year",
    icon: BookOpen,
    defaultRange: "Yearly",
  },
  {
    id: "order-requests",
    label: "LIBRARY ORDER REQUESTS",
    value: "9",
    changePct: "+12.5%",
    changeLabel: "higher than last month",
    icon: BookMarked,
    defaultRange: "Monthly",
  },
];

const librarySalesDataMap: Record<string, { month: string; sales: number }[]> = {
  "FY (2026 - 2027)": [
    { month: "Apr", sales: 1950 },
    { month: "May", sales: 0 },
    { month: "Jun", sales: 3100 },
    { month: "Jul", sales: 0 },
    { month: "Aug", sales: 500 },
    { month: "Sep", sales: 0 },
    { month: "Oct", sales: 0 },
    { month: "Nov", sales: 0 },
    { month: "Dec", sales: 0 },
    { month: "Jan", sales: 0 },
    { month: "Feb", sales: 0 },
    { month: "Mar", sales: 0 },
  ],
  "FY (2025 - 2026)": [
    { month: "Apr", sales: 1200 },
    { month: "May", sales: 2400 },
    { month: "Jun", sales: 1800 },
    { month: "Jul", sales: 2900 },
    { month: "Aug", sales: 1500 },
    { month: "Sep", sales: 2100 },
    { month: "Oct", sales: 3200 },
    { month: "Nov", sales: 1100 },
    { month: "Dec", sales: 2700 },
    { month: "Jan", sales: 1900 },
    { month: "Feb", sales: 1400 },
    { month: "Mar", sales: 3300 },
  ],
  "FY (2024 - 2025)": [
    { month: "Apr", sales: 800 },
    { month: "May", sales: 1400 },
    { month: "Jun", sales: 2200 },
    { month: "Jul", sales: 1600 },
    { month: "Aug", sales: 2800 },
    { month: "Sep", sales: 1900 },
    { month: "Oct", sales: 2500 },
    { month: "Nov", sales: 1700 },
    { month: "Dec", sales: 3100 },
    { month: "Jan", sales: 1200 },
    { month: "Feb", sales: 2100 },
    { month: "Mar", sales: 2900 },
  ],
};

const topLibrarySalesPie = [
  { name: "APJ Abdul Kalam Technological University", value: 99.28, color: "#22c55e" },
  { name: "The District Central Library, Salem", value: 0.56, color: "#2dd4bf" },
  { name: "National University of Singapore", value: 0.13, color: "#0d9488" },
];

const recentlyAddedLibraries = [
  {
    id: "lib-1",
    name: "The District Central Library",
    location: "Ernakulam",
    activeUsers: 2,
    totalUsers: 9,
    ebooksPurchased: 13,
    amount: "₹14,736.75",
    initials: "DCL",
    bg: "bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20",
  },
  {
    id: "lib-2",
    name: "National University of Advanced Legal S...",
    location: "Banglore",
    activeUsers: 4,
    totalUsers: 37,
    ebooksPurchased: 1807,
    amount: "₹1,399,951.88",
    initials: "NUALS",
    bg: "bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20",
  },
  {
    id: "lib-3",
    name: "PSG",
    location: "Kochi",
    activeUsers: 1,
    totalUsers: 2,
    ebooksPurchased: 1,
    amount: "₹2,000.00",
    initials: "PSG",
    bg: "bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20",
  },
];

/* -------------------------------------------------------------------------- */
/*                              HELPER COMPONENTS                             */
/* -------------------------------------------------------------------------- */

function DropdownPill({
  value,
  onSelect,
  options,
}: {
  value: string;
  onSelect: (value: string) => void;
  options: string[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer shadow-2xs">
          <span>{value}</span>
          <ChevronDown size={13} className="text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onSelect(opt)} className="text-xs font-medium cursor-pointer">
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const RANGES = ["7d", "30d", "90d", "Yearly", "Till Date"] as const;
type TimeRange = (typeof RANGES)[number];

function RangePicker({
  value,
  onChange,
}: {
  value: TimeRange;
  onChange: (r: TimeRange) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Select time range"
      className="inline-flex items-center rounded-xl border border-border bg-card p-1 text-xs font-semibold shadow-2xs"
    >
      {RANGES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          aria-pressed={r === value}
          className="rounded-lg px-3.5 py-1.5 transition-all cursor-pointer"
          style={
            r === value
              ? { backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }
              : { color: "var(--muted-foreground)" }
          }
        >
          {r}
        </button>
      ))}
    </div>
  );
}

const statsByRangeMap: Record<
  string,
  Record<
    string,
    { label: string; value: string; changePct?: string; changeLabel: string; icon: LucideIcon }
  >
> = {
  "sales-revenue": {
    "7d": {
      label: "TOTAL EBOOK SALES",
      value: "₹12,450.00",
      changePct: "-18.4%",
      changeLabel: "lower than last week",
      icon: Tag,
    },
    "30d": {
      label: "TOTAL EBOOK SALES",
      value: "₹48,896.46",
      changePct: "-63.56%",
      changeLabel: "lower than last month",
      icon: Tag,
    },
    "90d": {
      label: "TOTAL EBOOK SALES",
      value: "₹185,420.00",
      changePct: "+14.2%",
      changeLabel: "higher than last quarter",
      icon: Tag,
    },
    Yearly: {
      label: "TOTAL EBOOK SALES",
      value: "₹8,783,777.00",
      changePct: "-90.27%",
      changeLabel: "lower than last year",
      icon: Tag,
    },
    "Till Date": {
      label: "TOTAL EBOOK SALES",
      value: "₹42,890,500.00",
      changeLabel: "All-Time Cumulative Sales",
      icon: Tag,
    },
  },
  libraries: {
    "7d": {
      label: "LIBRARIES ONBOARDED",
      value: "1",
      changePct: "0.0%",
      changeLabel: "same as last week",
      icon: Building2,
    },
    "30d": {
      label: "LIBRARIES ONBOARDED",
      value: "3",
      changePct: "-25.0%",
      changeLabel: "lower than last month",
      icon: Building2,
    },
    "90d": {
      label: "LIBRARIES ONBOARDED",
      value: "8",
      changePct: "+33.3%",
      changeLabel: "higher than last quarter",
      icon: Building2,
    },
    Yearly: {
      label: "LIBRARIES ONBOARDED",
      value: "14",
      changePct: "-40.0%",
      changeLabel: "lower than last year",
      icon: Building2,
    },
    "Till Date": {
      label: "LIBRARIES ONBOARDED",
      value: "48",
      changeLabel: "Active Partner Institutions",
      icon: Building2,
    },
  },
  "ebooks-purchased": {
    "7d": {
      label: "TOTAL EBOOKS PURCHASED",
      value: "420",
      changePct: "-15.2%",
      changeLabel: "lower than last week",
      icon: BookOpen,
    },
    "30d": {
      label: "TOTAL EBOOKS PURCHASED",
      value: "1,850",
      changePct: "-32.1%",
      changeLabel: "lower than last month",
      icon: BookOpen,
    },
    "90d": {
      label: "TOTAL EBOOKS PURCHASED",
      value: "5,240",
      changePct: "+8.7%",
      changeLabel: "higher than last quarter",
      icon: BookOpen,
    },
    Yearly: {
      label: "TOTAL EBOOKS PURCHASED",
      value: "9,829",
      changePct: "-98.47%",
      changeLabel: "lower than last year",
      icon: BookOpen,
    },
    "Till Date": {
      label: "TOTAL EBOOKS PURCHASED",
      value: "184,250",
      changeLabel: "Total Licenses Distributed",
      icon: BookOpen,
    },
  },
  "order-requests": {
    "7d": {
      label: "LIBRARY ORDER REQUESTS",
      value: "2",
      changePct: "+100%",
      changeLabel: "higher than last week",
      icon: BookMarked,
    },
    "30d": {
      label: "LIBRARY ORDER REQUESTS",
      value: "9",
      changePct: "+12.5%",
      changeLabel: "higher than last month",
      icon: BookMarked,
    },
    "90d": {
      label: "LIBRARY ORDER REQUESTS",
      value: "28",
      changePct: "+21.4%",
      changeLabel: "higher than last quarter",
      icon: BookMarked,
    },
    Yearly: {
      label: "LIBRARY ORDER REQUESTS",
      value: "112",
      changePct: "-18.2%",
      changeLabel: "lower than last year",
      icon: BookMarked,
    },
    "Till Date": {
      label: "LIBRARY ORDER REQUESTS",
      value: "640",
      changeLabel: "All-Time Institutional Orders",
      icon: BookMarked,
    },
  },
};

const statCardKeys = ["sales-revenue", "libraries", "ebooks-purchased", "order-requests"] as const;

/* -------------------------------------------------------------------------- */
/*                               MAIN DASHBOARD                               */
/* -------------------------------------------------------------------------- */

function PBAdminLibraryDashboard() {
  const [globalRange, setGlobalRange] = useState<TimeRange>("30d");
  const [fySelection, setFySelection] = useState("FY (2026 - 2027)");
  const [topSalesRange, setTopSalesRange] = useState<string>("30d");

  const [cardRanges, setCardRanges] = useState<Record<string, string>>({
    "sales-revenue": "30d",
    libraries: "30d",
    "ebooks-purchased": "30d",
    "order-requests": "30d",
  });

  const rangeOptions = ["7d", "30d", "90d", "Yearly", "Till Date"];

  const dynamicChartConfig = useMemo(() => {
    switch (globalRange) {
      case "7d":
        return {
          subtitle: "Last 7 Days (25 Jul - 31 Jul 2026)",
          data: [
            { month: "25 Jul", sales: 450 },
            { month: "26 Jul", sales: 1200 },
            { month: "27 Jul", sales: 3100 },
            { month: "28 Jul", sales: 2400 },
            { month: "29 Jul", sales: 1800 },
            { month: "30 Jul", sales: 3900 },
            { month: "31 Jul", sales: 2900 },
          ],
        };
      case "30d":
        return {
          subtitle: "Last 30 Days (02 Jul - 31 Jul 2026)",
          data: [
            { month: "Jul 01-05", sales: 1200 },
            { month: "Jul 06-10", sales: 2800 },
            { month: "Jul 11-15", sales: 3400 },
            { month: "Jul 16-20", sales: 1900 },
            { month: "Jul 21-25", sales: 4300 },
            { month: "Jul 26-31", sales: 3100 },
          ],
        };
      case "90d":
        return {
          subtitle: "Last 90 Days (May 2026 - Jul 2026)",
          data: [
            { month: "May 01-15", sales: 2100 },
            { month: "May 16-31", sales: 3800 },
            { month: "Jun 01-15", sales: 2900 },
            { month: "Jun 16-30", sales: 4100 },
            { month: "Jul 01-15", sales: 3200 },
            { month: "Jul 16-31", sales: 4800 },
          ],
        };
      case "Yearly":
        return {
          subtitle: `Fiscal Year (${fySelection})`,
          data: librarySalesDataMap[fySelection] || librarySalesDataMap["FY (2026 - 2027)"],
        };
      case "Till Date":
      default:
        return {
          subtitle: "All-Time Cumulative Sales (2023 - 2026)",
          data: [
            { month: "2023", sales: 18000 },
            { month: "2024", sales: 34000 },
            { month: "2025", sales: 49000 },
            { month: "2026 (YTD)", sales: 38000 },
          ],
        };
    }
  }, [globalRange, fySelection]);

  return (
    <AppShell
      title="Dashboard"
      subtitle="Library administration overview for eBook sales, order requests, and institutional metrics."
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Top Header Row with FY Dropdown and Time Range Filter Pill */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Overview
            </h2>
            <p className="text-xs text-muted-foreground">
              Metrics update automatically based on the selected period and range.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {globalRange === "Yearly" && (
              <DropdownPill
                value={fySelection}
                onSelect={setFySelection}
                options={["FY (2024 - 2025)", "FY (2025 - 2026)", "FY (2026 - 2027)"]}
              />
            )}
            <RangePicker
              value={globalRange}
              onChange={(newR) => {
                setGlobalRange(newR);
                setCardRanges({
                  "sales-revenue": newR,
                  libraries: newR,
                  "ebooks-purchased": newR,
                  "order-requests": newR,
                });
              }}
            />
          </div>
        </div>

        {/* 4 Stat Cards Row */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCardKeys.map((key) => {
            const currentRange = cardRanges[key] || globalRange;
            const stat =
              statsByRangeMap[key]?.[currentRange] ||
              statsByRangeMap[key]?.["30d"] ||
              statsByRangeMap[key]?.["Yearly"];
            const Icon = stat.icon;

            return (
              <div
                key={key}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs transition-all hover:shadow-md min-h-[156px]"
              >
                {/* Header: Label on Left + Mint Icon Badge on Right */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pt-0.5">
                    {stat.label}
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-500/20 shadow-2xs">
                    <Icon size={20} strokeWidth={2} />
                  </span>
                </div>

                {/* Body: Large Bold Metric Display */}
                <div className="mt-3 mb-1">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                </div>

                {/* Footer: Subtext */}
                <div className="pt-1">
                  <p className="text-xs sm:text-[13px] font-medium text-muted-foreground leading-snug">
                    {stat.changePct ? (
                      <span className="mr-1 font-medium">{stat.changePct}</span>
                    ) : null}
                    {stat.changeLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main Content Grid: Left Bar Chart (eBook Library Sales) & Right Donut Chart (Top Library Sales) */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: eBook Library Sales Bar Chart */}
          <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xs flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  eBook Library Sales
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  {dynamicChartConfig.subtitle}
                </p>
              </div>

              {globalRange === "Yearly" && (
                <DropdownPill
                  value={fySelection}
                  onSelect={setFySelection}
                  options={["FY (2026 - 2027)", "FY (2025 - 2026)", "FY (2024 - 2025)"]}
                />
              )}
            </div>

            {/* Bar Chart Container */}
            <div className="h-[280px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicChartConfig.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "color-mix(in oklab, var(--brand) 10%, transparent)" }}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="sales" radius={[4, 4, 0, 0]} barSize={18} fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: Top Library Sales Donut Chart */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Top Library Sales
              </h2>
            </div>

            {/* Donut Chart */}
            <div className="relative flex items-center justify-center h-[230px] my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topLibrarySalesPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={2}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {topLibrarySalesPie.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val}%`, "Share"]}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Below Chart */}
            <div className="grid grid-cols-3 gap-2 border-t border-border/40 pt-4 text-center">
              {topLibrarySalesPie.map((item) => (
                <div key={item.name} className="flex flex-col items-center min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 max-w-full">
                    <span
                      className="h-2 w-2 rounded-xs shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className="text-[11px] font-semibold text-muted-foreground truncate"
                      title={item.name}
                    >
                      {item.name === "APJ Abdul Kalam Technological University"
                        ? "APJ Abdul K..."
                        : item.name === "The District Central Library, Salem"
                          ? "The District ..."
                          : "National Uni..."}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recently Added Library Table */}
        <section className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xs">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              10 Recently Added Libraries
            </h2>
            <Link
              to="/pb-admin-lib/libraries"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline"
            >
              <span>View all</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3.5 pr-4 pl-2">Library</th>
                  <th className="pb-3.5 px-4 text-center">Active Users</th>
                  <th className="pb-3.5 px-4 text-center">Total Users</th>
                  <th className="pb-3.5 px-4 text-center">Total eBook Purchased</th>
                  <th className="pb-3.5 pl-4 pr-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {recentlyAddedLibraries.map((lib) => (
                  <tr key={lib.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-4 pr-4 pl-2 font-semibold text-foreground">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold shadow-2xs ${lib.bg}`}
                        >
                          <Library size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm leading-tight">
                            {lib.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            {lib.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-foreground">
                      {lib.activeUsers}
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-foreground">
                      {lib.totalUsers}
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-foreground">
                      {lib.ebooksPurchased.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 pl-4 pr-2 text-right font-extrabold text-foreground">
                      {lib.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
