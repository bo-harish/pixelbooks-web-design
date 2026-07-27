import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  CircleOff,
  FileX2,
  Building2,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { seedBooks, type Book, type Status } from "@/lib/catalogue-data";

export const Route = createFileRoute("/publisher/catalogue/")({
  component: CataloguePage,
});

const STATUS_FILTERS: Array<"All" | Status> = ["All", "Published", "Unpublished", "Rejected"];

const LANGUAGE_FILTERS = [
  "All Languages",
  "English",
  "Hindi",
  "Tamil",
  "Spanish",
  "French",
];

const GENRE_FILTERS = [
  "All Genre",
  "Reference",
  "Academic & Education",
  "Literature",
  "Science & Tech",
];

const PAGE_SIZE = 8;

function AuthorAvatar({
  author,
  size = "md",
}: {
  author: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = author
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: "h-5 w-5 text-[8.5px]",
    md: "h-6 w-6 text-[10px]",
    lg: "h-8 w-8 text-xs",
  }[size];

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full border border-[var(--brand)]/30 font-extrabold shadow-2xs ${sizeClasses}`}
      style={{
        backgroundColor: "color-mix(in oklch, var(--brand) 15%, transparent)",
        color: "var(--brand)",
      }}
    >
      <span>{initials}</span>
    </div>
  );
}

function DropdownSelect<T extends string>({
  value,
  options,
  onChange,
  className = "min-w-[170px]",
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-11 items-center justify-between gap-2.5 rounded-lg border border-border bg-card px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] ${className}`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-30 mt-1.5 max-h-56 min-w-[190px] overflow-y-auto rounded-lg border border-border bg-card shadow-lg py-1"
          onMouseLeave={() => setOpen(false)}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-xs transition-colors hover:bg-secondary ${
                opt === value
                  ? "font-semibold text-foreground bg-[var(--sidebar-highlight)]"
                  : "text-muted-foreground"
              }`}
            >
              <span className="truncate">{opt}</span>
              {opt === value && <Check size={14} className="ml-2 shrink-0 text-[var(--brand)]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map = {
    Published: { color: "var(--success)", Icon: CheckCircle2 },
    Rejected: { color: "var(--danger)", Icon: FileX2 },
    Unpublished: { color: "#6b7280", Icon: CircleOff },
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
      <Icon size={14} />
      {status}
    </span>
  );
}

function StatusFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: (typeof STATUS_FILTERS)[number]) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 min-w-[130px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium"
      >
        {value}
        <ChevronDown size={16} className="text-muted-foreground" />
      </button>
      {open && (
        <div
          className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
          onMouseLeave={() => setOpen(false)}
        >
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-secondary ${
                s === value ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CataloguePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [languageFilter, setLanguageFilter] = useState("All Languages");
  const [genreFilter, setGenreFilter] = useState("All Genre");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return seedBooks.filter((b) => {
      if (filter !== "All" && b.status !== filter) return false;
      if (genreFilter !== "All Genre") {
        if (b.category !== genreFilter) return false;
      }
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.publisher ?? "").toLowerCase().includes(q) ||
        (b.isbn ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, filter, languageFilter, genreFilter]);

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
    <AppShell title="My Catalogue" subtitle="Manage every eBook in your storefront.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center">
          {/* Main Search Bar */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by ebook name, ISBN, author..."
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* All Languages Dropdown */}
            <DropdownSelect
              value={languageFilter}
              options={LANGUAGE_FILTERS}
              onChange={(v) => {
                setLanguageFilter(v);
                setPage(1);
              }}
              className="w-full sm:w-auto min-w-[130px]"
            />

            {/* All Genre Dropdown */}
            <DropdownSelect
              value={genreFilter}
              options={GENRE_FILTERS}
              onChange={(v) => {
                setGenreFilter(v);
                setPage(1);
              }}
              className="w-full sm:w-auto min-w-[130px]"
            />

            {/* Status Filter */}
            <StatusFilter
              value={filter}
              onChange={(v) => {
                setFilter(v);
                setPage(1);
              }}
            />

            {/* Add New Title Button */}
            <Link
              to="/publisher/catalogue/new"
              className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 shrink-0"
              style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Add New Title
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
                  <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                  <th className="py-4 pr-4 font-semibold">ISBN</th>
                  <th className="py-4 pr-4 font-semibold">Status</th>
                  <th className="py-4 pr-4 font-semibold">Pricing</th>
                  <th className="py-4 pr-6" />
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-sm text-muted-foreground">
                      No eBooks match your filters.
                    </td>
                  </tr>
                )}
                {pageItems.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() =>
                      navigate({ to: "/publisher/catalogue/$bookId", params: { bookId: b.id } })
                    }
                    className="group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/50"
                  >
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm"
                          style={{ background: b.cover }}
                        >
                          {b.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold leading-snug text-foreground transition-colors group-hover:text-[var(--brand)]">
                            {b.title}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-2.5 py-1 shadow-2xs">
                              <AuthorAvatar author={b.author} size="sm" />
                              <span className="text-[11.5px] font-semibold text-foreground">
                                {b.author}
                              </span>
                            </div>
                            <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                              {b.format}
                            </span>
                            <span className="text-[11px] text-muted-foreground">{b.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      {b.isbn ? (
                        <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                          {b.isbn}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="py-4 pr-4">
                      {b.price === null ? (
                        <span className="font-medium text-foreground">Free</span>
                      ) : (
                        <span className="font-medium">₹{b.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                        <ChevronRight size={16} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <ul className="divide-y divide-border/60 md:hidden">
            {pageItems.length === 0 && (
              <li className="py-16 text-center text-sm text-muted-foreground">
                No eBooks match your filters.
              </li>
            )}
            {pageItems.map((b) => (
              <li
                key={b.id}
                className="cursor-pointer p-4 transition-colors hover:bg-secondary/50"
                onClick={() =>
                  navigate({ to: "/publisher/catalogue/$bookId", params: { bookId: b.id } })
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm"
                    style={{ background: b.cover }}
                  >
                    {b.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{b.title}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                      <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-2.5 py-1 shadow-2xs">
                        <AuthorAvatar author={b.author} size="sm" />
                        <span className="text-[11.5px] font-semibold text-foreground">{b.author}</span>
                      </div>
                      <span className="rounded-md border border-border px-1.5 py-0.5 font-semibold text-muted-foreground">
                        {b.format}
                      </span>
                      <span className="text-muted-foreground">{b.category}</span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                      <StatusPill status={b.status} />
                      <span className="font-semibold">
                        {b.price === null ? "Free" : `₹${b.price.toFixed(2)}`}
                      </span>
                    </div>
                    {b.isbn && (
                      <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                        ISBN {b.isbn}
                      </p>
                    )}
                  </div>
                  <ChevronRight size={16} className="mt-1 shrink-0 text-muted-foreground" />
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
