import { createFileRoute } from "@tanstack/react-router";
import { usePublisherType } from "@/hooks/use-publisher-type";
import { CompletePublisherCataloguePage } from "@/components/publisher/complete-publisher-catalogue-page";
import { LibraryOnlyPublisherCataloguePage } from "@/components/publisher/library-only-publisher-catalogue-page";
import { Building2, Library, Sparkles } from "lucide-react";

export const Route = createFileRoute("/publisher/catalogue/new")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { edit?: string; role?: "complete" | "library" } => ({
    edit: (search.edit as string) || undefined,
    role: (search.role as "complete" | "library") || undefined,
  }),
  head: () => ({
    meta: [
      { title: "eBook Listing — PixelBooks Publisher" },
      {
        name: "description",
        content: "Add or edit eBook listing in PixelBooks Publisher portal.",
      },
    ],
  }),
  component: CatalogueAddEditDispatcher,
});

function CatalogueAddEditDispatcher() {
  const search = Route.useSearch();
  const [publisherType, setPublisherType] = usePublisherType();

  // If search.role is explicitly passed in URL, respect it; otherwise respect active login persona
  const effectiveRole: "complete" | "library" =
    search.role ?? (publisherType === "Library-Only Publisher" ? "library" : "complete");

  const isComplete = effectiveRole === "complete";

  return (
    <div className="relative">
      {/* Floating Login Persona Quick Switcher Pill */}
      <div className="sticky top-2 z-50 mx-auto mb-2 flex w-fit items-center gap-2 rounded-full border border-border bg-card/90 px-3.5 py-1.5 shadow-md backdrop-blur-md text-xs font-semibold">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Sparkles size={13} className="text-[var(--brand)]" />
          Active Login:
        </span>

        <button
          type="button"
          onClick={() => setPublisherType("Complete Publisher")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
            isComplete
              ? "bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/30 shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 size={13} />
          Complete Publisher
        </button>

        <button
          type="button"
          onClick={() => setPublisherType("Library-Only Publisher")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
            !isComplete
              ? "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-500/30 shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Library size={13} />
          Library-Only Publisher
        </button>
      </div>

      {/* Render the dedicated page for the selected publisher login */}
      {isComplete ? (
        <CompletePublisherCataloguePage editBookId={search.edit} />
      ) : (
        <LibraryOnlyPublisherCataloguePage editBookId={search.edit} />
      )}
    </div>
  );
}
