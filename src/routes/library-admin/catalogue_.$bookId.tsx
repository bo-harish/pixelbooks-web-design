import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Star,
  Globe,
  CheckCircle2,
  CircleOff,
  Clock,
  FileX2,
  Tag,
  Building2,
  Eye,
  BookOpen,
  HardDrive,
  Users,
  Calendar,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { seedBooks } from "@/lib/catalogue-data";
import { initialLibraryBooks } from "@/lib/library-catalogue-data";

export const Route = createFileRoute("/library-admin/catalogue_/$bookId")({
  component: LibraryAdminBookDetailPage,
});

/* ------------------------------------------------------------------ */
/*  Shared UI Components mirroring publisher/catalogue/$bookId        */
/* ------------------------------------------------------------------ */

function AuthorAvatar({ author, size = "md" }: { author: string; size?: "sm" | "md" | "lg" }) {
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

const STATUS_CONFIGS: Record<
  string,
  {
    label: string;
    bgClass: string;
    textColor: string;
    borderColor: string;
    Icon: React.ElementType;
  }
> = {
  Published: {
    label: "Published",
    bgClass: "bg-emerald-500/12 dark:bg-emerald-500/20",
    textColor: "text-emerald-600 dark:text-emerald-400 font-semibold",
    borderColor: "border-emerald-500/30 dark:border-emerald-500/40",
    Icon: CheckCircle2,
  },
  Active: {
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
  Inactive: {
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

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIGS[status] ?? STATUS_CONFIGS.Published;
  const CurrentIcon = cfg.Icon;

  return (
    <div className="relative inline-block text-left">
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold tracking-tight ${cfg.bgClass} ${cfg.textColor} ${cfg.borderColor} cursor-default`}
      >
        <CurrentIcon size={15} className="shrink-0" />
        <span>{cfg.label}</span>
      </span>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-3.5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {title}
        </p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function MetaRow({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex gap-3 py-1 text-sm">
      <span className="w-52 shrink-0 text-muted-foreground">{label}</span>
      <span className={`font-medium text-foreground ${valueClass}`}>{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Library Admin eBook Detail Page                              */
/* ------------------------------------------------------------------ */

export function LibraryAdminBookDetailPage() {
  const { bookId } = Route.useParams();

  // Look up in library catalogue books first, then fallback to publisher catalogue seed books
  const libMatch = initialLibraryBooks.find((b) => b.id === bookId);
  const publisherMatch = seedBooks.find((b) => b.id === bookId);
  const fallback = initialLibraryBooks[0];

  const book = {
    id: bookId,
    title:
      libMatch?.title ??
      publisherMatch?.title ??
      (bookId === "nep-2020"
        ? "NEP 2020 - Policy Formulation In Education"
        : fallback.title),
    regionalName:
      libMatch?.title ??
      (bookId === "nep-2020"
        ? "NEP 2020 - Policy Formulation In Education"
        : fallback.title),
    author: libMatch?.author ?? publisherMatch?.author ?? "Dr. Ashok Alex",
    publisher: libMatch?.publisher ?? publisherMatch?.publisher ?? "PixelBooks Press",
    category: libMatch?.category ?? publisherMatch?.category ?? "Reference",
    subCategory:
      libMatch?.subCategory ??
      (bookId === "nep-2020" ? "Competitive Exams" : "19th Century Travel Memoirs"),
    status: (libMatch?.status === "Active" ? "Published" : libMatch?.status) ?? publisherMatch?.status ?? "Published",
    price: publisherMatch?.price ?? 899.0,
    cover:
      libMatch?.cover ??
      publisherMatch?.cover ??
      "linear-gradient(160deg, oklch(0.5 0.12 200), oklch(0.32 0.07 200))",
    initials: libMatch?.initials ?? publisherMatch?.initials ?? (bookId === "nep-2020" ? "NEP" : "TIA"),
    dop:
      libMatch?.purchaseDate ??
      publisherMatch?.dop ??
      (bookId === "nep-2020" ? "06 Jan 2026" : "23 Mar 2026"),
    language: libMatch?.language ?? publisherMatch?.language ?? "English",
    format: libMatch?.format ?? publisherMatch?.format ?? "EPUB",
    sizeMB:
      libMatch?.sizeMB ??
      (bookId === "nep-2020" ? "0.65 MB" : "4.8 MB"),
    viewers: bookId === "nep-2020" ? 12 : libMatch?.borrowers?.length ?? 18,
    rating: libMatch?.rating ?? 4.8,
    summary:
      libMatch?.description ??
      (bookId === "nep-2020"
        ? "NEP 2020 – Policy Formulation in Education provides an accessible overview of how India's National Education Policy 2020 was developed, what it aims to achieve, and its core components within the context of education reform."
        : fallback.description),
    tags:
      libMatch?.tags ??
      (bookId === "nep-2020"
        ? [
            "#National Education Policy 2020",
            "#Higher Education Reforms",
            "#Curriculum Transformation",
            "#Policy Formulation",
            "#Education Reforms in India",
          ]
        : fallback.tags ?? []),
    courses: libMatch?.courses ?? (bookId === "nep-2020" ? ["Liberal Arts Core"] : ["B.Sc (CS)", "B.Tech (IT)"]),
    batches: (bookId === "nep-2020" ? ["Batch 2025"] : ["2024 - 2028"]),
  };

  return (
    <AppShell title="eBook Details">
      <div className="space-y-4 p-4 md:p-8">
        {/* Back navigation */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/library-admin/catalogue"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Back to Catalogue"
          >
            <ArrowLeft size={16} />
          </Link>
          <Link
            to="/library-admin/catalogue"
            className="text-sm font-normal text-foreground hover:text-[var(--brand)] transition-colors"
          >
            Back to Catalogue
          </Link>
        </div>

        {/* ── Hero card ──────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Book Cover */}
            <div
              className="relative flex h-72 w-52 shrink-0 flex-col items-center justify-center rounded-xl text-base font-bold text-white shadow-md ring-1 ring-black/10 overflow-hidden self-center lg:self-start"
              style={{ background: book.cover }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
              <span className="relative z-10 text-lg font-extrabold tracking-wider">
                {book.initials}
              </span>
            </div>

            {/* Info Container */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Header: Title */}
              <div className="space-y-2.5 min-w-0">
                <h1 className="text-2xl font-bold tracking-tight leading-snug text-foreground">
                  {book.title}
                </h1>

                {/* Badges & Entity Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Author Chip */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-foreground shadow-2xs">
                    <AuthorAvatar author={book.author} size="sm" />
                    <span>{book.author}</span>
                  </div>

                  {/* Publisher Chip */}
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Building2 size={13} className="shrink-0 text-muted-foreground/80" />
                    <span>{book.publisher}</span>
                  </div>

                  {/* Category Pill */}
                  <span className="rounded-md border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {book.category}
                  </span>
                </div>
              </div>

              {/* Stats & Key Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {/* 1. Price */}
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Price
                    </span>
                    <Tag size={14} className="text-muted-foreground/80" />
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {book.price ? `₹${book.price.toFixed(2)}` : "Free"}
                  </p>
                </div>

                {/* 2. Readers */}
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Readers
                    </span>
                    <Users size={14} className="text-muted-foreground/80" />
                  </div>
                  <p className="text-lg font-bold text-foreground">{book.viewers}</p>
                </div>

                {/* 3. Published Date */}
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Published On
                    </span>
                    <Calendar size={14} className="text-muted-foreground/80" />
                  </div>
                  <p className="text-lg font-bold text-foreground">{book.dop}</p>
                </div>
              </div>

              {/* Metadata Sub-Row: Rating, Language, File Type, eBook Size, Course, Batch */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border/60 pt-3">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>{book.rating ? book.rating.toFixed(1) : "4.8"}</span>
                  <span className="text-muted-foreground">(1 review)</span>
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Globe size={13} className="text-muted-foreground" />
                  <span>
                    Language: <strong className="text-foreground">{book.language}</strong>
                  </span>
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span>
                    File Type: <strong className="text-foreground uppercase">{book.format}</strong>
                  </span>
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <HardDrive size={13} className="text-muted-foreground" />
                  <span>
                    eBook Size: <strong className="text-foreground">{book.sizeMB}</strong>
                  </span>
                </span>
                {book.courses && book.courses.length > 0 && (
                  book.courses.map((c) => (
                    <span key={c} className="contents">
                      <span className="h-3 w-px bg-border" />
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <GraduationCap size={13} className="text-blue-600 dark:text-blue-400" />
                        <span>
                          Course: <strong className="text-foreground">{c}</strong>
                        </span>
                      </span>
                    </span>
                  ))
                )}
                {book.batches && book.batches.length > 0 && (
                  book.batches.map((b) => (
                    <span key={b} className="contents">
                      <span className="h-3 w-px bg-border" />
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Users size={13} className="text-amber-600 dark:text-amber-400" />
                        <span>
                          Batch: <strong className="text-foreground">{b}</strong>
                        </span>
                      </span>
                    </span>
                  ))
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => toast.info(`Previewing "${book.title}"`)}
                  className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 shadow-2xs cursor-pointer"
                  style={{
                    backgroundColor: "var(--brand)",
                    color: "var(--brand-contrast)",
                  }}
                >
                  <Eye size={16} />
                  <span>Preview eBook</span>
                </button>
                <button
                  type="button"
                  onClick={() => toast.info(`Opening sample for "${book.title}"`)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer"
                >
                  <BookOpen size={16} />
                  <span>Preview Sample eBook</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── eBook Details ──────────────────────────────────────────── */}
        <SectionCard title="eBook Details">
          <div className="space-y-0.5">
            <MetaRow
              label="Status:"
              value={<StatusPill status={book.status} />}
            />
            <MetaRow label="Regional Name:" value={book.regionalName} />
          </div>

          {/* Summary */}
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-2 text-sm text-muted-foreground">Summary:</p>
            <p className="text-sm leading-relaxed text-foreground">{book.summary}</p>
          </div>

          {/* Tags */}
          {book.tags && book.tags.length > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-2.5 text-sm text-muted-foreground">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── Author + Sub Category ─────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="Author Details">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card px-3.5 py-1.5 shadow-2xs">
              <AuthorAvatar author={book.author} size="md" />
              <span className="text-sm font-semibold text-foreground">{book.author}</span>
            </div>
          </SectionCard>

          <SectionCard title="Sub Category">
            <p className="text-sm font-medium text-foreground">{book.subCategory || "—"}</p>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
