import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  UserCog,
  Building2,
  CheckCircle2,
  Camera,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useLibraryAdminType } from "@/hooks/use-library-admin-type";
import { toast } from "sonner";

export const Route = createFileRoute("/library-admin/profile")({
  head: () => ({
    meta: [
      { title: "Library Admin Profile — PixelBooks" },
      {
        name: "description",
        content: "Manage institutional library administrator details, department access, and account settings.",
      },
    ],
  }),
  component: LibraryAdminProfilePage,
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

function LibraryAdminProfilePage() {
  const [libraryAdminType] = useLibraryAdminType();

  const [adminName, setAdminName] = useState("Prof. Rajesh Sharma");
  const [email, setEmail] = useState("r.sharma@iitd.ac.in");
  const [phone, setPhone] = useState("+91 98112 34567");
  const [verifiedEmail, setVerifiedEmail] = useState("r.sharma@iitd.ac.in");
  const [verifiedPhone, setVerifiedPhone] = useState("+91 98112 34567");
  const [institutionName, setInstitutionName] = useState("Indian Institute of Technology Delhi");
  const [libraryBranch, setLibraryBranch] = useState("Central Library - Main Campus");
  const [address1, setAddress1] = useState("Hauz Khas, IIT Campus");
  const [city, setCity] = useState("New Delhi");
  const [state, setState] = useState("Delhi");
  const [pincode, setPincode] = useState("110016");
  const [country, setCountry] = useState("India");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const handleSave = () => {
    toast.success("Library Administrator profile updated successfully");
  };

  return (
    <AppShell
      title="Library Admin Profile"
      subtitle="Manage institutional administrator profile and department permissions."
    >
      <div className="space-y-8 p-4 sm:p-6 md:p-8">
        {/* Identity Header Card */}
        <SectionCard title="Institutional Administrator Identity">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 rounded-xl border border-border bg-indigo-500/5 p-5 dark:bg-indigo-500/10">
              <div className="relative h-24 w-24 shrink-0">
                <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-indigo-500/30 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 shadow-md">
                  <UserCog size={40} />
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("Photo upload opened")}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border text-foreground shadow-sm hover:bg-secondary transition-transform hover:scale-105 cursor-pointer"
                  title="Upload Admin Avatar"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-lg font-bold text-foreground">{adminName}</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <UserCog size={12} /> {libraryAdminType}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={12} /> Institutional Admin
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex items-center gap-1.5">
                  <Building2 size={13} className="text-muted-foreground shrink-0" />
                  <span>{institutionName} · {libraryBranch}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              <Field
                label="Administrator Full Name"
                required
                value={adminName}
                onChange={setAdminName}
              />
              <Field
                label="Library Admin Role"
                disabled
                value={libraryAdminType}
              />
              <Field
                label="Work Email Address"
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
                label="Institutional Phone"
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
            </div>
          </div>
        </SectionCard>

        {/* Institutional Address */}
        <SectionCard title="Institutional Address & Details">
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <Field
              label="Institution / University Name"
              required
              value={institutionName}
              onChange={setInstitutionName}
            />
            <Field
              label="Library Branch / Block"
              required
              value={libraryBranch}
              onChange={setLibraryBranch}
            />
            <Field label="Address Line 1" required value={address1} onChange={setAddress1} />
            <Field label="City" required value={city} onChange={setCity} />
            <Field label="State" required value={state} onChange={setState} />
            <Field label="Pincode" required value={pincode} onChange={setPincode} />
            <Field label="Country" required value={country} onChange={setCountry} />
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
            Update Profile
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
