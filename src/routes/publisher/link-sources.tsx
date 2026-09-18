import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, ExternalLink, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import { usePublisherType } from "@/hooks/use-publisher-type";
import { toast } from "sonner";

export const Route = createFileRoute("/publisher/link-sources")({
  head: () => ({
    meta: [
      { title: "Link Sources — Publisher" },
      {
        name: "description",
        content: "Manage publisher link sources for category-based external destinations.",
      },
    ],
  }),
  component: PublisherLinkSourcesPage,
});

type LinkSourceStatus = "Enabled" | "Disabled";

type LinkSourceItem = {
  id: string;
  categoryName: string;
  externalLink: string;
  libraries: string[];
  status: LinkSourceStatus;
};

const PUBLISHER_LINK_SOURCES_STORAGE_KEY = "pixelbooks_publisher_link_sources";

const ALL_LIBRARIES = [
  { id: "lib-1", name: "Central University Digital Library" },
  { id: "lib-2", name: "National Science & Tech Consortium" },
  { id: "lib-3", name: "City Academic Library System" },
  { id: "lib-4", name: "Delhi Public Library" },
  { id: "lib-5", name: "State Institute of Technology Library" },
  { id: "lib-6", name: "IIT Delhi Central Library" },
  { id: "lib-7", name: "Indian Institute of Science Library" },
];

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed
    : `https://${trimmed}`;
}

function PublisherLinkSourcesPage() {
  const [publisherType] = usePublisherType();
  const navigate = useNavigate();

  useEffect(() => {
    if (publisherType !== "Library-Only Publisher") {
      navigate({ to: "/publisher", replace: true });
    }
  }, [publisherType, navigate]);

  if (publisherType !== "Library-Only Publisher") {
    return null;
  }

  const [items, setItems] = useState<LinkSourceItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(PUBLISHER_LINK_SOURCES_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((item: any, index: number) => ({
          id: String(item?.id ?? `link-source-${index + 1}`),
          categoryName: String(item?.categoryName ?? "").trim(),
          externalLink: String(item?.externalLink ?? "").trim(),
          libraries: Array.isArray(item?.libraries)
            ? item.libraries.filter((lib: unknown) => typeof lib === "string")
            : [],
          status: (item?.status === "Disabled" ? "Disabled" : "Enabled") as LinkSourceStatus,
        }))
        .filter((item) => item.categoryName && item.externalLink);
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([]);
  const [isLibraryDropdownOpen, setIsLibraryDropdownOpen] = useState(false);
  const [librarySearchTerm, setLibrarySearchTerm] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const libraryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PUBLISHER_LINK_SOURCES_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (libraryDropdownRef.current && !libraryDropdownRef.current.contains(e.target as Node)) {
        setIsLibraryDropdownOpen(false);
      }
    };

    if (isLibraryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLibraryDropdownOpen]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      return (
        item.categoryName.toLowerCase().includes(q) ||
        item.externalLink.toLowerCase().includes(q) ||
        item.libraries.some((lib) => lib.toLowerCase().includes(q))
      );
    });
  }, [items, searchQuery]);

  const filteredLibraries = useMemo(() => {
    const q = librarySearchTerm.trim().toLowerCase();
    if (!q) return ALL_LIBRARIES;
    return ALL_LIBRARIES.filter((lib) => lib.name.toLowerCase().includes(q));
  }, [librarySearchTerm]);

  const isAllLibrariesSelected =
    ALL_LIBRARIES.length > 0 && selectedLibraries.length === ALL_LIBRARIES.length;

  const resetForm = () => {
    setCategoryName("");
    setExternalLink("");
    setSelectedLibraries([]);
    setLibrarySearchTerm("");
    setIsLibraryDropdownOpen(false);
    setIsEnabled(true);
    setEditingId(null);
  };

  const toggleLibrary = (libraryName: string) => {
    setSelectedLibraries((prev) =>
      prev.includes(libraryName)
        ? prev.filter((name) => name !== libraryName)
        : [...prev, libraryName]
    );
  };

  const handleSelectAllLibraries = () => {
    if (isAllLibrariesSelected) {
      setSelectedLibraries([]);
      return;
    }

    setSelectedLibraries(ALL_LIBRARIES.map((lib) => lib.name));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = categoryName.trim();
    const formattedUrl = normalizeUrl(externalLink);

    if (!trimmedName) {
      toast.error("Category Name is required.");
      return;
    }

    if (!formattedUrl) {
      toast.error("External Link is required.");
      return;
    }

    if (selectedLibraries.length === 0) {
      toast.error("Select at least one library.");
      return;
    }

    try {
      new URL(formattedUrl);
    } catch {
      toast.error("Enter a valid External Link URL.");
      return;
    }

    const isDuplicate = items.some((item) => {
      if (editingId && item.id === editingId) return false;
      return item.categoryName.toLowerCase() === trimmedName.toLowerCase();
    });

    if (isDuplicate) {
      toast.error(`Category \"${trimmedName}\" already exists in Link Sources.`);
      return;
    }

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                categoryName: trimmedName,
                externalLink: formattedUrl,
                libraries: selectedLibraries,
                status: isEnabled ? "Enabled" : "Disabled",
              }
            : item
        )
      );
      toast.success("Link Source updated.");
      resetForm();
      return;
    }

    const newItem: LinkSourceItem = {
      id: `link-source-${Date.now()}`,
      categoryName: trimmedName,
      externalLink: formattedUrl,
      libraries: selectedLibraries,
      status: isEnabled ? "Enabled" : "Disabled",
    };

    setItems((prev) => [newItem, ...prev]);
    toast.success("Link Source added.");
    resetForm();
  };

  const handleEdit = (item: LinkSourceItem) => {
    setCategoryName(item.categoryName);
    setExternalLink(item.externalLink);
    setSelectedLibraries(item.libraries ?? []);
    setIsEnabled(item.status === "Enabled");
    setEditingId(item.id);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
    toast.success("Link Source removed.");
  };

  const handleToggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Enabled" ? "Disabled" : "Enabled" }
          : item
      )
    );
  };

  return (
    <AppShell
      title="Link Sources"
      subtitle="Manage external destination links separately from category creation"
    >
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
        <form
          onSubmit={handleSave}
          className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-2xs flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Category Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder=""
                className="h-11 w-full rounded-lg border border-border bg-white dark:bg-card px-3.5 text-xs text-foreground outline-none focus:border-[var(--brand)]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-semibold text-foreground">
                External Link <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="https://in.pearson.com/"
                  className="h-11 w-full rounded-lg border border-border bg-white dark:bg-card pl-9 pr-3.5 text-xs text-foreground outline-none focus:border-[var(--brand)]"
                />
                <ExternalLink
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5" ref={libraryDropdownRef}>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-foreground">
                Libraries <span className="text-destructive">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                Select one or more libraries
              </span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLibraryDropdownOpen((prev) => !prev)}
                className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-lg border bg-white dark:bg-card px-3 py-2 text-left text-xs transition-colors ${isLibraryDropdownOpen
                    ? "border-[var(--brand)]"
                    : "border-border hover:border-border/80"
                  }`}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedLibraries.length === 0 ? (
                    <span className="text-muted-foreground">Select libraries...</span>
                  ) : (
                    selectedLibraries.slice(0, 2).map((libName) => (
                      <span
                        key={libName}
                        className="inline-flex items-center gap-1 rounded-md border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--brand)]"
                      >
                        <span>{libName}</span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLibrary(libName);
                          }}
                          className="inline-flex cursor-pointer"
                        >
                          <X size={11} />
                        </span>
                      </span>
                    ))
                  )}
                  {selectedLibraries.length > 2 && (
                    <span className="text-[11px] text-muted-foreground">
                      +{selectedLibraries.length - 2} more
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={15}
                  className={`shrink-0 text-muted-foreground transition-transform ${isLibraryDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isLibraryDropdownOpen && (
                <div className="absolute left-0 top-full z-30 mt-1.5 w-full rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
                  <div className="border-b border-border p-2.5">
                    <input
                      type="text"
                      value={librarySearchTerm}
                      onChange={(e) => setLibrarySearchTerm(e.target.value)}
                      placeholder="Search library..."
                      className="h-9 w-full rounded-md border border-border bg-white dark:bg-card px-2.5 text-xs text-foreground outline-none focus:border-[var(--brand)]"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleSelectAllLibraries}
                        className="text-[11px] font-semibold text-[var(--brand)] hover:underline"
                      >
                        {isAllLibrariesSelected ? "Deselect all" : "Select all"}
                      </button>
                      <span className="text-[11px] text-muted-foreground">
                        {selectedLibraries.length} selected
                      </span>
                    </div>
                  </div>

                  <div className="max-h-56 overflow-y-auto">
                    {filteredLibraries.length === 0 ? (
                      <div className="px-3 py-3 text-xs text-muted-foreground">No libraries found.</div>
                    ) : (
                      filteredLibraries.map((lib) => {
                        const checked = selectedLibraries.includes(lib.name);
                        return (
                          <button
                            key={lib.id}
                            type="button"
                            onClick={() => toggleLibrary(lib.name)}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors ${checked
                                ? "bg-[var(--sidebar-highlight)]/70 text-[var(--brand)]"
                                : "hover:bg-secondary/40 text-foreground"
                              }`}
                          >
                            <span className="min-w-0">
                              <span className="block truncate font-medium">{lib.name}</span>
                            </span>
                            {checked && <Check size={13} className="shrink-0" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 px-3.5 py-3">
            <div className="flex items-center gap-2">
              <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
              <span className="text-xs font-semibold text-foreground">
                Status: {isEnabled ? "ON" : "OFF"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-xs font-semibold text-white hover:bg-[var(--brand)]/90 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>{editingId ? "Update Link Source" : "Add Link Source"}</span>
              </button>
            </div>
          </div>
        </form>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Category Name or External Link"
                className="h-10 w-full rounded-lg border border-border bg-white dark:bg-card pl-9 pr-3.5 text-xs text-foreground outline-none focus:border-[var(--brand)]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">External Link</th>
                  <th className="py-3.5 px-4">Libraries</th>
                  <th className="py-3.5 px-4 text-center w-28">Status</th>
                  <th className="py-3.5 px-4 text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 px-4 text-center text-xs text-muted-foreground">
                      No link sources found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">{item.categoryName}</td>
                      <td className="py-3.5 px-4">
                        <a
                          href={item.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[var(--brand)] hover:underline break-all"
                        >
                          <ExternalLink size={12} />
                          <span>{item.externalLink}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.libraries.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {item.libraries.slice(0, 2).map((libName) => (
                              <span
                                key={libName}
                                className="inline-flex rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-[11px] text-foreground"
                              >
                                {libName}
                              </span>
                            ))}
                            {item.libraries.length > 2 && (
                              <span className="text-[11px] text-muted-foreground">
                                +{item.libraries.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <Switch
                            checked={item.status === "Enabled"}
                            onCheckedChange={() => handleToggleStatus(item.id)}
                          />
                          <span className="text-xs text-muted-foreground">
                            {item.status === "Enabled" ? "ON" : "OFF"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex justify-end items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-[var(--brand)] hover:border-[var(--brand)] transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
