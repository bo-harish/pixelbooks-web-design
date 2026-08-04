import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Globe,
  FileCode,
  Check,
  Copy,
  FileText,
  ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import { DropdownSelect } from "@/components/ui/dropdown-select";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/marketing/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap Management — PixelBooks Admin" },
      {
        name: "description",
        content: "Manage search engine XML sitemap URLs, priorities, crawl frequencies, and index status.",
      },
    ],
  }),
  component: SitemapPage,
});

export interface SitemapEntry {
  id: string;
  url: string;
  category: "Business" | "Book Details" | "Catalogue" | "Bundles" | "Authors";
  priority: string;
  changeFrequency: "Always" | "Hourly" | "Daily" | "Weekly" | "Monthly" | "Yearly" | "Never";
  status: boolean;
}

const PRIORITIES = ["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"];
const FREQUENCIES: SitemapEntry["changeFrequency"][] = [
  "Always",
  "Hourly",
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
  "Never",
];

const INITIAL_ENTRIES: SitemapEntry[] = [
  {
    id: "site-1",
    url: "https://pixelbooksapp.com",
    category: "Business",
    priority: "1.0",
    changeFrequency: "Monthly",
    status: true,
  },
  {
    id: "site-2",
    url: "https://pixelbooksapp.com/about-us",
    category: "Business",
    priority: "1.0",
    changeFrequency: "Monthly",
    status: true,
  },
  {
    id: "site-3",
    url: "https://pixelbooksapp.com/contact",
    category: "Business",
    priority: "1.0",
    changeFrequency: "Monthly",
    status: true,
  },
  {
    id: "site-4",
    url: "https://pixelbooksapp.com/faq",
    category: "Business",
    priority: "1.0",
    changeFrequency: "Monthly",
    status: true,
  },
  {
    id: "site-5",
    url: "https://pixelbooksapp.com/support",
    category: "Business",
    priority: "1.0",
    changeFrequency: "Monthly",
    status: true,
  },
  {
    id: "site-6",
    url: "https://pixelbooksapp.com/terms-con-pri-policy/2",
    category: "Business",
    priority: "1.0",
    changeFrequency: "Monthly",
    status: true,
  },
  {
    id: "site-7",
    url: "https://pixelbooksapp.com/terms-con-pri-policy/1",
    category: "Business",
    priority: "1.0",
    changeFrequency: "Monthly",
    status: true,
  },
  {
    id: "site-8",
    url: "https://pixelbooksapp.com/author/susan-hill/english-for-writing-research-papers",
    category: "Book Details",
    priority: "1.0",
    changeFrequency: "Monthly",
    status: true,
  },
  {
    id: "site-9",
    url: "https://pixelbooksapp.com/author/arundati-roy/will-durant",
    category: "Book Details",
    priority: "1.0",
    changeFrequency: "Monthly",
    status: true,
  },
  {
    id: "site-10",
    url: "https://pixelbooksapp.com/author/arundati-roy/the-power-of-your-subconscious-mind",
    category: "Book Details",
    priority: "1.0",
    changeFrequency: "Monthly",
    status: true,
  },
  {
    id: "site-11",
    url: "https://pixelbooksapp.com/catalogue/academic-reference",
    category: "Catalogue",
    priority: "0.9",
    changeFrequency: "Weekly",
    status: true,
  },
  {
    id: "site-12",
    url: "https://pixelbooksapp.com/bundles/civil-services-prep",
    category: "Bundles",
    priority: "0.9",
    changeFrequency: "Weekly",
    status: true,
  },
  {
    id: "site-13",
    url: "https://pixelbooksapp.com/author/dr-ashok-alex/nep-2020",
    category: "Book Details",
    priority: "1.0",
    changeFrequency: "Monthly",
    status: true,
  },
  {
    id: "site-14",
    url: "https://pixelbooksapp.com/authors/featured",
    category: "Authors",
    priority: "0.8",
    changeFrequency: "Weekly",
    status: true,
  },
];

const TOTAL_SIMULATED_RESULTS = 949;
const PAGE_SIZE = 10;
const SITEMAP_PUBLIC_URL = "https://www.pixelbooksapp.com/sitemap.xml";

export function SitemapPage() {
  const [entries, setEntries] = useState<SitemapEntry[]>(INITIAL_ENTRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewSitemapOpen, setIsViewSitemapOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter entries based on search query
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase().trim();
    return entries.filter(
      (item) => item.url.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [entries, searchQuery]);

  // Paginated items
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredEntries.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredEntries, currentPage]);

  const totalPages = Math.max(1, Math.ceil(TOTAL_SIMULATED_RESULTS / PAGE_SIZE));

  // Toggle url active status
  const handleToggleStatus = (id: string) => {
    setEntries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.status;
          toast.success(`URL crawler status set to ${nextState ? "Active" : "Inactive"}`);
          return { ...item, status: nextState };
        }
        return item;
      })
    );
  };

  // Change priority
  const handleChangePriority = (id: string, newPriority: string) => {
    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, priority: newPriority } : item))
    );
    toast.success(`Priority updated to ${newPriority}`);
  };

  // Change frequency
  const handleChangeFrequency = (id: string, newFreq: SitemapEntry["changeFrequency"]) => {
    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, changeFrequency: newFreq } : item))
    );
    toast.success(`Change frequency updated to ${newFreq}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(SITEMAP_PUBLIC_URL);
    setCopiedLink(true);
    toast.success("Sitemap URL copied to clipboard");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <AppShell
      title="Sitemap"
      subtitle="Configure XML sitemap index rules, priority weights, update frequencies, and crawling status for search engine bots."
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Search Bar & View Sitemap Link Outside White Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Bar White Box */}
          <div className="flex-1 rounded-xl border border-border bg-card p-4 shadow-2xs">
            <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3.5 shadow-none transition-colors focus-within:border-[var(--brand)]">
              <Search size={16} className="mr-2 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>

          {/* View Sitemap Link matching pa-1 style */}
          <div className="flex items-center justify-end px-1 sm:px-0">
            <button
              type="button"
              onClick={() => setIsViewSitemapOpen(true)}
              className="inline-flex items-center text-xs font-semibold text-[var(--brand)] hover:underline transition-all group shrink-0 cursor-pointer"
            >
              <span>View Sitemap</span>
            </button>
          </div>
        </div>

        {/* Sitemap Table Container */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4 font-semibold">Url</th>
                  <th className="px-6 py-4 whitespace-nowrap font-semibold">Category</th>
                  <th className="px-6 py-4 whitespace-nowrap font-semibold">Priority</th>
                  <th className="px-6 py-4 whitespace-nowrap font-semibold">Change Frequency</th>
                  <th className="px-6 py-4 text-center whitespace-nowrap font-semibold">Enable/Disable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText size={32} className="text-muted-foreground/60" />
                        <p className="font-medium text-sm">No URLs found</p>
                        <p className="text-xs text-muted-foreground">
                          Try adjusting your search query filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedEntries.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-muted/20"
                    >
                      {/* URL Column */}
                      <td className="px-6 py-4 font-normal text-foreground max-w-[450px]">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs sm:text-sm text-foreground truncate hover:text-[var(--brand)] transition-colors">
                            {item.url}
                          </span>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-[var(--brand)] transition-colors shrink-0"
                            title="Open URL in new tab"
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      </td>

                      {/* Category Column */}
                      <td className="px-6 py-4 text-foreground font-normal whitespace-nowrap text-sm">
                        {item.category}
                      </td>

                      {/* Priority Dropdown Select Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DropdownSelect
                          value={item.priority}
                          options={PRIORITIES}
                          onChange={(p) => handleChangePriority(item.id, p)}
                          className="w-24 min-w-0"
                          align="left"
                        />
                      </td>

                      {/* Change Frequency Dropdown Select Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DropdownSelect
                          value={item.changeFrequency}
                          options={FREQUENCIES}
                          onChange={(freq) => handleChangeFrequency(item.id, freq as any)}
                          className="w-32 min-w-0"
                          align="left"
                        />
                      </td>

                      {/* Status Switch Toggle Column */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex justify-center">
                          <Switch
                            checked={item.status}
                            onCheckedChange={() => handleToggleStatus(item.id)}
                            className="data-[state=checked]:bg-[var(--brand)] shadow-xs"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer matching screenshot design */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
          <div className="text-xs sm:text-sm text-foreground font-normal">
            Showing <span className="font-semibold">{paginatedEntries.length}</span> from{" "}
            <span className="font-semibold">{TOTAL_SIMULATED_RESULTS}</span> results
          </div>

          <div className="flex items-center gap-1.5 self-center sm:self-auto text-xs sm:text-sm">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              « Previous
            </button>

            {[1, 2, 3, 4, 5].map((pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg font-semibold transition-colors cursor-pointer ${isActive
                    ? "bg-[var(--sidebar-highlight)] text-[var(--brand)] border border-[var(--brand)]/30 font-bold"
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
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Next »
            </button>
          </div>
        </div>
      </div>

      {/* View Sitemap Link Modal */}
      <Dialog open={isViewSitemapOpen} onOpenChange={setIsViewSitemapOpen}>
        <DialogContent className="sm:max-w-[550px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Globe size={18} className="text-[var(--brand)]" />
              View Sitemap
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Direct access link to the public XML sitemap.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <p className="text-sm font-medium text-foreground">
              You can view the sitemap in the link below:
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4 shadow-2xs">
              <a
                href={SITEMAP_PUBLIC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline break-all"
              >
                <span>{SITEMAP_PUBLIC_URL}</span>
                <ExternalLink size={14} className="shrink-0 text-[var(--brand)]" />
              </a>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary transition-colors shrink-0 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    <span className="text-emerald-600 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setIsViewSitemapOpen(false)}
              className="px-4.5 py-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
