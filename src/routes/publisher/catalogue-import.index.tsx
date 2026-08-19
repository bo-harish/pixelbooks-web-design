import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevRight,
  FileSpreadsheet,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/publisher/catalogue-import/")({
  component: CatalogueImportPage,
});

type ImportRow = {
  fileName: string;
  date: string;
  total: number;
  uploaded: number;
  failed: number;
};

const seed: ImportRow[] = [
  {
    fileName: "BulkImport_20260323_094636.xlsx",
    date: "23 Mar 2026",
    total: 2,
    uploaded: 0,
    failed: 2,
  },
  {
    fileName: "BulkImport_20260318_142201.xlsx",
    date: "18 Mar 2026",
    total: 24,
    uploaded: 22,
    failed: 2,
  },
  {
    fileName: "BulkImport_20260311_101055.xlsx",
    date: "11 Mar 2026",
    total: 10,
    uploaded: 10,
    failed: 0,
  },
  {
    fileName: "BulkImport_20260228_183914.xlsx",
    date: "28 Feb 2026",
    total: 48,
    uploaded: 45,
    failed: 3,
  },
  {
    fileName: "BulkImport_20260214_090412.xlsx",
    date: "14 Feb 2026",
    total: 15,
    uploaded: 15,
    failed: 0,
  },
  {
    fileName: "BulkImport_20260202_162308.xlsx",
    date: "02 Feb 2026",
    total: 7,
    uploaded: 5,
    failed: 2,
  },
  {
    fileName: "BulkImport_20260121_113045.xlsx",
    date: "21 Jan 2026",
    total: 30,
    uploaded: 28,
    failed: 2,
  },
  {
    fileName: "BulkImport_20260108_154722.xlsx",
    date: "08 Jan 2026",
    total: 12,
    uploaded: 12,
    failed: 0,
  },
  {
    fileName: "BulkImport_20251222_074511.xlsx",
    date: "22 Dec 2025",
    total: 5,
    uploaded: 4,
    failed: 1,
  },
  {
    fileName: "BulkImport_20251210_130800.xlsx",
    date: "10 Dec 2025",
    total: 18,
    uploaded: 17,
    failed: 1,
  },
];

const PAGE_SIZE = 6;

function CatalogueImportPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const rows = seed;

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = rows.slice(start, start + PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    const nums: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) nums.push(i);
      else if (nums[nums.length - 1] !== "…") nums.push("…");
    }
    return nums;
  }, [totalPages, currentPage]);

  return (
    <AppShell title="Catalogue Import" subtitle="Bulk-upload your eBook metadata via spreadsheet.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-secondary/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-2xs"
              style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
            >
              <FileSpreadsheet size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Import your catalogue</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Upload an .xlsx file. We accept the PixelBooks bulk-import template.
              </p>
            </div>
          </div>
          <Link
            to="/publisher/catalogue-import/new"
            className="inline-flex h-11 cursor-pointer items-center gap-2 self-start rounded-lg px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 sm:self-auto"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            <Upload size={17} strokeWidth={2.4} />
            Catalogue Import
          </Link>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">File Name</th>
                  <th className="py-4 pr-4 font-semibold">Date of Upload</th>
                  <th className="py-4 pr-4 font-semibold">Total Files</th>
                  <th className="py-4 pr-4 font-semibold">File Uploaded</th>
                  <th className="py-4 pr-4 font-semibold">File Failed</th>
                  <th className="py-4 pr-6 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">
                      No imports yet — upload your first file above.
                    </td>
                  </tr>
                )}
                {pageItems.map((r) => (
                  <tr
                    key={r.fileName}
                    onClick={() =>
                      navigate({
                        to: "/publisher/catalogue-import/$fileName",
                        params: { fileName: r.fileName },
                      })
                    }
                    className="group cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50"
                  >
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                          style={{ backgroundColor: "var(--sidebar-highlight)" }}
                        >
                          <FileSpreadsheet size={17} style={{ color: "var(--brand)" }} />
                        </div>
                        <span className="font-medium text-foreground">{r.fileName}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">{r.date}</td>
                    <td className="py-4 pr-4 font-medium">{r.total} Files</td>
                    <td className="py-4 pr-4 font-medium text-emerald-600 dark:text-emerald-400">
                      {r.uploaded} Files
                    </td>
                    <td className="py-4 pr-4 font-medium text-rose-600 dark:text-rose-400">
                      {r.failed} Files
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <span
                        aria-label="View details"
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

          {/* Mobile stacked cards */}
          <ul className="divide-y divide-border/60 md:hidden">
            {pageItems.length === 0 && (
              <li className="py-16 text-center text-sm text-muted-foreground">
                No imports yet — upload your first file above.
              </li>
            )}
            {pageItems.map((r) => (
              <li key={r.fileName} className="p-4">
                <Link
                  to="/publisher/catalogue-import/$fileName"
                  params={{ fileName: r.fileName }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: "var(--sidebar-highlight)" }}
                  >
                    <FileSpreadsheet size={17} style={{ color: "var(--brand)" }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.fileName}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{r.date}</p>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-semibold">{r.total}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Uploaded</p>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {r.uploaded}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Failed</p>
                        <p className="font-semibold text-rose-600 dark:text-rose-400">{r.failed}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination footer */}
          <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p className="text-xs text-muted-foreground">
              {rows.length === 0
                ? "0 results"
                : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, rows.length)} of ${rows.length} results`}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium disabled:opacity-40"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              {pageNumbers.map((n, i) =>
                n === "…" ? (
                  <span key={`e-${i}`} className="px-2 text-xs text-muted-foreground">
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className="flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-xs font-medium transition-colors"
                    style={
                      n === currentPage
                        ? {
                            backgroundColor: "var(--brand)",
                            color: "var(--brand-contrast)",
                            borderColor: "transparent",
                          }
                        : { borderColor: "var(--border)" }
                    }
                  >
                    {n}
                  </button>
                ),
              )}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium disabled:opacity-40"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
