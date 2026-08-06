import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Building2,
  BookOpen,
  Plus,
  ChevronDown,
  Trash2,
  X,
  CheckCircle2,
  Filter,
  Library as LibraryIcon,
  Sparkles,
  Mail,
  UserCheck,
  Building,
  Layers,
  Copy,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BookCover } from "@/components/ui/book-cover";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin-lib/catalogue")({
  component: PBAdminLibraryCataloguePage,
});

/* -------------------------------------------------------------------------- */
/*                                MOCK DATA                                   */
/* -------------------------------------------------------------------------- */

type InstitutionLibrary = {
  id: string;
  name: string;
  location: string;
  contactPerson: string;
  contactEmail: string;
  totalMapped: number;
  status: string;
  logoBg: string;
};

const mockLibraries: InstitutionLibrary[] = [
  {
    id: "LIB-101",
    name: "The District Central Library",
    location: "Ernakulam, Kerala",
    contactPerson: "K. P. Ajithkumar",
    contactEmail: "admin@districtlib-ernakulam.org",
    totalMapped: 13,
    status: "Active Catalog",
    logoBg: "bg-sky-500/15 text-sky-600 border-sky-500/30 dark:bg-sky-950/50 dark:text-sky-400",
  },
  {
    id: "LIB-102",
    name: "National University of Advanced Legal Studies",
    location: "Kochi, Kerala",
    contactPerson: "Prof. Benedict Wong",
    contactEmail: "contact@nuals.ac.in",
    totalMapped: 1807,
    status: "Active Catalog",
    logoBg: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30 dark:bg-indigo-950/50 dark:text-indigo-400",
  },
  {
    id: "LIB-103",
    name: "PSG College of Technology",
    location: "Coimbatore, Tamil Nadu",
    contactPerson: "Dr. R. Meenakshi",
    contactEmail: "library@psgtech.ac.in",
    totalMapped: 420,
    status: "Active Catalog",
    logoBg: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
  {
    id: "LIB-104",
    name: "APJ Abdul Kalam Technological University",
    location: "Thiruvananthapuram, Kerala",
    contactPerson: "Dr. Suresh Kumar",
    contactEmail: "library@aktu.ac.in",
    totalMapped: 950,
    status: "Active Catalog",
    logoBg: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:bg-amber-950/50 dark:text-amber-400",
  },
  {
    id: "LIB-105",
    name: "Indian Institute of Technology (IIT Madras)",
    location: "Chennai, Tamil Nadu",
    contactPerson: "Dr. Ramesh Babu",
    contactEmail: "library@iitm.ac.in",
    totalMapped: 3200,
    status: "Active Catalog",
    logoBg: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:bg-blue-950/50 dark:text-blue-400",
  },
  {
    id: "LIB-106",
    name: "Indian Institute of Science (IISc)",
    location: "Bengaluru, Karnataka",
    contactPerson: "Dr. Anand Rao",
    contactEmail: "office@library.iisc.ac.in",
    totalMapped: 2850,
    status: "Active Catalog",
    logoBg: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:bg-purple-950/50 dark:text-purple-400",
  },
  {
    id: "LIB-107",
    name: "Loyola College Central Library",
    location: "Chennai, Tamil Nadu",
    contactPerson: "Rev. Fr. Joseph S.J.",
    contactEmail: "library@loyolacollege.edu",
    totalMapped: 610,
    status: "Active Catalog",
    logoBg: "bg-teal-500/15 text-teal-600 border-teal-500/30 dark:bg-teal-950/50 dark:text-teal-400",
  },
  {
    id: "LIB-108",
    name: "Amrita Vishwa Vidyapeetham",
    location: "Kollam, Kerala",
    contactPerson: "Dr. Swaminathan P.",
    contactEmail: "amritalib@amrita.edu",
    totalMapped: 1420,
    status: "Active Catalog",
    logoBg: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:bg-rose-950/50 dark:text-rose-400",
  },
  {
    id: "LIB-109",
    name: "St. Xavier's College Autonomous",
    location: "Mumbai, Maharashtra",
    contactPerson: "Dr. Maria D'Souza",
    contactEmail: "library@xaviers.edu",
    totalMapped: 830,
    status: "Active Catalog",
    logoBg: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:bg-cyan-950/50 dark:text-cyan-400",
  },
  {
    id: "LIB-110",
    name: "Manipal Academy of Higher Education",
    location: "Manipal, Karnataka",
    contactPerson: "Dr. Shrikant Prabhu",
    contactEmail: "lib.head@manipal.edu",
    totalMapped: 1950,
    status: "Active Catalog",
    logoBg: "bg-orange-500/15 text-orange-600 border-orange-500/30 dark:bg-orange-950/50 dark:text-orange-400",
  },
  {
    id: "LIB-111",
    name: "University of Delhi Central Library",
    location: "New Delhi",
    contactPerson: "Prof. Rajesh Malhotra",
    contactEmail: "dclib@du.ac.in",
    totalMapped: 4100,
    status: "Active Catalog",
    logoBg: "bg-red-500/15 text-red-600 border-red-500/30 dark:bg-red-950/50 dark:text-red-400",
  },
];

type MappedEBook = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  status: "Mapped" | "Pending";
  mappedDate: string;
  coverGradient: string;
  initials: string;
  libraryId: string;
};

const initialMappedEBooks: MappedEBook[] = [
  {
    id: "BK-101",
    title: "1 Epub",
    author: "Various Authors",
    publisher: "PixelBooks",
    genre: "General Literature",
    status: "Mapped",
    mappedDate: "04 Aug 2026",
    coverGradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    initials: "PB",
    libraryId: "LIB-101",
  },
  {
    id: "BK-102",
    title: "Engineering Physics & Electromagnetics",
    author: "Dr. R. K. Sharma",
    publisher: "S. Chand Publishing",
    genre: "Engineering & Tech",
    status: "Mapped",
    mappedDate: "12 May 2026",
    coverGradient: "linear-gradient(135deg, #047857, #10b981)",
    initials: "EP",
    libraryId: "LIB-101",
  },
  {
    id: "BK-103",
    title: "Data Structures & Algorithm Analysis in C++",
    author: "Prof. S. V. Nathan",
    publisher: "Pearson Education",
    genre: "Computer Science",
    status: "Mapped",
    mappedDate: "18 Jun 2026",
    coverGradient: "linear-gradient(135deg, #b91c1c, #f87171)",
    initials: "DS",
    libraryId: "LIB-101",
  },
  {
    id: "BK-104",
    title: "Constitutional Law & Jurisprudence",
    author: "Justice M. N. Venkatachaliah",
    publisher: "Oxford University Press",
    genre: "Law & Legal Studies",
    status: "Mapped",
    mappedDate: "20 Jan 2026",
    coverGradient: "linear-gradient(135deg, #4c1d95, #8b5cf6)",
    initials: "CL",
    libraryId: "LIB-101",
  },
  {
    id: "BK-105",
    title: "Modern Financial Accounting Concepts",
    author: "Ananya Deshmukh",
    publisher: "McGraw Hill India",
    genre: "Finance & Accounts",
    status: "Mapped",
    mappedDate: "01 Jul 2026",
    coverGradient: "linear-gradient(135deg, #0f766e, #14b8a6)",
    initials: "FA",
    libraryId: "LIB-101",
  },
  {
    id: "BK-106",
    title: "Principles of Microeconomics",
    author: "N. Gregory Mankiw",
    publisher: "Cengage Learning",
    genre: "Business & Economics",
    status: "Mapped",
    mappedDate: "10 Feb 2026",
    coverGradient: "linear-gradient(135deg, #c2410c, #f97316)",
    initials: "EC",
    libraryId: "LIB-101",
  },
  {
    id: "BK-107",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell & Peter Norvig",
    publisher: "Pearson Education",
    genre: "Computer Science",
    status: "Mapped",
    mappedDate: "15 Mar 2026",
    coverGradient: "linear-gradient(135deg, #1d4ed8, #60a5fa)",
    initials: "AI",
    libraryId: "LIB-101",
  },
  {
    id: "BK-108",
    title: "Indian Penal Code & Criminal Procedure",
    author: "Ratanlal & Dhirajlal",
    publisher: "LexisNexis India",
    genre: "Law & Legal Studies",
    status: "Mapped",
    mappedDate: "22 Apr 2026",
    coverGradient: "linear-gradient(135deg, #6b21a8, #c084fc)",
    initials: "IPC",
    libraryId: "LIB-102",
  },
];

type GlobalEBook = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  basePrice: string;
  coverGradient: string;
  initials: string;
};

const allAvailableEBooks: GlobalEBook[] = [
  {
    id: "BK-201",
    title: "Principles of Microeconomics & Macroeconomics",
    author: "N. Gregory Mankiw",
    publisher: "Cengage Learning",
    genre: "Business & Economics",
    basePrice: "₹850.00",
    coverGradient: "linear-gradient(135deg, #c2410c, #f97316)",
    initials: "EC",
  },
  {
    id: "BK-202",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell & Peter Norvig",
    publisher: "Pearson Education",
    genre: "Computer Science",
    basePrice: "₹1,450.00",
    coverGradient: "linear-gradient(135deg, #1d4ed8, #60a5fa)",
    initials: "AI",
  },
  {
    id: "BK-203",
    title: "Robbins & Cotran Pathologic Basis of Disease",
    author: "Vinay Kumar & Abul K. Abbas",
    publisher: "Elsevier Health",
    genre: "Medicine",
    basePrice: "₹2,100.00",
    coverGradient: "linear-gradient(135deg, #be123c, #fb7185)",
    initials: "RD",
  },
  {
    id: "BK-204",
    title: "Indian Penal Code & Criminal Procedure",
    author: "Ratanlal & Dhirajlal",
    publisher: "LexisNexis India",
    genre: "Law & Legal Studies",
    basePrice: "₹1,100.00",
    coverGradient: "linear-gradient(135deg, #6b21a8, #c084fc)",
    initials: "IPC",
  },
  {
    id: "BK-205",
    title: "Contemporary World History",
    author: "Arjun Dev",
    publisher: "Orient Blackswan",
    genre: "History & Culture",
    basePrice: "₹495.00",
    coverGradient: "linear-gradient(135deg, #854d0e, #eab308)",
    initials: "WH",
  },
  {
    id: "BK-206",
    title: "Malayalam Novel History & Criticism",
    author: "M. K. Sanu",
    publisher: "DC Books",
    genre: "Fiction",
    basePrice: "₹380.00",
    coverGradient: "linear-gradient(135deg, #15803d, #4ade80)",
    initials: "MN",
  },
  {
    id: "BK-207",
    title: "Harrison's Principles of Internal Medicine",
    author: "Joseph Loscalzo & Anthony Fauci",
    publisher: "McGraw Hill India",
    genre: "Medicine",
    basePrice: "₹3,450.00",
    coverGradient: "linear-gradient(135deg, #0284c7, #38bdf8)",
    initials: "HM",
  },
  {
    id: "BK-208",
    title: "Introduction to Algorithms (CLRS)",
    author: "Thomas H. Cormen & Charles E. Leiserson",
    publisher: "Pearson Education",
    genre: "Computer Science",
    basePrice: "₹1,890.00",
    coverGradient: "linear-gradient(135deg, #4338ca, #6366f1)",
    initials: "IA",
  },
  {
    id: "BK-209",
    title: "Organic Chemistry: Structure & Function",
    author: "K. Peter C. Vollhardt",
    publisher: "Oxford University Press",
    genre: "Engineering & Tech",
    basePrice: "₹1,250.00",
    coverGradient: "linear-gradient(135deg, #059669, #34d399)",
    initials: "OC",
  },
  {
    id: "BK-210",
    title: "Operating System Concepts (Silberschatz)",
    author: "Abraham Silberschatz & Peter B. Galvin",
    publisher: "Pearson Education",
    genre: "Computer Science",
    basePrice: "₹1,150.00",
    coverGradient: "linear-gradient(135deg, #d97706, #fbbf24)",
    initials: "OS",
  },
  {
    id: "BK-211",
    title: "Corporate Law & Secretarial Practice",
    author: "Dr. A. K. Majumdar",
    publisher: "S. Chand Publishing",
    genre: "Law & Legal Studies",
    basePrice: "₹920.00",
    coverGradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    initials: "CL",
  },
  {
    id: "BK-212",
    title: "Modern Financial Management",
    author: "Prasanna Chandra",
    publisher: "McGraw Hill India",
    genre: "Finance & Accounts",
    basePrice: "₹1,050.00",
    coverGradient: "linear-gradient(135deg, #0d9488, #2dd4bf)",
    initials: "FM",
  },
];

/* -------------------------------------------------------------------------- */
/*                        STANDARD PUBLISHER LOGO                             */
/* -------------------------------------------------------------------------- */

function StandardPublisherLogo({ size = 16 }: { size?: number }) {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20 shadow-2xs"
      title="Publisher"
    >
      <Building2 size={size} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

function PBAdminLibraryCataloguePage() {
  // Selected Library State (Initially empty: prompt user to select a library)
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>("");
  const [librarySearchQuery, setLibrarySearchQuery] = useState("");
  const [libraryDropdownOpen, setLibraryDropdownOpen] = useState(false);

  // Mapped eBooks State
  const [mappedEBooks, setMappedEBooks] = useState<MappedEBook[]>(
    initialMappedEBooks
  );

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState<string>("All Publishers");
  const [selectedGenre, setSelectedGenre] = useState<string>("All Genres");
  const [publisherSearchQuery, setPublisherSearchQuery] = useState("");
  const [genreSearchQuery, setGenreSearchQuery] = useState("");
  const [publisherDropdownOpen, setPublisherDropdownOpen] = useState(false);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal State for Mapping New eBooks from Other Publishers
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");
  const [modalPublisher, setModalPublisher] = useState("All Publishers");
  const [modalGenre, setModalGenre] = useState("All Genres");
  const [modalPublisherSearchQuery, setModalPublisherSearchQuery] = useState("");
  const [modalPublisherDropdownOpen, setModalPublisherDropdownOpen] = useState(false);
  const [modalGenreSearchQuery, setModalGenreSearchQuery] = useState("");
  const [modalGenreDropdownOpen, setModalGenreDropdownOpen] = useState(false);

  const selectedLibrary = useMemo(() => {
    if (!selectedLibraryId) return null;
    return mockLibraries.find((l) => l.id === selectedLibraryId) || null;
  }, [selectedLibraryId]);

  // Filtered Libraries for Searchable Dropdown
  const filteredLibrariesList = useMemo(() => {
    if (!librarySearchQuery.trim()) return mockLibraries;
    const q = librarySearchQuery.toLowerCase().trim();
    return mockLibraries.filter(
      (l) =>
        l.name.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)
    );
  }, [librarySearchQuery]);

  // eBooks currently mapped to selected library
  const currentLibraryMappedEBooks = useMemo(() => {
    if (!selectedLibraryId) return [];
    return mappedEBooks.filter((item) => item.libraryId === selectedLibraryId);
  }, [mappedEBooks, selectedLibraryId]);

  // Filtered mapped eBooks matching toolbar filters
  const filteredMappedEBooks = useMemo(() => {
    return currentLibraryMappedEBooks.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.publisher.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPublisher =
        selectedPublisher === "All Publishers" ||
        item.publisher === selectedPublisher;

      const matchesGenre =
        selectedGenre === "All Genres" || item.genre === selectedGenre;

      return matchesSearch && matchesPublisher && matchesGenre;
    });
  }, [currentLibraryMappedEBooks, searchQuery, selectedPublisher, selectedGenre]);

  // Total pages calculation
  const totalPages = Math.ceil(filteredMappedEBooks.length / itemsPerPage) || 1;

  // Paginated eBooks list
  const paginatedMappedEBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMappedEBooks.slice(start, start + itemsPerPage);
  }, [filteredMappedEBooks, currentPage, itemsPerPage]);

  // Unique lists for dropdowns
  const publishersList = useMemo(() => {
    const list = Array.from(
      new Set(allAvailableEBooks.map((b) => b.publisher))
    );
    return ["All Publishers", "PixelBooks", ...list];
  }, []);

  const filteredPublishersList = useMemo(() => {
    if (!publisherSearchQuery.trim()) return publishersList;
    const q = publisherSearchQuery.toLowerCase().trim();
    return publishersList.filter((p) => p.toLowerCase().includes(q));
  }, [publishersList, publisherSearchQuery]);

  const genresList = useMemo(() => {
    const list = Array.from(new Set(allAvailableEBooks.map((b) => b.genre)));
    return ["All Genres", ...list];
  }, []);

  const filteredGenresList = useMemo(() => {
    if (!genreSearchQuery.trim()) return genresList;
    const q = genreSearchQuery.toLowerCase().trim();
    return genresList.filter((g) => g.toLowerCase().includes(q));
  }, [genresList, genreSearchQuery]);

  const filteredModalPublishersList = useMemo(() => {
    if (!modalPublisherSearchQuery.trim()) return publishersList;
    const q = modalPublisherSearchQuery.toLowerCase().trim();
    return publishersList.filter((p) => p.toLowerCase().includes(q));
  }, [publishersList, modalPublisherSearchQuery]);

  const filteredModalGenresList = useMemo(() => {
    if (!modalGenreSearchQuery.trim()) return genresList;
    const q = modalGenreSearchQuery.toLowerCase().trim();
    return genresList.filter((g) => g.toLowerCase().includes(q));
  }, [genresList, modalGenreSearchQuery]);

  // Filtered available eBooks in the Mapping Modal (keep all matching books visible in session)
  const filteredModalEBooks = useMemo(() => {
    return allAvailableEBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(modalSearch.toLowerCase()) ||
        book.author.toLowerCase().includes(modalSearch.toLowerCase()) ||
        book.publisher.toLowerCase().includes(modalSearch.toLowerCase());

      const matchesPublisher =
        modalPublisher === "All Publishers" || book.publisher === modalPublisher;

      const matchesGenre =
        modalGenre === "All Genres" || book.genre === modalGenre;

      return matchesSearch && matchesPublisher && matchesGenre;
    });
  }, [modalSearch, modalPublisher, modalGenre]);

  // Modal Pagination State
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const modalItemsPerPage = 5;

  const modalTotalPages = Math.ceil(filteredModalEBooks.length / modalItemsPerPage) || 1;

  const paginatedModalEBooks = useMemo(() => {
    const start = (modalCurrentPage - 1) * modalItemsPerPage;
    return filteredModalEBooks.slice(start, start + modalItemsPerPage);
  }, [filteredModalEBooks, modalCurrentPage, modalItemsPerPage]);

  // Action: Unmap eBook
  const handleUnmap = (id: string, title: string) => {
    setMappedEBooks((prev) => prev.filter((item) => item.id !== id));
    toast.success(`"${title}" unmapped from ${selectedLibrary?.name || "library"}.`);
  };

  const handleUnmapByTitle = (title: string) => {
    setMappedEBooks((prev) =>
      prev.filter((item) => !(item.libraryId === selectedLibraryId && item.title === title))
    );
    toast.success(`"${title}" unmapped from ${selectedLibrary?.name || "library"}.`);
  };

  // Action: Map eBook to Library
  const handleMapBook = (book: GlobalEBook) => {
    if (!selectedLibraryId || !selectedLibrary) {
      toast.error("Please select a library first.");
      return;
    }

    const newMapped: MappedEBook = {
      id: `BK-${Date.now()}`,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      genre: book.genre,
      status: "Mapped",
      mappedDate: "05 Aug 2026",
      coverGradient: book.coverGradient,
      initials: book.initials,
      libraryId: selectedLibraryId,
    };

    setMappedEBooks((prev) => [newMapped, ...prev]);
    toast.success(`"${book.title}" mapped to ${selectedLibrary.name}.`);
  };

  return (
    <AppShell
      title="eBook Assignment"
      subtitle="Map publisher eBooks to institutional library catalogs across publishers and configure availability."
    >
      <div className="space-y-6 p-4 pb-8 sm:p-6 md:p-8">


        {/* Compact Library Context Strip */}
        <section className="rounded-2xl border border-border bg-card shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3">

            {/* Left: Library Identity */}
            {selectedLibrary ? (
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-2xs ${selectedLibrary.logoBg}`}>
                  <LibraryIcon size={20} strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Selected Library</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-extrabold text-foreground truncate">{selectedLibrary.name}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                      <BookOpen size={10} />
                      {currentLibraryMappedEBooks.length} Mapped
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Building size={11} className="text-sky-500" />
                      {selectedLibrary.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserCheck size={11} className="text-indigo-500" />
                      {selectedLibrary.contactPerson}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={11} className="text-emerald-500" />
                      {selectedLibrary.contactEmail}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dashed border-sky-500/30 bg-sky-500/10 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                  <LibraryIcon size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">No Library Selected</p>
                  <p className="text-[11px] text-muted-foreground font-medium">Choose a library to view and assign eBooks.</p>
                </div>
              </div>
            )}

            {/* Right: Library Selector Dropdown */}
            <div className="relative w-full sm:w-72 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setLibraryDropdownOpen((o) => !o);
                  setLibrarySearchQuery("");
                }}
                className="flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 text-sm font-bold text-foreground transition-all hover:border-[var(--brand)] hover:bg-secondary/40 outline-none shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 shrink-0">
                    <LibraryIcon size={14} />
                  </div>
                  <span className="truncate text-sm">
                    {selectedLibrary ? selectedLibrary.name : "Select a Library..."}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                    libraryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {libraryDropdownOpen && (
                <div
                  className="absolute right-0 top-full z-40 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl flex flex-col py-1.5 animate-in fade-in duration-150"
                  onMouseLeave={() => setLibraryDropdownOpen(false)}
                >
                  {/* Search input in dropdown */}
                  <div className="p-2.5 border-b border-border bg-card sticky top-0 z-10 space-y-1.5">
                    <div className="relative flex items-center">
                      <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={librarySearchQuery}
                        onChange={(e) => setLibrarySearchQuery(e.target.value)}
                        placeholder="Type to search library name..."
                        autoFocus
                        className="w-full h-9 pl-9 pr-3 text-xs font-medium rounded-lg border border-border bg-secondary/50 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="flex items-center justify-between px-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      <span>Libraries ({filteredLibrariesList.length})</span>
                      <span>Scroll for more ↓</span>
                    </div>
                  </div>

                  <div className="overflow-y-auto max-h-72 sm:max-h-80 py-1 divide-y divide-border/20 scroll-smooth">
                    {filteredLibrariesList.length === 0 ? (
                      <div className="px-4 py-4 text-center text-xs text-muted-foreground">
                        No matching libraries found.
                      </div>
                    ) : (
                      filteredLibrariesList.map((lib) => (
                        <button
                          key={lib.id}
                          type="button"
                          onClick={() => {
                            setSelectedLibraryId(lib.id);
                            setCurrentPage(1);
                            setLibraryDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-secondary/70 ${
                            lib.id === selectedLibraryId
                              ? "font-bold text-[var(--brand)] bg-secondary/80"
                              : "text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${lib.logoBg}`}
                            >
                              <LibraryIcon size={14} />
                            </div>
                            <div>
                              <p className="text-xs font-bold leading-tight">{lib.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{lib.location}</p>
                            </div>
                          </div>
                          {lib.id === selectedLibraryId && (
                            <CheckCircle2 size={16} className="text-[var(--brand)] shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Toolbar: Search + Bigger Publisher Filter (with Standard Logo & Search) + Bigger Genre Filter + Map Button */}
        <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between shadow-2xs">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Mapped eBooks Bar */}
            <label className="relative flex h-12 flex-1 items-center rounded-xl border border-border bg-card px-3.5 sm:max-w-xs shadow-2xs">
              <Search size={16} className="mr-2 text-muted-foreground shrink-0" />
              <input
                type="text"
                disabled={!selectedLibraryId}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search mapped eBooks or publisher..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />
            </label>

            {/* Custom Bigger Publisher Filter Dropdown with Search & Standard Logo */}
            <div className="relative min-w-[220px] sm:w-64">
              <button
                type="button"
                disabled={!selectedLibraryId}
                onClick={() => {
                  setPublisherDropdownOpen((o) => !o);
                  setPublisherSearchQuery("");
                }}
                className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 text-sm font-bold text-foreground hover:border-[var(--brand)] hover:bg-secondary/40 outline-none shadow-2xs disabled:opacity-50 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <StandardPublisherLogo size={14} />
                  <span className="truncate text-xs font-bold">{selectedPublisher}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                    publisherDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {publisherDropdownOpen && (
                <div
                  className="absolute left-0 top-full z-40 mt-2 min-w-[260px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl flex flex-col py-1.5 animate-in fade-in duration-150"
                  onMouseLeave={() => setPublisherDropdownOpen(false)}
                >
                  {/* Sticky Search Input Bar in Publisher Dropdown */}
                  <div className="p-2 border-b border-border bg-card sticky top-0 z-10">
                    <div className="relative flex items-center">
                      <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={publisherSearchQuery}
                        onChange={(e) => setPublisherSearchQuery(e.target.value)}
                        placeholder="Search publisher..."
                        autoFocus
                        className="w-full h-8 pl-8 pr-3 text-xs font-medium rounded-lg border border-border bg-secondary/50 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="overflow-y-auto max-h-60 py-1">
                    {filteredPublishersList.length === 0 ? (
                      <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                        No matching publisher
                      </div>
                    ) : (
                      filteredPublishersList.map((pub) => (
                        <button
                          key={pub}
                          type="button"
                          onClick={() => {
                            setSelectedPublisher(pub);
                            setCurrentPage(1);
                            setPublisherDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-secondary/70 ${
                            pub === selectedPublisher
                              ? "font-bold text-[var(--brand)] bg-secondary/80"
                              : "text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <StandardPublisherLogo size={13} />
                            <span className="truncate font-semibold">{pub}</span>
                          </div>
                          {pub === selectedPublisher && (
                            <CheckCircle2 size={15} className="text-[var(--brand)] shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Bigger Genre Filter Dropdown with Search */}
            <div className="relative min-w-[180px] sm:w-56">
              <button
                type="button"
                disabled={!selectedLibraryId}
                onClick={() => {
                  setGenreDropdownOpen((o) => !o);
                  setGenreSearchQuery("");
                }}
                className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 text-sm font-bold text-foreground hover:border-[var(--brand)] hover:bg-secondary/40 outline-none shadow-2xs disabled:opacity-50 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-600 border border-indigo-500/30">
                    <Layers size={14} />
                  </div>
                  <span className="truncate text-xs font-bold">{selectedGenre}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                    genreDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {genreDropdownOpen && (
                <div
                  className="absolute left-0 top-full z-40 mt-2 min-w-[210px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl flex flex-col py-1.5 animate-in fade-in duration-150"
                  onMouseLeave={() => setGenreDropdownOpen(false)}
                >
                  {/* Sticky Search Input Bar in Genre Dropdown */}
                  <div className="p-2 border-b border-border bg-card sticky top-0 z-10">
                    <div className="relative flex items-center">
                      <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={genreSearchQuery}
                        onChange={(e) => setGenreSearchQuery(e.target.value)}
                        placeholder="Search genre..."
                        autoFocus
                        className="w-full h-8 pl-8 pr-3 text-xs font-medium rounded-lg border border-border bg-secondary/50 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="overflow-y-auto max-h-60 py-1">
                    {filteredGenresList.length === 0 ? (
                      <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                        No matching genre
                      </div>
                    ) : (
                      filteredGenresList.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            setSelectedGenre(g);
                            setCurrentPage(1);
                            setGenreDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-secondary/70 ${
                            g === selectedGenre
                              ? "font-bold text-[var(--brand)] bg-secondary/80"
                              : "text-foreground"
                          }`}
                        >
                          <span className="truncate font-semibold">{g}</span>
                          {g === selectedGenre && (
                            <CheckCircle2 size={15} className="text-[var(--brand)] shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Primary Action Button: Map eBooks from Other Publishers */}
          <button
            type="button"
            onClick={() => {
              if (!selectedLibraryId) {
                toast.error("Please select a library first.");
                return;
              }
              setIsMapModalOpen(true);
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-6 text-sm font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shrink-0 shadow-2xs"
          >
            <Plus size={18} />
            Map eBooks to Library
          </button>
        </section>

        {/* Mapped eBooks Table Listing */}
        <section className="rounded-2xl border border-border bg-card p-4 md:p-6 shadow-2xs overflow-hidden space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h3 className="text-base font-bold tracking-tight text-foreground">
              Mapped eBooks ({filteredMappedEBooks.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3.5 pr-4 pl-4">Title & Author</th>
                  <th className="pb-3.5 px-4">Publisher</th>
                  <th className="pb-3.5 px-4">Genre</th>
                  <th className="pb-3.5 px-4 text-right">Mapped Date</th>
                  <th className="pb-3.5 pl-4 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {!selectedLibraryId ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                        <LibraryIcon size={32} className="text-muted-foreground/60" />
                        <p className="font-semibold text-foreground text-sm">No Library Selected</p>
                        <p className="text-xs text-muted-foreground">
                          Please select an institutional library from the dropdown above to view its mapped eBooks.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedMappedEBooks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No eBooks currently mapped matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedMappedEBooks.map((book) => (
                    <tr
                      key={book.id}
                      className="group border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40"
                    >
                      {/* Title Cell with BookCover Component */}
                      <td className="py-4 pr-4 pl-4">
                        <div className="flex items-center gap-3.5">
                          <BookCover
                            initials={book.initials}
                            coverGradient={book.coverGradient}
                            title={book.title}
                            size="xs"
                          />
                          <div>
                            <p className="font-bold text-foreground text-sm leading-snug">
                              {book.title}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Publisher Cell with Standard Publisher Logo */}
                      <td className="py-4 px-4 text-xs font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <StandardPublisherLogo size={13} />
                          <span>{book.publisher}</span>
                        </div>
                      </td>

                      {/* Genre Cell */}
                      <td className="py-4 px-4 text-xs font-medium text-muted-foreground">
                        {book.genre}
                      </td>

                      {/* Mapped Date */}
                      <td className="py-4 px-4 text-right text-xs font-medium text-muted-foreground">
                        {book.mappedDate}
                      </td>

                      {/* Action Cell */}
                      <td className="py-4 pl-4 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleUnmap(book.id, book.title)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-card text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30 cursor-pointer shadow-2xs"
                        >
                          <Trash2 size={13} />
                          Unmap
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer Bar */}
          {selectedLibraryId && filteredMappedEBooks.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/50 text-xs font-medium text-muted-foreground">
              <span>
                Showing <strong className="text-foreground">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredMappedEBooks.length)}</strong> to{" "}
                <strong className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredMappedEBooks.length)}</strong> of{" "}
                <strong className="text-foreground">{filteredMappedEBooks.length}</strong> mapped eBooks
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-border bg-card text-xs font-semibold text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition-colors cursor-pointer shadow-2xs"
                >
                  « Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-colors cursor-pointer shadow-2xs ${
                      pg === currentPage
                        ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                        : "border-border bg-card text-foreground hover:bg-secondary"
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-border bg-card text-xs font-semibold text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition-colors cursor-pointer shadow-2xs"
                >
                  Next »
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL: Map eBooks from Other Publishers                             */}
      {/* -------------------------------------------------------------------- */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl lg:max-w-6xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-6 max-h-[92vh] h-[85vh] flex flex-col">
            {/* Modal Header Redesigned with High Importance on Action & Target Library Logo */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-border/60 pb-5 shrink-0">
              {/* Left: Action Title */}
              <div className="space-y-0.5">
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground leading-tight">
                  Map eBooks to Library
                </h2>
                <p className="text-xs font-medium text-muted-foreground">
                  Browse and assign available eBooks from other publishers to expand this catalog.
                </p>
              </div>

              {/* Right: Target Institution Card Badge */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-3 pr-5 shadow-2xs">
                  {/* Library Logo Avatar */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 shadow-xs transition-transform ${
                      selectedLibrary?.logoBg || "bg-sky-500/20 text-sky-600 border-sky-500/30"
                    }`}
                  >
                    <LibraryIcon size={22} strokeWidth={2.2} />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        Target Institution
                      </span>
                    </div>
                    <p className="text-sm font-extrabold text-foreground leading-snug">
                      {selectedLibrary ? selectedLibrary.name : "Select Library"}
                    </p>
                    {selectedLibrary?.location && (
                      <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <Building size={11} className="text-sky-500 shrink-0" />
                        <span>{selectedLibrary.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer shadow-2xs"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Toolbar: Search + Publisher Filter + Genre Filter (Same design as main toolbar) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              {/* Search Bar */}
              <label className="relative flex h-12 flex-1 items-center rounded-xl border border-border bg-card px-3.5 shadow-2xs w-full">
                <Search size={16} className="mr-2 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => {
                    setModalSearch(e.target.value);
                    setModalCurrentPage(1);
                  }}
                  placeholder="Search title, author, or publisher..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>

              {/* Publisher Filter Dropdown */}
              <div className="relative w-full sm:w-64 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setModalPublisherDropdownOpen((o) => !o);
                    setModalPublisherSearchQuery("");
                  }}
                  className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 text-sm font-bold text-foreground hover:border-[var(--brand)] hover:bg-secondary/40 outline-none shadow-2xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <StandardPublisherLogo size={14} />
                    <span className="truncate text-xs font-bold">{modalPublisher}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                      modalPublisherDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {modalPublisherDropdownOpen && (
                  <div
                    className="absolute left-0 top-full z-40 mt-2 min-w-[260px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl flex flex-col py-1.5 animate-in fade-in duration-150"
                    onMouseLeave={() => setModalPublisherDropdownOpen(false)}
                  >
                    <div className="p-2 border-b border-border bg-card sticky top-0 z-10">
                      <div className="relative flex items-center">
                        <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
                        <input
                          type="text"
                          value={modalPublisherSearchQuery}
                          onChange={(e) => setModalPublisherSearchQuery(e.target.value)}
                          placeholder="Search publisher..."
                          autoFocus
                          className="w-full h-8 pl-8 pr-3 text-xs font-medium rounded-lg border border-border bg-secondary/50 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>

                    <div className="overflow-y-auto max-h-60 py-1">
                      {filteredModalPublishersList.length === 0 ? (
                        <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                          No matching publisher
                        </div>
                      ) : (
                        filteredModalPublishersList.map((pub) => (
                          <button
                            key={pub}
                            type="button"
                            onClick={() => {
                              setModalPublisher(pub);
                              setModalCurrentPage(1);
                              setModalPublisherDropdownOpen(false);
                            }}
                            className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-secondary/70 ${
                              pub === modalPublisher
                                ? "font-bold text-[var(--brand)] bg-secondary/80"
                                : "text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <StandardPublisherLogo size={13} />
                              <span className="truncate font-semibold">{pub}</span>
                            </div>
                            {pub === modalPublisher && (
                              <CheckCircle2 size={15} className="text-[var(--brand)] shrink-0" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Genre Filter Dropdown */}
              <div className="relative w-full sm:w-56 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setModalGenreDropdownOpen((o) => !o);
                    setModalGenreSearchQuery("");
                  }}
                  className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 text-sm font-bold text-foreground hover:border-[var(--brand)] hover:bg-secondary/40 outline-none shadow-2xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-600 border border-indigo-500/30">
                      <Layers size={14} />
                    </div>
                    <span className="truncate text-xs font-bold">{modalGenre}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                      modalGenreDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {modalGenreDropdownOpen && (
                  <div
                    className="absolute left-0 top-full z-40 mt-2 min-w-[210px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl flex flex-col py-1.5 animate-in fade-in duration-150"
                    onMouseLeave={() => setModalGenreDropdownOpen(false)}
                  >
                    <div className="p-2 border-b border-border bg-card sticky top-0 z-10">
                      <div className="relative flex items-center">
                        <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
                        <input
                          type="text"
                          value={modalGenreSearchQuery}
                          onChange={(e) => setModalGenreSearchQuery(e.target.value)}
                          placeholder="Search genre..."
                          autoFocus
                          className="w-full h-8 pl-8 pr-3 text-xs font-medium rounded-lg border border-border bg-secondary/50 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>

                    <div className="overflow-y-auto max-h-60 py-1">
                      {filteredModalGenresList.length === 0 ? (
                        <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                          No matching genre
                        </div>
                      ) : (
                        filteredModalGenresList.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => {
                              setModalGenre(g);
                              setModalCurrentPage(1);
                              setModalGenreDropdownOpen(false);
                            }}
                            className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-secondary/70 ${
                              g === modalGenre
                                ? "font-bold text-[var(--brand)] bg-secondary/80"
                                : "text-foreground"
                            }`}
                          >
                            <span className="truncate font-semibold">{g}</span>
                            {g === modalGenre && (
                              <CheckCircle2 size={15} className="text-[var(--brand)] shrink-0" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Available eBooks List Table */}
            <div className="overflow-y-auto flex-1 border rounded-xl border-border bg-card">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-card border-b border-border/60 z-10">
                  <tr className="text-left font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4">Book & Author</th>
                    <th className="py-3.5 px-4">Publisher</th>
                    <th className="py-3.5 px-4">Genre</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredModalEBooks.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-muted-foreground">
                        No available eBooks found matching your search and filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedModalEBooks.map((book) => {
                      const isMapped = currentLibraryMappedEBooks.some(
                        (mapped) => mapped.title === book.title
                      );

                      return (
                        <tr key={book.id} className="hover:bg-secondary/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3.5">
                              <BookCover
                                initials={book.initials}
                                coverGradient={book.coverGradient}
                                title={book.title}
                                size="xs"
                              />
                              <div>
                                <p className="font-bold text-foreground text-xs leading-snug">
                                  {book.title}
                                </p>
                                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                                  {book.author}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <StandardPublisherLogo size={12} />
                              <span>{book.publisher}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-muted-foreground">
                            {book.genre}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {isMapped ? (
                              <button
                                type="button"
                                onClick={() => handleUnmapByTitle(book.title)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-rose-200 bg-card text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30 cursor-pointer shadow-2xs"
                              >
                                <Trash2 size={13} /> Unmap
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleMapBook(book)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--brand)] text-xs font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                              >
                                <Plus size={14} /> Map to Library
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer with Pagination Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/50 shrink-0">
              <span className="text-xs font-medium text-muted-foreground">
                {filteredModalEBooks.length > 0 ? (
                  <>
                    Showing <strong className="text-foreground">{Math.min((modalCurrentPage - 1) * modalItemsPerPage + 1, filteredModalEBooks.length)}</strong> to{" "}
                    <strong className="text-foreground">{Math.min(modalCurrentPage * modalItemsPerPage, filteredModalEBooks.length)}</strong> of{" "}
                    <strong className="text-foreground">{filteredModalEBooks.length}</strong> available eBooks
                  </>
                ) : (
                  "0 eBooks available"
                )}
              </span>

              <div className="flex items-center gap-2">
                {filteredModalEBooks.length > 0 && (
                  <div className="flex items-center gap-1.5 mr-2">
                    <button
                      type="button"
                      disabled={modalCurrentPage === 1}
                      onClick={() => setModalCurrentPage((p) => Math.max(p - 1, 1))}
                      className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-border bg-card text-xs font-semibold text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition-colors cursor-pointer shadow-2xs"
                    >
                      « Previous
                    </button>

                    {Array.from({ length: modalTotalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => setModalCurrentPage(pg)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-colors cursor-pointer shadow-2xs ${
                          pg === modalCurrentPage
                            ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                            : "border-border bg-card text-foreground hover:bg-secondary"
                        }`}
                      >
                        {pg}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={modalCurrentPage === modalTotalPages}
                      onClick={() => setModalCurrentPage((p) => Math.min(p + 1, modalTotalPages))}
                      className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-border bg-card text-xs font-semibold text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition-colors cursor-pointer shadow-2xs"
                    >
                      Next »
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-6 text-xs font-bold text-foreground hover:bg-secondary transition-colors cursor-pointer shadow-2xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
