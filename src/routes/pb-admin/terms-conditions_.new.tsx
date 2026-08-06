import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link2,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Save,
  ChevronDown,
  Building2,
  UserCheck,
  Feather,
  Library,
  GraduationCap,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";
import { type PolicyRole } from "@/lib/terms-conditions-data";

export const Route = createFileRoute("/pb-admin/terms-conditions_/new")({
  component: CreateTermsConditionsPage,
});

function CreateTermsConditionsPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<PolicyRole>("Publisher");
  const [content, setContent] = useState("");
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({
    bold: false,
    italic: false,
    underline: false,
  });
  const [selectedHeading, setSelectedHeading] = useState("Paragraph");
  const [headingDropdownOpen, setHeadingDropdownOpen] = useState(false);

  const roleConfig: { role: PolicyRole; icon: React.ElementType }[] = [
    { role: "Publisher", icon: Building2 },
    { role: "Customer", icon: UserCheck },
    { role: "Author", icon: Feather },
    { role: "Library", icon: Library },
    { role: "Library User", icon: GraduationCap },
  ];

  const toggleFormat = (key: string) => {
    setActiveFormats((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Terms & Conditions for ${selectedRole} created successfully!`);
    navigate({ to: "/pb-admin/terms-conditions" });
  };

  return (
    <AppShell
      title="Create Terms & Conditions"
      subtitle="Define and publish new terms & conditions for specified platform roles."
    >
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl space-y-6">
        {/* Top Back Navigation Header */}
        <div className="flex items-center gap-3">
          <Link
            to="/pb-admin/terms-conditions"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
            aria-label="Back to Terms and Conditions"
          >
            <ArrowLeft size={16} />
          </Link>
          <span className="text-sm font-semibold text-foreground">
            Back to Terms & Conditions
          </span>
        </div>

        {/* Redesigned Policy Applicable For Role Selector */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-2xs space-y-3">
          <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Create Terms For
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            {roleConfig.map(({ role, icon: Icon }) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "border-2 border-[var(--brand)] bg-[var(--sidebar-highlight)] text-[var(--brand)] shadow-2xs"
                      : "border border-border bg-card text-muted-foreground hover:border-border/80 hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <Icon
                    size={16}
                    className={isSelected ? "text-[var(--brand)]" : "text-muted-foreground"}
                  />
                  <span>{role}</span>
                  {isSelected && (
                    <Check size={14} className="ml-0.5 text-[var(--brand)]" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rich Text Editor Container */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            {/* WYSIWYG Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-border bg-secondary/40 p-2.5">
              {/* Text Styling */}
              <button
                type="button"
                onClick={() => toggleFormat("bold")}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                  activeFormats.bold
                    ? "bg-[var(--brand)] text-white font-bold"
                    : "text-foreground hover:bg-secondary"
                }`}
                title="Bold"
              >
                <Bold size={15} />
              </button>
              <button
                type="button"
                onClick={() => toggleFormat("italic")}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                  activeFormats.italic
                    ? "bg-[var(--brand)] text-white"
                    : "text-foreground hover:bg-secondary"
                }`}
                title="Italic"
              >
                <Italic size={15} />
              </button>
              <button
                type="button"
                onClick={() => toggleFormat("underline")}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                  activeFormats.underline
                    ? "bg-[var(--brand)] text-white"
                    : "text-foreground hover:bg-secondary"
                }`}
                title="Underline"
              >
                <Underline size={15} />
              </button>
              <button
                type="button"
                onClick={() => toggleFormat("strike")}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                  activeFormats.strike
                    ? "bg-[var(--brand)] text-white"
                    : "text-foreground hover:bg-secondary"
                }`}
                title="Strikethrough"
              >
                <Strikethrough size={15} />
              </button>

              <div className="mx-1 h-5 w-px bg-border" />

              {/* Lists */}
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary cursor-pointer"
                title="Bulleted List"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary cursor-pointer"
                title="Numbered List"
              >
                <ListOrdered size={15} />
              </button>

              <div className="mx-1 h-5 w-px bg-border" />

              {/* Heading Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setHeadingDropdownOpen((o) => !o)}
                  className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
                >
                  <span>{selectedHeading}</span>
                  <ChevronDown size={13} className="text-muted-foreground" />
                </button>
                {headingDropdownOpen && (
                  <div
                    className="absolute left-0 top-full z-20 mt-1 w-36 rounded-lg border border-border bg-card py-1 shadow-lg"
                    onMouseLeave={() => setHeadingDropdownOpen(false)}
                  >
                    {["Heading 1", "Heading 2", "Heading 3", "Paragraph"].map(
                      (h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => {
                            setSelectedHeading(h);
                            setHeadingDropdownOpen(false);
                          }}
                          className={`block w-full px-3 py-1.5 text-left text-xs hover:bg-secondary ${
                            selectedHeading === h
                              ? "font-bold text-[var(--brand)]"
                              : "text-foreground"
                          }`}
                        >
                          {h}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="mx-1 h-5 w-px bg-border" />

              {/* Link & Palette */}
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary cursor-pointer"
                title="Insert Link"
              >
                <Link2 size={15} />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary cursor-pointer"
                title="Text Highlight"
              >
                <Palette size={15} />
              </button>

              <div className="mx-1 h-5 w-px bg-border" />

              {/* Alignments */}
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary cursor-pointer"
                title="Align Left"
              >
                <AlignLeft size={15} />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary cursor-pointer"
                title="Align Center"
              >
                <AlignCenter size={15} />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary cursor-pointer"
                title="Align Right"
              >
                <AlignRight size={15} />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary cursor-pointer"
                title="Align Justify"
              >
                <AlignJustify size={15} />
              </button>
            </div>

            {/* Editable Content Area */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type Here..."
              className="w-full min-h-[380px] p-6 text-sm text-foreground bg-card outline-none font-sans leading-relaxed resize-y placeholder:text-muted-foreground"
            />
          </div>

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/pb-admin/terms-conditions" })}
              className="h-11 rounded-xl border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--brand)] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-sm"
            >
              <Save size={16} />
              Save Details
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
