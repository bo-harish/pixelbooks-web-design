import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Trash2,
  ChevronRight,
  ArrowLeft,
  UploadCloud,
  ImageIcon,
  Monitor,
  Smartphone,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/library-admin/banners")({
  head: () => ({
    meta: [
      { title: "Image Banner — Library Admin" },
      {
        name: "description",
        content: "Manage hero banner sliders and announcement cover images in Library Admin.",
      },
    ],
  }),
  component: LibraryAdminBannersPage,
});

export interface LibraryBannerItem {
  id: string;
  title: string;
  fromDate: string;
  toDate: string;
  imageColor: string;
  webCover?: string;
  mobileCover?: string;
  enabled: boolean;
}

const INITIAL_BANNERS: LibraryBannerItem[] = [
  {
    id: "b1",
    title: "Student Reading Hub Banner",
    imageColor: "linear-gradient(135deg, #0d5c58 0%, #063d3a 50%, #15736d 100%)",
    fromDate: "2026-01-05",
    toDate: "2026-12-31",
    enabled: true,
  },
  {
    id: "b2",
    title: "New eBook Additions Banner",
    imageColor: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
    fromDate: "2026-05-10",
    toDate: "2026-08-15",
    enabled: false,
  },
];

export function LibraryAdminBannersPage() {
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  const [banners, setBanners] = useState<LibraryBannerItem[]>(INITIAL_BANNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All Status" | "Active" | "Inactive">("All Status");

  // Editing state
  const [editingBanner, setEditingBanner] = useState<LibraryBannerItem | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<LibraryBannerItem | null>(null);

  // Form Inputs (ONLY original fields preserved)
  const [titleInput, setTitleInput] = useState("");
  const [fromDateInput, setFromDateInput] = useState("2026-07-25");
  const [toDateInput, setToDateInput] = useState("2026-12-31");
  const [webCoverUploaded, setWebCoverUploaded] = useState<string | null>(null);
  const [mobileCoverUploaded, setMobileCoverUploaded] = useState<string | null>(null);

  // Filtered Banners
  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      // Status filter
      if (statusFilter === "Active" && !b.enabled) return false;
      if (statusFilter === "Inactive" && b.enabled) return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return b.title.toLowerCase().includes(q);
    });
  }, [banners, searchQuery, statusFilter]);

  // Format Date string helper
  const formatDateString = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Toggle status
  const handleToggleStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.enabled;
          toast.success(`Banner status updated to ${next ? "Active" : "Inactive"}`);
          return { ...item, enabled: next };
        }
        return item;
      })
    );
  };

  // Confirm delete banner
  const confirmDeleteBanner = () => {
    if (!deletingBanner) return;
    setBanners((prev) => prev.filter((b) => b.id !== deletingBanner.id));
    toast.success(`Removed image banner "${deletingBanner.title}"`);
    setDeletingBanner(null);
  };

  // Open Edit Banner form
  const handleOpenEditBanner = (item: LibraryBannerItem) => {
    setEditingBanner(item);
    setTitleInput(item.title);
    setFromDateInput(item.fromDate || "2026-07-25");
    setToDateInput(item.toDate || "2026-12-31");
    setWebCoverUploaded(item.webCover || item.imageColor);
    setMobileCoverUploaded(item.mobileCover || item.imageColor);
    setViewMode("create");
  };

  // Open Add New Banner form
  const handleOpenAddNewBanner = () => {
    setEditingBanner(null);
    setTitleInput("");
    setFromDateInput("2026-07-25");
    setToDateInput("2026-12-31");
    setWebCoverUploaded(null);
    setMobileCoverUploaded(null);
    setViewMode("create");
  };

  // Submit Save/Create Form
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) {
      toast.error("Please enter a Banner Title.");
      return;
    }

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? {
                ...b,
                title: titleInput,
                fromDate: fromDateInput,
                toDate: toDateInput,
                webCover: webCoverUploaded || b.webCover,
                mobileCover: mobileCoverUploaded || b.mobileCover,
              }
            : b
        )
      );
      toast.success(`Image Banner "${titleInput}" updated successfully!`);
    } else {
      const newBanner: LibraryBannerItem = {
        id: `b-${Date.now()}`,
        title: titleInput,
        fromDate: fromDateInput,
        toDate: toDateInput,
        imageColor: webCoverUploaded || "linear-gradient(135deg, #0d5c58 0%, #063d3a 100%)",
        webCover: webCoverUploaded || "linear-gradient(135deg, #0d5c58 0%, #063d3a 100%)",
        mobileCover: mobileCoverUploaded || "linear-gradient(135deg, #0d5c58 0%, #063d3a 100%)",
        enabled: true,
      };
      setBanners((prev) => [newBanner, ...prev]);
      toast.success(`Image Banner "${titleInput}" created successfully!`);
    }

    setViewMode("list");
    setEditingBanner(null);
  };

  const pageTitle =
    viewMode === "create"
      ? editingBanner
        ? `Edit Image Banner — ${editingBanner.title}`
        : "Create Image Banner"
      : "Image Banner";

  const pageSubtitle =
    viewMode === "create"
      ? "Configure library announcements, campaign dates, and upload cover images."
      : "Manage hero banner sliders and announcement cover images in Library Admin.";

  return (
    <AppShell title={pageTitle} subtitle={pageSubtitle}>
      <div className="p-4 sm:p-6 md:p-8 space-y-6 w-full">
        {viewMode === "list" ? (
          /* ========================================================================
           * MAIN BANNER LISTING VIEW - FULL WIDTH
           * ======================================================================== */
          <>
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-2xs w-full">
              {/* Search Box */}
              <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3.5 shadow-none transition-colors focus-within:border-[var(--brand)]">
                <Search size={16} className="mr-2 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>

              {/* Status Filter Dropdown & Add Button */}
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-11 items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-secondary/40 focus:outline-none min-w-[130px] shadow-none cursor-pointer">
                    <span>{statusFilter}</span>
                    <ChevronDown size={16} className="text-muted-foreground shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[140px] bg-card border-border shadow-md">
                    {(["All Status", "Active", "Inactive"] as const).map((st) => (
                      <DropdownMenuItem
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`cursor-pointer font-medium text-xs ${
                          statusFilter === st ? "bg-[var(--sidebar-highlight)] text-[var(--brand)]" : ""
                        }`}
                      >
                        {st}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={handleOpenAddNewBanner}
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-2xs transition-opacity hover:opacity-90 shrink-0 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Image Banner</span>
                </button>
              </div>
            </div>

            {/* Banners Table Container - Full Width */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                      <th className="px-6 py-4 min-w-[240px]">Image</th>
                      <th className="px-6 py-4 whitespace-nowrap">From Date</th>
                      <th className="px-6 py-4 whitespace-nowrap">To Date</th>
                      <th className="px-6 py-4 whitespace-nowrap">Status</th>
                      <th className="px-6 py-4 text-center whitespace-nowrap">Remove</th>
                      <th className="px-6 py-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredBanners.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <ImageIcon size={32} className="text-muted-foreground/60" />
                            <p className="font-medium text-sm">No banners found</p>
                            <p className="text-xs text-muted-foreground">
                              Click "+ Add Image Banner" to publish your first banner.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBanners.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => handleOpenEditBanner(item)}
                          className="group cursor-pointer transition-colors hover:bg-muted/30"
                        >
                          {/* Image Thumbnail Column */}
                          <td className="px-6 py-4">
                            <div
                              className="h-14 w-52 rounded-lg shadow-xs border border-border/80 flex items-center justify-center text-[11px] text-white font-bold select-none overflow-hidden p-2 text-center"
                              style={{ background: item.webCover || item.imageColor }}
                            >
                              <span className="bg-black/30 px-2 py-0.5 rounded backdrop-blur-xs block truncate max-w-[180px]">
                                {item.title}
                              </span>
                            </div>
                          </td>

                          {/* From Date Column */}
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground text-sm">
                            {formatDateString(item.fromDate)}
                          </td>

                          {/* To Date Column */}
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground text-sm">
                            {formatDateString(item.toDate)}
                          </td>

                          {/* Status Switch Toggle Column */}
                          <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2.5">
                              <Switch
                                checked={item.enabled}
                                onCheckedChange={() => handleToggleStatus(item.id)}
                                className="data-[state=checked]:bg-[var(--brand)] shadow-xs"
                              />
                              <span className="text-xs font-semibold text-foreground">
                                {item.enabled ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </td>

                          {/* Remove Trash Button Column */}
                          <td className="px-6 py-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setDeletingBanner(item)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Remove Banner"
                            >
                              <Trash2 size={17} />
                            </button>
                          </td>

                          {/* Chevron Arrow Column */}
                          <td className="px-6 py-4 text-right text-muted-foreground">
                            <span className="inline-flex items-center justify-center text-muted-foreground group-hover:text-foreground">
                              <ChevronRight size={18} />
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 w-full">
              <div className="text-xs sm:text-sm text-foreground font-normal">
                Showing <span className="font-semibold">{filteredBanners.length}</span> from{" "}
                <span className="font-semibold">{filteredBanners.length}</span> results
              </div>

              <div className="flex items-center gap-1.5 self-center sm:self-auto text-xs sm:text-sm">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-muted-foreground transition-colors opacity-40 pointer-events-none"
                >
                  « Previous
                </button>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg font-bold bg-[var(--sidebar-highlight)] text-[var(--brand)] border border-[var(--brand)]/30"
                >
                  1
                </button>

                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-muted-foreground transition-colors opacity-40 pointer-events-none"
                >
                  Next »
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================
           * CREATE / EDIT IMAGE BANNER FORM VIEW (Preserving exact original fields)
           * ======================================================================== */
          <div className="space-y-6 w-full">
            {/* Back Navigation Control Style matching Section 8 of style guide */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setViewMode("list");
                  setEditingBanner(null);
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
                aria-label="Back to Image Banner"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-sm font-normal text-foreground">
                Back to Image Banner
              </span>
            </div>

            {/* Main Form Wrapper */}
            <form onSubmit={handleSaveBanner} className="space-y-6 w-full">
              {/* Card Container Box */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-2xs space-y-6 w-full">
                {/* Form 2-Column Grid matching standard */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {/* Banner Title */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Banner Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      placeholder="Enter Banner Title"
                      className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                    />
                  </div>

                  {/* Start Date - End Date (From Date - To Date) */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Start Date - End Date <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 w-full">
                      <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3">
                        <input
                          type="date"
                          value={fromDateInput}
                          onChange={(e) => setFromDateInput(e.target.value)}
                          className="w-full bg-transparent text-xs text-foreground outline-none cursor-pointer"
                        />
                      </label>
                      <span className="text-muted-foreground text-xs font-medium">to</span>
                      <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3">
                        <input
                          type="date"
                          value={toDateInput}
                          onChange={(e) => setToDateInput(e.target.value)}
                          className="w-full bg-transparent text-xs text-foreground outline-none cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cover Image Upload Dropzones with Web & Mobile Device Visual Icons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 w-full">
                  {/* Web Cover Image Box (Desktop Monitor Visual) */}
                  <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 flex flex-col items-center justify-center text-center space-y-3 w-full transition-colors hover:bg-muted/30">
                    <div className="h-14 w-14 rounded-2xl bg-[var(--sidebar-highlight)] border border-[var(--brand)]/20 flex items-center justify-center shadow-2xs">
                      <Monitor size={28} className="text-[var(--brand)] shrink-0" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1.5">
                        <p className="text-xs font-bold text-foreground">
                          Web Cover Image <span className="text-red-500">*</span>
                        </p>
                        <span className="text-[10px] font-semibold bg-[var(--brand)]/10 text-[var(--brand)] px-2 py-0.5 rounded-full border border-[var(--brand)]/20">
                          Desktop / Laptop
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                        1360x526 pixels (or 2x scale), less than 5 MB
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer transition-colors shadow-2xs">
                      <UploadCloud size={14} className="text-[var(--brand)]" />
                      <span>{webCoverUploaded ? "Change Image Banner for Web" : "Choose Image Banner for Web"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const file = e.target.files[0];
                            setWebCoverUploaded(URL.createObjectURL(file));
                            toast.success("Web Banner image selected!");
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Mobile Cover Image Box (Smartphone Mobile Visual) */}
                  <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 flex flex-col items-center justify-center text-center space-y-3 w-full transition-colors hover:bg-muted/30">
                    <div className="h-14 w-14 rounded-2xl bg-[var(--sidebar-highlight)] border border-[var(--brand)]/20 flex items-center justify-center shadow-2xs">
                      <Smartphone size={28} className="text-[var(--brand)] shrink-0" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1.5">
                        <p className="text-xs font-bold text-foreground">
                          Mobile Cover Image <span className="text-red-500">*</span>
                        </p>
                        <span className="text-[10px] font-semibold bg-[var(--brand)]/10 text-[var(--brand)] px-2 py-0.5 rounded-full border border-[var(--brand)]/20">
                          Smartphone / Mobile
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                        1518x864 pixels (or 2x scale), less than 5 MB
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer transition-colors shadow-2xs">
                      <UploadCloud size={14} className="text-[var(--brand)]" />
                      <span>{mobileCoverUploaded ? "Change Image Banner for Mobile" : "Choose Image Banner for Mobile"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const file = e.target.files[0];
                            setMobileCoverUploaded(URL.createObjectURL(file));
                            toast.success("Mobile Banner image selected!");
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons - Outside Card Box */}
              <div className="flex items-center justify-end gap-3 pt-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("list");
                    setEditingBanner(null);
                  }}
                  className="inline-flex h-11 items-center justify-center px-6 rounded-lg border border-border bg-card text-sm font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center px-6 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                >
                  {editingBanner ? "Save Changes" : "Create Image Banner"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deletingBanner !== null} onOpenChange={(open) => !open && setDeletingBanner(null)}>
        <DialogContent className="max-w-sm bg-card border-border">
          <div className="text-center space-y-2 mb-4 pt-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600">
              <Trash2 size={22} />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              Remove Image Banner
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">"{deletingBanner?.title}"</span>?
              This banner will be deleted permanently.
            </DialogDescription>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeletingBanner(null)}
              className="h-10 px-5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDeleteBanner}
              className="h-10 px-5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer shadow-2xs"
            >
              Remove
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
