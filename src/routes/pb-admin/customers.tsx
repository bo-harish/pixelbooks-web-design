import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Users,
  UserCheck,
  Check,
  Calendar,
  Mail,
  ShoppingBag,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

function CustomerAvatar({ avatarUrl, name, size = "md" }: { avatarUrl?: string; name: string; size?: "md" | "lg" }) {
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

  if (size === "lg") {
    return (
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 shadow-2xs transition-transform group-hover:scale-105"
        title="Customer"
      >
        <UserCheck size={26} />
      </div>
    );
  }

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 shadow-2xs transition-transform group-hover:scale-105"
      title="Customer"
    >
      <UserCheck size={18} />
    </div>
  );
}

export const Route = createFileRoute("/pb-admin/customers")({
  head: () => ({
    meta: [
      { title: "Manage Customer — PixelBooks Admin" },
      {
        name: "description",
        content: "View and manage customer accounts, statuses, and purchase history in PixelBooks Admin.",
      },
    ],
  }),
  component: ManageCustomerPage,
});

export type StatusValue = "All" | "Enabled" | "Disabled";

export interface Customer {
  id: string;
  name: string;
  email?: string;
  joinedDate: string;
  purchasedBooks: number;
  status: "Enabled" | "Disabled";
  avatarUrl?: string;
  avatarBg?: string;
  phone?: string;
  location?: string;
}

// Initial seed dataset matching reference design
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "Ram Jai",
    joinedDate: "21 Jul 2026",
    purchasedBooks: 0,
    status: "Enabled",
    avatarBg: "oklch(0.55 0.11 195)",
    email: "ramjai@pixelbooks.io",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
  },
  {
    id: "cust-2",
    name: "Dilly",
    email: "reshma.qabo@gmail.com",
    joinedDate: "20 Jul 2026",
    purchasedBooks: 9,
    status: "Enabled",
    avatarBg: "oklch(0.60 0.18 30)",
    phone: "+91 98765 43211",
    location: "Kochi, Kerala",
  },
  {
    id: "cust-3",
    name: "Nimisha",
    email: "rimisha+19@brandoptics.com",
    joinedDate: "16 Jul 2026",
    purchasedBooks: 5,
    status: "Enabled",
    avatarBg: "oklch(0.55 0.13 260)",
    phone: "+91 98765 43212",
    location: "Bengaluru, Karnataka",
  },
  {
    id: "cust-4",
    name: "Harry",
    email: "reshma.qabo+688@gmail.com",
    joinedDate: "13 Jul 2026",
    purchasedBooks: 19,
    status: "Enabled",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    phone: "+91 98765 43213",
    location: "Delhi, India",
  },
  {
    id: "cust-5",
    name: "Rithaniya",
    email: "reshma.qabo+478@gmail.com",
    joinedDate: "10 Jul 2026",
    purchasedBooks: 8,
    status: "Enabled",
    avatarBg: "oklch(0.62 0.15 155)",
    phone: "+91 98765 43214",
    location: "Chennai, Tamil Nadu",
  },
  {
    id: "cust-6",
    name: "Anju",
    email: "anjupm75+23@gmail.com",
    joinedDate: "07 Jul 2026",
    purchasedBooks: 6,
    status: "Enabled",
    avatarBg: "oklch(0.45 0.12 280)",
    phone: "+91 98765 43215",
    location: "Trivandrum, Kerala",
  },
  {
    id: "cust-7",
    name: "Reeshma",
    email: "reeshma@brandoptics.com",
    joinedDate: "07 Jul 2026",
    purchasedBooks: 5,
    status: "Enabled",
    avatarBg: "oklch(0.50 0.15 20)",
    phone: "+91 98765 43216",
    location: "Kozhikode, Kerala",
  },
  {
    id: "cust-8",
    name: "Saniga",
    joinedDate: "07 Jul 2026",
    purchasedBooks: 0,
    status: "Enabled",
    avatarBg: "oklch(0.58 0.14 180)",
    email: "saniga@pixelbooks.io",
    phone: "+91 98765 43217",
    location: "Thrissur, Kerala",
  },
  {
    id: "cust-9",
    name: "Sanu",
    email: "reshma.qabo+15554@gmail.com",
    joinedDate: "02 Jul 2026",
    purchasedBooks: 3,
    status: "Enabled",
    avatarBg: "oklch(0.65 0.16 85)",
    phone: "+91 98765 43218",
    location: "Hyderabad, Telangana",
  },
  {
    id: "cust-10",
    name: "JJ",
    email: "lavontae.ralen@dropons.com",
    joinedDate: "19 Jun 2026",
    purchasedBooks: 1,
    status: "Enabled",
    avatarBg: "oklch(0.48 0.11 230)",
    phone: "+91 98765 43219",
    location: "Pune, Maharashtra",
  },
  {
    id: "cust-11",
    name: "Arjun Verma",
    email: "arjun.verma@example.com",
    joinedDate: "15 Jun 2026",
    purchasedBooks: 12,
    status: "Disabled",
    avatarBg: "oklch(0.55 0.15 40)",
    phone: "+91 98765 43220",
    location: "Noida, Uttar Pradesh",
  },
  {
    id: "cust-12",
    name: "Kavya Nair",
    email: "kavya.nair@example.com",
    joinedDate: "12 Jun 2026",
    purchasedBooks: 4,
    status: "Enabled",
    avatarBg: "oklch(0.60 0.12 140)",
    phone: "+91 98765 43221",
    location: "Kottayam, Kerala",
  },
];

function ManageCustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusValue>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const simulatedTotalBase = 136;

  // Filter customers based on search query and status filter
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      if (statusFilter === "Enabled" && cust.status !== "Enabled") return false;
      if (statusFilter === "Disabled" && cust.status !== "Disabled") return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = cust.name.toLowerCase().includes(query);
        const matchesEmail = cust.email?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesEmail) return false;
      }

      return true;
    });
  }, [customers, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const handleToggleStatus = (customerId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const nextStatus = c.status === "Enabled" ? "Disabled" : "Enabled";
          toast.success(`Status updated for ${c.name}`, {
            description: `Customer is now ${nextStatus}.`,
          });
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const statusLabel =
    statusFilter === "All" ? "All Status" : statusFilter === "Enabled" ? "Enabled" : "Disabled";

  return (
    <AppShell title="Manage Customer" subtitle="Overview and status control for customer accounts">
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
        
        {/* Search & Filter Toolbar (Bundle Style) */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
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

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2.5 shrink-0">
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
          </div>
        </div>

        {/* Customer Table Container */}
        <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 px-6 w-[45%] font-semibold">Customer</th>
                  <th className="py-4 px-6 w-[22%] font-semibold">Joined Date</th>
                  <th className="py-4 px-6 w-[20%] text-center font-semibold">Purchased Books</th>
                  <th className="py-4 px-6 w-[13%] text-right pr-8 font-semibold">Enable/Disable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((cust) => (
                    <tr
                      key={cust.id}
                      className="group border-b border-border/60 transition-colors hover:bg-secondary/30"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <CustomerAvatar avatarUrl={cust.avatarUrl} name={cust.name} />
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-foreground text-sm">
                              {cust.name}
                            </span>
                            {cust.email && (
                              <span className="text-xs text-muted-foreground truncate">
                                {cust.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-foreground font-medium text-sm">
                        {cust.joinedDate}
                      </td>

                      <td className="py-4 px-6 text-center text-foreground font-medium text-sm">
                        {cust.purchasedBooks}
                      </td>

                      <td className="py-4 px-6 text-right pr-8">
                        <div className="inline-flex items-center justify-end">
                          <Switch
                            checked={cust.status === "Enabled"}
                            onCheckedChange={() => handleToggleStatus(cust.id)}
                            className="data-[state=checked]:bg-[var(--brand)]"
                            aria-label={`Toggle status for ${cust.name}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users size={32} className="text-muted-foreground/50" />
                        <p className="text-base font-medium">No customers found</p>
                        <p className="text-xs">Try adjusting your search query or status filter.</p>
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
            Showing <span className="font-semibold">{paginatedCustomers.length}</span> from{" "}
            <span className="font-semibold">
              {searchQuery || statusFilter !== "All"
                ? filteredCustomers.length
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
      </div>
    </AppShell>
  );
}
