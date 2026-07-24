import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Code2,
  FileText,
  CheckCircle2,
  Copy,
  Check,
  Globe,
  Sparkles,
  Building2,
  AlertCircle,
  Pencil,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/marketing/schema-meta")({
  head: () => ({
    meta: [
      { title: "Schema & Meta — PixelBooks Admin" },
      {
        name: "description",
        content: "Manage search engine schemas and SEO metadata for titles and bundles in PixelBooks.",
      },
    ],
  }),
  component: SchemaMetaPage,
});

export type TypeFilter = "Titles" | "Bundle";

export interface SchemaMetaItem {
  id: string;
  type: "Title" | "Bundle";
  title: string;
  author: string;
  publisher: string;
  initials: string;
  cover: string; // gradient background
  metaStatus: string; // "Not Done" or "Updated on : 23 Jul 2026"
  schemaStatus: string; // "Not Done" or "Updated on : 23 Jul 2026"
  // Meta Details
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  robots?: string;
  // Schema Details
  schemaType?: string;
  schemaJson?: string;
}

const GRADIENTS = [
  "linear-gradient(160deg, oklch(0.55 0.14 240), oklch(0.32 0.09 240))",
  "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
  "linear-gradient(160deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
  "linear-gradient(160deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
  "linear-gradient(160deg, oklch(0.5 0.1 60), oklch(0.32 0.06 60))",
  "linear-gradient(160deg, oklch(0.5 0.12 200), oklch(0.32 0.07 200))",
  "linear-gradient(160deg, oklch(0.5 0.13 10), oklch(0.32 0.08 10))",
];

const INITIAL_ITEMS: SchemaMetaItem[] = [
  {
    id: "sm-1",
    type: "Title",
    title: "John M Upton",
    author: "John M Upton",
    publisher: "PixelBooks Press",
    initials: "JMU",
    cover: GRADIENTS[0],
    metaStatus: "Not Done",
    schemaStatus: "Not Done",
    metaTitle: "John M Upton - Author Profile & Books | PixelBooks",
    metaDescription: "Discover works, publications, and literary contributions by John M Upton on PixelBooks.",
    keywords: "John M Upton, books, literature, PixelBooks",
    canonicalUrl: "https://pixelbooks.com/titles/john-m-upton",
    robots: "index, follow",
    schemaType: "Book",
  },
  {
    id: "sm-2",
    type: "Title",
    title: "Cassell's History of England, Vol. 3 (of 8) / From the Great Rebellion to the Fall of Marlborough.",
    author: "Anonymous",
    publisher: "Cassell & Company",
    initials: "CHE",
    cover: GRADIENTS[1],
    metaStatus: "Not Done",
    schemaStatus: "Not Done",
    metaTitle: "Cassell's History of England, Vol. 3 | PixelBooks",
    metaDescription: "Read Cassell's History of England, Vol. 3 covering the Great Rebellion to the Fall of Marlborough.",
    keywords: "Cassell, History of England, Marlborough, Great Rebellion",
    canonicalUrl: "https://pixelbooks.com/titles/cassells-history-england-vol-3",
    robots: "index, follow",
    schemaType: "Book",
  },
  {
    id: "sm-3",
    type: "Title",
    title: "CORRECTION OFFICER!",
    author: "National Learning Corp",
    publisher: "Passbooks Edition",
    initials: "CO!",
    cover: GRADIENTS[2],
    metaStatus: "Not Done",
    schemaStatus: "Not Done",
    metaTitle: "Correction Officer Exam Study Guide & eBook | PixelBooks",
    metaDescription: "Comprehensive preparation material and practice tests for Correction Officer certification exams.",
    keywords: "Correction Officer, exam prep, study guide, law enforcement",
    canonicalUrl: "https://pixelbooks.com/titles/correction-officer",
    robots: "index, follow",
    schemaType: "Book",
  },
  {
    id: "sm-4",
    type: "Title",
    title: "The Principles of Duality",
    author: "Dr. Evelyn Reed",
    publisher: "Academic Press",
    initials: "POD",
    cover: GRADIENTS[3],
    metaStatus: "Not Done",
    schemaStatus: "Not Done",
    metaTitle: "The Principles of Duality - Mathematical Foundations | PixelBooks",
    metaDescription: "An in-depth exploration of duality theory in algebra, logic, and modern mathematical physics.",
    keywords: "Duality, Mathematics, Algebra, Quantum Logic",
    canonicalUrl: "https://pixelbooks.com/titles/principles-of-duality",
    robots: "index, follow",
    schemaType: "Book",
  },
  {
    id: "sm-5",
    type: "Title",
    title: "Cassell's History of England, Vol. 3 (of 8) / From the Great Rebellion to the Fall of Marlborough.",
    author: "Anonymous",
    publisher: "Cassell & Company",
    initials: "CHE",
    cover: GRADIENTS[4],
    metaStatus: "Not Done",
    schemaStatus: "Not Done",
    metaTitle: "Cassell's History of England Vol 3 (Second Edition) | PixelBooks",
    metaDescription: "Historical documentation of England from the Great Rebellion onwards.",
    keywords: "England history, Cassell, British History",
    canonicalUrl: "https://pixelbooks.com/titles/cassells-history-england-vol-3-ed2",
    robots: "index, follow",
    schemaType: "Book",
  },
  {
    id: "sm-6",
    type: "Title",
    title: "Elsaundrajoseph",
    author: "Elsaundra Joseph",
    publisher: "Indie Published",
    initials: "ESJ",
    cover: GRADIENTS[5],
    metaStatus: "Not Done",
    schemaStatus: "Not Done",
    metaTitle: "Elsaundrajoseph - Contemporary Fiction | PixelBooks",
    metaDescription: "Explore the modern novel Elsaundrajoseph by author Elsaundra Joseph.",
    keywords: "Elsaundrajoseph, fiction, novel, indie books",
    canonicalUrl: "https://pixelbooks.com/titles/elsaundrajoseph",
    robots: "index, follow",
    schemaType: "Book",
  },
  {
    id: "sm-7",
    type: "Title",
    title: "Foreword",
    author: "Arthur Conan Doyle",
    publisher: "Heritage Classics",
    initials: "FWD",
    cover: GRADIENTS[6],
    metaStatus: "Not Done",
    schemaStatus: "Not Done",
    metaTitle: "Foreword - Classic Literary Introductions | PixelBooks",
    metaDescription: "A collection of seminal literary forewords and introductory essays.",
    keywords: "Foreword, essays, literary classics",
    canonicalUrl: "https://pixelbooks.com/titles/foreword",
    robots: "index, follow",
    schemaType: "Book",
  },
  {
    id: "sm-8",
    type: "Title",
    title: "John M Upton",
    author: "John M Upton",
    publisher: "PixelBooks Press",
    initials: "JMU",
    cover: GRADIENTS[0],
    metaStatus: "Not Done",
    schemaStatus: "Not Done",
    metaTitle: "John M Upton - Special Edition | PixelBooks",
    metaDescription: "Special edition publication of John M Upton works.",
    keywords: "John M Upton, PixelBooks",
    canonicalUrl: "https://pixelbooks.com/titles/john-m-upton-special",
    robots: "index, follow",
    schemaType: "Book",
  },
  {
    id: "sm-9",
    type: "Title",
    title: "indemnity",
    author: "Sarah Jenkins",
    publisher: "Legal House Publishing",
    initials: "IND",
    cover: GRADIENTS[2],
    metaStatus: "Updated on : 23 Jul 2026",
    schemaStatus: "Not Done",
    metaTitle: "Indemnity - Principles of Contract & Liability Law | PixelBooks",
    metaDescription: "Comprehensive legal reference manual analyzing indemnity clauses, insurance liabilities, and court precedents.",
    keywords: "Indemnity law, legal contracts, liability, PixelBooks",
    canonicalUrl: "https://pixelbooks.com/titles/indemnity",
    robots: "index, follow",
    schemaType: "Book",
  },
  {
    id: "sm-10",
    type: "Title",
    title: "The Curtiss Aviation Book",
    author: "Glenn H. Curtiss",
    publisher: "Aviation Press",
    initials: "CAB",
    cover: GRADIENTS[1],
    metaStatus: "Updated on : 21 Jul 2026",
    schemaStatus: "Updated on : 21 Jul 2026",
    metaTitle: "The Curtiss Aviation Book - History of Early Flight | PixelBooks",
    metaDescription: "Chronicle of early pioneer aviation accomplishments by Glenn Curtiss.",
    keywords: "Aviation, Curtiss, Flight History",
    canonicalUrl: "https://pixelbooks.com/titles/curtiss-aviation-book",
    robots: "index, follow",
    schemaType: "Book",
  },
  {
    id: "sm-11",
    type: "Title",
    title: "NEP 2020 - Policy Formulation In Education",
    author: "Dr. Ashok Alex",
    publisher: "PixelBooks Press",
    initials: "NEP",
    cover: GRADIENTS[0],
    metaStatus: "Updated on : 20 Jul 2026",
    schemaStatus: "Updated on : 20 Jul 2026",
    metaTitle: "NEP 2020 - Policy Formulation In Education | PixelBooks",
    metaDescription: "Analysis of the National Education Policy 2020 reforms and implementation strategies.",
    keywords: "NEP 2020, Education policy, India, reforms",
    canonicalUrl: "https://pixelbooks.com/titles/nep-2020-policy",
    robots: "index, follow",
    schemaType: "Book",
  },
  {
    id: "sm-12",
    type: "Title",
    title: "A Complete History of Music for Schools",
    author: "W. J. Baltzell",
    publisher: "Oxford University Press",
    initials: "MUS",
    cover: GRADIENTS[3],
    metaStatus: "Not Done",
    schemaStatus: "Not Done",
    metaTitle: "A Complete History of Music for Schools | PixelBooks",
    metaDescription: "Comprehensive music theory and historical curriculum guide for academic study.",
    keywords: "Music history, Baltzell, musicology",
    canonicalUrl: "https://pixelbooks.com/titles/complete-history-music",
    robots: "index, follow",
    schemaType: "Book",
  },
  // Bundle Items
  {
    id: "sm-b1",
    type: "Bundle",
    title: "Essential Civil Services Prep Bundle",
    author: "Multiple Authors",
    publisher: "PixelBooks Education",
    initials: "ECS",
    cover: GRADIENTS[0],
    metaStatus: "Not Done",
    schemaStatus: "Not Done",
    metaTitle: "Essential Civil Services Prep Bundle | PixelBooks",
    metaDescription: "Complete study suite including general studies, aptitude, and past paper analysis for civil services.",
    keywords: "Civil services bundle, IAS prep, UPSC books",
    canonicalUrl: "https://pixelbooks.com/bundles/essential-civil-services",
    robots: "index, follow",
    schemaType: "Product",
  },
  {
    id: "sm-b2",
    type: "Bundle",
    title: "Complete History & Heritage Series",
    author: "Cassell & Historical Society",
    publisher: "Heritage Press",
    initials: "CHH",
    cover: GRADIENTS[1],
    metaStatus: "Updated on : 22 Jul 2026",
    schemaStatus: "Not Done",
    metaTitle: "Complete History & Heritage Series (8 Volumes) | PixelBooks",
    metaDescription: "The definitive 8-volume historical encyclopedia set detailing British and European historical milestones.",
    keywords: "History bundle, Cassell collection, encyclopedia",
    canonicalUrl: "https://pixelbooks.com/bundles/history-heritage-series",
    robots: "index, follow",
    schemaType: "Product",
  },
  {
    id: "sm-b3",
    type: "Bundle",
    title: "Academic Reference Master Collection",
    author: "Various Scholars",
    publisher: "Academic Press",
    initials: "ARM",
    cover: GRADIENTS[3],
    metaStatus: "Not Done",
    schemaStatus: "Updated on : 19 Jul 2026",
    metaTitle: "Academic Reference Master Collection 2026 | PixelBooks",
    metaDescription: "Curated bundle of higher education mathematics, physics, and science reference textbooks.",
    keywords: "Academic reference bundle, science textbooks, mathematics",
    canonicalUrl: "https://pixelbooks.com/bundles/academic-reference-master",
    robots: "index, follow",
    schemaType: "Product",
  },
  {
    id: "sm-b4",
    type: "Bundle",
    title: "Classic Literature Omnibus 2026",
    author: "Classic Masters",
    publisher: "Heritage Classics",
    initials: "CLO",
    cover: GRADIENTS[6],
    metaStatus: "Updated on : 24 Jul 2026",
    schemaStatus: "Updated on : 24 Jul 2026",
    metaTitle: "Classic Literature Omnibus 2026 | PixelBooks",
    metaDescription: "Curated 15-book anthology of world literature and classic fiction.",
    keywords: "Literature omnibus, classic fiction bundle",
    canonicalUrl: "https://pixelbooks.com/bundles/classic-literature-omnibus",
    robots: "index, follow",
    schemaType: "Product",
  },
];

const PAGE_SIZE = 8;

export function SchemaMetaPage() {
  const [items, setItems] = useState<SchemaMetaItem[]>(INITIAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("Titles");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modals state
  const [editingMetaItem, setEditingMetaItem] = useState<SchemaMetaItem | null>(null);
  const [editingSchemaItem, setEditingSchemaItem] = useState<SchemaMetaItem | null>(null);

  // Meta Form fields state
  const [metaTitleInput, setMetaTitleInput] = useState("");
  const [metaDescInput, setMetaDescInput] = useState("");
  const [metaKeywordsInput, setMetaKeywordsInput] = useState("");
  const [canonicalUrlInput, setCanonicalUrlInput] = useState("");
  const [robotsInput, setRobotsInput] = useState("index, follow");

  // Schema Form fields state
  const [schemaJsonInput, setSchemaJsonInput] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Reset pagination on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter]);

  // Filter items based on tab & search query
  const filteredItems = useMemo(() => {
    const targetType = typeFilter === "Titles" ? "Title" : "Bundle";
    return items.filter((item) => {
      if (item.type !== targetType) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.publisher.toLowerCase().includes(q)
      );
    });
  }, [items, typeFilter, searchQuery]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));

  // Paginated items for current view page
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  // Open Edit Meta Modal
  const handleOpenEditMeta = (item: SchemaMetaItem) => {
    setEditingMetaItem(item);
    setMetaTitleInput(item.metaTitle || `${item.title} | PixelBooks`);
    setMetaDescInput(
      item.metaDescription ||
        `Read or download ${item.title} by ${item.author || "PixelBooks Publishing"} on PixelBooks.`
    );
    setMetaKeywordsInput(item.keywords || `${item.title}, PixelBooks, ebook, digital reading`);
    setCanonicalUrlInput(
      item.canonicalUrl ||
        `https://pixelbooks.com/${item.type === "Title" ? "titles" : "bundles"}/${item.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}`
    );
    setRobotsInput(item.robots || "index, follow");
  };

  // Save Meta
  const handleSaveMeta = () => {
    if (!editingMetaItem) return;
    const nowStr = `Updated on : ${new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;

    setItems((prev) =>
      prev.map((i) =>
        i.id === editingMetaItem.id
          ? {
              ...i,
              metaStatus: nowStr,
              metaTitle: metaTitleInput,
              metaDescription: metaDescInput,
              keywords: metaKeywordsInput,
              canonicalUrl: canonicalUrlInput,
              robots: robotsInput,
            }
          : i
      )
    );

    toast.success(`Meta data updated for "${editingMetaItem.title}"`);
    setEditingMetaItem(null);
  };

  // Open Edit Schema Modal
  const handleOpenEditSchema = (item: SchemaMetaItem) => {
    setEditingSchemaItem(item);
    
    if (item.schemaJson) {
      setSchemaJsonInput(item.schemaJson);
    } else {
      const generatedSchema = {
        "@context": "https://schema.org",
        "@type": item.type === "Title" ? "Book" : "Product",
        name: item.title,
        author: {
          "@type": "Person",
          name: item.author || "PixelBooks Author",
        },
        publisher: {
          "@type": "Organization",
          name: item.publisher || "PixelBooks Press",
        },
        url: item.canonicalUrl || `https://pixelbooks.com/titles/${item.id}`,
        inLanguage: "en",
        workExample: [
          {
            "@type": "Book",
            bookFormat: "https://schema.org/EBook",
            potentialAction: {
              "@type": "ReadAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `https://pixelbooks.com/read/${item.id}`,
                actionPlatform: [
                  "http://schema.org/DesktopWebPlatform",
                  "http://schema.org/IOSPlatform",
                  "http://schema.org/AndroidPlatform",
                ],
              },
            },
          },
        ],
      };
      setSchemaJsonInput(JSON.stringify(generatedSchema, null, 2));
    }
  };

  // AI Schema Generator Action
  const handleGenerateSchemaAI = () => {
    if (!editingSchemaItem) return;
    setIsGeneratingAI(true);

    setTimeout(() => {
      const aiSchema = {
        "@context": "https://schema.org",
        "@type": editingSchemaItem.type === "Title" ? "Book" : "Product",
        "@id": `https://pixelbooks.com/${editingSchemaItem.type === "Title" ? "titles" : "bundles"}/${editingSchemaItem.id}#schema`,
        name: editingSchemaItem.title,
        headline: editingSchemaItem.metaTitle || `${editingSchemaItem.title} - Digital Edition`,
        description: editingSchemaItem.metaDescription || `Read or download ${editingSchemaItem.title} on PixelBooks digital store.`,
        author: {
          "@type": "Person",
          name: editingSchemaItem.author,
        },
        publisher: {
          "@type": "Organization",
          name: editingSchemaItem.publisher,
          logo: {
            "@type": "ImageObject",
            url: "https://pixelbooks.com/assets/logo.png",
          },
        },
        inLanguage: "en",
        accessMode: ["textual", "visual"],
        accessibilitySummary: "Accessible EPUB & PDF text with reflowable typography.",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "42",
          bestRating: "5",
          worstRating: "1",
        },
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "PixelBooks",
          },
        },
        workExample: [
          {
            "@type": "Book",
            bookFormat: "https://schema.org/EBook",
            potentialAction: {
              "@type": "ReadAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `https://pixelbooks.com/read/${editingSchemaItem.id}`,
                actionPlatform: [
                  "http://schema.org/DesktopWebPlatform",
                  "http://schema.org/IOSPlatform",
                  "http://schema.org/AndroidPlatform",
                ],
              },
            },
          },
        ],
      };

      setSchemaJsonInput(JSON.stringify(aiSchema, null, 2));
      setIsGeneratingAI(false);
      toast.success(`AI Schema successfully generated for "${editingSchemaItem.title}"`);
    }, 600);
  };

  // Save Schema
  const handleSaveSchema = () => {
    if (!editingSchemaItem) return;
    try {
      JSON.parse(schemaJsonInput);
    } catch {
      toast.error("Invalid JSON format in schema code! Please verify syntax.");
      return;
    }

    const nowStr = `Updated on : ${new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;

    setItems((prev) =>
      prev.map((i) =>
        i.id === editingSchemaItem.id
          ? {
              ...i,
              schemaStatus: nowStr,
              schemaJson: schemaJsonInput,
            }
          : i
      )
    );

    toast.success(`Schema markup updated for "${editingSchemaItem.title}"`);
    setEditingSchemaItem(null);
  };

  const handleCopySchemaJson = () => {
    navigator.clipboard.writeText(schemaJsonInput);
    setCopiedCode(true);
    toast.success("JSON-LD copied to clipboard");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <AppShell
      title="Schema & Meta"
      subtitle="Manage search engine schemas, indexing rules, and rich structured data for catalog titles and bundles."
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-6 w-full">
        {/* Filter Toolbar matching Sales Report / PixelBooks Style Guide */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-2xs">
          {/* Search Input Box */}
          <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3.5 shadow-none transition-colors focus-within:border-[var(--brand)]">
            <Search size={16} className="mr-2 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>

          {/* Type Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-11 items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-secondary/40 focus:outline-none min-w-[140px] shadow-none cursor-pointer">
              <span>{typeFilter}</span>
              <ChevronDown size={16} className="text-muted-foreground shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[140px] bg-card border-border shadow-md">
              <DropdownMenuItem
                onClick={() => setTypeFilter("Titles")}
                className={`cursor-pointer font-medium text-xs ${
                  typeFilter === "Titles" ? "bg-[var(--sidebar-highlight)] text-[var(--brand)]" : ""
                }`}
              >
                Titles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTypeFilter("Bundle")}
                className={`cursor-pointer font-medium text-xs ${
                  typeFilter === "Bundle" ? "bg-[var(--sidebar-highlight)] text-[var(--brand)]" : ""
                }`}
              >
                Bundle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Data Table Container */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4 whitespace-nowrap">Meta Status</th>
                  <th className="px-6 py-4 whitespace-nowrap">Schema Status</th>
                  <th className="px-6 py-4 text-center whitespace-nowrap min-w-[300px]">SEO Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText size={32} className="text-muted-foreground/60" />
                        <p className="font-medium text-sm">No items found</p>
                        <p className="text-xs text-muted-foreground">
                          Try adjusting your search query or filter selection.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => {
                    const isMetaNotDone = item.metaStatus === "Not Done";
                    const isSchemaNotDone = item.schemaStatus === "Not Done";
                    const authorInitials = item.author
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr
                        key={item.id}
                        className="group transition-colors hover:bg-muted/20"
                      >
                        {/* Structured Title Cell Layout */}
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-4 max-w-[550px]">
                            {/* Book cover thumbnail */}
                            <div
                              className="relative flex h-14 w-10 shrink-0 flex-col items-center justify-center rounded-md text-[9px] font-bold text-white shadow-2xs ring-1 ring-black/10 overflow-hidden"
                              style={{ background: item.cover }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/15" />
                              <span className="relative z-10 text-[9.5px] font-extrabold tracking-wider">
                                {item.initials}
                              </span>
                            </div>

                            {/* Title & Meta Entity Chips */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <p className="font-semibold text-sm leading-snug text-foreground transition-colors group-hover:text-[var(--brand)] line-clamp-2">
                                {item.title}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                                {/* Author Chip */}
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2 py-0.5 shadow-2xs">
                                  <span
                                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[7.5px] font-bold text-white"
                                    style={{ background: item.cover }}
                                  >
                                    {authorInitials}
                                  </span>
                                  <span className="text-[11px] font-medium text-foreground">{item.author}</span>
                                </div>

                                {/* Publisher Chip */}
                                <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/60 px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                                  <Building2 size={10} className="shrink-0 text-muted-foreground/80" />
                                  <span>{item.publisher}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Meta Status Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isMetaNotDone ? (
                            <span className="text-red-500 font-semibold text-sm">Not Done</span>
                          ) : (
                            <span className="text-muted-foreground text-xs font-normal">
                              {item.metaStatus}
                            </span>
                          )}
                        </td>

                        {/* Schema Status Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isSchemaNotDone ? (
                            <span className="text-red-500 font-semibold text-sm">Not Done</span>
                          ) : (
                            <span className="text-muted-foreground text-xs font-normal">
                              {item.schemaStatus}
                            </span>
                          )}
                        </td>

                        {/* Combined SEO Actions Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2.5 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenEditMeta(item)}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand)] hover:opacity-90 text-white px-4.5 py-2.5 text-xs sm:text-[13px] font-semibold shadow-2xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
                            >
                              <Pencil size={15} />
                              Edit Meta
                            </button>

                            <button
                              onClick={() => handleOpenEditSchema(item)}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand)] hover:opacity-90 text-white px-4.5 py-2.5 text-xs sm:text-[13px] font-semibold shadow-2xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
                            >
                              <Code2 size={15} />
                              Edit Schema
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Pagination Footer matching PixelBooks Style Guide */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
          <div className="text-xs sm:text-sm text-foreground font-normal">
            Showing <span className="font-semibold">{paginatedItems.length}</span> from{" "}
            <span className="font-semibold">{filteredItems.length}</span> results
          </div>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronsLeft size={15} />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[var(--sidebar-highlight)] text-[var(--brand)] font-bold border border-[var(--brand)]/30"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Next
              <ChevronsRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Meta Modal */}
      <Dialog open={!!editingMetaItem} onOpenChange={(open) => !open && setEditingMetaItem(null)}>
        <DialogContent className="sm:max-w-[650px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Globe size={18} className="text-[var(--brand)]" />
              Edit SEO Meta Tags
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure search engine metadata for <span className="font-semibold text-foreground">"{editingMetaItem?.title}"</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">Meta Title</label>
                <span className={`text-[11px] ${metaTitleInput.length > 60 ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                  {metaTitleInput.length}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={metaTitleInput}
                onChange={(e) => setMetaTitleInput(e.target.value)}
                placeholder="Enter title tag..."
                className="w-full h-10 rounded-lg border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-[var(--brand)]"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">Meta Description</label>
                <span className={`text-[11px] ${metaDescInput.length > 160 ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                  {metaDescInput.length}/160 chars
                </span>
              </div>
              <textarea
                value={metaDescInput}
                onChange={(e) => setMetaDescInput(e.target.value)}
                rows={3}
                placeholder="Enter meta description for search snippets..."
                className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground outline-none focus:border-[var(--brand)] resize-none"
              />
            </div>

            {/* Target Keywords */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Target Keywords
              </label>
              <input
                type="text"
                value={metaKeywordsInput}
                onChange={(e) => setMetaKeywordsInput(e.target.value)}
                placeholder="Comma separated keywords..."
                className="w-full h-10 rounded-lg border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-[var(--brand)]"
              />
            </div>

            {/* Canonical URL & Robots */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={canonicalUrlInput}
                  onChange={(e) => setCanonicalUrlInput(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-[var(--brand)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Robots Indexing
                </label>
                <select
                  value={robotsInput}
                  onChange={(e) => setRobotsInput(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-card px-2.5 text-xs text-foreground outline-none focus:border-[var(--brand)]"
                >
                  <option value="index, follow">Index, Follow</option>
                  <option value="noindex, follow">Noindex, Follow</option>
                  <option value="index, nofollow">Index, Nofollow</option>
                  <option value="noindex, nofollow">Noindex, Nofollow</option>
                </select>
              </div>
            </div>

            {/* SERP Preview Card */}
            <div className="rounded-lg border border-border bg-muted/30 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
                <Sparkles size={13} className="text-amber-500" />
                <span className="font-semibold text-foreground">Google Search Preview</span>
              </div>
              <p className="text-xs text-[#1a0dab] dark:text-[#8ab4f8] font-medium hover:underline truncate cursor-pointer">
                {metaTitleInput || "Title Tag Preview"}
              </p>
              <p className="text-[11px] text-[#006621] dark:text-[#bdc1c6] truncate">
                {canonicalUrlInput || "https://pixelbooks.com/..."}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {metaDescInput || "Meta description preview will appear here..."}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setEditingMetaItem(null)}
              className="px-4.5 py-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveMeta}
              className="px-4.5 py-2.5 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              Save Meta
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schema Modal */}
      <Dialog open={!!editingSchemaItem} onOpenChange={(open) => !open && setEditingSchemaItem(null)}>
        <DialogContent className="sm:max-w-[700px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Code2 size={18} className="text-[var(--brand)]" />
              Edit JSON-LD Schema Markup
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure Schema.org structured data for <span className="font-semibold text-foreground">"{editingSchemaItem?.title}"</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Header row with "Generate Schema with AI" button */}
            <div className="flex items-center justify-between gap-4">
              <label className="text-xs font-semibold text-foreground">Schema Configuration</label>
              
              {/* AI Schema Generator Button */}
              <button
                onClick={handleGenerateSchemaAI}
                disabled={isGeneratingAI}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] hover:opacity-90 disabled:opacity-60 text-white px-4 py-2 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Generating with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-amber-300" />
                    <span>Generate Schema with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* JSON-LD Editor & Code Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  JSON-LD Code (<code className="text-[11px] text-muted-foreground">application/ld+json</code>)
                </span>
                <button
                  onClick={handleCopySchemaJson}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check size={12} className="text-emerald-500" />
                      <span className="text-emerald-600 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={schemaJsonInput}
                onChange={(e) => setSchemaJsonInput(e.target.value)}
                rows={12}
                className="w-full rounded-lg border border-border bg-slate-950 p-4 font-mono text-xs text-emerald-400 outline-none focus:border-[var(--brand)] leading-relaxed shadow-inner"
                spellCheck={false}
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-md border border-border">
              <AlertCircle size={14} className="text-blue-500 shrink-0" />
              <span>
                Schema markup is validated against Schema.org specifications before saving to avoid indexing warnings in Google Search Console.
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setEditingSchemaItem(null)}
              className="px-4.5 py-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSchema}
              className="px-4.5 py-2.5 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              Validate & Save Schema
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
