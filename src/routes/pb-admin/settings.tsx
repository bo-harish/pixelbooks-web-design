import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Palette,
  Check,
  RotateCcw,
  Sparkles,
  Bell,
  KeyRound,
  ShieldCheck,
  FileText,
  X,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Building2,
  Feather,
  Percent,
  Users,
  UserPlus,
  RefreshCw,
  Info,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { usePublisherTheme, PUBLISHER_THEMES } from "@/lib/publisher-theme";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/settings")({
  head: () => ({
    meta: [
      { title: "Super Admin Settings — PixelBooks" },
      {
        name: "description",
        content: "Configure Super Admin workspace preferences, color themes, password security, and platform policies.",
      },
      { property: "og:title", content: "Super Admin Settings — PixelBooks" },
      {
        property: "og:description",
        content: "Configure Super Admin workspace preferences, color themes, password security, and platform policies.",
      },
    ],
  }),
  component: SuperAdminSettingsPage,
});

// ─── Toggle Component ────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none"
      style={{ backgroundColor: checked ? "var(--brand)" : "hsl(var(--muted))" }}
    >
      <span
        className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${checked ? "translate-x-5" : "translate-x-0.5"
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Password changed successfully!");
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-card shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
            >
              <KeyRound size={18} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-foreground">Change Password</h2>
              <p className="text-[11px] text-muted-foreground">Update your Super Admin account credentials</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Document Modal (Privacy Policy / Terms) ────────────────────────────────
function DocumentModal({
  title,
  icon: Icon,
  subtitle,
  children,
  onClose,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  subtitle: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-card shadow-2xl border border-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
            >
              <Icon size={18} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-foreground">{title}</h2>
              <p className="text-[11px] text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-muted-foreground">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-border px-6 py-3.5 bg-secondary/30 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-muted-foreground">Last revised: August 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-1.5 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Set Commission Rates Modal ──────────────────────────────────────────────
function SetCommissionRatesModal({
  onClose,
  defaultPublisherRate,
  defaultAuthorRate,
  onSaveDefaults,
}: {
  onClose: () => void;
  defaultPublisherRate: string;
  defaultAuthorRate: string;
  onSaveDefaults: (pubRate: string, authRate: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"defaults" | "bulk">("defaults");

  // Tab 1: Default rates for upcoming registrations
  const [pubDefaultRate, setPubDefaultRate] = useState(defaultPublisherRate);
  const [authDefaultRate, setAuthDefaultRate] = useState(defaultAuthorRate);
  const [isSavingDefaults, setIsSavingDefaults] = useState(false);

  // Tab 2: Bulk update for existing accounts
  const [bulkUserType, setBulkUserType] = useState<"All" | "Publisher" | "Author">("All");
  const [bulkScope, setBulkScope] = useState("");
  const [bulkRate, setBulkRate] = useState("");
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);


  const handleSaveDefaults = (e: React.FormEvent) => {
    e.preventDefault();
    const pNum = parseFloat(pubDefaultRate);
    const aNum = parseFloat(authDefaultRate);

    if (isNaN(pNum) || pNum < 0 || pNum > 100) {
      toast.error("Publisher default commission rate must be between 0% and 100%.");
      return;
    }
    if (isNaN(aNum) || aNum < 0 || aNum > 100) {
      toast.error("Author default commission rate must be between 0% and 100%.");
      return;
    }

    setIsSavingDefaults(true);
    setTimeout(() => {
      setIsSavingDefaults(false);
      onSaveDefaults(pubDefaultRate, authDefaultRate);
      toast.success(
        `Default commission rates saved for upcoming registrations: Publishers ${pNum}%, Authors ${aNum}%!`
      );
      onClose();
    }, 350);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkRate) {
      toast.error("Please enter a commission rate percentage.");
      return;
    }
    const rateNum = parseFloat(bulkRate);
    if (isNaN(rateNum) || rateNum < 0 || rateNum > 100) {
      toast.error("Commission rate must be between 0% and 100%.");
      return;
    }

    setIsSubmittingBulk(true);
    setTimeout(() => {
      setIsSubmittingBulk(false);
      const targetLabel =
        bulkUserType === "All"
          ? "All Accounts"
          : bulkUserType === "Publisher"
          ? "All Publishers"
          : "All Authors";
      const scopeLabel = bulkScope ? ` (${bulkScope})` : "";
      toast.success(`Successfully applied ${rateNum}% commission rate to ${targetLabel}${scopeLabel}!`);
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-2xl bg-card shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top Gradient Stripe */}
        <div
          className="h-1 w-full shrink-0"
          style={{
            background:
              "linear-gradient(90deg, #6366f1 0%, var(--brand) 50%, #10b981 100%)",
          }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4 shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-2xs"
              style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
            >
              <Percent size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold text-foreground tracking-tight">
                Set Commission Rates
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set default rates for upcoming registrations or mass-adjust active platform accounts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border bg-secondary/30 px-6 pt-2.5 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("defaults")}
            className={`relative flex items-center gap-2 pb-3 px-3 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "defaults"
                ? "text-[var(--brand)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus size={15} />
            <span>Upcoming Registrations</span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              Default Rates
            </span>
            {activeTab === "defaults" && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: "var(--brand)" }}
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bulk")}
            className={`relative flex items-center gap-2 pb-3 px-3 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "bulk"
                ? "text-[var(--brand)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <RefreshCw size={14} />
            <span>Bulk Update</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              Existing Accounts
            </span>
            {activeTab === "bulk" && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: "var(--brand)" }}
              />
            )}
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "defaults" ? (
            <form id="form-default-rates" onSubmit={handleSaveDefaults} className="space-y-5">
              {/* Notice Banner */}
              <div className="flex items-start gap-3 rounded-xl border border-[var(--brand)]/20 bg-[var(--sidebar-highlight)]/40 p-3.5 text-xs text-muted-foreground">
                <Info size={16} className="shrink-0 text-[var(--brand)] mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground text-xs">Standard Registration Defaults</p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Define separate default commission percentages for new publishers and authors joining PixelBooks. Existing accounts and custom negotiated agreements will not be altered.
                  </p>
                </div>
              </div>

              {/* Two Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Publisher Default Rate Card */}
                <div className="flex flex-col justify-between rounded-xl border border-indigo-500/25 bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05] p-4.5 space-y-4 hover:border-indigo-500/40 transition-colors shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/12 text-indigo-600 dark:text-indigo-400">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-foreground">Publishers</h3>
                          <p className="text-[10px] text-muted-foreground">Upcoming Registrations</p>
                        </div>
                      </div>
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                        Default
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Platform commission rate applied to book sales from newly onboarded publishing houses.
                    </p>
                  </div>

                  {/* Input & Presets */}
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-semibold text-foreground block">
                      Default Commission Rate (%)
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        value={pubDefaultRate}
                        onChange={(e) => setPubDefaultRate(e.target.value)}
                        min="0"
                        max="100"
                        step="0.5"
                        required
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base font-bold text-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 pr-10 shadow-2xs"
                      />
                      <span className="absolute right-3.5 text-xs font-bold text-muted-foreground">
                        %
                      </span>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-medium text-muted-foreground mr-1">Presets:</span>
                      {["10", "12", "15", "18", "20"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setPubDefaultRate(preset)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                            pubDefaultRate === preset
                              ? "bg-indigo-600 text-white shadow-2xs"
                              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {preset}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Author Default Rate Card */}
                <div className="flex flex-col justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] p-4.5 space-y-4 hover:border-emerald-500/40 transition-colors shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                          <Feather size={16} />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-foreground">Authors</h3>
                          <p className="text-[10px] text-muted-foreground">Upcoming Registrations</p>
                        </div>
                      </div>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Default
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Platform commission rate applied to book sales from newly onboarded independent authors.
                    </p>
                  </div>

                  {/* Input & Presets */}
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-semibold text-foreground block">
                      Default Commission Rate (%)
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        value={authDefaultRate}
                        onChange={(e) => setAuthDefaultRate(e.target.value)}
                        min="0"
                        max="100"
                        step="0.5"
                        required
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base font-bold text-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-10 shadow-2xs"
                      />
                      <span className="absolute right-3.5 text-xs font-bold text-muted-foreground">
                        %
                      </span>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-medium text-muted-foreground mr-1">Presets:</span>
                      {["10", "12", "15", "18", "20"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAuthDefaultRate(preset)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                            authDefaultRate === preset
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {preset}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-note */}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>Default rates take effect immediately for any upcoming user sign-ups.</span>
              </div>
            </form>
          ) : (
            <form id="form-bulk-update" onSubmit={handleBulkSubmit} className="space-y-4">
              {/* Alert Banner */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3.5 text-xs text-muted-foreground">
                <AlertTriangle size={16} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground text-xs">Mass Account Rate Update</p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Apply a uniform commission percentage across publishers and authors currently active on the platform.
                  </p>
                </div>
              </div>

              {/* Select Target Account Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Target Account Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkUserType("All")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      bulkUserType === "All"
                        ? "border-[var(--brand)] bg-[var(--sidebar-highlight)] text-[var(--brand)] shadow-2xs"
                        : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Users size={15} />
                    All Accounts
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkUserType("Publisher")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      bulkUserType === "Publisher"
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                        : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Building2 size={15} />
                    Publishers
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkUserType("Author")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      bulkUserType === "Author"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                        : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Feather size={15} />
                    Authors
                  </button>
                </div>
              </div>

              {/* Application Scope */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Application Scope</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: "", label: "All Rates", desc: "Overrides all accounts" },
                    { id: "Default Rate", label: "Default Rates Only", desc: "Preserves custom contracts" },
                    { id: "Other Rate", label: "Custom Overrides Only", desc: "Updates special contracts" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBulkScope(item.id)}
                      className={`flex flex-col text-left rounded-xl border p-2.5 transition-all cursor-pointer ${
                        bulkScope === item.id
                          ? "border-[var(--brand)] bg-[var(--sidebar-highlight)] text-foreground shadow-2xs ring-1 ring-[var(--brand)]/30"
                          : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <span className="text-xs font-semibold text-foreground">{item.label}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* New Rate Input */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-foreground">
                  New Commission Rate (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={bulkRate}
                    onChange={(e) => setBulkRate(e.target.value)}
                    placeholder="e.g. 15"
                    min="0"
                    max="100"
                    step="0.5"
                    required
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base font-bold text-foreground placeholder:text-muted-foreground/60 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)] pr-10 shadow-2xs"
                  />
                  <span className="absolute right-3.5 text-muted-foreground font-bold text-xs">
                    %
                  </span>
                </div>

                {/* Presets */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-medium text-muted-foreground mr-1">Presets:</span>
                  {["10", "12", "15", "18", "20"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBulkRate(preset)}
                      className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                        bulkRate === preset
                          ? "bg-[var(--brand)] text-[var(--brand-contrast)] shadow-2xs"
                          : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>


              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4 shrink-0 bg-secondary/10">
          <div className="text-[11px] text-muted-foreground hidden sm:block">
            {activeTab === "defaults"
              ? "Applies to future registrations"
              : "Applies across selected enrolled accounts"}
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {activeTab === "defaults" ? (
              <button
                type="submit"
                form="form-default-rates"
                disabled={isSavingDefaults}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                <Check size={14} />
                {isSavingDefaults ? "Saving..." : "Save Default Rates"}
              </button>
            ) : (
              <button
                type="submit"
                form="form-bulk-update"
                disabled={isSubmittingBulk}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                <RefreshCw size={13} className={isSubmittingBulk ? "animate-spin" : ""} />
                {isSubmittingBulk ? "Applying..." : "Apply Bulk Update"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Super Admin Settings Page Component ─────────────────────────────────────
function SuperAdminSettingsPage() {
  const { currentTheme, setTheme, resetToDefault, isDefault } = usePublisherTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [commissionRatesModalOpen, setCommissionRatesModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Commission rates for upcoming registrations (persisted in localStorage)
  const [defaultPublisherRate, setDefaultPublisherRate] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pb_default_publisher_rate") || "15";
    }
    return "15";
  });
  const [defaultAuthorRate, setDefaultAuthorRate] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pb_default_author_rate") || "15";
    }
    return "15";
  });

  const handleSaveDefaultRates = (pubRate: string, authRate: string) => {
    setDefaultPublisherRate(pubRate);
    setDefaultAuthorRate(authRate);
    if (typeof window !== "undefined") {
      localStorage.setItem("pb_default_publisher_rate", pubRate);
      localStorage.setItem("pb_default_author_rate", authRate);
    }
  };

  const handleSelectTheme = (themeId: string, themeName: string) => {
    setTheme(themeId);
    toast.success(`Color theme updated to ${themeName}`);
  };

  const handleResetTheme = () => {
    resetToDefault();
    toast.success("Color theme reset to Classic Teal (Default)");
  };

  return (
    <AppShell
      title="Settings"
      subtitle="Customize workspace color themes, app preferences, and institutional policies."
    >
      <div className="space-y-8 p-4 md:p-8 max-w-6xl mx-auto">
        {/* ─── SECTION 1: PREFERENCES & SECURITY SETTINGS ───────────────────── */}
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden shadow-xs">
          <div className="p-5 sm:p-6 bg-secondary/20">
            <h2 className="text-base font-bold text-foreground">Preferences & Security</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Configure system alerts, security credentials, and review platform policies.
            </p>
          </div>

          {/* Row 1: Push Notifications */}
          <div className="flex items-center justify-between p-5 sm:p-6 hover:bg-secondary/20 transition-colors">
            <div className="flex items-start gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
              >
                <Bell size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Push Notifications</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Receive real-time notifications for user registrations, order approvals, and platform alerts.
                </p>
              </div>
            </div>
            <div className="shrink-0 pl-4">
              <Toggle
                id="toggle-push-notifications"
                checked={pushNotifications}
                onChange={(val) => {
                  setPushNotifications(val);
                  toast.success(val ? "Push notifications enabled" : "Push notifications disabled");
                }}
              />
            </div>
          </div>

          {/* Row 2: Change Password */}
          <div className="flex items-center justify-between p-5 sm:p-6 hover:bg-secondary/20 transition-colors">
            <div className="flex items-start gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
              >
                <KeyRound size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Account Password</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Update your Super Admin login password to keep platform administrative access secure.
                </p>
              </div>
            </div>
            <div className="shrink-0 pl-4">
              <button
                type="button"
                id="btn-open-change-password"
                onClick={() => setPasswordModalOpen(true)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary hover:border-border/80 transition-colors cursor-pointer shadow-2xs"
              >
                Change
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Row 3: Commission Rates */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 hover:bg-secondary/20 transition-colors gap-4">
            <div className="flex items-start gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
              >
                <SlidersHorizontal size={18} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground">Commission Rates</p>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Registration Defaults
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Configure default commission rates for upcoming publisher and author registrations, or apply bulk updates to active accounts.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <Building2 size={13} />
                    New Publishers: <strong>{defaultPublisherRate}%</strong>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Feather size={13} />
                    New Authors: <strong>{defaultAuthorRate}%</strong>
                  </span>
                </div>
              </div>
            </div>
            <div className="shrink-0 sm:pl-4">
              <button
                type="button"
                id="btn-open-commission-rates"
                onClick={() => setCommissionRatesModalOpen(true)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary hover:border-border/80 transition-colors cursor-pointer shadow-2xs"
              >
                Set Commission Rate
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Row 3: Privacy Policy */}
          <div className="flex items-center justify-between p-5 sm:p-6 hover:bg-secondary/20 transition-colors">
            <div className="flex items-start gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
              >
                <ShieldCheck size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Privacy Policy</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Review platform data policies, institutional privacy safeguards, and user telemetry governance.
                </p>
              </div>
            </div>
            <div className="shrink-0 pl-4">
              <button
                type="button"
                id="btn-view-privacy-policy"
                onClick={() => setPrivacyModalOpen(true)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary hover:border-border/80 transition-colors cursor-pointer shadow-2xs"
              >
                View
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Row 4: Terms and Conditions */}
          <div className="flex items-center justify-between p-5 sm:p-6 hover:bg-secondary/20 transition-colors">
            <div className="flex items-start gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
              >
                <FileText size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Terms and Conditions</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Institutional digital publishing agreements, licensing frameworks, and platform governance terms.
                </p>
              </div>
            </div>
            <div className="shrink-0 pl-4">
              <button
                type="button"
                id="btn-view-terms-conditions"
                onClick={() => setTermsModalOpen(true)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary hover:border-border/80 transition-colors cursor-pointer shadow-2xs"
              >
                View
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── SECTION 2: COLOR THEMES ────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-xs space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
            <div className="flex items-start gap-3.5">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-2xs"
                style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
              >
                <Palette size={22} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Super Admin Color Theme
                  </h2>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      backgroundColor: "var(--sidebar-highlight)",
                      color: "var(--brand)",
                    }}
                  >
                    <Sparkles size={11} /> 10 Themes Available
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground max-w-2xl">
                  Choose from 10 curated color themes to personalize your Super Admin workspace. The active theme
                  updates sidebar accents, interactive buttons, status badges, and interface highlights in real-time.
                </p>
              </div>
            </div>

            {/* Current Theme Pill & Reset Button */}
            <div className="flex items-center gap-2.5 shrink-0 pl-14 sm:pl-0">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-1.5">
                <span
                  className="h-3.5 w-3.5 rounded-full ring-2 ring-card shadow-2xs"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                />
                <span className="text-xs font-semibold text-foreground">
                  {currentTheme.name}
                </span>
                {isDefault && (
                  <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Default
                  </span>
                )}
              </div>

              {!isDefault && (
                <button
                  type="button"
                  onClick={handleResetTheme}
                  id="btn-reset-color-theme"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shadow-2xs"
                  title="Reset to Classic Teal (Default)"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Active Theme Live Demo Banner */}
          <div
            className="rounded-xl border p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
            style={{
              borderColor: "var(--brand)",
              backgroundColor: "var(--sidebar-highlight)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <div className="flex -space-x-1.5 items-center shrink-0">
                <span
                  className="h-6 w-6 rounded-full ring-2 ring-card shadow-xs"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                />
                <span
                  className="h-6 w-6 rounded-full ring-2 ring-card shadow-xs"
                  style={{ backgroundColor: currentTheme.accentColor }}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Active Theme: {currentTheme.name}{" "}
                  <span className="font-normal text-muted-foreground">— {currentTheme.description}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      backgroundColor: "var(--brand)",
                      color: "var(--brand-contrast)",
                    }}
                  >
                    Active Accent
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {currentTheme.primaryColor}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Component Preview */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="h-8 rounded-lg px-3 text-xs font-semibold shadow-2xs hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                Sample Button
              </button>
              <div
                className="h-8 rounded-lg px-3 text-xs font-semibold border flex items-center gap-1.5"
                style={{
                  borderColor: "var(--brand)",
                  color: "var(--brand)",
                  backgroundColor: "var(--card)",
                }}
              >
                <Check size={13} />
                Selected
              </div>
            </div>
          </div>

          {/* Theme Cards Grid (10 Themes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {PUBLISHER_THEMES.map((theme) => {
              const isSelected = theme.id === currentTheme.id;
              const isDefaultTheme = theme.id === "classic-teal";

              return (
                <button
                  key={theme.id}
                  type="button"
                  id={`btn-theme-${theme.id}`}
                  onClick={() => handleSelectTheme(theme.id, theme.name)}
                  className={`group relative flex flex-col text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer ${isSelected
                    ? "border-[var(--brand)] bg-card shadow-md ring-2 ring-[var(--brand)]/20"
                    : "border-border bg-card/60 hover:bg-secondary/40 hover:border-border/80 hover:shadow-xs"
                    }`}
                >
                  {/* Top Row: Swatches & Selection Badge */}
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className="flex items-center -space-x-1.5">
                      <span
                        className="h-7 w-7 rounded-full shadow-xs ring-2 ring-card shrink-0 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <span
                        className="h-7 w-7 rounded-full shadow-xs ring-2 ring-card shrink-0 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>

                    {isSelected ? (
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full shadow-xs"
                        style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                    ) : (
                      <span
                        className="rounded-md px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/80 border border-border/50"
                      >
                        {theme.tag}
                      </span>
                    )}
                  </div>

                  {/* Theme Info */}
                  <div className="space-y-1 w-full">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-foreground group-hover:text-[var(--brand)] transition-colors">
                        {theme.name}
                      </h3>
                      {isDefaultTheme && (
                        <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  {/* Visual Preview Bar */}
                  <div className="mt-3.5 pt-2.5 border-t border-border/60 w-full flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span
                        className="h-2 w-5 rounded-full"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <span
                        className="h-2 w-3 rounded-full"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
                      {isSelected ? "Active" : "Apply"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── MODALS ─────────────────────────────────────────────────────────── */}
      {passwordModalOpen && (
        <ChangePasswordModal onClose={() => setPasswordModalOpen(false)} />
      )}

      {commissionRatesModalOpen && (
        <SetCommissionRatesModal
          onClose={() => setCommissionRatesModalOpen(false)}
          defaultPublisherRate={defaultPublisherRate}
          defaultAuthorRate={defaultAuthorRate}
          onSaveDefaults={handleSaveDefaultRates}
        />
      )}

      {privacyModalOpen && (
        <DocumentModal
          title="PixelBooks Super Admin Privacy Policy"
          icon={ShieldCheck}
          subtitle="Platform data privacy, governance, and administrator telemetry"
          onClose={() => setPrivacyModalOpen(false)}
        >
          <div className="space-y-3">
            <h3 className="font-bold text-foreground text-sm">1. Information Collection & Usage</h3>
            <p>
              PixelBooks collects and processes platform organization metadata, user profiles, and catalogue
              identifiers exclusively for digital rights management, catalogue indexing, and system operation.
            </p>

            <h3 className="font-bold text-foreground text-sm">2. Content Protection</h3>
            <p>
              Uploaded manuscript files (ePUB, PDF) are stored in secure encrypted vaults with watermarked DRM
              protection. No unauthorized scraping or extraction is permitted.
            </p>

            <h3 className="font-bold text-foreground text-sm">3. Administrative Auditing</h3>
            <p>
              All super administrative actions, status approvals, commission adjustments, and role updates are
              logged in immutable audit records to maintain full compliance and accountability.
            </p>
          </div>
        </DocumentModal>
      )}

      {termsModalOpen && (
        <DocumentModal
          title="Super Admin Terms and Conditions"
          icon={FileText}
          subtitle="Platform administration, distribution, and governance agreement"
          onClose={() => setTermsModalOpen(false)}
        >
          <div className="space-y-3">
            <h3 className="font-bold text-foreground text-sm">1. Administrative Responsibilities</h3>
            <p>
              Super Administrators hold fiduciary responsibility over platform access, role delegations, institutional
              licenses, and content review standards across all PixelBooks portals.
            </p>

            <h3 className="font-bold text-foreground text-sm">2. Royalties & Settlements</h3>
            <p>
              Royalties are calculated based on agreed contractual margins per title. TDS deductions are made in
              accordance with prevailing statutory taxation schedules.
            </p>

            <h3 className="font-bold text-foreground text-sm">3. Warranties & Platform Integrity</h3>
            <p>
              Administrative privileges must be utilized exclusively in adherence to statutory data protection
              laws and PixelBooks cybersecurity standards.
            </p>
          </div>
        </DocumentModal>
      )}
    </AppShell>
  );
}
