import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Upload,
  Download,
  Trash2,
  X,
  Building2,
  FileSpreadsheet,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/library-admin/departments")({
  component: LibraryAdminDepartmentsPage,
});

interface DepartmentItem {
  id: string;
  name: string;
}

const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  { id: "d1", name: "Accountancy" },
  { id: "d2", name: "Chemistry" },
  { id: "d3", name: "Commerce" },
  { id: "d4", name: "Economics" },
  { id: "d5", name: "Physics" },
  { id: "d6", name: "Computer Science" },
];

export function LibraryAdminDepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);

  // Dialog open states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Form states
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
  const [deptNameSingle, setDeptNameSingle] = useState("");
  const [deptNamesMultiple, setDeptNamesMultiple] = useState<string[]>([""]);

  // Delete state
  const [deletingItem, setDeletingItem] = useState<DepartmentItem | null>(null);

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDragging, setUploadDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Filtered departments list
  const filteredDepartments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return departments;
    return departments.filter((d) => d.name.toLowerCase().includes(q));
  }, [departments, searchQuery]);

  // Handlers for Add/Edit Department
  const handleOpenAddDept = () => {
    setDeptNameSingle("");
    setDeptNamesMultiple([""]);
    setEditingDept(null);
    setIsAddOpen(true);
  };

  const handleOpenEditDept = (d: DepartmentItem) => {
    setEditingDept(d);
    setDeptNameSingle(d.name);
    setDeptNamesMultiple([d.name]);
    setIsAddOpen(true);
  };

  const handleSaveDepartment = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingDept) {
      if (!deptNameSingle.trim()) {
        toast.error("Please enter a department name");
        return;
      }
      setDepartments((prev) =>
        prev.map((item) =>
          item.id === editingDept.id ? { ...item, name: deptNameSingle.trim() } : item,
        ),
      );
      toast.success(`Department "${deptNameSingle.trim()}" updated successfully!`);
    } else {
      const validNames = deptNamesMultiple.map((name) => name.trim()).filter(Boolean);
      if (validNames.length === 0) {
        toast.error("Please enter at least one department name");
        return;
      }
      const newDepts: DepartmentItem[] = validNames.map((name, idx) => ({
        id: `d_${Date.now()}_${idx}`,
        name,
      }));
      setDepartments((prev) => [...prev, ...newDepts]);
      toast.success(
        validNames.length === 1
          ? `Department "${validNames[0]}" created successfully!`
          : `Successfully created ${validNames.length} departments!`,
      );
    }

    setIsAddOpen(false);
    setEditingDept(null);
  };

  const ConfirmDelete = () => {
    if (!deletingItem) return;
    setDepartments((prev) => prev.filter((d) => d.id !== deletingItem.id));
    toast.success(`Department "${deletingItem.name}" removed successfully!`);
    setDeletingItem(null);
  };

  // Upload/Drag & Drop Handlers
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
              `Excel file "${uploadFile.name}" imported successfully! Departments updated.`,
            );
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  return (
    <AppShell title="Departments" subtitle="Manage university departments and academic faculties.">
      <div className="p-4 md:p-8 space-y-6">
        {/* Single Line Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border bg-card p-4 relative z-10">
          {/* Main Search Bar */}
          <div className="relative flex-1 min-w-[200px] w-full">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 sm:ml-auto">
            {/* + Add Department Button */}
            <button
              onClick={handleOpenAddDept}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] text-white px-4 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Department</span>
            </button>

            {/* Import Department Button */}
            <button
              onClick={() => {
                setUploadFile(null);
                setUploadProgress(null);
                setIsImportOpen(true);
              }}
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card text-foreground px-4 text-xs font-semibold hover:bg-secondary/40 active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
            >
              <Download size={15} className="text-muted-foreground" />
              <span>Import</span>
            </button>
          </div>
        </div>

        {/* Main Departments Table Container */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-4 font-semibold">Department</th>
                  <th className="pb-3 px-4 font-semibold text-center w-28">Edit</th>
                  <th className="pb-3 pl-4 font-semibold text-center w-24">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredDepartments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Building2 size={32} className="text-muted-foreground/60" />
                        <p className="font-semibold text-sm">No departments found</p>
                        <p className="text-xs">Try adjusting your search query.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/20"
                    >
                      {/* Department Name */}
                      <td className="py-4 pr-4 font-semibold text-foreground text-sm">{d.name}</td>

                      {/* Edit Action Button */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleOpenEditDept(d)}
                          className="inline-flex h-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white px-4 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>

                      {/* Remove Action Trash Icon */}
                      <td className="py-4 pl-4 text-center">
                        <button
                          onClick={() => setDeletingItem(d)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove Department"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ----------------- IMPORT DEPARTMENT MODAL DIALOG ----------------- */}
        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="text-center space-y-1 mb-6">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Import Department
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Upload department records via Excel spreadsheet
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
                  id="dept-excel-input"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center gap-3">
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
                  onClick={() => toast.success("Sample template downloaded successfully!")}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  Download Sample Excel File
                </button>
              </div>

              {/* Progress bar simulation */}
              {uploadProgress !== null && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Importing departments...</span>
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

        {/* ----------------- ADD / EDIT DEPARTMENT DIALOG ----------------- */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl">
            <div className="border-b border-border pb-3 mb-4">
              <DialogTitle className="text-lg font-bold text-foreground">
                {editingDept ? "Edit Department" : "Add New Department"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Enter department details to configure system records
              </DialogDescription>
            </div>

            <form onSubmit={handleSaveDepartment} className="space-y-4">
              {editingDept ? (
                /* Single Department Title Edit Form */
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Department Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Accounts & Finance"
                    value={deptNameSingle}
                    onChange={(e) => setDeptNameSingle(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                  />
                </div>
              ) : (
                /* Multiple Department Titles Add Form */
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-foreground block">
                    Department Names *
                  </label>
                  <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 py-1">
                    {deptNamesMultiple.map((name, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          required={idx === 0}
                          placeholder={`e.g. Department Name ${idx + 1}`}
                          value={name}
                          onChange={(e) => {
                            const updated = [...deptNamesMultiple];
                            updated[idx] = e.target.value;
                            setDeptNamesMultiple(updated);
                          }}
                          className="h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                        />
                        {deptNamesMultiple.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = deptNamesMultiple.filter((_, i) => i !== idx);
                              setDeptNamesMultiple(updated);
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
                    onClick={() => setDeptNamesMultiple((prev) => [...prev, ""])}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)] hover:underline mt-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    Add another department
                  </button>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="h-9 px-4 rounded-lg border border-border bg-white dark:bg-card text-xs font-semibold text-foreground hover:bg-secondary/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold hover:opacity-90 cursor-pointer shadow-sm"
                >
                  {editingDept
                    ? "Save Changes"
                    : deptNamesMultiple.length > 1
                      ? "Create Departments"
                      : "Create Department"}
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
                Remove Department
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
