import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { usePublisherType } from "@/hooks/use-publisher-type";
import {
  ArrowLeft,
  ChevronDown,
  Sparkles,
  CalendarDays,
  X,
  ArrowRight,
  RotateCcw,
  Check,
  Calendar as CalendarIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getPromos, savePromos, type Promo } from "@/lib/promo-codes-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  addMonths,
  differenceInCalendarDays,
} from "date-fns";

export const Route = createFileRoute("/publisher/promo-codes/new")({
  head: () => ({
    meta: [
      { title: "Create New Promo Code — PixelBooks" },
      {
        name: "description",
        content: "Create a new discount promo code for your eBook storefront.",
      },
    ],
  }),
  component: CreatePromoCodePage,
});

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-7">{children}</section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`h-14 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] ${className}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] ${className}`}
    />
  );
}

function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode },
) {
  const { className = "", children, ...rest } = props;
  return (
    <div className="relative">
      <select
        {...rest}
        className={`h-14 w-full appearance-none rounded-lg border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)] ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

interface DateRangePickerFieldProps {
  label: string;
  required?: boolean;
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

function DateRangePickerField({
  label,
  required,
  value,
  onChange,
}: DateRangePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange | undefined>(value);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    value?.from || new Date("2026-07-01")
  );

  // Sync temp state whenever popover opens or prop updates
  useEffect(() => {
    setTempRange(value);
    if (value?.from) {
      setCurrentMonth(value.from);
    }
  }, [value, isOpen]);

  const daysCount =
    tempRange?.from && tempRange?.to
      ? differenceInCalendarDays(tempRange.to, tempRange.from) + 1
      : null;

  const handleApply = () => {
    onChange(tempRange);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempRange(undefined);
  };

  const setPreset = (from: Date, to: Date) => {
    setTempRange({ from, to });
    setCurrentMonth(from);
  };

  const now = new Date("2026-07-28"); // Base reference aligned with mock dataset

  const presets = useMemo(
    () => [
      {
        label: "Next 7 Days",
        getRange: () => ({ from: now, to: addDays(now, 6) }),
      },
      {
        label: "Next 14 Days",
        getRange: () => ({ from: now, to: addDays(now, 13) }),
      },
      {
        label: "Next 30 Days",
        getRange: () => ({ from: now, to: addDays(now, 29) }),
      },
      {
        label: "Next 90 Days",
        getRange: () => ({ from: now, to: addDays(now, 89) }),
      },
      {
        label: "This Month",
        getRange: () => ({ from: startOfMonth(now), to: endOfMonth(now) }),
      },
      {
        label: "Next Month",
        getRange: () => {
          const nextM = addMonths(now, 1);
          return { from: startOfMonth(nextM), to: endOfMonth(nextM) };
        },
      },
      {
        label: "End of Year (Dec 31)",
        getRange: () => ({ from: now, to: new Date(2026, 11, 31) }),
      },
    ],
    []
  );

  const selectedPresetIndex = useMemo(() => {
    if (!tempRange?.from || !tempRange?.to) return "";
    const fromStr = format(tempRange.from, "yyyy-MM-dd");
    const toStr = format(tempRange.to, "yyyy-MM-dd");
    const idx = presets.findIndex((p) => {
      const r = p.getRange();
      return (
        format(r.from, "yyyy-MM-dd") === fromStr &&
        format(r.to, "yyyy-MM-dd") === toStr
      );
    });
    return idx !== -1 ? String(idx) : "custom";
  }, [tempRange, presets]);

  return (
    <Field label={label} required={required}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="group flex h-14 w-full items-center justify-between rounded-lg border border-border bg-card px-4 text-sm text-foreground outline-none transition-all hover:border-[var(--brand)]/60 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
                <CalendarDays size={18} />
              </div>
              <div className="text-left min-w-0 flex-1 truncate">
                {value?.from ? (
                  <div className="flex items-center gap-1.5 font-medium text-xs sm:text-sm truncate">
                    <span className="text-foreground font-semibold truncate">
                      {format(value.from, "MMM dd, yyyy")}
                    </span>
                    <span className="text-muted-foreground text-xs px-0.5 shrink-0">to</span>
                    {value.to ? (
                      <span className="text-foreground font-semibold truncate">
                        {format(value.to, "MMM dd, yyyy")}
                      </span>
                    ) : (
                      <span className="text-amber-500 font-normal text-xs italic shrink-0">
                        (Select end date)
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground font-normal text-sm">
                    Choose start and end date range
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {value?.from && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(undefined);
                  }}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
                  aria-label="Clear date range"
                >
                  <X size={15} />
                </button>
              )}
              <ChevronDown
                size={16}
                className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-[var(--brand)]" : ""}`}
              />
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={8}
          avoidCollisions={false}
          className="w-[calc(100vw-2rem)] sm:w-[380px] p-0 bg-card border border-border shadow-2xl rounded-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95"
        >
          {/* Top Header & Range Info */}
          <div className="border-b border-border bg-muted/30 p-3 space-y-2.5">
            {/* Header: Title + Quick Presets Dropdown */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <CalendarIcon size={14} className="text-[var(--brand)] shrink-0" />
                <span className="text-xs font-bold text-foreground truncate">
                  Validity Period
                </span>
              </div>

              {/* Quick Presets Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={selectedPresetIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (!isNaN(idx) && presets[idx]) {
                      const range = presets[idx].getRange();
                      setPreset(range.from, range.to);
                    }
                  }}
                  className="h-7 appearance-none rounded-lg border border-border bg-card pl-2.5 pr-6 text-[11px] font-medium text-foreground outline-none transition-colors hover:border-[var(--brand)]/60 focus:border-[var(--brand)] cursor-pointer"
                >
                  <option value="" disabled>
                    ⚡ Quick Presets
                  </option>
                  {selectedPresetIndex === "custom" && (
                    <option value="custom" disabled>
                      Custom Range
                    </option>
                  )}
                  {presets.map((preset, idx) => (
                    <option key={preset.label} value={String(idx)}>
                      {preset.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            {/* Clean From & To Segment */}
            <div className="flex items-center justify-between rounded-lg bg-card border border-border/80 p-2.5 shadow-2xs">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  From
                </span>
                <span className="text-xs font-semibold text-foreground truncate block mt-0.5">
                  {tempRange?.from ? format(tempRange.from, "MMM dd, yyyy") : "Start date"}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center px-3">
                {daysCount !== null ? (
                  <span className="rounded-full bg-[var(--brand)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--brand)] border border-[var(--brand)]/20 whitespace-nowrap">
                    {daysCount} {daysCount === 1 ? "day" : "days"}
                  </span>
                ) : (
                  <ArrowRight size={13} className="text-muted-foreground shrink-0" />
                )}
              </div>

              <div className="flex-1 min-w-0 text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  To
                </span>
                <span className="text-xs font-semibold text-foreground truncate block mt-0.5">
                  {tempRange?.to ? format(tempRange.to, "MMM dd, yyyy") : "End date"}
                </span>
              </div>
            </div>
          </div>

          {/* Compact Calendar View */}
          <div className="p-2 sm:p-3 flex justify-center">
            <Calendar
              mode="range"
              fixedWeeks
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              selected={tempRange}
              onSelect={setTempRange}
              numberOfMonths={1}
              className="rounded-lg border-0 p-0 [--cell-size:1.85rem]"
            />
          </div>

          {/* Compact Footer with summary and action buttons */}
          <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/20 px-3 py-2.5">
            <div className="text-[11px] text-muted-foreground truncate">
              {tempRange?.from ? (
                tempRange.to ? (
                  <span className="text-foreground font-medium truncate">
                    {format(tempRange.from, "MMM d")} – {format(tempRange.to, "MMM d, yyyy")}
                  </span>
                ) : (
                  <span className="text-amber-500 font-medium">Pick end date</span>
                )
              ) : (
                <span>No range</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-secondary text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!tempRange?.from}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-2xs transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--brand)",
                  color: "var(--brand-contrast)",
                }}
              >
                <Check size={13} strokeWidth={2.5} />
                Apply
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}

const MOCK_EBOOKS = [
  "All eBooks in Storefront",
  "Harry Potter and the Philosopher's Stone",
  "A Promised Land",
  "The Great Gatsby",
  "To Kill a Mockingbird",
  "1984",
];

function generatePromoCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function CreatePromoCodePage() {
  const navigate = useNavigate();
  const [publisherType] = usePublisherType();

  useEffect(() => {
    if (publisherType === "Library-Only Publisher") {
      navigate({ to: "/publisher/catalogue", replace: true });
    }
  }, [publisherType, navigate]);

  if (publisherType === "Library-Only Publisher") {
    return null;
  }
  const [ebook, setEbook] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [percentage, setPercentage] = useState("");
  const [minimumAmount, setMinimumAmount] = useState("1");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date("2026-07-28"),
    to: addDays(new Date("2026-07-28"), 6),
  });
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    const code = promoCode.trim() || generatePromoCode();

    const fromDate = dateRange?.from || new Date("2026-07-28");
    const toDate = dateRange?.to || fromDate;

    const startDateISO = format(fromDate, "yyyy-MM-dd");
    const endDateISO = format(toDate, "yyyy-MM-dd");
    const start = format(fromDate, "MMM dd, yyyy");
    const end = format(toDate, "MMM dd, yyyy");

    const newPromo: Promo = {
      id: Date.now().toString(),
      code,
      title: ebook ? ebook.split(" ")[0] + " Offer" : "Special Offer",
      ebook: ebook || "All eBooks in Storefront",
      discount: Number(percentage) || 15,
      minimumAmount: Number(minimumAmount) || 100,
      start,
      end,
      startDateISO,
      endDateISO,
      status: "Pending for Admin Approval",
      activation: "Not available",
      active: false,
      description: description || "Newly created promo code for storefront eBooks.",
      usageCount: 0,
      maxUsageLimit: 500,
      createdAt: format(new Date(), "MMM dd, yyyy"),
    };

    const existing = getPromos();
    savePromos([newPromo, ...existing]);
    navigate({ to: "/publisher/promo-codes" });
  };

  return (
    <AppShell
      title="Create New Promo Code"
      subtitle="Configure discount parameters for your eBook storefront."
    >
      <div className="mx-auto max-w-4xl p-4 pb-80 md:p-8 md:pb-96 min-h-[1050px]">
        {/* Back to Promo Codes link */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/publisher/promo-codes"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Back to Promo Codes"
          >
            <ArrowLeft size={16} />
          </Link>
          <Link
            to="/publisher/promo-codes"
            className="text-sm font-normal text-foreground hover:text-[var(--brand)] transition-colors"
          >
            Back to Promo Codes
          </Link>
        </div>

        <div className="space-y-6">
          <SectionCard>
            <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
              <Field label="Choose eBook" required>
                <SelectInput value={ebook} onChange={(e) => setEbook(e.target.value)}>
                  <option value="" disabled>
                    Choose eBook
                  </option>
                  {MOCK_EBOOKS.map((book) => (
                    <option key={book} value={book}>
                      {book}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Promo Code" required>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <TextInput
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="PROMO CODE"
                      className="font-mono uppercase tracking-wider"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPromoCode(generatePromoCode())}
                    className="flex h-14 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer shrink-0"
                    style={{
                      backgroundColor: "var(--brand)",
                      color: "var(--brand-contrast)",
                    }}
                  >
                    <Sparkles size={15} />
                    Generate Code
                  </button>
                </div>
              </Field>

              <Field label="Percentage %" required>
                <TextInput
                  type="number"
                  min={1}
                  max={100}
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="Enter Percentage"
                />
              </Field>

              <Field label="Minimum Amount" required>
                <TextInput
                  type="number"
                  min={0}
                  value={minimumAmount}
                  onChange={(e) => setMinimumAmount(e.target.value)}
                  placeholder="Enter Minimum Amount"
                />
              </Field>

              <DateRangePickerField
                label="Date Range"
                required
                value={dateRange}
                onChange={setDateRange}
              />
            </div>

            <div className="mt-5">
              <Field label="Promo Code Description" required>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                  rows={5}
                />
              </Field>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-6">
              <Link
                to="/publisher/promo-codes"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={handleCreate}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                style={{
                  backgroundColor: "var(--brand)",
                  color: "var(--brand-contrast)",
                }}
              >
                Create Promo Code
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}

