import { useState, useRef, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Star,
  Globe,
  CheckCircle2,
  XCircle,
  CircleOff,
  Tag,
  Copy,
  Check,
  FileX2,
  FileText,
  Building2,
  Eye,
  BookOpen,
  HardDrive,
  Users,
  Pencil,
  Library,
  ChevronDown,
  Clock,
  Search,
  X,
  Save,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { usePublisherType } from "@/hooks/use-publisher-type";
import { seedBooks, type Status } from "@/lib/catalogue-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/publisher/catalogue/$bookId")({
  component: EBookDetailPage,
});

/* ------------------------------------------------------------------ */
/*  Mock per-book extra details (language, summary, tags, price, etc.) */
/* ------------------------------------------------------------------ */

type BookExtra = {
  language: string;
  regionalName: string;
  dateOfPublication: string;
  sizeMB: string;
  viewers: number;
  summary: string;
  tags: string[];
  subCategory: string;
  gstRate: number;
};

const extraDefaults: BookExtra = {
  language: "English",
  regionalName: "—",
  dateOfPublication: "—",
  sizeMB: "0.00",
  viewers: 0,
  summary: "No summary available for this eBook.",
  tags: [],
  subCategory: "—",
  gstRate: 5,
};

const extras: Record<string, BookExtra> = {
  "nep-2020": {
    language: "English",
    regionalName: "NEP 2020 - Policy Formulation In Education",
    dateOfPublication: "06 Jan 2026",
    sizeMB: "0.65",
    viewers: 12,
    summary:
      "NEP 2020 – Policy Formulation in Education provides an accessible overview of how India's National Education Policy 2020 was developed, what it aims to achieve, and its core components within the context of education reform.",
    tags: [
      "#National Education Policy 2020",
      "#Higher Education Reforms",
      "#Curriculum Transformation",
      "#Policy Formulation",
      "#Education Reforms in India",
    ],
    subCategory: "Competitive Exams",
    gstRate: 5,
  },
};

function getExtra(id: string): BookExtra {
  return extras[id] ?? extraDefaults;
}

/* ------------------------------------------------------------------ */
/*  Shared UI pieces                                                    */
/* ------------------------------------------------------------------ */

type StatusConfig = {
  label: string;
  bgClass: string;
  textColor: string;
  borderColor: string;
  Icon: React.ElementType;
};

const STATUS_CONFIGS: Record<Status, StatusConfig> = {
  Published: {
    label: "Published",
    bgClass: "bg-emerald-500/12 dark:bg-emerald-500/20",
    textColor: "text-emerald-600 dark:text-emerald-400 font-semibold",
    borderColor: "border-emerald-500/30 dark:border-emerald-500/40",
    Icon: CheckCircle2,
  },
  Draft: {
    label: "Draft",
    bgClass: "bg-amber-500/12 dark:bg-amber-500/20",
    textColor: "text-amber-600 dark:text-amber-400 font-semibold",
    borderColor: "border-amber-500/30 dark:border-amber-500/40",
    Icon: Clock,
  },
  Unpublished: {
    label: "Unpublished",
    bgClass: "bg-slate-500/12 dark:bg-slate-500/20",
    textColor: "text-slate-600 dark:text-slate-400 font-semibold",
    borderColor: "border-slate-500/30 dark:border-slate-500/40",
    Icon: CircleOff,
  },
  Rejected: {
    label: "Rejected",
    bgClass: "bg-rose-500/12 dark:bg-rose-500/20",
    textColor: "text-rose-600 dark:text-rose-400 font-semibold",
    borderColor: "border-rose-500/30 dark:border-rose-500/40",
    Icon: FileX2,
  },
};

function StatusSelectPill({
  status,
  onChange,
  allowedStatuses,
  readOnly = false,
}: {
  status: Status;
  onChange?: (newStatus: Status) => void;
  allowedStatuses?: Status[];
  readOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Status | null>(null);
  const cfg = STATUS_CONFIGS[status] ?? STATUS_CONFIGS.Published;
  const CurrentIcon = cfg.Icon;
  const options = allowedStatuses ?? ["Published", "Draft", "Unpublished", "Rejected"];

  const handleItemClick = (st: Status, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    if (st === status) return;

    if (st === "Published" || st === "Unpublished") {
      setPendingStatus(st);
    } else {
      onChange?.(st);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        disabled={readOnly}
        onClick={(e) => {
          e.stopPropagation();
          if (!readOnly) setOpen((o) => !o);
        }}
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold tracking-tight transition-all ${cfg.bgClass} ${cfg.textColor} ${cfg.borderColor} ${
          readOnly ? "cursor-default" : "hover:opacity-90 cursor-pointer shadow-2xs"
        }`}
      >
        <CurrentIcon size={15} className="shrink-0" />
        <span>{cfg.label}</span>
        {!readOnly && (
          <ChevronDown
            size={14}
            className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && !readOnly && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="absolute left-0 top-full z-40 mt-1.5 min-w-[155px] overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {options.map((st) => {
              const itemCfg = STATUS_CONFIGS[st];
              const ItemIcon = itemCfg.Icon;
              const isSelected = st === status;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={(e) => handleItemClick(st, e)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    isSelected ? "bg-secondary/80" : "hover:bg-secondary/50"
                  } ${itemCfg.textColor}`}
                >
                  <ItemIcon size={16} className="shrink-0" />
                  <span>{itemCfg.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Confirmation Modal for Publish / Unpublish */}
      {pendingStatus && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            e.stopPropagation();
            setPendingStatus(null);
          }}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  pendingStatus === "Published"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-slate-500/15 text-slate-600 dark:text-slate-400"
                }`}
              >
                {pendingStatus === "Published" ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <CircleOff size={22} />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {pendingStatus === "Published" ? "Confirm Publish eBook" : "Confirm Unpublish eBook"}
                </h3>
                <p className="text-xs text-muted-foreground">Confirmation required</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {pendingStatus === "Published"
                ? "Are you sure you want to publish this eBook? Once published, it will become active and accessible to readers and libraries."
                : "Are you sure you want to unpublish this eBook? Unpublishing will hide it from active catalogue views and new borrowings."}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPendingStatus(null)}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = pendingStatus;
                  setPendingStatus(null);
                  onChange?.(target);
                }}
                className={`inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 cursor-pointer ${
                  pendingStatus === "Published" ? "bg-emerald-600" : "bg-slate-700"
                }`}
              >
                {pendingStatus === "Published" ? "Confirm & Publish" : "Confirm & Unpublish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  return <StatusSelectPill status={status} readOnly />;
}

function StatusStamp({ status }: { status: Status }) {
  const map = {
    Published: { label: "PUBLISHED", color: "#059669" },
    Draft: { label: "DRAFT", color: "#d97706" },
    Unpublished: { label: "UNPUBLISHED", color: "#6b7280" },
    Rejected: { label: "REJECTED", color: "#e11d48" },
  };
  const s = map[status] ?? map.Draft;
  return (
    <div
      className="flex h-16 w-16 shrink-0 rotate-12 items-center justify-center rounded-full border-[3px] text-[8px] font-black uppercase tracking-widest opacity-80"
      style={{ borderColor: s.color, color: s.color }}
    >
      {s.label}
    </div>
  );
}

const ALL_LIBRARIES = [
  { id: "lib-1", name: "Central University Digital Library", city: "New Delhi" },
  { id: "lib-2", name: "National Science & Tech Consortium", city: "Bangalore" },
  { id: "lib-3", name: "City Academic Library System", city: "Mumbai" },
  { id: "lib-4", name: "Delhi Public Library", city: "New Delhi" },
  { id: "lib-5", name: "State Institute of Technology Library", city: "Pune" },
  { id: "lib-6", name: "IIT Delhi Central Library", city: "New Delhi" },
  { id: "lib-7", name: "Indian Institute of Science Library", city: "Bangalore" },
];

function LibraryMultiSelectDropdown({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (libs: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLibraries = ALL_LIBRARIES.filter(
    (lib) =>
      lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lib.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleLibrary = (libName: string) => {
    if (selected.includes(libName)) {
      onChange(selected.filter((item) => item !== libName));
    } else {
      onChange([...selected, libName]);
    }
  };

  const isAllSelected =
    filteredLibraries.length > 0 &&
    filteredLibraries.every((lib) => selected.includes(lib.name));

  const handleSelectAll = () => {
    if (isAllSelected) {
      const filteredNames = filteredLibraries.map((l) => l.name);
      onChange(selected.filter((name) => !filteredNames.includes(name)));
    } else {
      const newSelected = new Set([...selected, ...filteredLibraries.map((l) => l.name)]);
      onChange(Array.from(newSelected));
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border bg-card p-2 text-sm font-medium transition-colors cursor-pointer shadow-2xs ${
          isOpen ? "border-[var(--brand)] ring-1 ring-[var(--brand)]" : "border-border hover:bg-secondary/30"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selected.length === 0 ? (
            <span className="text-muted-foreground text-xs font-normal px-2">
              Select one or more libraries...
            </span>
          ) : (
            selected.map((libName) => (
              <span
                key={libName}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--brand)]"
              >
                <span>{libName}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLibrary(libName);
                  }}
                  className="rounded-md hover:bg-[var(--brand)]/20 p-0.5 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0 px-1">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline pr-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <ChevronDown
            size={16}
            className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-72 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl flex flex-col">
          <div className="p-2.5 border-b border-border bg-card sticky top-0 z-10 space-y-2">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search libraries by name..."
                autoFocus
                className="w-full h-9 pl-9 pr-8 text-xs rounded-lg border border-border bg-secondary/40 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between px-1 text-xs">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] font-semibold text-[var(--brand)] hover:underline cursor-pointer"
              >
                {isAllSelected ? "Deselect All" : "Select All Libraries"}
              </button>
              <span className="text-[11px] text-muted-foreground font-medium">
                {selected.length} of {ALL_LIBRARIES.length} selected
              </span>
            </div>
          </div>

          <div className="overflow-y-auto max-h-52 py-1 divide-y divide-border/30">
            {filteredLibraries.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                No matching libraries found.
              </div>
            ) : (
              filteredLibraries.map((lib) => {
                const checked = selected.includes(lib.name);
                return (
                  <label
                    key={lib.id}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors cursor-pointer hover:bg-secondary/60 ${
                      checked ? "bg-[var(--brand)]/5 font-semibold text-foreground" : "text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleLibrary(lib.name)}
                        className="h-4 w-4 rounded border-border text-[var(--brand)] focus:ring-[var(--brand)] accent-[var(--brand)] cursor-pointer"
                      />
                      <span className="truncate">{lib.name}</span>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LibraryStoreAllocationCard() {
  const [restrictToSpecific, setRestrictToSpecific] = useState(true);
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([
    "Central University Digital Library",
    "National Science & Tech Consortium",
  ]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSaveAllocations = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    setIsConfirmOpen(false);
    toast.success("Library store allocations updated successfully");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 md:p-6 space-y-5 shadow-2xs hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 shadow-2xs">
            <Library size={22} />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-foreground leading-tight">
              Library Allocation
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Configure authorized libraries where this eBook title will be available in digital catalogues.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
          <CheckCircle2 size={13} />
          {selectedLibraries.length} Libraries Allocated
        </span>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <span>Select Authorized Libraries</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-muted-foreground font-medium">
              {selectedLibraries.length} libraries selected
            </span>
          </div>

          <LibraryMultiSelectDropdown
            selected={selectedLibraries}
            onChange={setSelectedLibraries}
          />

          {selectedLibraries.length === 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-1">
              <span>⚠️ Please select at least one library for allocation to take effect.</span>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground font-medium">
            {`${selectedLibraries.length} libraries selected for title allocation`}
          </span>

          <button
            type="button"
            onClick={handleSaveAllocations}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-5 text-xs font-bold text-white shadow-2xs transition-all hover:opacity-90 active:scale-98 cursor-pointer shrink-0 self-end sm:self-auto"
          >
            <Save size={15} />
            <span>Save Allocations</span>
          </button>
        </div>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-md bg-card border border-border rounded-xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Library size={20} className="text-[var(--brand)]" />
              <span>Confirm Library Allocations</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Are you sure you want to update the library store allocations for this title?
              {restrictToSpecific
                ? ` This eBook will be restricted exclusively to ${selectedLibraries.length} authorized library catalogues.`
                : " This eBook will be available to all institutional libraries globally."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsConfirmOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--brand)] px-4 text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              Confirm & Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PriceDetailsAndRentalPlanSection({ gstRate = 5 }: { gstRate?: number }) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>("5-year");

  const rentalPlans = [
    {
      id: "5-year",
      isSpecial: true,
      price: "₹943.95",
      subtext: "For 5 Years Access*",
    },
    {
      id: "3y-60d",
      duration: "3 Years 60 Days",
      price: "₹839.00",
      originalPrice: "₹944.00",
    },
    {
      id: "1y-30d",
      duration: "1 Year 30 Days",
      price: "₹512.00",
    },
    {
      id: "1y-60d",
      duration: "1 Year 60 Days",
      price: "₹149.00",
    },
    {
      id: "1y-90d",
      duration: "1 Year 90 Days",
      price: "₹396.00",
      originalPrice: "₹501.00",
    },
    {
      id: "1y-180d",
      duration: "1 Year 180 Days",
      price: "₹699.00",
      originalPrice: "₹827.00",
    },
    {
      id: "2y-30d",
      duration: "2 Years 30 Days",
      price: "₹5013.00",
    },
    {
      id: "2y-60d",
      duration: "2 Years 60 Days",
      price: "₹466.00",
    },
    {
      id: "2y-90d",
      duration: "2 Years 90 Days",
      price: "₹5013.00",
    },
    {
      id: "2y-180d",
      duration: "2 Years 180 Days",
      price: "₹498.00",
      originalPrice: "₹781.00",
    },
    {
      id: "3y-30d",
      duration: "3 Years 30 Days",
      price: "₹6179.00",
    },
    {
      id: "3y-90d",
      duration: "3 Years 90 Days",
      price: "₹4709.00",
    },
    {
      id: "3y-180d",
      duration: "3 Years 180 Days",
      price: "₹501.00",
    },
    {
      id: "4y-30d",
      duration: "4 Years 30 Days",
      price: "₹151.00",
    },
    {
      id: "4y-90d",
      duration: "4 Years 90 Days",
      price: "₹827.00",
    },
    {
      id: "4y-180d",
      duration: "4 Years 180 Days",
      price: "₹8.00",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Column: Price Details */}
        <div className="lg:col-span-5 flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Price Details
            </p>
          </div>
          <div className="px-6 py-5 flex flex-col justify-between flex-1">
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground font-medium">Renewal Percentage (Excl.GST):</span>
                <span className="font-bold text-foreground">3%</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground font-medium">GST Rate:</span>
                <span className="font-bold text-foreground">{gstRate}%</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground font-medium">Unit Price (excl. GST):</span>
                <span className="font-bold text-foreground">₹899.00</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground font-medium">Unit Price (includ. GST):</span>
                <span className="font-bold text-foreground">₹943.95</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground font-medium">Offer Price (excl. GST):</span>
                <span className="font-medium text-muted-foreground">-</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <p className="text-xs font-semibold text-muted-foreground">Selling Price including GST:</p>
              <p className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                ₹943.95
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Rental Plan */}
        <div className="lg:col-span-7 overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Rental Plan
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {rentalPlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              if (plan.isSpecial) {
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-[var(--brand)] bg-[var(--brand)]/5 ring-1 ring-[var(--brand)]"
                        : "border-border bg-card hover:bg-secondary/40"
                    }`}
                  >
                    <span className="text-sm font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-[10px] font-medium italic text-muted-foreground mt-0.5">
                      {plan.subtext}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-[var(--brand)] bg-[var(--brand)]/5 ring-1 ring-[var(--brand)]"
                      : "border-border bg-card hover:bg-secondary/40"
                  }`}
                >
                  <span className="text-[11px] font-bold text-foreground whitespace-nowrap">
                    {plan.duration}
                  </span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs font-bold text-foreground">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-[10px] font-medium text-muted-foreground line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>

      {/* Confirmed Agreement Status Card (Non-editable / Locked) */}
      <div className="pt-2">
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/8 dark:bg-emerald-500/10 p-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-0">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    GST Declaration Confirmed
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <Lock size={10} /> Read-only
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed mt-1">
                  I hereby confirm that the eBook includes a print version and therefore is subject to the GST rate of 5%
                </p>
              </div>
            </div>

            <div className="shrink-0 self-end sm:self-center">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <ShieldCheck size={14} />
                Agreement Recorded
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-3.5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {title}
        </p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function MetaRow({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex gap-3 py-1 text-sm">
      <span className="w-52 shrink-0 text-muted-foreground">{label}</span>
      <span className={`font-medium text-foreground ${valueClass}`}>{value}</span>
    </div>
  );
}

function CopyBookUrlButton({ bookId }: { bookId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/catalogue/${bookId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
    >
      {copied ? (
        <>
          <Check size={15} className="text-emerald-500" />
          Copied!
        </>
      ) : (
        <>
          <Copy size={15} />
          Copy Book URL
        </>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function EBookDetailPage() {
  const { bookId } = Route.useParams();
  const [publisherType] = usePublisherType();
  const isLibraryOnly = publisherType === "Library-Only Publisher";
  const book = seedBooks.find((b) => b.id === bookId);

  const [licenseCount, setLicenseCount] = useState<number>(book?.licenseCount ?? 50);
  const [isEditingLicenses, setIsEditingLicenses] = useState(false);
  const [licenseInput, setLicenseInput] = useState(licenseCount.toString());
  const initialStatus: Status = (isLibraryOnly && book?.status === "Rejected") ? "Draft" : (book?.status ?? "Published");
  const [currentStatus, setCurrentStatus] = useState<Status>(initialStatus);

  if (!book) {
    return (
      <AppShell title="eBook Details">
        <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
          <p className="text-sm text-muted-foreground">eBook not found.</p>
          <Link
            to="/publisher/catalogue"
            className="text-sm font-normal"
            style={{ color: "var(--brand)" }}
          >
            ← Back to Catalogue
          </Link>
        </div>
      </AppShell>
    );
  }

  const extra = getExtra(bookId);
  const priceExGST =
    book.price !== null ? (book.price / (1 + extra.gstRate / 100)).toFixed(2) : null;

  return (
    <AppShell title="eBook Details">
      <div className="space-y-4 p-4 md:p-8">
        {/* Back button */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/publisher/catalogue"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Back to Catalogue"
          >
            <ArrowLeft size={16} />
          </Link>
          <Link
            to="/publisher/catalogue"
            className="text-sm font-normal text-foreground hover:text-[var(--brand)] transition-colors"
          >
            Back to Catalogue
          </Link>
        </div>

        {/* ── Hero card ──────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Cover */}
            <div
              className="relative flex h-72 w-52 shrink-0 flex-col items-center justify-center rounded-xl text-base font-bold text-white shadow-md ring-1 ring-black/10 overflow-hidden self-center lg:self-start"
              style={{ background: book.cover }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
              <span className="relative z-10 text-lg font-extrabold tracking-wider">{book.initials}</span>
            </div>

            {/* Info Container */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Header: Title */}
              <div className="space-y-2.5 min-w-0">
                <h1 className="text-2xl font-bold tracking-tight leading-snug text-foreground">
                  {book.title}
                </h1>

                {/* Badges & Entity Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Author Chip */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-foreground shadow-2xs">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                      style={{ background: book.cover }}
                    >
                      {book.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <span>{book.author}</span>
                  </div>

                  {/* Publisher Chip */}
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Building2 size={13} className="shrink-0 text-muted-foreground/80" />
                    <span>{book.publisher ?? "PixelBooks Press"}</span>
                  </div>

                  {/* Category Pill */}
                  <span className="rounded-md border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {book.category}
                  </span>
                </div>
              </div>

              {/* Stats & Key Metrics Strip (Compatible Grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {/* 1. Price or License Copies */}
                {!isLibraryOnly ? (
                  <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Price</span>
                      <Tag size={14} className="text-muted-foreground/80" />
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {book.price === null ? "Free" : `₹${book.price.toFixed(2)}`}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Copies</span>
                      <Library size={14} className="text-muted-foreground/80" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-foreground">{licenseCount} copies</p>
                      <button
                        type="button"
                        onClick={() => {
                          setLicenseInput(licenseCount.toString());
                          setIsEditingLicenses(true);
                        }}
                        className="text-xs font-semibold text-[var(--brand)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil size={11} /> Edit
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. File Size */}
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">eBook Size (in MB)</span>
                    <HardDrive size={14} className="text-muted-foreground/80" />
                  </div>
                  <p className="text-lg font-bold text-foreground">{extra.sizeMB} MB</p>
                </div>

                {/* 3. Readers */}
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Readers</span>
                    <Users size={14} className="text-muted-foreground/80" />
                  </div>
                  <p className="text-lg font-bold text-foreground">{extra.viewers}</p>
                </div>

                {/* 4. Status */}
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex flex-col justify-between transition-colors hover:bg-secondary/50 min-h-[76px]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
                  <div className="flex items-center pt-1">
                    <StatusSelectPill
                      status={currentStatus}
                      onChange={(next) => {
                        setCurrentStatus(next);
                        toast.success(`Book status updated to ${next}`);
                      }}
                      allowedStatuses={
                        isLibraryOnly
                          ? ["Draft", "Published", "Unpublished"]
                          : ["Published", "Unpublished", "Draft", "Rejected"]
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Metadata Sub-Row: Language, File Type & Rating */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border/60 pt-3">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>4.8</span>
                  <span className="text-muted-foreground">(1 review)</span>
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Globe size={13} className="text-muted-foreground" />
                  <span>Language: <strong className="text-foreground">{extra.language}</strong></span>
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span>File Type: <strong className="text-foreground uppercase">{book.format}</strong></span>
                </span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 shadow-2xs cursor-pointer"
                  style={{
                    backgroundColor: "var(--brand)",
                    color: "var(--brand-contrast)",
                  }}
                >
                  <Eye size={16} />
                  Preview eBook
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer">
                  <BookOpen size={16} />
                  Preview Sample eBook
                </button>
                <CopyBookUrlButton bookId={book.id} />
              </div>
            </div>
          </div>
        </div>

        {/* ── eBook Details ──────────────────────────────────────────── */}
        <SectionCard title="eBook Details">
          <div className="space-y-0.5">
            <MetaRow label="eBook Name:" value={book.title} />
            <MetaRow
              label="Status:"
              value={
                <StatusSelectPill
                  status={currentStatus}
                  onChange={(next) => {
                    setCurrentStatus(next);
                    toast.success(`Book status updated to ${next}`);
                  }}
                  allowedStatuses={
                    isLibraryOnly
                      ? ["Draft", "Published", "Unpublished"]
                      : ["Published", "Unpublished", "Draft", "Rejected"]
                  }
                />
              }
            />
            <MetaRow label="Language:" value={extra.language} valueClass="text-[var(--brand)]" />
            <MetaRow label="Regional Name:" value={extra.regionalName} />
            <MetaRow label="Date of Publications:" value={extra.dateOfPublication} />
            <MetaRow label="eBook Size (in MB):" value={`${extra.sizeMB} MB`} />
            {isLibraryOnly && (
              <MetaRow
                label="No. of copies:"
                value={
                  <div className="inline-flex items-center gap-2">
                    <span className="font-bold text-foreground">{licenseCount} copies</span>
                    <button
                      type="button"
                      onClick={() => {
                        setLicenseInput(licenseCount.toString());
                        setIsEditingLicenses(true);
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-xs font-semibold text-[var(--brand)] hover:bg-secondary cursor-pointer shadow-2xs"
                    >
                      <Pencil size={11} /> Edit Copies
                    </button>
                  </div>
                }
              />
            )}
          </div>

          {/* Summary */}
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-2 text-sm text-muted-foreground">Summary:</p>
            <p className="text-sm leading-relaxed text-foreground">{extra.summary}</p>
          </div>

          {/* Tags */}
          {extra.tags.length > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-2.5 text-sm text-muted-foreground">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {extra.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── SEO ───────────────────────────────────────────────────── */}
        {!isLibraryOnly && (
          <SectionCard title="For SEO Purpose">
            <div className="space-y-0.5">
              <MetaRow label="Meta Titles:" value="—" />
              <MetaRow label="Meta Keywords:" value="—" />
              <MetaRow label="Meta Description:" value="—" />
            </div>
          </SectionCard>
        )}

        {/* ── Author + Sub Category ─────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="Author Details">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card px-3.5 py-1.5 shadow-2xs">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-2xs"
                style={{ background: book.cover }}
              >
                {book.author
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <span className="text-sm font-semibold text-foreground">{book.author}</span>
            </div>
          </SectionCard>

          <SectionCard title="Sub Category">
            <p className="text-sm font-medium text-foreground">{extra.subCategory}</p>
          </SectionCard>
        </div>

        {/* ── Library Allocation (For Library-Only Publisher) ─────────── */}
        {isLibraryOnly && <LibraryStoreAllocationCard />}

        {/* ── Price Details & Rental Plan ─────────────────────────────── */}
        <PriceDetailsAndRentalPlanSection gstRate={extra.gstRate} />
      </div>

      {/* Edit License Count Modal */}
      {isEditingLicenses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Library size={18} className="text-[var(--brand)]" />
                Edit No. of Copies
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingLicenses(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                <XCircle size={18} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Update the total number of library license copies available for <span className="font-semibold text-foreground">"{book.title}"</span>.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">No. of copies</label>
              <input
                type="number"
                min="1"
                value={licenseInput}
                onChange={(e) => setLicenseInput(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold outline-none focus:border-[var(--brand)] transition-colors"
                placeholder="e.g. 50"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingLicenses(false)}
                className="h-9 px-4 rounded-lg border border-border text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const count = parseInt(licenseInput, 10);
                  if (!isNaN(count) && count > 0) {
                    setLicenseCount(count);
                    setIsEditingLicenses(false);
                    toast.success(`Copies updated to ${count} copies`);
                  }
                }}
                className="h-9 px-4 rounded-lg text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: "var(--brand)" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
