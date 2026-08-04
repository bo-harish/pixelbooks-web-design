import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useMemo, useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AppShell } from "@/components/app-shell";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { BookCover } from "@/components/ui/book-cover";

export const Route = createFileRoute("/library-admin/manage-ebooks")({
  component: ManageEbooksPage,
});

interface Borrower {
  id: string;
  name: string;
  role: string;
  borrowDate: string;
  expReturnDate: string;
}

interface EbookRow {
  id: string;
  title: string;
  initials: string;
  cover: string;
  totalBorrowed: number;
  copies: number;
  borrowers: Borrower[];
}

type DateField = "borrowDate" | "expReturnDate";

const DUMMY_DATA: EbookRow[] = [
  {
    id: "1",
    title: "A Practice of What's Not Preached",
    initials: "PWP",
    cover: "linear-gradient(135deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
    totalBorrowed: 1,
    copies: 500,
    borrowers: [
      {
        id: "b1",
        name: "Dyuthi",
        role: "Student",
        borrowDate: "21 Jul 2026",
        expReturnDate: "22 Jul 2026",
      },
    ],
  },
];

function ManageEbooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateField, setDateField] = useState<DateField>("borrowDate");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const PAGE_SIZE = 6;

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const toDayStamp = (displayDate: string) => {
      const d = new Date(displayDate);
      if (Number.isNaN(d.getTime())) return null;
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    };

    const fromStamp = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
    const toStamp = toDate ? new Date(toDate).setHours(0, 0, 0, 0) : null;

    return DUMMY_DATA.filter((row) => {
      const matchesSearch = !query || row.title.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      if (!fromStamp && !toStamp) return true;

      return row.borrowers.some((borrower) => {
        const stamp = toDayStamp(borrower[dateField]);
        if (stamp === null) return false;
        if (fromStamp && stamp < fromStamp) return false;
        if (toStamp && stamp > toStamp) return false;
        return true;
      });
    });
  }, [searchQuery, dateField, fromDate, toDate]);

  const totalResults = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + PAGE_SIZE);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleRevokeAll = (row: EbookRow) => {
    // eslint-disable-next-line no-console
    console.log(`Revoke all copies for "${row.title}"`);
  };

  const handleRevoke = (row: EbookRow, borrower: Borrower) => {
    // eslint-disable-next-line no-console
    console.log(`Revoke "${row.title}" from ${borrower.name}`);
  };

  return (
    <AppShell
      title="Manage Borrowings"
      subtitle="Track borrowed titles and revoke access for individual or all borrowers."
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
          <div className="relative w-full lg:max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search"
              className="h-10 w-full rounded-lg border border-border bg-white dark:bg-card pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] text-foreground"
            />
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <DropdownSelect
              value={dateField === "borrowDate" ? "Borrow Date" : "Exp. Return Date"}
              options={["Borrow Date", "Exp. Return Date"]}
              onChange={(v) => {
                setDateField(v === "Borrow Date" ? "borrowDate" : "expReturnDate");
                setPage(1);
              }}
              searchable
              searchPlaceholder="Search field..."
              className="w-full sm:w-auto min-w-[160px]"
            />

            <div className="w-full sm:w-[200px]">
              <label className="relative flex h-10 items-center rounded-lg border border-border bg-white dark:bg-card px-3">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-transparent text-sm outline-none text-foreground"
                  aria-label="From Date"
                />
              </label>
            </div>

            <div className="w-full sm:w-[200px]">
              <label className="relative flex h-10 items-center rounded-lg border border-border bg-white dark:bg-card px-3">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-transparent text-sm outline-none text-foreground"
                  aria-label="To Date"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Titles</th>
                  <th className="py-4 px-4 font-semibold text-center">Total Books Borrowed</th>
                  <th className="py-4 px-4 font-semibold text-center">Copies</th>
                  <th className="py-4 pl-4 pr-6 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-sm text-muted-foreground">
                      No eBooks found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => {
                    const isExpanded = expandedId === row.id;
                    return (
                      <Fragment key={row.id}>
                        <tr
                          onClick={() => toggleExpand(row.id)}
                          className={`transition-colors hover:bg-secondary/40 cursor-pointer ${
                            isExpanded ? "bg-secondary/20" : ""
                          }`}
                        >
                          {/* Title */}
                          <td className="py-4 pl-6 pr-4">
                            <div className="flex items-center gap-4">
                              <BookCover
                                initials={row.initials}
                                coverGradient={row.cover}
                                title={row.title}
                                size="sm"
                              />
                              <span className="font-semibold text-foreground block truncate max-w-sm md:max-w-md lg:max-w-lg">
                                {row.title}
                              </span>
                            </div>
                          </td>

                          {/* Total Books Borrowed */}
                          <td className="py-4 px-4 text-center font-medium text-foreground">
                            {row.totalBorrowed}
                          </td>

                          {/* Copies */}
                          <td className="py-4 px-4 text-center text-muted-foreground">
                            {row.copies}
                          </td>

                          {/* Action Button & Chevron */}
                          <td className="py-4 pl-4 pr-6 text-right">
                            <div className="inline-flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRevokeAll(row);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-opacity hover:opacity-90 shadow-sm"
                                style={{
                                  backgroundColor: "var(--brand)",
                                  color: "var(--brand-contrast)",
                                }}
                              >
                                Revoke All
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpand(row.id);
                                }}
                                className="p-1 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
                                aria-label={isExpanded ? "Collapse row" : "Expand row"}
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Borrowers Area */}
                        {isExpanded && (
                          <tr className="bg-secondary/10">
                            <td colSpan={4} className="p-0 border-b border-border/60">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-border/60 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    <th className="py-3 pl-20 pr-4 font-semibold">Borrower</th>
                                    <th className="py-3 px-4 font-semibold">Borrow Date</th>
                                    <th className="py-3 px-4 font-semibold">Exp. Return Date</th>
                                    <th className="py-3 pl-4 pr-6 font-semibold" />
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                  {row.borrowers.map((borrower) => (
                                    <tr key={borrower.id}>
                                      <td className="py-3 pl-20 pr-4">
                                        <div className="flex items-center gap-3">
                                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground">
                                            {borrower.name.charAt(0)}
                                          </div>
                                          <div>
                                            <div className="font-medium text-foreground">
                                              {borrower.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {borrower.role}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-3 px-4 text-muted-foreground">
                                        {borrower.borrowDate}
                                      </td>
                                      <td className="py-3 px-4 text-muted-foreground">
                                        {borrower.expReturnDate}
                                      </td>
                                      <td className="py-3 pl-4 pr-6 text-right">
                                        <button
                                          onClick={() => handleRevoke(row, borrower)}
                                          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-opacity hover:opacity-90 shadow-sm"
                                          style={{
                                            backgroundColor: "var(--brand)",
                                            color: "var(--brand-contrast)",
                                          }}
                                        >
                                          Revoke
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Results & Pagination Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
          <div className="text-sm font-medium text-muted-foreground">
            Showing {paginatedRows.length} from {totalResults} results
          </div>

          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <span>«</span> Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isPageActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    isPageActive
                      ? "bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              Next <span>»</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
