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
  ExternalLink,
  AlertCircle,
  HelpCircle,
  LifeBuoy,
  MessageSquare,
  Sparkles,
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

export const Route = createFileRoute("/publisher/support")({
  head: () => ({
    meta: [
      { title: "Support — PixelBooks" },
      {
        name: "description",
        content: "Contact PixelBooks publisher support for help with royalty statements, catalogue metadata, or platform inquiries.",
      },
    ],
  }),
  component: PublisherSupportPage,
});

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: "In Progress" | "Resolved" | "Under Review";
  createdAt: string;
  lastUpdate: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  messagesCount: number;
  description: string;
  resolutionNotes?: string;
}

const initialTickets: SupportTicket[] = [
  {
    id: "PB-8412",
    subject: "Discrepancy in August Author Royalty Disbursement",
    category: "Royalty & Payments",
    status: "In Progress",
    priority: "High",
    createdAt: "Sep 05, 2026",
    lastUpdate: "3 hours ago",
    messagesCount: 3,
    description:
      "The royalty summary for August 2026 shows 1,420 unit sales for 'Echoes of the Silent Valley' but payout bank transfer credits 1,280 units.",
    resolutionNotes:
      "Our finance operations team has flagged the delta and is reconciling bank transfer batch #TXN-9942.",
  },
  {
    id: "PB-8104",
    subject: "EPUB 3.0 Cover Spine Thumbnail Alignment on Import",
    category: "Catalogue Bulk Import",
    status: "Resolved",
    priority: "Medium",
    createdAt: "Aug 28, 2026",
    lastUpdate: "Aug 29, 2026",
    messagesCount: 4,
    description:
      "Upon uploading bulk package EPUB files, book cover aspect ratios in the preview modal were stretching to 4:3 instead of 2:3.",
    resolutionNotes:
      "Resolved with platform patch 4.8.2. Aspect ratio auto-conforms to standard 1.5:1 golden ratio.",
  },
  {
    id: "PB-7950",
    subject: "Primary Bank Account IFSC Verification Delay",
    category: "Bank Account & Verification",
    status: "Resolved",
    priority: "Medium",
    createdAt: "Aug 15, 2026",
    lastUpdate: "Aug 16, 2026",
    messagesCount: 2,
    description:
      "Added new ICICI corporate current account for publisher settlements. Penny-drop confirmation took more than 24 hours.",
    resolutionNotes:
      "Automated penny drop confirmed. Account is active and set as primary payout destination.",
  },
];

const categories = [
  "Royalty & Payments",
  "eBook Catalogue & Metadata",
  "Catalogue Bulk Import",
  "Promo Codes & Discounts",
  "Bank Account & Verification",
  "Account Security & Access",
  "Technical Bug / Reader Issue",
  "General Inquiry",
] as const;

const priorityOptions = [
  "Low — General Question",
  "Medium — Standard Issue",
  "High — Needs Urgent Attention",
  "Critical — Revenue / Access Blocker",
] as const;

const faqItems = [
  {
    q: "When are monthly publisher royalties credited?",
    a: "Royalties are processed and disbursed on the 10th of every month for sales accumulated during the previous calendar month, transferred directly to your active primary bank account.",
  },
  {
    q: "How long does bank account verification take?",
    a: "Standard automated penny-drop verification is completed within 2 to 4 business hours. If manual IFSC reconciliation is required, it may take up to 24 hours.",
  },
  {
    q: "What formats are supported for catalogue import?",
    a: "PixelBooks supports Microsoft Excel (.xlsx) and CSV metadata sheets paired with EPUB (v2.0 & v3.0) and PDF source manuscripts.",
  },
  {
    q: "How do I update author royalty sharing margins?",
    a: "Navigate to Commission Rates or Royalty Reports where you can view default splits or configure custom author contracts with instantaneous recalculation.",
  },
];

function PublisherSupportPage() {
  // Form State
  const [fullName, setFullName] = useState("Anya Ramanathan");
  const [email, setEmail] = useState("anya@apexpublishing.com");
  const [category, setCategory] = useState<string>("Royalty & Payments");
  const [priority, setPriority] = useState<string>("Medium — Standard Issue");
  const [bookRef, setBookRef] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
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

    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter a subject for your inquiry.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter your message or description.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newTicketId = `PB-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket: SupportTicket = {
        id: newTicketId,
        subject: subject.trim(),
        category,
        status: "Under Review",
        priority: priority.startsWith("Critical")
          ? "Critical"
          : priority.startsWith("High")
          ? "High"
          : priority.startsWith("Medium")
          ? "Medium"
          : "Low",
        createdAt: "Just now",
        lastUpdate: "Just now",
        messagesCount: 1,
        description: message.trim(),
      };

      setTickets([newTicket, ...tickets]);
      setIsSubmitting(false);
      setSubject("");
      setMessage("");
      setBookRef("");
      setOrderRef("");
      setAttachment(null);

      toast.success(`Support ticket #${newTicketId} created successfully!`, {
        description: `Confirmation email dispatched to ${email}. Our publisher desk will respond within 2 hours.`,
      });
    }, 600);
  };

  return (
    <AppShell
      title="Support"
      subtitle="Connect with our publisher support desk, track active inquiries, or browse FAQs."
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Top Quick Contact & Status Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Email Support Card */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <Mail size={20} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Clock size={11} /> &lt; 2h Response
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Help Desk
              </p>
              <p className="text-base font-bold text-foreground">support@pixelbooks.io</p>
              <p className="text-xs text-muted-foreground/90">24/7 Priority publisher queue</p>
            </div>
          </div>

          {/* Dedicated Hotline */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <PhoneCall size={20} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Direct Line
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account Manager
              </p>
              <p className="text-base font-bold text-foreground">+1 (800) 555-PBOK</p>
              <p className="text-xs text-muted-foreground/90">Mon – Fri, 9:00 AM – 6:00 PM EST</p>
            </div>
          </div>

          {/* System Status */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={20} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Operational
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Platform Status
              </p>
              <p className="text-base font-bold text-foreground">All Systems Normal</p>
              <p className="text-xs text-muted-foreground/90">99.98% Service Uptime (30 days)</p>
            </div>
          </div>

          {/* Publisher Operations */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
                <LifeBuoy size={20} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Tier-1 Partner
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Assigned Support Tier
              </p>
              <p className="text-base font-bold text-foreground">Dedicated Publisher Support</p>
              <p className="text-xs text-muted-foreground/90">Includes automated royalty audit</p>
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
                      Submit Support Ticket
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Use standard fields below to open a direct ticket with our operations team.
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Sparkles size={13} className="text-[var(--brand)]" />
                  <span>Avg. resolution time: &lt; 4 hours</span>
                </div>
              </div>

              {/* Form Body with Standard Text Boxes */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* 2-Column Grid matching Add Bank Account dialog style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Publisher / Contact Name
                      <span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <Input
                      placeholder="Enter Contact Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-14 px-4 text-base border border-input rounded-lg"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Contact Email
                      <span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <Input
                      type="email"
                      placeholder="Enter Contact Email"
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

                  {/* Book Title / ISBN (Optional) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Book Title or ISBN <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Input
                      placeholder="e.g., 978-0-123456-47-2 or Book Title"
                      value={bookRef}
                      onChange={(e) => setBookRef(e.target.value)}
                      className="h-14 px-4 text-base border border-input rounded-lg"
                    />
                  </div>

                  {/* Reference ID (Optional) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Transaction or Payout ID <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Input
                      placeholder="e.g., TXN-2026-0814 or Batch ID"
                      value={orderRef}
                      onChange={(e) => setOrderRef(e.target.value)}
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
                    placeholder="Enter Subject (e.g., Delay in August royalty settlement disbursement)"
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
                      Message / Issue Description
                      <span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {message.length} characters
                    </span>
                  </div>
                  <Textarea
                    rows={5}
                    placeholder="Please describe your query or issue with specific details..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[140px] px-4 py-3 text-base border border-input rounded-lg resize-y focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  />
                </div>

                {/* File Attachment Box */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Attachments <span className="text-xs text-muted-foreground font-normal">(Screenshots, logs, or error reports)</span>
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
                              Upload screenshot or document
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, PDF, or XLSX up to 10MB
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
                    to="/publisher"
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
                        <span>Submit Ticket</span>
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
                        <span>{t.category}</span>
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
                <h3 className="text-base font-bold text-foreground">Common Questions</h3>
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
                  Category: {selectedTicket.category} · Priority: {selectedTicket.priority} · Created on {selectedTicket.createdAt}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-semibold text-foreground uppercase tracking-wider text-[11px] mb-1 text-muted-foreground">
                    Original Inquiry
                  </p>
                  <div className="rounded-lg border border-border bg-background p-3 text-foreground leading-relaxed">
                    {selectedTicket.description}
                  </div>
                </div>

                {selectedTicket.resolutionNotes && (
                  <div>
                    <p className="font-semibold text-foreground uppercase tracking-wider text-[11px] mb-1 text-muted-foreground">
                      Support Desk Resolution Note
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
