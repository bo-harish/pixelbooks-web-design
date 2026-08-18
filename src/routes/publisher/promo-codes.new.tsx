import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { usePublisherType } from "@/hooks/use-publisher-type";
import { ArrowLeft, ChevronDown, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getPromos, savePromos, type Promo } from "@/lib/promo-codes-data";

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
      className={`h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] ${className}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] ${className}`}
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
        className={`h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)] ${className}`}
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

function DatePickerField({
  label,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label} required={required}>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-14 w-full rounded-xl border border-border bg-card px-4 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
        />
      </div>
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
  const [dateRange, setDateRange] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    const code = promoCode.trim() || generatePromoCode();
    const newPromo: Promo = {
      id: Date.now().toString(),
      code,
      title: ebook ? ebook.split(" ")[0] + " Offer" : "Special Offer",
      ebook: ebook || "All eBooks in Storefront",
      discount: Number(percentage) || 15,
      minimumAmount: Number(minimumAmount) || 100,
      start: dateRange ? new Date(dateRange).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : "Jul 28",
      end: dateRange ? new Date(dateRange).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Dec 31, 2026",
      startDateISO: dateRange || "2026-07-28",
      endDateISO: dateRange || "2026-12-31",
      status: "Pending for Admin Approval",
      activation: "Not available",
      active: false,
      description: description || "Newly created promo code for storefront eBooks.",
      usageCount: 0,
      maxUsageLimit: 500,
      createdAt: "Jul 28, 2026",
    };

    const existing = getPromos();
    savePromos([newPromo, ...existing]);
    navigate({ to: "/publisher/promo-codes/" });
  };

  return (
    <AppShell
      title="Create New Promo Code"
      subtitle="Configure discount parameters for your eBook storefront."
    >
      <div className="mx-auto max-w-4xl p-4 pb-8 md:p-8">
        {/* Back to Promo Codes link */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/publisher/promo-codes/"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Back to Promo Codes"
          >
            <ArrowLeft size={16} />
          </Link>
          <Link
            to="/publisher/promo-codes/"
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
                    className="flex h-14 items-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer shrink-0"
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

              <DatePickerField
                label="Date Range"
                required
                value={dateRange}
                onChange={setDateRange}
                placeholder="Choose Date"
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
                to="/publisher/promo-codes/"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={handleCreate}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
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
