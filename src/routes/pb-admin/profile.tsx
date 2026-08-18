import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Crown,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Camera,
  Key,
  Globe,
  Bell,
  Sliders,
  Check,
  X,
  Smartphone,
  Mail,
  Shield,
  Activity,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/profile")({
  head: () => ({
    meta: [
      { title: "Admin Profile — PixelBooks" },
      {
        name: "description",
        content: "Manage system administrator details, security permissions, and audit preferences.",
      },
    ],
  }),
  component: PbAdminProfilePage,
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

function PbAdminProfilePage() {
  const [adminName, setAdminName] = useState("Harish Kumar");
  const [email, setEmail] = useState("admin@pixelbooksapp.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [verifiedEmail, setVerifiedEmail] = useState("admin@pixelbooksapp.com");
  const [verifiedPhone, setVerifiedPhone] = useState("+91 98765 43210");
  const [officeLocation, setOfficeLocation] = useState("HQ - Bangalore, India");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [auditLoggingEnabled, setAuditLoggingEnabled] = useState(true);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const handleSave = () => {
    toast.success("Admin profile updated successfully");
  };

  return (
    <AppShell
      title="Admin Profile"
      subtitle="Manage system administrator details, security permissions, and platform preferences."
    >
      <div className="space-y-8 p-4 sm:p-6 md:p-8">
        {/* Admin Header Card */}
        <SectionCard title="Administrator Identity">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 rounded-xl border border-border bg-purple-500/5 p-5 dark:bg-purple-500/10">
              <div className="relative h-24 w-24 shrink-0">
                <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-purple-500/30 bg-purple-500/15 text-purple-600 dark:text-purple-400 shadow-md">
                  <Crown size={40} />
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
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                    <Crown size={12} /> Super Admin
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={12} /> Master Access Active
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Super Administrator account with full permissions across PixelBooks Retail & Library Management Portals, system configurations, and security policies.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              <Field
                label="Full Name"
                required
                value={adminName}
                onChange={setAdminName}
              />
              <Field
                label="Admin Role Title"
                disabled
                value="Super Admin / Platform Administrator"
              />
              <Field
                label="Primary Work Email"
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
                label="Emergency Mobile Number"
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
                label="Office Location"
                value={officeLocation}
                onChange={setOfficeLocation}
              />
              <Field
                label="System ID"
                disabled
                value="ADM-PB-001928"
              />
            </div>
          </div>
        </SectionCard>

        {/* Security & Access Controls */}
        <SectionCard title="Security Controls & Privileges">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 2FA Card */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={20} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Two-Factor Authentication (2FA)</h3>
                    <p className="text-xs text-muted-foreground">Mandatory for all Super Admin logins</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    toast.success(`2FA ${!twoFactorEnabled ? "enabled" : "disabled"}`);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    twoFactorEnabled ? "bg-emerald-500" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Uses hardware security key or TOTP Authenticator app (Google Authenticator / 1Password) for access verification.
              </p>
            </div>

            {/* Audit Logging */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Activity size={20} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Master Audit Logging</h3>
                    <p className="text-xs text-muted-foreground">Logs all administrative state changes</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuditLoggingEnabled(!auditLoggingEnabled);
                    toast.success(`Audit logging ${!auditLoggingEnabled ? "activated" : "paused"}`);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    auditLoggingEnabled ? "bg-indigo-600" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      auditLoggingEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Records full timestamps, IP signatures, and entity diffs for every configuration update and user modification.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* System Session Preferences */}
        <SectionCard title="Session & Notification Preferences">
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Clock size={15} className="text-muted-foreground" />
                Admin Inactivity Session Timeout
              </label>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="flex h-12 w-full rounded-xl border border-input bg-card px-4 text-sm font-medium text-foreground outline-none focus:border-[var(--brand)]"
              >
                <option value="15">15 Minutes (High Security)</option>
                <option value="30">30 Minutes (Recommended)</option>
                <option value="60">1 Hour</option>
                <option value="120">2 Hours</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Bell size={15} className="text-muted-foreground" />
                System Alert Email Frequency
              </label>
              <select
                defaultValue="instant"
                className="flex h-12 w-full rounded-xl border border-input bg-card px-4 text-sm font-medium text-foreground outline-none focus:border-[var(--brand)]"
              >
                <option value="instant">Instant Critical System Alerts</option>
                <option value="daily">Daily Administrative Summary</option>
                <option value="weekly">Weekly System Audit Digest</option>
              </select>
            </div>
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
            Update Admin Profile
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
