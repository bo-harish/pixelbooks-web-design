import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookMarked, Inbox, Users, Star, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/library-admin/")({
  component: LibraryAdminDashboard,
});

function LibraryAdminDashboard() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Overview of your library users, borrowings, and digital catalogue."
    >
      <DashboardContent />
    </AppShell>
  );
}

const RANGES = ["7d", "30d", "90d", "1y", "Till Date"] as const;
type Range = (typeof RANGES)[number];

type Stat = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  hasDropdown?: boolean;
  dropdownValue?: string;
  dropdownOptions?: string[];
  onDropdownSelect?: (val: string) => void;
};

const readersData = [
  { month: "Apr", readers: 0 },
  { month: "May", readers: 0 },
  { month: "Jun", readers: 4 },
  { month: "Jul", readers: 0 },
  { month: "Aug", readers: 0 },
  { month: "Sep", readers: 0 },
  { month: "Oct", readers: 0 },
  { month: "Nov", readers: 0 },
  { month: "Dec", readers: 0 },
  { month: "Jan", readers: 0 },
  { month: "Feb", readers: 0 },
  { month: "Mar", readers: 0 },
];

const topBooks = [
  {
    title: "A Complete History of Music for Schools, Clubs, and Private Reading",
    publisher: "PixelBooks",
    copies: 5,
    borrowed: 39,
    rating: 3.0,
    initials: "MUS",
    cover: "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))", // Greenish
  },
  {
    title: "A Tangled Tale",
    publisher: "PixelBooks",
    copies: 2,
    borrowed: 14,
    rating: 4.0,
    initials: "ATT",
    cover: "linear-gradient(160deg, oklch(0.60 0.15 10), oklch(0.40 0.10 10))", // Reddish
  },
  {
    title: "A Connecticut Yankee in King Arthur's Court",
    publisher: "PixelBooks",
    copies: 6,
    borrowed: 9,
    rating: 0.0,
    initials: "ACY",
    cover: "linear-gradient(160deg, oklch(0.85 0.10 80), oklch(0.65 0.08 80))", // Yellowish
  },
];

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md justify-between min-h-[140px]">
      <div>
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
        </div>
        <p className="mt-5 text-3xl font-semibold tracking-tight">{stat.value}</p>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        {stat.hasDropdown ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  <span>{stat.dropdownValue}</span>
                  <ChevronDown size={10} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[80px]">
                {stat.dropdownOptions?.map((opt) => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => stat.onDropdownSelect?.(opt)}
                    className="text-xs py-1.5"
                  >
                    {opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span>{stat.sub}</span>
          </>
        ) : (
          <span>{stat.sub}</span>
        )}
      </div>
    </div>
  );
}

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

function StatSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="mt-5 h-8 w-24" />
      <Skeleton className="mt-2 h-3 w-40" />
    </div>
  );
}

function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [borrowedRange, setBorrowedRange] = useState("Monthly");
  const [requestsRange, setRequestsRange] = useState("Monthly");
  const [fyRange, setFyRange] = useState("FY (2026 - 2027)");
  const [overviewRange, setOverviewRange] = useState<Range>("30d");
  const [topBooksRange, setTopBooksRange] = useState<Range>("30d");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const dropdownOpts = ["All time", "Weekly", "Monthly", "Yearly"];

  const stats: Stat[] = [
    {
      label: "Borrowed eBooks",
      value: "0",
      sub: "Users",
      icon: BookMarked,
      hasDropdown: true,
      dropdownValue: borrowedRange,
      dropdownOptions: dropdownOpts,
      onDropdownSelect: (val) => {
        setBorrowedRange(val);
        toast.success(`Filter updated: ${val}`);
      },
    },
    {
      label: "Books Requested",
      value: "0",
      sub: "Requests",
      icon: Inbox,
      hasDropdown: true,
      dropdownValue: requestsRange,
      dropdownOptions: dropdownOpts,
      onDropdownSelect: (val) => {
        setRequestsRange(val);
        toast.success(`Filter updated: ${val}`);
      },
    },
    {
      label: "Total Library Users",
      value: "14",
      sub: "Library Users",
      icon: Users,
    },
    {
      label: "Total eBooks Purchased",
      value: "557",
      sub: "eBooks Purchased",
      icon: BookMarked,
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header Overview Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Overview
          </h2>
          <p className="text-xs text-muted-foreground">
            Digital library activity metrics and usage overview.
          </p>
        </div>
        <RangePicker value={overviewRange} onChange={setOverviewRange} />
      </div>

      {/* Stats Cards Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((s) => <StatCard key={s.label} stat={s} />)}
      </section>

      {/* Chart Section */}
      <section className="grid grid-cols-1 gap-5">
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/40 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">eBooks Library Readers</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Apr 2026 - Mar 2027</p>
            </div>
            <div>
              <button
                onClick={() => toast.info("Financial year range filter clicked")}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{fyRange}</span>
                <ChevronDown size={12} />
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full md:h-[320px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={readersData} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
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
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
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
                  <Bar dataKey="readers" fill="var(--brand)" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="rounded-xl border border-border bg-card p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Top eBooks Borrowed</h2>
          </div>
          <RangePicker value={topBooksRange} onChange={setTopBooksRange} />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4 font-semibold">Titles</th>
                <th className="pb-3 px-4 font-semibold text-center">Number of eBook Copies</th>
                <th className="pb-3 px-4 font-semibold text-center">Total eBooks Borrowed</th>
                <th className="pb-3 pl-4 text-right font-semibold">User eBook Rating</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/60 last:border-0">
                      <td className="py-4 pr-4" colSpan={4}>
                        <Skeleton className="h-12 w-full" />
                      </td>
                    </tr>
                  ))
                : topBooks.map((b) => (
                    <tr
                      key={b.title}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50"
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-12 w-9 shrink-0 items-center justify-center rounded-md text-[9px] font-bold text-white shadow-sm"
                            style={{ background: b.cover }}
                          >
                            {b.initials}
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-foreground block truncate max-w-md">
                              {b.title}
                            </span>
                            <span className="text-xs text-muted-foreground block">
                              {b.publisher}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-muted-foreground">{b.copies}</td>
                      <td className="py-4 px-4 text-center text-muted-foreground">{b.borrowed}</td>
                      <td className="py-4 pl-4 text-right">
                        <div className="inline-flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/20 rounded px-2 py-0.5 text-xs font-semibold text-yellow-600 dark:bg-yellow-400/5 dark:text-yellow-400">
                          <span>{b.rating.toFixed(0)}</span>
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked List */}
        <ul className="space-y-3 md:hidden">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <li key={i}>
                  <Skeleton className="h-24 w-full rounded-lg" />
                </li>
              ))
            : topBooks.map((b) => (
                <li key={b.title} className="rounded-lg border border-border p-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-14 w-10 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm"
                      style={{ background: b.cover }}
                    >
                      {b.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{b.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{b.publisher}</p>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <p className="text-muted-foreground">Copies</p>
                          <p className="font-semibold">{b.copies}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Borrowed</p>
                          <p className="font-semibold">{b.borrowed}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rating</p>
                          <p className="font-semibold">★ {b.rating.toFixed(0)}</p>
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
