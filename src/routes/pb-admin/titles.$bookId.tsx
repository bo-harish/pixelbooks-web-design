import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Star,
  Globe,
  CheckCircle2,
  XCircle,
  CircleOff,
  Tag,
  Copy,
  Check,
  FileX2,
  User,
  ChevronDown,
  X,
  Building2,
  Search,
  Eye,
  BookOpen,
  HardDrive,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { seedBooks, type Status } from "@/lib/catalogue-data";

export const Route = createFileRoute("/pb-admin/titles/$bookId")({
  component: EBookDetailPage,
});

/* ------------------------------------------------------------------ */
/*  Mock per-book extra details (language, summary, tags, price, etc.) */
/* ------------------------------------------------------------------ */

type BookExtra = {
  language: string;
  regionalName: string;
  dateOfPublication: string;
  sizeMB: string;
  viewers: number;
  summary: string;
  tags: string[];
  subCategory: string;
  gstRate: number;
};

const extraDefaults: BookExtra = {
  language: "English",
  regionalName: "—",
  dateOfPublication: "—",
  sizeMB: "0.00",
  viewers: 0,
  summary: "No summary available for this eBook.",
  tags: [],
  subCategory: "—",
  gstRate: 5,
};

const extras: Record<string, BookExtra> = {
  "nep-2020": {
    language: "English",
    regionalName: "NEP 2020 - Policy Formulation In Education",
    dateOfPublication: "06 Jan 2026",
    sizeMB: "0.65",
    viewers: 12,
    summary:
      "NEP 2020 – Policy Formulation in Education provides an accessible overview of how India's National Education Policy 2020 was developed, what it aims to achieve, and its core components within the context of education reform.",
    tags: [
      "#National Education Policy 2020",
      "#Higher Education Reforms",
      "#Curriculum Transformation",
      "#Policy Formulation",
      "#Education Reforms in India",
    ],
    subCategory: "Competitive Exams",
    gstRate: 5,
  },
};

function getExtra(id: string): BookExtra {
  return extras[id] ?? extraDefaults;
}

/* ------------------------------------------------------------------ */
/*  Shared UI pieces                                                    */
/* ------------------------------------------------------------------ */

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

function StatusStamp({ status }: { status: Status }) {
  const map = {
    Published: { label: "PUBLISHED", color: "#059669" },
    Rejected: { label: "REJECTED", color: "#e11d48" },
    Unpublished: { label: "DRAFT", color: "#6b7280" },
  };
  const s = map[status];
  return (
    <div
      className="flex h-16 w-16 shrink-0 rotate-12 items-center justify-center rounded-full border-[3px] text-[8px] font-black uppercase tracking-widest opacity-80"
      style={{ borderColor: s.color, color: s.color }}
    >
      {s.label}
    </div>
  );
}

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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-3.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
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

function CopyBookUrlButton({ bookId }: { bookId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/titles/${bookId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
    >
      {copied ? (
        <>
          <Check size={15} className="text-emerald-500" />
          Copied!
        </>
      ) : (
        <>
          <Copy size={15} />
          Copy Book URL
        </>
      )}
    </button>
  );
}

const AVAILABLE_LIBRARIES = [
  "Central University Digital Library",
  "National Science & Tech Consortium",
  "City Academic Library System",
  "Delhi Public Library",
  "State Institute of Technology Library",
];

function LibraryStoreAllocationCard() {
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLibraries = AVAILABLE_LIBRARIES.filter((lib) =>
    lib.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const toggleLibrary = (lib: string) => {
    if (selectedLibraries.includes(lib)) {
      setSelectedLibraries(selectedLibraries.filter((item) => item !== lib));
    } else {
      setSelectedLibraries([...selectedLibraries, lib]);
    }
  };

  const removeLibrary = (lib: string) => {
    setSelectedLibraries(selectedLibraries.filter((item) => item !== lib));
  };

  return (
    <SectionCard title="Library Store Allocation">
      <div className="space-y-5 pt-1">
        {/* Field 1: Select Library */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            Select Library
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex h-14 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/30 outline-none focus:border-[var(--brand)]"
            >
              <span className="text-muted-foreground">Select From Library List</span>
              <ChevronDown
                size={16}
                className={`text-muted-foreground transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu with Sticky Search Header */}
            {open && (
              <div
                className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
                onMouseLeave={() => setOpen(false)}
              >
                {/* Search Bar inside Dropdown */}
                <div className="sticky top-0 z-10 border-b border-border bg-card p-2.5">
                  <div className="relative flex items-center">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3 text-muted-foreground"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search library..."
                      className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-8 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-[var(--brand)]"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 text-muted-foreground hover:text-foreground"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Options List */}
                <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
                  {filteredLibraries.length === 0 ? (
                    <div className="p-3.5 text-center text-xs text-muted-foreground">
                      No libraries found
                    </div>
                  ) : (
                    filteredLibraries.map((lib) => {
                      const isSelected = selectedLibraries.includes(lib);
                      return (
                        <button
                          key={lib}
                          type="button"
                          onClick={() => toggleLibrary(lib)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-[var(--sidebar-highlight)] font-semibold text-foreground"
                              : "text-foreground/90 hover:bg-secondary"
                          }`}
                        >
                          <span className="truncate">{lib}</span>
                          {isSelected && (
                            <Check size={15} className="ml-2 shrink-0 text-[var(--brand)]" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Field 2: Selected Libraries */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            Selected Libraries
          </span>
          <div className="flex min-h-[56px] w-full flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
            {selectedLibraries.length === 0 ? (
              <span className="text-sm text-muted-foreground">No libraries selected</span>
            ) : (
              selectedLibraries.map((lib) => (
                <span
                  key={lib}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {lib}
                  <button
                    type="button"
                    onClick={() => removeLibrary(lib)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={`Remove ${lib}`}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function EBookDetailPage() {
  const { bookId } = Route.useParams();
  const book = seedBooks.find((b) => b.id === bookId);

  if (!book) {
    return (
      <AppShell title="Title Details">
        <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
          <p className="text-sm text-muted-foreground">Title not found.</p>
          <Link
            to="/pb-admin/titles"
            className="text-sm font-normal"
            style={{ color: "var(--brand)" }}
          >
            ← Back to Titles
          </Link>
        </div>
      </AppShell>
    );
  }

  const extra = getExtra(bookId);
  const priceExGST =
    book.price !== null ? (book.price / (1 + extra.gstRate / 100)).toFixed(2) : null;

  return (
    <AppShell title="Title Details">
      <div className="space-y-4 p-4 md:p-8">
        {/* Back button */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/pb-admin/titles"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Back to Title Catalogue"
          >
            <ArrowLeft size={16} />
          </Link>
          <Link
            to="/pb-admin/titles"
            className="text-sm font-normal text-foreground hover:text-[var(--brand)] transition-colors"
          >
            Back to Title Catalogue
          </Link>
        </div>

        {/* ── Hero card ──────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Cover */}
            <div
              className="relative flex h-72 w-52 shrink-0 flex-col items-center justify-center rounded-xl text-base font-bold text-white shadow-md ring-1 ring-black/10 overflow-hidden self-center lg:self-start"
              style={{ background: book.cover }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
              <span className="relative z-10 text-lg font-extrabold tracking-wider">{book.initials}</span>
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
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-2xs">
                    <AuthorAvatar author={book.author} size="sm" />
                    <span>{book.author}</span>
                  </div>

                  {/* Publisher Chip */}
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Building2 size={13} className="shrink-0 text-muted-foreground/80" />
                    <span>{book.publisher ?? "PixelBooks Press"}</span>
                  </div>

                  {/* Category Pill */}
                  <span className="rounded-md border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {book.category}
                  </span>
                </div>
              </div>

              {/* Stats & Key Metrics Strip (Compatible 4-Box Grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {/* 1. Price */}
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Price</span>
                    <Tag size={14} className="text-muted-foreground/80" />
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {book.price === null ? "Free" : `₹${book.price.toFixed(2)}`}
                  </p>
                </div>

                {/* 2. File Size */}
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">File Size</span>
                    <HardDrive size={14} className="text-muted-foreground/80" />
                  </div>
                  <p className="text-lg font-bold text-foreground">{extra.sizeMB} MB</p>
                </div>

                {/* 3. Readers */}
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Readers</span>
                    <Users size={14} className="text-muted-foreground/80" />
                  </div>
                  <p className="text-lg font-bold text-foreground">{extra.viewers}</p>
                </div>

                {/* 4. Status */}
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
                  <div className="flex items-center">
                    <StatusPill status={book.status} />
                  </div>
                </div>
              </div>

              {/* Metadata Sub-Row: Language, File Type & Rating */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border/60 pt-3">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>4.8</span>
                  <span className="text-muted-foreground">(1 review)</span>
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Globe size={13} className="text-muted-foreground" />
                  <span>Language: <strong className="text-foreground">{extra.language}</strong></span>
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span>File Type: <strong className="text-foreground uppercase">{book.format}</strong></span>
                </span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 shadow-2xs"
                  style={{
                    backgroundColor: "var(--brand)",
                    color: "var(--brand-contrast)",
                  }}
                >
                  <Eye size={16} />
                  Preview eBook
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                  <BookOpen size={16} />
                  Preview Sample eBook
                </button>
                <CopyBookUrlButton bookId={book.id} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Library Store Allocation ─────────────────────────────────── */}
        <LibraryStoreAllocationCard />

        {/* ── eBook Details ──────────────────────────────────────────── */}
        <SectionCard title="eBook Details">
          <div className="space-y-0.5">
            <MetaRow label="eBook Name:" value={book.title} />
            <MetaRow label="Language:" value={extra.language} valueClass="text-[var(--brand)]" />
            <MetaRow label="Regional Name:" value={extra.regionalName} />
            <MetaRow label="Date of Publications:" value={extra.dateOfPublication} />
            <MetaRow label="eBook Size:" value={`${extra.sizeMB} MB`} />
          </div>

          {/* Summary */}
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-2 text-sm text-muted-foreground">Summary:</p>
            <p className="text-sm leading-relaxed text-foreground">{extra.summary}</p>
          </div>

          {/* Tags */}
          {extra.tags.length > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-2.5 text-sm text-muted-foreground">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {extra.tags.map((tag) => (
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

        {/* ── SEO ───────────────────────────────────────────────────── */}
        <SectionCard title="For SEO Purpose">
          <div className="space-y-0.5">
            <MetaRow label="Meta Titles:" value="—" />
            <MetaRow label="Meta Keywords:" value="—" />
            <MetaRow label="Meta Description:" value="—" />
          </div>
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
            <p className="text-sm font-medium text-foreground">{extra.subCategory}</p>
          </SectionCard>
        </div>

        {/* ── Price Details ─────────────────────────────────────────── */}
        <SectionCard title="Price Details">
          <div className="space-y-0.5">
            <MetaRow label="Renewal Percentage (Excl. GST):" value="—" />
            <MetaRow label="GST Rate:" value={`${extra.gstRate}%`} />
            {priceExGST && (
              <>
                <MetaRow label="Unit Price (excl. GST):" value={`₹${priceExGST}`} />
                <MetaRow label="Unit Price (incl. GST):" value={`₹${book.price!.toFixed(2)}`} />
              </>
            )}
            <MetaRow label="Offer Price (excl. GST):" value="—" />
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">Selling Price including GST:</p>
            <p className="mt-1 text-2xl font-bold" style={{ color: "var(--brand)" }}>
              {book.price === null ? "Free" : `₹${book.price.toFixed(2)}`}
            </p>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
