import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { usePublisherType } from "@/hooks/use-publisher-type";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import {
  Headphones,
  ArrowLeft,
  X,
  Plus,
  CheckCircle2,
  Link as LinkIcon,
  Tag,
  Volume2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { CategoriesSectionCard } from "@/components/media-category-selector";
import { getAudioLibrary, saveAudioLibrary, type AudioItem } from "@/lib/media-library-data";

export const Route = createFileRoute("/publisher/audio-library/new")({
  head: () => ({
    meta: [
      { title: "Add Audio — Publisher Audio Library" },
      {
        name: "description",
        content: "Add a new audio title with description, tags, narrator, and categories.",
      },
    ],
  }),
  component: AddAudioPage,
});

function AddAudioPage() {
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

  const existingAudios = useMemo(() => getAudioLibrary(), []);
  const targetAudio = editId ? existingAudios.find((a) => a.id === editId) : null;

  // Form Fields
  const [title, setTitle] = useState(targetAudio?.title ?? "");
  const [description, setDescription] = useState(targetAudio?.description ?? "");
  const [tags, setTags] = useState<string[]>(
    targetAudio?.tags ?? ["Audiobook", "Mindfulness", "Productivity"],
  );
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState<Record<string, string[]>>(
    targetAudio?.categories ?? {
      "Self-Help": ["Mindfulness", "Productivity"],
    },
  );
  const [audioUrl, setAudioUrl] = useState(targetAudio?.audioUrl ?? "");
  const [narrator, setNarrator] = useState(targetAudio?.narrator ?? "");
  const [status, setStatus] = useState<"Published" | "Draft">(targetAudio?.status ?? "Published");
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
      toast.error("Audio Title is required.");
      return;
    }

    if (Object.keys(categories).length === 0) {
      toast.error("Please select at least one category for this audio.");
      return;
    }

    setIsSubmitting(true);

    const now = new Date().toISOString().split("T")[0];
    const newAudio: AudioItem = {
      id: editId || `aud-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      tags,
      categories,
      audioUrl: audioUrl.trim(),
      duration: targetAudio?.duration ?? "",
      narrator: narrator.trim(),
      status: finalStatus,
      createdAt: targetAudio?.createdAt || now,
    };

    const currentAudios = getAudioLibrary();
    let updated: AudioItem[];
    if (editId) {
      updated = currentAudios.map((a) => (a.id === editId ? newAudio : a));
      toast.success(`Audio "${title}" updated successfully!`);
    } else {
      updated = [newAudio, ...currentAudios];
      toast.success(`Audio "${title}" added to your Audio Library!`);
    }

    saveAudioLibrary(updated);
    setTimeout(() => {
      navigate({ to: "/publisher/audio-library" });
    }, 400);
  };

  return (
    <AppShell
      title={editId ? "Edit Audio" : "Add Audio"}
      subtitle="Curate and publish audiobooks, podcasts, and audio resources"
    >
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Link */}
          <div>
            <Link
              to="/publisher/audio-library"
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors pb-1 cursor-pointer"
            >
              <ArrowLeft size={16} className="mr-1.5" />
              <span>Back to Audio Library</span>
            </Link>
          </div>

        {/* Section 1: Audio Details */}
        <div className="rounded-xl border border-border bg-card p-5 md:p-6 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shadow-2xs">
                <Volume2 size={22} />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-foreground leading-tight">
                  Audio Details
                </h2>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  Primary audio title, narrator, description, and discoverability tags.
                </p>
              </div>
            </div>

            {/* Publication Status Switch */}
            <div className="flex items-center gap-2.5 rounded-lg border border-border/80 bg-secondary/30 px-3 py-1.5 self-start sm:self-auto">
              <span className="text-xs font-semibold text-muted-foreground">Status:</span>
              <Switch
                id="audio-status-switch"
                checked={status === "Published"}
                onCheckedChange={(checked) => setStatus(checked ? "Published" : "Draft")}
                aria-label="Toggle publication status"
              />
              <label
                htmlFor="audio-status-switch"
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
            {/* Audio Title */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Audio Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Art of Mindful Leadership & Productivity"
                className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-[var(--brand)] transition-colors shadow-2xs"
                required
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">
                The full title of the audiobook, spoken lecture, or podcast episode.
              </span>
            </div>

            {/* Audio Stream Source */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Audio Stream / MP3 File URL
              </label>
              <div className="relative">
                <LinkIcon
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="url"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://example.com/audio/sample-track.mp3"
                  className="h-10 w-full rounded-xl border border-border bg-white pl-9 pr-3 text-xs text-foreground outline-none focus:border-[var(--brand)] shadow-2xs"
                />
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Direct audio file link or CDN stream source for library patron media player.
              </span>
            </div>

            {/* Narrator / Speaker */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Narrator / Speaker
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={narrator}
                  onChange={(e) => setNarrator(e.target.value)}
                  placeholder="e.g. Dr. Elena Vance"
                  className="h-10 w-full rounded-xl border border-border bg-white pl-9 pr-3 text-xs text-foreground outline-none focus:border-[var(--brand)] shadow-2xs"
                />
              </div>
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
                  placeholder="Provide an engaging description of the audiobook, chapter overview, themes, and patron takeaways..."
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
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20"
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
            </div>
          </div>
        </div>

        {/* Section 2: Categories (like in catalogue/new) */}
        <CategoriesSectionCard
          selected={categories}
          onChange={setCategories}
          mediaTypeLabel="audio"
        />

        {/* Action Buttons Footer */}
        <div className="mt-6 flex items-center justify-between pt-2">
          <Link
            to="/publisher/audio-library"
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
              <span>{editId ? "Update Audio" : "Save Audio"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);
}
