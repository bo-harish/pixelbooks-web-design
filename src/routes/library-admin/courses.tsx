import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Upload,
  Download,
  Trash2,
  X,
  ChevronDown,
  Check,
  GraduationCap,
  Layers,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/library-admin/courses")({
  component: LibraryAdminCoursesPage,
});

interface BatchItem {
  id: string;
  title: string;
  subtext: string;
  isActive: boolean;
}

interface CourseItem {
  id: string;
  title: string;
  isActive: boolean;
}

const INITIAL_BATCHES: BatchItem[] = [
  { id: "b1", title: "MSC", subtext: "2025", isActive: true },
  { id: "b2", title: "2026", subtext: "001", isActive: true },
  { id: "b3", title: "NEET", subtext: "Online A", isActive: true },
  { id: "b4", title: "BSc Agriculture", subtext: "March 2025", isActive: true },
  { id: "b5", title: "BSc C", subtext: "Aug 2025 - Aug 2029", isActive: true },
  { id: "b6", title: "BSc C", subtext: "Aug 2024 to Aug 2028", isActive: true },
  { id: "b7", title: "BSc Agriculturev", subtext: "March 2019", isActive: false },
];

const INITIAL_COURSES: CourseItem[] = [
  { id: "c1", title: "MSC", isActive: true },
  { id: "c2", title: "2026", isActive: true },
  { id: "c3", title: "NEET", isActive: true },
  { id: "c4", title: "BSc C", isActive: true },
  { id: "c5", title: "BSc Agriculture", isActive: true },
  { id: "c6", title: "BSc Agriculturev", isActive: false },
];

export function LibraryAdminCoursesPage() {
  // Tabs: "Batch" | "Available Courses"
  const [courseListSearchQuery, setCourseListSearchQuery] = useState("");
  const [batchListSearchQuery, setBatchListSearchQuery] = useState("");

  // Data states
  const [batches, setBatches] = useState<BatchItem[]>(INITIAL_BATCHES);
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);

  // Dialog states
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Form state for Add/Edit Course (Course Code removed)
  const [courseTitleInput, setCourseTitleInput] = useState("");
  const [courseTitles, setCourseTitles] = useState<string[]>([""]);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  // Form state for Add/Edit Batch
  const [batchTitleInput, setBatchTitleInput] = useState("");
  const [batchSubtextInput, setBatchSubtextInput] = useState("");
  const [batchSubtexts, setBatchSubtexts] = useState<string[]>([""]);
  const [editingBatch, setEditingBatch] = useState<BatchItem | null>(null);

  // Searchable course dropdown states in Batch Modal
  const [coursePopoverOpen, setCoursePopoverOpen] = useState(false);
  const [courseSearchQuery, setCourseSearchQuery] = useState("");

  // Delete confirmation state
  const [deletingItem, setDeletingItem] = useState<{
    type: "batch" | "course";
    id: string;
    name: string;
  } | null>(null);

  // Upload modal states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDragging, setUploadDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Filtered lists for main tables
  const filteredBatches = useMemo(() => {
    const q = batchListSearchQuery.toLowerCase().trim();
    if (!q) return batches;
    return batches.filter(
      (b) => b.title.toLowerCase().includes(q) || b.subtext.toLowerCase().includes(q),
    );
  }, [batches, batchListSearchQuery]);

  const filteredCourses = useMemo(() => {
    const q = courseListSearchQuery.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(q));
  }, [courses, courseListSearchQuery]);

  // Filtered courses for the Batch modal dropdown search
  const filteredCoursesForDropdown = useMemo(() => {
    const q = courseSearchQuery.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(q));
  }, [courses, courseSearchQuery]);

  // Handlers for Add/Edit Course
  const handleOpenAddCourse = () => {
    setCourseTitleInput("");
    setCourseTitles([""]);
    setEditingCourse(null);
    setIsAddCourseOpen(true);
  };

  const handleOpenEditCourse = (c: CourseItem) => {
    setEditingCourse(c);
    setCourseTitleInput(c.title);
    setCourseTitles([c.title]);
    setIsAddCourseOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCourse) {
      if (!courseTitleInput.trim()) {
        toast.error("Please enter a course title");
        return;
      }
      setCourses((prev) =>
        prev.map((item) =>
          item.id === editingCourse.id ? { ...item, title: courseTitleInput.trim() } : item,
        ),
      );
      toast.success(`Course "${courseTitleInput.trim()}" updated successfully!`);
    } else {
      const validTitles = courseTitles.map((t) => t.trim()).filter(Boolean);
      if (validTitles.length === 0) {
        toast.error("Please enter at least one course title");
        return;
      }
      const newCourses: CourseItem[] = validTitles.map((title, idx) => ({
        id: `c_${Date.now()}_${idx}`,
        title,
        isActive: true,
      }));
      setCourses((prev) => [...newCourses, ...prev]);
      toast.success(
        validTitles.length === 1
          ? `Course "${validTitles[0]}" created successfully!`
          : `Successfully created ${validTitles.length} courses!`,
      );
    }

    setIsAddCourseOpen(false);
    setEditingCourse(null);
  };

  const handleToggleCourseActive = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const nextState = !c.isActive;
          toast.success(`Course "${c.title}" is now ${nextState ? "Active" : "Inactive"}`);
          return { ...c, isActive: nextState };
        }
        return c;
      }),
    );
  };

  // Handlers for Add/Edit Batch
  const handleOpenAddBatch = () => {
    setBatchTitleInput("");
    setBatchSubtextInput("");
    setBatchSubtexts([""]);
    setEditingBatch(null);
    setCourseSearchQuery("");
    setIsAddBatchOpen(true);
  };

  const handleOpenEditBatch = (b: BatchItem) => {
    setEditingBatch(b);
    setBatchTitleInput(b.title);
    setBatchSubtextInput(b.subtext);
    setBatchSubtexts([b.subtext]);
    setCourseSearchQuery("");
    setIsAddBatchOpen(true);
  };

  const handleSaveBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchTitleInput.trim()) {
      toast.error("Please select or enter a course for the batch");
      return;
    }

    if (editingBatch) {
      const subtextVal = batchSubtexts[0]?.trim() || batchSubtextInput.trim();
      if (!subtextVal) {
        toast.error("Please enter batch details");
        return;
      }
      setBatches((prev) =>
        prev.map((item) =>
          item.id === editingBatch.id
            ? {
                ...item,
                title: batchTitleInput.trim(),
                subtext: subtextVal,
              }
            : item,
        ),
      );
      toast.success(`Batch "${batchTitleInput.trim()}" updated successfully!`);
    } else {
      const validSubtexts = batchSubtexts.map((s) => s.trim()).filter(Boolean);
      if (validSubtexts.length === 0) {
        toast.error("Please enter at least one batch name");
        return;
      }
      const newBatches: BatchItem[] = validSubtexts.map((subtext, idx) => ({
        id: `b_${Date.now()}_${idx}`,
        title: batchTitleInput.trim(),
        subtext,
        isActive: true,
      }));
      setBatches((prev) => [...newBatches, ...prev]);
      toast.success(
        validSubtexts.length === 1
          ? `Batch "${batchTitleInput.trim()} (${validSubtexts[0]})" created successfully!`
          : `Successfully created ${validSubtexts.length} batches for "${batchTitleInput.trim()}"!`,
      );
    }

    setIsAddBatchOpen(false);
    setEditingBatch(null);
  };

  const handleToggleBatchActive = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          const nextState = !b.isActive;
          toast.success(
            `Batch "${b.title} (${b.subtext})" is now ${nextState ? "Active" : "Inactive"}`,
          );
          return { ...b, isActive: nextState };
        }
        return b;
      }),
    );
  };

  // Delete Handler
  const ConfirmDelete = () => {
    if (!deletingItem) return;
    if (deletingItem.type === "batch") {
      setBatches((prev) => prev.filter((b) => b.id !== deletingItem.id));
      toast.success(`Batch "${deletingItem.name}" deleted successfully!`);
    } else {
      setCourses((prev) => prev.filter((c) => c.id !== deletingItem.id));
      toast.success(`Course "${deletingItem.name}" deleted successfully!`);
    }
    setDeletingItem(null);
  };

  // Drag and Drop for Upload Excel
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 20;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsImportOpen(false);
            setUploadFile(null);
            setUploadProgress(null);
            toast.success(
              `Excel file "${uploadFile.name}" imported successfully! Courses updated.`,
            );
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  return (
    <AppShell title="Courses">
      <div className="p-4 md:p-8 space-y-6">
        {/* Side-by-Side Dashboard Layout showing both datasets simultaneously */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Courses Available Card (Left) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-sm flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-[var(--brand)]" size={20} />
                  <h2 className="font-bold text-foreground text-sm sm:text-base">
                    Courses Available
                  </h2>
                  <span className="rounded-full bg-slate-100 dark:bg-secondary/40 text-slate-600 dark:text-muted-foreground text-xs font-semibold px-2 py-0.5">
                    {courses.length}
                  </span>
                </div>
                <button
                  onClick={handleOpenAddCourse}
                  className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-[var(--brand)] text-white px-2.5 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Course</span>
                </button>
              </div>

              {/* Course Search */}
              <label className="relative flex h-9 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full">
                <Search size={14} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={courseListSearchQuery}
                  onChange={(e) => setCourseListSearchQuery(e.target.value)}
                  className="w-full bg-transparent pl-2 text-xs outline-none text-foreground"
                />
                {courseListSearchQuery && (
                  <button
                    onClick={() => setCourseListSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                  >
                    <X size={12} />
                  </button>
                )}
              </label>

              {/* Course Table/List */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4 font-semibold">Course</th>
                      <th className="pb-3 px-3 font-semibold text-center w-20">Edit</th>
                      <th className="pb-3 px-3 font-semibold text-center w-16">Active</th>
                      <th className="pb-3 pl-3 font-semibold text-center w-16">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <GraduationCap size={32} className="text-muted-foreground/60" />
                            <p className="font-semibold text-sm">No courses found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((c) => (
                        <tr
                          key={c.id}
                          className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/25"
                        >
                          <td className="py-3 pr-4 font-medium text-foreground text-sm">
                            {c.title}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleOpenEditCourse(c)}
                              className="inline-flex h-7 items-center justify-center rounded-lg bg-[var(--brand)] text-white px-3 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                            >
                              Edit
                            </button>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex items-center justify-center">
                              <Switch
                                checked={c.isActive}
                                onCheckedChange={() => handleToggleCourseActive(c.id)}
                                className="data-[state=checked]:bg-[var(--brand)]"
                                aria-label={`Toggle active status for ${c.title}`}
                              />
                            </div>
                          </td>
                          <td className="py-3 pl-3 text-center">
                            <button
                              onClick={() =>
                                setDeletingItem({
                                  type: "course",
                                  id: c.id,
                                  name: c.title,
                                })
                              }
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Remove Course"
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
          </div>

          {/* Batches Card (Right) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-sm flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <Layers className="text-[var(--brand)]" size={20} />
                  <h2 className="font-bold text-foreground text-sm sm:text-base">Batches</h2>
                  <span className="rounded-full bg-slate-100 dark:bg-secondary/40 text-slate-600 dark:text-muted-foreground text-xs font-semibold px-2 py-0.5">
                    {batches.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddBatch}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-[var(--brand)] text-white px-2.5 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Batch</span>
                  </button>
                  <button
                    onClick={() => {
                      setUploadFile(null);
                      setUploadProgress(null);
                      setIsImportOpen(true);
                    }}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-border bg-white dark:bg-card text-foreground px-2.5 text-xs font-semibold hover:bg-secondary/40 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Download size={13} className="text-muted-foreground" />
                    <span>Import</span>
                  </button>
                </div>
              </div>

              {/* Batch Search */}
              <label className="relative flex h-9 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full">
                <Search size={14} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search batches..."
                  value={batchListSearchQuery}
                  onChange={(e) => setBatchListSearchQuery(e.target.value)}
                  className="w-full bg-transparent pl-2 text-xs outline-none text-foreground"
                />
                {batchListSearchQuery && (
                  <button
                    onClick={() => setBatchListSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                  >
                    <X size={12} />
                  </button>
                )}
              </label>

              {/* Batch Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4 font-semibold">Batch</th>
                      <th className="pb-3 px-3 font-semibold text-center w-20">Edit</th>
                      <th className="pb-3 px-3 font-semibold text-center w-16">Active</th>
                      <th className="pb-3 pl-3 font-semibold text-center w-16">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredBatches.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Layers size={32} className="text-muted-foreground/60" />
                            <p className="font-semibold text-sm">No batches found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBatches.map((b) => (
                        <tr
                          key={b.id}
                          className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/25"
                        >
                          <td className="py-3 pr-4">
                            <div>
                              <p className="font-semibold text-foreground text-sm">{b.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                                {b.subtext}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleOpenEditBatch(b)}
                              className="inline-flex h-7 items-center justify-center rounded-lg bg-[var(--brand)] text-white px-3 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                            >
                              Edit
                            </button>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex items-center justify-center">
                              <Switch
                                checked={b.isActive}
                                onCheckedChange={() => handleToggleBatchActive(b.id)}
                                className="data-[state=checked]:bg-[var(--brand)]"
                                aria-label={`Toggle active status for ${b.title} (${b.subtext})`}
                              />
                            </div>
                          </td>
                          <td className="py-3 pl-3 text-center">
                            <button
                              onClick={() =>
                                setDeletingItem({
                                  type: "batch",
                                  id: b.id,
                                  name: `${b.title} (${b.subtext})`,
                                })
                              }
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Remove Batch"
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
          </div>
        </div>

        {/* ----------------- IMPORT COURSE MODAL DIALOG ----------------- */}
        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="text-center space-y-1 mb-6">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Import Course
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Upload your course catalog via Excel template
              </DialogDescription>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-6">
              {/* Dropzone Container */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  uploadDragging
                    ? "border-[var(--brand)] bg-[var(--sidebar-highlight)]/30 scale-[1.01]"
                    : "border-slate-300 dark:border-border/80 bg-secondary/10 hover:bg-secondary/20"
                }`}
              >
                <input
                  type="file"
                  id="course-excel-input"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center gap-3">
                  {/* Cloud icon matching mockup screenshot 3 */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-20 w-20 text-slate-300 dark:text-muted-foreground/60"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m15 15-3-3-3 3" />
                  </svg>

                  <span className="font-semibold text-foreground text-sm">
                    {uploadFile ? uploadFile.name : "Browse Excel Files"}
                  </span>
                </div>
              </div>

              {/* Sample Excel File Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => toast.success("Sample Excel File downloaded successfully!")}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  Download Sample Excel File
                </button>
              </div>

              {/* Progress bar simulation */}
              {uploadProgress !== null && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Importing courses...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand)] transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons: Cancel and Upload */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportOpen(false)}
                  className="h-11 px-8 rounded-full border border-border bg-white dark:bg-card text-foreground font-semibold text-sm hover:bg-secondary/40 transition-all cursor-pointer shadow-sm min-w-32"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || uploadProgress !== null}
                  className={`h-11 px-8 rounded-full font-semibold text-sm transition-all cursor-pointer shadow-sm min-w-32 ${
                    uploadFile && uploadProgress === null
                      ? "bg-[var(--brand)] text-white hover:opacity-90"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-border dark:text-muted-foreground"
                  }`}
                >
                  Upload
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ----------------- ADD / EDIT COURSE DIALOG (Course Code Removed) ----------------- */}
        <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl">
            <div className="border-b border-border pb-3 mb-4">
              <DialogTitle className="text-lg font-bold text-foreground">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Enter course title for catalog listing
              </DialogDescription>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              {editingCourse ? (
                /* Single Course Title Edit Form */
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSc Agriculture"
                    value={courseTitleInput}
                    onChange={(e) => setCourseTitleInput(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                  />
                </div>
              ) : (
                /* Multiple Course Titles Add Form */
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-foreground block">
                    Course Titles *
                  </label>
                  <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 py-1">
                    {courseTitles.map((title, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          required={idx === 0}
                          placeholder={`e.g. Course Title ${idx + 1}`}
                          value={title}
                          onChange={(e) => {
                            const updated = [...courseTitles];
                            updated[idx] = e.target.value;
                            setCourseTitles(updated);
                          }}
                          className="h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                        />
                        {courseTitles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = courseTitles.filter((_, i) => i !== idx);
                              setCourseTitles(updated);
                            }}
                            className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove row"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCourseTitles((prev) => [...prev, ""])}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)] hover:underline mt-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    Add another course
                  </button>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddCourseOpen(false)}
                  className="h-9 px-4 rounded-lg border border-border bg-white dark:bg-card text-xs font-semibold text-foreground hover:bg-secondary/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold hover:opacity-90 cursor-pointer shadow-sm"
                >
                  {editingCourse
                    ? "Save Changes"
                    : courseTitles.length > 1
                      ? "Create Courses"
                      : "Create Course"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ----------------- ADD / EDIT BATCH DIALOG (Searchable Course Dropdown) ----------------- */}
        <Dialog open={isAddBatchOpen} onOpenChange={setIsAddBatchOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl">
            <div className="border-b border-border pb-3 mb-4">
              <DialogTitle className="text-lg font-bold text-foreground">
                {editingBatch ? "Edit Batch" : "Add New Batch"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Select a course and specify batch details
              </DialogDescription>
            </div>

            <form onSubmit={handleSaveBatch} className="space-y-4">
              {/* Searchable Course Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Select Course *</label>
                <Popover open={coursePopoverOpen} onOpenChange={setCoursePopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="h-10 w-full flex items-center justify-between rounded-lg border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)] text-left cursor-pointer"
                    >
                      <span
                        className={
                          batchTitleInput
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {batchTitleInput || "Search or select course..."}
                      </span>
                      <ChevronDown size={14} className="text-muted-foreground shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-[calc(100vw-3rem)] sm:w-[384px] p-2 bg-card border border-border shadow-lg rounded-xl space-y-2 z-[60]"
                  >
                    <div className="relative flex items-center rounded-lg border border-border bg-white dark:bg-card px-2.5 h-9">
                      <Search size={14} className="text-muted-foreground shrink-0" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={courseSearchQuery}
                        onChange={(e) => setCourseSearchQuery(e.target.value)}
                        className="w-full bg-transparent pl-2 text-xs outline-none text-foreground"
                        autoFocus
                      />
                      {courseSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setCourseSearchQuery("")}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                      {filteredCoursesForDropdown.length === 0 ? (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          No matching courses found.
                        </div>
                      ) : (
                        filteredCoursesForDropdown.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setBatchTitleInput(c.title);
                              setCoursePopoverOpen(false);
                              setCourseSearchQuery("");
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
                              batchTitleInput === c.title
                                ? "bg-[var(--sidebar-highlight)] text-[var(--brand)]"
                                : "hover:bg-secondary/60 text-foreground"
                            }`}
                          >
                            <span>{c.title}</span>
                            {batchTitleInput === c.title && (
                              <Check size={14} className="text-[var(--brand)] shrink-0" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Batch Input(s) */}
              {editingBatch ? (
                /* Single Batch Edit Form */
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Batch *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025 or March 2025 or Online A"
                    value={batchSubtextInput}
                    onChange={(e) => {
                      setBatchSubtextInput(e.target.value);
                      const updated = [...batchSubtexts];
                      updated[0] = e.target.value;
                      setBatchSubtexts(updated);
                    }}
                    className="h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                  />
                </div>
              ) : (
                /* Multiple Batches Add Form */
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-foreground block">Batches *</label>
                  <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1 py-1">
                    {batchSubtexts.map((subtext, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          required={idx === 0}
                          placeholder={`e.g. Batch ${idx + 1} (e.g. March 2025)`}
                          value={subtext}
                          onChange={(e) => {
                            const updated = [...batchSubtexts];
                            updated[idx] = e.target.value;
                            setBatchSubtexts(updated);
                          }}
                          className="h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                        />
                        {batchSubtexts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = batchSubtexts.filter((_, i) => i !== idx);
                              setBatchSubtexts(updated);
                            }}
                            className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove row"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setBatchSubtexts((prev) => [...prev, ""])}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)] hover:underline mt-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    Add another batch
                  </button>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddBatchOpen(false)}
                  className="h-9 px-4 rounded-lg border border-border bg-white dark:bg-card text-xs font-semibold text-foreground hover:bg-secondary/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold hover:opacity-90 cursor-pointer shadow-sm"
                >
                  {editingBatch
                    ? "Save Changes"
                    : batchSubtexts.length > 1
                      ? "Create Batches"
                      : "Create Batch"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ----------------- DELETE CONFIRMATION DIALOG ----------------- */}
        <Dialog open={deletingItem !== null} onOpenChange={() => setDeletingItem(null)}>
          <DialogContent className="max-w-sm bg-card border border-border rounded-2xl p-6 shadow-xl">
            <div className="text-center space-y-2 mb-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600">
                <Trash2 size={22} />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Remove {deletingItem?.type === "batch" ? "Batch" : "Course"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-foreground">"{deletingItem?.name}"</span>? This
                action cannot be undone.
              </DialogDescription>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="h-9 px-5 rounded-lg border border-border bg-white dark:bg-card text-xs font-semibold text-foreground hover:bg-secondary/40 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={ConfirmDelete}
                className="h-9 px-5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer shadow-sm"
              >
                Remove
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
