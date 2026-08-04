import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  User,
  Feather,
  GitMerge,
  Check,
  AlertTriangle,
  ArrowRight,
  X,
  BookOpen,
  Info,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/merge-authors")({
  head: () => ({
    meta: [
      { title: "Merge Authors — PixelBooks Admin" },
      {
        name: "description",
        content: "Merge duplicate author profiles into a single target author profile in PixelBooks Admin.",
      },
    ],
  }),
  component: MergeAuthorsPage,
});

export interface AuthorItem {
  id: string;
  name: string;
  email: string | null;
  avatarUrl?: string;
  publishedTitlesCount: number;
}

const AUTHOR_LIST: AuthorItem[] = [
  {
    id: "auth-1",
    name: "Westdeutscher Verlag I Koln Und Opladen",
    email: null,
    publishedTitlesCount: 14,
  },
  {
    id: "auth-2",
    name: "LaTeX with hyperref",
    email: null,
    publishedTitlesCount: 8,
  },
  {
    id: "auth-3",
    name: "Reshma Mukundan",
    email: null,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
    publishedTitlesCount: 26,
  },
  {
    id: "auth-4",
    name: "Tom Sawyer",
    email: null,
    publishedTitlesCount: 5,
  },
  {
    id: "auth-5",
    name: "Dada Bhagawan",
    email: null,
    publishedTitlesCount: 42,
  },
  {
    id: "auth-6",
    name: "'s Notes",
    email: null,
    publishedTitlesCount: 3,
  },
  {
    id: "auth-7",
    name: "Digitized by the Internet Archive",
    email: null,
    publishedTitlesCount: 112,
  },
  {
    id: "auth-8",
    name: "TeX",
    email: null,
    publishedTitlesCount: 19,
  },
  {
    id: "auth-9",
    name: "John R. Carling",
    email: null,
    publishedTitlesCount: 7,
  },
  {
    id: "auth-10",
    name: "Springer F Achmedlen Wiesbaden GmbH",
    email: null,
    publishedTitlesCount: 33,
  },
  {
    id: "auth-11",
    name: "William Shakespeare",
    email: "william.shakespeare@classic.org",
    publishedTitlesCount: 38,
  },
  {
    id: "auth-12",
    name: "Jane Austen",
    email: "j.austen@literature.org",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    publishedTitlesCount: 6,
  },
];

function MergeAuthorsPage() {
  const [duplicateSearch, setDuplicateSearch] = useState("");
  const [targetSearch, setTargetSearch] = useState("");

  // Selected duplicate author IDs
  const [selectedDuplicates, setSelectedDuplicates] = useState<string[]>([]);
  // Selected target author ID
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  // Confirmation dialog state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Filtered lists
  const filteredDuplicates = useMemo(() => {
    return AUTHOR_LIST.filter((author) => {
      if (!duplicateSearch.trim()) return true;
      const query = duplicateSearch.toLowerCase();
      return (
        author.name.toLowerCase().includes(query) ||
        (author.email && author.email.toLowerCase().includes(query))
      );
    });
  }, [duplicateSearch]);

  const filteredTargets = useMemo(() => {
    return AUTHOR_LIST.filter((author) => {
      if (!targetSearch.trim()) return true;
      const query = targetSearch.toLowerCase();
      return (
        author.name.toLowerCase().includes(query) ||
        (author.email && author.email.toLowerCase().includes(query))
      );
    });
  }, [targetSearch]);

  const toggleDuplicateSelection = (authorId: string) => {
    if (authorId === selectedTarget) {
      toast.error("Invalid Selection", {
        description: "An author cannot be selected as both duplicate source and target destination.",
      });
      return;
    }

    setSelectedDuplicates((prev) =>
      prev.includes(authorId) ? prev.filter((id) => id !== authorId) : [...prev, authorId]
    );
  };

  const handleSelectTarget = (authorId: string) => {
    if (selectedDuplicates.includes(authorId)) {
      toast.error("Invalid Selection", {
        description: "This author is currently selected as a duplicate source. Uncheck it first.",
      });
      return;
    }

    setSelectedTarget(authorId === selectedTarget ? null : authorId);
  };

  const handleClearSelections = () => {
    setSelectedDuplicates([]);
    setSelectedTarget(null);
    setDuplicateSearch("");
    setTargetSearch("");
  };

  const handleExecuteMerge = () => {
    const targetAuthor = AUTHOR_LIST.find((a) => a.id === selectedTarget);
    const duplicateAuthors = AUTHOR_LIST.filter((a) => selectedDuplicates.includes(a.id));

    toast.success("Authors Merged Successfully", {
      description: `Merged ${duplicateAuthors.length} duplicate profile(s) into "${targetAuthor?.name}".`,
    });

    setIsConfirmOpen(false);
    handleClearSelections();
  };

  const selectedTargetAuthor = AUTHOR_LIST.find((a) => a.id === selectedTarget);
  const selectedDuplicateAuthors = AUTHOR_LIST.filter((a) => selectedDuplicates.includes(a.id));

  // Compute combined titles count after merge
  const duplicateTitlesSum = selectedDuplicateAuthors.reduce((acc, a) => acc + a.publishedTitlesCount, 0);
  const totalTitlesAfterMerge = (selectedTargetAuthor?.publishedTitlesCount || 0) + duplicateTitlesSum;

  const canMerge = selectedDuplicates.length > 0 && selectedTarget !== null;

  return (
    <AppShell title="Merge Authors" subtitle="Search duplicate authors and merge them into a primary target author profile.">
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">

        {/* Step-by-Step UX Guide Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-2xs">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)]/10 font-bold text-xs text-[var(--brand)]">
              1
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground">Select Duplicate Profiles</span>
              <span className="text-xs text-muted-foreground">Choose one or more duplicate authors on the left list</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-2xs">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 font-bold text-xs text-emerald-600 dark:text-emerald-400">
              2
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground">Select Target Destination</span>
              <span className="text-xs text-muted-foreground">Pick the primary target author profile on the right list</span>
            </div>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Left Column: Search Duplicate Authors */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span>Search Duplicate Authors</span>
                </h3>
                {selectedDuplicates.length > 0 && (
                  <span className="text-xs font-semibold text-[var(--brand)] bg-[var(--sidebar-highlight)] px-2.5 py-0.5 rounded-full">
                    {selectedDuplicates.length} selected
                  </span>
                )}
              </div>

              {/* Search Bar with Clear Button */}
              <div className="relative w-full">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search duplicate author..."
                  value={duplicateSearch}
                  onChange={(e) => setDuplicateSearch(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-8 text-xs sm:text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                />
                {duplicateSearch && (
                  <button
                    type="button"
                    onClick={() => setDuplicateSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Selected Duplicates Chips inside Left Column */}
              {selectedDuplicateAuthors.length > 0 && (
                <div className="rounded-xl border border-orange-500/25 bg-orange-500/10 dark:bg-orange-500/15 dark:border-orange-500/30 p-3.5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-orange-950 dark:text-orange-200 uppercase tracking-wider flex items-center gap-1.5">
                      <GitMerge size={13} className="text-orange-600 dark:text-orange-400" />
                      Selected Duplicates ({selectedDuplicateAuthors.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedDuplicates([])}
                      className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 cursor-pointer transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                    {selectedDuplicateAuthors.map((author) => (
                      <span
                        key={author.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-2xs"
                      >
                        <span className="truncate max-w-[170px]">{author.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDuplicateSelection(author.id);
                          }}
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors"
                          title="Remove"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Scrollable Duplicate Author List */}
              <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredDuplicates.length > 0 ? (
                  filteredDuplicates.map((author) => {
                    const isSelected = selectedDuplicates.includes(author.id);
                    const isTarget = author.id === selectedTarget;

                    return (
                      <div
                        key={author.id}
                        onClick={() => toggleDuplicateSelection(author.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${isSelected
                          ? "border-[var(--brand)] bg-[var(--sidebar-highlight)] shadow-2xs"
                          : isTarget
                            ? "border-amber-300/60 bg-amber-500/5 opacity-50 cursor-not-allowed"
                            : "border-transparent bg-muted/20 hover:bg-muted/40"
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {author.avatarUrl ? (
                            <img
                              src={author.avatarUrl}
                              alt={author.name}
                              className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                              <Feather size={16} />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs sm:text-sm font-semibold truncate ${isSelected ? "text-[var(--brand)]" : "text-foreground"}`}>
                              {author.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <BookOpen size={11} />
                              {author.publishedTitlesCount} titles
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isTarget && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                              Target
                            </span>
                          )}
                          {isSelected && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-xs">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No duplicate authors found
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Merge Into (Target Author) */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Merge Into (Target Author)
                </h3>
                {selectedTargetAuthor && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full truncate max-w-[170px]">
                    Target: {selectedTargetAuthor.name}
                  </span>
                )}
              </div>

              {/* Search Bar with Clear Button */}
              <div className="relative w-full">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search target author..."
                  value={targetSearch}
                  onChange={(e) => setTargetSearch(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-8 text-xs sm:text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                />
                {targetSearch && (
                  <button
                    type="button"
                    onClick={() => setTargetSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Scrollable Target Author List */}
              <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredTargets.length > 0 ? (
                  filteredTargets.map((author) => {
                    const isSelected = selectedTarget === author.id;
                    const isDuplicate = selectedDuplicates.includes(author.id);

                    return (
                      <div
                        key={author.id}
                        onClick={() => handleSelectTarget(author.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${isSelected
                          ? "border-emerald-500 bg-emerald-500/10 shadow-2xs"
                          : isDuplicate
                            ? "border-amber-300/60 bg-amber-500/5 opacity-50 cursor-not-allowed"
                            : "border-transparent bg-muted/20 hover:bg-muted/40"
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {author.avatarUrl ? (
                            <img
                              src={author.avatarUrl}
                              alt={author.name}
                              className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                              <Feather size={16} />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs sm:text-sm font-semibold truncate ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                              {author.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <BookOpen size={11} />
                              {author.publishedTitlesCount} titles
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isDuplicate && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-md">
                              Duplicate
                            </span>
                          )}
                          {isSelected && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No target authors found
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Live Preview Transfer Callout Banner */}
          {selectedDuplicateAuthors.length > 0 ? (
            <div className="mb-6 p-5 rounded-xl border border-orange-500/25 bg-orange-500/10 dark:bg-orange-500/15 dark:border-orange-500/30 space-y-3.5 transition-all shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white shadow-xs">
                    <GitMerge size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-orange-950 dark:text-orange-100">
                      {selectedTargetAuthor
                        ? `Merging ${selectedDuplicateAuthors.length} duplicate profile(s) into "${selectedTargetAuthor.name}"`
                        : `${selectedDuplicateAuthors.length} Duplicate Profile(s) Selected`}
                    </span>
                    <span className="text-[11px] text-orange-900/80 dark:text-orange-300">
                      {canMerge
                        ? `Combined catalogue titles: ${selectedTargetAuthor?.publishedTitlesCount} + ${duplicateTitlesSum} = ${totalTitlesAfterMerge} total titles`
                        : "Select a target author on the right column to proceed with merging."}
                    </span>
                  </div>
                </div>

                {canMerge && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 shrink-0">
                    <Check size={14} /> Ready to Merge
                  </span>
                )}
              </div>

              {/* Selected Duplicate Authors Itemized List */}
              <div className="pt-2.5 border-t border-orange-500/20">
                <span className="text-[11px] font-bold text-orange-950 dark:text-orange-200 uppercase tracking-wider block mb-2">
                  Selected Duplicate Authors to Merge ({selectedDuplicateAuthors.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedDuplicateAuthors.map((author) => (
                    <div
                      key={author.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-orange-500/30 bg-card px-3 py-1.5 text-xs shadow-2xs"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <Feather size={11} />
                      </div>
                      <span className="font-semibold text-foreground">{author.name}</span>
                      <span className="text-[11px] text-muted-foreground">({author.publishedTitlesCount} titles)</span>
                      <button
                        type="button"
                        onClick={() => toggleDuplicateSelection(author.id)}
                        className="ml-1 text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                        title="Remove author"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-3.5 rounded-xl border border-border bg-muted/20 flex items-center gap-2.5 text-xs text-muted-foreground">
              <Info size={16} className="text-muted-foreground/70 shrink-0" />
              <span>Select at least 1 duplicate author on the left and 1 target author on the right to enable merge.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleClearSelections}
              className="h-10 px-5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canMerge}
              onClick={() => setIsConfirmOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 px-6 rounded-lg text-xs font-semibold shadow-xs transition-all hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              style={{
                backgroundColor: canMerge ? "var(--brand)" : "var(--muted)",
                color: canMerge ? "var(--brand-contrast)" : "var(--muted-foreground)",
              }}
            >
              <GitMerge size={14} />
              <span>Merge Author</span>
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl bg-card border-border p-6 shadow-2xl">
            <DialogHeader className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2">
                <AlertTriangle size={24} />
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Confirm Author Merge
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                This operation will merge the selected duplicate author profiles into the target profile. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 space-y-3 rounded-xl border border-border p-4 bg-muted/20 text-xs">
              <div>
                <span className="text-muted-foreground font-medium block mb-1">
                  Source Duplicates ({selectedDuplicateAuthors.length}):
                </span>
                <div className="space-y-1">
                  {selectedDuplicateAuthors.map((a) => (
                    <div key={a.id} className="font-semibold text-foreground flex items-center justify-between">
                      <span className="truncate">• {a.name}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0">{a.publishedTitlesCount} titles</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center my-1 text-muted-foreground">
                <ArrowRight size={16} className="rotate-90 sm:rotate-0 text-[var(--brand)]" />
              </div>

              <div>
                <span className="text-muted-foreground font-medium block mb-1">
                  Target Author Profile:
                </span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <span className="truncate">✓ {selectedTargetAuthor?.name}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {totalTitlesAfterMerge} titles after merge
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="h-10 px-5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteMerge}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-6 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                <GitMerge size={14} />
                <span>Confirm Merge</span>
              </button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </AppShell>
  );
}
