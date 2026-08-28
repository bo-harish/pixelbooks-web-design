import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  X,
  Search,
  UserRound,
  Copy as CopyIcon,
  Pencil,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  List,
  HardDrive,
  Info,
  Tag,
  Check as CheckIcon,
  CheckCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { seedBooks } from "@/lib/catalogue-data";

export const Route = createFileRoute("/pb-admin/titles/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    edit: (search.edit as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Add New eBook — PixelBooks" },
      {
        name: "description",
        content: "Upload your eBook, cover, and details to publish a new title on PixelBooks.",
      },
    ],
  }),
  component: AddEBookPage,
});

/* -------------------------------------------------------------------------- */
/*  Shared UI primitives                                                       */
/* -------------------------------------------------------------------------- */

function SectionCard({
  title,
  description,
  right,
  children,
}: {
  title?: string;
  description?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-7">
      {(title || right) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-[15px] font-semibold">{title}</h2>}
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

function AutoDetectedBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: "color-mix(in oklab, var(--brand) 12%, transparent)",
        color: "var(--brand)",
      }}
    >
      <Sparkles size={12} />
      Auto-detected
    </span>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-[11px] font-medium text-rose-500">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] ${className}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] ${className}`}
    />
  );
}

function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode },
) {
  const { className = "", children, ...rest } = props;
  return (
    <div className="relative">
      <select
        {...rest}
        className={`h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)] ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
  className = "",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex cursor-pointer items-center gap-2 text-sm ${className}`}>
      <span
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors"
        style={{
          backgroundColor: checked ? "var(--brand)" : "transparent",
          borderColor: checked ? "var(--brand)" : "var(--border)",
        }}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
            <path
              d="M2.5 6.5L5 9L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label && <span>{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      style={{ backgroundColor: checked ? "var(--brand)" : "var(--border)" }}
    >
      <span
        className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: `translateX(${checked ? 22 : 2}px)` }}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Upload row                                                        */
/* -------------------------------------------------------------------------- */

function UploadTile({
  title,
  hint,
  ctaLabel,
  icon,
  extra,
}: {
  title: string;
  hint: string;
  ctaLabel: string;
  icon: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-between rounded-xl border border-dashed border-border bg-secondary/30 p-5 text-center">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-background text-muted-foreground">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        </div>
        {extra}
      </div>
      <button
        type="button"
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-sm font-medium transition-colors hover:bg-secondary"
      >
        <Upload size={15} />
        {ctaLabel}
      </button>
    </div>
  );
}

function UploadRow() {
  const [autofill, setAutofill] = useState(true);

  return (
    <SectionCard>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="mb-2 text-sm font-semibold">Upload Your eBook</p>
          <UploadTile
            title="Your eBook"
            hint="Maximum file size 10 MB"
            ctaLabel="Upload ePUB or PDF"
            icon={<BookOpen size={22} />}
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Upload Free Sample</p>
          <UploadTile
            title="Your eBook free sample"
            hint="Maximum file size 10 MB"
            ctaLabel="Upload ePUB or PDF"
            icon={<BookOpen size={22} />}
            extra={
              <>
                <button
                  type="button"
                  className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold"
                  style={{
                    backgroundColor: "color-mix(in oklab, var(--brand) 14%, transparent)",
                    color: "var(--brand)",
                  }}
                >
                  <Sparkles size={12} /> Generate Sample from Source
                </button>
                <span className="text-[11px] text-muted-foreground">Or</span>
              </>
            }
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Upload Cover Image</p>
          <UploadTile
            title="Cover Image"
            hint="438 × 678 pixels for 2x scale. Maximum file size 5 MB."
            ctaLabel="Upload Cover Image (JPEG or PNG)"
            icon={<ImageIcon size={22} />}
          />
        </div>
      </div>

      <div
        className="mt-11 flex items-start gap-3 rounded-lg border p-3.5 text-[13px]"
        style={{
          borderColor: "color-mix(in oklab, var(--destructive) 40%, transparent)",
          backgroundColor: "color-mix(in oklab, var(--destructive) 6%, transparent)",
          color: "color-mix(in oklab, var(--destructive) 85%, var(--foreground))",
        }}
      >
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          PixelBooks&apos; auto content generation API uses automated parsing to extract and
          autofill metadata from your eBook files (ePub &amp; PDF). Because automated extraction is
          inherently subject to inaccuracies, some data may be incomplete, malformatted, or
          incorrectly assigned depending on the structure and quality of the source file. You are
          solely responsible for reviewing and verifying all auto-populated information. Please
          ensure that all generated metadata is manually reviewed and verified before publishing. If
          you prefer, you may disable this option and enter all details manually.
        </p>
      </div>

      <Check
        checked={autofill}
        onChange={setAutofill}
        label={<span className="font-medium">Autofill metadata from eBook</span>}
        className="mt-5"
      />
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Guidelines                                                        */
/* -------------------------------------------------------------------------- */

const GUIDELINES = [
  {
    icon: <FileText size={18} />,
    title: "File Format",
    description: "Upload your eBook in PDF, ePUB format, ensuring DRM protection for security.",
  },
  {
    icon: <List size={18} />,
    title: "Formatting",
    description:
      "Maintain clarity with distinct chapter breaks and headings for seamless navigation.",
  },
  {
    icon: <ImageIcon size={18} />,
    title: "Cover Image",
    description:
      "Capture reader's attention with an enticing cover image (minimum 600 × 800 pixels).",
  },
  {
    icon: <HardDrive size={18} />,
    title: "Size Limit",
    description: "Keep file sizes under 30 MB to ensure smooth downloading.",
  },
  {
    icon: <Info size={18} />,
    title: "Metadata",
    description:
      "Provide essential book details such as title, author, genre, and additional information.",
  },
  {
    icon: <Tag size={18} />,
    title: "Pricing",
    description:
      "Choose between free or paid options, set competitive prices, and specify tax rates.",
  },
  {
    icon: <CheckCircle size={18} />,
    title: "Review and Publish",
    description:
      'Take a final look and ensure everything is in order before hitting "Submit eBook."',
  },
];

function GuidelinesSection() {
  const [open, setOpen] = useState(false);
  return (
    <SectionCard>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-semibold"
      >
        <span className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              backgroundColor: "color-mix(in oklab, var(--brand) 14%, transparent)",
              color: "var(--brand)",
            }}
          >
            <BookOpen size={16} />
          </span>
          Instructions & Guidelines
        </span>
        <span className="text-muted-foreground">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDELINES.map((g, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-border bg-secondary/30 p-4">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--brand) 12%, transparent)",
                  color: "var(--brand)",
                }}
              >
                {g.icon}
              </span>
              <div>
                <p className="text-sm font-semibold">{g.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {g.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: eBook Details                                                     */
/* -------------------------------------------------------------------------- */

function EBookDetailsSection() {
  const [tags, setTags] = useState<string[]>([
    "Promised Land 2024",
    "Barack Obama",
    "Barack Obama",
  ]);
  const [tagInput, setTagInput] = useState("");

  const removeTag = (i: number) => setTags((t) => t.filter((_, idx) => idx !== i));
  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    setTags((t) => [...t, v]);
    setTagInput("");
  };

  return (
    <SectionCard title="eBook Details" right={<AutoDetectedBadge />}>
      <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
        <Field label="Enter eBook Name" required>
          <TextInput defaultValue="Harry Potter" />
        </Field>
        <Field label="Enter ISBN-10 or 13" required>
          <TextInput defaultValue="25455955" />
        </Field>
        <Field label="Regional Name">
          <TextInput defaultValue="Harry Potter" />
        </Field>
        <Field label="Language" required>
          <SelectInput defaultValue="English">
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
            <option>French</option>
          </SelectInput>
        </Field>
        <Field label="Date of Publication">
          <TextInput defaultValue="Harry Potter" />
        </Field>
        <Field label="eBook Size (in MB)">
          <TextInput defaultValue="25.4" placeholder="e.g. 25.4" />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Summary">
          <Textarea rows={4} defaultValue="Arun m" />
        </Field>
      </div>

      <div className="mt-4">
        <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Tags</span>
        <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
          {tags.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: "color-mix(in oklab, var(--brand) 12%, transparent)",
                color: "var(--brand)",
              }}
            >
              {t}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="opacity-70 hover:opacity-100"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag"
            className="min-w-[120px] flex-1 border-none bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Press Enter or Comma to tag</span>
          <span>Maximum 5 keywords</span>
        </div>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Authors                                                           */
/* -------------------------------------------------------------------------- */

type AuthorMatch = {
  id: string;
  name: string;
  books: number;
  avatar?: string;
};

type SelectedAuthor = {
  id: string;
  sourceId?: string;
  name: string;
  books: number;
  avatar?: string;
  addAsNew: boolean;
  profileSlug: string;
};

const AUTHOR_DIRECTORY: AuthorMatch[] = [
  { id: "a-1", name: "Mark Twain", books: 3 },
  { id: "a-2", name: "Arun", books: 0 },
  { id: "a-3", name: "Arundhati Roy", books: 30, avatar: "https://i.pravatar.cc/80?img=47" },
  { id: "a-4", name: "Charles Dickens", books: 4 },
  { id: "a-5", name: "Haruki Murakami", books: 4 },
];

const AUTHOR_BOOK_LISTS: Record<string, string[]> = {
  "Arundhati Roy": [
    "The God of Small Things",
    "The Ministry of Utmost Happiness",
    "Capitalism: A Ghost Story",
    "Walking with the Comrades",
    "My Seditious Heart",
  ],
  "Mark Twain": [
    "The Adventures of Tom Sawyer",
    "Adventures of Huckleberry Finn",
    "A Connecticut Yankee in King Arthur's Court",
  ],
  "Charles Dickens": [
    "Great Expectations",
    "A Tale of Two Cities",
    "Oliver Twist",
    "David Copperfield",
  ],
  "Haruki Murakami": ["Kafka on the Shore", "Norwegian Wood", "1Q84", "The Wind-Up Bird Chronicle"],
};

const TAKEN_AUTHOR_SLUGS = new Set(["mark-twain"]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

function AuthorSearchResultCard({
  match,
  onAdd,
  isSelected,
}: {
  match: AuthorMatch;
  onAdd: () => void;
  isSelected: boolean;
}) {
  const [showBooksPopup, setShowBooksPopup] = useState(false);
  const booksPopupRef = useRef<HTMLDivElement | null>(null);
  const books = AUTHOR_BOOK_LISTS[match.name] ?? [];

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!booksPopupRef.current) return;
      if (!booksPopupRef.current.contains(event.target as Node)) {
        setShowBooksPopup(false);
      }
    };
    if (showBooksPopup) {
      document.addEventListener("mousedown", onOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
    };
  }, [showBooksPopup]);

  return (
    <div
      onClick={() => {
        if (!isSelected) {
          onAdd();
        }
      }}
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${isSelected
        ? "cursor-default border-border/70 bg-secondary/30 text-muted-foreground"
        : "border-border bg-background hover:bg-secondary/50 cursor-pointer"
        }`}
    >
      {match.avatar ? (
        <img
          src={match.avatar}
          alt={match.name}
          className={`h-8 w-8 shrink-0 rounded-full object-cover ${isSelected ? "opacity-70" : ""}`}
        />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-muted-foreground">
          {initials(match.name)}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-sm font-semibold ${isSelected ? "text-muted-foreground" : ""}`}
        >
          {match.name}
        </span>
        <div
          ref={booksPopupRef}
          className="relative mt-0.5"
          onMouseEnter={() => {
            if (match.books > 0) setShowBooksPopup(true);
          }}
          onMouseLeave={() => setShowBooksPopup(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (match.books > 0) setShowBooksPopup((v) => !v);
            }}
            className={`inline-flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer ${match.books > 0 ? "hover:text-foreground" : ""
              }`}
          >
            <BookOpen size={11} />
            <span className={match.books > 0 ? "underline-offset-2 hover:underline" : ""}>
              {match.books} Books
            </span>
          </button>

          {showBooksPopup && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-[calc(100%+6px)] z-30 w-[260px] overflow-hidden rounded-lg border border-border bg-card shadow-lg cursor-default text-foreground"
            >
              <div className="border-b border-border px-3 py-2">
                <p className="text-sm font-semibold">Books by {match.name}</p>
                <p className="text-xs text-muted-foreground">{match.books} total</p>
              </div>
              <ul className="max-h-56 overflow-y-auto">
                {books.map((title) => (
                  <li key={title} className="border-t border-border first:border-t-0">
                    <div className="flex items-center gap-2 px-3 py-2.5 text-sm">
                      <BookOpen size={13} className="text-muted-foreground" />
                      <span>{title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </span>
      {isSelected && (
        <span className="ml-auto text-muted-foreground shrink-0" aria-label="Selected author">
          <CheckIcon size={14} />
        </span>
      )}
    </div>
  );
}

function SelectedAuthorCard({
  author,
  onChange,
  onRemove,
  unavailable,
}: {
  author: SelectedAuthor;
  onChange: (next: SelectedAuthor) => void;
  onRemove: () => void;
  unavailable: boolean;
}) {
  const [showBooksPopup, setShowBooksPopup] = useState(false);
  const booksPopupRef = useRef<HTMLDivElement | null>(null);
  const books = AUTHOR_BOOK_LISTS[author.name] ?? [];

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!booksPopupRef.current) return;
      if (!booksPopupRef.current.contains(event.target as Node)) {
        setShowBooksPopup(false);
      }
    };

    if (showBooksPopup) {
      document.addEventListener("mousedown", onOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
    };
  }, [showBooksPopup]);

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="group relative cursor-pointer">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-muted-foreground">
                {initials(author.name)}
              </span>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
              <Pencil size={11} />
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const preview = URL.createObjectURL(file);
                onChange({ ...author, avatar: preview });
              }}
            />
          </label>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold">{author.name}</p>
            </div>
            <div
              ref={booksPopupRef}
              className="relative mt-0.5"
              onMouseEnter={() => {
                if (author.books > 0) setShowBooksPopup(true);
              }}
              onMouseLeave={() => setShowBooksPopup(false)}
            >
              <button
                type="button"
                onClick={() => {
                  if (author.books > 0) setShowBooksPopup((v) => !v);
                }}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <BookOpen size={11} />
                <span className="underline-offset-2 hover:underline">{author.books} Books</span>
              </button>

              {showBooksPopup && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-[280px] overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                  <div className="border-b border-border px-3 py-2">
                    <p className="text-sm font-semibold">Books by {author.name}</p>
                    <p className="text-xs text-muted-foreground">{author.books} total</p>
                  </div>

                  {books.length > 0 ? (
                    <ul className="max-h-64 overflow-y-auto">
                      {books.map((title) => (
                        <li key={title} className="border-t border-border first:border-t-0">
                          <div className="flex items-center gap-2 px-3 py-2.5 text-sm">
                            <BookOpen size={13} className="text-muted-foreground" />
                            <span>{title}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-3 py-3 text-sm text-muted-foreground">
                      No books available for this author.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 hover:underline cursor-pointer"
        >
          <Trash2 size={14} />
          Remove
        </button>
      </div>

      <div className="mt-3">
        <Field
          label="Author Profile URL"
          required
          error={
            unavailable ? "This URL is already in use. Please try a different one." : undefined
          }
          hint={!unavailable ? "The URL is available" : undefined}
        >
          <div className="flex overflow-hidden rounded-lg border border-border bg-background">
            <span className="flex items-center bg-secondary/60 px-3 text-xs text-muted-foreground">
              https://azdevlibcustomer.pixelbooksapp.com/author/
            </span>
            <input
              value={author.profileSlug}
              onChange={(e) => onChange({ ...author, profileSlug: slugify(e.target.value) })}
              className="h-11 flex-1 bg-background px-3 text-sm outline-none"
            />
          </div>
        </Field>
      </div>
    </div>
  );
}

function AuthorsSection() {
  const [query, setQuery] = useState("");
  const [selectedAuthors, setSelectedAuthors] = useState<SelectedAuthor[]>([]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return AUTHOR_DIRECTORY.filter((a) => a.name.toLowerCase().includes(q));
  }, [query]);

  const addDirectoryAuthor = (author: AuthorMatch) => {
    setSelectedAuthors((prev) => {
      if (prev.some((x) => x.sourceId === author.id)) return prev;
      return [
        ...prev,
        {
          id: `sa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          sourceId: author.id,
          name: author.name,
          books: author.books,
          avatar: author.avatar,
          addAsNew: false,
          profileSlug: slugify(author.name),
        },
      ];
    });
  };

  const addAsNewFromQuery = () => {
    const name = query.trim();
    if (!name) return;
    setSelectedAuthors((prev) => [
      ...prev,
      {
        id: `sa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        books: 0,
        addAsNew: true,
        profileSlug: slugify(name),
      },
    ]);
  };

  const slugCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    selectedAuthors.forEach((author) => {
      const key = author.profileSlug.trim().toLowerCase();
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [selectedAuthors]);

  const hasQuery = query.trim().length > 0;
  const selectedSourceIds = useMemo(
    () => new Set(selectedAuthors.map((author) => author.sourceId).filter(Boolean)),
    [selectedAuthors],
  );

  return (
    <SectionCard
      title="Author(s) Details"
      description="Search the author directory for the best matching author. If no suitable match is found, create a new author."
    >
      <div className="rounded-xl border border-border p-4">
        <p className="text-sm font-semibold">Find an author</p>

        <div className="relative mt-2">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
            className="h-11 pl-10 pr-10"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {hasQuery && (
          <>
            <div className="mt-3 flex items-center justify-between text-[12px]">
              <span className="font-medium">{matches.length} matching authors found</span>
              <span className="text-muted-foreground">Click to add</span>
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {matches.map((match) => (
                <AuthorSearchResultCard
                  key={match.id}
                  match={match}
                  isSelected={selectedSourceIds.has(match.id)}
                  onAdd={() => addDirectoryAuthor(match)}
                />
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary/40 px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">
                Can&apos;t find them? Add &quot;{query || "author"}&quot; as a new author.
              </span>
              <button
                type="button"
                onClick={addAsNewFromQuery}
                className="inline-flex h-9 items-center rounded-lg border px-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#008585", borderColor: "#008585" }}
              >
                Add as new
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Selected authors
          </h3>
          <span className="text-xs font-semibold text-muted-foreground">
            {selectedAuthors.length} added
          </span>
        </div>

        {selectedAuthors.length === 0 ? (
          <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-border px-4 py-8 text-center">
            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <UserRound size={20} />
            </span>
            <p className="text-lg font-semibold">No authors yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use the search above to link existing authors or create new ones.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedAuthors.map((author) => {
              const slug = author.profileSlug.trim().toLowerCase();
              const duplicate = slug ? (slugCounts[slug] || 0) > 1 : false;
              const unavailable = duplicate || TAKEN_AUTHOR_SLUGS.has(slug);

              return (
                <SelectedAuthorCard
                  key={author.id}
                  author={author}
                  unavailable={unavailable}
                  onChange={(next) =>
                    setSelectedAuthors((prev) =>
                      prev.map((item) => (item.id === author.id ? next : item)),
                    )
                  }
                  onRemove={() =>
                    setSelectedAuthors((prev) => prev.filter((item) => item.id !== author.id))
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Book URL                                                          */
/* -------------------------------------------------------------------------- */

function BookUrlSection() {
  return (
    <SectionCard
      title="Add Book URL"
      description="Set a unique URL that readers can use to access this book directly."
    >
      <Field label="Select Primary Author">
        <SelectInput defaultValue="Barack Obama">
          <option>Barack Obama</option>
          <option>Anya Ramanathan</option>
        </SelectInput>
      </Field>

      <div className="mt-4">
        <Field label="Book URL" error="This URL is already in use. Please try a different one.">
          <div className="flex gap-2">
            <div className="flex flex-1 overflow-hidden rounded-lg border border-border bg-background">
              <span className="flex items-center bg-secondary/60 px-3 text-xs text-muted-foreground">
                https://pixelbooks.com/author/author-name/
              </span>
              <input
                defaultValue="harry-potter"
                className="h-11 flex-1 bg-background px-3 text-sm outline-none"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-secondary"
            >
              <CopyIcon size={14} /> Copy
            </button>
          </div>
        </Field>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Categories                                                        */
/* -------------------------------------------------------------------------- */

function CategoriesSection() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({
    "Academic & Educational": [],
    Articles: [],
    Autobiography: [],
  });
  const groups = Object.entries(selected).map(([name, subs]) => ({ name, subs }));
  return (
    <SectionCard title="Selected Categories">
      <ul className="space-y-3 text-sm">
        {groups.map((g) => (
          <li key={g.name}>
            <div className="flex items-center gap-2 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              {g.name}
            </div>
            {g.subs.length > 0 && (
              <ul className="mt-1 space-y-1 pl-6 text-muted-foreground">
                {g.subs.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold"
        style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
      >
        <Pencil size={14} /> Edit Category
      </button>
      {open && (
        <CategoryDialog
          initial={selected}
          onClose={() => setOpen(false)}
          onSave={(next) => {
            setSelected(next);
            setOpen(false);
          }}
        />
      )}
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  eBook Category Dialog                                                      */
/* -------------------------------------------------------------------------- */

const CATEGORY_DATA: Record<string, string[]> = {
  "Academic & Educational": ["Textbooks", "Research Papers", "Study Guides", "Reference"],
  Articles: ["News", "Opinion", "Analysis"],
  Autobiography: [],
  Biography: ["Historical", "Contemporary", "Political"],
  "Children's Literature": ["Picture Books", "Early Readers", "Middle Grade"],
  Cinema: ["Screenplays", "Film Theory", "Reviews"],
  "Cooking & Food": ["Recipes", "Nutrition", "Baking"],
  Fiction: ["Fantasy", "Sci-Fi", "Mystery", "Romance", "Thriller"],
  History: ["Ancient", "Modern", "Military", "Cultural"],
  "Self-Help": ["Productivity", "Mindfulness", "Career"],
};

function CategoryDialog({
  initial,
  onClose,
  onSave,
}: {
  initial: Record<string, string[]>;
  onClose: () => void;
  onSave: (next: Record<string, string[]>) => void;
}) {
  const mains = Object.keys(CATEGORY_DATA);
  const [selected, setSelected] = useState<Record<string, string[]>>(initial);
  const [active, setActive] = useState<string>(Object.keys(initial)[0] ?? mains[0]);

  const toggleMain = (name: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (name in next) delete next[name];
      else next[name] = [];
      return next;
    });
    setActive(name);
  };

  const toggleSub = (main: string, sub: string) => {
    setSelected((prev) => {
      const current = prev[main] ?? [];
      const has = current.includes(sub);
      return {
        ...prev,
        [main]: has ? current.filter((s) => s !== sub) : [...current, sub],
      };
    });
  };

  const activeSubs = CATEGORY_DATA[active] ?? [];
  const activeSelected = selected[active] ?? [];
  const isMainSelected = (name: string) => name in selected;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[85vh] max-h-[720px] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-xl font-semibold">eBook Category</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[minmax(240px,1fr)_minmax(280px,1.4fr)_minmax(260px,1fr)]">
          {/* Main categories */}
          <div className="flex flex-col overflow-hidden border-r border-border">
            <div className="flex h-12 items-center border-b border-border bg-secondary/40 px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Main Category
            </div>
            <ul className="flex-1 overflow-y-auto">
              {mains.map((name) => {
                const checked = isMainSelected(name);
                const isActive = active === name;
                const count = (selected[name] ?? []).length;
                return (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => setActive(name)}
                      className={`flex w-full items-center gap-3 border-b border-border/60 px-5 py-3 text-left text-sm transition-colors ${isActive ? "bg-secondary/60" : "hover:bg-secondary/30"
                        }`}
                    >
                      <span
                        role="checkbox"
                        aria-checked={checked}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMain(name);
                        }}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${checked ? "border-transparent" : "border-border bg-background"
                          }`}
                        style={
                          checked
                            ? { backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }
                            : undefined
                        }
                      >
                        {checked && <CheckCircle2 size={12} strokeWidth={3} />}
                      </span>
                      <span className={`flex-1 truncate ${checked ? "font-semibold" : ""}`}>
                        {name}
                      </span>
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-xs font-medium text-muted-foreground">
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Subcategories */}
          <div className="flex flex-col overflow-hidden border-r border-border">
            <div className="flex h-12 items-center border-b border-border px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {active} ({activeSubs.length} Subcategories)
            </div>
            <ul className="flex-1 overflow-y-auto">
              {activeSubs.length === 0 && (
                <li className="px-5 py-6 text-sm text-muted-foreground">
                  No subcategories available.
                </li>
              )}
              {activeSubs.map((sub) => {
                const checked = activeSelected.includes(sub);
                const enabled = isMainSelected(active);
                return (
                  <li key={sub}>
                    <button
                      type="button"
                      disabled={!enabled}
                      onClick={() => toggleSub(active, sub)}
                      className="flex w-full items-center gap-3 border-b border-border/60 px-5 py-3 text-left text-sm transition-colors hover:bg-secondary/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${checked ? "border-transparent" : "border-border bg-background"
                          }`}
                        style={
                          checked
                            ? { backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }
                            : undefined
                        }
                      >
                        {checked && <CheckCircle2 size={12} strokeWidth={3} />}
                      </span>
                      <span className={`flex-1 ${checked ? "font-semibold" : ""}`}>{sub}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Selected */}
          <div className="flex flex-col overflow-hidden">
            <div className="flex h-12 items-center justify-between border-b border-border px-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Selected Categories
              </span>
              <button
                type="button"
                onClick={() => setSelected({})}
                className="rounded-full border border-rose-400 px-3 py-1 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50"
              >
                Clear All
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {Object.keys(selected).length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories selected.</p>
              ) : (
                <ul className="space-y-0">
                  {Object.entries(selected).map(([name, subs]) => (
                    <li key={name} className="border-b border-border/70 py-3 last:border-b-0">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                        {name}
                      </div>
                      {subs.length > 0 && (
                        <ul className="mt-1.5 space-y-1 pl-5 text-sm text-muted-foreground">
                          {subs.map((s) => (
                            <li key={s} className="flex items-center gap-2">
                              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(selected)}
            className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Payment                                                           */
/* -------------------------------------------------------------------------- */

function Radio({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <span
        onClick={onChange}
        className="flex h-4 w-4 items-center justify-center rounded-full border"
        style={{ borderColor: checked ? "var(--brand)" : "var(--border)" }}
      >
        {checked && (
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
        )}
      </span>
      {label}
    </label>
  );
}

function PaymentSection() {
  const [pricing, setPricing] = useState<"free" | "paid">("paid");
  const [gstConfirm, setGstConfirm] = useState(true);

  return (
    <SectionCard title="Payment Details">
      <div className="space-y-4">
        <div>
          <span className="mb-2 block text-xs font-medium text-muted-foreground">
            Choose Pricing
          </span>
          <div className="flex items-center gap-6">
            <Radio checked={pricing === "free"} onChange={() => setPricing("free")} label="Free" />
            <Radio checked={pricing === "paid"} onChange={() => setPricing("paid")} label="Paid" />
          </div>
        </div>

        <div className="max-w-[220px]">
          <Field label="Tax">
            <SelectInput defaultValue="5%">
              <option>0%</option>
              <option>5%</option>
              <option>12%</option>
              <option>18%</option>
            </SelectInput>
          </Field>
        </div>

        <div>
          <p className="text-sm font-semibold">Lifetime Purchase Renewal</p>
          <div className="mt-2 max-w-[220px]">
            <Field label="Percentage %">
              <TextInput defaultValue="12" />
            </Field>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Price Details                                                     */
/* -------------------------------------------------------------------------- */

function PriceDetailsSection() {
  const [unitEx, setUnitEx] = useState(180);
  const [unitInc, setUnitInc] = useState(180);
  const [offer, setOffer] = useState(180);
  const selling = useMemo(() => (offer * 0.5883).toFixed(2), [offer]);

  return (
    <SectionCard title="Price Details">
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Unit Price (excl.GST)" required>
          <TextInput
            value={unitEx}
            onChange={(e) => setUnitEx(Number(e.target.value) || 0)}
            className="text-right"
          />
        </Field>
        <Field label="Unit Price (incl.GST)" required>
          <TextInput
            value={unitInc}
            onChange={(e) => setUnitInc(Number(e.target.value) || 0)}
            className="text-right"
          />
        </Field>
        <Field label="Offer Price (excl.GST) if Any">
          <TextInput
            value={offer}
            onChange={(e) => setOffer(Number(e.target.value) || 0)}
            className="text-right"
          />
        </Field>
      </div>
      <div
        className="mt-4 flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium"
        style={{ backgroundColor: "var(--secondary)" }}
      >
        <span>Selling Price including GST</span>
        <span>
          <span className="text-base font-bold" style={{ color: "var(--brand)" }}>
            ₹{selling}
          </span>{" "}
          <span className="text-xs text-muted-foreground line-through">₹{unitInc}.95</span>
        </span>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Add / Edit Rental Dialog                                                   */
/* -------------------------------------------------------------------------- */

type RentalEntry = { id: string; year: string; days: string; unit: number; offer: number };

const YEAR_OPTIONS = ["1 Year", "2 Year", "3 Year", "4 Year", "5 Year"];
const DAYS_OPTIONS = ["7 Days", "14 Days", "30 Days", "60 Days", "90 Days", "180 Days", "365 Days"];
const RENTAL_PAGE_SIZE = 5;

function calcSelling(unit: number, offer: number) {
  return parseFloat(((offer > 0 ? offer : unit) * 1.05).toFixed(2));
}

function RentalDialog({
  entries,
  onClose,
  onSave,
}: {
  entries: RentalEntry[];
  onClose: () => void;
  onSave: (rows: RentalEntry[]) => void;
}) {
  const [rows, setRows] = useState<RentalEntry[]>(entries);
  const [year, setYear] = useState("");
  const [days, setDays] = useState("");
  const [unit, setUnit] = useState("");
  const [offer, setOffer] = useState("");
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / RENTAL_PAGE_SIZE));
  const paged = rows.slice((page - 1) * RENTAL_PAGE_SIZE, page * RENTAL_PAGE_SIZE);

  const handleAdd = () => {
    if (!unit) return;
    setRows((prev) => [
      ...prev,
      {
        id: `r${Date.now()}`,
        year: year || "1 Year",
        days: days || "30 Days",
        unit: parseFloat(unit) || 0,
        offer: parseFloat(offer) || 0,
      },
    ]);
    setYear("");
    setDays("");
    setUnit("");
    setOffer("");
    setPage(Math.max(1, Math.ceil((rows.length + 1) / RENTAL_PAGE_SIZE)));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-xl font-semibold">Add / Edit Rental</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Input row */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-end gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Year</label>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)]"
                >
                  <option value="">Select Year</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Days</label>
              <div className="relative">
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)]"
                >
                  <option value="">Select Days</option>
                  {DAYS_OPTIONS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Unit Price (excl. GST)
                <span className="ml-0.5 text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Unit Price (excl. GST)"
                className="h-14 w-full rounded-xl border border-border bg-card px-4 text-right text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Offer Price (excl. GST)
              </label>
              <input
                type="number"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="Offer Price (excl. GST)"
                className="h-14 w-full rounded-xl border border-border bg-card px-4 text-right text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-14 items-center justify-center gap-1.5 rounded-xl px-6 text-sm font-semibold shadow-2xs transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-border" />

          {/* Table */}
          <p className="mb-4 text-[15px] font-bold">Added Rental</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left text-[12px] font-medium text-muted-foreground">
                  <th className="px-5 py-3">Year</th>
                  <th className="px-5 py-3">Days</th>
                  <th className="px-5 py-3">Unit Price</th>
                  <th className="px-5 py-3">Offer Price</th>
                  <th className="px-5 py-3">Selling Price</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-6 text-center text-sm text-muted-foreground">
                      No rentals added yet.
                    </td>
                  </tr>
                )}
                {paged.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="px-5 py-3 font-medium">{r.year}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.days}</td>
                    <td className="px-5 py-3">₹{r.unit}</td>
                    <td className="px-5 py-3">₹{r.offer}</td>
                    <td className="px-5 py-3 font-semibold" style={{ color: "var(--brand)" }}>
                      ₹{calcSelling(r.unit, r.offer)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                        className="text-muted-foreground transition-colors hover:text-rose-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {rows.length === 0 ? 0 : (page - 1) * RENTAL_PAGE_SIZE + 1}
              {rows.length > 1 && `–${Math.min(page * RENTAL_PAGE_SIZE, rows.length)}`} from{" "}
              {rows.length} results
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-0.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40"
              >
                «&nbsp;Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors"
                  style={
                    p === page
                      ? {
                        backgroundColor: "color-mix(in oklab, var(--brand) 12%, transparent)",
                        color: "var(--brand)",
                      }
                      : undefined
                  }
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-0.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40"
              >
                Next&nbsp;»
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(rows);
              onClose();
            }}
            className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Rental                                                            */
/* -------------------------------------------------------------------------- */

function RentalSection() {
  const [enabled, setEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [entries, setEntries] = useState<RentalEntry[]>([
    { id: "r1", year: "2 Year", days: "60 Days", unit: 43, offer: 0 },
  ]);

  return (
    <SectionCard>
      <div className="mb-3 flex items-center gap-3">
        <p className="text-[15px] font-semibold">Rental</p>
        <Switch checked={enabled} onChange={setEnabled} />
      </div>
      {enabled && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-4">Year</th>
                  <th className="pb-3 pr-4">Days</th>
                  <th className="pb-3 pr-4">Unit Price</th>
                  <th className="pb-3 pr-4">Offer Price</th>
                  <th className="pb-3 pr-4">Selling Price</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {entries.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="py-3 pr-4 font-medium">{r.year}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{r.days}</td>
                    <td className="py-3 pr-4">₹{r.unit}.00</td>
                    <td className="py-3 pr-4">₹{r.offer}.00</td>
                    <td className="py-3 pr-4">
                      <span style={{ color: "var(--brand)" }} className="font-semibold">
                        ₹{calcSelling(r.unit, r.offer)}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setEntries((prev) => prev.filter((x) => x.id !== r.id))}
                        className="text-muted-foreground hover:text-rose-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            <Plus size={14} /> Add/Edit Rental
          </button>
        </>
      )}
      {dialogOpen && (
        <RentalDialog
          entries={entries}
          onClose={() => setDialogOpen(false)}
          onSave={(rows) => setEntries(rows)}
        />
      )}
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

function AddEBookPage() {
  const [submitted, setSubmitted] = useState(false);
  const search = Route.useSearch();
  const isEditMode = Boolean(search.edit);
  const targetBook = search.edit ? seedBooks.find((b) => b.id === search.edit) : null;

  return (
    <AppShell title={isEditMode ? "Edit eBook" : "Add eBook"}>
      <div className="p-4 md:p-8">
        {isEditMode && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs font-semibold text-amber-700 dark:text-amber-400 shadow-2xs">
            <span className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>Editing Draft eBook: <strong>{targetBook?.title ?? "Draft Title"}</strong></span>
            </span>
            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              Draft Mode
            </span>
          </div>
        )}

        <Link
          to="/pb-admin/titles"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} /> Back to Catalogue
        </Link>

        <div className="space-y-6 pb-6">
          <UploadRow />
          <GuidelinesSection />
          <EBookDetailsSection />
          <AuthorsSection />
          <BookUrlSection />
          <CategoriesSection />
          <PaymentSection />
          <PriceDetailsSection />
          <RentalSection />

          {submitted && (
            <div
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium"
              style={{
                backgroundColor: "color-mix(in oklab, var(--brand) 10%, transparent)",
                color: "var(--brand)",
              }}
            >
              <CheckCircle2 size={16} /> eBook submitted for review.
            </div>
          )}
        </div>

        <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-end gap-2 border-t border-border bg-background/90 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
          <Link
            to="/pb-admin/titles"
            className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-5 text-sm font-semibold hover:bg-secondary"
          >
            Cancel
          </Link>
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-5 text-sm font-semibold hover:bg-secondary"
          >
            Save as draft
          </button>
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="inline-flex h-11 items-center rounded-lg px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Submit eBook
          </button>
        </div>
      </div>
    </AppShell>
  );
}
