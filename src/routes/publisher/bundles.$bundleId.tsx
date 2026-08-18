import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePublisherType } from "@/hooks/use-publisher-type";
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
  Building2,
  CircleOff,
  Tag,
  HardDrive,
  Users,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { seedBooks, type Book } from "@/lib/catalogue-data";
import {
  getBundleById,
  updateBundleStatus,
  type BundleStatus,
  type Bundle,
} from "@/lib/bundles-data";

export const Route = createFileRoute("/publisher/bundles/$bundleId")({
  component: EBookBundleDetailPage,
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
  author: "Walter Isaacson",
  sizeMB: "8.5",
  pages: 240,
  viewers: "120K",
  mrp: 199,
  summary: "A curated collection of reference materials for checking the bulk setup.",
  tags: ["#Reference"],
  seoTitle: "eBook Bundle — PixelBooks",
  seoKeywords: "ebook bundle, reference guide, curated collection",
  seoDescription: "A curated collection of reference materials.",
  bookIds: ["nep-2020"],
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
  "2": {
    author: "Walter Isaacson",
    sizeMB: "24.2",
    pages: 1120,
    viewers: "2.5M",
    mrp: 799,
    summary:
      "Monsoon Reads Collection features a handpicked selection of top fiction, philosophy, and reference works perfect for rainy day reading.",
    tags: ["#Fiction", "#Philosophy", "#MonsoonReads"],
    seoTitle: "Monsoon Reads Collection — PixelBooks",
    seoKeywords: "monsoon reads, fiction pack, philosophy pack, rain reading",
    seoDescription:
      "Monsoon Reads Collection features a handpicked selection of top fiction and philosophy.",
    bookIds: ["nep-2020", "meditations", "origin-species", "art-of-war", "republic"],
  },
  "3": {
    author: "Walter Isaacson",
    sizeMB: "15.0",
    pages: 450,
    viewers: "850K",
    mrp: 999,
    summary:
      "A delightful pack of children's classics, storybooks and educational readings to spark imagination and growth.",
    tags: ["#Kids", "#Stories", "#Education"],
    seoTitle: "Kids Storytime Pack — PixelBooks",
    seoKeywords: "kids books, storytime, children classics",
    seoDescription:
      "A delightful pack of children's classics, storybooks and educational readings.",
    bookIds: [
      "tangled-tale",
      "origin-species",
      "elements-style",
      "curtiss-aviation",
      "knowledge-time",
      "just-shaping-letters",
      "complete-history-music",
      "nep-2020",
    ],
  },
  "4": {
    author: "Walter Isaacson",
    sizeMB: "18.6",
    pages: 940,
    viewers: "4M+",
    mrp: 1499,
    summary:
      "Curated collection of top business management, strategy, style, and history books. Perfect for entrepreneurs and business leaders.",
    tags: ["#Business", "#Management", "#Strategy"],
    seoTitle: "Business Essentials — PixelBooks",
    seoKeywords: "business management, entrepreneur pack, leadership books",
    seoDescription:
      "Curated collection of top business management, strategy, style, and history books.",
    bookIds: ["art-of-war", "elements-style", "wealth-nations", "common-sense"],
  },
  "5": {
    author: "Walter Isaacson",
    sizeMB: "10.4",
    pages: 310,
    viewers: "45K",
    mrp: 399,
    summary:
      "An evocative collection of artistic and historic poems, essays, and meditations on design and literary form.",
    tags: ["#Poetry", "#Literature", "#Meditation"],
    seoTitle: "Poetry Corner — PixelBooks",
    seoKeywords: "poems, literature essays, meditations",
    seoDescription:
      "An evocative collection of artistic and historic poems, essays, and meditations.",
    bookIds: ["essays-art", "just-shaping-letters", "meditations"],
  },
};

function getExtra(id: string): BundleExtra {
  return extras[id] ?? extraDefaults;
}

function StatusStamp({ status }: { status: BundleStatus }) {
  const map = {
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
    Pending: {
      label: "PENDING FOR APPROVAL",
      border: "border-gray-500",
      text: "text-gray-500",
    },
  } as const;
  const s = map[status];
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
    <div className="relative mt-5 h-64 w-48 shrink-0 select-none">
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
      <div
        className="absolute top-2 left-0 flex h-56 w-38 items-center justify-center rounded-xl text-base font-black text-white shadow-xl border border-white/20"
        style={{ background: cover }}
      >
        {initials}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: BundleStatus }) {
  const map = {
    Published: { color: "var(--success)", Icon: CheckCircle2, label: "Published" },
    Approved: { color: "var(--success)", Icon: CheckCircle2, label: "Approved" },
    Rejected: { color: "var(--danger)", Icon: FileX2, label: "Rejected" },
    Unpublished: { color: "#6b7280", Icon: CircleOff, label: "Unpublished" },
    Pending: { color: "#d97706", Icon: Clock, label: "Pending" },
  } as const;
  const s = map[status] ?? map.Unpublished;
  const { color, Icon } = s;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)`,
        color,
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
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-3.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function EBookBundleDetailPage() {
  const { bundleId } = Route.useParams();
  const navigate = useNavigate();
  const [publisherType] = usePublisherType();

  useEffect(() => {
    if (publisherType === "Library-Only Publisher") {
      navigate({ to: "/publisher/catalogue", replace: true });
    }
  }, [publisherType, navigate]);

  if (publisherType === "Library-Only Publisher") {
    return null;
  }
  const [bundle, setBundle] = useState<Bundle | undefined>(() => getBundleById(bundleId));

  if (!bundle) {
    return (
      <AppShell title="Bundle Details">
        <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
          <p className="text-sm text-muted-foreground">eBook Bundle not found.</p>
          <Link
            to="/publisher/bundles/"
            className="text-sm font-normal"
            style={{ color: "var(--brand)" }}
          >
            ← Back to eBook Bundles
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
    updateBundleStatus(bundle.id, "Approved");
    setBundle((prev) => (prev ? { ...prev, status: "Approved" } : undefined));
    toast.success("eBook Bundle has been approved successfully!");
  };

  const handleReject = () => {
    updateBundleStatus(bundle.id, "Rejected");
    setBundle((prev) => (prev ? { ...prev, status: "Rejected" } : undefined));
    toast.error("eBook Bundle status set to Rejected");
  };

  return (
    <AppShell title="Bundle Details" subtitle="View eBook bundle details and collections">
      <div className="space-y-6 p-4 md:p-8 pb-24">
        {/* Back button */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/publisher/bundles"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Back to Manage Bundles"
          >
            <ArrowLeft size={16} />
          </Link>
          <Link
            to="/publisher/bundles"
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
                      <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-foreground shadow-2xs">
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                          style={{ background: bundle.cover }}
                        >
                          {bundle.entityName
                            .split(" ")
                            .filter(Boolean)
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                        <span>{bundle.entityName}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                        <Building2 size={13} className="shrink-0 text-muted-foreground/80" />
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

        {/* ── eBook Bundle Collections (USER request: on top) ─────── */}
        <SectionCard title="Titles in this Bundle">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {matchedBooks.map((b) => (
                <Link
                  key={b.id}
                  to="/publisher/catalogue/$bookId"
                  params={{ bookId: b.id }}
                  className="group w-36 shrink-0 rounded-lg border border-border/60 bg-secondary/10 p-3 flex flex-col justify-between transition-all hover:border-[var(--brand)] hover:bg-secondary/30 hover:shadow-sm cursor-pointer"
                >
                  <div className="space-y-3">
                    <div
                      className="mx-auto flex h-36 w-28 items-center justify-center rounded-md text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-[1.02]"
                      style={{ background: b.cover }}
                    >
                      {b.initials}
                    </div>
                    <div className="space-y-0.5">
                      <p className="truncate text-xs font-semibold text-foreground group-hover:text-[var(--brand)] transition-colors">
                        {b.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">{b.author}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between gap-1.5 pt-2 border-t border-border/50">
                    <span className="text-xs font-bold text-foreground">
                      ₹{getBookPrice(b).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-medium text-[var(--brand)] opacity-0 group-hover:opacity-100 transition-opacity">
                      View →
                    </span>
                  </div>
                </Link>
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
                    Save ₹{savings.toLocaleString("en-IN", { minimumFractionDigits: 2 })} ({savingsPercent}% OFF)
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
              <span className="w-48 shrink-0 text-muted-foreground">eBook Bundle Name:</span>
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
                    className="rounded bg-secondary/60 px-2 py-0.5 text-xs font-medium text-foreground"
                  >
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
              <span className="w-48 shrink-0 text-muted-foreground">Meta Titles:</span>
              <span className="font-semibold text-foreground">{extra.seoTitle}</span>
            </div>
            <div className="flex border-b border-border/50 pb-3">
              <span className="w-48 shrink-0 text-muted-foreground">Meta Keyboards:</span>
              <span className="font-semibold text-foreground">{extra.seoKeywords}</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-muted-foreground">Meta Description:</p>
              <p className="leading-relaxed text-foreground">{extra.seoDescription}</p>
            </div>
          </div>
        </SectionCard>

        {/* ── Sticky Footer Actions ──────────────────────────────────── */}
        <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-end gap-2 border-t border-border bg-background/90 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
          <button
            type="button"
            onClick={handleReject}
            className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-5 text-sm font-semibold transition-colors hover:border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="inline-flex h-11 items-center rounded-lg px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Approve Bundle
          </button>
        </div>
      </div>
    </AppShell>
  );
}
