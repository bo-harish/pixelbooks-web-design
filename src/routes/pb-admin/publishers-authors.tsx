import { createFileRoute, useNavigate, Outlet, useMatch, useMatches } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Download,
  Building2,
  User,
  Feather,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Filter,
  Users,
  BookOpen,
  FileSpreadsheet,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit3,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/publishers-authors")({
  component: PublishersAuthorsWrapper,
});

function EntityAvatar({ type }: { name?: string; type: EntityRole; avatarBg?: string }) {
  if (type === "Publisher") {
    return (
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20 shadow-2xs transition-transform group-hover:scale-105"
        title="Publisher"
      >
        <Building2 size={18} />
      </div>
    );
  }

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs transition-transform group-hover:scale-105"
      title="Author"
    >
      <Feather size={18} />
    </div>
  );
}

function PublishersAuthorsWrapper() {
  const isChildActive = useMatch({ from: "/pb-admin/publishers-authors/$id", shouldThrow: false });
  if (isChildActive) {
    return <Outlet />;
  }
  return <ManagePublisherAuthor />;
}

type EntityRole = "Publisher" | "Author";
type EntityStatus = "Approved" | "Rejected" | "Pending";

interface AccountItem {
  id: string;
  name: string;
  type: EntityRole;
  activeTitles: number;
  phone: string;
  email: string;
  state: string;
  country: string;
  status: EntityStatus;
  joinedDate: string;
  avatarBg: string;
}

const INITIAL_ACCOUNTS: AccountItem[] = [
  {
    id: "pa-1",
    name: "Werley Nortreus",
    type: "Author",
    activeTitles: 6,
    phone: "7778889990",
    email: "werley.n@authors.org",
    state: "Uttar Pradesh",
    country: "India",
    status: "Approved",
    joinedDate: "14 Jan 2025",
    avatarBg: "oklch(0.55 0.11 195)",
  },
  {
    id: "pa-2",
    name: "qa test pub",
    type: "Publisher",
    activeTitles: 0,
    phone: "6866343211",
    email: "qatest@pub.co.in",
    state: "Andaman and Nicobar",
    country: "India",
    status: "Approved",
    joinedDate: "10 Feb 2025",
    avatarBg: "oklch(0.60 0.18 30)",
  },
  {
    id: "pa-3",
    name: "Abu",
    type: "Publisher",
    activeTitles: 0,
    phone: "6235128726",
    email: "abu.publishers@gmail.com",
    state: "Andaman and Nicobar",
    country: "India",
    status: "Approved",
    joinedDate: "01 Mar 2025",
    avatarBg: "oklch(0.55 0.13 260)",
  },
  {
    id: "pa-4",
    name: "QA-TBH Publishers",
    type: "Publisher",
    activeTitles: 11,
    phone: "8889996663",
    email: "contact@tbhpublishers.com",
    state: "Kerala",
    country: "India",
    status: "Approved",
    joinedDate: "18 Nov 2024",
    avatarBg: "oklch(0.62 0.15 155)",
  },
  {
    id: "pa-5",
    name: "PBN",
    type: "Author",
    activeTitles: 0,
    phone: "7907989165",
    email: "pbn.writer@gmail.com",
    state: "Karnataka",
    country: "India",
    status: "Approved",
    joinedDate: "22 Dec 2024",
    avatarBg: "oklch(0.50 0.15 290)",
  },
  {
    id: "pa-6",
    name: "SK Authors",
    type: "Author",
    activeTitles: 0,
    phone: "9995890724",
    email: "sk.authors@lit.in",
    state: "Karnataka",
    country: "India",
    status: "Approved",
    joinedDate: "05 Jan 2025",
    avatarBg: "oklch(0.58 0.16 45)",
  },
  {
    id: "pa-7",
    name: "Veena",
    type: "Publisher",
    activeTitles: 0,
    phone: "9562428325",
    email: "veena.publications@yahoo.com",
    state: "Kerala",
    country: "India",
    status: "Approved",
    joinedDate: "12 Feb 2025",
    avatarBg: "oklch(0.52 0.14 200)",
  },
  {
    id: "pa-8",
    name: "QA-TBH Publishers And Distributors",
    type: "Publisher",
    activeTitles: 0,
    phone: "6374024818",
    email: "distributors@tbh.com",
    state: "Kerala",
    country: "India",
    status: "Rejected",
    joinedDate: "19 Mar 2025",
    avatarBg: "oklch(0.45 0.12 15)",
  },
  {
    id: "pa-9",
    name: "QA",
    type: "Publisher",
    activeTitles: 1,
    phone: "9995890724",
    email: "qa.books@media.org",
    state: "Arunachal Pradesh",
    country: "India",
    status: "Approved",
    joinedDate: "02 Apr 2025",
    avatarBg: "oklch(0.65 0.14 120)",
  },
  {
    id: "pa-10",
    name: "OBook Publication",
    type: "Publisher",
    activeTitles: 5,
    phone: "6374024818",
    email: "info@obookpub.com",
    state: "Kerala",
    country: "India",
    status: "Approved",
    joinedDate: "28 Apr 2025",
    avatarBg: "oklch(0.55 0.18 340)",
  },
  {
    id: "pa-11",
    name: "Horizon Press",
    type: "Publisher",
    activeTitles: 14,
    phone: "9845012345",
    email: "editor@horizonpress.com",
    state: "Maharashtra",
    country: "India",
    status: "Approved",
    joinedDate: "05 May 2025",
    avatarBg: "oklch(0.58 0.16 230)",
  },
  {
    id: "pa-12",
    name: "Aarav Sharma",
    type: "Author",
    activeTitles: 3,
    phone: "9123456780",
    email: "aarav.sharma@authors.net",
    state: "Delhi",
    country: "India",
    status: "Pending",
    joinedDate: "12 May 2025",
    avatarBg: "oklch(0.60 0.15 80)",
  },
  {
    id: "pa-13",
    name: "Apex Lit House",
    type: "Publisher",
    activeTitles: 8,
    phone: "9711223344",
    email: "support@apexlithouse.com",
    state: "Tamil Nadu",
    country: "India",
    status: "Approved",
    joinedDate: "19 May 2025",
    avatarBg: "oklch(0.50 0.14 170)",
  },
  {
    id: "pa-14",
    name: "Meera Nair",
    type: "Author",
    activeTitles: 2,
    phone: "9447011223",
    email: "meera.nair@writers.in",
    state: "Kerala",
    country: "India",
    status: "Pending",
    joinedDate: "01 Jun 2025",
    avatarBg: "oklch(0.57 0.17 310)",
  },
];

function ManagePublisherAuthor() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<AccountItem[]>(INITIAL_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("Publisher & Author");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected account for detail view / editing modal
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(null);
  const [editStatus, setEditStatus] = useState<EntityStatus>("Approved");

  // Filtered accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((item) => {
      // Role filter
      if (roleFilter === "Publisher" && item.type !== "Publisher") return false;
      if (roleFilter === "Author" && item.type !== "Author") return false;

      // Status filter
      if (statusFilter !== "All Status" && item.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesPhone = item.phone.includes(q);
        const matchesState = item.state.toLowerCase().includes(q);
        const matchesCountry = item.country.toLowerCase().includes(q);
        const matchesEmail = item.email.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesState && !matchesCountry && !matchesEmail) {
          return false;
        }
      }

      return true;
    });
  }, [accounts, roleFilter, statusFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage) || 1;
  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(start, start + itemsPerPage);
  }, [filteredAccounts, currentPage, itemsPerPage]);

  // Stats counters
  const totalCount = accounts.length;
  const publisherCount = accounts.filter((a) => a.type === "Publisher").length;
  const authorCount = accounts.filter((a) => a.type === "Author").length;
  const pendingCount = accounts.filter((a) => a.status === "Pending").length;

  const handleOpenAccount = (item: AccountItem) => {
    navigate({ to: "/pb-admin/publishers-authors/$id", params: { id: item.id } });
  };

  const handleSaveStatus = () => {
    if (!selectedAccount) return;
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === selectedAccount.id ? { ...acc, status: editStatus } : acc))
    );
    toast.success(`Updated status for "${selectedAccount.name}" to ${editStatus}`);
    setSelectedAccount(null);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Type,Active Titles,Phone,State,Country,Status,Joined Date"]
        .concat(
          filteredAccounts.map(
            (a) =>
              `"${a.name}","${a.type}",${a.activeTitles},"${a.phone}","${a.state}","${a.country}","${a.status}","${a.joinedDate}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `publishers_authors_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredAccounts.length} accounts to CSV`);
  };

  // Helper for initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppShell
      title="Manage Publisher / Author"
      subtitle="Overview and status management for registered Publishers and Authors."
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between min-h-[120px] rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Registered
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <Users size={18} />
              </span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-foreground">{totalCount}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Across all portals</p>
            </div>
          </div>

          <div className="flex flex-col justify-between min-h-[120px] rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Publishers
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <Building2 size={18} />
              </span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-foreground">{publisherCount}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Verified publishing entities</p>
            </div>
          </div>

          <div className="flex flex-col justify-between min-h-[120px] rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Authors
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <Feather size={18} />
              </span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-foreground">{authorCount}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Independent creators</p>
            </div>
          </div>

          <div className="flex flex-col justify-between min-h-[120px] rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Approval
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <Clock size={18} />
              </span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-foreground">{pendingCount}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Requires review</p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar matching pixelbooks style guide */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left Group: Search Box + Role & Status Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 min-w-0">
            {/* Search box */}
            <label className="relative flex h-11 w-full sm:w-80 md:w-[380px] shrink-0 items-center rounded-lg border border-border bg-card px-3">
              <Search size={16} className="mr-2.5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground text-xs p-1"
                >
                  <X size={14} />
                </button>
              )}
            </label>

            {/* Tightly Grouped Dropdowns: Pub/Auth + All Status */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Role Filter Dropdown */}
              <DropdownSelect
                value={roleFilter}
                options={["Publisher & Author", "Publisher", "Author"]}
                onChange={(v) => {
                  setRoleFilter(v);
                  setCurrentPage(1);
                }}
                searchable
                searchPlaceholder="Search role..."
                className="w-auto min-w-[170px]"
              />

              {/* Status Filter Dropdown */}
              <DropdownSelect
                value={statusFilter}
                options={["All Status", "Approved", "Rejected", "Pending"]}
                onChange={(v) => {
                  setStatusFilter(v);
                  setCurrentPage(1);
                }}
                searchable
                searchPlaceholder="Search status..."
                className="w-auto min-w-[170px]"
              />
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-2xs transition-opacity hover:opacity-90 cursor-pointer shrink-0 whitespace-nowrap"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 px-4 md:px-6">Name</th>
                  <th className="py-3.5 px-4">Active Titles</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 pr-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users size={32} className="text-muted-foreground/50" />
                        <p className="font-medium text-foreground">No accounts found</p>
                        <p className="text-xs text-muted-foreground">
                          Try adjusting your search query or filter criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedAccounts.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenAccount(item)}
                      className="group cursor-pointer transition-colors hover:bg-secondary/50"
                    >
                      {/* Name + Role */}
                      <td className="py-4 px-4 md:px-6">
                        <div className="flex items-center gap-3">
                          <EntityAvatar name={item.name} type={item.type} avatarBg={item.avatarBg} />
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-[var(--brand)] transition-colors">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                              {item.type === "Publisher" ? (
                                <Building2 size={11} className="inline text-muted-foreground/80" />
                              ) : (
                                <Feather size={11} className="inline text-muted-foreground/80" />
                              )}
                              <span>{item.type}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Active Titles */}
                      <td className="py-4 px-4 font-semibold text-foreground">{item.activeTitles}</td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-muted-foreground font-mono text-xs">{item.phone}</td>

                      {/* State */}
                      <td className="py-4 px-4 text-foreground">{item.state}</td>

                      {/* Country */}
                      <td className="py-4 px-4 text-muted-foreground">{item.country}</td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {item.status === "Approved" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={13} />
                            Approved
                          </span>
                        )}
                        {item.status === "Rejected" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                            <XCircle size={13} />
                            Rejected
                          </span>
                        )}
                        {item.status === "Pending" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <Clock size={13} />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Chevron Action */}
                      <td className="py-4 pr-6 text-right">
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

          {/* Table Footer & Pagination */}
          <div className="flex flex-col gap-4 border-t border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{paginatedAccounts.length}</span> from{" "}
              <span className="font-semibold text-foreground">{filteredAccounts.length}</span> results
            </p>

            <div className="flex items-center gap-1 text-xs">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-8 items-center justify-center rounded-lg border border-border px-3 font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                « Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg font-semibold transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-[var(--brand)] text-white"
                      : "border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-8 items-center justify-center rounded-lg border border-border px-3 font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next »
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
