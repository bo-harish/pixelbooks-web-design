import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
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
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PbWebHeader } from "@/components/pb-web-header";
import { PbWebFooter } from "@/components/pb-web-footer";
import { toast } from "sonner";
import {
  notifications as notificationsData,
  groupByDate,
  type NotificationItem,
} from "@/lib/notifications-data";

export const Route = createFileRoute("/pb-web/accounts")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) ?? "profile",
  }),
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

type AccountTab = "profile" | "library" | "wishlist" | "orders" | "notifications" | "settings";

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
      className={`h-4.5 w-4.5 shrink-0 rounded-md border flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 select-none ${checked
        ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-2xs"
        : "border-border/80 bg-white hover:border-[var(--brand)]/60"
        } ${className}`}
    >
      {checked && <Check className="h-3.5 w-3.5 stroke-[3] text-white" />}
    </button>
  );
}

function PixelBooksAccountPage() {
  const navigate = useNavigate();
  const { tab: tabParam } = useSearch({ from: "/pb-web/accounts" });
  const [activeTab, setActiveTab] = useState<AccountTab>(
    (tabParam as AccountTab) ?? "profile"
  );
  const [cartCount, setCartCount] = useState(2);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
  const [notifItems, setNotifItems] = useState<NotificationItem[]>(() =>
    [
      {
        id: "rn1",
        type: "approved" as const,
        message: "📦 Your order #CS-4821 has been confirmed! 'NEET Courseware Biology Class-XII' is ready in your library.",
        category: "Order Confirmed",
        date: "Today",
        time: "10:14 AM",
        unread: true,
      },
      {
        id: "rn2",
        type: "approved" as const,
        message: "🎉 PixelBooks has added 12 new Malayalam titles you might love. Explore the collection!",
        category: "New Arrivals",
        date: "Today",
        time: "08:30 AM",
        unread: true,
      },
      {
        id: "rn3",
        type: "approved" as const,
        message: "⬇️ Your offline download for 'Foundation Mathematics JEE' is complete and ready to read.",
        category: "Download Ready",
        date: "Yesterday",
        time: "06:55 PM",
        unread: true,
      },
      {
        id: "rn4",
        type: "rejected" as const,
        message: "⚠️ Your session on Desktop Chrome has been signed in from a new device. If this wasn't you, please secure your account.",
        category: "Security Alert",
        date: "Yesterday",
        time: "02:11 PM",
      },
      {
        id: "rn5",
        type: "approved" as const,
        message: "💸 A ₹150 cashback has been credited to your PixelBooks wallet from your last purchase.",
        category: "Wallet Credit",
        date: "24 Aug 2026",
        time: "11:47 AM",
      },
      {
        id: "rn6",
        type: "approved" as const,
        message: "📚 'കേരളത്തിലെ നാടൻപാട്ടുകൾ' has a new updated edition available. Tap to upgrade your copy.",
        category: "Edition Update",
        date: "24 Aug 2026",
        time: "09:00 AM",
      },
      {
        id: "rn7",
        type: "approved" as const,
        message: "🎁 You've unlocked the 'Voracious Reader' badge for completing 10 books this year!",
        category: "Achievement",
        date: "20 Aug 2026",
        time: "03:45 PM",
      },
      {
        id: "rn8",
        type: "approved" as const,
        message: "💳 Your PixelBooks wallet balance is ₹1,200. Use it on your next purchase for instant savings.",
        category: "Wallet Update",
        date: "20 Aug 2026",
        time: "11:20 AM",
      },
      {
        id: "rn9",
        type: "rejected" as const,
        message: "⚠️ Your eBook download for 'Theyyangal' failed due to a network interruption. Please try again.",
        category: "Download Failed",
        date: "15 Aug 2026",
        time: "08:05 PM",
      },
      {
        id: "rn10",
        type: "approved" as const,
        message: "📖 Your reading streak is now 21 days! Keep it up — you're on a roll.",
        category: "Reading Streak",
        date: "15 Aug 2026",
        time: "07:00 AM",
      },
      {
        id: "rn11",
        type: "approved" as const,
        message: "🏷️ Flash Sale! 30% off on all NEET & JEE prep books — today only. Shop now.",
        category: "Promotion",
        date: "10 Aug 2026",
        time: "09:30 AM",
      },
      {
        id: "rn12",
        type: "approved" as const,
        message: "📦 Your order #CS-4699 for 'Pennaazhangal' has been delivered successfully.",
        category: "Order Delivered",
        date: "05 Aug 2026",
        time: "02:18 PM",
      },
      {
        id: "rn13",
        type: "approved" as const,
        message: "🔔 A book from your Want to Read list — 'The Alchemist (Malayalam Translation)' — is now available on PixelBooks.",
        category: "Wishlist Available",
        date: "01 Aug 2026",
        time: "10:00 AM",
      },
    ]
  );
  const NOTIF_PAGE_SIZE = 4;
  const [notifPage, setNotifPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMoreNotifs = useCallback(() => {
    setNotifPage((p) => p + 1);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreNotifs();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMoreNotifs, activeTab]);

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

  // Recommendation Genres & User Data State (Matches Settings screenshot)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    "Biography",
    "Drama",
    "Travel & Tourism",
  ]);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [genreSearchQuery, setGenreSearchQuery] = useState("");
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

  // Password Change State & Handlers
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [passwordLastUpdated, setPasswordLastUpdated] = useState("Last updated 3 months ago");

  const handleCancelPasswordChange = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsChangingPassword(false);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword.trim()) {
      toast.error("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("New password cannot be the same as your current password.");
      return;
    }

    setIsPasswordSubmitting(true);
    setTimeout(() => {
      setIsPasswordSubmitting(false);
      setPasswordLastUpdated("Last updated just now");
      toast.success("Password changed successfully!", {
        description: "Your account credentials have been updated.",
      });
      handleCancelPasswordChange();
    }, 450);
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
  const [fullName, setFullName] = useState("Harish K");
  const [email, setEmail] = useState("harish@brandoptics.com");
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
    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!phone.trim() && !email.trim()) {
      toast.error("Please provide at least either a Mobile Number or an Email ID.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile details and address updated successfully!");
    }, 600);
  };

  const handleDiscard = () => {
    setFullName("Sudheer Menon");
    setEmail("harish@brandoptics.com");
    setPhone("9387737551");
    setAddressLine1("No 4");
    setAddressLine2("Sophia Emerald");
    setCity("Kochi");
    setStateVal("Kerala");
    setPincode("682033");
    toast.info("Changes reverted to saved profile values.");
  };

  return (
    <div
      className="min-h-screen bg-white text-foreground flex flex-col antialiased pb-web-portal"
      style={{ ["--brand" as any]: "#137365" }}
    >
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
            <div className="rounded-2xl border border-border bg-white p-5 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
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
            <nav className="rounded-2xl border border-border bg-white p-2 shadow-xs space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === "profile"
                  ? "bg-[var(--brand)] text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <User size={18} />
                  <span>Profile & Addresses</span>
                </div>
                <ChevronRight size={16} className={activeTab === "profile" ? "opacity-100" : "opacity-40"} />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === "library"
                  ? "bg-[var(--brand)] text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={18} />
                  <span>My Digital Library</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${activeTab === "library" ? "bg-white/20 text-white" : "bg-secondary text-foreground"
                    }`}
                >
                  {userLibraryBooks.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === "wishlist"
                  ? "bg-[var(--brand)] text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Bookmark size={18} />
                  <span>Want to Read</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${activeTab === "wishlist" ? "bg-white/20 text-white" : "bg-secondary text-foreground"
                    }`}
                >
                  {userWishlistBooks.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === "orders"
                  ? "bg-[var(--brand)] text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Receipt size={18} />
                  <span>Purchase History</span>
                </div>
                <ChevronRight size={16} className={activeTab === "orders" ? "opacity-100" : "opacity-40"} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("notifications");
                  setUnreadNotifications(0);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === "notifications"
                  ? "bg-[var(--brand)] text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Bell size={18} />
                  <span>Notifications</span>
                </div>
                {unreadNotifications > 0 && activeTab !== "notifications" ? (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-rose-500 text-white">
                    {unreadNotifications}
                  </span>
                ) : (
                  <ChevronRight size={16} className={activeTab === "notifications" ? "opacity-100" : "opacity-40"} />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === "settings"
                  ? "bg-[var(--brand)] text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <span>Security & Settings</span>
                </div>
                <ChevronRight size={16} className={activeTab === "settings" ? "opacity-100" : "opacity-40"} />
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.info("Logged out successfully.");
                    navigate({ to: "/" });
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
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
                <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
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
                        className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <label className="text-sm font-bold text-foreground">
                            Phone Number
                          </label>
                          <span className="text-[11px] font-normal text-muted-foreground">
                            (Phone or Email required)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {phone.trim() ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-pbgreen-dark">
                              <Check size={12} strokeWidth={2.5} className="text-[#30C047]" /> Verified
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground font-medium">Optional if Email provided</span>
                          )}
                          <button
                            type="button"
                            onClick={() => toast.info("SMS verification code sent to " + phone)}
                            className="text-xs font-bold text-[#137365] hover:underline cursor-pointer"
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
                        className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                      />
                    </div>

                    {/* Email ID */}
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <label className="text-sm font-bold text-foreground">
                            Email ID
                          </label>
                          <span className="text-[11px] font-normal text-muted-foreground">
                            (Phone or Email required)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {email.trim() ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-pbgreen-dark">
                              <Check size={12} strokeWidth={2.5} className="text-[#30C047]" /> Verified
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground font-medium">Optional if Phone provided</span>
                          )}
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
                        className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
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
                        className="w-full p-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all resize-none"
                      />
                    </div>

                    {/* Change Recommendation Genres */}
                    <div className="md:col-span-2 pt-2">
                      <div className="rounded-2xl border border-border bg-neutral-50/70 dark:bg-neutral-900/40 p-5 sm:p-6 transition-all hover:border-border/90 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#137365]/10 text-[#137365] shrink-0 shadow-2xs">
                              <SlidersHorizontal size={22} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2.5">
                                <h4 className="text-sm sm:text-base font-bold text-foreground">
                                  Change Recommendation Genres
                                </h4>
                                <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full bg-pbgreen-light text-pbgreen-dark border border-pbgreen-border">
                                  {selectedGenres.length} selected
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Tailor your book recommendations, homepage feed, and curated collections
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsGenreModalOpen(true)}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#137365] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#0e5b50] transition-all cursor-pointer shrink-0 self-start sm:self-center"
                          >
                            <SlidersHorizontal size={15} />
                            Change Genres
                          </button>
                        </div>

                        {/* Selected Genre Chips Display */}
                        <div className="pt-4">
                          <div className="text-xs font-semibold text-muted-foreground mb-2.5">
                            Your Active Preferences:
                          </div>
                          {selectedGenres.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-2">
                              {selectedGenres.map((genre) => (
                                <span
                                  key={genre}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-pbgreen-light border border-pbgreen-border text-pbgreen-dark shadow-2xs"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-pbgreen" />
                                  {genre}
                                </span>
                              ))}
                              <button
                                type="button"
                                onClick={() => setIsGenreModalOpen(true)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-pbgreen-dark hover:bg-pbgreen-light border border-dashed border-pbgreen-border transition-colors cursor-pointer"
                              >
                                + Edit preferences
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between py-2 text-xs text-muted-foreground italic">
                              <span>No genres selected yet. Choose your preferred categories to customize recommendations.</span>
                              <button
                                type="button"
                                onClick={() => setIsGenreModalOpen(true)}
                                className="text-xs font-semibold text-[#137365] hover:underline ml-2 cursor-pointer not-italic"
                              >
                                Select Genres
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery & Invoicing Address Card */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
                  <div className="pb-4 border-b border-border/70 mb-5">
                    <h3 className="text-base font-bold text-foreground">Address</h3>
                    <p className="text-xs text-muted-foreground">
                      Invoicing address
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Address 1 */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        House / Flat / Door No. (Address 1) <span className="text-red-500 font-bold ml-0.5"></span>
                      </label>
                      <input
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="e.g. No 4"
                        className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
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
                        className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        City <span className="text-red-500 font-bold ml-0.5"></span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Kochi"
                        className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                      />
                    </div>

                    {/* State Dropdown */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        State <span className="text-red-500 font-bold ml-0.5"></span>
                      </label>
                      <div className="relative">
                        <select
                          value={stateVal}
                          onChange={(e) => setStateVal(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all appearance-none cursor-pointer pr-10"
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
                        Postal Pincode <span className="text-red-500 font-bold ml-0.5"></span>
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 682033"
                        className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Action Controls (Clean bottom bar) */}
                <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-xs">
                  <div className="text-xs text-muted-foreground">
                    Last modified: <span className="font-semibold text-foreground">Today at 12:45 PM</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleDiscard}
                      className="h-10 px-4 rounded-lg border border-border bg-white text-xs font-semibold text-foreground hover:bg-neutral-50 transition-colors cursor-pointer"
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
                <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
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
                        className="h-10 w-full rounded-lg border border-border bg-white pl-10 pr-9 text-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] text-foreground"
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
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-neutral-50 text-xs font-semibold text-foreground transition-colors cursor-pointer"
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
                          className="rounded-xl border border-border bg-white p-4 shadow-2xs hover:border-[var(--brand)]/40 transition-all flex flex-col justify-between"
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
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-border bg-white hover:bg-neutral-50 text-xs font-semibold text-foreground transition-colors cursor-pointer"
                              title="Share this book"
                            >
                              <Share2 size={13} className="text-muted-foreground" />
                              <span>Share</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenReviewModal(b)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-border bg-white hover:bg-neutral-50 text-xs font-semibold text-foreground transition-colors cursor-pointer"
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
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          title="First Page"
                        >
                          <ChevronsLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setLibraryCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={libraryCurrentPage === 1}
                          className="flex h-8 px-2.5 items-center justify-center rounded-lg border border-border bg-white text-xs font-semibold text-foreground transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Prev
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalLibraryPages }, (_, i) => i + 1).map((pg) => (
                          <button
                            key={pg}
                            type="button"
                            onClick={() => setLibraryCurrentPage(pg)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold cursor-pointer transition-colors ${pg === libraryCurrentPage
                              ? "bg-[var(--brand)] text-white shadow-2xs"
                              : "border border-border bg-white text-foreground hover:bg-neutral-50"
                              }`}
                          >
                            {pg}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => setLibraryCurrentPage((p) => Math.min(totalLibraryPages, p + 1))}
                          disabled={libraryCurrentPage === totalLibraryPages}
                          className="flex h-8 px-2.5 items-center justify-center rounded-lg border border-border bg-white text-xs font-semibold text-foreground transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Next
                        </button>
                        <button
                          type="button"
                          onClick={() => setLibraryCurrentPage(totalLibraryPages)}
                          disabled={libraryCurrentPage === totalLibraryPages}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
                <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
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
                        className="rounded-xl border border-border bg-white p-4 flex items-center justify-between gap-4"
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
                <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
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
                        className="rounded-xl border border-border bg-white p-5 space-y-4 shadow-2xs"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-foreground font-mono">{ord.id}</span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-pbgreen-dark bg-pbgreen-light border border-pbgreen-border px-2 py-0.5 rounded-full">
                                <CheckCircle2 size={11} className="text-[#30C047]" /> {ord.status}
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
                              className="text-xs font-semibold text-[var(--brand)] hover:underline flex items-center gap-1 py-1.5 px-3 rounded-lg border border-border bg-white hover:bg-neutral-50 transition-colors cursor-pointer"
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
                              className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white border border-border/70 hover:border-[var(--brand)]/30 transition-all"
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
                <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-white gap-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`p-2.5 rounded-xl transition-colors ${pushNotificationsEnabled
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
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pushNotificationsEnabled
                                ? "text-pbgreen-dark bg-pbgreen-light border border-pbgreen-border"
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
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 ${pushNotificationsEnabled ? "bg-[var(--brand)]" : "bg-muted-foreground/30"
                            }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${pushNotificationsEnabled ? "translate-x-5" : "translate-x-0"
                              }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Option 2: Delete User Data */}
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
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-rose-300 dark:border-rose-800 bg-white text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-2xs transition-colors cursor-pointer shrink-0 self-end sm:self-center px-4"
                      >
                        Delete Data
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security & Login Card */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
                  <div className="pb-4 border-b border-border/70 mb-6">
                    <h3 className="text-base font-bold text-foreground">Security & Login</h3>
                    <p className="text-xs text-muted-foreground">
                      Manage your password credentials and account security
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Password Segment - Expands Inline */}
                    <div
                      className={`rounded-xl border transition-all duration-200 bg-white ${isChangingPassword
                        ? "border-[var(--brand)]/40 shadow-xs ring-2 ring-[var(--brand)]/5"
                        : "border-border hover:border-border/80"
                        }`}
                    >
                      {/* Segment Header */}
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3.5">
                          <div className="p-2.5 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] shrink-0">
                            <KeyRound size={18} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Password</div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              {passwordLastUpdated}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (isChangingPassword) {
                              handleCancelPasswordChange();
                            } else {
                              setIsChangingPassword(true);
                            }
                          }}
                          className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border px-4 text-xs font-semibold transition-colors cursor-pointer shrink-0 ${isChangingPassword
                            ? "border-border bg-secondary text-muted-foreground hover:text-foreground"
                            : "border-border bg-white text-foreground hover:bg-neutral-50"
                            }`}
                        >
                          {isChangingPassword ? (
                            <>
                              <X size={13} />
                              Cancel
                            </>
                          ) : (
                            <>
                              Change Password
                              <ChevronDown size={14} className="text-muted-foreground" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Expanded Section */}
                      {isChangingPassword && (
                        <div className="border-t border-border/70 bg-neutral-50/50 dark:bg-neutral-900/30 p-4 sm:p-5 rounded-b-xl">
                          <form onSubmit={handleSavePassword} className="space-y-4 max-w-xl">
                            <div>
                              <label
                                htmlFor="current-password-input"
                                className="block text-xs font-semibold text-foreground mb-1.5"
                              >
                                Current Password <span className="text-rose-500">*</span>
                              </label>
                              <div className="relative flex items-center">
                                <input
                                  id="current-password-input"
                                  type={showCurrentPassword ? "text" : "password"}
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                  placeholder="Enter current password"
                                  className="h-10 w-full rounded-lg border border-border bg-white pr-10 pl-3.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword((v) => !v)}
                                  className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                  tabIndex={-1}
                                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                >
                                  {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              <div>
                                <label
                                  htmlFor="new-password-input"
                                  className="block text-xs font-semibold text-foreground mb-1.5"
                                >
                                  New Password <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative flex items-center">
                                  <input
                                    id="new-password-input"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="At least 8 characters"
                                    className="h-10 w-full rounded-lg border border-border bg-white pr-10 pl-3.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowNewPassword((v) => !v)}
                                    className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                    tabIndex={-1}
                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                  >
                                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                  </button>
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="confirm-password-input"
                                  className="block text-xs font-semibold text-foreground mb-1.5"
                                >
                                  Confirm New Password <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative flex items-center">
                                  <input
                                    id="confirm-password-input"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter new password"
                                    className={`h-10 w-full rounded-lg border bg-white pr-10 pl-3.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors ${confirmPassword && newPassword
                                      ? confirmPassword === newPassword
                                        ? "border-emerald-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/30"
                                        : "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30"
                                      : "border-border focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30"
                                      }`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                    tabIndex={-1}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                  >
                                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Password requirements helper */}
                            <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
                              <span
                                className={`inline-flex items-center gap-1 transition-colors ${newPassword.length >= 8 ? "text-emerald-600 font-semibold" : ""
                                  }`}
                              >
                                <Check
                                  size={12}
                                  className={newPassword.length >= 8 ? "text-emerald-600" : "text-muted-foreground/50"}
                                />
                                Minimum 8 characters
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 transition-colors ${confirmPassword && newPassword && newPassword === confirmPassword
                                  ? "text-emerald-600 font-semibold"
                                  : ""
                                  }`}
                              >
                                <Check
                                  size={12}
                                  className={
                                    confirmPassword && newPassword && newPassword === confirmPassword
                                      ? "text-emerald-600"
                                      : "text-muted-foreground/50"
                                  }
                                />
                                Passwords match
                              </span>
                            </div>

                            {/* Form buttons */}
                            <div className="flex items-center justify-end gap-2.5 pt-2">
                              <button
                                type="button"
                                onClick={handleCancelPasswordChange}
                                className="h-9 rounded-lg border border-border bg-white px-4 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-neutral-50 transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isPasswordSubmitting}
                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[var(--brand)] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-[var(--brand)]/90 transition-opacity cursor-pointer disabled:opacity-50"
                              >
                                {isPasswordSubmitting ? "Updating..." : "Update Password"}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
                  <div className="pb-4 border-b border-border/70 mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                        <Bell size={18} className="text-[var(--brand)]" />
                        Notifications
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Your latest activity, alerts, and updates from PixelBooks
                      </p>
                    </div>
                    {notifItems.length > 0 && (
                      <button
                        type="button"
                        onClick={() => { setNotifItems([]); setNotifPage(1); }}
                        className="text-xs font-semibold text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {notifItems.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary mx-auto mb-3">
                        <Bell size={22} className="text-muted-foreground" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">You're all caught up!</p>
                      <p className="text-xs text-muted-foreground mt-1">No new notifications at the moment.</p>
                    </div>
                  ) : (() => {
                    const visibleItems = notifItems.slice(0, notifPage * NOTIF_PAGE_SIZE);
                    const hasMore = visibleItems.length < notifItems.length;
                    return (
                      <div className="space-y-6">
                        {groupByDate(visibleItems).map((group) => (
                          <section key={group.date}>
                            <div className="mb-2 flex items-center justify-between">
                              <h4 className="text-[13px] font-semibold text-foreground">{group.date}</h4>
                              <button
                                type="button"
                                onClick={() =>
                                  setNotifItems((prev) => prev.filter((n) => n.date !== group.date))
                                }
                                className="text-xs font-semibold hover:underline underline-offset-4 transition-colors cursor-pointer"
                                style={{ color: "var(--brand)" }}
                              >
                                Clear
                              </button>
                            </div>
                            <ul className="space-y-2">
                              {group.items.map((n) => (
                                <li key={n.id} className="rounded-xl border border-border/60 bg-secondary/40 px-4 py-3.5">
                                  <div className="flex items-start gap-3">
                                    <span
                                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                                      style={{ backgroundColor: n.unread ? "var(--brand)" : "var(--border)" }}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-start justify-between gap-4">
                                        <p className="text-[13.5px] leading-snug text-foreground">{n.message}</p>
                                        <span className="shrink-0 text-[11.5px] text-muted-foreground whitespace-nowrap">
                                          {n.time}
                                        </span>
                                      </div>
                                      <p className="mt-1 text-[11.5px] text-muted-foreground">{n.category}</p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </section>
                        ))}

                        {/* Scroll sentinel */}
                        {hasMore ? (
                          <div ref={sentinelRef} className="flex items-center justify-center py-4 gap-2 text-xs text-muted-foreground">
                            <span className="h-3.5 w-3.5 rounded-full border-2 border-[var(--brand)] border-t-transparent animate-spin" />
                            Loading more…
                          </div>
                        ) : (
                          <p className="text-center text-xs text-muted-foreground py-4">You've seen all notifications.</p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Unified Footer */}
      <PbWebFooter />
      {/* Share Modal Dialog */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
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
                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-xs text-foreground font-mono select-all outline-none transition-colors focus:border-[var(--brand)]"
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
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-border bg-white hover:bg-neutral-50 text-xs font-medium text-foreground transition-all cursor-pointer"
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
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-border bg-white hover:bg-neutral-50 text-xs font-medium text-foreground transition-all cursor-pointer"
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
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-border bg-white hover:bg-neutral-50 text-xs font-medium text-foreground transition-all cursor-pointer"
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
        <DialogContent className="sm:max-w-lg bg-white">
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
                          className={`transition-colors ${(reviewHoverRating || reviewRating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30 hover:text-amber-300"
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-foreground ml-2">

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
                  className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
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
                  className="w-full p-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all resize-none"
                />
              </div>

              {/* Recommendation toggle */}
              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="h-10 px-4 rounded-lg border border-border bg-white text-xs font-semibold text-foreground hover:bg-neutral-50 transition-colors cursor-pointer"
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

      {/* Choose The eBook Genre You Like Modal Dialog */}
      <Dialog
        open={isGenreModalOpen}
        onOpenChange={(open) => {
          setIsGenreModalOpen(open);
          if (!open) setGenreSearchQuery("");
        }}
      >
        <DialogContent className="sm:max-w-3xl lg:max-w-4xl max-h-[88vh] flex flex-col p-0 bg-white overflow-hidden rounded-3xl border border-border shadow-2xl">
          {/* Header with spacious padding and search bar */}
          <div className="px-6 pt-7 pb-5 sm:px-8 sm:pt-8 sm:pb-6 border-b border-border/70 bg-neutral-50/60 dark:bg-neutral-900/30 pr-14 sm:pr-16">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#137365] uppercase tracking-wider">
                  <Sparkles size={15} />
                  Personalized Reading Profile
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-pbgreen-light text-pbgreen-dark border border-pbgreen-border">
                  <Check size={13} strokeWidth={2.5} />
                  {selectedGenres.length} of {allRecommendationGenres.length} Selected
                </span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-foreground tracking-tight">
                Choose The eBook Genre You Like
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                Select your preferred book genres for curated recommendations, personalized homepage feed, and notification drops.
              </DialogDescription>
            </div>

            {/* Search & Quick Controls Bar */}
            <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  value={genreSearchQuery}
                  onChange={(e) => setGenreSearchQuery(e.target.value)}
                  placeholder="Search 38+ genres (e.g. Fiction, NEET, Biography)..."
                  className="w-full h-10 pl-9 pr-8 rounded-xl border border-border bg-white text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-[#137365] focus:ring-1 focus:ring-[#137365]/20 transition-all"
                />
                {genreSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setGenreSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGenres(allRecommendationGenres);
                    toast.info("Selected all genres.");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-[#137365] hover:bg-[#137365]/10 transition-colors cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-border">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGenres([]);
                    toast.info("Cleared all selected genres.");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Genre Chips Container with Generous Room */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 max-h-[50vh]">
            {allRecommendationGenres.filter((g) =>
              g.toLowerCase().includes(genreSearchQuery.toLowerCase().trim())
            ).length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Search size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold text-foreground">No matching genres found</p>
                <p className="text-xs mt-1">Try a different search term or clear your search query.</p>
                <button
                  type="button"
                  onClick={() => setGenreSearchQuery("")}
                  className="mt-3 text-xs font-semibold text-[#137365] hover:underline cursor-pointer"
                >
                  Reset search filter
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {allRecommendationGenres
                  .filter((g) =>
                    g.toLowerCase().includes(genreSearchQuery.toLowerCase().trim())
                  )
                  .map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-150 cursor-pointer select-none ${isSelected
                          ? "bg-pbgreen-light text-pbgreen-dark border border-pbgreen-border ring-2 ring-pbgreen/25 hover:bg-pbgreen-subtle shadow-xs translate-y-[-0.5px]"
                          : "bg-white text-foreground/80 border border-border/90 hover:border-pbgreen-border hover:bg-pbgreen-light/40 hover:text-pbgreen-dark"
                          }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${isSelected
                            ? "bg-pbgreen text-white shadow-2xs"
                            : "border border-border/80 text-transparent"
                            }`}
                        >
                          <Check size={10} strokeWidth={3} className={isSelected ? "opacity-100" : "opacity-0"} />
                        </span>
                        {genre}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 sm:px-8 sm:py-5 border-t border-border bg-neutral-50/70 dark:bg-neutral-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              {selectedGenres.length > 0 ? (
                <span>
                  <strong className="font-semibold text-foreground">{selectedGenres.length} genres</strong> currently chosen for your profile.
                </span>
              ) : (
                <span className="italic">No genres selected yet (recommendations will show all categories).</span>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => {
                  setGenreSearchQuery("");
                  setIsGenreModalOpen(false);
                }}
                className="h-11 px-5 rounded-xl border border-border bg-white text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-neutral-50 transition-colors cursor-pointer w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setGenreSearchQuery("");
                  handleSaveGenres();
                }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#137365] px-6 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#0e5b50] transition-all cursor-pointer w-full sm:w-auto"
              >
                <Check size={15} strokeWidth={2.5} />
                Save Preferences ({selectedGenres.length})
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete User Data Confirmation Dialog */}
      <Dialog open={isDeleteDataModalOpen} onOpenChange={setIsDeleteDataModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
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
              className="h-10 px-4 rounded-lg border border-border bg-white text-xs font-semibold text-foreground hover:bg-neutral-50 transition-colors cursor-pointer"
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
