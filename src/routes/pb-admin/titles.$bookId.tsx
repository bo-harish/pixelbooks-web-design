import { useState, useRef, useEffect } from "react";
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
  Feather,
  Library,
  Clock,
  Save,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { BookCover } from "@/components/ui/book-cover";
import { seedBooks, type Status } from "@/lib/catalogue-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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

const ALL_LIBRARIES = [
  { id: "lib-1", name: "Central University Digital Library", city: "New Delhi" },
  { id: "lib-2", name: "National Science & Tech Consortium", city: "Bangalore" },
  { id: "lib-3", name: "City Academic Library System", city: "Mumbai" },
  { id: "lib-4", name: "Delhi Public Library", city: "New Delhi" },
  { id: "lib-5", name: "State Institute of Technology Library", city: "Pune" },
  { id: "lib-6", name: "IIT Delhi Central Library", city: "New Delhi" },
  { id: "lib-7", name: "Indian Institute of Science Library", city: "Bangalore" },
];

function LibraryMultiSelectDropdown({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (libs: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLibraries = ALL_LIBRARIES.filter(
    (lib) =>
      lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lib.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleLibrary = (libName: string) => {
    if (selected.includes(libName)) {
      onChange(selected.filter((item) => item !== libName));
    } else {
      onChange([...selected, libName]);
    }
  };

  const isAllSelected =
    filteredLibraries.length > 0 &&
    filteredLibraries.every((lib) => selected.includes(lib.name));

  const handleSelectAll = () => {
    if (isAllSelected) {
      const filteredNames = filteredLibraries.map((l) => l.name);
      onChange(selected.filter((name) => !filteredNames.includes(name)));
    } else {
      const newSelected = new Set([...selected, ...filteredLibraries.map((l) => l.name)]);
      onChange(Array.from(newSelected));
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Area */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border bg-card p-2 text-sm font-medium transition-colors cursor-pointer shadow-2xs ${isOpen ? "border-[var(--brand)] ring-1 ring-[var(--brand)]" : "border-border hover:bg-secondary/30"
          }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selected.length === 0 ? (
            <span className="text-muted-foreground text-xs font-normal px-2">
              Select one or more libraries...
            </span>
          ) : (
            selected.map((libName) => (
              <span
                key={libName}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--brand)]"
              >
                <span>{libName}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLibrary(libName);
                  }}
                  className="rounded-md hover:bg-[var(--brand)]/20 p-0.5 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0 px-1">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline pr-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <ChevronDown
            size={16}
            className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-72 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl flex flex-col">
          {/* Search Box Header */}
          <div className="p-2.5 border-b border-border bg-card sticky top-0 z-10 space-y-2">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search libraries by name..."
                autoFocus
                className="w-full h-9 pl-9 pr-8 text-xs rounded-lg border border-border bg-secondary/40 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Select All Row */}
            <div className="flex items-center justify-between px-1 text-xs">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] font-semibold text-[var(--brand)] hover:underline cursor-pointer"
              >
                {isAllSelected ? "Deselect All" : "Select All Libraries"}
              </button>
              <span className="text-[11px] text-muted-foreground font-medium">
                {selected.length} of {ALL_LIBRARIES.length} selected
              </span>
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-52 py-1 divide-y divide-border/30">
            {filteredLibraries.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                No matching libraries found.
              </div>
            ) : (
              filteredLibraries.map((lib) => {
                const checked = selected.includes(lib.name);
                return (
                  <label
                    key={lib.id}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors cursor-pointer hover:bg-secondary/60 ${
                      checked ? "bg-[var(--brand)]/5 font-semibold text-foreground" : "text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleLibrary(lib.name)}
                        className="h-4 w-4 rounded border-border text-[var(--brand)] focus:ring-[var(--brand)] accent-[var(--brand)] cursor-pointer"
                      />
                      <span className="truncate">{lib.name}</span>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LibraryStoreAllocationCard() {
  const [restrictToSpecific, setRestrictToSpecific] = useState(true);
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([
    "Central University Digital Library",
    "National Science & Tech Consortium",
  ]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSaveAllocations = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    setIsConfirmOpen(false);
    toast.success("Library store allocations updated successfully");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 md:p-6 space-y-5 shadow-2xs hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 shadow-2xs">
            <Library size={22} />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-foreground leading-tight">
              Library Allocation
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Configure authorized libraries where this eBook title will be available in digital catalogues.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
          <CheckCircle2 size={13} />
          {selectedLibraries.length} Libraries Allocated
        </span>
      </div>

      <div className="space-y-4">
        {/* Multi-Select Dropdown Container */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <span>Select Authorized Libraries</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-muted-foreground font-medium">
              {selectedLibraries.length} libraries selected
            </span>
          </div>

          <LibraryMultiSelectDropdown
            selected={selectedLibraries}
            onChange={setSelectedLibraries}
          />

          {selectedLibraries.length === 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-1">
              <span>⚠️ Please select at least one library for allocation to take effect.</span>
            </p>
          )}
        </div>

        {/* Action Footer Row with Save Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground font-medium">
            {`${selectedLibraries.length} libraries selected for title allocation`}
          </span>

          <button
            type="button"
            onClick={handleSaveAllocations}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-5 text-xs font-bold text-white shadow-2xs transition-all hover:opacity-90 active:scale-98 cursor-pointer shrink-0 self-end sm:self-auto"
          >
            <Save size={15} />
            <span>Save Allocations</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-md bg-card border border-border rounded-xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Library size={20} className="text-[var(--brand)]" />
              <span>Confirm Library Allocations</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Are you sure you want to update the library store allocations for this title?
              {restrictToSpecific
                ? ` This eBook will be restricted exclusively to ${selectedLibraries.length} authorized library catalogues.`
                : " This eBook will be available to all institutional libraries globally."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsConfirmOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--brand)] px-4 text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              Confirm & Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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
            <BookCover
              initials={book.initials}
              coverGradient={book.cover}
              title={book.title}
              size="xl"
              className="self-center lg:self-start shadow-md"
            />

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
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2.5 py-0.5 text-xs font-semibold text-foreground shadow-2xs">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                      <Feather size={9} />
                    </span>
                    <span className="text-[11px] font-medium text-foreground">{book.author}</span>
                  </div>

                  {/* Publisher Chip */}
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2.5 py-0.5 text-xs font-semibold text-foreground shadow-2xs">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                      <Building2 size={9} />
                    </span>
                    <span className="text-[11px] font-medium text-foreground">{book.publisher ?? "PixelBooks Press"}</span>
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
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">eBook Size (in MB)</span>
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
            <MetaRow label="eBook Size (in MB):" value={`${extra.sizeMB} MB`} />
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
