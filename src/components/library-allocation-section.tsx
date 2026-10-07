import { useState, useRef, useEffect, useMemo } from "react";
import {
  Library,
  Building2,
  GraduationCap,
  CheckCircle2,
  Minus,
  Plus,
  Trash2,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import { DEFAULT_COURSES, DEFAULT_BATCHES } from "@/lib/academic-data";
import { MultiSelectDropdown, type MultiSelectOption } from "@/components/ui/multi-select-dropdown";

export const ALL_LIBRARIES = [
  { id: "lib-1", name: "Central University Digital Library", city: "New Delhi" },
  { id: "lib-2", name: "National Science & Tech Consortium", city: "Bangalore" },
  { id: "lib-3", name: "City Academic Library System", city: "Mumbai" },
  { id: "lib-4", name: "Delhi Public Library", city: "New Delhi" },
  { id: "lib-5", name: "State Institute of Technology Library", city: "Pune" },
  { id: "lib-6", name: "IIT Delhi Central Library", city: "New Delhi" },
  { id: "lib-7", name: "Indian Institute of Science Library", city: "Bangalore" },
];

export interface LibraryAllocationItem {
  copies: number;
  courses: string[];
  batches: string[];
}

export function LibraryMultiSelectDropdown({
  allocations,
  onChange,
  showCopies = true,
}: {
  allocations: Record<string, LibraryAllocationItem>;
  onChange: (
    allocations:
      | Record<string, LibraryAllocationItem>
      | ((prev: Record<string, LibraryAllocationItem>) => Record<string, LibraryAllocationItem>),
  ) => void;
  showCopies?: boolean;
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

  const selectedNames = Object.keys(allocations);

  const filteredLibraries = ALL_LIBRARIES.filter(
    (lib) =>
      lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lib.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleLibrary = (libName: string, defaultCopies = 50) => {
    const next = { ...allocations };
    if (next[libName] !== undefined) {
      delete next[libName];
    } else {
      next[libName] = {
        copies: defaultCopies,
        courses: ["All Courses"],
        batches: ["All Batches"],
      };
    }
    onChange(next);
  };

  const updateCopies = (libName: string, count: number) => {
    const next = { ...allocations };
    if (next[libName]) {
      const validCount = Math.max(1, isNaN(count) ? 1 : count);
      next[libName] = {
        ...next[libName],
        copies: validCount,
      };
      onChange(next);
    }
  };

  const isAllSelected =
    filteredLibraries.length > 0 &&
    filteredLibraries.every((lib) => allocations[lib.name] !== undefined);

  const handleSelectAll = () => {
    const next = { ...allocations };
    if (isAllSelected) {
      filteredLibraries.forEach((l) => {
        delete next[l.name];
      });
    } else {
      filteredLibraries.forEach((l) => {
        if (next[l.name] === undefined) {
          next[l.name] = {
            copies: 50,
            courses: ["All Courses"],
            batches: ["All Batches"],
          };
        }
      });
    }
    onChange(next);
  };

  const totalCopies = Object.values(allocations).reduce(
    (acc, curr) => acc + (curr.copies || 0),
    0,
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex min-h-[46px] w-full items-center justify-between gap-2 rounded-xl border bg-card p-2 text-sm font-medium transition-colors cursor-pointer shadow-2xs ${
          isOpen
            ? "border-[var(--brand)] ring-1 ring-[var(--brand)]"
            : "border-border hover:bg-secondary/30"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedNames.length === 0 ? (
            <span className="text-muted-foreground text-xs font-normal px-2">
              {showCopies
                ? "Select one or more libraries & configure copies..."
                : "Select one or more libraries..."}
            </span>
          ) : (
            selectedNames.map((libName) => (
              <span
                key={libName}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--brand)]"
              >
                <span>{libName}</span>
                {showCopies && (
                  <span className="inline-flex items-center rounded-md bg-[var(--brand)] px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                    {allocations[libName].copies} copies
                  </span>
                )}
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
          {selectedNames.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange({});
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
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl flex flex-col">
          <div className="p-2.5 border-b border-border bg-card sticky top-0 z-10 space-y-2">
            <div className="relative flex items-center">
              <Search
                size={14}
                className="absolute left-3 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search libraries by name or city..."
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
                {showCopies
                  ? `${selectedNames.length} selected (${totalCopies} copies total)`
                  : `${selectedNames.length} selected`}
              </span>
            </div>
          </div>

          <div className="overflow-y-auto max-h-60 py-1 divide-y divide-border/30">
            {filteredLibraries.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                No matching libraries found.
              </div>
            ) : (
              filteredLibraries.map((lib) => {
                const isSelected = allocations[lib.name] !== undefined;
                const copies = allocations[lib.name]?.copies ?? 50;

                return (
                  <div
                    key={lib.id}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors hover:bg-secondary/60 ${
                      isSelected ? "bg-[var(--brand)]/5 font-semibold" : ""
                    }`}
                  >
                    <div
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer pr-2"
                      onClick={() => toggleLibrary(lib.name)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-border text-[var(--brand)] focus:ring-[var(--brand)] accent-[var(--brand)] cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-foreground font-medium">{lib.name}</p>
                        <p className="text-[10px] text-muted-foreground">{lib.city}</p>
                      </div>
                    </div>

                    {isSelected && showCopies && (
                      <div
                        className="flex items-center gap-1 shrink-0 bg-background border border-border/80 rounded-lg p-1 shadow-2xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => updateCopies(lib.name, copies - 5)}
                          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                          title="Decrease copies"
                        >
                          <Minus size={12} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={copies}
                          onChange={(e) =>
                            updateCopies(lib.name, parseInt(e.target.value, 10) || 1)
                          }
                          className="w-12 h-6 text-center text-xs font-bold text-foreground bg-transparent outline-none"
                        />
                        <span className="text-[10px] text-muted-foreground pr-1">copies</span>
                        <button
                          type="button"
                          onClick={() => updateCopies(lib.name, copies + 5)}
                          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                          title="Increase copies"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export interface LibraryAllocationSectionProps {
  allocations?: Record<string, LibraryAllocationItem>;
  onChange?: (allocations: Record<string, LibraryAllocationItem>) => void;
  mediaTypeLabel?: string;
  showCopies?: boolean;
}

export function LibraryAllocationSection({
  allocations: controlledAllocations,
  onChange,
  mediaTypeLabel = "title",
  showCopies: propShowCopies,
}: LibraryAllocationSectionProps) {
  const showCopies =
    propShowCopies !== undefined
      ? propShowCopies
      : mediaTypeLabel !== "video" && mediaTypeLabel !== "audio";

  const isControlled = controlledAllocations !== undefined;
  const [internalAllocations, setInternalAllocations] = useState<
    Record<string, LibraryAllocationItem>
  >({
    "Central University Digital Library": {
      copies: 50,
      courses: ["All Courses"],
      batches: ["All Batches"],
    },
    "National Science & Tech Consortium": {
      copies: 30,
      courses: ["All Courses"],
      batches: ["All Batches"],
    },
  });

  const allocations = isControlled ? controlledAllocations : internalAllocations;

  const updateAllocations = (
    updater: (
      prev: Record<string, LibraryAllocationItem>,
    ) => Record<string, LibraryAllocationItem>,
  ) => {
    if (isControlled) {
      onChange?.(updater(allocations));
    } else {
      setInternalAllocations((prev) => {
        const next = updater(prev);
        onChange?.(next);
        return next;
      });
    }
  };

  const selectedLibraries = Object.keys(allocations);
  const totalCopies = Object.values(allocations).reduce(
    (sum, item) => sum + (item.copies || 0),
    0,
  );

  const updateCopies = (libName: string, copies: number) => {
    updateAllocations((prev) => {
      if (!prev[libName]) return prev;
      return {
        ...prev,
        [libName]: {
          ...prev[libName],
          copies: Math.max(1, isNaN(copies) ? 1 : copies),
        },
      };
    });
  };

  const removeLibrary = (libName: string) => {
    updateAllocations((prev) => {
      const next = { ...prev };
      delete next[libName];
      return next;
    });
  };

  const courseOptions: MultiSelectOption[] = useMemo(
    () => [
      { id: "all-courses", label: "All Courses" },
      ...DEFAULT_COURSES.map((c) => ({ id: c.id, label: c.name })),
    ],
    [],
  );

  const handleCoursesChange = (libName: string, next: string[]) => {
    const currentCourses = allocations[libName]?.courses ?? ["All Courses"];
    let updatedCourses: string[];

    if (next.includes("All Courses") && !currentCourses.includes("All Courses")) {
      updatedCourses = ["All Courses"];
    } else if (next.includes("All Courses") && next.length > 1) {
      updatedCourses = next.filter((c) => c !== "All Courses");
    } else {
      updatedCourses = next;
    }

    updateAllocations((prev) => ({
      ...prev,
      [libName]: {
        ...prev[libName],
        courses: updatedCourses,
      },
    }));
  };

  const handleBatchesChange = (libName: string, next: string[]) => {
    const currentBatches = allocations[libName]?.batches ?? ["All Batches"];
    let updatedBatches: string[];

    if (next.includes("All Batches") && !currentBatches.includes("All Batches")) {
      updatedBatches = ["All Batches"];
    } else if (next.includes("All Batches") && next.length > 1) {
      updatedBatches = next.filter((b) => b !== "All Batches");
    } else {
      updatedBatches = next;
    }

    updateAllocations((prev) => ({
      ...prev,
      [libName]: {
        ...prev[libName],
        batches: updatedBatches,
      },
    }));
  };

  const getBatchOptionsForCourses = (courses: string[]): MultiSelectOption[] => {
    if (courses.length === 0 || courses.includes("All Courses")) {
      return [
        { id: "all-batches", label: "All Batches" },
        ...DEFAULT_BATCHES.map((b) => ({
          id: b.id,
          label: b.name,
          sublabel: b.courseName ? `Course: ${b.courseName}` : undefined,
          chipSublabel: b.courseName,
        })),
      ];
    }
    const matching = DEFAULT_BATCHES.filter(
      (b) => b.courseName && courses.includes(b.courseName),
    );
    const pool = matching.length > 0 ? matching : DEFAULT_BATCHES;
    return [
      { id: "all-batches", label: "All Batches" },
      ...pool.map((b) => ({
        id: b.id,
        label: b.name,
        sublabel: b.courseName ? `Course: ${b.courseName}` : undefined,
        chipSublabel: b.courseName,
      })),
    ];
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 md:p-6 space-y-5 shadow-2xs hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 shadow-2xs">
            <Library size={22} />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-foreground leading-tight">
              {showCopies
                ? "Library Allocation & License Copies"
                : "Library Allocation & Curriculum Access"}
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {showCopies
                ? "Select authorized institutional libraries, allocate license copies, and configure course & batch access per library."
                : `Select authorized institutional libraries and configure course & batch access per library.`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={13} />
            {selectedLibraries.length} Libraries Allocated
          </span>
          {showCopies && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {totalCopies} Total Copies
            </span>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <span>
                {showCopies
                  ? "Select Authorized Libraries & Set Copies"
                  : "Select Authorized Libraries"}
              </span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-muted-foreground font-medium">
              {showCopies
                ? `${selectedLibraries.length} libraries • ${totalCopies} copies`
                : `${selectedLibraries.length} libraries allocated`}
            </span>
          </div>

          <LibraryMultiSelectDropdown
            allocations={allocations}
            showCopies={showCopies}
            onChange={(nextOrUpdater) => {
              if (typeof nextOrUpdater === "function") {
                updateAllocations(nextOrUpdater);
              } else {
                updateAllocations(() => nextOrUpdater);
              }
            }}
          />
        </div>

        {/* Selected Libraries Breakdown with Courses & Batches */}
        {selectedLibraries.length > 0 ? (
          <div className="rounded-xl border border-border/80 bg-secondary/10 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <span>Allocated Libraries & Curriculum Access</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {showCopies
                    ? "Configure license quota, academic courses, and batches for each allocated library."
                    : "Configure academic courses and batches for each allocated library."}
                </p>
              </div>
              {showCopies ? (
                <span className="text-xs font-semibold text-muted-foreground">
                  Total:{" "}
                  <strong className="text-foreground font-extrabold">{totalCopies} copies</strong>
                </span>
              ) : (
                <span className="text-xs font-semibold text-muted-foreground">
                  Total:{" "}
                  <strong className="text-foreground font-extrabold">
                    {selectedLibraries.length} {selectedLibraries.length === 1 ? "library" : "libraries"}
                  </strong>
                </span>
              )}
            </div>

            <div className="space-y-4">
              {selectedLibraries.map((libName) => {
                const libInfo = ALL_LIBRARIES.find((l) => l.name === libName);
                const allocation = allocations[libName];
                const copies = allocation.copies;
                const courses = allocation.courses ?? ["All Courses"];
                const batches = allocation.batches ?? ["All Batches"];
                const libraryBatchOptions = getBatchOptionsForCourses(courses);

                return (
                  <div
                    key={libName}
                    className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-2xs space-y-4 transition-all hover:border-[var(--brand)]/40 hover:shadow-sm"
                  >
                    {/* Top Row: Library info, Copies stepper, Presets, Delete */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          <Building2 size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-foreground truncate">{libName}</p>
                            {showCopies && (
                              <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                {copies} Copies
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {libInfo?.city ?? "Institutional Library"} •{" "}
                            {showCopies
                              ? "Institutional License Allocation"
                              : "Institutional Media Access"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto flex-wrap">
                        {showCopies && (
                          <>
                            {/* Presets */}
                            <div className="hidden md:flex items-center gap-1 mr-1">
                              {[10, 25, 50, 100].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => updateCopies(libName, preset)}
                                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer ${
                                    copies === preset
                                      ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                                      : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                                  }`}
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>

                            {/* Stepper Input */}
                            <div className="flex items-center gap-1 bg-secondary/30 border border-border rounded-xl px-2 py-1 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateCopies(libName, copies - 5)}
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-card hover:text-foreground cursor-pointer transition-colors"
                              >
                                <Minus size={13} />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={copies}
                                onChange={(e) =>
                                  updateCopies(libName, parseInt(e.target.value, 10) || 1)
                                }
                                className="w-12 h-7 text-center text-xs font-extrabold text-foreground outline-none bg-transparent"
                              />
                              <span className="text-[11px] text-muted-foreground font-medium pr-1">
                                copies
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCopies(libName, copies + 5)}
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-card hover:text-foreground cursor-pointer transition-colors"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </>
                        )}

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => removeLibrary(libName)}
                          className="h-9 w-9 rounded-xl border border-border bg-secondary/30 flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Remove library allocation"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: Library-specific Course & Batch dropdowns */}
                    <div className="rounded-xl bg-secondary/30 border border-border/60 p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                          <GraduationCap size={15} className="text-blue-600 dark:text-blue-400" />
                          <span>Linked Courses & Batches for {libName}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {courses.includes("All Courses")
                            ? "All Courses"
                            : `${courses.length} course${courses.length > 1 ? "s" : ""}`}{" "}
                          •{" "}
                          {batches.includes("All Batches")
                            ? "All Batches"
                            : `${batches.length} batch${batches.length > 1 ? "es" : ""}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {/* Course Dropdown */}
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">
                            Courses
                          </label>
                          <MultiSelectDropdown
                            placeholder="All Courses"
                            searchPlaceholder="Search courses..."
                            options={courseOptions}
                            selectedValues={courses}
                            onChange={(next) => handleCoursesChange(libName, next)}
                            badgeVariant="blue"
                          />
                          <span className="text-[11px] text-muted-foreground mt-1 block">
                            Assign specific courses or leave as All Courses for this library.
                          </span>
                        </div>

                        {/* Batch Dropdown */}
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">
                            Batches
                          </label>
                          <MultiSelectDropdown
                            placeholder="All Batches"
                            searchPlaceholder="Search batches..."
                            options={libraryBatchOptions}
                            selectedValues={batches}
                            onChange={(next) => handleBatchesChange(libName, next)}
                            badgeVariant="amber"
                          />
                          <span className="text-[11px] text-muted-foreground mt-1 block">
                            Assign specific cohorts or leave as All Batches for this library.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-1">
            <span>
              {showCopies
                ? "⚠️ Please select at least one library and allocate license copies to proceed."
                : "⚠️ Please select at least one library to configure course and batch access."}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
