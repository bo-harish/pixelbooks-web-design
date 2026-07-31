import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Pencil,
  CheckCircle2,
  ChevronDown,
  X,
  Copy,
  Check,
  Landmark,
  Percent,
  Sparkles,
  Lock,
  ArrowUpRight,
  Upload,
  Globe,
  ExternalLink,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/publisher/profile")({
  head: () => ({
    meta: [
      { title: "Profile — PixelBooks" },
      {
        name: "description",
        content: "Manage your publisher profile, billing address, contact and account details.",
      },
      { property: "og:title", content: "Profile — PixelBooks" },
      {
        property: "og:description",
        content: "Manage your publisher profile, billing address, contact and account details.",
      },
    ],
  }),
  component: ProfilePage,
});

type FieldProps = {
  label: string;
  required?: boolean;
  value: string;
  onChange?: (v: string) => void;
  rightSlot?: React.ReactNode;
  placeholder?: string;
};

function Field({ label, required, value, onChange, rightSlot, placeholder }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex h-12 w-full rounded-lg border border-input bg-white px-4 pr-24 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
  onClear,
}: {
  label: string;
  required?: boolean;
  value: string;
  onClear?: () => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <div className="relative flex h-12 w-full items-center rounded-lg border border-input bg-white px-4 text-sm text-foreground">
        <span className="flex-1">{value}</span>
        <div className="flex items-center gap-2 text-muted-foreground">
          {onClear && (
            <button type="button" onClick={onClear} className="hover:text-foreground">
              <X size={16} />
            </button>
          )}
          <ChevronDown size={16} />
        </div>
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

function ProfilePage() {
  const profileBaseUrl = "azdevlibcustomer.pixelbooksapp.com/";
  const [publisherName, setPublisherName] = useState("PixelBooks");
  const [gst, setGst] = useState("32AAGCE9532N1ZB");
  const [pan, setPan] = useState("AAGCE9532N");
  const [address1, setAddress1] = useState(
    "BrandOptics India Private LimitedUnit 403, 4th Floor, Tower B",
  );
  const [address2, setAddress2] = useState("World Trade Center, Infopark Phase I");
  const [city, setCity] = useState("Kochi");
  const [state, setState] = useState("Kerala");
  const [pincode, setPincode] = useState("682042");
  const [country, setCountry] = useState("India");
  const [email, setEmail] = useState("Sudheer@brandoptics.com");
  const [phone, setPhone] = useState("7994833122");
  const [verifiedEmail, setVerifiedEmail] = useState("Sudheer@brandoptics.com");
  const [verifiedPhone, setVerifiedPhone] = useState("7994833122");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [commission, setCommission] = useState("65");
  const [profileSlug, setProfileSlug] = useState("sj-publications");
  const [copied, setCopied] = useState(false);

  const handleCopyProfileUrl = async () => {
    const fullUrl = `${profileBaseUrl}${profileSlug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AppShell title="Profile" subtitle="Manage your publisher profile and account details.">
      <div className="space-y-8 p-4 md:p-8">
        {/* Publisher Profile */}
        <SectionCard title="Publisher Profile">
          <div className="space-y-6">
            {/* Logo & Avatar Header Card */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 rounded-xl border border-border bg-secondary/20 p-5">
              <div className="relative h-24 w-24 shrink-0">
                <div
                  className="flex h-full w-full items-center justify-center rounded-full border-2 border-background shadow-md text-4xl font-extrabold"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  P
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border text-foreground shadow-sm hover:bg-secondary transition-transform hover:scale-105 cursor-pointer"
                  title="Upload Logo"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">{publisherName || "Publisher Profile"}</h3>
                 
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upload a high-resolution logo to represent your brand across PixelBooks catalogues, store fronts, and invoices. Recommended format: PNG or JPEG (512x512px).
                </p>
              </div>
            </div>

            {/* Profile URL Input Bar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Globe size={15} className="text-muted-foreground" />
                Storefront Profile URL
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
                    placeholder="your-publisher-name"
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
                    title="Preview Storefront"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Contact Details */}
        <SectionCard title="Contact Details">
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <Field
              label="Email"
              required
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

        {/* Billing Address */}
        <SectionCard title="Billing Address">
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <Field
              label="Publisher Name"
              required
              value={publisherName}
              onChange={setPublisherName}
            />
            <Field label="GST Number" required value={gst} onChange={setGst} />
            <Field label="PAN" required value={pan} onChange={setPan} />
            <Field label="Address Line 1" required value={address1} onChange={setAddress1} />
            <Field label="Address Line 2" value={address2} onChange={setAddress2} />
            <Field label="City" required value={city} onChange={setCity} />
            <SelectField label="State" required value={state} onClear={() => setState("")} />
            <Field label="Pincode" required value={pincode} onChange={setPincode} />
            <Field label="Country" required value={country} onChange={setCountry} />
          </div>
        </SectionCard>

        {/* Account & Commission */}
        <SectionCard title="Account & Commission Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Account Details Card */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-2xs space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                      <Landmark size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Account Details</h3>
                      <p className="text-xs text-muted-foreground">Primary payout account</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={13} /> Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg bg-secondary/30 p-4 text-xs">
                  <div>
                    <span className="text-muted-foreground font-medium block mb-0.5">Account Holder</span>
                    <span className="font-semibold text-foreground">PixelBooks</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium block mb-0.5">Account Number</span>
                    <span className="font-semibold text-foreground font-mono">•••• 00430</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium block mb-0.5">IFSC Code</span>
                    <span className="font-semibold text-foreground font-mono">ICIC0006267</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium block mb-0.5">Bank Name</span>
                    <span className="font-semibold text-foreground">ICICI Bank Ltd</span>
                  </div>
                </div>
              </div>

              <button className="inline-flex h-9 w-fit items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer">
                Manage Bank Account <ArrowUpRight size={13} />
              </button>
            </div>

            {/* Commission Details Card */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-2xs space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                      <Percent size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Commission Details</h3>
                      <p className="text-xs text-muted-foreground">Revenue share percentage</p>
                    </div>
                  </div>
                 
                </div>

                <div className="rounded-lg border border-border/70 bg-secondary/30 p-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Publisher Revenue Share</span>
                    <span className="text-2xl font-extrabold text-foreground tracking-tight">{commission}%</span>
                  </div>
                  <div className="w-full bg-border/60 rounded-full h-2 overflow-hidden">
                    <div className="bg-[var(--brand)] h-full rounded-full" style={{ width: `${commission}%` }} />
                  </div>
                </div>
              </div>


            </div>
          </div>
        </SectionCard>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <button className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground hover:bg-secondary">
            Cancel
          </button>
          <button
            className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Update Details
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
        }}
      />
    </AppShell>
  );
}

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
    type: "mobile" | "email",
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
      <div className="relative w-full max-w-[480px] rounded-[24px] bg-white p-6 sm:p-8 shadow-2xl space-y-6 text-center border border-border/40">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2b2653] tracking-tight">
            Enter OTP
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            We've send a verification code to your email address{" "}
            <span className="font-medium text-foreground">{email}</span> and mobile number{" "}
            <span className="font-medium text-foreground">{phone}</span>
          </p>
        </div>

        {/* Mobile OTP */}
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-slate-700">Enter the Mobile OTP</p>
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
                className="w-8 sm:w-10 text-center text-lg font-bold border-b-2 border-slate-300 bg-transparent outline-none focus:border-[#1f5d66] transition-colors py-1"
              />
            ))}
          </div>
        </div>

        {/* Email OTP */}
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-slate-700">Enter the Email OTP</p>
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
                className="w-8 sm:w-10 text-center text-lg font-bold border-b-2 border-slate-300 bg-transparent outline-none focus:border-[#1f5d66] transition-colors py-1"
              />
            ))}
          </div>
        </div>

        {/* Resend timer */}
        <div className="space-y-1 text-center pt-2">
          <p className="text-sm font-medium text-slate-500">Didn't Receive the Code?</p>
          {timer > 0 ? (
            <p className="text-sm font-semibold text-slate-700">{timer} seconds</p>
          ) : (
            <button
              type="button"
              onClick={() => setTimer(32)}
              className="text-sm font-semibold text-[#1f5d66] hover:underline cursor-pointer"
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={onVerifySuccess}
          className="w-full h-12 sm:h-13 rounded-2xl bg-[#1f5d66] hover:bg-[#174850] text-white font-semibold text-base transition-colors shadow-sm cursor-pointer mt-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
