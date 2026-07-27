import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Trash2,
  Eye,
  ChevronRight,
  ArrowLeft,
  UploadCloud,
  ImageIcon,
  CheckCircle2,
  Sparkles,
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/ad-banners/popup")({
  head: () => ({
    meta: [
      { title: "Pop Up Banner — PixelBooks Admin" },
      {
        name: "description",
        content: "Manage pop-up promotional banners, announcements, and modal overlay campaigns in PixelBooks.",
      },
    ],
  }),
  component: PopUpBannerPage,
});

export interface PopUpBannerItem {
  id: string;
  title: string;
  duration: string; // e.g. "Jul 25 – Aug 30, 2026"
  startDate: string;
  endDate: string;
  adsClient: string; // e.g. "PixelBooks Press" or "Oxford Press"
  publisher?: string;
  author?: string;
  ebook?: string;
  popupImage: string; // background gradient or preview
  status: boolean;
}

const INITIAL_POPUP_BANNERS: PopUpBannerItem[] = [
  {
    id: "pop-1",
    title: "Oxford University Press New Academic Releases",
    duration: "Jul 25 – Aug 30, 2026",
    startDate: "2026-07-25",
    endDate: "2026-08-30",
    adsClient: "Oxford University Press",
    publisher: "Oxford University Press",
    author: "Dr. Evelyn Reed",
    ebook: "The Principles of Duality",
    popupImage: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    status: true,
  },
  {
    id: "pop-2",
    title: "NEP 2020 Policy Framework Awareness Drive",
    duration: "Jul 10 – Sep 15, 2026",
    startDate: "2026-07-10",
    endDate: "2026-09-15",
    adsClient: "PixelBooks Press",
    publisher: "PixelBooks Press",
    author: "Dr. Ashok Alex",
    ebook: "NEP 2020 - Policy Formulation In Education",
    popupImage: "linear-gradient(135deg, #0d5c58 0%, #15736d 100%)",
    status: true,
  },
];

const PUBLISHERS = [
  "Choose Publisher",
  "PixelBooks Press",
  "Oxford University Press",
  "Heritage Press",
  "Academic Press",
  "Cassell & Company",
];

const AUTHORS = [
  "Choose Author",
  "Dr. Ashok Alex",
  "William F",
  "W. J. Baltzell",
  "John Timbs",
  "Dr. Evelyn Reed",
  "Arthur Conan Doyle",
];

const EBOOKS = [
  "Choose eBook",
  "NEP 2020 - Policy Formulation In Education",
  "A Complete History of Music for Schools",
  "Knowledge for the Time",
  "The Principles of Duality",
  "Cassell's History of England",
];

export function PopUpBannerPage() {
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  const [banners, setBanners] = useState<PopUpBannerItem[]>(INITIAL_POPUP_BANNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All Status" | "Active" | "Inactive">("All Status");

  // Active editing item (null = creating new banner)
  const [editingBanner, setEditingBanner] = useState<PopUpBannerItem | null>(null);
  const [previewBanner, setPreviewBanner] = useState<PopUpBannerItem | null>(null);

  // Form State matching screenshot
  const [selectedPublisher, setSelectedPublisher] = useState("Choose Publisher");
  const [selectedEbook, setSelectedEbook] = useState("Choose eBook");
  const [selectedAuthor, setSelectedAuthor] = useState("Choose Author");
  const [startDateInput, setStartDateInput] = useState("2026-07-25");
  const [endDateInput, setEndDateInput] = useState("2026-08-30");
  const [popupImageUploaded, setPopupImageUploaded] = useState<string | null>(null);

  // Filtered Banners
  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      // Status filter
      if (statusFilter === "Active" && !b.status) return false;
      if (statusFilter === "Inactive" && b.status) return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        b.title.toLowerCase().includes(q) ||
        b.adsClient.toLowerCase().includes(q) ||
        (b.publisher && b.publisher.toLowerCase().includes(q))
      );
    });
  }, [banners, searchQuery, statusFilter]);

  // Toggle status
  const handleToggleStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.status;
          toast.success(`Pop Up Banner status updated to ${next ? "Active" : "Inactive"}`);
          return { ...item, status: next };
        }
        return item;
      })
    );
  };

  // Remove banner
  const handleRemoveBanner = (id: string, title: string) => {
    setBanners((prev) => prev.filter((item) => item.id !== id));
    toast.success(`Removed Pop Up Banner "${title}"`);
  };

  // Open Edit Pop Up Banner screen for clicked row
  const handleOpenEditBanner = (item: PopUpBannerItem) => {
    setEditingBanner(item);
    setSelectedPublisher(item.publisher || "Choose Publisher");
    setSelectedEbook(item.ebook || "Choose eBook");
    setSelectedAuthor(item.author || "Choose Author");
    setStartDateInput(item.startDate || "2026-07-25");
    setEndDateInput(item.endDate || "2026-08-30");
    setPopupImageUploaded(item.popupImage);
    setViewMode("create");
  };

  // Open Add New Pop Up Banner form
  const handleOpenAddNewBanner = () => {
    setEditingBanner(null);
    resetForm();
    setViewMode("create");
  };

  // Submit Save/Create Form
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPublisher === "Choose Publisher") {
      toast.error("Please select a Publisher.");
      return;
    }

    const formatMonthDay = (dateStr: string) => {
      if (!dateStr) return "Jul 25";
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const derivedTitle =
      selectedEbook !== "Choose eBook"
        ? selectedEbook
        : selectedAuthor !== "Choose Author"
          ? `${selectedAuthor} Campaign`
          : `${selectedPublisher} Announcement`;

    if (editingBanner) {
      // Update existing item
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? {
              ...b,
              title: derivedTitle,
              duration: `${formatMonthDay(startDateInput)} – ${formatMonthDay(endDateInput)}`,
              startDate: startDateInput,
              endDate: endDateInput,
              adsClient: selectedPublisher,
              publisher: selectedPublisher !== "Choose Publisher" ? selectedPublisher : undefined,
              author: selectedAuthor !== "Choose Author" ? selectedAuthor : undefined,
              ebook: selectedEbook !== "Choose eBook" ? selectedEbook : undefined,
              popupImage: popupImageUploaded || b.popupImage,
            }
            : b
        )
      );
      toast.success(`Pop Up Banner "${derivedTitle}" updated successfully!`);
    } else {
      // Add new item
      const newBanner: PopUpBannerItem = {
        id: `pop-${Date.now()}`,
        title: derivedTitle,
        duration: `${formatMonthDay(startDateInput)} – ${formatMonthDay(endDateInput)}`,
        startDate: startDateInput,
        endDate: endDateInput,
        adsClient: selectedPublisher,
        publisher: selectedPublisher !== "Choose Publisher" ? selectedPublisher : undefined,
        author: selectedAuthor !== "Choose Author" ? selectedAuthor : undefined,
        ebook: selectedEbook !== "Choose eBook" ? selectedEbook : undefined,
        popupImage: popupImageUploaded || "linear-gradient(135deg, #0d5c58 0%, #15736d 100%)",
        status: true,
      };
      setBanners((prev) => [newBanner, ...prev]);
      toast.success(`Pop Up Banner "${derivedTitle}" created successfully!`);
    }

    resetForm();
    setViewMode("list");
  };

  const resetForm = () => {
    setSelectedPublisher("Choose Publisher");
    setSelectedEbook("Choose eBook");
    setSelectedAuthor("Choose Author");
    setStartDateInput("2026-07-25");
    setEndDateInput("2026-08-30");
    setPopupImageUploaded(null);
    setEditingBanner(null);
  };

  const pageTitle =
    viewMode === "create"
      ? editingBanner
        ? `Edit Pop Up Banner — ${editingBanner.title}`
        : "Create Pop Up Banner"
      : "Pop Up Banner";

  const pageSubtitle =
    viewMode === "create"
      ? "Configure modal announcements, promotional schedules, and banner graphics."
      : "Manage pop-up promotional banners, modal overlays, and client target links.";

  return (
    <AppShell title={pageTitle} subtitle={pageSubtitle}>
      <div className="p-4 sm:p-6 md:p-8 space-y-6 w-full">
        {viewMode === "list" ? (
          /* ========================================================================
           * MAIN POP UP BANNER LIST VIEW - FULL WIDTH
           * ======================================================================== */
          <>
            {/* Top Filter Toolbar */}
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
                        className={`cursor-pointer font-medium text-xs ${statusFilter === st ? "bg-[var(--sidebar-highlight)] text-[var(--brand)]" : ""
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
                  <span>Add Pop Up Banner</span>
                </button>
              </div>
            </div>

            {/* Banner Table Container - Full Width */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                      <th className="px-6 py-4 min-w-[280px]">Pop Up Banner</th>
                      <th className="px-6 py-4 whitespace-nowrap">Banner Duration</th>
                      <th className="px-6 py-4 whitespace-nowrap">Publisher</th>
                      <th className="px-6 py-4 whitespace-nowrap">Status</th>
                      <th className="px-6 py-4 text-center whitespace-nowrap">Remove</th>
                      <th className="px-6 py-4 text-center whitespace-nowrap">Preview</th>
                      <th className="px-6 py-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredBanners.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <ImageIcon size={32} className="text-muted-foreground/60" />
                            <p className="font-medium text-sm">No pop-up banners found</p>
                            <p className="text-xs text-muted-foreground">
                              Click "+ Add Pop Up Banner" to create your first pop-up campaign.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBanners.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => handleOpenEditBanner(item)}
                          className="group cursor-pointer border-b border-border/60 transition-colors hover:bg-secondary/50"
                        >
                          {/* Banner Graphic Thumbnail Column */}
                          <td className="px-6 py-4">
                            <div className="relative h-16 w-64 rounded-lg overflow-hidden border border-border/80 shadow-xs flex items-center justify-center p-3 text-white">
                              <div
                                className="absolute inset-0 z-0"
                                style={{ background: item.popupImage }}
                              />
                              <div className="relative z-10 text-center space-y-0.5">
                                <p className="text-[11px] font-extrabold tracking-wide uppercase line-clamp-1 drop-shadow-xs">
                                  {item.title}
                                </p>
                                <span className="inline-block text-[9px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/30">
                                  1400 × 340 PopUp
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Banner Duration Column */}
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground text-sm">
                            {item.duration}
                          </td>

                          {/* Publisher Plain Text Column */}
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground text-sm">
                            {item.publisher || item.adsClient}
                          </td>

                          {/* Status Switch Toggle Column */}
                          <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <Switch
                              checked={item.status}
                              onCheckedChange={() => handleToggleStatus(item.id)}
                              className="data-[state=checked]:bg-[var(--brand)] shadow-xs"
                            />
                          </td>

                          {/* Remove Trash Button Column */}
                          <td className="px-6 py-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleRemoveBanner(item.id, item.title)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Delete Pop Up Banner"
                            >
                              <Trash2 size={17} />
                            </button>
                          </td>

                          {/* Preview Eye Button Column */}
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewBanner(item);
                              }}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-[var(--brand)] hover:bg-[var(--sidebar-highlight)] transition-colors cursor-pointer"
                              title="Preview Pop Up Banner"
                            >
                              <Eye size={18} />
                            </button>
                          </td>

                          {/* Chevron Arrow Column */}
                          <td className="px-6 py-4 text-right">
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

            {/* Pagination Footer matching style guide */}
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
           * CREATE / EDIT POP UP BANNER FORM VIEW (Matching User Screenshot)
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
                aria-label="Back to Pop Up Banner"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-sm font-semibold text-foreground">
                Back to Pop Up Banner
              </span>
            </div>

            {/* Main Form Wrapper */}
            <form onSubmit={handleSaveBanner} className="space-y-6 w-full">
              {/* Card Container Box */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-2xs space-y-6 w-full">
              {/* Form Section Title */}

              {/* Form 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Publisher */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Publisher <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedPublisher}
                    onChange={(e) => setSelectedPublisher(e.target.value)}
                    className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                  >
                    {PUBLISHERS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* eBook */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    eBook
                  </label>
                  <select
                    value={selectedEbook}
                    onChange={(e) => setSelectedEbook(e.target.value)}
                    className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                  >
                    {EBOOKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Author
                  </label>
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                  >
                    {AUTHORS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Date - End Date */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Start Date - End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 w-full">
                    <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3">
                      <input
                        type="date"
                        value={startDateInput}
                        onChange={(e) => setStartDateInput(e.target.value)}
                        className="w-full bg-transparent text-xs text-foreground outline-none cursor-pointer"
                      />
                    </label>
                    <span className="text-muted-foreground text-xs font-medium">to</span>
                    <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3">
                      <input
                        type="date"
                        value={endDateInput}
                        onChange={(e) => setEndDateInput(e.target.value)}
                        className="w-full bg-transparent text-xs text-foreground outline-none cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Pop Up Image Upload Dropzone Box matching screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 w-full">
                <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 flex flex-col items-center justify-center text-center space-y-3 w-full">
                  <div className="h-14 w-14 rounded-xl bg-muted/80 flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={28} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Pop Up Image <span className="text-red-500">*</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      1400x340 pixels (or 2x scale), less than 5 MB
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer transition-colors shadow-2xs">
                    <UploadCloud size={14} />
                    <span>Choose Pop Up Banner for Web</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setPopupImageUploaded("linear-gradient(135deg, #0d5c58 0%, #15736d 100%)");
                          toast.success("Pop Up Banner image selected!");
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
                  {editingBanner ? "Save Pop Up Banner" : "Create Image slider"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Pop Up Banner Live Overlay Preview Modal */}
      <Dialog open={!!previewBanner} onOpenChange={(open) => !open && setPreviewBanner(null)}>
        <DialogContent className="sm:max-w-[750px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Sparkles size={18} className="text-[var(--brand)]" />
              Pop Up Banner Overlay Preview
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Live modal overlay preview of pop-up announcement banners.
            </DialogDescription>
          </DialogHeader>

          {previewBanner && (
            <div className="py-4">
              <div
                className="relative h-44 w-full rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center p-6 text-white text-center"
                style={{ background: previewBanner.popupImage }}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full border border-white/30 mb-2">
                  Special Announcement
                </span>
                <h3 className="text-xl font-black tracking-tight drop-shadow-md max-w-md">
                  {previewBanner.title}
                </h3>
                <p className="text-xs text-white/90 mt-1 font-medium">
                  Client: {previewBanner.adsClient} • Active: {previewBanner.duration}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={() => setPreviewBanner(null)}
              className="px-4.5 py-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Close Preview
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
