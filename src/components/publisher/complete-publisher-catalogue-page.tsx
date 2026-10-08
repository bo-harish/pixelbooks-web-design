import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Copy as CopyIcon,
  CheckCircle2,
  HardDrive,
  Info,
  Tag,
  CheckCircle,
  Plus,
  Trash2,
  Pencil,
  Percent,
  Search,
  UserRound,
  DollarSign,
  Calendar,
  Layers,
  Globe,
  CreditCard,
  IndianRupee,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { seedBooks } from "@/lib/catalogue-data";
import {
  SectionCard,
  Field,
  TextInput,
  SelectInput,
  Check,
  Switch,
  Radio,
  AutoDetectedBadge,
  UploadTile,
  SamplePreviewDialog,
  createCoverImageFromEbook,
  RichTextEditor,
  AuthorSearchResultCard,
  CategoryDialog,
  RentalDialog,
  calcSelling,
  slugify,
  initials,
  AUTHOR_DIRECTORY,
  TAKEN_AUTHOR_SLUGS,
  type SelectedAuthor,
  type RentalEntry,
} from "@/components/publisher/catalogue-form-shared";
import { UploadEBookFilesSection } from "./upload-ebook-section";
import { InstructionsAndGuidelinesSection } from "./instructions-guidelines-section";
import { EbookDetailsSection } from "./ebook-details-section";
import { AuthorDetailsSection } from "./author-details-section";
import { SelectCategoriesSection } from "./select-categories-section";

export function CompletePublisherCataloguePage({
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

  // eBook Metadata Details State
  const [title, setTitle] = useState(targetBook?.title || "Harry Potter");
  const [subtitle, setSubtitle] = useState("A Comprehensive Guide to Modern Spatial Living");
  const [isbn, setIsbn] = useState(targetBook?.isbn || "25455955");
  const [regionalName, setRegionalName] = useState(targetBook ? "സമകാലിക വാസ്തുശില്പം" : "Harry Potter");
  const [language, setLanguage] = useState(targetBook?.language || "English");
  const [publisherName, setPublisherName] = useState(targetBook?.publisher || "Kairali Books Press");
  const [pubDate, setPubDate] = useState("15/01/2024");
  const [paperbackDate, setPaperbackDate] = useState("20/08/2023");
  const [edition, setEdition] = useState("2nd International Edition");
  const [pageCount, setPageCount] = useState("348");
  const [sizeMB, setSizeMB] = useState("25.4");
  const [ageGroup, setAgeGroup] = useState("General / 16+");
  const [summary, setSummary] = useState(
    targetBook
      ? `Comprehensive edition of ${targetBook.title}. Explores fundamental principles, critical analysis, and modern relevance in contemporary literature.`
      : "Arun m",
  );
  const [tags, setTags] = useState<string[]>([
    "Promised Land 2024",
    "Barack Obama",
    "Barack Obama",
  ]);
  const [tagInput, setTagInput] = useState("");

  // Authors & Royalties State
  const [selectedAuthors, setSelectedAuthors] = useState<SelectedAuthor[]>(
    targetBook
      ? [
          {
            id: "sa-1",
            name: targetBook.author,
            books: 30,
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
            addAsNew: false,
            role: "Lead Author",
            royaltyPercentage: 70,
            profileSlug: slugify(targetBook.author),
          },
        ]
      : [],
  );

  // Storefront URL State
  const [bookUrlSlug, setBookUrlSlug] = useState(
    targetBook ? slugify(targetBook.title) : "contemporary-architecture-design",
  );
  const [urlCopied, setUrlCopied] = useState(false);

  // Store Categories State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string[]>>({
    "Academic & Educational": ["Higher Education", "Engineering & Tech"],
    Reference: ["Policy Documents"],
  });

  // Payment & Monetization State
  const [pricingModel, setPricingModel] = useState<"free" | "paid">("paid");
  const [taxRate, setTaxRate] = useState("5%");
  const [gstConfirmed, setGstConfirmed] = useState(true);
  const [renewalPercentage, setRenewalPercentage] = useState("12");

  // Commercial Pricing State
  const [unitExGST, setUnitExGST] = useState(targetBook?.price ? Math.round(targetBook.price * 80) : 340);
  const [unitIncGST, setUnitIncGST] = useState(targetBook?.price ? Math.round(targetBook.price * 84) : 357);
  const [offerPrice, setOfferPrice] = useState(targetBook?.price ? Math.round(targetBook.price * 75) : 320);

  // Commercial Rental Plans State
  const [rentalEnabled, setRentalEnabled] = useState(true);
  const [rentalDialogOpen, setRentalDialogOpen] = useState(false);
  const [rentalEntries, setRentalEntries] = useState<RentalEntry[]>([
    { id: "r1", year: "1 Year", days: "30 Days", unit: 99, offer: 79 },
    { id: "r2", year: "2 Year", days: "60 Days", unit: 169, offer: 139 },
  ]);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const finalSellingPrice = useMemo(() => {
    if (pricingModel === "free") return "0.00";
    return calcSelling(unitExGST, offerPrice);
  }, [pricingModel, unitExGST, offerPrice]);

  const handleGenerateSample = () => {
    if (!ebookFile) return;
    const generatedSample = new File(
      [ebookFile],
      `Sample_${ebookFile.name.replace(/\.[^/.]+$/, "")}.epub`,
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
      toast.success(`Cover image generated from eBook (Page ${selectedCoverPage}).`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate cover image.");
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const handleCopyStoreUrl = () => {
    const fullUrl = `https://pixelbooks.com/store/books/${bookUrlSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setUrlCopied(true);
    toast.success("Storefront book URL copied to clipboard!");
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const handleAddTag = () => {
    const val = tagInput.trim();
    if (!val || tags.includes(val)) return;
    if (tags.length >= 6) {
      toast.error("Maximum 6 tags allowed");
      return;
    }
    setTags([...tags, val]);
    setTagInput("");
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = (asDraft = false) => {
    if (!title.trim()) {
      toast.error("Please enter the eBook Title");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (asDraft) {
        toast.success(`"${title}" saved as draft in Complete Publisher catalogue.`);
      } else if (isEditMode) {
        toast.success(`eBook listing "${title}" updated successfully.`);
      } else {
        toast.success(`eBook "${title}" submitted to editorial review board.`);
      }
      setTimeout(() => {
        navigate({ to: "/publisher/catalogue" });
      }, 1200);
    }, 800);
  };

  const guidelinesList = [
    {
      icon: <HardDrive size={18} />,
      title: "File Integrity & Size Limit",
      desc: "Keep files under 30 MB. Valid formats are EPUB 3.0 and optimized PDF manuscripts.",
    },
    {
      icon: <Info size={18} />,
      title: "Storefront Metadata Accuracy",
      desc: "Provide full bibliographic data including ISBN, synopsis, and author attribution for store indexing.",
    },
    {
      icon: <Tag size={18} />,
      title: "Retail Pricing & Tax Slab",
      desc: "Specify base retail price. E-books with existing print versions are subject to 5% GST.",
    },
    {
      icon: <CheckCircle size={18} />,
      title: "Editorial & Quality Review",
      desc: "All commercial submissions undergo quality assurance before appearing live on PixelBooks retail storefront.",
    },
  ];

  return (
    <AppShell
      title={isEditMode ? "Edit eBook Listing" : "Add New eBook Listing"}
      subtitle="Retail Storefront & Direct Distribution"
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
            <p className="text-xs text-muted-foreground">Manage your commercial titles</p>
          </div>
        </div>

        {/* Edit Mode Alert Banner */}
        {isEditMode && (
          <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-medium text-amber-700 dark:text-amber-400 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-amber-500 shrink-0" />
              <span>
                Editing Commercial Listing: <strong>{targetBook?.title ?? title}</strong> (ID:{" "}
                <code className="font-mono">{editBookId}</code>)
              </span>
            </div>
            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {targetBook?.status ?? "Active Listing"}
            </span>
          </div>
        )}

        <div className="space-y-6">
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
            setTitle={(v) => {
              setTitle(v);
              if (!isEditMode) setBookUrlSlug(slugify(v));
            }}
            isbn={isbn}
            setIsbn={setIsbn}
            regionalName={regionalName}
            setRegionalName={setRegionalName}
            language={language}
            setLanguage={setLanguage}
            pubDate={pubDate}
            setPubDate={setPubDate}
            paperbackDate={paperbackDate}
            setPaperbackDate={setPaperbackDate}
            ebookSize={sizeMB}
            setEbookSize={setSizeMB}
            summary={summary}
            setSummary={setSummary}
            tags={tags}
            setTags={setTags}
          />

          {/* ── SECTION 4: AUTHORS DETAILS ──────────────────────────────────── */}
          <AuthorDetailsSection
            selectedAuthors={selectedAuthors}
            setSelectedAuthors={setSelectedAuthors}
            domainPrefix="https://azdevlibcustomer.pixelbooksapp.com/author/"
            isCompletePublisher
          />

          {/* ── SECTION 5: STOREFRONT DIRECT URL ───────────────────────────── */}
          <SectionCard
            icon={
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 shrink-0 shadow-2xs">
                <Globe size={16} strokeWidth={2} />
              </div>
            }
            title="Storefront Web Purchase URL"
            description="Set a memorable vanity URL readers and authors can use to share this book directly."
          >
            <Field label="Custom eBook Store URL Slug" hint="Direct link: https://pixelbooks.com/store/books/[slug]">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
                  <span className="flex items-center bg-secondary/50 px-3.5 text-xs font-medium text-muted-foreground border-r border-border">
                    pixelbooks.com/store/books/
                  </span>
                  <input
                    type="text"
                    value={bookUrlSlug}
                    onChange={(e) => setBookUrlSlug(slugify(e.target.value))}
                    className="h-12 flex-1 bg-transparent px-3 text-sm text-foreground outline-none font-medium"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCopyStoreUrl}
                  className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer shadow-2xs"
                >
                  {urlCopied ? (
                    <>
                      <CheckCircle size={14} className="text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon size={14} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </Field>
          </SectionCard>

          {/* ── SECTION 6: SELECT CATEGORIES ───────────────────────────────── */}
          <SelectCategoriesSection
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            onOpenModal={() => setCategoryModalOpen(true)}
          />

          {/* ── SECTION 7: PAYMENT DETAILS & TAX ────────────────────────────── */}
          <SectionCard
            icon={
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40 shrink-0 shadow-2xs">
                <CreditCard size={16} strokeWidth={2} />
              </div>
            }
            title="Payment Model &amp; Monetization"
            description="Configure pricing structure, tax classification, and ongoing license renewals."
          >
            <div className="space-y-4">
              <div>
                <span className="mb-2 block text-xs font-semibold text-muted-foreground">
                  eBook Pricing Model
                </span>
                <div className="flex items-center gap-6">
                  <Radio
                    checked={pricingModel === "free"}
                    onChange={() => setPricingModel("free")}
                    label={<span className="font-semibold">Free Title (Promotional)</span>}
                  />
                  <Radio
                    checked={pricingModel === "paid"}
                    onChange={() => setPricingModel("paid")}
                    label={<span className="font-semibold">Paid Commercial Publication</span>}
                  />
                </div>
              </div>

              {pricingModel === "paid" && (
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <Field label="Applicable GST Tax Slab">
                    <SelectInput value={taxRate} onChange={(e) => setTaxRate(e.target.value)}>
                      <option value="0%">0% (Zero Rated)</option>
                      <option value="5%">5% (Print + Digital Concession)</option>
                      <option value="12%">12% (Standard Electronic Service)</option>
                      <option value="18%">18% (Commercial Digital Services)</option>
                    </SelectInput>
                  </Field>

                  <Field label="Lifetime Purchase Renewal %">
                    <TextInput
                      value={renewalPercentage}
                      onChange={(e) => setRenewalPercentage(e.target.value)}
                      placeholder="e.g. 12"
                    />
                  </Field>
                </div>
              )}

              <Check
                checked={gstConfirmed}
                onChange={setGstConfirmed}
                label={
                  <span className="text-xs text-muted-foreground">
                    I confirm this eBook has a corresponding ISBN registration and conforms to
                    applicable institutional publication tax codes.
                  </span>
                }
              />
            </div>
          </SectionCard>

          {/* ── SECTION 8: COMMERCIAL PRICE DETAILS ─────────────────────────── */}
          {pricingModel === "paid" && (
            <SectionCard
              icon={
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40 shrink-0 shadow-2xs">
                  <IndianRupee size={16} strokeWidth={2} />
                </div>
              }
              title="Retail Price Details"
              description="Calculate retail margin and promotional discounts for store customers."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Base Price (excl. GST)" required>
                  <TextInput
                    type="number"
                    value={unitExGST}
                    onChange={(e) => setUnitExGST(Number(e.target.value) || 0)}
                    className="font-bold text-right"
                  />
                </Field>

                <Field label="Catalog Retail Price (incl. GST)" required>
                  <TextInput
                    type="number"
                    value={unitIncGST}
                    onChange={(e) => setUnitIncGST(Number(e.target.value) || 0)}
                    className="font-bold text-right"
                  />
                </Field>

                <Field label="Promotional Offer Price (if any)">
                  <TextInput
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value) || 0)}
                    className="font-bold text-right"
                  />
                </Field>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-secondary/30 p-4 border border-border">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Effective Selling Price on PixelBooks Store
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Includes platform processing fee and GST distribution.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-[var(--brand)]">
                    ₹{finalSellingPrice}
                  </span>
                  {offerPrice > 0 && offerPrice < unitIncGST && (
                    <span className="text-xs text-muted-foreground line-through font-semibold">
                      ₹{unitIncGST}.00
                    </span>
                  )}
                </div>
              </div>
            </SectionCard>
          )}

          {/* ── SECTION 9: COMMERCIAL RENTAL PLANS ──────────────────────────── */}
          <SectionCard
            icon={
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/40 shrink-0 shadow-2xs">
                <Clock size={16} strokeWidth={2} />
              </div>
            }
            title="Commercial Rental Plans"
            description="Allow customers to rent this title for defined periods instead of outright purchase."
            right={
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Enable Rental</span>
                <Switch checked={rentalEnabled} onChange={setRentalEnabled} />
              </div>
            }
          >
            {rentalEnabled ? (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-xl border border-border bg-card">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30 text-left font-semibold uppercase text-muted-foreground">
                        <th className="p-3 pl-4">Rental Duration</th>
                        <th className="p-3">Period</th>
                        <th className="p-3">Unit Price</th>
                        <th className="p-3">Offer Price</th>
                        <th className="p-3">Customer Selling Price</th>
                        <th className="p-3 pr-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {rentalEntries.map((r) => (
                        <tr key={r.id} className="hover:bg-secondary/30">
                          <td className="p-3 pl-4 font-bold text-foreground">{r.year}</td>
                          <td className="p-3 text-muted-foreground">{r.days}</td>
                          <td className="p-3">₹{r.unit}.00</td>
                          <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                            ₹{r.offer}.00
                          </td>
                          <td className="p-3 font-bold text-[var(--brand)]">
                            ₹{calcSelling(r.unit, r.offer)}
                          </td>
                          <td className="p-3 pr-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setRentalEntries(rentalEntries.filter((x) => x.id !== r.id))
                              }
                              className="text-muted-foreground hover:text-rose-500 cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={() => setRentalDialogOpen(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-bold text-white shadow-2xs hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  <Plus size={14} /> Add / Configure Rental Tier
                </button>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-border">
                Rental feature is disabled for this publication. Readers must purchase lifetime access.
              </div>
            )}
          </SectionCard>

          {/* Submission Success Alert */}
          {isSuccess && (
            <div className="flex items-center gap-3 rounded-xl border border-teal-500/30 bg-teal-500/10 p-4 text-teal-700 dark:text-teal-300">
              <CheckCircle2 size={18} className="shrink-0" />
              <p className="text-sm font-semibold">
                {isEditMode
                  ? "Listing changes successfully saved! Redirecting to catalogue..."
                  : "eBook successfully submitted for retail review. Redirecting to catalogue..."}
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end border-t border-border/60 pt-4">
            <div className="flex flex-wrap items-center justify-end gap-2.5">
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
                      ? "Update eBook Listing"
                      : "Submit eBook for Review"}
                </span>
              </button>
            </div>
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
              toast.success("Sample preview approved and attached to listing.");
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

        {rentalDialogOpen && (
          <RentalDialog
            entries={rentalEntries}
            onClose={() => setRentalDialogOpen(false)}
            onSave={(rows) => setRentalEntries(rows)}
          />
        )}
      </div>
    </AppShell>
  );
}
