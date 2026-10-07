import { useState, useMemo } from "react";
import {
  Search,
  X,
  BookOpen,
  Check,
  Pencil,
  Trash2,
  Percent,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  slugify,
  initials,
  type SelectedAuthor,
  type AuthorMatch,
} from "./catalogue-form-shared";

export const DEFAULT_AUTHORS_CATALOGUE: AuthorMatch[] = [
  {
    id: "a-mark-twain",
    name: "Mark Twain",
    books: 3,
    avatar: "",
    affiliation: "Classic Literature",
  },
  {
    id: "a-arun",
    name: "Arun",
    books: 0,
    avatar: "",
    affiliation: "Independent Author",
  },
  {
    id: "a-arundhati-roy",
    name: "Arundhati Roy",
    books: 30,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    affiliation: "Contemporary Fiction",
  },
  {
    id: "a-charles-dickens",
    name: "Charles Dickens",
    books: 4,
    avatar: "",
    affiliation: "Classic Victorian Collection",
  },
  {
    id: "a-haruki-murakami",
    name: "Haruki Murakami",
    books: 4,
    avatar: "",
    affiliation: "Modern Fiction",
  },
  {
    id: "a-ashok-alex",
    name: "Dr. Ashok Alex",
    books: 8,
    avatar: "https://i.pravatar.cc/80?img=12",
    affiliation: "Academic Research Press",
  },
];

export interface AuthorDetailsSectionProps {
  selectedAuthors: SelectedAuthor[];
  setSelectedAuthors: (authors: SelectedAuthor[]) => void;
  domainPrefix?: string;
  isCompletePublisher?: boolean;
}

export function AuthorDetailsSection({
  selectedAuthors,
  setSelectedAuthors,
  domainPrefix = "https://azdevlibcustomer.pixelbooksapp.com/author/",
  isCompletePublisher = false,
}: AuthorDetailsSectionProps) {
  // Default query to empty string so no matching authors are shown by default
  const [authorQuery, setAuthorQuery] = useState("");

  const hasQuery = authorQuery.trim().length > 0;

  // Filter matching authors only when a search query is present
  const matchingAuthors = useMemo(() => {
    if (!hasQuery) return [];
    return DEFAULT_AUTHORS_CATALOGUE.filter((a) =>
      a.name.toLowerCase().includes(authorQuery.toLowerCase()),
    );
  }, [authorQuery, hasQuery]);

  const handleToggleAuthor = (author: AuthorMatch) => {
    const isAlreadySelected = selectedAuthors.some((sa) => sa.name === author.name);
    if (isAlreadySelected) {
      toast.info(`${author.name} is already added`);
      return;
    }

    const newAuthor: SelectedAuthor = {
      id: `author-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: author.name,
      books: author.books,
      avatar: author.avatar,
      addAsNew: false,
      role: "Lead Author",
      royaltyPercentage: selectedAuthors.length === 0 ? 100 : 50,
      profileSlug: slugify(author.name),
    };

    setSelectedAuthors([...selectedAuthors, newAuthor]);
    toast.success(`Added ${author.name}`);
  };

  const handleAddNewAuthor = () => {
    const nameToCreate = authorQuery.trim() || "New Author";
    const exists = selectedAuthors.some(
      (sa) => sa.name.toLowerCase() === nameToCreate.toLowerCase(),
    );
    if (exists) {
      toast.info(`Author "${nameToCreate}" is already in your selected list`);
      return;
    }

    const newAuthor: SelectedAuthor = {
      id: `new-author-${Date.now()}`,
      name: nameToCreate,
      books: 0,
      avatar: "",
      addAsNew: true,
      role: "Lead Author",
      royaltyPercentage: selectedAuthors.length === 0 ? 100 : 50,
      profileSlug: slugify(nameToCreate),
    };

    setSelectedAuthors([...selectedAuthors, newAuthor]);
    toast.success(`Created and added new author: ${nameToCreate}`);
  };

  const handleRemoveAuthor = (authorId: string) => {
    setSelectedAuthors(selectedAuthors.filter((sa) => sa.id !== authorId));
  };

  const handleSlugChange = (authorId: string, slug: string) => {
    setSelectedAuthors(
      selectedAuthors.map((sa) => (sa.id === authorId ? { ...sa, profileSlug: slug } : sa)),
    );
  };

  const handleRoleChange = (authorId: string, role: string) => {
    setSelectedAuthors(
      selectedAuthors.map((sa) => (sa.id === authorId ? { ...sa, role } : sa)),
    );
  };

  const handleRoyaltyChange = (authorId: string, royalty: number) => {
    setSelectedAuthors(
      selectedAuthors.map((sa) =>
        sa.id === authorId ? { ...sa, royaltyPercentage: royalty } : sa,
      ),
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card p-5 sm:p-6 space-y-5 shadow-xs">
      {/* Header: Title & Subtitle in Select Categories Style */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40 shrink-0 shadow-2xs">
          <Users size={16} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-foreground">Author(s) Details</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search the author directory for the best matching author. If no suitable match is found,
            create a new author.
          </p>
        </div>
      </div>

      {/* ── 1. FIND AN AUTHOR SEARCH BOX ───────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 dark:border-border p-5 sm:p-6 space-y-4 bg-white dark:bg-card/50 shadow-2xs">
        <h3 className="text-sm font-bold text-foreground">Find an author</h3>

        {/* Search Input Bar */}
        <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card h-11 px-3.5 focus-within:border-teal-500 shadow-2xs transition-colors">
          <Search size={16} className="text-muted-foreground mr-2.5 shrink-0" />
          <input
            type="text"
            value={authorQuery}
            onChange={(e) => setAuthorQuery(e.target.value)}
            placeholder="Search author name..."
            className="w-full bg-transparent text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {authorQuery && (
            <button
              type="button"
              onClick={() => setAuthorQuery("")}
              className="text-muted-foreground hover:text-foreground cursor-pointer ml-1"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Matching Authors Section - only displayed when search query is entered */}
        {hasQuery && (
          <>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-bold text-foreground">
                {matchingAuthors.length} matching authors found
              </span>
              <span className="text-muted-foreground">Click to add</span>
            </div>

            {matchingAuthors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {matchingAuthors.map((author) => {
                  const isSelected = selectedAuthors.some((sa) => sa.name === author.name);

                  return (
                    <div
                      key={author.id}
                      onClick={() => handleToggleAuthor(author)}
                      className={`rounded-xl border p-3 flex items-center gap-3 cursor-pointer transition-all shadow-2xs ${
                        isSelected
                          ? "border-slate-300 dark:border-border bg-slate-50/80 dark:bg-secondary/40"
                          : "border-slate-200 dark:border-border bg-white dark:bg-card hover:border-teal-400 hover:bg-slate-50/40 dark:hover:bg-secondary/20"
                      }`}
                    >
                      {author.avatar ? (
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="h-9 w-9 rounded-full object-cover shrink-0 ring-1 ring-border"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-secondary flex items-center justify-center text-xs font-bold text-slate-700 dark:text-foreground shrink-0 border border-slate-200/60 dark:border-border">
                          {initials(author.name)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-foreground truncate">{author.name}</h4>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <BookOpen size={11} className="text-muted-foreground shrink-0" />
                          <span>{author.books} Books</span>
                        </p>
                      </div>

                      {isSelected && (
                        <Check size={14} className="text-slate-600 dark:text-slate-300 shrink-0 ml-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 dark:border-border p-4 text-center text-xs text-muted-foreground">
                No matching authors found for &quot;{authorQuery}&quot;.
              </div>
            )}

            {/* Bottom Bar: Can't find them? Add as new */}
            <div className="rounded-xl border border-slate-200/80 dark:border-border bg-slate-50/70 dark:bg-secondary/30 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                Can&apos;t find them? Add &quot;{authorQuery}&quot; as a new author.
              </span>
              <button
                type="button"
                onClick={handleAddNewAuthor}
                className="h-9 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
              >
                Add as new
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── 2. SELECTED AUTHORS LIST ───────────────────────────────────── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-muted-foreground">
            SELECTED AUTHORS
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-foreground">
            {selectedAuthors.length} added
          </span>
        </div>

        {selectedAuthors.length === 0 ? (
          <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-border px-4 py-8 text-center">
            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <UserRound size={20} />
            </span>
            <p className="text-lg font-semibold text-foreground">No authors yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use the search above to link existing authors or create new ones.
            </p>
          </div>
        ) : (
          selectedAuthors.map((author) => (
            <div
              key={author.id}
              className="rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card p-5 space-y-4 shadow-2xs"
            >
              {/* Top Row: Avatar with Edit Badge, Name, Books & Remove Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {author.avatar ? (
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-secondary text-xs font-bold text-slate-700 dark:text-foreground border border-slate-200/60 dark:border-border">
                        {initials(author.name)}
                      </div>
                    )}
                    {/* Small edit pencil badge */}
                    <div className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-slate-300 dark:border-border bg-white dark:bg-card shadow-xs">
                      <Pencil size={9} className="text-slate-600 dark:text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-foreground">{author.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <BookOpen size={11} className="text-muted-foreground shrink-0" />
                      <span>{author.books} Books</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveAuthor(author.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} className="text-rose-600" />
                  <span>Remove</span>
                </button>
              </div>

              {/* Author Profile URL Input Group */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-foreground">
                  Author Profile URL <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="flex items-center h-10 rounded-xl border border-slate-200 dark:border-border overflow-hidden bg-slate-50/70 dark:bg-secondary/40 focus-within:border-teal-500 transition-colors shadow-2xs">
                  <div className="h-full px-3.5 border-r border-slate-200 dark:border-border bg-slate-100/60 dark:bg-secondary/60 text-xs text-muted-foreground select-none whitespace-nowrap flex items-center font-mono">
                    {domainPrefix}
                  </div>
                  <input
                    type="text"
                    value={author.profileSlug}
                    onChange={(e) => handleSlugChange(author.id, e.target.value)}
                    placeholder={slugify(author.name)}
                    className="h-full flex-1 px-3 bg-white dark:bg-card text-xs font-semibold text-foreground outline-none font-mono"
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">The URL is available</p>
              </div>

              {/* Optional: Complete Publisher Commercial Royalty Share & Role */}
              {isCompletePublisher && (
                <div className="flex items-center gap-3 pt-1 border-t border-slate-100 dark:border-border/60">
                  <div className="w-36">
                    <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                      Contributor Role
                    </label>
                    <select
                      value={author.role || "Lead Author"}
                      onChange={(e) => handleRoleChange(author.id, e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 dark:border-border bg-white dark:bg-card px-2.5 text-xs font-medium text-foreground outline-none"
                    >
                      <option value="Lead Author">Lead Author</option>
                      <option value="Co-Author">Co-Author</option>
                      <option value="Editor">Editor</option>
                      <option value="Illustrator">Illustrator</option>
                      <option value="Translator">Translator</option>
                    </select>
                  </div>

                  <div className="w-32">
                    <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                      Commercial Royalty
                    </label>
                    <div className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-border bg-white dark:bg-card px-2.5">
                      <Percent size={12} className="text-muted-foreground" />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={author.royaltyPercentage ?? 50}
                        onChange={(e) => handleRoyaltyChange(author.id, Number(e.target.value) || 0)}
                        className="w-10 text-xs font-bold text-foreground bg-transparent outline-none"
                      />
                      <span className="text-[10px] text-muted-foreground font-semibold">%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
