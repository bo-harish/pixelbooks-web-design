import { useRef, useState } from "react";
import {
  BookOpen,
  FileText,
  Image as ImageIcon,
  Upload,
  Sparkles,
  AlertCircle,
  Check,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import { EbookDocumentPreview } from "./catalogue-form-shared";

export interface UploadEBookFilesSectionProps {
  ebookFile: File | null;
  setEbookFile: (file: File | null) => void;
  sampleFile: File | null;
  setSampleFile: (file: File | null) => void;
  coverFile: File | null;
  setCoverFile: (file: File | null) => void;
  autofill: boolean;
  setAutofill: (val: boolean) => void;
  onPreviewSource?: () => void;
  onPreviewSample?: () => void;
  onGenerateSample?: () => void;
  onGenerateCover?: () => void;
  isGeneratingCover?: boolean;
  selectedCoverPage?: number;
  setSelectedCoverPage?: (page: number) => void;
}

export function UploadEBookFilesSection({
  ebookFile,
  setEbookFile,
  sampleFile,
  setSampleFile,
  coverFile,
  setCoverFile,
  autofill,
  setAutofill,
  onPreviewSource,
  onPreviewSample,
  onGenerateSample,
  onGenerateCover,
  isGeneratingCover = false,
  selectedCoverPage = 1,
  setSelectedCoverPage,
}: UploadEBookFilesSectionProps) {
  const ebookInputRef = useRef<HTMLInputElement>(null);
  const sampleInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [dragCard1, setDragCard1] = useState(false);
  const [dragCard2, setDragCard2] = useState(false);
  const [dragCard3, setDragCard3] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card p-5 sm:p-6 space-y-5 shadow-xs">
      {/* Header: Title & Subtitle in Select Categories Style */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/40 shrink-0 shadow-2xs">
          <Upload size={16} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Upload eBook Files &amp; Metadata
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Provide your main eBook file, preview sample, and high-resolution cover image.
          </p>
        </div>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ── CARD 1: STEP 01 Upload Your eBook ──────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
          <div>
            {/* Header: Step Badge + Title */}
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center rounded-full bg-teal-50 dark:bg-teal-950/50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/40">
                STEP 01
              </span>
              <h3 className="text-sm font-bold text-foreground">Upload Your eBook</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 mb-4">
              Drop your primary manuscript file
            </p>

            <input
              ref={ebookInputRef}
              type="file"
              accept=".epub,.pdf"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setEbookFile(f);
              }}
            />

            {/* Dashed Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragCard1(true);
              }}
              onDragLeave={() => setDragCard1(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragCard1(false);
                const dropped = e.dataTransfer.files[0];
                if (dropped) setEbookFile(dropped);
              }}
              className={`rounded-2xl border border-dashed p-6 sm:p-7 flex flex-col items-center justify-center text-center transition-all min-h-[220px] ${
                dragCard1
                  ? "border-teal-500 bg-teal-50/20 scale-[1.01]"
                  : ebookFile
                    ? "border-teal-300/80 dark:border-teal-800/60 bg-secondary/15"
                    : "border-teal-200/90 dark:border-teal-800/60 bg-transparent hover:border-teal-400 hover:bg-secondary/10"
              }`}
            >
              {ebookFile ? (
                <div className="flex flex-col items-center">
                  <div
                    onClick={onPreviewSource}
                    className={onPreviewSource ? "cursor-pointer" : undefined}
                    title={onPreviewSource ? "Click to open reader preview" : undefined}
                  >
                    <EbookDocumentPreview file={ebookFile} />
                  </div>
                  <p className="truncate max-w-[200px] text-xs font-bold text-foreground mt-1">
                    {ebookFile.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {(ebookFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    {onPreviewSource && (
                      <button
                        type="button"
                        onClick={onPreviewSource}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-teal-500/40 bg-teal-500/10 px-2.5 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition-colors cursor-pointer"
                      >
                        <Eye size={12} /> Preview
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => ebookInputRef.current?.click()}
                      className="inline-flex h-8 items-center rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setEbookFile(null)}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 mb-3 shadow-2xs">
                    <BookOpen size={22} strokeWidth={1.75} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground mb-1">
                    Drag &amp; drop file here
                  </p>
                  <span className="text-[11px] text-muted-foreground mb-3 font-normal">or</span>
                  <button
                    type="button"
                    onClick={() => ebookInputRef.current?.click()}
                    className="h-10 w-full max-w-[220px] rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-secondary dark:hover:bg-secondary/80 text-foreground font-semibold text-xs flex items-center justify-center gap-2 border border-slate-200/70 dark:border-border transition-colors cursor-pointer shadow-2xs"
                  >
                    <Upload size={14} className="text-muted-foreground" />
                    <span>Upload ePUB or PDF</span>
                  </button>
                  <span className="text-[11px] text-muted-foreground mt-3 font-medium">
                    ePUB &bull; PDF &bull; Max 30 MB
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── CARD 2: STEP 02 Upload Free Sample ─────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
          <div>
            {/* Header: Step Badge + Title */}
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center rounded-full bg-teal-50 dark:bg-teal-950/50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/40">
                STEP 02
              </span>
              <h3 className="text-sm font-bold text-foreground">Upload Free Sample</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 mb-4">
              Preview sample for readers
            </p>

            <input
              ref={sampleInputRef}
              type="file"
              accept=".epub,.pdf"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setSampleFile(f);
              }}
            />

            {/* Dashed Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragCard2(true);
              }}
              onDragLeave={() => setDragCard2(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragCard2(false);
                const dropped = e.dataTransfer.files[0];
                if (dropped) setSampleFile(dropped);
              }}
              className={`rounded-2xl border border-dashed p-6 sm:p-7 flex flex-col items-center justify-center text-center transition-all min-h-[220px] ${
                dragCard2
                  ? "border-teal-500 bg-teal-50/20 scale-[1.01]"
                  : sampleFile
                    ? "border-teal-300/80 dark:border-teal-800/60 bg-secondary/15"
                    : "border-teal-200/90 dark:border-teal-800/60 bg-transparent hover:border-teal-400 hover:bg-secondary/10"
              }`}
            >
              {sampleFile ? (
                <div className="flex flex-col items-center">
                  <div
                    onClick={onPreviewSample}
                    className={onPreviewSample ? "cursor-pointer" : undefined}
                    title={onPreviewSample ? "Click to open reader preview" : undefined}
                  >
                    <EbookDocumentPreview file={sampleFile} />
                  </div>
                  <p className="truncate max-w-[200px] text-xs font-bold text-foreground mt-1">
                    {sampleFile.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {(sampleFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    {onPreviewSample && (
                      <button
                        type="button"
                        onClick={onPreviewSample}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-teal-500/40 bg-teal-500/10 px-2.5 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition-colors cursor-pointer"
                      >
                        <Eye size={12} /> Preview
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => sampleInputRef.current?.click()}
                      className="inline-flex h-8 items-center rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setSampleFile(null)}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 mb-3 shadow-2xs">
                    <FileText size={22} strokeWidth={1.75} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground mb-1">
                    Drag &amp; drop file here
                  </p>
                  <span className="text-[11px] text-muted-foreground mb-3 font-normal">or</span>
                  <button
                    type="button"
                    onClick={() => sampleInputRef.current?.click()}
                    className="h-10 w-full max-w-[220px] rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-secondary dark:hover:bg-secondary/80 text-foreground font-semibold text-xs flex items-center justify-center gap-2 border border-slate-200/70 dark:border-border transition-colors cursor-pointer shadow-2xs"
                  >
                    <Upload size={14} className="text-muted-foreground" />
                    <span>Upload Sample File</span>
                  </button>
                  <span className="text-[11px] text-muted-foreground mt-3 font-medium">
                    ePUB &bull; PDF &bull; Max 10 MB
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Bottom Box in Card 2 */}
          <div className="mt-4">
            {ebookFile ? (
              <button
                type="button"
                onClick={onGenerateSample}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition-all cursor-pointer shadow-2xs"
              >
                <Sparkles size={14} className="animate-pulse text-teal-600 dark:text-teal-400" />
                <span>Generate Sample from eBook</span>
              </button>
            ) : (
              <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200/70 dark:border-border bg-slate-50 dark:bg-secondary/40 px-3 text-xs font-medium text-muted-foreground">
                <Sparkles size={14} className="opacity-40" />
                <span>Upload eBook to Enable Auto Sample</span>
              </div>
            )}
          </div>
        </div>

        {/* ── CARD 3: STEP 03 Upload Cover Image ─────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
          <div>
            {/* Header: Step Badge + Title */}
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center rounded-full bg-teal-50 dark:bg-teal-950/50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/40">
                STEP 03
              </span>
              <h3 className="text-sm font-bold text-foreground">Upload Cover Image</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 mb-4">
              High-resolution book cover
            </p>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setCoverFile(f);
              }}
            />

            {/* Dashed Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragCard3(true);
              }}
              onDragLeave={() => setDragCard3(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragCard3(false);
                const dropped = e.dataTransfer.files[0];
                if (dropped) setCoverFile(dropped);
              }}
              className={`rounded-2xl border border-dashed p-6 sm:p-7 flex flex-col items-center justify-center text-center transition-all min-h-[220px] ${
                dragCard3
                  ? "border-teal-500 bg-teal-50/20 scale-[1.01]"
                  : coverFile
                    ? "border-teal-300/80 dark:border-teal-800/60 bg-secondary/15"
                    : "border-teal-200/90 dark:border-teal-800/60 bg-transparent hover:border-teal-400 hover:bg-secondary/10"
              }`}
            >
              {coverFile ? (
                <div className="flex flex-col items-center">
                  <img
                    src={URL.createObjectURL(coverFile)}
                    alt="Cover preview"
                    className="h-28 w-20 rounded-lg object-cover shadow-md ring-1 ring-black/10"
                  />
                  <p className="truncate max-w-[200px] text-xs font-bold text-foreground mt-2">
                    {coverFile.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {(coverFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="inline-flex h-8 items-center rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverFile(null)}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="Remove cover"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 mb-3 shadow-2xs">
                    <ImageIcon size={22} strokeWidth={1.75} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground mb-1">
                    Drag &amp; drop file here
                  </p>
                  <span className="text-[11px] text-muted-foreground mb-3 font-normal">or</span>
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="h-10 w-full max-w-[220px] rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-secondary dark:hover:bg-secondary/80 text-foreground font-semibold text-xs flex items-center justify-center gap-2 border border-slate-200/70 dark:border-border transition-colors cursor-pointer shadow-2xs"
                  >
                    <Upload size={14} className="text-muted-foreground" />
                    <span>Upload Cover Image</span>
                  </button>
                  <span className="text-[11px] text-muted-foreground mt-3 font-medium">
                    JPEG &bull; PNG &bull; Max 5 MB
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    438 &times; 678 px recommended
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Optional: Auto-generate Cover controls if eBook is uploaded */}
          {ebookFile && onGenerateCover && (
            <div className="mt-4 flex items-center gap-2">
              {setSelectedCoverPage && (
                <div className="relative w-24">
                  <select
                    value={selectedCoverPage}
                    onChange={(e) => setSelectedCoverPage(Number(e.target.value))}
                    disabled={isGeneratingCover}
                    className="h-10 w-full appearance-none rounded-xl border border-border bg-card px-2.5 pr-7 text-xs font-semibold text-foreground outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value={1}>Page 1</option>
                    <option value={2}>Page 2</option>
                    <option value={3}>Page 3</option>
                  </select>
                </div>
              )}
              <button
                type="button"
                onClick={onGenerateCover}
                disabled={isGeneratingCover}
                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 px-2.5 text-xs font-bold text-teal-700 dark:text-teal-300 shadow-2xs hover:bg-teal-500/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {isGeneratingCover ? (
                  <Loader2 size={13} className="animate-spin text-teal-600" />
                ) : (
                  <Sparkles size={13} className="text-teal-600" />
                )}
                <span>{isGeneratingCover ? "Generating..." : "Generate Cover"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── RED WARNING ALERT BOX ────────────────────────────────────────── */}
      <div className="flex items-start gap-3 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 p-4 sm:p-5 text-xs text-rose-600 dark:text-rose-400 leading-relaxed shadow-2xs">
        <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
        <p>
          PixelBooks&apos; auto content generation API uses automated parsing to extract and autofill
          metadata from your eBook files (ePub &amp; PDF). Because automated extraction is
          inherently subject to inaccuracies, some data may be incomplete, malformatted, or
          incorrectly assigned depending on the structure and quality of the source file. You are
          solely responsible for reviewing and verifying all auto-populated information. Please
          ensure that all generated metadata is manually reviewed and verified before publishing.
          If you prefer, you may disable this option and enter all details manually.
        </p>
      </div>

      {/* ── AUTOFILL CHECKBOX ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 pt-1">
        <label
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => setAutofill(!autofill)}
        >
          <div
            className={`flex h-4.5 w-4.5 items-center justify-center rounded-md border transition-colors ${
              autofill
                ? "border-teal-600 bg-teal-600 text-white"
                : "border-slate-300 dark:border-border bg-card"
            }`}
          >
            {autofill && <Check size={13} strokeWidth={3} />}
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-foreground">
            Autofill metadata from eBook
          </span>
        </label>
      </div>
    </div>
  );
}
