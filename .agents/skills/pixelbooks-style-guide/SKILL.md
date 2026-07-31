---
name: pixelbooks-style-guide
description: "Guidelines and patterns to ensure style consistency across PixelBooks portals (PB Admin, Publisher, Library Admin, Library User). Ensures layout wrapping with AppShell, responsive card grids, Recharts styles, and unified table controls."
---

# PixelBooks Style Guide & Design Token System

This skill enforces visual consistency across all PixelBooks portals by ensuring every new interface utilizes current patterns.

## Layout & Wrappers

- **Always use `AppShell`**: Every primary workspace view must be wrapped using the `<AppShell title="[Page Title]" subtitle="[Subtitle]">` component imported from `@/components/app-shell`. Do not build independent header or sidebar structures.
- **Page Container Spacing / 4-Sided Padding**: Every page view rendered inside `AppShell` must wrap its content in a container with proper 4-sided outer padding (e.g. `<div className="p-4 sm:p-6 md:p-8 space-y-6">` or `<div className="p-6 md:p-8">`) to ensure consistent, clean spacing on all 4 sides (top, right, bottom, left) relative to headers, sidebars, and viewport edges.
- **Dynamic Portals**: AppShell automatically adapts navigation tabs, branding labels, and user roles based on the route prefix:
  - `/publisher` or publisher routes -> Publisher views
  - `/library-admin` -> Library Admin views

## Portal Isolation & Routing Boundaries

- **No Cross-Portal Linking / Redirects**: Never link, navigate, or redirect between different portal directories (`pb-admin`, `author`, `library-admin`, `publisher`). Each portal workspace is isolated; cross-portal transitions, links, or redirects between these distinct portal areas are strictly prohibited.

## Color System

- All colors must utilize `oklch` formatting defined in `src/styles.css`.
- Use the registered tailwind theme tokens:
  - `var(--brand)`: Brand primary teal.
  - `var(--sidebar-highlight)`: Active/highlight state backgrounds.
  - `var(--border)`: Dividers and border strokes.
  - `var(--card)`: Card background surfaces.
- **Control Backgrounds**: Keep control backgrounds white (e.g., input bars, selector dropdown triggers, date pickers should use white backgrounds like `bg-white` or `bg-card` in light themes rather than gray backgrounds like `bg-background`).

## Controls & Components

1. **Stat/Metrics Cards**:
   - Wrap metrics in a flex card layout using standard styles:
     ```tsx
     <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md justify-between min-h-[140px]">
       {/* Icon + Label */}
       <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
         <Icon size={18} />
       </span>
       {/* Value + Sub-label */}
     </div>
     ```
2. **Recharts Charts**:
   - Utilize CartesianGrid with horizontal strokes only: `vertical={false} stroke="var(--border)"`.
   - Tooltip style matching the standard dashboard:
     ```tsx
     <Tooltip
       cursor={{ fill: "color-mix(in oklab, var(--brand) 10%, transparent)" }}
       contentStyle={{
         background: "var(--card)",
         border: "1px solid var(--border)",
         borderRadius: 8,
         fontSize: 12,
       }}
     />
     ```
3. **Interactive Dropdowns**:
   - Always use the UI library’s dropdown primitive:
     ```tsx
     import {
       DropdownMenu,
       DropdownMenuTrigger,
       DropdownMenuContent,
       DropdownMenuItem,
     } from "@/components/ui/dropdown-menu";
     ```
4. **Book Covers (No Image Files)**:
   - Do NOT create or download image files for book covers in any case.
   - Use CSS gradients and centered initials (matching the styling from the publisher catalogue page).
   - The preferred ratio/size for book covers is 438 × 678 (width-to-height ratio of ~1:1.55, e.g., using `aspect-[438/678]` or classes like `w-11 h-17` / `w-10 h-15` or inline styles representing this ratio).

5. **Filter Toolbars, Inputs, Dropdowns, and Calendar Controls (Sales Report Style)**:
   - **Toolbar Container**: Use a rounded container card for filters:
     ```tsx
     <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:flex-nowrap md:items-center md:gap-2 md:p-4">
     ```
   - **Text & Search Boxes**: Use a label wrapper for inputs with embedded search icons:
     ```tsx
     <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3 md:min-w-[240px]">
       <Search size={15} className="mr-2 text-muted-foreground" />
       <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
     </label>
     ```
   - **Selects & Dropdown Triggers**: Trigger buttons must be styled flat without shadows (`shadow-none`), `h-11`, `bg-card`, and `text-sm font-medium`:
     ```tsx
     <SelectTrigger className="h-11 w-full rounded-lg bg-card shadow-none text-sm font-medium">
       <SelectValue />
     </SelectTrigger>
     ```
   - **Calendar / Date Pickers**: Wrap HTML native `date` inputs in a flat wrapper:
     ```tsx
     <label className="relative flex h-11 items-center rounded-lg border border-border bg-card px-3">
       <input type="date" className="w-full bg-transparent text-sm outline-none cursor-pointer" />
     </label>
     ```
   - **Grids / Table Structure**: Grids and tables must follow standard overflow wrapping:
     ```tsx
     <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-sm">
     ```

6. **Title Section Table Cell Layout (Catalogue & PB Admin Titles)**:
   - Combine cover thumbnail, title, author chip, and publisher chip into a single structured cell:
     ```tsx
     <div className="flex items-start gap-4">
       {/* Cover thumbnail */}
       <div
         className="relative flex h-16 w-12 shrink-0 flex-col items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm ring-1 ring-black/10 overflow-hidden"
         style={{ background: b.cover }}
       >
         <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
         <span className="relative z-10 text-[11px] font-extrabold tracking-wider">{b.initials}</span>
       </div>

       {/* Title & Entity Chips */}
       <div className="min-w-0 flex-1 space-y-1.5">
         <p className="font-semibold text-sm leading-snug text-foreground transition-colors group-hover:text-[var(--brand)]">
           {b.title}
         </p>
         <div className="flex flex-wrap items-center gap-2 text-xs">
           {/* Author Chip */}
           <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-2.5 py-0.5 shadow-2xs">
             <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ background: b.cover }}>
               {initials}
             </span>
             <span className="text-[11.5px] font-medium text-foreground">{b.author}</span>
           </div>

           {/* Publisher Chip */}
           <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
             <Building2 size={11} className="shrink-0 text-muted-foreground/80" />
             <span>{b.publisher}</span>
           </div>
         </div>
       </div>
     </div>
     ```

7. **Form Fields & Searchable Dropdowns (Select Primary Author & Store Allocation Style)**:
   - **Field Label**: Positioned above controls:
     ```tsx
     <span className="mb-1.5 block text-sm font-medium text-foreground">Field Label</span>
     ```
   - **Select Trigger**: `h-14` height with `rounded-xl` borders:
     ```tsx
     <button className="flex h-14 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/30 outline-none focus:border-[var(--brand)]">
       <span className="text-muted-foreground">Select option...</span>
       <ChevronDown size={16} className="text-muted-foreground" />
     </button>
     ```
   - **Search Header Inside Dropdown**: Sticky search input inside the dropdown menu container:
     ```tsx
     <div className="sticky top-0 z-10 border-b border-border bg-card p-2.5">
       <div className="relative flex items-center">
         <Search size={15} className="pointer-events-none absolute left-3 text-muted-foreground" />
         <input type="text" placeholder="Search..." className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-8 text-xs text-foreground outline-none focus:border-[var(--brand)]" />
       </div>
     </div>
     ```
   - **Multi-Select Tags Box**:
     ```tsx
     <div className="flex min-h-[56px] w-full flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
       {/* Tag items with X buttons */}
     </div>
     ```

8. **"Back to [Page]" Navigation Control Style (Orders Details & Sub-Pages)**:
   - Use a rounded square icon button (`h-9 w-9 rounded-lg border border-border bg-card`) with `ArrowLeft` icon (`size={16}`) alongside label text:
     ```tsx
     <div className="flex items-center gap-3 mb-4">
       <button
         onClick={() => handleBack()}
         className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
         aria-label="Back to Orders"
       >
         <ArrowLeft size={16} />
       </button>
       <span className="text-sm font-semibold text-foreground">Back to Orders</span>
     </div>
     ```
   - Or as a TanStack Router `<Link>`:
     ```tsx
     <div className="flex items-center gap-3 mb-4">
       <Link
         to="/library-admin/orders"
         className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
       >
         <ArrowLeft size={16} />
       </Link>
       <span className="text-sm font-semibold text-foreground">Back to Orders</span>
     </div>
     ```

9. **Grid Row Hover & Next Page Action Chevron (Catalogue & Listing Tables)**:
   - **Row Hover Class**: Always use `group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/50`.
   - **Mandatory Action Chevron Button Wrapper**: Every clickable table row's rightmost action chevron (`ChevronRight`) MUST be wrapped in a rounded rectangle container so the button highlights on row hover. Never render a bare `<ChevronRight>` without this `h-8 w-8 rounded-md` wrapper:
     ```tsx
     <td className="py-4 pr-6 text-right">
       <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
         <ChevronRight size={16} />
       </span>
     </td>
     ```

10. **Publisher / Author Profile Pic & Name Cell Layout (Publishers & Authors Style)**:
   - Combine circular initials avatar with entity type icon and name:
     ```tsx
     <div className="flex items-center gap-3">
       <div
         className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-2xs"
         style={{ background: item.avatarBg }}
       >
         {getInitials(item.name)}
       </div>
       <div>
         <p className="font-semibold text-foreground group-hover:text-[var(--brand)] transition-colors">
           {item.name}
         </p>
         <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
           {item.type === "Publisher" ? (
             <Building2 size={11} className="inline text-muted-foreground/80" />
           ) : (
             <User size={11} className="inline text-muted-foreground/80" />
           )}
           <span>{item.type}</span>
         </p>
       </div>
     </div>
     ```

11. **Commission Rate Uniform Width Highlight Badge**:
   - Uniform width badge (`w-[150px]`) displaying rate percentage and status tag (`Default` / `Custom`):
     ```tsx
     <div className="inline-flex items-center justify-between w-[150px] px-3.5 py-1.5 rounded-xl border border-border bg-card shadow-2xs group-hover:border-[var(--brand)]/40 transition-colors">
       <span className="text-base font-extrabold text-foreground tracking-tight">
         {item.rate}
       </span>
       {item.isCustom ? (
         <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
           <Sparkles size={9} /> Custom
         </span>
       ) : (
         <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
           Default
         </span>
       )}
     </div>
     ```

12. **Dropdown Menu Filters (Redesigned Unified Toolbar)**
  - All standard toolbar dropdown filters (Languages, Genre, Roles, Borrow Date, Statuses) should be fully custom implementations instead of native standard browser `<select>` dropdowns. The dropdowns need to be styled cohesively using `h-11`, a `rounded-lg` container, `bg-card`, and custom popup shadow layers containing clickable buttons matching the publisher catalogue approach.
   ```tsx
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`flex h-11 items-center justify-between gap-2.5 rounded-lg border border-border bg-card px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] ${className}`}
          >
            <span className="truncate">{value}</span>
            <ChevronDown
              size={15}
              className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div
              className="absolute right-0 top-full z-50 mt-1.5 max-h-56 min-w-[190px] overflow-y-auto rounded-lg border border-border bg-card shadow-lg py-1"
              onMouseLeave={() => setOpen(false)}
            >
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-xs transition-colors hover:bg-secondary ${
                    opt === value
                      ? "font-semibold text-foreground bg-[var(--sidebar-highlight)]"
                      : "text-muted-foreground"
                  }`}
                >
                  {opt}
                  {opt === value && <Check size={14} className="text-[var(--brand)]" />}
                </button>
              ))}
            </div>
          )}
        </div>
   ```
