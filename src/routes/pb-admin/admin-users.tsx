import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Check,
  ShieldCheck,
  UserCog,
  Crown,
  ChevronsLeft,
  ChevronsRight,
  Send,
  UserCheck,
  Clock,
  UserX,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function AdminUserAvatar({
  avatarUrl,
  name,
  permissions = [],
  size = "md",
}: {
  avatarUrl?: string;
  name: string;
  permissions?: string[];
  size?: "md" | "lg";
}) {
  if (avatarUrl) {
    const sizeClasses = size === "lg" ? "h-14 w-14" : "h-10 w-10";
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses} shrink-0 rounded-full object-cover ring-1 ring-border shadow-xs`}
      />
    );
  }

  const isSuperAdmin = permissions.includes("all_access");

  if (size === "lg") {
    return isSuperAdmin ? (
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-500/12 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-500/20 shadow-2xs transition-transform group-hover:scale-105"
        title="Super Admin (All Access)"
      >
        <Crown size={26} />
      </div>
    ) : (
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-500/12 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20 shadow-2xs transition-transform group-hover:scale-105"
        title="Admin User"
      >
        <UserCog size={26} />
      </div>
    );
  }

  return isSuperAdmin ? (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/12 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-500/20 shadow-2xs transition-transform group-hover:scale-105"
      title="Super Admin (All Access)"
    >
      <Crown size={18} />
    </div>
  ) : (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/12 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20 shadow-2xs transition-transform group-hover:scale-105"
      title="Admin User"
    >
      <UserCog size={18} />
    </div>
  );
}

export const Route = createFileRoute("/pb-admin/admin-users")({
  head: () => ({
    meta: [
      { title: "Manage Admin Users — PixelBooks Admin" },
      {
        name: "description",
        content: "View and manage administrator accounts, role permissions, and access levels in PixelBooks Admin.",
      },
    ],
  }),
  component: ManageAdminUsersPage,
});

type StatusValue = "All" | "Enabled" | "Disabled" | "Pending";
type RoleFilterValue = "All Roles" | "All Access" | "Catalogue" | "People" | "Authors" | "Reports" | "Marketing" | "Banners" | "Quizzes & Rewards";

interface PermissionSection {
  id: string;
  label: string;
  subItems?: { id: string; label: string }[];
}

const MENU_SECTIONS: PermissionSection[] = [
  { id: "dashboard", label: "Dashboard" },
  {
    id: "catalogue",
    label: "Catalogue",
    subItems: [
      { id: "titles", label: "Titles" },
      { id: "bundles", label: "Bundles" },
      { id: "categories", label: "Categories" },
      { id: "featured_collections", label: "Featured Collections" },
    ],
  },
  {
    id: "people",
    label: "People",
    subItems: [
      { id: "publisher_author", label: "Publisher/Author" },
      { id: "customers", label: "Customers" },
      { id: "admin_users", label: "Admin Users" },
    ],
  },
  {
    id: "authors",
    label: "Authors",
    subItems: [
      { id: "author_management", label: "Author Management" },
      { id: "merge_authors", label: "Merge Authors" },
    ],
  },
  {
    id: "pricing_promotions",
    label: "Pricing & Promotions",
    subItems: [
      { id: "commission_rates", label: "Commission Rates" },
      { id: "promo_codes", label: "Promo Codes" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    subItems: [
      { id: "margin_royalty_report", label: "Margin/Royalty Report" },
      { id: "sales_report", label: "Sales Report" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    subItems: [
      { id: "analytics_view", label: "View (Analytics)" },
      { id: "analytics_cart_views", label: "Abandoned Carts (Analytics)" },
      { id: "analytics_cart_analysis", label: "Book Cart Analysis (Analytics)" },
    ],
  },
  {
    id: "marketing_growth",
    label: "Marketing",
    subItems: [
      { id: "marketing_schema_meta", label: "Schema & Meta (Marketing)" },
      { id: "marketing_sitemap", label: "Sitemap (Marketing)" },
      { id: "audit_log", label: "Audit Log" },
    ],
  },
  {
    id: "banners",
    label: "Banners",
    subItems: [
      { id: "image_banners", label: "Image Banners" },
      { id: "popup_banners", label: "Popup Banners" },
    ],
  },
  {
    id: "quizzes_rewards",
    label: "Quizzes & Rewards",
    subItems: [
      { id: "quizzes", label: "Quizzes" },
      { id: "promo_codes", label: "Promo Codes" },
    ],
  },
];

const ALL_LEAF_IDS = [
  "all_access",
  ...MENU_SECTIONS.flatMap((sec) =>
    sec.subItems ? sec.subItems.map((s) => s.id) : [sec.id]
  ),
];

interface AdminUser {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  status: "Enabled" | "Disabled";
  permissions: string[];
  avatarUrl?: string;
  avatarBg?: string;
  invitationPending?: boolean;
}

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-1",
    name: "Abu",
    email: "aaboolbacker189@gmail.com",
    joinedDate: "15 Jul 2026",
    status: "Enabled",
    permissions: ["dashboard", "customers"],
    avatarBg: "oklch(0.55 0.11 195)",
  },
  {
    id: "admin-2",
    name: "Fidha",
    email: "reshma.qabo+15454@gmail.com",
    joinedDate: "10 Jul 2026",
    status: "Enabled",
    permissions: ["margin_royalty_report", "sales_report", "marketing_schema_meta"],
    avatarBg: "oklch(0.60 0.18 30)",
  },
  {
    id: "admin-3",
    name: "saniga+brandoptics+0...",
    email: "saniga+brandoptics+01@gmail.com",
    joinedDate: "07 Jul 2026",
    status: "Enabled",
    permissions: ALL_LEAF_IDS,
    avatarBg: "oklch(0.55 0.13 260)",
    invitationPending: true,
  },
  {
    id: "admin-4",
    name: "tinu",
    email: "reshma.qabo+1565@gmail.com",
    joinedDate: "07 Jul 2026",
    status: "Enabled",
    permissions: ["titles", "bundles", "categories"],
    avatarBg: "oklch(0.62 0.15 155)",
  },
  {
    id: "admin-5",
    name: "asani",
    email: "saniga@brandoptics.com",
    joinedDate: "10 Jul 2026",
    status: "Enabled",
    permissions: ["customers"],
    avatarBg: "oklch(0.45 0.12 280)",
  },
  {
    id: "admin-6",
    name: "Sithara",
    email: "reshma.qabo+154996@gmail.com",
    joinedDate: "18 Jun 2026",
    status: "Enabled",
    permissions: ALL_LEAF_IDS,
    avatarBg: "oklch(0.50 0.15 20)",
  },
  {
    id: "admin-7",
    name: "Anita",
    email: "reshma.qabo+177126@gmail.com",
    joinedDate: "18 Jun 2026",
    status: "Enabled",
    permissions: ALL_LEAF_IDS,
    avatarBg: "oklch(0.58 0.14 180)",
  },
  {
    id: "admin-8",
    name: "Orama Samuel",
    email: "zakaraha.lazaro@dropons.com",
    joinedDate: "27 May 2026",
    status: "Enabled",
    permissions: ALL_LEAF_IDS,
    avatarBg: "oklch(0.65 0.16 85)",
  },
  {
    id: "admin-9",
    name: "Hari",
    email: "reshma.qabo+11555@gmail.com",
    joinedDate: "25 May 2026",
    status: "Enabled",
    permissions: ALL_LEAF_IDS,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  },
  {
    id: "admin-10",
    name: "Aji",
    email: "reshma.qabo+285855@gmail.com",
    joinedDate: "19 May 2026",
    status: "Enabled",
    permissions: ALL_LEAF_IDS,
    avatarBg: "oklch(0.48 0.11 230)",
  },
];

function CustomCheckbox({ checked, className = "" }: { checked: boolean; className?: string }) {
  return (
    <div
      className={`h-4.5 w-4.5 shrink-0 rounded-md border flex items-center justify-center transition-all ${checked
        ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-xs"
        : "border-border bg-card"
        } ${className}`}
    >
      {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
    </div>
  );
}

function ManageAdminUsersPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusValue>("All");
  const [roleFilter, setRoleFilter] = useState<RoleFilterValue>("All Roles");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog states
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [isManageAccessOpen, setIsManageAccessOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Form states for Modal
  const [modalEmail, setModalEmail] = useState("");
  const [modalName, setModalName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const itemsPerPage = 10;
  const simulatedTotalBase = 105;

  const filteredAdmins = useMemo(() => {
    return adminUsers.filter((user) => {
      if (statusFilter === "Enabled" && (user.status !== "Enabled" || user.invitationPending)) return false;
      if (statusFilter === "Disabled" && user.status !== "Disabled") return false;
      if (statusFilter === "Pending" && !user.invitationPending) return false;

      const isAllAccess = ALL_LEAF_IDS.every((id) => user.permissions.includes(id));
      if (roleFilter === "All Access" && !isAllAccess) return false;
      if (roleFilter === "Catalogue" && !user.permissions.some((p) => ["titles", "bundles", "categories"].includes(p))) return false;
      if (roleFilter === "People" && !user.permissions.some((p) => ["publisher_author", "customers", "admin_users"].includes(p))) return false;
      if (roleFilter === "Authors" && !user.permissions.some((p) => ["author_management", "merge_authors"].includes(p))) return false;
      if (roleFilter === "Reports" && !user.permissions.some((p) => ["margin_royalty_report", "sales_report"].includes(p))) return false;
      if (roleFilter === "Marketing" && !user.permissions.some((p) => ["marketing_schema_meta", "marketing_sitemap", "audit_log"].includes(p))) return false;
      if (roleFilter === "Banners & Engagement" && !user.permissions.some((p) => ["image_banners", "popup_banners", "quizzes_rewards"].includes(p))) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(query);
        const matchesEmail = user.email.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) return false;
      }

      return true;
    });
  }, [adminUsers, searchQuery, statusFilter, roleFilter]);

  const stats = useMemo(() => {
    const total = simulatedTotalBase;
    const superAdmins = adminUsers.filter((u) => ALL_LEAF_IDS.every((id) => u.permissions.includes(id))).length + 38;
    const pendingInvites = adminUsers.filter((u) => u.invitationPending).length + 2;
    const disabledCount = adminUsers.filter((u) => u.status === "Disabled").length + 6;
    return { total, superAdmins, pendingInvites, disabledCount };
  }, [adminUsers]);

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage) || 1;

  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAdmins.slice(start, start + itemsPerPage);
  }, [filteredAdmins, currentPage, itemsPerPage]);

  const handleToggleStatus = (adminId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAdminUsers((prev) =>
      prev.map((u) => {
        if (u.id === adminId) {
          const nextStatus = u.status === "Enabled" ? "Disabled" : "Enabled";
          toast.success(`Status updated for ${u.name}`, {
            description: `Admin user is now ${nextStatus}.`,
          });
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleOpenManageAccess = (admin: AdminUser, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedAdmin(admin);
    setModalName(admin.name);
    setModalEmail(admin.email);
    setSelectedPermissions([...admin.permissions]);
    setIsManageAccessOpen(true);
  };

  const handleOpenAddUser = () => {
    setSelectedAdmin(null);
    setModalName("");
    setModalEmail("");
    setSelectedPermissions([]);
    setIsAddUserOpen(true);
  };

  const handleResendInvitation = (admin: AdminUser, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toast.success(`Invitation resent to ${admin.email}`);
  };

  // Permission selection logic
  const isAllAccessChecked = useMemo(() => {
    return ALL_LEAF_IDS.every((id) => selectedPermissions.includes(id));
  }, [selectedPermissions]);

  const toggleAllAccess = () => {
    if (isAllAccessChecked) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions([...ALL_LEAF_IDS]);
    }
  };

  const isSectionChecked = (sec: PermissionSection) => {
    if (isAllAccessChecked) return true;
    if (!sec.subItems) return selectedPermissions.includes(sec.id);
    return sec.subItems.every((sub) => selectedPermissions.includes(sub.id));
  };

  const toggleSection = (sec: PermissionSection) => {
    const subIds = sec.subItems ? sec.subItems.map((s) => s.id) : [sec.id];
    const currentlyChecked = isSectionChecked(sec);

    if (currentlyChecked) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !subIds.includes(id) && id !== "all_access")
      );
    } else {
      const newPerms = Array.from(new Set([...selectedPermissions, ...subIds]));
      if (ALL_LEAF_IDS.filter((id) => id !== "all_access").every((id) => newPerms.includes(id))) {
        setSelectedPermissions([...ALL_LEAF_IDS]);
      } else {
        setSelectedPermissions(newPerms);
      }
    }
  };

  const isSinglePermissionChecked = (id: string) => {
    return isAllAccessChecked || selectedPermissions.includes(id);
  };

  const toggleSinglePermission = (id: string) => {
    if (isSinglePermissionChecked(id)) {
      setSelectedPermissions((prev) => prev.filter((p) => p !== id && p !== "all_access"));
    } else {
      const next = Array.from(new Set([...selectedPermissions, id]));
      if (ALL_LEAF_IDS.filter((i) => i !== "all_access").every((i) => next.includes(i))) {
        setSelectedPermissions([...ALL_LEAF_IDS]);
      } else {
        setSelectedPermissions(next);
      }
    }
  };

  const handleSaveAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAdmin) {
      setAdminUsers((prev) =>
        prev.map((u) =>
          u.id === selectedAdmin.id
            ? { ...u, permissions: selectedPermissions, email: modalEmail }
            : u
        )
      );
      toast.success(`Privileges updated for ${selectedAdmin.name}`);
      setIsManageAccessOpen(false);
      setSelectedAdmin(null);
    } else {
      if (!modalEmail.trim()) {
        toast.error("Please enter email address.");
        return;
      }
      const newAdmin: AdminUser = {
        id: `admin-${Date.now()}`,
        name: modalName.trim() || modalEmail.split("@")[0],
        email: modalEmail.trim(),
        joinedDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: "Enabled",
        permissions: selectedPermissions,
        avatarBg: "var(--brand)",
        invitationPending: true,
      };
      setAdminUsers((prev) => [newAdmin, ...prev]);
      toast.success(`Invitation sent to ${newAdmin.email}`);
      setIsAddUserOpen(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const statusLabel =
    statusFilter === "All"
      ? "All Status"
      : statusFilter === "Enabled"
        ? "Enabled"
        : statusFilter === "Disabled"
          ? "Disabled"
          : "Pending";

  return (
    <AppShell title="Manage Admin Users" subtitle="Grant and manage administrative panel access, permissions, and roles">
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">

        {/* Summary Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between min-h-[120px] rounded-xl border border-border bg-card p-5 shadow-2xs transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Admins
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <UserCog size={18} />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-foreground">{stats.total}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Active team & admin accounts</p>
            </div>
          </div>

          <div className="flex flex-col justify-between min-h-[120px] rounded-xl border border-border bg-card p-5 shadow-2xs transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Super Admins
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Crown size={18} />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-foreground">{stats.superAdmins}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Unrestricted system access</p>
            </div>
          </div>

          <div className="flex flex-col justify-between min-h-[120px] rounded-xl border border-border bg-card p-5 shadow-2xs transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Invites
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock size={18} />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-foreground">{stats.pendingInvites}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Awaiting user acceptance</p>
            </div>
          </div>

          <div className="flex flex-col justify-between min-h-[120px] rounded-xl border border-border bg-card p-5 shadow-2xs transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Disabled Accounts
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <UserX size={18} />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-foreground">{stats.disabledCount}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Access temporarily revoked</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
          </div>

          {/* Controls Right Side */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Status Filter Dropdown */}
            <DropdownSelect
              value={statusLabel}
              options={["All Status", "Enabled", "Disabled"]}
              onChange={(v) => {
                if (v === "All Status") setStatusFilter("All");
                else if (v === "Enabled") setStatusFilter("Enabled");
                else if (v === "Disabled") setStatusFilter("Disabled");
                setCurrentPage(1);
              }}
              searchable
              searchPlaceholder="Search status..."
              className="w-full sm:w-auto min-w-[140px]"
            />

            {/* + Add Admin User Button */}
            <button
              type="button"
              onClick={handleOpenAddUser}
              className="inline-flex h-11 items-center gap-2 rounded-lg px-5 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer shrink-0"
              style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Admin User</span>
            </button>
          </div>
        </div>

        {/* Admin Users Table Container */}
        <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 px-6 w-[36%] font-semibold">Admin User</th>
                  <th className="py-4 px-6 w-[18%] font-semibold">Joined Date</th>
                  <th className="py-4 px-6 w-[14%] text-center font-semibold">Enable/Disable</th>
                  <th className="py-4 px-6 w-[32%] text-center font-semibold">Manage Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedAdmins.length > 0 ? (
                  paginatedAdmins.map((user) => (
                    <tr
                      key={user.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      {/* Admin User Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <AdminUserAvatar avatarUrl={user.avatarUrl} name={user.name} permissions={user.permissions} />
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-foreground text-sm group-hover:text-[var(--brand)] transition-colors truncate">
                              {user.name}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </span>
                            {user.invitationPending && (
                              <button
                                type="button"
                                onClick={(e) => handleResendInvitation(user, e)}
                                className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] font-medium text-rose-500 hover:text-rose-600 hover:underline cursor-pointer transition-colors w-fit"
                              >
                                <Send size={11} /> Resend Invitation
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Joined Date Column */}
                      <td className="py-4 px-6 text-foreground font-medium text-xs sm:text-sm">
                        {user.joinedDate}
                      </td>

                      {/* Status Column (Clean Toggle Switch) */}
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center justify-center">
                          <Switch
                            checked={user.status === "Enabled" && !user.invitationPending}
                            onCheckedChange={() => handleToggleStatus(user.id)}
                            className="data-[state=checked]:bg-[var(--brand)]"
                            aria-label={`Toggle status for ${user.name}`}
                          />
                        </div>
                      </td>

                      {/* Manage Role Column */}
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={(e) => handleOpenManageAccess(user, e)}
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                          style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                        >
                          <ShieldCheck size={14} />
                          <span>Manage Access</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ShieldCheck size={32} className="text-muted-foreground/50" />
                        <p className="text-base font-medium">No admin users found</p>
                        <p className="text-xs">Try adjusting your search query or filter options.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
          <div className="text-xs sm:text-sm text-foreground font-normal">
            Showing <span className="font-semibold">{paginatedAdmins.length}</span> from{" "}
            <span className="font-semibold">
              {searchQuery || statusFilter !== "All" || roleFilter !== "All Roles"
                ? filteredAdmins.length
                : simulatedTotalBase}
            </span>{" "}
            results
          </div>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronsLeft size={15} />
              Previous
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${isActive
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Next
              <ChevronsRight size={15} />
            </button>
          </div>
        </div>

        {/* Modal: Set Admin User Permissions (Full Left Menu Items) */}
        <Dialog
          open={isManageAccessOpen || isAddUserOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsManageAccessOpen(false);
              setIsAddUserOpen(false);
              setSelectedAdmin(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-2xl rounded-2xl bg-card border-border p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {isAddUserOpen ? "Create Admin User" : "Set Admin User Permissions"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {isAddUserOpen
                  ? "Enter email address and select initial module access permissions."
                  : "Configure module privileges and access permissions for this administrator."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveAccessSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Email<span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground outline-none transition-colors focus:border-[var(--brand)]"
                />
              </div>

              {/* All Access Main Bar */}
              <div
                onClick={toggleAllAccess}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer select-none ${isAllAccessChecked
                  ? "border-purple-500/40 bg-purple-500/8 dark:bg-purple-500/15 shadow-2xs"
                  : "border-border bg-card hover:bg-secondary/40"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <CustomCheckbox checked={isAllAccessChecked} />
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${isAllAccessChecked ? "text-purple-600 dark:text-purple-400" : "text-foreground"}`}>
                      All Access {isAllAccessChecked ? "(Super Admin)" : ""}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Grants full unrestricted administrative privileges to all portal features
                    </span>
                  </div>
                </div>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isAllAccessChecked
                      ? "bg-purple-500/12 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/20 shadow-2xs"
                      : "bg-amber-500/12 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20 shadow-2xs"
                  }`}
                  title={isAllAccessChecked ? "Super Admin" : "Admin User"}
                >
                  {isAllAccessChecked ? <Crown size={18} /> : <UserCog size={18} />}
                </span>
              </div>              {/* Permissions Checkbox Grid (Full Left Sidebar Items) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {/* Left Column (Sections 0 to 3) */}
                <div className="space-y-5">
                  {MENU_SECTIONS.slice(0, 4).map((sec) => {
                    const checked = isSectionChecked(sec);
                    return (
                      <div key={sec.id} className="space-y-2.5">
                        <div
                          onClick={() => toggleSection(sec)}
                          className="flex items-center gap-2.5 text-sm font-bold text-foreground cursor-pointer select-none"
                        >
                          <CustomCheckbox checked={checked} />
                          <span className={checked ? "text-[var(--brand)]" : "text-foreground"}>
                            {sec.label}
                          </span>
                        </div>
                        {sec.subItems && (
                          <div className="ml-7 space-y-2">
                            {sec.subItems.map((sub) => {
                              const subChecked = isSinglePermissionChecked(sub.id);
                              return (
                                <div
                                  key={sub.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSinglePermission(sub.id);
                                  }}
                                  className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none transition-colors"
                                >
                                  <CustomCheckbox checked={subChecked} className="h-4 w-4" />
                                  <span className={subChecked ? "text-foreground font-semibold" : ""}>
                                    {sub.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right Column (Sections 4 onwards) */}
                <div className="space-y-5">
                  {MENU_SECTIONS.slice(4).map((sec) => {
                    const checked = isSectionChecked(sec);
                    return (
                      <div key={sec.id} className="space-y-2.5">
                        <div
                          onClick={() => toggleSection(sec)}
                          className="flex items-center gap-2.5 text-sm font-bold text-foreground cursor-pointer select-none"
                        >
                          <CustomCheckbox checked={checked} />
                          <span className={checked ? "text-[var(--brand)]" : "text-foreground"}>
                            {sec.label}
                          </span>
                        </div>
                        {sec.subItems && (
                          <div className="ml-7 space-y-2">
                            {sec.subItems.map((sub) => {
                              const subChecked = isSinglePermissionChecked(sub.id);
                              return (
                                <div
                                  key={sub.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSinglePermission(sub.id);
                                  }}
                                  className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none transition-colors"
                                >
                                  <CustomCheckbox checked={subChecked} className="h-4 w-4" />
                                  <span className={subChecked ? "text-foreground font-semibold" : ""}>
                                    {sub.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsManageAccessOpen(false);
                    setIsAddUserOpen(false);
                  }}
                  className="h-10 px-5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-6 text-xs font-semibold shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  {isAddUserOpen && <Send size={14} />}
                  <span>{isAddUserOpen ? "Send Invitation" : "Update Privilege"}</span>
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </AppShell>
  );
}
