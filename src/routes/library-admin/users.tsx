import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Upload,
  Download,
  FileText,
  Eye,
  Calendar,
  ChevronDown,
  ChevronRight,
  X,
  User,
  ArrowLeft,
  Shield,
  BookOpen,
  Camera,
  GraduationCap,
  UserCog,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/library-admin/users")({
  component: LibraryAdminUsersPage,
});

interface UserRecord {
  id: string;
  name: string;
  email: string;
  userType: "Student" | "Staff";
  borrows: string;
  mobileAccess: boolean;
  status: "Active" | "Inactive";
  joinDate: string;
  department: string;
}

const initialUsers: UserRecord[] = [
  {
    id: "U001",
    name: "DIVYA ABRAHAM",
    email: "divya.abraham@university.edu",
    userType: "Student",
    borrows: "No eBook borrowed",
    mobileAccess: false,
    status: "Active",
    joinDate: "2026-03-12",
    department: "Computer Science",
  },
  {
    id: "U002",
    name: "ABRAHAM",
    email: "abraham.john@university.edu",
    userType: "Student",
    borrows: "No eBook borrowed",
    mobileAccess: false,
    status: "Active",
    joinDate: "2026-03-24",
    department: "Electrical Engineering",
  },
  {
    id: "U003",
    name: "Sunny",
    email: "sunny.boy@university.edu",
    userType: "Student",
    borrows: "No eBook borrowed",
    mobileAccess: false,
    status: "Active",
    joinDate: "2026-04-05",
    department: "Mechanical Engineering",
  },
  {
    id: "U004",
    name: "PREETHA ALI",
    email: "preetha.ali@university.edu",
    userType: "Student",
    borrows: "No eBook borrowed",
    mobileAccess: false,
    status: "Active",
    joinDate: "2026-04-18",
    department: "Business Administration",
  },
  {
    id: "U005",
    name: "SURYA KIRAN ACHARYA",
    email: "surya.acharya@university.edu",
    userType: "Staff",
    borrows: "No eBook borrowed",
    mobileAccess: false,
    status: "Active",
    joinDate: "2026-05-01",
    department: "Physics",
  },
  {
    id: "U006",
    name: "Ajsal",
    email: "ajsal.muhammad@university.edu",
    userType: "Student",
    borrows: "No eBook borrowed",
    mobileAccess: false,
    status: "Active",
    joinDate: "2026-05-15",
    department: "Information Technology",
  },
  {
    id: "U007",
    name: "weet",
    email: "weet.singh@university.edu",
    userType: "Student",
    borrows: "No eBook borrowed",
    mobileAccess: false,
    status: "Active",
    joinDate: "2026-06-02",
    department: "Chemistry",
  },
  {
    id: "U008",
    name: "Anaina",
    email: "anaina.sharma@university.edu",
    userType: "Student",
    borrows: "No eBook borrowed",
    mobileAccess: true,
    status: "Active",
    joinDate: "2026-06-20",
    department: "Mathematics",
  },
  {
    id: "U009",
    name: "Rahul Verma",
    email: "rahul.verma@university.edu",
    userType: "Student",
    borrows: "3 eBooks borrowed",
    mobileAccess: true,
    status: "Active",
    joinDate: "2026-06-25",
    department: "Computer Science",
  },
  {
    id: "U010",
    name: "Priya Nair",
    email: "priya.nair@university.edu",
    userType: "Staff",
    borrows: "1 eBook borrowed",
    mobileAccess: false,
    status: "Inactive",
    joinDate: "2026-07-02",
    department: "Civil Engineering",
  },
  {
    id: "U011",
    name: "John Doe",
    email: "john.doe@university.edu",
    userType: "Student",
    borrows: "2 eBooks borrowed",
    mobileAccess: true,
    status: "Inactive",
    joinDate: "2026-07-05",
    department: "Humanities",
  },
  {
    id: "U012",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    userType: "Staff",
    borrows: "No eBook borrowed",
    mobileAccess: true,
    status: "Active",
    joinDate: "2026-07-08",
    department: "Economics",
  },
  {
    id: "U013",
    name: "Aman Gupta",
    email: "aman.gupta@university.edu",
    userType: "Student",
    borrows: "No eBook borrowed",
    mobileAccess: false,
    status: "Inactive",
    joinDate: "2026-07-10",
    department: "Computer Science",
  },
  {
    id: "U014",
    name: "Kirti Roy",
    email: "kirti.roy@university.edu",
    userType: "Student",
    borrows: "No eBook borrowed",
    mobileAccess: true,
    status: "Active",
    joinDate: "2026-07-11",
    department: "Biotechnology",
  },
];

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Business Administration",
  "Physics",
  "Information Technology",
  "Chemistry",
  "Mathematics",
  "Civil Engineering",
  "Humanities",
  "Economics",
  "Biotechnology",
];

const PRESETS = ["MTD", "QTD", "YTD", "Last 30 days", "Custom"] as const;

function UserTypeBadge({ type }: { type: "Student" | "Staff" | string }) {
  if (type === "Staff" || type === "Library Staff") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2 py-0.5 shadow-2xs">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
          <UserCog size={9} />
        </span>
        <span className="text-[11px] font-medium text-foreground">Library Staff</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2 py-0.5 shadow-2xs">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
        <GraduationCap size={9} />
      </span>
      <span className="text-[11px] font-medium text-foreground">Student</span>
    </div>
  );
}

function LibraryAdminUsersPage() {
  type Preset = (typeof PRESETS)[number];

  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [typeFilter, setTypeFilter] = useState<"All" | "Student" | "Staff">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  // Date Preset states matching orders/catalogue
  const [preset, setPreset] = useState<Preset>("YTD");
  const [presetOpen, setPresetOpen] = useState(false);
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState("2026-07-11");

  // Modals / Dialogs states
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Add User Form states
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addUserType, setAddUserType] = useState<"Student" | "Staff">("Student");
  const [addDept, setAddDept] = useState(departments[0]);

  // Edit User Details Form states matching Student Details mockup
  const [editName, setEditName] = useState("");
  const [editUserType, setEditUserType] = useState<"Student" | "Staff">("Student");
  const [editUniv, setEditUniv] = useState("Pixelbooks Library");
  const [editStudentId, setEditStudentId] = useState("");
  const [editEnrollmentId, setEditEnrollmentId] = useState("");
  const [editEnrollmentDate, setEditEnrollmentDate] = useState("09 April 2025");
  const [editCourse, setEditCourse] = useState("B.Com (CA)");
  const [editBatch, setEditBatch] = useState("2025,2029");
  const [editAddress, setEditAddress] = useState("");
  const [editPinCode, setEditPinCode] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Import User Upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDragging, setUploadDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Date Range Filter (registration date)
      const uDate = new Date(u.joinDate);
      const fromDate = new Date(from);
      const toDate = new Date(to);
      uDate.setHours(0, 0, 0, 0);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      const matchesDate = uDate >= fromDate && uDate <= toDate;
      if (!matchesDate) return false;

      // Status filter
      if (statusFilter !== "All" && u.status !== statusFilter) {
        return false;
      }

      // User Type filter
      if (typeFilter !== "All" && u.userType !== typeFilter) {
        return false;
      }

      // Search Query filter (matches name, email, department, userType)
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesName = u.name.toLowerCase().includes(query);
        const matchesEmail = u.email.toLowerCase().includes(query);
        const matchesDept = u.department.toLowerCase().includes(query);
        const matchesType = u.userType.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesDept && !matchesType) {
          return false;
        }
      }

      return true;
    });
  }, [users, statusFilter, typeFilter, searchQuery, from, to]);

  // Pagination calculations
  const totalResults = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);

  // Handlers
  const handlePresetSelect = (p: Preset) => {
    setPreset(p);
    setPresetOpen(false);

    const today = new Date("2026-07-11");
    let fromDate = new Date("2026-07-11");
    const toDate = new Date("2026-07-11");

    if (p === "MTD") {
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (p === "QTD") {
      const currentMonth = today.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      fromDate = new Date(today.getFullYear(), quarterStartMonth, 1);
    } else if (p === "YTD") {
      fromDate = new Date(today.getFullYear(), 0, 1);
    } else if (p === "Last 30 days") {
      fromDate.setDate(today.getDate() - 30);
    }

    setFrom(fromDate.toISOString().split("T")[0]);
    setTo(toDate.toISOString().split("T")[0]);
    setPage(1);
  };

  const handleMobileAccessToggle = (userId: string, currentVal: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, mobileAccess: !currentVal } : u)),
    );
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      toast.success(`Mobile access ${!currentVal ? "Enabled" : "Disabled"} for ${targetUser.name}`);
    }
  };

  const handleStatusToggle = (userId: string, currentVal: "Active" | "Inactive") => {
    const newVal = currentVal === "Active" ? "Inactive" : "Active";
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newVal } : u)));
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      toast.success(`User profile status updated to ${newVal} for ${targetUser.name}`);
    }
  };

  // Add User Form Submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newUserId = `U${(users.length + 1).toString().padStart(3, "0")}`;
    const newUser: UserRecord = {
      id: newUserId,
      name: addName.toUpperCase(),
      email: addEmail.toLowerCase(),
      userType: addUserType,
      borrows: "No eBook borrowed",
      mobileAccess: false,
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
      department: addDept,
    };

    setUsers([newUser, ...users]);
    toast.success(`New user ${newUser.name} created successfully!`);

    // Reset fields
    setAddName("");
    setAddEmail("");
    setAddUserType("Student");
    setAddDept(departments[0]);
    setIsAddOpen(false);
    setPage(1);
  };

  const handleOpenEditDetails = (u: UserRecord) => {
    setSelectedUser(u);
    setEditName(u.name);
    setEditUserType(u.userType);
    setEditUniv("Pixelbooks Library");
    // Generate a student/staff ID similar to the mockup format if it is not already structured
    const formattedId = u.id.startsWith("PXL")
      ? u.id
      : `PXL${u.userType === "Student" ? "STU" : "STF"}${u.id.replace(/\D/g, "") || "47896"}`;
    setEditStudentId(formattedId);
    setEditEnrollmentId("");
    setEditEnrollmentDate("09 April 2025");
    setEditCourse(u.userType === "Student" ? "B.Com (CA)" : "Administration");
    setEditBatch("2025,2029");
    setEditAddress("");
    setEditPinCode("");
    setEditEmail(u.email);
    setEditPhone("");
    setIsViewOpen(true);
  };

  const handleUpdateDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      if (!editName.trim() || !editEmail.trim()) {
        toast.error("Please fill in all required fields.");
        return;
      }
      const newUserId = `U${(users.length + 1).toString().padStart(3, "0")}`;
      const newUser: UserRecord = {
        id: newUserId,
        name: editName.toUpperCase(),
        email: editEmail.toLowerCase(),
        userType: editUserType,
        borrows: "No eBook borrowed",
        mobileAccess: false,
        status: "Active",
        joinDate: new Date().toISOString().split("T")[0],
        department: editCourse, // Store course as department for now
      };
      setUsers([newUser, ...users]);
      toast.success(`New user ${newUser.name} created successfully!`);
      setPage(1);
    } else {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                name: editName.toUpperCase(),
                userType: editUserType,
                email: editEmail.toLowerCase(),
              }
            : u,
        ),
      );
      toast.success("User details updated successfully!");
    }
    setIsViewOpen(false);
    setSelectedUser(null);
  };

  // File Upload Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragging(true);
  };

  const handleDragLeave = () => {
    setUploadDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".csv") || file.name.endsWith(".xlsx")) {
        setUploadFile(file);
      } else {
        toast.error("Please upload a CSV or Excel spreadsheet.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);

        // Add a mock imported user
        const newUserId = `U${(users.length + 1).toString().padStart(3, "0")}`;
        const importedUser: UserRecord = {
          id: newUserId,
          name: "IMPORTED USER",
          email: "imported.user@university.edu",
          userType: "Student",
          borrows: "No eBook borrowed",
          mobileAccess: true,
          status: "Active",
          joinDate: "2026-07-11",
          department: "Computer Science",
        };

        setUsers([importedUser, ...users]);
        setUploadFile(null);
        setUploadProgress(null);
        setIsUploadOpen(false);
        setPage(1);
        toast.success(`Spreadsheet upload completed! Imported user successfully.`);
      }
    }, 150);
  };

  // Helper for generating initial-based user avatars
  const getUserInitials = (name: string) => {
    const parts = name.split(" ").filter((p) => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return "U";
  };

  if (isViewOpen) {
    return (
      <AppShell title="Library User Details">
        <div className="p-4 md:p-8 space-y-6">
          {/* Back button */}
          <button
            onClick={() => {
              setIsViewOpen(false);
              setSelectedUser(null);
            }}
            className="flex items-center gap-2 text-sm font-normal text-slate-700 dark:text-slate-200 hover:text-foreground mb-4 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Users
          </button>

          {/* Main Card Container */}
          <form
            onSubmit={handleUpdateDetailsSubmit}
            className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6"
          >
            {/* Header: Avatar and User Type Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/80">
              <div className="relative h-20 w-20 shrink-0">
                <div
                  className={`flex h-full w-full items-center justify-center rounded-full border-2 border-background shadow-md transition-colors ${
                    editUserType === "Staff"
                      ? "bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/25 dark:text-indigo-400"
                      : "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400"
                  }`}
                >
                  {editUserType === "Staff" ? (
                    <UserCog size={36} strokeWidth={2} />
                  ) : (
                    <GraduationCap size={36} strokeWidth={2} />
                  )}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border text-foreground shadow-sm hover:bg-secondary transition-transform hover:scale-105 cursor-pointer"
                  title="Upload Photo"
                >
                  <Camera size={14} />
                </button>
              </div>

              {/* User Type Display with border/label */}
              <div className="w-56 self-start sm:self-center">
                <span className="mb-1.5 block text-sm font-medium text-foreground">User Type</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-14 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground outline-none transition-colors hover:bg-secondary/40 focus:border-[var(--brand)] shadow-sm">
                      <UserTypeBadge type={editUserType} />
                      <ChevronDown size={16} className="text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[224px] bg-card border border-border rounded-xl shadow-lg z-50 p-1.5 space-y-1">
                    <DropdownMenuItem
                      onClick={() => setEditUserType("Student")}
                      className={`flex items-center justify-between px-3 py-2 text-sm transition-colors cursor-pointer rounded-lg ${
                        editUserType === "Student" 
                          ? "bg-secondary font-semibold text-foreground" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <UserTypeBadge type="Student" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setEditUserType("Staff")}
                      className={`flex items-center justify-between px-3 py-2 text-sm transition-colors cursor-pointer rounded-lg ${
                        editUserType === "Staff" 
                          ? "bg-secondary font-semibold text-foreground" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <UserTypeBadge type="Staff" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Library User Details Section */}
            <div className="space-y-4">
              {editUserType === "Student" ? (
                <div className="space-y-5">
                  {/* Row 1: Name & University */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-foreground">Name<span className="text-red-500">*</span></span>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                        required
                      />
                    </div>

                    {/* University / Institute */}
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-foreground">University / Institute<span className="text-red-500">*</span></span>
                      <input
                        type="text"
                        value={editUniv}
                        onChange={(e) => setEditUniv(e.target.value)}
                        className="h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Student ID, Enrollment ID, Enrollment Date */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Student ID */}
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-foreground">Student ID<span className="text-red-500">*</span></span>
                      <input
                        type="text"
                        value={editStudentId}
                        disabled
                        className="h-14 w-full rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-secondary/15 px-4 text-sm font-semibold text-muted-foreground cursor-not-allowed"
                      />
                    </div>

                    {/* Enrollment ID */}
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-foreground">Enrollment ID<span className="text-red-500">*</span></span>
                      <input
                        type="text"
                        value={editEnrollmentId}
                        onChange={(e) => setEditEnrollmentId(e.target.value)}
                        placeholder="Enter Enrollment ID"
                        className="h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                      />
                    </div>

                    {/* Enrollment Date */}
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-foreground">Enrollment Date</span>
                      <div className="relative">
                        <input
                          type="text"
                          value={editEnrollmentDate}
                          onChange={(e) => setEditEnrollmentDate(e.target.value)}
                          className="h-14 w-full rounded-xl border border-border bg-card px-4 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                        />
                        <Calendar
                          size={16}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Course & Batch */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Course Selection */}
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-foreground">Course<span className="text-red-500">*</span></span>
                      <div className="relative">
                        <select
                          value={editCourse}
                          onChange={(e) => setEditCourse(e.target.value)}
                          className="h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)]"
                        >
                          <option value="B.Com (CA)">B.Com (CA)</option>
                          <option value="B.Sc (CS)">B.Sc (CS)</option>
                          <option value="B.Tech (IT)">B.Tech (IT)</option>
                          <option value="M.B.A">M.B.A</option>
                          <option value="Administration">Administration</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                      </div>
                    </div>

                    {/* Batch Selection */}
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-foreground">Batch<span className="text-red-500">*</span></span>
                      <div className="relative">
                        <select
                          value={editBatch}
                          onChange={(e) => setEditBatch(e.target.value)}
                          className="h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)]"
                        >
                          <option value="2025,2029">2025,2029</option>
                          <option value="2024,2028">2024,2028</option>
                          <option value="2023,2027">2023,2027</option>
                          <option value="2022,2026">2022,2026</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Row 1: Name & University */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-foreground">Name<span className="text-red-500">*</span></span>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                        required
                      />
                    </div>

                    {/* University / Institute */}
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-foreground">University / Institute<span className="text-red-500">*</span></span>
                      <input
                        type="text"
                        value={editUniv}
                        onChange={(e) => setEditUniv(e.target.value)}
                        className="h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Department & Staff ID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Department */}
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-foreground">Department<span className="text-red-500">*</span></span>
                      <div className="relative">
                        <select
                          value={editCourse}
                          onChange={(e) => setEditCourse(e.target.value)}
                          className="h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)]"
                        >
                          <option value="Accountancy">Accountancy</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Electrical Engineering">Electrical Engineering</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Business Administration">Business Administration</option>
                          <option value="Physics">Physics</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="Humanities">Humanities</option>
                          <option value="Economics">Economics</option>
                          <option value="Biotechnology">Biotechnology</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                      </div>
                    </div>

                    {/* Staff ID */}
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-foreground">Staff ID<span className="text-red-500">*</span></span>
                      <input
                        type="text"
                        value={editStudentId}
                        disabled
                        className="h-14 w-full rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-secondary/15 px-4 text-sm font-semibold text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Details Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-foreground">Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Address */}
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Address</span>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder={`Enter ${editUserType} Address`}
                    className="h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                  />
                </div>

                {/* Pin Code */}
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Pin Code</span>
                  <input
                    type="text"
                    value={editPinCode}
                    onChange={(e) => setEditPinCode(e.target.value)}
                    placeholder="Enter Pin Code"
                    className="h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                  />
                </div>

                {/* Email */}
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder={`Enter ${editUserType} Email`}
                    className="h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Phone Number</span>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder={`Enter ${editUserType} Phone Number`}
                    className="h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsViewOpen(false);
                  setSelectedUser(null);
                }}
                className="h-12 rounded-xl border border-border bg-background px-6 text-sm font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-12 rounded-xl bg-[var(--brand)] text-white px-6 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
              >
                {selectedUser ? "Update Details" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Library Users"
      subtitle="Manage university library users, mobile access, and borrowing active statuses."
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedUser(null);
                setEditName("");
                setEditUserType("Student");
                setEditUniv("Pixelbooks Library");
                setEditStudentId(""); // Let it be disabled or empty for new user
                setEditEnrollmentId("");
                setEditEnrollmentDate("");
                setEditCourse("B.Com (CA)");
                setEditBatch("2025,2029");
                setEditAddress("");
                setEditPinCode("");
                setEditEmail("");
                setEditPhone("");
                setIsViewOpen(true);
              }}
              className="h-10 rounded-lg bg-[var(--brand)] text-white px-4 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              Add User
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="h-10 rounded-lg border border-border bg-white dark:bg-card px-4 text-xs font-semibold text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={15} />
              Import
            </button>
          </div>
        </div>

        {/* Redesigned Unified Toolbar */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
          {/* Left Side: Status, Type Dropdowns + Search Input */}
          <div className="flex flex-wrap items-center gap-3 flex-1 w-full lg:max-w-4xl">
            {/* Status Dropdown Filter */}
            <DropdownSelect
              value={statusFilter === "All" ? "All Statuses" : `${statusFilter} Users`}
              options={["All Statuses", "Active Users", "Inactive Users"]}
              onChange={(label) => {
                if (label === "All Statuses") setStatusFilter("All");
                else if (label === "Active Users") setStatusFilter("Active");
                else if (label === "Inactive Users") setStatusFilter("Inactive");
                setPage(1);
              }}
              searchable
              searchPlaceholder="Search status..."
              className="w-full sm:w-auto min-w-[150px]"
            />

            {/* Type Dropdown Filter */}
            <DropdownSelect
              value={typeFilter === "All" ? "All Types" : `${typeFilter}s`}
              options={["All Types", "Staffs", "Students"]}
              onChange={(label) => {
                if (label === "All Types") setTypeFilter("All");
                else if (label === "Staffs") setTypeFilter("Staff");
                else if (label === "Students") setTypeFilter("Student");
                setPage(1);
              }}
              searchable
              searchPlaceholder="Search type..."
              className="w-full sm:w-auto min-w-[150px]"
            />

            {/* Search Input Box */}
            <div className="relative w-full sm:w-60">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-lg border border-border bg-white dark:bg-card pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] text-foreground"
              />
            </div>
          </div>

          {/* Right Side: Date Presets & Custom Date Pickers (filters Join Date) */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center md:gap-3 w-full lg:w-auto shrink-0">
            {/* Preset Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setPresetOpen((v) => !v)}
                className="flex h-11 w-full items-center justify-between gap-6 rounded-lg border border-border bg-card px-3 text-sm font-medium sm:w-40 text-foreground cursor-pointer"
              >
                <span>{preset}</span>
                <ChevronDown size={15} className="text-muted-foreground" />
              </button>
              {presetOpen && (
                <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-40">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePresetSelect(p)}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                        p === preset ? "font-medium text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Dates Container */}
            <div className="flex items-center gap-2">
              <label className="relative flex h-10 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full sm:w-36">
                <input
                  type="date"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setPreset("Custom");
                    setPage(1);
                  }}
                  className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                />
              </label>

              <span className="text-muted-foreground text-xs font-semibold self-center">to</span>

              <label className="relative flex h-10 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full sm:w-36">
                <input
                  type="date"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    setPreset("Custom");
                    setPage(1);
                  }}
                  className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Users Table Container */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-4 font-semibold">Users</th>
                  <th className="pb-3 px-4 font-semibold">User Type</th>
                  <th className="pb-3 px-4 font-semibold">Borrows</th>
                  <th className="pb-3 px-4 font-semibold text-center">Mobile Access</th>
                  <th className="pb-3 px-4 font-semibold text-center">Enable/Disable</th>
                  <th className="pb-3 pl-4 font-semibold text-right pr-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No library users match your filters.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => handleOpenEditDetails(u)}
                      className="group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/40"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 pr-4 font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-2xs border border-border/80 ${
                              u.userType === "Staff"
                                ? "bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/25 dark:text-indigo-400"
                                : "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400"
                            }`}
                          >
                            {u.userType === "Staff" ? (
                              <UserCog size={17} strokeWidth={2} />
                            ) : (
                              <GraduationCap size={17} strokeWidth={2} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate text-sm">
                              {u.name}
                            </p>
                            <p className="text-muted-foreground text-[10px] truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* User Type */}
                      <td className="py-3.5 px-4">
                        <UserTypeBadge type={u.userType} />
                      </td>

                      {/* Borrows */}
                      <td className="py-3.5 px-4 text-muted-foreground text-xs font-medium">
                        {u.borrows}
                      </td>

                      {/* Mobile Access Switch Toggle */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={u.mobileAccess}
                            onCheckedChange={() => handleMobileAccessToggle(u.id, u.mobileAccess)}
                          />
                        </div>
                      </td>

                      {/* Status Toggle switch */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={u.status === "Active"}
                            onCheckedChange={() => handleStatusToggle(u.id, u.status)}
                          />
                        </div>
                      </td>

                      {/* Action Chevron */}
                      <td className="py-3.5 pr-6 text-right">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                          <ChevronRight size={16} />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-4">
              <span className="text-xs text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + PAGE_SIZE, totalResults)} of{" "}
                {totalResults} results
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-white dark:bg-card px-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  const isPageActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isPageActive
                          ? "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800"
                          : "bg-white dark:bg-card text-muted-foreground border-border hover:bg-secondary/40 hover:text-foreground"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-white dark:bg-card px-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add User Modal Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-xl shadow-xl p-6">
            <div className="border-b border-border pb-4 mb-4">
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                Add Library User
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Register a new member in the library system database.
              </DialogDescription>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-5 text-sm mt-6">
              <div>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Full Name</span>
                <input
                  type="text"
                  placeholder="e.g. JOHN DOE"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                  required
                />
              </div>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Email Address</span>
                <input
                  type="email"
                  placeholder="e.g. john.doe@university.edu"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                  required
                />
              </div>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-foreground">User Type</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="flex h-14 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground outline-none transition-colors hover:bg-secondary/40 focus:border-[var(--brand)] shadow-sm">
                      <UserTypeBadge type={addUserType} />
                      <ChevronDown size={16} className="text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[224px] bg-card border border-border rounded-xl shadow-lg z-50 p-1.5 space-y-1">
                    <DropdownMenuItem
                      onClick={() => setAddUserType("Student")}
                      className={`flex items-center justify-between px-3 py-2 text-sm transition-colors cursor-pointer rounded-lg ${
                        addUserType === "Student" 
                          ? "bg-secondary font-semibold text-foreground" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <UserTypeBadge type="Student" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setAddUserType("Staff")}
                      className={`flex items-center justify-between px-3 py-2 text-sm transition-colors cursor-pointer rounded-lg ${
                        addUserType === "Staff" 
                          ? "bg-secondary font-semibold text-foreground" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <UserTypeBadge type="Staff" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Department</span>
                <div className="relative">
                  <select
                    value={addDept}
                    onChange={(e) => setAddDept(e.target.value)}
                    className="h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)]"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-border mt-6">
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-[var(--brand)] text-white px-6 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                >
                  Add User Request
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Import User Modal Dialog */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-xl bg-card border border-border rounded-xl shadow-xl p-6">
            <div className="border-b border-border pb-4 mb-4">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Upload Users List for Bulk Registration
              </DialogTitle>
            </div>

            <div className="text-sm text-foreground/80 space-y-2.5 mb-6">
              <p className="flex items-center gap-1.5 flex-wrap">
                <span>1. Download the sample users template (Excel)</span>
                <button
                  type="button"
                  onClick={() => toast.success("Sample template downloaded successfully!")}
                  className="text-blue-600 hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                >
                  Download
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              </p>
              <p>2. Fill in the member details as per the format.</p>
              <p>3. Upload the completed template file below.</p>
              <p>4. Review and confirm import before submission.</p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  uploadDragging
                    ? "border-[var(--brand)] bg-[var(--sidebar-highlight)]/30 scale-[1.01]"
                    : "border-slate-300 dark:border-border/60 bg-secondary/5 hover:bg-secondary/20"
                }`}
              >
                <input
                  type="file"
                  id="csv-file-input"
                  accept=".csv, .xlsx"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-16 w-16 text-slate-300 dark:text-muted-foreground/60"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m15 15-3-3-3 3" />
                  </svg>
                  <span className="text-blue-600 hover:underline font-medium text-sm mt-1">
                    Click to upload
                  </span>
                </div>
              </div>

              {uploadFile && (
                <div className="rounded-lg border border-border p-3 flex items-center justify-between bg-white dark:bg-card">
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText size={18} className="text-[var(--brand)] shrink-0" />
                    <div className="truncate text-xs">
                      <p className="font-semibold text-foreground truncate">{uploadFile.name}</p>
                      <p className="text-muted-foreground text-[10px]">
                        {(uploadFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadFile(null)}
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* Upload animation progress */}
              {uploadProgress !== null && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Importing and verifying members...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand)] transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end border-t border-border pt-4 mt-2">
                <button
                  type="submit"
                  disabled={!uploadFile || uploadProgress !== null}
                  className="h-10 rounded-lg bg-[var(--brand)] text-white px-5 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed dark:disabled:bg-border dark:disabled:text-muted-foreground cursor-pointer"
                >
                  Upload & Continue
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
