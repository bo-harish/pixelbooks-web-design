import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevRight,
  FileX2,
  CheckCircle2,
  Clock,
  CircleOff,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export const Route = createFileRoute("/publisher/bundles/")({
  head: () => ({
    meta: [
      { title: "eBook Bundles — PixelBooks" },
      {
        name: "description",
        content: "Create and manage curated eBook bundles for your catalogue.",
      },
      { property: "og:title", content: "eBook Bundles — PixelBooks" },
      {
        property: "og:description",
        content: "Create and manage curated eBook bundles for your catalogue.",
      },
    ],
  }),
  component: BundlesPage,
});

import { getBundles, saveBundles, type Bundle, type BundleStatus } from "@/lib/bundles-data";

const filters = ["All", "Approved", "Pending", "Rejected"] as const;
type Filter = (typeof filters)[number];
const PAGE_SIZE = 8;

function StatusPill({ status }: { status: BundleStatus }) {
  const map = {
    Published: { color: "var(--success)", Icon: CheckCircle2, label: "Published" },
    Approved: { color: "var(--success)", Icon: CheckCircle2, label: "Approved" },
    Rejected: { color: "var(--danger)", Icon: FileX2, label: "Rejected" },
    Unpublished: { color: "#6b7280", Icon: CircleOff, label: "Unpublished" },
    Pending: { color: "#d97706", Icon: Clock, label: "Pending" },
  } as const;
  const s = map[status] ?? map.Unpublished;
  const { color, Icon } = s;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)`,
        color,
      }}
    >
      <Icon size={13} />
      {s.label}
    </span>
  );
}

function BundlesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [bundles, setBundles] = useState<Bundle[]>(() => getBundles());
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return bundles.filter((b) => {
      const matchesFilter = filter === "All" || b.status === filter;
      const matchesQuery = b.title.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [bundles, filter, query]);

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

  const toggleActive = (id: string) => {
    setBundles((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b));
      saveBundles(updated);
      return updated;
    });
  };

  return (
    <AppShell title="eBook Bundles" subtitle="Group multiple titles into curated bundles.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
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
                    }}
                    className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary ${
                      f === filter ? "font-semibold text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/publisher/bundles/new"
            className="flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            <Plus size={17} strokeWidth={2.4} />
            Add New Bundle
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                  <th className="py-4 pr-4 text-center font-semibold">Status</th>
                  <th className="py-4 pr-4 text-center font-semibold">Pricing</th>
                  <th className="py-4 pr-4 text-center font-semibold">Active</th>
                  <th className="py-4 pr-6" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-sm text-muted-foreground">
                      No bundles match your filters.
                    </td>
                  </tr>
                )}
                {pageItems.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() =>
                      navigate({ to: "/publisher/bundles/$bundleId", params: { bundleId: b.id } })
                    }
                    className="group cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50"
                  >
                    <td className="py-5 pl-6 pr-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm"
                          style={{ background: b.cover }}
                        >
                          {b.initials}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{b.title}</div>
                          <span
                            className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                            style={{
                              backgroundColor: "var(--secondary)",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            {b.bookCount} {b.bookCount === 1 ? "book" : "books"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 pr-4 text-center">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="py-5 pr-4 text-center font-medium">₹{b.pricing}</td>
                    <td className="py-5 pr-4">
                      <div className="flex items-center justify-center">
                        <button
                          role="switch"
                          aria-checked={b.active}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleActive(b.id);
                          }}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                          style={{
                            backgroundColor: b.active ? "var(--brand)" : "var(--muted)",
                          }}
                        >
                          <span
                            className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                            style={{ transform: b.active ? "translateX(22px)" : "translateX(2px)" }}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="py-5 pr-6 text-right">
                      <span
                        aria-label="View bundle"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground"
                      >
                        <ChevRight size={16} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-border/60 md:hidden">
            {pageItems.map((b) => (
              <li
                key={b.id}
                onClick={() =>
                  navigate({ to: "/publisher/bundles/$bundleId", params: { bundleId: b.id } })
                }
                className="flex cursor-pointer items-start gap-3 p-4 hover:bg-secondary/40 transition-colors"
              >
                <div
                  className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm"
                  style={{ background: b.cover }}
                >
                  {b.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{b.title}</p>
                  <p className="text-[11px] text-muted-foreground">{b.bookCount} books</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusPill status={b.status} />
                    <span className="text-xs font-medium">₹{b.pricing}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActive(b.id);
                      }}
                      className="ml-auto text-xs font-medium"
                      style={{ color: b.active ? "var(--success)" : "var(--muted-foreground)" }}
                    >
                      {b.active ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination footer */}
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
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
