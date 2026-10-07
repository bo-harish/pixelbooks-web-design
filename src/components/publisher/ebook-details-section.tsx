import { useState } from "react";
import {
  Sparkles,
  Calendar,
  ChevronDown,
  List,
  ListOrdered,
  Quote,
  Link2,
  X,
  BookOpen,
} from "lucide-react";

export interface EbookDetailsSectionProps {
  title: string;
  setTitle: (val: string) => void;
  isbn: string;
  setIsbn: (val: string) => void;
  regionalName: string;
  setRegionalName: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  pubDate: string;
  setPubDate: (val: string) => void;
  paperbackDate: string;
  setPaperbackDate: (val: string) => void;
  ebookSize: string;
  setEbookSize: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
}

export function EbookDetailsSection({
  title,
  setTitle,
  isbn,
  setIsbn,
  regionalName,
  setRegionalName,
  language,
  setLanguage,
  pubDate,
  setPubDate,
  paperbackDate,
  setPaperbackDate,
  ebookSize,
  setEbookSize,
  summary,
  setSummary,
  tags,
  setTags,
}: EbookDetailsSectionProps) {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (rawVal: string) => {
    const trimmed = rawVal.trim().replace(/^,+|,+$/g, "");
    if (!trimmed) return;
    if (tags.length >= 5) return;
    setTags([...tags, trimmed]);
    setTagInput("");
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, idx) => idx !== index));
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card p-5 sm:p-6 space-y-5 shadow-xs">
      {/* Header: Title & Subtitle in Select Categories Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 shrink-0 shadow-2xs">
            <BookOpen size={16} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">eBook Details</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter title, ISBN, description, language, and publication bibliographic metadata.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40 shadow-2xs self-start sm:self-auto shrink-0">
          <Sparkles size={12} className="text-teal-600 dark:text-teal-400" />
          Auto-detected
        </span>
      </div>

      <div className="space-y-5">
        {/* Row 1: eBook Name & ISBN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">
              Enter eBook Name <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Harry Potter"
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card px-3.5 text-xs sm:text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">
              Enter ISBN-10 or 13 <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="25455955"
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card px-3.5 text-xs sm:text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Row 2: Regional Name & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">
              Regional Name
            </label>
            <input
              type="text"
              value={regionalName}
              onChange={(e) => setRegionalName(e.target.value)}
              placeholder="Harry Potter"
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card px-3.5 text-xs sm:text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">
              Language <span className="text-rose-500 font-bold">*</span>
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card px-3.5 pr-10 text-xs sm:text-sm text-foreground outline-none transition-colors focus:border-teal-500 cursor-pointer shadow-2xs"
              >
                <option value="English">English</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="German">German</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="Bengali">Bengali</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Row 3: 3 Columns - Publication Date, Paperback Date, eBook Size */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">
              Date of Publication in PixelBooks
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={pubDate}
                onChange={(e) => setPubDate(e.target.value)}
                placeholder="15/01/2024"
                className="h-11 w-full rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card px-3.5 pr-10 text-xs sm:text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-500 shadow-2xs"
              />
              <Calendar
                size={15}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 dark:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">
              Date of Paperback Publication
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={paperbackDate}
                onChange={(e) => setPaperbackDate(e.target.value)}
                placeholder="20/08/2023"
                className="h-11 w-full rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card px-3.5 pr-10 text-xs sm:text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-500 shadow-2xs"
              />
              <Calendar
                size={15}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 dark:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">
              eBook Size (in MB)
            </label>
            <input
              type="text"
              value={ebookSize}
              onChange={(e) => setEbookSize(e.target.value)}
              placeholder="25.4"
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card px-3.5 text-xs sm:text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Row 4: Summary with Rich Text Editor */}
        <div>
          <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">
            Summary
          </label>
          <div className="rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card overflow-hidden shadow-2xs">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-border bg-slate-50/50 dark:bg-secondary/30 px-3 py-2 text-xs">
              <div className="flex items-center gap-1 text-slate-700 dark:text-foreground">
                <button
                  type="button"
                  title="Bold"
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-200/60 dark:hover:bg-secondary font-bold text-xs cursor-pointer"
                >
                  B
                </button>
                <button
                  type="button"
                  title="Italic"
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-200/60 dark:hover:bg-secondary italic text-xs cursor-pointer font-serif"
                >
                  I
                </button>
                <button
                  type="button"
                  title="Underline"
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-200/60 dark:hover:bg-secondary underline text-xs cursor-pointer"
                >
                  U
                </button>
                <button
                  type="button"
                  title="Strikethrough"
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-200/60 dark:hover:bg-secondary line-through text-xs cursor-pointer"
                >
                  S
                </button>
                <span className="mx-1 h-3.5 w-px bg-slate-200 dark:bg-border" />
                <button
                  type="button"
                  title="Bullet List"
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-200/60 dark:hover:bg-secondary cursor-pointer"
                >
                  <List size={13} />
                </button>
                <button
                  type="button"
                  title="Numbered List"
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-200/60 dark:hover:bg-secondary cursor-pointer"
                >
                  <ListOrdered size={13} />
                </button>
                <button
                  type="button"
                  title="Blockquote"
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-200/60 dark:hover:bg-secondary cursor-pointer"
                >
                  <Quote size={13} />
                </button>
                <span className="mx-1 h-3.5 w-px bg-slate-200 dark:bg-border" />
                <button
                  type="button"
                  title="Insert Link"
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-200/60 dark:hover:bg-secondary cursor-pointer"
                >
                  <Link2 size={13} />
                </button>
              </div>

              <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                RICH TEXT EDITOR (RTB)
              </span>
            </div>

            {/* Textarea */}
            <textarea
              rows={5}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter comprehensive book description..."
              className="w-full p-3.5 text-xs sm:text-sm text-foreground bg-transparent outline-none resize-y min-h-[120px]"
            />

            {/* Editor Footer */}
            <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-border bg-slate-50/40 dark:bg-secondary/20 px-3.5 py-1.5 text-[11px] text-muted-foreground">
              <span>Rich Text &amp; Markdown enabled</span>
              <span>{summary.length} / 2,000 characters</span>
            </div>
          </div>
        </div>

        {/* Row 5: Tags */}
        <div>
          <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">
            Tags
          </label>
          <div className="flex min-h-[46px] flex-wrap items-center gap-2 rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card p-2 sm:p-2.5 shadow-2xs focus-within:border-teal-500 transition-colors">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 px-3 py-1 text-xs font-semibold text-teal-800 dark:text-teal-200 border border-teal-200/70 dark:border-teal-800/50 shadow-2xs"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(idx)}
                  className="text-teal-600 hover:text-teal-900 dark:hover:text-teal-100 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                onBlur={() => {
                  if (tagInput.trim()) handleAddTag(tagInput);
                }}
                placeholder="Add a tag"
                className="flex-1 min-w-[120px] bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none px-1"
              />
            )}
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground font-medium">
            <span>Press Enter or Comma to tag</span>
            <span>Maximum 5 keywords</span>
          </div>
        </div>
      </div>
    </div>
  );
}
