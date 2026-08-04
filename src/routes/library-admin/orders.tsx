import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  X,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Upload,
  FileText,
  HelpCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export const Route = createFileRoute("/library-admin/orders")({
  component: LibraryAdminOrdersPage,
});

interface OrderItem {
  title: string;
  author: string;
  copies: number;
  price: number;
  initials: string;
  cover: string;
}

interface StatusHistoryItem {
  status: "Approved" | "Pending" | "Rejected";
  date: string;
  user: string;
  note: string;
}

interface Order {
  id: string;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
  orderedBy: string;
  department: string;
  items: OrderItem[];
  totalAmount: number;
  comments?: string;
  statusHistory: StatusHistoryItem[];
}

const initialOrders: Order[] = [
  {
    id: "off_order_15_VStr51",
    status: "Approved",
    date: "23 Mar 2026",
    orderedBy: "Dr. Anya Ramanathan",
    department: "Literature & Languages",
    totalAmount: 189.9,
    comments: "Approved and digital titles added to the active library catalogue.",
    items: [
      {
        title: "The Innocents Abroad",
        author: "Mark Twain",
        copies: 5,
        price: 15.99,
        initials: "TIA",
        cover: "linear-gradient(135deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
      },
      {
        title: "Life on the Mississippi",
        author: "Mark Twain",
        copies: 6,
        price: 18.32,
        initials: "LOM",
        cover: "linear-gradient(135deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "21 Mar 2026",
        user: "Dr. Anya Ramanathan",
        note: "Order submitted for literature seminar syllabus.",
      },
      {
        status: "Approved",
        date: "23 Mar 2026",
        user: "Admin (System)",
        note: "Budget clearance received. Licenses provisioned.",
      },
    ],
  },
  {
    id: "off_order_15_HHx0eU",
    status: "Approved",
    date: "08 Jan 2026",
    orderedBy: "Prof. Charles Aris",
    department: "Mathematics & Stats",
    totalAmount: 899.5,
    comments: "Bulk acquisition approved for engineering statistics course.",
    items: [
      {
        title: "On Growth and Form",
        author: "D'Arcy Wentworth Thompson",
        copies: 25,
        price: 35.98,
        initials: "OGF",
        cover: "linear-gradient(135deg, oklch(0.5 0.1 60), oklch(0.32 0.06 60))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "06 Jan 2026",
        user: "Prof. Charles Aris",
        note: "Requested 25 licenses for class reference.",
      },
      {
        status: "Approved",
        date: "08 Jan 2026",
        user: "Admin (System)",
        note: "Approved under Department reference grant.",
      },
    ],
  },
  {
    id: "off_order_15_N5WkeH",
    status: "Pending",
    date: "07 Jan 2026",
    orderedBy: "Dr. Anya Ramanathan",
    department: "Fine Arts",
    totalAmount: 118.5,
    items: [
      {
        title: "Of the Just Shaping of Letters",
        author: "Albrecht Dürer",
        copies: 3,
        price: 39.5,
        initials: "OJS",
        cover: "linear-gradient(135deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "07 Jan 2026",
        user: "Dr. Anya Ramanathan",
        note: "Requested typography reference text.",
      },
    ],
  },
  {
    id: "off_order_15_majm4a",
    status: "Rejected",
    date: "08 Dec 2025",
    orderedBy: "Prof. Liam Vance",
    department: "History & Archives",
    totalAmount: 220.0,
    comments:
      "Rejected: Duplicate request. The library already has sufficient active licenses of this title.",
    items: [
      {
        title: "Knowledge for the Time",
        author: "John Timbs",
        copies: 10,
        price: 22.0,
        initials: "KFT",
        cover: "linear-gradient(135deg, oklch(0.5 0.12 200), oklch(0.32 0.07 200))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "05 Dec 2025",
        user: "Prof. Liam Vance",
        note: "Additional research reference requested.",
      },
      {
        status: "Rejected",
        date: "08 Dec 2025",
        user: "Library Reviewer",
        note: "Duplicate licences catalogued under reference code Ref-991.",
      },
    ],
  },
  {
    id: "off_order_15_JjCpx4",
    status: "Approved",
    date: "08 Dec 2025",
    orderedBy: "Dr. Sarah Jenkins",
    department: "Social Sciences",
    totalAmount: 145.0,
    comments: "Approved. Licenses delivered successfully.",
    items: [
      {
        title: "Gulliver's Travels",
        author: "Jonathan Swift",
        copies: 10,
        price: 14.5,
        initials: "GTR",
        cover: "linear-gradient(135deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "06 Dec 2025",
        user: "Dr. Sarah Jenkins",
        note: "Undergraduate curriculum reference book.",
      },
      {
        status: "Approved",
        date: "08 Dec 2025",
        user: "Admin (System)",
        note: "Approved under central literary fund.",
      },
    ],
  },
  {
    id: "off_order_15_bAeYNV",
    status: "Approved",
    date: "08 Dec 2025",
    orderedBy: "Prof. David Miller",
    department: "Political Science",
    totalAmount: 99.0,
    comments: "Acquisition finalized.",
    items: [
      {
        title: "Common Sense",
        author: "Thomas Paine",
        copies: 10,
        price: 9.9,
        initials: "CMS",
        cover: "linear-gradient(135deg, oklch(0.55 0.14 240), oklch(0.32 0.09 240))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "04 Dec 2025",
        user: "Prof. David Miller",
        note: "Political theory class readings.",
      },
      { status: "Approved", date: "08 Dec 2025", user: "Admin (System)", note: "Approved." },
    ],
  },
  {
    id: "off_order_15_b9jcjU",
    status: "Approved",
    date: "03 Dec 2025",
    orderedBy: "Dr. Anya Ramanathan",
    department: "Literature & Languages",
    totalAmount: 79.92,
    comments: "Approved and titles catalogued.",
    items: [
      {
        title: "A Tangled Tale",
        author: "Lewis Carroll",
        copies: 8,
        price: 9.99,
        initials: "ATT",
        cover: "linear-gradient(135deg, oklch(0.5 0.13 10), oklch(0.32 0.08 10))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "01 Dec 2025",
        user: "Dr. Anya Ramanathan",
        note: "Recreation math readings.",
      },
      {
        status: "Approved",
        date: "03 Dec 2025",
        user: "Admin (System)",
        note: "Approved and licensed.",
      },
    ],
  },
  {
    id: "off_order_15_BPAm7C",
    status: "Approved",
    date: "03 Dec 2025",
    orderedBy: "Prof. Liam Vance",
    department: "Literature & Languages",
    totalAmount: 64.75,
    comments: "Reference copies available.",
    items: [
      {
        title: "The Elements of Style",
        author: "William Strunk Jr.",
        copies: 5,
        price: 12.95,
        initials: "STY",
        cover: "linear-gradient(135deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "02 Dec 2025",
        user: "Prof. Liam Vance",
        note: "Grammar guidelines and writing structure.",
      },
      {
        status: "Approved",
        date: "03 Dec 2025",
        user: "Admin (System)",
        note: "Acquisition cleared.",
      },
    ],
  },
  // Additional 8 items for a total of 16 records
  {
    id: "off_order_15_T9YhKz",
    status: "Approved",
    date: "25 Nov 2025",
    orderedBy: "Prof. Charles Aris",
    department: "Philosophy",
    totalAmount: 249.75,
    comments: "Approved under central library fund.",
    items: [
      {
        title: "Meditations",
        author: "Marcus Aurelius",
        copies: 15,
        price: 16.65,
        initials: "MED",
        cover: "linear-gradient(135deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "23 Nov 2025",
        user: "Prof. Charles Aris",
        note: "Stoic philosophy course reading texts.",
      },
      { status: "Approved", date: "25 Nov 2025", user: "Admin (System)", note: "Cleared." },
    ],
  },
  {
    id: "off_order_15_W4nKe9",
    status: "Pending",
    date: "14 Nov 2025",
    orderedBy: "Dr. Sarah Jenkins",
    department: "Social Sciences",
    totalAmount: 180.0,
    items: [
      {
        title: "The Republic",
        author: "Plato",
        copies: 10,
        price: 18.0,
        initials: "REP",
        cover: "linear-gradient(135deg, oklch(0.5 0.1 60), oklch(0.32 0.06 60))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "14 Nov 2025",
        user: "Dr. Sarah Jenkins",
        note: "Classic texts for philosophy syllabus.",
      },
    ],
  },
  {
    id: "off_order_15_K3Lp62",
    status: "Approved",
    date: "04 Nov 2025",
    orderedBy: "Prof. Liam Vance",
    department: "Science & Technology",
    totalAmount: 399.8,
    comments: "Approved. Licenses updated.",
    items: [
      {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        copies: 20,
        price: 19.99,
        initials: "BHT",
        cover: "linear-gradient(135deg, oklch(0.5 0.12 200), oklch(0.32 0.07 200))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "02 Nov 2025",
        user: "Prof. Liam Vance",
        note: "Astrophysics and general cosmology.",
      },
      { status: "Approved", date: "04 Nov 2025", user: "Admin (System)", note: "Approved." },
    ],
  },
  {
    id: "off_order_15_HhT9a1",
    status: "Rejected",
    date: "28 Oct 2025",
    orderedBy: "Dr. Anya Ramanathan",
    department: "History & Archives",
    totalAmount: 140.0,
    comments: "Rejected: Out of stock/licensing restrictions from publisher.",
    items: [
      {
        title: "The Art of War",
        author: "Sun Tzu",
        copies: 10,
        price: 14.0,
        initials: "WAR",
        cover: "linear-gradient(135deg, oklch(0.5 0.13 10), oklch(0.32 0.08 10))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "25 Oct 2025",
        user: "Dr. Anya Ramanathan",
        note: "Military history study items.",
      },
      {
        status: "Rejected",
        date: "28 Oct 2025",
        user: "Publisher Review",
        note: "Publisher has suspended digital distribution of this edition.",
      },
    ],
  },
  {
    id: "off_order_15_Xyz341",
    status: "Approved",
    date: "12 Oct 2025",
    orderedBy: "Dr. Anya Ramanathan",
    department: "Literature & Languages",
    totalAmount: 75.0,
    comments: "Approved. Catalogued.",
    items: [
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        copies: 5,
        price: 15.0,
        initials: "PAP",
        cover: "linear-gradient(135deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "10 Oct 2025",
        user: "Dr. Anya Ramanathan",
        note: "English literature syllabus requirements.",
      },
      { status: "Approved", date: "12 Oct 2025", user: "Admin (System)", note: "Cleared." },
    ],
  },
  {
    id: "off_order_15_Plm887",
    status: "Approved",
    date: "30 Sep 2025",
    orderedBy: "Prof. Charles Aris",
    department: "Literature & Languages",
    totalAmount: 120.0,
    comments: "Approved.",
    items: [
      {
        title: "Frankenstein",
        author: "Mary Shelley",
        copies: 8,
        price: 15.0,
        initials: "FRK",
        cover: "linear-gradient(135deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "28 Sep 2025",
        user: "Prof. Charles Aris",
        note: "Gothic literature reference book request.",
      },
      {
        status: "Approved",
        date: "30 Sep 2025",
        user: "Admin (System)",
        note: "Approved and licensed.",
      },
    ],
  },
  {
    id: "off_order_15_Rte652",
    status: "Approved",
    date: "15 Sep 2025",
    orderedBy: "Dr. Anya Ramanathan",
    department: "Fine Arts",
    totalAmount: 180.0,
    comments: "Acquisition finalized.",
    items: [
      {
        title: "Walden",
        author: "Henry David Thoreau",
        copies: 12,
        price: 15.0,
        initials: "WAL",
        cover: "linear-gradient(135deg, oklch(0.5 0.1 60), oklch(0.32 0.06 60))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "10 Sep 2025",
        user: "Dr. Anya Ramanathan",
        note: "Transcendentalist philosophy study readings.",
      },
      { status: "Approved", date: "15 Sep 2025", user: "Admin (System)", note: "Approved." },
    ],
  },
  {
    id: "off_order_15_Mnb123",
    status: "Approved",
    date: "01 Sep 2025",
    orderedBy: "Dr. Anya Ramanathan",
    department: "Literature & Languages",
    totalAmount: 160.0,
    comments: "Approved. All titles downloaded.",
    items: [
      {
        title: "A Connecticut Yankee in King Arthur's Court",
        author: "Mark Twain",
        copies: 10,
        price: 16.0,
        initials: "ACY",
        cover: "linear-gradient(135deg, oklch(0.85 0.10 80), oklch(0.65 0.08 80))",
      },
    ],
    statusHistory: [
      {
        status: "Pending",
        date: "28 Aug 2025",
        user: "Dr. Anya Ramanathan",
        note: "Twain collection additions.",
      },
      { status: "Approved", date: "01 Sep 2025", user: "Admin (System)", note: "Approved." },
    ],
  },
];

// Available books in the Publisher Catalogue to buy/request
const purchaseableBooks = [
  {
    id: "pub-1",
    title: "The Innocents Abroad",
    author: "Mark Twain",
    price: 15.99,
    initials: "TIA",
    cover: "linear-gradient(135deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
  },
  {
    id: "pub-2",
    title: "Life on the Mississippi",
    author: "Mark Twain",
    price: 18.32,
    initials: "LOM",
    cover: "linear-gradient(135deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
  },
  {
    id: "pub-3",
    title: "On Growth and Form",
    author: "D'Arcy Wentworth Thompson",
    price: 35.98,
    initials: "OGF",
    cover: "linear-gradient(135deg, oklch(0.5 0.1 60), oklch(0.32 0.06 60))",
  },
  {
    id: "pub-4",
    title: "Of the Just Shaping of Letters",
    author: "Albrecht Dürer",
    price: 39.5,
    initials: "OJS",
    cover: "linear-gradient(135deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
  },
  {
    id: "pub-5",
    title: "Knowledge for the Time",
    author: "John Timbs",
    price: 22.0,
    initials: "KFT",
    cover: "linear-gradient(135deg, oklch(0.5 0.12 200), oklch(0.32 0.07 200))",
  },
  {
    id: "pub-6",
    title: "Gulliver's Travels",
    author: "Jonathan Swift",
    price: 14.5,
    initials: "GTR",
    cover: "linear-gradient(135deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
  },
  {
    id: "pub-7",
    title: "Common Sense",
    author: "Thomas Paine",
    price: 9.9,
    initials: "CMS",
    cover: "linear-gradient(135deg, oklch(0.55 0.14 240), oklch(0.32 0.09 240))",
  },
  {
    id: "pub-8",
    title: "A Tangled Tale",
    author: "Lewis Carroll",
    price: 9.99,
    initials: "ATT",
    cover: "linear-gradient(135deg, oklch(0.5 0.13 10), oklch(0.32 0.08 10))",
  },
];

const departments = [
  "Literature & Languages",
  "Mathematics & Stats",
  "Fine Arts",
  "History & Archives",
  "Social Sciences",
  "Political Science",
  "Science & Technology",
];

function LibraryAdminOrdersPage() {
  const PRESETS = ["MTD", "QTD", "YTD", "Last 30 days", "Custom"] as const;
  type Preset = (typeof PRESETS)[number];

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<"All" | "Approved" | "Pending" | "Rejected">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  // Date Preset states matching margin-report
  const [preset, setPreset] = useState<Preset>("YTD");
  const [presetOpen, setPresetOpen] = useState(false);
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState("2026-07-11");

  // Modal Dialog states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Buy eBook Form states
  const [buySearch, setBuySearch] = useState("");
  const [selectedBuyBook, setSelectedBuyBook] = useState<(typeof purchaseableBooks)[0] | null>(
    null,
  );
  const [buyCopies, setBuyCopies] = useState(5);
  const [buyDepartment, setBuyDepartment] = useState(departments[0]);
  const [buyComments, setBuyComments] = useState("");

  // Upload Offline Order Form states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDragging, setUploadDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Filtering logic
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Date Range Filter
      const oDate = new Date(o.date);
      const fromDate = new Date(from);
      const toDate = new Date(to);
      oDate.setHours(0, 0, 0, 0);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      const matchesDate = oDate >= fromDate && oDate <= toDate;
      if (!matchesDate) return false;

      // Tab status filter
      if (activeTab !== "All") {
        if (activeTab === "Pending" && o.status !== "Pending") return false;
        if (activeTab === "Approved" && o.status !== "Approved") return false;
        if (activeTab === "Rejected" && o.status !== "Rejected") return false;
      }

      // Search Query filter (matches order ID, ordered by, or book title inside items)
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesId = o.id.toLowerCase().includes(query);
        const matchesUser = o.orderedBy.toLowerCase().includes(query);
        const matchesDept = o.department.toLowerCase().includes(query);
        const matchesBooks = o.items.some(
          (item) =>
            item.title.toLowerCase().includes(query) || item.author.toLowerCase().includes(query),
        );
        if (!matchesId && !matchesUser && !matchesDept && !matchesBooks) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, searchQuery, from, to]);

  // Pagination calculations
  const totalResults = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);

  // Handlers
  const handlePresetSelect = (p: Preset) => {
    setPreset(p);
    setPresetOpen(false);

    const today = new Date("2026-07-11");
    let fromDate = new Date("2026-07-11");
    const toDate = new Date("2026-07-11");

    if (p === "MTD") {
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (p === "QTD") {
      const quarter = Math.floor(today.getMonth() / 3);
      fromDate = new Date(today.getFullYear(), quarter * 3, 1);
    } else if (p === "YTD") {
      fromDate = new Date(today.getFullYear(), 0, 1);
    } else if (p === "Last 30 days") {
      fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 30);
    } else {
      return; // Custom
    }

    const formatDate = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    setFrom(formatDate(fromDate));
    setTo(formatDate(toDate));
    setPage(1);
  };
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuyBook) {
      toast.error("Please select a book to buy.");
      return;
    }

    const newOrderId = `off_order_15_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newOrder: Order = {
      id: newOrderId,
      status: "Pending",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      orderedBy: "Dr. Anya Ramanathan",
      department: buyDepartment,
      totalAmount: parseFloat((selectedBuyBook.price * buyCopies).toFixed(2)),
      items: [
        {
          title: selectedBuyBook.title,
          author: selectedBuyBook.author,
          copies: buyCopies,
          price: selectedBuyBook.price,
          initials: selectedBuyBook.initials,
          cover: selectedBuyBook.cover,
        },
      ],
      statusHistory: [
        {
          status: "Pending",
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          user: "Dr. Anya Ramanathan",
          note: buyComments || "Direct digital license order placed.",
        },
      ],
    };

    setOrders([newOrder, ...orders]);
    setIsBuyOpen(false);
    // Reset form
    setSelectedBuyBook(null);
    setBuyCopies(5);
    setBuyComments("");
    setPage(1);
    toast.success(`eBook Order ${newOrderId} requested successfully!`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragging(true);
  };

  const handleDragLeave = () => {
    setUploadDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".csv") || file.name.endsWith(".xlsx")) {
        setUploadFile(file);
      } else {
        toast.error("Only CSV or Excel (.xlsx) files are supported.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".csv") || file.name.endsWith(".xlsx")) {
        setUploadFile(file);
      } else {
        toast.error("Only CSV or Excel (.xlsx) files are supported.");
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error("Please drop or choose a file first.");
      return;
    }

    setUploadProgress(0);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setUploadProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        // Add a mock order from the uploaded file
        const newOrderId = `off_order_15_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const newOrder: Order = {
          id: newOrderId,
          status: "Approved",
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          orderedBy: "Dr. Anya Ramanathan",
          department: "Literature & Languages",
          totalAmount: 320.0,
          comments: "Uploaded spreadsheet batch order auto-approved.",
          items: [
            {
              title: "The Republic",
              author: "Plato",
              copies: 10,
              price: 18.0,
              initials: "REP",
              cover: "linear-gradient(135deg, oklch(0.5 0.1 60), oklch(0.32 0.06 60))",
            },
            {
              title: "The Art of War",
              author: "Sun Tzu",
              copies: 10,
              price: 14.0,
              initials: "WAR",
              cover: "linear-gradient(135deg, oklch(0.5 0.13 10), oklch(0.32 0.08 10))",
            },
          ],
          statusHistory: [
            {
              status: "Approved",
              date: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              user: "System",
              note: `Offline order spreadsheet "${uploadFile.name}" import completed successfully.`,
            },
          ],
        };

        setOrders([newOrder, ...orders]);
        setIsUploadOpen(false);
        setUploadFile(null);
        setUploadProgress(null);
        setPage(1);
        toast.success(`Spreadsheet upload completed! Order ${newOrderId} processed.`);
      }
    }, 200);
  };

  const filteredPurchaseBooks = purchaseableBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(buySearch.toLowerCase()) ||
      b.author.toLowerCase().includes(buySearch.toLowerCase()),
  );

  if (isViewOpen && selectedOrder) {
    const isFreeOrder =
      selectedOrder.totalAmount === 0 || selectedOrder.items.every((item) => item.price === 0);
    const isRupee = selectedOrder.id.toLowerCase().startsWith("off_order_15");
    const currency = isRupee ? "₹" : "$";
    const subtotalText = isFreeOrder
      ? `${currency}0.00`
      : `${currency}${selectedOrder.totalAmount.toFixed(2)}`;
    const totalPriceText = isFreeOrder
      ? `${currency}0.00`
      : `${currency}${selectedOrder.totalAmount.toFixed(2)}`;

    return (
      <AppShell title="Order Details">
        <div className="p-4 md:p-8 space-y-6">
          {/* Back button */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsViewOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                aria-label="Back to Orders"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-sm font-normal text-foreground">Back to Orders</span>
            </div>
            <button
              onClick={() => {
                window.print();
                toast.success("Preparing printable document...");
              }}
              className="h-10 rounded-full bg-[var(--brand)] text-white px-6 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
            >
              Print Order
            </button>
          </div>

          {/* Main Card Container */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
            {/* Split Content columns */}
            <div className="grid grid-cols-12 gap-6 lg:gap-8">
              {/* Left Column: eBook Order Details */}
              <div className="col-span-12 lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-base font-semibold text-foreground">eBook Order Details</h3>
                  <p className="text-sm font-semibold text-foreground">
                    Order ID : <span className="text-foreground">{selectedOrder.id}</span>
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-secondary/40 border border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <th className="py-2.5 px-4 font-semibold rounded-l-lg">Title</th>
                        <th className="py-2.5 px-4 font-semibold text-center">Qty</th>
                        <th className="py-2.5 px-4 font-semibold text-right rounded-r-lg">
                          Unit Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {selectedOrder.items.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-secondary/15 transition-colors border-b border-border/40"
                        >
                          <td className="py-4 px-4 font-medium text-foreground">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex h-11 w-8 shrink-0 items-center justify-center rounded text-[8px] font-bold text-white shadow-sm"
                                style={{ background: item.cover || "var(--brand)" }}
                              >
                                {item.initials}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-sm">
                                  {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {item.author}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center text-sm font-medium text-foreground">
                            {item.copies}
                          </td>
                          <td className="py-4 px-4 text-right text-sm font-semibold text-foreground">
                            {item.price === 0 ? "Free" : `${currency}${item.price.toFixed(2)}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <span>
                    Showing {selectedOrder.items.length} from {selectedOrder.items.length} results
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled
                      className="h-7 px-2 border border-border bg-slate-50 dark:bg-card text-muted-foreground rounded text-[11px] disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button className="h-7 w-7 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 rounded font-semibold text-[11px]">
                      1
                    </button>
                    <button
                      disabled
                      className="h-7 px-2 border border-border bg-slate-50 dark:bg-card text-muted-foreground rounded text-[11px] disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Details */}
              <div className="col-span-12 lg:col-span-4 border-t lg:border-t-0 lg:border-l border-border/80 pt-6 lg:pt-0 pl-0 lg:pl-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Payment Details</h3>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20 gap-1 tracking-wider leading-none mr-2">
                    <CheckCircle2 size={12} />
                    {isFreeOrder ? "Free" : "Paid"}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Payment details
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {subtotalText}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Item Discount
                    </span>
                    <span className="font-semibold text-slate-850 dark:text-slate-200">
                      - {currency}0.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Date:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedOrder.date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Total Tax Amount
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {currency}0.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-semibold text-foreground">Total Price</span>
                    <span className="text-base font-bold text-foreground">{totalPriceText}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Orders" subtitle="Track and manage library eBook acquisition orders.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Actions Bar */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setIsBuyOpen(true)}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] text-white px-4 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            <span>Buy eBook</span>
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-white dark:bg-card px-4 text-sm font-semibold hover:bg-secondary/60 active:scale-[0.98] transition-all text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Upload size={16} />
            <span>Upload Order</span>
          </button>
        </div>

        {/* Redesigned Unified Toolbar */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
          {/* Left Side: Status Dropdown + Search Input */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1 w-full lg:max-w-xl">
            {/* Dropdown Filter */}
            <DropdownSelect
              value={activeTab === "Pending" ? "Pending Approval" : activeTab}
              options={["All", "Approved", "Pending Approval", "Rejected"]}
              onChange={(label) => {
                const tab = label === "Pending Approval" ? "Pending" : (label as "All" | "Approved" | "Pending" | "Rejected");
                setActiveTab(tab);
                setPage(1);
              }}
              searchable
              searchPlaceholder="Search status..."
              className="w-full sm:w-auto min-w-[160px]"
            />

            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-lg border border-border bg-white dark:bg-card pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] text-foreground"
              />
            </div>
          </div>

          {/* Right Side: Date Presets & Date Pickers */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center md:gap-3 w-full lg:w-auto">
            {/* Preset Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setPresetOpen((v) => !v)}
                className="flex h-11 w-full items-center justify-between gap-6 rounded-lg border border-border bg-card px-3 text-sm font-medium sm:w-40 text-foreground cursor-pointer"
              >
                <span>{preset}</span>
                <ChevronDown size={15} className="text-muted-foreground" />
              </button>
              {presetOpen && (
                <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-40">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePresetSelect(p)}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                        p === preset ? "font-semibold text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Start Date */}
            <label className="relative flex h-10 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full sm:w-36">
              <input
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setPreset("Custom");
                  setPage(1);
                }}
                className="w-full bg-transparent text-sm outline-none text-foreground"
              />
            </label>

            {/* End Date */}
            <label className="relative flex h-10 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full sm:w-36">
              <input
                type="date"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setPreset("Custom");
                  setPage(1);
                }}
                className="w-full bg-transparent text-sm outline-none text-foreground"
              />
            </label>
          </div>
        </div>

        {/* Main Orders Table container */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-4 font-semibold">Order Requests</th>
                  <th className="pb-3 px-4 font-semibold">Status</th>
                  <th className="pb-3 px-4 font-semibold">Order Date</th>
                  <th className="pb-3 pl-4 font-semibold text-right pr-6"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText size={32} className="text-muted-foreground/60" />
                        <p className="font-semibold text-sm">No orders found</p>
                        <p className="text-xs">Try adjusting your search query or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((o) => {
                    return (
                      <tr
                        key={o.id}
                        onClick={() => handleViewDetails(o)}
                        className="group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/30"
                      >
                        {/* Order Requests (Title & Details) */}
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5">
                              <BookOpen size={16} />
                            </span>
                            <div className="min-w-0">
                              <span className="font-medium text-foreground block truncate max-w-xs sm:max-w-md">
                                {o.id}
                              </span>
                              <span className="text-xs text-muted-foreground block truncate">
                                {o.items.length} title(s) · {o.orderedBy} ({o.department})
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status Pills */}
                        <td className="py-4 px-4">
                          {o.status === "Approved" && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-500/5 dark:border-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-500">
                              <CheckCircle2 size={12} />
                              <span>Approved</span>
                            </span>
                          )}
                          {o.status === "Pending" && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-500/5 dark:border-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-500">
                              <Clock size={12} />
                              <span>Pending</span>
                            </span>
                          )}
                          {o.status === "Rejected" && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/50 dark:bg-rose-500/5 dark:border-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-500">
                              <XCircle size={12} />
                              <span>Rejected</span>
                            </span>
                          )}
                        </td>

                        {/* Order Date */}
                        <td className="py-4 px-4 text-muted-foreground font-medium text-xs sm:text-sm">
                          {o.date}
                        </td>

                        {/* Action Chevron */}
                        <td className="py-4 pr-6 text-right">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                            <ChevronRight size={16} />
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Pagination Row */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
            <span className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">{paginatedOrders.length}</span> from{" "}
              <span className="font-semibold text-foreground">{totalResults}</span> results
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-white dark:bg-card px-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isPageActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold border transition-all ${
                      isPageActive
                        ? "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800"
                        : "bg-white dark:bg-card text-muted-foreground border-border hover:bg-secondary/40 hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-white dark:bg-card px-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* View Details Modal Dialog */}

        {/* Buy eBook Modal Dialog */}
        <Dialog open={isBuyOpen} onOpenChange={setIsBuyOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-xl shadow-xl p-6">
            <div className="border-b border-border pb-4 mb-4">
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                Order / Buy digital eBook
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Request new digital library licenses from publishers.
              </DialogDescription>
            </div>

            <form onSubmit={handleBuySubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Publisher Catalogue selection search */}
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">Select eBook</label>
                <div className="relative">
                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-3.5 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Search publisher books..."
                    value={buySearch}
                    onChange={(e) => {
                      setBuySearch(e.target.value);
                      setSelectedBuyBook(null);
                    }}
                    className="h-9 w-full rounded-lg border border-border bg-white dark:bg-card pl-8 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                  />
                </div>

                {/* Dropdown list matches */}
                {!selectedBuyBook && buySearch.trim() !== "" && (
                  <div className="border border-border rounded-lg max-h-40 overflow-y-auto bg-card divide-y divide-border shadow-sm mt-1">
                    {filteredPurchaseBooks.length === 0 ? (
                      <p className="p-3 text-center text-xs text-muted-foreground">
                        No matches found
                      </p>
                    ) : (
                      filteredPurchaseBooks.map((b) => (
                        <button
                          type="button"
                          key={b.id}
                          onClick={() => {
                            setSelectedBuyBook(b);
                            setBuySearch(b.title);
                          }}
                          className="w-full text-left p-2.5 hover:bg-secondary/40 transition-colors flex items-center gap-2 text-xs"
                        >
                          <div
                            className="flex h-8 w-5 shrink-0 items-center justify-center rounded text-[7px] font-bold text-white"
                            style={{ background: b.cover }}
                          >
                            {b.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{b.title}</p>
                            <p className="text-muted-foreground text-[10px]">
                              {b.author} · ${b.price}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {selectedBuyBook && (
                <div className="rounded-lg border border-[var(--brand)] bg-[var(--sidebar-highlight)]/40 p-3 flex items-center gap-3">
                  <div
                    className="flex h-11 w-8 shrink-0 items-center justify-center rounded-md text-[8px] font-bold text-white shadow-sm"
                    style={{ background: selectedBuyBook.cover }}
                  >
                    {selectedBuyBook.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--brand)]">
                      {selectedBuyBook.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{selectedBuyBook.author}</p>
                    <p className="text-[10px] font-bold text-foreground mt-0.5">
                      Price: ${selectedBuyBook.price.toFixed(2)} / license
                    </p>
                  </div>
                </div>
              )}

              {/* Quantity copies requested */}
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">
                  eBook Copies / Licenses
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={buyCopies}
                  onChange={(e) => setBuyCopies(parseInt(e.target.value) || 1)}
                  className="h-9 w-full rounded-lg border border-border bg-white dark:bg-card px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                  required
                />
              </div>

              {/* Department selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">
                  Department Beneficiary
                </label>
                <select
                  value={buyDepartment}
                  onChange={(e) => setBuyDepartment(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-white dark:bg-card px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Request rationale/comments */}
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">Acquisition Rationale</label>
                <textarea
                  value={buyComments}
                  onChange={(e) => setBuyComments(e.target.value)}
                  placeholder="Explain why this acquisition is required..."
                  rows={2}
                  className="w-full rounded-lg border border-border bg-white dark:bg-card p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>

              {/* Price summary block */}
              {selectedBuyBook && (
                <div className="flex items-center justify-between border-t border-border pt-3 mt-1.5">
                  <span className="text-xs text-muted-foreground">Total Budget Estimate:</span>
                  <span className="text-sm font-bold text-foreground">
                    ${(selectedBuyBook.price * buyCopies).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBuyOpen(false)}
                  className="h-9 rounded-lg border border-border bg-white dark:bg-card px-4 text-xs font-semibold text-muted-foreground hover:bg-secondary/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 rounded-lg bg-[var(--brand)] text-white px-4 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
                >
                  Submit Order Request
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Upload Order Modal Dialog */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-xl bg-card border border-border rounded-xl shadow-xl p-6">
            <div className="border-b border-border pb-4 mb-4">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Upload Catalogue List for Bulk Order
              </DialogTitle>
            </div>

            <div className="text-sm text-foreground/80 space-y-2.5 mb-6">
              <p className="flex items-center gap-1.5 flex-wrap">
                <span>1. Download the sample catalogue template (Excel)</span>
                <button
                  type="button"
                  onClick={() => toast.success("Sample template downloaded successfully!")}
                  className="text-blue-600 hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                >
                  Download
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              </p>
              <p>2. Fill in the eBook details as per the format.</p>
              <p>3. Upload the completed catalogue file below.</p>
              <p>4. Review and confirm your bulk order before submission.</p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  uploadDragging
                    ? "border-[var(--brand)] bg-[var(--sidebar-highlight)]/30 scale-[1.01]"
                    : "border-slate-300 dark:border-border/60 bg-secondary/5 hover:bg-secondary/20"
                }`}
              >
                <input
                  type="file"
                  id="csv-file-input"
                  accept=".csv, .xlsx"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  {/* Custom cloud upload icon matching mockup */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-16 w-16 text-slate-300 dark:text-muted-foreground/60"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m15 15-3-3-3 3" />
                  </svg>
                  <span className="text-blue-600 hover:underline font-medium text-sm mt-1">
                    Click to upload
                  </span>
                </div>
              </div>

              {uploadFile && (
                <div className="rounded-lg border border-border p-3 flex items-center justify-between bg-white dark:bg-card">
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText size={18} className="text-[var(--brand)] shrink-0" />
                    <div className="truncate text-xs">
                      <p className="font-semibold text-foreground truncate">{uploadFile.name}</p>
                      <p className="text-muted-foreground text-[10px]">
                        {(uploadFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadFile(null)}
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* Upload animation progress */}
              {uploadProgress !== null && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Uploading and verifying...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand)] transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end border-t border-border pt-4 mt-2">
                <button
                  type="submit"
                  disabled={!uploadFile || uploadProgress !== null}
                  className="h-10 rounded-lg bg-[var(--brand)] text-white px-5 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed dark:disabled:bg-border dark:disabled:text-muted-foreground cursor-pointer"
                >
                  Upload & Continue
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
