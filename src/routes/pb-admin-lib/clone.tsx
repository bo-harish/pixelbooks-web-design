import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Copy,
  Building2,
  Search,
  ChevronDown,
  X,
  CheckCircle2,
  ArrowRight,
  Database,
  Library as LibraryIcon,
  Sparkles,
  Layers,
  BookCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";
import { BookCover } from "@/components/ui/book-cover";

export const Route = createFileRoute("/pb-admin-lib/clone")({
  component: PBAdminCloneLibraryPage,
});

/* -------------------------------------------------------------------------- */
/*                                 MOCK DATA                                  */
/* -------------------------------------------------------------------------- */

type InstitutionalLibrary = {
  id: string;
  name: string;
  location: string;
  logoBg: string;
  mappedEBooksCount: number;
  contactPerson: string;
  contactEmail: string;
};

const mockLibraries: InstitutionalLibrary[] = [
  {
    id: "LIB-101",
    name: "The District Central Library",
    location: "Ernakulam",
    logoBg: "bg-sky-500/15 text-sky-600 border-sky-500/30",
    mappedEBooksCount: 13,
    contactPerson: "Dr. K. R. Nambiar",
    contactEmail: "admin@districtlib-ernakulam.org",
  },
  {
    id: "LIB-102",
    name: "State Central Library (Trivandrum Public Library)",
    location: "Thiruvananthapuram",
    logoBg: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30",
    mappedEBooksCount: 18,
    contactPerson: "Prof. S. R. Pillai",
    contactEmail: "contact@statecentrallib.gov.in",
  },
  {
    id: "LIB-103",
    name: "KTU library",
    location: "APJ Abdul Kalam Technological University, TVM",
    logoBg: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    mappedEBooksCount: 14,
    contactPerson: "Prof. V. K. Thomas",
    contactEmail: "library@ktu.edu.in",
  },
  {
    id: "LIB-104",
    name: "demoLibrary admin",
    location: "Cochin Campus, Ernakulam",
    logoBg: "bg-purple-500/15 text-purple-600 border-purple-500/30",
    mappedEBooksCount: 5,
    contactPerson: "Ananya Deshmukh",
    contactEmail: "admin@demolibrary.edu",
  },
  {
    id: "LIB-105",
    name: "CUSAT University Library",
    location: "Kalamassery, Kochi",
    logoBg: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    mappedEBooksCount: 22,
    contactPerson: "Dr. M. G. Menon",
    contactEmail: "library@cusat.ac.in",
  },
  {
    id: "LIB-106",
    name: "IIT Palakkad Central Library",
    location: "Kanjikode, Palakkad",
    logoBg: "bg-rose-500/15 text-rose-600 border-rose-500/30",
    mappedEBooksCount: 16,
    contactPerson: "Dr. P. V. Ramakrishnan",
    contactEmail: "library@iitpkd.ac.in",
  },
  {
    id: "LIB-107",
    name: "Calicut University Library",
    location: "Thenhipalam, Malappuram",
    logoBg: "bg-teal-500/15 text-teal-600 border-teal-500/30",
    mappedEBooksCount: 20,
    contactPerson: "Prof. K. Abdul Salam",
    contactEmail: "culibrary@uoc.ac.in",
  },
  {
    id: "LIB-108",
    name: "MG University Library",
    location: "Priyadarsini Hills, Kottayam",
    logoBg: "bg-blue-500/15 text-blue-600 border-blue-500/30",
    mappedEBooksCount: 15,
    contactPerson: "Dr. Elizabeth Mathew",
    contactEmail: "library@mgu.ac.in",
  },
];

const mockSourceEBooks = [
  {
    id: "BK-101",
    title: "Engineering Mathematics Volume I",
    author: "Dr. B. S. Grewal",
    publisher: "Khanna Publishers",
    genre: "Engineering & Tech",
    coverGradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    initials: "EM",
  },
  {
    id: "BK-102",
    title: "Pathology & Clinical Medicine",
    author: "Dr. Harsh Mohan",
    publisher: "Jaypee Brothers",
    genre: "Medicine",
    coverGradient: "linear-gradient(135deg, #065f46, #10b981)",
    initials: "PC",
  },
  {
    id: "BK-103",
    title: "Data Structures & Algorithms in Java",
    author: "Robert Lafore",
    publisher: "Pearson Education",
    genre: "Computer Science",
    coverGradient: "linear-gradient(135deg, #b91c1c, #f87171)",
    initials: "DS",
  },
  {
    id: "BK-104",
    title: "Constitutional Law & Jurisprudence",
    author: "Justice M. N. Venkatachaliah",
    publisher: "Oxford University Press",
    genre: "Law & Legal Studies",
    coverGradient: "linear-gradient(135deg, #4c1d95, #8b5cf6)",
    initials: "CL",
  },
  {
    id: "BK-105",
    title: "Modern Financial Accounting Concepts",
    author: "Ananya Deshmukh",
    publisher: "McGraw Hill India",
    genre: "Finance & Accounts",
    coverGradient: "linear-gradient(135deg, #0f766e, #14b8a6)",
    initials: "FA",
  },
];

export function PBAdminCloneLibraryPage() {
  // Source & Destination Library Selection State
  const [sourceLibraryId, setSourceLibraryId] = useState<string>("LIB-103"); // Default KTU library
  const [destinationLibraryId, setDestinationLibraryId] = useState<string>("LIB-104"); // Default demoLibrary admin

  // Dropdown UI States
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [sourceSearchQuery, setSourceSearchQuery] = useState("");

  const [destinationDropdownOpen, setDestinationDropdownOpen] = useState(false);
  const [destinationSearchQuery, setDestinationSearchQuery] = useState("");

  // Modal / Success summary state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [clonedCount, setClonedCount] = useState(0);

  const selectedSourceLibrary = useMemo(() => {
    return mockLibraries.find((l) => l.id === sourceLibraryId) || null;
  }, [sourceLibraryId]);

  const selectedDestinationLibrary = useMemo(() => {
    return mockLibraries.find((l) => l.id === destinationLibraryId) || null;
  }, [destinationLibraryId]);

  const filteredSourceLibraries = useMemo(() => {
    if (!sourceSearchQuery.trim()) return mockLibraries;
    const q = sourceSearchQuery.toLowerCase().trim();
    return mockLibraries.filter(
      (l) =>
        l.name.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)
    );
  }, [sourceSearchQuery]);

  const filteredDestinationLibraries = useMemo(() => {
    if (!destinationSearchQuery.trim()) return mockLibraries;
    const q = destinationSearchQuery.toLowerCase().trim();
    return mockLibraries.filter(
      (l) =>
        l.name.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)
    );
  }, [destinationSearchQuery]);

  const handleCloneLibrary = () => {
    if (!sourceLibraryId) {
      toast.error("Please select a Source Library to copy from.");
      return;
    }
    if (!destinationLibraryId) {
      toast.error("Please select a Destination Library to map to.");
      return;
    }
    if (sourceLibraryId === destinationLibraryId) {
      toast.error("Source and Destination libraries cannot be the same.");
      return;
    }

    const count = selectedSourceLibrary?.mappedEBooksCount || 14;
    setClonedCount(count);
    setIsSuccessModalOpen(true);
    toast.success(
      `Successfully cloned ${count} eBooks from "${selectedSourceLibrary?.name}" to "${selectedDestinationLibrary?.name}"!`
    );
  };

  return (
    <AppShell
      title="Clone Between Libraries"
      subtitle="Select a source library to copy eBooks from, then choose a destination library to map them to."
    >
      <div className="space-y-6 p-4 sm:p-6 md:p-8">

        {/* Two-Column Cards Grid: Source Library & Destination Library */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Source Library */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                  <Database size={20} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-foreground">Source Library</h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Select the library containing eBooks you want to copy
                  </p>
                </div>
              </div>

              {/* Field Label */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-foreground">
                  Select Source Library
                </label>

                {/* Dropdown Container */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setSourceDropdownOpen((o) => !o);
                      setSourceSearchQuery("");
                    }}
                    className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 text-sm font-semibold text-foreground hover:border-[var(--brand)] hover:bg-secondary/40 outline-none shadow-2xs group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 truncate">
                      {selectedSourceLibrary ? (
                        <>
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${selectedSourceLibrary.logoBg}`}
                          >
                            <LibraryIcon size={14} />
                          </div>
                          <span className="truncate text-xs font-bold text-foreground">
                            {selectedSourceLibrary.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground">
                          Select Source Library...
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {selectedSourceLibrary && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSourceLibraryId("");
                          }}
                          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          title="Clear selection"
                        >
                          <X size={14} />
                        </span>
                      )}
                      <ChevronDown
                        size={16}
                        className={`text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${sourceDropdownOpen ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  </button>

                  {/* Searchable Dropdown Popover */}
                  {sourceDropdownOpen && (
                    <div
                      className="absolute left-0 top-full z-40 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl flex flex-col py-1.5 animate-in fade-in duration-150"
                      onMouseLeave={() => setSourceDropdownOpen(false)}
                    >
                      <div className="p-2.5 border-b border-border bg-card sticky top-0 z-10 space-y-1">
                        <div className="relative flex items-center">
                          <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
                          <input
                            type="text"
                            value={sourceSearchQuery}
                            onChange={(e) => setSourceSearchQuery(e.target.value)}
                            placeholder="Search source library..."
                            autoFocus
                            className="w-full h-9 pl-9 pr-3 text-xs font-medium rounded-lg border border-border bg-secondary/50 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                      </div>

                      <div className="overflow-y-auto max-h-64 py-1 divide-y divide-border/20">
                        {filteredSourceLibraries.length === 0 ? (
                          <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                            No libraries found matching search.
                          </div>
                        ) : (
                          filteredSourceLibraries.map((lib) => (
                            <button
                              key={lib.id}
                              type="button"
                              onClick={() => {
                                setSourceLibraryId(lib.id);
                                setSourceDropdownOpen(false);
                              }}
                              className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-secondary/70 ${lib.id === sourceLibraryId
                                  ? "font-bold text-[var(--brand)] bg-secondary/80"
                                  : "text-foreground"
                                }`}
                            >
                              <div className="flex items-center gap-3 truncate">
                                <div
                                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${lib.logoBg}`}
                                >
                                  <LibraryIcon size={14} />
                                </div>
                                <div className="truncate">
                                  <p className="font-bold leading-tight truncate">{lib.name}</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{lib.location}</p>
                                </div>
                              </div>
                              {lib.id === sourceLibraryId && (
                                <CheckCircle2 size={16} className="text-[var(--brand)] shrink-0 ml-2" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selected Source Summary Badge */}
            {selectedSourceLibrary && (
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <BookCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-semibold text-foreground">
                    Contains <strong className="text-emerald-600 dark:text-emerald-400">{selectedSourceLibrary.mappedEBooksCount} mapped eBooks</strong> ready to copy
                  </span>
                </div>
                <span className="text-[11px] font-bold text-muted-foreground">Source Ready</span>
              </div>
            )}
          </div>

          {/* Card 2: Destination Library */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-foreground">Destination Library</h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Select where you want to copy the eBooks to
                  </p>
                </div>
              </div>

              {/* Field Label */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-foreground">
                  Select Destination Library
                </label>

                {/* Dropdown Container */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setDestinationDropdownOpen((o) => !o);
                      setDestinationSearchQuery("");
                    }}
                    className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 text-sm font-semibold text-foreground hover:border-[var(--brand)] hover:bg-secondary/40 outline-none shadow-2xs group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 truncate">
                      {selectedDestinationLibrary ? (
                        <>
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${selectedDestinationLibrary.logoBg}`}
                          >
                            <LibraryIcon size={14} />
                          </div>
                          <span className="truncate text-xs font-bold text-foreground">
                            {selectedDestinationLibrary.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground">
                          Select Destination Library...
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {selectedDestinationLibrary && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setDestinationLibraryId("");
                          }}
                          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          title="Clear selection"
                        >
                          <X size={14} />
                        </span>
                      )}
                      <ChevronDown
                        size={16}
                        className={`text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${destinationDropdownOpen ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  </button>

                  {/* Searchable Dropdown Popover */}
                  {destinationDropdownOpen && (
                    <div
                      className="absolute left-0 top-full z-40 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl flex flex-col py-1.5 animate-in fade-in duration-150"
                      onMouseLeave={() => setDestinationDropdownOpen(false)}
                    >
                      <div className="p-2.5 border-b border-border bg-card sticky top-0 z-10 space-y-1">
                        <div className="relative flex items-center">
                          <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
                          <input
                            type="text"
                            value={destinationSearchQuery}
                            onChange={(e) => setDestinationSearchQuery(e.target.value)}
                            placeholder="Search destination library..."
                            autoFocus
                            className="w-full h-9 pl-9 pr-3 text-xs font-medium rounded-lg border border-border bg-secondary/50 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                      </div>

                      <div className="overflow-y-auto max-h-64 py-1 divide-y divide-border/20">
                        {filteredDestinationLibraries.length === 0 ? (
                          <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                            No libraries found matching search.
                          </div>
                        ) : (
                          filteredDestinationLibraries.map((lib) => {
                            const isSame = lib.id === sourceLibraryId;
                            return (
                              <button
                                key={lib.id}
                                type="button"
                                disabled={isSame}
                                onClick={() => {
                                  setDestinationLibraryId(lib.id);
                                  setDestinationDropdownOpen(false);
                                }}
                                className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors ${isSame
                                    ? "opacity-40 cursor-not-allowed bg-secondary/20"
                                    : lib.id === destinationLibraryId
                                      ? "font-bold text-[var(--brand)] bg-secondary/80"
                                      : "text-foreground hover:bg-secondary/70"
                                  }`}
                              >
                                <div className="flex items-center gap-3 truncate">
                                  <div
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${lib.logoBg}`}
                                  >
                                    <LibraryIcon size={14} />
                                  </div>
                                  <div className="truncate">
                                    <p className="font-bold leading-tight truncate">
                                      {lib.name} {isSame && "(Source)"}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                      {lib.location}
                                    </p>
                                  </div>
                                </div>
                                {lib.id === destinationLibraryId && (
                                  <CheckCircle2 size={16} className="text-[var(--brand)] shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selected Destination Summary Badge */}
            {selectedDestinationLibrary && (
              <div className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-500/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-sky-600 dark:text-sky-400 shrink-0" />
                  <span className="font-semibold text-foreground">
                    Currently has <strong className="text-sky-600 dark:text-sky-400">{selectedDestinationLibrary.mappedEBooksCount} mapped eBooks</strong>
                  </span>
                </div>
                <span className="text-[11px] font-bold text-muted-foreground">Destination Target</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Footer Bar with Clone Library Primary Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
          <div className="text-xs text-muted-foreground font-medium">
            {selectedSourceLibrary && selectedDestinationLibrary ? (
              <span className="flex items-center gap-1.5 text-foreground">
                <Sparkles size={14} className="text-emerald-500" />
                Will copy <strong>{selectedSourceLibrary.mappedEBooksCount} eBooks</strong> from{" "}
                <span className="font-bold text-[var(--brand)]">{selectedSourceLibrary.name}</span> to{" "}
                <span className="font-bold text-[var(--brand)]">{selectedDestinationLibrary.name}</span>
              </span>
            ) : (
              "Select source and destination libraries to begin cloning collection."
            )}
          </div>

          <button
            type="button"
            onClick={handleCloneLibrary}
            disabled={!sourceLibraryId || !destinationLibraryId || sourceLibraryId === destinationLibraryId}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-6 text-sm font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Copy size={16} />
            Clone Library
          </button>
        </div>

        {/* Modal: Clone Confirmation & Success Details */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex items-start justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-foreground">Library Cloned Successfully</h2>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Collection mapped from source to destination library.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer shadow-2xs"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Cloned Transfer Detail Cards */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-semibold text-muted-foreground">
                    <span>Source Library:</span>
                    <strong className="text-foreground font-bold">{selectedSourceLibrary?.name}</strong>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-muted-foreground">
                    <span>Destination Library:</span>
                    <strong className="text-foreground font-bold">{selectedDestinationLibrary?.name}</strong>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-muted-foreground border-t border-border/40 pt-2">
                    <span>Total eBooks Cloned:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                      {clonedCount} Titles
                    </strong>
                  </div>
                </div>

                {/* Sample Cloned Books Preview */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-foreground">Sample Cloned Titles:</p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {mockSourceEBooks.map((bk) => (
                      <div
                        key={bk.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 bg-card text-xs"
                      >
                        <BookCover
                          initials={bk.initials}
                          coverGradient={bk.coverGradient}
                          title={bk.title}
                          size="xs"
                        />
                        <div className="truncate">
                          <p className="font-bold text-foreground truncate">{bk.title}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{bk.publisher} • {bk.genre}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                <Link
                  to="/pb-admin-lib/catalogue"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-5 text-xs font-bold text-foreground hover:bg-secondary transition-colors cursor-pointer shadow-2xs"
                >
                  View Mapped Catalogue
                </Link>
                <button
                  type="button"
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--brand)] px-6 text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-2xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
