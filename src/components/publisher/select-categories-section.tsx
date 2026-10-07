import { Tag, Pencil, Trash2 } from "lucide-react";

export interface SelectCategoriesSectionProps {
  selectedCategories: Record<string, string[]>;
  setSelectedCategories: (categories: Record<string, string[]>) => void;
  onOpenModal: () => void;
}

export function SelectCategoriesSection({
  selectedCategories,
  setSelectedCategories,
  onOpenModal,
}: SelectCategoriesSectionProps) {
  const categoryEntries = Object.entries(selectedCategories);
  const totalCategories = categoryEntries.length;
  const totalSubcategories = categoryEntries.reduce((sum, [_, subs]) => sum + subs.length, 0);

  const handleDeleteCategory = (catName: string) => {
    const updated = { ...selectedCategories };
    delete updated[catName];
    setSelectedCategories(updated);
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
              Select one or more categories and subcategories to classify this eBook in the catalogue.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenModal}
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
            {totalCategories} categories
          </strong>{" "}
          &bull;{" "}
          <strong className="text-foreground font-semibold">
            {totalSubcategories} subcategories
          </strong>
        </span>
      </div>

      {/* Categories List - Compact Rows */}
      <div className="space-y-2">
        {totalCategories === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-border p-6 text-center text-xs text-muted-foreground">
            No categories selected yet. Click &quot;Select Categories&quot; above to classify this eBook.
          </div>
        ) : (
          categoryEntries.map(([catName, subs]) => (
            <div
              key={catName}
              className="rounded-xl border border-slate-200/90 dark:border-border bg-slate-50/40 dark:bg-secondary/20 px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs hover:border-slate-300 dark:hover:border-border transition-all"
            >
              {/* Left: Icon + Category Name + Subcategory pills */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40 shrink-0 shadow-2xs">
                  <Tag size={12} />
                </div>
                <div className="min-w-0 flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-bold text-foreground shrink-0">{catName}</h4>
                  {subs.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1">
                      {subs.map((sub, sIdx) => (
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
                {subs.length > 0 && (
                  <span className="rounded-full bg-slate-200/70 dark:bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-muted-foreground">
                    {subs.length} subcategories
                  </span>
                )}
                <button
                  type="button"
                  onClick={onOpenModal}
                  className="inline-flex h-7.5 items-center gap-1 rounded-lg border border-slate-200 dark:border-border bg-white dark:bg-card px-2.5 text-[11px] font-semibold text-slate-700 dark:text-foreground hover:bg-slate-50 dark:hover:bg-secondary/60 transition-colors cursor-pointer shadow-2xs"
                >
                  <Pencil size={11} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(catName)}
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
    </div>
  );
}
