import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  BookMarked,
  Library,
  GraduationCap,
  ShieldCheck,
  Building2,
  User,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/institutions/login")({
  head: () => ({
    meta: [
      { title: "Institutions Login — PixelBooks" },
      {
        name: "description",
        content: "Institutional portal login gateway for publishers, library administrators, and students & staff.",
      },
    ],
  }),
  component: InstitutionsLoginPage,
});

/**
 * Institutional Portal External Links.
 * Box 1 (Publisher) and Box 2 (Library Admin) open in a new window.
 */
export const INSTITUTION_LINKS = {
  publisherUrl: "https://partner.pixelbooksapp.com/publisher",
  libraryAdminUrl: "https://libadmin.pixelbooksapp.com/",
};

function InstitutionsLoginPage() {
  const navigate = useNavigate();
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);

  // Institution Branding details
  const institution = {
    name: "Vimala Knowledge Hub",
    location: "Thrissur, Kerala",
  };

  // Student / Staff Form View & Method States
  const [viewMode, setViewMode] = useState<"login" | "forgot-password">("login");
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");

  // Credentials State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);

  // Forgot Password State
  const [forgotId, setForgotId] = useState("");

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`portal-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`portal-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePasswordLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      toast.error("Please enter your Student / Staff Login ID");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Welcome back! Authenticated as ${identifier}`);
      navigate({ to: "/library-user" });
    }, 600);
  };

  const handleSendOtp = () => {
    if (!identifier.trim()) {
      toast.error("Please enter your Phone Number or Email ID");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpSent(true);
      toast.success(`4-Digit OTP sent to ${identifier}`);
    }, 600);
  };

  const handleVerifyOtp = () => {
    const fullOtp = otpValues.join("");
    if (fullOtp.length < 4) {
      toast.error("Please enter the complete 4-digit OTP");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`OTP Verified! Welcome to ${institution.name}.`);
      navigate({ to: "/library-user" });
    }, 700);
  };

  const handleForgotSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!forgotId.trim()) {
      toast.error("Please enter your Login ID");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Password reset instructions sent for ${forgotId}`);
      setViewMode("login");
    }, 700);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center p-4 sm:p-6 md:p-8 pt-3 sm:pt-5 select-none">
      {/* Top Header with PixelBooks Logo */}
      <header className="w-full max-w-6xl flex items-center justify-between mb-3 sm:mb-4 pt-0 shrink-0 px-1">
        <Link to="/" id="btn-login-logo-link" className="flex items-center gap-2">
          <img src="/logo.png" alt="PixelBooks Logo" className="h-7 sm:h-[34px] object-contain" />
        </Link>
        <div className="flex items-center gap-2" />
      </header>

      {/* Main Container Card matching reference design */}
      <main className="w-full max-w-6xl shrink-0 mt-0 sm:mt-1">
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 md:p-10 pt-5 sm:pt-6 shadow-xl relative overflow-hidden space-y-6 sm:space-y-7">
          {/* Top Section: Logo to the Left, Rest of Content to the Right */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-7 text-center sm:text-left pb-5 sm:pb-6 border-b border-border/40">
            {/* Crest Institutional Badge Container */}
            <div className="relative flex h-32 w-32 sm:h-44 sm:w-44 md:h-48 md:w-48 shrink-0 items-center justify-center rounded-2xl bg-white p-1 sm:p-1.5 shadow-md border border-slate-200/80 dark:border-white/15 dark:shadow-lg dark:shadow-black/20">
              <img
                src="/vimala-logo.png"
                alt="Vimala College Crest"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
                {institution.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground/90">
                {institution.location}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground/80 pt-1 leading-relaxed">
                Institutional portal to distribute and access academic books and journals for students and staff.
              </p>
            </div>
          </div>

          {/* Wisely Redesigned Layout:
              Left Column (lg:col-span-5): Institutional Portals (Publisher Teal & Library Admin Royal Blue)
              Right Column (lg:col-span-7): Primary Student / Staff Login Form (Author Light Green)
          */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch pt-2">
            {/* ─── LEFT: Institutional Portals Stack (Publisher & Library Admin) ─── */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-5 sm:gap-6">
              {/* BOX 1: Publisher Login (Index Page Publisher Teal) */}
              <a
                id="box-publisher-login"
                href={INSTITUTION_LINKS.publisherUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredBox("publisher")}
                onMouseLeave={() => setHoveredBox(null)}
                className="group relative flex flex-1 flex-col justify-between rounded-2xl border border-border bg-card/60 hover:bg-card/90 p-6 sm:p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer text-foreground no-underline"
                style={{
                  borderColor:
                    hoveredBox === "publisher"
                      ? "oklch(0.55 0.11 195 / 0.6)"
                      : undefined,
                  boxShadow:
                    hoveredBox === "publisher"
                      ? "0 16px 32px -12px rgba(4, 150, 180, 0.25)"
                      : undefined,
                }}
              >
                <div className="space-y-3.5">
                  {/* Header Tag & External Icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide"
                      style={{
                        color: "oklch(0.55 0.11 195)",
                        backgroundColor: "color-mix(in oklab, oklch(0.55 0.11 195) 12%, transparent)",
                      }}
                    >
                      Publishing
                    </span>
                    <ExternalLink
                      size={14}
                      className="text-muted-foreground/60 transition-colors"
                      style={{
                        color: hoveredBox === "publisher" ? "oklch(0.55 0.11 195)" : undefined,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110 shrink-0 shadow-xs"
                      style={{
                        color: "oklch(0.55 0.11 195)",
                        backgroundColor: "color-mix(in oklab, oklch(0.55 0.11 195) 12%, transparent)",
                      }}
                    >
                      <BookMarked size={22} strokeWidth={2} />
                    </div>
                    <div>
                      <h2
                        className="text-base font-bold text-foreground leading-tight transition-colors"
                        style={{
                          color: hoveredBox === "publisher" ? "oklch(0.55 0.11 195)" : undefined,
                        }}
                      >
                        Publisher Login
                      </h2>
                      <p className="text-xs text-muted-foreground/90 font-medium">
                        Campus Publisher
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground/80 leading-relaxed">
                    Publish and distribute internal books, academic journals, and course literature exclusively for students and faculty across the institution.
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-border/40">
                  <div
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-white transition-all shadow-sm group-hover:shadow-md cursor-pointer hover:opacity-90"
                    style={{
                      backgroundColor: "oklch(0.55 0.11 195)",
                    }}
                  >
                    <span>Publisher Login</span>
                    <ExternalLink size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </a>

              {/* BOX 2: Library Admin (Index Page Royal Blue) */}
              <a
                id="box-library-admin-login"
                href={INSTITUTION_LINKS.libraryAdminUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredBox("library-admin")}
                onMouseLeave={() => setHoveredBox(null)}
                className="group relative flex flex-1 flex-col justify-between rounded-2xl border border-border bg-card/60 hover:bg-card/90 p-6 sm:p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer text-foreground no-underline"
                style={{
                  borderColor:
                    hoveredBox === "library-admin"
                      ? "oklch(0.55 0.13 260 / 0.6)"
                      : undefined,
                  boxShadow:
                    hoveredBox === "library-admin"
                      ? "0 16px 32px -12px rgba(79, 70, 229, 0.25)"
                      : undefined,
                }}
              >
                <div className="space-y-3.5">
                  {/* Header Tag & External Icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide"
                      style={{
                        color: "oklch(0.55 0.13 260)",
                        backgroundColor: "color-mix(in oklab, oklch(0.55 0.13 260) 12%, transparent)",
                      }}
                    >
                      Administration
                    </span>
                    <ExternalLink
                      size={14}
                      className="text-muted-foreground/60 transition-colors"
                      style={{
                        color: hoveredBox === "library-admin" ? "oklch(0.55 0.13 260)" : undefined,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110 shrink-0"
                      style={{
                        color: "oklch(0.55 0.13 260)",
                        backgroundColor: "color-mix(in oklab, oklch(0.55 0.13 260) 12%, transparent)",
                      }}
                    >
                      <Library size={22} strokeWidth={2} />
                    </div>
                    <div>
                      <h2
                        className="text-base font-bold text-foreground leading-tight transition-colors"
                        style={{
                          color: hoveredBox === "library-admin" ? "oklch(0.55 0.13 260)" : undefined,
                        }}
                      >
                        Library Admin
                      </h2>
                      <p className="text-xs text-muted-foreground/90 font-medium">
                        Institution Administrator
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground/80 leading-relaxed">
                    Centrally manage eBook collections, borrow limits, and license allocations across all departmental libraries in the organization.
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-border/40">
                  <div
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-white transition-all shadow-sm group-hover:shadow-md cursor-pointer hover:opacity-90"
                    style={{
                      backgroundColor: "oklch(0.55 0.13 260)",
                    }}
                  >
                    <span>Library Admin</span>
                    <ExternalLink size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </a>
            </div>

            {/* ─── RIGHT: Student / Staff Login In-Page Form (Author Light Green) ─── */}
            <div
              id="box-student-staff-login"
              className="lg:col-span-7 rounded-2xl border-2 bg-card/90 p-6 sm:p-7 md:p-8 shadow-sm backdrop-blur-md transition-all duration-300 flex flex-col justify-between"
              style={{
                borderColor: "oklch(0.62 0.15 155 / 0.45)",
                boxShadow: "0 16px 36px -12px rgba(16, 185, 129, 0.18)",
              }}
            >
              {viewMode === "login" ? (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Card Header: Badge & Reader Portal Label */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide"
                      style={{
                        color: "oklch(0.62 0.15 155)",
                        backgroundColor: "color-mix(in oklab, oklch(0.62 0.15 155) 12%, transparent)",
                      }}
                    >
                      Library Portal
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground/90 flex items-center gap-1">
                      <ShieldCheck size={13} style={{ color: "oklch(0.62 0.15 155)" }} />
                      Reader Sign In
                    </span>
                  </div>

                  {/* Title & Icon Header */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0 shadow-xs"
                      style={{
                        color: "oklch(0.62 0.15 155)",
                        backgroundColor: "color-mix(in oklab, oklch(0.62 0.15 155) 14%, transparent)",
                      }}
                    >
                      <GraduationCap size={24} strokeWidth={2} />
                    </div>
                    <div>
                      <h2
                        className="text-lg font-bold leading-tight"
                        style={{ color: "oklch(0.62 0.15 155)" }}
                      >
                        Student / Staff Login
                      </h2>
                      <p className="text-xs text-muted-foreground/90 font-medium">
                        Library Reader Portal
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground/80 leading-relaxed">
                    Access the institutional digital library, read assigned e-books, explore university collections, and track reading progress.
                  </p>

                  {/* Method Switcher Tabs: Password vs OTP */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-secondary/40 border border-border/60">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod("password");
                        setOtpSent(false);
                      }}
                      className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${loginMethod === "password"
                        ? "bg-card text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Lock size={13} />
                      <span>Login ID & Password</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod("otp");
                        setOtpSent(false);
                      }}
                      className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${loginMethod === "otp"
                        ? "bg-card text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Smartphone size={13} />
                      <span>Phone / Email OTP</span>
                    </button>
                  </div>

                  {/* Method 1: Password Form */}
                  {loginMethod === "password" ? (
                    <form onSubmit={handlePasswordLogin} className="space-y-3.5 pt-1">
                      {/* Login ID Field */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-foreground block">
                          Student / Staff Login ID<span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            <User size={16} />
                          </div>
                          <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Type Login ID"
                            autoComplete="username"
                            className="w-full h-10 rounded-xl border border-border bg-card pl-10 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all shadow-2xs"
                            style={{
                              borderColor: identifier ? "oklch(0.62 0.15 155 / 0.5)" : undefined,
                            }}
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-foreground block">
                          Password<span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            <Lock size={16} />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full h-10 rounded-xl border border-border bg-card pl-10 pr-10 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all shadow-2xs"
                            style={{
                              borderColor: password ? "oklch(0.62 0.15 155 / 0.5)" : undefined,
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-0.5">
                          <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="rounded border-border text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>Remember Login ID</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setForgotId(identifier);
                              setViewMode("forgot-password");
                            }}
                            id="btn-open-forgot-password"
                            className="text-[11px] font-semibold text-muted-foreground hover:text-foreground underline cursor-pointer"
                          >
                            Forgot Password?
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        id="btn-portal-password-login"
                        className="flex w-full h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg cursor-pointer hover:opacity-90 disabled:opacity-50 mt-1.5"
                        style={{
                          backgroundColor: "oklch(0.62 0.15 155)",
                        }}
                      >
                        <span>{isSubmitting ? "Authenticating..." : "Sign In to Library"}</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </form>
                  ) : (
                    /* Method 2: OTP Form */
                    <div className="space-y-3.5 pt-1 animate-in fade-in duration-150">
                      {!otpSent ? (
                        <div className="space-y-3">
                          <div className="space-y-1.5 text-left">
                            <label className="text-xs font-bold text-foreground block">
                              Phone Number / Email ID<span className="text-rose-500 ml-0.5">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                <Smartphone size={16} />
                              </div>
                              <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Type Phone Number or Email ID"
                                className="w-full h-10 rounded-xl border border-border bg-card pl-10 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all shadow-2xs"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isSubmitting}
                            className="flex w-full h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg cursor-pointer hover:opacity-90 disabled:opacity-50"
                            style={{
                              backgroundColor: "oklch(0.62 0.15 155)",
                            }}
                          >
                            <span>{isSubmitting ? "Sending 4-Digit OTP..." : "Get OTP & Login"}</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3.5 bg-secondary/30 border border-border p-4 rounded-xl">
                          <div className="text-center space-y-1">
                            <span
                              className="text-xs font-semibold flex items-center justify-center gap-1"
                              style={{ color: "oklch(0.62 0.15 155)" }}
                            >
                              <KeyRound size={14} /> Enter 4-Digit OTP
                            </span>
                            <p className="text-[11px] text-muted-foreground">
                              Sent to <span className="font-semibold text-foreground">{identifier}</span>
                            </p>
                          </div>

                          <div className="flex justify-center gap-2.5 py-1">
                            {otpValues.map((digit, idx) => (
                              <input
                                key={idx}
                                id={`portal-otp-${idx}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                className="h-10 w-10 rounded-lg border-2 border-border bg-background text-center text-base font-bold text-foreground focus:outline-none transition-all"
                                style={{
                                  borderColor: digit ? "oklch(0.62 0.15 155)" : undefined,
                                }}
                              />
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <button
                              type="button"
                              onClick={() => setOtpSent(false)}
                              className="text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              Change Number/Email
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.success("Resent 4-Digit OTP code")}
                              className="font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                              style={{ color: "oklch(0.62 0.15 155)" }}
                            >
                              <RefreshCw size={11} /> Resend OTP
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={isSubmitting}
                            className="flex w-full h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg cursor-pointer hover:opacity-90 disabled:opacity-50"
                            style={{
                              backgroundColor: "oklch(0.62 0.15 155)",
                            }}
                          >
                            <span>{isSubmitting ? "Verifying..." : "Verify OTP & Continue"}</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Forgot Password Inline View */
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setViewMode("login")}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft size={13} /> Back to Sign In
                    </button>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide"
                      style={{
                        color: "oklch(0.62 0.15 155)",
                        backgroundColor: "color-mix(in oklab, oklch(0.62 0.15 155) 12%, transparent)",
                      }}
                    >
                      Account Recovery
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Password Recovery</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Enter your Student / Staff Login ID to receive password reset instructions and an authentication link.
                    </p>
                  </div>

                  <form onSubmit={handleForgotSubmit} className="space-y-3.5 pt-2">
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-foreground block">
                        Student / Staff Login ID<span className="text-rose-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          value={forgotId}
                          onChange={(e) => setForgotId(e.target.value)}
                          placeholder="Type Login ID"
                          required
                          className="w-full h-10 rounded-xl border border-border bg-card pl-10 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all shadow-2xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-white transition-all shadow-md hover:shadow-lg cursor-pointer hover:opacity-90 disabled:opacity-50"
                      style={{
                        backgroundColor: "oklch(0.62 0.15 155)",
                      }}
                    >
                      <span>{isSubmitting ? "Sending Reset Link..." : "Send Reset Link & OTP"}</span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Dynamic bottom space) */}
      <footer className="w-full text-center text-xs text-muted-foreground mt-auto pt-8 pb-4 flex items-center justify-center gap-2 shrink-0">
        <img src="/logo-app-icon.png" alt="PixelBooks Icon" className="h-4 w-4 object-contain" />
        <span>Copyright 2026 PixelBooks</span>
      </footer>
    </div>
  );
}
