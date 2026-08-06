import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Upload,
  ChevronDown,
  Send,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin-lib/libraries_/new")({
  component: AddLibraryPage,
});

function AddLibraryPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    customId: "",
    gstDetails: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    city: "",
    pincode: "",
    country: "",
    contactPerson: "",
    email: "",
    phone: "",
    borrowLimit: "",
    returnLimitDays: "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      toast.success("Logo image selected.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a library name.");
      return;
    }
    toast.success(`Library "${formData.name}" added successfully.`);
    navigate({ to: "/pb-admin-lib/libraries" });
  };

  return (
    <AppShell
      title="Add Institutional Library"
      subtitle="Register a new institutional library, assign default borrow limits, and set up administrator contact details."
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

        {/* Top Header Card with Logo Image Upload Placeholder */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xs">
          <div className="flex items-center gap-4">
            {/* Interactive Logo Image Upload Placeholder */}
            <label className="relative flex h-16 w-16 shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/40 transition-all hover:bg-muted hover:border-[var(--brand)] overflow-hidden shadow-2xs group">
              {logoPreview ? (
                <img src={logoPreview} alt="Library Logo" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground p-1 text-center">
                  <Upload size={18} className="text-muted-foreground group-hover:text-[var(--brand)] transition-colors" />
                  <span className="text-[9px] font-semibold mt-0.5 leading-tight">Upload Logo</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </label>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {formData.name || "New Library Registration"}
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {formData.customId ? `ID: ${formData.customId}` : "Upload logo and fill details below"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="e.g. The District Central Library"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
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
                    <option value="" disabled>Select Library Type</option>
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
                  placeholder="e.g. LIB56464"
                  value={formData.customId}
                  onChange={(e) => handleInputChange("customId", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
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
                  placeholder="e.g. 32ABCDE1234F1Z5"
                  value={formData.gstDetails}
                  onChange={(e) => handleInputChange("gstDetails", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
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
                  placeholder="Street / Campus address"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
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
                    <option value="" disabled>Select State</option>
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
                  placeholder="City name"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
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
                  placeholder="682019"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
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
                  placeholder="e.g. India"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
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
                  placeholder="Official Admin / Librarian name"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
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
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
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
                  placeholder="admin@institution.edu"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
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
                  placeholder="e.g. 15"
                  value={formData.borrowLimit}
                  onChange={(e) => handleInputChange("borrowLimit", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
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
                  placeholder="e.g. 30"
                  value={formData.returnLimitDays}
                  onChange={(e) => handleInputChange("returnLimitDays", e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </section>

          {/* Bottom Action Footer Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
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
              <Send size={16} /> Submit & Send Invite
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
