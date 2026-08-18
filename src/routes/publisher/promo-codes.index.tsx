import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  Tag,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { getPromos, savePromos, type Promo, type PromoStatus, type Activation } from "@/lib/promo-codes-data";
import { usePublisherType } from "@/hooks/use-publisher-type";

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
    Expired: { color: "var(--danger)", Icon: AlertCircle },
  } as const;
  const { color, Icon } = map[status] ?? { color: "var(--muted-foreground)", Icon: Clock };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold"
      style={{
        backgroundColor: `color-mix(in oklab, ${color} 12%, transparent)`,
        color,
      }}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

function ActivationToggle({
  activation,
  active,
  onToggle,
}: {
  activation: Activation;
  active: boolean;
  onToggle: () => void;
}) {
  // Blank when the promo isn't in an approved/available state
  if (activation !== "Available") return null;
  return (
    <Switch
      checked={active}
      onClick={(e) => e.stopPropagation()}
      onCheckedChange={onToggle}
      aria-label={active ? "Disable promo code" : "Enable promo code"}
    />
  );
}

function PromoCodesPage() {
  const navigate = useNavigate();
  const [publisherType] = usePublisherType();
  const isLibraryOnly = publisherType === "Library-Only Publisher";

  useEffect(() => {
    if (isLibraryOnly) {
      navigate({ to: "/publisher/catalogue", replace: true });
    }
  }, [isLibraryOnly, navigate]);

  if (isLibraryOnly) {
    return null;
  }
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [promos, setPromos] = useState<Promo[]>(() => getPromos());
  const [page, setPage] = useState(1);

  const toggleActive = (id: string) => {
    setPromos((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p));
      savePromos(updated);
      return updated;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return promos.filter((p) => {
      if (filter !== "All" && p.status !== filter) return false;
      if (!q) return true;
      return (
        p.code.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.ebook.toLowerCase().includes(q)
      );
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
        {isLibraryOnly && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Restricted Access: You are currently viewing as <strong>Library-Only Publisher</strong>. Storefront promo codes and retail promotions are restricted for library-only accounts.</span>
          </div>
        )}
        {/* Toolbar */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by promo code, title, eBook..."
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                className="flex h-11 min-w-[150px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-xs font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)]"
              >
                <span className="truncate">{filter}</span>
                <ChevronDown size={15} className="shrink-0 text-muted-foreground" />
              </button>
              {filterOpen && (
                <div
                  className="absolute right-0 z-20 mt-1.5 w-52 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1"
                  onMouseLeave={() => setFilterOpen(false)}
                >
                  {filters.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        setFilter(f);
                        setFilterOpen(false);
                        setPage(1);
                      }}
                      className={`flex w-full items-center px-3.5 py-2 text-left text-xs transition-colors hover:bg-secondary ${
                        f === filter
                          ? "font-semibold text-foreground bg-[var(--sidebar-highlight)]"
                          : "text-muted-foreground"
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
              className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 shrink-0"
              style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Add Promo Code
            </Link>
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Promo Code</th>
                  <th className="py-4 pr-4 font-semibold">Title / eBook</th>
                  <th className="py-4 pr-4 font-semibold">Discount</th>
                  <th className="py-4 pr-4 font-semibold">Promo Duration</th>
                  <th className="py-4 pr-4 font-semibold">Status</th>
                  <th className="py-4 pr-4 text-center font-semibold">Enable / Disable</th>
                  <th className="py-4 pr-6" />
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
                    onClick={() =>
                      navigate({
                        to: "/publisher/promo-codes/$promoId",
                        params: { promoId: p.id },
                      })
                    }
                    className="group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/50"
                  >
                    <td className="py-5 pl-6 pr-4">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs font-semibold tracking-wider text-foreground">
                        <Tag size={12} className="text-[var(--brand)]" />
                        {p.code}
                      </span>
                    </td>
                    <td className="py-5 pr-4">
                      <p className="font-medium text-foreground group-hover:text-[var(--brand)] transition-colors">
                        {p.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                        {p.ebook}
                      </p>
                    </td>
                    <td className="py-5 pr-4 font-semibold text-foreground">{p.discount}%</td>
                    <td className="py-5 pr-4 text-muted-foreground">
                      {p.start} – {p.end}
                    </td>
                    <td className="py-5 pr-4">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="py-5 pr-4 text-center">
                      <ActivationToggle
                        activation={p.activation}
                        active={p.active}
                        onToggle={() => toggleActive(p.id)}
                      />
                    </td>
                    <td className="py-5 pr-6 text-right">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                        <ChevronRight size={16} />
                      </span>
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
              <li
                key={p.id}
                onClick={() =>
                  navigate({
                    to: "/publisher/promo-codes/$promoId",
                    params: { promoId: p.id },
                  })
                }
                className="cursor-pointer space-y-2.5 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs font-semibold">
                    <Tag size={12} className="text-[var(--brand)]" />
                    {p.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <StatusPill status={p.status} />
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.ebook}</p>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {p.start} – {p.end}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40">
                  <span className="text-xs font-semibold text-foreground">{p.discount}% off</span>
                  <ActivationToggle
                    activation={p.activation}
                    active={p.active}
                    onToggle={() => toggleActive(p.id)}
                  />
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
