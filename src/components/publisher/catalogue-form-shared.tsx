import { useState, useRef, useEffect, useMemo } from "react";
import {
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Search,
  UserRound,
  Pencil,
  Plus,
  Trash2,
  FileText,
  List,
  Check as CheckIcon,
  Eye,
  Loader2,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Tag,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Shared UI Primitives                                                       */
/* -------------------------------------------------------------------------- */

export function SectionCard({
  title,
  description,
  right,
  icon,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  right?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card p-5 sm:p-6 shadow-xs ${className}`}>
      {(title || right || icon) && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              {title && <h2 className="text-sm sm:text-base font-bold text-foreground">{title}</h2>}
              {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
            </div>
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function AutoDetectedBadge() {
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

export function Field({
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
    <div className="block">
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {error ? (
        <span className="mt-1 block text-[11px] font-medium text-rose-500">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] text-foreground ${className}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full rounded-xl border border-border bg-card p-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] text-foreground ${className}`}
    />
  );
}

export function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode },
) {
  const { className = "", children, ...rest } = props;
  return (
    <div className="relative">
      <select
        {...rest}
        className={`h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-10 text-sm outline-none transition-colors focus:border-[var(--brand)] text-foreground cursor-pointer ${className}`}
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

export function Check({
  checked,
  onChange,
  label,
  className = "",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`flex items-start gap-2.5 text-sm text-foreground cursor-pointer select-none ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-border text-[var(--brand)] focus:ring-[var(--brand)] accent-[var(--brand)] cursor-pointer"
      />
      <span>{label}</span>
    </label>
  );
}

export function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
      style={{
        backgroundColor: checked ? "var(--brand)" : "var(--border)",
      }}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function Radio({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
      <span
        onClick={onChange}
        className="flex h-4 w-4 items-center justify-center rounded-full border transition-colors cursor-pointer"
        style={{
          borderColor: checked ? "var(--brand)" : "var(--border)",
        }}
      >
        {checked && (
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
        )}
      </span>
      {label}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*  Document Preview Component                                                 */
/* -------------------------------------------------------------------------- */

export function EbookDocumentPreview({ file }: { file: File }) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const isPdf = ext === "pdf" || file.type.includes("pdf");
  const formatLabel = isPdf ? "PDF" : "ePUB";

  return (
    <div className="relative mb-2 flex flex-col items-center">
      <div className="group/doc relative flex aspect-[3/4] w-24 flex-col justify-between overflow-hidden rounded-lg border border-border/80 bg-card p-2.5 shadow-md ring-1 ring-black/5 transition-transform duration-200 hover:scale-105">
        <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
          <span
            className={`inline-block rounded px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-wider text-white shadow-2xs ${
              isPdf ? "bg-rose-500" : "bg-teal-600"
            }`}
          >
            {formatLabel}
          </span>
          <div className="h-1 w-6 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="my-1.5 space-y-1">
          <div className="h-1.5 w-full rounded-xs bg-foreground/20" />
          <div className="h-1.5 w-4/5 rounded-xs bg-foreground/15" />
          <div className="h-1 w-full rounded-xs bg-muted-foreground/20" />
          <div className="h-1 w-3/4 rounded-xs bg-muted-foreground/20" />
          <div className="h-1 w-5/6 rounded-xs bg-muted-foreground/20" />
        </div>

        <div className="flex items-center justify-between border-t border-border/40 pt-1 text-[7px] text-muted-foreground/60">
          <span>Pg 1</span>
          <span>● ● ●</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 p-1 opacity-0 transition-opacity group-hover/doc:opacity-100">
          <span className="flex items-center gap-1 text-[9px] font-semibold text-white">
            <Eye size={10} /> Preview {formatLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Upload Tile Component                                                      */
/* -------------------------------------------------------------------------- */

export function UploadTile({
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
    if (dropped) updateFile(dropped);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Step {step}
        </span>
        {required && (
          <span className="text-[11px] font-medium text-rose-500">Required</span>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`group relative flex min-h-[300px] flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
          dragging
            ? "border-[var(--brand)] bg-secondary/50 scale-[1.01]"
            : file
              ? "border-[var(--brand)]/50 bg-secondary/20"
              : "border-border hover:border-[var(--brand)]/60 hover:bg-secondary/20"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={isCover ? "image/*" : ".epub,.pdf"}
          className="sr-only"
          onChange={(e) => {
            const chosen = e.target.files?.[0];
            if (chosen) updateFile(chosen);
          }}
        />

        {file ? (
          <div className="flex w-full flex-col items-center justify-center">
            {isCover ? (
              <div className="relative mb-3 flex flex-col items-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Cover preview"
                  className="h-32 w-24 rounded-lg object-cover shadow-md ring-1 ring-black/10"
                />
              </div>
            ) : (
              <div
                onClick={onPreview}
                className={onPreview ? "cursor-pointer" : undefined}
                title={onPreview ? "Click to open reader preview" : undefined}
              >
                <EbookDocumentPreview file={file} />
              </div>
            )}

            <div className="w-full max-w-[200px]">
              <p className="truncate text-xs font-bold text-foreground">{file.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            {isUploading && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--brand)]">
                <Loader2 size={12} className="animate-spin" /> Uploading &amp; Validating...
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              {onPreview && !isCover && (
                <button
                  type="button"
                  onClick={onPreview}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--brand)]/40 bg-[var(--brand)]/10 px-2.5 text-xs font-semibold text-[var(--brand)] hover:bg-[var(--brand)]/20 transition-colors cursor-pointer"
                >
                  <Eye size={12} /> Preview
                </button>
              )}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => updateFile(null)}
                className="inline-flex h-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Remove file"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground transition-transform group-hover:scale-110">
              {icon}
            </span>
            <p className="text-sm font-bold text-foreground">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl px-4 text-xs font-bold text-white shadow-2xs transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: "var(--brand)" }}
            >
              {ctaLabel}
            </button>

            {hint && <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>}

            <div className="mt-3 flex flex-wrap justify-center gap-1">
              {formats.map((f) => (
                <span
                  key={f}
                  className="rounded-md border border-border/80 bg-secondary/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {extra && <div className="mt-3">{extra}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sample Preview Dialog                                                     */
/* -------------------------------------------------------------------------- */

export function SamplePreviewDialog({
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
    ? sampleFile?.name ||
      (ebookFile ? `Sample_${ebookFile.name.replace(/\.[^/.]+$/, "")}.epub` : "Sample_eBook.epub")
    : ebookFile?.name || "Source_eBook.epub";
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
      quote:
        "Space and light and order. Those are the things that men need just as much as they need bread or a place to sleep.",
      quoteAuthor: "Le Corbusier",
    },
    {
      title: "1.2 Sustainable Materials & Eco-conscious Building",
      content: `Cross-laminated timber (CLT), recycled steel composites, and ultra-high-performance concrete are redefining the physical footprint of new structures. By prioritizing low embodied carbon materials, developers can achieve net-zero lifecycle goals while enhancing structural resilience.

When evaluating sustainable material pipelines, architects must balance regional availability, supply chain transport emissions, and long-term maintenance cycles.`,
      quote:
        "The mother art is architecture. Without an architecture of our own we have no soul of our own civilization.",
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
      quote:
        "Architecture is the learned game, correct and magnificent, of forms assembled in the light.",
      quoteAuthor: "Le Corbusier",
    },
    {
      title: "2.2 Conclusion & Further Reading",
      content: isSample
        ? `This concludes your auto-generated sample preview (Chapters 1 & 2). The full publication includes all 12 chapters, interactive blueprints, high-resolution rendering galleries, and full index references.

You have reached the end of the free preview sample.`
        : `This is page 6 of your full manuscript source file. You can continue paging through the remaining chapters to verify layout integrity and formatting.`,
      quote: isSample
        ? "End of Sample Preview — PixelBooks Auto-Parser"
        : "Source Manuscript — PixelBooks Publisher",
      quoteAuthor: "PixelBooks System",
    },
  ];

  const pageData = samplePages[currentPage - 1] || samplePages[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex h-[88vh] max-h-[800px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand)]/15 text-[var(--brand)]">
              <BookOpen size={18} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {isSample ? "eBook Sample Reader Preview" : "Manuscript Source Viewer"}
              </h2>
              <p className="text-xs text-muted-foreground truncate max-w-md">{fileName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-background/50">
          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 md:p-12 shadow-sm space-y-6">
            <div className="border-b border-border/60 pb-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand)]">
                {bookTitle}
              </p>
              <h1 className="mt-2 text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                {pageData.title}
              </h1>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed space-y-4">
              {pageData.content.split("\n\n").map((para, idx) => (
                <p key={idx} className="text-sm md:text-base leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {pageData.quote && (
              <blockquote className="my-6 border-l-2 border-[var(--brand)] pl-4 italic text-sm text-muted-foreground">
                &ldquo;{pageData.quote}&rdquo;
                <footer className="mt-1 text-xs font-semibold not-italic text-foreground">
                  — {pageData.quoteAuthor}
                </footer>
              </blockquote>
            )}

            <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
              <span>PixelBooks Digital Reader</span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border bg-card px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="text-xs text-muted-foreground font-medium px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-40 cursor-pointer"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onRejectUploadOwn && (
              <button
                type="button"
                onClick={onRejectUploadOwn}
                className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
              >
                Upload Custom Sample
              </button>
            )}
            {onApprove && (
              <button
                type="button"
                onClick={onApprove}
                className="inline-flex h-9 items-center rounded-lg px-4 text-xs font-bold text-white shadow-2xs hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "var(--brand)" }}
              >
                Approve &amp; Attach Sample
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cover Image Extraction Helper                                             */
/* -------------------------------------------------------------------------- */

export function createCoverImageFromEbook(file: File, pageNumber: number): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 438;
    canvas.height = 678;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(
        new File([""], `Cover_${file.name.replace(/\.[^/.]+$/, "")}.png`, { type: "image/png" }),
      );
      return;
    }

    const rawTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const formattedTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

    const gradient = ctx.createLinearGradient(0, 0, 438, 678);
    gradient.addColorStop(0, "#1e1b4b");
    gradient.addColorStop(0.4, "#312e81");
    gradient.addColorStop(0.8, "#1e293b");
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 438, 678);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, 398, 638);
    ctx.strokeRect(26, 26, 386, 626);

    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, 48);
    ctx.lineTo(20, 20);
    ctx.lineTo(48, 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(390, 20);
    ctx.lineTo(418, 20);
    ctx.lineTo(418, 48);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, 630);
    ctx.lineTo(20, 658);
    ctx.lineTo(48, 658);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(390, 658);
    ctx.lineTo(418, 658);
    ctx.lineTo(418, 630);
    ctx.stroke();

    ctx.fillStyle = "rgba(99, 102, 241, 0.35)";
    ctx.beginPath();
    ctx.roundRect(139, 52, 160, 28, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(165, 180, 252, 0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#e0e7ff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PIXELBOOKS EDITION", 219, 70);

    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.beginPath();
    ctx.arc(219, 195, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(165, 180, 252, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "rgba(99, 102, 241, 0.25)";
    ctx.beginPath();
    ctx.arc(219, 195, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "34px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("📖", 219, 195);
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";

    const words = formattedTitle.split(" ");
    let line = "";
    const lines: string[] = [];
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 320 && n > 0) {
        lines.push(line.trim());
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    const startY = 320;
    lines.slice(0, 3).forEach((l, idx) => {
      ctx.fillText(l, 219, startY + idx * 30);
    });

    ctx.fillStyle = "#94a3b8";
    ctx.font = "italic 13px sans-serif";
    ctx.fillText(
      "Extracted Cover & Manuscript Edition",
      219,
      startY + Math.min(lines.length, 3) * 30 + 24,
    );

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.moveTo(119, 540);
    ctx.lineTo(319, 540);
    ctx.stroke();

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "600 13px sans-serif";
    ctx.fillText("PixelBooks Publishing", 219, 575);

    ctx.fillStyle = "#64748b";
    ctx.font = "11px sans-serif";
    ctx.fillText("Auto-generated from digital publication", 219, 598);

    canvas.toBlob((blob) => {
      if (blob) {
        const coverName = `Cover_${file.name.replace(/\.[^/.]+$/, "")}_Page${pageNumber}.png`;
        resolve(new File([blob], coverName, { type: "image/png" }));
      } else {
        resolve(
          new File([""], `Cover_${file.name.replace(/\.[^/.]+$/, "")}_Page${pageNumber}.png`, {
            type: "image/png",
          }),
        );
      }
    }, "image/png");
  });
}

/* -------------------------------------------------------------------------- */
/*  Rich Text Editor Component                                                */
/* -------------------------------------------------------------------------- */

export function RichTextEditor({
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
          Rich Text Editor
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder || "Provide a comprehensive summary and key highlights..."}
        className="w-full bg-transparent p-3.5 text-sm leading-relaxed text-foreground outline-none resize-y placeholder:text-muted-foreground"
      />

      <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-3.5 py-1.5 text-[11px] text-muted-foreground">
        <span>Rich Text &amp; Markdown enabled</span>
        <span>{value.length} / 2,000 characters</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Author Helpers & Types                                                    */
/* -------------------------------------------------------------------------- */

export type AuthorMatch = {
  id: string;
  name: string;
  books: number;
  avatar?: string;
  affiliation?: string;
};

export type SelectedAuthor = {
  id: string;
  sourceId?: string;
  name: string;
  books: number;
  avatar?: string;
  affiliation?: string;
  role?: string;
  royaltyPercentage?: number;
  addAsNew: boolean;
  profileSlug: string;
};

export const AUTHOR_DIRECTORY: AuthorMatch[] = [
  {
    id: "a-1",
    name: "Dr. Ashok Alex",
    books: 8,
    avatar: "https://i.pravatar.cc/80?img=12",
    affiliation: "Department of Education Policy, National University",
  },
  {
    id: "a-2",
    name: "Arundhati Roy",
    books: 30,
    avatar: "https://i.pravatar.cc/80?img=47",
    affiliation: "Independent Author & Essayist",
  },
  {
    id: "a-3",
    name: "Mark Twain",
    books: 3,
    avatar: "https://i.pravatar.cc/80?img=33",
    affiliation: "Literary Classics Faculty",
  },
  {
    id: "a-4",
    name: "Prof. Rajesh Nambiar",
    books: 12,
    avatar: "https://i.pravatar.cc/80?img=60",
    affiliation: "School of Computer Science & Artificial Intelligence",
  },
  {
    id: "a-5",
    name: "Dr. Priya Nair",
    books: 5,
    avatar: "https://i.pravatar.cc/80?img=32",
    affiliation: "Department of Biotechnology & Life Sciences",
  },
];

export const AUTHOR_BOOK_LISTS: Record<string, string[]> = {
  "Dr. Ashok Alex": [
    "NEP 2020 - Policy Formulation In Education",
    "Modern Pedagogy in Higher Education",
    "Digital Literacy Frameworks",
  ],
  "Arundhati Roy": [
    "The God of Small Things",
    "The Ministry of Utmost Happiness",
    "Capitalism: A Ghost Story",
  ],
  "Mark Twain": [
    "The Adventures of Tom Sawyer",
    "Adventures of Huckleberry Finn",
  ],
  "Prof. Rajesh Nambiar": [
    "Distributed Cloud Architectures",
    "Algorithmic Problem Solving",
  ],
  "Dr. Priya Nair": [
    "Molecular Biology Principles",
    "Biochemical Genetics Handbook",
  ],
};

export const TAKEN_AUTHOR_SLUGS = new Set(["mark-twain"]);

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function initials(name: string) {
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

export function AuthorSearchResultCard({
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
        if (!isSelected) onAdd();
      }}
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
        isSelected
          ? "cursor-default border-border/70 bg-secondary/30 text-muted-foreground"
          : "border-border bg-card hover:bg-secondary/50 cursor-pointer"
      }`}
    >
      {match.avatar ? (
        <img
          src={match.avatar}
          alt={match.name}
          className={`h-9 w-9 shrink-0 rounded-full object-cover ${isSelected ? "opacity-70" : ""}`}
        />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-muted-foreground">
          {initials(match.name)}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-sm font-semibold ${isSelected ? "text-muted-foreground" : "text-foreground"}`}
        >
          {match.name}
        </span>
        {match.affiliation && (
          <span className="block truncate text-[10px] text-muted-foreground">
            {match.affiliation}
          </span>
        )}
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
            className={`inline-flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer ${
              match.books > 0 ? "hover:text-foreground" : ""
            }`}
          >
            <BookOpen size={11} />
            <span className={match.books > 0 ? "underline-offset-2 hover:underline" : ""}>
              {match.books} Titles
            </span>
          </button>

          {showBooksPopup && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-[calc(100%+6px)] z-30 w-[260px] overflow-hidden rounded-lg border border-border bg-card shadow-lg cursor-default text-foreground"
            >
              <div className="border-b border-border px-3 py-2">
                <p className="text-sm font-semibold">Titles by {match.name}</p>
                <p className="text-xs text-muted-foreground">{match.books} total</p>
              </div>
              <ul className="max-h-56 overflow-y-auto">
                {books.map((title) => (
                  <li key={title} className="border-t border-border first:border-t-0">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs">
                      <BookOpen size={12} className="text-muted-foreground shrink-0" />
                      <span className="truncate">{title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </span>
      {isSelected && (
        <span className="ml-auto text-emerald-600 dark:text-emerald-400 shrink-0">
          <CheckIcon size={14} />
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Category Dialog Component                                                  */
/* -------------------------------------------------------------------------- */

export const CATEGORY_DATA: Record<string, string[]> = {
  "Academic & Educational": [
    "Higher Education",
    "Curriculum Books",
    "Engineering & Tech",
    "Medical & Health Sciences",
    "Business & Management",
    "Pure Sciences",
  ],
  Reference: ["Encyclopedias", "Dictionaries", "Policy Documents", "Law & Constitution"],
  Articles: ["Peer Reviewed", "Institutional Reports", "Whitepapers"],
  Autobiography: ["Memoirs", "Historical Leaders", "Scientists"],
  Fiction: ["Fantasy", "Sci-Fi", "Mystery", "Romance", "Thriller"],
  History: ["Ancient", "Modern", "Military", "Cultural"],
  "Self-Help": ["Productivity", "Mindfulness", "Career"],
};

export function CategoryDialog({
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
  const [mainCategorySearch, setMainCategorySearch] = useState("");

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

  const filteredMains = useMemo(() => {
    const q = mainCategorySearch.trim().toLowerCase();
    if (!q) return mains;
    return mains.filter((name) => name.toLowerCase().includes(q));
  }, [mains, mainCategorySearch]);

  const totalSelectedCategories = Object.keys(selected).length;
  const totalSelectedSubcategories = Object.values(selected).reduce(
    (acc, arr) => acc + arr.length,
    0,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[85vh] max-h-[720px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-card shadow-xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Tag size={18} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Select Categories</h2>
              <p className="text-xs text-muted-foreground">
                Classify your publication with main and subcategories
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[minmax(240px,1fr)_minmax(280px,1.4fr)_minmax(260px,1fr)]">
          {/* Main Categories */}
          <div className="flex flex-col overflow-hidden border-r border-border">
            <div className="space-y-2 border-b border-border bg-secondary/30 px-5 py-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Main Categories
              </div>
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={mainCategorySearch}
                  onChange={(e) => setMainCategorySearch(e.target.value)}
                  placeholder="Search category..."
                  className="h-9 w-full rounded-md border border-border bg-card pl-8 pr-2.5 text-xs text-foreground outline-none focus:border-[var(--brand)]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {filteredMains.map((name) => {
                const checked = isMainSelected(name);
                const isActive = active === name;
                return (
                  <div
                    key={name}
                    onClick={() => setActive(name)}
                    className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                      isActive ? "bg-secondary font-bold text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <label
                      className="flex items-center gap-2 cursor-pointer flex-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMain(name)}
                        className="h-4 w-4 rounded border-border text-[var(--brand)] accent-[var(--brand)] cursor-pointer"
                      />
                      <span>{name}</span>
                    </label>
                    <span className="text-[10px] text-muted-foreground">
                      {CATEGORY_DATA[name]?.length || 0}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subcategories */}
          <div className="flex flex-col overflow-hidden border-r border-border bg-secondary/10">
            <div className="border-b border-border bg-secondary/30 px-5 py-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Subcategories for: <strong className="text-foreground">{active}</strong>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {activeSubs.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No subcategories available.
                </div>
              ) : (
                activeSubs.map((sub) => {
                  const checked = activeSelected.includes(sub);
                  return (
                    <label
                      key={sub}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-foreground hover:bg-secondary cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSub(active, sub)}
                        className="h-4 w-4 rounded border-border text-[var(--brand)] accent-[var(--brand)] cursor-pointer"
                      />
                      <span>{sub}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Summary / Selected List */}
          <div className="flex flex-col overflow-hidden bg-secondary/20">
            <div className="border-b border-border bg-secondary/30 px-5 py-3 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Selected ({totalSelectedCategories})
              </div>
              <button
                type="button"
                onClick={() => setSelected({})}
                className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
              >
                Clear all
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {Object.keys(selected).length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No categories selected yet.
                </div>
              ) : (
                Object.entries(selected).map(([cat, subs]) => (
                  <div key={cat} className="rounded-lg border border-border bg-card p-2.5 text-xs shadow-2xs">
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => toggleMain(cat)}
                        className="text-muted-foreground hover:text-rose-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    {subs.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {subs.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() => toggleSub(cat, s)}
                              className="hover:text-rose-500"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <span className="text-xs text-muted-foreground">
            {totalSelectedCategories} categories &bull; {totalSelectedSubcategories} subcategories
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(selected);
                onClose();
              }}
              className="inline-flex h-9 items-center rounded-lg px-4 text-xs font-bold text-white shadow-2xs hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "var(--brand)" }}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Rental Dialog & Helpers                                                    */
/* -------------------------------------------------------------------------- */

export type RentalEntry = {
  id: string;
  year: string;
  days: string;
  unit: number;
  offer: number;
};

export const YEAR_OPTIONS = ["1 Year", "2 Year", "3 Year", "4 Year", "5 Year"];
export const DAYS_OPTIONS = [
  "7 Days",
  "14 Days",
  "30 Days",
  "60 Days",
  "90 Days",
  "180 Days",
  "365 Days",
];
const RENTAL_PAGE_SIZE = 5;

export function calcSelling(unit: number, offer: number) {
  const base = offer > 0 ? offer : unit;
  return (base * 0.5883).toFixed(2);
}

export function RentalDialog({
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
        className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-card shadow-xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-lg font-bold text-foreground">Add / Edit Rental Plans</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-end gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">Year</label>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-border bg-card px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--brand)] text-foreground cursor-pointer"
                >
                  <option value="">Select Year</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">Days</label>
              <div className="relative">
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-border bg-card px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--brand)] text-foreground cursor-pointer"
                >
                  <option value="">Select Days</option>
                  {DAYS_OPTIONS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">Unit Price (₹)</label>
              <input
                type="number"
                placeholder="₹0.00"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-card px-3 text-xs outline-none transition-colors focus:border-[var(--brand)] text-foreground"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">Offer Price (₹)</label>
              <input
                type="number"
                placeholder="₹0.00"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-card px-3 text-xs outline-none transition-colors focus:border-[var(--brand)] text-foreground"
              />
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-11 items-center gap-1 rounded-xl px-4 text-xs font-bold text-white shadow-2xs hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-secondary/10">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left font-semibold uppercase text-muted-foreground">
                  <th className="p-3 pl-4">Year</th>
                  <th className="p-3">Days</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Offer Price</th>
                  <th className="p-3">Selling Price</th>
                  <th className="p-3 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted-foreground">
                      No rental plans configured.
                    </td>
                  </tr>
                ) : (
                  paged.map((r) => (
                    <tr key={r.id} className="hover:bg-secondary/40">
                      <td className="p-3 pl-4 font-semibold text-foreground">{r.year}</td>
                      <td className="p-3 text-muted-foreground">{r.days}</td>
                      <td className="p-3">₹{r.unit}.00</td>
                      <td className="p-3">₹{r.offer}.00</td>
                      <td className="p-3 font-bold text-[var(--brand)]">
                        ₹{calcSelling(r.unit, r.offer)}
                      </td>
                      <td className="p-3 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                          className="text-muted-foreground hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <span className="text-xs text-muted-foreground">
            {rows.length} configured rental duration{rows.length === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(rows);
                onClose();
              }}
              className="inline-flex h-9 items-center rounded-lg px-4 text-xs font-bold text-white shadow-2xs hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "var(--brand)" }}
            >
              Save Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
