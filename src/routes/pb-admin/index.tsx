import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Tag, Users, Clock3, BookOpen, ChevronDown, Star } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    label: "Total eBooks Purchased",
    value: "44",
    sub: "117% purchased last month",
    icon: Users,
  },
  {
    label: "Pending Royalty Payment",
    value: "₹425,713.27",
    sub: "Last payment Date 19 Jun 2026",
    icon: Clock3,
  },
  {
    label: "Total eBooks Published",
    value: "22",
    sub: "25 eBooks published last month",
    icon: BookOpen,
  },
];

const salesData = [
  { month: "Apr", sales: 8 },
  { month: "May", sales: 1610 },
  { month: "Jun", sales: 112 },
  { month: "Jul", sales: 45 },
  { month: "Aug", sales: 0 },
  { month: "Sep", sales: 0 },
  { month: "Oct", sales: 0 },
  { month: "Nov", sales: 0 },
  { month: "Dec", sales: 0 },
  { month: "Jan", sales: 0 },
  { month: "Feb", sales: 0 },
  { month: "Mar", sales: 0 },
];

const viewsData = [
  { name: "Academic", value: 43.9 },
  { name: "Action & Adventure", value: 35.61 },
  { name: "Arts, Cinema", value: 20.49 },
];

const viewsColors = ["oklch(0.66 0.15 145)", "oklch(0.72 0.16 165)", "oklch(0.46 0.09 205)"];

const topSellingBooks = [
  {
    title: "Heart's Key",
    author: "Stephanie Van Orman",
    category: "Action & Adventure",
    rating: 0,
    views: 5,
    sales: 414745,
    revenue: "₹414,745.86",
    initials: "HK",
    cover: "linear-gradient(160deg, oklch(0.20 0.06 200), oklch(0.12 0.04 200))",
  },
  {
    title: "ePub Test Book",
    author: "C.J. ANYA",
    category: "Action & Adventure",
    rating: 4,
    views: 9,
    sales: 119595,
    revenue: "₹298,200.00",
    initials: "ET",
    cover: "linear-gradient(160deg, oklch(0.35 0.12 280), oklch(0.15 0.06 280))",
  },
  {
    title: "The Psychology of Money",
    author: "MORGAN HOUSEL",
    category: "Biography",
    rating: 3.7,
    views: 48,
    sales: 34692,
    revenue: "₹82,482.00",
    initials: "PM",
    cover: "linear-gradient(160deg, oklch(0.95 0.01 100), oklch(0.85 0.01 100))",
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
        <button className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-card px-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <span>{value}</span>
          <ChevronDown size={12} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onSelect(opt)} className="text-xs">
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  const [period, setPeriod] = useState("Monthly");

  return (
    <div className="flex min-h-[158px] flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md md:p-5">
      <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
          >
            <Icon size={16} />
          </span>
          <p className="truncate text-sm font-medium text-muted-foreground">{stat.label}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
        <p className="text-xs font-medium text-muted-foreground">{stat.sub}</p>
      </div>

      <div className="mt-4 flex justify-end">
        <RangeDropdown
          value={period}
          onSelect={setPeriod}
          options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]}
        />
      </div>
    </div>
  );
}

function PBAdminDashboard() {
  const [fy, setFy] = useState("FY (2026 - 2027)");
  const [viewRange, setViewRange] = useState("Monthly");

  return (
    <AppShell
      title="Dashboard"
      subtitle="Global administration overview for sales and publishing activity."
    >
      <div className="space-y-6 p-4 md:p-8">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm xl:col-span-8 md:p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-[1.35rem] font-semibold tracking-tight">eBook Sales</h2>
                <p className="text-xs text-muted-foreground">Apr 2026 - Mar 2027</p>
              </div>
              <RangeDropdown
                value={fy}
                onSelect={setFy}
                options={["FY (2024 - 2025)", "FY (2025 - 2026)", "FY (2026 - 2027)"]}
              />
            </div>

            <div className="h-[320px] w-full md:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
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
                    domain={[0, 1750]}
                    ticks={[0, 250, 500, 750, 1000, 1250, 1500, 1750]}
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
                  <Bar dataKey="sales" radius={[5, 5, 0, 0]} barSize={14}>
                    {salesData.map((entry, index) => (
                      <Cell
                        key={`${entry.month}-${index}`}
                        fill={index === 1 || index === 3 ? "var(--brand)" : "oklch(0.72 0.16 165)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm xl:col-span-4 md:p-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-[1.35rem] font-semibold tracking-tight">Total eBooks Views</h2>
              <RangeDropdown
                value={viewRange}
                onSelect={setViewRange}
                options={["Weekly", "Monthly", "Quarterly", "Yearly"]}
              />
            </div>

            <div className="mt-4 h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={viewsData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={118}
                    stroke="var(--card)"
                    strokeWidth={2}
                    paddingAngle={0}
                  >
                    {viewsData.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={viewsColors[index % viewsColors.length]}
                      />
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
            </div>

            <ul className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 xl:grid-cols-1">
              {viewsData.map((entry, i) => (
                <li key={entry.name} className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: viewsColors[i % viewsColors.length] }}
                  />
                  <span className="truncate">{entry.name}</span>
                  <span className="ml-auto font-semibold text-foreground">{entry.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Top Selling eBooks Section */}
        <section className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[1.35rem] font-semibold tracking-tight">Top Selling eBooks</h2>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm font-semibold text-brand hover:underline transition-all">
                  View More
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background">
                <DialogHeader className="p-6 pb-2">
                  <DialogTitle className="text-xl font-bold text-foreground">
                    Recently Added Library
                  </DialogTitle>
                </DialogHeader>
                <div className="px-6 pb-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40 text-left text-xs font-semibold text-foreground">
                        <th className="pb-4 pr-4">Library</th>
                        <th className="pb-4 px-4 text-center">Active Users</th>
                        <th className="pb-4 px-4 text-center">Total Users</th>
                        <th className="pb-4 px-4 text-center">Total eBook Purchased</th>
                        <th className="pb-4 pl-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {[
                        {
                          name: "BH Library",
                          loc: "Kochi",
                          active: 0,
                          total: 1,
                          books: 0,
                          amount: "₹0.00",
                          initials: "BH",
                          bg: "var(--brand)",
                        },
                        {
                          name: "ICAI",
                          loc: "Chennai",
                          active: 0,
                          total: 0,
                          books: 0,
                          amount: "₹0.00",
                          initials: "IC",
                          bg: "oklch(0.66 0.15 145)",
                        },
                        {
                          name: "St Saniga Library",
                          loc: "Ernakulam",
                          active: 0,
                          total: 8,
                          books: 0,
                          amount: "₹0.00",
                          initials: "SL",
                          bg: "var(--muted-foreground)",
                        },
                        {
                          name: "test lib",
                          loc: "gggg",
                          active: 0,
                          total: 1,
                          books: 0,
                          amount: "₹0.00",
                          initials: "TL",
                          bg: "oklch(0.55 0.13 260)",
                        },
                        {
                          name: "Public Library",
                          loc: "TEST",
                          active: 0,
                          total: 3,
                          books: 0,
                          amount: "₹0.00",
                          initials: "PL",
                          bg: "var(--muted-foreground)",
                        },
                      ].map((lib) => (
                        <tr key={lib.name} className="hover:bg-secondary/50 transition-colors">
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-4">
                              <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm shadow-sm text-xs font-bold text-white shadow-sm"
                                style={{ background: lib.bg }}
                              >
                                {lib.initials}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground">{lib.name}</p>
                                <p className="text-xs text-muted-foreground">{lib.loc}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center font-medium text-foreground">
                            {lib.active}
                          </td>
                          <td className="py-4 px-4 text-center font-medium text-foreground">
                            {lib.total}
                          </td>
                          <td className="py-4 px-4 text-center font-medium text-foreground">
                            {lib.books}
                          </td>
                          <td className="py-4 pl-4 text-right font-medium text-foreground">
                            {lib.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-6 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>Showing 5 from 49 results</span>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                        <span>«</span> Previous
                      </button>
                      <div className="flex items-center gap-1 mx-2">
                        {["1", "2", "3", "4", "5"].map((page) => (
                          <button
                            key={page}
                            className={`flex h-8 w-8 items-center justify-center rounded-md ${page === "1" ? "bg-sidebar-highlight text-brand" : "hover:bg-secondary"}`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button className="flex items-center gap-1 text-foreground hover:text-brand transition-colors">
                        Next <span>»</span>
                      </button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left text-xs font-semibold text-foreground">
                  <th className="pb-4 pr-4 pl-2">Title</th>
                  <th className="pb-4 px-4 text-center">Rating</th>
                  <th className="pb-4 px-4 text-center">No. of Views</th>
                  <th className="pb-4 px-4 text-center">Sales</th>
                  <th className="pb-4 pl-4 pr-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {topSellingBooks.map((book) => (
                  <tr key={book.title} className="hover:bg-secondary/50 transition-colors">
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
                    <td className="py-4 pl-4 pr-2 text-right font-medium text-foreground">
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
