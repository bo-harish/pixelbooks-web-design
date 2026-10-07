import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { usePublisherType } from "@/hooks/use-publisher-type";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import {
  Video,
  ArrowLeft,
  X,
  Plus,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  Tag,
  Film,
  GraduationCap,
  Users,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { CategoriesSectionCard } from "@/components/media-category-selector";
import { getVideoLibrary, saveVideoLibrary, type VideoItem } from "@/lib/media-library-data";
import {
  LibraryAllocationSection,
  type LibraryAllocationItem,
} from "@/components/library-allocation-section";

export const Route = createFileRoute("/publisher/video-library/new")({
  head: () => ({
    meta: [
      { title: "Video Library — Publisher" },
      {
        name: "description",
        content: "Curate and publish educational videos, lectures, and multimedia resources for library patrons.",
      },
    ],
  }),
  component: AddVideoPage,
});

function AddVideoPage() {
  const [publisherType] = usePublisherType();
  const navigate = useNavigate();

  useEffect(() => {
    if (publisherType !== "Library-Only Publisher") {
      navigate({ to: "/publisher", replace: true });
    }
  }, [publisherType, navigate]);

  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const editId = searchParams.get("edit");

  const existingVideos = useMemo(() => getVideoLibrary(), []);
  const targetVideo = editId ? existingVideos.find((v) => v.id === editId) : null;

  // Form Fields
  const [title, setTitle] = useState(targetVideo?.title ?? "");
  const [description, setDescription] = useState(targetVideo?.description ?? "");
  const [allocations, setAllocations] = useState<Record<string, LibraryAllocationItem>>(() => {
    if (targetVideo?.allocations && Object.keys(targetVideo.allocations).length > 0) {
      return targetVideo.allocations;
    }
    return {
      "Central University Digital Library": {
        copies: 50,
        courses: targetVideo?.courses || ["All Courses"],
        batches: targetVideo?.batches || ["All Batches"],
      },
      "National Science & Tech Consortium": {
        copies: 30,
        courses: targetVideo?.courses || ["All Courses"],
        batches: targetVideo?.batches || ["All Batches"],
      },
    };
  });
  const [tags, setTags] = useState<string[]>(
    targetVideo?.tags ?? ["Education", "Academic", "Video Lecture"],
  );
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState<Record<string, string[]>>(
    targetVideo?.categories ?? {
      "Academic & Educational": ["Higher Education", "Reference"],
    },
  );
  const [videoUrl, setVideoUrl] = useState(targetVideo?.videoUrl ?? "");
  const [status, setStatus] = useState<"Published" | "Draft">(targetVideo?.status ?? "Published");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      toast.info(`Tag "${trimmed}" is already added.`);
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  const handleRemoveTag = (idx: number) => {
    setTags((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (statusOverride?: "Published" | "Draft") => {
    const finalStatus = statusOverride || status;
    if (!title.trim()) {
      toast.error("Video Title is required.");
      return;
    }

    if (Object.keys(categories).length === 0) {
      toast.error("Please select at least one category for this video.");
      return;
    }

    const selectedLibraries = Object.keys(allocations);
    if (selectedLibraries.length === 0) {
      toast.error("Please allocate at least one library to proceed.");
      return;
    }

    setIsSubmitting(true);

    const allCourses = Array.from(
      new Set(Object.values(allocations).flatMap((a) => a.courses)),
    );
    const allBatches = Array.from(
      new Set(Object.values(allocations).flatMap((a) => a.batches)),
    );

    const now = new Date().toISOString().split("T")[0];
    const newVideo: VideoItem = {
      id: editId || `vid-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      tags,
      categories,
      videoUrl: videoUrl.trim(),
      duration: targetVideo?.duration ?? "",
      allocations,
      courses: allCourses.length > 0 ? allCourses : undefined,
      batches: allBatches.length > 0 ? allBatches : undefined,
      course: allCourses[0] || undefined,
      batch: allBatches[0] || undefined,
      status: finalStatus,
      createdAt: targetVideo?.createdAt || now,
    };

    const currentVideos = getVideoLibrary();
    let updated: VideoItem[];
    if (editId) {
      updated = currentVideos.map((v) => (v.id === editId ? newVideo : v));
      toast.success(`Video "${title}" updated successfully!`);
    } else {
      updated = [newVideo, ...currentVideos];
      toast.success(`Video "${title}" added to your Video Library!`);
    }

    saveVideoLibrary(updated);
    setTimeout(() => {
      navigate({ to: "/publisher/video-library" });
    }, 400);
  };

  return (
    <AppShell
      title={editId ? "Edit Video" : "Add Video"}
      subtitle="Curate and publish educational videos, lectures, and multimedia resources"
    >
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Link */}
          <div>
            <Link
              to="/publisher/video-library"
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors pb-1 cursor-pointer"
            >
              <ArrowLeft size={16} className="mr-1.5" />
              <span>Back to Video Library</span>
            </Link>
          </div>

        {/* Section 1: Video Details */}
        <div className="rounded-xl border border-border bg-card p-5 md:p-6 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] shadow-2xs">
                <Film size={22} />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-foreground leading-tight">
                  Video Details
                </h2>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  Primary title, description, and discoverability tags for this video.
                </p>
              </div>
            </div>

            {/* Publication Status Switch */}
            <div className="flex items-center gap-2.5 rounded-lg border border-border/80 bg-secondary/30 px-3 py-1.5 self-start sm:self-auto">
              <span className="text-xs font-semibold text-muted-foreground">Status:</span>
              <Switch
                id="video-status-switch"
                checked={status === "Published"}
                onCheckedChange={(checked) => setStatus(checked ? "Published" : "Draft")}
                aria-label="Toggle publication status"
              />
              <label
                htmlFor="video-status-switch"
                className={`text-xs font-bold cursor-pointer select-none ${
                  status === "Published"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {status}
              </label>
            </div>
          </div>

          <div className="space-y-4">
            {/* Video Title */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Video Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Artificial Intelligence & Neural Networks"
                className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-[var(--brand)] transition-colors shadow-2xs"
                required
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">
                A descriptive, academic or instructional title shown on patron catalogues.
              </span>
            </div>

            {/* Video URL / Embed Source */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Video URL / Embed Source
              </label>
              <div className="relative">
                <LinkIcon
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or MP4 / HLS link"
                  className="h-10 w-full rounded-xl border border-border bg-white pl-9 pr-3 text-xs text-foreground outline-none focus:border-[var(--brand)] shadow-2xs"
                />
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                YouTube, Vimeo, Cloudflare Stream, or direct media stream URL.
              </span>
            </div>



            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Description</label>
              <div className="rounded-xl border border-border bg-white overflow-hidden focus-within:border-[var(--brand)] transition-colors shadow-2xs">
                {/* Formatting Tools */}
                <div className="flex items-center gap-1 border-b border-border/60 bg-slate-50 px-3 py-1.5 text-xs text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => setDescription((prev) => prev + " **bold** ")}
                    className="h-7 w-7 rounded flex items-center justify-center font-bold hover:bg-card hover:text-foreground cursor-pointer"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescription((prev) => prev + " *italic* ")}
                    className="h-7 w-7 rounded flex items-center justify-center italic font-serif hover:bg-card hover:text-foreground cursor-pointer"
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescription((prev) => prev + "\n- Bullet item\n")}
                    className="h-7 px-2 rounded flex items-center justify-center hover:bg-card hover:text-foreground cursor-pointer"
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <div className="flex-1" />
                  <span className="text-[10.5px] text-muted-foreground/80 font-mono">
                    {description.length} characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed overview of the video content, topics covered, learning outcomes, and references..."
                  className="w-full border-none bg-transparent p-3 text-xs leading-relaxed text-foreground outline-none resize-y"
                />
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Tags</label>
              <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 shadow-2xs">
                {tags.map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="opacity-70 hover:opacity-100 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type tag and press Enter or comma..."
                    className="flex-1 border-none bg-transparent px-1 py-1 text-xs text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  {tagInput.trim() && (
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="rounded bg-[var(--brand)] px-2 py-0.5 text-[11px] font-semibold text-white"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Tags make the video discoverable when students and researchers search for specific
                topics.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Categories (like in catalogue/new) */}
        <CategoriesSectionCard
          selected={categories}
          onChange={setCategories}
          mediaTypeLabel="video"
        />

        {/* Section 3: Library Allocation & License Copies */}
        <LibraryAllocationSection
          allocations={allocations}
          onChange={setAllocations}
          mediaTypeLabel="video"
        />

        {/* Action Buttons Footer */}
        <div className="mt-6 flex items-center justify-between pt-2">
          <Link
            to="/publisher/video-library"
            className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-5 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
          >
            Cancel
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave("Draft")}
              className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-5 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave(status)}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--brand)] px-6 text-xs font-bold text-white shadow-md hover:bg-[var(--brand)]/90 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              <span>{editId ? "Update Video" : "Save Video"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);
}
