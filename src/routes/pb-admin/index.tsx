import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Tag, Users, Clock3, BookOpen, ChevronDown, Star, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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


export const Route = createFileRoute("/pb-admin/")({
  component: PBAdminDashboard,
});

type Stat = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
};

const stats: Stat[] = [
  {
    label: "Total eBook Sales",
    value: "₹48,896.46",
    sub: "-63.56% lower than last month",
    icon: Tag,
  },
  {
    label: "Total eBooks Sold",
    value: "44",
    sub: "117% purchased last month",
    icon: Users,
  },
  {
    label: "Total eBooks Published",
    value: "22",
    sub: "25 eBooks published last month",
    icon: BookOpen,
  },
];

const salesData = [
  { month: "Apr", sales: 80 },
  { month: "May", sales: 420 },
  { month: "Jun", sales: 280 },
  { month: "Jul", sales: 150 },
  { month: "Aug", sales: 0 },
  { month: "Sep", sales: 0 },
  { month: "Oct", sales: 0 },
  { month: "Nov", sales: 0 },
  { month: "Dec", sales: 0 },
  { month: "Jan", sales: 0 },
  { month: "Feb", sales: 0 },
  { month: "Mar", sales: 0 },
];

const topSellingBooks = [
  {
    title: "Heart's Key",
    category: "Action & Adventure",
    rating: 4.5,
    baseViews: 145,
    baseSales: 420,
    baseRevenue: 104500,
    initials: "HK",
    cover: "linear-gradient(160deg, oklch(0.20 0.06 200), oklch(0.12 0.04 200))",
  },
  {
    title: "ePub Test Book",
    category: "Action & Adventure",
    rating: 4.0,
    baseViews: 129,
    baseSales: 310,
    baseRevenue: 77500,
    initials: "ET",
    cover: "linear-gradient(160deg, oklch(0.35 0.12 280), oklch(0.15 0.06 280))",
  },
  {
    title: "The Psychology of Money",
    category: "Biography & Wealth",
    rating: 4.8,
    baseViews: 248,
    baseSales: 280,
    baseRevenue: 68400,
    initials: "PM",
    cover: "linear-gradient(160deg, oklch(0.45 0.12 140), oklch(0.25 0.08 140))",
  },
  {
    title: "NEP 2020: Policy in Education",
    category: "Academic & Research",
    rating: 4.6,
    baseViews: 195,
    baseSales: 240,
    baseRevenue: 59800,
    initials: "NP",
    cover: "linear-gradient(160deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
  },
  {
    title: "A Complete History of Music",
    category: "Arts & Culture",
    rating: 4.2,
    baseViews: 110,
    baseSales: 190,
    baseRevenue: 47500,
    initials: "HM",
    cover: "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
  },
  {
    title: "Knowledge for the Time",
    category: "History & Society",
    rating: 4.1,
    baseViews: 98,
    baseSales: 160,
    baseRevenue: 39600,
    initials: "KT",
    cover: "linear-gradient(160deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
  },
  {
    title: "The Elements of Style",
    category: "Education & Reference",
    rating: 4.9,
    baseViews: 310,
    baseSales: 150,
    baseRevenue: 37200,
    initials: "ES",
    cover: "linear-gradient(160deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
  },
  {
    title: "Digital Marketing Essentials",
    category: "Business & Management",
    rating: 4.4,
    baseViews: 165,
    baseSales: 130,
    baseRevenue: 32500,
    initials: "DM",
    cover: "linear-gradient(160deg, oklch(0.60 0.15 60), oklch(0.40 0.10 60))",
  },
  {
    title: "Data Structures in JavaScript",
    category: "Computer Science",
    rating: 4.7,
    baseViews: 280,
    baseSales: 110,
    baseRevenue: 28600,
    initials: "DS",
    cover: "linear-gradient(160deg, oklch(0.40 0.16 260), oklch(0.22 0.09 260))",
  },
  {
    title: "Financial Management 101",
    category: "Finance & Accounting",
    rating: 4.3,
    baseViews: 140,
    baseSales: 95,
    baseRevenue: 23750,
    initials: "FM",
    cover: "linear-gradient(160deg, oklch(0.50 0.11 180), oklch(0.30 0.07 180))",
  },
];

function RangeDropdown({
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
        <button className="inline-flex h-[38px] items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer shadow-2xs">
          <span>{value}</span>
          <ChevronDown size={14} className="text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onSelect(opt)} className="text-xs font-medium cursor-pointer">
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-2xs transition-shadow hover:shadow-md justify-between min-h-[128px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {stat.label}
        </span>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
          style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
        >
          <Icon size={18} />
        </span>
      </div>

      <div className="mt-2">
        <p className="text-2xl font-extrabold tracking-tight text-foreground">{stat.value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
      </div>
    </div>
  );
}

const RANGES = ["7d", "30d", "90d", "Yearly", "Till Date"] as const;

function RangePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (r: string) => void;
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

function PBAdminDashboard() {
  const [fy, setFy] = useState("FY (2026 - 2027)");
  const [range, setRange] = useState("30d");

  const dynamicChartConfig = useMemo(() => {
    switch (range) {
      case "7d":
        return {
          subtitle: "Last 7 Days (25 Jul - 31 Jul 2026)",
          data: [
            { label: "25 Jul", sales: 45 },
            { label: "26 Jul", sales: 120 },
            { label: "27 Jul", sales: 310 },
            { label: "28 Jul", sales: 240 },
            { label: "29 Jul", sales: 180 },
            { label: "30 Jul", sales: 390 },
            { label: "31 Jul", sales: 290 },
          ],
        };
      case "30d":
        return {
          subtitle: "Last 30 Days (02 Jul - 31 Jul 2026)",
          data: [
            { label: "Jul 01-05", sales: 120 },
            { label: "Jul 06-10", sales: 280 },
            { label: "Jul 11-15", sales: 340 },
            { label: "Jul 16-20", sales: 190 },
            { label: "Jul 21-25", sales: 430 },
            { label: "Jul 26-31", sales: 310 },
          ],
        };
      case "90d":
        return {
          subtitle: "Last 90 Days (May 2026 - Jul 2026)",
          data: [
            { label: "May 01-15", sales: 210 },
            { label: "May 16-31", sales: 380 },
            { label: "Jun 01-15", sales: 290 },
            { label: "Jun 16-30", sales: 410 },
            { label: "Jul 01-15", sales: 320 },
            { label: "Jul 16-31", sales: 480 },
          ],
        };
      case "Yearly":
        return {
          subtitle: `Fiscal Year (${fy})`,
          data: [
            { label: "Apr", sales: 80 },
            { label: "May", sales: 420 },
            { label: "Jun", sales: 280 },
            { label: "Jul", sales: 150 },
            { label: "Aug", sales: 210 },
            { label: "Sep", sales: 340 },
            { label: "Oct", sales: 190 },
            { label: "Nov", sales: 260 },
            { label: "Dec", sales: 410 },
            { label: "Jan", sales: 320 },
            { label: "Feb", sales: 180 },
            { label: "Mar", sales: 290 },
          ],
        };
      case "Till Date":
      default:
        return {
          subtitle: "All-Time Cumulative Sales (2023 - 2026)",
          data: [
            { label: "2023", sales: 180 },
            { label: "2024", sales: 340 },
            { label: "2025", sales: 490 },
            { label: "2026 (YTD)", sales: 380 },
          ],
        };
    }
  }, [range, fy]);

  const dynamicTopBooks = useMemo(() => {
    let multiplier = 1;
    if (range === "7d") multiplier = 0.25;
    else if (range === "30d") multiplier = 1.0;
    else if (range === "90d") multiplier = 2.4;
    else if (range === "Yearly") multiplier = 7.5;
    else multiplier = 18.0;

    return topSellingBooks.map((b) => {
      const sales = Math.round(b.baseSales * multiplier);
      const views = Math.round(b.baseViews * multiplier);
      const revVal = Math.round(b.baseRevenue * multiplier);
      return {
        ...b,
        sales: sales.toLocaleString("en-IN"),
        views: views.toLocaleString("en-IN"),
        revenue: `₹${revVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      };
    });
  }, [range, fy]);

  return (
    <AppShell
      title="Dashboard"
      subtitle="Global administration overview for sales and publishing activity."
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Top Highlight Banner: Pending Royalty Payment */}
        <div className="rounded-xl border border-amber-200/80 bg-amber-500/10 dark:bg-amber-950/30 dark:border-amber-800/40 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400">
              <Landmark size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Pending Royalty Payment
                </h2>
                <span className="inline-flex items-center rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                  All-Time Cumulative Balance
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-0.5">
                ₹425,713.27
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Last payment Date 19 Jun 2026 • Cumulative net unpaid balance across all publishers & authors.
              </p>
            </div>
          </div>
        </div>

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
            {range === "Yearly" && (
              <RangeDropdown
                value={fy}
                onSelect={setFy}
                options={["FY (2024 - 2025)", "FY (2025 - 2026)", "FY (2026 - 2027)"]}
              />
            )}
            <RangePicker value={range} onChange={setRange} />
          </div>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </section>

        <section>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-[1.35rem] font-semibold tracking-tight">eBook Sales</h2>
              <p className="text-xs text-muted-foreground">{dynamicChartConfig.subtitle}</p>
            </div>

            <div className="h-[160px] w-full md:h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicChartConfig.data} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="label"
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
                    domain={[0, 500]}
                    ticks={[0, 100, 200, 300, 400, 500]}
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
                  <Bar dataKey="sales" radius={[5, 5, 0, 0]} barSize={16}>
                    {dynamicChartConfig.data.map((entry, index) => (
                      <Cell
                        key={`${entry.label}-${index}`}
                        fill={index % 2 === 1 ? "var(--brand)" : "oklch(0.72 0.16 165)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Top 10 Selling eBooks Section */}
        <section className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
          <div className="mb-6">
            <h2 className="text-[1.35rem] font-semibold tracking-tight">Top 10 Selling eBooks</h2>
            <p className="text-xs text-muted-foreground">Filtered by: {dynamicChartConfig.subtitle}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-4 pr-3 pl-2 w-8">#</th>
                  <th className="pb-4 pr-4 pl-2">Title</th>
                  <th className="pb-4 px-4 text-center">Rating</th>
                  <th className="pb-4 px-4 text-center">No. of Views</th>
                  <th className="pb-4 px-4 text-center">Sales</th>
                  <th className="pb-4 pl-4 pr-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {dynamicTopBooks.map((book, index) => (
                  <tr key={book.title} className="hover:bg-secondary/50 transition-colors">
                    <td className="py-4 pr-3 pl-2 text-xs font-bold text-muted-foreground">{index + 1}</td>
                    <td className="py-4 pr-4 pl-2">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-16 w-11 shrink-0 items-center justify-center rounded-[4px] shadow-sm text-[10px] font-bold text-white/90"
                          style={{ background: book.cover }}
                        >
                          {book.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground">{book.title}</p>
                          <p className="text-xs text-muted-foreground">{book.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-1 rounded bg-[#FBBF24] px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                          <span>{book.rating}</span>
                          <Star size={12} className="fill-white" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-foreground">
                      {book.views}
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-foreground">
                      {book.sales}
                    </td>
                    <td className="py-4 pl-4 pr-2 text-right font-semibold text-foreground">
                      {book.revenue}
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
