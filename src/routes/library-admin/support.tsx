import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  Send,
  PhoneCall,
  CheckCircle2,
  Clock,
  Paperclip,
  X,
  FileText,
  ChevronDown,
  HelpCircle,
  LifeBuoy,
  MessageSquare,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/library-admin/support")({
  head: () => ({
    meta: [
      { title: "Support — Library Admin — PixelBooks" },
      {
        name: "description",
        content: "Institutional library support for Vimala College, managing student licenses, allocations, and digital reader inquiries.",
      },
    ],
  }),
  component: LibraryAdminSupportPage,
});

interface LibrarySupportTicket {
  id: string;
  subject: string;
  category: string;
  status: "In Progress" | "Resolved" | "Under Review";
  createdAt: string;
  lastUpdate: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  department?: string;
  description: string;
  resolutionNotes?: string;
}

const initialTickets: LibrarySupportTicket[] = [
  {
    id: "LIB-9204",
    subject: "Batch Student Import: Duplicate Enrollment ID Error",
    category: "Student Account Access & Batches",
    status: "In Progress",
    priority: "High",
    department: "Computer Science",
    createdAt: "Sep 06, 2026",
    lastUpdate: "1 hour ago",
    description:
      "When uploading CSV of 240 first-year B.Sc Computer Science students, row 42 returned an error for ID 'CS-2026-042'.",
    resolutionNotes:
      "Our institutional support engineer cleared the unassigned legacy record from the previous academic year. Re-running the batch now.",
  },
  {
    id: "LIB-8930",
    subject: "Department Allocation License Quota Top-Up",
    category: "Institutional Licensing",
    status: "Resolved",
    priority: "Medium",
    department: "Commerce & Management",
    createdAt: "Aug 29, 2026",
    lastUpdate: "Aug 30, 2026",
    description:
      "Requested allocation of 50 additional concurrent eBook borrow licenses for Semester 5 Financial Accounting.",
    resolutionNotes:
      "Approved and credited under Institutional License Agreement #VIM-2026-LIC-08.",
  },
  {
    id: "LIB-8715",
    subject: "Offline eReader Annotation Syncing on Campus WiFi",
    category: "Interactive Reader & Offline Sync",
    status: "Resolved",
    priority: "Low",
    department: "General Campus",
    createdAt: "Aug 18, 2026",
    lastUpdate: "Aug 19, 2026",
    description:
      "Students reported that highlights made while offline did not automatically sync when reconnecting to campus eduroam WiFi.",
    resolutionNotes:
      "Firewall rule for port 8443 on institutional network whitelisted. Offline sync service operational.",
  },
];

const categories = [
  "Institutional Licensing",
  "Student Account Access & Batches",
  "Budget & Borrowing Limits",
  "Department Allocation",
  "Interactive Reader & Offline Sync",
  "LMS / SSO Integration",
  "Digital Catalogue Ordering",
  "General Support",
] as const;

const priorityOptions = [
  "Low — General Question",
  "Medium — Standard Request",
  "High — Urgent Academic Need",
  "Critical — Campus Access Blocker",
] as const;

const departments = [
  "Computer Science",
  "Commerce & Management",
  "English Literature",
  "Mathematics & Statistics",
  "Physics & Chemistry",
  "Social Sciences",
  "General Administration",
] as const;

const faqItems = [
  {
    q: "How do I allocate additional borrowing limits to a department?",
    a: "Navigate to Departments in your Library Admin portal, select the target department, and click 'Edit Allocation' to adjust concurrent copies and annual budget.",
  },
  {
    q: "What CSV column headers are required for student batch onboarding?",
    a: "Required columns are: EnrollmentID, FullName, CollegeEmail, Department, and AcademicYear. You can download the sample template from the Library Users page.",
  },
  {
    q: "How does the interactive eBook reader handle offline borrowing?",
    a: "Students can download authorized titles to their device. Licenses expire automatically after the loan duration (default 14 days) unless renewed.",
  },
  {
    q: "How can I generate accreditation and NIRF library usage reports?",
    a: "Visit Orders & Usage reports to export certified digital library circulation statistics, hourly reading timestamps, and department-wise consumption metrics in PDF or Excel.",
  },
];

function LibraryAdminSupportPage() {
  // Form State
  const [adminName, setAdminName] = useState("Dr. Sr. Beena Jose");
  const [email, setEmail] = useState("library.admin@vimala.edu");
  const [category, setCategory] = useState<string>("Institutional Licensing");
  const [priority, setPriority] = useState<string>("Medium — Standard Request");
  const [department, setDepartment] = useState<string>("Computer Science");
  const [studentIdRef, setStudentIdRef] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tickets State
  const [tickets, setTickets] = useState<LibrarySupportTicket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<LibrarySupportTicket | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File exceeds 10MB limit. Please upload a smaller file.");
        return;
      }
      setAttachment(file);
      toast.success(`Attached ${file.name}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminName.trim()) {
      toast.error("Please enter the administrator name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid institutional email address.");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter a subject for the support request.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter your message or issue details.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newTicketId = `LIB-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket: LibrarySupportTicket = {
        id: newTicketId,
        subject: subject.trim(),
        category,
        status: "Under Review",
        department,
        priority: priority.startsWith("Critical")
          ? "Critical"
          : priority.startsWith("High")
          ? "High"
          : priority.startsWith("Medium")
          ? "Medium"
          : "Low",
        createdAt: "Just now",
        lastUpdate: "Just now",
        description: message.trim(),
      };

      setTickets([newTicket, ...tickets]);
      setIsSubmitting(false);
      setSubject("");
      setMessage("");
      setStudentIdRef("");
      setAttachment(null);

      toast.success(`Support ticket #${newTicketId} created successfully!`, {
        description: `Confirmation sent to ${email}. Our campus support desk has received your ticket.`,
      });
    }, 600);
  };

  return (
    <AppShell
      title="Support"
      subtitle="Submit institutional support requests, manage student portal inquiries, and contact your campus representative."
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Top Quick Contact & Status Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Institutional Help Desk */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <Mail size={20} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Clock size={11} /> Fast Response
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Institutional Desk
              </p>
              <p className="text-base font-bold text-foreground">edu-support@pixelbooks.io</p>
              <p className="text-xs text-muted-foreground/90">Priority campus ticketing line</p>
            </div>
          </div>

          {/* Campus Representative */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <PhoneCall size={20} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Dedicated Rep
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Campus Relationship Manager
              </p>
              <p className="text-base font-bold text-foreground">+1 (888) 420-PBEDU</p>
              <p className="text-xs text-muted-foreground/90">Mon – Sat, 8:30 AM – 5:30 PM IST</p>
            </div>
          </div>

          {/* Platform Status */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={20} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Live &amp; Synced
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Library Services Status
              </p>
              <p className="text-base font-bold text-foreground">Reader &amp; Auth Online</p>
              <p className="text-xs text-muted-foreground/90">Institutional catalog sync active</p>
            </div>
          </div>

          {/* Institution Tier */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <GraduationCap size={20} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Vimala College
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Institutional License
              </p>
              <p className="text-base font-bold text-foreground">Premium Campus Tier</p>
              <p className="text-xs text-muted-foreground/90">Unlimited department seats</p>
            </div>
          </div>
        </div>

        {/* Main Section: Ticket Form & Side Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Support Request Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-xs">
              {/* Form Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--sidebar-highlight)] text-[var(--brand)] shadow-2xs">
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground tracking-tight">
                      Raise Support Request
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Provide details below to submit a priority request to the campus operations team.
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Sparkles size={13} className="text-[var(--brand)]" />
                  <span>SLA: Response within 2 hours</span>
                </div>
              </div>

              {/* Form Body with Standard Text Boxes */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* 2-Column Grid matching Add Bank Account dialog style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Administrator Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Administrator Name
                      <span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <Input
                      placeholder="Enter Administrator Name"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="h-14 px-4 text-base border border-input rounded-lg"
                      required
                    />
                  </div>

                  {/* Institutional Email */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Institutional Email
                      <span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <Input
                      type="email"
                      placeholder="Enter College Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 px-4 text-base border border-input rounded-lg"
                      required
                    />
                  </div>

                  {/* Issue Category */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Issue Category
                      <span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex h-14 w-full items-center justify-between rounded-lg border border-input bg-card px-4 text-base text-foreground transition-colors hover:bg-secondary/40 outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                        >
                          <span className="truncate">{category}</span>
                          <ChevronDown size={18} className="text-muted-foreground shrink-0" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-72 overflow-y-auto"
                      >
                        {categories.map((cat) => (
                          <DropdownMenuItem
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className="text-sm py-2.5 cursor-pointer"
                          >
                            {cat}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Priority / Urgency */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Priority Level
                      <span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex h-14 w-full items-center justify-between rounded-lg border border-input bg-card px-4 text-base text-foreground transition-colors hover:bg-secondary/40 outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                        >
                          <span className="truncate">{priority}</span>
                          <ChevronDown size={18} className="text-muted-foreground shrink-0" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-72 overflow-y-auto"
                      >
                        {priorityOptions.map((pri) => (
                          <DropdownMenuItem
                            key={pri}
                            onClick={() => setPriority(pri)}
                            className="text-sm py-2.5 cursor-pointer"
                          >
                            {pri}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Concerned Department
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex h-14 w-full items-center justify-between rounded-lg border border-input bg-card px-4 text-base text-foreground transition-colors hover:bg-secondary/40 outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                        >
                          <span className="truncate">{department}</span>
                          <ChevronDown size={18} className="text-muted-foreground shrink-0" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-72 overflow-y-auto"
                      >
                        {departments.map((dep) => (
                          <DropdownMenuItem
                            key={dep}
                            onClick={() => setDepartment(dep)}
                            className="text-sm py-2.5 cursor-pointer"
                          >
                            {dep}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Student ID / Enrollment ID (Optional) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Student / Enrollment ID <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Input
                      placeholder="e.g., CS-2026-042 or Login ID"
                      value={studentIdRef}
                      onChange={(e) => setStudentIdRef(e.target.value)}
                      className="h-14 px-4 text-base border border-input rounded-lg"
                    />
                  </div>
                </div>

                {/* Subject (Full Width) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Subject
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    placeholder="Enter Subject (e.g., Request to increase semester license allocation)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-14 px-4 text-base border border-input rounded-lg"
                    required
                  />
                </div>

                {/* Message / Description (Full Width) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-foreground">
                      Message / Issue Details
                      <span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {message.length} characters
                    </span>
                  </div>
                  <Textarea
                    rows={5}
                    placeholder="Please describe the request with academic year, department, or student count..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[140px] px-4 py-3 text-base border border-input rounded-lg resize-y focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  />
                </div>

                {/* File Attachment Box */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Attachments <span className="text-xs text-muted-foreground font-normal">(Roster CSV, error screenshot, approval PDF)</span>
                  </Label>
                  <div className="rounded-xl border border-dashed border-border bg-card/50 p-4 transition-colors hover:border-[var(--brand)]/60">
                    {attachment ? (
                      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)] shrink-0">
                            <FileText size={18} />
                          </span>
                          <div className="truncate">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(attachment.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachment(null)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          title="Remove attachment"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                            <Paperclip size={18} />
                          </span>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Upload roster file, screenshot or authorization letter
                            </p>
                            <p className="text-xs text-muted-foreground">
                              CSV, XLSX, PDF, PNG, or JPG up to 10MB
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground shadow-2xs hover:bg-secondary transition-colors">
                          Browse File
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".png,.jpg,.jpeg,.pdf,.xlsx,.csv"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Form Action Buttons matching Add Bank Account Dialog */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border/70">
                  <Link
                    to="/library-admin"
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-xs"
                    style={{
                      backgroundColor: "var(--brand)",
                      color: "var(--brand-contrast)",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock size={16} className="animate-spin" />
                        <span>Submitting Ticket...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Active Tickets & FAQs (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Active Tickets Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                    <LifeBuoy size={16} />
                  </span>
                  <h3 className="text-base font-bold text-foreground">Recent Inquiries</h3>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {tickets.length} Total
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {tickets.map((t) => {
                  const statusStyles =
                    t.status === "In Progress"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      : t.status === "Resolved"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className="group p-3.5 rounded-xl border border-border/80 bg-background/60 hover:bg-secondary/40 transition-all cursor-pointer hover:border-[var(--brand)]/40 hover:shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-[var(--brand)]">#{t.id}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusStyles}`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-[var(--brand)] transition-colors">
                        {t.subject}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border/50">
                        <span>{t.department || t.category}</span>
                        <span>{t.lastUpdate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Self-Serve FAQs */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                  <HelpCircle size={16} />
                </span>
                <h3 className="text-base font-bold text-foreground">Library FAQs</h3>
              </div>

              <div className="mt-4 space-y-3">
                {faqItems.map((item, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-border/80 bg-background/60 overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between gap-2 p-3.5 text-left text-xs font-semibold text-foreground hover:bg-secondary/30 transition-colors cursor-pointer"
                      >
                        <span className="leading-snug">{item.q}</span>
                        <ChevronDown
                          size={15}
                          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-3.5 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40 bg-card/40">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <Dialog open={Boolean(selectedTicket)} onOpenChange={(open) => !open && setSelectedTicket(null)}>
          <DialogContent className="max-w-xl p-0 overflow-hidden border-0">
            <div className="bg-card rounded-xl p-6 sm:p-8 space-y-6">
              <DialogHeader className="pb-4 border-b border-border">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-[var(--brand)]">
                    Ticket #{selectedTicket.id}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      selectedTicket.status === "In Progress"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : selectedTicket.status === "Resolved"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                </div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {selectedTicket.subject}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Category: {selectedTicket.category} · Department: {selectedTicket.department} · Created {selectedTicket.createdAt}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-semibold text-foreground uppercase tracking-wider text-[11px] mb-1 text-muted-foreground">
                    Original Request
                  </p>
                  <div className="rounded-lg border border-border bg-background p-3 text-foreground leading-relaxed">
                    {selectedTicket.description}
                  </div>
                </div>

                {selectedTicket.resolutionNotes && (
                  <div>
                    <p className="font-semibold text-foreground uppercase tracking-wider text-[11px] mb-1 text-muted-foreground">
                      Campus Engineering Resolution
                    </p>
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-foreground leading-relaxed">
                      {selectedTicket.resolutionNotes}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-5 text-xs font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AppShell>
  );
}
