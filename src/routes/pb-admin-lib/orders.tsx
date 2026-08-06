import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  ChevronDown,
  Library as LibraryIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/pb-admin-lib/orders")({
  component: PBAdminLibraryOrdersPage,
});

/* -------------------------------------------------------------------------- */
/*                                MOCK DATA                                   */
/* -------------------------------------------------------------------------- */

type LibraryOrder = {
  id: string;
  orderId: string;
  libraryName: string;
  location: string;
  orderDate: string;
  amount: string;
  status: "Approved" | "Pending" | "Rejected";
};

const initialOrders: LibraryOrder[] = [
  {
    id: "off_order_41_dInLvA",
    orderId: "off_order_41_dInLvA",
    libraryName: "The District Central Library",
    location: "Ernakulam",
    orderDate: "04 Aug 2026",
    amount: "₹9,345.00",
    status: "Approved",
  },
  {
    id: "off_order_41_jzlzxH",
    orderId: "off_order_41_jzlzxH",
    libraryName: "The District Central Library",
    location: "Ernakulam",
    orderDate: "04 Aug 2026",
    amount: "₹3,628.80",
    status: "Approved",
  },
  {
    id: "off_order_41_npQZnN",
    orderId: "off_order_41_npQZnN",
    libraryName: "The District Central Library",
    location: "Ernakulam",
    orderDate: "04 Aug 2026",
    amount: "₹934.50",
    status: "Approved",
  },
  {
    id: "off_order_40_3KyoMf",
    orderId: "off_order_40_3KyoMf",
    libraryName: "National University of Advanced Legal Studies",
    location: "Kochi",
    orderDate: "04 Aug 2026",
    amount: "₹3,357.90",
    status: "Approved",
  },
  {
    id: "off_order_4_uhLrvU",
    orderId: "off_order_4_uhLrvU",
    libraryName: "University of California Berkeley.",
    location: "California",
    orderDate: "04 Aug 2026",
    amount: "₹828.45",
    status: "Approved",
  },
  {
    id: "off_order_41_zjNzjl",
    orderId: "off_order_41_zjNzjl",
    libraryName: "The District Central Library",
    location: "Ernakulam",
    orderDate: "03 Aug 2026",
    amount: "₹828.45",
    status: "Approved",
  },
  {
    id: "off_order_22_Cj0024",
    orderId: "off_order_22_Cj0024",
    libraryName: "APJ Abdul Kalam Technological University APJAKTU",
    location: "Thiruvananthapuram",
    orderDate: "03 Aug 2026",
    amount: "₹341,552.00",
    status: "Pending",
  },
  {
    id: "off_order_22_rgjuHp",
    orderId: "off_order_22_rgjuHp",
    libraryName: "APJ Abdul Kalam Technological University APJAKTU",
    location: "Thiruvananthapuram",
    orderDate: "03 Aug 2026",
    amount: "₹90.30",
    status: "Rejected",
  },
  {
    id: "off_order_22_PdeTcf",
    orderId: "off_order_22_PdeTcf",
    libraryName: "APJ Abdul Kalam Technological University APJAKTU",
    location: "Thiruvananthapuram",
    orderDate: "03 Aug 2026",
    amount: "₹2,625,000.00",
    status: "Approved",
  },
];

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

function PBAdminLibraryOrdersPage() {
  const navigate = useNavigate();
  const [orders] = useState<LibraryOrder[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.libraryName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const statusOptions = ["All", "Approved", "Pending", "Rejected"];

  return (
    <AppShell
      title="Manage Orders"
      subtitle="Review, approve, and track institutional eBook orders and digital license billing."
    >
      <div className="space-y-6 p-4 sm:p-6 md:p-8">
        {/* Toolbar: Search Bar + Custom Dropdown */}
        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3">
            {/* Embedded Search Input */}
            <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 md:max-w-md">
              <Search size={15} className="mr-2 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>

          {/* Custom Status Dropdown (Top Right in attached design) */}
          <div className="relative min-w-[140px] shrink-0">
            <button
              type="button"
              onClick={() => setStatusDropdownOpen((o) => !o)}
              className="flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] shadow-2xs"
            >
              <span>{statusFilter}</span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                  statusDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {statusDropdownOpen && (
              <div
                className="absolute right-0 top-full z-30 mt-2 min-w-[150px] w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1"
                onMouseLeave={() => setStatusDropdownOpen(false)}
              >
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setStatusFilter(opt);
                      setStatusDropdownOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-secondary/60 transition-colors ${
                      opt === statusFilter
                        ? "font-medium text-foreground bg-secondary/50"
                        : "text-muted-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Orders Listing Table */}
        <section className="rounded-2xl border border-border bg-card p-4 md:p-6 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3.5 pr-4 pl-4">Library</th>
                  <th className="pb-3.5 px-4">Order Id</th>
                  <th className="pb-3.5 px-4">Order Date</th>
                  <th className="pb-3.5 px-4 text-right">Amount</th>
                  <th className="pb-3.5 px-4 text-center">Order Status</th>
                  <th className="pb-3.5 pl-4 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate({ to: "/pb-admin-lib/orders/$id", params: { id: order.id } })}
                      className="group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/50"
                    >
                      {/* Library Cell: Icon + Name */}
                      <td className="py-4 pr-4 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 shadow-2xs">
                            <LibraryIcon size={16} />
                          </div>
                          <span className="font-semibold text-foreground text-sm leading-snug group-hover:text-[var(--brand)] transition-colors">
                            {order.libraryName}
                          </span>
                        </div>
                      </td>

                      {/* Order Id Cell */}
                      <td className="py-4 px-4 font-mono text-xs font-medium text-foreground">
                        {order.orderId}
                      </td>

                      {/* Order Date Cell */}
                      <td className="py-4 px-4 text-xs font-medium text-muted-foreground">
                        {order.orderDate}
                      </td>

                      {/* Amount Cell */}
                      <td className="py-4 px-4 text-right font-extrabold text-foreground">
                        {order.amount}
                      </td>

                      {/* Order Status Cell */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : order.status === "Pending"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {order.status === "Approved" ? (
                            <CheckCircle2 size={13} />
                          ) : order.status === "Pending" ? (
                            <Clock size={13} />
                          ) : (
                            <XCircle size={13} />
                          )}
                          {order.status}
                        </span>
                      </td>

                      {/* Action Chevron Wrapper (Rule 9) */}
                      <td className="py-4 pl-4 pr-4 text-right">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                          <ChevronRight size={16} />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
