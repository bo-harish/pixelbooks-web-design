import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  GraduationCap,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Clock,
  Camera,
  Star,
  BookMarked,
  Sliders,
  Bell,
  Lock,
  Mail,
  Phone,
  Building,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/library-user/profile")({
  head: () => ({
    meta: [
      { title: "Student Profile — PixelBooks E-Library" },
      {
        name: "description",
        content: "Manage student library patron details, reading history, digital reader preferences, and active borrowing limits.",
      },
    ],
  }),
  component: LibraryUserProfilePage,
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

function LibraryUserProfilePage() {
  const [studentName, setStudentName] = useState("Ananya Roy");
  const [studentId, setStudentId] = useState("2023CS10842");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [yearSem, setYearSem] = useState("3rd Year · Semester VI");
  const [institution, setInstitution] = useState("Indian Institute of Technology Delhi");
  const [email, setEmail] = useState("ananya.roy@student.iitd.ac.in");
  const [phone, setPhone] = useState("+91 99102 38472");
  const [readerTheme, setReaderTheme] = useState<"sepia" | "light" | "dark">("sepia");
  const [readerFontSize, setReaderFontSize] = useState<"sm" | "base" | "lg">("base");
  const [expiryReminder, setExpiryReminder] = useState(true);

  const handleSave = () => {
    toast.success("Student profile and reading preferences updated");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Student Portal Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/library-user"
              id="btn-back-to-elibrary"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <GraduationCap size={20} className="text-[oklch(0.62_0.15_155)]" />
                Student Library Profile
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                IIT Delhi Digital Resource Access · Student Patron ID: {studentId}
              </p>
            </div>
          </div>

          <Link
            to="/library-user"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <BookOpen size={14} className="text-[oklch(0.62_0.15_155)]" />
            Back to E-Library
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8 space-y-8">
        {/* Student Identity Card */}
        <SectionCard title="Student Library Patron Identity">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 rounded-xl border border-border bg-emerald-500/5 p-5 dark:bg-emerald-500/10">
              <div className="relative h-24 w-24 shrink-0">
                <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-md">
                  <GraduationCap size={40} />
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("Photo upload opened")}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border text-foreground shadow-sm hover:bg-secondary transition-transform hover:scale-105 cursor-pointer"
                  title="Upload Student Photo"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-lg font-bold text-foreground">{studentName}</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <GraduationCap size={12} /> Student Patron
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={12} /> Active Patron Card
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex items-center gap-1.5">
                  <Building size={13} className="text-muted-foreground shrink-0" />
                  <span>{institution} · {department}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              <Field
                label="Student Full Name"
                required
                value={studentName}
                onChange={setStudentName}
              />
              <Field
                label="Student Roll / Registration ID"
                disabled
                value={studentId}
              />
              <Field
                label="Department"
                disabled
                value={department}
              />
              <Field
                label="Academic Year & Semester"
                disabled
                value={yearSem}
              />
            </div>
          </div>
        </SectionCard>

        {/* Borrowing Status & Limits Summary */}
        <SectionCard title="Borrowing Status & Reading Activity">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[oklch(0.62_0.15_155)]/15 text-[oklch(0.62_0.15_155)]">
                  <BookOpen size={18} />
                </span>
                <span className="text-xs font-medium text-muted-foreground">Currently Borrowed</span>
              </div>
              <p className="text-xl font-extrabold text-foreground tracking-tight">2 of 5 eBooks</p>
              <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-[oklch(0.62_0.15_155)] h-full rounded-full" style={{ width: "40%" }} />
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                  <Clock size={18} />
                </span>
                <span className="text-xs font-medium text-muted-foreground">Reading History</span>
              </div>
              <p className="text-xl font-extrabold text-foreground tracking-tight">24 eBooks Completed</p>
              <p className="text-[11px] text-muted-foreground mt-1">Across 4 Academic Terms</p>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <Bookmark size={18} />
                </span>
                <span className="text-xs font-medium text-muted-foreground">Saved Bookmarks</span>
              </div>
              <p className="text-xl font-extrabold text-foreground tracking-tight">8 Titles Saved</p>
              <p className="text-[11px] text-muted-foreground mt-1">In Personal Reading Shelf</p>
            </div>
          </div>
        </SectionCard>

        {/* Reader Preferences */}
        <SectionCard title="Digital Reader Preferences">
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Default Reader Background Theme</label>
              <div className="flex items-center gap-2">
                {(["sepia", "light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setReaderTheme(t)}
                    className={`flex-1 h-11 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
                      readerTheme === t
                        ? "border-[oklch(0.62_0.15_155)] bg-[oklch(0.62_0.15_155)]/10 text-[oklch(0.62_0.15_155)] font-bold shadow-2xs"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Default Font Size</label>
              <div className="flex items-center gap-2">
                {(["sm", "base", "lg"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReaderFontSize(s)}
                    className={`flex-1 h-11 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
                      readerFontSize === s
                        ? "border-[oklch(0.62_0.15_155)] bg-[oklch(0.62_0.15_155)]/10 text-[oklch(0.62_0.15_155)] font-bold shadow-2xs"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s === "sm" ? "Small (14px)" : s === "base" ? "Base (16px)" : "Large (18px)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-border bg-secondary/20 p-4">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-[oklch(0.62_0.15_155)]" />
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Borrowing & Expiry Email Reminders</h4>
                  <p className="text-[11px] text-muted-foreground">Receive notifications 3 days before book loan due dates</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExpiryReminder(!expiryReminder)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  expiryReminder ? "bg-[oklch(0.62_0.15_155)]" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    expiryReminder ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Contact Details & Security */}
        <SectionCard title="Contact Details & Account Credentials">
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <Field
              label="Student Email Address"
              required
              value={email}
              onChange={setEmail}
              rightSlot={
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Institutional Verified
                </span>
              }
            />
            <Field
              label="Mobile Number"
              required
              value={phone}
              onChange={setPhone}
              rightSlot={
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Verified
                </span>
              }
            />
          </div>
        </SectionCard>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Link
            to="/library-user"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Back to E-Library
          </Link>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white bg-[oklch(0.62_0.15_155)] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
          >
            Save Student Profile
          </button>
        </div>
      </main>
    </div>
  );
}
