import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { usePublisherType } from "@/hooks/use-publisher-type";
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
  FileText,
  Clock,
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

const LIB_ONLY_STATUS_FILTERS: Array<"All" | Status> = ["All", "Draft", "Published", "Unpublished"];
const STANDARD_STATUS_FILTERS: Array<"All" | Status> = ["All", "Published", "Unpublished", "Rejected", "Draft"];

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

type StatusConfig = {
  label: string;
  bgClass: string;
  textColor: string;
  borderColor: string;
  Icon: React.ElementType;
};

const STATUS_CONFIGS: Record<Status, StatusConfig> = {
  Published: {
    label: "Published",
    bgClass: "bg-emerald-500/12 dark:bg-emerald-500/20",
    textColor: "text-emerald-600 dark:text-emerald-400 font-semibold",
    borderColor: "border-emerald-500/30 dark:border-emerald-500/40",
    Icon: CheckCircle2,
  },
  Draft: {
    label: "Draft",
    bgClass: "bg-amber-500/12 dark:bg-amber-500/20",
    textColor: "text-amber-600 dark:text-amber-400 font-semibold",
    borderColor: "border-amber-500/30 dark:border-amber-500/40",
    Icon: Clock,
  },
  Unpublished: {
    label: "Unpublished",
    bgClass: "bg-slate-500/12 dark:bg-slate-500/20",
    textColor: "text-slate-600 dark:text-slate-400 font-semibold",
    borderColor: "border-slate-500/30 dark:border-slate-500/40",
    Icon: CircleOff,
  },
  Rejected: {
    label: "Rejected",
    bgClass: "bg-rose-500/12 dark:bg-rose-500/20",
    textColor: "text-rose-600 dark:text-rose-400 font-semibold",
    borderColor: "border-rose-500/30 dark:border-rose-500/40",
    Icon: FileX2,
  },
};

function StatusSelectPill({
  status,
  onChange,
  allowedStatuses,
  readOnly = false,
}: {
  status: Status;
  onChange?: (newStatus: Status) => void;
  allowedStatuses?: Status[];
  readOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Status | null>(null);
  const cfg = STATUS_CONFIGS[status] ?? STATUS_CONFIGS.Published;
  const CurrentIcon = cfg.Icon;
  const options = allowedStatuses ?? ["Published", "Draft", "Unpublished", "Rejected"];

  const handleItemClick = (st: Status, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    if (st === status) return;

    if (st === "Published" || st === "Unpublished") {
      setPendingStatus(st);
    } else {
      onChange?.(st);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        disabled={readOnly}
        onClick={(e) => {
          e.stopPropagation();
          if (!readOnly) setOpen((o) => !o);
        }}
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold tracking-tight transition-all ${cfg.bgClass} ${cfg.textColor} ${cfg.borderColor} ${
          readOnly ? "cursor-default" : "hover:opacity-90 cursor-pointer shadow-2xs"
        }`}
      >
        <CurrentIcon size={15} className="shrink-0" />
        <span>{cfg.label}</span>
        {!readOnly && (
          <ChevronDown
            size={14}
            className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && !readOnly && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="absolute left-0 top-full z-40 mt-1.5 min-w-[155px] overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {options.map((st) => {
              const itemCfg = STATUS_CONFIGS[st];
              const ItemIcon = itemCfg.Icon;
              const isSelected = st === status;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={(e) => handleItemClick(st, e)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    isSelected ? "bg-secondary/80" : "hover:bg-secondary/50"
                  } ${itemCfg.textColor}`}
                >
                  <ItemIcon size={16} className="shrink-0" />
                  <span>{itemCfg.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Confirmation Modal for Publish / Unpublish */}
      {pendingStatus && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            e.stopPropagation();
            setPendingStatus(null);
          }}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  pendingStatus === "Published"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-slate-500/15 text-slate-600 dark:text-slate-400"
                }`}
              >
                {pendingStatus === "Published" ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <CircleOff size={22} />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {pendingStatus === "Published" ? "Confirm Publish eBook" : "Confirm Unpublish eBook"}
                </h3>
                <p className="text-xs text-muted-foreground">Confirmation required</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {pendingStatus === "Published"
                ? "Are you sure you want to publish this eBook? Once published, it will become active and accessible to readers and libraries."
                : "Are you sure you want to unpublish this eBook? Unpublishing will hide it from active catalogue views and new borrowings."}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPendingStatus(null)}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = pendingStatus;
                  setPendingStatus(null);
                  onChange?.(target);
                }}
                className={`inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 cursor-pointer ${
                  pendingStatus === "Published" ? "bg-emerald-600" : "bg-slate-700"
                }`}
              >
                {pendingStatus === "Published" ? "Confirm & Publish" : "Confirm & Unpublish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  return <StatusSelectPill status={status} readOnly />;
}

function StatusFilter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <DropdownSelect
      value={value}
      options={options}
      onChange={onChange}
      searchable
      searchPlaceholder="Search status..."
      className="w-full sm:w-auto min-w-[130px]"
    />
  );
}

function CataloguePage() {
  const navigate = useNavigate();
  const [publisherType] = usePublisherType();
  const isLibraryOnly = publisherType === "Library-Only Publisher";
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [languageFilter, setLanguageFilter] = useState("All Languages");
  const [genreFilter, setGenreFilter] = useState("All Genre");
  const [page, setPage] = useState(1);

  const statusOptions = isLibraryOnly ? LIB_ONLY_STATUS_FILTERS : STANDARD_STATUS_FILTERS;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return seedBooks
      .map((b) => {
        if (isLibraryOnly && (b.status as string) === "Rejected") {
          return { ...b, status: "Draft" as Status };
        }
        return b;
      })
      .filter((b) => {
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
  }, [query, filter, languageFilter, genreFilter, isLibraryOnly]);

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
    <AppShell title="eBook Catalogue" subtitle="Manage every eBook in your storefront.">
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
              options={statusOptions}
              onChange={(v) => {
                setFilter(v as typeof filter);
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
                  <th className="py-4 pr-4 font-semibold">{isLibraryOnly ? "Copies" : "Pricing"}</th>
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
                      {isLibraryOnly ? (
                        <span className="font-semibold text-foreground">{b.licenseCount ?? 50} copies</span>
                      ) : b.price === null ? (
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
                        {isLibraryOnly
                          ? `${b.licenseCount ?? 50} copies`
                          : b.price === null
                          ? "Free"
                          : `₹${b.price.toFixed(2)}`}
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
