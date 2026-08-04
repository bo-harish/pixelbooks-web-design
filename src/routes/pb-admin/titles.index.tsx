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
  User,
  Building2,
  Check,
  Feather,
  Upload,
  ScrollText,
  Table,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BookCover } from "@/components/ui/book-cover";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { seedBooks, type Book, type Status } from "@/lib/catalogue-data";

export const Route = createFileRoute("/pb-admin/titles/")({
  component: TitlesCataloguePage,
});

const STATUS_FILTERS: Array<"All" | Status> = ["All", "Published", "Unpublished", "Rejected"];
const PUBLISHER_AUTHOR_FILTERS = [
  "Publisher & Author",
  "Publisher",
  "Author",
];

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
  searchable = false,
  searchPlaceholder = "Search...",
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return options;
    const q = searchTerm.toLowerCase().trim();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, searchable, searchTerm]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setSearchTerm("");
        }}
        className={`flex h-11 items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] ${className}`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-30 mt-2 max-h-64 min-w-40 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg flex flex-col"
          onMouseLeave={() => setOpen(false)}
        >
          {searchable && (
            <div className="p-2 border-b border-border bg-card sticky top-0 z-10">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-2.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  autoFocus
                  className="w-full h-8 pl-8 pr-2 text-xs rounded-md border border-border bg-secondary/50 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto max-h-48 py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2.5 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-secondary ${
                    opt === value
                      ? "font-medium text-foreground bg-secondary/50"
                      : "text-muted-foreground"
                  }`}
                >
                  <span className="truncate">{opt}</span>
                </button>
              ))
            )}
          </div>
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
  value: (typeof STATUS_FILTERS)[number];
  onChange: (v: (typeof STATUS_FILTERS)[number]) => void;
}) {
  return (
    <DropdownSelect
      value={value}
      options={STATUS_FILTERS as unknown as string[]}
      onChange={(v) => onChange(v as (typeof STATUS_FILTERS)[number])}
      searchable
      searchPlaceholder="Search status..."
      className="w-full sm:w-auto min-w-[130px]"
    />
  );
}

function TitlesCataloguePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [entityFilter, setEntityFilter] = useState("Publisher & Author");
  const [languageFilter, setLanguageFilter] = useState("All Languages");
  const [genreFilter, setGenreFilter] = useState("All Genre");
  const [page, setPage] = useState(1);
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return seedBooks.filter((b) => {
      if (filter !== "All" && b.status !== filter) return false;
      if (entityFilter !== "Publisher & Author") {
        if (entityFilter === "Publisher" && !b.publisher) return false;
        if (entityFilter === "Author" && !b.author) return false;
      }
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
  }, [query, filter, entityFilter, languageFilter, genreFilter]);

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
    <AppShell title="Titles Catalogue" subtitle="Manage every eBook across the PixelBooks platform.">
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
            {/* Publishers / Authors Dropdown */}
            <DropdownSelect
              value={entityFilter}
              options={PUBLISHER_AUTHOR_FILTERS}
              onChange={(v) => {
                setEntityFilter(v);
                setPage(1);
              }}
              searchable
              searchPlaceholder="Search entity..."
              className="w-full sm:w-auto min-w-[180px]"
            />

            {/* All Languages Dropdown */}
            <DropdownSelect
              value={languageFilter}
              options={LANGUAGE_FILTERS}
              onChange={(v) => {
                setLanguageFilter(v);
                setPage(1);
              }}
              searchable
              searchPlaceholder="Search language..."
              className="w-full sm:w-auto min-w-[150px]"
            />

            {/* All Genre Dropdown */}
            <DropdownSelect
              value={genreFilter}
              options={GENRE_FILTERS}
              onChange={(v) => {
                setGenreFilter(v);
                setPage(1);
              }}
              searchable
              searchPlaceholder="Search genre..."
              className="w-full sm:w-auto min-w-[150px]"
            />

            {/* Status Filter */}
            <StatusFilter
              value={filter}
              onChange={(v) => {
                setFilter(v);
                setPage(1);
              }}
            />

            {/* Export Dropdown */}
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setExportOpen((v) => !v)}
                className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-xs font-semibold shadow-2xs transition-opacity hover:opacity-90 cursor-pointer shrink-0"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                <Upload size={15} />
                <span>Export</span>
                <ChevronDown size={14} />
              </button>
              {exportOpen && (
                <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setExportOpen(false);
                      toast.success("Downloading Titles Catalogue (PDF)...");
                    }}
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary cursor-pointer"
                  >
                    <ScrollText size={15} className="text-muted-foreground" />
                    <span>Export PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExportOpen(false);
                      toast.success("Downloading Titles Catalogue (Excel)...");
                    }}
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary cursor-pointer"
                  >
                    <Table size={15} className="text-muted-foreground" />
                    <span>Export Excel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Title Details</th>
                  <th className="py-4 pr-4 font-semibold">ISBN</th>
                  <th className="py-4 pr-4 font-semibold">Language</th>
                  <th className="py-4 pr-4 font-semibold">DOP</th>
                  <th className="py-4 pr-4 font-semibold">Status</th>
                  <th className="py-4 pr-4 font-semibold">Sale Price</th>
                  <th className="py-4 pr-6" />
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                      No eBooks match your filters.
                    </td>
                  </tr>
                )}
                {pageItems.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() =>
                      navigate({ to: "/pb-admin/titles/$bookId", params: { bookId: b.id } })
                    }
                    className="group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/50"
                  >
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-start gap-4">
                        {/* Cover thumbnail */}
                        <BookCover
                          initials={b.initials}
                          coverGradient={b.cover}
                          title={b.title}
                          size="sm"
                        />

                        {/* Title & Metadata */}
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <p className="font-semibold text-sm leading-snug text-foreground transition-colors group-hover:text-[var(--brand)]">
                            {b.title}
                          </p>

                          {/* Author & Publisher Chips */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2 py-0.5 shadow-2xs">
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                <Feather size={9} />
                              </span>
                              <span className="text-[11px] font-medium text-foreground">
                                {b.author}
                              </span>
                            </div>

                            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2 py-0.5 shadow-2xs">
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                <Building2 size={9} />
                              </span>
                              <span className="text-[11px] font-medium text-foreground">
                                {b.publisher ?? "PixelBooks Press"}
                              </span>
                            </div>
                          </div>

                          {/* Format & Category */}
                          <div className="flex items-center gap-2 text-xs">
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
                    <td className="py-4 pr-4 text-xs font-medium text-foreground whitespace-nowrap">
                      {b.language ?? "English"}
                    </td>
                    <td className="py-4 pr-4 text-xs text-muted-foreground whitespace-nowrap">
                      {b.dop ?? "12 Jun 2026"}
                    </td>
                    <td className="py-4 pr-4">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      {b.price === null ? (
                        <span className="font-semibold text-foreground">Free</span>
                      ) : (
                        <span className="font-semibold text-foreground">₹{b.price.toFixed(2)}</span>
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
                  navigate({ to: "/pb-admin/titles/$bookId", params: { bookId: b.id } })
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className="relative flex h-16 w-12 shrink-0 flex-col items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm ring-1 ring-black/10 overflow-hidden"
                    style={{ background: b.cover }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                    <span className="relative z-10 text-[11px] font-extrabold tracking-wider">{b.initials}</span>
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate text-sm font-semibold text-foreground">{b.title}</p>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2 py-0.5 shadow-2xs">
                        <span
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[7.5px] font-bold text-white"
                          style={{ background: b.cover }}
                        >
                          {b.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                        <span className="text-[11px] font-medium text-foreground">{b.author}</span>
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/60 px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                        <Building2 size={10} className="shrink-0 text-muted-foreground/80" />
                        <span>{b.publisher ?? "PixelBooks Press"}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] pt-0.5">
                      <span className="rounded-md border border-border px-1.5 py-0.5 font-semibold text-muted-foreground">
                        {b.format}
                      </span>
                      <span className="text-muted-foreground">{b.category}</span>
                      <span className="text-muted-foreground">• {b.language ?? "English"}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs pt-1">
                      <StatusPill status={b.status} />
                      <span className="font-semibold text-foreground">
                        Sale Price: {b.price === null ? "Free" : `₹${b.price.toFixed(2)}`}
                      </span>
                      <span className="text-muted-foreground text-[11px]">
                        DOP: {b.dop ?? "12 Jun 2026"}
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
