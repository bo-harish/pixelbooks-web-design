import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Feather,
  CheckCircle2,
  Camera,
  BookOpen,
  Globe,
  Copy,
  Check,
  ExternalLink,
  Percent,
  Landmark,
  Star,
  BookMarked,
  Sparkles,
  X,
  Mail,
  Phone,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/author/profile")({
  head: () => ({
    meta: [
      { title: "Author Profile — PixelBooks" },
      {
        name: "description",
        content: "Manage your public author profile, biography, royalty share, and published title statistics.",
      },
    ],
  }),
  component: AuthorProfilePage,
});

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-7 shadow-2xs">
      <h2 className="mb-5 text-base font-semibold text-foreground flex items-center gap-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  value,
  onChange,
  rightSlot,
  placeholder,
  disabled,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange?: (v: string) => void;
  rightSlot?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center justify-between">
        <span>
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </span>
      </label>
      <div className="relative">
        <input
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className={`flex h-12 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
            disabled ? "opacity-75 bg-secondary/30 cursor-not-allowed" : ""
          } ${rightSlot ? "pr-24" : ""}`}
        />
        {rightSlot && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div>}
      </div>
    </div>
  );
}

function AuthorProfilePage() {
  const profileBaseUrl = "azdevlibcustomer.pixelbooksapp.com/author/";
  const [authorName, setAuthorName] = useState("Dr. K. Raghavan");
  const [penName, setPenName] = useState("Dr. K. Raghavan");
  const [authorSlug, setAuthorSlug] = useState("dr-k-raghavan");
  const [genres, setGenres] = useState("Academic, Education, History, Classical Music");
  const [bio, setBio] = useState(
    "Senior Educational Policy Scholar and Author specializing in curriculum restructuring, NEP 2020 frameworks, and interdisciplinary academic integration in Indian institutions.",
  );
  const [email, setEmail] = useState("dr.raghavan@pixelbooksapp.com");
  const [phone, setPhone] = useState("+91 94471 28901");
  const [website, setWebsite] = useState("https://raghavan-academic.in");
  const [verifiedEmail, setVerifiedEmail] = useState("dr.raghavan@pixelbooksapp.com");
  const [verifiedPhone, setVerifiedPhone] = useState("+91 94471 28901");
  const [copied, setCopied] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const handleCopyAuthorUrl = async () => {
    const fullUrl = `https://${profileBaseUrl}${authorSlug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleSave = () => {
    toast.success("Author profile updated successfully");
  };

  return (
    <AppShell
      title="Author Profile"
      subtitle="Manage your public author biography, storefront link, royalty share, and published catalogue statistics."
    >
      <div className="space-y-8 p-4 sm:p-6 md:p-8">
        {/* Author Header Card */}
        <SectionCard title="Author Identity & Public Profile">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 rounded-xl border border-border bg-emerald-500/5 p-5 dark:bg-emerald-500/10">
              <div className="relative h-24 w-24 shrink-0">
                <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-md">
                  <Feather size={40} />
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("Photo upload opened")}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border text-foreground shadow-sm hover:bg-secondary transition-transform hover:scale-105 cursor-pointer"
                  title="Upload Author Portrait"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-lg font-bold text-foreground">{authorName}</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Feather size={12} /> Verified Author
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  {bio}
                </p>
              </div>
            </div>

            {/* Public Author Profile URL Bar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Globe size={15} className="text-muted-foreground" />
                Public Author Page URL
                <span className="text-destructive">*</span>
              </label>

              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="flex h-12 flex-1 items-center overflow-hidden rounded-xl border border-input bg-card shadow-2xs focus-within:ring-1 focus-within:ring-ring transition-all">
                  <div className="h-full border-r border-input bg-secondary/50 px-3.5 text-xs font-medium text-muted-foreground flex items-center shrink-0">
                    https://{profileBaseUrl}
                  </div>
                  <input
                    value={authorSlug}
                    onChange={(e) => setAuthorSlug(e.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                    placeholder="author-name"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyAuthorUrl}
                    className="inline-flex h-12 items-center gap-2 px-4 rounded-xl border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-secondary shadow-2xs cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={15} className="text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={15} className="text-muted-foreground" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://${profileBaseUrl}${authorSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground shadow-2xs"
                    title="Preview Author Page"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              <Field
                label="Full Author Name"
                required
                value={authorName}
                onChange={setAuthorName}
              />
              <Field
                label="Pen Name / Credit Display"
                value={penName}
                onChange={setPenName}
              />
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-foreground">Primary Writing Genres</label>
                <input
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-foreground">Author Biography</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-4 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Published Titles & Performance */}
        <SectionCard title="Published Catalogue & Reader Statistics">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                  <BookMarked size={18} />
                </span>
                <span className="text-xs font-medium text-muted-foreground">Published Titles</span>
              </div>
              <p className="text-xl font-extrabold text-foreground tracking-tight">12 eBooks</p>
              <p className="text-[11px] text-muted-foreground mt-1">Live across Storefront & Libraries</p>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                  <BookOpen size={18} />
                </span>
                <span className="text-xs font-medium text-muted-foreground">Lifetime Copies Borrowed/Sold</span>
              </div>
              <p className="text-xl font-extrabold text-foreground tracking-tight">14,820 Copies</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">+1,240 this month</p>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <Star size={18} className="fill-amber-400" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">Average Reader Rating</span>
              </div>
              <p className="text-xl font-extrabold text-foreground tracking-tight">4.8 / 5.0</p>
              <p className="text-[11px] text-muted-foreground mt-1">Based on 320 Reader Reviews</p>
            </div>
          </div>
        </SectionCard>

        {/* Royalty Share & Bank Details */}
        <SectionCard title="Royalty Share & Payout Account">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Bank Details */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                  <Landmark size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Royalty Payout Account</h3>
                  <p className="text-xs text-muted-foreground">Primary direct deposit account</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-secondary/30 p-4 text-xs">
                <div>
                  <span className="text-muted-foreground font-medium block mb-0.5">Account Holder</span>
                  <span className="font-semibold text-foreground">Dr. K. Raghavan</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium block mb-0.5">Account Number</span>
                  <span className="font-semibold text-foreground font-mono">•••• 4812</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium block mb-0.5">IFSC Code</span>
                  <span className="font-semibold text-foreground font-mono">HDFC0001824</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium block mb-0.5">Bank Name</span>
                  <span className="font-semibold text-foreground">HDFC Bank Ltd</span>
                </div>
              </div>
            </div>

            {/* Royalty Rate */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Percent size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Author Royalty Rate</h3>
                    <p className="text-xs text-muted-foreground">Net revenue share rate</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Sparkles size={11} /> 70% Share
                </span>
              </div>

              <div className="rounded-lg border border-border/70 bg-secondary/30 p-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Author Royalty Share</span>
                  <span className="text-2xl font-extrabold text-foreground tracking-tight">70%</span>
                </div>
                <div className="w-full bg-border/60 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Contact Information */}
        <SectionCard title="Contact & Website Links">
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <Field
              label="Author Contact Email"
              required
              value={email}
              onChange={setEmail}
              rightSlot={
                email === verifiedEmail ? (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsOtpModalOpen(true)}
                    className="text-xs font-semibold text-destructive hover:underline cursor-pointer"
                  >
                    Verify Now
                  </button>
                )
              }
            />
            <Field
              label="Mobile Number"
              required
              value={phone}
              onChange={setPhone}
              rightSlot={
                phone === verifiedPhone ? (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsOtpModalOpen(true)}
                    className="text-xs font-semibold text-destructive hover:underline cursor-pointer"
                  >
                    Verify Now
                  </button>
                )
              }
            />
            <Field
              label="Personal Website / Portfolio"
              value={website}
              onChange={setWebsite}
            />
            <Field
              label="Academic Reference ID"
              disabled
              value="ORCID 0000-0002-1825-0097"
            />
          </div>
        </SectionCard>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <button
            type="button"
            onClick={() => toast.info("Changes reset")}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Update Author Profile
          </button>
        </div>
      </div>

      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={email}
        phone={phone}
        onVerifySuccess={() => {
          setVerifiedEmail(email);
          setVerifiedPhone(phone);
          setIsOtpModalOpen(false);
          toast.success("Verification successful");
        }}
      />
    </AppShell>
  );
}

function OtpModal({
  isOpen,
  onClose,
  email,
  phone,
  onVerifySuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  phone: string;
  onVerifySuccess: () => void;
}) {
  const [timer, setTimer] = useState(32);
  const [mobileOtp, setMobileOtp] = useState(["", "", "", ""]);
  const [emailOtp, setEmailOtp] = useState(["", "", "", ""]);

  const mobileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const emailRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setTimer(32);
    setMobileOtp(["", "", "", ""]);
    setEmailOtp(["", "", "", ""]);
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOtpChange = (val: string, index: number, type: "mobile" | "email") => {
    const char = val.slice(-1);
    if (type === "mobile") {
      const next = [...mobileOtp];
      next[index] = char;
      setMobileOtp(next);
      if (char && index < 3) {
        mobileRefs.current[index + 1]?.focus();
      }
    } else {
      const next = [...emailOtp];
      next[index] = char;
      setEmailOtp(next);
      if (char && index < 3) {
        emailRefs.current[index + 1]?.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-[480px] rounded-[24px] bg-white dark:bg-card p-6 sm:p-8 shadow-2xl space-y-6 text-center border border-border/40">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Enter OTP</h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Verification code sent to email <span className="font-medium text-foreground">{email}</span> and mobile{" "}
            <span className="font-medium text-foreground">{phone}</span>
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-xs font-semibold text-foreground">Mobile OTP</p>
          <div className="flex items-center justify-center gap-2">
            {mobileOtp.map((digit, idx) => (
              <input
                key={`m-${idx}`}
                ref={(el) => (mobileRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, idx, "mobile")}
                className="w-10 text-center text-lg font-bold border-b-2 border-input bg-transparent outline-none focus:border-[var(--brand)] py-1"
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-xs font-semibold text-foreground">Email OTP</p>
          <div className="flex items-center justify-center gap-2">
            {emailOtp.map((digit, idx) => (
              <input
                key={`e-${idx}`}
                ref={(el) => (emailRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, idx, "email")}
                className="w-10 text-center text-lg font-bold border-b-2 border-input bg-transparent outline-none focus:border-[var(--brand)] py-1"
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onVerifySuccess}
          className="w-full h-12 rounded-xl bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold text-sm transition-opacity hover:opacity-90 shadow-sm cursor-pointer mt-2"
        >
          Confirm Verification
        </button>
      </div>
    </div>
  );
}
