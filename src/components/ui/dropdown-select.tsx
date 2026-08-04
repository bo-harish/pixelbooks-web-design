import { useState, useMemo, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";

export function DropdownSelect<T extends string>({
  value,
  options,
  onChange,
  className = "min-w-[170px]",
  searchable = false,
  searchPlaceholder = "Search...",
  align = "right",
}: {
  value: T;
  options: readonly T[] | T[];
  onChange: (v: T) => void;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return options;
    const q = searchTerm.toLowerCase().trim();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, searchable, searchTerm]);

  const alignmentClass = align === "left" ? "left-0" : "right-0";
  const isFullWidth = className.includes("w-full");

  return (
    <div className={`relative ${isFullWidth ? "w-full" : "inline-block"}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setSearchTerm("");
        }}
        className={`flex h-11 w-full items-center justify-between gap-2.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] cursor-pointer shadow-2xs ${className}`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div
          className={`absolute ${alignmentClass} top-full z-30 mt-2 max-h-64 min-w-40 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg flex flex-col`}
          onMouseLeave={() => setOpen(false)}
        >
          {searchable && (
            <div className="p-2 border-b border-border bg-card sticky top-0 z-10">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-2.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  autoFocus
                  className="w-full h-8 pl-8 pr-2 text-xs rounded-md border border-border bg-secondary/50 outline-none focus:border-[var(--brand)] text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto max-h-48 py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2.5 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer ${
                    opt === value
                      ? "font-medium text-foreground bg-secondary/50"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span className="truncate">{opt}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
