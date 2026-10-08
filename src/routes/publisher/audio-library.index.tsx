import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { usePublisherType } from "@/hooks/use-publisher-type";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  Headphones,
  Plus,
  Search,
  Tag,
  Clock,
  CheckCircle2,
  FileEdit,
  Trash2,
  Play,
  X,
  User,
  Eye,
  Volume2,
  GraduationCap,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAudioLibrary,
  saveAudioLibrary,
  type AudioItem,
  MEDIA_CATEGORY_DATA,
} from "@/lib/media-library-data";

export const Route = createFileRoute("/publisher/audio-library/")({
  head: () => ({
    meta: [
      { title: "Audio Library — Publisher" },
      {
        name: "description",
        content: "Manage audiobooks, lectures, and audio resources for library patrons.",
      },
    ],
  }),
  component: AudioLibraryPage,
});

function AudioLibraryPage() {
  const [publisherType] = usePublisherType();
  const navigate = useNavigate();

  useEffect(() => {
    if (publisherType !== "Library-Only Publisher") {
      navigate({ to: "/publisher", replace: true });
    }
  }, [publisherType, navigate]);

  const [audios, setAudios] = useState<AudioItem[]>(() => getAudioLibrary());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [previewAudio, setPreviewAudio] = useState<AudioItem | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setAudios(getAudioLibrary());
    };
    window.addEventListener("pb-audio-library-change", handleUpdate);
    return () => window.removeEventListener("pb-audio-library-change", handleUpdate);
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    const next = audios.filter((a) => a.id !== id);
    setAudios(next);
    saveAudioLibrary(next);
    toast.success(`Deleted audio "${title}"`);
  };

  const handleToggleStatus = (id: string) => {
    const next = audios.map((a) => {
      if (a.id === id) {
        const newStatus = a.status === "Published" ? ("Draft" as const) : ("Published" as const);
        toast.success(`Audio marked as ${newStatus}`);
        return { ...a, status: newStatus };
      }
      return a;
    });
    setAudios(next);
    saveAudioLibrary(next);
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
  const draftCount = audios.filter((a) => a.status === "Draft").length;
  const uniqueCategories = useMemo(() => {
    const s = new Set<string>();
    audios.forEach((a) => Object.keys(a.categories).forEach((c) => s.add(c)));
    return s.size;
  }, [audios]);

  if (publisherType !== "Library-Only Publisher") {
    return null;
  }

  return (
    <AppShell
      title="Audio Library"
      subtitle="Curate and manage audiobooks, podcasts, oral histories, and spoken lecture series"
    >
      <div className="p-4 md:p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Audio</span>
              <Headphones size={16} className="text-teal-500" />
            </div>
            <div className="text-2xl font-extrabold text-foreground">{totalCount}</div>
            <span className="text-[11px] text-muted-foreground">In audio catalogue</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Published</span>
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {publishedCount}
            </div>
            <span className="text-[11px] text-muted-foreground">Available to patrons</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Drafts</span>
              <Clock size={16} className="text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {draftCount}
            </div>
            <span className="text-[11px] text-muted-foreground">Pending publication</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Categories</span>
              <Tag size={16} className="text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-foreground">{uniqueCategories}</div>
            <span className="text-[11px] text-muted-foreground">Genres represented</span>
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
              placeholder="Search by title, description, narrator, or tags..."
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
              to="/publisher/audio-library/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-[var(--brand)]/90 shrink-0 cursor-pointer whitespace-nowrap"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Audio</span>
            </Link>
          </div>
        </div>

        {/* Audio Grid */}
        {filteredAudios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAudios.map((audio) => {
              const catEntries = Object.entries(audio.categories);
              const courses = audio.courses?.length
                ? audio.courses
                : audio.course
                  ? [audio.course]
                  : [];
              const batches = audio.batches?.length
                ? audio.batches
                : audio.batch
                  ? [audio.batch]
                  : [];
              const courseBatchPairs = Array.from(
                { length: Math.max(courses.length, batches.length) },
                (_, index) => ({ course: courses[index], batch: batches[index] }),
              );
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
                        onClick={() => setPreviewAudio(audio)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 group-hover:scale-105 transition-transform cursor-pointer"
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
                          <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                            <User size={11} />
                            <span>{audio.narrator}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={`rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${
                        audio.status === "Published"
                          ? "bg-emerald-500/90 text-white"
                          : "bg-amber-500/90 text-white"
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
                        onClick={() => setPreviewAudio(audio)}
                      >
                        {audio.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {audio.description || "No description provided."}
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

                    {/* Card Actions Footer */}
                    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`status-switch-${audio.id}`}
                          checked={audio.status === "Published"}
                          onCheckedChange={() => handleToggleStatus(audio.id)}
                          aria-label={`Toggle status to ${audio.status === "Published" ? "Draft" : "Published"}`}
                        />
                        <label
                          htmlFor={`status-switch-${audio.id}`}
                          className={`text-xs font-semibold cursor-pointer select-none ${
                            audio.status === "Published"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {audio.status === "Published" ? "Published" : "Draft"}
                        </label>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewAudio(audio)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                          title="Preview Audio"
                        >
                          <Eye size={16} />
                        </button>
                        <Link
                          to="/publisher/audio-library/new"
                          search={{ edit: audio.id }}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                          title="Edit Audio"
                        >
                          <FileEdit size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(audio.id, audio.title)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete Audio"
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
              <Headphones size={28} />
            </div>
            <h3 className="text-base font-bold text-foreground">No audio tracks found</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-5 max-w-sm">
              {searchQuery || statusFilter !== "All" || categoryFilter !== "All"
                ? "Try adjusting your search query or filters to find what you are looking for."
                : "Your Audio Library is empty. Start adding spoken audiobooks, lectures, and resources."}
            </p>
            <Link
              to="/publisher/audio-library/new"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--brand)] px-5 text-xs font-semibold text-white hover:bg-[var(--brand)]/90 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Your First Audio</span>
            </Link>
          </div>
        )}

        {/* Audio Preview Modal */}
        {previewAudio && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
            onClick={() => setPreviewAudio(null)}
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
                    Audio Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewAudio(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Audio Waveform Simulator */}
              <div className="p-6 rounded-xl bg-slate-950 flex flex-col items-center justify-center text-white border border-border space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-slate-950 shadow-md hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Play size={20} className="ml-0.5" fill="currentColor" />
                  </button>
                  <div>
                    <div className="text-sm font-bold">{previewAudio.title}</div>
                    <div className="text-xs text-teal-400 font-mono mt-0.5">
                      {previewAudio.duration || "00:00"}{" "}
                      {previewAudio.narrator ? `• Narrated by ${previewAudio.narrator}` : ""}
                    </div>
                  </div>
                </div>

                <div className="w-full h-8 flex items-center gap-1 px-4">
                  {[
                    40, 65, 30, 80, 50, 95, 70, 45, 60, 85, 30, 75, 90, 55, 65, 40, 80, 50, 70, 35,
                    60,
                  ].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-teal-500/60 rounded-full"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-foreground">{previewAudio.title}</h2>
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
                  {previewAudio.description || "No description."}
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

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setPreviewAudio(null)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
                >
                  Close
                </button>
                <Link
                  to="/publisher/audio-library/new"
                  search={{ edit: previewAudio.id }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--brand)]/90 cursor-pointer"
                >
                  <FileEdit size={14} />
                  <span>Edit Audio</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
