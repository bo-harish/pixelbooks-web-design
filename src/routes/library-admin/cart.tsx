import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Search, X, Check, ShoppingBag, FileText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/library-admin/cart")({
  component: LibraryAdminCartPage,
});

interface CartItem {
  id: string;
  title: string;
  author: string;
  initials: string;
  cover: string;
  unitPrice: number;
  currency: string;
}

const ALL_AVAILABLE_BOOKS: CartItem[] = [
  {
    id: "req1",
    title: "Aakashakkottaram",
    author: "Narayan Gangopadhyaya",
    initials: "AK",
    cover: "linear-gradient(135deg, oklch(0.45 0.15 30), oklch(0.25 0.08 30))",
    unitPrice: 441.0,
    currency: "₹",
  },
  {
    id: "req2",
    title: "Ayankariyile Chathanmar",
    author: "Shyju Neelakandan",
    initials: "AC",
    cover: "linear-gradient(135deg, oklch(0.35 0.08 200), oklch(0.2 0.05 200))",
    unitPrice: 414.75,
    currency: "₹",
  },
  {
    id: "req3",
    title: "NEP 2020 - Policy Formulation In Education",
    author: "Dr. S. K. Gupta",
    initials: "NEP",
    cover: "linear-gradient(135deg, oklch(0.5 0.15 220), oklch(0.3 0.09 220))",
    unitPrice: 3.15,
    currency: "₹",
  },
];

export function LibraryAdminCartPage() {
  const navigate = useNavigate();

  // Load cart selections from localStorage
  const [cartKeys, setCartKeys] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem("pixelbooks_cart_items");
    return stored ? JSON.parse(stored) : {};
  });

  // Load quantities from localStorage or default to 1
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const stored = localStorage.getItem("pixelbooks_cart_quantities");
    return stored ? JSON.parse(stored) : { req1: 1, req2: 1, req3: 1 };
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Sync state helpers to localStorage and dispatch update events
  const syncCart = (newKeys: Record<string, boolean>, newQuants: Record<string, number>) => {
    setCartKeys(newKeys);
    setQuantities(newQuants);
    localStorage.setItem("pixelbooks_cart_items", JSON.stringify(newKeys));
    localStorage.setItem("pixelbooks_cart_quantities", JSON.stringify(newQuants));

    const count = Object.keys(newKeys).filter((k) => newKeys[k]).length;
    localStorage.setItem("pixelbooks_cart_count", String(count));

    // Dispatch update event to header
    window.dispatchEvent(new Event("pixelbooks_cart_updated"));
  };

  // Increment Quantity
  const handleIncrement = (id: string) => {
    const newQuants = { ...quantities, [id]: (quantities[id] || 1) + 1 };
    syncCart(cartKeys, newQuants);
  };

  // Decrement Quantity
  const handleDecrement = (id: string) => {
    const currentVal = quantities[id] || 1;
    if (currentVal <= 1) return;
    const newQuants = { ...quantities, [id]: currentVal - 1 };
    syncCart(cartKeys, newQuants);
  };

  // Remove item
  const handleRemove = (id: string) => {
    const newKeys = { ...cartKeys };
    delete newKeys[id];
    syncCart(newKeys, quantities);
    toast.success("Item removed from cart");
  };

  // Filtered books currently in the cart
  const cartBooks = useMemo(() => {
    return ALL_AVAILABLE_BOOKS.filter((b) => !!cartKeys[b.id]);
  }, [cartKeys]);

  // Search filtered cart books
  const filteredCartBooks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return cartBooks;
    return cartBooks.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
    );
  }, [cartBooks, searchQuery]);

  // Compute Order Info sums
  const { totalAmount, subtotalExclGst, taxAmount } = useMemo(() => {
    let total = 0;
    cartBooks.forEach((b) => {
      const qty = quantities[b.id] || 1;
      total += b.unitPrice * qty;
    });

    // GST is 5% (inclusive in unit prices)
    const subtotal = total / 1.05;
    const tax = total - subtotal;

    return {
      totalAmount: total,
      subtotalExclGst: subtotal,
      taxAmount: tax,
    };
  }, [cartBooks, quantities]);

  // Place Order submission action
  const handlePlaceOrder = () => {
    if (cartBooks.length === 0) return;

    // Simulate order placement
    toast.success("Order request placed successfully for approval!");

    // Clear cart
    syncCart({}, { req1: 1, req2: 1, req3: 1 });

    // Navigate to institution orders list page
    navigate({ to: "/library-admin/orders" });
  };

  return (
    <AppShell title="eBook Store">
      <div className="p-4 md:p-8 space-y-6">
        {cartBooks.length === 0 ? (
          <div className="space-y-4">
            <Link
              to="/library-admin/requests"
              className="flex items-center gap-2 text-sm font-normal text-slate-700 dark:text-slate-200 hover:text-foreground cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to Requests
            </Link>
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground shadow-sm">
              <div className="flex flex-col items-center justify-center gap-3">
                <ShoppingBag size={48} className="text-muted-foreground/60" />
                <p className="font-semibold text-lg">Your cart is empty</p>
                <p className="text-sm">Please select books from the requests page first.</p>
                <Link
                  to="/library-admin/requests"
                  className="mt-2 h-9 px-5 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold hover:opacity-90 inline-flex items-center justify-center shadow-sm"
                >
                  Go to Requests
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Main Cart Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left side: Search & eBook Orders Table */}
            <div className="lg:col-span-8 space-y-4">
              {/* Toolbar: Back to cart button & Search input field */}
              <div className="flex items-center justify-between gap-4">
                <Link
                  to="/library-admin/requests"
                  className="flex items-center gap-2 text-sm font-normal text-slate-700 dark:text-slate-200 hover:text-foreground cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  Back to Requests
                </Link>
                <label className="relative flex h-10 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full sm:max-w-xs">
                  <Search size={16} className="text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent pl-2 text-xs outline-none text-foreground"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </label>
              </div>

              {/* eBook Table Container */}
              <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3 pr-4 font-semibold">eBook Order</th>
                        <th className="pb-3 px-4 font-semibold text-center w-36">eBook Copies</th>
                        <th className="pb-3 pl-4 font-semibold text-right w-44">Unit Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredCartBooks.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-muted-foreground">
                            No matching items found.
                          </td>
                        </tr>
                      ) : (
                        filteredCartBooks.map((b) => (
                          <tr
                            key={b.id}
                            className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/10"
                          >
                            {/* Book cover, title, author */}
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className="flex h-16 w-11 shrink-0 items-center justify-center rounded-md text-[9px] font-bold text-white shadow-sm"
                                  style={{ background: b.cover }}
                                >
                                  {b.initials}
                                </div>
                                <div className="min-w-0">
                                  <span className="font-semibold text-foreground block truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                                    {b.title}
                                  </span>
                                  <span className="text-xs text-muted-foreground block mt-0.5 truncate">
                                    {b.author}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Copies Quantity Selector counter */}
                            <td className="py-4 px-4 text-center">
                              <div className="inline-flex items-center border border-border rounded-full px-2.5 py-1 bg-white dark:bg-card justify-between w-24 shadow-sm select-none">
                                <button
                                  type="button"
                                  onClick={() => handleDecrement(b.id)}
                                  className="text-muted-foreground hover:text-foreground w-6 h-6 flex items-center justify-center font-bold text-sm cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="font-semibold text-xs text-foreground">
                                  {quantities[b.id] || 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleIncrement(b.id)}
                                  className="text-muted-foreground hover:text-foreground w-6 h-6 flex items-center justify-center font-bold text-sm cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Unit price + Remove button */}
                            <td className="py-4 pl-4 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <div className="text-right">
                                  <span className="font-semibold text-foreground text-sm block">
                                    {b.currency}
                                    {b.unitPrice.toFixed(2)}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                                    incl. GST
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemove(b.id)}
                                  className="h-6 w-6 rounded-full bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                                  title="Remove item"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right side: Order Info Card */}
            <div className="lg:col-span-4 rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
              <div className="bg-secondary/40 px-5 py-3 border-b border-border font-bold text-sm text-slate-700 dark:text-slate-300">
                Order Info
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal(excl. GST)</span>
                  <span className="font-medium text-foreground">₹{subtotalExclGst.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Item Discount</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">₹0.00</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Tax Amount</span>
                  <span className="font-medium text-foreground">₹{taxAmount.toFixed(2)}</span>
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">Total Price :</span>
                  <span className="font-bold text-foreground text-base">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full mt-4 h-11 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileText size={16} />
                  <span>Place Order</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
