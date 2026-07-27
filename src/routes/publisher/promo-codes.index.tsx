import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  XCircle,
  Ban,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export const Route = createFileRoute("/publisher/promo-codes/")({
  head: () => ({
    meta: [
      { title: "Promo Codes — PixelBooks" },
      {
        name: "description",
        content: "Create and manage discount promo codes for your storefront.",
      },
      { property: "og:title", content: "Promo Codes — PixelBooks" },
      {
        property: "og:description",
        content: "Create and manage discount promo codes for your storefront.",
      },
    ],
  }),
  component: PromoCodesPage,
});

type PromoStatus = "Pending for Admin Approval" | "Approved" | "Rejected" | "Disabled" | "Expired";
type Activation = "Available" | "Not available";

type Promo = {
  id: string;
  code: string;
  start: string;
  end: string;
  status: PromoStatus;
  discount: number;
  title: string;
  activation: Activation;
  active: boolean;
};

const seed: Promo[] = [
  {
    id: "1",
    code: "FQSGFQX799",
    start: "Dec 09",
    end: "Dec 09, 2025",
    status: "Expired",
    discount: 10,
    title: "All",
    activation: "Not available",
    active: false,
  },
  {
    id: "2",
    code: "MONSOON25",
    start: "Jul 01",
    end: "Aug 31, 2026",
    status: "Approved",
    discount: 25,
    title: "Monsoon Reads",
    activation: "Available",
    active: true,
  },
  {
    id: "3",
    code: "KIDS15",
    start: "Jun 15",
    end: "Dec 31, 2026",
    status: "Approved",
    discount: 15,
    title: "Kids Collection",
    activation: "Available",
    active: true,
  },
  {
    id: "4",
    code: "WELCOME5",
    start: "Jan 01",
    end: "Dec 31, 2026",
    status: "Pending for Admin Approval",
    discount: 5,
    title: "New Users",
    activation: "Not available",
    active: false,
  },
  {
    id: "5",
    code: "AUG40",
    start: "Aug 01",
    end: "Aug 15, 2026",
    status: "Disabled",
    discount: 40,
    title: "Independence Sale",
    activation: "Not available",
    active: false,
  },
  {
    id: "6",
    code: "FLASH20",
    start: "Mar 10",
    end: "Mar 12, 2026",
    status: "Rejected",
    discount: 20,
    title: "Flash Weekend",
    activation: "Not available",
    active: false,
  },
];

const filters = [
  "All",
  "Pending for Admin Approval",
  "Approved",
  "Rejected",
  "Disabled",
  "Expired",
] as const;
type Filter = (typeof filters)[number];
const PAGE_SIZE = 8;

function StatusPill({ status }: { status: PromoStatus }) {
  const map = {
    "Pending for Admin Approval": { color: "var(--warning)", Icon: Clock },
    Approved: { color: "var(--success)", Icon: CheckCircle2 },
    Rejected: { color: "var(--danger)", Icon: XCircle },
    Disabled: { color: "var(--muted-foreground)", Icon: Ban },
    Expired: { color: "var(--muted-foreground)", Icon: AlertCircle },
  } as const;
  const { color, Icon } = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)`,
        color,
      }}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

function ActivationPill({ value }: { value: Activation }) {
  const available = value === "Available";
  const color = available ? "var(--success)" : "var(--muted-foreground)";
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in oklch, ${color} 10%, transparent)`,
        color,
      }}
    >
      {value}
    </span>
  );
}

function PromoCodesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [promos] = useState<Promo[]>(seed);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return promos.filter((p) => {
      if (filter !== "All" && p.status !== filter) return false;
      if (!q) return true;
      return p.code.toLowerCase().includes(q) || p.title.toLowerCase().includes(q);
    });
  }, [promos, filter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    const nums: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        nums.push(i);
      } else if (nums[nums.length - 1] !== "…") {
        nums.push("…");
      }
    }
    return nums;
  }, [totalPages, currentPage]);

  return (
    <AppShell title="Promo Codes" subtitle="Create and manage discount codes for your storefront.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by promo code, title"
              className="h-11 w-full rounded-lg border border-border bg-card pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="flex h-11 min-w-[130px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium"
            >
              <span>{filter}</span>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      setFilterOpen(false);
                      setPage(1);
                    }}
                    className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary ${f === filter ? "font-semibold text-foreground" : "text-muted-foreground"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/publisher/promo-codes/new"
            className="flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Add Promo Code
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Promo Code</th>
                  <th className="py-4 pr-4 font-semibold">Promo Duration</th>
                  <th className="py-4 pr-4 font-semibold">Status</th>
                  <th className="py-4 pr-4 font-semibold">Discount</th>
                  <th className="py-4 pr-4 font-semibold">Title</th>
                  <th className="py-4 pr-4 font-semibold">Activation</th>
                  <th className="py-4 pr-6 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                      No promo codes match your filters.
                    </td>
                  </tr>
                )}
                {pageItems.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50"
                  >
                    <td className="py-5 pl-6 pr-4">
                      <span className="inline-flex items-center rounded-md border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs font-semibold tracking-wider text-foreground">
                        {p.code}
                      </span>
                    </td>
                    <td className="py-5 pr-4 text-muted-foreground">
                      {p.start} – {p.end}
                    </td>
                    <td className="py-5 pr-4">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="py-5 pr-4 font-medium">{p.discount}%</td>
                    <td className="py-5 pr-4 text-muted-foreground">{p.title}</td>
                    <td className="py-5 pr-4">
                      <ActivationPill value={p.activation} />
                    </td>
                    <td className="py-5 pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          aria-label="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          aria-label="Delete"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary"
                          style={{ color: "var(--danger)" }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-border/60 md:hidden">
            {pageItems.length === 0 && (
              <li className="py-16 text-center text-sm text-muted-foreground">
                No promo codes match your filters.
              </li>
            )}
            {pageItems.map((p) => (
              <li key={p.id} className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs font-semibold">
                    {p.code}
                  </span>
                  <StatusPill status={p.status} />
                </div>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {p.start} – {p.end}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-xs font-semibold">{p.discount}% off</span>
                  <ActivationPill value={p.activation} />
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p className="text-xs text-muted-foreground">
              {filtered.length === 0
                ? "0 results"
                : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}`}
            </p>
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setPage((n) => Math.max(1, n - 1))}
                    className="flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium disabled:opacity-40"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                </PaginationItem>
                {pageNumbers.map((n, i) =>
                  n === "…" ? (
                    <PaginationItem key={`e-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={n}>
                      <PaginationLink
                        isActive={n === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(n);
                        }}
                        href="#"
                        style={
                          n === currentPage
                            ? {
                              backgroundColor: "var(--brand)",
                              color: "var(--brand-contrast)",
                              borderColor: "transparent",
                            }
                            : undefined
                        }
                      >
                        {n}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((n) => Math.min(totalPages, n + 1))}
                    className="flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium disabled:opacity-40"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
