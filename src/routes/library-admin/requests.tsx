import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShoppingCart, Check, Inbox, ArrowRight, Trash2, Plus, Minus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BookCover } from "@/components/ui/book-cover";
import { toast } from "sonner";

export const Route = createFileRoute("/library-admin/requests")({
  component: LibraryAdminRequestsPage,
});

interface RequestItem {
  id: string;
  title: string;
  initials: string;
  cover: string;
  unitPrice: number;
  count: number;
  currency: string;
}

const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: "req1",
    title: "Aakashakkottaram",
    initials: "AK",
    cover: "linear-gradient(135deg, oklch(0.45 0.15 30), oklch(0.25 0.08 30))",
    unitPrice: 441.0,
    count: 1,
    currency: "₹",
  },
  {
    id: "req2",
    title: "Ayankariyile Chathanmar",
    initials: "AC",
    cover: "linear-gradient(135deg, oklch(0.35 0.08 200), oklch(0.2 0.05 200))",
    unitPrice: 414.75,
    count: 2,
    currency: "₹",
  },
  {
    id: "req3",
    title: "NEP 2020 - Policy Formulation In Education",
    initials: "NEP",
    cover: "linear-gradient(135deg, oklch(0.5 0.15 220), oklch(0.3 0.09 220))",
    unitPrice: 3.15,
    count: 1,
    currency: "₹",
  },
];

export function LibraryAdminRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedQuantities = localStorage.getItem("pixelbooks_cart_quantities");
      if (storedQuantities) {
        const parsed = JSON.parse(storedQuantities);
        return INITIAL_REQUESTS.map((r) => ({
          ...r,
          count: parsed[r.id] ?? r.count,
        }));
      }
    }
    return INITIAL_REQUESTS;
  });

  const [cartItems, setCartItems] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pixelbooks_cart_items");
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  const handleCountChange = (id: string, newCount: number) => {
    if (newCount < 1) return;

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, count: newCount } : r))
    );

    // Sync quantity to localStorage
    const storedQuantities = localStorage.getItem("pixelbooks_cart_quantities");
    const quantities = storedQuantities ? JSON.parse(storedQuantities) : { req1: 1, req2: 2, req3: 1 };
    quantities[id] = newCount;
    localStorage.setItem("pixelbooks_cart_quantities", JSON.stringify(quantities));

    // Dispatch update event to header
    window.dispatchEvent(new Event("pixelbooks_cart_updated"));
  };

  const handleAddToCart = (item: RequestItem) => {
    const newCartItems = { ...cartItems, [item.id]: true };
    setCartItems(newCartItems);
    localStorage.setItem("pixelbooks_cart_items", JSON.stringify(newCartItems));

    const storedQuantities = localStorage.getItem("pixelbooks_cart_quantities");
    const quantities = storedQuantities ? JSON.parse(storedQuantities) : { req1: 1, req2: 2, req3: 1 };
    quantities[item.id] = item.count;
    localStorage.setItem("pixelbooks_cart_quantities", JSON.stringify(quantities));

    const count = Object.values(newCartItems).filter(Boolean).length;
    localStorage.setItem("pixelbooks_cart_count", String(count));

    // Notify header in AppShell
    window.dispatchEvent(new Event("pixelbooks_cart_updated"));

    toast.success(`"${item.title}" (${item.count} ${item.count === 1 ? 'copy' : 'copies'}) added to cart successfully!`);
  };

  return (
    <AppShell title="eBook Requests">
      <div className="p-4 md:p-8 space-y-6">
        {/* Main requests table container matching Orders style */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-4 font-semibold">Title</th>
                  <th className="pb-3 px-4 font-semibold text-center w-44">Requested Count</th>
                  <th className="pb-3 px-4 font-semibold text-center w-36">Price</th>
                  <th className="pb-3 pl-4 font-semibold text-center w-36">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Inbox size={32} className="text-muted-foreground/60" />
                        <p className="font-semibold text-sm">No eBook requests found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => {
                    const totalPrice = r.unitPrice * r.count;
                    const isInCart = !!cartItems[r.id];

                    return (
                      <tr
                        key={r.id}
                        className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/15"
                      >
                        {/* Title with Cover matching Catalogue list style */}
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-4">
                            {/* Book Cover */}
                            <BookCover
                              initials={r.initials}
                              coverGradient={r.cover}
                              title={r.title}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <span className="font-semibold text-foreground block truncate max-w-xs sm:max-w-md">
                                {r.title}
                              </span>
                              <span className="text-xs text-muted-foreground block mt-0.5">
                                {r.currency}
                                {r.unitPrice.toFixed(2)} / copy
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Requested Count Counter Input Widget */}
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center border border-border rounded-full px-2.5 py-1 bg-white dark:bg-card justify-between w-28 shadow-2xs mx-auto">
                            <button
                              type="button"
                              onClick={() => handleCountChange(r.id, r.count - 1)}
                              disabled={r.count <= 1}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground w-6 h-6 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                              title="Decrease requested count"
                            >
                              <Minus size={13} />
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={r.count}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                handleCountChange(r.id, isNaN(val) || val < 1 ? 1 : val);
                              }}
                              className="w-10 text-center font-semibold text-xs text-foreground bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              title="Type requested count"
                            />
                            <button
                              type="button"
                              onClick={() => handleCountChange(r.id, r.count + 1)}
                              className="text-muted-foreground hover:text-foreground w-6 h-6 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                              title="Increase requested count"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </td>

                        {/* Total Price */}
                        <td className="py-4 px-4 text-center font-semibold text-foreground text-sm">
                          {r.currency}
                          {totalPrice.toFixed(2)}
                        </td>

                        {/* Action: Add to Cart button */}
                        <td className="py-4 pl-4 text-center">
                          <button
                            onClick={() => handleAddToCart(r)}
                            disabled={isInCart}
                            className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-semibold transition-all cursor-pointer ${
                              isInCart
                                ? "bg-white dark:bg-card border border-border text-muted-foreground cursor-default"
                                : "bg-[var(--brand)] text-white hover:opacity-90 active:scale-[0.98]"
                            }`}
                          >
                            {isInCart ? (
                              <>
                                <Check size={13} />
                                <span>In Cart ({r.count})</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={13} />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Right Actions inside the grid card */}
          {Object.values(cartItems).some(Boolean) && (
            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/80">
              <button
                type="button"
                onClick={() => {
                  setCartItems({});
                  localStorage.removeItem("pixelbooks_cart_items");
                  localStorage.setItem("pixelbooks_cart_count", "0");
                  window.dispatchEvent(new Event("pixelbooks_cart_updated"));
                  toast.success("Order cart cleared successfully!");
                }}
                className="h-11 px-5 rounded-lg border border-border bg-white dark:bg-card text-muted-foreground hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/40 dark:hover:bg-rose-950/10 transition-all cursor-pointer text-sm font-semibold flex items-center justify-center gap-1.5"
              >
                <Trash2 size={16} />
                <span>Clear Cart</span>
              </button>
              <Link
                to="/library-admin/cart"
                className="h-11 px-6 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Cart</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

