import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Pencil,
  X,
  Check,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/categories")({
  head: () => ({
    meta: [
      { title: "Manage Category — PixelBooks Admin" },
      {
        name: "description",
        content: "View and manage book categories, subcategories, and views in PixelBooks Admin.",
      },
    ],
  }),
  component: ManageCategoryPage,
});

export type StatusValue = "All" | "Enabled" | "Disabled";

export interface CategoryItem {
  id: string;
  name: string;
  subcategories: string[];
  views: number;
  status: "Enabled" | "Disabled";
}

// Initial seed dataset matching reference design
const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Fantasy Fiction",
    subcategories: ["High Fantasy", "Urban Fantasy", "Dark Fantasy", "Epic Fantasy"],
    views: 45,
    status: "Enabled",
  },
  {
    id: "cat-2",
    name: "Fantasy Poems",
    subcategories: ["Mythological Verse", "Folk Ballads"],
    views: 0,
    status: "Enabled",
  },
  {
    id: "cat-3",
    name: "Drama",
    subcategories: ["Tragedy", "Historical Drama", "Contemporary"],
    views: 2,
    status: "Enabled",
  },
  {
    id: "cat-4",
    name: "General & Literary Fiction",
    subcategories: ["Modern Classics", "Cultural Fiction", "Philosophical"],
    views: 53,
    status: "Enabled",
  },
  {
    id: "cat-5",
    name: "Tech Cat2",
    subcategories: ["Software Engineering", "AI & Data Science", "Web Development"],
    views: 0,
    status: "Enabled",
  },
  {
    id: "cat-6",
    name: "Funny and Humorous",
    subcategories: ["Satire", "Comic Strips", "Parody"],
    views: 0,
    status: "Enabled",
  },
  {
    id: "cat-7",
    name: "Science-Fiction & Fantasy",
    subcategories: ["Cyberpunk", "Space Opera", "Dystopian"],
    views: 2,
    status: "Enabled",
  },
];

function ManageCategoryPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusValue>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formSubcategories, setFormSubcategories] = useState<string[]>([]);
  const [newSubcatInput, setNewSubcatInput] = useState("");
  const [formStatus, setFormStatus] = useState<"Enabled" | "Disabled">("Enabled");

  // Inline Subcategory Edit State inside Modal
  const [editingSubcatIndex, setEditingSubcatIndex] = useState<number | null>(null);
  const [editingSubcatText, setEditingSubcatText] = useState("");

  const itemsPerPage = 10;
  const simulatedTotalBase = categories.length;

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (statusFilter === "Enabled" && cat.status !== "Enabled") return false;
      if (statusFilter === "Disabled" && cat.status !== "Disabled") return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = cat.name.toLowerCase().includes(query);
        const matchesSubcat = cat.subcategories.some((sub) =>
          sub.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesSubcat) return false;
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

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSubcategories([]);
    setNewSubcatInput("");
    setEditingSubcatIndex(null);
    setEditingSubcatText("");
    setFormStatus("Enabled");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryItem, focusSubcatIndex?: number) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSubcategories([...cat.subcategories]);
    setNewSubcatInput("");
    setFormStatus(cat.status);

    if (focusSubcatIndex !== undefined && focusSubcatIndex >= 0 && focusSubcatIndex < cat.subcategories.length) {
      setEditingSubcatIndex(focusSubcatIndex);
      setEditingSubcatText(cat.subcategories[focusSubcatIndex]);
    } else {
      setEditingSubcatIndex(null);
      setEditingSubcatText("");
    }

    setIsModalOpen(true);
  };

  const handleAddSubcategory = () => {
    const trimmed = newSubcatInput.trim();
    if (trimmed && !formSubcategories.includes(trimmed)) {
      setFormSubcategories((prev) => [...prev, trimmed]);
      setNewSubcatInput("");
    }
  };

  const handleRemoveSubcategory = (index: number) => {
    setFormSubcategories((prev) => prev.filter((_, i) => i !== index));
    if (editingSubcatIndex === index) {
      setEditingSubcatIndex(null);
    }
  };

  const handleStartSubcategoryEdit = (index: number) => {
    setEditingSubcatIndex(index);
    setEditingSubcatText(formSubcategories[index]);
  };

  const handleSaveSubcategoryEdit = (index: number) => {
    const trimmed = editingSubcatText.trim();
    if (trimmed) {
      setFormSubcategories((prev) =>
        prev.map((sub, i) => (i === index ? trimmed : sub))
      );
    }
    setEditingSubcatIndex(null);
    setEditingSubcatText("");
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Category name is required.");
      return;
    }

    // Save active subcategory edit if open
    let finalSubcategories = [...formSubcategories];
    if (editingSubcatIndex !== null && editingSubcatText.trim()) {
      finalSubcategories[editingSubcatIndex] = editingSubcatText.trim();
    }

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formName.trim(),
                subcategories: finalSubcategories,
                status: formStatus,
              }
            : c
        )
      );
      toast.success(`Category "${formName.trim()}" updated successfully`);
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: formName.trim(),
        subcategories: finalSubcategories,
        views: 0,
        status: formStatus,
      };
      setCategories((prev) => [newCat, ...prev]);
      toast.success(`Category "${formName.trim()}" added successfully`);
    }

    setIsModalOpen(false);
  };

  const statusLabel =
    statusFilter === "All" ? "All Status" : statusFilter === "Enabled" ? "Enabled" : "Disabled";

  return (
    <AppShell title="Categories" subtitle="Overview, subcategories, and status control for book categories">
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search category or subcategory..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] text-foreground"
            />
          </div>

          {/* Status Filter & Add Category Button */}
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
              className="w-full sm:w-auto min-w-[150px]"
            />

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-[var(--brand)]/90 cursor-pointer shrink-0"
            >
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Categories Table Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold min-w-[180px]">Category Name</th>
                  <th className="py-4 pr-4 font-semibold">Subcategories</th>
                  <th className="py-4 pr-4 font-semibold text-center w-24">Views</th>
                  <th className="py-4 pr-4 font-semibold text-center w-28">Status</th>
                  <th className="py-4 pr-6 font-semibold text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                      No categories found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((item) => (
                    <tr
                      key={item.id}
                      className="group border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50"
                    >
                      {/* Name Column */}
                      <td className="py-4 pl-6 pr-4 font-semibold text-foreground text-sm group-hover:text-[var(--brand)] transition-colors align-top">
                        {item.name}
                      </td>

                      {/* Subcategories Column */}
                      <td className="py-4 pr-4 align-top">
                        <div className="flex flex-wrap gap-1.5 max-w-xl">
                          {item.subcategories.length > 0 ? (
                            item.subcategories.map((sub, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleOpenEditModal(item, idx)}
                                title={`Click to edit subcategory "${sub}"`}
                                className="group/tag inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/70 hover:bg-secondary hover:border-[var(--brand)]/50 px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors cursor-pointer"
                              >
                                <span>{sub}</span>
                                <Pencil size={11} className="text-muted-foreground group-hover/tag:text-[var(--brand)] transition-colors" />
                              </button>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground italic">No subcategories</span>
                          )}
                        </div>
                      </td>

                      {/* Views Column */}
                      <td className="py-4 pr-4 text-center font-medium text-foreground align-top">
                        {item.views}
                      </td>

                      {/* Status Switch Toggle Column */}
                      <td className="py-4 pr-4 text-center align-top">
                        <div className="inline-flex items-center justify-center">
                          <Switch
                            checked={item.status === "Enabled"}
                            onCheckedChange={() => handleToggleStatus(item.id)}
                          />
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 pr-6 text-right align-top">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)] cursor-pointer"
                          title="Edit Category"
                        >
                          <Pencil size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground font-medium">
              Showing {paginatedCategories.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, simulatedTotalBase)} of {simulatedTotalBase} entries
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Prev
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setCurrentPage(pg)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    pg === currentPage
                      ? "bg-[var(--brand)] text-white shadow-2xs"
                      : "border border-border bg-card text-foreground hover:bg-secondary"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <h2 className="text-base font-semibold text-foreground">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              {/* Category Name Input */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Category Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Fiction"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[var(--brand)] transition-colors"
                />
              </div>

              {/* Multiple Subcategories Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Subcategories ({formSubcategories.length})
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Click name or pencil icon to edit
                  </span>
                </div>

                {/* Add new subcategory input row */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Type subcategory and press Add or Enter"
                    value={newSubcatInput}
                    onChange={(e) => setNewSubcatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubcategory();
                      }
                    }}
                    className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[var(--brand)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="h-10 px-4 rounded-lg border border-border bg-secondary text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>

                {/* Editable Subcategories List */}
                {formSubcategories.length > 0 ? (
                  <div className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/30 p-3 max-h-48 overflow-y-auto">
                    {formSubcategories.map((sub, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-2xs transition-colors"
                      >
                        {editingSubcatIndex === idx ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              type="text"
                              value={editingSubcatText}
                              onChange={(e) => setEditingSubcatText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSaveSubcategoryEdit(idx);
                                } else if (e.key === "Escape") {
                                  setEditingSubcatIndex(null);
                                }
                              }}
                              className="h-8 flex-1 rounded-md border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[var(--brand)]"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveSubcategoryEdit(idx)}
                              className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90 transition-colors cursor-pointer shrink-0"
                              title="Save Subcategory"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingSubcatIndex(null)}
                              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartSubcategoryEdit(idx)}
                              className="text-xs font-medium text-foreground text-left flex-1 truncate hover:text-[var(--brand)] transition-colors cursor-pointer"
                              title="Click to edit subcategory name"
                            >
                              {sub}
                            </button>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartSubcategoryEdit(idx)}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-[var(--brand)] transition-colors cursor-pointer"
                                title="Edit Subcategory Name"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveSubcategory(idx)}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                                title="Delete Subcategory"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No subcategories added yet. Type above and press Add or Enter.
                  </p>
                )}
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Status
                </label>
                <DropdownSelect
                  value={formStatus}
                  options={["Enabled", "Disabled"]}
                  onChange={(v) => setFormStatus(v as "Enabled" | "Disabled")}
                  className="w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[var(--brand)] text-xs font-semibold text-white hover:bg-[var(--brand)]/90 transition-colors cursor-pointer"
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

