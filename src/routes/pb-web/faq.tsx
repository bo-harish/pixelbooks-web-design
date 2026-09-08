import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Info,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { PbWebHeader } from "@/components/pb-web-header";
import { PbWebFooter } from "@/components/pb-web-footer";

export const Route = createFileRoute("/pb-web/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — PixelBooks" },
      {
        name: "description",
        content: "Find answers to frequently asked questions about PixelBooks eBook reading, account setup, purchases, and device sync.",
      },
    ],
  }),
  component: PbWebFaqPage,
});

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

const faqData: FaqItem[] = [
  {
    id: "what-is-pixelbooks",
    question: "What is PixelBooks?",
    answer:
      "PixelBooks is a secure digital bookstore and reading app where you can discover, purchase, and read ebooks on your phone, tablet, or computer. All titles sync seamlessly with your cloud library for offline reading.",
    category: "General",
  },
  {
    id: "do-i-need-to-pay-to-sign-up",
    question: "Do I need to pay to sign up?",
    answer:
      "No, creating a PixelBooks account is completely free. You only pay for the individual eBooks or digital collections that you choose to purchase.",
    category: "General",
  },
  {
    id: "can-i-use-pixelbooks-on-multiple-devices",
    question: "Can I use PixelBooks on multiple devices?",
    answer:
      "Yes! You can access your digital library across your web browser, Android phone/tablet, and Apple iPad/iPhone. Your reading progress, bookmarks, and annotations sync automatically across all logged-in devices.",
    category: "Account & Devices",
  },
  {
    id: "how-do-i-sign-up-and-get-started",
    question: "How do I sign up and get started on PixelBooks?",
    answer:
      "Simply click on Sign In / Register in the top header. You can quickly register using your Mobile Number or Email ID. Once verified with a one-time passcode (OTP), your personal bookshelf is ready.",
    category: "Account & Devices",
  },
  {
    id: "can-i-buy-ebooks-without-signing-up",
    question: "Can I buy eBooks on PixelBooks without signing up?",
    answer:
      "To safeguard your digital licenses and ensure you can re-download your books anytime, an account is required before checkout. You can browse all genres and read free previews without logging in.",
    category: "Purchases & Licensing",
  },
  {
    id: "why-cant-i-purchase-books-directly-in-ios-app",
    question: "Why can’t I purchase books directly in the iPhone/iOS app?",
    answer:
      "Due to Apple App Store in-app purchase policies, direct eBook checkout is conducted via the PixelBooks web store. Once you purchase any title on the website, it instantly appears in your iOS app library ready to read.",
    category: "Purchases & Licensing",
  },
  {
    id: "do-i-need-the-internet-to-read-my-ebooks",
    question: "Do I need the internet to read my eBooks?",
    answer:
      "No! You only need an internet connection to download the book initially. Once downloaded to your reader app, you can read anywhere completely offline without any internet connection.",
    category: "Reading & Formats",
  },
  {
    id: "how-do-i-search-for-a-book-or-author",
    question: "How do I search for a book or author on PixelBooks?",
    answer:
      "Use the search bar at the top of any page to quickly look up book titles, authors, categories, or ISBN numbers. You can also filter by genres like Malayalam Literature, Academic Courseware, Poetry, and Competitive Exam Guides.",
    category: "General",
  },
  {
    id: "what-payment-methods-are-accepted",
    question: "What payment methods are accepted?",
    answer:
      "We accept all major Indian payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), and NetBanking across 50+ banks.",
    category: "Purchases & Licensing",
  },
  {
    id: "can-i-highlight-and-take-notes-in-ebooks",
    question: "Can I highlight and take notes inside eBooks?",
    answer:
      "Yes, the PixelBooks reader features a full interactive annotation toolkit. You can highlight passages in multiple colors, add personal study notes, bookmark pages, and adjust text sizes, fonts, and dark mode themes.",
    category: "Reading & Formats",
  },
];

function PbWebFaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  // By default, open the first question to mirror the screenshot design
  const [openIds, setOpenIds] = useState<string[]>(["what-is-pixelbooks"]);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return faqData;
    return faqData.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col justify-between pb-web-portal">
      {/* Universal Header */}
      <PbWebHeader />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-7">
        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            FAQ
          </h1>
        </div>

        {/* Informational Banner with brand Dark Green tone - compact */}
        <div className="rounded-xl border border-[#0e5b50] bg-gradient-to-r from-[#137365] to-[#0e5b50] px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-start sm:items-center gap-2.5 shadow-2xs text-white">
          <Info size={16} className="text-emerald-300 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-[13px] leading-snug sm:leading-normal text-emerald-50/95">
            <span className="font-bold text-white">Note:</span> These FAQs apply to both the PixelBooks mobile app and web version. Everything works the same; the only difference is how you access it—through the app or a browser.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a question"
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-pbgreen-border/80 bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/70 shadow-2xs focus:outline-none focus:border-pbgreen focus:ring-1 focus:ring-pbgreen transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer px-1 py-0.5"
            >
              Clear
            </button>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-pbgreen-border bg-neutral-50/60 p-10 text-center space-y-3">
              <HelpCircle size={32} className="mx-auto text-muted-foreground/60" />
              <div className="text-sm font-bold text-foreground">No questions found matching "{searchQuery}"</div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Can't find what you're looking for? Reach out to our direct support team and we'll be glad to help.
              </p>
              <div className="pt-2">
                <Link
                  to="/pb-web/support"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[var(--brand)] shadow-2xs hover:opacity-90 transition-opacity"
                >
                  <MessageSquare size={14} /> Contact Support
                </Link>
              </div>
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isOpen = openIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen
                    ? "border-pbgreen-border bg-white ring-2 ring-pbgreen-light shadow-xs"
                    : "border-pbgreen-border/70 bg-white hover:border-pbgreen-border hover:bg-neutral-50/40"
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left cursor-pointer transition-colors"
                  >
                    <span
                      className={`text-sm sm:text-[15px] font-semibold transition-colors ${isOpen ? "text-foreground font-bold" : "text-foreground"
                        }`}
                    >
                      {item.question}
                    </span>
                    <div className="shrink-0 text-muted-foreground">
                      {isOpen ? (
                        <ChevronDown size={18} className="text-foreground" />
                      ) : (
                        <ChevronRight size={18} className="text-muted-foreground/70" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-pbgreen-border/40 mt-1 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Banner */}
        <div className="rounded-2xl border border-pbgreen-border bg-gradient-to-br from-pbgreen-light/90 via-pbgreen-light/35 to-emerald-50/20 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs mt-10">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-foreground">Still have questions?</h3>
            <p className="text-xs text-slate-600">
              Can’t find the answer you’re looking for? Our friendly support team is here to assist.
            </p>
          </div>
          <Link
            to="/pb-web/support"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[var(--brand)] text-xs font-semibold text-white shadow-2xs hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
          >
            <span>Reach Support Desk</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      {/* Reusable Footer */}
      <PbWebFooter />
    </div>
  );
}
