import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Copy,
  Check,
  Building2,
  Feather,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  Search,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Percent,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Upload,
  ScrollText,
  Table,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/publishers-authors/$id/titles")({
  component: PublisherAuthorTitlesPage,
});

type EntityRole = "Publisher" | "Author";
type EntityStatus = "Approved" | "Rejected" | "Pending";

interface AccountDetails {
  id: string;
  name: string;
  type: EntityRole;
  gstNumber: string;
  panCard: string;
  commissionRate: string;
  profileUrl: string;
  status: EntityStatus;
  email: string;
  phone: string;
  city: string;
  state: string;
}

const MOCK_ACCOUNTS_MAP: Record<string, AccountDetails> = {
  "pa-4": {
    id: "pa-4",
    name: "QA-TBH Publishers",
    type: "Publisher",
    gstNumber: "27ABCDE1234F1Z1",
    panCard: "QAZXS1234R",
    commissionRate: "16%",
    profileUrl: "https://pixelbooksapp.com/TBH-Publisher",
    status: "Approved",
    email: "nimisha+50@brandoptics.com",
    phone: "8889996663",
    city: "Kochi",
    state: "Kerala",
  },
  "pa-2": {
    id: "pa-2",
    name: "qa test pub",
    type: "Publisher",
    gstNumber: "27AAACD9988E1Z4",
    panCard: "QATEST1234P",
    commissionRate: "16%",
    profileUrl: "https://pixelbooksapp.com/qa-test-pub",
    status: "Approved",
    email: "qatestpub@pixelbooks.org",
    phone: "9876543210",
    city: "Kochi",
    state: "Kerala",
  },
  "pa-1": {
    id: "pa-1",
    name: "Werley Nortreus",
    type: "Author",
    gstNumber: "32AAAAA0000A1Z5",
    panCard: "WERLN9988P",
    commissionRate: "15%",
    profileUrl: "https://pixelbooksapp.com/werley-nortreus",
    status: "Approved",
    email: "werley.n@authors.org",
    phone: "7778889990",
    city: "Lucknow",
    state: "Uttar Pradesh",
  },
};

interface BookItem {
  id: string;
  title: string;
  category: string;
  isbn: string;
  author: string;
  dop: string;
  language: string;
  price: string;
  status: "Published" | "Draft" | "Archived";
  initials: string;
  coverGradient: string;
}

const ALL_MOCK_TITLES: BookItem[] = [
  {
    id: "b-1",
    title: "Elsaunderajoseph",
    category: "General & Literary Fiction",
    isbn: "978-0-12-345678-9",
    author: "LaTeX with hyperref",
    dop: "01 Jan 2025",
    language: "English",
    price: "₹5,482.00",
    status: "Published",
    initials: "EL",
    coverGradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  },
  {
    id: "b-2",
    title: "Principles of Modern Literary Studies",
    category: "Academic & Professional",
    isbn: "978-3-16-148410-0",
    author: "Dr. K. R. Varma",
    dop: "15 Feb 2025",
    language: "English",
    price: "₹450.00",
    status: "Published",
    initials: "PL",
    coverGradient: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
  },
  {
    id: "b-3",
    title: "Heritage of South India",
    category: "History & Culture",
    isbn: "978-81-7023-112-9",
    author: "Nair & Associates",
    dop: "10 Mar 2025",
    language: "Malayalam",
    price: "₹380.00",
    status: "Published",
    initials: "HS",
    coverGradient: "linear-gradient(135deg, #854d0e 0%, #ca8a04 100%)",
  },
  {
    id: "b-4",
    title: "Digital Ecosystems & Publishers",
    category: "Computer Science",
    isbn: "978-93-5012-445-1",
    author: "TBH Editorial Board",
    dop: "05 Apr 2025",
    language: "English",
    price: "₹890.00",
    status: "Published",
    initials: "DE",
    coverGradient: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
  },
  {
    id: "b-5",
    title: "The Art of Creative Writing",
    category: "Arts & Humanities",
    isbn: "978-1-4028-9457-7",
    author: "Werley Nortreus",
    dop: "18 May 2025",
    language: "English",
    price: "₹620.00",
    status: "Published",
    initials: "AC",
    coverGradient: "linear-gradient(135deg, #be185d 0%, #f43f5e 100%)",
  },
  {
    id: "b-6",
    title: "Voices of Modern Poetry",
    category: "Poetry & Anthologies",
    isbn: "978-0-307-27767-1",
    author: "Werley Nortreus",
    dop: "22 Jun 2025",
    language: "English",
    price: "₹299.00",
    status: "Published",
    initials: "VP",
    coverGradient: "linear-gradient(135deg, #6b21a8 0%, #a855f7 100%)",
  },
  {
    id: "b-7",
    title: "Foundations of Data Science",
    category: "Technology",
    isbn: "978-0-262-03384-8",
    author: "Prof. S. R. Menon",
    dop: "14 Jul 2025",
    language: "English",
    price: "₹1,150.00",
    status: "Published",
    initials: "FD",
    coverGradient: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
  },
  {
    id: "b-8",
    title: "Chronicles of Ancient Empires",
    category: "History",
    isbn: "978-0-19-856453-9",
    author: "Werley Nortreus",
    dop: "02 Aug 2025",
    language: "English",
    price: "₹750.00",
    status: "Published",
    initials: "CA",
    coverGradient: "linear-gradient(135deg, #c2410c 0%, #f97316 100%)",
  },
  {
    id: "b-9",
    title: "Contemporary Short Stories",
    category: "Fiction",
    isbn: "978-0-14-044913-6",
    author: "Werley Nortreus",
    dop: "19 Sep 2025",
    language: "English",
    price: "₹340.00",
    status: "Published",
    initials: "CS",
    coverGradient: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
  },
  {
    id: "b-10",
    title: "Philosophy & Human Thought",
    category: "Philosophy",
    isbn: "978-0-674-00661-4",
    author: "Dr. A. P. Sharma",
    dop: "11 Oct 2025",
    language: "English",
    price: "₹520.00",
    status: "Published",
    initials: "PH",
    coverGradient: "linear-gradient(135deg, #374151 0%, #6b7280 100%)",
  },
  {
    id: "b-11",
    title: "Selected Essays & Reflections",
    category: "Non-Fiction",
    isbn: "978-0-393-02046-5",
    author: "Werley Nortreus",
    dop: "05 Nov 2025",
    language: "English",
    price: "₹480.00",
    status: "Published",
    initials: "SE",
    coverGradient: "linear-gradient(135deg, #991b1b 0%, #ef4444 100%)",
  },
  {
    id: "b-12",
    title: "Environmental Policy & Futures",
    category: "Sciences",
    isbn: "978-0-521-82559-7",
    author: "Green Earth Forum",
    dop: "01 Dec 2025",
    language: "English",
    price: "₹890.00",
    status: "Published",
    initials: "EP",
    coverGradient: "linear-gradient(135deg, #047857 0%, #10b981 100%)",
  },
  {
    id: "b-13",
    title: "The World of Children's Literature",
    category: "Children's Books",
    isbn: "978-0-06-025492-6",
    author: "Maya Sen",
    dop: "15 Jan 2026",
    language: "English",
    price: "₹250.00",
    status: "Published",
    initials: "WC",
    coverGradient: "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)",
  },
  {
    id: "b-14",
    title: "Advanced Macroeconomics",
    category: "Economics",
    isbn: "978-0-07-351137-5",
    author: "R. K. Gupta",
    dop: "20 Feb 2026",
    language: "English",
    price: "₹1,420.00",
    status: "Published",
    initials: "AM",
    coverGradient: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
  },
  {
    id: "b-15",
    title: "Global Cultural Studies",
    category: "Sociology",
    isbn: "978-0-415-18116-7",
    author: "Werley Nortreus",
    dop: "10 Mar 2026",
    language: "English",
    price: "₹690.00",
    status: "Published",
    initials: "GC",
    coverGradient: "linear-gradient(135deg, #581c87 0%, #9333ea 100%)",
  },
];

function PublisherAuthorTitlesPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const initialAccount: AccountDetails = MOCK_ACCOUNTS_MAP[id] || {
    id: id || "pa-1",
    name: "Werley Nortreus",
    type: "Author",
    gstNumber: "32AAAAA0000A1Z5",
    panCard: "WERLN9988P",
    commissionRate: "15%",
    profileUrl: `https://pixelbooksapp.com/${id}`,
    status: "Approved",
    email: "werley.n@authors.org",
    phone: "7778889990",
    city: "Lucknow",
    state: "Uttar Pradesh",
  };

  const [account, setAccount] = useState<AccountDetails>(initialAccount);
  const [copied, setCopied] = useState(false);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(account.profileUrl);
    setCopied(true);
    toast.success("Profile URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = (newStatus: EntityStatus) => {
    setAccount((prev) => ({ ...prev, status: newStatus }));
    toast.success(`Account status updated to ${newStatus}`);
  };

  // Filtered titles
  const filteredTitles = useMemo(() => {
    return ALL_MOCK_TITLES.filter((book) => {
      const matchesQuery =
        !searchQuery.trim() ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" || book.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Pagination bounds
  const totalItems = filteredTitles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedTitles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTitles.slice(start, start + itemsPerPage);
  }, [filteredTitles, currentPage]);

  const startItemIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItemIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleExport = (type: "Excel" | "PDF") => {
    if (type === "PDF") {
      toast.success("Downloading Publisher eBooks Report (PDF)...");
    } else {
      toast.success("Downloading Publisher eBooks Report (Excel)...");
    }
  };

  return (
    <AppShell
      title={`${account.name} - eBooks`}
      subtitle={`Complete catalogue and publishing history for ${account.name}.`}
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Back Navigation Control */}
        <div className="flex items-center gap-3 mb-4">
          <Link
            to="/pb-admin/publishers-authors/$id"
            params={{ id }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft size={16} />
          </Link>
          <span className="text-sm font-normal text-foreground">
            Back to {account.name}
          </span>
        </div>



        {/* Section Header: Recent Purchases / All eBooks */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-extrabold text-foreground">All eBooks</h2>

            </div>
          </div>

          {/* Controls Bar White Box Container */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {/* Search Box */}
              <div className="relative flex-1 max-w-xl">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by title, ISBN, author..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-card pl-10 pr-4 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-[var(--brand)] shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-3">
                {/* Status Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-10 items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 text-xs font-medium text-foreground hover:bg-secondary/50 shadow-2xs cursor-pointer min-w-[140px]">
                      <span>{statusFilter}</span>
                      <ChevronDown size={15} className="text-muted-foreground shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
                    {["All Status", "Published", "Draft", "Archived"].map((st) => (
                      <DropdownMenuItem
                        key={st}
                        onClick={() => handleStatusFilterChange(st)}
                        className={`flex w-full items-center px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer ${st === statusFilter ? "font-semibold text-foreground bg-secondary/50" : "text-muted-foreground"
                          }`}
                      >
                        {st}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Export Dropdown styled like publisher/margin-report */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-xs font-semibold shadow-2xs transition-opacity hover:opacity-90 cursor-pointer shrink-0"
                      style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                    >
                      <Upload size={15} />
                      <span>Export</span>
                      <ChevronDown size={14} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
                    <DropdownMenuItem
                      onClick={() => handleExport("PDF")}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer"
                    >
                      <ScrollText size={15} className="text-muted-foreground" />
                      <span>Export PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExport("Excel")}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer"
                    >
                      <Table size={15} className="text-muted-foreground" />
                      <span>Export Excel</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Titles Table Card */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4 md:px-6">Title</th>
                    <th className="py-3.5 px-4">ISBN</th>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">DOP</th>
                    <th className="py-3.5 px-4">Language</th>
                    <th className="py-3.5 px-4">Sale Price</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 pr-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedTitles.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-muted-foreground text-xs font-medium">
                        No eBooks found matching your search or filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedTitles.map((book) => (
                      <tr
                        key={book.id}
                        onClick={() => navigate({ to: "/pb-admin/titles/$bookId", params: { bookId: book.id } })}
                        className="group cursor-pointer transition-colors hover:bg-secondary/50"
                      >
                        {/* Title & Cover Thumbnail */}
                        <td className="py-4 px-4 md:px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className="relative flex h-14 w-9 shrink-0 flex-col items-center justify-center rounded-md text-[10px] font-bold text-white shadow-xs ring-1 ring-black/10 overflow-hidden"
                              style={{ background: book.coverGradient }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                              <span className="relative z-10 text-[10px] font-extrabold tracking-wider">
                                {book.initials}
                              </span>
                            </div>

                            <div className="min-w-0 flex-1 space-y-1">
                              <p className="font-semibold text-sm leading-snug text-foreground transition-colors group-hover:text-[var(--brand)]">
                                {book.title}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium">
                                {book.category}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ISBN */}
                        <td className="py-4 px-4 text-muted-foreground font-mono text-xs">{book.isbn}</td>

                        {/* Author */}
                        <td className="py-4 px-4 font-semibold text-foreground text-xs">{book.author}</td>

                        {/* DOP */}
                        <td className="py-4 px-4 text-muted-foreground text-xs">{book.dop}</td>

                        {/* Language */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground">
                            {book.language}
                          </span>
                        </td>

                        {/* Sale Price */}
                        <td className="py-4 px-4 font-bold text-foreground text-xs">{book.price}</td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={12} />
                            {book.status}
                          </span>
                        </td>

                        {/* Chevron */}
                        <td className="py-4 px-4 pr-6 text-right text-muted-foreground group-hover:text-foreground">
                          <ChevronRight size={18} className="inline transition-transform group-hover:translate-x-0.5" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border px-5 py-4 bg-card">
              <p className="text-xs text-muted-foreground font-medium">
                Showing <span className="font-bold text-foreground">{startItemIndex}</span> to{" "}
                <span className="font-bold text-foreground">{endItemIndex}</span> of{" "}
                <span className="font-bold text-foreground">{totalItems}</span> entries
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 items-center gap-1 rounded-md border border-border bg-card px-2.5 text-xs font-medium text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold transition-colors cursor-pointer ${currentPage === page
                      ? "bg-[var(--brand)] text-white shadow-2xs"
                      : "border border-border bg-card text-foreground hover:bg-secondary"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex h-8 items-center gap-1 rounded-md border border-border bg-card px-2.5 text-xs font-medium text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
