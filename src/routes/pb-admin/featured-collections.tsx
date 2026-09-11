import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
  BookPlus,
  BookOpen,
  ChevronRight,
  Plus,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Switch } from "@/components/ui/switch";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { BookCover } from "@/components/ui/book-cover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getStoredCollections,
  saveStoredCollections,
  getCollectionBookIds,
  FEATURED_CATALOGUE_BOOKS,
  type CollectionItem,
  type FeaturedBook,
} from "@/lib/featured-collections-data";

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

function CollectionBooksHoverCard({ collection }: { collection: CollectionItem }) {
  const books = useMemo(() => {
    const bookIds = getCollectionBookIds(collection.id);
    return bookIds
      .map((bId) => FEATURED_CATALOGUE_BOOKS.find((b) => b.id === bId))
      .filter((b): b is FeaturedBook => b !== undefined);
  }, [collection.id, collection.bookCount]);

  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>
        <Link
          to="/pb-admin/featured-collections/$id/books"
          params={{ id: collection.id }}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sidebar-highlight)] px-3 py-1 text-xs font-bold text-[var(--brand)] border border-[var(--brand)]/25 shadow-2xs transition-all hover:bg-[var(--brand)] hover:text-white cursor-pointer group/pill"
          title="Manage books in this collection"
        >
          <BookPlus size={13} className="group-hover/pill:scale-110 transition-transform" />
          <span>
            {collection.bookCount ?? 0} {collection.bookCount === 1 ? "Book" : "Books"}
          </span>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        align="center"
        side="top"
        sideOffset={8}
        className="w-80 rounded-xl border border-border bg-card p-3.5 shadow-xl text-left z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen size={14} className="text-[var(--brand)] shrink-0" />
            <p className="text-xs font-bold text-foreground truncate">
              {collection.name}
            </p>
          </div>
          <span className="shrink-0 text-[11px] font-bold text-[var(--brand)] bg-[var(--sidebar-highlight)] px-2 py-0.5 rounded-full border border-[var(--brand)]/20">
            {books.length} {books.length === 1 ? "Title" : "Titles"}
          </span>
        </div>

        {/* Books List */}
        {books.length === 0 ? (
          <div className="py-4 text-center text-xs text-muted-foreground">
            No books assigned yet. Click to add titles.
          </div>
        ) : (
          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-border/40">
            {books.map((b) => (
              <div key={b.id} className="flex items-center gap-2.5 pt-2 first:pt-0">
                <BookCover
                  initials={b.initials}
                  coverGradient={b.coverGradient}
                  title={b.title}
                  size="xs"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate leading-tight">
                    {b.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {b.author}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {b.category} • ₹{b.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Quick Action */}
        <div className="pt-2 mt-2 border-t border-border/70">
          <Link
            to="/pb-admin/featured-collections/$id/books"
            params={{ id: collection.id }}
            className="flex items-center justify-between text-[11px] font-semibold text-[var(--brand)] hover:underline"
          >
            <span>Click to Add / Remove Books</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function FeaturedCollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>(() => getStoredCollections());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusValue>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Sync collections whenever mounted or focused
  useEffect(() => {
    setCollections(getStoredCollections());
  }, []);

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

    const updated = [newCollection, ...collections];
    setCollections(updated);
    saveStoredCollections(updated);
    toast.success(`Featured Collection "${addNameInput.trim()}" created successfully!`);
    setIsAddModalOpen(false);
  };

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
    const updated = collections.map((c) => {
      if (c.id === collectionId) {
        const nextStatus: "Enabled" | "Disabled" = c.status === "Enabled" ? "Disabled" : "Enabled";
        toast.success(`Status updated for "${c.name}"`, {
          description: `Collection is now ${nextStatus}.`,
        });
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setCollections(updated);
    saveStoredCollections(updated);
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

    const updated = collections.map((c) =>
      c.id === editingCollection.id
        ? {
            ...c,
            name: editNameInput.trim(),
            description: editDescInput.trim(),
            sorting: editSortingInput.trim(),
            designLayout: editDesignInput as "A1 Design" | "A2 Design",
          }
        : c
    );

    setCollections(updated);
    saveStoredCollections(updated);
    toast.success(`Collection "${editNameInput.trim()}" updated!`);
    setEditingCollection(null);
  };

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
              placeholder="Search collections..."
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
                  <th className="py-4 pr-4 font-semibold text-center">Books</th>
                  <th className="py-4 pr-4 font-semibold text-center">Views</th>
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
                          <Link
                            to="/pb-admin/featured-collections/$id/books"
                            params={{ id: item.id }}
                            className="font-semibold text-foreground text-sm group-hover:text-[var(--brand)] transition-colors hover:underline inline-block"
                          >
                            {item.name}
                          </Link>
                          {item.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
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

                      {/* Books Count Column (Direct Link to Manage Books with Hover Popup) */}
                      <td className="py-4 pr-4 text-center">
                        <CollectionBooksHoverCard collection={item} />
                      </td>

                      {/* Views Column */}
                      <td className="py-4 pr-4 text-center font-medium text-foreground">
                        {item.views}
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

                      {/* Action Column: High Priority Add/Remove Books Button & Secondary Edit */}
                      <td className="py-4 pr-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <Link
                            to="/pb-admin/featured-collections/$id/books"
                            params={{ id: item.id }}
                            className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition-all hover:bg-[var(--brand)]/90 hover:shadow-sm cursor-pointer"
                          >
                            <BookPlus size={15} strokeWidth={2.5} />
                            <span>Add / Remove Books</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
                            title="Edit Collection Details"
                          >
                            <Pencil size={13} />
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
    </AppShell>
  );
}
