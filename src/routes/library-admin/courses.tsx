import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Download,
  Trash2,
  X,
  ChevronDown,
  Check,
  GraduationCap,
  Layers,
  Building2,
  BookOpen,
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
  title: string; // Course name
  subtext: string; // Batch cohort
  isActive: boolean;
}

interface CourseItem {
  id: string;
  title: string;
  isActive: boolean;
}

interface DepartmentItem {
  id: string;
  name: string;
  isActive: boolean;
}

interface DepartmentCourseItem {
  id: string;
  departmentName: string; // Parent Department
  courseName: string; // Assigned Course
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

const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  { id: "d1", name: "Computer Science", isActive: true },
  { id: "d2", name: "Science", isActive: true },
  { id: "d3", name: "Commerce", isActive: true },
  { id: "d4", name: "Economics", isActive: true },
  { id: "d5", name: "Physics", isActive: true },
  { id: "d6", name: "Accountancy", isActive: false },
];

const INITIAL_DEPARTMENT_COURSES: DepartmentCourseItem[] = [
  { id: "dc1", departmentName: "Computer Science", courseName: "BSc Computer Science", isActive: true },
  { id: "dc2", departmentName: "Computer Science", courseName: "MCA", isActive: true },
  { id: "dc3", departmentName: "Computer Science", courseName: "BCA", isActive: true },
  { id: "dc4", departmentName: "Science", courseName: "BSc Agriculture", isActive: true },
  { id: "dc5", departmentName: "Science", courseName: "MSC", isActive: true },
  { id: "dc6", departmentName: "Commerce", courseName: "B.Com", isActive: true },
  { id: "dc7", departmentName: "Commerce", courseName: "M.Com", isActive: true },
  { id: "dc8", departmentName: "Economics", courseName: "BA Economics", isActive: true },
  { id: "dc9", departmentName: "Physics", courseName: "BSc Physics", isActive: true },
  { id: "dc10", departmentName: "Accountancy", courseName: "CA Foundation", isActive: false },
];

export function LibraryAdminCoursesPage() {
  // Navigation Section Filter: "departments-courses" | "courses-batches"
  const [activeSection, setActiveSection] = useState<"departments-courses" | "courses-batches">("departments-courses");

  // Search queries for Courses & Batches
  const [courseListSearchQuery, setCourseListSearchQuery] = useState("");
  const [batchListSearchQuery, setBatchListSearchQuery] = useState("");

  // Search queries for Departments & Courses
  const [deptListSearchQuery, setDeptListSearchQuery] = useState("");
  const [deptCourseListSearchQuery, setDeptCourseListSearchQuery] = useState("");

  // Data states
  const [batches, setBatches] = useState<BatchItem[]>(INITIAL_BATCHES);
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [departmentCourses, setDepartmentCourses] = useState<DepartmentCourseItem[]>(INITIAL_DEPARTMENT_COURSES);

  // Dialog open states
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddDeptCourseOpen, setIsAddDeptCourseOpen] = useState(false);
  const [importTarget, setImportTarget] = useState<"batch" | "departmentCourse" | null>(null);

  // Form states for Add/Edit Course
  const [selectedCourseDept, setSelectedCourseDept] = useState("Computer Science");
  const [courseDeptPopoverOpen, setCourseDeptPopoverOpen] = useState(false);
  const [courseDeptSearchQuery, setCourseDeptSearchQuery] = useState("");
  const [courseTitleInput, setCourseTitleInput] = useState("");
  const [courseTitles, setCourseTitles] = useState<string[]>([""]);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  // Form states for Add/Edit Batch
  const [batchTitleInput, setBatchTitleInput] = useState("");
  const [batchSubtextInput, setBatchSubtextInput] = useState("");
  const [batchSubtexts, setBatchSubtexts] = useState<string[]>([""]);
  const [editingBatch, setEditingBatch] = useState<BatchItem | null>(null);

  // Form states for Add/Edit Department
  const [deptNameInput, setDeptNameInput] = useState("");
  const [deptNames, setDeptNames] = useState<string[]>([""]);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);

  // Form states for Add/Edit Department Course
  const [deptCourseDeptInput, setDeptCourseDeptInput] = useState("");
  const [deptCourseInput, setDeptCourseInput] = useState("");
  const [deptCourseInputs, setDeptCourseInputs] = useState<string[]>([""]);
  const [editingDeptCourse, setEditingDeptCourse] = useState<DepartmentCourseItem | null>(null);

  // Searchable dropdown states
  const [coursePopoverOpen, setCoursePopoverOpen] = useState(false);
  const [courseSearchQuery, setCourseSearchQuery] = useState("");

  const [deptPopoverOpen, setDeptPopoverOpen] = useState(false);
  const [deptSearchQueryInModal, setDeptSearchQueryInModal] = useState("");

  // Delete confirmation state
  const [deletingItem, setDeletingItem] = useState<{
    type: "batch" | "course" | "department" | "departmentCourse";
    id: string;
    name: string;
  } | null>(null);

  // Upload modal states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDragging, setUploadDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Filtered lists for Courses & Batches
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

  const filteredCoursesForDropdown = useMemo(() => {
    const q = courseSearchQuery.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(q));
  }, [courses, courseSearchQuery]);

  // Filtered lists for Departments & Courses
  const filteredDepartments = useMemo(() => {
    const q = deptListSearchQuery.toLowerCase().trim();
    if (!q) return departments;
    return departments.filter((d) => d.name.toLowerCase().includes(q));
  }, [departments, deptListSearchQuery]);

  const filteredDeptCourses = useMemo(() => {
    const q = deptCourseListSearchQuery.toLowerCase().trim();
    if (!q) return departmentCourses;
    return departmentCourses.filter(
      (dc) =>
        dc.departmentName.toLowerCase().includes(q) ||
        dc.courseName.toLowerCase().includes(q),
    );
  }, [departmentCourses, deptCourseListSearchQuery]);

  const filteredDeptsForDropdown = useMemo(() => {
    const q = deptSearchQueryInModal.toLowerCase().trim();
    if (!q) return departments;
    return departments.filter((d) => d.name.toLowerCase().includes(q));
  }, [departments, deptSearchQueryInModal]);

  const filteredDeptsForCourseDialog = useMemo(() => {
    const q = courseDeptSearchQuery.toLowerCase().trim();
    if (!q) return departments;
    return departments.filter((d) => d.name.toLowerCase().includes(q));
  }, [departments, courseDeptSearchQuery]);

  // ----------------- COURSE HANDLERS -----------------
  const handleOpenAddCourse = () => {
    setSelectedCourseDept(departments[0]?.name || "Computer Science");
    setCourseTitleInput("");
    setCourseTitles([""]);
    setEditingCourse(null);
    setCourseDeptSearchQuery("");
    setIsAddCourseOpen(true);
  };

  const handleOpenEditCourse = (c: CourseItem) => {
    setEditingCourse(c);
    const linkedDept = departmentCourses.find((dc) => dc.courseName === c.title)?.departmentName;
    setSelectedCourseDept(linkedDept || departments[0]?.name || "Computer Science");
    setCourseTitleInput(c.title);
    setCourseTitles([c.title]);
    setCourseDeptSearchQuery("");
    setIsAddCourseOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDept = selectedCourseDept.trim() || departments[0]?.name || "Computer Science";

    if (editingCourse) {
      const titleVal = courseTitles[0]?.trim() || courseTitleInput.trim();
      if (!titleVal) {
        toast.error("Please enter a course title");
        return;
      }
      setCourses((prev) =>
        prev.map((item) =>
          item.id === editingCourse.id ? { ...item, title: titleVal } : item,
        ),
      );
      // Sync linked department course
      setDepartmentCourses((prev) => {
        const found = prev.some((dc) => dc.courseName === editingCourse.title);
        if (found) {
          return prev.map((dc) =>
            dc.courseName === editingCourse.title
              ? { ...dc, departmentName: targetDept, courseName: titleVal }
              : dc,
          );
        }
        return [
          {
            id: `dc_${Date.now()}`,
            departmentName: targetDept,
            courseName: titleVal,
            isActive: true,
          },
          ...prev,
        ];
      });
      toast.success(`Course "${titleVal}" updated successfully!`);
    } else {
      const validTitles = courseTitles.map((t) => t.trim()).filter(Boolean);
      if (validTitles.length === 0) {
        toast.error("Please enter at least one course title");
        return;
      }

      // Add to courses catalog (avoid duplicates)
      const newCoursesToAdd: CourseItem[] = [];
      validTitles.forEach((title, idx) => {
        if (!courses.some((c) => c.title.toLowerCase() === title.toLowerCase())) {
          newCoursesToAdd.push({
            id: `c_${Date.now()}_${idx}`,
            title,
            isActive: true,
          });
        }
      });
      if (newCoursesToAdd.length > 0) {
        setCourses((prev) => [...newCoursesToAdd, ...prev]);
      }

      // Add to departmentCourses for the selected department
      const newDeptCourses: DepartmentCourseItem[] = validTitles.map((title, idx) => ({
        id: `dc_${Date.now()}_${idx}`,
        departmentName: targetDept,
        courseName: title,
        isActive: true,
      }));
      setDepartmentCourses((prev) => [...newDeptCourses, ...prev]);

      toast.success(
        validTitles.length === 1
          ? `Added "${validTitles[0]}" to Department "${targetDept}"!`
          : `Successfully added ${validTitles.length} courses to "${targetDept}"!`,
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

  // ----------------- BATCH HANDLERS -----------------
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

  // ----------------- DEPARTMENT HANDLERS -----------------
  const handleOpenAddDepartment = () => {
    setDeptNameInput("");
    setDeptNames([""]);
    setEditingDept(null);
    setIsAddDeptOpen(true);
  };

  const handleOpenEditDepartment = (d: DepartmentItem) => {
    setEditingDept(d);
    setDeptNameInput(d.name);
    setDeptNames([d.name]);
    setIsAddDeptOpen(true);
  };

  const handleSaveDepartment = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingDept) {
      if (!deptNameInput.trim()) {
        toast.error("Please enter a department name");
        return;
      }
      setDepartments((prev) =>
        prev.map((item) =>
          item.id === editingDept.id ? { ...item, name: deptNameInput.trim() } : item,
        ),
      );
      // Also update linked department courses name if department was renamed
      setDepartmentCourses((prev) =>
        prev.map((dc) =>
          dc.departmentName === editingDept.name
            ? { ...dc, departmentName: deptNameInput.trim() }
            : dc,
        ),
      );
      toast.success(`Department "${deptNameInput.trim()}" updated successfully!`);
    } else {
      const validNames = deptNames.map((name) => name.trim()).filter(Boolean);
      if (validNames.length === 0) {
        toast.error("Please enter at least one department name");
        return;
      }
      const newDepts: DepartmentItem[] = validNames.map((name, idx) => ({
        id: `d_${Date.now()}_${idx}`,
        name,
        isActive: true,
      }));
      setDepartments((prev) => [...prev, ...newDepts]);
      toast.success(
        validNames.length === 1
          ? `Department "${validNames[0]}" created successfully!`
          : `Successfully created ${validNames.length} departments!`,
      );
    }

    setIsAddDeptOpen(false);
    setEditingDept(null);
  };

  const handleToggleDepartmentActive = (deptId: string) => {
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === deptId) {
          const nextState = !d.isActive;
          toast.success(`Department "${d.name}" is now ${nextState ? "Active" : "Inactive"}`);
          return { ...d, isActive: nextState };
        }
        return d;
      }),
    );
  };

  // ----------------- DEPARTMENT COURSE HANDLERS -----------------
  const handleOpenAddDeptCourse = () => {
    setDeptCourseDeptInput(departments[0]?.name || "");
    setDeptCourseInput("");
    setDeptCourseInputs([""]);
    setEditingDeptCourse(null);
    setDeptSearchQueryInModal("");
    setIsAddDeptCourseOpen(true);
  };

  const handleOpenEditDeptCourse = (dc: DepartmentCourseItem) => {
    setEditingDeptCourse(dc);
    setDeptCourseDeptInput(dc.departmentName);
    setDeptCourseInput(dc.courseName);
    setDeptCourseInputs([dc.courseName]);
    setDeptSearchQueryInModal("");
    setIsAddDeptCourseOpen(true);
  };

  const handleSaveDeptCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptCourseDeptInput.trim()) {
      toast.error("Please select a department");
      return;
    }

    if (editingDeptCourse) {
      const courseVal = deptCourseInputs[0]?.trim() || deptCourseInput.trim();
      if (!courseVal) {
        toast.error("Please enter course name");
        return;
      }
      setDepartmentCourses((prev) =>
        prev.map((item) =>
          item.id === editingDeptCourse.id
            ? {
              ...item,
              departmentName: deptCourseDeptInput.trim(),
              courseName: courseVal,
            }
            : item,
        ),
      );
      toast.success(`Department Course "${courseVal}" updated successfully!`);
    } else {
      const validCourses = deptCourseInputs.map((c) => c.trim()).filter(Boolean);
      if (validCourses.length === 0) {
        toast.error("Please enter at least one course title");
        return;
      }
      const newDeptCourses: DepartmentCourseItem[] = validCourses.map((courseName, idx) => ({
        id: `dc_${Date.now()}_${idx}`,
        departmentName: deptCourseDeptInput.trim(),
        courseName,
        isActive: true,
      }));
      setDepartmentCourses((prev) => [...newDeptCourses, ...prev]);
      toast.success(
        validCourses.length === 1
          ? `Added "${validCourses[0]}" to Department "${deptCourseDeptInput.trim()}"!`
          : `Successfully added ${validCourses.length} courses to "${deptCourseDeptInput.trim()}"!`,
      );
    }

    setIsAddDeptCourseOpen(false);
    setEditingDeptCourse(null);
  };

  const handleToggleDeptCourseActive = (id: string) => {
    setDepartmentCourses((prev) =>
      prev.map((dc) => {
        if (dc.id === id) {
          const nextState = !dc.isActive;
          toast.success(
            `Course "${dc.courseName}" in "${dc.departmentName}" is now ${nextState ? "Active" : "Inactive"
            }`,
          );
          return { ...dc, isActive: nextState };
        }
        return dc;
      }),
    );
  };

  // ----------------- DELETE HANDLER -----------------
  const ConfirmDelete = () => {
    if (!deletingItem) return;
    if (deletingItem.type === "batch") {
      setBatches((prev) => prev.filter((b) => b.id !== deletingItem.id));
      toast.success(`Batch "${deletingItem.name}" deleted successfully!`);
    } else if (deletingItem.type === "course") {
      setCourses((prev) => prev.filter((c) => c.id !== deletingItem.id));
      toast.success(`Course "${deletingItem.name}" deleted successfully!`);
    } else if (deletingItem.type === "department") {
      setDepartments((prev) => prev.filter((d) => d.id !== deletingItem.id));
      toast.success(`Department "${deletingItem.name}" deleted successfully!`);
    } else if (deletingItem.type === "departmentCourse") {
      setDepartmentCourses((prev) => prev.filter((dc) => dc.id !== deletingItem.id));
      toast.success(`Course "${deletingItem.name}" removed from department!`);
    }
    setDeletingItem(null);
  };

  // ----------------- IMPORT HANDLERS -----------------
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
            const target = importTarget;
            setImportTarget(null);
            setUploadFile(null);
            setUploadProgress(null);
            if (target === "departmentCourse") {
              toast.success(
                `Excel file "${uploadFile.name}" imported successfully! Department courses updated.`,
              );
            } else {
              toast.success(
                `Excel file "${uploadFile.name}" imported successfully! Batches & courses updated.`,
              );
            }
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  return (
    <AppShell
      title="Academics - Departments, Courses & Batches"
      subtitle="Configure departments, academic courses & batches"
    >
      <div className="p-4 md:p-8 space-y-8">
        {/* Navigation Section Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/40 border border-border shrink-0 self-start">
            <button
              type="button"
              onClick={() => setActiveSection("departments-courses")}
              className={`h-9 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${activeSection === "departments-courses"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Building2 size={14} className="text-[var(--brand)]" />
              <span>Departments & Courses</span>
              <span className="rounded-full bg-slate-100 dark:bg-secondary/60 text-slate-600 dark:text-muted-foreground text-[10px] font-bold px-1.5 py-0.5">
                {departments.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("courses-batches")}
              className={`h-9 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${activeSection === "courses-batches"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <GraduationCap size={14} className="text-[var(--brand)]" />
              <span>Courses & Batches</span>
              <span className="rounded-full bg-slate-100 dark:bg-secondary/60 text-slate-600 dark:text-muted-foreground text-[10px] font-bold px-1.5 py-0.5">
                {courses.length}
              </span>
            </button>
          </div>

          <div className="text-xs text-muted-foreground hidden lg:block">
            One Department can hold multiple Courses · One Course can have multiple Batches
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 1: DEPARTMENTS & COURSES                               */}
        {/* ============================================================== */}
        {activeSection === "departments-courses" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                    <Building2 size={16} />
                  </div>
                  Departments & Courses
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Organize academic departments and assign multiple courses to each department
                </p>
              </div>
            </div>

            {/* Side-by-Side Dashboard Layout showing both datasets simultaneously */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Departments Available Card (Left) */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-xs flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="text-[var(--brand)]" size={18} />
                      <h3 className="font-bold text-foreground text-sm sm:text-base">
                        Departments Available
                      </h3>
                      <span className="rounded-full bg-slate-100 dark:bg-secondary/40 text-slate-600 dark:text-muted-foreground text-xs font-semibold px-2 py-0.5">
                        {departments.length}
                      </span>
                    </div>
                    <button
                      onClick={handleOpenAddDepartment}
                      className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-[var(--brand)] text-white px-2.5 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add Department</span>
                    </button>
                  </div>

                  {/* Department Search */}
                  <label className="relative flex h-9 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full">
                    <Search size={14} className="text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      placeholder="Search departments..."
                      value={deptListSearchQuery}
                      onChange={(e) => setDeptListSearchQuery(e.target.value)}
                      className="w-full bg-transparent pl-2 text-xs outline-none text-foreground"
                    />
                    {deptListSearchQuery && (
                      <button
                        onClick={() => setDeptListSearchQuery("")}
                        className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </label>

                  {/* Department Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <th className="pb-3 pr-4 font-semibold">Department</th>
                          <th className="pb-3 px-3 font-semibold text-center w-20">Edit</th>
                          <th className="pb-3 px-3 font-semibold text-center w-16">Active</th>
                          <th className="pb-3 pl-3 font-semibold text-center w-16">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {filteredDepartments.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-muted-foreground">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <Building2 size={32} className="text-muted-foreground/60" />
                                <p className="font-semibold text-sm">No departments found</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredDepartments.map((d) => (
                            <tr
                              key={d.id}
                              className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/25"
                            >
                              <td className="py-3 pr-4 font-medium text-foreground text-sm">
                                {d.name}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => handleOpenEditDepartment(d)}
                                  className="inline-flex h-7 items-center justify-center rounded-lg bg-[var(--brand)] text-white px-3 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                                >
                                  Edit
                                </button>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <div className="inline-flex items-center justify-center">
                                  <Switch
                                    checked={d.isActive}
                                    onCheckedChange={() => handleToggleDepartmentActive(d.id)}
                                    className="data-[state=checked]:bg-[var(--brand)]"
                                    aria-label={`Toggle active status for ${d.name}`}
                                  />
                                </div>
                              </td>
                              <td className="py-3 pl-3 text-center">
                                <button
                                  onClick={() =>
                                    setDeletingItem({
                                      type: "department",
                                      id: d.id,
                                      name: d.name,
                                    })
                                  }
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                                  title="Remove Department"
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

              {/* Department Courses Card (Right) */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-xs flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="text-[var(--brand)]" size={18} />
                      <h3 className="font-bold text-foreground text-sm sm:text-base">
                        Courses
                      </h3>
                      <span className="rounded-full bg-slate-100 dark:bg-secondary/40 text-slate-600 dark:text-muted-foreground text-xs font-semibold px-2 py-0.5">
                        {departmentCourses.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOpenAddDeptCourse}
                        className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-[var(--brand)] text-white px-2.5 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>Add Course</span>
                      </button>
                      <button
                        onClick={() => {
                          setUploadFile(null);
                          setUploadProgress(null);
                          setImportTarget("departmentCourse");
                        }}
                        className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-border bg-white dark:bg-card text-foreground px-2.5 text-xs font-semibold hover:bg-secondary/40 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <Download size={13} className="text-muted-foreground" />
                        <span>Import</span>
                      </button>
                    </div>
                  </div>

                  {/* Department Course Search */}
                  <label className="relative flex h-9 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full">
                    <Search size={14} className="text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      placeholder="Search courses or departments..."
                      value={deptCourseListSearchQuery}
                      onChange={(e) => setDeptCourseListSearchQuery(e.target.value)}
                      className="w-full bg-transparent pl-2 text-xs outline-none text-foreground"
                    />
                    {deptCourseListSearchQuery && (
                      <button
                        onClick={() => setDeptCourseListSearchQuery("")}
                        className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </label>

                  {/* Department Courses Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <th className="pb-3 pr-4 font-semibold">Department & Course</th>
                          <th className="pb-3 px-3 font-semibold text-center w-20">Edit</th>
                          <th className="pb-3 px-3 font-semibold text-center w-16">Active</th>
                          <th className="pb-3 pl-3 font-semibold text-center w-16">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {filteredDeptCourses.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-muted-foreground">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <BookOpen size={32} className="text-muted-foreground/60" />
                                <p className="font-semibold text-sm">No department courses found</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredDeptCourses.map((dc) => (
                            <tr
                              key={dc.id}
                              className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/25"
                            >
                              <td className="py-3 pr-4">
                                <div>
                                  <p className="font-semibold text-foreground text-sm">
                                    {dc.departmentName}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5 font-medium flex items-center gap-1.5">
                                    <GraduationCap size={12} className="text-[var(--brand)]" />
                                    <span>{dc.courseName}</span>
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => handleOpenEditDeptCourse(dc)}
                                  className="inline-flex h-7 items-center justify-center rounded-lg bg-[var(--brand)] text-white px-3 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                                >
                                  Edit
                                </button>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <div className="inline-flex items-center justify-center">
                                  <Switch
                                    checked={dc.isActive}
                                    onCheckedChange={() => handleToggleDeptCourseActive(dc.id)}
                                    className="data-[state=checked]:bg-[var(--brand)]"
                                    aria-label={`Toggle active status for ${dc.courseName} in ${dc.departmentName}`}
                                  />
                                </div>
                              </td>
                              <td className="py-3 pl-3 text-center">
                                <button
                                  onClick={() =>
                                    setDeletingItem({
                                      type: "departmentCourse",
                                      id: dc.id,
                                      name: `${dc.departmentName} - ${dc.courseName}`,
                                    })
                                  }
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                                  title="Remove Department Course"
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
          </section>
        )}

        {/* ============================================================== */}
        {/* SECTION 2: COURSES & BATCHES                                   */}
        {/* ============================================================== */}
        {activeSection === "courses-batches" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                    <GraduationCap size={16} />
                  </div>
                  Courses & Batches
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage academic courses and their corresponding batch cohorts
                </p>
              </div>
            </div>

            {/* Side-by-Side Dashboard Layout showing both datasets simultaneously */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Courses Available Card (Left) */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-xs flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="text-[var(--brand)]" size={18} />
                      <h3 className="font-bold text-foreground text-sm sm:text-base">
                        Courses Available
                      </h3>
                      <span className="rounded-full bg-slate-100 dark:bg-secondary/40 text-slate-600 dark:text-muted-foreground text-xs font-semibold px-2 py-0.5">
                        {courses.length}
                      </span>
                    </div>
                    <button
                      onClick={handleOpenAddCourse}
                      className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-[var(--brand)] text-white px-2.5 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
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
                                  className="inline-flex h-7 items-center justify-center rounded-lg bg-[var(--brand)] text-white px-3 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
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
                <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-xs flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                      <Layers className="text-[var(--brand)]" size={18} />
                      <h3 className="font-bold text-foreground text-sm sm:text-base">Batches</h3>
                      <span className="rounded-full bg-slate-100 dark:bg-secondary/40 text-slate-600 dark:text-muted-foreground text-xs font-semibold px-2 py-0.5">
                        {batches.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOpenAddBatch}
                        className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-[var(--brand)] text-white px-2.5 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>Add Batch</span>
                      </button>
                      <button
                        onClick={() => {
                          setUploadFile(null);
                          setUploadProgress(null);
                          setImportTarget("batch");
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
                                  className="inline-flex h-7 items-center justify-center rounded-lg bg-[var(--brand)] text-white px-3 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
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
          </section>
        )}

        {/* ----------------- IMPORT EXCEL MODAL DIALOG ----------------- */}
        <Dialog
          open={importTarget !== null}
          onOpenChange={(open) => {
            if (!open) setImportTarget(null);
          }}
        >
          <DialogContent className="max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="text-center space-y-1 mb-6">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                {importTarget === "departmentCourse" ? "Import Department Courses" : "Import Courses & Batches"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {importTarget === "departmentCourse"
                  ? "Upload department to course mappings via Excel template"
                  : "Upload your course and batch catalog via Excel template"}
              </DialogDescription>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-6">
              {/* Dropzone Container */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${uploadDragging
                  ? "border-[var(--brand)] bg-[var(--sidebar-highlight)]/30 scale-[1.01]"
                  : "border-slate-300 dark:border-border/80 bg-secondary/10 hover:bg-secondary/20"
                  }`}
              >
                <input
                  type="file"
                  id="excel-input"
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
                    <span>Importing catalog...</span>
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
                  onClick={() => setImportTarget(null)}
                  className="h-11 px-8 rounded-full border border-border bg-white dark:bg-card text-foreground font-semibold text-sm hover:bg-secondary/40 transition-all cursor-pointer shadow-xs min-w-32"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || uploadProgress !== null}
                  className={`h-11 px-8 rounded-full font-semibold text-sm transition-all cursor-pointer shadow-xs min-w-32 ${uploadFile && uploadProgress === null
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

        {/* ----------------- ADD / EDIT COURSE DIALOG (Matching Screenshot) ----------------- */}
        <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="border-b border-border pb-3 mb-5">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                {editingCourse ? "Edit Course" : "Add Courses to Department"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Select a department and associate one or multiple courses
              </DialogDescription>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              {/* Select Department Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Select Department *</label>
                <Popover open={courseDeptPopoverOpen} onOpenChange={setCourseDeptPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="h-11 w-full flex items-center justify-between rounded-xl border-2 border-[var(--brand)] bg-white dark:bg-card px-3.5 text-sm font-semibold text-foreground focus:outline-none text-left cursor-pointer transition-all shadow-xs"
                    >
                      <span>{selectedCourseDept || "Computer Science"}</span>
                      <ChevronDown size={16} className="text-muted-foreground shrink-0" />
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
                        placeholder="Search departments..."
                        value={courseDeptSearchQuery}
                        onChange={(e) => setCourseDeptSearchQuery(e.target.value)}
                        className="w-full bg-transparent pl-2 text-xs outline-none text-foreground"
                        autoFocus
                      />
                      {courseDeptSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setCourseDeptSearchQuery("")}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                      {filteredDeptsForCourseDialog.length === 0 ? (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          No matching departments found.
                        </div>
                      ) : (
                        filteredDeptsForCourseDialog.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => {
                              setSelectedCourseDept(d.name);
                              setCourseDeptPopoverOpen(false);
                              setCourseDeptSearchQuery("");
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${selectedCourseDept === d.name
                              ? "bg-[var(--sidebar-highlight)] text-[var(--brand)]"
                              : "hover:bg-secondary/60 text-foreground"
                              }`}
                          >
                            <span>{d.name}</span>
                            {selectedCourseDept === d.name && (
                              <Check size={14} className="text-[var(--brand)] shrink-0" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Course Titles */}
              {editingCourse ? (
                /* Single Course Title Edit Form */
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSc Computer Science"
                    value={courseTitleInput}
                    onChange={(e) => setCourseTitleInput(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-300 dark:border-border bg-white dark:bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                  />
                </div>
              ) : (
                /* Multiple Course Titles Add Form */
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">
                      Course Titles *
                    </label>
                    <span className="text-xs text-muted-foreground">
                      One department can have multiple courses
                    </span>
                  </div>

                  <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1 py-0.5">
                    {courseTitles.map((title, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          required={idx === 0}
                          placeholder={`e.g. Course ${idx + 1} (e.g. BSc Computer Science)`}
                          value={title}
                          onChange={(e) => {
                            const updated = [...courseTitles];
                            updated[idx] = e.target.value;
                            setCourseTitles(updated);
                          }}
                          className="h-11 w-full rounded-xl border border-slate-300 dark:border-border bg-white dark:bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
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

                  {/* Quick pick from existing courses */}
                  {courses.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <p className="text-xs text-muted-foreground font-medium">
                        Quick pick from existing courses:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {courses.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              const lastIdx = courseTitles.length - 1;
                              if (courseTitles[lastIdx]?.trim() === "") {
                                const updated = [...courseTitles];
                                updated[lastIdx] = c.title;
                                setCourseTitles(updated);
                              } else if (!courseTitles.includes(c.title)) {
                                setCourseTitles((prev) => [...prev, c.title]);
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-secondary/60 text-foreground text-xs font-semibold transition-colors cursor-pointer"
                          >
                            + {c.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setCourseTitles((prev) => [...prev, ""])}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)] hover:underline cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add another course</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddCourseOpen(false)}
                  className="h-10 px-6 rounded-xl border border-border bg-white dark:bg-card text-xs font-semibold text-foreground hover:bg-secondary/40 cursor-pointer transition-all shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-xl bg-[var(--brand)] text-white text-xs font-semibold hover:opacity-90 active:scale-[0.98] cursor-pointer shadow-xs transition-all"
                >
                  {editingCourse ? "Save Changes" : "Add Course"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ----------------- ADD / EDIT BATCH DIALOG ----------------- */}
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
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${batchTitleInput === c.title
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
                  className="h-9 px-4 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold hover:opacity-90 cursor-pointer shadow-xs"
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

        {/* ----------------- ADD / EDIT DEPARTMENT DIALOG ----------------- */}
        <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl">
            <div className="border-b border-border pb-3 mb-4">
              <DialogTitle className="text-lg font-bold text-foreground">
                {editingDept ? "Edit Department" : "Add New Department"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Specify department name for faculty or academic stream division
              </DialogDescription>
            </div>

            <form onSubmit={handleSaveDepartment} className="space-y-4">
              {editingDept ? (
                /* Single Department Name Edit Form */
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Department Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={deptNameInput}
                    onChange={(e) => setDeptNameInput(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                  />
                </div>
              ) : (
                /* Multiple Department Names Add Form */
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-foreground block">
                    Department Names *
                  </label>
                  <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 py-1">
                    {deptNames.map((name, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          required={idx === 0}
                          placeholder={`e.g. Department ${idx + 1} (e.g. Science)`}
                          value={name}
                          onChange={(e) => {
                            const updated = [...deptNames];
                            updated[idx] = e.target.value;
                            setDeptNames(updated);
                          }}
                          className="h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                        />
                        {deptNames.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = deptNames.filter((_, i) => i !== idx);
                              setDeptNames(updated);
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
                    onClick={() => setDeptNames((prev) => [...prev, ""])}
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
                  onClick={() => setIsAddDeptOpen(false)}
                  className="h-9 px-4 rounded-lg border border-border bg-white dark:bg-card text-xs font-semibold text-foreground hover:bg-secondary/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold hover:opacity-90 cursor-pointer shadow-xs"
                >
                  {editingDept
                    ? "Save Changes"
                    : deptNames.length > 1
                      ? "Create Departments"
                      : "Create Department"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ----------------- ADD / EDIT DEPARTMENT COURSE DIALOG ----------------- */}
        <Dialog open={isAddDeptCourseOpen} onOpenChange={setIsAddDeptCourseOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl">
            <div className="border-b border-border pb-3 mb-4">
              <DialogTitle className="text-lg font-bold text-foreground">
                {editingDeptCourse ? "Edit Department Course" : "Add Courses to Department"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Select a department and associate one or multiple courses
              </DialogDescription>
            </div>

            <form onSubmit={handleSaveDeptCourse} className="space-y-4">
              {/* Searchable Department Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Select Department *</label>
                <Popover open={deptPopoverOpen} onOpenChange={setDeptPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="h-10 w-full flex items-center justify-between rounded-lg border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)] text-left cursor-pointer"
                    >
                      <span
                        className={
                          deptCourseDeptInput
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {deptCourseDeptInput || "Search or select department..."}
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
                        placeholder="Search departments..."
                        value={deptSearchQueryInModal}
                        onChange={(e) => setDeptSearchQueryInModal(e.target.value)}
                        className="w-full bg-transparent pl-2 text-xs outline-none text-foreground"
                        autoFocus
                      />
                      {deptSearchQueryInModal && (
                        <button
                          type="button"
                          onClick={() => setDeptSearchQueryInModal("")}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                      {filteredDeptsForDropdown.length === 0 ? (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          No matching departments found.
                        </div>
                      ) : (
                        filteredDeptsForDropdown.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => {
                              setDeptCourseDeptInput(d.name);
                              setDeptPopoverOpen(false);
                              setDeptSearchQueryInModal("");
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${deptCourseDeptInput === d.name
                              ? "bg-[var(--sidebar-highlight)] text-[var(--brand)]"
                              : "hover:bg-secondary/60 text-foreground"
                              }`}
                          >
                            <span>{d.name}</span>
                            {deptCourseDeptInput === d.name && (
                              <Check size={14} className="text-[var(--brand)] shrink-0" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Course Title Inputs */}
              {editingDeptCourse ? (
                /* Single Course Edit Form */
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSc Computer Science"
                    value={deptCourseInput}
                    onChange={(e) => {
                      setDeptCourseInput(e.target.value);
                      const updated = [...deptCourseInputs];
                      updated[0] = e.target.value;
                      setDeptCourseInputs(updated);
                    }}
                    className="h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                  />
                </div>
              ) : (
                /* Multiple Courses Add Form */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground block">
                      Course Titles *
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      One department can have multiple courses
                    </span>
                  </div>

                  <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1 py-1">
                    {deptCourseInputs.map((cName, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          required={idx === 0}
                          placeholder={`e.g. Course ${idx + 1} (e.g. BSc Computer Science)`}
                          value={cName}
                          onChange={(e) => {
                            const updated = [...deptCourseInputs];
                            updated[idx] = e.target.value;
                            setDeptCourseInputs(updated);
                          }}
                          className="h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                        />
                        {deptCourseInputs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = deptCourseInputs.filter((_, i) => i !== idx);
                              setDeptCourseInputs(updated);
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

                  {/* Quick Select from existing courses */}
                  {courses.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[11px] text-muted-foreground font-medium mb-1.5">
                        Quick pick from existing courses:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {courses.slice(0, 6).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              // If last input is empty, fill it; otherwise append new row
                              const lastIdx = deptCourseInputs.length - 1;
                              if (deptCourseInputs[lastIdx]?.trim() === "") {
                                const updated = [...deptCourseInputs];
                                updated[lastIdx] = c.title;
                                setDeptCourseInputs(updated);
                              } else if (!deptCourseInputs.includes(c.title)) {
                                setDeptCourseInputs((prev) => [...prev, c.title]);
                              }
                            }}
                            className="px-2 py-0.5 rounded-md bg-secondary/70 hover:bg-secondary text-foreground text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            + {c.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setDeptCourseInputs((prev) => [...prev, ""])}
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
                  onClick={() => setIsAddDeptCourseOpen(false)}
                  className="h-9 px-4 rounded-lg border border-border bg-white dark:bg-card text-xs font-semibold text-foreground hover:bg-secondary/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold hover:opacity-90 cursor-pointer shadow-xs"
                >
                  {editingDeptCourse
                    ? "Save Changes"
                    : deptCourseInputs.length > 1
                      ? "Add Courses"
                      : "Add Course"}
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
                Remove{" "}
                {deletingItem?.type === "batch"
                  ? "Batch"
                  : deletingItem?.type === "course"
                    ? "Course"
                    : deletingItem?.type === "department"
                      ? "Department"
                      : "Department Course"}
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
                className="h-9 px-5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer shadow-xs"
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
