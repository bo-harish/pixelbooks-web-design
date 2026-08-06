import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Library as LibraryIcon,
  CreditCard,
  Percent,
  Receipt,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BookCover } from "@/components/ui/book-cover";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin-lib/orders_/$id")({
  component: PBAdminLibraryOrderDetailPage,
});

/* -------------------------------------------------------------------------- */
/*                                MOCK DATA                                   */
/* -------------------------------------------------------------------------- */

type OrderDetail = {
  id: string;
  orderId: string;
  libraryName: string;
  location: string;
  status: string;
  paymentMode: string;
  subtotal: string;
  itemDiscount: string;
  additionalDiscount: number;
  totalTax: string;
  totalPrice: string;
  items: {
    id: string;
    title: string;
    publisher: string;
    qty: number;
    unitPrice: string;
    coverGradient: string;
    initials: string;
  }[];
};

const mockOrderDetails: Record<string, OrderDetail> = {
  off_order_41_jzlzxH: {
    id: "off_order_41_jzlzxH",
    orderId: "off_order_41_jzlzxH",
    libraryName: "The District Central Library",
    location: "Ernakulam",
    status: "Paid",
    paymentMode: "Offline Payment",
    subtotal: "₹5,674.00",
    itemDiscount: "₹2,218.00",
    additionalDiscount: 0,
    totalTax: "₹172.80",
    totalPrice: "₹3,628.80",
    items: [
      {
        id: "BK-101",
        title: "1 Epub",
        publisher: "PixelBooks",
        qty: 1,
        unitPrice: "₹3,628.80",
        coverGradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
        initials: "PB",
      },
    ],
  },
  off_order_41_dInLvA: {
    id: "off_order_41_dInLvA",
    orderId: "off_order_41_dInLvA",
    libraryName: "The District Central Library",
    location: "Ernakulam",
    status: "Paid",
    paymentMode: "Offline Payment",
    subtotal: "₹12,450.00",
    itemDiscount: "₹3,105.00",
    additionalDiscount: 0,
    totalTax: "₹445.00",
    totalPrice: "₹9,345.00",
    items: [
      {
        id: "BK-102",
        title: "Advanced Machine Learning Handbook",
        publisher: "PixelBooks Academic",
        qty: 3,
        unitPrice: "₹3,115.00",
        coverGradient: "linear-gradient(135deg, #047857, #10b981)",
        initials: "ML",
      },
    ],
  },
};

const defaultOrderDetail: OrderDetail = {
  id: "off_order_41_jzlzxH",
  orderId: "off_order_41_jzlzxH",
  libraryName: "The District Central Library",
  location: "Ernakulam",
  status: "Paid",
  paymentMode: "Offline Payment",
  subtotal: "₹5,674.00",
  itemDiscount: "₹2,218.00",
  additionalDiscount: 0,
  totalTax: "₹172.80",
  totalPrice: "₹3,628.80",
  items: [
    {
      id: "BK-101",
      title: "1 Epub",
      publisher: "PixelBooks",
      qty: 1,
      unitPrice: "₹3,628.80",
      coverGradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
      initials: "PB",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

function PBAdminLibraryOrderDetailPage() {
  const { id } = Route.useParams();
  const order = mockOrderDetails[id] || defaultOrderDetail;

  const [additionalDiscount, setAdditionalDiscount] = useState<number>(
    order.additionalDiscount
  );

  // Modal States
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [commissionRate, setCommissionRate] = useState(12);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell
      title="Manage Orders"
      subtitle="Review digital eBook order line items, breakdown taxes, and payment status."
    >
      <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-7xl">
        {/* Back to Manage Orders Navigation Control (Rule 8) */}
        <div className="flex items-center gap-3">
          <Link
            to="/pb-admin-lib/orders"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground shadow-2xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <span className="text-sm font-semibold text-foreground">Order Details</span>
        </div>

        {/* Top Header Card: Library Logo + Name + Print Order Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 shadow-2xs">
              <LibraryIcon size={24} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {order.libraryName}
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Location: {order.location}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
          >
            <Printer size={16} />
            Print Order
          </button>
        </div>

        {/* Main Content: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): eBook Order Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xs space-y-4">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h2 className="text-base font-bold tracking-tight text-foreground">
                  eBook Order Details
                </h2>
                <span className="text-xs font-bold text-muted-foreground font-mono">
                  Order : <span className="text-foreground">{order.orderId}</span>
                </span>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/30">
                      <th className="py-3 px-3 rounded-l-lg">Book</th>
                      <th className="py-3 px-3 text-center">Qty</th>
                      <th className="py-3 px-3 text-right rounded-r-lg">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        {/* Book Cell */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <BookCover
                              initials={item.initials}
                              coverGradient={item.coverGradient}
                              title={item.title}
                              size="xs"
                            />
                            <div>
                              <p className="font-bold text-sm text-foreground leading-snug">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                {item.publisher}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Qty */}
                        <td className="py-4 px-3 text-center font-semibold text-foreground">
                          {item.qty}
                        </td>

                        {/* Unit Price */}
                        <td className="py-4 px-3 text-right font-extrabold text-foreground">
                          {item.unitPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Payment Details */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xs space-y-5">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h2 className="text-base font-bold tracking-tight text-foreground">
                  Payment Details
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                  <CheckCircle2 size={13} /> {order.status}
                </span>
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Payment Mode :</span>
                  <span className="font-semibold text-foreground">{order.paymentMode}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Subtotal :</span>
                  <span className="font-bold text-foreground">{order.subtotal}</span>
                </div>

                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span className="font-medium">Item Discount :</span>
                  <span className="font-bold">{order.itemDiscount}</span>
                </div>

                {/* Additional Discount Input matching screenshot */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-sky-700 dark:text-sky-400 font-medium">
                    Additional Discount :
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground font-semibold">- ₹</span>
                    <input
                      type="number"
                      value={additionalDiscount}
                      onChange={(e) => setAdditionalDiscount(Number(e.target.value))}
                      className="h-8 w-20 rounded-lg border border-border bg-card text-center text-sm font-semibold text-foreground outline-none focus:border-[var(--brand)] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="text-muted-foreground font-medium">Total Tax Amount :</span>
                  <span className="font-semibold text-foreground">{order.totalTax}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/80">
                  <span className="text-base font-extrabold text-foreground">Total Price :</span>
                  <span className="text-xl font-extrabold text-foreground tracking-tight">
                    {order.totalPrice}
                  </span>
                </div>
              </div>

              {/* Primary Action + Quick Link Actions */}
              <div className="space-y-3 pt-3">
                <button
                  type="button"
                  onClick={() => toast.info("Opening Add Payment form...")}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-2xs"
                >
                  <CreditCard size={16} />
                  Add Payment
                </button>

                {/* Styled Link Actions */}
                <div className="space-y-1 pt-1 border-t border-border/50">
                  <button
                    type="button"
                    onClick={() => setIsCommissionModalOpen(true)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary/60 transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                      <Percent size={14} className="text-[var(--brand)] shrink-0" />
                      View Commission Details
                    </span>
                    <span className="text-[var(--brand)] group-hover:underline text-xs font-semibold">
                      View
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsTransactionModalOpen(true)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary/60 transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                      <Receipt size={14} className="text-[var(--brand)] shrink-0" />
                      View Transaction Details
                    </span>
                    <span className="text-[var(--brand)] group-hover:underline text-xs font-semibold">
                      View
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 1: View Transaction Details (Attached Screenshot 1)           */}
      {/* -------------------------------------------------------------------- */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                View Transaction Details
              </h3>
              <button
                type="button"
                onClick={() => setIsTransactionModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Transaction Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-left text-xs font-bold tracking-wider text-muted-foreground">
                    <th className="pb-3 pr-4 pl-2">Reff ID</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Type</th>
                    <th className="pb-3 pl-4 pr-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  <tr className="hover:bg-secondary/40 transition-colors">
                    <td className="py-4 pr-4 pl-2 font-mono text-sm font-semibold text-foreground">
                      #Inv08978
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground">
                      04 Aug 2026
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-foreground">
                      UPI
                    </td>
                    <td className="py-4 pl-4 pr-2 text-right font-bold text-foreground">
                      {order.totalPrice || "₹9,345.00"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer: Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/50 text-xs font-medium text-muted-foreground">
              <span>Showing 1 from 1 results</span>
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  disabled
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-muted-foreground/40 cursor-not-allowed"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 font-bold text-sky-700 dark:text-sky-400">
                  1
                </span>
                <button
                  disabled
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-muted-foreground/40 cursor-not-allowed"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 2: Publisher Commission Details (Attached Screenshot 2)        */}
      {/* -------------------------------------------------------------------- */}
      {isCommissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Publisher Commission Details
              </h3>
              <button
                type="button"
                onClick={() => setIsCommissionModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Publisher Info + Commission Rate Input */}
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-3">
                <BookCover initials="AM" title="Aix-Marseille" size="sm" />
                <span className="font-bold text-foreground text-sm truncate max-w-[180px]">
                  Aix-Marseille Unive...
                </span>
              </div>

              {/* Rate percentage input box matching screenshot */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 shadow-2xs">
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-12 text-center text-sm font-bold text-foreground outline-none bg-transparent"
                />
                <span className="text-sm font-semibold text-muted-foreground">%</span>
              </div>
            </div>

            {/* Footer Apply Button */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  toast.success(`Commission rate set to ${commissionRate}%`);
                  setIsCommissionModalOpen(false);
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--brand)] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-2xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
