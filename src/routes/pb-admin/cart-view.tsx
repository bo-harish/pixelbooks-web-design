import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronDown, ChevronRight, ShoppingCart, BookOpen,
  ArrowLeft, Calendar, TrendingUp,
  IndianRupee, UserCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BookCover } from "@/components/ui/book-cover";

export const Route = createFileRoute("/pb-admin/cart-view")({
  head: () => ({
    meta: [
      { title: "Abandoned Carts — PixelBooks Admin" },
      {
        name: "description",
        content: "Track customers who added books to cart but have not completed their purchase.",
      },
    ],
  }),
  component: CartViewPage,
});

// ── Types ─────────────────────────────────────────────────────────────────────

type CartItem = {
  id: string;
  title: string;
  publisher: string;
  category: string;
  coverGradient: string;
  initials: string;
  price: number;
  addedDate: string;
};

type CustomerCart = {
  id: string;
  customerName: string;
  avatarLetter: string;
  email: string;
  phone: string;
  itemCount: number;
  cartValue: number;
  addedDate: string;
  daysInactive: number;
  items: CartItem[];
};

// ── Sample Data ───────────────────────────────────────────────────────────────

const cartData: CustomerCart[] = [
  {
    id: "cc-1", customerName: "Aarav Sharma", avatarLetter: "AS", email: "aarav.sharma@example.com", phone: "98765 43210",
    itemCount: 4, cartValue: 1196, addedDate: "12 Jun 2026", daysInactive: 43,
    items: [
      { id: "ci-1a", title: "A Beautiful Crime: A Novel", publisher: "Harper Perennial", category: "Crime, Thriller, Mystery", coverGradient: "linear-gradient(135deg,#1e3a8a,#3b82f6)", initials: "AB", price: 299, addedDate: "12 Jun 2026" },
      { id: "ci-1b", title: "The Lean Startup", publisher: "Aisha Publishers", category: "Business", coverGradient: "linear-gradient(135deg,#be123c,#f43f5e)", initials: "LS", price: 349, addedDate: "12 Jun 2026" },
      { id: "ci-1c", title: "A Marginal Jew", publisher: "Anonymous User", category: "Biography", coverGradient: "linear-gradient(135deg,#134e4a,#14b8a6)", initials: "MJ", price: 249, addedDate: "13 Jun 2026" },
      { id: "ci-1d", title: "History of the English People, Volume VII", publisher: "HarperCollins India", category: "History", coverGradient: "linear-gradient(135deg,#9333ea,#6b21a8)", initials: "HE", price: 299, addedDate: "13 Jun 2026" },
    ],
  },
  {
    id: "cc-2", customerName: "Priya Nair", avatarLetter: "PN", email: "priya.nair@example.com", phone: "98123 45678",
    itemCount: 2, cartValue: 598, addedDate: "18 Jun 2026", daysInactive: 37,
    items: [
      { id: "ci-2a", title: "The Glass Palace Chronicle", publisher: "Werley Nortreus", category: "General & Literary Fiction", coverGradient: "linear-gradient(135deg,#d97706,#b45309)", initials: "GP", price: 299, addedDate: "18 Jun 2026" },
      { id: "ci-2b", title: "A little princess, being the whole story of Sara Crewe", publisher: "Kinder Publications", category: "Oscar Wilde", coverGradient: "linear-gradient(135deg,#713f12,#ca8a04)", initials: "LP", price: 299, addedDate: "18 Jun 2026" },
    ],
  },
  {
    id: "cc-3", customerName: "Rohan Mehta", avatarLetter: "RM", email: "rohan.mehta@example.com", phone: "97654 32109",
    itemCount: 3, cartValue: 847, addedDate: "30 Jun 2026", daysInactive: 25,
    items: [
      { id: "ci-3a", title: "A Christmas Carol by Charles Dickens", publisher: "Petals Publishers", category: "Zoho Books", coverGradient: "linear-gradient(135deg,#b45309,#d97706)", initials: "CC", price: 199, addedDate: "30 Jun 2026" },
      { id: "ci-3b", title: "Als Manuskript Gedruckt", publisher: "Oxford University Press", category: "General & Literary Fiction", coverGradient: "linear-gradient(135deg,#ca8a04,#854d0e)", initials: "AM", price: 349, addedDate: "30 Jun 2026" },
      { id: "ci-3c", title: "A Concise History of Computers", publisher: "Orange Publishers", category: "Computer Application", coverGradient: "linear-gradient(135deg,#1e3a8a,#6366f1)", initials: "CH", price: 299, addedDate: "01 Jul 2026" },
    ],
  },
  {
    id: "cc-4", customerName: "Sneha Iyer", avatarLetter: "SI", email: "sneha.iyer@example.com", phone: "96543 21098",
    itemCount: 5, cartValue: 1445, addedDate: "08 Jul 2026", daysInactive: 15,
    items: [
      { id: "ci-4a", title: "A Gift of Ghosts (Tassamara Book 1)", publisher: "Fingerprint Publishing", category: "Fictions", coverGradient: "linear-gradient(135deg,#7f1d1d,#ef4444)", initials: "GG", price: 249, addedDate: "08 Jul 2026" },
      { id: "ci-4b", title: "A Beautiful Crime: A Novel", publisher: "Harper Perennial", category: "Crime, Thriller, Mystery", coverGradient: "linear-gradient(135deg,#1e3a8a,#3b82f6)", initials: "AB", price: 299, addedDate: "08 Jul 2026" },
      { id: "ci-4c", title: "The Lean Startup", publisher: "Aisha Publishers", category: "Business", coverGradient: "linear-gradient(135deg,#be123c,#f43f5e)", initials: "LS", price: 349, addedDate: "09 Jul 2026" },
      { id: "ci-4d", title: "A Comet Appears", publisher: "Cambridge University Press", category: "JEE", coverGradient: "linear-gradient(135deg,#9d174d,#ec4899)", initials: "CA", price: 249, addedDate: "09 Jul 2026" },
      { id: "ci-4e", title: "DiggyPOD Inc 5 x 7 Book Template", publisher: "APK Publishers", category: "General & Literary Fiction", coverGradient: "linear-gradient(135deg,#1d4ed8,#3b82f6)", initials: "DP", price: 299, addedDate: "10 Jul 2026" },
    ],
  },
  {
    id: "cc-5", customerName: "Vikram Das", avatarLetter: "VD", email: "vikram.das@example.com", phone: "95432 10987",
    itemCount: 1, cartValue: 299, addedDate: "10 Jul 2026", daysInactive: 13,
    items: [
      { id: "ci-5a", title: "A Man for Every Purpose", publisher: "Cambridge University Press", category: "NEET", coverGradient: "linear-gradient(135deg,#0c4a6e,#0ea5e9)", initials: "ME", price: 299, addedDate: "10 Jul 2026" },
    ],
  },
  {
    id: "cc-6", customerName: "Ananya Krishnan", avatarLetter: "AK", email: "ananya.k@example.com", phone: "94321 09876",
    itemCount: 3, cartValue: 897, addedDate: "15 Jul 2026", daysInactive: 8,
    items: [
      { id: "ci-6a", title: "A Bride for Tom", publisher: "Meadows Publishers", category: "Arts, Cinema, Photography", coverGradient: "linear-gradient(135deg,#7c3aed,#a855f7)", initials: "BT", price: 299, addedDate: "15 Jul 2026" },
      { id: "ci-6b", title: "A Collection of 14 International Short Stories", publisher: "Meadows Publishers", category: "Arts, Cinema, Photography", coverGradient: "linear-gradient(135deg,#065f46,#10b981)", initials: "CS", price: 299, addedDate: "15 Jul 2026" },
      { id: "ci-6c", title: "A Marginal Jew", publisher: "Anonymous User", category: "Biography", coverGradient: "linear-gradient(135deg,#134e4a,#14b8a6)", initials: "MJ", price: 299, addedDate: "16 Jul 2026" },
    ],
  },
  {
    id: "cc-7", customerName: "Karan Patel", avatarLetter: "KP", email: "karan.patel@example.com", phone: "93210 98765",
    itemCount: 2, cartValue: 548, addedDate: "20 Jul 2026", daysInactive: 3,
    items: [
      { id: "ci-7a", title: "The Glass Palace Chronicle", publisher: "Werley Nortreus", category: "General & Literary Fiction", coverGradient: "linear-gradient(135deg,#d97706,#b45309)", initials: "GP", price: 299, addedDate: "20 Jul 2026" },
      { id: "ci-7b", title: "Als Manuskript Gedruckt", publisher: "Oxford University Press", category: "General & Literary Fiction", coverGradient: "linear-gradient(135deg,#ca8a04,#854d0e)", initials: "AM", price: 249, addedDate: "20 Jul 2026" },
    ],
  },
  {
    id: "cc-8", customerName: "Meera Joshi", avatarLetter: "MJ", email: "meera.joshi@example.com", phone: "92109 87654",
    itemCount: 6, cartValue: 1794, addedDate: "21 Jul 2026", daysInactive: 2,
    items: [
      { id: "ci-8a", title: "A Beautiful Crime: A Novel", publisher: "Harper Perennial", category: "Crime, Thriller, Mystery", coverGradient: "linear-gradient(135deg,#1e3a8a,#3b82f6)", initials: "AB", price: 299, addedDate: "21 Jul 2026" },
      { id: "ci-8b", title: "The Lean Startup", publisher: "Aisha Publishers", category: "Business", coverGradient: "linear-gradient(135deg,#be123c,#f43f5e)", initials: "LS", price: 349, addedDate: "21 Jul 2026" },
      { id: "ci-8c", title: "History of the English People, Volume VII", publisher: "HarperCollins India", category: "History", coverGradient: "linear-gradient(135deg,#9333ea,#6b21a8)", initials: "HE", price: 299, addedDate: "21 Jul 2026" },
      { id: "ci-8d", title: "A Gift of Ghosts (Tassamara Book 1)", publisher: "Fingerprint Publishing", category: "Fictions", coverGradient: "linear-gradient(135deg,#7f1d1d,#ef4444)", initials: "GG", price: 249, addedDate: "21 Jul 2026" },
      { id: "ci-8e", title: "A Comet Appears", publisher: "Cambridge University Press", category: "JEE", coverGradient: "linear-gradient(135deg,#9d174d,#ec4899)", initials: "CA", price: 249, addedDate: "22 Jul 2026" },
      { id: "ci-8f", title: "A Marginal Jew", publisher: "Anonymous User", category: "Biography", coverGradient: "linear-gradient(135deg,#134e4a,#14b8a6)", initials: "MJ", price: 349, addedDate: "22 Jul 2026" },
    ],
  },
  {
    id: "cc-9", customerName: "Arjun Reddy", avatarLetter: "AR", email: "arjun.reddy@example.com", phone: "91098 76543",
    itemCount: 2, cartValue: 648, addedDate: "22 Jul 2026", daysInactive: 1,
    items: [
      { id: "ci-9a", title: "A Concise History of Computers", publisher: "Orange Publishers", category: "Computer Application", coverGradient: "linear-gradient(135deg,#1e3a8a,#6366f1)", initials: "CH", price: 299, addedDate: "22 Jul 2026" },
      { id: "ci-9b", title: "A Man for Every Purpose", publisher: "Cambridge University Press", category: "NEET", coverGradient: "linear-gradient(135deg,#0c4a6e,#0ea5e9)", initials: "ME", price: 349, addedDate: "22 Jul 2026" },
    ],
  },
  {
    id: "cc-10", customerName: "Divya Menon", avatarLetter: "DM", email: "divya.menon@example.com", phone: "90987 65432",
    itemCount: 4, cartValue: 1196, addedDate: "23 Jul 2026", daysInactive: 0,
    items: [
      { id: "ci-10a", title: "A Beautiful Crime: A Novel", publisher: "Harper Perennial", category: "Crime, Thriller, Mystery", coverGradient: "linear-gradient(135deg,#1e3a8a,#3b82f6)", initials: "AB", price: 299, addedDate: "23 Jul 2026" },
      { id: "ci-10b", title: "The Glass Palace Chronicle", publisher: "Werley Nortreus", category: "General & Literary Fiction", coverGradient: "linear-gradient(135deg,#d97706,#b45309)", initials: "GP", price: 299, addedDate: "23 Jul 2026" },
      { id: "ci-10c", title: "A little princess", publisher: "Kinder Publications", category: "Oscar Wilde", coverGradient: "linear-gradient(135deg,#713f12,#ca8a04)", initials: "LP", price: 299, addedDate: "23 Jul 2026" },
      { id: "ci-10d", title: "A Bride for Tom", publisher: "Meadows Publishers", category: "Arts, Cinema, Photography", coverGradient: "linear-gradient(135deg,#7c3aed,#a855f7)", initials: "BT", price: 299, addedDate: "23 Jul 2026" },
    ],
  },
];

// ── Constants & helpers ───────────────────────────────────────────────────────

const presetOptions = ["MTD", "QTD", "YTD", "Current FY", "Last FY", "Last 30 days", "Custom"] as const;
const PAGE_SIZE = 10;

function applyPresetDates(opt: string, setStart: (v: string) => void, setEnd: (v: string) => void) {
  if (opt === "MTD")             { setStart("2026-07-01"); setEnd("2026-07-23"); }
  else if (opt === "QTD")        { setStart("2026-07-01"); setEnd("2026-07-23"); }
  else if (opt === "YTD")        { setStart("2026-01-01"); setEnd("2026-07-23"); }
  else if (opt === "Current FY") { setStart("2026-04-01"); setEnd("2027-03-31"); }
  else if (opt === "Last FY")    { setStart("2025-04-01"); setEnd("2026-03-31"); }
  else if (opt === "Last 30 days"){ setStart("2026-06-23"); setEnd("2026-07-23"); }
}

// ── Shared components ─────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sublabel, accent }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string; sublabel?: string; accent?: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-4 sm:p-5 transition-shadow hover:shadow-md justify-between min-h-[110px] sm:min-h-[120px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: accent ? `color-mix(in oklab,${accent} 12%,transparent)` : "var(--sidebar-highlight)", color: accent ?? "var(--brand)" }}>
          <Icon size={18} />
        </span>
      </div>
      <div>
        <p className="text-2xl font-extrabold tracking-tight text-foreground">{value}</p>
        {sublabel && <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
}

function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" disabled={page === 1} onClick={() => onPage(Math.max(1, page - 1))}
        className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer text-muted-foreground">
        «&nbsp;Previous
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button key={p} type="button" onClick={() => onPage(p)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors cursor-pointer"
          style={p === page ? { backgroundColor: "color-mix(in oklab,var(--brand) 12%,transparent)", color: "var(--brand)" } : undefined}>
          {p}
        </button>
      ))}
      <button type="button" disabled={page === total} onClick={() => onPage(Math.min(total, page + 1))}
        className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer text-muted-foreground">
        Next&nbsp;»
      </button>
    </div>
  );
}

// ── Cart Detail Drill-down ────────────────────────────────────────────────────

function CartDetail({ customer, onBack }: { customer: CustomerCart; onBack: () => void }) {
  const items = customer.items;
  const totalValue = items.reduce((a, i) => a + i.price, 0);

  return (
    <AppShell
      title={customer.customerName}
      subtitle="Abandoned Carts - Cart Details"
      pageIcon={
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 shadow-2xs">
          <UserCheck size={20} />
        </div>
      }
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Back navigation link matching promo-codes */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
            aria-label="Back to Abandoned Carts"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-sm font-normal text-foreground">
            Back to Abandoned Carts
          </span>
        </div>

        {/* Header card */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-xs">
          <div className="flex flex-wrap items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 shadow-2xs">
              <UserCheck size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-foreground">{customer.customerName}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{customer.email} / {customer.phone}</p>
            </div>
            <div className="flex items-center gap-6 ml-auto">
              <div className="text-right">
                <p className="text-lg font-extrabold text-foreground">₹{customer.cartValue.toLocaleString("en-IN")}</p>
                <p className="text-[11px] text-muted-foreground">Cart Value</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-foreground">{customer.itemCount}</p>
                <p className="text-[11px] text-muted-foreground">Items</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-foreground">
                  {customer.daysInactive === 0 ? "Today" : `${customer.daysInactive}d`}
                </p>
                <p className="text-[11px] text-muted-foreground">Days Inactive</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                  <th className="py-4 pr-4 font-semibold">Publisher</th>
                  <th className="py-4 pr-4 font-semibold">Category</th>
                  <th className="py-4 pr-4 font-semibold">Added Date</th>
                  <th className="py-4 pr-6 text-right font-semibold">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {items.length === 0 ? (
                  <tr><td colSpan={5} className="py-16 text-center text-sm text-muted-foreground">No items match your search.</td></tr>
                ) : items.map(item => (
                  <tr key={item.id} className="transition-colors hover:bg-secondary/50">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3 max-w-xs">
                        <BookCover
                          initials={item.initials}
                          coverGradient={item.coverGradient}
                          title={item.title}
                          size="xs"
                        />
                        <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">{item.title}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.publisher}</td>
                    <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.category}</td>
                    <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.addedDate}</td>
                    <td className="py-4 pr-6 text-right font-bold text-foreground whitespace-nowrap">₹{item.price.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border bg-secondary/20 px-6 py-4">
            <span className="text-sm font-bold text-foreground">Cart Total</span>
            <span className="text-base font-extrabold text-foreground">₹{totalValue.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function CartViewPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerCart | null>(null);
  const [preset, setPreset]                     = useState("MTD");
  const [presetOpen, setPresetOpen]             = useState(false);
  const [startDate, setStartDate]               = useState("2026-07-01");
  const [endDate, setEndDate]                   = useState("2026-07-23");
  const [page, setPage]                         = useState(1);

  const filtered = cartData;

  const totalCarts = cartData.length;
  const totalItems = cartData.reduce((a, r) => a + r.itemCount, 0);
  const totalValue = cartData.reduce((a, r) => a + r.cartValue, 0);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage    = Math.min(page, totalPages);
  const pageStart  = (curPage - 1) * PAGE_SIZE;
  const pageItems  = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  if (selectedCustomer) return <CartDetail customer={selectedCustomer} onBack={() => setSelectedCustomer(null)} />;

  return (
    <AppShell
      title="Abandoned Carts"
      subtitle="Customers who added items to cart but have not completed their purchase."
      pageIcon={
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 shadow-2xs">
          <UserCheck size={20} />
        </div>
      }
    >
      <div className="space-y-6 p-4 md:p-8">

        {/* Filter header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card border border-border rounded-xl p-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: "color-mix(in oklab,#f59e0b 12%,transparent)", color: "#f59e0b" }}>
              <Calendar size={16} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">Date Range Filter</h3>
              <p className="text-xs text-muted-foreground">Select period to filter cart activity</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Preset */}
            <div className="relative">
              <button type="button" onClick={() => setPresetOpen(v => !v)}
                className="flex h-11 min-w-[130px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer shadow-2xs">
                <span>{preset}</span><ChevronDown size={15} className="text-muted-foreground shrink-0" />
              </button>
              {presetOpen && (
                <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1">
                  {presetOptions.map(opt => (
                    <button key={opt} type="button"
                      onClick={() => { setPreset(opt); setPresetOpen(false); setPage(1); applyPresetDates(opt, setStartDate, setEndDate); }}
                      className={`flex w-full items-center px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer ${opt === preset ? "font-bold text-brand bg-secondary/60" : "text-foreground"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date pickers */}
            <div className="flex items-center gap-2">
              <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3 shadow-2xs">
                <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPreset("Custom"); }}
                  className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer" />
              </label>
              <span className="text-xs font-medium text-muted-foreground">to</span>
              <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3 shadow-2xs">
                <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPreset("Custom"); }}
                  className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer" />
              </label>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={ShoppingCart} label="Unpurchased Carts" value={totalCarts.toString()}                    sublabel="Active abandoned carts"   accent="#f59e0b" />
          <StatCard icon={BookOpen}     label="Total Items"        value={totalItems.toString()}                    sublabel="Items waiting in carts"   accent="#6366f1" />
          <StatCard icon={IndianRupee}  label="Value at Risk"      value={`₹${totalValue.toLocaleString("en-IN")}`} sublabel="Total potential revenue" accent="#ef4444" />
        </div>

        {/* Main table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Customer</th>
                  <th className="py-4 pr-4 font-semibold text-center">Items</th>
                  <th className="py-4 pr-4 font-semibold">Cart Value</th>
                  <th className="py-4 pr-4 font-semibold">Added Date</th>
                  <th className="py-4 pr-4 font-semibold">
                    <div className="flex items-center gap-1"><TrendingUp size={12} />Days Inactive</div>
                  </th>
                  <th className="py-4 pr-6 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">
                      No unpurchased carts found matching your filters.
                    </td>
                  </tr>
                ) : pageItems.map(row => (
                  <tr key={row.id} onClick={() => setSelectedCustomer(row)}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50 cursor-pointer group">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 shadow-2xs">
                          <UserCheck size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{row.customerName}</p>
                          <p className="text-xs text-muted-foreground">{row.email} / {row.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-center font-semibold text-foreground">{row.itemCount}</td>
                    <td className="py-4 pr-4 font-semibold text-foreground whitespace-nowrap">₹{row.cartValue.toLocaleString("en-IN")}</td>
                    <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{row.addedDate}</td>
                    <td className="py-4 pr-4 font-medium text-foreground">
                      {row.daysInactive === 0 ? "Today" : `${row.daysInactive} days`}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                        <ChevronRight size={16} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {filtered.length === 0 ? "0 results" : `Showing ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, filtered.length)} from ${filtered.length} results`}
            </p>
            <Pagination page={curPage} total={totalPages} onPage={setPage} />
          </div>
          <div className="flex items-center justify-between border-t border-border bg-secondary/20 px-6 py-4">
            <span className="text-sm font-bold text-foreground">Total Value at Risk</span>
            <span className="text-base font-extrabold text-foreground">
              ₹{filtered.reduce((a, r) => a + r.cartValue, 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
