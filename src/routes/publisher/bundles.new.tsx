import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState, useEffect } from "react";
import { usePublisherType } from "@/hooks/use-publisher-type";
import {
  ArrowLeft,
  Check,
  Upload,
  X,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  Filter,
  ShoppingBag,
  Tag as TagIcon,
  List,
  ListOrdered,
  Store,
  BookOpen,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/publisher/bundles/new")({
  head: () => ({
    meta: [
      { title: "Add New Bundle — PixelBooks" },
      { name: "description", content: "Create a curated eBook bundle on a single intuitive page." },
    ],
  }),
  component: NewPublisherBundlePage,
});

const gradients = [
  "linear-gradient(135deg, #6366f1, #4f46e5)",
  "linear-gradient(135deg, #0ea5e9, #0284c7)",
  "linear-gradient(135deg, #10b981, #059669)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  "linear-gradient(135deg, #ec4899, #db2777)",
  "linear-gradient(135deg, #f43f5e, #be123c)",
  "linear-gradient(135deg, #14b8a6, #0d9488)",
];

type Ebook = {
  id: string;
  title: string;
  author: string;
  price: number;
  cover: string;
  initials: string;
  category: string;
};

const availableBooks: Ebook[] = [
  {
    id: "b1",
    title: "NEP 2020 - Policy Formulation",
    author: "Dr. Ashok Alex",
    price: 315,
    cover: gradients[0],
    initials: "NEP",
    category: "Education",
  },
  {
    id: "b2",
    title: "Knowledge for the Time",
    author: "John Timbs",
    price: 250,
    cover: gradients[1],
    initials: "KFT",
    category: "History",
  },
  {
    id: "b3",
    title: "The Curtiss Aviation Book",
    author: "Glenn Curtiss",
    price: 105,
    cover: gradients[2],
    initials: "AVI",
    category: "Aviation",
  },
  {
    id: "b4",
    title: "Essays on Art",
    author: "Clutton Brock",
    price: 525,
    cover: gradients[3],
    initials: "ART",
    category: "Arts",
  },
  {
    id: "b5",
    title: "The Elements of Style",
    author: "William Strunk Jr.",
    price: 210,
    cover: gradients[4],
    initials: "STY",
    category: "Literature",
  },
  {
    id: "b6",
    title: "Meditations",
    author: "Marcus Aurelius",
    price: 450,
    cover: gradients[5],
    initials: "MED",
    category: "Philosophy",
  },
  {
    id: "b7",
    title: "The Art of War",
    author: "Sun Tzu",
    price: 299,
    cover: gradients[0],
    initials: "WAR",
    category: "Philosophy",
  },
  {
    id: "b8",
    title: "The Republic",
    author: "Plato",
    price: 375,
    cover: gradients[1],
    initials: "REP",
    category: "Philosophy",
  },
];

const CATEGORIES = ["All", "Education", "History", "Aviation", "Arts", "Literature", "Philosophy"];



function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors focus-within:border-[var(--brand)]">
      {/* RTB Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-secondary/30 p-2 text-muted-foreground">
        <button
          type="button"
          onClick={() => onChange(value + " **bold text**")}
          className="rounded px-2 py-1 hover:bg-card hover:text-foreground text-xs font-bold transition-colors cursor-pointer"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => onChange(value + " *italic text*")}
          className="rounded px-2 py-1 hover:bg-card hover:text-foreground text-xs italic font-serif transition-colors cursor-pointer"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => onChange(value + " <u>underlined text</u>")}
          className="rounded px-2 py-1 hover:bg-card hover:text-foreground text-xs underline transition-colors cursor-pointer"
          title="Underline"
        >
          U
        </button>
        <div className="mx-1 h-4 w-px bg-border" />
        <button
          type="button"
          onClick={() => onChange(value + (value ? "\n- " : "- "))}
          className="rounded p-1.5 hover:bg-card hover:text-foreground text-xs transition-colors cursor-pointer"
          title="Bullet List"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={() => onChange(value + (value ? "\n1. " : "1. "))}
          className="rounded p-1.5 hover:bg-card hover:text-foreground text-xs transition-colors cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </button>
        <div className="mx-1 h-4 w-px bg-border" />
        <span className="ml-auto text-[10px] text-muted-foreground font-medium pr-1">
          Rich Text Editor (RTB)
        </span>
      </div>

      {/* RTB Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={placeholder || "Provide a comprehensive summary and key highlights for this eBook bundle..."}
        className="w-full bg-transparent p-3.5 text-sm text-foreground outline-none resize-y placeholder:text-muted-foreground"
      />
    </div>
  );
}

export function NewPublisherBundlePage() {
  const [publisherType] = usePublisherType();
  const navigate = useNavigate();

  useEffect(() => {
    if (publisherType === "Library-Only Publisher") {
      navigate({ to: "/publisher/catalogue", replace: true });
    }
  }, [publisherType, navigate]);

  if (publisherType === "Library-Only Publisher") {
    return null;
  }

  // Form State
  const [title, setTitle] = useState("");
  const [bundleSummary, setBundleSummary] = useState(
    "A comprehensive curated bundle featuring key reference titles for higher education and policy studies."
  );
  const [pricing, setPricing] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tags
  const [tags, setTags] = useState<string[]>(["Education", "Research"]);
  const [tagInput, setTagInput] = useState("");

  // Selection & Filter State
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>(["b1", "b2"]);

  const filteredBooks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return availableBooks.filter((b) => {
      const matchesQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === "All" || b.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  const selectedBooks = useMemo(
    () => availableBooks.filter((b) => selectedIds.includes(b.id)),
    [selectedIds]
  );

  const totalPrice = useMemo(
    () => selectedBooks.reduce((sum, b) => sum + b.price, 0),
    [selectedBooks]
  );

  const finalPrice = pricing !== "" ? parseFloat(pricing) : totalPrice;
  const discountAmount = totalPrice > finalPrice ? totalPrice - finalPrice : 0;
  const discountPercent =
    totalPrice > 0 && finalPrice < totalPrice
      ? Math.round(((totalPrice - finalPrice) / totalPrice) * 100)
      : 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const newIds = new Set([...selectedIds, ...filteredBooks.map((b) => b.id)]);
    setSelectedIds(Array.from(newIds));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && tags.length < 3 && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleCreate = () => {
    navigate({ to: "/publisher/bundles" });
  };

  const isValid = title.trim().length > 0 && selectedIds.length > 0;

  return (
    <AppShell title="Create eBook Bundle" subtitle="Configure bundle details, select included titles, and publish instantly.">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        {/* Back Link & Top Bar Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/publisher/bundles"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Back to eBook Bundles"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal text-foreground">Back to eBook Bundles</span>
              </div>
            </div>
          </div>
        </div>

        {/* FULL WIDTH BOX 1: Bundle Information */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--sidebar-highlight)] text-[var(--brand)] font-bold text-xs">
                1
              </span>
              <h2 className="text-base font-semibold text-foreground">Bundle Information</h2>
            </div>
            <span className="text-xs text-muted-foreground">* Required fields</span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-foreground">Bundle Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Higher Education & Research Collection 2026"
                className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-[var(--brand)] transition-colors"
              />
            </div>

            {/* Bundle Summary (RTB Box) */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Bundle Summary</label>
              <RichTextEditor
                value={bundleSummary}
                onChange={setBundleSummary}
                placeholder="Enter a comprehensive overview and key highlights for this eBook bundle..."
              />
            </div>

            {/* Pricing & Discounts */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-foreground">Bundle Price (₹) *</label>
                {totalPrice > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Sum of eBooks: <span className="font-semibold text-foreground">₹{totalPrice}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value)}
                    placeholder={totalPrice > 0 ? totalPrice.toString() : "e.g. 1735.00"}
                    className="h-11 w-full rounded-xl border border-border bg-card pl-8 pr-4 text-sm outline-none focus:border-[var(--brand)] font-semibold text-foreground"
                  />
                </div>


              </div>
            </div>

            {/* Custom Cover Upload */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-foreground">Custom Cover Image (Optional)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-border bg-secondary/20 p-4 transition-colors hover:border-[var(--brand)] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover Preview" className="h-14 w-10 object-cover rounded-md shadow-xs border border-border" />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
                      <Upload size={18} />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {coverPreview ? "Change cover image" : "Click to upload bundle banner/cover"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">PNG, JPG or WEBP (Max 2MB). Auto-generates artwork if empty.</p>
                  </div>
                </div>
                {coverPreview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoverPreview(null);
                    }}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>


            {/* Tags */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Tags *</label>
              <div className="flex min-h-[48px] w-full flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-2.5 transition-colors focus-within:border-[var(--brand)]">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {tags.length < 3 && (
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder={tags.length === 0 ? "Type keyword and press Enter..." : "Add tag..."}
                    className="flex-1 bg-transparent px-1 text-xs text-foreground outline-none min-w-[120px] placeholder:text-muted-foreground"
                  />
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 pt-0.5">
                <span>Press <strong className="font-semibold text-foreground">Enter</strong> after each tag</span>
                <span>Maximum 3 keywords ({tags.length}/3)</span>
              </div>
            </div>
          </div>
        </div>

        {/* FULL WIDTH BOX 2: Select Included eBooks */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)] font-bold text-sm">
                2
              </span>
              <div>
                <h2 className="text-base font-semibold text-foreground">Select Included eBooks</h2>
                <p className="text-xs text-muted-foreground">Choose titles from the catalogue to include in this bundle</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAllFiltered}
                className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer"
              >
                Select All Filtered
              </button>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground transition-colors hover:text-red-500 hover:border-red-200 cursor-pointer"
                >
                  Clear Selection ({selectedIds.length})
                </button>
              )}
              <span className="text-xs font-semibold text-[var(--brand)] bg-[var(--sidebar-highlight)] px-3 py-1.5 rounded-lg">
                {selectedIds.length} of {availableBooks.length} Selected
              </span>
            </div>
          </div>

          {/* Search Toolbar & Category Pills */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search input */}
            <div className="relative flex-1 md:max-w-md">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search eBooks by title or author name..."
                className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs outline-none focus:border-[var(--brand)]"
              />
            </div>

            {/* Category Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap flex items-center gap-1.5">
                <Filter size={14} className="text-muted-foreground" />
                Category:
              </span>
              <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val)}>
                <SelectTrigger className="h-11 w-48 rounded-xl bg-card shadow-none text-xs font-medium border-border">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs">
                      {cat === "All" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* eBooks Full Width Grid: 4 columns on large screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBooks.map((b) => {
              const isSelected = selectedIds.includes(b.id);
              return (
                <div
                  key={b.id}
                  onClick={() => toggleSelect(b.id)}
                  className={`group relative flex items-center gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[var(--brand)] bg-[var(--sidebar-highlight)]/70 shadow-2xs ring-1 ring-[var(--brand)]/20"
                      : "border-border bg-card hover:border-border/80 hover:bg-secondary/30"
                  }`}
                >
                  <div
                    className="relative flex h-16 w-11 shrink-0 flex-col items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-2xs overflow-hidden"
                    style={{ background: b.cover }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                    <span className="relative z-10 font-extrabold tracking-wider">{b.initials}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground group-hover:text-[var(--brand)] transition-colors">
                      {b.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{b.author}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">₹{b.price}</span>
                      <span className="text-[10px] text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-md font-medium">
                        {b.category}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isSelected
                        ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                        : "border-border group-hover:border-muted-foreground"
                    }`}
                  >
                    {isSelected && <Check size={12} />}
                  </div>
                </div>
              );
            })}

            {filteredBooks.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground text-xs space-y-1">
                <p className="font-semibold text-foreground">No eBooks found</p>
                <p>No eBooks match your filter criteria "{query}".</p>
              </div>
            )}
          </div>
        </div>

        {/* FULL WIDTH BOX 3: Live Bundle Preview & Finalize */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--sidebar-highlight)] text-[var(--brand)] font-bold text-xs">
                3
              </span>
              <h2 className="text-base font-semibold text-foreground">Live Bundle Preview & Finalize</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles size={13} />
              Live Store Card Preview
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Side: Store Card Preview (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-secondary/20 p-6 shadow-xs space-y-5">
              <div className="flex items-start gap-4">
                {/* Cover Artwork */}
                <div className="relative shrink-0">
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Bundle Cover"
                      className="h-28 w-20 object-cover rounded-xl shadow-md border border-border"
                    />
                  ) : (
                    <div className="relative flex h-28 w-20 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-teal-700 text-white shadow-md overflow-hidden">
                      <Layers size={26} className="opacity-80 mb-1" />
                      <span className="text-[11px] font-extrabold tracking-wider uppercase">
                        {title ? title.slice(0, 3).toUpperCase() : "BDL"}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 bg-black/20 py-0.5 text-center text-[9px]">
                        {selectedBooks.length} TITLES
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1 space-y-2">
                  <h4 className="font-bold text-base leading-snug text-foreground">
                    {title || "Untitled Bundle"}
                  </h4>

                  {bundleSummary && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {bundleSummary}
                    </p>
                  )}


                  {/* Price Breakdown */}
                  <div className="pt-1 flex items-baseline gap-2.5">
                    <span className="text-xl font-extrabold text-foreground">
                      ₹{finalPrice || "0"}
                    </span>
                    {totalPrice > 0 && finalPrice < totalPrice && (
                      <>
                        <span className="text-xs text-muted-foreground line-through">₹{totalPrice}</span>
                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Selected eBooks List in Preview */}
              <div className="border-t border-border/60 pt-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-muted-foreground" />
                    Included eBooks ({selectedBooks.length})
                  </span>
                  {totalPrice > 0 && (
                    <span className="text-muted-foreground font-normal text-[11px]">
                      Combined List Price: ₹{totalPrice}
                    </span>
                  )}
                </div>

                {selectedBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {selectedBooks.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-card p-2 text-xs transition-colors hover:bg-secondary/40"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="flex h-7 w-5 shrink-0 items-center justify-center rounded text-[8px] font-bold text-white shadow-2xs"
                            style={{ background: b.cover }}
                          >
                            {b.initials}
                          </div>
                          <span className="truncate font-medium text-foreground text-[11.5px]">
                            {b.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-semibold text-muted-foreground">₹{b.price}</span>
                          <button
                            type="button"
                            onClick={() => toggleSelect(b.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                            title="Remove eBook"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                    No eBooks selected yet. Select eBooks from section 2 above.
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Financial Breakdown & Final CTA (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-border bg-secondary/10 p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  Publishing Summary
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Bundle Title:</span>
                    <span className="font-semibold text-foreground truncate max-w-[180px]">
                      {title || "Not set"}
                    </span>
                  </div>


                  {tags.length > 0 && (
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Tags:</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {tags.map((t) => (
                          <span key={t} className="bg-card px-2 py-0.5 rounded border border-border/50 font-medium text-foreground text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground pt-1 border-t border-border/50">
                    <span>Included eBooks:</span>
                    <span className="font-semibold text-foreground">{selectedBooks.length} Titles</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Combined List Sum:</span>
                    <span className="font-semibold text-foreground">₹{totalPrice}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="flex items-center gap-1">
                        <TagIcon size={12} /> Bundle Savings ({discountPercent}%):
                      </span>
                      <span className="font-bold">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-foreground border-t border-border pt-3">
                    <span>Final Bundle Price:</span>
                    <span className="text-base font-extrabold text-[var(--brand)]">
                      ₹{finalPrice || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={!isValid}
                  className="w-full flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-xs transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  <CheckCircle2 size={18} />
                  Create & Publish Bundle
                </button>

                {!title.trim() && (
                  <p className="text-center text-[11px] text-amber-600 dark:text-amber-400">
                    * Enter a bundle title in section 1 to proceed
                  </p>
                )}
                {selectedIds.length === 0 && (
                  <p className="text-center text-[11px] text-amber-600 dark:text-amber-400">
                    * Select at least one eBook in section 2 to proceed
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
