import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  Headphones,
  Search,
  Tag,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  X,
  User,
  Volume2,
  VolumeX,
  ExternalLink,
  Sparkles,
  GraduationCap,
  Users,
} from "lucide-react";
import {
  getAudioLibrary,
  type AudioItem,
  MEDIA_CATEGORY_DATA,
} from "@/lib/media-library-data";

export const Route = createFileRoute("/library-admin/audio-library")({
  head: () => ({
    meta: [
      { title: "Audio Library — Library Admin" },
      {
        name: "description",
        content: "Browse and listen to audiobooks, podcasts, oral histories, and spoken lecture series.",
      },
    ],
  }),
  component: LibraryAdminAudioLibraryPage,
});

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

function LibraryAdminAudioLibraryPage() {
  const [audios, setAudios] = useState<AudioItem[]>(() => getAudioLibrary());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [previewAudio, setPreviewAudio] = useState<AudioItem | null>(null);

  // Audio player mock playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);

  // Sync when publisher updates audio library
  useEffect(() => {
    const handleUpdate = () => {
      setAudios(getAudioLibrary());
    };
    window.addEventListener("pb-audio-library-change", handleUpdate);
    return () => window.removeEventListener("pb-audio-library-change", handleUpdate);
  }, []);

  // Timer simulator for audio modal
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && previewAudio) {
      timer = setInterval(() => {
        setPlaybackSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, previewAudio]);

  const handleOpenAudio = (audio: AudioItem) => {
    setPreviewAudio(audio);
    setIsPlaying(true);
    setPlaybackSeconds(0);
  };

  const handleCloseAudio = () => {
    setPreviewAudio(null);
    setIsPlaying(false);
    setPlaybackSeconds(0);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const filteredAudios = useMemo(() => {
    return audios.filter((a) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.narrator && a.narrator.toLowerCase().includes(q)) ||
        a.tags.some((t) => t.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || a.status === statusFilter;

      const matchesCat =
        categoryFilter === "All" ||
        Object.keys(a.categories).includes(categoryFilter) ||
        Object.values(a.categories).some((subs) => subs.includes(categoryFilter));

      return matchesSearch && matchesStatus && matchesCat;
    });
  }, [audios, searchQuery, statusFilter, categoryFilter]);

  const totalCount = audios.length;
  const publishedCount = audios.filter((a) => a.status === "Published").length;
  const uniqueCategories = useMemo(() => {
    const s = new Set<string>();
    audios.forEach((a) => Object.keys(a.categories).forEach((c) => s.add(c)));
    return s.size;
  }, [audios]);

  const totalRuntimeMinutes = useMemo(() => {
    const total = audios.reduce((acc, a) => acc + parseDurationToMinutes(a.duration), 0);
    return Math.round(total);
  }, [audios]);

  return (
    <AppShell
      title="Audio Library"
      subtitle="Browse and listen to audiobooks, lectures, and spoken audio resources for your library"
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        {/* Metric / Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 min-h-[130px] transition-shadow hover:shadow-md shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Audio
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Headphones size={18} />
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground">{totalCount}</div>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">In audio catalogue</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 min-h-[130px] transition-shadow hover:shadow-md shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Published Tracks
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
              <p className="text-[11.5px] text-muted-foreground mt-0.5">Genres represented</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 min-h-[130px] transition-shadow hover:shadow-md shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Audio Duration
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock size={18} />
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground">
                {totalRuntimeMinutes} <span className="text-xs font-normal text-muted-foreground">mins</span>
              </div>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">Spoken audio collection</p>
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Filters (No Add Audio Button) */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by title, description, narrator, or tags..."
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

        {/* Audio Grid */}
        {filteredAudios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAudios.map((audio) => {
              const catEntries = Object.entries(audio.categories);
              return (
                <div
                  key={audio.id}
                  className="group rounded-2xl border border-border bg-card overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Audio Card Banner */}
                  <div className="relative h-28 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 flex items-center justify-between px-5 border-b border-border/80">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenAudio(audio)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 group-hover:scale-105 transition-transform cursor-pointer shadow-lg"
                        title="Listen / Preview Audio"
                      >
                        <Volume2 size={22} />
                      </button>
                      <div>
                        {audio.duration && (
                          <div className="text-xs font-mono font-bold text-teal-300">
                            {audio.duration}
                          </div>
                        )}
                        {audio.narrator && (
                          <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5 font-medium">
                            <User size={11} className="text-teal-400" />
                            <span>{audio.narrator}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={`rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${
                        audio.status === "Published"
                          ? "bg-emerald-500/90 text-white shadow-2xs"
                          : "bg-amber-500/90 text-white shadow-2xs"
                      }`}
                    >
                      {audio.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3
                        className="text-sm font-bold text-foreground line-clamp-2 leading-snug hover:text-[var(--brand)] transition-colors cursor-pointer"
                        onClick={() => handleOpenAudio(audio)}
                      >
                        {audio.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {audio.description || "No description provided."}
                      </p>
                    </div>

                    {/* Course & Batch badge if assigned */}
                    {((audio.courses && audio.courses.length > 0) ||
                      (audio.batches && audio.batches.length > 0) ||
                      audio.course ||
                      audio.batch) && (
                      <div className="space-y-1.5 pt-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          <GraduationCap size={12} className="text-blue-500" />
                          <span>Course & Batch</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(audio.courses && audio.courses.length > 0
                            ? audio.courses
                            : audio.course
                              ? [audio.course]
                              : []
                          ).map((c) => (
                            <span
                              key={c}
                              className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10.5px] font-semibold text-blue-700 dark:text-blue-300"
                            >
                              <GraduationCap size={11} />
                              <span>{c}</span>
                            </span>
                          ))}
                          {(audio.batches && audio.batches.length > 0
                            ? audio.batches
                            : audio.batch
                              ? [audio.batch]
                              : []
                          ).map((b) => (
                            <span
                              key={b}
                              className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10.5px] font-semibold text-amber-700 dark:text-amber-300"
                            >
                              <Users size={11} />
                              <span>{b}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Categories */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Tag size={12} className="text-teal-500" />
                        <span>Categories</span>
                      </div>
                      {catEntries.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {catEntries.slice(0, 2).map(([cat, subs]) => (
                            <span
                              key={cat}
                              className="inline-flex items-center rounded-md bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 text-[10.5px] font-semibold text-teal-700 dark:text-teal-300"
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
                    {audio.tags && audio.tags.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Tags
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {audio.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-full bg-secondary border border-border/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                          {audio.tags.length > 3 && (
                            <span className="text-[10px] text-muted-foreground self-center">
                              +{audio.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Card Actions Footer (Read-only for Library Admin) */}
                    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                      <span className="text-[11px] text-muted-foreground font-medium">
                        Added: {audio.createdAt || "Recent"}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {audio.audioUrl && (
                          <a
                            href={audio.audioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                            title="Open external audio"
                          >
                            <ExternalLink size={14} />
                            <span className="text-[11px] font-medium">Source</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenAudio(audio)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] px-2.5 py-1 text-xs font-semibold hover:bg-[var(--brand)]/20 transition-colors cursor-pointer"
                          title="Listen to Audio"
                        >
                          <Volume2 size={13} />
                          <span>Listen</span>
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
              <Headphones size={28} />
            </div>
            <h3 className="text-base font-bold text-foreground">No audio tracks found</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-5 max-w-sm">
              {searchQuery || statusFilter !== "All" || categoryFilter !== "All"
                ? "Try adjusting your search query or filters to find what you are looking for."
                : "There are currently no audio tracks available in the library collection."}
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

        {/* Audio Player / Preview Modal */}
        {previewAudio && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
            onClick={handleCloseAudio}
          >
            <div
              className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Headphones size={18} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Educational Audio Player
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCloseAudio}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Audio Waveform Simulator Player */}
              <div className="p-6 rounded-xl bg-slate-950 flex flex-col items-center justify-center text-white border border-border space-y-4 shadow-inner">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-slate-950 shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause size={20} fill="currentColor" />
                      ) : (
                        <Play size={20} className="ml-0.5" fill="currentColor" />
                      )}
                    </button>
                    <div>
                      <div className="text-sm font-bold text-white line-clamp-1">
                        {previewAudio.title}
                      </div>
                      <div className="text-xs text-teal-400 font-mono mt-0.5 flex items-center gap-2">
                        <span>
                          {formatSeconds(playbackSeconds)} / {previewAudio.duration || "40:00"}
                        </span>
                        {previewAudio.narrator && (
                          <span className="text-slate-400 text-[11px] font-sans">
                            • {previewAudio.narrator}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>

                {/* Animated Waveform */}
                <div className="w-full h-10 flex items-center gap-1 px-2">
                  {[
                    40, 65, 30, 80, 50, 95, 70, 45, 60, 85, 30, 75, 90, 55, 65, 40, 80, 50, 70, 35,
                    60, 45, 80, 30, 65, 90, 50, 75, 40, 85, 60,
                  ].map((h, i) => {
                    const activeHeight = isPlaying
                      ? Math.min(100, Math.max(20, h + ((i % 3) - 1) * 20))
                      : h;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          isPlaying ? "bg-teal-400 shadow-xs" : "bg-teal-500/40"
                        }`}
                        style={{ height: `${activeHeight}%` }}
                      />
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-400 h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (playbackSeconds / 300) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-foreground">{previewAudio.title}</h2>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${
                      previewAudio.status === "Published"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {previewAudio.status}
                  </span>
                </div>
                {((previewAudio.courses && previewAudio.courses.length > 0) ||
                  (previewAudio.batches && previewAudio.batches.length > 0) ||
                  previewAudio.course ||
                  previewAudio.batch) && (
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {(previewAudio.courses && previewAudio.courses.length > 0
                      ? previewAudio.courses
                      : previewAudio.course
                        ? [previewAudio.course]
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
                    {(previewAudio.batches && previewAudio.batches.length > 0
                      ? previewAudio.batches
                      : previewAudio.batch
                        ? [previewAudio.batch]
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
                  {previewAudio.description || "No description provided."}
                </p>
              </div>

              {/* Categories */}
              <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-2">
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Tag size={13} className="text-teal-500" />
                  <span>Categories & Subcategories</span>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(previewAudio.categories).map(([cat, subs]) => (
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
              {previewAudio.tags && previewAudio.tags.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-foreground">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {previewAudio.tags.map((tag, idx) => (
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
                {previewAudio.audioUrl ? (
                  <a
                    href={previewAudio.audioUrl}
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
                  onClick={handleCloseAudio}
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
