import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Bookmark,
  Star,
  Receipt,
  Settings,
  LogOut,
  ArrowLeft,
  Camera,
  ChevronRight,
  Sparkles,
  Check,
  X,
  CreditCard,
  Laptop,
  Smartphone,
  KeyRound,
  ExternalLink,
  Award,
  SlidersHorizontal,
  ChevronDown,
  Globe,
  Share2,
  PenLine,
  Copy,
  MessageSquare,
  Bell,
  BellRing,
  BellOff,
  Trash2,
  Search,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PbWebHeader } from "@/components/pb-web-header";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-web/accounts")({
  head: () => ({
    meta: [
      { title: "My Account — PixelBooks" },
      {
        name: "description",
        content: "Manage your PixelBooks reader profile, addresses, digital library, and preferences.",
      },
    ],
  }),
  component: PixelBooksAccountPage,
});

// Sample purchased books for My Library tab
const userLibraryBooks = [
  {
    id: "lib-1",
    title: "NEET Courseware Biology Class-XII",
    author: "Career Launcher / GKP",
    progress: 68,
    lastRead: "Yesterday",
    cover: "/images/covers/neet-biology.png",
    format: "Interactive eBook",
    isbn: "978-93-91067-15-9",
  },
  {
    id: "lib-2",
    title: "തെയ്യങ്ങൾ (Theyyangal)",
    author: "ടി.കെ.ഡി. മുഴപ്പിലങ്ങാട്",
    progress: 42,
    lastRead: "3 days ago",
    cover: "/images/covers/theyyam.jpg",
    format: "Digital Illustrated",
    isbn: "978-81-264-0013-1",
  },
  {
    id: "lib-3",
    title: "കേരളത്തിലെ നാടൻപാട്ടുകളും നാട്ടുവായത്താരികളും",
    author: "സത്യൻ കല്ലുരുട്ടി",
    progress: 100,
    lastRead: "Completed",
    cover: "/images/covers/kerala-boat-race.jpg",
    format: "ePub & Audio Notes",
    isbn: "978-81-264-0014-8",
  },
  {
    id: "lib-4",
    title: "പെണ്ണാഴങ്ങൾ (Pennaazhangal)",
    author: "ലിജി മാത്യു",
    progress: 15,
    lastRead: "Last week",
    cover: "/images/covers/pennaazhangal.jpg",
    format: "eBook Edition",
    isbn: "978-81-264-0016-2",
  },
  {
    id: "lib-5",
    title: "NEET Courseware Chemistry Class-XII",
    author: "Career Launcher Academic Group",
    progress: 85,
    lastRead: "4 days ago",
    cover: "/images/covers/neet-chemistry.png",
    format: "Interactive eBook",
    isbn: "978-93-91067-18-0",
  },
  {
    id: "lib-6",
    title: "Max Muller — India: What Can It Teach Us?",
    author: "Max Muller (വിവർത്തനം: കെ.കെ.സി. നായർ)",
    progress: 30,
    lastRead: "2 weeks ago",
    cover: "/images/covers/max-muller.jpg",
    format: "Historical Classic",
    isbn: "978-81-264-0021-6",
  },
  {
    id: "lib-7",
    title: "ഗുരുസമക്ഷം (Gurusamaksham)",
    author: "എം. സുകുമാരൻ",
    progress: 55,
    lastRead: "5 days ago",
    cover: "/images/covers/sukumar-azhikode.png",
    format: "Literary Essay",
    isbn: "978-81-264-0025-4",
  },
  {
    id: "lib-8",
    title: "ആറന്മുള വള്ളംകളി ചരിത്രം (Aranmula Vallamkali)",
    author: "ഡോ. കെ.എസ്. രവി",
    progress: 10,
    lastRead: "Last month",
    cover: "/images/covers/kerala-boat-race.jpg",
    format: "Cultural Heritage",
    isbn: "978-81-264-0030-8",
  },
];

// Sample wishlist books
const userWishlistBooks = [
  {
    id: "wish-1",
    title: "Max Muller — India: What Can It Teach Us?",
    author: "Max Muller (വിവർത്തനം: കെ.കെ.സി. നായർ)",
    price: "₹340",
    cover: "/images/covers/max-muller.jpg",
    tag: "History & Classics",
  },
  {
    id: "wish-2",
    title: "NEET Courseware Chemistry Class-XII",
    author: "Career Launcher Academic Group",
    price: "₹495",
    cover: "/images/covers/neet-chemistry.png",
    tag: "Essential Courseware",
  },
];

// Sample order history with book cover image and author name
const userOrders = [
  {
    id: "ORD-89241",
    date: "August 28, 2026",
    total: "₹835",
    status: "Delivered & Active",
    paymentMethod: "UPI · GPay",
    items: [
      {
        id: "lib-1",
        title: "NEET Courseware Biology Class-XII",
        author: "Career Launcher / GKP",
        cover: "/images/covers/neet-biology.png",
        format: "Interactive eBook",
        price: "₹495",
        license: "Perpetual Academic License",
      },
      {
        id: "lib-2",
        title: "തെയ്യങ്ങൾ (Theyyangal)",
        author: "ടി.കെ.ഡി. മുഴപ്പിലങ്ങാട്",
        cover: "/images/covers/theyyam.jpg",
        format: "Digital Illustrated",
        price: "₹340",
        license: "Standard Personal License",
      },
    ],
  },
  {
    id: "ORD-74190",
    date: "July 14, 2026",
    total: "₹360",
    status: "Delivered & Active",
    paymentMethod: "Visa ending in 4242",
    items: [
      {
        id: "lib-3",
        title: "കേരളത്തിലെ നാടൻപാട്ടുകളും നാട്ടുവായത്താരികളും",
        author: "സത്യൻ കല്ലുരുട്ടി",
        cover: "/images/covers/kerala-boat-race.jpg",
        format: "ePub & Audio Notes",
        price: "₹360",
        license: "Standard Personal License",
      },
    ],
  },
  {
    id: "ORD-62814",
    date: "June 02, 2026",
    total: "₹385",
    status: "Delivered & Active",
    paymentMethod: "NetBanking · HDFC",
    items: [
      {
        id: "lib-4",
        title: "പെണ്ണാഴങ്ങൾ (Pennaazhangal)",
        author: "ലിജി മാത്യു",
        cover: "/images/covers/pennaazhangal.jpg",
        format: "eBook Edition",
        price: "₹385",
        license: "Standard Personal License",
      },
    ],
  },
];

// eBook genres for user recommendations (matches modal options)
const allRecommendationGenres = [
  "Academic & Educational",
  "Articles",
  "Autobiography",
  "Biography",
  "Children's Literature",
  "Cinema",
  "Crime, Thriller, Mystery",
  "Cultural Studies",
  "Drama",
  "Epic",
  "Essay",
  "Fiction",
  "Folklore",
  "Graphology",
  "Health Science",
  "History",
  "Humour & Romance",
  "JEE",
  "Lifestyle & Personal Interest",
  "Literature & Poems",
  "Malayalam Fiction",
  "Malayalam Literature",
  "Memoirs",
  "Motivation",
  "NEET",
  "Non-Fiction",
  "Novels",
  "Performing Arts",
  "Philosophy",
  "Policies",
  "Reference",
  "Regional & Language-Based Literature",
  "Short Stories",
  "Sports Thriller Fiction",
  "Stories",
  "Studies",
  "Study Abroad",
  "Travel & Tourism",
];

type AccountTab = "profile" | "library" | "wishlist" | "orders" | "settings";

type UserLibraryBook = (typeof userLibraryBooks)[number];

interface BookReview {
  rating: number;
  headline: string;
  comment: string;
  date: string;
}

function CustomCheckbox({
  id,
  checked,
  onChange,
  disabled = false,
  className = "",
}: {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
      className={`h-4.5 w-4.5 shrink-0 rounded-md border flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 select-none ${
        checked
          ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-2xs"
          : "border-border/80 bg-background hover:border-[var(--brand)]/60"
      } ${className}`}
    >
      {checked && <Check className="h-3.5 w-3.5 stroke-[3] text-white" />}
    </button>
  );
}

function PixelBooksAccountPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [cartCount, setCartCount] = useState(2);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isSaving, setIsSaving] = useState(false);

  // Library Search & Pagination State
  const [librarySearchQuery, setLibrarySearchQuery] = useState("");
  const [libraryCurrentPage, setLibraryCurrentPage] = useState(1);
  const libraryItemsPerPage = 4;

  const filteredLibraryBooks = userLibraryBooks.filter((b) => {
    if (!librarySearchQuery.trim()) return true;
    const q = librarySearchQuery.toLowerCase().trim();
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q)
    );
  });

  const totalLibraryPages = Math.max(1, Math.ceil(filteredLibraryBooks.length / libraryItemsPerPage));
  const paginatedLibraryBooks = filteredLibraryBooks.slice(
    (libraryCurrentPage - 1) * libraryItemsPerPage,
    libraryCurrentPage * libraryItemsPerPage
  );

  // Share & Review State
  const [selectedShareBook, setSelectedShareBook] = useState<UserLibraryBook | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const [selectedReviewBook, setSelectedReviewBook] = useState<UserLibraryBook | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewHeadline, setReviewHeadline] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRecommend, setReviewRecommend] = useState(true);

  // Notification Preferences State
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [orderAlertsEnabled, setOrderAlertsEnabled] = useState(true);
  const [newReleaseAlertsEnabled, setNewReleaseAlertsEnabled] = useState(false);

  // Recommendation Genres & User Data State (Matches Settings screenshot)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    "Biography",
    "Drama",
    "Travel & Tourism",
  ]);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [isDeleteDataModalOpen, setIsDeleteDataModalOpen] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSaveGenres = () => {
    setIsGenreModalOpen(false);
    toast.success(`Updated preferences with ${selectedGenres.length} genres!`);
  };

  const handleDeleteUserData = () => {
    setSelectedGenres([]);
    setIsDeleteDataModalOpen(false);
    toast.error("User reading cache, search history, and recommendation profile wiped.");
  };

  const [reviews, setReviews] = useState<Record<string, BookReview>>({
    "lib-3": {
      rating: 5,
      headline: "Authentic Kerala folklore collection",
      comment: "Linguistically rich and historically faithful. An invaluable addition to my digital library.",
      date: "Aug 20, 2026",
    },
  });

  const handleOpenShareModal = (book: UserLibraryBook) => {
    setSelectedShareBook(book);
    setIsLinkCopied(false);
    setIsShareModalOpen(true);
  };

  const handleCopyShareLink = () => {
    if (!selectedShareBook) return;
    const shareUrl = `https://pixelbooks.com/book/${selectedShareBook.id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setIsLinkCopied(true);
        toast.success(`Share link for "${selectedShareBook.title}" copied to clipboard!`);
        setTimeout(() => setIsLinkCopied(false), 2000);
      })
      .catch(() => {
        setIsLinkCopied(true);
        toast.success(`Share link for "${selectedShareBook.title}" copied!`);
      });
  };

  const handleOpenReviewModal = (book: UserLibraryBook) => {
    setSelectedReviewBook(book);
    const existing = reviews[book.id];
    if (existing) {
      setReviewRating(existing.rating);
      setReviewHeadline(existing.headline);
      setReviewComment(existing.comment);
    } else {
      setReviewRating(5);
      setReviewHeadline("");
      setReviewComment("");
    }
    setReviewRecommend(true);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedReviewBook) return;
    if (!reviewHeadline.trim()) {
      toast.error("Please enter a short headline for your review.");
      return;
    }
    setReviews((prev) => ({
      ...prev,
      [selectedReviewBook.id]: {
        rating: reviewRating,
        headline: reviewHeadline.trim(),
        comment: reviewComment.trim(),
        date: "Today",
      },
    }));
    setIsReviewModalOpen(false);
    toast.success(`Review for "${selectedReviewBook.title}" submitted successfully!`);
  };

  // Profile Form States (Matching reference profile)
  const [fullName, setFullName] = useState("Sudheer Menon");
  const [email, setEmail] = useState("harishknair@gmail.com");
  const [phone, setPhone] = useState("9387737551");
  const [bio, setBio] = useState("Lifelong reader, STEM educator, and collector of regional folklore & literature.");

  // Address Form States
  const [addressLine1, setAddressLine1] = useState("No 4");
  const [addressLine2, setAddressLine2] = useState("Sophia Emerald");
  const [city, setCity] = useState("Kochi");
  const [stateVal, setStateVal] = useState("Kerala");
  const [pincode, setPincode] = useState("682033");

  // Preferences
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(["Malayalam", "English"]);

  const toggleLanguage = (lang: string) => {
    setPreferredLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile details and address updated successfully!");
    }, 600);
  };

  const handleDiscard = () => {
    setFullName("Sudheer Menon");
    setEmail("harishknair@gmail.com");
    setPhone("9387737551");
    setAddressLine1("No 4");
    setAddressLine2("Sophia Emerald");
    setCity("Kochi");
    setStateVal("Kerala");
    setPincode("682033");
    toast.info("Changes reverted to saved profile values.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* Universal pb-web Top Header */}
      <PbWebHeader
        cartCount={cartCount}
        unreadNotifications={unreadNotifications}
      />

      {/* Main Account Dashboard Layout */}
      <main className="mx-auto w-full max-w-7xl 2xl:max-w-[1500px] px-4 sm:px-8 md:px-12 py-8 flex-1">
        {/* Back Link & Breadcrumbs */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/pb-web/genre"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Back to Book Store
          </Link>
          <div className="text-xs text-muted-foreground">
            Account / <span className="font-semibold text-foreground capitalize">{activeTab}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Unified Account Navigation Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
            {/* User Profile Summary Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
              {/* Subtle brand ambient header glow */}
              <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[var(--brand)]/10 to-transparent pointer-events-none" />

              <div className="relative mt-2 mb-3">
                <img
                  src="/images/harish-avatar.png"
                  alt="Harish K"
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-background shadow-md"
                />
                <button
                  type="button"
                  onClick={() => toast.info("Photo upload opened. Select an image file.")}
                  title="Change avatar"
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[var(--brand)] text-white shadow-md hover:opacity-90 transition-opacity cursor-pointer ring-2 ring-background"
                >
                  <Camera size={13} />
                </button>
              </div>

              <h2 className="text-base font-extrabold text-foreground">{fullName}</h2>
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{email}</p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  Member since 2024
                </span>
              </div>

              {/* Quick Reader Stats */}
              <div className="mt-5 w-full grid grid-cols-2 gap-2 border-t border-border/80 pt-4 text-center">
                <div>
                  <div className="text-sm font-bold text-foreground">{userLibraryBooks.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Books</div>
                </div>
                <div className="border-l border-border/80">
                  <div className="text-sm font-bold text-foreground">{userWishlistBooks.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Saved</div>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation Menu */}
            <nav className="rounded-2xl border border-border bg-card p-2 shadow-xs space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-[var(--brand)] text-white shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <User size={16} />
                  <span>Profile & Addresses</span>
                </div>
                <ChevronRight size={14} className={activeTab === "profile" ? "opacity-100" : "opacity-40"} />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "library"
                    ? "bg-[var(--brand)] text-white shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={16} />
                  <span>My Digital Library</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === "library" ? "bg-white/20 text-white" : "bg-secondary text-foreground"
                  }`}
                >
                  {userLibraryBooks.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "wishlist"
                    ? "bg-[var(--brand)] text-white shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bookmark size={16} />
                  <span>Want to Read</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === "wishlist" ? "bg-white/20 text-white" : "bg-secondary text-foreground"
                  }`}
                >
                  {userWishlistBooks.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-[var(--brand)] text-white shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Receipt size={16} />
                  <span>Purchase History</span>
                </div>
                <ChevronRight size={14} className={activeTab === "orders" ? "opacity-100" : "opacity-40"} />
              </button>


              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-[var(--brand)] text-white shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={16} />
                  <span>Security & Settings</span>
                </div>
                <ChevronRight size={14} className={activeTab === "settings" ? "opacity-100" : "opacity-40"} />
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.info("Logged out successfully.");
                    navigate({ to: "/" });
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Right Column: Active Tab Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* TAB 1: PROFILE & ADDRESSES */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Personal Information Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <div className="pb-4 border-b border-border/70 mb-5">
                    <h3 className="text-base font-bold text-foreground">Personal Details</h3>
                    <p className="text-xs text-muted-foreground">
                      Your identity and verified communication channels across PixelBooks
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name (Direct Match to User Screenshot) */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        Full Name <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full h-12 px-4 rounded-xl border border-input bg-card text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-bold text-foreground">
                          Phone Number <span className="text-red-500 font-bold ml-0.5">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <Check size={12} strokeWidth={2.5} /> Verified
                          </span>
                          <button
                            type="button"
                            onClick={() => toast.info("SMS verification code sent to " + phone)}
                            className="text-xs font-bold text-[var(--brand)] hover:underline cursor-pointer"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9387737551"
                        className="w-full h-12 px-4 rounded-xl border border-input bg-card text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                      />
                    </div>

                    {/* Email ID */}
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-bold text-foreground">
                          Email ID <span className="text-red-500 font-bold ml-0.5">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <Check size={12} strokeWidth={2.5} /> Verified
                          </span>
                          <button
                            type="button"
                            onClick={() => toast.info("Email verification link sent to " + email)}
                            className="text-xs font-bold text-[var(--brand)] hover:underline cursor-pointer"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@example.com"
                        className="w-full h-12 px-4 rounded-xl border border-input bg-card text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                      />
                    </div>

                    {/* Reader Bio */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-foreground mb-2">
                        Reader Bio / Interests
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Share a short bio or genres you love to read..."
                        className="w-full p-4 rounded-xl border border-input bg-card text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery & Invoicing Address Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <div className="pb-4 border-b border-border/70 mb-5">
                    <h3 className="text-base font-bold text-foreground">Address & Invoicing</h3>
                    <p className="text-xs text-muted-foreground">
                      Shipping address for print titles and institutional billing receipts
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Address 1 */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        House / Flat / Door No. (Address 1) <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="e.g. No 4"
                        className="w-full h-12 px-4 rounded-xl border border-input bg-card text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                      />
                    </div>

                    {/* Address 2 */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        Apartment / Landmark (Address 2)
                      </label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="e.g. Sophia Emerald"
                        className="w-full h-12 px-4 rounded-xl border border-input bg-card text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        City <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Kochi"
                        className="w-full h-12 px-4 rounded-xl border border-input bg-card text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                      />
                    </div>

                    {/* State Dropdown */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        State <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={stateVal}
                          onChange={(e) => setStateVal(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-input bg-card text-sm font-medium text-foreground focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all appearance-none cursor-pointer pr-10"
                        >
                          <option value="Kerala">Kerala</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                          <option value="West Bengal">West Bengal</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Postal Pincode */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        Postal Pincode <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 682033"
                        className="w-full h-12 px-4 rounded-xl border border-input bg-card text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Action Controls (Clean bottom bar) */}
                <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-xs">
                  <div className="text-xs text-muted-foreground">
                    Last modified: <span className="font-semibold text-foreground">Today at 12:45 PM</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleDiscard}
                      className="h-10 px-4 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-5 text-xs font-semibold text-white shadow-2xs hover:bg-[var(--brand)]/90 transition-colors cursor-pointer"
                    >
                      {isSaving ? (
                        <>
                          <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MY DIGITAL LIBRARY */}
            {activeTab === "library" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70 mb-5">
                    <div>
                      <h3 className="text-base font-bold text-foreground">My Digital Library</h3>
                      <p className="text-xs text-muted-foreground">
                        Your permanent digital editions, bookmarks, and reading progress
                      </p>
                    </div>
                    <Link
                      to="/pb-web/genre"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold shadow-2xs hover:bg-[var(--brand)]/90 transition-colors w-fit"
                    >
                      <BookOpen size={13} /> Browse More Books
                    </Link>
                  </div>

                  {/* Search Toolbar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-5">
                    <div className="relative flex-1 max-w-md">
                      <Search
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Search books by title, author, or ISBN..."
                        value={librarySearchQuery}
                        onChange={(e) => {
                          setLibrarySearchQuery(e.target.value);
                          setLibraryCurrentPage(1);
                        }}
                        className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-9 text-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] text-foreground"
                      />
                      {librarySearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setLibrarySearchQuery("");
                            setLibraryCurrentPage(1);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 cursor-pointer"
                          title="Clear search"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground font-medium self-end sm:self-center">
                      Showing <span className="font-semibold text-foreground">{filteredLibraryBooks.length}</span> {filteredLibraryBooks.length === 1 ? "book" : "books"}
                    </div>
                  </div>

                  {/* Book Cards Grid or Empty State */}
                  {paginatedLibraryBooks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border py-12 px-4 text-center">
                      <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="text-sm font-semibold text-foreground">No books found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {librarySearchQuery
                          ? `No books matching "${librarySearchQuery}". Try another keyword or ISBN.`
                          : "Your digital library is currently empty."}
                      </p>
                      {librarySearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setLibrarySearchQuery("");
                            setLibraryCurrentPage(1);
                          }}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition-colors cursor-pointer"
                        >
                          <X size={13} />
                          <span>Clear search</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {paginatedLibraryBooks.map((b) => (
                        <div
                          key={b.id}
                          className="rounded-xl border border-border bg-card p-4 shadow-2xs hover:border-[var(--brand)]/40 transition-all flex flex-col justify-between"
                        >
                          <div className="flex gap-4">
                            <img
                              src={b.cover}
                              alt={b.title}
                              className="h-32 w-22 shrink-0 rounded-lg object-cover shadow-sm border border-border"
                            />
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                {reviews[b.id] && (
                                  <div className="flex items-center justify-end mb-1">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                                      <Star size={10} className="fill-amber-400 text-amber-400" /> {reviews[b.id].rating}.0
                                    </span>
                                  </div>
                                )}
                                <h4 className="text-xs font-bold text-foreground line-clamp-2 mt-1.5 leading-tight">
                                  {b.title}
                                </h4>
                                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">by {b.author}</p>
                                <p className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">ISBN: {b.isbn}</p>
                              </div>

                              <div className="space-y-1.5 pt-2">
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                  <span>Progress: {b.progress}%</span>
                                  <span>{b.lastRead}</span>
                                </div>
                                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-[var(--brand)] h-full rounded-full transition-all"
                                    style={{ width: `${b.progress}%` }}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toast.success(`Opening "${b.title}" in reader...`)}
                                  className="w-full mt-1.5 py-1.5 rounded-lg bg-secondary hover:bg-[var(--brand)] hover:text-white text-xs font-semibold text-foreground transition-colors cursor-pointer"
                                >
                                  {b.progress === 100 ? "Read Again" : "Continue Reading"}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Review quote snippet if present */}
                          {reviews[b.id] && (
                            <div className="mt-2.5 pt-2 border-t border-border/50 text-[11px] text-muted-foreground bg-muted/40 p-2 rounded-lg">
                              <span className="font-semibold text-foreground">"{reviews[b.id].headline}"</span>
                              <p className="line-clamp-1 italic mt-0.5 text-[10.5px]">
                                {reviews[b.id].comment}
                              </p>
                            </div>
                          )}

                          {/* Actions: Share & Write a Review */}
                          <div className="flex items-center gap-2 pt-3 border-t border-border/70 mt-3">
                            <button
                              type="button"
                              onClick={() => handleOpenShareModal(b)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground transition-colors cursor-pointer"
                              title="Share this book"
                            >
                              <Share2 size={13} className="text-muted-foreground" />
                              <span>Share</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenReviewModal(b)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground transition-colors cursor-pointer"
                              title="Write or edit review"
                            >
                              <PenLine size={13} className="text-amber-500" />
                              <span>{reviews[b.id] ? "Edit Review" : "Write a Review"}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination Footer */}
                  {filteredLibraryBooks.length > 0 && (
                    <div className="flex flex-col gap-3 border-t border-border/70 pt-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground font-medium">
                        Showing {(libraryCurrentPage - 1) * libraryItemsPerPage + 1} to{" "}
                        {Math.min(libraryCurrentPage * libraryItemsPerPage, filteredLibraryBooks.length)} of {filteredLibraryBooks.length} books
                      </p>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setLibraryCurrentPage(1)}
                          disabled={libraryCurrentPage === 1}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          title="First Page"
                        >
                          <ChevronsLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setLibraryCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={libraryCurrentPage === 1}
                          className="flex h-8 px-2.5 items-center justify-center rounded-lg border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Prev
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalLibraryPages }, (_, i) => i + 1).map((pg) => (
                          <button
                            key={pg}
                            type="button"
                            onClick={() => setLibraryCurrentPage(pg)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              pg === libraryCurrentPage
                                ? "bg-[var(--brand)] text-white shadow-2xs"
                                : "border border-border bg-card text-foreground hover:bg-secondary"
                            }`}
                          >
                            {pg}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => setLibraryCurrentPage((p) => Math.min(totalLibraryPages, p + 1))}
                          disabled={libraryCurrentPage === totalLibraryPages}
                          className="flex h-8 px-2.5 items-center justify-center rounded-lg border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Next
                        </button>
                        <button
                          type="button"
                          onClick={() => setLibraryCurrentPage(totalLibraryPages)}
                          disabled={libraryCurrentPage === totalLibraryPages}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          title="Last Page"
                        >
                          <ChevronsRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: WANT TO READ (WISHLIST) */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-border/70 mb-6">
                    <div>
                      <h3 className="text-base font-bold text-foreground">Want to Read</h3>
                      <p className="text-xs text-muted-foreground">
                        Books saved to your personal queue for future study or leisure
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{userWishlistBooks.length} titles</span>
                  </div>

                  <div className="space-y-3">
                    {userWishlistBooks.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-border bg-background p-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.cover}
                            alt={item.title}
                            className="h-20 w-14 rounded-md object-cover border border-border shadow-xs"
                          />
                          <div>
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                              {item.tag}
                            </span>
                            <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">by {item.author}</p>
                            <span className="text-xs font-extrabold text-[var(--brand)] mt-1 block">
                              {item.price}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCartCount((c) => c + 1);
                              toast.success(`"${item.title}" added to cart!`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold shadow-xs hover:opacity-95"
                          >
                            Add to Cart
                          </button>
                          <button
                            type="button"
                            onClick={() => toast.info("Item removed from reading list")}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ORDERS & PURCHASE HISTORY */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <div className="pb-4 border-b border-border/70 mb-6">
                    <h3 className="text-base font-bold text-foreground">Purchase History</h3>
                    <p className="text-xs text-muted-foreground">
                      Invoices, GST receipts, and transaction records for your eBook licenses
                    </p>
                  </div>

                  <div className="space-y-4">
                    {userOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="rounded-xl border border-border bg-background p-5 space-y-4 shadow-2xs"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-foreground font-mono">{ord.id}</span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                                <CheckCircle2 size={11} /> {ord.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                              <span>Ordered on {ord.date}</span>
                              <span>•</span>
                              <span>{ord.paymentMethod}</span>
                              <span>•</span>
                              <span>{ord.items.length} {ord.items.length === 1 ? "eBook" : "eBooks"}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <div className="text-right">
                              <span className="text-[10px] text-muted-foreground block">Order Total</span>
                              <span className="text-sm font-extrabold text-foreground">{ord.total}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toast.success(`Downloading tax invoice for ${ord.id}...`)}
                              className="text-xs font-semibold text-[var(--brand)] hover:underline flex items-center gap-1 py-1.5 px-3 rounded-lg border border-border bg-background hover:bg-secondary transition-colors cursor-pointer"
                            >
                              <Receipt size={13} /> Download Invoice
                            </button>
                          </div>
                        </div>

                        {/* Order Items with Book Cover Image and Author Name */}
                        <div className="space-y-2.5">
                          {ord.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-4 p-3 rounded-xl bg-card border border-border/70 hover:border-[var(--brand)]/30 transition-all"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <img
                                  src={item.cover}
                                  alt={item.title}
                                  className="h-16 w-12 sm:h-18 sm:w-13 rounded-md object-cover border border-border shadow-2xs shrink-0"
                                />
                                <div className="min-w-0 space-y-0.5">
                                  {item.license && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] text-muted-foreground">
                                        {item.license}
                                      </span>
                                    </div>
                                  )}
                                  <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1">
                                    {item.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground truncate">
                                    by <span className="font-medium text-foreground">{item.author}</span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 shrink-0">
                                <span className="text-xs sm:text-sm font-bold text-foreground">{item.price}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab("library");
                                    toast.info(`Opening library for "${item.title}"`);
                                  }}
                                  className="text-xs font-semibold text-[var(--brand)] hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <BookOpen size={12} /> View in Library
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SECURITY & SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Settings & Reading Preferences Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <div className="pb-4 border-b border-border/70 mb-6">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Settings size={18} className="text-[var(--brand)]" />
                      Settings & Preferences
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Manage notification triggers, content recommendations, and data storage
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Option 1: Push Notifications */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-card gap-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`p-2.5 rounded-xl transition-colors ${
                            pushNotificationsEnabled
                              ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {pushNotificationsEnabled ? <BellRing size={20} /> : <BellOff size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">Push notifications</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                pushNotificationsEnabled
                                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                                  : "text-muted-foreground bg-secondary"
                              }`}
                            >
                              {pushNotificationsEnabled ? "On" : "Off"}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            Receive real-time desktop alerts for reader sync, order confirmations, and license deliveries
                          </div>
                        </div>
                      </div>

                      {/* On/Off Switch */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {pushNotificationsEnabled ? "On" : "Off"}
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={pushNotificationsEnabled}
                          onClick={() => {
                            const nextState = !pushNotificationsEnabled;
                            setPushNotificationsEnabled(nextState);
                            if (nextState) {
                              toast.success("Push notifications enabled!");
                            } else {
                              toast.info("Push notifications turned off.");
                            }
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 ${
                            pushNotificationsEnabled ? "bg-[var(--brand)]" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              pushNotificationsEnabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Sub-toggles for notification channels */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div
                        onClick={() => {
                          if (pushNotificationsEnabled) {
                            const next = !orderAlertsEnabled;
                            setOrderAlertsEnabled(next);
                            toast.success(`Order alerts ${next ? "turned on" : "turned off"}`);
                          }
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors cursor-pointer select-none ${
                          pushNotificationsEnabled
                            ? "border-border/80 bg-card hover:border-[var(--brand)]/50"
                            : "border-border/40 bg-secondary/30 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="text-xs font-semibold text-foreground">Order & License Alerts</div>
                          <div className="text-[10.5px] text-muted-foreground">
                            Instant popups when purchased licenses and GST receipts are ready
                          </div>
                        </div>
                        <CustomCheckbox
                          checked={orderAlertsEnabled && pushNotificationsEnabled}
                          disabled={!pushNotificationsEnabled}
                          onChange={(checked) => {
                            setOrderAlertsEnabled(checked);
                            toast.success(`Order alerts ${checked ? "turned on" : "turned off"}`);
                          }}
                        />
                      </div>

                      <div
                        onClick={() => {
                          if (pushNotificationsEnabled) {
                            const next = !newReleaseAlertsEnabled;
                            setNewReleaseAlertsEnabled(next);
                            toast.success(`New release alerts ${next ? "turned on" : "turned off"}`);
                          }
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors cursor-pointer select-none ${
                          pushNotificationsEnabled
                            ? "border-border/80 bg-card hover:border-[var(--brand)]/50"
                            : "border-border/40 bg-secondary/30 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="text-xs font-semibold text-foreground">New Releases & Discounts</div>
                          <div className="text-[10.5px] text-muted-foreground">
                            Alerts for wishlist author drops and seasonal courseware offers
                          </div>
                        </div>
                        <CustomCheckbox
                          checked={newReleaseAlertsEnabled && pushNotificationsEnabled}
                          disabled={!pushNotificationsEnabled}
                          onChange={(checked) => {
                            setNewReleaseAlertsEnabled(checked);
                            toast.success(`New release alerts ${checked ? "turned on" : "turned off"}`);
                          }}
                        />
                      </div>
                    </div>

                    {/* Option 2: Change Recommendation Genres */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-card gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="p-2.5 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] shrink-0">
                          <SlidersHorizontal size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">
                              Change Recommendation Genres
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
                              {selectedGenres.length} selected
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {selectedGenres.length > 0
                              ? selectedGenres.join(", ")
                              : "No genres selected yet"}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsGenreModalOpen(true)}
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--brand)] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-[var(--brand)]/90 transition-colors cursor-pointer shrink-0 self-end sm:self-center"
                      >
                        Change Genres
                      </button>
                    </div>

                    {/* Option 3: Delete User Data */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/30 dark:bg-rose-950/10 gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                          <Trash2 size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-rose-700 dark:text-rose-400">
                            Delete User Data
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            Permanently wipe your recommendation profile, recent search history, and offline reader cache
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsDeleteDataModalOpen(true)}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-rose-300 dark:border-rose-800 bg-card text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-2xs transition-colors cursor-pointer shrink-0 self-end sm:self-center px-4"
                      >
                        Delete Data
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security & Login Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <div className="pb-4 border-b border-border/70 mb-6">
                    <h3 className="text-base font-bold text-foreground">Security & Login</h3>
                    <p className="text-xs text-muted-foreground">
                      Manage your password credentials and account security
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-3">
                        <KeyRound size={18} className="text-[var(--brand)]" />
                        <div>
                          <div className="text-xs font-bold text-foreground">Password</div>
                          <div className="text-[11px] text-muted-foreground">Last updated 3 months ago</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.info("Password reset instructions sent to your email.")}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Unified Footer */}
      <footer className="mt-auto border-t border-border/70 bg-card py-6 text-xs text-muted-foreground">
        <div className="mx-auto flex w-full max-w-7xl 2xl:max-w-[1500px] flex-col sm:flex-row items-center justify-between px-4 sm:px-8 md:px-12 gap-4">
          <div>© 2026 PixelBooks Inc. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link to="/pb-web/genre" className="hover:text-foreground transition-colors">
              Browse Books
            </Link>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
      {/* Share Modal Dialog */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Share2 size={18} className="text-[var(--brand)]" /> Share eBook
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Share "{selectedShareBook?.title}" with your classmates, faculty, or reading network.
            </DialogDescription>
          </DialogHeader>

          {selectedShareBook && (
            <div className="space-y-4 pt-2">
              {/* Book snippet */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60 border border-border/80">
                <img
                  src={selectedShareBook.cover}
                  alt={selectedShareBook.title}
                  className="h-16 w-12 rounded object-cover border border-border shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-foreground line-clamp-1">
                    {selectedShareBook.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    by {selectedShareBook.author}
                  </div>
                </div>
              </div>

              {/* Share link input */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Direct Book Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://pixelbooks.com/book/${selectedShareBook.id}`}
                    className="h-10 w-full rounded-lg border border-input bg-card px-3 text-xs text-foreground font-mono select-all outline-none transition-colors focus:border-[var(--brand)]"
                  />
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[var(--brand)] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-[var(--brand)]/90 transition-colors cursor-pointer shrink-0"
                  >
                    {isLinkCopied ? (
                      <>
                        <Check size={14} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Share Options */}
              <div>
                <div className="text-xs font-semibold text-foreground mb-2">Share via</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        `https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `Check out "${selectedShareBook.title}" on PixelBooks: https://pixelbooks.com/book/${selectedShareBook.id}`
                        )}`,
                        "_blank"
                      );
                    }}
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-border bg-background hover:bg-secondary text-xs font-medium text-foreground transition-all cursor-pointer"
                  >
                    <MessageSquare size={16} className="text-emerald-500" />
                    <span className="text-[11px]">WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        `mailto:?subject=${encodeURIComponent(
                          `Recommended Book: ${selectedShareBook.title}`
                        )}&body=${encodeURIComponent(
                          `Hi,\n\nI recommend reading "${selectedShareBook.title}" by ${selectedShareBook.author} on PixelBooks.\n\nLink: https://pixelbooks.com/book/${selectedShareBook.id}`
                        )}`
                      );
                    }}
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-border bg-background hover:bg-secondary text-xs font-medium text-foreground transition-all cursor-pointer"
                  >
                    <Mail size={16} className="text-blue-500" />
                    <span className="text-[11px]">Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          `Currently reading "${selectedShareBook.title}" on @PixelBooks!`
                        )}&url=${encodeURIComponent(`https://pixelbooks.com/book/${selectedShareBook.id}`)}`,
                        "_blank"
                      );
                    }}
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-border bg-background hover:bg-secondary text-xs font-medium text-foreground transition-all cursor-pointer"
                  >
                    <Globe size={16} className="text-sky-500" />
                    <span className="text-[11px]">Social</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Write a Review Modal Dialog */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Star size={18} className="text-amber-500 fill-amber-500" /> Write a Review
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Help other readers discover quality literature and courseware by sharing your verified feedback.
            </DialogDescription>
          </DialogHeader>

          {selectedReviewBook && (
            <div className="space-y-4 pt-2">
              {/* Book snippet */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60 border border-border/80">
                <img
                  src={selectedReviewBook.cover}
                  alt={selectedReviewBook.title}
                  className="h-16 w-12 rounded object-cover border border-border shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-foreground line-clamp-1">
                    {selectedReviewBook.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    by {selectedReviewBook.author}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Progress: {selectedReviewBook.progress}%
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setReviewHoverRating(star)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        className="p-1 rounded hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star
                          size={22}
                          className={`transition-colors ${
                            (reviewHoverRating || reviewRating) >= star
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30 hover:text-amber-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-foreground ml-2">
                    {reviewRating === 5 && "★★★★★ Outstanding"}
                    {reviewRating === 4 && "★★★★☆ Very Good"}
                    {reviewRating === 3 && "★★★☆☆ Average"}
                    {reviewRating === 2 && "★★☆☆☆ Below Average"}
                    {reviewRating === 1 && "★☆☆☆☆ Poor"}
                  </span>
                </div>
              </div>

              {/* Review Headline */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Review Headline <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={reviewHeadline}
                  onChange={(e) => setReviewHeadline(e.target.value)}
                  placeholder="e.g. Essential reference book for NEET preparation"
                  className="w-full h-12 px-4 rounded-xl border border-input bg-card text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                />
              </div>

              {/* Detailed Review Textarea */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Your Review <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="What made this book stand out? Were the diagrams, exercises, or language helpful?"
                  className="w-full p-4 rounded-xl border border-input bg-card text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all resize-none"
                />
              </div>

              {/* Recommendation toggle */}
              <div
                className="flex items-center gap-2.5 pt-1 cursor-pointer select-none"
                onClick={() => setReviewRecommend(!reviewRecommend)}
              >
                <CustomCheckbox
                  id="recommend-toggle"
                  checked={reviewRecommend}
                  onChange={setReviewRecommend}
                />
                <label htmlFor="recommend-toggle" className="text-xs font-medium text-foreground cursor-pointer select-none">
                  I recommend this eBook to other students and readers
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="h-10 px-4 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[var(--brand)] px-5 text-xs font-semibold text-white shadow-2xs hover:bg-[var(--brand)]/90 transition-colors cursor-pointer"
                >
                  <Star size={13} className="fill-white text-white" /> Submit Review
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Choose The eBook Genre You Like Modal Dialog (Direct Match to User Screenshot) */}
      <Dialog open={isGenreModalOpen} onOpenChange={setIsGenreModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          <DialogHeader className="text-center space-y-2 pb-2">
            <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground text-center">
              Choose The eBook Genre You Like
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground text-center max-w-md mx-auto">
              Select your preferred book genre for better recommendations or you can skip it.
            </DialogDescription>
          </DialogHeader>

          {/* Genre Chips Container */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5 py-6">
            {allRecommendationGenres.map((genre) => {
              const isSelected = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[var(--brand)] text-white shadow-2xs hover:bg-[var(--brand)]/90"
                      : "bg-card text-foreground border border-border hover:border-foreground/30 hover:bg-secondary/50"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          {/* Bottom Update Button */}
          <div className="pt-3">
            <button
              type="button"
              onClick={handleSaveGenres}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[var(--brand)] px-4 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-[var(--brand)]/90 cursor-pointer"
            >
              Update
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete User Data Confirmation Dialog */}
      <Dialog open={isDeleteDataModalOpen} onOpenChange={setIsDeleteDataModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-rose-600 dark:text-rose-400">
              <Trash2 size={18} /> Delete User Data
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to wipe your local reading history and reset your recommendation preferences? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border mt-4">
            <button
              type="button"
              onClick={() => setIsDeleteDataModalOpen(false)}
              className="h-10 px-4 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteUserData}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer px-4"
            >
              Confirm Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
