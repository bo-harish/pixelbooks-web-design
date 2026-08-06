import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Library,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/pb-admin-lib/libraries")({
  component: PBAdminLibrariesPage,
});

/* -------------------------------------------------------------------------- */
/*                                 MOCK DATA                                  */
/* -------------------------------------------------------------------------- */

type InstitutionalLibrary = {
  id: string;
  name: string;
  location: string;
  totalUsers: number;
  activeUsers: number;
  ebooksPurchased: number;
  amount: string;
  status: "Onboarded" | "Pending" | "Rejected";
  joinedDate: string;
  contactEmail: string;
};

const initialLibraries: InstitutionalLibrary[] = [
  {
    id: "LIB-101",
    name: "The District Central Library",
    location: "Ernakulam",
    totalUsers: 9,
    activeUsers: 2,
    ebooksPurchased: 13,
    amount: "₹14,736.75",
    status: "Onboarded",
    joinedDate: "12 May 2026",
    contactEmail: "admin@districtlib-ernakulam.org",
  },
  {
    id: "LIB-102",
    name: "National University of Advanced Legal Studies",
    location: "Banglore",
    totalUsers: 37,
    activeUsers: 4,
    ebooksPurchased: 1807,
    amount: "₹1,399,951.88",
    status: "Onboarded",
    joinedDate: "18 Jun 2026",
    contactEmail: "contact@nuals.ac.in",
  },
  {
    id: "LIB-103",
    name: "PSG",
    location: "Kochi",
    totalUsers: 2,
    activeUsers: 1,
    ebooksPurchased: 1,
    amount: "₹2,000.00",
    status: "Onboarded",
    joinedDate: "01 Jul 2026",
    contactEmail: "library@psgtech.ac.in",
  },
  {
    id: "LIB-104",
    name: "AS Library",
    location: "Trivandrum",
    totalUsers: 0,
    activeUsers: 0,
    ebooksPurchased: 0,
    amount: "₹0.00",
    status: "Pending",
    joinedDate: "03 Aug 2026",
    contactEmail: "info@aslibrary.edu",
  },
  {
    id: "LIB-105",
    name: "KTU",
    location: "Thiruvananthapuram",
    totalUsers: 17,
    activeUsers: 8,
    ebooksPurchased: 450,
    amount: "₹480,000.00",
    status: "Onboarded",
    joinedDate: "10 Apr 2026",
    contactEmail: "library@aktu.ac.in",
  },
  {
    id: "LIB-106",
    name: "SRM",
    location: "Chennai",
    totalUsers: 12,
    activeUsers: 5,
    ebooksPurchased: 310,
    amount: "₹320,500.00",
    status: "Onboarded",
    joinedDate: "22 May 2026",
    contactEmail: "admin@srmuniv.ac.in",
  },
  {
    id: "LIB-107",
    name: "University of Oxford",
    location: "Oxford, UK",
    totalUsers: 0,
    activeUsers: 0,
    ebooksPurchased: 0,
    amount: "₹0.00",
    status: "Rejected",
    joinedDate: "28 Jul 2026",
    contactEmail: "bodleian@ox.ac.uk",
  },
  {
    id: "LIB-108",
    name: "Stanford University",
    location: "California, USA",
    totalUsers: 45,
    activeUsers: 19,
    ebooksPurchased: 980,
    amount: "₹1,120,000.00",
    status: "Onboarded",
    joinedDate: "15 Feb 2026",
    contactEmail: "greenlib@stanford.edu",
  },
];

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

function PBAdminLibrariesPage() {
  const navigate = useNavigate();
  const [libraries] = useState<InstitutionalLibrary[]>(initialLibraries);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const filteredLibraries = useMemo(() => {
    return libraries.filter((lib) => {
      const matchesSearch =
        lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lib.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lib.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || lib.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [libraries, searchTerm, statusFilter]);

  const statusOptions = ["All", "Onboarded", "Pending", "Rejected"];

  return (
    <AppShell
      title="Libraries"
      subtitle="Manage institutional library registrations, onboarding status, and member access."
    >
      <div className="space-y-6 p-4 sm:p-6 md:p-8">
        {/* Top Metric Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Library */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs transition-all hover:shadow-md min-h-[148px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                  Total Libraries
                </span>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-500/20 shadow-2xs">
                <Library size={20} strokeWidth={2} />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                41
              </p>
            </div>
          </div>

          {/* Onboarded Libraries */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs transition-all hover:shadow-md min-h-[148px]">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pt-0.5">
                ONBOARDED LIBRARIES
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                <CheckCircle2 size={20} strokeWidth={2} />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                35
              </p>
            </div>
          </div>

          {/* Pending Approval */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs transition-all hover:shadow-md min-h-[148px]">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pt-0.5">
                PENDING APPROVAL
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-500/20 shadow-2xs">
                <Clock size={20} strokeWidth={2} />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                4
              </p>
            </div>
          </div>

          {/* Rejected / Inactive */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs transition-all hover:shadow-md min-h-[148px]">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pt-0.5">
                REJECTED / INACTIVE
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-500/20 shadow-2xs">
                <XCircle size={20} strokeWidth={2} />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                2
              </p>
            </div>
          </div>
        </section>

        {/* Toolbar: Search + Status Dropdown + Add Library Action */}
        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input Bar */}
            <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 md:max-w-md">
              <Search size={15} className="mr-2 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>

            {/* Custom Status Dropdown Select */}
            <div className="relative min-w-[150px]">
              <button
                type="button"
                onClick={() => setStatusDropdownOpen((o) => !o)}
                className="flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] shadow-2xs"
              >
                <span>{statusFilter}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                    statusDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {statusDropdownOpen && (
                <div
                  className="absolute right-0 top-full z-30 mt-2 min-w-[160px] w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1"
                  onMouseLeave={() => setStatusDropdownOpen(false)}
                >
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setStatusFilter(opt);
                        setStatusDropdownOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-secondary/60 transition-colors ${
                        opt === statusFilter
                          ? "font-medium text-foreground bg-secondary/50"
                          : "text-muted-foreground"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Library Page Navigation Button */}
          <Link
            to="/pb-admin-lib/libraries/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shrink-0 shadow-2xs"
          >
            <Plus size={16} />
            Add Library
          </Link>
        </section>

        {/* Library Table Listing */}
        <section className="rounded-2xl border border-border bg-card p-4 md:p-6 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3.5 pr-4 pl-4">Library</th>
                  <th className="pb-3.5 px-4 text-center">Status</th>
                  <th className="pb-3.5 pl-4 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredLibraries.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground">
                      No matching libraries found.
                    </td>
                  </tr>
                ) : (
                  filteredLibraries.map((lib) => (
                    <tr
                      key={lib.id}
                      onClick={() => navigate({ to: "/pb-admin-lib/libraries/$id", params: { id: lib.id } })}
                      className="group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/50"
                    >
                      {/* Library Cell: Blue Icon + Title + Total Users */}
                      <td className="py-4 pr-4 pl-4">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 shadow-2xs">
                            <Library size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm leading-snug group-hover:text-[var(--brand)] transition-colors">
                              {lib.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">
                              Total Users:{lib.totalUsers}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status Cell */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            lib.status === "Onboarded"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : lib.status === "Pending"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {lib.status === "Onboarded" ? (
                            <CheckCircle2 size={13} />
                          ) : lib.status === "Pending" ? (
                            <Clock size={13} />
                          ) : (
                            <XCircle size={13} />
                          )}
                          {lib.status}
                        </span>
                      </td>

                      {/* Action Chevron Wrapper (Rule 9) */}
                      <td className="py-4 pl-4 pr-4 text-right">
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
        </section>
      </div>
    </AppShell>
  );
}
