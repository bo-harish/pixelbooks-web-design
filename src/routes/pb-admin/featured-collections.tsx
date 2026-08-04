import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Check,
  FolderTree,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
  BookPlus,
  BookOpen,
  Plus,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BookCover } from "@/components/ui/book-cover";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/featured-collections")({
  head: () => ({
    meta: [
      { title: "Featured Collections — PixelBooks Admin" },
      {
        name: "description",
        content: "View and manage featured book collections, views, and monthly sales performance in PixelBooks Admin.",
      },
    ],
  }),
  component: FeaturedCollectionsPage,
});

export type StatusValue = "All" | "Enabled" | "Disabled";

export interface CollectionItem {
  id: string;
  name: string;
  views: number;
  avgSalesMonthly: number;
  status: "Enabled" | "Disabled";
  description?: string;
  bookCount?: number;
  sorting?: string;
  designLayout?: "A1 Design" | "A2 Design";
}

interface CandidateBook {
  id: string;
  title: string;
  author: string;
  initials: string;
  genre: string;
}

const SAMPLE_CANDIDATE_BOOKS: CandidateBook[] = [
  { id: "b1", title: "THE VOICE FROM ROOM 03", author: "Hellen Walker", initials: "VW", genre: "Crime, Thriller" },
  { id: "b2", title: "Foreword - Classic Literary Introductions", author: "Various Authors", initials: "FW", genre: "Classics" },
  { id: "b3", title: "NEP 2020 - Policy Formulation In Education", author: "Dr. Ashok Alex", initials: "NEP", genre: "Education" },
  { id: "b4", title: "A Complete History of Music for Schools", author: "W. J. Baltzell", initials: "MUS", genre: "Music" },
  { id: "b5", title: "The Curtiss Aviation Book", author: "Glenn H. Curtiss", initials: "CAB", genre: "History" },
  { id: "b6", title: "John M Upton - Special Edition", author: "John M Upton", initials: "JMU", genre: "Special" },
];

// Initial seed dataset matching reference design
const INITIAL_COLLECTIONS: CollectionItem[] = [
  {
    id: "cat-1",
    name: "Fantasy Fiction",
    views: 45,
    avgSalesMonthly: 2,
    status: "Enabled",
    description: "Imaginative fiction featuring magical elements and mythical worlds.",
    bookCount: 4,
    designLayout: "A1 Design",
  },
  {
    id: "cat-2",
    name: "Fantasy Poems",
    views: 0,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Poetic compositions focused on mythical themes and verse.",
    bookCount: 2,
    designLayout: "A2 Design",
  },
  {
    id: "cat-3",
    name: "Drama",
    views: 2,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Theatrical stories focusing on realistic characters and emotional conflict.",
    bookCount: 5,
    designLayout: "A1 Design",
  },
  {
    id: "cat-4",
    name: "General & Literary Fiction",
    views: 53,
    avgSalesMonthly: 7,
    status: "Enabled",
    description: "Acclaimed literary works, narrative prose, and contemporary storytelling.",
    bookCount: 8,
    designLayout: "A2 Design",
  },
  {
    id: "cat-5",
    name: "Tech Cat2",
    views: 0,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Technical literature, programming guides, and software engineering.",
    bookCount: 3,
    designLayout: "A1 Design",
  },
  {
    id: "cat-6",
    name: "Funny and Humorous",
    views: 0,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Lighthearted comedy, satire, jokes, and funny prose.",
    bookCount: 1,
    designLayout: "A2 Design",
  },
  {
    id: "cat-7",
    name: "Science-Fiction & Fantasy",
    views: 2,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Futuristic technology, space exploration, and speculative worlds.",
    bookCount: 6,
    designLayout: "A1 Design",
  },
];

function FeaturedCollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>(INITIAL_COLLECTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusValue>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Add Collection Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addNameInput, setAddNameInput] = useState("");
  const [addDescInput, setAddDescInput] = useState("");
  const [addSortingInput, setAddSortingInput] = useState("1");
  const [addDesignInput, setAddDesignInput] = useState("A1 Design");

  // Edit Collection Modal State
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);
  const [editNameInput, setEditNameInput] = useState("");
  const [editDescInput, setEditDescInput] = useState("");
  const [editSortingInput, setEditSortingInput] = useState("1");
  const [editDesignInput, setEditDesignInput] = useState("A1 Design");

  const handleOpenAddModal = () => {
    setAddNameInput("");
    setAddDescInput("");
    setAddSortingInput("1");
    setAddDesignInput("A1 Design");
    setIsAddModalOpen(true);
  };

  const handleCreateCollection = () => {
    if (!addNameInput.trim()) {
      toast.error("Collection Name cannot be empty!");
      return;
    }

    const newCollection: CollectionItem = {
      id: `cat-${Date.now()}`,
      name: addNameInput.trim(),
      description: addDescInput.trim(),
      views: 0,
      avgSalesMonthly: 0,
      status: "Enabled",
      bookCount: 0,
      sorting: addSortingInput.trim(),
      designLayout: addDesignInput as "A1 Design" | "A2 Design",
    };

    setCollections((prev) => [newCollection, ...prev]);
    toast.success(`Featured Collection "${addNameInput.trim()}" created successfully!`);
    setIsAddModalOpen(false);
  };

  // Manage Books Modal State
  const [managingBooksCollection, setManagingBooksCollection] = useState<CollectionItem | null>(null);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>(["b1", "b2", "b3"]);
  const [bookSearchQuery, setBookSearchQuery] = useState("");

  const itemsPerPage = 10;
  const simulatedTotalBase = 122;

  const filteredCollections = useMemo(() => {
    return collections.filter((cat) => {
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
  }, [collections, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage) || 1;

  const paginatedCollections = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCollections.slice(start, start + itemsPerPage);
  }, [filteredCollections, currentPage, itemsPerPage]);

  const handleToggleStatus = (collectionId: string) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id === collectionId) {
          const nextStatus = c.status === "Enabled" ? "Disabled" : "Enabled";
          toast.success(`Status updated for "${c.name}"`, {
            description: `Collection is now ${nextStatus}.`,
          });
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  // Open Edit Collection Dialog
  const handleOpenEditModal = (item: CollectionItem) => {
    setEditingCollection(item);
    setEditNameInput(item.name);
    setEditDescInput(item.description || "");
    setEditSortingInput(item.sorting || "1");
    setEditDesignInput(item.designLayout || "A1 Design");
  };

  const handleSaveEditCollection = () => {
    if (!editingCollection) return;
    if (!editNameInput.trim()) {
      toast.error("Collection Name cannot be empty!");
      return;
    }

    setCollections((prev) =>
      prev.map((c) =>
        c.id === editingCollection.id
          ? {
            ...c,
            name: editNameInput.trim(),
            description: editDescInput.trim(),
            sorting: editSortingInput.trim(),
            designLayout: editDesignInput as "A1 Design" | "A2 Design",
          }
          : c
      )
    );

    toast.success(`Collection "${editNameInput.trim()}" updated!`);
    setEditingCollection(null);
  };

  // Open Add/Remove Books Dialog
  const handleOpenManageBooksModal = (item: CollectionItem) => {
    setManagingBooksCollection(item);
    setBookSearchQuery("");
    // Default selection
    setSelectedBookIds(["b1", "b2", "b3"]);
  };

  const handleToggleBookSelection = (bookId: string) => {
    setSelectedBookIds((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const handleSaveManageBooks = () => {
    if (!managingBooksCollection) return;
    setCollections((prev) =>
      prev.map((c) =>
        c.id === managingBooksCollection.id
          ? { ...c, bookCount: selectedBookIds.length }
          : c
      )
    );

    toast.success(`Books updated for "${managingBooksCollection.name}" (${selectedBookIds.length} books selected)`);
    setManagingBooksCollection(null);
  };

  const filteredCandidateBooks = useMemo(() => {
    if (!bookSearchQuery.trim()) return SAMPLE_CANDIDATE_BOOKS;
    const q = bookSearchQuery.toLowerCase().trim();
    return SAMPLE_CANDIDATE_BOOKS.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.genre.toLowerCase().includes(q)
    );
  }, [bookSearchQuery]);

  const statusLabel =
    statusFilter === "All" ? "All Status" : statusFilter === "Enabled" ? "Enabled" : "Disabled";

  return (
    <AppShell title="Featured Collections" subtitle="Overview and status control for featured book collections">
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
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] text-foreground"
            />
          </div>

          {/* Status Filter & Add Featured Collection Button */}
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
              <span>Add Featured Collection</span>
            </button>
          </div>
        </div>

        {/* Collections Table Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Collection Name</th>
                  <th className="py-4 pr-4 font-semibold">Design Layout</th>
                  <th className="py-4 pr-4 font-semibold text-center">Views</th>
                  <th className="py-4 pr-4 font-semibold text-center">Avg. Sales (Monthly)</th>
                  <th className="py-4 pr-4 font-semibold text-center">Status</th>
                  <th className="py-4 pr-6 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedCollections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                      No featured collections found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedCollections.map((item) => (
                    <tr
                      key={item.id}
                      className="group border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50"
                    >
                      {/* Name Column */}
                      <td className="py-4 pl-6 pr-4">
                        <div>
                          <p className="font-semibold text-foreground text-sm group-hover:text-[var(--brand)] transition-colors">
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Design Layout Column */}
                      <td className="py-4 pr-4 text-xs font-semibold text-foreground whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-xs font-medium text-foreground">
                          {item.designLayout || "A1 Design"}
                        </span>
                      </td>

                      {/* Views Column */}
                      <td className="py-4 pr-4 text-center font-medium text-foreground">
                        {item.views}
                      </td>

                      {/* Avg Sales Monthly Column */}
                      <td className="py-4 pr-4 text-center font-medium text-foreground">
                        {item.avgSalesMonthly}
                      </td>

                      {/* Status Switch Toggle Column */}
                      <td className="py-4 pr-4 text-center">
                        <div className="inline-flex items-center justify-center">
                          <Switch
                            checked={item.status === "Enabled"}
                            onCheckedChange={() => handleToggleStatus(item.id)}
                          />
                        </div>
                      </td>

                      {/* Action Column: Add/Remove Books & Edit */}
                      <td className="py-4 pr-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenManageBooksModal(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer shadow-2xs"
                          >
                            <BookPlus size={14} className="text-[var(--brand)]" />
                            <span>Add/Remove Books</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer shadow-2xs"
                          >
                            <Pencil size={13} className="text-muted-foreground" />
                            <span>Edit</span>
                          </button>
                        </div>
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
              Showing {paginatedCollections.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
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
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold cursor-pointer transition-colors ${pg === currentPage
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

      {/* Add Featured Collection Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Add Featured Collection
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Collection Name<span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={addNameInput}
                onChange={(e) => setAddNameInput(e.target.value)}
                placeholder="Enter Collection Name"
                className="w-full h-11 px-3 bg-card border border-border rounded-lg text-sm outline-none text-foreground focus:border-[var(--brand)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={addDescInput}
                onChange={(e) => setAddDescInput(e.target.value)}
                placeholder="Brief description of this collection..."
                className="w-full p-3 bg-card border border-border rounded-lg text-sm outline-none text-foreground focus:border-[var(--brand)] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Sorting
                </label>
                <input
                  type="text"
                  value={addSortingInput}
                  onChange={(e) => setAddSortingInput(e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full h-11 px-3 bg-card border border-border rounded-lg text-sm outline-none text-foreground focus:border-[var(--brand)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Design Layout
                </label>
                <DropdownSelect
                  value={addDesignInput}
                  options={["A1 Design", "A2 Design"]}
                  onChange={(v) => setAddDesignInput(v)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="h-10 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateCollection}
              className="h-10 rounded-lg bg-[var(--brand)] px-5 text-xs font-semibold text-white shadow-2xs hover:opacity-90 cursor-pointer"
            >
              Create Collection
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Collection Modal */}
      <Dialog open={!!editingCollection} onOpenChange={(open) => !open && setEditingCollection(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Edit Collection
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Collection Name<span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={editNameInput}
                onChange={(e) => setEditNameInput(e.target.value)}
                placeholder="Enter Collection Name"
                className="w-full h-11 px-3 bg-card border border-border rounded-lg text-sm outline-none text-foreground focus:border-[var(--brand)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={editDescInput}
                onChange={(e) => setEditDescInput(e.target.value)}
                placeholder="Brief description of this collection..."
                className="w-full p-3 bg-card border border-border rounded-lg text-sm outline-none text-foreground focus:border-[var(--brand)] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Sorting
                </label>
                <input
                  type="text"
                  value={editSortingInput}
                  onChange={(e) => setEditSortingInput(e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full h-11 px-3 bg-card border border-border rounded-lg text-sm outline-none text-foreground focus:border-[var(--brand)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Design Layout
                </label>
                <DropdownSelect
                  value={editDesignInput}
                  options={["A1 Design", "A2 Design"]}
                  onChange={(v) => setEditDesignInput(v)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingCollection(null)}
              className="h-10 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEditCollection}
              className="h-10 rounded-lg bg-[var(--brand)] px-5 text-xs font-semibold text-white shadow-2xs hover:opacity-90 cursor-pointer"
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Remove Books Modal */}
      <Dialog open={!!managingBooksCollection} onOpenChange={(open) => !open && setManagingBooksCollection(null)}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center justify-between">
              <span>Add / Remove Books</span>
              {managingBooksCollection && (
                <span className="text-xs font-normal text-muted-foreground">
                  ({managingBooksCollection.name})
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Search Books */}
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
                placeholder="Search titles or authors to add..."
                className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-4 text-xs outline-none text-foreground placeholder:text-muted-foreground focus:border-[var(--brand)]"
              />
            </div>

            {/* Selected Count Indicator */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-muted-foreground">
                Available Catalogue Titles
              </span>
              <span className="inline-flex items-center rounded-full bg-[var(--sidebar-highlight)] px-2.5 py-0.5 text-xs font-bold text-[var(--brand)] border border-[var(--brand)]/20">
                {selectedBookIds.length} Selected
              </span>
            </div>

            {/* Candidate Books List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-border/40 border border-border rounded-xl p-2 bg-secondary/10">
              {filteredCandidateBooks.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  No books found matching search term.
                </p>
              ) : (
                filteredCandidateBooks.map((book) => {
                  const isChecked = selectedBookIds.includes(book.id);
                  return (
                    <label
                      key={book.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg transition-colors cursor-pointer ${isChecked ? "bg-[var(--sidebar-highlight)]/40 border border-[var(--brand)]/20" : "hover:bg-secondary/60"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleBookSelection(book.id)}
                          className="h-4 w-4 rounded border-border text-[var(--brand)] focus:ring-[var(--brand)] cursor-pointer"
                        />
                        <BookCover
                          initials={book.initials}
                          coverGradient="linear-gradient(135deg, #0f172a, #1e293b)"
                          title={book.title}
                          size="xs"
                        />
                        <div>
                          <p className="text-xs font-bold text-foreground leading-snug line-clamp-1">
                            {book.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {book.author} • {book.genre}
                          </p>
                        </div>
                      </div>
                      {isChecked && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)] text-white text-[10px]">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setManagingBooksCollection(null)}
              className="h-10 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveManageBooks}
              className="h-10 rounded-lg bg-[var(--brand)] px-5 text-xs font-semibold text-white shadow-2xs hover:opacity-90 cursor-pointer"
            >
              Save Books
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
