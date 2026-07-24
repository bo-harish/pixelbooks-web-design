import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Check,
  ShieldCheck,
  ChevronsLeft,
  ChevronsRight,
  Send,
  UserCheck,
  Clock,
  UserX,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
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

export type StatusValue = "All" | "Enabled" | "Disabled" | "Pending";
export type RoleFilterValue = "All Roles" | "All Access" | "Catalogue" | "People" | "Authors" | "Reports" | "Marketing & Growth" | "Banners & Engagement";

export interface PermissionSection {
  id: string;
  label: string;
  subItems?: { id: string; label: string }[];
}

export const MENU_SECTIONS: PermissionSection[] = [
  { id: "dashboard", label: "Dashboard" },
  {
    id: "catalogue",
    label: "Catalogue",
    subItems: [
      { id: "titles", label: "Titles" },
      { id: "bundles", label: "Bundles" },
      { id: "categories", label: "Categories" },
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
    id: "reports_analytics",
    label: "Reports & Analytics",
    subItems: [
      { id: "margin_royalty_report", label: "Margin/Royalty Report" },
      { id: "sales_report", label: "Sales (Analytics)" },
      { id: "analytics_view", label: "View (Analytics)" },
      { id: "analytics_cart_views", label: "Cart Views (Analytics)" },
    ],
  },
  {
    id: "marketing_growth",
    label: "Marketing & Growth",
    subItems: [
      { id: "marketing_schema_meta", label: "Schema & Meta (Marketing)" },
      { id: "marketing_sitemap", label: "Sitemap (Marketing)" },
      { id: "audit_log", label: "Audit Log" },
    ],
  },
  {
    id: "banners_engagement",
    label: "Banners & Engagement",
    subItems: [
      { id: "image_banners", label: "Image Banners" },
      { id: "popup_banners", label: "Popup Banners" },
      { id: "quizzes_rewards", label: "Quizzes & Rewards" },
    ],
  },
];

export const ALL_LEAF_IDS = [
  "all_access",
  ...MENU_SECTIONS.flatMap((sec) =>
    sec.subItems ? sec.subItems.map((s) => s.id) : [sec.id]
  ),
];

export interface AdminUser {
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
      className={`h-4.5 w-4.5 shrink-0 rounded-md border flex items-center justify-center transition-all ${
        checked
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
      if (roleFilter === "Marketing & Growth" && !user.permissions.some((p) => ["marketing_schema_meta", "marketing_sitemap", "audit_log"].includes(p))) return false;
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
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <ShieldCheck size={18} />
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
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <UserCheck size={18} />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-11 min-w-[130px] items-center justify-between gap-2.5 rounded-lg border border-border bg-card px-4 text-xs font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] cursor-pointer"
                >
                  <span className="truncate">{statusLabel}</span>
                  <ChevronDown size={15} className="shrink-0 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] rounded-lg bg-card border-border shadow-lg py-1">
                <DropdownMenuItem
                  onClick={() => {
                    setStatusFilter("All");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer ${
                    statusFilter === "All" ? "font-semibold text-foreground bg-[var(--sidebar-highlight)]" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <span>All Status</span>
                  {statusFilter === "All" && <Check size={14} className="text-[var(--brand)]" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setStatusFilter("Enabled");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer ${
                    statusFilter === "Enabled" ? "font-semibold text-foreground bg-[var(--sidebar-highlight)]" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Enabled
                  </span>
                  {statusFilter === "Enabled" && <Check size={14} className="text-[var(--brand)]" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setStatusFilter("Disabled");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer ${
                    statusFilter === "Disabled" ? "font-semibold text-foreground bg-[var(--sidebar-highlight)]" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                    Disabled
                  </span>
                  {statusFilter === "Disabled" && <Check size={14} className="text-[var(--brand)]" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
                <tr className="border-b border-border text-xs font-semibold text-foreground bg-muted/20">
                  <th className="py-4 px-6 w-[36%]">Admin User</th>
                  <th className="py-4 px-6 w-[18%]">Joined Date</th>
                  <th className="py-4 px-6 w-[14%] text-center">Status</th>
                  <th className="py-4 px-6 w-[32%] text-center">Manage Role</th>
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
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border shadow-xs"
                            />
                          ) : (
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs"
                              style={{ backgroundColor: user.avatarBg || "var(--brand)" }}
                            >
                              {getInitials(user.name)}
                            </div>
                          )}
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
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
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
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  isAllAccessChecked
                    ? "border-[var(--brand)] bg-[var(--sidebar-highlight)]"
                    : "border-border bg-card hover:bg-secondary/40"
                }`}
              >
                <CustomCheckbox checked={isAllAccessChecked} />
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${isAllAccessChecked ? "text-[var(--brand)]" : "text-foreground"}`}>
                    All Access
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Grants full unrestricted administrative privileges to all portal features
                  </span>
                </div>
              </div>

              {/* Permissions Checkbox Grid (Full Left Sidebar Items) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                
                {/* Left Column */}
                <div className="space-y-5">
                  {/* Dashboard */}
                  <div className="space-y-2">
                    <div
                      onClick={() => toggleSinglePermission("dashboard")}
                      className="flex items-center gap-2.5 text-sm font-bold text-foreground cursor-pointer select-none"
                    >
                      <CustomCheckbox checked={isSinglePermissionChecked("dashboard")} />
                      <span className={isSinglePermissionChecked("dashboard") ? "text-[var(--brand)]" : "text-foreground"}>
                        Dashboard
                      </span>
                    </div>
                  </div>

                  {/* Catalogue */}
                  {(() => {
                    const sec = MENU_SECTIONS.find((s) => s.id === "catalogue")!;
                    const checked = isSectionChecked(sec);
                    return (
                      <div className="space-y-2.5">
                        <div onClick={() => toggleSection(sec)} className="flex items-center gap-2.5 text-sm font-bold text-foreground cursor-pointer select-none">
                          <CustomCheckbox checked={checked} />
                          <span className={checked ? "text-[var(--brand)]" : "text-foreground"}>{sec.label}</span>
                        </div>
                        <div className="ml-7 space-y-2">
                          {sec.subItems?.map((sub) => {
                            const subChecked = isSinglePermissionChecked(sub.id);
                            return (
                              <div key={sub.id} onClick={(e) => { e.stopPropagation(); toggleSinglePermission(sub.id); }} className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none transition-colors">
                                <CustomCheckbox checked={subChecked} className="h-4 w-4" />
                                <span className={subChecked ? "text-foreground font-semibold" : ""}>{sub.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* People */}
                  {(() => {
                    const sec = MENU_SECTIONS.find((s) => s.id === "people")!;
                    const checked = isSectionChecked(sec);
                    return (
                      <div className="space-y-2.5">
                        <div onClick={() => toggleSection(sec)} className="flex items-center gap-2.5 text-sm font-bold text-foreground cursor-pointer select-none">
                          <CustomCheckbox checked={checked} />
                          <span className={checked ? "text-[var(--brand)]" : "text-foreground"}>{sec.label}</span>
                        </div>
                        <div className="ml-7 space-y-2">
                          {sec.subItems?.map((sub) => {
                            const subChecked = isSinglePermissionChecked(sub.id);
                            return (
                              <div key={sub.id} onClick={(e) => { e.stopPropagation(); toggleSinglePermission(sub.id); }} className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none transition-colors">
                                <CustomCheckbox checked={subChecked} className="h-4 w-4" />
                                <span className={subChecked ? "text-foreground font-semibold" : ""}>{sub.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Authors */}
                  {(() => {
                    const sec = MENU_SECTIONS.find((s) => s.id === "authors")!;
                    const checked = isSectionChecked(sec);
                    return (
                      <div className="space-y-2.5">
                        <div onClick={() => toggleSection(sec)} className="flex items-center gap-2.5 text-sm font-bold text-foreground cursor-pointer select-none">
                          <CustomCheckbox checked={checked} />
                          <span className={checked ? "text-[var(--brand)]" : "text-foreground"}>{sec.label}</span>
                        </div>
                        <div className="ml-7 space-y-2">
                          {sec.subItems?.map((sub) => {
                            const subChecked = isSinglePermissionChecked(sub.id);
                            return (
                              <div key={sub.id} onClick={(e) => { e.stopPropagation(); toggleSinglePermission(sub.id); }} className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none transition-colors">
                                <CustomCheckbox checked={subChecked} className="h-4 w-4" />
                                <span className={subChecked ? "text-foreground font-semibold" : ""}>{sub.label}</span>
                              </div>

                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  {/* Pricing & Promotions */}
                  {(() => {
                    const sec = MENU_SECTIONS.find((s) => s.id === "pricing_promotions")!;
                    const checked = isSectionChecked(sec);

                    return (
                      <div className="space-y-2.5">
                        <div
                          onClick={() => toggleSection(sec)}
                          className="flex items-center gap-2.5 text-sm font-bold text-foreground cursor-pointer select-none"
                        >
                          <CustomCheckbox checked={checked} />
                          <span className={checked ? "text-[var(--brand)]" : "text-foreground"}>{sec.label}</span>
                        </div>

                        <div className="ml-7 space-y-2">
                          {sec.subItems?.map((sub) => {
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
                                <span className={subChecked ? "text-foreground font-semibold" : ""}>{sub.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Reports & Analytics */}
                  {(() => {
                    const sec = MENU_SECTIONS.find((s) => s.id === "reports_analytics")!;
                    const checked = isSectionChecked(sec);

                    return (
                      <div className="space-y-2.5">
                        <div
                          onClick={() => toggleSection(sec)}
                          className="flex items-center gap-2.5 text-sm font-bold text-foreground cursor-pointer select-none"
                        >
                          <CustomCheckbox checked={checked} />
                          <span className={checked ? "text-[var(--brand)]" : "text-foreground"}>{sec.label}</span>
                        </div>

                        <div className="ml-7 space-y-2">
                          {sec.subItems?.map((sub) => {
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
                                <span className={subChecked ? "text-foreground font-semibold" : ""}>{sub.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Marketing & Growth */}
                  {(() => {
                    const sec = MENU_SECTIONS.find((s) => s.id === "marketing_growth")!;
                    const checked = isSectionChecked(sec);

                    return (
                      <div className="space-y-2.5">
                        <div
                          onClick={() => toggleSection(sec)}
                          className="flex items-center gap-2.5 text-sm font-bold text-foreground cursor-pointer select-none"
                        >
                          <CustomCheckbox checked={checked} />
                          <span className={checked ? "text-[var(--brand)]" : "text-foreground"}>{sec.label}</span>
                        </div>

                        <div className="ml-7 space-y-2">
                          {sec.subItems?.map((sub) => {
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
                                <span className={subChecked ? "text-foreground font-semibold" : ""}>{sub.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Banners & Engagement */}
                  {(() => {
                    const sec = MENU_SECTIONS.find((s) => s.id === "banners_engagement")!;
                    const checked = isSectionChecked(sec);
                    return (
                      <div className="space-y-2.5">
                        <div onClick={() => toggleSection(sec)} className="flex items-center gap-2.5 text-sm font-bold text-foreground cursor-pointer select-none">
                          <CustomCheckbox checked={checked} />
                          <span className={checked ? "text-[var(--brand)]" : "text-foreground"}>{sec.label}</span>
                        </div>
                        <div className="ml-7 space-y-2">
                          {sec.subItems?.map((sub) => {
                            const subChecked = isSinglePermissionChecked(sub.id);
                            return (
                              <div key={sub.id} onClick={(e) => { e.stopPropagation(); toggleSinglePermission(sub.id); }} className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none transition-colors">
                                <CustomCheckbox checked={subChecked} className="h-4 w-4" />
                                <span className={subChecked ? "text-foreground font-semibold" : ""}>{sub.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
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
