import { useState } from "react";
import { BookOpen, HardDrive, Info, Tag, CheckCircle2, ChevronUp, ChevronDown } from "lucide-react";

export function InstructionsAndGuidelinesSection() {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card p-5 sm:p-6 shadow-xs transition-all">
      {/* Header Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/40 shrink-0 shadow-2xs">
            <BookOpen size={16} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
              Instructions &amp; Guidelines
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review publication specifications, file limits, and formatting rules.
            </p>
          </div>
        </div>
        <div className="text-slate-500 dark:text-muted-foreground group-hover:text-foreground transition-colors">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Accordion Content */}
      {open && (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">
          {/* Card 1: Size Limit */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 shadow-2xs">
              <HardDrive size={18} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">Size Limit</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Keep file sizes under 30 MB to ensure smooth downloading.
              </p>
            </div>
          </div>

          {/* Card 2: Metadata */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 shadow-2xs">
              <Info size={18} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">Metadata</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Provide essential book details such as title, author, genre, and additional information.
              </p>
            </div>
          </div>

          {/* Card 3: Pricing */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 shadow-2xs">
              <Tag size={18} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">Pricing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose between free or paid options, set competitive prices, and specify tax rates.
              </p>
            </div>
          </div>

          {/* Card 4: Review and Publish */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 shadow-2xs">
              <CheckCircle2 size={18} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">Review and Publish</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Take a final look and ensure everything is in order before hitting &quot;Submit eBook for Review.&quot;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
