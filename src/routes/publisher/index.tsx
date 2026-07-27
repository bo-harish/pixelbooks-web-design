import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Tag, Users, Clock, BookOpen, Star, ArrowUpRight, ArrowDownRight, ChevronDown, TrendingUp, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/publisher/")({
  component: PublisherDashboard,
});

function PublisherDashboard() {
  return (
    <AppShell title="Dashboard" subtitle="A quick pulse on your sales, royalties and top titles.">
      <DashboardContent />
    </AppShell>
  );
}

const RANGES = ["7d", "30d", "90d", "1y", "Till Date"] as const;
type Range = (typeof RANGES)[number];

type Stat = {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  delta: number;
  spark: number[];
};

const stats: Stat[] = [
  {
    label: "eBook Total Sales",
    value: "₹42,180",
    icon: Tag,
    delta: 12.4,
    spark: [8, 10, 9, 14, 12, 18, 16, 22, 20, 25, 24, 28],
  },
  {
    label: "Total eBooks Purchased",
    value: "1,284",
    icon: Users,
    delta: 6.1,
    spark: [20, 22, 21, 24, 23, 28, 27, 30, 32, 31, 34, 36],
  },
  {
    label: "Total eBooks Published",
    value: "184",
    icon: BookOpen,
    delta: 2.8,
    spark: [10, 11, 11, 12, 13, 13, 14, 15, 16, 16, 17, 18],
  },
];

const salesDataByFy: Record<string, { month: string; sales: number }[]> = {
  "FY (2025 - 2026)": [
    { month: "Apr", sales: 12 },
    { month: "May", sales: 18 },
    { month: "Jun", sales: 14 },
    { month: "Jul", sales: 22 },
    { month: "Aug", sales: 26 },
    { month: "Sep", sales: 19 },
    { month: "Oct", sales: 31 },
    { month: "Nov", sales: 28 },
    { month: "Dec", sales: 42 },
    { month: "Jan", sales: 35 },
    { month: "Feb", sales: 39 },
    { month: "Mar", sales: 47 },
  ],
  "FY (2024 - 2025)": [
    { month: "Apr", sales: 10 },
    { month: "May", sales: 14 },
    { month: "Jun", sales: 12 },
    { month: "Jul", sales: 18 },
    { month: "Aug", sales: 20 },
    { month: "Sep", sales: 15 },
    { month: "Oct", sales: 25 },
    { month: "Nov", sales: 22 },
    { month: "Dec", sales: 34 },
    { month: "Jan", sales: 28 },
    { month: "Feb", sales: 31 },
    { month: "Mar", sales: 38 },
  ],
  "FY (2023 - 2024)": [
    { month: "Apr", sales: 8 },
    { month: "May", sales: 11 },
    { month: "Jun", sales: 9 },
    { month: "Jul", sales: 14 },
    { month: "Aug", sales: 16 },
    { month: "Sep", sales: 12 },
    { month: "Oct", sales: 20 },
    { month: "Nov", sales: 18 },
    { month: "Dec", sales: 28 },
    { month: "Jan", sales: 22 },
    { month: "Feb", sales: 25 },
    { month: "Mar", sales: 30 },
  ],
};

const fyGrowth: Record<string, string> = {
  "FY (2025 - 2026)": "+18.6% Growth",
  "FY (2024 - 2025)": "+15.2% Growth",
  "FY (2023 - 2024)": "+12.0% Growth",
};

const categoryData = [
  { name: "Academic", value: 42 },
  { name: "Fiction", value: 26 },
  { name: "Philosophy", value: 18 },
  { name: "Reference", value: 14 },
];

const categoryColors = [
  "var(--brand)",
  "oklch(0.62 0.11 195)",
  "oklch(0.55 0.13 260)",
  "oklch(0.72 0.14 70)",
];

const topBooks = [
  {
    title: "NEP 2020 · Policy Formulation In Education",
    isbn: "9789356781234",
    rating: 4.6,
    views: 1240,
    sales: 312,
    revenue: "₹982.80",
    initials: "NEP",
    cover: "linear-gradient(160deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
  },
  {
    title: "A Complete History of Music for Schools",
    isbn: "1176559435",
    rating: 4.2,
    views: 986,
    sales: 218,
    revenue: "₹686.70",
    initials: "MUS",
    cover: "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
  },
  {
    title: "Knowledge for the Time",
    isbn: "9781019041857",
    rating: 4.0,
    views: 812,
    sales: 174,
    revenue: "₹548.10",
    initials: "KFT",
    cover: "linear-gradient(160deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
  },
  {
    title: "The Elements of Style",
    isbn: "9780205309023",
    rating: 4.8,
    views: 742,
    sales: 168,
    revenue: "₹352.80",
    initials: "STY",
    cover: "linear-gradient(160deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
  },
];

const topBooksByRange: Record<Range, typeof topBooks> = {
  "7d": [
    {
      title: "NEP 2020 · Policy Formulation In Education",
      isbn: "9789356781234",
      rating: 4.6,
      views: 142,
      sales: 38,
      revenue: "₹119.70",
      initials: "NEP",
      cover: "linear-gradient(160deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
    },
    {
      title: "Knowledge for the Time",
      isbn: "9781019041857",
      rating: 4.0,
      views: 98,
      sales: 24,
      revenue: "₹75.60",
      initials: "KFT",
      cover: "linear-gradient(160deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
    },
    {
      title: "A Complete History of Music for Schools",
      isbn: "1176559435",
      rating: 4.2,
      views: 86,
      sales: 19,
      revenue: "₹59.85",
      initials: "MUS",
      cover: "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
    },
    {
      title: "The Elements of Style",
      isbn: "9780205309023",
      rating: 4.8,
      views: 65,
      sales: 14,
      revenue: "₹29.40",
      initials: "STY",
      cover: "linear-gradient(160deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
    },
  ],
  "30d": topBooks,
  "90d": [
    {
      title: "NEP 2020 · Policy Formulation In Education",
      isbn: "9789356781234",
      rating: 4.6,
      views: 3420,
      sales: 840,
      revenue: "₹2,646.00",
      initials: "NEP",
      cover: "linear-gradient(160deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
    },
    {
      title: "A Complete History of Music for Schools",
      isbn: "1176559435",
      rating: 4.2,
      views: 2750,
      sales: 610,
      revenue: "₹1,921.50",
      initials: "MUS",
      cover: "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
    },
    {
      title: "Knowledge for the Time",
      isbn: "9781019041857",
      rating: 4.0,
      views: 2100,
      sales: 480,
      revenue: "₹1,512.00",
      initials: "KFT",
      cover: "linear-gradient(160deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
    },
    {
      title: "The Elements of Style",
      isbn: "9780205309023",
      rating: 4.8,
      views: 1950,
      sales: 440,
      revenue: "₹924.00",
      initials: "STY",
      cover: "linear-gradient(160deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
    },
  ],
  "1y": [
    {
      title: "NEP 2020 · Policy Formulation In Education",
      isbn: "9789356781234",
      rating: 4.6,
      views: 12400,
      sales: 3120,
      revenue: "₹9,828.00",
      initials: "NEP",
      cover: "linear-gradient(160deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
    },
    {
      title: "A Complete History of Music for Schools",
      isbn: "1176559435",
      rating: 4.2,
      views: 9860,
      sales: 2180,
      revenue: "₹6,867.00",
      initials: "MUS",
      cover: "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
    },
    {
      title: "Knowledge for the Time",
      isbn: "9781019041857",
      rating: 4.0,
      views: 8120,
      sales: 1740,
      revenue: "₹5,481.00",
      initials: "KFT",
      cover: "linear-gradient(160deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
    },
    {
      title: "The Elements of Style",
      isbn: "9780205309023",
      rating: 4.8,
      views: 7420,
      sales: 1680,
      revenue: "₹3,528.00",
      initials: "STY",
      cover: "linear-gradient(160deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
    },
  ],
  "Till Date": [
    {
      title: "NEP 2020 · Policy Formulation In Education",
      isbn: "9789356781234",
      rating: 4.6,
      views: 28450,
      sales: 6840,
      revenue: "₹21,546.00",
      initials: "NEP",
      cover: "linear-gradient(160deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
    },
    {
      title: "A Complete History of Music for Schools",
      isbn: "1176559435",
      rating: 4.2,
      views: 22100,
      sales: 4950,
      revenue: "₹15,592.50",
      initials: "MUS",
      cover: "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
    },
    {
      title: "Knowledge for the Time",
      isbn: "9781019041857",
      rating: 4.0,
      views: 18600,
      sales: 3980,
      revenue: "₹12,537.00",
      initials: "KFT",
      cover: "linear-gradient(160deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
    },
    {
      title: "The Elements of Style",
      isbn: "9780205309023",
      rating: 4.8,
      views: 16800,
      sales: 3820,
      revenue: "₹8,022.00",
      initials: "STY",
      cover: "linear-gradient(160deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
    },
  ],
};

function RangePicker({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div
      role="group"
      aria-label="Select time range"
      className="inline-flex items-center rounded-lg border border-border bg-card p-1 text-xs font-medium"
    >
      {RANGES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          aria-pressed={r === value}
          className="rounded-md px-3 py-1.5 transition-colors"
          style={
            r === value
              ? { backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }
              : { color: "var(--muted-foreground)" }
          }
        >
          {r === "1y" ? "1 year" : r}
        </button>
      ))}
    </div>
  );
}

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const points = data.map((v, i) => ({ i, v }));
  const color = up ? "var(--success)" : "var(--danger)";
  return (
    <ResponsiveContainer width="100%" height={44}>
      <LineChart data={points} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  const up = stat.delta >= 0;
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
          >
            <Icon size={18} strokeWidth={2} />
          </span>
          <span className="truncate text-sm font-medium text-muted-foreground">{stat.label}</span>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{
            color: up ? "var(--success)" : "var(--danger)",
            backgroundColor: up
              ? "color-mix(in oklab, var(--success) 12%, transparent)"
              : "color-mix(in oklab, var(--danger) 12%, transparent)",
          }}
        >
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(stat.delta).toFixed(1)}%
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight">{stat.value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{stat.sub ?? "vs previous period"}</p>
      <div className="mt-3 -mx-1">
        <Sparkline data={stat.spark} up={up} />
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="mt-5 h-8 w-24" />
      <Skeleton className="mt-2 h-3 w-40" />
      <Skeleton className="mt-4 h-10 w-full" />
    </div>
  );
}

function DashboardContent() {
  const [range, setRange] = useState<Range>("30d");
  const [topBooksRange, setTopBooksRange] = useState<Range>("30d");
  const [salesFy, setSalesFy] = useState("FY (2025 - 2026)");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const currentSalesData = salesDataByFy[salesFy] ?? salesDataByFy["FY (2025 - 2026)"];
  const currentTopBooks = topBooksByRange[topBooksRange] ?? topBooks;

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Total Receivable Till Date — Premium Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-px"
        style={{ background: "linear-gradient(135deg, oklch(0.72 0.17 160), oklch(0.55 0.14 200), oklch(0.62 0.15 260))" }}
      >
        <div className="relative rounded-[15px] bg-card p-5 sm:p-6">
          {/* Subtle background glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ background: "radial-gradient(ellipse at 10% 50%, oklch(0.72 0.17 160), transparent 60%), radial-gradient(ellipse at 90% 50%, oklch(0.62 0.15 260), transparent 60%)" }}
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Label + Amount */}
            <div className="flex items-center gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
              >
                <Wallet size={22} strokeWidth={2} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Total Receivable Till Date
                </p>
                <p className="mt-0.5 text-3xl font-extrabold tracking-tight text-foreground">
                  ₹8,425
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  All-time cumulative balance · unaffected by range filters
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden h-10 w-px bg-border sm:block self-center" />

            {/* Right: Info pillars */}
            <div className="flex items-center gap-6 sm:shrink-0">
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Last Payout</p>
                <p className="mt-1 text-sm font-bold text-foreground">24 Mar 2026</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">₹3,200 disbursed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Overview
          </h2>
          <p className="text-xs text-muted-foreground">
            Metrics update automatically based on the selected range.
          </p>
        </div>
        <RangePicker value={range} onChange={setRange} />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loading
          ? Array.from({ length: stats.length }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((s) => <StatCard key={s.label} stat={s} />)}
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">eBook Sales</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Monthly breakdown ({salesFy})</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  color: "var(--success)",
                  backgroundColor: "color-mix(in oklab, var(--success) 12%, transparent)",
                }}
              >
                {fyGrowth[salesFy] ?? "+18.6% Growth"}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
                    <span>{salesFy}</span>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[150px]">
                  {Object.keys(salesDataByFy).map((fy) => (
                    <DropdownMenuItem
                      key={fy}
                      onClick={() => setSalesFy(fy)}
                      className={salesFy === fy ? "font-semibold text-brand" : ""}
                    >
                      {fy}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-6 h-[280px] w-full md:h-[320px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentSalesData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
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
                  <Bar dataKey="sales" fill="var(--brand)" radius={[4, 4, 0, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <h2 className="text-lg font-semibold tracking-tight">Revenue by Category</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Share of total sales</p>
          <div className="mt-4 h-[200px] w-full">
            {loading ? (
              <Skeleton className="h-full w-full rounded-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={categoryColors[i % categoryColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <ul className="mt-4 space-y-2">
            {categoryData.map((c, i) => (
              <li key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: categoryColors[i] }}
                  />
                  <span className="text-muted-foreground">{c.name}</span>
                </span>
                <span className="font-semibold">{c.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Top Selling eBooks</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {topBooksRange === "Till Date"
                ? "All-time top titles by sales & revenue"
                : `Top titles performance (${topBooksRange === "1y" ? "1 year" : topBooksRange})`}
            </p>
          </div>
          <RangePicker value={topBooksRange} onChange={setTopBooksRange} />
        </div>

        {/* Desktop table */}
        <div className="mt-5 hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4 font-semibold">Title</th>
                <th className="pb-3 pr-4 font-semibold">ISBN</th>
                <th className="pb-3 pr-4 font-semibold">Rating</th>
                <th className="pb-3 pr-4 font-semibold">Views</th>
                <th className="pb-3 pr-4 font-semibold">Sales</th>
                <th className="pb-3 pl-4 text-right font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/60 last:border-0">
                      <td className="py-4 pr-4" colSpan={6}>
                        <Skeleton className="h-10 w-full" />
                      </td>
                    </tr>
                  ))
                : currentTopBooks.map((b) => (
                    <tr
                      key={b.title}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50"
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-12 w-9 shrink-0 items-center justify-center rounded-md text-[9px] font-bold text-white"
                            style={{ background: b.cover }}
                          >
                            {b.initials}
                          </div>
                          <span className="font-medium text-foreground">{b.title}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 font-mono text-xs text-muted-foreground">
                        {b.isbn}
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-1.5">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span>{b.rating}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4">{b.views.toLocaleString()}</td>
                      <td className="py-4 pr-4">{b.sales.toLocaleString()}</td>
                      <td className="py-4 pl-4 text-right font-medium">{b.revenue}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <ul className="mt-4 space-y-3 md:hidden">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <li key={i}>
                  <Skeleton className="h-24 w-full rounded-lg" />
                </li>
              ))
            : currentTopBooks.map((b) => (
                <li key={b.title} className="rounded-lg border border-border p-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-14 w-10 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                      style={{ background: b.cover }}
                    >
                      {b.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{b.title}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{b.isbn}</p>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <p className="text-muted-foreground">Rating</p>
                          <p className="font-semibold">★ {b.rating}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Sales</p>
                          <p className="font-semibold">{b.sales}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-semibold">{b.revenue}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
        </ul>
      </section>
    </div>
  );
}
