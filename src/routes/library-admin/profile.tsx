import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Camera,
  ChevronDown,
  X,
  CheckCircle2,
  Globe,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/library-admin/profile")({
  head: () => ({
    meta: [
      { title: "Profile — PixelBooks" },
      {
        name: "description",
        content: "Manage institutional library details, address, contact information, and borrowing limits.",
      },
    ],
  }),
  component: LibraryAdminProfilePage,
});

/* -------------------------------------------------------------------------- */
/*                              UI COMPONENTS (FROM PUBLISHER/PROFILE)       */
/* -------------------------------------------------------------------------- */

type FieldProps = {
  label: string;
  required?: boolean;
  value: string;
  onChange?: (v: string) => void;
  rightSlot?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
};

function Field({
  label,
  required,
  value,
  onChange,
  rightSlot,
  placeholder,
  disabled,
  type = "text",
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className={`flex h-12 w-full rounded-lg border border-input bg-white dark:bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
            rightSlot ? "pr-24" : ""
          } ${disabled ? "opacity-70 bg-secondary/30 cursor-not-allowed" : ""}`}
        />
        {rightSlot && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div>}
      </div>
    </div>
  );
}

function SelectField({
  label,
  required,
  value,
  onChange,
  options,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <div className="relative flex h-12 w-full items-center rounded-lg border border-input bg-white dark:bg-card px-4 text-sm text-foreground">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full appearance-none bg-transparent text-sm text-foreground outline-none cursor-pointer pr-8"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-card text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 text-muted-foreground" />
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-7">
      <h2 className="mb-5 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

function LibraryAdminProfilePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const profileBaseUrl = "azdevlibcustomer.pixelbooksapp.com/library/";
  const [profileSlug, setProfileSlug] = useState("digital-library-sog");
  const [copied, setCopied] = useState(false);

  // Status & UI States
  const [status, setStatus] = useState<"Onboarded" | "Pending" | "Rejected">("Onboarded");
  const [isSaved, setIsSaved] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Library Details State
  const [libraryName, setLibraryName] = useState("Digital Library SOG");
  const [libraryType, setLibraryType] = useState("Others");
  const [libraryId, setLibraryId] = useState("SOG");
  const [gstDetails, setGstDetails] = useState("32AABGS4736B1DW");
  const [addressLine1, setAddressLine1] = useState("Digital Library SOG Special Operation Group");
  const [addressLine2, setAddressLine2] = useState("Areekode , Malappuram , 673639");
  const [state, setState] = useState("Kerala");
  const [city, setCity] = useState("Malappuram");
  const [pincode, setPincode] = useState("673639");
  const [country, setCountry] = useState("India");

  // Contact Details State
  const [contactPerson, setContactPerson] = useState("SOG - Admin");
  const [email, setEmail] = useState("saniga@brandoptics.com");
  const [phone, setPhone] = useState("8089444218");
  const [verifiedEmail, setVerifiedEmail] = useState("saniga@brandoptics.com");
  const [verifiedPhone, setVerifiedPhone] = useState("8089444218");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  // Manage Library State
  const [borrowLimit, setBorrowLimit] = useState("5");
  const [returnLimitDays, setReturnLimitDays] = useState("7");

  const handleCopyProfileUrl = async () => {
    const fullUrl = `https://${profileBaseUrl}${profileSlug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Profile URL copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success("Library details updated successfully");
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReject = () => {
    setStatus("Rejected");
    toast.error("Library status set to Rejected");
  };

  const handleApprove = () => {
    setStatus("Onboarded");
    toast.success("Library status updated to Onboarded");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImage(url);
      toast.success("Logo uploaded successfully");
    }
  };

  return (
    <AppShell title="Profile" subtitle="Manage your library profile, address, contact and borrowing details.">
      <div className="space-y-8 p-4 md:p-8">
        {/* Profile Image & Logo SectionCard */}
        <SectionCard title="Library Profile">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 rounded-xl border border-border bg-secondary/20 p-5">
              <div className="relative h-24 w-24 shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Library Logo"
                    className="h-full w-full rounded-full object-cover border-2 border-background shadow-md"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center rounded-full border-2 border-background shadow-md text-3xl font-extrabold"
                    style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                  >
                    {libraryName ? libraryName.charAt(0).toUpperCase() : "L"}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border text-foreground shadow-sm hover:bg-secondary transition-transform hover:scale-105 cursor-pointer"
                  title="Upload Logo"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">{libraryName || "Library Details"}</h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      status === "Onboarded"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    }`}
                  >
                    <CheckCircle2 size={13} /> {status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upload a high-resolution logo to represent your library across PixelBooks catalogues, store fronts, and invoices. Recommended format: PNG or JPEG (512x512px).
                </p>
              </div>
            </div>

            {/* Profile URL Input Bar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Globe size={15} className="text-muted-foreground" />
                Library Profile URL
                <span className="text-destructive">*</span>
              </label>

              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="flex h-12 flex-1 items-center overflow-hidden rounded-xl border border-input bg-card shadow-2xs focus-within:ring-1 focus-within:ring-ring transition-all">
                  <div className="h-full border-r border-input bg-secondary/50 px-3.5 text-xs font-medium text-muted-foreground flex items-center shrink-0">
                    https://{profileBaseUrl}
                  </div>
                  <input
                    value={profileSlug}
                    onChange={(e) => setProfileSlug(e.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                    placeholder="digital-library-sog"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyProfileUrl}
                    className="inline-flex h-12 items-center gap-2 px-4 rounded-xl border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-secondary shadow-2xs cursor-pointer"
                    title={copied ? "Copied to clipboard" : "Copy URL"}
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
                    href={`https://${profileBaseUrl}${profileSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground shadow-2xs"
                    title="Preview Profile Page"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Library Details */}
          <SectionCard title="Library Details">
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              <Field
                label="Library Name"
                required
                value={libraryName}
                onChange={setLibraryName}
              />
              <SelectField
                label="Library Type"
                required
                value={libraryType}
                onChange={setLibraryType}
                options={[
                  { label: "Others", value: "Others" },
                  { label: "University", value: "University" },
                  { label: "Public Library", value: "Public Library" },
                  { label: "College Library", value: "College Library" },
                  { label: "School Library", value: "School Library" },
                  { label: "Research Institute", value: "Research Institute" },
                ]}
              />
              <Field label="ID" required value={libraryId} onChange={setLibraryId} />
              <Field label="GST Details" required value={gstDetails} onChange={setGstDetails} />
              <Field label="Address Line 1" required value={addressLine1} onChange={setAddressLine1} />
              <Field label="Address Line 2" value={addressLine2} onChange={setAddressLine2} />
              <SelectField
                label="State"
                required
                value={state}
                onChange={setState}
                options={[
                  { label: "Kerala", value: "Kerala" },
                  { label: "Tamil Nadu", value: "Tamil Nadu" },
                  { label: "Karnataka", value: "Karnataka" },
                  { label: "Maharashtra", value: "Maharashtra" },
                  { label: "Delhi", value: "Delhi" },
                  { label: "Others", value: "Others" },
                ]}
              />
              <Field label="City" required value={city} onChange={setCity} />
              <Field label="Pincode" required value={pincode} onChange={setPincode} />
              <Field label="Country" required value={country} onChange={setCountry} />
            </div>
          </SectionCard>

          {/* Contact Details */}
          <SectionCard title="Contact Details">
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              <Field
                label="Contact Person"
                required
                value={contactPerson}
                onChange={setContactPerson}
              />
              <div className="hidden md:block" />
              <Field
                label="Email"
                required
                type="email"
                value={email}
                onChange={setEmail}
                rightSlot={
                  email === verifiedEmail ? (
                    <span className="text-sm font-medium" style={{ color: "var(--success)" }}>
                      Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsOtpModalOpen(true)}
                      className="text-sm font-semibold text-destructive hover:underline cursor-pointer"
                    >
                      Verify Now
                    </button>
                  )
                }
              />
              <Field
                label="Phone Number"
                required
                value={phone}
                onChange={setPhone}
                rightSlot={
                  phone === verifiedPhone ? (
                    <span className="text-sm font-medium" style={{ color: "var(--success)" }}>
                      Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsOtpModalOpen(true)}
                      className="text-sm font-semibold text-destructive hover:underline cursor-pointer"
                    >
                      Verify Now
                    </button>
                  )
                }
              />
            </div>
          </SectionCard>

          {/* Manage Library */}
          <SectionCard title="Manage Library">
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              <Field
                label="Borrow Limit"
                required
                type="number"
                value={borrowLimit}
                onChange={setBorrowLimit}
              />
              <Field
                label="eBook Return Limit (in days)"
                required
                type="number"
                value={returnLimitDays}
                onChange={setReturnLimitDays}
              />
            </div>
          </SectionCard>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            {status !== "Rejected" ? (
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground hover:bg-secondary cursor-pointer"
              >
                Reject
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 text-sm font-semibold text-white hover:opacity-90 cursor-pointer"
              >
                <CheckCircle2 size={16} /> Re-approve
              </button>
            )}
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
            >
              {isSaved ? "Details Updated" : "Update Details"}
            </button>
          </div>
        </form>
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

/* -------------------------------------------------------------------------- */
/*                                OTP MODAL                                  */
/* -------------------------------------------------------------------------- */

type OtpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  phone: string;
  onVerifySuccess: () => void;
};

function OtpModal({ isOpen, onClose, email, phone, onVerifySuccess }: OtpModalProps) {
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    type: "mobile" | "email"
  ) => {
    if (e.key === "Backspace") {
      const currentArr = type === "mobile" ? mobileOtp : emailOtp;
      if (!currentArr[index] && index > 0) {
        if (type === "mobile") {
          mobileRefs.current[index - 1]?.focus();
        } else {
          emailRefs.current[index - 1]?.focus();
        }
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Enter OTP
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            We've sent a verification code to your email address{" "}
            <span className="font-medium text-foreground">{email}</span> and mobile number{" "}
            <span className="font-medium text-foreground">{phone}</span>
          </p>
        </div>

        {/* Mobile OTP */}
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-foreground">Enter the Mobile OTP</p>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {mobileOtp.map((digit, idx) => (
              <input
                key={`mobile-${idx}`}
                ref={(el) => (mobileRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, idx, "mobile")}
                onKeyDown={(e) => handleKeyDown(e, idx, "mobile")}
                className="w-8 sm:w-10 text-center text-lg font-bold border-b-2 border-input bg-transparent outline-none focus:border-[var(--brand)] transition-colors py-1"
              />
            ))}
          </div>
        </div>

        {/* Email OTP */}
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-foreground">Enter the Email OTP</p>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {emailOtp.map((digit, idx) => (
              <input
                key={`email-${idx}`}
                ref={(el) => (emailRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, idx, "email")}
                onKeyDown={(e) => handleKeyDown(e, idx, "email")}
                className="w-8 sm:w-10 text-center text-lg font-bold border-b-2 border-input bg-transparent outline-none focus:border-[var(--brand)] transition-colors py-1"
              />
            ))}
          </div>
        </div>

        {/* Resend timer */}
        <div className="space-y-1 text-center pt-2">
          <p className="text-sm font-medium text-muted-foreground">Didn't Receive the Code?</p>
          {timer > 0 ? (
            <p className="text-sm font-semibold text-foreground">{timer} seconds</p>
          ) : (
            <button
              type="button"
              onClick={() => setTimer(32)}
              className="text-sm font-semibold text-[var(--brand)] hover:underline cursor-pointer"
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={onVerifySuccess}
          className="w-full h-12 sm:h-13 rounded-2xl font-semibold text-base transition-colors shadow-sm cursor-pointer mt-2"
          style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}



