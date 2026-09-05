import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Trash2,
  Bookmark,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Plus,
  Check,
  CreditCard,
  Smartphone,
  Building2,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  ShoppingBag,
  Info,
  Gift,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PbWebHeader } from "@/components/pb-web-header";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-web/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart — PixelBooks" },
      {
        name: "description",
        content: "Review your selected eBooks, apply promotional coupons, and proceed to secure checkout on PixelBooks.",
      },
    ],
  }),
  component: PixelBooksCartPage,
});

interface CartItem {
  id: string;
  title: string;
  malayalamTitle?: string;
  author: string;
  cover: string;
  mrp: number;
  price: number;
  format: string;
  license: string;
  language: string;
  fileSize: string;
  isbn: string;
}

interface Coupon {
  code: string;
  label: string;
  discountPercent?: number;
  flatDiscount?: number;
  description: string;
}

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: "book-cartoon-kalari",
    title: "Cartoon Kalari",
    malayalamTitle: "കാർട്ടൂൺ കളരി",
    author: "Prasannan Anikkadu",
    cover: "/images/covers/theyyam.jpg",
    mrp: 150.0,
    price: 100.0, // base price excl. GST = 100, GST = 5, total = 105 (exact match to screenshot)
    format: "Interactive eBook (EPUB)",
    license: "Lifetime Digital License",
    language: "Malayalam / English",
    fileSize: "18.4 MB",
    isbn: "978-81-264-9102-4",
  },
];

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "ONAM26",
    label: "Onam Festival Special",
    discountPercent: 15,
    description: "Save 15% on Malayalam literature, arts, and cultural publications.",
  },
  {
    code: "STUDENT10",
    label: "Academic & Student Pass",
    discountPercent: 10,
    description: "Flat 10% discount on all verified learning titles and courseware.",
  },
  {
    code: "WELCOME25",
    label: "New Reader Welcome",
    flatDiscount: 25,
    description: "Flat ₹25 OFF on your digital bookstore cart.",
  },
];

const RECOMMENDED_ADDONS: CartItem[] = [
  {
    id: "addon-theyyangal",
    title: "Theyyangal (തെയ്യങ്ങൾ)",
    author: "T.K.D. Muzhappilangad",
    cover: "/images/covers/theyyam.jpg",
    mrp: 420.0,
    price: 340.0,
    format: "Illustrated Digital",
    license: "Standard Personal License",
    language: "Malayalam",
    fileSize: "24.6 MB",
    isbn: "978-81-264-0013-1",
  },
  {
    id: "addon-kerala-folklore",
    title: "Kerala Folklore & Boat Races",
    author: "Sathyan Kallurutti",
    cover: "/images/covers/kerala-boat-race.jpg",
    mrp: 450.0,
    price: 360.0,
    format: "ePub + Audio Notes",
    license: "Standard Personal License",
    language: "Malayalam",
    fileSize: "32.1 MB",
    isbn: "978-81-264-0014-8",
  },
];

function PixelBooksCartPage() {
  const navigate = useNavigate();

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [lastRemovedItem, setLastRemovedItem] = useState<CartItem | null>(null);

  // Promo code state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isOffersExpanded, setIsOffersExpanded] = useState(false);

  // Checkout modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  // Financial calculations
  const subtotalExclGst = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  }, [cartItems]);

  const totalMrp = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.mrp, 0);
  }, [cartItems]);

  const catalogDiscount = useMemo(() => {
    return Math.max(0, totalMrp - subtotalExclGst);
  }, [totalMrp, subtotalExclGst]);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || cartItems.length === 0) return 0;
    if (appliedCoupon.discountPercent) {
      return (subtotalExclGst * appliedCoupon.discountPercent) / 100;
    }
    if (appliedCoupon.flatDiscount) {
      return Math.min(appliedCoupon.flatDiscount, subtotalExclGst);
    }
    return 0;
  }, [appliedCoupon, subtotalExclGst, cartItems]);

  const discountedSubtotal = Math.max(0, subtotalExclGst - couponDiscount);
  // 5% GST on digital publications
  const gstAmount = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return Number((discountedSubtotal * 0.05).toFixed(2));
  }, [discountedSubtotal, cartItems]);

  const finalTotal = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return Number((discountedSubtotal + gstAmount).toFixed(2));
  }, [discountedSubtotal, gstAmount, cartItems]);

  // Actions
  const handleRemoveItem = (item: CartItem) => {
    setLastRemovedItem(item);
    setCartItems((prev) => prev.filter((i) => i.id !== item.id));
    toast.success(`Removed "${item.title}" from cart`, {
      action: {
        label: "Undo",
        onClick: () => {
          setCartItems((prev) => [item, ...prev]);
          toast.info(`Restored "${item.title}" to cart`);
        },
      },
    });
  };

  const handleSaveForLater = (item: CartItem) => {
    setCartItems((prev) => prev.filter((i) => i.id !== item.id));
    toast.success(`"${item.title}" moved to your Wishlist!`, {
      description: "You can find it anytime in your Account → Wishlist tab.",
    });
  };

  const handleAddRecommended = (item: CartItem) => {
    if (cartItems.some((i) => i.id === item.id)) {
      toast.info(`"${item.title}" is already in your cart`);
      return;
    }
    setCartItems((prev) => [...prev, item]);
    toast.success(`Added "${item.title}" to cart!`);
  };

  const handleApplyCoupon = (couponToApply?: Coupon) => {
    const coupon =
      couponToApply ||
      AVAILABLE_COUPONS.find(
        (c) => c.code.toLowerCase() === couponInput.trim().toLowerCase()
      );

    if (!coupon) {
      toast.error("Invalid coupon code", {
        description: "Please check your promo code or pick from available offers below.",
      });
      return;
    }

    setAppliedCoupon(coupon);
    setCouponInput(coupon.code);
    toast.success(`Coupon "${coupon.code}" applied!`, {
      description: coupon.description,
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.info("Coupon removed.");
  };

  const handleProceedToBuy = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setIsOrderComplete(false);
    setIsCheckoutModalOpen(true);
  };

  const handleCompletePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsOrderComplete(true);
      toast.success("Payment successful! eBook license activated.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* Unified pb-web Header */}
      <PbWebHeader cartCount={cartItems.length} />

      {/* Main Cart Body */}
      <main className="flex-1 pb-16 pt-4">
        <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1500px] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs & Checkout Step Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border/70 mb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/pb-web/genre" className="hover:text-foreground transition-colors">
                Catalogue
              </Link>
              <ChevronRight size={13} />
              <span className="text-foreground font-semibold">Shopping Cart</span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">
                  1
                </span>
                <span>Review Cart</span>
              </div>
              <div className="h-0.5 w-6 sm:w-10 bg-border" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-muted-foreground text-[10px] font-semibold">
                  2
                </span>
                <span>Payment</span>
              </div>
              <div className="h-0.5 w-6 sm:w-10 bg-border" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-muted-foreground text-[10px] font-semibold">
                  3
                </span>
                <span>Access</span>
              </div>
            </div>
          </div>

          {/* Cart Title & Cloud Sync Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Shopping Cart
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                  {cartItems.length} {cartItems.length === 1 ? "eBook" : "eBooks"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Verified digital editions with instant cloud synchronization to your PixelBooks reader.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/60 px-3.5 py-2 rounded-xl border border-border/80 w-fit">
              <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>256-Bit SSL Encrypted Checkout · Instant Access</span>
            </div>
          </div>

          {/* CART CONTENT: Two Columns or Empty State */}
          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="rounded-3xl border border-border bg-card p-12 text-center max-w-xl mx-auto shadow-sm my-8 space-y-4">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <ShoppingBag size={36} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Your digital cart is empty</h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                Explore thousands of Malayalam literature classics, academic courseware, poetry, and competitive exam books.
              </p>
              <div className="pt-3">
                <Link
                  to="/pb-web/genre"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-[var(--brand)]/90 cursor-pointer"
                >
                  <BookOpen size={16} /> Browse eBooks & Genres
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Added eBooks + Offers + Recommended (8 cols) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                {/* 1. Added eBooks Card */}
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-border/70 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-foreground">
                        Added eBooks
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        ({cartItems.length})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCartItems([]);
                        toast.info("Cart cleared");
                      }}
                      className="text-xs text-muted-foreground hover:text-rose-500 transition-colors font-semibold cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>

                  {/* List of Cart Items */}
                  <div className="divide-y divide-border/60">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start justify-between gap-4"
                      >
                        {/* Book thumbnail & details */}
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <img
                            src={item.cover}
                            alt={item.title}
                            className="h-28 w-20 rounded-xl object-cover border border-border shadow-xs shrink-0"
                          />

                          <div className="min-w-0 space-y-1">
                            {item.language && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] text-muted-foreground">
                                  {item.language}
                                </span>
                              </div>
                            )}

                            <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-1">
                              {item.title}
                            </h3>
                            {item.malayalamTitle && (
                              <p className="text-xs font-semibold text-foreground/80">
                                {item.malayalamTitle}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              by <span className="text-foreground font-medium">{item.author}</span>
                            </p>

                            <div className="pt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                              <span>ISBN: {item.isbn}</span>
                              <span>•</span>
                              <span>{item.fileSize}</span>
                              <span>•</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                {item.license}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Action controls */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60 gap-2">
                          <div className="text-left sm:text-right">
                            <div className="flex items-baseline gap-2">
                              <span className="text-base sm:text-lg font-extrabold text-foreground">
                                ₹{item.price.toFixed(2)}
                              </span>
                              {item.mrp > item.price && (
                                <span className="text-xs text-muted-foreground line-through">
                                  ₹{item.mrp.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <span className="text-[10.5px] text-muted-foreground block">
                              incl. 5% GST
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveForLater(item)}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer font-medium"
                              title="Save to Wishlist"
                            >
                              <Bookmark size={13} />
                              <span>Save for Later</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item)}
                              className="text-xs text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                              title="Remove item"
                            >
                              <Trash2 size={13} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Offers & Benefits Card (Upgraded matching user's ONAM26 coupon) */}
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-4">
                    <div className="flex items-center gap-2">
                      <Tag size={18} className="text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        Offers & Promotional Benefits
                      </h3>
                    </div>
                    {appliedCoupon && (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        {appliedCoupon.code} Active
                      </span>
                    )}
                  </div>

                  {/* Promo Input Box */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1">
                      <Tag
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Enter discount coupon (e.g. ONAM26)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-xs font-mono uppercase tracking-wider text-foreground outline-none transition-colors placeholder:text-muted-foreground placeholder:normal-case placeholder:font-sans focus:border-[var(--brand)]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--brand)] px-4 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-[var(--brand)]/90 cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Active Applied Voucher Banner */}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 mb-3">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                            '{appliedCoupon.code}' Applied Successfully!
                          </div>
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                            You save ₹{couponDiscount.toFixed(2)} on this order
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Available Deals list */}
                  <div className="space-y-2.5">
                    {AVAILABLE_COUPONS.map((cpn) => {
                      const isApplied = appliedCoupon?.code === cpn.code;
                      return (
                        <div
                          key={cpn.code}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                            isApplied
                              ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20"
                              : "border-border/80 bg-background hover:border-emerald-500/40"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded">
                                {cpn.code}
                              </span>
                              <span className="text-xs font-bold text-foreground">
                                {cpn.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              {cpn.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => (isApplied ? handleRemoveCoupon() : handleApplyCoupon(cpn))}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ml-3 ${
                              isApplied
                                ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-500/30"
                            }`}
                          >
                            {isApplied ? "Remove" : "Apply"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Recommended Add-ons ("Frequently Read Together") */}
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-500" />
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        Recommended With Your Titles
                      </h3>
                    </div>
                    <span className="text-xs text-muted-foreground">Bundle & Save</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {RECOMMENDED_ADDONS.map((addon) => {
                      const isInCart = cartItems.some((i) => i.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-background hover:border-emerald-500/40 transition-all gap-3"
                        >
                          <img
                            src={addon.cover}
                            alt={addon.title}
                            className="h-16 w-12 rounded-lg object-cover border border-border shrink-0"
                          />
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <h4 className="text-xs font-bold text-foreground line-clamp-1">
                              {addon.title}
                            </h4>
                            <p className="text-[11px] text-muted-foreground truncate">
                              by {addon.author}
                            </p>
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <span className="text-xs font-bold text-foreground">
                                ₹{addon.price}
                              </span>
                              <span className="text-[10px] text-muted-foreground line-through">
                                ₹{addon.mrp}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={isInCart}
                            onClick={() => handleAddRecommended(addon)}
                            className={`inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs font-semibold transition-colors shrink-0 ${
                              isInCart
                                ? "border border-border bg-secondary text-muted-foreground cursor-not-allowed"
                                : "bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white shadow-2xs cursor-pointer"
                            }`}
                          >
                            {isInCart ? "Added" : "+ Add"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Sticky Order Info / Summary (4 cols) */}
              <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
                  <div className="pb-4 border-b border-border/70 flex items-center justify-between">
                    <h3 className="text-base font-bold text-foreground">Order Info</h3>
                    <span className="text-xs font-mono text-muted-foreground">
                      GST Registered
                    </span>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Subtotal (excl. GST)</span>
                      <span className="font-semibold text-foreground">
                        ₹{subtotalExclGst.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Catalog Discount</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        - ₹{catalogDiscount.toFixed(2)}
                      </span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                        <span>Coupon Savings ({appliedCoupon?.code})</span>
                        <span className="font-semibold">
                          - ₹{couponDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span>Total Tax Amount (5% GST)</span>
                        <span title="Applicable on educational and digital eBooks">
                          <Info size={12} className="text-muted-foreground" />
                        </span>
                      </div>
                      <span className="font-semibold text-foreground">
                        ₹{gstAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Cloud Delivery & Digital Setup</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">
                        FREE
                      </span>
                    </div>

                    <div className="pt-3 border-t border-border flex items-baseline justify-between">
                      <div>
                        <div className="text-sm font-bold text-foreground">Total Price</div>
                        <div className="text-[10px] text-muted-foreground">
                          Includes taxes and lifetime cloud reader sync
                        </div>
                      </div>
                      <div className="text-xl font-extrabold text-foreground tracking-tight">
                        ₹{finalTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Total Savings Callout */}
                  {(catalogDiscount > 0 || couponDiscount > 0) && (
                    <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center">
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-center gap-1.5">
                        <Gift size={14} />
                        Total Savings: ₹{(catalogDiscount + couponDiscount).toFixed(2)} on this order
                      </p>
                    </div>
                  )}

                  {/* Primary CTA Proceed to Buy Button (Matching Categories button style) */}
                  <button
                    type="button"
                    onClick={handleProceedToBuy}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-[var(--brand)]/90 cursor-pointer"
                  >
                    <Lock size={16} />
                    <span>Proceed to Buy · ₹{finalTotal.toFixed(2)}</span>
                  </button>

                  {/* Trust & Guarantee points */}
                  <div className="space-y-2 pt-2 border-t border-border/70 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      <span>Instant sync with PixelBooks Reader apps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      <span>Compliant GST invoice generated automatically</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      <span>Supports UPI, Debit/Credit Cards & NetBanking</span>
                    </div>
                  </div>
                </div>

                {/* Return to Catalogue Link */}
                <div className="text-center">
                  <Link
                    to="/pb-web/genre"
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    <ArrowLeft size={13} /> Continue Shopping & Browse More
                  </Link>
                </div>
              </div>
            </div>
          )}
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
            <Link to="/pb-web/accounts" className="hover:text-foreground transition-colors">
              My Library & Account
            </Link>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Purchase
            </a>
          </div>
        </div>
      </footer>

      {/* Checkout & Payment Simulation Modal */}
      <Dialog open={isCheckoutModalOpen} onOpenChange={setIsCheckoutModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Lock size={18} className="text-emerald-600 dark:text-emerald-400" />
              {isOrderComplete ? "Order Confirmed!" : "Secure Digital Checkout"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isOrderComplete
                ? "Your digital purchase has been verified and added to your library."
                : `Completing purchase for ${cartItems.length} eBook item(s). Total: ₹${finalTotal.toFixed(2)}`}
            </DialogDescription>
          </DialogHeader>

          {isOrderComplete ? (
            /* Order Success View */
            <div className="space-y-4 py-3 text-center">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h4 className="text-base font-bold text-foreground">Purchase Successful!</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Tax invoice has been sent to <span className="font-semibold text-foreground">harishknair@gmail.com</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border text-left space-y-2">
                <div className="text-xs font-semibold text-foreground">Unlocked eBooks:</div>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5 text-xs text-foreground">
                    <img src={item.cover} alt={item.title} className="h-10 w-8 rounded object-cover border border-border" />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold truncate">{item.title}</div>
                      <div className="text-[11px] text-muted-foreground">Lifetime Cloud License Active</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    navigate({ to: "/pb-web/accounts" });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Open in My Digital Library
                </button>
              </div>
            </div>
          ) : (
            /* Payment Selection View */
            <div className="space-y-4 pt-2">
              <div className="text-xs font-bold text-foreground">Select Payment Method</div>

              <div className="space-y-2">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20"
                      : "border-border bg-background hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                      <Smartphone size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">UPI (GPay, PhonePe, Paytm)</div>
                      <div className="text-[10.5px] text-muted-foreground">Instant zero-fee payment</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Credit / Debit Card Option */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20"
                      : "border-border bg-background hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">Credit / Debit Card</div>
                      <div className="text-[10.5px] text-muted-foreground">Visa, MasterCard, RuPay</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                {/* NetBanking Option */}
                <div
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "netbanking"
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20"
                      : "border-border bg-background hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">NetBanking</div>
                      <div className="text-[10.5px] text-muted-foreground">All Indian Scheduled Banks</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === "netbanking"}
                    onChange={() => setPaymentMethod("netbanking")}
                    className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Order total preview */}
              <div className="p-3 rounded-xl bg-secondary/50 border border-border/80 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Amount to Pay</span>
                <span className="font-extrabold text-foreground text-sm">₹{finalTotal.toFixed(2)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="h-10 px-4 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleCompletePayment}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-5 text-xs font-semibold text-white shadow-2xs hover:bg-[var(--brand)]/90 transition-colors cursor-pointer"
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={14} /> Pay ₹{finalTotal.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
