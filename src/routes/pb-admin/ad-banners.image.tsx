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
  Monitor,
  Smartphone,
  CheckCircle2,
  ExternalLink,
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

export const Route = createFileRoute("/pb-admin/ad-banners/image")({
  head: () => ({
    meta: [
      { title: "Image Banner — PixelBooks Admin" },
      {
        name: "description",
        content: "Manage hero banner sliders, promotional campaigns, and link redirections in PixelBooks.",
      },
    ],
  }),
  component: ImageBannerPage,
});

export interface BannerItem {
  id: string;
  title: string;
  duration?: string; // e.g. "Jul 24 – Jul 31, 2026"
  startDate?: string;
  endDate?: string;
  adsClient: string; // e.g. "Redirect URL"
  redirectionType?: string;
  publisher?: string;
  author?: string;
  ebook?: string;
  targetUrl?: string;
  externalUrl?: string;
  buttonText?: string;
  description?: string;
  webCover: string; // background gradient or image url
  mobileCover: string;
  status: boolean;
}

const INITIAL_BANNERS: BannerItem[] = [
  {
    id: "ban-1",
    title: "KLIBF 2026 Special Literary Event",
    duration: "Jul 24 – Jul 31, 2026",
    startDate: "2026-07-24",
    endDate: "2026-07-31",
    adsClient: "Redirect URL",
    redirectionType: "Link",
    targetUrl: "https://klibf.gov.in",
    externalUrl: "https://klibf.gov.in",
    buttonText: "Register Now",
    description: "Kuala Lumpur International Book Fair 2026 promotion.",
    webCover: "linear-gradient(135deg, #0d5c58 0%, #063d3a 50%, #15736d 100%)",
    mobileCover: "linear-gradient(135deg, #0d5c58 0%, #063d3a 100%)",
    status: true,
  },
  {
    id: "ban-2",
    title: "Read, Learn, and Explore Summer Offer",
    duration: "Jul 13 – Oct 31, 2026",
    startDate: "2026-07-13",
    endDate: "2026-10-31",
    adsClient: "Redirect URL",
    redirectionType: "Link",
    targetUrl: "https://pixelbooks.com/summer-offer",
    externalUrl: "https://pixelbooks.com/summer-offer",
    buttonText: "Explore Collection",
    description: "Special academic & fiction collection curated for readers.",
    webCover: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
    mobileCover: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
    status: true,
  },
];

export function ImageBannerPage() {
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All Status" | "Active" | "Inactive">("All Status");

  // Active editing item (null = creating new banner)
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [previewBanner, setPreviewBanner] = useState<BannerItem | null>(null);

  // Form State
  const [targetUrlInput, setTargetUrlInput] = useState("");
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [bannerTitleInput, setBannerTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [buttonTextInput, setButtonTextInput] = useState("");
  const [webCoverUploaded, setWebCoverUploaded] = useState<string | null>(null);
  const [mobileCoverUploaded, setMobileCoverUploaded] = useState<string | null>(null);

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
        (b.targetUrl && b.targetUrl.toLowerCase().includes(q)) ||
        (b.externalUrl && b.externalUrl.toLowerCase().includes(q)) ||
        b.adsClient.toLowerCase().includes(q)
      );
    });
  }, [banners, searchQuery, statusFilter]);

  // Toggle status
  const handleToggleStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.status;
          toast.success(`Banner status updated to ${next ? "Active" : "Inactive"}`);
          return { ...item, status: next };
        }
        return item;
      })
    );
  };

  // Remove banner
  const handleRemoveBanner = (id: string, title: string) => {
    setBanners((prev) => prev.filter((item) => item.id !== id));
    toast.success(`Removed banner "${title}"`);
  };

  // Open Edit Banner screen for clicked item
  const handleOpenEditBanner = (item: BannerItem) => {
    setEditingBanner(item);
    setTargetUrlInput(item.targetUrl || item.externalUrl || "");
    setStartDateInput(item.startDate || "");
    setEndDateInput(item.endDate || "");
    setBannerTitleInput(item.title);
    setDescriptionInput(item.description || "");
    setButtonTextInput(item.buttonText || "");
    setWebCoverUploaded(item.webCover);
    setMobileCoverUploaded(item.mobileCover);
    setViewMode("create");
  };

  // Open Add New Banner form
  const handleOpenAddNewBanner = () => {
    setEditingBanner(null);
    resetForm();
    setViewMode("create");
  };

  // Submit Save/Create Form
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitleInput.trim()) {
      toast.error("Please enter a Banner Title.");
      return;
    }
    if (!targetUrlInput.trim()) {
      toast.error("Please enter a Target URL.");
      return;
    }

    const formatMonthDay = (dateStr?: string) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const duration =
      startDateInput && endDateInput
        ? `${formatMonthDay(startDateInput)} – ${formatMonthDay(endDateInput)}`
        : startDateInput
          ? `From ${formatMonthDay(startDateInput)}`
          : endDateInput
            ? `Until ${formatMonthDay(endDateInput)}`
            : "—";

    if (editingBanner) {
      // Update existing item
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? {
              ...b,
              title: bannerTitleInput,
              duration,
              startDate: startDateInput || undefined,
              endDate: endDateInput || undefined,
              adsClient: targetUrlInput,
              redirectionType: "Link",
              targetUrl: targetUrlInput,
              externalUrl: targetUrlInput,
              buttonText: buttonTextInput || "Learn More",
              description: descriptionInput || undefined,
              webCover: webCoverUploaded || b.webCover,
              mobileCover: mobileCoverUploaded || b.mobileCover,
            }
            : b
        )
      );
      toast.success(`Image Banner "${bannerTitleInput}" updated successfully!`);
    } else {
      // Add new item
      const newBanner: BannerItem = {
        id: `ban-${Date.now()}`,
        title: bannerTitleInput,
        duration,
        startDate: startDateInput || undefined,
        endDate: endDateInput || undefined,
        adsClient: targetUrlInput,
        redirectionType: "Link",
        targetUrl: targetUrlInput,
        externalUrl: targetUrlInput,
        buttonText: buttonTextInput || "Learn More",
        description: descriptionInput || undefined,
        webCover: webCoverUploaded || "linear-gradient(135deg, #0d5c58 0%, #063d3a 100%)",
        mobileCover: mobileCoverUploaded || "linear-gradient(135deg, #0d5c58 0%, #063d3a 100%)",
        status: true,
      };
      setBanners((prev) => [newBanner, ...prev]);
      toast.success(`Image Banner "${bannerTitleInput}" created successfully!`);
    }

    resetForm();
    setViewMode("list");
  };

  const resetForm = () => {
    setBannerTitleInput("");
    setDescriptionInput("");
    setButtonTextInput("");
    setTargetUrlInput("");
    setStartDateInput("");
    setEndDateInput("");
    setWebCoverUploaded(null);
    setMobileCoverUploaded(null);
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
      ? "Configure campaign redirection, scheduling, and responsive cover assets."
      : "Manage promotional hero banner sliders, campaign durations, and link redirections.";

  return (
    <AppShell title={pageTitle} subtitle={pageSubtitle}>
      <div className="p-4 sm:p-6 md:p-8 space-y-6 w-full">
        {viewMode === "list" ? (
          /* ========================================================================
           * MAIN LIST VIEW - FULL WIDTH
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
                  placeholder="Search banners by title or target URL..."
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
                  <span>Add Image Banner</span>
                </button>
              </div>
            </div>

            {/* Banner Table Container - Full Width */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="px-6 py-4 min-w-[240px] font-semibold">Image Slider</th>
                      <th className="px-6 py-4 whitespace-nowrap font-semibold">Banner Duration</th>
                      <th className="px-6 py-4 whitespace-nowrap font-semibold">Target URL</th>
                      <th className="px-6 py-4 whitespace-nowrap font-semibold">Enable/Disable</th>
                      <th className="px-6 py-4 text-center whitespace-nowrap font-semibold">Remove</th>
                      <th className="px-6 py-4 text-center whitespace-nowrap font-semibold">Preview</th>
                      <th className="px-6 py-4 w-10 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredBanners.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <ImageIcon size={32} className="text-muted-foreground/60" />
                            <p className="font-medium text-sm">No banners found</p>
                            <p className="text-xs text-muted-foreground">
                              Click "+ Add Image Banner" to publish your first banner campaign.
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
                          {/* Image Slider Thumbnail Column */}
                          <td className="px-6 py-4">
                            <div className="relative h-14 w-52 rounded-lg overflow-hidden border border-border/80 shadow-xs flex items-center justify-center p-2.5 text-white">
                              <div
                                className="absolute inset-0 z-0"
                                style={{ background: item.webCover }}
                              />
                              <div className="relative z-10 text-center space-y-0.5">
                                <p className="text-[11px] font-extrabold tracking-wide uppercase line-clamp-1 drop-shadow-xs">
                                  {item.title}
                                </p>
                                {item.buttonText && (
                                  <span className="inline-block text-[9px] font-bold bg-white/25 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/30">
                                    {item.buttonText}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Banner Duration Column */}
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground text-sm">
                            {item.duration && item.duration !== "—" ? (
                              item.duration
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>

                          {/* Target URL Column */}
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground text-sm max-w-[260px]">
                            {item.targetUrl ? (
                              <a
                                href={item.targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 text-[var(--brand)] hover:underline truncate max-w-full text-sm font-medium"
                                title={item.targetUrl}
                              >
                                <span className="truncate">{item.targetUrl}</span>
                                <ExternalLink size={13} className="shrink-0 opacity-70" />
                              </a>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>

                          {/* Status Switch Toggle Column */}
                          <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center">
                              <Switch
                                checked={item.status}
                                onCheckedChange={() => handleToggleStatus(item.id)}
                                className="data-[state=checked]:bg-[var(--brand)] shadow-xs"
                              />
                            </div>
                          </td>

                          {/* Remove Trash Button Column */}
                          <td className="px-6 py-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleRemoveBanner(item.id, item.title)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Delete Banner"
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
                              title="Preview Banner"
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

            {/* Pagination Footer matching screenshot */}
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
           * CREATE / EDIT IMAGE BANNER FORM VIEW
           * ======================================================================== */
          <div className="space-y-6 w-full">
            {/* Back to Image Banner Button matching Section 8 of style guide */}
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
              <span className="text-sm font-semibold text-foreground">
                Back to Image Banner
              </span>
            </div>

            {/* Main Form Wrapper */}
            <form onSubmit={handleSaveBanner} className="space-y-6 w-full">
              {/* Card Container Box */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-2xs space-y-8 w-full">
                {/* Section 1: General Details */}
                <div className="space-y-5">
                  <div className="border-b border-border/80 pb-3.5">
                    <h3 className="text-sm font-bold text-foreground">
                      {editingBanner ? "Edit Banner Details" : "Banner Details"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Configure campaign details, destination link, CTA button, and schedule.
                    </p>
                  </div>

                  {/* Form Fields 2-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {/* Row 1: Banner Title */}
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Banner Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={bannerTitleInput}
                        onChange={(e) => setBannerTitleInput(e.target.value)}
                        placeholder="Enter Banner Title"
                        className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] transition-colors shadow-none"
                      />
                    </div>

                    {/* Row 1: Target URL */}
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Target URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={targetUrlInput}
                        onChange={(e) => setTargetUrlInput(e.target.value)}
                        placeholder="https://example.com/campaign"
                        className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] transition-colors shadow-none"
                      />
                    </div>

                    {/* Row 2: Button Text */}
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Button Text <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={buttonTextInput}
                        onChange={(e) => setButtonTextInput(e.target.value)}
                        placeholder="e.g. Register Now, Learn More"
                        className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] transition-colors shadow-none"
                      />
                    </div>

                    {/* Row 2: Start Date - End Date */}
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Start Date - End Date <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                      </label>
                      <div className="flex items-center gap-2.5 w-full">
                        <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 shadow-none focus-within:border-[var(--brand)] transition-colors cursor-pointer">
                          <input
                            type="date"
                            value={startDateInput}
                            onChange={(e) => setStartDateInput(e.target.value)}
                            className="w-full bg-transparent text-sm text-foreground outline-none cursor-pointer"
                          />
                        </label>
                        <span className="text-muted-foreground text-xs font-medium shrink-0">to</span>
                        <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 shadow-none focus-within:border-[var(--brand)] transition-colors cursor-pointer">
                          <input
                            type="date"
                            value={endDateInput}
                            onChange={(e) => setEndDateInput(e.target.value)}
                            className="w-full bg-transparent text-sm text-foreground outline-none cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Row 3: Description - Spanning both columns */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Description <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                      </label>
                      <textarea
                        value={descriptionInput}
                        onChange={(e) => setDescriptionInput(e.target.value)}
                        placeholder="Enter a brief campaign description or announcement details..."
                        rows={3}
                        className="w-full rounded-lg border border-border bg-card p-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] transition-colors shadow-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Banner Artwork Upload */}
                <div className="border-t border-border/80 pt-6">
                  <div className="mb-5">
                    <h4 className="text-sm font-bold text-foreground">Banner Artwork</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Upload high-resolution promotional artwork optimized for desktop and mobile devices.
                    </p>
                  </div>

                  {/* Cover Image Upload Dropzones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {/* Web Cover Image Box */}
                    <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-3.5 w-full min-h-[230px] transition-colors hover:bg-muted/30">
                      {webCoverUploaded ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className="h-24 w-64 md:w-72 rounded-lg border border-border shadow-xs overflow-hidden flex items-center justify-center text-white text-xs font-bold p-2 text-center"
                            style={{
                              background:
                                webCoverUploaded.startsWith("blob:") ||
                                webCoverUploaded.startsWith("http") ||
                                webCoverUploaded.startsWith("data:")
                                  ? `url(${webCoverUploaded}) center/cover no-repeat`
                                  : webCoverUploaded,
                            }}
                          >
                            <span className="bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded text-xs truncate max-w-[230px]">
                              {bannerTitleInput || "Desktop Web Banner"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-[var(--sidebar-highlight)] border border-[var(--brand)]/20 flex items-center justify-center shadow-2xs">
                          <Monitor size={28} className="text-[var(--brand)] shrink-0" />
                        </div>
                      )}
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
                        <span>{webCoverUploaded ? "Change Image for Web" : "Choose Image for Web"}</span>
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

                    {/* Mobile Cover Image Box */}
                    <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-3.5 w-full min-h-[230px] transition-colors hover:bg-muted/30">
                      {mobileCoverUploaded ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className="h-24 w-40 md:w-44 rounded-lg border border-border shadow-xs overflow-hidden flex items-center justify-center text-white text-xs font-bold p-2 text-center"
                            style={{
                              background:
                                mobileCoverUploaded.startsWith("blob:") ||
                                mobileCoverUploaded.startsWith("http") ||
                                mobileCoverUploaded.startsWith("data:")
                                  ? `url(${mobileCoverUploaded}) center/cover no-repeat`
                                  : mobileCoverUploaded,
                            }}
                          >
                            <span className="bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] truncate max-w-[130px]">
                              Mobile Banner
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-[var(--sidebar-highlight)] border border-[var(--brand)]/20 flex items-center justify-center shadow-2xs">
                          <Smartphone size={28} className="text-[var(--brand)] shrink-0" />
                        </div>
                      )}
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
                        <span>{mobileCoverUploaded ? "Change Image for Mobile" : "Choose Image for Mobile"}</span>
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
                  {editingBanner ? "Save Image Banner" : "Create Image Slider"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Banner Preview Modal */}
      <Dialog open={!!previewBanner} onOpenChange={(open) => !open && setPreviewBanner(null)}>
        <DialogContent className="sm:max-w-[850px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <ImageIcon size={18} className="text-[var(--brand)]" />
              Banner Preview — {previewBanner?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Live preview of Web & Mobile promotional hero banners.
            </DialogDescription>
          </DialogHeader>

          {previewBanner && (
            <div className="space-y-6 py-2">
              {/* Web Banner Preview */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground">Desktop Web Banner (1360 × 526)</span>
                <div
                  className="relative h-48 w-full rounded-xl overflow-hidden shadow-md flex items-center justify-center p-6 text-white text-center"
                  style={{ background: previewBanner.webCover }}
                >
                  <div className="space-y-2 max-w-lg">
                    <h3 className="text-lg font-extrabold tracking-tight drop-shadow-md">
                      {previewBanner.title}
                    </h3>
                    {previewBanner.description && (
                      <p className="text-xs text-white/90 drop-shadow-xs line-clamp-2">
                        {previewBanner.description}
                      </p>
                    )}
                    {previewBanner.buttonText && (
                      <button className="mt-2 inline-block text-xs font-bold bg-white text-slate-900 px-4 py-1.5 rounded-lg shadow-sm">
                        {previewBanner.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Banner Preview */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground">Mobile Banner (1518 × 864)</span>
                <div
                  className="relative h-36 w-72 mx-auto rounded-xl overflow-hidden shadow-md flex items-center justify-center p-4 text-white text-center"
                  style={{ background: previewBanner.mobileCover }}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold line-clamp-2 drop-shadow-xs">
                      {previewBanner.title}
                    </p>
                    {previewBanner.buttonText && (
                      <span className="inline-block text-[10px] font-bold bg-white text-slate-900 px-2.5 py-1 rounded-md">
                        {previewBanner.buttonText}
                      </span>
                    )}
                  </div>
                </div>
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
