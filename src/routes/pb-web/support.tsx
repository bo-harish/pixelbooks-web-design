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
  Check,
} from "lucide-react";
import { PbWebHeader } from "@/components/pb-web-header";
import { PbWebFooter } from "@/components/pb-web-footer";
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

  const handleDiscard = () => {
    setSubject("");
    setMessage("");
    setReferenceId("");
    setBookTitle("");
    setAttachment(null);
    toast.info("Support request draft discarded");
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Office Headquarters Card */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-pbgreen-border/70 bg-gradient-to-b from-pbgreen-light/80 via-pbgreen-light/40 to-pbgreen-subtle p-6 sm:p-7 shadow-xs transition-all duration-200 hover:border-pbgreen-border hover:shadow-md">
            <div>
              {/* Header: Icon & Badge */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow-2xs border border-pbgreen-border/60 ring-1 ring-slate-900/5">
                  <MapPin size={17} className="stroke-[2] text-slate-700" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-pbgreen-border/60 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#30C047]" />
                  Kochi, India
                </span>
              </div>

              {/* Content */}
              <div className="mt-5 space-y-2.5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-pbgreen-dark mb-1">
                    Headquarters
                  </p>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    BrandOptics India Private Ltd.
                  </h3>
                </div>
                <p className="text-xs sm:text-[12.5px] text-slate-600 leading-relaxed">
                  Unit 403, 4th Floor, Tower B, World Trade Center, Infopark Phase I, Kakkanad, Kochi, Kerala - 682042
                </p>
              </div>
            </div>

            {/* Action / Link Footer */}
            <div className="mt-6 pt-4 border-t border-pbgreen-border/60 flex items-center justify-between text-xs">
              <a
                href="https://maps.google.com/?q=Infopark+Kochi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-pbgreen-dark hover:text-[#0e5b50] transition-colors"
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
                className="inline-flex items-center gap-1 text-xs text-pbgreen-dark hover:text-[#0e5b50] py-1 px-2 rounded-md hover:bg-white/70 transition-colors cursor-pointer"
                title="Copy address"
              >
                <Copy size={12} />
                <span className="text-[11px]">Copy</span>
              </button>
            </div>
          </div>

          {/* 2. Direct Support Phone Card */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-pbgreen-border/70 bg-gradient-to-b from-pbgreen-light/80 via-pbgreen-light/40 to-pbgreen-subtle p-6 sm:p-7 shadow-xs transition-all duration-200 hover:border-pbgreen-border hover:shadow-md">
            <div>
              {/* Header: Icon & Live Status Badge */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow-2xs border border-pbgreen-border/60 ring-1 ring-slate-900/5">
                  <PhoneCall size={17} className="stroke-[2] text-slate-700" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-pbgreen-border/60 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#30C047] animate-pulse" />
                  All 7 Days
                </span>
              </div>

              {/* Content */}
              <div className="mt-5 space-y-2.5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-pbgreen-dark mb-1">
                    Direct Helpline
                  </p>
                  <a
                    href="tel:+917994833122"
                    className="text-base sm:text-lg font-bold text-slate-900 hover:text-pbgreen-dark transition-colors block tracking-tight leading-snug"
                  >
                    +91 79948 33122
                  </a>
                </div>
                <p className="text-xs sm:text-[12.5px] text-slate-600 leading-relaxed">
                  Available Monday – Sunday, 9:00 AM – 6:00 PM IST for immediate customer, author & publisher help.
                </p>
              </div>
            </div>

            {/* Action / Link Footer */}
            <div className="mt-6 pt-4 border-t border-pbgreen-border/60 flex items-center justify-between text-xs">
              <a
                href="tel:+917994833122"
                className="inline-flex items-center gap-1.5 font-semibold text-pbgreen-dark hover:text-[#0e5b50] transition-colors"
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
                className="inline-flex items-center gap-1 text-xs text-pbgreen-dark hover:text-[#0e5b50] py-1 px-2 rounded-md hover:bg-white/70 transition-colors cursor-pointer"
                title="Copy phone number"
              >
                <Copy size={12} />
                <span className="text-[11px]">Copy</span>
              </button>
            </div>
          </div>

          {/* 3. Email Support Card */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-pbgreen-border/70 bg-gradient-to-b from-pbgreen-light/80 via-pbgreen-light/40 to-pbgreen-subtle p-6 sm:p-7 shadow-xs transition-all duration-200 hover:border-pbgreen-border hover:shadow-md">
            <div>
              {/* Header: Icon & Response Time Badge */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow-2xs border border-pbgreen-border/60 ring-1 ring-slate-900/5">
                  <Mail size={17} className="stroke-[2] text-slate-700" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-pbgreen-border/60 shadow-2xs">
                  <Clock size={12} /> &lt; 2h Response
                </span>
              </div>

              {/* Content */}
              <div className="mt-5 space-y-2.5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-pbgreen-dark mb-1">
                    Email Assistance
                  </p>
                  <a
                    href="mailto:support@pixelbooksapp.com"
                    className="text-base sm:text-lg font-bold text-slate-900 hover:text-pbgreen-dark transition-colors block truncate tracking-tight leading-snug"
                  >
                    support@pixelbooksapp.com
                  </a>
                </div>
                <p className="text-xs sm:text-[12.5px] text-slate-600 leading-relaxed">
                  Priority desk for account issues, license queries, author royalties, and order receipts.
                </p>
              </div>
            </div>

            {/* Action / Link Footer */}
            <div className="mt-6 pt-4 border-t border-pbgreen-border/60 flex items-center justify-between text-xs">
              <a
                href="mailto:support@pixelbooksapp.com"
                className="inline-flex items-center gap-1.5 font-semibold text-pbgreen-dark hover:text-[#0e5b50] transition-colors"
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
                className="inline-flex items-center gap-1 text-xs text-pbgreen-dark hover:text-[#0e5b50] py-1 px-2 rounded-md hover:bg-white/70 transition-colors cursor-pointer"
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
            <label className="block text-sm font-bold text-foreground">
              I am reaching out as: <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(
                [
                  {
                    id: "Reader / Customer",
                    label: "Reader / Buyer",
                    description: "Orders, downloads & account help",
                    icon: User,
                  },
                  {
                    id: "Publisher",
                    label: "Publisher",
                    description: "Royalties, catalogue & payouts",
                    icon: Building2,
                  },
                  {
                    id: "Author",
                    label: "Author",
                    description: "Royalties, catalogue & payouts",
                    icon: Feather,
                  },
                  {
                    id: "Institutional Admin",
                    label: "Institution",
                    description: "Licensing, enrollment & LMS",
                    icon: GraduationCap,
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
                    className={`group relative flex flex-col items-start gap-2.5 rounded-xl p-3 text-left transition-all duration-200 cursor-pointer bg-white ${isSelected
                        ? "border-2 border-[#137365] ring-2 ring-[#137365]/10 shadow-sm -translate-y-0.5"
                        : "border border-border/80 hover:border-slate-300 shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
                      }`}
                  >
                    {/* Top Row: Icon on left, Radio Checkmark on right */}
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${isSelected
                            ? "bg-emerald-50 border-emerald-200 text-[#137365]"
                            : "bg-slate-50 border-slate-200/70 text-slate-400 group-hover:text-slate-600"
                          }`}
                      >
                        <Icon size={16} className="stroke-[2.2]" />
                      </div>

                      {/* Radio Checkmark Circle */}
                      <div
                        className={`flex h-4.5 w-4.5 items-center justify-center rounded-full transition-all duration-200 ${isSelected
                            ? "bg-[#137365] text-white shadow-2xs scale-100"
                            : "border border-slate-300 group-hover:border-slate-400 bg-white"
                          }`}
                      >
                        {isSelected && <Check size={11} className="stroke-[3]" />}
                      </div>
                    </div>

                    {/* Text */}
                    <div className="space-y-0.5">
                      <p
                        className={`text-[12px] leading-tight transition-colors ${isSelected ? "font-bold text-[#137365]" : "font-semibold text-foreground/90 group-hover:text-foreground"
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
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  {userRole === "Publisher"
                    ? "Publisher / Contact Name"
                    : userRole === "Author"
                      ? "Author Full Name"
                      : userRole === "Institutional Admin"
                        ? "Administrator Name"
                        : "Your Full Name"}{" "}
                  <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Email Address / Phone Number <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Email Address or Phone Number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Issue Category <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all appearance-none cursor-pointer pr-10"
                  >
                    {currentCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
              </div>

              {/* Urgency / Priority */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Priority Level <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all appearance-none cursor-pointer pr-10"
                  >
                    {priorityOptions.map((pri) => (
                      <option key={pri} value={pri}>
                        {pri}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
              </div>

              {/* Reference ID (Optional) */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Reference ID <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder={
                    userRole === "Publisher" || userRole === "Author"
                      ? "e.g., Payout Batch #, Contract ID, or ISBN"
                      : userRole === "Institutional Admin"
                        ? "e.g., License ID # or Dept Code"
                        : "e.g., Order # or UPI Ref"
                  }
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                />
              </div>

              {/* Book Title (Optional) */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Book Title or ISBN <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Title or 978-0-123456-47-2"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                />
              </div>
            </div>

            {/* Subject (Full Width) */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Subject <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
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
                className="w-full h-12 px-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all"
                required
              />
            </div>

            {/* Message / Description (Full Width) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-foreground">
                  Message / Detailed Description <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <span className="text-xs text-muted-foreground font-normal">
                  {message.length} characters
                </span>
              </div>
              <textarea
                rows={5}
                placeholder="Please describe your inquiry or issue with specific details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[140px] p-4 rounded-xl border border-input bg-white text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all resize-y"
                required
              />
            </div>

            {/* File Attachment Dropzone */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Attachments <span className="text-xs text-muted-foreground font-normal">(Screenshots, spreadsheets, receipts, or logs)</span>
              </label>
              <div className="rounded-xl border border-dashed border-input bg-white p-4 transition-colors hover:border-[var(--brand)] hover:bg-emerald-50/20">
                {attachment ? (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
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
                          Attach document, screenshot, or spreadsheet
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, XLSX, CSV, PNG, or JPG up to 10MB
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-white px-4 text-xs font-semibold text-foreground shadow-2xs hover:bg-neutral-50 transition-colors">
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

            {/* Form Action Controls (matching screenshot bottom bar) */}
            <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-xs mt-8">
              <div className="text-xs text-muted-foreground">
                Routing: <span className="font-semibold text-foreground">{userRole} Support Desk</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="h-10 px-4 rounded-lg border border-border bg-white text-xs font-semibold text-foreground hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-5 text-xs font-semibold text-white shadow-2xs hover:bg-[var(--brand)]/90 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <PbWebFooter />
    </div>
  );
}
