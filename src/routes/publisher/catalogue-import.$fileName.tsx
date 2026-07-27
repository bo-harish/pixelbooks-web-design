import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, AlertCircle, XCircle, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/publisher/catalogue-import/$fileName")({
  component: ImportDetailPage,
});

type FileType = "PDF" | "EPUB";
type Status = "Failed" | "Success";
type DetailRow = {
  title: string;
  status: Status;
  fileType: FileType;
  reason?: string;
};

const rows: DetailRow[] = [
  {
    title: "illustrated-poetry-wireman",
    status: "Failed",
    fileType: "PDF",
    reason:
      "Category 'Literature & Poems' or its subcategories are not found in the existing catalog",
  },
  {
    title: "boris-the-singing-elephant-poems",
    status: "Failed",
    fileType: "PDF",
    reason:
      "Category 'Literature & Poems' or its subcategories are not found in the existing catalog",
  },
  {
    title: "BeneathTheShatteredVeil_new",
    status: "Failed",
    fileType: "EPUB",
    reason:
      "Category 'Literature & Poems' or its subcategories are not found in the existing catalog",
  },
  {
    title: "fresh-earth",
    status: "Failed",
    fileType: "PDF",
    reason:
      "Category 'Arts, Cinema, Photography' or its subcategories are not found in the existing catalog",
  },
  {
    title: "101-selected-poems",
    status: "Failed",
    fileType: "PDF",
    reason:
      "Category 'Arts, Cinema, Photography' or its subcategories are not found in the existing catalog",
  },
  {
    title: "skaum",
    status: "Failed",
    fileType: "PDF",
    reason: "Pricing is mandatory",
  },
  {
    title: "the-jade-bear-obooko",
    status: "Failed",
    fileType: "EPUB",
    reason:
      "Category 'Arts, Cinema, Photography' or its subcategories are not found in the existing catalog",
  },
  { title: "quiet-harbor-tales", status: "Success", fileType: "EPUB" },
  { title: "midnight-carousel", status: "Success", fileType: "PDF" },
];

function StatusPill({ status }: { status: Status }) {
  const failed = status === "Failed";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: failed
          ? "color-mix(in oklch, var(--danger) 12%, transparent)"
          : "color-mix(in oklch, var(--success) 15%, transparent)",
        color: failed ? "var(--danger)" : "var(--success)",
      }}
    >
      {failed ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
      {status}
    </span>
  );
}

function ImportDetailPage() {
  const { fileName } = Route.useParams();
  const decoded = decodeURIComponent(fileName);

  return (
    <AppShell title="Import Details">
      <div className="space-y-6 p-4 md:p-8">
        {/* Back + heading */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/publisher/catalogue-import/"
            aria-label="Back to imports"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold leading-tight">{decoded}</h2>
            <p className="text-sm text-muted-foreground">
              Upload Date: 23 Feb, 2026 • Total {rows.length} files
            </p>
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                  <th className="py-4 pr-4 font-semibold">File Status</th>
                  <th className="py-4 pr-4 font-semibold">File Type</th>
                  <th className="py-4 pr-6 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.title}
                    className="border-b border-border/60 align-top transition-colors last:border-0 hover:bg-secondary/50"
                  >
                    <td className="py-5 pl-6 pr-4">
                      <div className="font-medium text-foreground">{r.title}</div>
                      {r.reason && (
                        <div className="mt-1 text-[13px]" style={{ color: "var(--danger)" }}>
                          {r.reason}
                        </div>
                      )}
                    </td>
                    <td className="py-5 pr-4">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="py-5 pr-4">
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: r.fileType === "EPUB" ? "var(--success)" : "var(--foreground)",
                        }}
                      >
                        {r.fileType}
                      </span>
                    </td>
                    <td className="py-5 pr-6 text-right">
                      {r.status === "Failed" && (
                        <span
                          className="inline-flex h-8 w-8 items-center justify-center"
                          style={{
                            color: "var(--danger)",
                          }}
                          aria-label="Error"
                        >
                          <AlertCircle size={20} />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <ul className="divide-y divide-border/60 md:hidden">
            {rows.map((r) => (
              <li key={r.title} className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
                  {r.reason && (
                    <p className="mt-1 text-xs" style={{ color: "var(--danger)" }}>
                      {r.reason}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3">
                    <StatusPill status={r.status} />
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: r.fileType === "EPUB" ? "var(--success)" : "var(--foreground)",
                      }}
                    >
                      {r.fileType}
                    </span>
                  </div>
                </div>
                {r.status === "Failed" && (
                  <AlertCircle size={18} style={{ color: "var(--danger)" }} />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
