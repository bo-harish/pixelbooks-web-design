import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  AlertCircle,
  Check,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { usePublisherType } from "@/hooks/use-publisher-type";
import { Switch } from "@/components/ui/switch";
import {
  getPromoById,
  getPromos,
  savePromos,
  deletePromoById,
  type PromoStatus,
  type Activation,
} from "@/lib/promo-codes-data";

export const Route = createFileRoute("/publisher/promo-codes/$promoId")({
  head: ({ params }) => ({
    meta: [
      { title: "Promo Code Details — PixelBooks" },
      {
        name: "description",
        content: "View and edit discount promo code parameters.",
      },
    ],
  }),
  component: EditPromoCodePage,
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
  const { className = "", disabled, ...rest } = props;
  return (
    <input
      {...rest}
      disabled={disabled}
      className={`h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-75 ${className}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", disabled, ...rest } = props;
  return (
    <textarea
      {...rest}
      disabled={disabled}
      className={`w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-75 ${className}`}
    />
  );
}

function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode },
) {
  const { className = "", disabled, children, ...rest } = props;
  return (
    <div className="relative">
      <select
        {...rest}
        disabled={disabled}
        className={`h-14 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-9 text-sm outline-none transition-colors focus:border-[var(--brand)] disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-75 ${className}`}
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
  disabled,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <Field label={label} required={required}>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="h-14 w-full rounded-xl border border-border bg-card px-4 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] cursor-pointer disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-75"
        />
      </div>
    </Field>
  );
}

function StatusPill({ status }: { status: PromoStatus }) {
  const map = {
    "Pending for Admin Approval": { color: "var(--warning)", Icon: Clock },
    Approved: { color: "var(--success)", Icon: CheckCircle2 },
    Rejected: { color: "var(--danger)", Icon: XCircle },
    Disabled: { color: "var(--muted-foreground)", Icon: Ban },
    Expired: { color: "var(--muted-foreground)", Icon: AlertCircle },
  } as const;
  const { color, Icon } = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)`,
        color,
      }}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

function ActivationToggle({
  activation,
  active,
  onToggle,
}: {
  activation: Activation;
  active: boolean;
  onToggle: () => void;
}) {
  // Blank when the promo isn't in an approved/available state
  if (activation !== "Available") return null;
  return (
    <Switch
      checked={active}
      onCheckedChange={onToggle}
      aria-label={active ? "Disable promo code" : "Enable promo code"}
    />
  );
}

const MOCK_EBOOKS = [
  "All eBooks in Storefront",
  "Harry Potter and the Philosopher's Stone",
  "A Promised Land",
  "The Great Gatsby",
  "To Kill a Mockingbird",
  "1984",
  "Monsoon Reads Collection",
  "Kids Collection & Illustrated Tales",
];

function generatePromoCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function EditPromoCodePage() {
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
  const { promoId } = Route.useParams();
  const existingPromo = getPromoById(promoId);

  const [ebook, setEbook] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [percentage, setPercentage] = useState("");
  const [minimumAmount, setMinimumAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (existingPromo) {
      setEbook(existingPromo.ebook || "");
      setPromoCode(existingPromo.code || "");
      setPercentage(existingPromo.discount ? existingPromo.discount.toString() : "");
      setMinimumAmount(existingPromo.minimumAmount ? existingPromo.minimumAmount.toString() : "");
      setStartDate(existingPromo.startDateISO || "");
      setEndDate(existingPromo.endDateISO || "");
      setDescription(existingPromo.description || "");
      setActive(existingPromo.active);
    }
  }, [existingPromo]);

  if (!existingPromo) {
    return (
      <AppShell title="Promo Code Details">
        <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
          <p className="text-sm text-muted-foreground">Promo code not found.</p>
          <Link
            to="/publisher/promo-codes/"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--brand)" }}
          >
            ← Back to Promo Codes
          </Link>
        </div>
      </AppShell>
    );
  }

  const isReadOnly = existingPromo.status === "Expired" || existingPromo.status === "Rejected";

  const toggleActive = () => {
    const allPromos = getPromos();
    const updatedPromos = allPromos.map((p) => (p.id === promoId ? { ...p, active: !p.active } : p));
    savePromos(updatedPromos);
    setActive((v) => !v);
  };

  const handleSave = () => {
    if (isReadOnly) return;
    const allPromos = getPromos();
    const updatedPromos = allPromos.map((p) => {
      if (p.id === promoId) {
        return {
          ...p,
          code: promoCode.trim() || p.code,
          ebook: ebook || p.ebook,
          discount: Number(percentage) || p.discount,
          minimumAmount: Number(minimumAmount) || p.minimumAmount,
          startDateISO: startDate || p.startDateISO,
          endDateISO: endDate || p.endDateISO,
          description: description || p.description,
        };
      }
      return p;
    });

    savePromos(updatedPromos);
    setIsSaved(true);
    setTimeout(() => {
      navigate({ to: "/publisher/promo-codes/" });
    }, 800);
  };

  const handleDelete = () => {
    if (isReadOnly) return;
    deletePromoById(promoId);
    navigate({ to: "/publisher/promo-codes/" });
  };

  return (
    <AppShell
      title="Promo Code Details"
      subtitle={
        isReadOnly
          ? `Read-only mode (${existingPromo.status})`
          : "Editable mode for existing promo code"
      }
    >
      <div className="mx-auto max-w-4xl p-4 pb-8 md:p-8">
        {/* Back to Promo Codes link + status badges */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
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

          <div className="flex items-center gap-2">
            <StatusPill status={existingPromo.status} />
            <ActivationToggle
              activation={existingPromo.activation}
              active={active}
              onToggle={toggleActive}
            />
          </div>
        </div>

        <div className="space-y-6">
          <SectionCard>
            {/* Banner for Expired / Rejected status */}
            {isReadOnly && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-300">
                <AlertCircle size={18} className="shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-xs font-medium leading-relaxed">
                  This promo code status is <strong>{existingPromo.status}</strong>. Edit, delete, and cancellation options are disabled for {existingPromo.status.toLowerCase()} promo codes.
                </p>
              </div>
            )}

            <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
              <Field label="Choose eBook" required>
                <SelectInput
                  value={ebook}
                  onChange={(e) => setEbook(e.target.value)}
                  disabled={isReadOnly}
                >
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
                      disabled={isReadOnly}
                      className="font-mono uppercase tracking-wider"
                    />
                  </div>
                  {!isReadOnly && (
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
                  )}
                </div>
              </Field>

              <Field label="Percentage %" required>
                <TextInput
                  type="number"
                  min={1}
                  max={100}
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Enter Percentage"
                />
              </Field>

              <Field label="Minimum Amount" required>
                <TextInput
                  type="number"
                  min={0}
                  value={minimumAmount}
                  onChange={(e) => setMinimumAmount(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Enter Minimum Amount"
                />
              </Field>

              <DatePickerField
                label="From Date"
                required
                value={startDate}
                onChange={setStartDate}
                disabled={isReadOnly}
                placeholder="Choose Date"
              />

              <DatePickerField
                label="To Date"
                required
                value={endDate}
                onChange={setEndDate}
                disabled={isReadOnly}
                placeholder="Choose Date"
              />
            </div>

            <div className="mt-5">
              <Field label="Promo Code Description" required>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Enter Description"
                  rows={5}
                />
              </Field>
            </div>

            {/* Action Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-2">
              {/* Left side: Red Delete Promo Code button with border on hover */}
              <div>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex h-12 items-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  >
                    <Trash2 size={15} />
                    Delete Promo Code
                  </button>
                )}
              </div>

              {/* Right side: Cancel & Save Changes (or Back to Promo Codes if read-only) */}
              <div className="flex items-center gap-3">
                {isReadOnly ? (
                  <Link
                    to="/publisher/promo-codes/"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-normal text-foreground transition-colors hover:bg-secondary"
                  >
                    Back to Promo Codes
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/publisher/promo-codes/"
                      className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                    >
                      Cancel
                    </Link>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaved}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-sm transition-all hover:opacity-90 cursor-pointer"
                      style={{
                        backgroundColor: "var(--brand)",
                        color: "var(--brand-contrast)",
                      }}
                    >
                      {isSaved ? (
                        <>
                          <Check size={16} /> Saved!
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
              <h3 className="text-lg font-bold text-foreground">Delete Promo Code?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Are you sure you want to delete promo code <strong className="text-foreground">{existingPromo.code}</strong>? This action cannot be undone.
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                >
                  <Trash2 size={15} /> Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
