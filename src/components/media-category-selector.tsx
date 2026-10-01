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
    <div className="rounded-xl border border-border bg-card p-5 md:p-6 space-y-5 shadow-2xs hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/12 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 shadow-2xs">
            <Tag size={22} />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-foreground leading-tight">
              Select Categories
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Select one or more categories and subcategories to classify this {mediaTypeLabel} in
              the catalogue.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-xs font-semibold text-white hover:bg-[var(--brand)]/90 transition-colors shadow-2xs cursor-pointer"
          >
            {groups.length > 0 ? <Pencil size={14} /> : <Plus size={15} />}
            <span>{groups.length > 0 ? "Edit Categories" : "Select Categories"}</span>
          </button>
        </div>
      </div>

      {/* Selected Categories Breakdown Table */}
      {groups.length > 0 ? (
        <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Selected Categories & Subcategories</span>
            </h3>
            <span className="text-xs font-semibold text-muted-foreground">
              Total:{" "}
              <strong className="text-foreground font-extrabold">
                {groups.length} categories • {totalSubs} subcategories
              </strong>
            </span>
          </div>

          <div className="divide-y divide-border/40">
            {groups.map((g) => (
              <div
                key={g.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-purple-600 dark:text-purple-400">
                    <Tag size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{g.name}</p>
                    {g.subs.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        {g.subs.map((s, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-md bg-secondary border border-border/60 px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground italic">No subcategories</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {g.subs.length} subcategories
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(g.name)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Remove category"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-9 text-center bg-secondary/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-2.5">
            <Tag size={22} />
          </div>
          <p className="text-xs font-semibold text-foreground">No categories selected</p>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3.5 max-w-sm">
            Categorizing your {mediaTypeLabel} helps libraries and students discover it easily in
            search and recommendations.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-xs font-semibold text-white hover:bg-[var(--brand)]/90 transition-colors cursor-pointer"
          >
            <Plus size={15} /> <span>Select Categories</span>
          </button>
        </div>
      )}

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
