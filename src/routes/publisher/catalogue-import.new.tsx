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

function InstructionSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
      >
        {number}
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <div className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">{children}</div>
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
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [uploadStage, setUploadStage] = useState<"uploading" | "done">("uploading");
  const [uploadOrder, setUploadOrder] = useState<string[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pickMediaFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list) return;
    const added: PickedFile[] = [];
    for (const f of Array.from(list)) {
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
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      const target = prev[index];
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, idx) => idx !== index);
    });
  }

  const uploadItems = useMemo(() => buildUploadItems(files), [files]);

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
    return (
      <AppShell title="Catalogue Import" subtitle="Uploading your eBook metadata and matching media files.">
        <div className="space-y-6 p-4 md:p-8">
          <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
            <div className="mb-5 flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Upload files</h2>
                <p className="text-xs text-muted-foreground">
                  ({totalFiles} file{totalFiles !== 1 ? "s" : ""} selected - {totalEbooks} eBook
                  {totalEbooks !== 1 ? "s" : ""} selected)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pr-4 font-semibold">Title</th>
                    <th className="pb-3 px-4 font-semibold">File Name</th>
                    <th className="pb-3 px-4 font-semibold">File Type</th>
                    <th className="pb-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {uploadItems.map((item) => {
                    const docExt = item.doc?.name.split(".").pop()?.toUpperCase() ?? "";
                    const progress = progressMap[item.key] ?? 0;
                    const status: "PENDING" | "UPLOADING" | "COMPLETED" =
                      uploadStage === "done" ? "COMPLETED" : progress > 0 ? "UPLOADING" : "PENDING";
                    return (
                      <tr key={item.key} className="transition-colors hover:bg-secondary/20">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md text-[9px] font-bold text-white shadow-sm"
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
                            <span className="font-medium text-foreground">{item.title}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">{item.doc?.name ?? "—"}</td>
                        <td className="py-3.5 px-4">
                          {docExt && <span className="text-xs font-semibold text-rose-500">{docExt}</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
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
                              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-500">
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
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Back
            </button>

            {uploadStage === "done" && (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                Next
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
        {/* Back Link */}
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

        {/* BOX 1: Import Guidelines & Instructions (Collapsible) */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-5">
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
                    eBook Catalogue Import – Step-by-Step Instructions
                  </h2>
                  <span className="text-muted-foreground">
                    {instructionsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {instructionsOpen ? "Click header to collapse instructions" : "Click header to expand step-by-step instructions"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
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
                className="inline-flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-semibold shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                <Download size={15} strokeWidth={2.4} />
                Download Metadata
              </button>
            </div>
          </div>

          {instructionsOpen && (
            <div className="space-y-6 pt-1">
              <InstructionSection number="1" title="Download Metadata">
                <p>Click the download button to download metadata template.</p>
                <p>Metadata will be in an Excel file (.xlsx).</p>
              </InstructionSection>

              <InstructionSection number="2" title="Upload Multiple Files">
                <p>
                  Start by selecting multiple eBooks (PDF, ePub) and Cover images (JPG, PNG) to upload.
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Click{" "}
                    <span className="font-medium text-foreground">"Choose Multiple Files to Upload"</span>
                  </li>
                  <li>
                    Supported formats:{" "}
                    <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">.pdf</code>,{" "}
                    <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">.epub</code>,{" "}
                    <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">.jpg</code>,{" "}
                    <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">.png</code>
                  </li>
                </ul>
                <div
                  className="mt-2 rounded-md border-l-4 p-3 text-xs"
                  style={{
                    borderColor: "var(--brand)",
                    backgroundColor: "var(--sidebar-highlight)",
                    color: "var(--foreground)",
                  }}
                >
                  <strong>Important:</strong> Each document (PDF/ePub) and its corresponding image
                  (JPG/PNG) must have the exact same file name.
                  <br />
                  Example: <code>book1.pdf</code> → <code>book1.jpg</code>
                </div>
              </InstructionSection>

              <InstructionSection number="3" title="View Uploaded Files">
                <p>After selecting files, they appear in a list.</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Preview file details like name, type, and size</li>
                  <li>
                    Remove individual files if needed by clicking the remove button next to each file
                  </li>
                  <li>
                    Click <span className="font-medium text-foreground">"Add More Files"</span> to include
                    additional items
                  </li>
                </ul>
              </InstructionSection>

              <InstructionSection number="4" title="Upload Excel File">
                <p>For bulk metadata import, upload an Excel sheet.</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Click{" "}
                    <span className="font-medium text-foreground">"Choose Excel File to Upload"</span>
                  </li>
                  <li>Make sure the file follows the required format</li>
                  <li>Click upload and submit</li>
                </ul>
              </InstructionSection>

              <InstructionSection number="5" title="Upload Complete">
                <p>Your files will begin uploading.</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>A progress bar will indicate the upload percentage</li>
                  <li>
                    You'll see a{" "}
                    <span className="font-medium text-foreground">"Successfully Uploaded"</span> message
                  </li>
                  <li>Files will be imported and sent for approval</li>
                  <li>A notification will be sent once approved</li>
                </ul>
              </InstructionSection>

              <InstructionSection number="6" title="Handle Failed Uploads">
                <p>
                  If any files fail to upload (due to a network interruption, server timeout, file
                  corruption, or similar issue):
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    A <span className="font-medium text-foreground">"Failed Files"</span> dialog will
                    appear
                  </li>
                  <li>
                    The reason for the failure will be displayed (e.g., "File name exceeds maximum length
                    allowed" or "Network connection lost")
                  </li>
                  <li>
                    You must re-upload the entire file from the beginning — incomplete uploads cannot be
                    processed or stored by the system
                  </li>
                  <li>
                    Click <span className="font-medium text-foreground">"Cancel"</span> to resolve the
                    issue and start the upload again
                  </li>
                </ul>
              </InstructionSection>
            </div>
          )}
        </div>

        {/* BOX 2: Upload Metadata Spreadsheet */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-4">
          <div className="flex flex-col gap-2 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)] font-bold text-sm">
                2
              </span>
              <div>
                <h2 className="text-base font-semibold text-foreground">Upload Metadata Spreadsheet</h2>
                <p className="text-xs text-muted-foreground">Select the completed Excel (.xlsx) metadata file</p>
              </div>
            </div>

            {excel && (
              <span className="text-xs font-semibold text-[var(--brand)] bg-[var(--sidebar-highlight)] px-3 py-1.5 rounded-lg self-start sm:self-auto">
                1 file selected
              </span>
            )}
          </div>

          <div className="space-y-3">
            <label
              className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/30 px-4 py-3 transition-colors hover:border-[var(--brand)] hover:bg-secondary/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <FileSpreadsheet size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {excel ? "Replace Excel File" : "Choose Excel File to Upload"}
                </p>
                <p className="text-xs text-muted-foreground">Supported: .xlsx</p>
              </div>
              <span className="shrink-0 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground">
                Browse
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
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                      <FileSpreadsheet size={18} />
                    </div>
                    <div>
                      <p className="max-w-[200px] truncate text-sm font-medium text-foreground sm:max-w-[300px]" title={excel.name}>
                        {excel.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{humanSize(excel.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setExcel(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOX 3: Upload Media Files */}
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
              <span className="text-xs font-semibold text-[var(--brand)] bg-[var(--sidebar-highlight)] px-3 py-1.5 rounded-lg self-start sm:self-auto">
                {files.length} file{files.length !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>

          <div className="space-y-3">
            <label
              className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/30 px-4 py-3 transition-colors hover:border-[var(--brand)] hover:bg-secondary/50"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "var(--sidebar-highlight)" }}
              >
                <Upload size={18} style={{ color: "var(--brand)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">Choose Multiple Files to Upload</p>
                <p className="text-xs text-muted-foreground">Supported: .pdf, .epub, .jpg, .jpeg, .png</p>
              </div>
              <span className="shrink-0 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground">
                Browse
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

            {files.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Selected Files ({files.length})
                  </p>
                  <button
                    type="button"
                    onClick={() => mediaInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:underline"
                    style={{ color: "var(--brand)" }}
                  >
                    <Plus size={14} /> Add More Files
                  </button>
                </div>
                <ul className="divide-y divide-border max-h-64 overflow-y-auto">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                        style={{ backgroundColor: "var(--sidebar-highlight)" }}
                      >
                        {f.kind === "image" && f.previewUrl ? (
                          <img src={f.previewUrl} alt={f.name} className="h-full w-full object-cover" />
                        ) : f.kind === "image" ? (
                          <ImageIcon size={17} style={{ color: "var(--brand)" }} />
                        ) : (
                          <FileText size={17} style={{ color: "var(--brand)" }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">{f.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {f.kind === "image" ? "Cover image" : "Document"} · {humanSize(f.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        aria-label={`Remove ${f.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* BOX 4: Submit Import */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-5">
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)] font-bold text-sm">
                4
              </span>
              <div>
                <h2 className="text-base font-semibold text-foreground">Submit Import</h2>
                <p className="text-xs text-muted-foreground">Review and submit your catalogue import</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Summary Box & Submit CTA (5 cols) */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-secondary/10 p-5 space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                  Import Summary
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Media Files:</span>
                    <span className="font-semibold text-foreground">
                      {files.length > 0 ? `${files.length} Files` : "None selected"}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Metadata Spreadsheet:</span>
                    <span className="font-semibold text-foreground truncate max-w-[170px]">
                      {excel ? excel.name : "Not selected"}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground pt-2 border-t border-border/50">
                    <span>Status:</span>
                    <span className="font-semibold text-foreground">
                      {isValid ? "Ready to Submit" : "Incomplete"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!isValid}
                  className="w-full flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-xs transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  <CheckCircle2 size={18} />
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
          </div>
        </div>
      </div>

      {/* Confirm Upload & Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">Upload & Submit Catalogue Import?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You're about to upload {files.length} media file{files.length !== 1 ? "s" : ""} and submit this
              catalogue import for admin approval. This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={openUploadFlow}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-5 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
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

