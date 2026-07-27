import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  User,
  Building2,
  Percent,
  Sparkles,
  CheckCircle2,
  Calendar,
  Save,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  Building,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/pb-admin/commission-rates_/$id")({
  component: CommissionRatesDetail,
});

function CommissionRatesDetail() {
  const navigate = useNavigate();

  // Mock entity data (Supports Author or Publisher view)
  const [authorData, setAuthorData] = useState({
    name: "Werley Nortreus",
    type: "Author" as "Author" | "Publisher",
    country: "India",
    pan: "ASDFG4567Y",
    gst: "27AAAAA0000A1Z5",
    address1: "Sharma Market, Shiv Mandir, Main Dadri Road",
    address2: "Sector 102",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201304",
    email: "werley@brandoptics.com",
    phone: "+91 77788 89990",
    accountDetails: "HDFC Bank - A/C **** 4892 (IFSC: HDFC0000123)",
    commissionRate: "15",
    isCustom: false,
    updatedDate: "14 Jul 2026",
    avatarBg: "oklch(0.55 0.11 195)",
  });

  const [rateValue, setRateValue] = useState(authorData.commissionRate);
  const [isRateCustom, setIsRateCustom] = useState(authorData.isCustom);
  const [isSaved, setIsSaved] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUpdate = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <AppShell
      title="Commission & Profile Details"
      subtitle="View profile information and set custom commission rates."
    >
      <div className="flex-1 flex flex-col min-h-0 bg-background">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Back Button */}
            <div className="flex items-center gap-3">
              <Link
                to="/pb-admin/commission-rates"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                aria-label="Back to Commission Rates"
              >
                <ArrowLeft size={16} />
              </Link>
              <span className="text-sm font-normal text-foreground">
                Back to Commission Rates
              </span>
            </div>

            {/* Profile & High-Visibility Commission Banner Hero Card */}
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Profile Pic matching pb-admin/publishers-authors avatar style */}
                <div className="flex items-start sm:items-center gap-5">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow-sm"
                    style={{ background: authorData.avatarBg }}
                  >
                    {getInitials(authorData.name)}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                        {authorData.name}
                      </h2>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                        {authorData.type === "Publisher" ? (
                          <Building2 size={13} className="text-muted-foreground/80" />
                        ) : (
                          <User size={13} className="text-muted-foreground/80" />
                        )}
                        <span>{authorData.type}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail size={13} className="text-muted-foreground/80" />
                        {authorData.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={13} className="text-muted-foreground/80" />
                        {authorData.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-muted-foreground/80" />
                        {authorData.city}, {authorData.country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Highlighted Commission Rate Card in Header */}
                <div className="flex items-center gap-4 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4 sm:p-5 lg:min-w-[280px]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-white shadow-md">
                    <Percent size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Active Commission Rate
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-black text-foreground tracking-tight">
                        {rateValue}%
                      </span>
                      {isRateCustom ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Sparkles size={10} /> Custom
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck size={10} /> Default Base
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar size={11} /> Last updated: {authorData.updatedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prominently Highlighted Commission Rate Management Card */}
            <div className="rounded-xl border-2 border-[var(--brand)]/40 bg-card p-6 md:p-8 shadow-md relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
                      <Percent size={16} />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">
                      Commission Rate Settings
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Set a custom percentage rate or revert to platform standard defaults.
                  </p>
                </div>

                {isSaved && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={14} /> Commission Updated Successfully
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                {/* Rate Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    Commission Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={rateValue}
                      onChange={(e) => setRateValue(e.target.value)}
                      className="h-12 w-full rounded-xl border-2 border-border bg-card px-4 pr-12 text-lg font-extrabold text-foreground outline-none transition-colors focus:border-[var(--brand)]"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="absolute right-4 flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground font-bold text-sm">
                      %
                    </span>
                  </div>
                </div>

                {/* Rate Type Selector Toggle */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    Rate Contract Type
                  </label>
                  <div className="flex items-center gap-2 h-12 p-1 rounded-xl border border-border bg-muted/30">
                    <button
                      type="button"
                      onClick={() => setIsRateCustom(false)}
                      className={`flex-1 h-full rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        !isRateCustom
                          ? "bg-card text-foreground shadow-xs border border-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Default Rate (15%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRateCustom(true)}
                      className={`flex-1 h-full rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isRateCustom
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-xs border border-amber-500/30"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Custom Override
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="h-12 w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-6 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-98 cursor-pointer"
                  >
                    <Save size={16} />
                    Update Commission
                  </button>
                </div>
              </div>
            </div>

            {/* Profile & Business Details Form Cards */}
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Left Column: Address & Contact */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-sm font-bold text-foreground flex items-center gap-2">
                      <Building size={16} className="text-[var(--brand)]" />
                      Company & Address Info
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          {authorData.type} Name
                        </label>
                        <input
                          readOnly
                          value={authorData.name}
                          className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          PAN Card Number
                        </label>
                        <input
                          readOnly
                          value={authorData.pan}
                          className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium font-mono text-foreground outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Address Line 1
                        </label>
                        <input
                          readOnly
                          value={authorData.address1}
                          className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Address Line 2
                        </label>
                        <input
                          readOnly
                          value={authorData.address2}
                          className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                            City
                          </label>
                          <input
                            readOnly
                            value={authorData.city}
                            className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                            Pincode
                          </label>
                          <input
                            readOnly
                            value={authorData.pincode}
                            className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 pt-2 text-sm font-bold text-foreground flex items-center gap-2">
                      <Mail size={16} className="text-[var(--brand)]" />
                      Contact Communication
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Email Address
                        </label>
                        <input
                          readOnly
                          value={authorData.email}
                          className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Phone Number
                        </label>
                        <input
                          readOnly
                          value={authorData.phone}
                          className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Country & Financial Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-sm font-bold text-foreground flex items-center gap-2">
                      <CreditCard size={16} className="text-[var(--brand)]" />
                      Tax & Regional Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Country
                        </label>
                        <input
                          readOnly
                          value={authorData.country}
                          className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          GST Registration Number
                        </label>
                        <input
                          readOnly
                          value={authorData.gst}
                          className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium font-mono text-foreground outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          State
                        </label>
                        <input
                          readOnly
                          value={authorData.state}
                          className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 pt-2 text-sm font-bold text-foreground flex items-center gap-2">
                      <CreditCard size={16} className="text-[var(--brand)]" />
                      Bank Account Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Disbursement Bank Account
                        </label>
                        <input
                          readOnly
                          value={authorData.accountDetails}
                          className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => navigate({ to: "/pb-admin/commission-rates" })}
                className="h-11 rounded-lg border border-border bg-card px-5 text-sm font-normal text-muted-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
              >
                Back to Listing
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="h-11 rounded-lg bg-[var(--brand)] px-6 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Save size={16} />
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
