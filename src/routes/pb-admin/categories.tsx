import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Check,
  FolderTree,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/categories")({
  head: () => ({
    meta: [
      { title: "Manage Category — PixelBooks Admin" },
      {
        name: "description",
        content: "View and manage book categories, views, and monthly sales performance in PixelBooks Admin.",
      },
    ],
  }),
  component: ManageCategoryPage,
});

export type StatusValue = "All" | "Enabled" | "Disabled";

export interface CategoryItem {
  id: string;
  name: string;
  views: number;
  avgSalesMonthly: number;
  status: "Enabled" | "Disabled";
  description?: string;
}

// Initial seed dataset matching reference design
const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Fantasy Fiction",
    views: 45,
    avgSalesMonthly: 2,
    status: "Enabled",
    description: "Imaginative fiction featuring magical elements and mythical worlds.",
  },
  {
    id: "cat-2",
    name: "Fantasy Poems",
    views: 0,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Poetic compositions focused on mythical themes and verse.",
  },
  {
    id: "cat-3",
    name: "Drama",
    views: 2,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Theatrical stories focusing on realistic characters and emotional conflict.",
  },
  {
    id: "cat-4",
    name: "General & Literary Fiction",
    views: 53,
    avgSalesMonthly: 7,
    status: "Enabled",
    description: "Acclaimed literary works, narrative prose, and contemporary storytelling.",
  },
  {
    id: "cat-5",
    name: "Tech Cat2",
    views: 0,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Technical literature, programming guides, and software engineering.",
  },
  {
    id: "cat-6",
    name: "Funny and Humorous",
    views: 0,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Lighthearted comedy, satire, jokes, and funny prose.",
  },
  {
    id: "cat-7",
    name: "Science-Fiction & Fantasy",
    views: 2,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Futuristic technology, space exploration, and speculative worlds.",
  },
  {
    id: "cat-8",
    name: "Cat ER",
    views: 0,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Emergency response and healthcare literature.",
  },
  {
    id: "cat-9",
    name: "DS CAT",
    views: 0,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Data Science, machine learning, and artificial intelligence analytics.",
  },
  {
    id: "cat-10",
    name: "FD CAT",
    views: 0,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Financial design, accounting, and economic frameworks.",
  },
];

function ManageCategoryPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusValue>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const simulatedTotalBase = 122;

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (statusFilter === "Enabled" && cat.status !== "Enabled") return false;
      if (statusFilter === "Disabled" && cat.status !== "Disabled") return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = cat.name.toLowerCase().includes(query);
        const matchesDesc = cat.description?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    });
  }, [categories, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  const handleToggleStatus = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          const nextStatus = c.status === "Enabled" ? "Disabled" : "Enabled";
          toast.success(`Status updated for "${c.name}"`, {
            description: `Category is now ${nextStatus}.`,
          });
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const statusLabel =
    statusFilter === "All" ? "All" : statusFilter === "Enabled" ? "Enabled" : "Disabled";

  return (
    <AppShell title="Manage Category" subtitle="Overview and status control for book categories">
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
              <DropdownMenuContent align="end" className="w-[150px] rounded-lg bg-card border-border shadow-lg py-1">
                <DropdownMenuItem
                  onClick={() => {
                    setStatusFilter("All");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer ${
                    statusFilter === "All" ? "font-semibold text-foreground bg-[var(--sidebar-highlight)]" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <span>All</span>
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
          </div>
        </div>

        {/* Category Table Container */}
        <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-semibold text-foreground bg-muted/20">
                  <th className="py-4 px-6 w-[40%]">Category</th>
                  <th className="py-4 px-6 w-[25%]">No of Views</th>
                  <th className="py-4 px-6 w-[22%]">Avg Sales / Month</th>
                  <th className="py-4 px-6 w-[13%] text-right pr-8">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="py-4 px-6">
                        <span className="font-semibold text-foreground text-sm">
                          {cat.name}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-foreground font-medium text-sm">
                        {cat.views} eBook Views
                      </td>

                      <td className="py-4 px-6 text-foreground font-medium text-sm">
                        {cat.avgSalesMonthly} eBooks
                      </td>

                      <td className="py-4 px-6 text-right pr-8">
                        <div className="inline-flex items-center justify-end">
                          <Switch
                            checked={cat.status === "Enabled"}
                            onCheckedChange={() => handleToggleStatus(cat.id)}
                            className="data-[state=checked]:bg-[var(--brand)]"
                            aria-label={`Toggle status for ${cat.name}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FolderTree size={32} className="text-muted-foreground/50" />
                        <p className="text-base font-medium">No categories found</p>
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
            Showing <span className="font-semibold">{paginatedCategories.length}</span> from{" "}
            <span className="font-semibold">
              {searchQuery || statusFilter !== "All"
                ? filteredCategories.length
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

