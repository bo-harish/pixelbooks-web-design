import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronsLeft,
  ChevronsRight,
  User,
  Pencil,
  Edit,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/author-management")({
  head: () => ({
    meta: [
      { title: "Author Management — PixelBooks Admin" },
      {
        name: "description",
        content: "View and manage authors, catalog contributions, and author profiles in PixelBooks Admin.",
      },
    ],
  }),
  component: AuthorManagementPage,
});

export interface AuthorItem {
  id: string;
  name: string;
  email: string | null;
  avatarUrl?: string;
  avatarBg?: string;
  publishedTitlesCount?: number;
  totalSales?: string;
  joinedDate?: string;
  bio?: string;
}

export const INITIAL_AUTHOR_DATA: AuthorItem[] = [
  {
    id: "auth-1",
    name: "Westdeutscher Verlag I Koln Und Opladen",
    email: null,
    avatarBg: "oklch(0.55 0.11 195)",
    publishedTitlesCount: 14,
    totalSales: "$12,450",
    joinedDate: "12 Jan 2024",
    bio: "Academic publisher and author collective specializing in social sciences and cultural research.",
  },
  {
    id: "auth-2",
    name: "LaTeX with hyperref",
    email: null,
    avatarBg: "oklch(0.60 0.14 220)",
    publishedTitlesCount: 8,
    totalSales: "$4,820",
    joinedDate: "05 Mar 2024",
    bio: "Technical author and documentation specialist for digital typesetting and formatting.",
  },
  {
    id: "auth-3",
    name: "Reshma Mukundan",
    email: null,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
    publishedTitlesCount: 26,
    totalSales: "$38,900",
    joinedDate: "18 Aug 2023",
    bio: "Best-selling fiction and contemporary lifestyle narrative author with worldwide acclaim.",
  },
  {
    id: "auth-4",
    name: "Tom Sawyer",
    email: null,
    avatarBg: "oklch(0.58 0.15 155)",
    publishedTitlesCount: 5,
    totalSales: "$6,150",
    joinedDate: "11 Nov 2023",
  },
  {
    id: "auth-5",
    name: "Dada Bhagawan",
    email: null,
    avatarBg: "oklch(0.52 0.12 30)",
    publishedTitlesCount: 42,
    totalSales: "$54,200",
    joinedDate: "09 Feb 2023",
    bio: "Spiritual philosophy and mindfulness author with extensive international catalog.",
  },
  {
    id: "auth-6",
    name: "'s Notes",
    email: null,
    avatarBg: "oklch(0.50 0.10 280)",
    publishedTitlesCount: 3,
    totalSales: "$1,200",
    joinedDate: "20 May 2024",
  },
  {
    id: "auth-7",
    name: "Digitized by the Internet Archive",
    email: null,
    avatarBg: "oklch(0.48 0.08 190)",
    publishedTitlesCount: 112,
    totalSales: "$92,400",
    joinedDate: "01 Jan 2023",
    bio: "Public domain historical archives and preservation collection.",
  },
  {
    id: "auth-8",
    name: "TeX",
    email: null,
    avatarBg: "oklch(0.62 0.16 260)",
    publishedTitlesCount: 19,
    totalSales: "$15,800",
    joinedDate: "14 Jul 2023",
  },
  {
    id: "auth-9",
    name: "John R. Carling",
    email: null,
    avatarBg: "oklch(0.56 0.13 40)",
    publishedTitlesCount: 7,
    totalSales: "$9,340",
    joinedDate: "28 Sep 2023",
  },
  {
    id: "auth-10",
    name: "Springer F Achmedlen Wiesbaden GmbH",
    email: null,
    avatarBg: "oklch(0.45 0.11 210)",
    publishedTitlesCount: 33,
    totalSales: "$41,000",
    joinedDate: "04 Oct 2023",
  },
  {
    id: "auth-11",
    name: "William Shakespeare",
    email: "william.shakespeare@classic.org",
    avatarBg: "oklch(0.65 0.18 85)",
    publishedTitlesCount: 38,
    totalSales: "$185,000",
    joinedDate: "15 Apr 2022",
    bio: "English playwright, poet, and actor widely regarded as the greatest writer in the English language.",
  },
  {
    id: "auth-12",
    name: "Jane Austen",
    email: "j.austen@literature.org",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    publishedTitlesCount: 6,
    totalSales: "$142,300",
    joinedDate: "10 Dec 2022",
    bio: "English novelist known primarily for her six major novels interpreting the British landed gentry.",
  },
];

function AuthorManagementPage() {
  const [authors, setAuthors] = useState<AuthorItem[]>(INITIAL_AUTHOR_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Popup Modal state
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorItem | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Form states for update popup
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | undefined>(undefined);

  const totalResults = 582;
  const itemsPerPage = 10;

  const filteredAuthors = useMemo(() => {
    return authors.filter((author) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const matchesName = author.name.toLowerCase().includes(query);
      const matchesEmail = author.email ? author.email.toLowerCase().includes(query) : false;
      return matchesName || matchesEmail;
    });
  }, [authors, searchQuery]);

  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage) || 1;

  const paginatedAuthors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAuthors.slice(start, start + itemsPerPage);
  }, [filteredAuthors, currentPage, itemsPerPage]);

  const handleOpenEditPopup = (author: AuthorItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedAuthor(author);
    setEditName(author.name);
    setEditEmail(author.email || "");
    setEditAvatarUrl(author.avatarUrl);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateAuthorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuthor) return;

    setAuthors((prev) =>
      prev.map((a) =>
        a.id === selectedAuthor.id
          ? {
              ...a,
              name: editName.trim() || a.name,
              email: editEmail.trim() ? editEmail.trim() : null,
              avatarUrl: editAvatarUrl,
            }
          : a
      )
    );

    toast.success("Author updated successfully", {
      description: `Author details for "${editName}" have been saved.`,
    });
    setIsUpdateModalOpen(false);
    setSelectedAuthor(null);
  };

  return (
    <AppShell title="Author Management" subtitle="Overview and status control for registered author profiles">
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">

        {/* Toolbar Container */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="relative w-full">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-xs sm:text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-semibold text-foreground bg-muted/20">
                  <th className="py-4 px-6 w-[75%]">Name</th>
                  <th className="py-4 px-6 w-[25%] text-center">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedAuthors.length > 0 ? (
                  paginatedAuthors.map((author) => (
                    <tr
                      key={author.id}
                      onClick={() => handleOpenEditPopup(author)}
                      className="group border-b border-border/60 transition-colors cursor-pointer hover:bg-secondary/50"
                    >
                      {/* Name & Email Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          {author.avatarUrl ? (
                            <img
                              src={author.avatarUrl}
                              alt={author.name}
                              className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border shadow-xs"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                              <User size={20} />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-foreground text-sm group-hover:text-[var(--brand)] transition-colors truncate">
                              {author.name}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {author.email || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Edit Column */}
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditPopup(author, e)}
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                          style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <User size={32} className="text-muted-foreground/50" />
                        <p className="text-base font-medium">No authors found</p>
                        <p className="text-xs">Try adjusting your search query.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
          <div className="text-xs sm:text-sm text-foreground font-normal">
            Showing <span className="font-semibold">{paginatedAuthors.length}</span> from{" "}
            <span className="font-semibold">{searchQuery ? filteredAuthors.length : totalResults}</span> results
          </div>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronsLeft size={15} />
              Previous
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Next
              <ChevronsRight size={15} />
            </button>
          </div>
        </div>

        {/* Modal Popup: Update Author */}
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent className="sm:max-w-xl rounded-2xl bg-card border-border p-6 sm:p-8 shadow-2xl">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-2xl font-bold text-foreground">
                Update Author
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Update author image, name, and contact email address.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateAuthorSubmit} className="space-y-6">
              {/* Author Image Section */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground block">
                  Author Image<span className="text-rose-500">*</span>
                </label>
                <div className="relative w-fit">
                  {editAvatarUrl ? (
                    <img
                      src={editAvatarUrl}
                      alt={editName}
                      className="h-24 w-24 rounded-full object-cover ring-2 ring-border shadow-xs"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                      <User size={40} />
                    </div>
                  )}
                  {/* Pencil Edit Icon Badge */}
                  <label className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-transform hover:scale-105 cursor-pointer">
                    <Pencil size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setEditAvatarUrl(url);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Form Fields Stack (2 Lines) */}
              <div className="space-y-4">
                {/* Line 1: Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Name<span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Author Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground outline-none transition-colors focus:border-[var(--brand)]"
                  />
                </div>

                {/* Line 2: Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="h-10 px-5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-lg text-xs font-semibold shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  Update
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </AppShell>
  );
}
