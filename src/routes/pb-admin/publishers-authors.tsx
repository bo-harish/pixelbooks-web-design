import { createFileRoute, useNavigate, Outlet, useMatch, useMatches } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
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
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { BookCover } from "@/components/ui/book-cover";
import { getBooksForAccount, type PublisherAuthorBook } from "@/lib/publisher-author-books-data";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/publishers-authors")({
  validateSearch: (search: Record<string, unknown>) => ({
    role: typeof search.role === "string" ? search.role : undefined,
  }),
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

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string | number;
  subtext: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-3.5 sm:p-4 transition-shadow hover:shadow-xs min-h-[94px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
          style={{
            backgroundColor: "color-mix(in oklab, var(--brand) 10%, transparent)",
            color: "var(--brand)",
          }}
        >
          <Icon size={15} />
        </span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
        <p className="text-xl sm:text-[22px] font-extrabold text-foreground tracking-tight leading-tight">
          {value}
        </p>
        <span className="text-[11px] font-medium text-muted-foreground">{subtext}</span>
      </div>
    </div>
  );
}

function ManagePublisherAuthor() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [accounts, setAccounts] = useState<AccountItem[]>(INITIAL_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState("");
  const roleFilter: "Publisher" | "Author" = search.role === "Author" ? "Author" : "Publisher";
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination & search when switching between Publishers and Authors
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery("");
  }, [search.role]);

  // Selected account for detail view / editing modal
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(null);
  const [editStatus, setEditStatus] = useState<EntityStatus>("Approved");

  // "Show books" Modal state
  const [booksModalAccount, setBooksModalAccount] = useState<AccountItem | null>(null);
  const [bookSearchQuery, setBookSearchQuery] = useState("");

  const accountBooks = useMemo(() => {
    if (!booksModalAccount) return [];
    return getBooksForAccount(booksModalAccount.id, booksModalAccount.name, booksModalAccount.type);
  }, [booksModalAccount]);

  const filteredAccountBooks = useMemo(() => {
    if (!bookSearchQuery.trim()) return accountBooks;
    const q = bookSearchQuery.toLowerCase();
    return accountBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.publisher.toLowerCase().includes(q) ||
        b.language.toLowerCase().includes(q)
    );
  }, [accountBooks, bookSearchQuery]);

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

  // Segmented metrics by role
  const publisherAccounts = useMemo(() => accounts.filter((a) => a.type === "Publisher"), [accounts]);
  const authorAccounts = useMemo(() => accounts.filter((a) => a.type === "Author"), [accounts]);

  const publisherApprovedCount = useMemo(() => publisherAccounts.filter((a) => a.status === "Approved").length, [publisherAccounts]);
  const publisherPendingCount = useMemo(() => publisherAccounts.filter((a) => a.status === "Pending").length, [publisherAccounts]);
  const publisherTotalTitles = useMemo(() => publisherAccounts.reduce((acc, curr) => acc + curr.activeTitles, 0), [publisherAccounts]);

  const authorApprovedCount = useMemo(() => authorAccounts.filter((a) => a.status === "Approved").length, [authorAccounts]);
  const authorPendingCount = useMemo(() => authorAccounts.filter((a) => a.status === "Pending").length, [authorAccounts]);
  const authorTotalTitles = useMemo(() => authorAccounts.reduce((acc, curr) => acc + curr.activeTitles, 0), [authorAccounts]);

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
    const roleSlug = roleFilter === "Publisher" ? "publishers" : roleFilter === "Author" ? "authors" : "publishers_authors";
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
    link.setAttribute("download", `${roleSlug}_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredAccounts.length} ${roleFilter === "Publisher & Author" ? "account" : roleFilter.toLowerCase()}s to CSV`);
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

  const pageTitle =
    roleFilter === "Publisher"
      ? "Manage Publishers"
      : roleFilter === "Author"
      ? "Manage Authors"
      : "Manage Publishers & Authors";

  const pageSubtitle =
    roleFilter === "Publisher"
      ? "Overview and status management for registered Publishers."
      : roleFilter === "Author"
      ? "Overview and status management for registered Authors."
      : "Overview and status management for registered Publishers and Authors.";

  return (
    <AppShell
      title={pageTitle}
      subtitle={pageSubtitle}
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {roleFilter === "Publisher" ? (
            <>
              <StatCard
                icon={Building2}
                label="Total Publishers"
                value={publisherAccounts.length}
                subtext="Verified publishing entities"
              />
              <StatCard
                icon={CheckCircle2}
                label="Approved"
                value={publisherApprovedCount}
                subtext="Active & verified"
              />
              <StatCard
                icon={Clock}
                label="Pending Approval"
                value={publisherPendingCount}
                subtext="Requires review"
              />
              <StatCard
                icon={BookOpen}
                label="Active Titles"
                value={publisherTotalTitles}
                subtext="Catalogue titles"
              />
            </>
          ) : roleFilter === "Author" ? (
            <>
              <StatCard
                icon={Feather}
                label="Total Authors"
                value={authorAccounts.length}
                subtext="Independent creators"
              />
              <StatCard
                icon={CheckCircle2}
                label="Approved"
                value={authorApprovedCount}
                subtext="Active & verified"
              />
              <StatCard
                icon={Clock}
                label="Pending Approval"
                value={authorPendingCount}
                subtext="Requires review"
              />
              <StatCard
                icon={BookOpen}
                label="Active Titles"
                value={authorTotalTitles}
                subtext="Catalogue titles"
              />
            </>
          ) : (
            <>
              <StatCard
                icon={Users}
                label="Total Registered"
                value={totalCount}
                subtext="Across all portals"
              />
              <StatCard
                icon={Building2}
                label="Publishers"
                value={publisherCount}
                subtext="Verified publishing entities"
              />
              <StatCard
                icon={Feather}
                label="Authors"
                value={authorCount}
                subtext="Independent creators"
              />
              <StatCard
                icon={Clock}
                label="Pending Approval"
                value={pendingCount}
                subtext="Requires review"
              />
            </>
          )}
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
                placeholder={roleFilter === "Publisher" ? "Search publishers..." : roleFilter === "Author" ? "Search authors..." : "Search..."}
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

            {/* Status Filter Dropdown */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
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
                        <p className="font-medium text-foreground">
                          No {roleFilter === "Publisher" ? "publishers" : roleFilter === "Author" ? "authors" : "accounts"} found
                        </p>
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

                      {/* Active Titles / Show Books */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBooksModalAccount(item);
                            setBookSearchQuery("");
                          }}
                          className={`group/btn inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                            item.activeTitles > 0
                              ? "border-[var(--brand)]/30 bg-[var(--sidebar-highlight)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white hover:border-[var(--brand)]"
                              : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                          title={`Show books by ${item.name} (${item.activeTitles} active titles)`}
                        >
                          <BookOpen
                            size={13}
                            className={`shrink-0 ${
                              item.activeTitles > 0
                                ? "text-[var(--brand)] group-hover/btn:text-white"
                                : "text-muted-foreground group-hover/btn:text-foreground"
                            }`}
                          />
                          <span>
                            {item.activeTitles} {item.activeTitles === 1 ? "Book" : "Books"}
                          </span>
                        </button>
                      </td>

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

        {/* Books Modal Dialog */}
        <Dialog
          open={!!booksModalAccount}
          onOpenChange={(open) => {
            if (!open) {
              setBooksModalAccount(null);
              setBookSearchQuery("");
            }
          }}
        >
          <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl bg-card border-border shadow-xl [&>button]:!top-2.5 [&>button]:!right-3">
            {/* Modal Header */}
            <div className="p-6 border-b border-border bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10">
                <div className="flex items-center gap-3.5">
                  {booksModalAccount && (
                    <EntityAvatar
                      name={booksModalAccount.name}
                      type={booksModalAccount.type}
                      avatarBg={booksModalAccount.avatarBg}
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-bold text-foreground">
                        Books by {booksModalAccount?.name}
                      </h2>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                          booksModalAccount?.type === "Publisher"
                            ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {booksModalAccount?.type === "Publisher" ? (
                          <Building2 size={11} />
                        ) : (
                          <Feather size={11} />
                        )}
                        {booksModalAccount?.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {booksModalAccount?.state}, {booksModalAccount?.country} •{" "}
                      <span className="font-semibold text-foreground">{accountBooks.length}</span>{" "}
                      {accountBooks.length === 1 ? "book" : "books"} listed
                    </p>
                  </div>
                </div>

                {/* Direct link to dedicated eBook titles page */}
                {booksModalAccount && (
                  <button
                    type="button"
                    onClick={() => {
                      const targetId = booksModalAccount.id;
                      setBooksModalAccount(null);
                      navigate({
                        to: "/pb-admin/publishers-authors/$id/titles",
                        params: { id: targetId },
                      });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-[var(--brand)] hover:bg-[var(--sidebar-highlight)] transition-colors cursor-pointer shrink-0 self-start sm:self-auto shadow-2xs"
                  >
                    <span>View All eBooks Page</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>

              {/* Search filter input inside modal */}
              {accountBooks.length > 0 && (
                <div className="mt-4 relative">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Search by title, ISBN, category, language, author..."
                    value={bookSearchQuery}
                    onChange={(e) => setBookSearchQuery(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-card pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--brand)]"
                  />
                  {bookSearchQuery && (
                    <button
                      onClick={() => setBookSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs p-1 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal Body / Books List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 max-h-[55vh]">
              {filteredAccountBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground/60 mb-3">
                    <BookOpen size={24} />
                  </div>
                  <p className="font-semibold text-sm text-foreground">
                    {accountBooks.length === 0
                      ? `No published books found for ${booksModalAccount?.name}`
                      : "No books match your search"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    {accountBooks.length === 0
                      ? `This ${booksModalAccount?.type.toLowerCase()} currently has 0 active titles in the catalogue.`
                      : "Try clearing or changing your search keywords."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden shadow-xs">
                  {filteredAccountBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between p-3.5 hover:bg-secondary/40 transition-colors gap-4"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <BookCover
                          initials={book.initials}
                          coverGradient={book.coverGradient}
                          title={book.title}
                          size="sm"
                        />
                        <div className="min-w-0 space-y-1">
                          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                            {book.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="font-medium text-foreground/90 bg-muted/60 px-2 py-0.5 rounded border border-border/50">
                              {book.category}
                            </span>
                            <span>
                              ISBN: <span className="font-mono text-foreground">{book.isbn}</span>
                            </span>
                            {booksModalAccount?.type === "Publisher" ? (
                              <span>
                                Author: <strong className="text-foreground">{book.author}</strong>
                              </span>
                            ) : (
                              <span>
                                Publisher: <strong className="text-foreground">{book.publisher}</strong>
                              </span>
                            )}
                            <span>• {book.language}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                            <span>Published: {book.dop}</span>
                            <span className="font-semibold text-foreground">{book.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={11} />
                          {book.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Showing {filteredAccountBooks.length} of {accountBooks.length} books
              </span>
              <button
                type="button"
                onClick={() => {
                  setBooksModalAccount(null);
                  setBookSearchQuery("");
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-secondary text-foreground transition-colors cursor-pointer shadow-2xs"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
