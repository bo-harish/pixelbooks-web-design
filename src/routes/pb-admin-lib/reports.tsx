import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  Download,
  Building2,
  TrendingUp,
  Landmark,
  Calendar,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/pb-admin-lib/reports")({
  component: PBAdminLibraryReportsPage,
});

const reportChartData = [
  { month: "Jan", revenue: 450000, licenses: 620 },
  { month: "Feb", revenue: 520000, licenses: 740 },
  { month: "Mar", revenue: 890000, licenses: 1100 },
  { month: "Apr", revenue: 1950000, licenses: 2400 },
  { month: "May", revenue: 3100000, licenses: 3800 },
  { month: "Jun", revenue: 1873777, licenses: 1169 },
];

const institutionBreakdown = [
  {
    institution: "APJ Abdul Kalam Technological University",
    totalPurchases: "₹8,719,533.00",
    share: "99.28%",
    activeStudents: "14,500",
    status: "Active Subscribed",
  },
  {
    institution: "The District Central Library, Salem",
    totalPurchases: "₹49,189.00",
    share: "0.56%",
    activeStudents: "2,100",
    status: "Active Subscribed",
  },
  {
    institution: "National University of Singapore",
    totalPurchases: "₹11,418.00",
    share: "0.13%",
    activeStudents: "850",
    status: "Active Subscribed",
  },
];

function PBAdminLibraryReportsPage() {
  const [timeRange, setTimeRange] = useState("FY 2026-2027");

  return (
    <AppShell
      title="Library Admin Reports"
      subtitle="Comprehensive revenue analytics, institutional procurement metrics, and license consumption reports."
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Header Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Institutional Sales Summary
            </h2>
            <p className="text-xs text-muted-foreground">
              Periodical revenue breakdown and license distribution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="h-10 rounded-lg border border-border bg-card px-3 text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="FY 2026-2027">FY 2026-2027</option>
              <option value="FY 2025-2026">FY 2025-2026</option>
              <option value="All Time">All Time</option>
            </select>

            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer shadow-2xs">
              <Download size={14} />
              Export Report
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Library Revenue
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Landmark size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-extrabold text-foreground">₹8,783,777.00</p>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total eBooks Purchased
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <BarChart3 size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-extrabold text-foreground">9,829</p>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Student Readers
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Users size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-extrabold text-foreground">17,450</p>
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Monthly Institutional Revenue Trend
            </h2>
            <p className="text-xs text-muted-foreground">Monthly net earnings in INR (₹)</p>
          </div>

          <div className="h-[280px] w-full sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}`, "Revenue"]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={24} fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Institution Breakdown Table */}
        <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Institution Revenue Breakdown
            </h2>
            <p className="text-xs text-muted-foreground">
              Net revenue generated per onboarded academic and public library.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-4 pl-2">Institution Name</th>
                  <th className="pb-3 px-4 text-right">Total Purchases</th>
                  <th className="pb-3 px-4 text-center">Share (%)</th>
                  <th className="pb-3 px-4 text-center">Active Readers</th>
                  <th className="pb-3 pl-4 pr-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {institutionBreakdown.map((row) => (
                  <tr key={row.institution} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-4 pr-4 pl-2 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-muted-foreground shrink-0" />
                        <span>{row.institution}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-foreground">
                      {row.totalPurchases}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-teal-600 dark:text-teal-400">
                      {row.share}
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-foreground">
                      {row.activeStudents}
                    </td>
                    <td className="py-4 pl-4 pr-2 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
