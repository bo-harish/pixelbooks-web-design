import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft, User, Feather, Pencil } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { INITIAL_AUTHOR_DATA, AuthorItem } from "./author-management";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/author-management/$authorId")({
  head: ({ params }) => ({
    meta: [
      { title: `Update Author ${params.authorId} — PixelBooks Admin` },
      {
        name: "description",
        content: "Update author information, image, and email address in PixelBooks Admin.",
      },
    ],
  }),
  component: AuthorDetailPage,
});

function AuthorDetailPage() {
  const { authorId } = Route.useParams();
  const navigate = useNavigate();

  const author = useMemo(() => {
    return (
      INITIAL_AUTHOR_DATA.find((a) => a.id === authorId) || {
        id: authorId,
        name: "Westdeutscher Verlag I Koln Und Opladen",
        email: null,
      }
    );
  }, [authorId]);

  const [name, setName] = useState(author.name);
  const [email, setEmail] = useState(author.email || "");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(author.avatarUrl);

  const handleBackToList = () => {
    navigate({ to: "/pb-admin/author-management" });
  };

  const handleUpdateAuthorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Author updated successfully", {
      description: `Author details for "${name}" have been saved.`,
    });
    handleBackToList();
  };

  return (
    <AppShell title="Author Management">
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-6 max-w-5xl">
          {/* Back Button Header */}
          <div>
            <button
              type="button"
              onClick={handleBackToList}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
              aria-label="Back to author list"
            >
              <ArrowLeft size={18} />
            </button>
          </div>

          {/* Main Update Author Card */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-xs">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Update Author
            </h2>

            <form onSubmit={handleUpdateAuthorSubmit} className="space-y-8">
              {/* Author Image Section */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-foreground block">
                  Author Image<span className="text-rose-500">*</span>
                </label>
                <div className="relative w-fit">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="h-28 w-28 rounded-full object-cover ring-2 ring-border shadow-xs"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                      <Feather size={48} />
                    </div>
                  )}
                  {/* Pencil Edit Icon Badge */}
                  <label className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-transform hover:scale-105 cursor-pointer">
                    <Pencil size={15} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setAvatarUrl(url);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground block">
                    Name<span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Author Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground outline-none transition-colors focus:border-[var(--brand)]"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground block">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="h-11 px-6 rounded-xl border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-7 rounded-xl text-xs font-semibold shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
