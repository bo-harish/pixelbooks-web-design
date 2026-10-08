import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  Video,
  Search,
  Tag,
  Clock,
  CheckCircle2,
  ExternalLink,
  Play,
  X,
  Eye,
  Film,
  Sparkles,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  getVideoLibrary,
  saveVideoLibrary,
  type VideoItem,
  MEDIA_CATEGORY_DATA,
} from "@/lib/media-library-data";

export const Route = createFileRoute("/library-admin/video-library")({
  head: () => ({
    meta: [
      { title: "Video Library — Library Admin" },
      {
        name: "description",
        content: "Browse and stream educational videos, lectures, and multimedia resources for library patrons.",
      },
    ],
  }),
  component: LibraryAdminVideoLibraryPage,
});

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
}

function parseDurationToMinutes(duration?: string): number {
  if (!duration) return 0;
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] + parts[1] / 60;
  }
  if (parts.length === 3) {
    return parts[0] * 60 + parts[1] + parts[2] / 60;
  }
  return 0;
}

function LibraryAdminVideoLibraryPage() {
  const [videos, setVideos] = useState<VideoItem[]>(() => getVideoLibrary());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);

  const setVideoActive = (videoId: string, active: boolean) => {
    const status = active ? "Published" : "Draft";
    const updatedVideos = videos.map((video) =>
      video.id === videoId ? { ...video, status } : video,
    );
    setVideos(updatedVideos);
    saveVideoLibrary(updatedVideos);
    setPreviewVideo((current) =>
      current?.id === videoId ? { ...current, status } : current,
    );
  };

  // Sync when publisher updates video library
  useEffect(() => {
    const handleUpdate = () => {
      setVideos(getVideoLibrary());
    };
    window.addEventListener("pb-video-library-change", handleUpdate);
    return () => window.removeEventListener("pb-video-library-change", handleUpdate);
  }, []);

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
  const uniqueCategories = useMemo(() => {
    const s = new Set<string>();
    videos.forEach((v) => Object.keys(v.categories).forEach((c) => s.add(c)));
    return s.size;
  }, [videos]);

  const totalRuntimeMinutes = useMemo(() => {
    const total = videos.reduce((acc, v) => acc + parseDurationToMinutes(v.duration), 0);
    return Math.round(total);
  }, [videos]);

  const embedUrl = previewVideo ? getYouTubeEmbedUrl(previewVideo.videoUrl) : null;

  return (
    <AppShell
      title="Video Library"
      subtitle="Browse and stream educational lectures, instructional videos, and multimedia resources for your library"
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        {/* Metric / Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 min-h-[130px] transition-shadow hover:shadow-md shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Videos
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Video size={18} />
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground">{totalCount}</div>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">In library collection</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 min-h-[130px] transition-shadow hover:shadow-md shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Published Content
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={18} />
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {publishedCount}
              </div>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">Available for patrons</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 min-h-[130px] transition-shadow hover:shadow-md shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Categories
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Tag size={18} />
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground">{uniqueCategories}</div>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">Subject domains</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 min-h-[130px] transition-shadow hover:shadow-md shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Watch Time
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Clock size={18} />
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground">
                {totalRuntimeMinutes} <span className="text-xs font-normal text-muted-foreground">mins</span>
              </div>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">Curated video material</p>
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Filters (No Add Video Button) */}
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
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-8 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] text-foreground"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm cursor-pointer"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            {/* Status Tabs */}
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

            {/* Category Dropdown */}
            <DropdownSelect
              value={categoryFilter === "All" ? "All Categories" : categoryFilter}
              options={["All Categories", ...Object.keys(MEDIA_CATEGORY_DATA)]}
              onChange={(val) => setCategoryFilter(val === "All Categories" ? "All" : val)}
              searchable
              searchPlaceholder="Search categories..."
              className="min-w-[180px] shrink-0"
            />
          </div>
        </div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVideos.map((video) => {
              const catEntries = Object.entries(video.categories);
              const courses = video.courses?.length
                ? video.courses
                : video.course
                  ? [video.course]
                  : [];
              const batches = video.batches?.length
                ? video.batches
                : video.batch
                  ? [video.batch]
                  : [];
              const courseBatchPairs = Array.from(
                { length: Math.max(courses.length, batches.length) },
                (_, index) => ({ course: courses[index], batch: batches[index] }),
              );
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
                      className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-indigo-950 shadow-xl group-hover:scale-110 transition-transform cursor-pointer"
                      title="Watch / Preview Video"
                    >
                      <Play size={20} className="ml-0.5" fill="currentColor" />
                    </button>

                    {video.duration && (
                      <span className="absolute bottom-2.5 right-2.5 z-10 rounded-md bg-black/80 px-2 py-0.5 text-[10.5px] font-mono font-bold text-white tracking-wide">
                        {video.duration}
                      </span>
                    )}

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

                    {/* Course & Batch badge if assigned */}
                    {courseBatchPairs.length > 0 && (
                      <div className="space-y-1.5 pt-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          <GraduationCap size={12} className="text-blue-500" />
                          <span>Course & Batch</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {courseBatchPairs.map(({ course, batch }, index) => (
                            <span
                              key={`${course ?? "course"}-${batch ?? "batch"}-${index}`}
                              className="inline-flex items-center rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10.5px] font-semibold text-blue-700 dark:text-blue-300"
                            >
                              <span>{[course, batch].filter(Boolean).join(" ")}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Categories */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Tag size={12} className="text-indigo-500" />
                        <span>Categories</span>
                      </div>
                      {catEntries.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {catEntries.slice(0, 2).map(([cat, subs]) => (
                            <span
                              key={cat}
                              className="inline-flex items-center rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10.5px] font-semibold text-indigo-700 dark:text-indigo-300"
                              title={`${cat}: ${subs.join(", ") || "Main Category"}`}
                            >
                              {cat}
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

                    {/* Card Actions Footer (Read-only for Library Admin) */}
                    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`active-switch-${video.id}`}
                          checked={video.status === "Published"}
                          onCheckedChange={(active) => setVideoActive(video.id, active)}
                          aria-label={`${video.title} active ${video.status === "Published" ? "on" : "off"}`}
                        />
                        <label
                          htmlFor={`active-switch-${video.id}`}
                          className={`text-xs font-semibold cursor-pointer select-none ${
                            video.status === "Published"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {video.status === "Published" ? "Active" : "Inactive"}
                        </label>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {video.videoUrl && (
                          <a
                            href={video.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                            title="Open external source"
                          >
                            <ExternalLink size={14} />
                            <span className="text-[11px] font-medium">Source</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setPreviewVideo(video)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] px-2.5 py-1 text-xs font-semibold hover:bg-[var(--brand)]/20 transition-colors cursor-pointer"
                          title="Watch Video"
                        >
                          <Play size={13} fill="currentColor" />
                          <span>Watch</span>
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
                : "There are currently no videos available in the library collection."}
            </p>
            {(searchQuery || statusFilter !== "All" || categoryFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                  setCategoryFilter("All");
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Video Preview / Player Modal */}
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
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Video size={18} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Educational Video Player
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

              {/* Video Player Stream */}
              <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden flex flex-col items-center justify-center text-white border border-border">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={previewVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white mb-2">
                      <Play size={28} className="ml-0.5" fill="currentColor" />
                    </div>
                    <span className="text-sm font-semibold text-white/90">
                      {previewVideo.title}
                    </span>
                    <span className="text-xs text-white/60 mt-1 font-mono">
                      {previewVideo.videoUrl || "Video playback stream ready"}
                    </span>
                  </div>
                )}
                {previewVideo.duration && (
                  <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-0.5 text-xs font-mono font-bold">
                    {previewVideo.duration}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-foreground">{previewVideo.title}</h2>
                {((previewVideo.courses && previewVideo.courses.length > 0) ||
                  (previewVideo.batches && previewVideo.batches.length > 0) ||
                  previewVideo.course ||
                  previewVideo.batch) && (
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {(previewVideo.courses && previewVideo.courses.length > 0
                      ? previewVideo.courses
                      : previewVideo.course
                        ? [previewVideo.course]
                        : []
                    ).map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300"
                      >
                        <GraduationCap size={13} />
                        <span>Course: {c}</span>
                      </span>
                    ))}
                    {(previewVideo.batches && previewVideo.batches.length > 0
                      ? previewVideo.batches
                      : previewVideo.batch
                        ? [previewVideo.batch]
                        : []
                    ).map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300"
                      >
                        <Users size={13} />
                        <span>Batch: {b}</span>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {previewVideo.description || "No description provided."}
                </p>
              </div>

              {/* Categories */}
              <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-2">
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Tag size={13} className="text-indigo-500" />
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

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
                {previewVideo.videoUrl ? (
                  <a
                    href={previewVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink size={14} />
                    <span>Open in new window</span>
                  </a>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={() => setPreviewVideo(null)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
