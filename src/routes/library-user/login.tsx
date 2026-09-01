import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  GraduationCap,
  Users,
  User,
  Lock,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/library-user/login")({
  head: () => ({
    meta: [
      { title: "Student & Staff Login — PixelBooks" },
      {
        name: "description",
        content: "Institutional portal login and password recovery for students and staff.",
      },
    ],
  }),
  component: UnifiedStudentLoginPage,
});

type UserRole = "student" | "staff";
type LoginMethod = "password" | "otp";
type ViewMode = "login" | "forgot-password";

function UnifiedStudentLoginPage() {
  const navigate = useNavigate();
  
  // Navigation & View Modes
  const [viewMode, setViewMode] = useState<ViewMode>("login");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");

  // Login Form State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password State
  const [forgotId, setForgotId] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotOtpValues, setForgotOtpValues] = useState(["", "", "", ""]);
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Institution Branding
  const institution = {
    name: "Vimala Knowledge Hub",
    location: "Thrissur, Kerala",
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`unified-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`unified-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleForgotOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...forgotOtpValues];
    newOtp[index] = value.slice(-1);
    setForgotOtpValues(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSendOtp = () => {
    if (!identifier.trim()) {
      toast.error(`Please enter your ${selectedRole === "student" ? "Phone Number or Email ID" : "Staff Email/Phone"}`);
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
      toast.success(`OTP Verified! Welcome to ${institution.name} as ${selectedRole === "student" ? "Student" : "Staff"}.`);
      navigate({ to: "/library-user" });
    }, 800);
  };

  const handlePasswordLogin = () => {
    if (!identifier.trim()) {
      toast.error(`Please enter your ${selectedRole === "student" ? "Student / Enrollment ID" : "Staff Employee ID"}`);
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
    }, 800);
  };

  const handleForgotSubmit = () => {
    if (!forgotId.trim()) {
      toast.error(`Please type your ${selectedRole === "student" ? "Student / Enrollment ID" : "Staff Employee ID"}`);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setForgotSubmitted(true);
      toast.success(`Password reset link & OTP sent for ${forgotId}`);
    }, 700);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center p-4 sm:p-6 md:p-8 select-none">
      {/* Top Header with PixelBooks Logo (Fixed top space) */}
      <header className="w-full max-w-[540px] flex items-center justify-between mb-4 sm:mb-6 pt-1 sm:pt-2 shrink-0">
        <Link to="/" id="btn-login-logo-link" className="flex items-center gap-2">
          <img src="/logo.png" alt="PixelBooks Logo" className="h-9 sm:h-[43px] object-contain" />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            id="btn-login-back-home"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors bg-card border border-border px-2.5 py-1 rounded-full shadow-2xs"
          >
            <ArrowLeft size={12} />
            Workspaces
          </Link>
        </div>
      </header>

      {/* Main Container Card (Fixed position below header) */}
      <main className="w-full max-w-[540px] shrink-0">
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-7 pt-4 sm:pt-5 shadow-xl relative overflow-hidden space-y-5">

          {/* VIEW 1: MAIN LOGIN SCREEN */}
          {viewMode === "login" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Vimala College Crest / Logo */}
              <div className="flex flex-col items-center text-center space-y-2 -mt-2.5">
                <div className="relative flex h-36 w-36 sm:h-40 sm:w-40 items-center justify-center p-0 pt-0">
                  <img src="/vimala-logo.png" alt="Vimala College Crest" className="h-full w-full object-contain" />
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-tight">
                    {institution.name}
                  </h1>
                  <p className="text-sm font-semibold text-muted-foreground/90">
                    {institution.location}
                  </p>
                </div>
              </div>

              {/* 1. ROLE SELECTION (Student vs Staff) */}
              <div className="space-y-1.5 pt-2">
                <div className="grid grid-cols-2 gap-1.5 bg-secondary/70 p-1 rounded-2xl border border-border/60">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole("student");
                      setOtpSent(false);
                    }}
                    id="tab-role-student"
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedRole === "student"
                        ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-500/20"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <GraduationCap size={15} />
                    Student
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole("staff");
                      setOtpSent(false);
                    }}
                    id="tab-role-staff"
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedRole === "staff"
                        ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-500/20"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Users size={15} />
                    Staff
                  </button>
                </div>
              </div>

              {/* 2. FORM BODY (No second tab bar) */}
              <div className="space-y-4 pt-1">
                {/* PRIMARY METHOD: STUDENT/STAFF ID & PASSWORD */}
                {loginMethod === "password" && (
                  <div className="space-y-3.5 animate-in fade-in duration-150">
                    {/* Student/Staff ID Field */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                        {selectedRole === "student" ? "Student / Enrollment ID" : "Staff Employee ID"}
                        <span className="text-rose-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder={selectedRole === "student" ? "Type Student / Enrollment ID" : "Type Staff Employee ID"}
                          className="w-full h-11 rounded-xl border border-slate-200 dark:border-border/80 bg-card pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
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
                          className="w-full h-11 rounded-xl border border-slate-200 dark:border-border/80 bg-card pl-10 pr-10 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      <div className="text-right pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setForgotId(identifier);
                            setForgotSubmitted(false);
                            setViewMode("forgot-password");
                          }}
                          id="btn-open-forgot-password"
                          className="text-xs font-semibold text-muted-foreground hover:text-foreground underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </div>

                    {/* Primary Login Button */}
                    <button
                      type="button"
                      onClick={handlePasswordLogin}
                      disabled={isSubmitting}
                      id="btn-unified-password-login"
                      className={`w-full h-11 rounded-full font-semibold text-sm transition-all shadow-sm cursor-pointer mt-1 ${
                        identifier.trim() && password.trim()
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-secondary text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {isSubmitting ? "Authenticating..." : "Login"}
                    </button>

                    {/* Subtle Divider */}
                    <div className="relative my-3 text-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/70" />
                      </div>
                      <div className="relative flex justify-center text-[11px]">
                        <span className="bg-card px-2 text-muted-foreground font-medium">or continue with</span>
                      </div>
                    </div>

                    {/* One-Click OTP Alternative Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod("otp");
                        setOtpSent(false);
                      }}
                      id="btn-switch-to-otp-mode"
                      className="w-full h-10 rounded-full border border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Smartphone size={14} />
                      Sign in with Phone / Email OTP
                    </button>
                  </div>
                )}

                {/* SECONDARY METHOD: PHONE/EMAIL OTP FLOW */}
                {loginMethod === "otp" && (
                  <div className="space-y-3.5 animate-in fade-in duration-150">
                    {!otpSent ? (
                      <div className="space-y-3.5">
                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
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
                              className="w-full h-11 rounded-xl border border-slate-200 dark:border-border/80 bg-card pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isSubmitting}
                          id="btn-unified-send-otp"
                          className={`w-full h-11 rounded-full font-semibold text-sm transition-all shadow-sm cursor-pointer mt-1 ${
                            identifier.trim()
                              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                              : "bg-secondary text-muted-foreground cursor-not-allowed"
                          }`}
                        >
                          {isSubmitting ? "Sending 4-Digit OTP..." : "Get OTP & Login"}
                        </button>
                      </div>
                    ) : (
                      /* 4-Digit OTP Input Box Inline */
                      <div className="space-y-4 bg-secondary/30 border border-border p-4 rounded-2xl animate-in fade-in duration-200">
                        <div className="text-center space-y-1">
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                            <KeyRound size={14} /> Enter 4-Digit OTP
                          </span>
                          <p className="text-[11px] text-muted-foreground">
                            Sent to <span className="font-semibold text-foreground">{identifier}</span>
                          </p>
                        </div>

                        <div className="flex justify-center gap-3 py-1">
                          {otpValues.map((digit, idx) => (
                            <input
                              key={idx}
                              id={`unified-otp-${idx}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="h-11 w-11 rounded-xl border-2 border-border bg-background text-center text-lg font-bold text-foreground focus:border-emerald-500 focus:outline-none transition-all"
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            Change Input
                          </button>
                          <button
                            type="button"
                            onClick={() => toast.success("Resent 4-Digit OTP code")}
                            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw size={12} /> Resend OTP
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isSubmitting}
                          id="btn-unified-verify-otp"
                          className="w-full h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
                        >
                          {isSubmitting ? "Verifying..." : "Verify OTP & Continue"}
                        </button>
                      </div>
                    )}

                    {/* Subtle Divider */}
                    <div className="relative my-3 text-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/70" />
                      </div>
                      <div className="relative flex justify-center text-[11px]">
                        <span className="bg-card px-2 text-muted-foreground font-medium">or continue with</span>
                      </div>
                    </div>

                    {/* Switch Back to Password Login */}
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod("password");
                        setOtpSent(false);
                      }}
                      id="btn-switch-to-password-mode"
                      className="w-full h-10 rounded-full border border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Lock size={14} />
                      Sign in with {selectedRole === "student" ? "Student ID" : "Staff ID"} & Password
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: FORGOT PASSWORD SCREEN (Matching Image 4) */}
          {viewMode === "forgot-password" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Back to Login Link */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setViewMode("login")}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Login
                </button>

                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 capitalize bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {selectedRole} Account
                </span>
              </div>

              {!forgotSubmitted ? (
                <div className="space-y-6 text-center py-2">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a233a] dark:text-foreground tracking-tight">
                    Forgot Password
                  </h2>

                  {/* Text Box with Label Above and Red Asterisk matching attached design */}
                  <div className="space-y-1.5 text-left mt-6">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                      {selectedRole === "student" ? "Student / Enrollment ID" : "Staff Employee ID"}
                      <span className="text-rose-500 ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={forgotId}
                        onChange={(e) => setForgotId(e.target.value)}
                        placeholder={selectedRole === "student" ? "Type Student / Enrollment ID" : "Type Staff Employee ID"}
                        className="w-full h-12 rounded-xl border border-slate-200 dark:border-border/80 bg-card px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Forgot Password Action Button */}
                  <button
                    type="button"
                    onClick={handleForgotSubmit}
                    disabled={isSubmitting}
                    id="btn-submit-forgot-password"
                    className={`w-full h-12 rounded-full font-semibold text-sm transition-all shadow-sm cursor-pointer mt-4 ${
                      forgotId.trim()
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-secondary text-muted-foreground cursor-not-allowed opacity-80"
                    }`}
                  >
                    {isSubmitting ? "Submitting Request..." : "Forgot Password?"}
                  </button>
                </div>
              ) : (
                /* Forgot Password Confirmation & OTP Step */
                <div className="space-y-5 bg-secondary/30 border border-border p-5 rounded-2xl text-center animate-in fade-in duration-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto">
                    <CheckCircle2 size={24} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Reset Request Submitted</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      A 4-digit password reset OTP has been sent for ID <span className="font-semibold text-foreground">{forgotId}</span> to your registered email & phone.
                    </p>
                  </div>

                  <div className="py-2">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-2">
                      Enter Reset OTP:
                    </span>
                    <div className="flex justify-center gap-3">
                      {forgotOtpValues.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`forgot-otp-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleForgotOtpChange(idx, e.target.value)}
                          className="h-11 w-11 rounded-xl border-2 border-border bg-background text-center text-lg font-bold text-foreground focus:border-emerald-500 focus:outline-none"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      toast.success("Password reset verified! Please enter your new password upon logging in.");
                      setViewMode("login");
                    }}
                    className="w-full h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
                  >
                    Reset & Return to Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer (Dynamic bottom space) */}
      <footer className="w-full text-center text-xs text-muted-foreground mt-auto pt-8 pb-4 flex items-center justify-center gap-2 shrink-0">
        <img src="/logo-app-icon.png" alt="PixelBooks Icon" className="h-4 w-4 object-contain" />
        <span>© 2026 {institution.name} · Powered by PixelBooks</span>
      </footer>
    </div>
  );
}
