import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, Search } from "lucide-react";

export interface MultiSelectOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface MultiSelectDropdownProps {
  placeholder?: string;
  searchPlaceholder?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
  badgeVariant?: "brand" | "blue" | "amber";
}

export function MultiSelectDropdown({
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  options,
  selectedValues,
  onChange,
  className = "",
  badgeVariant = "brand",
}: MultiSelectDropdownProps) {
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

  const toggleOption = (idOrLabel: string) => {
    if (selectedValues.includes(idOrLabel)) {
      onChange(selectedValues.filter((v) => v !== idOrLabel));
    } else {
      onChange([...selectedValues, idOrLabel]);
    }
  };

  const removeOption = (idOrLabel: string) => {
    onChange(selectedValues.filter((v) => v !== idOrLabel));
  };

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const isAllSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((opt) => selectedValues.includes(opt.label));

  const handleToggleAll = () => {
    if (isAllSelected) {
      const visibleLabels = new Set(filteredOptions.map((o) => o.label));
      onChange(selectedValues.filter((v) => !visibleLabels.has(v)));
    } else {
      const current = new Set(selectedValues);
      filteredOptions.forEach((o) => current.add(o.label));
      onChange(Array.from(current));
    }
  };

  const badgeStyles = {
    brand: "bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/20",
    blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  }[badgeVariant];

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex min-h-[48px] w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 py-2 text-sm transition-colors cursor-pointer shadow-2xs ${
          isOpen
            ? "border-[var(--brand)] ring-1 ring-[var(--brand)]"
            : "border-border hover:bg-secondary/20"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {selectedValues.length === 0 ? (
            <span className="text-muted-foreground font-normal text-sm select-none">
              {placeholder}
            </span>
          ) : (
            selectedValues.map((val) => (
              <span
                key={val}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${badgeStyles}`}
              >
                <span>{val}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(val);
                  }}
                  className="rounded hover:opacity-75 p-0.5 transition-opacity cursor-pointer"
                  title="Remove"
                >
                  <X size={13} />
                </button>
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 px-1">
          {selectedValues.length > 0 && (
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
            className={`text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1.5 max-h-80 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl flex flex-col">
          <div className="p-2.5 border-b border-border bg-card sticky top-0 z-10 space-y-2">
            <div className="relative flex items-center">
              <Search
                size={15}
                className="absolute left-3 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
                className="w-full h-9 pl-9 pr-8 text-sm rounded-lg border border-border bg-secondary/40 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
              <span>{filteredOptions.length} available</span>
              {filteredOptions.length > 0 && (
                <button
                  type="button"
                  onClick={handleToggleAll}
                  className="font-medium hover:text-[var(--brand)] cursor-pointer"
                >
                  {isAllSelected ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto max-h-60 p-1.5 divide-y divide-border/30">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.label);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleOption(opt.label)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm ${
                      isSelected
                        ? "bg-[var(--brand)]/10 text-foreground font-semibold"
                        : "hover:bg-secondary/60 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <div
                        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? "bg-[var(--brand)] border-[var(--brand)] text-white"
                            : "border-border bg-white"
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-sm">{opt.label}</span>
                        {opt.sublabel && (
                          <span className="text-xs text-muted-foreground font-normal truncate mt-0.5">
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                    </div>
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
