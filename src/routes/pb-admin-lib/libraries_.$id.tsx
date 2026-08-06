import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Library,
  CheckCircle2,
  Clock,
  XCircle,
  Save,
  Check,
  ChevronDown,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin-lib/libraries_/$id")({
  component: LibraryPreviewDetailPage,
});

/* -------------------------------------------------------------------------- */
/*                                MOCK DATA                                   */
/* -------------------------------------------------------------------------- */

type LibraryDetail = {
  id: string;
  name: string;
  type: string;
  customId: string;
  gstDetails: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  pincode: string;
  country: string;
  contactPerson: string;
  email: string;
  phone: string;
  borrowLimit: string;
  returnLimitDays: string;
  status: "Onboarded" | "Pending" | "Rejected";
};

const mockLibraryDetails: Record<string, LibraryDetail> = {
  "LIB-101": {
    id: "LIB-101",
    name: "The District Central Library",
    type: "University",
    customId: "LIB56464",
    gstDetails: "32ABCDE1234F1Z5",
    addressLine1: "Ernakulam",
    addressLine2: "",
    state: "Kerala",
    city: "Ernakulam",
    pincode: "682019",
    country: "India",
    contactPerson: "K. P. Ajithkumar",
    email: "nimisha+39@brandoptics.com",
    phone: "9895405781",
    borrowLimit: "15",
    returnLimitDays: "20",
    status: "Onboarded",
  },
  "LIB-102": {
    id: "LIB-102",
    name: "National University of Advanced Legal Studies",
    type: "University",
    customId: "LIB98214",
    gstDetails: "29NUALS8819A1Z2",
    addressLine1: "Kalamassery",
    addressLine2: "NUALS Campus Road",
    state: "Kerala",
    city: "Kochi",
    pincode: "683503",
    country: "India",
    contactPerson: "Prof. Benedict Wong",
    email: "contact@nuals.ac.in",
    phone: "9447012345",
    borrowLimit: "25",
    returnLimitDays: "30",
    status: "Onboarded",
  },
};

const defaultLibrary: LibraryDetail = {
  id: "LIB-999",
  name: "The District Central Library",
  type: "University",
  customId: "LIB56464",
  gstDetails: "32ABCDE1234F1Z5",
  addressLine1: "Ernakulam",
  addressLine2: "",
  state: "Kerala",
  city: "Ernakulam",
  pincode: "682019",
  country: "India",
  contactPerson: "K. P. Ajithkumar",
  email: "nimisha+39@brandoptics.com",
  phone: "9895405781",
  borrowLimit: "15",
  returnLimitDays: "20",
  status: "Onboarded",
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

function LibraryPreviewDetailPage() {
  const { id } = Route.useParams();
  const library = mockLibraryDetails[id] || defaultLibrary;

  const [formData, setFormData] = useState<LibraryDetail>(library);
  const [status, setStatus] = useState<"Onboarded" | "Pending" | "Rejected">(
    library.status
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field: keyof LibraryDetail, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success("Library details updated successfully.");
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReject = () => {
    setStatus("Rejected");
    toast.error("Library status set to Rejected.");
  };

  const handleApprove = () => {
    setStatus("Onboarded");
    toast.success("Library approved and onboarded successfully.");
  };

  return (
    <AppShell
      title="Library Preview"
      subtitle="View and edit institutional library registration parameters, location address, and borrow limit policies."
    >
      <div className="space-y-6 p-4 sm:p-6 md:p-8 max-w-6xl">
        {/* Back to Libraries Navigation (Rule 8) */}
        <div className="flex items-center gap-3">
          <Link
            to="/pb-admin-lib/libraries"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground shadow-2xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <span className="text-sm font-semibold text-foreground">Back to Libraries</span>
        </div>

        {/* Top Header Card with Logo Avatar + Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 shadow-2xs">
              <Library size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {formData.name}
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                ID: {formData.customId} · {formData.city}, {formData.state}
              </p>
            </div>
          </div>

          {/* Status Badge Top Right */}
          <div className="shrink-0 self-start sm:self-auto">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-2xs ${
                status === "Onboarded"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : status === "Pending"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
              }`}
            >
              {status === "Onboarded" ? (
                <CheckCircle2 size={14} />
              ) : status === "Pending" ? (
                <Clock size={14} />
              ) : (
                <XCircle size={14} />
              )}
              {status}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Library Details */}
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold tracking-tight text-foreground border-b border-border/50 pb-3">
              Library Details
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Library Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Library Name<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>

              {/* Library Type */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Library Type<span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="h-11 w-full appearance-none rounded-lg border border-border bg-card px-3.5 pr-10 text-sm font-medium text-foreground outline-none cursor-pointer focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                  >
                    <option value="University">University</option>
                    <option value="Public Library">Public Library</option>
                    <option value="College Library">College Library</option>
                    <option value="School Library">School Library</option>
                    <option value="Research Institute">Research Institute</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                </div>
              </div>

              {/* ID */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  ID<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.customId}
                  onChange={(e) => handleInputChange("customId", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>

              {/* GST Details */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  GST Details<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.gstDetails}
                  onChange={(e) => handleInputChange("gstDetails", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Address Line 1<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Address Line 2
                </label>
                <input
                  type="text"
                  placeholder="Enter address line 2"
                  value={formData.addressLine2}
                  onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
                />
              </div>

              {/* State */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  State<span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="h-11 w-full appearance-none rounded-lg border border-border bg-card px-3.5 pr-10 text-sm font-medium text-foreground outline-none cursor-pointer focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                  >
                    <option value="Kerala">Kerala</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  City<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Pincode<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>

              {/* Country */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Country<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Contact Details */}
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold tracking-tight text-foreground border-b border-border/50 pb-3">
              Contact Details
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Contact Person */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Contact Person<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Phone Number<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Email<span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Manage Library */}
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold tracking-tight text-foreground border-b border-border/50 pb-3">
              Manage Library
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Borrow Limit */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Borrow Limit<span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.borrowLimit}
                  onChange={(e) => handleInputChange("borrowLimit", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>

              {/* eBook Return Limit (in days) */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  eBook Return Limit (in days)<span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.returnLimitDays}
                  onChange={(e) => handleInputChange("returnLimitDays", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
                />
              </div>
            </div>
          </section>

          {/* Bottom Action Footer Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <div>
              {status !== "Rejected" && (
                <button
                  type="button"
                  onClick={handleReject}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-card px-5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30 cursor-pointer shadow-2xs"
                >
                  <XCircle size={16} /> Reject
                </button>
              )}
              {status === "Rejected" && (
                <button
                  type="button"
                  onClick={handleApprove}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 size={16} /> Approve & Onboard
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/pb-admin-lib/libraries"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer shadow-2xs"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-2xs"
              >
                {isSaved ? (
                  <>
                    <Check size={16} /> Saved
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
