import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Image as ImageIcon,
  Sparkles,
  FileText,
  CheckCircle2,
  HardDrive,
  Info,
  Tag,
  CheckCircle,
  Building2,
  Pencil,
  Search,
  UserRound,
  GraduationCap,
  Users,
  ShieldCheck,
  FolderTree,
  BookMarked,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { seedBooks, DEFAULT_BOOK_LIBRARY_ALLOCATIONS } from "@/lib/catalogue-data";
import {
  LibraryAllocationSection,
  type LibraryAllocationItem,
} from "@/components/library-allocation-section";
import {
  SectionCard,
  Field,
  TextInput,
  SelectInput,
  Check,
  AutoDetectedBadge,
  UploadTile,
  SamplePreviewDialog,
  createCoverImageFromEbook,
  RichTextEditor,
  AuthorSearchResultCard,
  CategoryDialog,
  slugify,
  initials,
  AUTHOR_DIRECTORY,
  type SelectedAuthor,
} from "@/components/publisher/catalogue-form-shared";
import { UploadEBookFilesSection } from "./upload-ebook-section";
import { InstructionsAndGuidelinesSection } from "./instructions-guidelines-section";
import { EbookDetailsSection } from "./ebook-details-section";
import { AuthorDetailsSection } from "./author-details-section";
import { SelectCategoriesSection } from "./select-categories-section";

export function LibraryOnlyPublisherCataloguePage({
  editBookId,
}: {
  editBookId?: string;
}) {
  const navigate = useNavigate();
  const isEditMode = Boolean(editBookId);
  const targetBook = editBookId ? seedBooks.find((b) => b.id === editBookId) : null;

  // Uploaded Files State
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [samplePreviewOpen, setSamplePreviewOpen] = useState(false);
  const [sourcePreviewOpen, setSourcePreviewOpen] = useState(false);
  const [selectedCoverPage, setSelectedCoverPage] = useState(1);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [autofill, setAutofill] = useState(true);

  // Guidelines Accordion State
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  // Academic eBook Details State
  const [title, setTitle] = useState(targetBook?.title || "Harry Potter");
  const [subtitle, setSubtitle] = useState(
    "Curriculum Reforms & Institutional Frameworks for Higher Education",
  );
  const [isbn, setIsbn] = useState(targetBook?.isbn || "25455955");
  const [regionalName, setRegionalName] = useState(targetBook ? "ദേശീയ വിദ്യാഭ്യാസ നയം 2020" : "Harry Potter");
  const [language, setLanguage] = useState(targetBook?.language || "English");
  const [academicLevel, setAcademicLevel] = useState("Postgraduate / Academic Reference");
  const [edition, setEdition] = useState("Revised Institutional Edition 2026");
  const [pageCount, setPageCount] = useState("284");
  const [publicationDate, setPublicationDate] = useState("15/01/2024");
  const [paperbackDate, setPaperbackDate] = useState("20/08/2023");
  const [ebookSize, setEbookSize] = useState("25.4");
  const [abstract, setAbstract] = useState(
    targetBook
      ? `Institutional study on ${targetBook.title}, prepared for university and college libraries across India under curriculum accreditation guidelines.`
      : "Arun m",
  );
  const [subjectTags, setSubjectTags] = useState<string[]>([
    "Promised Land 2024",
    "Barack Obama",
    "Barack Obama",
  ]);
  const [subjectTagInput, setSubjectTagInput] = useState("");

  // Academic Authors & Faculty State
  const [selectedAuthors, setSelectedAuthors] = useState<SelectedAuthor[]>(
    targetBook
      ? [
          {
            id: "sa-acad-1",
            name: targetBook.author,
            books: 30,
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
            affiliation: "Contemporary Fiction",
            addAsNew: false,
            role: "Lead Investigator",
            profileSlug: slugify(targetBook.author),
          },
        ]
      : [],
  );

  // Categories & Subject Taxonomy
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string[]>>({
    "Academic & Educational": ["Higher Education", "Curriculum Books"],
    Articles: ["Peer Reviewed"],
    Autobiography: [],
  });

  // Institutional Library Allocations
  const initialAllocations = useMemo(() => {
    if (targetBook && DEFAULT_BOOK_LIBRARY_ALLOCATIONS[targetBook.id]) {
      const existing = DEFAULT_BOOK_LIBRARY_ALLOCATIONS[targetBook.id];
      const res: Record<string, LibraryAllocationItem> = {};
      Object.entries(existing).forEach(([libName, count]) => {
        res[libName] = {
          copies: count,
          courses: targetBook.courses || ["All Courses"],
          batches: targetBook.batches || ["All Batches"],
        };
      });
      return res;
    }
    return {
      "Central University Digital Library": {
        copies: 50,
        courses: ["All Courses"],
        batches: ["All Batches"],
      },
      "National Science & Tech Consortium": {
        copies: 30,
        courses: ["All Courses"],
        batches: ["All Batches"],
      },
    };
  }, [targetBook]);

  const [allocations, setAllocations] =
    useState<Record<string, LibraryAllocationItem>>(initialAllocations);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Computed summary metrics
  const totalAllocatedCopies = useMemo(
    () => Object.values(allocations).reduce((sum, item) => sum + (item.copies || 0), 0),
    [allocations],
  );
  const totalAllocatedLibraries = useMemo(
    () => Object.keys(allocations).length,
    [allocations],
  );

  const handleGenerateSample = () => {
    if (!ebookFile) return;
    const generatedSample = new File(
      [ebookFile],
      `Institutional_Sample_${ebookFile.name.replace(/\.[^/.]+$/, "")}.epub`,
      { type: "application/epub+zip" },
    );
    setSampleFile(generatedSample);
    setSamplePreviewOpen(true);
  };

  const handleGenerateCover = async () => {
    if (!ebookFile) return;
    setIsGeneratingCover(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const generated = await createCoverImageFromEbook(ebookFile, selectedCoverPage);
      setCoverFile(generated);
      toast.success(`Academic cover generated from manuscript (Page ${selectedCoverPage}).`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate cover image.");
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const handleAddSubjectTag = () => {
    const val = subjectTagInput.trim();
    if (!val || subjectTags.includes(val)) return;
    setSubjectTags([...subjectTags, val]);
    setSubjectTagInput("");
  };

  const handleRemoveSubjectTag = (idx: number) => {
    setSubjectTags(subjectTags.filter((_, i) => i !== idx));
  };

  const handleSubmit = (asDraft = false) => {
    if (!title.trim()) {
      toast.error("Please enter the Academic eBook Title");
      return;
    }
    if (totalAllocatedLibraries === 0 && !asDraft) {
      toast.error("Please allocate this eBook to at least one institutional library");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (asDraft) {
        toast.success(`"${title}" saved as draft in Library Only catalogue.`);
      } else if (isEditMode) {
        toast.success(`Library eBook "${title}" updated with ${totalAllocatedCopies} active copies.`);
      } else {
        toast.success(
          `"${title}" published successfully to ${totalAllocatedLibraries} institutional libraries (${totalAllocatedCopies} copies).`,
        );
      }
      setTimeout(() => {
        navigate({ to: "/publisher/catalogue" });
      }, 1200);
    }, 800);
  };

  const libraryGuidelines = [
    {
      icon: <Building2 size={18} />,
      title: "Direct Institutional Licensing",
      desc: "Books published here bypass commercial store moderation and are accessioned directly into allocated library databases.",
    },
    {
      icon: <Users size={18} />,
      title: "Concurrent Copy Quotas",
      desc: "Specify exact license copy limits for each affiliated institution, supporting concurrent borrowing by enrolled students.",
    },
    {
      icon: <GraduationCap size={18} />,
      title: "Course & Cohort Access Control",
      desc: "Restrict or grant reading privileges to targeted degree programs (B.Tech, MBBS, MBA) and academic cohorts.",
    },
    {
      icon: <ShieldCheck size={18} />,
      title: "Campus DRM & Offline Lending",
      desc: "PixelBooks DRM restricts unauthorized printing and file copying while permitting encrypted offline reading on university tablets.",
    },
  ];

  return (
    <AppShell
      title={isEditMode ? "Edit Library eBook Listing" : "Add Library eBook Title"}
      subtitle="Library-Only Publisher Portal — Institutional Network & Academic Allocation"
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center gap-3">
          <Link
            to="/publisher/catalogue"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
            aria-label="Back to Catalogue"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="text-sm font-semibold text-foreground">Back to Catalogue</span>
            <p className="text-xs text-muted-foreground">Manage institutional library catalogue</p>
          </div>
        </div>

        {/* Edit Mode Alert Banner */}
        {isEditMode && (
          <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-xs font-medium text-indigo-700 dark:text-indigo-300 shadow-xs">
            <div className="flex items-center gap-2.5">
              <BookMarked size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                Editing Institutional Listing: <strong>{targetBook?.title ?? title}</strong> (ID:{" "}
                <code className="font-mono">{editBookId}</code>)
              </span>
            </div>
            <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {totalAllocatedCopies} Copies Allocated
            </span>
          </div>
        )}

        <div className="space-y-6 pb-20">
          {/* ── SECTION 1: UPLOAD EBOOK FILES & METADATA ───────────────────── */}
          <UploadEBookFilesSection
            ebookFile={ebookFile}
            setEbookFile={setEbookFile}
            sampleFile={sampleFile}
            setSampleFile={setSampleFile}
            coverFile={coverFile}
            setCoverFile={setCoverFile}
            autofill={autofill}
            setAutofill={setAutofill}
            onPreviewSource={ebookFile ? () => setSourcePreviewOpen(true) : undefined}
            onPreviewSample={sampleFile ? () => setSamplePreviewOpen(true) : undefined}
            onGenerateSample={ebookFile ? handleGenerateSample : undefined}
            onGenerateCover={ebookFile ? handleGenerateCover : undefined}
            isGeneratingCover={isGeneratingCover}
            selectedCoverPage={selectedCoverPage}
            setSelectedCoverPage={setSelectedCoverPage}
          />

          {/* ── SECTION 2: INSTRUCTIONS & GUIDELINES ───────────────────────── */}
          <InstructionsAndGuidelinesSection />

          {/* ── SECTION 3: EBOOK DETAILS ────────────────────────────────────── */}
          <EbookDetailsSection
            title={title}
            setTitle={setTitle}
            isbn={isbn}
            setIsbn={setIsbn}
            regionalName={regionalName}
            setRegionalName={setRegionalName}
            language={language}
            setLanguage={setLanguage}
            pubDate={publicationDate}
            setPubDate={setPublicationDate}
            paperbackDate={paperbackDate}
            setPaperbackDate={setPaperbackDate}
            ebookSize={ebookSize}
            setEbookSize={setEbookSize}
            summary={abstract}
            setSummary={setAbstract}
            tags={subjectTags}
            setTags={setSubjectTags}
          />

          {/* ── SECTION 4: AUTHORS DETAILS ──────────────────────────────────── */}
          <AuthorDetailsSection
            selectedAuthors={selectedAuthors}
            setSelectedAuthors={setSelectedAuthors}
            domainPrefix="https://azdevlibcustomer.pixelbooksapp.com/author/"
          />

          {/* ── SECTION 5: SELECT CATEGORIES ───────────────────────────────── */}
          <SelectCategoriesSection
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            onOpenModal={() => setCategoryModalOpen(true)}
          />

          {/* ── SECTION 6: INSTITUTIONAL LIBRARY ALLOCATION & COPIES ────────── */}
          <LibraryAllocationSection
            allocations={allocations}
            onChange={setAllocations}
            mediaTypeLabel="eBook"
            showCopies
          />

          {/* Submission Success Alert */}
          {isSuccess && (
            <div className="flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-indigo-700 dark:text-indigo-300">
              <CheckCircle2 size={18} className="shrink-0" />
              <p className="text-sm font-semibold">
                {isEditMode
                  ? "Library eBook changes successfully saved! Redirecting to catalogue..."
                  : "eBook published to institutional libraries successfully! Redirecting to catalogue..."}
              </p>
            </div>
          )}
        </div>

        {/* ── STICKY FOOTER ACTIONS BAR ────────────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-border bg-background/95 px-4 sm:px-8 py-3.5 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Mode: <strong>Library-Only Publisher</strong> &bull; {totalAllocatedCopies} Copies &bull;{" "}
              {totalAllocatedLibraries} Institutions
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/publisher/catalogue"
              className="inline-flex h-10 items-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="inline-flex h-10 items-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl px-5 text-xs font-bold text-white shadow-sm hover:opacity-95 active:scale-[0.98] cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <CheckCircle size={14} />
              <span>
                {isSubmitting
                  ? "Processing..."
                  : isEditMode
                    ? "Update Library eBook"
                    : "Publish eBook to Libraries"}
              </span>
            </button>
          </div>
        </div>

        {/* Modals & Dialogs */}
        {samplePreviewOpen && (
          <SamplePreviewDialog
            sampleFile={sampleFile}
            ebookFile={ebookFile}
            isSample
            onClose={() => setSamplePreviewOpen(false)}
            onApprove={() => {
              setSamplePreviewOpen(false);
              toast.success("Syllabus excerpt approved and attached to listing.");
            }}
          />
        )}

        {sourcePreviewOpen && (
          <SamplePreviewDialog
            ebookFile={ebookFile}
            isSample={false}
            onClose={() => setSourcePreviewOpen(false)}
          />
        )}

        {categoryModalOpen && (
          <CategoryDialog
            initial={selectedCategories}
            onClose={() => setCategoryModalOpen(false)}
            onSave={(next) => setSelectedCategories(next)}
          />
        )}
      </div>
    </AppShell>
  );
}
