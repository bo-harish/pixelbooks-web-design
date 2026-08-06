import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Settings,
  Bell,
  KeyRound,
  ShieldCheck,
  Scale,
  Percent,
  Users,
  X,
  Lock,
  Check,
  Eye,
  EyeOff,
  ChevronRight,
  UserCheck,
  Building2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin-lib/settings")({
  component: PBAdminLibrarySettingsPage,
});

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? "bg-[var(--brand)]" : "bg-border"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// ─── Change Password Modal ──────────────────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password changed successfully!");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-card shadow-xl border border-border overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20">
              <KeyRound size={18} />
            </span>
            <h2 className="text-sm font-bold text-foreground">Change Password</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-border bg-card pr-10 pl-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              New Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showNew ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-border bg-card pr-10 pl-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-xl bg-[var(--brand)] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-2xs"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Rate Config Modal ────────────────────────────────────────────────────────
function RateConfigModal({
  title,
  label,
  icon: Icon,
  iconBgClass,
  currentRate,
  onSave,
  onClose,
}: {
  title: string;
  label: string;
  icon: React.ElementType;
  iconBgClass: string;
  currentRate: string;
  onSave: (rate: string) => void;
  onClose: () => void;
}) {
  const [rate, setRate] = useState(currentRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(rate);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-card shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBgClass}`}>
              <Icon size={18} />
            </span>
            <h2 className="text-sm font-bold text-foreground">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label
              htmlFor="rate-input"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {label} <span className="text-red-500">*</span>
            </label>
            <input
              id="rate-input"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 70"
              className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-xl bg-[var(--brand)] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-2xs"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function PBAdminLibrarySettingsPage() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [tdsRate, setTdsRate] = useState("6.00");
  const [authorCommissionRate, setAuthorCommissionRate] = useState("70.00");
  const [publisherCommissionRate, setPublisherCommissionRate] = useState("65.00");

  const [tdsOpen, setTdsOpen] = useState(false);
  const [authorCommissionOpen, setAuthorCommissionOpen] = useState(false);
  const [publisherCommissionOpen, setPublisherCommissionOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const handleTogglePush = (v: boolean) => {
    setPushNotifications(v);
    toast.success(
      v
        ? "Push notifications enabled."
        : "Push notifications disabled."
    );
  };

  return (
    <AppShell
      title="Settings"
      subtitle="Manage administrative preferences, security credentials, compliance policies, and commission/tax rates."
    >
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl space-y-6">
        {/* Settings Container Card */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center gap-3 border-b border-border bg-secondary/30 px-6 py-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--sidebar-highlight)] text-[var(--brand)] border border-[var(--brand)]/20">
              <Settings size={16} />
            </span>
            <div>
              <h2 className="text-base font-bold text-foreground">Admin Settings</h2>
              <p className="text-xs text-muted-foreground">
                Configure core application options and compliance policies.
              </p>
            </div>
          </div>

          {/* Setting Items List */}
          <div className="divide-y divide-border/60">
            {/* 1. Push Notifications */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:px-6 transition-colors hover:bg-secondary/20">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/12 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 border border-teal-500/20 shadow-2xs">
                  <Bell size={18} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">Push Notifications</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        pushNotifications
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-secondary text-muted-foreground border border-border"
                      }`}
                    >
                      {pushNotifications ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Receive instant system alerts and notification updates.
                  </p>
                </div>
              </div>
              <div className="shrink-0 pl-14 sm:pl-0">
                <Toggle
                  id="push-notifications"
                  checked={pushNotifications}
                  onChange={handleTogglePush}
                />
              </div>
            </div>

            {/* 2. Password */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:px-6 transition-colors hover:bg-secondary/20">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20 shadow-2xs">
                  <KeyRound size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">Password Security</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Update your login credentials and administrative access password.
                  </p>
                </div>
              </div>
              <div className="shrink-0 pl-14 sm:pl-0">
                <button
                  type="button"
                  onClick={() => setPasswordOpen(true)}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-secondary hover:border-border/80 cursor-pointer shadow-2xs"
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* 3. Privacy Policy */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:px-6 transition-colors hover:bg-secondary/20">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">Privacy Policy</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Manage data protection and privacy policy terms per user role.
                  </p>
                </div>
              </div>
              <div className="shrink-0 pl-14 sm:pl-0">
                <Link
                  to="/pb-admin-lib/privacy-policy"
                  className="group inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-all hover:border-[var(--brand)]/50 hover:bg-secondary/60 cursor-pointer shadow-2xs"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    5 Active
                  </span>
                  <span>Manage</span>
                  <ChevronRight
                    size={14}
                    className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
                  />
                </Link>
              </div>
            </div>

            {/* 4. Terms and Conditions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:px-6 transition-colors hover:bg-secondary/20">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/12 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-500/20 shadow-2xs">
                  <Scale size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">Terms and Conditions</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Configure institutional usage terms and legal agreements.
                  </p>
                </div>
              </div>
              <div className="shrink-0 pl-14 sm:pl-0">
                <Link
                  to="/pb-admin-lib/terms-conditions"
                  className="group inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-all hover:border-[var(--brand)]/50 hover:bg-secondary/60 cursor-pointer shadow-2xs"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    5 Active
                  </span>
                  <span>Manage</span>
                  <ChevronRight
                    size={14}
                    className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
                  />
                </Link>
              </div>
            </div>

            {/* 5. TDS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:px-6 transition-colors hover:bg-secondary/20">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/12 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20 shadow-2xs">
                  <Percent size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">TDS Rate Configuration</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Update tax deducted at source (TDS) percentages and dates.
                  </p>
                </div>
              </div>
              <div className="shrink-0 pl-14 sm:pl-0">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                    {tdsRate}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setTdsOpen(true)}
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-secondary hover:border-border/80 cursor-pointer shadow-2xs"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>

            {/* 6. Default Author Commission Rate */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:px-6 transition-colors hover:bg-secondary/20">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20 shadow-2xs">
                  <UserCheck size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">Default Author Commission Rate</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Configure default royalty and commission percentage for author accounts.
                  </p>
                </div>
              </div>
              <div className="shrink-0 pl-14 sm:pl-0">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                    {authorCommissionRate}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setAuthorCommissionOpen(true)}
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-secondary hover:border-border/80 cursor-pointer shadow-2xs"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>

            {/* 7. Default Publisher Commission Rate */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:px-6 transition-colors hover:bg-secondary/20">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/12 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 border border-cyan-500/20 shadow-2xs">
                  <Building2 size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">Default Publisher Commission Rate</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Configure default margin and commission percentage for publisher accounts.
                  </p>
                </div>
              </div>
              <div className="shrink-0 pl-14 sm:pl-0">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    {publisherCommissionRate}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPublisherCommissionOpen(true)}
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-secondary hover:border-border/80 cursor-pointer shadow-2xs"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {passwordOpen && <ChangePasswordModal onClose={() => setPasswordOpen(false)} />}
      {tdsOpen && (
        <RateConfigModal
          title="Current TDS Rate"
          label="TDS Rate(%)"
          icon={Percent}
          iconBgClass="bg-amber-500/12 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20"
          currentRate={tdsRate}
          onClose={() => setTdsOpen(false)}
          onSave={(newRate) => {
            setTdsRate(newRate);
            toast.success(`TDS Rate updated to ${newRate}%.`);
          }}
        />
      )}
      {authorCommissionOpen && (
        <RateConfigModal
          title="Default Author Commission Rate"
          label="Author Commission Rate(%)"
          icon={UserCheck}
          iconBgClass="bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20"
          currentRate={authorCommissionRate}
          onClose={() => setAuthorCommissionOpen(false)}
          onSave={(newRate) => {
            setAuthorCommissionRate(newRate);
            toast.success(`Default Author Commission Rate updated to ${newRate}%.`);
          }}
        />
      )}
      {publisherCommissionOpen && (
        <RateConfigModal
          title="Default Publisher Commission Rate"
          label="Publisher Commission Rate(%)"
          icon={Building2}
          iconBgClass="bg-cyan-500/12 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 border border-cyan-500/20"
          currentRate={publisherCommissionRate}
          onClose={() => setPublisherCommissionOpen(false)}
          onSave={(newRate) => {
            setPublisherCommissionRate(newRate);
            toast.success(`Default Publisher Commission Rate updated to ${newRate}%.`);
          }}
        />
      )}
    </AppShell>
  );
}
