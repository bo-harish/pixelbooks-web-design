import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Globe,
  Copy,
  Check,
  FileX2,
  CircleOff,
  Building2,
  User,
  Tag,
  HardDrive,
  Users,
  BookOpen,
  Feather,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { BookCover } from "@/components/ui/book-cover";
import { seedBooks, type Book } from "@/lib/catalogue-data";
import {
  getBundleById,
  updateBundleStatus,
  type BundleStatus,
  type Bundle,
} from "@/lib/bundles-data";

export const Route = createFileRoute("/pb-admin/bundles/$bundleId")({
  component: AdminBundleDetailPage,
});

type BundleExtra = {
  author: string;
  sizeMB: string;
  pages: number;
  viewers: string;
  mrp: number;
  summary: string;
  tags: string[];
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
  bookIds: string[];
};

const extraDefaults: BundleExtra = {
  author: "QA-TBH Publishers",
  sizeMB: "8.5",
  pages: 240,
  viewers: "120K",
  mrp: 1999,
  summary: "A curated collection of reference materials and educational books for bulk store setup.",
  tags: ["#Reference", "#Education", "#CuratedCollection"],
  seoTitle: "eBook Bundle — PixelBooks Admin",
  seoKeywords: "ebook bundle, reference guide, curated collection, pixelbooks",
  seoDescription: "A curated collection of reference materials for PixelBooks platform.",
  bookIds: ["nep-2020", "meditations"],
};

const extras: Record<string, BundleExtra> = {
  "1": {
    author: "Walter Isaacson",
    sizeMB: "8.5",
    pages: 240,
    viewers: "120K",
    mrp: 199,
    summary:
      "This is a test bundle containing basic reference materials for checking the bulk setup.",
    tags: ["#Test", "#Reference"],
    seoTitle: "Test Bundle — PixelBooks",
    seoKeywords: "test bundle, reference, check setup",
    seoDescription: "This is a test bundle containing basic reference materials.",
    bookIds: ["nep-2020"],
  },
  "qa-tbh-bundle": {
    author: "QA-TBH Publishers",
    sizeMB: "14.2",
    pages: 680,
    viewers: "45K",
    mrp: 2100,
    summary:
      "QA-TBH Publishers Bundle features 4 comprehensive educational guides and reference books.",
    tags: ["#Education", "#Academic", "#QATBH"],
    seoTitle: "QA-TBH Publishers Bundle — PixelBooks Admin",
    seoKeywords: "qa tbh publishers, education bundle, academic guides",
    seoDescription: "Comprehensive educational guides and reference books bundle.",
    bookIds: ["nep-2020", "meditations", "origin-species", "art-of-war"],
  },
  "werley-nortreus-bundle": {
    author: "Werley Nortreus",
    sizeMB: "32.0",
    pages: 1420,
    viewers: "1.2M",
    mrp: 14500,
    summary:
      "Exclusive premium collection by author Werley Nortreus, covering philosophy and classical literature.",
    tags: ["#Philosophy", "#Literature", "#WerleyNortreus"],
    seoTitle: "Werley Nortreus Bundle — PixelBooks Admin",
    seoKeywords: "werley nortreus, philosophy, classic literature pack",
    seoDescription: "Exclusive premium collection by author Werley Nortreus.",
    bookIds: ["meditations", "republic", "common-sense"],
  },
  "test-bund": {
    author: "Cengage & Pearson",
    sizeMB: "11.5",
    pages: 510,
    viewers: "340K",
    mrp: 950,
    summary:
      "Essential academic and higher education bundle compiled by Cengage & Pearson.",
    tags: ["#Academic", "#Cengage", "#Pearson"],
    seoTitle: "Test Bund — PixelBooks Admin",
    seoKeywords: "cengage, pearson, academic pack, test bund",
    seoDescription: "Essential academic and higher education bundle compiled by Cengage & Pearson.",
    bookIds: ["nep-2020", "elements-style"],
  },
};

function getExtra(id: string): BundleExtra {
  return extras[id] ?? extraDefaults;
}

function StatusStamp({ status }: { status: BundleStatus }) {
  const map = {
    Published: {
      label: "PUBLISHED",
      border: "border-emerald-500",
      text: "text-emerald-500",
    },
    Approved: {
      label: "APPROVED",
      border: "border-emerald-500",
      text: "text-emerald-500",
    },
    Rejected: {
      label: "REJECTED",
      border: "border-rose-500",
      text: "text-rose-500",
    },
    Unpublished: {
      label: "DRAFT",
      border: "border-gray-500",
      text: "text-gray-500",
    },
    Pending: {
      label: "PENDING FOR APPROVAL",
      border: "border-amber-500",
      text: "text-amber-500",
    },
  } as const;
  const s = map[status] ?? map.Unpublished;
  return (
    <div
      className={`flex h-20 w-20 shrink-0 rotate-12 items-center justify-center rounded-full border-[3px] p-2 text-center text-[9px] font-black uppercase tracking-widest ${s.border} ${s.text} opacity-80`}
      style={{
        textShadow: "0 1px 1px rgba(0,0,0,0.05)",
        boxShadow: "inset 0 0 8px rgba(0,0,0,0.02)",
      }}
    >
      {s.label}
    </div>
  );
}

function OverlappingCovers({ cover, initials }: { cover: string; initials: string }) {
  return (
    <div className="relative mt-2 h-64 w-48 shrink-0 select-none self-center lg:self-start">
      {/* Back book */}
      <div
        className="absolute top-0 right-0 h-56 w-38 rounded-xl opacity-40 shadow-sm border border-white/10"
        style={{
          background: cover,
          transform: "rotate(6deg) translate(14px, -8px)",
        }}
      />
      {/* Middle book */}
      <div
        className="absolute top-0 right-0 h-56 w-38 rounded-xl opacity-70 shadow-md border border-white/10"
        style={{
          background: cover,
          transform: "rotate(-3deg) translate(7px, 0px)",
        }}
      />
      {/* Front book */}
      <BookCover
        initials={initials}
        coverGradient={cover}
        size="xl"
        className="absolute top-2 left-0 h-56 w-38 shadow-xl"
      />
    </div>
  );
}

function StatusPill({ status }: { status: BundleStatus }) {
  const map = {
    Published: { color: "var(--success)", Icon: CheckCircle2, label: "Published" },
    Approved: { color: "var(--success)", Icon: CheckCircle2, label: "Published" },
    Rejected: { color: "var(--danger)", Icon: FileX2, label: "Rejected" },
    Unpublished: { color: "#6b7280", Icon: CircleOff, label: "Unpublished" },
    Pending: { color: "#d97706", Icon: Clock, label: "Pending" },
  } as const;

  const s = map[status] ?? map.Unpublished;
  const Icon = s.Icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in oklch, ${s.color} 12%, transparent)`,
        color: s.color,
      }}
    >
      <Icon size={14} />
      {s.label}
    </span>
  );
}

function CopyBundleUrlButton({ bundleId }: { bundleId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/bundles/${bundleId}`;
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
          Copy Bundle URL
        </>
      )}
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
      <div className="border-b border-border px-6 py-3.5 bg-muted/20">
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export function AdminBundleDetailPage() {
  const { bundleId } = Route.useParams();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState<Bundle | undefined>(() => getBundleById(bundleId));

  if (!bundle) {
    return (
      <AppShell title="Bundle Details">
        <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
          <p className="text-sm text-muted-foreground">eBook Bundle not found.</p>
          <Link
            to="/pb-admin/bundles"
            className="text-sm font-normal"
            style={{ color: "var(--brand)" }}
          >
            ← Back to Manage Bundles
          </Link>
        </div>
      </AppShell>
    );
  }

  const extra = getExtra(bundleId);
  const matchedBooks = extra.bookIds
    .map((id) => seedBooks.find((sb) => sb.id === id))
    .filter((b): b is Book => !!b);

  const getBookPrice = (b: Book) => {
    if (b.id === "nep-2020") return 525;
    if (b.id === "meditations") return 550;
    if (b.id === "origin-species") return 600;
    if (b.id === "art-of-war") return 425;
    if (b.id === "republic") return 6500;
    if (b.id === "common-sense") return 2500;
    if (b.price) return Math.round(b.price * 100);
    return 499;
  };

  const totalOriginalBookPrice = matchedBooks.reduce(
    (sum, b) => sum + getBookPrice(b),
    0,
  );
  const savings = Math.max(0, totalOriginalBookPrice - bundle.pricing);
  const savingsPercent = totalOriginalBookPrice > 0 ? Math.round((savings / totalOriginalBookPrice) * 100) : 0;

  const handleApprove = () => {
    updateBundleStatus(bundle.id, "Published");
    setBundle((prev) => (prev ? { ...prev, status: "Published" } : undefined));
    toast.success("eBook Bundle has been approved and published successfully!");
  };

  const handleReject = () => {
    updateBundleStatus(bundle.id, "Rejected");
    setBundle((prev) => (prev ? { ...prev, status: "Rejected" } : undefined));
    toast.error("eBook Bundle status set to Rejected");
  };

  return (
    <AppShell title="Bundle Details" subtitle="View and manage eBook bundle details and approval status.">
      <div className="space-y-6 p-4 md:p-8 pb-24">
        {/* Back button */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/pb-admin/bundles"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Back to Manage Bundles"
          >
            <ArrowLeft size={16} />
          </Link>
          <Link
            to="/pb-admin/bundles"
            className="text-sm font-normal text-foreground hover:text-[var(--brand)] transition-colors"
          >
            Back to Manage Bundles
          </Link>
        </div>

        {/* Hero card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            {/* Overlapping Covers visual */}
            <OverlappingCovers cover={bundle.cover} initials={bundle.initials} />

            {/* Info Container */}
            <div className="flex-1 min-w-0 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight leading-snug text-foreground">
                    {bundle.title}
                  </h1>

                  {/* Entity Chip Row */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {bundle.entityRole === "Author" ? (
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-2xs">
                        <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                          <Feather size={10} />
                        </span>
                        <span>{bundle.entityName}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-2xs">
                        <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                          <Building2 size={10} />
                        </span>
                        <span>{bundle.entityName}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-[11px] font-semibold uppercase tracking-wider">Price</span>
                        <Tag size={14} />
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        ₹{bundle.pricing.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-[11px] font-semibold uppercase tracking-wider">Size (in MB)</span>
                        <HardDrive size={14} />
                      </div>
                      <p className="text-lg font-bold text-foreground">{extra.sizeMB} MB</p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-[11px] font-semibold uppercase tracking-wider">eBooks</span>
                        <BookOpen size={14} />
                      </div>
                      <p className="text-lg font-bold text-foreground">{matchedBooks.length || bundle.bookCount}</p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
                      <div className="flex items-center">
                        <StatusPill status={bundle.status} />
                      </div>
                    </div>
                  </div>

                  {/* Metadata Sub-Row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border/60 pt-3">
                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span>4.9</span>
                      <span className="text-muted-foreground">(12 reviews)</span>
                    </span>
                    <span className="h-3 w-px bg-border" />
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Globe size={13} className="text-muted-foreground" />
                      <span>Language: <strong className="text-foreground">English</strong></span>
                    </span>
                    <span className="h-3 w-px bg-border" />
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Users size={13} className="text-muted-foreground" />
                      <span>Viewers: <strong className="text-foreground">{extra.viewers}</strong></span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <CopyBundleUrlButton bundleId={bundle.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── eBook Bundle Collections ─────────────────────────────── */}
        <SectionCard title="Titles in this Bundle">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {matchedBooks.map((b) => (
                <div
                  key={b.id}
                  className="w-40 shrink-0 rounded-xl border border-border/70 bg-card p-3 flex flex-col justify-between transition-shadow hover:shadow-sm"
                >
                  <div className="space-y-3">
                    <BookCover
                      initials={b.initials}
                      coverGradient={b.cover}
                      title={b.title}
                      size="lg"
                      className="mx-auto"
                    />
                    <div className="space-y-0.5">
                      <p className="truncate text-xs font-semibold text-foreground">{b.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{b.author}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5 pt-2 border-t border-border/50">
                    <span className="text-xs font-bold text-foreground">
                      ₹{getBookPrice(b).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/80 bg-secondary/30 px-5 py-3.5 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-muted-foreground font-medium">Total Original eBooks Value:</span>
                <span className="text-base font-bold text-foreground">
                  ₹{totalOriginalBookPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">Bundle Price:</span>
                <span className="text-base font-extrabold text-[var(--brand)]">
                  ₹{bundle.pricing.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
                {savings > 0 && (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Discount ₹{savings.toLocaleString("en-IN", { minimumFractionDigits: 2 })} ({savingsPercent}%)
                  </span>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── eBook Bundle Details ─────────────────────────────────── */}
        <SectionCard title="eBook Bundle Details">
          <div className="space-y-4">
            <div className="flex text-sm border-b border-border/50 pb-3">
              <span className="w-52 shrink-0 text-muted-foreground">eBook Bundle Name:</span>
              <span className="font-semibold text-foreground">{bundle.title}</span>
            </div>
            <div className="space-y-1.5 border-b border-border/50 pb-3">
              <p className="text-sm text-muted-foreground">Summary:</p>
              <p className="text-sm leading-relaxed text-foreground">{extra.summary}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Tags:</p>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {extra.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground bg-secondary/30"
                  >
                    <Tag size={10} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── For SEO Purpose ────────────────────────────────────────── */}
        <SectionCard title="For SEO Purpose">
          <div className="space-y-4 text-sm">
            <div className="flex border-b border-border/50 pb-3">
              <span className="w-52 shrink-0 text-muted-foreground">Meta Titles:</span>
              <span className="font-semibold text-foreground">{extra.seoTitle}</span>
            </div>
            <div className="flex border-b border-border/50 pb-3">
              <span className="w-52 shrink-0 text-muted-foreground">Meta Keywords:</span>
              <span className="font-semibold text-foreground">{extra.seoKeywords}</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-muted-foreground">Meta Description:</p>
              <p className="leading-relaxed text-foreground">{extra.seoDescription}</p>
            </div>
          </div>
        </SectionCard>

        {/* ── Sticky Footer Actions ──────────────────────────────────── */}
        <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-end gap-3 border-t border-border bg-background/95 px-4 py-4 backdrop-blur md:-mx-8 md:px-8 z-20">
          <button
            type="button"
            onClick={handleReject}
            className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-6 text-sm font-semibold transition-colors hover:border-destructive hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="inline-flex h-11 items-center rounded-lg px-6 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Approve Bundle
          </button>
        </div>
      </div>
    </AppShell>
  );
}
