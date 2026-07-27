import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, ChevronDown, ChevronRight, Eye, Building2, Users, BookOpen,
  ArrowLeft, Upload, ScrollText, Table, Calendar, TrendingUp, BookMarked,
  FolderOpen, UserCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/views-report")({
  head: () => ({
    meta: [
      { title: "Book Views Report — PixelBooks Admin" },
      { name: "description", content: "Track eBook view counts by publisher, author, title, or category." },
    ],
  }),
  component: AdminViewsReportPage,
});

// ── Types ─────────────────────────────────────────────────────────────────────

type ReportMode = null | "publisher" | "author" | "title" | "category";
type EntityType  = "Publisher" | "Author";

type EntityRow = {
  id: string; name: string; type: EntityType;
  avatarLetter: string; totalViews: number; totalTitles: number;
};

type BookViewItem = {
  id: string; title: string; publisher: string;
  category: string; subCategory: string;
  coverGradient: string; initials: string;
  totalViews: number; lastViewedDate: string;
};

type CategoryRow = {
  id: string; category: string; subCategories: string[];
  titleCount: number; totalViews: number;
};

// ── Static Data ───────────────────────────────────────────────────────────────

const entityData: EntityRow[] = [
  { id:"vr-1",  name:"Cambridge University Press", type:"Publisher", avatarLetter:"CU", totalViews:525, totalTitles:42 },
  { id:"vr-2",  name:"Meadows Publishers",          type:"Publisher", avatarLetter:"MP", totalViews:318, totalTitles:28 },
  { id:"vr-3",  name:"Oxford University Press",     type:"Publisher", avatarLetter:"OU", totalViews:287, totalTitles:35 },
  { id:"vr-4",  name:"HarperCollins India",         type:"Publisher", avatarLetter:"HC", totalViews:244, totalTitles:19 },
  { id:"vr-5",  name:"Werley Nortreus",             type:"Author",    avatarLetter:"WN", totalViews:198, totalTitles: 4 },
  { id:"vr-6",  name:"APK Publishers",              type:"Publisher", avatarLetter:"AP", totalViews:176, totalTitles:14 },
  { id:"vr-7",  name:"Fingerprint Publishing",      type:"Publisher", avatarLetter:"FP", totalViews:165, totalTitles:22 },
  { id:"vr-8",  name:"Kinder Publications",         type:"Publisher", avatarLetter:"KP", totalViews:152, totalTitles:11 },
  { id:"vr-9",  name:"Louisa May Alcott",           type:"Author",    avatarLetter:"LA", totalViews:134, totalTitles: 6 },
  { id:"vr-10", name:"RJ Authors",                  type:"Author",    avatarLetter:"RJ", totalViews:121, totalTitles: 8 },
  { id:"vr-11", name:"Orange Publishers",           type:"Publisher", avatarLetter:"OP", totalViews:108, totalTitles:17 },
  { id:"vr-12", name:"Aisha Publishers",            type:"Publisher", avatarLetter:"AI", totalViews: 94, totalTitles: 9 },
  { id:"vr-13", name:"Cengage & Pearson",           type:"Publisher", avatarLetter:"CP", totalViews: 87, totalTitles:13 },
  { id:"vr-14", name:"Petals Publishers",           type:"Publisher", avatarLetter:"PP", totalViews: 73, totalTitles: 7 },
  { id:"vr-15", name:"Anonymous User",              type:"Author",    avatarLetter:"AU", totalViews: 55, totalTitles: 3 },
];

const titleViewsData: BookViewItem[] = [
  { id:"bv-1",  title:"A Beautiful Crime: A Novel",                                                           publisher:"Harper Perennial",          category:"Crime, Thriller, Mystery",   subCategory:"",                   coverGradient:"linear-gradient(135deg,#1e3a8a,#3b82f6)", initials:"AB", totalViews:15, lastViewedDate:"23 Jul 2026" },
  { id:"bv-2",  title:"A Bride for Tom",                                                                       publisher:"Meadows Publishers",         category:"Arts, Cinema, Photography",  subCategory:"",                   coverGradient:"linear-gradient(135deg,#7c3aed,#a855f7)", initials:"BT", totalViews: 5, lastViewedDate:"22 Jul 2026" },
  { id:"bv-3",  title:"A Christmas Carol by Charles Dickens — A Timeless Holiday Classic",                    publisher:"Petals Publishers",          category:"Zoho Books",                 subCategory:"",                   coverGradient:"linear-gradient(135deg,#b45309,#d97706)", initials:"CC", totalViews:14, lastViewedDate:"21 Jul 2026" },
  { id:"bv-4",  title:"A Collection of 14 International Short Stories",                                       publisher:"Meadows Publishers",         category:"Arts, Cinema, Photography",  subCategory:"",                   coverGradient:"linear-gradient(135deg,#065f46,#10b981)", initials:"CS", totalViews: 5, lastViewedDate:"21 Jul 2026" },
  { id:"bv-5",  title:"A Comet Appears",                                                                       publisher:"Cambridge University Press", category:"JEE",                        subCategory:"",                   coverGradient:"linear-gradient(135deg,#9d174d,#ec4899)", initials:"CA", totalViews: 3, lastViewedDate:"20 Jul 2026" },
  { id:"bv-6",  title:"A Concise History of Computers, Smartphones and the Internet",                         publisher:"Orange Publishers",          category:"Computer Application",       subCategory:"GitHub",             coverGradient:"linear-gradient(135deg,#1e3a8a,#6366f1)", initials:"CH", totalViews:14, lastViewedDate:"20 Jul 2026" },
  { id:"bv-7",  title:"A Gift of Ghosts (Tassamara Book 1)",                                                  publisher:"Fingerprint Publishing",     category:"Fictions",                   subCategory:"Historical fiction", coverGradient:"linear-gradient(135deg,#7f1d1d,#ef4444)", initials:"GG", totalViews: 9, lastViewedDate:"19 Jul 2026" },
  { id:"bv-8",  title:"A little princess, being the whole story of Sara Crewe, now told for the first time",  publisher:"Kinder Publications",        category:"Oscar Wilde",                subCategory:"",                   coverGradient:"linear-gradient(135deg,#713f12,#ca8a04)", initials:"LP", totalViews:25, lastViewedDate:"19 Jul 2026" },
  { id:"bv-9",  title:"A Man for Every Purpose",                                                               publisher:"Cambridge University Press", category:"NEET",                       subCategory:"",                   coverGradient:"linear-gradient(135deg,#0c4a6e,#0ea5e9)", initials:"ME", totalViews: 4, lastViewedDate:"18 Jul 2026" },
  { id:"bv-10", title:"A Marginal Jew",                                                                        publisher:"Anonymous User",             category:"Biography",                  subCategory:"",                   coverGradient:"linear-gradient(135deg,#134e4a,#14b8a6)", initials:"MJ", totalViews:21, lastViewedDate:"18 Jul 2026" },
  { id:"bv-11", title:"The Glass Palace Chronicle",                                                            publisher:"Werley Nortreus",            category:"General & Literary Fiction",  subCategory:"",                   coverGradient:"linear-gradient(135deg,#d97706,#b45309)", initials:"GP", totalViews:32, lastViewedDate:"17 Jul 2026" },
  { id:"bv-12", title:"Als Manuskript Gedruckt",                                                               publisher:"Oxford University Press",    category:"General & Literary Fiction",  subCategory:"",                   coverGradient:"linear-gradient(135deg,#ca8a04,#854d0e)", initials:"AM", totalViews:18, lastViewedDate:"17 Jul 2026" },
  { id:"bv-13", title:"History of the English People, Volume VII",                                             publisher:"HarperCollins India",        category:"History",                    subCategory:"British History",    coverGradient:"linear-gradient(135deg,#9333ea,#6b21a8)", initials:"HE", totalViews:11, lastViewedDate:"16 Jul 2026" },
  { id:"bv-14", title:"DiggyPOD Inc 5 x 7 Book Template",                                                     publisher:"APK Publishers",             category:"General & Literary Fiction",  subCategory:"",                   coverGradient:"linear-gradient(135deg,#1d4ed8,#3b82f6)", initials:"DP", totalViews: 7, lastViewedDate:"16 Jul 2026" },
  { id:"bv-15", title:"The Lean Startup",                                                                      publisher:"Aisha Publishers",           category:"Business",                   subCategory:"Entrepreneurship",   coverGradient:"linear-gradient(135deg,#be123c,#f43f5e)", initials:"LS", totalViews:19, lastViewedDate:"15 Jul 2026" },
];

// Derive category rows
const categoryData: CategoryRow[] = (() => {
  const map = new Map<string, { subs: Set<string>; titles: number; views: number }>();
  for (const item of titleViewsData) {
    const r = map.get(item.category) ?? { subs: new Set(), titles: 0, views: 0 };
    if (item.subCategory) r.subs.add(item.subCategory);
    r.titles++;
    r.views += item.totalViews;
    map.set(item.category, r);
  }
  return [...map.entries()]
    .map(([cat, d], i) => ({ id:`cat-${i}`, category:cat, subCategories:[...d.subs], titleCount:d.titles, totalViews:d.views }))
    .sort((a, b) => b.totalViews - a.totalViews);
})();

// ── Constants ─────────────────────────────────────────────────────────────────

const presetOptions = ["MTD","QTD","YTD","Current FY","Last FY","Last 30 days","Custom"] as const;
const PAGE_SIZE = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────

function applyPresetDates(opt: string, setStart: (v: string) => void, setEnd: (v: string) => void) {
  if (opt === "MTD")           { setStart("2026-07-01"); setEnd("2026-07-23"); }
  else if (opt === "QTD")      { setStart("2026-07-01"); setEnd("2026-07-23"); }
  else if (opt === "YTD")      { setStart("2026-01-01"); setEnd("2026-07-23"); }
  else if (opt === "Current FY"){ setStart("2026-04-01"); setEnd("2027-03-31"); }
  else if (opt === "Last FY")  { setStart("2025-04-01"); setEnd("2026-03-31"); }
  else if (opt === "Last 30 days"){ setStart("2026-06-23"); setEnd("2026-07-23"); }
}

// ── Shared UI Components ──────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-xs flex flex-col justify-between">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}>
          <Icon size={16} />
        </span>
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

function PresetDropdown({ value, open, onToggle, onChange }: { value: string; open: boolean; onToggle: () => void; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <button type="button" onClick={onToggle} className="flex h-11 min-w-[130px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer shadow-2xs">
        <span>{value}</span><ChevronDown size={15} className="text-muted-foreground shrink-0" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1">
          {presetOptions.map(opt => (
            <button key={opt} type="button" onClick={() => onChange(opt)}
              className={`flex w-full items-center px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary cursor-pointer ${opt === value ? "font-bold text-brand bg-secondary/60" : "text-foreground"}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ExportDropdown({ open, onToggle, onPdf, onExcel }: { open: boolean; onToggle: () => void; onPdf: () => void; onExcel: () => void }) {
  return (
    <div className="relative ml-auto">
      <button type="button" onClick={onToggle} className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer" style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}>
        <Upload size={15} /><span>Export</span><ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-lg py-1">
          <button type="button" onClick={onPdf}   className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary cursor-pointer"><ScrollText size={15} className="text-muted-foreground" /><span>Export PDF</span></button>
          <button type="button" onClick={onExcel} className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary cursor-pointer"><Table size={15} className="text-muted-foreground" /><span>Export Excel</span></button>
        </div>
      )}
    </div>
  );
}

function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" disabled={page === 1} onClick={() => onPage(Math.max(1, page - 1))} className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer text-muted-foreground">«&nbsp;Previous</button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button key={p} type="button" onClick={() => onPage(p)} className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors cursor-pointer"
          style={p === page ? { backgroundColor: "color-mix(in oklab,var(--brand) 12%,transparent)", color: "var(--brand)" } : undefined}>{p}</button>
      ))}
      <button type="button" disabled={page === total} onClick={() => onPage(Math.min(total, page + 1))} className="flex items-center gap-0.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer text-muted-foreground">Next&nbsp;»</button>
    </div>
  );
}

function FilterHeader({ accent, icon: Icon, children }: { accent?: string; icon: React.ComponentType<{ size?: number }>; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card border border-border rounded-xl p-4 shadow-2xs">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: accent ? `color-mix(in oklab,${accent} 12%,transparent)` : "var(--sidebar-highlight)", color: accent ?? "var(--brand)" }}>
          <Icon size={16} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-foreground">Report Filters & Date Range</h3>
          <p className="text-xs text-muted-foreground">Select filters and period to update results</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">{children}</div>
    </div>
  );
}

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={onClick} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer">
        <ArrowLeft size={16} />
      </button>
      <span className="text-sm font-normal text-foreground">{label}</span>
    </div>
  );
}

function DateRangePickers({ start, end, onStart, onEnd, onPreset }: { start: string; end: string; onStart: (v: string) => void; onEnd: (v: string) => void; onPreset: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3 shadow-2xs">
        <input type="date" value={start} onChange={e => { onStart(e.target.value); onPreset(); }} className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer" />
      </label>
      <span className="text-xs font-medium text-muted-foreground">to</span>
      <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3 shadow-2xs">
        <input type="date" value={end} onChange={e => { onEnd(e.target.value); onPreset(); }} className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer" />
      </label>
    </div>
  );
}

// ── Book Detail Drill-down Table (shared by Publisher & Author) ───────────────

function BookDrillDown({ entity, onBack }: { entity: EntityRow; onBack: () => void }) {
  const [search, setSearch]       = useState("");
  const [preset, setPreset]       = useState("MTD");
  const [presetOpen, setPOpen]    = useState(false);
  const [start, setStart]         = useState("2026-07-01");
  const [end, setEnd]             = useState("2026-07-23");
  const [exportOpen, setExportOpen] = useState(false);
  const [page, setPage]           = useState(1);

  const items = useMemo(() => {
    const base = titleViewsData.filter(item => {
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
    return [...base].sort((a, b) => b.totalViews - a.totalViews);
  }, [search]);

  const totalViews   = items.reduce((a, i) => a + i.totalViews, 0);
  const totalPages   = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const curPage      = Math.min(page, totalPages);
  const pageStart    = (curPage - 1) * PAGE_SIZE;
  const pageItems    = items.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <AppShell title={entity.type === "Publisher" ? "Publisher Views" : "Author Views"} subtitle={`Book breakdown for ${entity.name}.`}>
      <div className="space-y-6 p-4 md:p-8">
        <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5 border-b border-border/60 pb-3.5">
            <button type="button" onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs">
              <ArrowLeft size={18} />
            </button>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-2xs" style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}>
              {entity.avatarLetter}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">{entity.name}</h2>
                <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: "color-mix(in oklab,var(--brand) 10%,transparent)", color: "var(--brand)" }}>{entity.type}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{entity.totalTitles} titles · {entity.totalViews.toLocaleString("en-IN")} total views</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 min-w-[200px]">
              <Search size={15} className="mr-2 text-muted-foreground shrink-0" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by title, category" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground" />
            </label>
            <PresetDropdown value={preset} open={presetOpen} onToggle={() => setPOpen(v => !v)} onChange={v => { setPreset(v); setPOpen(false); setPage(1); applyPresetDates(v, setStart, setEnd); }} />
            <div className="flex items-center gap-2">
              <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3">
                <input type="date" value={start} onChange={e => { setStart(e.target.value); setPreset("Custom"); }} className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer" />
              </label>
              <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3">
                <input type="date" value={end} onChange={e => { setEnd(e.target.value); setPreset("Custom"); }} className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer" />
              </label>
            </div>
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen(v => !v)}
              onPdf={() => { setExportOpen(false); toast.success(`Exporting PDF for ${entity.name}...`); }}
              onExcel={() => { setExportOpen(false); toast.success(`Exporting Excel for ${entity.name}...`); }} />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                  <th className="py-4 pr-4 font-semibold">Category</th>
                  <th className="py-4 pr-4 font-semibold">Sub Category</th>
                  <th className="py-4 pr-4 font-semibold">Last Viewed</th>
                  <th className="py-4 pr-6 text-right font-semibold">Total Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pageItems.length === 0 ? (
                  <tr><td colSpan={5} className="py-16 text-center text-sm text-muted-foreground">No books found.</td></tr>
                ) : pageItems.map(item => (
                  <tr key={item.id} className="transition-colors hover:bg-secondary/50">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3 max-w-xs">
                        <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded-sm text-[9px] font-bold text-white shadow-xs" style={{ background: item.coverGradient }}>{item.initials}</div>
                        <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">{item.title}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.category}</td>
                    <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.subCategory || <span className="text-muted-foreground">—</span>}</td>
                    <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.lastViewedDate}</td>
                    <td className="py-4 pr-6 text-right font-bold text-foreground whitespace-nowrap">{item.totalViews.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Showing {items.length === 0 ? 0 : pageStart + 1} from {items.length} results</p>
            <Pagination page={curPage} total={totalPages} onPage={setPage} />
          </div>
          <div className="flex items-center justify-between border-t border-border bg-secondary/20 px-6 py-4">
            <span className="text-sm font-bold text-foreground">Total Views</span>
            <span className="text-base font-extrabold text-foreground">{totalViews.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ── Generic Entity Report (Publisher or Author) ───────────────────────────────

function EntityReport({ type, onBack }: { type: "Publisher" | "Author"; onBack: () => void }) {
  const [selected, setSelected]   = useState<EntityRow | null>(null);
  const [preset, setPreset]       = useState("MTD");
  const [presetOpen, setPOpen]    = useState(false);
  const [start, setStart]         = useState("2026-07-01");
  const [end, setEnd]             = useState("2026-07-23");
  const [search, setSearch]       = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [page, setPage]           = useState(1);

  const accent  = type === "Publisher" ? "var(--brand)" : "#10b981";
  const bgAccent= type === "Publisher" ? "var(--sidebar-highlight)" : "color-mix(in oklab,#10b981 12%,transparent)";
  const title   = type === "Publisher" ? "Publisher Views" : "Author Views";
  const subtitle= type === "Publisher" ? "View counts grouped by publisher." : "View counts grouped by author.";

  const baseData = useMemo(() => entityData.filter(r => r.type === type), [type]);

  const filtered = useMemo(() => {
    return [...baseData].filter(r => {
      if (search.trim()) return r.name.toLowerCase().includes(search.toLowerCase().trim());
      return true;
    }).sort((a, b) => b.totalViews - a.totalViews);
  }, [baseData, search]);

  const totalViews  = baseData.reduce((a, r) => a + r.totalViews, 0);
  const totalTitles = baseData.reduce((a, r) => a + r.totalTitles, 0);
  const topEntity   = baseData.reduce((m, r) => r.totalViews > m.totalViews ? r : m, baseData[0]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage    = Math.min(page, totalPages);
  const pageStart  = (curPage - 1) * PAGE_SIZE;
  const pageItems  = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  if (selected) return <BookDrillDown entity={selected} onBack={() => setSelected(null)} />;

  return (
    <AppShell title={title} subtitle={subtitle}>
      <div className="space-y-6 p-4 md:p-8">
        <BackButton label="Back to Views Dashboard" onClick={onBack} />

        <FilterHeader icon={Calendar} accent={accent}>
          <PresetDropdown value={preset} open={presetOpen} onToggle={() => setPOpen(v => !v)}
            onChange={v => { setPreset(v); setPOpen(false); setPage(1); applyPresetDates(v, setStart, setEnd); }} />
          <DateRangePickers start={start} end={end} onStart={setStart} onEnd={setEnd} onPreset={() => setPreset("Custom")} />
        </FilterHeader>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard icon={Eye}      label="Total Views"  value={totalViews.toLocaleString("en-IN")} />
          <StatCard icon={BookOpen} label="Total Titles" value={totalTitles.toLocaleString("en-IN")} />
          <StatCard icon={TrendingUp} label="Top Views"  value={topEntity ? topEntity.totalViews.toLocaleString("en-IN") : "0"} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 min-w-[240px] max-w-sm">
              <Search size={15} className="mr-2 text-muted-foreground shrink-0" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder={`Search by ${type} name`} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </label>
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen(v => !v)}
              onPdf={() => { setExportOpen(false); toast.success(`Downloading ${title} (PDF)...`); }}
              onExcel={() => { setExportOpen(false); toast.success(`Downloading ${title} (Excel)...`); }} />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">{type}</th>
                  <th className="py-4 pr-4 font-semibold text-center">Titles</th>
                  <th className="py-4 pr-4 font-semibold"><div className="flex items-center gap-1"><TrendingUp size={12} />Total Views</div></th>
                  <th className="py-4 pr-6 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pageItems.length === 0 ? (
                  <tr><td colSpan={4} className="py-16 text-center text-sm text-muted-foreground">No records found.</td></tr>
                ) : pageItems.map(row => (
                  <tr key={row.id} onClick={() => { setSelected(row); }} className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40 cursor-pointer group">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: bgAccent, color: accent }}>{row.avatarLetter}</span>
                        <p className="font-semibold text-foreground text-sm">{row.name}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-center font-medium text-foreground">{row.totalTitles}</td>
                    <td className="py-4 pr-4 font-semibold text-foreground whitespace-nowrap">{row.totalViews.toLocaleString("en-IN")}</td>
                    <td className="py-4 pr-6 text-right"><ChevronRight size={16} className="text-muted-foreground/60 transition-colors group-hover:text-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">{filtered.length === 0 ? "0 results" : `Showing ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, filtered.length)} from ${filtered.length} results`}</p>
            <Pagination page={curPage} total={totalPages} onPage={setPage} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ── Title Views Report ────────────────────────────────────────────────────────

function TitleReport({ onBack }: { onBack: () => void }) {
  const [search, setSearch]       = useState("");
  const [preset, setPreset]       = useState("MTD");
  const [presetOpen, setPOpen]    = useState(false);
  const [start, setStart]         = useState("2026-07-01");
  const [end, setEnd]             = useState("2026-07-23");
  const [exportOpen, setExportOpen] = useState(false);
  const [page, setPage]           = useState(1);
  const [pubFilter, setPubFilter] = useState("All Publishers");
  const [pubOpen, setPubOpen]     = useState(false);
  const [pubSearch, setPubSearch] = useState("");

  const allPubOptions = useMemo(() => {
    const pubs = [...new Set(titleViewsData.map(r => r.publisher))].sort();
    return ["All Publishers", ...pubs];
  }, []);

  const pubOptions = useMemo(() => {
    if (!pubSearch.trim()) return allPubOptions;
    const q = pubSearch.toLowerCase().trim();
    return allPubOptions.filter(opt => opt.toLowerCase().includes(q));
  }, [allPubOptions, pubSearch]);

  const filtered = useMemo(() => {
    return titleViewsData.filter(item => {
      if (pubFilter !== "All Publishers" && item.publisher !== pubFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return item.title.toLowerCase().includes(q) || item.publisher.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [pubFilter, search]);

  const sorted     = [...filtered].sort((a, b) => b.totalViews - a.totalViews);
  const totalViews = filtered.reduce((a, r) => a + r.totalViews, 0);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const curPage    = Math.min(page, totalPages);
  const pageStart  = (curPage - 1) * PAGE_SIZE;
  const pageItems  = sorted.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <AppShell title="Title Views" subtitle="View counts per individual book title, sorted by most viewed.">
      <div className="space-y-6 p-4 md:p-8">
        <BackButton label="Back to Views Dashboard" onClick={onBack} />

        <FilterHeader icon={Calendar} accent="#6366f1">
          {/* Publisher filter */}
          <div className="relative">
            <button type="button" onClick={() => { setPubOpen(v => !v); setPubSearch(""); }} className="flex h-11 min-w-[160px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-secondary/50 cursor-pointer shadow-2xs">
              <span className="truncate max-w-[120px]">{pubFilter}</span><ChevronDown size={15} className="text-muted-foreground shrink-0" />
            </button>
            {pubOpen && (
              <div className="absolute left-0 z-30 mt-2 w-64 overflow-hidden rounded-lg border border-border bg-card shadow-lg text-sm">
                {/* Search input */}
                <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                  <Search size={13} className="text-muted-foreground shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={pubSearch}
                    onChange={e => setPubSearch(e.target.value)}
                    placeholder="Search publishers…"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
                  />
                </div>
                {/* Options list */}
                <div className="max-h-52 overflow-y-auto py-1">
                  {pubOptions.length === 0 ? (
                    <p className="px-3 py-3 text-xs text-muted-foreground">No publishers match.</p>
                  ) : pubOptions.map(opt => (
                    <button key={opt} type="button" onClick={() => { setPubFilter(opt); setPubOpen(false); setPubSearch(""); setPage(1); }}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary cursor-pointer ${opt === pubFilter ? "font-semibold text-foreground bg-secondary/50" : "text-muted-foreground"}`}>{opt}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <PresetDropdown value={preset} open={presetOpen} onToggle={() => setPOpen(v => !v)}
            onChange={v => { setPreset(v); setPOpen(false); setPage(1); applyPresetDates(v, setStart, setEnd); }} />
          <DateRangePickers start={start} end={end} onStart={setStart} onEnd={setEnd} onPreset={() => setPreset("Custom")} />
        </FilterHeader>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Eye}        label="Total Views"     value={totalViews.toLocaleString("en-IN")} />
          <StatCard icon={BookOpen}   label="Titles Shown"    value={filtered.length.toString()} />
          <StatCard icon={TrendingUp} label="Avg Views/Title" value={filtered.length ? Math.round(totalViews / filtered.length).toString() : "0"} />
          <StatCard icon={BookMarked} label="Top Views"       value={filtered.length ? Math.max(...filtered.map(r => r.totalViews)).toLocaleString("en-IN") : "0"} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 min-w-[240px] max-w-sm">
              <Search size={15} className="mr-2 text-muted-foreground shrink-0" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by title, publisher, category" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </label>
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen(v => !v)}
              onPdf={() => { setExportOpen(false); toast.success("Downloading Title Views (PDF)..."); }}
              onExcel={() => { setExportOpen(false); toast.success("Downloading Title Views (Excel)..."); }} />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                  <th className="py-4 pr-4 font-semibold">Publisher</th>
                  <th className="py-4 pr-4 font-semibold">Category</th>
                  <th className="py-4 pr-4 font-semibold">Sub Category</th>
                  <th className="py-4 pr-4 font-semibold">Last Viewed</th>
                  <th className="py-4 pr-6 text-right font-semibold">Total Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pageItems.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">No titles found.</td></tr>
                ) : pageItems.map(item => (
                  <tr key={item.id} className="transition-colors hover:bg-secondary/50">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3 max-w-xs">
                        <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded-sm text-[9px] font-bold text-white shadow-xs" style={{ background: item.coverGradient }}>{item.initials}</div>
                        <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">{item.title}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.publisher}</td>
                    <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.category}</td>
                    <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.subCategory || <span className="text-muted-foreground">—</span>}</td>
                    <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.lastViewedDate}</td>
                    <td className="py-4 pr-6 text-right font-bold text-foreground whitespace-nowrap">{item.totalViews.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">{sorted.length === 0 ? "0 results" : `Showing ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, sorted.length)} from ${sorted.length} results`}</p>
            <Pagination page={curPage} total={totalPages} onPage={setPage} />
          </div>
          <div className="flex items-center justify-between border-t border-border bg-secondary/20 px-6 py-4">
            <span className="text-sm font-bold text-foreground">Total Views</span>
            <span className="text-base font-extrabold text-foreground">{totalViews.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ── Category Views Report ─────────────────────────────────────────────────────

function CategoryReport({ onBack }: { onBack: () => void }) {
  const [selectedCat, setSelectedCat] = useState<CategoryRow | null>(null);
  const [search, setSearch]           = useState("");
  const [preset, setPreset]           = useState("MTD");
  const [presetOpen, setPOpen]        = useState(false);
  const [start, setStart]             = useState("2026-07-01");
  const [end, setEnd]                 = useState("2026-07-23");
  const [exportOpen, setExportOpen]   = useState(false);
  const [page, setPage]               = useState(1);

  // Category drill-down state
  const [dSearch, setDSearch]         = useState("");
  const [dPage, setDPage]             = useState(1);
  const [dExportOpen, setDExportOpen] = useState(false);

  const filtered = useMemo(() => {
    return categoryData.filter(row => {
      if (search.trim()) return row.category.toLowerCase().includes(search.toLowerCase().trim());
      return true;
    });
  }, [search]);

  // Drill-down items — always computed (hooks must not be conditional)
  const dItems = useMemo(() => {
    if (!selectedCat) return [];
    const base = titleViewsData.filter(item => {
      if (item.category !== selectedCat.category) return false;
      if (dSearch.trim()) {
        const q = dSearch.toLowerCase().trim();
        return item.title.toLowerCase().includes(q) || item.subCategory.toLowerCase().includes(q);
      }
      return true;
    });
    return [...base].sort((a, b) => b.totalViews - a.totalViews);
  }, [selectedCat, dSearch]);

  const totalViews  = categoryData.reduce((a, r) => a + r.totalViews, 0);
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage     = Math.min(page, totalPages);
  const pageStart   = (curPage - 1) * PAGE_SIZE;
  const pageItems   = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const dTotalViews = dItems.reduce((a, i) => a + i.totalViews, 0);
  const dTotalPages = Math.max(1, Math.ceil(dItems.length / PAGE_SIZE));
  const dCurPage    = Math.min(dPage, dTotalPages);
  const dPageStart  = (dCurPage - 1) * PAGE_SIZE;
  const dPageItems  = dItems.slice(dPageStart, dPageStart + PAGE_SIZE);

  // Category drill-down render
  if (selectedCat) {

    return (
      <AppShell title="Category Views" subtitle={`Title breakdown for "${selectedCat.category}".`}>
        <div className="space-y-6 p-4 md:p-8">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3.5 border-b border-border/60 pb-3.5">
              <button type="button" onClick={() => setSelectedCat(null)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs">
                <ArrowLeft size={18} />
              </button>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-2xs" style={{ backgroundColor: "color-mix(in oklab,#f59e0b 12%,transparent)", color: "#f59e0b" }}>
                <FolderOpen size={20} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground">{selectedCat.category}</h2>
                  <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: "color-mix(in oklab,#f59e0b 12%,transparent)", color: "#f59e0b" }}>Category</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedCat.titleCount} titles · {selectedCat.totalViews.toLocaleString("en-IN")} total views</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 min-w-[200px]">
                <Search size={15} className="mr-2 text-muted-foreground shrink-0" />
                <input type="text" value={dSearch} onChange={e => { setDSearch(e.target.value); setDPage(1); }} placeholder="Search by title" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground" />
              </label>
              <ExportDropdown open={dExportOpen} onToggle={() => setDExportOpen(v => !v)}
                onPdf={() => { setDExportOpen(false); toast.success(`Exporting PDF for ${selectedCat.category}...`); }}
                onExcel={() => { setDExportOpen(false); toast.success(`Exporting Excel for ${selectedCat.category}...`); }} />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                    <th className="py-4 pr-4 font-semibold">Publisher</th>
                    <th className="py-4 pr-4 font-semibold">Sub Category</th>
                    <th className="py-4 pr-4 font-semibold">Last Viewed</th>
                    <th className="py-4 pr-6 text-right font-semibold">Total Views</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {dPageItems.length === 0 ? (
                    <tr><td colSpan={5} className="py-16 text-center text-sm text-muted-foreground">No titles found.</td></tr>
                  ) : dPageItems.map(item => (
                    <tr key={item.id} className="transition-colors hover:bg-secondary/50">
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3 max-w-xs">
                          <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded-sm text-[9px] font-bold text-white shadow-xs" style={{ background: item.coverGradient }}>{item.initials}</div>
                          <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">{item.title}</p>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.publisher}</td>
                      <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.subCategory || <span className="text-muted-foreground">—</span>}</td>
                      <td className="py-4 pr-4 text-sm text-foreground whitespace-nowrap">{item.lastViewedDate}</td>
                      <td className="py-4 pr-6 text-right font-bold text-foreground whitespace-nowrap">{item.totalViews.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Showing {dItems.length === 0 ? 0 : dPageStart + 1} from {dItems.length} results</p>
              <Pagination page={dCurPage} total={dTotalPages} onPage={setDPage} />
            </div>
            <div className="flex items-center justify-between border-t border-border bg-secondary/20 px-6 py-4">
              <span className="text-sm font-bold text-foreground">Total Views</span>
              <span className="text-base font-extrabold text-foreground">{dTotalViews.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Category Views" subtitle="View counts grouped by book category.">
      <div className="space-y-6 p-4 md:p-8">
        <BackButton label="Back to Views Dashboard" onClick={onBack} />

        <FilterHeader icon={Calendar} accent="#f59e0b">
          <PresetDropdown value={preset} open={presetOpen} onToggle={() => setPOpen(v => !v)}
            onChange={v => { setPreset(v); setPOpen(false); setPage(1); applyPresetDates(v, setStart, setEnd); }} />
          <DateRangePickers start={start} end={end} onStart={setStart} onEnd={setEnd} onPreset={() => setPreset("Custom")} />
        </FilterHeader>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Eye}        label="Total Views"      value={totalViews.toLocaleString("en-IN")} />
          <StatCard icon={FolderOpen} label="Categories"       value={categoryData.length.toString()} />
          <StatCard icon={BookOpen}   label="Total Titles"     value={titleViewsData.length.toString()} />
          <StatCard icon={TrendingUp} label="Top Category"     value={categoryData[0]?.totalViews.toLocaleString("en-IN") ?? "0"} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 min-w-[240px] max-w-sm">
              <Search size={15} className="mr-2 text-muted-foreground shrink-0" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by category name" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </label>
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen(v => !v)}
              onPdf={() => { setExportOpen(false); toast.success("Downloading Category Views (PDF)..."); }}
              onExcel={() => { setExportOpen(false); toast.success("Downloading Category Views (Excel)..."); }} />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Category</th>
                  <th className="py-4 pr-4 font-semibold">Sub Categories</th>
                  <th className="py-4 pr-4 font-semibold text-center">Titles</th>
                  <th className="py-4 pr-4 font-semibold"><div className="flex items-center gap-1"><TrendingUp size={12} />Total Views</div></th>
                  <th className="py-4 pr-6 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pageItems.length === 0 ? (
                  <tr><td colSpan={5} className="py-16 text-center text-sm text-muted-foreground">No categories found.</td></tr>
                ) : pageItems.map(row => (
                  <tr key={row.id} onClick={() => { setSelectedCat(row); setDPage(1); setDSearch(""); }} className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40 cursor-pointer group">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "color-mix(in oklab,#f59e0b 12%,transparent)", color: "#f59e0b" }}>
                          <FolderOpen size={16} />
                        </span>
                        <p className="font-semibold text-foreground text-sm">{row.category}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      {row.subCategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {row.subCategories.map(s => (
                            <span key={s} className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-xs font-medium text-foreground">{s}</span>
                          ))}
                        </div>
                      ) : <span className="text-muted-foreground text-sm">—</span>}
                    </td>
                    <td className="py-4 pr-4 text-center font-medium text-foreground">{row.titleCount}</td>
                    <td className="py-4 pr-4 font-semibold text-foreground whitespace-nowrap">{row.totalViews.toLocaleString("en-IN")}</td>
                    <td className="py-4 pr-6 text-right"><ChevronRight size={16} className="text-muted-foreground/60 transition-colors group-hover:text-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">{filtered.length === 0 ? "0 results" : `Showing ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, filtered.length)} from ${filtered.length} results`}</p>
            <Pagination page={curPage} total={totalPages} onPage={setPage} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ── Landing Dashboard ─────────────────────────────────────────────────────────

type DashCard = { mode: Exclude<ReportMode, null>; label: string; description: string; icon: React.ComponentType<{ size?: number }>; accent: string; metrics: { label: string; value: string }[]; topItems: { label: string; sub: string; views: number; maxViews: number; avatar?: string; gradient?: string; initials?: string }[] };

function ViewsDashboard({ onSelect }: { onSelect: (mode: Exclude<ReportMode, null>) => void }) {
  const publishers  = entityData.filter(r => r.type === "Publisher").sort((a, b) => b.totalViews - a.totalViews);
  const authors     = entityData.filter(r => r.type === "Author").sort((a, b) => b.totalViews - a.totalViews);
  const topTitles   = [...titleViewsData].sort((a, b) => b.totalViews - a.totalViews);
  const topCats     = [...categoryData];

  const totalViews  = entityData.reduce((a, r) => a + r.totalViews, 0);

  const cards: DashCard[] = [
    {
      mode: "publisher", label: "Publisher Views", description: "Views grouped by publisher",
      icon: Building2, accent: "var(--brand)",
      metrics: [
        { label: "Total Views",    value: publishers.reduce((a,r)=>a+r.totalViews,0).toLocaleString("en-IN") },
        { label: "Publishers",     value: publishers.length.toString() },
        { label: "Top Views",      value: publishers[0]?.totalViews.toLocaleString("en-IN") ?? "0" },
      ],
      topItems: publishers.slice(0,3).map(r=>({ label:r.name, sub:r.type, views:r.totalViews, maxViews:publishers[0].totalViews, avatar:r.avatarLetter })),
    },
    {
      mode: "author", label: "Author Views", description: "Views grouped by author",
      icon: UserCheck, accent: "#10b981",
      metrics: [
        { label: "Total Views",   value: authors.reduce((a,r)=>a+r.totalViews,0).toLocaleString("en-IN") },
        { label: "Authors",       value: authors.length.toString() },
        { label: "Top Views",     value: authors[0]?.totalViews.toLocaleString("en-IN") ?? "0" },
      ],
      topItems: authors.slice(0,3).map(r=>({ label:r.name, sub:r.type, views:r.totalViews, maxViews:authors[0].totalViews, avatar:r.avatarLetter })),
    },
    {
      mode: "title", label: "Title Views", description: "Views per individual book title",
      icon: BookMarked, accent: "#6366f1",
      metrics: [
        { label: "Total Views",    value: titleViewsData.reduce((a,r)=>a+r.totalViews,0).toLocaleString("en-IN") },
        { label: "Titles",         value: titleViewsData.length.toString() },
        { label: "Top Views",      value: topTitles[0]?.totalViews.toString() ?? "0" },
      ],
      topItems: topTitles.slice(0,3).map(r=>({ label:r.title, sub:r.publisher, views:r.totalViews, maxViews:topTitles[0].totalViews, gradient:r.coverGradient, initials:r.initials })),
    },
    {
      mode: "category", label: "Category Views", description: "Views grouped by book category",
      icon: FolderOpen, accent: "#f59e0b",
      metrics: [
        { label: "Total Views",    value: categoryData.reduce((a,r)=>a+r.totalViews,0).toLocaleString("en-IN") },
        { label: "Categories",     value: categoryData.length.toString() },
        { label: "Top Views",      value: topCats[0]?.totalViews.toString() ?? "0" },
      ],
      topItems: topCats.slice(0,3).map(r=>({ label:r.category, sub:`${r.titleCount} titles`, views:r.totalViews, maxViews:topCats[0].totalViews })),
    },
  ];

  return (
    <AppShell title="Book Views" subtitle="Select a report type to explore view analytics.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Summary strip */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Eye}       label="Total Views"       value={totalViews.toLocaleString("en-IN")} />
          <StatCard icon={BookOpen}  label="Tracked Titles"    value={titleViewsData.length.toString()} />
          <StatCard icon={Building2} label="Publishers"        value={publishers.length.toString()} />
          <StatCard icon={Users}     label="Authors"           value={authors.length.toString()} />
        </div>

        {/* 4 report cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {cards.map(card => (
            <div key={card.mode} onClick={() => onSelect(card.mode)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card cursor-pointer transition-all duration-200 hover:shadow-md"
              style={{ ["--hover-border" as string]: card.accent }}>
              {/* Accent stripe */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg,${card.accent},color-mix(in oklab,${card.accent} 40%,transparent))` }} />

              <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm" style={{ backgroundColor: `color-mix(in oklab,${card.accent} 12%,transparent)`, color: card.accent }}>
                      <card.icon size={20} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{card.label}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{card.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={17} className="text-muted-foreground/50 mt-1 transition-transform group-hover:translate-x-0.5" style={{ ["--tw-text-opacity" as string]: "1" }} />
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-5">
                  {card.metrics.map((m, i) => (
                    <div key={m.label} className={`${i < card.metrics.length - 1 ? "pr-5 border-r border-border" : ""}`}>
                      <p className="text-xl font-extrabold tracking-tight text-foreground">{m.value}</p>
                      <p className="text-[11px] text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Top 3 */}
                <div className="space-y-2 border-t border-border/60 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Top 3</p>
                  {card.topItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-muted-foreground/50 w-3 shrink-0">{i + 1}</span>
                        {item.avatar ? (
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold" style={{ backgroundColor: `color-mix(in oklab,${card.accent} 12%,transparent)`, color: card.accent }}>{item.avatar}</span>
                        ) : item.gradient ? (
                          <div className="flex h-6 w-4 shrink-0 items-center justify-center rounded-sm text-[7px] font-bold text-white" style={{ background: item.gradient }}>{item.initials}</div>
                        ) : (
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: `color-mix(in oklab,${card.accent} 12%,transparent)`, color: card.accent }}><FolderOpen size={11} /></span>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{item.sub}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-border">
                          <div className="h-full rounded-full" style={{ width: `${Math.round((item.views / item.maxViews) * 100)}%`, backgroundColor: card.accent }} />
                        </div>
                        <span className="text-xs font-bold text-foreground w-8 text-right">{item.views}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button type="button" onClick={e => { e.stopPropagation(); onSelect(card.mode); }}
                  className="mt-auto flex h-9 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: `color-mix(in oklab,${card.accent} 10%,transparent)`, color: card.accent }}>
                  <Eye size={13} />View {card.label}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

function AdminViewsReportPage() {
  const [mode, setMode] = useState<ReportMode>(null);
  const back = () => setMode(null);

  if (mode === "publisher") return <EntityReport type="Publisher" onBack={back} />;
  if (mode === "author")    return <EntityReport type="Author"    onBack={back} />;
  if (mode === "title")     return <TitleReport  onBack={back} />;
  if (mode === "category")  return <CategoryReport onBack={back} />;
  return <ViewsDashboard onSelect={setMode} />;
}
