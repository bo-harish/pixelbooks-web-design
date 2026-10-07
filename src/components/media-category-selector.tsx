import React, { useState, useMemo } from "react";
import { Tag, Plus, Pencil, Trash2, X, Search, Check as CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { MEDIA_CATEGORY_DATA } from "@/lib/media-library-data";

interface CategoryDialogProps {
  initial: Record<string, string[]>;
  onClose: () => void;
  onSave: (next: Record<string, string[]>) => void;
}

export function CategoryDialog({ initial, onClose, onSave }: CategoryDialogProps) {
  const mains = Object.keys(MEDIA_CATEGORY_DATA);
  const [selected, setSelected] = useState<Record<string, string[]>>(initial);
  const [active, setActive] = useState<string>(Object.keys(initial)[0] ?? mains[0]);
  const [mainCategorySearch, setMainCategorySearch] = useState("");

  const toggleMain = (name: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (name in next) {
        delete next[name];
      } else {
        next[name] = [];
      }
      return next;
    });
    setActive(name);
  };

  const toggleSub = (main: string, sub: string) => {
    setSelected((prev) => {
      const current = prev[main] ?? [];
      const has = current.includes(sub);
      return {
        ...prev,
        [main]: has ? current.filter((s) => s !== sub) : [...current, sub],
      };
    });
  };

  const activeSubs = MEDIA_CATEGORY_DATA[active] ?? [];
  const activeSelected = selected[active] ?? [];
  const isMainSelected = (name: string) => name in selected;

  const filteredMains = useMemo(() => {
    const q = mainCategorySearch.trim().toLowerCase();
    if (!q) return mains;
    return mains.filter((name) => name.toLowerCase().includes(q));
  }, [mains, mainCategorySearch]);

  const totalSelectedMains = Object.keys(selected).length;
  const totalSelectedSubs = Object.values(selected).reduce((acc, subs) => acc + subs.length, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex h-[85vh] max-h-[720px] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4.5 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/12 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
              <Tag size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">Select Categories</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose master categories and specific subcategories to classify this media.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3-Column Body */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[minmax(260px,1fr)_minmax(300px,1.4fr)_minmax(280px,1fr)]">
          {/* Column 1: Main Categories */}
          <div className="flex flex-col overflow-hidden border-r border-border">
            <div className="space-y-2 border-b border-border bg-secondary/30 px-5 py-3">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Main Category
              </div>
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={mainCategorySearch}
                  onChange={(e) => setMainCategorySearch(e.target.value)}
                  placeholder="Search category..."
                  className="h-9 w-full rounded-md border border-border bg-white pl-8 pr-2.5 text-xs text-foreground outline-none focus:border-[var(--brand)] transition-colors shadow-2xs"
                />
              </div>
            </div>
            <ul className="flex-1 overflow-y-auto divide-y divide-border/50">
              {filteredMains.length === 0 && (
                <li className="px-5 py-6 text-xs text-muted-foreground text-center">
                  No main categories found.
                </li>
              )}
              {filteredMains.map((name) => {
                const checked = isMainSelected(name);
                const isActive = active === name;
                const count = (selected[name] ?? []).length;
                return (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => setActive(name)}
                      className={`flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-colors cursor-pointer ${
                        isActive ? "bg-secondary/70 font-semibold" : "hover:bg-secondary/40"
                      }`}
                    >
                      <span
                        role="checkbox"
                        aria-checked={checked}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMain(name);
                        }}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors cursor-pointer ${
                          checked ? "border-transparent" : "border-border bg-background"
                        }`}
                        style={
                          checked
                            ? {
                                backgroundColor: "var(--brand)",
                                color: "var(--brand-contrast, #ffffff)",
                              }
                            : undefined
                        }
                      >
                        {checked && <CheckIcon size={12} strokeWidth={3} />}
                      </span>
                      <span
                        className={`flex-1 truncate ${checked ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                      >
                        {name}
                      </span>
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-2 text-[11px] font-semibold text-muted-foreground">
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 2: Subcategories */}
          <div className="flex flex-col overflow-hidden border-r border-border bg-secondary/10">
            <div className="flex h-12 items-center justify-between border-b border-border bg-secondary/30 px-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>
                {active} ({activeSubs.length} Subcategories)
              </span>
              {isMainSelected(active) && activeSubs.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const allSubs = activeSubs;
                    const isAllSelected = allSubs.every((s) => activeSelected.includes(s));
                    setSelected((prev) => ({
                      ...prev,
                      [active]: isAllSelected ? [] : [...allSubs],
                    }));
                  }}
                  className="text-xs font-semibold text-[var(--brand)] hover:underline cursor-pointer normal-case"
                >
                  {activeSubs.every((s) => activeSelected.includes(s))
                    ? "Deselect All"
                    : "Select All"}
                </button>
              )}
            </div>
            <ul className="flex-1 overflow-y-auto divide-y divide-border/50">
              {activeSubs.length === 0 && (
                <li className="px-5 py-8 text-sm text-muted-foreground text-center italic">
                  No subcategories available for this category.
                </li>
              )}
              {activeSubs.map((sub) => {
                const checked = activeSelected.includes(sub);
                const enabled = isMainSelected(active);
                return (
                  <li key={sub}>
                    <button
                      type="button"
                      disabled={!enabled}
                      onClick={() => toggleSub(active, sub)}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-colors hover:bg-secondary/40 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                          checked ? "border-transparent" : "border-border bg-background"
                        }`}
                        style={
                          checked
                            ? {
                                backgroundColor: "var(--brand)",
                                color: "var(--brand-contrast, #ffffff)",
                              }
                            : undefined
                        }
                      >
                        {checked && <CheckIcon size={12} strokeWidth={3} />}
                      </span>
                      <span
                        className={`flex-1 ${checked ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                      >
                        {sub}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Selected Summary */}
          <div className="flex flex-col overflow-hidden bg-card">
            <div className="flex h-12 items-center justify-between border-b border-border bg-secondary/30 px-5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Selected Summary ({totalSelectedMains})
              </span>
              {totalSelectedMains > 0 && (
                <button
                  type="button"
                  onClick={() => setSelected({})}
                  className="rounded-full border border-rose-500/30 px-2.5 py-0.5 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-500/10 cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {totalSelectedMains === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <Tag size={28} className="text-muted-foreground/40 mb-2" />
                  <p className="text-xs font-semibold text-muted-foreground">
                    No categories selected.
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1 max-w-[180px]">
                    Select a category from the left column to get started.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {Object.entries(selected).map(([name, subs]) => (
                    <li
                      key={name}
                      className="rounded-lg border border-border/80 bg-secondary/20 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                          <Tag size={13} className="text-purple-500" />
                          <span>{name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleMain(name)}
                          className="text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                          title="Remove category"
                        >
                          <X size={13} />
                        </button>
                      </div>
                      {subs.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1 pl-4">
                          {subs.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                            >
                              <span>{s}</span>
                              <button
                                type="button"
                                onClick={() => toggleSub(name, s)}
                                className="hover:text-foreground"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-muted-foreground italic mt-1 pl-4">
                          No subcategories selected
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-secondary/20">
          <span className="text-xs text-muted-foreground">
            Total Selected:{" "}
            <strong className="text-foreground">{totalSelectedMains} Categories</strong> •{" "}
            <strong className="text-foreground">{totalSelectedSubs} Subcategories</strong>
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(selected)}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--brand)] px-6 text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
            >
              Apply Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoriesSectionCardProps {
  selected: Record<string, string[]>;
  onChange: (next: Record<string, string[]>) => void;
  mediaTypeLabel?: string;
}

export function CategoriesSectionCard({
  selected,
  onChange,
  mediaTypeLabel = "item",
}: CategoriesSectionCardProps) {
  const [open, setOpen] = useState(false);

  const groups = Object.entries(selected).map(([name, subs]) => ({ name, subs }));
  const totalSubs = groups.reduce((acc, g) => acc + g.subs.length, 0);

  const handleRemoveCategory = (catName: string) => {
    const next = { ...selected };
    delete next[catName];
    onChange(next);
    toast.success(`Removed category "${catName}"`);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card p-5 sm:p-6 space-y-3.5 shadow-xs">
      {/* Header: Icon + Title/Subtitle + Select Categories Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40 shrink-0 shadow-2xs">
            <Tag size={16} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">Select Categories</h2>
            <p className="text-xs text-muted-foreground">
              Select one or more categories and subcategories to classify this {mediaTypeLabel} in
              the catalogue.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-8.5 items-center gap-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white px-3.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Pencil size={12} strokeWidth={2.5} />
          <span>Select Categories</span>
        </button>
      </div>

      {/* Subheader: Selected Categories & Subcategories Count Bar */}
      <div className="flex items-center justify-between text-[11px] pt-0.5">
        <span className="font-bold uppercase tracking-wider text-muted-foreground">
          SELECTED CATEGORIES &amp; SUBCATEGORIES
        </span>
        <span className="text-muted-foreground">
          Total:{" "}
          <strong className="text-foreground font-semibold">
            {groups.length} categories
          </strong>{" "}
          &bull;{" "}
          <strong className="text-foreground font-semibold">
            {totalSubs} subcategories
          </strong>
        </span>
      </div>

      {/* Categories List - Compact Rows */}
      <div className="space-y-2">
        {groups.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-border p-6 text-center text-xs text-muted-foreground">
            No categories selected yet. Click &quot;Select Categories&quot; above to classify this{" "}
            {mediaTypeLabel}.
          </div>
        ) : (
          groups.map((g) => (
            <div
              key={g.name}
              className="rounded-xl border border-slate-200/90 dark:border-border bg-slate-50/40 dark:bg-secondary/20 px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs hover:border-slate-300 dark:hover:border-border transition-all"
            >
              {/* Left: Icon + Category Name + Subcategory pills */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40 shrink-0 shadow-2xs">
                  <Tag size={12} />
                </div>
                <div className="min-w-0 flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-bold text-foreground shrink-0">{g.name}</h4>
                  {g.subs.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1">
                      {g.subs.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md bg-white dark:bg-secondary px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-foreground border border-slate-200/80 dark:border-border shadow-2xs"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] italic text-muted-foreground">
                      No subcategories
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Pill count + Edit + Delete */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                {g.subs.length > 0 && (
                  <span className="rounded-full bg-slate-200/70 dark:bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-muted-foreground">
                    {g.subs.length} subcategories
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex h-7.5 items-center gap-1 rounded-lg border border-slate-200 dark:border-border bg-white dark:bg-card px-2.5 text-[11px] font-semibold text-slate-700 dark:text-foreground hover:bg-slate-50 dark:hover:bg-secondary/60 transition-colors cursor-pointer shadow-2xs"
                >
                  <Pencil size={11} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(g.name)}
                  className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-200 dark:border-border bg-white dark:bg-card text-slate-400 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-900 transition-colors cursor-pointer shadow-2xs"
                  title="Remove category"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {open && (
        <CategoryDialog
          initial={selected}
          onClose={() => setOpen(false)}
          onSave={(next) => {
            onChange(next);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
