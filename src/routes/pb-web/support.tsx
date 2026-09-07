import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Mail,
  Send,
  PhoneCall,
  Clock,
  Paperclip,
  X,
  FileText,
  ChevronDown,
  MessageSquare,
  Sparkles,
  User,
  BookMarked,
  Feather,
  Building2,
  GraduationCap,
  MapPin,
  ArrowUpRight,
  Copy,
} from "lucide-react";
import { PbWebHeader } from "@/components/pb-web-header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-web/support")({
  head: () => ({
    meta: [
      { title: "Support — PixelBooks" },
      {
        name: "description",
        content: "PixelBooks Support for Publishers, Authors, Institutional Admins, and Readers.",
      },
    ],
  }),
  component: PbWebSupportPage,
});

type UserRole = "Publisher" | "Author" | "Reader / Customer" | "Institutional Admin";

const roleCategories: Record<UserRole, string[]> = {
  Publisher: [
    "Royalty Calculations & Payout Discrepancies",
    "eBook Catalogue & Metadata Management",
    "Catalogue Bulk Import (.xlsx / EPUB / PDF)",
    "Promo Codes, Bundles & Discount Campaigns",
    "Bank Account & Settlement Verification",
    "Publisher Account & Multi-User Access",
    "Technical Bug / Platform Issue",
    "General Publisher Inquiry",
  ],
  Author: [
    "Author Royalty Statements & Margin Splits",
    "Manuscript Publishing & Verification Status",
    "Author Bio & Catalogue Profile Updates",
    "Primary Bank Account & Royalty Wire",
    "Book Pricing Tiers & Author Copies",
    "Reader Engagement & Sales Analytics",
    "Technical Bug / Platform Issue",
    "General Author Inquiry",
  ],
  "Reader / Customer": [
    "Order & Payment Confirmation Status",
    "eBook Download & Offline Reader Sync",
    "Refund / Cancellation Request",
    "Interactive Reader & Highlight Annotations",
    "Account Access & Login Verification",
    "Book Formatting or Typo Error Report",
    "General Customer Support",
  ],
  "Institutional Admin": [
    "Institutional Licensing & Budget Allocation",
    "Student Batch Onboarding & Enrollment IDs",
    "Department Allocation & Borrowing Limits",
    "Campus LMS / SSO Authentication Integration",
    "Institutional Digital Catalogue Order",
    "NIRF / Accreditation Usage Reports",
    "General Institutional Inquiry",
  ],
};

const priorityOptions = [
  "Low — General Question",
  "Medium — Standard Request",
  "High — Urgent Attention Needed",
  "Critical — Access or Revenue Blocker",
] as const;

function PbWebSupportPage() {
  // Role & Form State
  const [userRole, setUserRole] = useState<UserRole>("Reader / Customer");
  const [fullName, setFullName] = useState("Harish");
  const [email, setEmail] = useState("harish@pixelbooks.com");
  const [category, setCategory] = useState<string>(roleCategories["Reader / Customer"][0]);
  const [priority, setPriority] = useState<string>("Medium — Standard Request");
  const [referenceId, setReferenceId] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle role switch & update category default
  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    setCategory(roleCategories[newRole][0]);
    if (newRole === "Author") {
      setFullName("Dr. Vikram Seth");
      setEmail("vikram.seth@authorsguild.in");
    } else if (newRole === "Publisher") {
      setFullName("Anya Ramanathan");
      setEmail("anya@apexpublishing.com");
    } else if (newRole === "Institutional Admin") {
      setFullName("Dr. Sr. Beena Jose");
      setEmail("library.admin@vimala.edu");
    } else {
      setFullName("Harish");
      setEmail("harish@pixelbooks.com");
    }
  };

  const currentCategories = useMemo(() => {
    return roleCategories[userRole] || roleCategories["Reader / Customer"];
  }, [userRole]);

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
      toast.error("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address or phone number.");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter a subject for your request.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please describe your issue or query.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const prefix = userRole === "Publisher" ? "PB" : userRole === "Author" ? "ATH" : userRole === "Institutional Admin" ? "LIB" : "CS";
      const newTicketId = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

      setIsSubmitting(false);
      setSubject("");
      setMessage("");
      setReferenceId("");
      setBookTitle("");
      setAttachment(null);

      toast.success(`Support ticket #${newTicketId} created successfully!`, {
        description: `Confirmation sent to ${email}. Our ${userRole} desk will respond shortly.`,
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col justify-between pb-web-portal">
      {/* Universal Header */}
      <PbWebHeader activeTab="Support" />

      {/* Main Body */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Navigation Breadcrumb & Header */}
        <div className="space-y-1 pb-4 border-b border-border/60">

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Need Help? We’re Here for You!
          </h1>
          <p className="text-sm text-muted-foreground">
            We’re committed to making your experience smooth and hassle-free. Whether you have a question, run into an issue, or need assistance, our dedicated support team is always ready to help.
          </p>
        </div>

        {/* Top Contact Highlights (Address, Direct Phone, and Email) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Office Headquarters Card */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md">
            <div>
              {/* Header: Icon & Badge */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 ring-1 ring-slate-200/80 shadow-2xs">
                  <MapPin size={20} className="stroke-[2.2]" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/90 px-3 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  Kochi, India
                </span>
              </div>

              {/* Content */}
              <div className="mt-4 space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Headquarters
                </p>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  BrandOptics India Private Ltd.
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Unit 403, 4th Floor, Tower B, World Trade Center, Infopark Phase I, Kakkanad, Kochi, Kerala - 682042
                </p>
              </div>
            </div>

            {/* Action / Link Footer */}
            <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs">
              <a
                href="https://maps.google.com/?q=Infopark+Kochi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-[#137365] transition-colors"
              >
                <span>View on Map</span>
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("Unit 403, 4th Floor, Tower B, World Trade Center, Infopark Phase I, Kochi, Kerala - 682042");
                  toast.success("Office address copied to clipboard!");
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground py-1 px-2 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Copy address"
              >
                <Copy size={12} />
                <span className="text-[11px]">Copy</span>
              </button>
            </div>
          </div>

          {/* 2. Direct Support Phone Card */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-pbgreen hover:shadow-md">
            <div>
              {/* Header: Icon & Live Status Badge */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pbgreen-light text-pbgreen-dark border border-pbgreen-border shadow-2xs">
                  <PhoneCall size={20} className="stroke-[2.2] text-[#30C047]" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pbgreen-light px-3 py-1 text-[11px] font-semibold text-pbgreen-dark border border-pbgreen-border">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#30C047] animate-pulse" />
                  All 7 Days
                </span>
              </div>

              {/* Content */}
              <div className="mt-4 space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-pbgreen-dark">
                  Direct Helpline
                </p>
                <a
                  href="tel:+917994833122"
                  className="text-lg sm:text-xl font-extrabold text-foreground hover:text-[#137365] transition-colors block tracking-tight"
                >
                  +91 79948 33122
                </a>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Available Monday – Sunday, 9:00 AM – 6:00 PM IST for immediate customer, author & publisher help.
                </p>
              </div>
            </div>

            {/* Action / Link Footer */}
            <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs">
              <a
                href="tel:+917994833122"
                className="inline-flex items-center gap-1.5 font-semibold text-[#137365] hover:text-[#0e5b50] transition-colors"
              >
                <span>Call Support Desk</span>
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("+91 79948 33122");
                  toast.success("Phone number copied to clipboard!");
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground py-1 px-2 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Copy phone number"
              >
                <Copy size={12} />
                <span className="text-[11px]">Copy</span>
              </button>
            </div>
          </div>

          {/* 3. Email Support Card */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-sky-500/50 hover:shadow-md">
            <div>
              {/* Header: Icon & Response Time Badge */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-500/20 shadow-2xs">
                  <Mail size={20} className="stroke-[2.2]" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 border border-sky-200/80">
                  <Clock size={12} /> &lt; 2h Response
                </span>
              </div>

              {/* Content */}
              <div className="mt-4 space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                  Email Assistance
                </p>
                <a
                  href="mailto:support@pixelbooksapp.com"
                  className="text-base sm:text-lg font-bold text-foreground hover:text-sky-600 transition-colors block truncate"
                >
                  support@pixelbooksapp.com
                </a>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Priority desk for account issues, license queries, author royalties, and order receipts.
                </p>
              </div>
            </div>

            {/* Action / Link Footer */}
            <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs">
              <a
                href="mailto:support@pixelbooksapp.com"
                className="inline-flex items-center gap-1.5 font-semibold text-sky-700 hover:text-sky-800 transition-colors"
              >
                <span>Compose Email</span>
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("support@pixelbooksapp.com");
                  toast.success("Email address copied to clipboard!");
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground py-1 px-2 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Copy email address"
              >
                <Copy size={12} />
                <span className="text-[11px]">Copy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Central Support Ticket Form */}
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 md:p-10 shadow-xs">
          {/* Form Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pbgreen-light text-pbgreen-dark border border-pbgreen-border shadow-2xs">
                <MessageSquare size={22} className="text-[#137365]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  Submit Support Request
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select your role and provide details below to open a ticket with our dedicated desk.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-pbgreen-border bg-pbgreen-light px-3 py-1 text-xs font-semibold text-pbgreen-dark">
              <Sparkles size={13} className="text-[#30C047]" />
              <span>Direct ticketing system</span>
            </div>
          </div>

          {/* Role Segment Selector: Publisher / Author / Reader / Institution */}
          <div className="mt-6 space-y-3">
            <Label className="text-sm font-medium text-foreground">
              I am reaching out as:
              <span className="text-destructive ml-0.5">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(
                [
                  {
                    id: "Reader / Customer",
                    label: "Reader / Buyer",
                    description: "Orders, downloads & account help",
                    icon: User,
                    iconBg: "bg-sky-50 border-sky-200/80",
                    iconColor: "text-sky-600",
                    activeBg: "bg-sky-50/60 border-sky-500/50",
                    activeDot: "bg-sky-500",
                  },
                  {
                    id: "Publisher",
                    label: "Publisher",
                    description: "Royalties, catalogue & payouts",
                    icon: Building2,
                    iconBg: "bg-indigo-50 border-indigo-200/80",
                    iconColor: "text-indigo-600",
                    activeBg: "bg-indigo-50/60 border-indigo-500/50",
                    activeDot: "bg-indigo-500",
                  },
                  {
                    id: "Author",
                    label: "Author",
                    description: "Royalties, catalogue & payouts",
                    icon: Feather,
                    iconBg: "bg-emerald-50 border-emerald-200/80",
                    iconColor: "text-emerald-600",
                    activeBg: "bg-emerald-50/60 border-[#137365]/50",
                    activeDot: "bg-[#30C047]",
                  },
                  {
                    id: "Institutional Admin",
                    label: "Institution",
                    description: "Licensing, enrollment & LMS",
                    icon: GraduationCap,
                    iconBg: "bg-amber-50 border-amber-200/80",
                    iconColor: "text-amber-600",
                    activeBg: "bg-amber-50/60 border-amber-500/50",
                    activeDot: "bg-amber-500",
                  },
                ] as const
              ).map((role) => {
                const Icon = role.icon;
                const isSelected = userRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleChange(role.id)}
                    className={`group relative flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer shadow-xs ${isSelected
                      ? `${role.activeBg} shadow-sm`
                      : "border-border bg-white hover:border-border/80 hover:shadow-sm hover:bg-neutral-50/80"
                      }`}
                  >
                    {/* Selected indicator dot */}
                    {isSelected && (
                      <span
                        className={`absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full ${role.activeDot}`}
                      />
                    )}

                    {/* Icon badge */}
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border ${isSelected ? role.iconBg : "bg-neutral-50 border-border/60"
                        } transition-colors`}
                    >
                      <Icon
                        size={15}
                        className={`${isSelected ? role.iconColor : "text-muted-foreground"} transition-colors`}
                      />
                    </div>

                    {/* Text */}
                    <div className="space-y-0.5">
                      <p
                        className={`text-[12px] font-semibold leading-tight ${isSelected ? "text-foreground" : "text-foreground/80"
                          }`}
                      >
                        {role.label}
                      </p>
                      <p className="text-[10.5px] leading-snug text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Body using standard text boxes matching reference */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* 2-Column Standard Textbox Grid matching Add Bank Account Dialog */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  {userRole === "Publisher"
                    ? "Publisher / Contact Name"
                    : userRole === "Author"
                      ? "Author Full Name"
                      : userRole === "Institutional Admin"
                        ? "Administrator Name"
                        : "Your Full Name"}
                  <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  placeholder="Enter Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-14 px-4 text-base border border-input rounded-lg focus-visible:border-[#137365] focus-visible:ring-1 focus-visible:ring-[#137365]/30"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Email Address / Phone Number
                  <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter Email Address or Phone Number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 px-4 text-base border border-input rounded-lg focus-visible:border-[#137365] focus-visible:ring-1 focus-visible:ring-[#137365]/30"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Issue Category
                  <span className="text-destructive ml-0.5">*</span>
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-14 w-full items-center justify-between rounded-lg border border-input bg-white px-4 text-sm text-foreground transition-colors hover:bg-neutral-50 outline-none focus-visible:ring-1 focus-visible:ring-[#137365]/30 focus-visible:border-[#137365] cursor-pointer"
                    >
                      <span className="truncate text-sm">{category}</span>
                      <ChevronDown size={18} className="text-muted-foreground shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-72 overflow-y-auto"
                  >
                    {currentCategories.map((cat) => (
                      <DropdownMenuItem
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className="text-sm py-2.5 cursor-pointer focus:bg-pbgreen-light focus:text-pbgreen-dark"
                      >
                        {cat}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Urgency / Priority */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Priority Level
                  <span className="text-destructive ml-0.5">*</span>
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-14 w-full items-center justify-between rounded-lg border border-input bg-white px-4 text-sm text-foreground transition-colors hover:bg-neutral-50 outline-none focus-visible:ring-1 focus-visible:ring-[#137365]/30 focus-visible:border-[#137365] cursor-pointer"
                    >
                      <span className="truncate text-sm">{priority}</span>
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
                        className="text-sm py-2.5 cursor-pointer focus:bg-pbgreen-light focus:text-pbgreen-dark"
                      >
                        {pri}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Reference ID (Optional) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Reference ID <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Input
                  placeholder={
                    userRole === "Publisher" || userRole === "Author"
                      ? "e.g., Payout Batch #, Contract ID, or ISBN"
                      : userRole === "Institutional Admin"
                        ? "e.g., License ID # or Dept Code"
                        : "e.g., Order # or UPI Ref"
                  }
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  className="h-14 px-4 text-base border border-input rounded-lg focus-visible:border-[#137365] focus-visible:ring-1 focus-visible:ring-[#137365]/30"
                />
              </div>

              {/* Book Title (Optional) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Book Title or ISBN <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Input
                  placeholder="e.g., Title or 978-0-123456-47-2"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="h-14 px-4 text-base border border-input rounded-lg focus-visible:border-[#137365] focus-visible:ring-1 focus-visible:ring-[#137365]/30"
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
                placeholder={
                  userRole === "Publisher"
                    ? "e.g., Delay in Q3 royalty settlement disbursement"
                    : userRole === "Author"
                      ? "e.g., Question regarding royalty margin split for new eBook edition"
                      : userRole === "Institutional Admin"
                        ? "e.g., Request to increase department borrowing limits"
                        : "e.g., Payment debited but eBook not showing in My Library"
                }
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-14 px-4 text-base border border-input rounded-lg focus-visible:border-[#137365] focus-visible:ring-1 focus-visible:ring-[#137365]/30"
                required
              />
            </div>

            {/* Message / Description (Full Width) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  Message / Detailed Description
                  <span className="text-destructive ml-0.5">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {message.length} characters
                </span>
              </div>
              <Textarea
                rows={6}
                placeholder="Please describe your inquiry or issue with specific details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[160px] px-4 py-3 text-base border border-input rounded-lg resize-y focus-visible:ring-1 focus-visible:ring-[#137365]/30 focus-visible:border-[#137365]"
                required
              />
            </div>

            {/* File Attachment Dropzone */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Attachments <span className="text-xs text-muted-foreground font-normal">(Screenshots, spreadsheets, receipts, or logs)</span>
              </Label>
              <div className="rounded-xl border border-dashed border-border bg-white p-4 transition-colors hover:border-pbgreen hover:bg-pbgreen-light/30">
                {attachment ? (
                  <div className="flex items-center justify-between rounded-lg border border-pbgreen-border bg-pbgreen-light p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pbgreen-subtle text-pbgreen-dark shrink-0">
                        <FileText size={18} className="text-pbgreen" />
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
                          Attach document, screenshot, or spreadsheet
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, XLSX, CSV, PNG, or JPG up to 10MB
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-white px-4 text-xs font-semibold text-foreground shadow-2xs hover:bg-pbgreen-light hover:border-pbgreen-border hover:text-pbgreen-dark transition-colors">
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
                to="/pb-web/genre"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-white px-6 text-sm font-medium text-foreground transition-colors hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#137365] hover:bg-[#0e5b50] px-6 text-sm font-semibold transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer shadow-xs text-white border border-[#137365]"
                style={{
                  backgroundColor: "#137365",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Clock size={16} className="animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Support Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/70 bg-white py-8 px-4 sm:px-8 md:px-12 text-xs text-muted-foreground mt-16">
        <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-85" title="PixelBooks - Workspace Selector">
              <img
                src="/logo.png"
                alt="PixelBooks"
                className="h-6 w-auto object-contain opacity-80"
              />
            </Link>
            <span>© 2026 PixelBooks. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/library-admin" className="hover:text-foreground transition-colors">
              Institutional Licensing
            </Link>
            <Link to="/publisher" className="hover:text-foreground transition-colors">
              Publisher Portal
            </Link>
            <Link to="/author" className="hover:text-foreground transition-colors">
              For Authors
            </Link>
            <Link to="/pb-web/support" className="hover:text-[#137365] transition-colors font-medium text-[#137365]">
              Support
            </Link>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Use
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
