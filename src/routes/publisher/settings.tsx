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
  SunMoon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { usePublisherTheme, PUBLISHER_THEMES } from "@/lib/publisher-theme";
import { toast } from "sonner";

export const Route = createFileRoute("/publisher/settings")({
  head: () => ({
    meta: [
      { title: "Publisher Settings — PixelBooks" },
      {
        name: "description",
        content: "Configure publisher color themes, workspace preferences, password, and institutional policies.",
      },
      { property: "og:title", content: "Publisher Settings — PixelBooks" },
      {
        property: "og:description",
        content: "Configure publisher color themes, workspace preferences, password, and institutional policies.",
      },
    ],
  }),
  component: PublisherSettingsPage,
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
              <p className="text-[11px] text-muted-foreground">Update your publisher account credentials</p>
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
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
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
            className="rounded-xl px-4 py-1.5 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Page Component ────────────────────────────────────────────────
function PublisherSettingsPage() {
  const { currentTheme, setTheme, resetToDefault, isDefault } = usePublisherTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

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
              Configure system alerts, security credentials, and review institutional publisher terms.
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
                  Receive browser notifications for eBook sales, royalty payouts, and reader reviews.
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
                  Update your login password to ensure your publisher credentials remain secure.
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
                  Read how PixelBooks safeguards institutional publisher and author metadata.
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
                  Institutional digital publishing agreements, royalties, and content licensing rules.
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
                    Publisher Color Theme
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
                  Choose from 10 curated color themes to personalize your Publisher portal. The active theme
                  updates sidebar accents, interactive buttons, status badges, and chart highlights in real-time.
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
                  className={`group relative flex flex-col text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                    isSelected
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

      {privacyModalOpen && (
        <DocumentModal
          title="PixelBooks Publisher Privacy Policy"
          icon={ShieldCheck}
          subtitle="Institutional publishing privacy and data governance"
          onClose={() => setPrivacyModalOpen(false)}
        >
          <div className="space-y-3">
            <h3 className="font-bold text-foreground text-sm">1. Information Collection & Usage</h3>
            <p>
              PixelBooks collects and processes publisher organization metadata, author profiles, and catalogue
              identifiers exclusively for digital rights management, catalogue indexing, and royalty settlement.
            </p>

            <h3 className="font-bold text-foreground text-sm">2. Content Protection</h3>
            <p>
              Uploaded manuscript files (ePUB, PDF) are stored in secure encrypted vaults with watermarked DRM
              protection. No unauthorized scraping or extraction is permitted.
            </p>

            <h3 className="font-bold text-foreground text-sm">3. Financial Records</h3>
            <p>
              Bank account numbers and IFSC identifiers entered into the Bank Accounts module are encrypted at rest
              using AES-256 and used solely for automated royalty disbursements.
            </p>
          </div>
        </DocumentModal>
      )}

      {termsModalOpen && (
        <DocumentModal
          title="Publisher Terms and Conditions"
          icon={FileText}
          subtitle="Digital distribution, royalties, and licensing agreement"
          onClose={() => setTermsModalOpen(false)}
        >
          <div className="space-y-3">
            <h3 className="font-bold text-foreground text-sm">1. Distribution License</h3>
            <p>
              By uploading titles to the PixelBooks platform, the publisher grants a non-exclusive institutional
              license to distribute digital editions to authorized libraries and academic users.
            </p>

            <h3 className="font-bold text-foreground text-sm">2. Royalties & Settlements</h3>
            <p>
              Royalties are calculated based on agreed contractual margins per title. TDS deductions are made in
              accordance with prevailing statutory taxation schedules.
            </p>

            <h3 className="font-bold text-foreground text-sm">3. Warranties</h3>
            <p>
              The publisher warrants that all submitted content is original or fully licensed, and does not infringe
              upon third-party intellectual property or copyright agreements.
            </p>
          </div>
        </DocumentModal>
      )}
    </AppShell>
  );
}
