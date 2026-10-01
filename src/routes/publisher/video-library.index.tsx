import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { usePublisherType } from "@/hooks/use-publisher-type";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  Video,
  Plus,
  Search,
  Tag,
  Clock,
  CheckCircle2,
  FileEdit,
  Trash2,
  ExternalLink,
  Play,
  X,
  Layers,
  Sparkles,
  Eye,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  getVideoLibrary,
  saveVideoLibrary,
  type VideoItem,
  MEDIA_CATEGORY_DATA,
} from "@/lib/media-library-data";

export const Route = createFileRoute("/publisher/video-library/")({
  head: () => ({
    meta: [
      { title: "Video Library — Publisher" },
      {
        name: "description",
        content: "Manage educational videos, lectures, and multimedia content for libraries.",
      },
    ],
  }),
  component: VideoLibraryPage,
});

function VideoLibraryPage() {
  const [publisherType] = usePublisherType();
  const navigate = useNavigate();

  useEffect(() => {
    if (publisherType !== "Library-Only Publisher") {
      navigate({ to: "/publisher", replace: true });
    }
  }, [publisherType, navigate]);

  const [videos, setVideos] = useState<VideoItem[]>(() => getVideoLibrary());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setVideos(getVideoLibrary());
    };
    window.addEventListener("pb-video-library-change", handleUpdate);
    return () => window.removeEventListener("pb-video-library-change", handleUpdate);
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    const next = videos.filter((v) => v.id !== id);
    setVideos(next);
    saveVideoLibrary(next);
    toast.success(`Deleted video "${title}"`);
  };

  const handleToggleStatus = (id: string) => {
    const next = videos.map((v) => {
      if (v.id === id) {
        const newStatus = v.status === "Published" ? ("Draft" as const) : ("Published" as const);
        toast.success(`Video marked as ${newStatus}`);
        return { ...v, status: newStatus };
      }
      return v;
    });
    setVideos(next);
    saveVideoLibrary(next);
  };

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || v.status === statusFilter;

      const matchesCat =
        categoryFilter === "All" ||
        Object.keys(v.categories).includes(categoryFilter) ||
        Object.values(v.categories).some((subs) => subs.includes(categoryFilter));

      return matchesSearch && matchesStatus && matchesCat;
    });
  }, [videos, searchQuery, statusFilter, categoryFilter]);

  const totalCount = videos.length;
  const publishedCount = videos.filter((v) => v.status === "Published").length;
  const draftCount = videos.filter((v) => v.status === "Draft").length;
  const uniqueCategories = useMemo(() => {
    const s = new Set<string>();
    videos.forEach((v) => Object.keys(v.categories).forEach((c) => s.add(c)));
    return s.size;
  }, [videos]);

  if (publisherType !== "Library-Only Publisher") {
    return null;
  }

  return (
    <AppShell
      title="Video Library"
      subtitle="Curate and publish educational videos, lectures, and multimedia resources"
    >
      <div className="p-4 md:p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Videos</span>
              <Video size={16} className="text-purple-500" />
            </div>
            <div className="text-2xl font-extrabold text-foreground">{totalCount}</div>
            <span className="text-[11px] text-muted-foreground">In library collection</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Published</span>
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {publishedCount}
            </div>
            <span className="text-[11px] text-muted-foreground">Visible to libraries</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Drafts</span>
              <Clock size={16} className="text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {draftCount}
            </div>
            <span className="text-[11px] text-muted-foreground">Under preparation</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Categories</span>
              <Tag size={16} className="text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-foreground">{uniqueCategories}</div>
            <span className="text-[11px] text-muted-foreground">Distinct classifications</span>
          </div>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] text-foreground"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-11 items-center rounded-lg border border-border bg-secondary/30 p-1 text-xs shrink-0">
              {(["All", "Published", "Draft"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`h-full px-3.5 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center whitespace-nowrap ${
                    statusFilter === st
                      ? "bg-card text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <DropdownSelect
              value={categoryFilter === "All" ? "All Categories" : categoryFilter}
              options={["All Categories", ...Object.keys(MEDIA_CATEGORY_DATA)]}
              onChange={(val) => setCategoryFilter(val === "All Categories" ? "All" : val)}
              searchable
              searchPlaceholder="Search categories..."
              className="min-w-[170px] shrink-0"
            />

            <Link
              to="/publisher/video-library/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-[var(--brand)]/90 shrink-0 cursor-pointer whitespace-nowrap"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Video</span>
            </Link>
          </div>
        </div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVideos.map((video) => {
              const catEntries = Object.entries(video.categories);
              return (
                <div
                  key={video.id}
                  className="group rounded-2xl border border-border bg-card overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Video Thumbnail Preview */}
                  <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center overflow-hidden border-b border-border/80">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setPreviewVideo(video)}
                      className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-indigo-900 shadow-xl group-hover:scale-110 transition-transform cursor-pointer"
                      title="Preview Video"
                    >
                      <Play size={20} className="ml-0.5" fill="currentColor" />
                    </button>
                    {video.duration && (
                      <span className="absolute bottom-2.5 right-2.5 z-10 rounded-md bg-black/75 px-2 py-0.5 text-[10.5px] font-mono font-bold text-white tracking-wide">
                        {video.duration}
                      </span>
                    )}
                    <span
                      className={`absolute top-2.5 left-2.5 z-10 rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${
                        video.status === "Published"
                          ? "bg-emerald-500/90 text-white"
                          : "bg-amber-500/90 text-white"
                      }`}
                    >
                      {video.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3
                        className="text-sm font-bold text-foreground line-clamp-2 leading-snug hover:text-[var(--brand)] transition-colors cursor-pointer"
                        onClick={() => setPreviewVideo(video)}
                      >
                        {video.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {video.description || "No description provided."}
                      </p>
                    </div>

                    {/* Categories */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Tag size={12} className="text-purple-500" />
                        <span>Categories</span>
                      </div>
                      {catEntries.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {catEntries.slice(0, 2).map(([cat, subs]) => (
                            <span
                              key={cat}
                              className="inline-flex items-center rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10.5px] font-semibold text-purple-700 dark:text-purple-300"
                              title={`${cat}: ${subs.join(", ") || "Main Category"}`}
                            >
                              {cat}
                              {subs.length > 0 && (
                                <span className="opacity-60 ml-1">({subs.length})</span>
                              )}
                            </span>
                          ))}
                          {catEntries.length > 2 && (
                            <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground font-medium">
                              +{catEntries.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic">
                          No categories assigned
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    {video.tags && video.tags.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Tags
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {video.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-full bg-secondary border border-border/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                          {video.tags.length > 3 && (
                            <span className="text-[10px] text-muted-foreground self-center">
                              +{video.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Card Actions Footer */}
                    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`status-switch-${video.id}`}
                          checked={video.status === "Published"}
                          onCheckedChange={() => handleToggleStatus(video.id)}
                          aria-label={`Toggle status to ${video.status === "Published" ? "Draft" : "Published"}`}
                        />
                        <label
                          htmlFor={`status-switch-${video.id}`}
                          className={`text-xs font-semibold cursor-pointer select-none ${
                            video.status === "Published"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {video.status === "Published" ? "Published" : "Draft"}
                        </label>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewVideo(video)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                          title="Preview Video"
                        >
                          <Eye size={16} />
                        </button>
                        <Link
                          to="/publisher/video-library/new"
                          search={{ edit: video.id }}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                          title="Edit Video"
                        >
                          <FileEdit size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(video.id, video.title)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete Video"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center bg-card">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground mb-3">
              <Video size={28} />
            </div>
            <h3 className="text-base font-bold text-foreground">No videos found</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-5 max-w-sm">
              {searchQuery || statusFilter !== "All" || categoryFilter !== "All"
                ? "Try adjusting your search query or filters to find what you are looking for."
                : "Your Video Library is empty. Start adding educational videos and multimedia for your libraries."}
            </p>
            <Link
              to="/publisher/video-library/new"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--brand)] px-5 text-xs font-semibold text-white hover:bg-[var(--brand)]/90 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Your First Video</span>
            </Link>
          </div>
        )}

        {/* Video Preview Modal */}
        {previewVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
            onClick={() => setPreviewVideo(null)}
          >
            <div
              className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Video size={18} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Video Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewVideo(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Player Mockup */}
              <div className="relative aspect-video rounded-xl bg-slate-950 flex flex-col items-center justify-center text-white border border-border">
                <Play size={44} className="text-white/80" fill="currentColor" />
                <span className="text-xs text-white/60 mt-2 font-mono">
                  {previewVideo.videoUrl
                    ? previewVideo.videoUrl
                    : "Embedded Player Stream Placeholder"}
                </span>
                {previewVideo.duration && (
                  <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-0.5 text-xs font-mono font-bold">
                    {previewVideo.duration}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-foreground">{previewVideo.title}</h2>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {previewVideo.description || "No description."}
                </p>
              </div>

              {/* Categories */}
              <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-2">
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Tag size={13} className="text-purple-500" />
                  <span>Categories & Subcategories</span>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(previewVideo.categories).map(([cat, subs]) => (
                    <div key={cat} className="text-xs">
                      <strong className="text-foreground">{cat}:</strong>{" "}
                      <span className="text-muted-foreground">
                        {subs.length > 0 ? subs.join(", ") : "Main Category"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {previewVideo.tags && previewVideo.tags.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-foreground">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {previewVideo.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setPreviewVideo(null)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
                >
                  Close
                </button>
                <Link
                  to="/publisher/video-library/new"
                  search={{ edit: previewVideo.id }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--brand)]/90 cursor-pointer"
                >
                  <FileEdit size={14} />
                  <span>Edit Video</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
