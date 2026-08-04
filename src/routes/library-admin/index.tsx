import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
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
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

const RANGES = ["7d", "30d", "90d", "Yearly", "Till Date"] as const;
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

const topSellingBooks = [
  {
    title: "A Complete History of Music for Schools",
    publisher: "PixelBooks",
    rating: 4.8,
    baseCopies: 5,
    baseBorrowed: 120,
    initials: "MUS",
    cover: "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
  },
  {
    title: "A Tangled Tale",
    publisher: "PixelBooks",
    rating: 4.0,
    baseCopies: 2,
    baseBorrowed: 95,
    initials: "ATT",
    cover: "linear-gradient(160deg, oklch(0.60 0.15 10), oklch(0.40 0.10 10))",
  },
  {
    title: "A Connecticut Yankee in King Arthur's Court",
    publisher: "PixelBooks",
    rating: 4.5,
    baseCopies: 6,
    baseBorrowed: 82,
    initials: "ACY",
    cover: "linear-gradient(160deg, oklch(0.85 0.10 80), oklch(0.65 0.08 80))",
  },
  {
    title: "NEP 2020: Policy in Education",
    publisher: "PixelBooks",
    rating: 4.6,
    baseCopies: 4,
    baseBorrowed: 74,
    initials: "NP",
    cover: "linear-gradient(160deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
  },
  {
    title: "Knowledge for the Time",
    publisher: "PixelBooks",
    rating: 4.1,
    baseCopies: 3,
    baseBorrowed: 65,
    initials: "KT",
    cover: "linear-gradient(160deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
  },
  {
    title: "The Elements of Style",
    publisher: "PixelBooks",
    rating: 4.9,
    baseCopies: 8,
    baseBorrowed: 58,
    initials: "ES",
    cover: "linear-gradient(160deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
  },
  {
    title: "Heart's Key",
    publisher: "PixelBooks",
    rating: 4.4,
    baseCopies: 3,
    baseBorrowed: 49,
    initials: "HK",
    cover: "linear-gradient(160deg, oklch(0.20 0.06 200), oklch(0.12 0.04 200))",
  },
  {
    title: "Digital Marketing Essentials",
    publisher: "PixelBooks",
    rating: 4.3,
    baseCopies: 5,
    baseBorrowed: 42,
    initials: "DM",
    cover: "linear-gradient(160deg, oklch(0.60 0.15 60), oklch(0.40 0.10 60))",
  },
  {
    title: "Data Structures in JavaScript",
    publisher: "PixelBooks",
    rating: 4.7,
    baseCopies: 7,
    baseBorrowed: 36,
    initials: "DS",
    cover: "linear-gradient(160deg, oklch(0.40 0.16 260), oklch(0.22 0.09 260))",
  },
  {
    title: "Financial Management 101",
    publisher: "PixelBooks",
    rating: 4.2,
    baseCopies: 4,
    baseBorrowed: 28,
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

function RangePicker({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
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
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
          {stat.hasDropdown ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer">
                    <span>{stat.dropdownValue}</span>
                    <ChevronDown size={10} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[80px]">
                  {stat.dropdownOptions?.map((opt) => (
                    <DropdownMenuItem
                      key={opt}
                      onClick={() => stat.onDropdownSelect?.(opt)}
                      className="text-xs py-1.5 cursor-pointer"
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
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-2xs justify-between min-h-[128px]">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <div className="mt-2">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="mt-1 h-3 w-28" />
      </div>
    </div>
  );
}

function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [fyRange, setFyRange] = useState("FY (2026 - 2027)");
  const [range, setRange] = useState<Range>("30d");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const stats: Stat[] = useMemo(() => {
    let borrowedCount = "39";
    let requestsCount = "14";
    let purchasedCount = "557";

    if (range === "7d") {
      borrowedCount = "8";
      requestsCount = "3";
      purchasedCount = "138";
    } else if (range === "30d") {
      borrowedCount = "39";
      requestsCount = "14";
      purchasedCount = "557";
    } else if (range === "90d") {
      borrowedCount = "92";
      requestsCount = "38";
      purchasedCount = "1,340";
    } else if (range === "Yearly") {
      borrowedCount = "290";
      requestsCount = "115";
      purchasedCount = "4,180";
    } else {
      borrowedCount = "680";
      requestsCount = "270";
      purchasedCount = "10,250";
    }

    return [
      {
        label: "Borrowed eBooks",
        value: borrowedCount,
        sub: "Active Borrowers",
        icon: BookMarked,
      },
      {
        label: "Books Requested",
        value: requestsCount,
        sub: "Pending Requests",
        icon: Inbox,
      },
      {
        label: "Total eBooks Purchased",
        value: purchasedCount,
        sub: "eBooks Purchased",
        icon: BookMarked,
      },
    ];
  }, [range]);

  const dynamicChartConfig = useMemo(() => {
    switch (range) {
      case "7d":
        return {
          subtitle: "Last 7 Days (25 Jul - 31 Jul 2026)",
          data: [
            { label: "25 Jul", readers: 1 },
            { label: "26 Jul", readers: 3 },
            { label: "27 Jul", readers: 5 },
            { label: "28 Jul", readers: 2 },
            { label: "29 Jul", readers: 4 },
            { label: "30 Jul", readers: 5 },
            { label: "31 Jul", readers: 3 },
          ],
        };
      case "30d":
        return {
          subtitle: "Last 30 Days (02 Jul - 31 Jul 2026)",
          data: [
            { label: "Jul 01-05", readers: 2 },
            { label: "Jul 06-10", readers: 4 },
            { label: "Jul 11-15", readers: 5 },
            { label: "Jul 16-20", readers: 3 },
            { label: "Jul 21-25", readers: 5 },
            { label: "Jul 26-31", readers: 4 },
          ],
        };
      case "90d":
        return {
          subtitle: "Last 90 Days (May 2026 - Jul 2026)",
          data: [
            { label: "May 01-15", readers: 3 },
            { label: "May 16-31", readers: 4 },
            { label: "Jun 01-15", readers: 5 },
            { label: "Jun 16-30", readers: 4 },
            { label: "Jul 01-15", readers: 5 },
            { label: "Jul 16-31", readers: 4 },
          ],
        };
      case "Yearly":
        return {
          subtitle: `Fiscal Year (${fyRange})`,
          data: [
            { label: "Apr", readers: 1 },
            { label: "May", readers: 4 },
            { label: "Jun", readers: 5 },
            { label: "Jul", readers: 2 },
            { label: "Aug", readers: 3 },
            { label: "Sep", readers: 4 },
            { label: "Oct", readers: 2 },
            { label: "Nov", readers: 3 },
            { label: "Dec", readers: 5 },
            { label: "Jan", readers: 4 },
            { label: "Feb", readers: 2 },
            { label: "Mar", readers: 3 },
          ],
        };
      case "Till Date":
      default:
        return {
          subtitle: "All-Time Cumulative Activity (2023 - 2026)",
          data: [
            { label: "2023", readers: 2 },
            { label: "2024", readers: 4 },
            { label: "2025", readers: 5 },
            { label: "2026 (YTD)", readers: 4 },
          ],
        };
    }
  }, [range, fyRange]);

  const dynamicTopBooks = useMemo(() => {
    let multiplier = 1;
    if (range === "7d") multiplier = 0.25;
    else if (range === "30d") multiplier = 1.0;
    else if (range === "90d") multiplier = 2.4;
    else if (range === "Yearly") multiplier = 7.5;
    else multiplier = 18.0;

    return topSellingBooks.map((b) => {
      const borrowed = Math.round(b.baseBorrowed * multiplier);
      const copies = Math.round(b.baseCopies * (range === "Till Date" ? 2.5 : 1));
      return {
        ...b,
        borrowed: borrowed.toLocaleString("en-IN"),
        copies: copies.toLocaleString("en-IN"),
      };
    });
  }, [range, fyRange]);

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Top Standalone Highlight Banner: Total Library Users */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
          >
            <Users size={22} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Library Users
              </h2>
              <span className="inline-flex items-center rounded-md bg-sidebar-highlight px-2 py-0.5 text-[10px] font-bold text-brand">
                Active Enrolled Members
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-0.5">
              14
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Registered library members.
            </p>
          </div>
        </div>
      </div>

      {/* Header Overview Control Bar with FY Dropdown and RangePicker */}
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
              value={fyRange}
              onSelect={setFyRange}
              options={["FY (2024 - 2025)", "FY (2025 - 2026)", "FY (2026 - 2027)"]}
            />
          )}
          <RangePicker value={range} onChange={setRange} />
        </div>
      </div>

      {/* Stats Cards Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((s) => <StatCard key={s.label} stat={s} />)}
      </section>

      {/* Full Width eBooks Library Readers Chart Card */}
      <section>
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-[1.35rem] font-semibold tracking-tight">eBooks Library Readers</h2>
            <p className="text-xs text-muted-foreground">{dynamicChartConfig.subtitle}</p>
          </div>

          <div className="h-[160px] w-full md:h-[190px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
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
                  <Bar dataKey="readers" radius={[5, 5, 0, 0]} barSize={16}>
                    {dynamicChartConfig.data.map((entry, index) => (
                      <Cell
                        key={`${entry.label}-${index}`}
                        fill={index % 2 === 1 ? "var(--brand)" : "oklch(0.72 0.16 165)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      {/* Top 10 eBooks Borrowed Section */}
      <section className="rounded-xl border border-border bg-card p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-[1.35rem] font-semibold tracking-tight">Top 10 eBooks Borrowed</h2>
          <p className="text-xs text-muted-foreground">Filtered by: {dynamicChartConfig.subtitle}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="pb-4 pr-3 pl-2 w-8">#</th>
                <th className="pb-4 pr-4 pl-2">Title</th>
                <th className="pb-4 px-4 text-center">Rating</th>
                <th className="pb-4 px-4 text-center">Number of eBook Copies</th>
                <th className="pb-4 px-4 text-center">Total eBooks Borrowed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td className="py-4 pr-4" colSpan={5}>
                      <Skeleton className="h-10 w-full" />
                    </td>
                  </tr>
                ))
                : dynamicTopBooks.map((book, index) => (
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
                          <p className="text-xs text-muted-foreground">{book.publisher}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-1 rounded bg-[#FBBF24] px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                          <span>{book.rating.toFixed(1)}</span>
                          <Star size={12} className="fill-white" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-foreground">
                      {book.copies}
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-foreground">
                      {book.borrowed}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
