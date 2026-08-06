import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Scale,
  Plus,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  initialTermsConditions,
  type TermsConditionItem,
} from "@/lib/terms-conditions-data";

export const Route = createFileRoute("/pb-admin-lib/terms-conditions")({
  component: TermsConditionsListPage,
});

function TermsConditionsListPage() {
  const navigate = useNavigate();
  const [termsList] = useState<TermsConditionItem[]>(initialTermsConditions);
  const [selectedRole, setSelectedRole] = useState<string>("All Roles");
  const [selectedStatus, setSelectedStatus] = useState<string>("Active");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const roleOptions = [
    "All Roles",
    "Publisher",
    "Customer",
    "Author",
    "Library",
    "Library User",
  ];

  const statusOptions = ["All Statuses", "Active", "Inactive"];

  const filteredTerms = useMemo(() => {
    return termsList.filter((item) => {
      // Role filter match
      const matchesRole =
        selectedRole === "All Roles" || item.role === selectedRole;

      // Status filter match
      const matchesStatus =
        selectedStatus === "All Statuses" || item.status === selectedStatus;

      return matchesRole && matchesStatus;
    });
  }, [termsList, selectedRole, selectedStatus]);

  return (
    <AppShell
      title="Terms & Conditions"
      subtitle="Manage system-wide terms & conditions across Publisher, Customer, Author, Library, and Library User portals."
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        {/* Top Back Navigation Header */}
        <div className="flex items-center gap-3">
          <Link
            to="/pb-admin/settings"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
            aria-label="Back to Settings"
          >
            <ArrowLeft size={16} />
          </Link>
          <span className="text-sm font-semibold text-foreground">
            Back to Settings
          </span>
        </div>

        {/* Filter & Action Toolbar */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:flex-nowrap md:items-center md:justify-between shadow-2xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Role Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setRoleDropdownOpen((o) => !o);
                  setStatusDropdownOpen(false);
                }}
                className="flex h-11 items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] min-w-[140px]"
              >
                <span>{selectedRole}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                    roleDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute left-0 top-full z-30 mt-1.5 w-44 rounded-lg border border-border bg-card py-1 shadow-lg"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  {roleOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSelectedRole(opt);
                        setRoleDropdownOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors ${
                        opt === selectedRole
                          ? "font-semibold text-foreground bg-secondary/50"
                          : "text-muted-foreground"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setStatusDropdownOpen((o) => !o);
                  setRoleDropdownOpen(false);
                }}
                className="flex h-11 items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] min-w-[130px]"
              >
                <span>{selectedStatus}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                    statusDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {statusDropdownOpen && (
                <div
                  className="absolute left-0 top-full z-30 mt-1.5 w-40 rounded-lg border border-border bg-card py-1 shadow-lg"
                  onMouseLeave={() => setStatusDropdownOpen(false)}
                >
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(opt);
                        setStatusDropdownOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors ${
                        opt === selectedStatus
                          ? "font-semibold text-foreground bg-secondary/50"
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

          {/* Create New Button */}
          <Link
            to="/pb-admin-lib/terms-conditions/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shrink-0 shadow-2xs"
          >
            <Plus size={16} />
            Create New
          </Link>
        </div>

        {/* Table Container */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 pl-6 pr-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Updated Date & Time</th>
                  <th className="py-3.5 pr-6 pl-4 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTerms.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                      No terms and conditions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTerms.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() =>
                        navigate({
                          to: "/pb-admin-lib/terms-conditions/$id",
                          params: { id: item.id },
                        })
                      }
                      className="group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/50"
                    >
                      {/* Role Cell */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3.5">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-card text-[var(--brand)] shadow-2xs group-hover:border-[var(--brand)]/40 transition-colors">
                            <Scale size={18} />
                          </span>
                          <span className="font-semibold text-sm text-foreground group-hover:text-[var(--brand)] transition-colors">
                            {item.role}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {item.status === "Active" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={13} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <AlertTriangle size={13} />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Updated Date & Time */}
                      <td className="py-4 px-4 text-sm font-medium text-foreground">
                        {item.updatedAt}
                      </td>

                      {/* Chevron Action Wrapper */}
                      <td className="py-4 pr-6 pl-4 text-right">
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
        </div>
      </div>
    </AppShell>
  );
}
