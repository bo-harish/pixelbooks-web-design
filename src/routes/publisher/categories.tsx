import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Pencil,
  X,
  Check,
  Trash2,
  ChevronDown,
  AlertCircle,
  GripVertical,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { usePublisherType } from "@/hooks/use-publisher-type";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  MASTER_CATEGORIES,
  type SubcategoryItem,
  getSubcategoryName,
} from "@/lib/categories-data";

export const Route = createFileRoute("/publisher/categories")({
  head: () => ({
    meta: [
      { title: "Manage Category — Publisher" },
      {
        name: "description",
        content: "View and manage book categories, subcategories, and views in Publisher.",
      },
    ],
  }),
  component: ManageLibraryCategoryPage,
});

export type StatusValue = "All" | "Enabled" | "Disabled";

export interface CategoryItem {
  id: string;
  name: string;
  subcategories: SubcategoryItem[];
  views: number;
  status: "Enabled" | "Disabled";
  displayOrder: number;
  isCustom?: boolean;
}

const LIBRARY_CATEGORIES_STORAGE_KEY = "pixelbooks_library_categories_vimala";

// Initial seed dataset matching reference design
const INITIAL_CATEGORIES: CategoryItem[] = MASTER_CATEGORIES.slice(0, 10).map((m, idx) => ({
  id: m.id,
  name: m.name,
  subcategories: [...m.subcategories],
  views: m.views,
  status: m.status,
  displayOrder: m.displayOrder ?? idx + 1,
}));

const DEFAULT_LISTING_SUBCATEGORIES: SubcategoryItem[] = ["General", "Featured"];
const PREFERRED_SUBCATEGORY_CATEGORY_NAMES = ["drama", "fantasy fiction"];

function getMasterSubcategoriesForCategory(category: CategoryItem): SubcategoryItem[] {
  const masterMatch = MASTER_CATEGORIES.find(
    (m) => m.id === category.id || m.name.toLowerCase() === category.name.toLowerCase()
  );

  if (masterMatch?.subcategories && masterMatch.subcategories.length > 0) {
    return [...masterMatch.subcategories];
  }

  return [...DEFAULT_LISTING_SUBCATEGORIES];
}

function ensureAtLeastTwoCategoriesWithSubcategories(items: CategoryItem[]): CategoryItem[] {
  const normalized = [...items];

  // Ensure requested categories always show subcategories in the listing.
  for (let i = 0; i < normalized.length; i += 1) {
    const current = normalized[i];
    const normalizedName = (current.name || "").trim().toLowerCase();
    const isPreferredCategory = PREFERRED_SUBCATEGORY_CATEGORY_NAMES.includes(normalizedName);

    if (!isPreferredCategory || (current.subcategories?.length ?? 0) > 0) continue;

    normalized[i] = {
      ...current,
      subcategories: getMasterSubcategoriesForCategory(current),
    };
  }

  let categoriesWithSubs = normalized.filter(
    (item) => (item.subcategories?.length ?? 0) > 0
  ).length;
  if (categoriesWithSubs >= 2) return normalized;

  for (let i = 0; i < normalized.length && categoriesWithSubs < 2; i += 1) {
    const current = normalized[i];
    if ((current.subcategories?.length ?? 0) > 0) continue;

    normalized[i] = {
      ...current,
      subcategories: getMasterSubcategoriesForCategory(current),
    };

    categoriesWithSubs += 1;
  }

  return normalized;
}

function ManageLibraryCategoryPage() {
  const navigate = useNavigate();
  const [publisherType] = usePublisherType();
  const showStatusColumn = publisherType === "Library-Only Publisher";
  const isCompletePublisher = publisherType === "Complete Publisher";
  const isAuthor =
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/author") || window.location.search.includes("role=author"));

  useEffect(() => {
    if (isAuthor) {
      navigate({ to: "/author", replace: true });
    }
  }, [isAuthor, navigate]);

  if (isAuthor) {
    return null;
  }

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LIBRARY_CATEGORIES_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return ensureAtLeastTwoCategoriesWithSubcategories(parsed.map((item: any, idx: number) => ({
              id: item.id || `cat-${idx + 1}`,
              name: item.name || "Untitled Category",
              subcategories: Array.isArray(item.subcategories) ? item.subcategories : [],
              views: typeof item.views === "number" ? item.views : 0,
              status: item.status === "Disabled" ? "Disabled" : "Enabled",
              displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : idx + 1,
              isCustom: Boolean(item.isCustom),
            })));
          }
        }
      } catch (e) {
        console.error("Error loading categories from localStorage", e);
      }
    }
    return ensureAtLeastTwoCategoriesWithSubcategories(INITIAL_CATEGORIES);
  });

  // Persist changes to localStorage and broadcast event
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LIBRARY_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
        window.dispatchEvent(
          new CustomEvent("pixelbooks_library_categories_updated", { detail: categories })
        );
      } catch (e) {
        console.error("Error saving categories to localStorage", e);
      }
    }
  }, [categories]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusValue>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Drag and Drop state
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Category Dropdown State
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Single Category Name & Display Order State
  const [formName, setFormName] = useState("");
  const [formDisplayOrder, setFormDisplayOrder] = useState<number | string>(1);

  // Inline Error Message State
  const [errorMessage, setErrorMessage] = useState("");

  // Subcategories State (Optional)
  const [formSubcategories, setFormSubcategories] = useState<SubcategoryItem[]>([]);
  const [newSubcatInput, setNewSubcatInput] = useState("");
  const [formStatus, setFormStatus] = useState<"Enabled" | "Disabled">("Enabled");

  // Inline Subcategory Edit State inside Modal
  const [editingSubcatIndex, setEditingSubcatIndex] = useState<number | null>(null);
  const [editingSubcatText, setEditingSubcatText] = useState("");

  const itemsPerPage = 10;
  const simulatedTotalBase = categories.length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };
    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  // Master categories available in system for multi-select
  const allSystemCategories = useMemo(() => {
    return MASTER_CATEGORIES;
  }, []);

  const filteredMasterOptions = useMemo(() => {
    const q = categorySearchTerm.toLowerCase().trim();
    if (!q) return allSystemCategories;
    return allSystemCategories.filter((cat) =>
      cat.name.toLowerCase().includes(q)
    );
  }, [allSystemCategories, categorySearchTerm]);

  // Existing System Categories - categories already added in the library show at the bottom of the list
  const sortedMasterOptions = useMemo(() => {
    return [...filteredMasterOptions].sort((a, b) => {
      const aInLib = categories.some(
        (c) => c.name.toLowerCase() === a.name.toLowerCase()
      );
      const bInLib = categories.some(
        (c) => c.name.toLowerCase() === b.name.toLowerCase()
      );
      if (aInLib !== bInLib) {
        return aInLib ? 1 : -1; // Categories not in library first (top), in library last (bottom)
      }
      return 0;
    });
  }, [filteredMasterOptions, categories]);

  const exactMatchExists = useMemo(() => {
    const q = categorySearchTerm.trim().toLowerCase();
    if (!q) return true;
    return allSystemCategories.some((cat) => cat.name.toLowerCase() === q);
  }, [allSystemCategories, categorySearchTerm]);

  const filteredCategories = useMemo(() => {
    const list = categories.filter((cat) => {
      if (statusFilter === "Enabled" && cat.status !== "Enabled") return false;
      if (statusFilter === "Disabled" && cat.status !== "Disabled") return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = (cat.name || "").toLowerCase().includes(query);
        const matchesSubcat = (cat.subcategories || []).some((sub) =>
          getSubcategoryName(sub).toLowerCase().includes(query)
        );
        if (!matchesName && !matchesSubcat) return false;
      }

      return true;
    });

    return list.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [categories, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    const target = e.target as HTMLElement;
    // Don't initiate drag if clicking buttons, switches, or inputs
    if (target.closest("button, input, [role='switch']")) {
      e.preventDefault();
      return;
    }
    setDraggedCategoryId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedCategoryId && draggedCategoryId !== targetId && dragOverCategoryId !== targetId) {
      setDragOverCategoryId(targetId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, targetId: string) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverCategoryId === targetId) {
      setDragOverCategoryId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedCategoryId || draggedCategoryId === targetId) {
      setDraggedCategoryId(null);
      setDragOverCategoryId(null);
      return;
    }

    setCategories((prev) => {
      const fromIndex = prev.findIndex((c) => c.id === draggedCategoryId);
      const toIndex = prev.findIndex((c) => c.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const newCategories = [...prev];
      const [movedItem] = newCategories.splice(fromIndex, 1);
      newCategories.splice(toIndex, 0, movedItem);

      // Reassign sequential displayOrder based on new array order
      const updated = newCategories.map((c, idx) => ({
        ...c,
        displayOrder: idx + 1,
      }));

      toast.success(`Display order updated for "${movedItem.name}"`, {
        description: `Position changed from #${fromIndex + 1} to #${toIndex + 1}.`,
      });

      return updated;
    });

    setDraggedCategoryId(null);
    setDragOverCategoryId(null);
  };

  const handleDragEnd = () => {
    setDraggedCategoryId(null);
    setDragOverCategoryId(null);
  };

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
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.displayOrder || 0), 0);
    setEditingCategory(null);
    setCategorySearchTerm("");
    setIsCategoryDropdownOpen(false);
    setFormName("");
    setFormDisplayOrder(maxOrder + 1);
    setErrorMessage("");
    setFormSubcategories([]);
    setNewSubcatInput("");
    setEditingSubcatIndex(null);
    setEditingSubcatText("");
    setFormStatus("Enabled");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryItem, focusSubcatIndex?: number) => {
    setEditingCategory(cat);
    setCategorySearchTerm("");
    setIsCategoryDropdownOpen(false);
    setFormName(cat.name);
    setFormDisplayOrder(cat.displayOrder ?? 1);
    setErrorMessage("");
    setFormSubcategories([...cat.subcategories]);
    setNewSubcatInput("");
    setFormStatus(cat.status);

    if (
      !isCompletePublisher &&
      focusSubcatIndex !== undefined &&
      focusSubcatIndex >= 0 &&
      focusSubcatIndex < cat.subcategories.length
    ) {
      const targetSub = cat.subcategories[focusSubcatIndex];
      setEditingSubcatIndex(focusSubcatIndex);
      setEditingSubcatText(getSubcategoryName(targetSub));
    } else {
      setEditingSubcatIndex(null);
      setEditingSubcatText("");
    }

    setIsModalOpen(true);
  };

  const handleSelectMasterCategory = (cat: (typeof MASTER_CATEGORIES)[number]) => {
    const isAlreadyInLibrary = categories.some(
      (c) => c.name.toLowerCase() === cat.name.toLowerCase()
    );
    if (isAlreadyInLibrary) {
      toast.error(`Category "${cat.name}" already exists in your library.`);
      setErrorMessage(`Category "${cat.name}" already exists in your library.`);
      return;
    }

    setFormName(cat.name);
    setCategorySearchTerm("");
    setIsCategoryDropdownOpen(false);
    setErrorMessage("");

    // Pre-fill default subcategories if available
    if (cat.subcategories && cat.subcategories.length > 0) {
      setFormSubcategories([...cat.subcategories]);
    } else {
      setFormSubcategories([]);
    }

  };

  const handleAddSubcategory = () => {
    const trimmed = newSubcatInput.trim();
    if (!trimmed) return;
    setErrorMessage("");
    if (
      formSubcategories.some(
        (sub) => getSubcategoryName(sub).toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      toast.error("Subcategory already exists.");
      setErrorMessage(`Subcategory "${trimmed}" already exists.`);
      return;
    }

    setFormSubcategories((prev) => [...prev, trimmed]);
    setNewSubcatInput("");
  };

  const handleRemoveSubcategory = (index: number) => {
    setFormSubcategories((prev) => prev.filter((_, i) => i !== index));
    if (editingSubcatIndex === index) {
      setEditingSubcatIndex(null);
      setEditingSubcatText("");
    }
  };

  const handleStartSubcategoryEdit = (index: number) => {
    const targetSub = formSubcategories[index];
    setEditingSubcatIndex(index);
    setEditingSubcatText(getSubcategoryName(targetSub));
  };

  const handleSaveSubcategoryEdit = (index: number) => {
    const trimmed = editingSubcatText.trim();
    if (!trimmed) {
      setEditingSubcatIndex(null);
      setEditingSubcatText("");
      return;
    }
    setErrorMessage("");
    if (
      formSubcategories.some(
        (sub, i) =>
          i !== index &&
          getSubcategoryName(sub).toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      toast.error("Subcategory already exists.");
      setErrorMessage(`Subcategory "${trimmed}" already exists.`);
      return;
    }

    setFormSubcategories((prev) =>
      prev.map((sub, i) => (i === index ? trimmed : sub))
    );
    setEditingSubcatIndex(null);
    setEditingSubcatText("");
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Save active subcategory edit if open
    let finalSubcategories = [...formSubcategories];
    if (editingSubcatIndex !== null && editingSubcatText.trim()) {
      const trimmed = editingSubcatText.trim();
      finalSubcategories[editingSubcatIndex] = trimmed;
    }

    const trimmedName = formName.trim();
    if (!trimmedName) {
      toast.error("Category name is required.");
      setErrorMessage("Category name is required.");
      return;
    }

    if (editingCategory) {
      // Category name is locked in publisher edit modal; only subcategories/status/order can update here.
      const lockedCategoryName = editingCategory.name;

      const parsedOrder = parseInt(String(formDisplayOrder), 10);
      const finalDisplayOrder = isNaN(parsedOrder) || parsedOrder < 1 ? 1 : parsedOrder;

      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
              ...c,
              name: lockedCategoryName,
              subcategories: finalSubcategories,
              status: formStatus,
              displayOrder: finalDisplayOrder,
            }
            : c
        )
      );
      toast.success(`Category "${lockedCategoryName}" updated successfully`);
      setIsModalOpen(false);
    } else {
      // Add Mode: Single Category
      const isDuplicate = categories.some(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (isDuplicate) {
        toast.error("Category already exists.");
        setErrorMessage(`Category "${trimmedName}" already exists.`);
        return;
      }

      const maxOrder = categories.reduce((max, c) => Math.max(max, c.displayOrder || 0), 0);
      const parsedOrder = parseInt(String(formDisplayOrder), 10);
      const finalDisplayOrder = isNaN(parsedOrder) || parsedOrder < 1 ? maxOrder + 1 : parsedOrder;

      const masterCat = MASTER_CATEGORIES.find(
        (m) => m.name.toLowerCase() === trimmedName.toLowerCase()
      );

      const newCat: CategoryItem = {
        id: masterCat ? masterCat.id : `cat-${Date.now()}`,
        name: trimmedName,
        subcategories: finalSubcategories,
        views: masterCat ? masterCat.views : 0,
        status: formStatus,
        displayOrder: finalDisplayOrder,
        isCustom: !masterCat,
      };

      setCategories((prev) => [newCat, ...prev]);
      toast.success(`Category "${trimmedName}" added successfully`, {
        description: "Applies only to this publisher account.",
      });
      setIsModalOpen(false);
    }
  };

  const statusLabel =
    statusFilter === "All" ? "All Status" : statusFilter === "Enabled" ? "Enabled" : "Disabled";

  return (
    <AppShell
      title="Categories"
      subtitle="Overview, subcategories, display order, and status control for book categories"
    >
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
                  <th className="py-4 pl-6 pr-4 font-semibold text-center w-28">Display Order</th>
                  <th className="py-4 pr-4 font-semibold min-w-[180px]">Category Name</th>
                  <th className="py-4 pr-4 font-semibold">Subcategories</th>
                  <th className="py-4 pr-4 font-semibold text-center w-24">Views</th>
                  {showStatusColumn && (
                    <th className="py-4 pr-4 font-semibold text-center w-28">Status</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={showStatusColumn ? 5 : 4} className="py-12 text-center text-xs text-muted-foreground">
                      No categories found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((item) => {
                    const isDragging = draggedCategoryId === item.id;
                    const isDragOver = dragOverCategoryId === item.id && !isDragging;

                    return (
                      <tr
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onDragOver={(e) => handleDragOver(e, item.id)}
                        onDragLeave={(e) => handleDragLeave(e, item.id)}
                        onDrop={(e) => handleDrop(e, item.id)}
                        onDragEnd={handleDragEnd}
                        className={`group border-b border-border/60 transition-all last:border-0 hover:bg-secondary/50 ${isDragging ? "opacity-35 bg-secondary/60 scale-[0.99]" : ""
                          } ${isDragOver
                            ? "border-t-2 border-t-[var(--brand)] bg-[var(--brand)]/10"
                            : ""
                          }`}
                      >
                        {/* Display Order Column with Drag Handle */}
                        <td className="py-4 pl-6 pr-4 text-center align-top select-none">
                          <div
                            className="inline-flex items-center justify-center gap-1.5 cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground transition-colors group-hover:text-foreground"
                            title="Drag row to reorder display order"
                          >
                            <GripVertical
                              size={15}
                              className="shrink-0 text-muted-foreground/50 group-hover:text-[var(--brand)] transition-colors"
                            />
                            <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-md border border-border bg-secondary/80 text-xs font-semibold text-foreground shadow-2xs">
                              {item.displayOrder}
                            </span>
                          </div>
                        </td>

                        {/* Name Column */}
                        <td className="py-4 pr-4 font-semibold text-foreground text-sm group-hover:text-[var(--brand)] transition-colors align-top">
                          <span>{item.name}</span>
                        </td>

                        {/* Subcategories Column */}
                        <td className="py-4 pr-4 align-top">
                          <div className="flex flex-wrap gap-1.5 max-w-xl">
                            {item.subcategories && item.subcategories.length > 0 ? (
                              item.subcategories.map((sub, idx) => {
                                const subName = getSubcategoryName(sub);
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleOpenEditModal(item, idx)}
                                    title={`Click to edit subcategory "${subName}"`}
                                    className="group/tag inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/70 hover:bg-secondary hover:border-[var(--brand)]/50 px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors cursor-pointer"
                                  >
                                    <span>{subName}</span>
                                    <Pencil
                                      size={11}
                                      className="text-muted-foreground group-hover/tag:text-[var(--brand)] transition-colors"
                                    />
                                  </button>
                                );
                              })
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(item)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-secondary/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-[var(--brand)]/50 hover:bg-secondary hover:text-foreground cursor-pointer"
                                title={`Add subcategories to "${item.name}"`}
                              >
                                <Plus size={12} className="shrink-0" />
                                <span>Add Subcategory</span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Views Column */}
                        <td className="py-4 pr-4 text-center font-medium text-foreground align-top">
                          {item.views}
                        </td>

                        {showStatusColumn && (
                          <td className="py-4 pr-4 text-center align-top">
                            <div className="inline-flex items-center justify-center">
                              <Switch
                                checked={item.status === "Enabled"}
                                onCheckedChange={() => handleToggleStatus(item.id)}
                              />
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground font-medium">
              Showing{" "}
              {paginatedCategories.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}{" "}
              to {Math.min(currentPage * itemsPerPage, simulatedTotalBase)} of{" "}
              {simulatedTotalBase} entries
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
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
                (pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold cursor-pointer transition-colors ${pg === currentPage
                        ? "bg-[var(--brand)] text-white shadow-2xs"
                        : "border border-border bg-card text-foreground hover:bg-secondary"
                      }`}
                  >
                    {pg}
                  </button>
                )
              )}

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
          <div className="w-full max-w-[740px] rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {editingCategory
                    ? "Update category & subcategories details"
                    : "Enter a category name or select from existing system categories"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-5">
              {isCompletePublisher && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-xs text-foreground">
                  <span className="font-semibold">Note:</span>{" "}
                  Please review the category/subcategory name carefully before adding. Once added, the category
                  cannot be edited or deleted. Any changes must be requested through the System
                  Administrator.
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive animate-in fade-in-50">
                  <AlertCircle size={16} className="shrink-0 text-destructive" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {editingCategory ? (
                /* Edit Mode: Category Name with optional Display Order for library-only publisher */
                <div className={showStatusColumn ? "grid grid-cols-1 sm:grid-cols-3 gap-4" : "space-y-1.5"}>
                  <div className={showStatusColumn ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Category Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Science Fiction"
                      value={formName}
                      readOnly
                      aria-readonly="true"
                      title="Category name is locked. Only System Admin can edit category names."
                      className="h-11 w-full rounded-lg border border-border bg-muted/30 px-3.5 text-xs text-foreground outline-none cursor-not-allowed"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Only System Admin can edit category names.
                    </p>
                  </div>

                  {showStatusColumn && (
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Display Order <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="e.g. 1"
                        value={formDisplayOrder}
                        onChange={(e) => {
                          setFormDisplayOrder(e.target.value);
                          setErrorMessage("");
                        }}
                        className="h-11 w-full rounded-lg border border-border bg-white dark:bg-card px-3.5 text-xs text-foreground outline-none focus:border-[var(--brand)] transition-colors"
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* Add Mode: Single Category Name with System Categories Dropdown */
                <div className={showStatusColumn ? "grid grid-cols-1 sm:grid-cols-3 gap-4" : "space-y-1.5"}>
                  <div className={showStatusColumn ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"} ref={categoryDropdownRef}>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-foreground">
                        Category Name <span className="text-destructive">*</span>
                      </label>
                      <span className="text-[11.5px] text-muted-foreground">
                        Select 1 category or type custom name
                      </span>
                    </div>

                    <div className="relative">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          required
                          placeholder="Select system category or type custom name..."
                          value={formName}
                          onChange={(e) => {
                            setFormName(e.target.value);
                            setCategorySearchTerm(e.target.value);
                            setErrorMessage("");
                            setIsCategoryDropdownOpen(true);
                          }}
                          onFocus={() => {
                            setCategorySearchTerm(formName);
                            setIsCategoryDropdownOpen(true);
                          }}
                          className="h-11 w-full rounded-lg border border-border bg-white dark:bg-card pl-3.5 pr-16 text-xs text-foreground outline-none focus:border-[var(--brand)] transition-colors"
                        />

                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          {formName && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormName("");
                                setCategorySearchTerm("");
                                setFormSubcategories([]);
                              }}
                              className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer"
                              title="Clear"
                            >
                              <X size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setCategorySearchTerm(formName);
                              setIsCategoryDropdownOpen((prev) => !prev);
                            }}
                            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Toggle system categories"
                          >
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-200 ${
                                isCategoryDropdownOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Dropdown Menu of Existing System Categories */}
                      {isCategoryDropdownOpen && (
                        <div className="absolute left-0 top-full z-30 mt-1.5 max-h-80 w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl flex flex-col animate-in fade-in-50 zoom-in-95">
                          <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-3.5 py-2 text-xs">
                            <span className="font-semibold text-muted-foreground">
                              Existing System Categories ({allSystemCategories.length})
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              Select 1 category
                            </span>
                          </div>

                          <div className="overflow-y-auto max-h-64 py-1.5 divide-y divide-border/20">
                            {categorySearchTerm.trim() && !exactMatchExists && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFormName(categorySearchTerm.trim());
                                  setIsCategoryDropdownOpen(false);
                                }}
                                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-left text-xs font-semibold text-[var(--brand)] hover:bg-[var(--sidebar-highlight)] transition-colors cursor-pointer bg-secondary/30"
                              >
                                <Plus size={15} className="shrink-0" />
                                <span className="truncate">
                                  Use custom category: "{categorySearchTerm.trim()}"
                                </span>
                              </button>
                            )}

                            {sortedMasterOptions.length === 0 && !categorySearchTerm.trim() ? (
                              <div className="px-4 py-4 text-center text-xs text-muted-foreground">
                                No categories found.
                              </div>
                            ) : (
                              sortedMasterOptions.map((cat, index) => {
                                const isSelected =
                                  formName.toLowerCase() === cat.name.toLowerCase();
                                const isAlreadyInLibrary = categories.some(
                                  (c) => c.name.toLowerCase() === cat.name.toLowerCase()
                                );

                                const prevCat = index > 0 ? sortedMasterOptions[index - 1] : null;
                                const prevInLib = prevCat
                                  ? categories.some(
                                      (c) => c.name.toLowerCase() === prevCat.name.toLowerCase()
                                    )
                                  : false;
                                const showAlreadyInLibraryHeader =
                                  isAlreadyInLibrary && (!prevCat || !prevInLib);

                                return (
                                  <div key={cat.id}>
                                    {showAlreadyInLibraryHeader && (
                                      <div className="flex items-center justify-between px-3.5 py-2 bg-secondary/80 border-t border-b border-border/50 text-[11px] font-semibold text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                          <span>Already in Library</span>
                                          <span className="rounded bg-secondary px-1.5 py-0.2 border border-border/60 text-[10px]">
                                            {
                                              categories.filter((c) =>
                                                allSystemCategories.some(
                                                  (m) =>
                                                    m.name.toLowerCase() === c.name.toLowerCase()
                                                )
                                              ).length
                                            }
                                          </span>
                                        </span>
                                        <span className="text-[10px] text-muted-foreground/70 font-normal">
                                          Already added
                                        </span>
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      disabled={isAlreadyInLibrary}
                                      onClick={() => handleSelectMasterCategory(cat)}
                                      className={`flex items-center justify-between w-full px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer hover:bg-secondary ${
                                        isSelected
                                          ? "bg-[var(--sidebar-highlight)]/70 font-semibold text-[var(--brand)]"
                                          : isAlreadyInLibrary
                                          ? "opacity-60 text-muted-foreground bg-muted/20 cursor-not-allowed"
                                          : "text-foreground"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="truncate">{cat.name}</span>
                                        {isSelected && (
                                          <Check
                                            size={14}
                                            className="text-[var(--brand)] shrink-0"
                                          />
                                        )}
                                        {isAlreadyInLibrary && (
                                          <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border/50 shrink-0">
                                            In Library
                                          </span>
                                        )}
                                      </div>
                                      {cat.subcategories && cat.subcategories.length > 0 && (
                                        <span className="text-[10.5px] text-muted-foreground shrink-0 pl-2">
                                          {cat.subcategories.length} subs
                                        </span>
                                      )}
                                    </button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {showStatusColumn && (
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Display Order <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="e.g. 1"
                        value={formDisplayOrder}
                        onChange={(e) => {
                          setFormDisplayOrder(e.target.value);
                          setErrorMessage("");
                        }}
                        className="h-11 w-full rounded-lg border border-border bg-white dark:bg-card px-3.5 text-xs text-foreground outline-none focus:border-[var(--brand)] transition-colors"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Subcategories Section (Optional) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-foreground">
                      Subcategories <span className="text-[11px] font-normal text-muted-foreground">(Optional)</span>
                    </label>
                    {editingCategory && (
                      <span className="text-[11px] text-muted-foreground">Existing entries are read-only in edit mode</span>
                    )}
                    
                  </div>

                  {/* Add new subcategory card */}
                  <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-2.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Subcategory name"
                        value={newSubcatInput}
                        onChange={(e) => {
                          setNewSubcatInput(e.target.value);
                          setErrorMessage("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSubcategory();
                          }
                        }}
                        className="h-10 flex-1 rounded-lg border border-border bg-white dark:bg-card px-3.5 text-xs text-foreground outline-none focus:border-[var(--brand)] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleAddSubcategory}
                        className="h-10 px-4 rounded-lg bg-[var(--brand)] text-xs font-semibold text-white hover:bg-[var(--brand)]/90 transition-colors cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5"
                      >
                        <Plus size={14} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                  {/* Editable Subcategories List */}
                  {formSubcategories.length > 0 ? (
                    <div className="flex flex-col gap-2 rounded-xl border border-border bg-secondary/30 p-3 max-h-60 overflow-y-auto">
                      {formSubcategories.map((sub, idx) => {
                        const subName = getSubcategoryName(sub);
                        const isEditing = editingSubcatIndex === idx;

                        if (editingCategory) {
                          return (
                            <div
                              key={idx}
                              className="h-11 w-full rounded-lg border border-border bg-muted/30 px-3.5 text-xs text-foreground flex items-center cursor-not-allowed"
                              title="Subcategory is read-only in edit mode"
                            >
                              <span className="truncate">{subName}</span>
                            </div>
                          );
                        }

                        if (isEditing && !isCompletePublisher && !editingCategory) {
                          return (
                            <div
                              key={idx}
                              className="rounded-lg border border-[var(--brand)]/40 bg-card p-3 space-y-2.5 shadow-xs animate-in fade-in-50"
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editingSubcatText}
                                  onChange={(e) => setEditingSubcatText(e.target.value)}
                                  placeholder="Subcategory name"
                                  className="h-8 flex-1 rounded-md border border-border bg-white dark:bg-card px-2.5 text-xs text-foreground outline-none focus:border-[var(--brand)]"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleSaveSubcategoryEdit(idx);
                                    } else if (e.key === "Escape") {
                                      setEditingSubcatIndex(null);
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveSubcategoryEdit(idx)}
                                  className="flex h-8 px-3 items-center gap-1 rounded-md bg-[var(--brand)] text-white text-xs font-semibold hover:bg-[var(--brand)]/90 transition-colors cursor-pointer shrink-0"
                                  title="Save Subcategory"
                                >
                                  <Check size={14} />
                                  <span>Save</span>
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
                            </div>
                          );
                        }

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-2xs transition-colors hover:border-border/80"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {isCompletePublisher || editingCategory ? (
                                <span className="text-xs font-medium text-foreground text-left truncate">
                                  {subName}
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleStartSubcategoryEdit(idx)}
                                  className="text-xs font-medium text-foreground text-left truncate hover:text-[var(--brand)] transition-colors cursor-pointer"
                                  title="Click to edit subcategory"
                                >
                                  {subName}
                                </button>
                              )}
                            </div>

                            {!isCompletePublisher && !editingCategory && (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleStartSubcategoryEdit(idx)}
                                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-[var(--brand)] transition-colors cursor-pointer"
                                  title="Edit Subcategory"
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
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : editingCategory ? (
                    <div className="h-11 w-full rounded-lg border border-border bg-muted/30 px-3.5 text-xs text-muted-foreground italic flex items-center cursor-not-allowed">
                      No subcategories added.
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic px-1">
                      No subcategories added yet. (Subcategories are optional).
                    </p>
                  )}
                </div>

              {editingCategory && showStatusColumn && (
                <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3.5 sm:p-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground">
                      Status
                    </label>
                    <p className="text-[11.5px] text-muted-foreground mt-0.5">
                      {formStatus === "Enabled"
                        ? "This category will be active and visible in your library."
                        : "This category will be hidden from library users and catalogue filters."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`text-xs font-semibold ${formStatus === "Enabled"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                        }`}
                    >
                      {formStatus}
                    </span>
                    <Switch
                      checked={formStatus === "Enabled"}
                      onCheckedChange={(checked) =>
                        setFormStatus(checked ? "Enabled" : "Disabled")
                      }
                    />
                  </div>
                </div>
              )}

              {!editingCategory && showStatusColumn && (
                <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3.5 sm:p-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground">
                      Status
                    </label>
                    <p className="text-[11.5px] text-muted-foreground mt-0.5">
                      {formStatus === "Enabled"
                        ? "This category will be active and visible in your library."
                        : "This category will be hidden from library users and catalogue filters."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`text-xs font-semibold ${formStatus === "Enabled"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                        }`}
                    >
                      {formStatus}
                    </span>
                    <Switch
                      checked={formStatus === "Enabled"}
                      onCheckedChange={(checked) =>
                        setFormStatus(checked ? "Enabled" : "Disabled")
                      }
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-11 px-5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-lg bg-[var(--brand)] text-xs font-semibold text-white hover:bg-[var(--brand)]/90 transition-colors cursor-pointer shadow-2xs"
                >
                  {editingCategory ? "Save Changes" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
