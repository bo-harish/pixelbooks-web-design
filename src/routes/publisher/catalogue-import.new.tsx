import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Plus,
  Check,
  CheckCircle2,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  FileCheck,
  AlertCircle,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/publisher/catalogue-import/new")({
  head: () => ({
    meta: [
      { title: "New Catalogue Import — PixelBooks" },
      { name: "description", content: "Bulk-upload eBook metadata spreadsheet and media files on a single page." },
    ],
  }),
  component: NewCatalogueImportPage,
});

type PickedFile = { name: string; size: number; kind: "doc" | "image"; previewUrl?: string };

function humanSize(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function baseKey(name: string) {
  return name.replace(/\.[^/.]+$/, "").toLowerCase().trim();
}

type UploadItem = { key: string; title: string; doc?: PickedFile; image?: PickedFile };

// Groups selected doc + matching cover image into a single eBook row
function buildUploadItems(files: PickedFile[]): UploadItem[] {
  const map = new Map<string, UploadItem>();
  for (const f of files) {
    const key = baseKey(f.name);
    if (!map.has(key)) map.set(key, { key, title: key, doc: undefined, image: undefined });
    const item = map.get(key)!;
    if (f.kind === "image") item.image = f;
    else item.doc = f;
  }
  return Array.from(map.values());
}

function InstructionStepCard({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3.5 rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-[var(--brand)]/30 hover:shadow-2xs">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-2xs"
        style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
      >
        {number}
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <div className="space-y-1 text-xs leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export function NewCatalogueImportPage() {
  const navigate = useNavigate();
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [excel, setExcel] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "docs" | "covers">("all");
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [uploadStage, setUploadStage] = useState<"uploading" | "done">("uploading");
  const [uploadOrder, setUploadOrder] = useState<string[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [isDraggingExcel, setIsDraggingExcel] = useState(false);
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAddMediaFiles(fileList: FileList | File[]) {
    const added: PickedFile[] = [];
    for (const f of Array.from(fileList)) {
      const ext = f.name.split(".").pop()?.toLowerCase();
      const kind: PickedFile["kind"] =
        ext === "jpg" || ext === "jpeg" || ext === "png" ? "image" : "doc";
      added.push({
        name: f.name,
        size: f.size,
        kind,
        previewUrl: kind === "image" ? URL.createObjectURL(f) : undefined,
      });
    }
    setFiles((prev) => [...prev, ...added]);
  }

  function pickMediaFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleAddMediaFiles(e.target.files);
      e.target.value = "";
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      const target = prev[index];
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, idx) => idx !== index);
    });
  }

  const uploadItems = useMemo(() => buildUploadItems(files), [files]);

  const docsCount = useMemo(() => files.filter((f) => f.kind === "doc").length, [files]);
  const imagesCount = useMemo(() => files.filter((f) => f.kind === "image").length, [files]);
  const pairedCount = useMemo(
    () => uploadItems.filter((item) => item.doc && item.image).length,
    [uploadItems]
  );

  const filteredFiles = useMemo(() => {
    if (activeTab === "docs") return files.filter((f) => f.kind === "doc");
    if (activeTab === "covers") return files.filter((f) => f.kind === "image");
    return files;
  }, [files, activeTab]);

  function openUploadFlow() {
    setShowConfirmModal(false);
    setShowUploadFlow(true);
    setProgressMap({});
    setUploadOrder(uploadItems.map((item) => item.key));
    setUploadStage("uploading");
  }

  function handleFinish() {
    navigate({ to: "/publisher/catalogue-import" });
  }

  // Simulates sequential per-eBook upload progress
  useEffect(() => {
    if (uploadStage !== "uploading" || uploadOrder.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const key of uploadOrder) {
        for (let p = 20; p <= 100; p += 20) {
          await new Promise((resolve) => setTimeout(resolve, 140));
          if (cancelled) return;
          setProgressMap((prev) => ({ ...prev, [key]: p }));
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (!cancelled) setUploadStage("done");
    })();
    return () => {
      cancelled = true;
    };
  }, [uploadStage, uploadOrder]);

  const isValid = files.length > 0 && excel !== null;

  if (showUploadFlow) {
    const totalFiles = files.length;
    const totalEbooks = uploadItems.length;
    const overallProgress =
      uploadStage === "done"
        ? 100
        : Math.round(
            (Object.values(progressMap).reduce((a, b) => a + b, 0) / (totalEbooks * 100)) * 100
          ) || 0;

    return (
      <AppShell title="Catalogue Import" subtitle="Uploading your eBook metadata and matching media files.">
        <div className="space-y-6 p-4 md:p-8">
          <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-6">
            <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Importing Catalogue Files</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {totalFiles} file{totalFiles !== 1 ? "s" : ""} across {totalEbooks} eBook
                  {totalEbooks !== 1 ? "s" : ""} selected
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-foreground">
                    {uploadStage === "done" ? "Upload Completed" : `Uploading... ${overallProgress}%`}
                  </span>
                  <div className="mt-1 h-2 w-36 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${overallProgress}%`,
                        backgroundColor: "var(--brand)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-4 font-semibold">eBook Title / Key</th>
                    <th className="py-3 px-4 font-semibold">Document File</th>
                    <th className="py-3 px-4 font-semibold">Cover Image</th>
                    <th className="py-3 px-4 font-semibold text-right">Upload Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card">
                  {uploadItems.map((item) => {
                    const docExt = item.doc?.name.split(".").pop()?.toUpperCase() ?? "";
                    const progress = progressMap[item.key] ?? 0;
                    const status: "PENDING" | "UPLOADING" | "COMPLETED" =
                      uploadStage === "done" ? "COMPLETED" : progress > 0 ? "UPLOADING" : "PENDING";
                    return (
                      <tr key={item.key} className="transition-colors hover:bg-secondary/20">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md text-[9px] font-bold text-white shadow-xs"
                              style={{ backgroundColor: "var(--sidebar-highlight)" }}
                            >
                              {item.image?.previewUrl ? (
                                <img
                                  src={item.image.previewUrl}
                                  alt={item.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ImageIcon size={16} style={{ color: "var(--brand)" }} />
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">{item.title}</span>
                              <p className="text-[11px] text-muted-foreground">
                                {item.doc && item.image
                                  ? "Document & Cover Attached"
                                  : item.doc
                                    ? "Document Attached"
                                    : "Cover Image Only"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {item.doc ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
                                {docExt}
                              </span>
                              <span className="text-xs text-foreground truncate max-w-[180px]">
                                {item.doc.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-amber-500">Missing doc</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {item.image ? (
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                              {item.image.name.split(".").pop()?.toUpperCase()}
                            </span>
                          ) : (
                            <span className="text-xs text-amber-500">No cover image</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <span
                              className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                                status === "COMPLETED"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : status === "UPLOADING"
                                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                                    : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {status}
                            </span>
                            {status === "COMPLETED" ? (
                              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-500 bg-emerald-500/10">
                                <Check size={15} strokeWidth={3} />
                              </span>
                            ) : (
                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-semibold ${
                                  status === "UPLOADING"
                                    ? "border-emerald-500 text-foreground"
                                    : "border-border text-muted-foreground"
                                }`}
                              >
                                {progress}%
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowUploadFlow(false)}
              disabled={uploadStage === "uploading"}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-6 text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Back
            </button>

            {uploadStage === "done" && (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-xs font-semibold shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                Complete Import
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Catalogue Import" subtitle="Bulk-upload your eBook metadata via spreadsheet and matching media files.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/publisher/catalogue-import"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Back to imports"
            >
              <ArrowLeft size={16} />
            </Link>
            <span className="text-sm font-normal text-foreground">Back to imports</span>
          </div>

          {/* Top Progress Stepper */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-[var(--brand)] font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--sidebar-highlight)] text-[11px]">1</span>
              Guidelines
            </span>
            <span className="text-muted-foreground">/</span>
            <span className={`flex items-center gap-1.5 ${excel || files.length > 0 ? "text-[var(--brand)] font-semibold" : "text-muted-foreground"}`}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[11px]">2</span>
              Upload Files
            </span>
            <span className="text-muted-foreground">/</span>
            <span className={`flex items-center gap-1.5 ${isValid ? "text-[var(--brand)] font-semibold" : "text-muted-foreground"}`}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[11px]">3</span>
              Review & Submit
            </span>
          </div>
        </div>

        {/* Workspace 2-Column Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Area (8 Cols) */}
          <div className="space-y-6 lg:col-span-8">
            {/* BOX 1: Step 1 - Import Guidelines & Instructions */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-4">
              <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div
                  onClick={() => setInstructionsOpen(!instructionsOpen)}
                  className="flex cursor-pointer items-center gap-3 select-none"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)] font-bold text-sm">
                    1
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-foreground">
                        Step-by-Step Import Instructions
                      </h2>
                      <span className="text-muted-foreground">
                        {instructionsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {instructionsOpen
                        ? "Click to collapse instructions"
                        : "Click to expand step-by-step metadata & file guidelines"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setInstructionsOpen(!instructionsOpen)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                  >
                    {instructionsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    {instructionsOpen ? "Hide Instructions" : "Show Instructions"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-xs font-semibold shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                  >
                    <Download size={15} strokeWidth={2.4} />
                    Download Excel Template
                  </button>
                </div>
              </div>

              {instructionsOpen && (
                <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                  <InstructionStepCard number="1" title="Download Excel Template">
                    <p>Click "Download Excel Template" to get the standard bulk metadata structure.</p>
                    <p className="font-semibold text-foreground mt-1">Format: Excel Spreadsheet (.xlsx)</p>
                  </InstructionStepCard>

                  <InstructionStepCard number="2" title="Prepare Media Files">
                    <p>Organize eBook documents and cover graphics before uploading.</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-foreground">.pdf</span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-foreground">.epub</span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-foreground">.jpg</span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-foreground">.png</span>
                    </div>
                  </InstructionStepCard>

                  <InstructionStepCard number="3" title="Filename Naming Rule">
                    <p>
                      Each document and its cover image <span className="font-semibold text-foreground">must have identical base file names</span> to auto-pair.
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-[var(--brand)]">
                      e.g., book1.pdf ↔ book1.jpg
                    </p>
                  </InstructionStepCard>

                  <InstructionStepCard number="4" title="Upload & Validate">
                    <p>Select your completed Excel sheet and drop all matching media files.</p>
                    <p className="mt-1">The system auto-correlates documents with covers.</p>
                  </InstructionStepCard>

                  <InstructionStepCard number="5" title="Review & Submit">
                    <p>Check the pre-flight import summary checklist on the right.</p>
                    <p className="mt-1">Click "Upload & Submit Catalogue Import" to send for review.</p>
                  </InstructionStepCard>

                  <InstructionStepCard number="6" title="Approval Notification">
                    <p>Once submitted, files undergo system parsing and approval.</p>
                    <p className="mt-1">You will receive an alert once books are live in catalogue.</p>
                  </InstructionStepCard>
                </div>
              )}
            </div>

            {/* BOX 2: Step 2 - Upload Metadata Spreadsheet */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-4">
              <div className="flex flex-col gap-2 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)] font-bold text-sm">
                    2
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Upload Metadata Spreadsheet</h2>
                    <p className="text-xs text-muted-foreground">Select or drop your completed Excel (.xlsx) file</p>
                  </div>
                </div>

                {excel && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg self-start sm:self-auto">
                    <CheckCircle2 size={14} /> 1 Spreadsheet Selected
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingExcel(true);
                  }}
                  onDragLeave={() => setIsDraggingExcel(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingExcel(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      const dropped = e.dataTransfer.files[0];
                      if (dropped.name.endsWith(".xlsx")) {
                        setExcel(dropped);
                      }
                    }
                  }}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                    isDraggingExcel
                      ? "border-[var(--brand)] bg-[var(--sidebar-highlight)]"
                      : "border-border bg-secondary/20 hover:border-[var(--brand)]/60 hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                    <FileSpreadsheet size={22} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {excel ? "Replace Metadata Excel Spreadsheet" : "Click to Browse or Drag & Drop Excel File"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Supports: Microsoft Excel (.xlsx)</p>
                  <span className="mt-3 inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs">
                    Browse File
                  </span>
                  <input
                    ref={excelInputRef}
                    type="file"
                    accept=".xlsx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setExcel(e.target.files[0]);
                      }
                    }}
                  />
                </label>

                {excel && (
                  <div className="overflow-hidden rounded-xl border border-border bg-card p-4 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                        <FileSpreadsheet size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground" title={excel.name}>
                          {excel.name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{humanSize(excel.size)}</span>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Valid Metadata File</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => excelInputRef.current?.click()}
                        className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground px-2 py-1"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => setExcel(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        title="Remove Excel File"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BOX 3: Step 3 - Upload Media Files */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-4">
              <div className="flex flex-col gap-2 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)] font-bold text-sm">
                    3
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Upload Media Files</h2>
                    <p className="text-xs text-muted-foreground">Select eBooks (PDF, ePub) and matching cover images (JPG, PNG)</p>
                  </div>
                </div>

                {files.length > 0 && (
                  <span className="text-xs font-semibold text-[var(--brand)] bg-[var(--sidebar-highlight)] border border-[var(--brand)]/20 px-3 py-1 rounded-lg self-start sm:self-auto">
                    {files.length} file{files.length !== 1 ? "s" : ""} selected ({pairedCount} paired)
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingMedia(true);
                  }}
                  onDragLeave={() => setIsDraggingMedia(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingMedia(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleAddMediaFiles(e.dataTransfer.files);
                    }
                  }}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                    isDraggingMedia
                      ? "border-[var(--brand)] bg-[var(--sidebar-highlight)]"
                      : "border-border bg-secondary/20 hover:border-[var(--brand)]/60 hover:bg-secondary/40"
                  }`}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl mb-2"
                    style={{ backgroundColor: "var(--sidebar-highlight)" }}
                  >
                    <Upload size={22} style={{ color: "var(--brand)" }} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    Click to Browse or Drag & Drop eBooks & Covers
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported: .pdf, .epub, .jpg, .jpeg, .png
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs">
                    Choose Multiple Files
                  </span>
                  <input
                    ref={mediaInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.epub,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={pickMediaFiles}
                  />
                </label>

                {/* Selected Media Files Matrix & List */}
                {files.length > 0 && (
                  <div className="overflow-hidden rounded-xl border border-border bg-card space-y-3">
                    {/* Toolbar Header & Filters */}
                    <div className="flex flex-col gap-2 border-b border-border bg-secondary/30 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveTab("all")}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                            activeTab === "all"
                              ? "bg-card text-foreground border border-border shadow-2xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          All Files ({files.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("docs")}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                            activeTab === "docs"
                              ? "bg-card text-foreground border border-border shadow-2xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Documents ({docsCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("covers")}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                            activeTab === "covers"
                              ? "bg-card text-foreground border border-border shadow-2xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Covers ({imagesCount})
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => mediaInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:underline self-start sm:self-auto"
                        style={{ color: "var(--brand)" }}
                      >
                        <Plus size={14} /> Add More Files
                      </button>
                    </div>

                    {/* Auto-Paired eBooks Grid Cards */}
                    {activeTab === "all" && uploadItems.length > 0 && (
                      <div className="px-3.5 pt-1 pb-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Auto-Paired eBooks Preview ({uploadItems.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {uploadItems.map((item) => {
                            const isPaired = item.doc && item.image;
                            return (
                              <div
                                key={item.key}
                                className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-[var(--brand)]/40"
                              >
                                <div
                                  className="flex h-11 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md text-[9px] font-bold text-white shadow-2xs"
                                  style={{ backgroundColor: "var(--sidebar-highlight)" }}
                                >
                                  {item.image?.previewUrl ? (
                                    <img
                                      src={item.image.previewUrl}
                                      alt={item.title}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <ImageIcon size={15} style={{ color: "var(--brand)" }} />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-semibold text-foreground" title={item.title}>
                                    {item.title}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                    {item.doc ? (
                                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Doc attached</span>
                                    ) : (
                                      <span className="text-amber-500 font-medium">Missing doc</span>
                                    )}
                                    <span>•</span>
                                    {item.image ? (
                                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Cover attached</span>
                                    ) : (
                                      <span className="text-amber-500 font-medium">No cover</span>
                                    )}
                                  </p>
                                </div>
                                <div>
                                  {isPaired ? (
                                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                      <Check size={11} /> Paired
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                                      Single File
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Detailed File List */}
                    <div className="border-t border-border">
                      <p className="px-3.5 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Selected Files ({filteredFiles.length})
                      </p>
                      <ul className="divide-y divide-border/60 max-h-60 overflow-y-auto">
                        {filteredFiles.map((f, i) => (
                          <li key={i} className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-secondary/20 transition-colors">
                            <div
                              className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                              style={{ backgroundColor: "var(--sidebar-highlight)" }}
                            >
                              {f.kind === "image" && f.previewUrl ? (
                                <img src={f.previewUrl} alt={f.name} className="h-full w-full object-cover" />
                              ) : f.kind === "image" ? (
                                <ImageIcon size={15} style={{ color: "var(--brand)" }} />
                              ) : (
                                <FileText size={15} style={{ color: "var(--brand)" }} />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-foreground">{f.name}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {f.kind === "image" ? "Cover image" : "eBook Document"} · {humanSize(f.size)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(files.indexOf(f))}
                              aria-label={`Remove ${f.name}`}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-5">
              {/* Live Import Summary Card */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                      <Sparkles size={16} />
                    </span>
                    <h3 className="text-sm font-bold text-foreground">Import Summary</h3>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isValid
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {isValid ? "Ready" : "Pending Requirements"}
                  </span>
                </div>

                {/* Real-time Stats Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-lg border border-border/80 bg-secondary/20 p-3">
                    <p className="text-[11px] font-medium text-muted-foreground">Excel Metadata</p>
                    <p className="text-xs font-bold text-foreground mt-1 truncate">
                      {excel ? "Attached" : "Not Selected"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/80 bg-secondary/20 p-3">
                    <p className="text-[11px] font-medium text-muted-foreground">Total Files</p>
                    <p className="text-xs font-bold text-foreground mt-1">{files.length} Files</p>
                  </div>
                  <div className="rounded-lg border border-border/80 bg-secondary/20 p-3">
                    <p className="text-[11px] font-medium text-muted-foreground">Documents</p>
                    <p className="text-xs font-bold text-foreground mt-1">{docsCount} PDF/ePub</p>
                  </div>
                  <div className="rounded-lg border border-border/80 bg-secondary/20 p-3">
                    <p className="text-[11px] font-medium text-muted-foreground">Cover Images</p>
                    <p className="text-xs font-bold text-foreground mt-1">{imagesCount} JPG/PNG</p>
                  </div>
                </div>

                {/* Pre-Flight Checklist */}
                <div className="space-y-2 border-t border-border pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Pre-Flight Checklist
                  </p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      {excel ? (
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/40 shrink-0" />
                      )}
                      <span className={excel ? "text-foreground font-medium" : "text-muted-foreground"}>
                        Excel Metadata File (.xlsx)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {files.length > 0 ? (
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/40 shrink-0" />
                      )}
                      <span className={files.length > 0 ? "text-foreground font-medium" : "text-muted-foreground"}>
                        Media Files Attached
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {pairedCount > 0 ? (
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/40 shrink-0" />
                      )}
                      <span className={pairedCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}>
                        Filename Auto-Pairing ({pairedCount} paired)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Submit Action */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(true)}
                    disabled={!isValid}
                    className="w-full flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-semibold shadow-xs transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                  >
                    <CheckCircle2 size={16} />
                    Upload & Submit Catalogue Import
                  </button>

                  {!excel && (
                    <p className="text-center text-[11px] text-amber-600 dark:text-amber-400">
                      * Please select an Excel file to enable submit
                    </p>
                  )}
                  {excel && files.length === 0 && (
                    <p className="text-center text-[11px] text-amber-600 dark:text-amber-400">
                      * Please select at least one media file (.pdf, .epub, .jpg, .png)
                    </p>
                  )}
                </div>
              </div>

              {/* Guidelines Tip Box */}
              <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <HelpCircle size={15} className="text-[var(--brand)]" />
                  <span>File Naming Best Practices</span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                  Keep document filenames concise without special characters. Ensure matching cover images use the exact same filename prefix (e.g., <code className="text-foreground font-medium">physics_vol1.pdf</code> and <code className="text-foreground font-medium">physics_vol1.jpg</code>).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Upload & Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <FileCheck size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Confirm Catalogue Import</h3>
                <p className="text-xs text-muted-foreground">Ready to submit files for system verification</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              You are about to upload <span className="font-semibold text-foreground">{files.length} media file{files.length !== 1 ? "s" : ""}</span> and <span className="font-semibold text-foreground">1 metadata spreadsheet</span> ({excel?.name}) for admin approval.
            </p>

            <div className="rounded-xl border border-border bg-secondary/20 p-3 space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Total eBook Entries:</span>
                <span className="font-semibold text-foreground">{uploadItems.length}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Fully Paired eBooks:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{pairedCount}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={openUploadFlow}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-5 text-xs font-semibold shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                <CheckCircle2 size={15} />
                Confirm & Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
