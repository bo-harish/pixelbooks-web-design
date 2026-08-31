import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Search,
  UserRound,
  Copy as CopyIcon,
  Pencil,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  List,
  HardDrive,
  Info,
  Tag,
  Check as CheckIcon,
  CheckCircle,
  Eye,
  RefreshCw,
  Loader2,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Library,
  Clock,
  Save,
  Minus,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { usePublisherType } from "@/hooks/use-publisher-type";
import { seedBooks } from "@/lib/catalogue-data";

export const Route = createFileRoute("/publisher/catalogue/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    edit: (search.edit as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Add New eBook — PixelBooks" },
      {
        name: "description",
        content: "Upload your eBook, cover, and details to publish a new title on PixelBooks.",
      },
    ],
  }),
  component: AddEBookPage,
});

/* -------------------------------------------------------------------------- */
/*  Shared UI primitives                                                       */
/* -------------------------------------------------------------------------- */

function SectionCard({
  title,
  description,
  right,
  children,
}: {
  title?: string;
  description?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-7">
      {(title || right) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-[15px] font-semibold">{title}</h2>}
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

function AutoDetectedBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: "color-mix(in oklab, var(--brand) 12%, transparent)",
        color: "var(--brand)",
      }}
    >
      <Sparkles size={12} />
      Auto-detected
    </span>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-[11px] font-medium text-rose-500">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] ${className}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] ${className}`}
    />
  );
}

function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode },
) {
  const { className = "", children, ...rest } = props;
  return (
    <div className="relative">
      <select
        {...rest}
        className={`h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)] ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
  className = "",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex cursor-pointer items-center gap-2 text-sm ${className}`}>
      <span
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors"
        style={{
          backgroundColor: checked ? "var(--brand)" : "transparent",
          borderColor: checked ? "var(--brand)" : "var(--border)",
        }}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
            <path
              d="M2.5 6.5L5 9L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label && <span>{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      style={{ backgroundColor: checked ? "var(--brand)" : "var(--border)" }}
    >
      <span
        className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: `translateX(${checked ? 22 : 2}px)` }}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Upload row                                                        */
/* -------------------------------------------------------------------------- */

function EbookDocumentPreview({ file }: { file: File }) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const isPdf = ext === "pdf" || file.type.includes("pdf");
  const formatLabel = isPdf ? "PDF" : "ePUB";

  return (
    <div className="relative mb-2 flex flex-col items-center">
      {/* Document Sheet Thumbnail */}
      <div className="group/doc relative flex aspect-[3/4] w-24 flex-col justify-between overflow-hidden rounded-lg border border-border/80 bg-card p-2.5 shadow-md ring-1 ring-black/5 transition-transform duration-200 hover:scale-105">
        {/* Top Format Badge & Header Line */}
        <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
          <span
            className={`inline-block rounded px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-wider text-white shadow-2xs ${isPdf ? "bg-rose-500" : "bg-teal-600"
              }`}
          >
            {formatLabel}
          </span>
          <div className="h-1 w-6 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Mock Content Lines simulating page */}
        <div className="my-1.5 space-y-1">
          <div className="h-1.5 w-full rounded-xs bg-foreground/20" />
          <div className="h-1.5 w-4/5 rounded-xs bg-foreground/15" />
          <div className="h-1 w-full rounded-xs bg-muted-foreground/20" />
          <div className="h-1 w-3/4 rounded-xs bg-muted-foreground/20" />
          <div className="h-1 w-5/6 rounded-xs bg-muted-foreground/20" />
        </div>

        {/* Bottom Page Footer */}
        <div className="flex items-center justify-between border-t border-border/40 pt-1 text-[7px] text-muted-foreground/60">
          <span>Pg 1</span>
          <span>● ● ●</span>
        </div>

        {/* Hover overlay preview tag */}
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 p-1 opacity-0 transition-opacity group-hover/doc:opacity-100">
          <span className="flex items-center gap-1 text-[9px] font-semibold text-white">
            <Eye size={10} /> Preview {formatLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function UploadTile({
  step,
  title,
  subtitle,
  hint,
  ctaLabel,
  icon,
  formats,
  required = false,
  extra,
  onFileChange,
  isCover = false,
  externalFile,
  onPreview,
}: {
  step: number;
  title: string;
  subtitle: string;
  hint: string;
  ctaLabel: string;
  icon: React.ReactNode;
  formats: string[];
  required?: boolean;
  extra?: React.ReactNode;
  onFileChange?: (file: File | null) => void;
  isCover?: boolean;
  externalFile?: File | null;
  onPreview?: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [internalFile, setInternalFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const file = externalFile !== undefined ? externalFile : internalFile;

  useEffect(() => {
    if (file) {
      setIsUploading(true);
      const timer = setTimeout(() => setIsUploading(false), 1200);
      return () => clearTimeout(timer);
    } else {
      setIsUploading(false);
    }
  }, [file]);

  const updateFile = (newFile: File | null) => {
    setInternalFile(newFile);
    onFileChange?.(newFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      updateFile(dropped);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) {
      updateFile(picked);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const imagePreviewUrl = useMemo(() => {
    if (file && isCover && file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file, isCover]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <div className="group/tile relative flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-2xs transition-all duration-300 hover:border-[var(--brand)]/40 hover:shadow-md">
      {/* Top Header inside tile */}
      <div className="mb-3 flex items-center gap-2.5 border-b border-border/60 pb-3">
        <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--sidebar-highlight)] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--brand)] border border-[var(--brand)]/20">
          Step {step < 10 ? `0${step}` : step}
        </span>
        <h4 className="text-sm font-bold tracking-tight text-foreground">{title}</h4>
      </div>

      {/* Subtitle */}
      {subtitle && <p className="mb-3 text-xs text-muted-foreground">{subtitle}</p>}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={isCover ? "image/jpeg,image/png" : ".epub,.pdf"}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Drop zone container */}
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !file && inputRef.current?.click()}
        className="group/drop relative flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all duration-200"
        style={{
          borderColor: dragging
            ? "var(--brand)"
            : file
              ? "color-mix(in oklab, var(--brand) 40%, var(--border))"
              : "var(--border)",
          backgroundColor: dragging
            ? "color-mix(in oklab, var(--brand) 8%, var(--card))"
            : file
              ? "color-mix(in oklab, var(--brand) 3%, var(--card))"
              : "color-mix(in oklab, var(--card) 98%, var(--secondary))",
          cursor: file ? "default" : "pointer",
        }}
      >
        {/* Drag-over overlay */}
        {dragging && (
          <div
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-xl"
            style={{ backgroundColor: "color-mix(in oklab, var(--brand) 12%, var(--card))" }}
          >
            <Upload size={28} className="animate-bounce text-[var(--brand)]" />
            <p className="text-xs font-bold text-[var(--brand)]">
              Release to upload file
            </p>
          </div>
        )}

        {file ? (
          /* Uploaded state */
          <div className="flex w-full flex-col items-center justify-center py-1">
            {imagePreviewUrl ? (
              /* Image Cover Preview */
              <div className="relative mb-2 flex flex-col items-center">
                <div className="relative aspect-[438/678] w-24 overflow-hidden rounded-lg border border-black/10 shadow-md ring-1 ring-black/5 transition-transform duration-200 hover:scale-105">
                  <img
                    src={imagePreviewUrl}
                    alt="Cover Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-1.5 opacity-0 transition-opacity hover:opacity-100">
                    <span className="flex items-center gap-1 text-[9px] font-semibold text-white">
                      <Eye size={10} /> Preview
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* eBook Document / PDF / ePUB Page Preview */
              <div
                onClick={onPreview ? (e) => { e.stopPropagation(); onPreview(); } : undefined}
                className={onPreview ? "cursor-pointer" : undefined}
                title={onPreview ? "Click to open Sample Preview" : undefined}
              >
                <EbookDocumentPreview file={file} />
              </div>
            )}

            <p className="max-w-[180px] truncate text-xs font-bold text-foreground">
              {file.name}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
              {formatBytes(file.size)}
            </p>

            {/* Actions: Replace / Remove / Preview */}
            <div className="mt-3 flex items-center gap-2">
              {onPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview();
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--brand)]/30 bg-[var(--sidebar-highlight)] px-2.5 text-[11px] font-semibold text-[var(--brand)] transition-colors hover:bg-[var(--brand)] hover:text-white cursor-pointer shadow-2xs"
                >
                  <Eye size={12} /> Preview
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer shadow-2xs"
              >
                <RefreshCw size={12} /> Replace
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateFile(null);
                }}
                className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold transition-all cursor-pointer ${isUploading
                  ? "border-2 border-dotted border-rose-500/60 bg-rose-500/5 text-rose-600/80 animate-pulse cursor-wait"
                  : "border border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                  }`}
              >
                {isUploading ? (
                  <Loader2 size={12} className="animate-spin text-rose-500" />
                ) : (
                  <X size={12} />
                )}
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* Default dropzone state */
          <div className="flex w-full flex-col items-center justify-center py-2">
            {/* Styled Icon Container */}
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--sidebar-highlight)] text-[var(--brand)] shadow-2xs border border-[var(--brand)]/15 transition-transform duration-300 group-hover/drop:scale-110">
              {icon}
            </div>

            <p className="text-xs font-bold text-foreground">
              Drag & drop file here
            </p>

            <span className="my-2 text-[11px] font-medium text-muted-foreground">or</span>

            {/* Upload Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-xs font-semibold text-foreground transition-all duration-200 hover:border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white shadow-2xs"
            >
              <Upload size={13} />
              {ctaLabel}
            </button>

            {/* Simple format text */}
            <p className="mt-2.5 text-[11px] font-medium text-muted-foreground">
              {formats.join(" • ")}
            </p>

            {hint && (
              <p className="mt-1 text-[10px] font-medium text-muted-foreground/75">
                {hint}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Extra Action (e.g. Auto Generate Sample) */}
      {extra && <div className="mt-4">{extra}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sample Preview Dialog                                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Sample & Source eBook Preview Dialog                                      */
/* -------------------------------------------------------------------------- */

function SamplePreviewDialog({
  sampleFile,
  ebookFile,
  isSample = true,
  onClose,
  onApprove,
  onRejectUploadOwn,
}: {
  sampleFile?: File | null;
  ebookFile?: File | null;
  isSample?: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onRejectUploadOwn?: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = isSample ? 6 : 12;
  const fileName = isSample
    ? (sampleFile?.name || (ebookFile ? `Sample_${ebookFile.name.replace(/\.[^/.]+$/, "")}.epub` : "Sample_eBook.epub"))
    : (ebookFile?.name || "Source_eBook.epub");
  const bookTitle =
    ebookFile?.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") ||
    "The Complete Guide to Modern Architecture";

  const samplePages = [
    {
      title: "Chapter 1: Foundations of Modern Design",
      content: `Architecture in the 21st century has transitioned from rigid structural paradigms to dynamic, human-centric spatial experiences. As urban environments expand, the interplay between sustainable materials, light diffusion, and natural ventilation becomes the cornerstone of forward-thinking design.

This chapter explores the principles of spatial rhythm, material authenticity, and how environmental integration forms the backbone of contemporary structures worldwide.`,
      quote: "Design is not just what it looks like and feels like. Design is how it works.",
      quoteAuthor: "Steve Jobs",
    },
    {
      title: "1.1 The Evolution of Form & Function",
      content: `The historic debate between form following function has given way to form and function operating in complete symbiosis. Modern architects utilize computational modeling and parametric tools to craft organic shapes that were once mathematically impossible to execute.

Key Takeaways:
• Material selection dictates thermal performance and aesthetic longevity.
• Daylight harvesting reduces building energy consumption by up to 35%.
• Acoustic damping buffers urban noise for optimized indoor wellness.`,
      quote: "Space and light and order. Those are the things that men need just as much as they need bread or a place to sleep.",
      quoteAuthor: "Le Corbusier",
    },
    {
      title: "1.2 Sustainable Materials & Eco-conscious Building",
      content: `Cross-laminated timber (CLT), recycled steel composites, and ultra-high-performance concrete are redefining the physical footprint of new structures. By prioritizing low embodied carbon materials, developers can achieve net-zero lifecycle goals while enhancing structural resilience.

When evaluating sustainable material pipelines, architects must balance regional availability, supply chain transport emissions, and long-term maintenance cycles.`,
      quote: "The mother art is architecture. Without an architecture of our own we have no soul of our own civilization.",
      quoteAuthor: "Frank Lloyd Wright",
    },
    {
      title: "Chapter 2: Spatial Optimization & Natural Light",
      content: `Light is the ultimate building material. It defines volume, invokes emotion, and shapes human circadian rhythms. Integrating passive solar design, clerestory windows, and light wells allows interior spaces to shift dynamically throughout the day.

In dense metropolitan areas, light optimization requires strategic orientation and reflective surface treatments to maximize ambient indirect illumination.`,
      quote: "Sunlight does not know how wonderful it is until it falls on the wall of a building.",
      quoteAuthor: "Louis Kahn",
    },
    {
      title: "2.1 Passive Heating & Cooling Strategies",
      content: `Thermal mass strategies utilize materials with high heat capacity to absorb thermal energy during peak sun hours and slowly release it during cooler night periods. Combined with cross-ventilation corridors, mechanical HVAC requirements can be dramatically reduced.`,
      quote: "Architecture is the learned game, correct and magnificent, of forms assembled in the light.",
      quoteAuthor: "Le Corbusier",
    },
    {
      title: "2.2 Conclusion & Further Reading",
      content: isSample
        ? `This concludes your auto-generated sample preview (Chapters 1 & 2). The full publication includes all 12 chapters, interactive blueprints, high-resolution rendering galleries, and full index references.

You have reached the end of the free preview sample.`
        : `This is page 6 of your full manuscript source file. You can continue paging through the remaining chapters to verify layout integrity and formatting.`,
      quote: isSample ? "End of Sample Preview — PixelBooks Auto-Parser" : "Source Manuscript — PixelBooks Publisher",
      quoteAuthor: "PixelBooks System",
    },
  ];

  const pageData = samplePages[currentPage - 1] || samplePages[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="flex h-[88vh] max-h-[850px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--sidebar-highlight)] text-[var(--brand)] border border-[var(--brand)]/20 shadow-2xs">
              {isSample ? <Sparkles size={20} className="animate-pulse" /> : <BookOpen size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  {isSample ? "Auto-Generated Sample Preview" : "Source eBook Preview"}
                </h3>
                <span className="rounded-full bg-[var(--sidebar-highlight)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--brand)] border border-[var(--brand)]/20">
                  {isSample ? "ePUB Sample" : "Full Manuscript"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate max-w-md">
                {fileName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* eReader Simulated Sheet View */}
        <div className="flex-1 overflow-y-auto bg-muted/20 p-6 md:p-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 md:p-10 shadow-lg min-h-[500px] md:min-h-[530px] flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">
                  {isSample ? "Free Sample Extract" : "Full Manuscript View"}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Pg {currentPage}
                </span>
              </div>

              <h4 className="text-xl font-extrabold text-foreground tracking-tight mb-4">
                {pageData.title}
              </h4>

              <div className="space-y-4 text-sm leading-relaxed text-foreground/90 font-serif">
                {pageData.content.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {pageData.quote && (
                <blockquote className="my-6 border-l-3 border-[var(--brand)] bg-[var(--sidebar-highlight)]/40 p-4 rounded-r-xl italic text-xs text-foreground/90 font-sans space-y-1">
                  <p>&ldquo;{pageData.quote}&rdquo;</p>
                  <cite className="block font-semibold not-italic text-[11px] text-muted-foreground text-right">
                    — {pageData.quoteAuthor}
                  </cite>
                </blockquote>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Page Navigation Section Below the Book */}
        <div className="shrink-0 border-t border-border bg-card/95 backdrop-blur-md px-6 py-2.5">
          <div className="mx-auto max-w-2xl flex items-center justify-center">
            <div className="flex items-center gap-2 bg-secondary/50 rounded-lg border border-border/80 px-3.5 py-1.5 shadow-2xs text-xs font-semibold text-foreground">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground cursor-pointer rounded-md hover:bg-background transition-colors"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 select-none tracking-tight">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground cursor-pointer rounded-md hover:bg-background transition-colors"
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        {isSample ? (
          /* Sample Review Warning Footer (only shown for Auto-Generated Sample) */
          <div className="border-t border-amber-500/25 bg-amber-500/10 px-6 py-4 text-amber-900 dark:text-amber-100 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-xs font-bold leading-tight">
                    Please review and make sure the sample is generated correctly.
                  </p>
                  <p className="text-[11px] opacity-90 leading-normal mt-0.5">
                    Verify the extracted chapters, text layout, and formatting above before approving.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onRejectUploadOwn}
                  className="inline-flex items-center gap-2 rounded-lg border border-amber-600/30 bg-background/90 px-4 py-2 text-xs font-semibold text-foreground transition-all hover:bg-background hover:border-amber-600/50 shadow-2xs cursor-pointer"
                >
                  <Upload size={14} className="text-muted-foreground" />
                  No I will upload my own
                </button>
                <button
                  type="button"
                  onClick={onApprove}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  <CheckCircle2 size={15} />
                  Approve Sample
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Source Preview Footer (without warning message or sample approve buttons) */
          <div className="flex items-center justify-between border-t border-border bg-card px-6 py-4 shrink-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen size={14} className="text-[var(--brand)]" />
              <span>Full source manuscript preview ({fileName})</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition-all hover:bg-secondary cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function UploadRow() {
  const [autofill, setAutofill] = useState(true);
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [samplePreviewOpen, setSamplePreviewOpen] = useState(false);
  const [sourcePreviewOpen, setSourcePreviewOpen] = useState(false);
  const sampleInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateSample = () => {
    if (!ebookFile) return;
    const generatedSample = new File(
      [ebookFile],
      `Sample_${ebookFile.name.replace(/\.[^/.]+$/, "")}.epub`,
      { type: "application/epub+zip" }
    );
    setSampleFile(generatedSample);
    setSamplePreviewOpen(true);
  };

  const handleApproveSample = () => {
    setSamplePreviewOpen(false);
    toast.success("Sample approved and attached to catalog entry!");
  };

  const handleRejectUploadOwn = () => {
    setSampleFile(null);
    setSamplePreviewOpen(false);
    toast.info("Auto-generated sample discarded. Please select your custom sample file.");
    setTimeout(() => {
      sampleInputRef.current?.click();
    }, 150);
  };

  return (
    <>
      <SectionCard
        title="Upload eBook Files & Metadata"
        description="Provide your main eBook file, preview sample, and high-resolution cover image."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <UploadTile
            step={1}
            title="Upload Your eBook"
            subtitle="Drop your primary manuscript file"
            hint=""
            ctaLabel="Upload ePUB or PDF"
            icon={<BookOpen size={20} />}
            formats={["ePUB", "PDF", "Max 30 MB"]}
            required
            onFileChange={setEbookFile}
            externalFile={ebookFile}
            onPreview={ebookFile ? () => setSourcePreviewOpen(true) : undefined}
          />

          <UploadTile
            step={2}
            title="Upload Free Sample"
            subtitle="Preview sample for readers"
            hint=""
            ctaLabel="Upload Sample File"
            icon={<FileText size={20} />}
            formats={["ePUB", "PDF", "Max 10 MB"]}
            onFileChange={setSampleFile}
            externalFile={sampleFile}
            onPreview={sampleFile ? () => setSamplePreviewOpen(true) : undefined}
            extra={
              ebookFile ? (
                <button
                  type="button"
                  onClick={handleGenerateSample}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[var(--brand)]/30 bg-gradient-to-r from-[var(--brand)]/15 via-[var(--brand)]/10 to-[var(--brand)]/5 px-3 text-xs font-bold text-[var(--brand)] shadow-2xs transition-all hover:border-[var(--brand)] hover:shadow-xs active:scale-[0.99] cursor-pointer"
                >
                  <Sparkles size={14} className="animate-pulse text-[var(--brand)]" />
                  Generate Sample from Source
                </button>
              ) : (
                <div
                  title="Upload your eBook in Step 1 first to auto-generate a sample"
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-3 text-xs font-medium text-muted-foreground/70 cursor-not-allowed"
                >
                  <Sparkles size={13} className="opacity-40" />
                  <span>Upload eBook to Enable Auto Sample</span>
                </div>
              )
            }
          />

          <UploadTile
            step={3}
            title="Upload Cover Image"
            subtitle="High-resolution book cover"
            hint="438 × 678 px recommended"
            ctaLabel="Upload Cover Image"
            icon={<ImageIcon size={20} />}
            formats={["JPEG", "PNG", "Max 5 MB"]}
            required
            isCover
            onFileChange={setCoverFile}
            externalFile={coverFile}
          />
        </div>

        <div
          className="mt-8 flex items-start gap-3 rounded-xl border p-4 text-[13px] shadow-2xs"
          style={{
            borderColor: "color-mix(in oklab, var(--destructive) 40%, transparent)",
            backgroundColor: "color-mix(in oklab, var(--destructive) 6%, transparent)",
            color: "color-mix(in oklab, var(--destructive) 85%, var(--foreground))",
          }}
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            PixelBooks&apos; auto content generation API uses automated parsing to extract and
            autofill metadata from your eBook files (ePub &amp; PDF). Because automated extraction is
            inherently subject to inaccuracies, some data may be incomplete, malformatted, or
            incorrectly assigned depending on the structure and quality of the source file. You are
            solely responsible for reviewing and verifying all auto-populated information. Please
            ensure that all generated metadata is manually reviewed and verified before publishing. If
            you prefer, you may disable this option and enter all details manually.
          </p>
        </div>

        <Check
          checked={autofill}
          onChange={setAutofill}
          label={<span className="font-medium">Autofill metadata from eBook</span>}
          className="mt-5"
        />
      </SectionCard>

      {/* Hidden file input for custom sample upload */}
      <input
        ref={sampleInputRef}
        type="file"
        accept=".epub,.pdf"
        className="hidden"
        onChange={(e) => {
          const picked = e.target.files?.[0];
          if (picked) {
            setSampleFile(picked);
            toast.success(`Custom sample file "${picked.name}" uploaded successfully!`);
          }
        }}
      />

      {/* Source eBook Preview Popup Modal */}
      {sourcePreviewOpen && (
        <SamplePreviewDialog
          isSample={false}
          ebookFile={ebookFile}
          onClose={() => setSourcePreviewOpen(false)}
        />
      )}

      {/* Auto-Generated Sample Preview Popup Modal */}
      {samplePreviewOpen && (
        <SamplePreviewDialog
          isSample={true}
          sampleFile={sampleFile}
          ebookFile={ebookFile}
          onClose={() => setSamplePreviewOpen(false)}
          onApprove={handleApproveSample}
          onRejectUploadOwn={handleRejectUploadOwn}
        />
      )}
    </>
  );
}


/* -------------------------------------------------------------------------- */
/*  Section: Guidelines                                                        */
/* -------------------------------------------------------------------------- */



function GuidelinesSection() {
  const [publisherType] = usePublisherType();
  const isLibraryOnly = publisherType === "Library-Only Publisher";
  const [open, setOpen] = useState(false);

  const guidelines = [
    {
      icon: <HardDrive size={18} />,
      title: "Size Limit",
      description: "Keep file sizes under 30 MB to ensure smooth downloading.",
    },
    {
      icon: <Info size={18} />,
      title: "Metadata",
      description:
        "Provide essential book details such as title, author, genre, and additional information.",
    },
    {
      icon: <Tag size={18} />,
      title: "Pricing",
      description:
        "Choose between free or paid options, set competitive prices, and specify tax rates.",
    },
    {
      icon: <CheckCircle size={18} />,
      title: "Review and Publish",
      description:
        `Take a final look and ensure everything is in order before hitting "${isLibraryOnly ? "Publish eBook" : "Submit eBook for Review"}."`,
    },
  ];

  return (
    <SectionCard>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-semibold"
      >
        <span className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              backgroundColor: "color-mix(in oklab, var(--brand) 14%, transparent)",
              color: "var(--brand)",
            }}
          >
            <BookOpen size={16} />
          </span>
          Instructions & Guidelines
        </span>
        <span className="text-muted-foreground">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guidelines.map((g, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-border bg-secondary/30 p-4">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--brand) 12%, transparent)",
                  color: "var(--brand)",
                }}
              >
                {g.icon}
              </span>
              <div>
                <p className="text-sm font-semibold">{g.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {g.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function RichTextEditor({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const insertFormatting = (prefix: string, suffix: string = "") => {
    onChange(value + prefix + suffix);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors focus-within:border-[var(--brand)] shadow-2xs">
      {/* RTB Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-secondary/40 p-2 text-muted-foreground">
        <button
          type="button"
          onClick={() => insertFormatting("**", "**")}
          className="rounded h-7 w-7 flex items-center justify-center hover:bg-card hover:text-foreground text-xs font-extrabold transition-colors cursor-pointer"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("*", "*")}
          className="rounded h-7 w-7 flex items-center justify-center hover:bg-card hover:text-foreground text-xs italic font-serif transition-colors cursor-pointer"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("<u>", "</u>")}
          className="rounded h-7 w-7 flex items-center justify-center hover:bg-card hover:text-foreground text-xs underline transition-colors cursor-pointer"
          title="Underline"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("~~", "~~")}
          className="rounded h-7 w-7 flex items-center justify-center hover:bg-card hover:text-foreground text-xs line-through transition-colors cursor-pointer"
          title="Strikethrough"
        >
          S
        </button>

        <div className="mx-1 h-4 w-px bg-border/80" />

        <button
          type="button"
          onClick={() => insertFormatting(value ? "\n- " : "- ")}
          className="rounded h-7 w-7 flex items-center justify-center hover:bg-card hover:text-foreground transition-colors cursor-pointer"
          title="Bullet List"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting(value ? "\n1. " : "1. ")}
          className="rounded h-7 w-7 flex items-center justify-center hover:bg-card hover:text-foreground transition-colors cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting(value ? "\n> " : "> ")}
          className="rounded h-7 w-7 flex items-center justify-center hover:bg-card hover:text-foreground transition-colors cursor-pointer"
          title="Blockquote"
        >
          <Quote size={13} />
        </button>

        <div className="mx-1 h-4 w-px bg-border/80" />

        <button
          type="button"
          onClick={() => insertFormatting("[", "](https://)")}
          className="rounded h-7 w-7 flex items-center justify-center hover:bg-card hover:text-foreground transition-colors cursor-pointer"
          title="Insert Link"
        >
          <LinkIcon size={13} />
        </button>

        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 pr-1">
          Rich Text Editor (RTB)
        </span>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder || "Provide a comprehensive summary and key highlights..."}
        className="w-full bg-transparent p-3.5 text-sm leading-relaxed text-foreground outline-none resize-y placeholder:text-muted-foreground"
      />

      {/* Footer Info / Character Counter */}
      <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-3.5 py-1.5 text-[11px] text-muted-foreground">
        <span>Rich Text &amp; Markdown enabled</span>
        <span>{value.length} / 2,000 characters</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: eBook Details                                                     */
/* -------------------------------------------------------------------------- */

function EBookDetailsSection() {
  const [publisherType] = usePublisherType();
  const isLibraryOnly = publisherType === "Library-Only Publisher";
  const [summary, setSummary] = useState("Arun m");
  const [tags, setTags] = useState<string[]>([
    "Promised Land 2024",
    "Barack Obama",
    "Barack Obama",
  ]);
  const [tagInput, setTagInput] = useState("");

  const removeTag = (i: number) => setTags((t) => t.filter((_, idx) => idx !== i));
  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    setTags((t) => [...t, v]);
    setTagInput("");
  };

  return (
    <SectionCard title="eBook Details" right={<AutoDetectedBadge />}>
      <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
        <Field label="Enter eBook Name" required>
          <TextInput defaultValue="Harry Potter" />
        </Field>
        <Field label="Enter ISBN-10 or 13" required>
          <TextInput defaultValue="25455955" />
        </Field>
        <Field label="Regional Name">
          <TextInput defaultValue="Harry Potter" />
        </Field>
        <Field label="Language" required>
          <SelectInput defaultValue="English">
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
            <option>French</option>
          </SelectInput>
        </Field>
        <Field label="Date of Publication">
          <TextInput defaultValue="Harry Potter" />
        </Field>
        <Field label="eBook Size (in MB)">
          <TextInput defaultValue="25.4" placeholder="e.g. 25.4" />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Summary">
          <RichTextEditor value={summary} onChange={setSummary} />
        </Field>
      </div>

      <div className="mt-4">
        <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Tags</span>
        <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
          {tags.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: "color-mix(in oklab, var(--brand) 12%, transparent)",
                color: "var(--brand)",
              }}
            >
              {t}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="opacity-70 hover:opacity-100"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag"
            className="min-w-[120px] flex-1 border-none bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Press Enter or Comma to tag</span>
          <span>Maximum 5 keywords</span>
        </div>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Authors                                                           */
/* -------------------------------------------------------------------------- */

type AuthorMatch = {
  id: string;
  name: string;
  books: number;
  avatar?: string;
};

type SelectedAuthor = {
  id: string;
  sourceId?: string;
  name: string;
  books: number;
  avatar?: string;
  addAsNew: boolean;
  profileSlug: string;
};

const AUTHOR_DIRECTORY: AuthorMatch[] = [
  { id: "a-1", name: "Mark Twain", books: 3 },
  { id: "a-2", name: "Arun", books: 0 },
  { id: "a-3", name: "Arundhati Roy", books: 30, avatar: "https://i.pravatar.cc/80?img=47" },
  { id: "a-4", name: "Charles Dickens", books: 4 },
  { id: "a-5", name: "Haruki Murakami", books: 4 },
];

const AUTHOR_BOOK_LISTS: Record<string, string[]> = {
  "Arundhati Roy": [
    "The God of Small Things",
    "The Ministry of Utmost Happiness",
    "Capitalism: A Ghost Story",
    "Walking with the Comrades",
    "My Seditious Heart",
  ],
  "Mark Twain": [
    "The Adventures of Tom Sawyer",
    "Adventures of Huckleberry Finn",
    "A Connecticut Yankee in King Arthur's Court",
  ],
  "Charles Dickens": [
    "Great Expectations",
    "A Tale of Two Cities",
    "Oliver Twist",
    "David Copperfield",
  ],
  "Haruki Murakami": ["Kafka on the Shore", "Norwegian Wood", "1Q84", "The Wind-Up Bird Chronicle"],
};

const TAKEN_AUTHOR_SLUGS = new Set(["mark-twain"]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

function AuthorSearchResultCard({
  match,
  onAdd,
  isSelected,
}: {
  match: AuthorMatch;
  onAdd: () => void;
  isSelected: boolean;
}) {
  const [showBooksPopup, setShowBooksPopup] = useState(false);
  const booksPopupRef = useRef<HTMLDivElement | null>(null);
  const books = AUTHOR_BOOK_LISTS[match.name] ?? [];

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!booksPopupRef.current) return;
      if (!booksPopupRef.current.contains(event.target as Node)) {
        setShowBooksPopup(false);
      }
    };
    if (showBooksPopup) {
      document.addEventListener("mousedown", onOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
    };
  }, [showBooksPopup]);

  return (
    <div
      onClick={() => {
        if (!isSelected) {
          onAdd();
        }
      }}
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${isSelected
        ? "cursor-default border-border/70 bg-secondary/30 text-muted-foreground"
        : "border-border bg-background hover:bg-secondary/50 cursor-pointer"
        }`}
    >
      {match.avatar ? (
        <img
          src={match.avatar}
          alt={match.name}
          className={`h-8 w-8 shrink-0 rounded-full object-cover ${isSelected ? "opacity-70" : ""}`}
        />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-muted-foreground">
          {initials(match.name)}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-sm font-semibold ${isSelected ? "text-muted-foreground" : ""}`}
        >
          {match.name}
        </span>
        <div
          ref={booksPopupRef}
          className="relative mt-0.5"
          onMouseEnter={() => {
            if (match.books > 0) setShowBooksPopup(true);
          }}
          onMouseLeave={() => setShowBooksPopup(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (match.books > 0) setShowBooksPopup((v) => !v);
            }}
            className={`inline-flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer ${match.books > 0 ? "hover:text-foreground" : ""
              }`}
          >
            <BookOpen size={11} />
            <span className={match.books > 0 ? "underline-offset-2 hover:underline" : ""}>
              {match.books} Books
            </span>
          </button>

          {showBooksPopup && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-[calc(100%+6px)] z-30 w-[260px] overflow-hidden rounded-lg border border-border bg-card shadow-lg cursor-default text-foreground"
            >
              <div className="border-b border-border px-3 py-2">
                <p className="text-sm font-semibold">Books by {match.name}</p>
                <p className="text-xs text-muted-foreground">{match.books} total</p>
              </div>
              <ul className="max-h-56 overflow-y-auto">
                {books.map((title) => (
                  <li key={title} className="border-t border-border first:border-t-0">
                    <div className="flex items-center gap-2 px-3 py-2.5 text-sm">
                      <BookOpen size={13} className="text-muted-foreground" />
                      <span>{title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </span>
      {isSelected && (
        <span className="ml-auto text-muted-foreground shrink-0" aria-label="Selected author">
          <CheckIcon size={14} />
        </span>
      )}
    </div>
  );
}

function SelectedAuthorCard({
  author,
  onChange,
  onRemove,
  unavailable,
}: {
  author: SelectedAuthor;
  onChange: (next: SelectedAuthor) => void;
  onRemove: () => void;
  unavailable: boolean;
}) {
  const [publisherType] = usePublisherType();
  const isLibraryOnly = publisherType === "Library-Only Publisher";
  const [showBooksPopup, setShowBooksPopup] = useState(false);
  const booksPopupRef = useRef<HTMLDivElement | null>(null);
  const books = AUTHOR_BOOK_LISTS[author.name] ?? [];

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!booksPopupRef.current) return;
      if (!booksPopupRef.current.contains(event.target as Node)) {
        setShowBooksPopup(false);
      }
    };

    if (showBooksPopup) {
      document.addEventListener("mousedown", onOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
    };
  }, [showBooksPopup]);

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="group relative cursor-pointer">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-muted-foreground">
                {initials(author.name)}
              </span>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
              <Pencil size={11} />
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const preview = URL.createObjectURL(file);
                onChange({ ...author, avatar: preview });
              }}
            />
          </label>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold">{author.name}</p>
            </div>
            <div
              ref={booksPopupRef}
              className="relative mt-0.5"
              onMouseEnter={() => {
                if (author.books > 0) setShowBooksPopup(true);
              }}
              onMouseLeave={() => setShowBooksPopup(false)}
            >
              <button
                type="button"
                onClick={() => {
                  if (author.books > 0) setShowBooksPopup((v) => !v);
                }}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <BookOpen size={11} />
                <span className="underline-offset-2 hover:underline">{author.books} Books</span>
              </button>

              {showBooksPopup && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-[280px] overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                  <div className="border-b border-border px-3 py-2">
                    <p className="text-sm font-semibold">Books by {author.name}</p>
                    <p className="text-xs text-muted-foreground">{author.books} total</p>
                  </div>

                  {books.length > 0 ? (
                    <ul className="max-h-64 overflow-y-auto">
                      {books.map((title) => (
                        <li key={title} className="border-t border-border first:border-t-0">
                          <div className="flex items-center gap-2 px-3 py-2.5 text-sm">
                            <BookOpen size={13} className="text-muted-foreground" />
                            <span>{title}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-3 py-3 text-sm text-muted-foreground">
                      No books available for this author.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 hover:underline cursor-pointer"
        >
          <Trash2 size={14} />
          Remove
        </button>
      </div>

      {!isLibraryOnly && (
        <div className="mt-3">
          <Field
            label="Author Profile URL"
            required
            error={
              unavailable ? "This URL is already in use. Please try a different one." : undefined
            }
            hint={!unavailable ? "The URL is available" : undefined}
          >
            <div className="flex overflow-hidden rounded-lg border border-border bg-background">
              <span className="flex items-center bg-secondary/60 px-3 text-xs text-muted-foreground">
                https://azdevlibcustomer.pixelbooksapp.com/author/
              </span>
              <input
                value={author.profileSlug}
                onChange={(e) => onChange({ ...author, profileSlug: slugify(e.target.value) })}
                className="h-11 flex-1 bg-background px-3 text-sm outline-none"
              />
            </div>
          </Field>
        </div>
      )}
    </div>
  );
}

function AuthorsSection() {
  const [query, setQuery] = useState("");
  const [selectedAuthors, setSelectedAuthors] = useState<SelectedAuthor[]>([]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return AUTHOR_DIRECTORY.filter((a) => a.name.toLowerCase().includes(q));
  }, [query]);

  const addDirectoryAuthor = (author: AuthorMatch) => {
    setSelectedAuthors((prev) => {
      if (prev.some((x) => x.sourceId === author.id)) return prev;
      return [
        ...prev,
        {
          id: `sa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          sourceId: author.id,
          name: author.name,
          books: author.books,
          avatar: author.avatar,
          addAsNew: false,
          profileSlug: slugify(author.name),
        },
      ];
    });
  };

  const addAsNewFromQuery = () => {
    const name = query.trim();
    if (!name) return;
    setSelectedAuthors((prev) => [
      ...prev,
      {
        id: `sa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        books: 0,
        addAsNew: true,
        profileSlug: slugify(name),
      },
    ]);
  };

  const slugCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    selectedAuthors.forEach((author) => {
      const key = author.profileSlug.trim().toLowerCase();
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [selectedAuthors]);

  const hasQuery = query.trim().length > 0;
  const selectedSourceIds = useMemo(
    () => new Set(selectedAuthors.map((author) => author.sourceId).filter(Boolean)),
    [selectedAuthors],
  );

  return (
    <SectionCard
      title="Author(s) Details"
      description="Search the author directory for the best matching author. If no suitable match is found, create a new author."
    >
      <div className="rounded-xl border border-border p-4">
        <p className="text-sm font-semibold">Find an author</p>

        <div className="relative mt-2">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
            className="h-11 pl-10 pr-10"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {hasQuery && (
          <>
            <div className="mt-3 flex items-center justify-between text-[12px]">
              <span className="font-medium">{matches.length} matching authors found</span>
              <span className="text-muted-foreground">Click to add</span>
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {matches.map((match) => (
                <AuthorSearchResultCard
                  key={match.id}
                  match={match}
                  isSelected={selectedSourceIds.has(match.id)}
                  onAdd={() => addDirectoryAuthor(match)}
                />
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary/40 px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">
                Can&apos;t find them? Add &quot;{query || "author"}&quot; as a new author.
              </span>
              <button
                type="button"
                onClick={addAsNewFromQuery}
                className="inline-flex h-9 items-center rounded-lg border px-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#008585", borderColor: "#008585" }}
              >
                Add as new
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Selected authors
          </h3>
          <span className="text-xs font-semibold text-muted-foreground">
            {selectedAuthors.length} added
          </span>
        </div>

        {selectedAuthors.length === 0 ? (
          <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-border px-4 py-8 text-center">
            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <UserRound size={20} />
            </span>
            <p className="text-lg font-semibold">No authors yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use the search above to link existing authors or create new ones.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedAuthors.map((author) => {
              const slug = author.profileSlug.trim().toLowerCase();
              const duplicate = slug ? (slugCounts[slug] || 0) > 1 : false;
              const unavailable = duplicate || TAKEN_AUTHOR_SLUGS.has(slug);

              return (
                <SelectedAuthorCard
                  key={author.id}
                  author={author}
                  unavailable={unavailable}
                  onChange={(next) =>
                    setSelectedAuthors((prev) =>
                      prev.map((item) => (item.id === author.id ? next : item)),
                    )
                  }
                  onRemove={() =>
                    setSelectedAuthors((prev) => prev.filter((item) => item.id !== author.id))
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Book URL                                                          */
/* -------------------------------------------------------------------------- */

function BookUrlSection() {
  return (
    <SectionCard
      title="Add Book URL"
      description="Set a unique URL that readers can use to access this book directly."
    >
      <Field label="Select Primary Author">
        <SelectInput defaultValue="Barack Obama">
          <option>Barack Obama</option>
          <option>Anya Ramanathan</option>
        </SelectInput>
      </Field>

      <div className="mt-4">
        <Field label="Book URL" error="This URL is already in use. Please try a different one.">
          <div className="flex gap-2">
            <div className="flex flex-1 overflow-hidden rounded-lg border border-border bg-background">
              <span className="flex items-center bg-secondary/60 px-3 text-xs text-muted-foreground">
                https://pixelbooks.com/author/author-name/
              </span>
              <input
                defaultValue="harry-potter"
                className="h-11 flex-1 bg-background px-3 text-sm outline-none"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-secondary"
            >
              <CopyIcon size={14} /> Copy
            </button>
          </div>
        </Field>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Categories                                                        */
/* -------------------------------------------------------------------------- */

function CategoriesSection() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({
    "Academic & Educational": [],
    Articles: [],
    Autobiography: [],
  });
  const groups = Object.entries(selected).map(([name, subs]) => ({ name, subs }));
  return (
    <SectionCard title="Selected Categories">
      <ul className="space-y-3 text-sm">
        {groups.map((g) => (
          <li key={g.name}>
            <div className="flex items-center gap-2 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              {g.name}
            </div>
            {g.subs.length > 0 && (
              <ul className="mt-1 space-y-1 pl-6 text-muted-foreground">
                {g.subs.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold"
        style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
      >
        <Pencil size={14} /> Edit Category
      </button>
      {open && (
        <CategoryDialog
          initial={selected}
          onClose={() => setOpen(false)}
          onSave={(next) => {
            setSelected(next);
            setOpen(false);
          }}
        />
      )}
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  eBook Category Dialog                                                      */
/* -------------------------------------------------------------------------- */

const CATEGORY_DATA: Record<string, string[]> = {
  "Academic & Educational": ["Textbooks", "Research Papers", "Study Guides", "Reference"],
  Articles: ["News", "Opinion", "Analysis"],
  Autobiography: [],
  Biography: ["Historical", "Contemporary", "Political"],
  "Children's Literature": ["Picture Books", "Early Readers", "Middle Grade"],
  Cinema: ["Screenplays", "Film Theory", "Reviews"],
  "Cooking & Food": ["Recipes", "Nutrition", "Baking"],
  Fiction: ["Fantasy", "Sci-Fi", "Mystery", "Romance", "Thriller"],
  History: ["Ancient", "Modern", "Military", "Cultural"],
  "Self-Help": ["Productivity", "Mindfulness", "Career"],
};

function CategoryDialog({
  initial,
  onClose,
  onSave,
}: {
  initial: Record<string, string[]>;
  onClose: () => void;
  onSave: (next: Record<string, string[]>) => void;
}) {
  const mains = Object.keys(CATEGORY_DATA);
  const [selected, setSelected] = useState<Record<string, string[]>>(initial);
  const [active, setActive] = useState<string>(Object.keys(initial)[0] ?? mains[0]);

  const toggleMain = (name: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (name in next) delete next[name];
      else next[name] = [];
      return next;
    });
    setActive(name);
  };

  const toggleSub = (main: string, sub: string) => {
    setSelected((prev) => {
      const current = prev[main] ?? [];
      const has = current.includes(sub);
      return {
        ...prev,
        [main]: has ? current.filter((s) => s !== sub) : [...current, sub],
      };
    });
  };

  const activeSubs = CATEGORY_DATA[active] ?? [];
  const activeSelected = selected[active] ?? [];
  const isMainSelected = (name: string) => name in selected;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[85vh] max-h-[720px] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-xl font-semibold">eBook Category</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[minmax(240px,1fr)_minmax(280px,1.4fr)_minmax(260px,1fr)]">
          {/* Main categories */}
          <div className="flex flex-col overflow-hidden border-r border-border">
            <div className="flex h-12 items-center border-b border-border bg-secondary/40 px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Main Category
            </div>
            <ul className="flex-1 overflow-y-auto">
              {mains.map((name) => {
                const checked = isMainSelected(name);
                const isActive = active === name;
                const count = (selected[name] ?? []).length;
                return (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => setActive(name)}
                      className={`flex w-full items-center gap-3 border-b border-border/60 px-5 py-3 text-left text-sm transition-colors ${isActive ? "bg-secondary/60" : "hover:bg-secondary/30"
                        }`}
                    >
                      <span
                        role="checkbox"
                        aria-checked={checked}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMain(name);
                        }}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${checked ? "border-transparent" : "border-border bg-background"
                          }`}
                        style={
                          checked
                            ? { backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }
                            : undefined
                        }
                      >
                        {checked && <CheckIcon size={12} strokeWidth={3} />}
                      </span>
                      <span className={`flex-1 truncate ${checked ? "font-semibold" : ""}`}>
                        {name}
                      </span>
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-xs font-medium text-muted-foreground">
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Subcategories */}
          <div className="flex flex-col overflow-hidden border-r border-border">
            <div className="flex h-12 items-center border-b border-border px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {active} ({activeSubs.length} Subcategories)
            </div>
            <ul className="flex-1 overflow-y-auto">
              {activeSubs.length === 0 && (
                <li className="px-5 py-6 text-sm text-muted-foreground">
                  No subcategories available.
                </li>
              )}
              {activeSubs.map((sub) => {
                const checked = activeSelected.includes(sub);
                const enabled = isMainSelected(active);
                return (
                  <li key={sub}>
                    <button
                      type="button"
                      disabled={!enabled}
                      onClick={() => toggleSub(active, sub)}
                      className="flex w-full items-center gap-3 border-b border-border/60 px-5 py-3 text-left text-sm transition-colors hover:bg-secondary/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${checked ? "border-transparent" : "border-border bg-background"
                          }`}
                        style={
                          checked
                            ? { backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }
                            : undefined
                        }
                      >
                        {checked && <CheckIcon size={12} strokeWidth={3} />}
                      </span>
                      <span className={`flex-1 ${checked ? "font-semibold" : ""}`}>{sub}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Selected */}
          <div className="flex flex-col overflow-hidden">
            <div className="flex h-12 items-center justify-between border-b border-border px-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Selected Categories
              </span>
              <button
                type="button"
                onClick={() => setSelected({})}
                className="rounded-full border border-rose-400 px-3 py-1 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50"
              >
                Clear All
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {Object.keys(selected).length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories selected.</p>
              ) : (
                <ul className="space-y-0">
                  {Object.entries(selected).map(([name, subs]) => (
                    <li key={name} className="border-b border-border/70 py-3 last:border-b-0">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                        {name}
                      </div>
                      {subs.length > 0 && (
                        <ul className="mt-1.5 space-y-1 pl-5 text-sm text-muted-foreground">
                          {subs.map((s) => (
                            <li key={s} className="flex items-center gap-2">
                              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(selected)}
            className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Payment                                                           */
/* -------------------------------------------------------------------------- */

function Radio({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <span
        onClick={onChange}
        className="flex h-4 w-4 items-center justify-center rounded-full border"
        style={{ borderColor: checked ? "var(--brand)" : "var(--border)" }}
      >
        {checked && (
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
        )}
      </span>
      {label}
    </label>
  );
}

function PaymentSection() {
  const [pricing, setPricing] = useState<"free" | "paid">("paid");
  const [gstConfirm, setGstConfirm] = useState(true);

  return (
    <SectionCard title="Payment Details">
      <div className="space-y-4">
        <div>
          <span className="mb-2 block text-xs font-medium text-muted-foreground">
            Choose Pricing
          </span>
          <div className="flex items-center gap-6">
            <Radio checked={pricing === "free"} onChange={() => setPricing("free")} label="Free" />
            <Radio checked={pricing === "paid"} onChange={() => setPricing("paid")} label="Paid" />
          </div>
        </div>

        <div className="max-w-[220px]">
          <Field label="Tax">
            <SelectInput defaultValue="5%">
              <option>0%</option>
              <option>5%</option>
              <option>12%</option>
              <option>18%</option>
            </SelectInput>
          </Field>
        </div>

        <Check
          checked={gstConfirm}
          onChange={setGstConfirm}
          label={
            <span>
              I hereby confirm that the eBook includes a print version and therefore is subject to
              the GST rate of 5%.
            </span>
          }
        />

        <div>
          <p className="text-sm font-semibold">Lifetime Purchase Renewal</p>
          <div className="mt-2 max-w-[220px]">
            <Field label="Percentage %">
              <TextInput defaultValue="12" />
            </Field>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Price Details                                                     */
/* -------------------------------------------------------------------------- */

function PriceDetailsSection() {
  const [unitEx, setUnitEx] = useState(180);
  const [unitInc, setUnitInc] = useState(180);
  const [offer, setOffer] = useState(180);
  const selling = useMemo(() => (offer * 0.5883).toFixed(2), [offer]);

  return (
    <SectionCard title="Price Details">
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Unit Price (excl.GST)" required>
          <TextInput
            value={unitEx}
            onChange={(e) => setUnitEx(Number(e.target.value) || 0)}
            className="text-right"
          />
        </Field>
        <Field label="Unit Price (incl.GST)" required>
          <TextInput
            value={unitInc}
            onChange={(e) => setUnitInc(Number(e.target.value) || 0)}
            className="text-right"
          />
        </Field>
        <Field label="Offer Price (excl.GST) if Any">
          <TextInput
            value={offer}
            onChange={(e) => setOffer(Number(e.target.value) || 0)}
            className="text-right"
          />
        </Field>
      </div>
      <div
        className="mt-4 flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium"
        style={{ backgroundColor: "var(--secondary)" }}
      >
        <span>Selling Price including GST</span>
        <span>
          <span className="text-base font-bold" style={{ color: "var(--brand)" }}>
            ₹{selling}
          </span>{" "}
          <span className="text-xs text-muted-foreground line-through">₹{unitInc}.95</span>
        </span>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Add / Edit Rental Dialog                                                   */
/* -------------------------------------------------------------------------- */

type RentalEntry = { id: string; year: string; days: string; unit: number; offer: number };

const YEAR_OPTIONS = ["1 Year", "2 Year", "3 Year", "4 Year", "5 Year"];
const DAYS_OPTIONS = ["7 Days", "14 Days", "30 Days", "60 Days", "90 Days", "180 Days", "365 Days"];
const RENTAL_PAGE_SIZE = 5;

function calcSelling(unit: number, offer: number) {
  return parseFloat(((offer > 0 ? offer : unit) * 1.05).toFixed(2));
}

function RentalDialog({
  entries,
  onClose,
  onSave,
}: {
  entries: RentalEntry[];
  onClose: () => void;
  onSave: (rows: RentalEntry[]) => void;
}) {
  const [rows, setRows] = useState<RentalEntry[]>(entries);
  const [year, setYear] = useState("");
  const [days, setDays] = useState("");
  const [unit, setUnit] = useState("");
  const [offer, setOffer] = useState("");
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / RENTAL_PAGE_SIZE));
  const paged = rows.slice((page - 1) * RENTAL_PAGE_SIZE, page * RENTAL_PAGE_SIZE);

  const handleAdd = () => {
    if (!unit) return;
    setRows((prev) => [
      ...prev,
      {
        id: `r${Date.now()}`,
        year: year || "1 Year",
        days: days || "30 Days",
        unit: parseFloat(unit) || 0,
        offer: parseFloat(offer) || 0,
      },
    ]);
    setYear("");
    setDays("");
    setUnit("");
    setOffer("");
    setPage(Math.max(1, Math.ceil((rows.length + 1) / RENTAL_PAGE_SIZE)));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-xl font-semibold">Add / Edit Rental</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Input row */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-end gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Year</label>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)]"
                >
                  <option value="">Select Year</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Days</label>
              <div className="relative">
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)]"
                >
                  <option value="">Select Days</option>
                  {DAYS_OPTIONS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Unit Price (excl. GST)
                <span className="ml-0.5 text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Unit Price (excl. GST)"
                className="h-14 w-full rounded-xl border border-border bg-card px-4 text-right text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Offer Price (excl. GST)
              </label>
              <input
                type="number"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="Offer Price (excl. GST)"
                className="h-14 w-full rounded-xl border border-border bg-card px-4 text-right text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-14 items-center justify-center gap-1.5 rounded-xl px-6 text-sm font-semibold shadow-2xs transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-border" />

          {/* Table */}
          <p className="mb-4 text-[15px] font-bold">Added Rental</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left text-[12px] font-medium text-muted-foreground">
                  <th className="px-5 py-3">Year</th>
                  <th className="px-5 py-3">Days</th>
                  <th className="px-5 py-3">Unit Price</th>
                  <th className="px-5 py-3">Offer Price</th>
                  <th className="px-5 py-3">Selling Price</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-6 text-center text-sm text-muted-foreground">
                      No rentals added yet.
                    </td>
                  </tr>
                )}
                {paged.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="px-5 py-3 font-medium">{r.year}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.days}</td>
                    <td className="px-5 py-3">₹{r.unit}</td>
                    <td className="px-5 py-3">₹{r.offer}</td>
                    <td className="px-5 py-3 font-semibold" style={{ color: "var(--brand)" }}>
                      ₹{calcSelling(r.unit, r.offer)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                        className="text-muted-foreground transition-colors hover:text-rose-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {rows.length === 0 ? 0 : (page - 1) * RENTAL_PAGE_SIZE + 1}
              {rows.length > 1 && `–${Math.min(page * RENTAL_PAGE_SIZE, rows.length)}`} from{" "}
              {rows.length} results
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-0.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40"
              >
                «&nbsp;Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors"
                  style={
                    p === page
                      ? {
                        backgroundColor: "color-mix(in oklab, var(--brand) 12%, transparent)",
                        color: "var(--brand)",
                      }
                      : undefined
                  }
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-0.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40"
              >
                Next&nbsp;»
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(rows);
              onClose();
            }}
            className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

function RentalSection() {
  const [publisherType] = usePublisherType();
  const isLibraryOnly = publisherType === "Library-Only Publisher";
  const [enabled, setEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [entries, setEntries] = useState<RentalEntry[]>([
    { id: "r1", year: "2 Year", days: "60 Days", unit: 43, offer: 0 },
  ]);

  return (
    <SectionCard>
      <div className="mb-3 flex items-center gap-3">
        <p className="text-[15px] font-semibold">Rental</p>
        <Switch checked={enabled} onChange={setEnabled} />
      </div>
      {enabled && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-4">Year</th>
                  <th className="pb-3 pr-4">Days</th>
                  {!isLibraryOnly && <th className="pb-3 pr-4">Unit Price</th>}
                  {!isLibraryOnly && <th className="pb-3 pr-4">Offer Price</th>}
                  {!isLibraryOnly && <th className="pb-3 pr-4">Selling Price</th>}
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {entries.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="py-3 pr-4 font-medium">{r.year}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{r.days}</td>
                    {!isLibraryOnly && <td className="py-3 pr-4">₹{r.unit}.00</td>}
                    {!isLibraryOnly && <td className="py-3 pr-4">₹{r.offer}.00</td>}
                    {!isLibraryOnly && (
                      <td className="py-3 pr-4">
                        <span style={{ color: "var(--brand)" }} className="font-semibold">
                          ₹{calcSelling(r.unit, r.offer)}
                        </span>
                      </td>
                    )}
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setEntries((prev) => prev.filter((x) => x.id !== r.id))}
                        className="text-muted-foreground hover:text-rose-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-2xs transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            <Plus size={14} /> Add / Edit Rental
          </button>

          {dialogOpen && (
            <RentalDialog
              entries={entries}
              onClose={() => setDialogOpen(false)}
              onSave={(rows) => setEntries(rows)}
            />
          )}
        </>
      )}
    </SectionCard>
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
  allocations,
  onChange,
}: {
  allocations: Record<string, number>;
  onChange: (allocations: Record<string, number>) => void;
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

  const selectedNames = Object.keys(allocations);

  const filteredLibraries = ALL_LIBRARIES.filter(
    (lib) =>
      lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lib.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleLibrary = (libName: string, defaultCopies = 50) => {
    const next = { ...allocations };
    if (next[libName] !== undefined) {
      delete next[libName];
    } else {
      next[libName] = defaultCopies;
    }
    onChange(next);
  };

  const updateCopies = (libName: string, count: number) => {
    const next = { ...allocations };
    const validCount = Math.max(1, isNaN(count) ? 1 : count);
    next[libName] = validCount;
    onChange(next);
  };

  const isAllSelected =
    filteredLibraries.length > 0 &&
    filteredLibraries.every((lib) => allocations[lib.name] !== undefined);

  const handleSelectAll = () => {
    const next = { ...allocations };
    if (isAllSelected) {
      filteredLibraries.forEach((l) => {
        delete next[l.name];
      });
    } else {
      filteredLibraries.forEach((l) => {
        if (next[l.name] === undefined) {
          next[l.name] = 50;
        }
      });
    }
    onChange(next);
  };

  const totalCopies = Object.values(allocations).reduce((acc, curr) => acc + (curr || 0), 0);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex min-h-[46px] w-full items-center justify-between gap-2 rounded-xl border bg-card p-2 text-sm font-medium transition-colors cursor-pointer shadow-2xs ${
          isOpen ? "border-[var(--brand)] ring-1 ring-[var(--brand)]" : "border-border hover:bg-secondary/30"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedNames.length === 0 ? (
            <span className="text-muted-foreground text-xs font-normal px-2">
              Select one or more libraries & configure copies...
            </span>
          ) : (
            selectedNames.map((libName) => (
              <span
                key={libName}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--brand)]"
              >
                <span>{libName}</span>
                <span className="inline-flex items-center rounded-md bg-[var(--brand)] px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                  {allocations[libName]} copies
                </span>
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
          {selectedNames.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange({});
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

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl flex flex-col">
          <div className="p-2.5 border-b border-border bg-card sticky top-0 z-10 space-y-2">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search libraries by name or city..."
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

            <div className="flex items-center justify-between px-1 text-xs">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] font-semibold text-[var(--brand)] hover:underline cursor-pointer"
              >
                {isAllSelected ? "Deselect All" : "Select All Libraries"}
              </button>
              <span className="text-[11px] text-muted-foreground font-medium">
                {selectedNames.length} selected ({totalCopies} copies total)
              </span>
            </div>
          </div>

          <div className="overflow-y-auto max-h-60 py-1 divide-y divide-border/30">
            {filteredLibraries.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                No matching libraries found.
              </div>
            ) : (
              filteredLibraries.map((lib) => {
                const isSelected = allocations[lib.name] !== undefined;
                const copies = allocations[lib.name] ?? 50;

                return (
                  <div
                    key={lib.id}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors hover:bg-secondary/60 ${
                      isSelected ? "bg-[var(--brand)]/5 font-semibold" : ""
                    }`}
                  >
                    <div
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer pr-2"
                      onClick={() => toggleLibrary(lib.name)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-border text-[var(--brand)] focus:ring-[var(--brand)] accent-[var(--brand)] cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-foreground font-medium">{lib.name}</p>
                        <p className="text-[10px] text-muted-foreground">{lib.city}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        className="flex items-center gap-1 shrink-0 bg-background border border-border/80 rounded-lg p-1 shadow-2xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => updateCopies(lib.name, copies - 5)}
                          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                          title="Decrease copies"
                        >
                          <Minus size={12} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={copies}
                          onChange={(e) => updateCopies(lib.name, parseInt(e.target.value, 10) || 1)}
                          className="w-12 h-6 text-center text-xs font-bold text-foreground bg-transparent outline-none"
                        />
                        <span className="text-[10px] text-muted-foreground pr-1">copies</span>
                        <button
                          type="button"
                          onClick={() => updateCopies(lib.name, copies + 5)}
                          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                          title="Increase copies"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LibraryAllocationSection() {
  const [allocations, setAllocations] = useState<Record<string, number>>({
    "Central University Digital Library": 50,
    "National Science & Tech Consortium": 30,
  });

  const selectedLibraries = Object.keys(allocations);
  const totalCopies = Object.values(allocations).reduce((sum, count) => sum + (count || 0), 0);

  const updateCopies = (libName: string, copies: number) => {
    const next = { ...allocations };
    next[libName] = Math.max(1, isNaN(copies) ? 1 : copies);
    setAllocations(next);
  };

  const removeLibrary = (libName: string) => {
    const next = { ...allocations };
    delete next[libName];
    setAllocations(next);
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
              Library Allocation & License Copies
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Select authorized institutional libraries and allocate the number of license copies for each library.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={13} />
            {selectedLibraries.length} Libraries Allocated
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            {totalCopies} Total Copies
          </span>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <span>Select Authorized Libraries & Set Copies</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-muted-foreground font-medium">
              {selectedLibraries.length} libraries • {totalCopies} copies
            </span>
          </div>

          <LibraryMultiSelectDropdown
            allocations={allocations}
            onChange={setAllocations}
          />
        </div>

        {/* Selected Libraries Copies Breakdown Table */}
        {selectedLibraries.length > 0 ? (
          <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <span>Allocated Libraries License Breakdown</span>
              </h3>
              <span className="text-xs font-semibold text-muted-foreground">
                Total: <strong className="text-foreground font-extrabold">{totalCopies} copies</strong>
              </span>
            </div>

            <div className="divide-y divide-border/40">
              {selectedLibraries.map((libName) => {
                const libInfo = ALL_LIBRARIES.find((l) => l.name === libName);
                const copies = allocations[libName];

                return (
                  <div key={libName} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
                        <Building2 size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{libName}</p>
                        <p className="text-[11px] text-muted-foreground">{libInfo?.city ?? "Institutional Library"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {/* Presets */}
                      <div className="hidden md:flex items-center gap-1 mr-2">
                        {[10, 25, 50, 100].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => updateCopies(libName, preset)}
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border transition-colors cursor-pointer ${
                              copies === preset
                                ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                                : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>

                      {/* Stepper Input */}
                      <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-2 py-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateCopies(libName, copies - 5)}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={copies}
                          onChange={(e) => updateCopies(libName, parseInt(e.target.value, 10) || 1)}
                          className="w-14 h-7 text-center text-xs font-extrabold text-foreground outline-none bg-transparent"
                        />
                        <span className="text-xs text-muted-foreground font-medium pr-1">copies</span>
                        <button
                          type="button"
                          onClick={() => updateCopies(libName, copies + 5)}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeLibrary(libName)}
                        className="h-9 w-9 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove library allocation"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-1">
            <span>⚠️ Please select at least one library and allocate license copies to proceed.</span>
          </p>
        )}
      </div>
    </div>
  );
}

function AddEBookPage() {
  const [publisherType] = usePublisherType();
  const isLibraryOnly = publisherType === "Library-Only Publisher";
  const [submitted, setSubmitted] = useState(false);
  const search = Route.useSearch();
  const isEditMode = Boolean(search.edit);
  const targetBook = search.edit ? seedBooks.find((b) => b.id === search.edit) : null;

  return (
    <AppShell title={isEditMode ? "Edit eBook" : "Add eBook"}>
      <div className="p-4 md:p-8">
        {isEditMode && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs font-semibold text-amber-700 dark:text-amber-400 shadow-2xs">
            <span className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>Editing Draft eBook: <strong>{targetBook?.title ?? "Draft Title"}</strong></span>
            </span>
            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              Draft Mode
            </span>
          </div>
        )}

        <Link
          to="/publisher/catalogue"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} /> Back to Catalogue
        </Link>

        <div className="space-y-6 pb-6">
          <UploadRow />
          <GuidelinesSection />
          <EBookDetailsSection />
          <AuthorsSection />
          {!isLibraryOnly && <BookUrlSection />}
          <CategoriesSection />
          {!isLibraryOnly && <PaymentSection />}
          {!isLibraryOnly && <PriceDetailsSection />}
          {!isLibraryOnly && <RentalSection />}
          {isLibraryOnly && <LibraryAllocationSection />}

          {submitted && (
            <div
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium"
              style={{
                backgroundColor: "color-mix(in oklab, var(--brand) 10%, transparent)",
                color: "var(--brand)",
              }}
            >
              <CheckCircle2 size={16} /> {isLibraryOnly ? "eBook published successfully." : "eBook submitted for review."}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-end gap-2 border-t border-border bg-background/90 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
          <Link
            to="/publisher/catalogue"
            className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-5 text-sm font-semibold hover:bg-secondary"
          >
            Cancel
          </Link>
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-5 text-sm font-semibold hover:bg-secondary"
          >
            Save as draft
          </button>
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="inline-flex h-11 items-center rounded-lg px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            {isLibraryOnly ? "Publish eBook" : "Submit eBook for Review"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
