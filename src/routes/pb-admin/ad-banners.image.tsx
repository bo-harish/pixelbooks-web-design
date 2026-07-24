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
  FileText,
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
  duration: string; // e.g. "Jul 24 – Jul 31, 2026"
  startDate: string;
  endDate: string;
  adsClient: string; // e.g. "Redirect URL" or "William F"
  redirectionType: "In App" | "External Link";
  publisher?: string;
  author?: string;
  ebook?: string;
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
    redirectionType: "External Link",
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
    adsClient: "William F",
    redirectionType: "In App",
    publisher: "PixelBooks Press",
    author: "William F",
    ebook: "Complete History of Music",
    buttonText: "Explore Collection",
    description: "Special academic & fiction collection curated by William F.",
    webCover: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
    mobileCover: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
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

export function ImageBannerPage() {
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All Status" | "Active" | "Inactive">("All Status");

  // Active editing item (null = creating new banner)
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [previewBanner, setPreviewBanner] = useState<BannerItem | null>(null);

  // Form State
  const [redirectionTab, setRedirectionTab] = useState<"In App Redirection" | "External Link Redirection">("In App Redirection");
  const [selectedPublisher, setSelectedPublisher] = useState("Choose Publisher");
  const [selectedAuthor, setSelectedAuthor] = useState("Choose Author");
  const [selectedEbook, setSelectedEbook] = useState("Choose eBook");
  const [startDateInput, setStartDateInput] = useState("2026-07-25");
  const [endDateInput, setEndDateInput] = useState("2026-08-31");
  const [externalUrlInput, setExternalUrlInput] = useState("");
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
    setRedirectionTab(item.redirectionType === "In App" ? "In App Redirection" : "External Link Redirection");
    setSelectedPublisher(item.publisher || "Choose Publisher");
    setSelectedAuthor(item.author || "Choose Author");
    setSelectedEbook(item.ebook || "Choose eBook");
    setStartDateInput(item.startDate || "2026-07-25");
    setEndDateInput(item.endDate || "2026-08-31");
    setExternalUrlInput(item.externalUrl || "");
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

    const formatMonthDay = (dateStr: string) => {
      if (!dateStr) return "Jul 25";
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const adsClient =
      redirectionTab === "In App Redirection"
        ? selectedAuthor !== "Choose Author"
          ? selectedAuthor
          : selectedPublisher !== "Choose Publisher"
            ? selectedPublisher
            : "In App Target"
        : "Redirect URL";

    if (editingBanner) {
      // Update existing item
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? {
              ...b,
              title: bannerTitleInput,
              duration: `${formatMonthDay(startDateInput)} – ${formatMonthDay(endDateInput)}`,
              startDate: startDateInput,
              endDate: endDateInput,
              adsClient,
              redirectionType: redirectionTab === "In App Redirection" ? "In App" : "External Link",
              publisher: selectedPublisher !== "Choose Publisher" ? selectedPublisher : undefined,
              author: selectedAuthor !== "Choose Author" ? selectedAuthor : undefined,
              ebook: selectedEbook !== "Choose eBook" ? selectedEbook : undefined,
              externalUrl: externalUrlInput || undefined,
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
        duration: `${formatMonthDay(startDateInput)} – ${formatMonthDay(endDateInput)}`,
        startDate: startDateInput,
        endDate: endDateInput,
        adsClient,
        redirectionType: redirectionTab === "In App Redirection" ? "In App" : "External Link",
        publisher: selectedPublisher !== "Choose Publisher" ? selectedPublisher : undefined,
        author: selectedAuthor !== "Choose Author" ? selectedAuthor : undefined,
        ebook: selectedEbook !== "Choose eBook" ? selectedEbook : undefined,
        externalUrl: externalUrlInput || undefined,
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
    setExternalUrlInput("");
    setSelectedPublisher("Choose Publisher");
    setSelectedAuthor("Choose Author");
    setSelectedEbook("Choose eBook");
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
            {/* Top Toolbar matching screenshot design */}
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
                  <span>Add Image Banner</span>
                </button>
              </div>
            </div>

            {/* Banner Table Container - Full Width */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                      <th className="px-6 py-4 min-w-[260px]">Image Slider</th>
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
                          className="group cursor-pointer transition-colors hover:bg-muted/30"
                        >
                          {/* Image Slider Thumbnail Column */}
                          <td className="px-6 py-4">
                            <div className="relative h-16 w-60 rounded-lg overflow-hidden border border-border/80 shadow-xs flex items-center justify-center p-3 text-white">
                              <div
                                className="absolute inset-0 z-0"
                                style={{ background: item.webCover }}
                              />
                              <div className="relative z-10 text-center space-y-0.5">
                                <p className="text-[11px] font-extrabold tracking-wide uppercase line-clamp-1 drop-shadow-xs">
                                  {item.title}
                                </p>
                                {item.buttonText && (
                                  <span className="inline-block text-[9px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/30">
                                    {item.buttonText}
                                  </span>
                                )}
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
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-2xs space-y-6 w-full">
                {/* Redirection Tabs */}
                <div className="flex items-center gap-6 border-b border-border/80 pb-3 w-full">
                  {(["In App Redirection", "External Link Redirection"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setRedirectionTab(tab)}
                      className={`text-sm font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${redirectionTab === tab
                          ? "border-[var(--brand)] text-[var(--brand)] font-bold"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Form Grid Rows - Full Width Grid */}
                {redirectionTab === "In App Redirection" ? (
                  /* IN APP REDIRECTION FIELDS */
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
                ) : (
                  /* EXTERNAL LINK REDIRECTION FIELDS */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        External Target URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={externalUrlInput}
                        onChange={(e) => setExternalUrlInput(e.target.value)}
                        placeholder="https://example.com/campaign"
                        className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                      />
                    </div>

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
                )}

                {/* Banner Title & Description Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Banner Title
                    </label>
                    <input
                      type="text"
                      value={bannerTitleInput}
                      onChange={(e) => setBannerTitleInput(e.target.value)}
                      placeholder="Enter Banner Title"
                      className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={descriptionInput}
                      onChange={(e) => setDescriptionInput(e.target.value)}
                      placeholder="Enter Description"
                      rows={3}
                      className="w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-[var(--brand)] resize-none"
                    />
                  </div>
                </div>

                {/* Button Text Row - Full Width */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={buttonTextInput}
                      onChange={(e) => setButtonTextInput(e.target.value)}
                      placeholder="Enter Button Text"
                      className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                    />
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
