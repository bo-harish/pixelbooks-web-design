import { createFileRoute } from "@tanstack/react-router";
import { LibraryOnlyPublisherCataloguePage } from "@/components/publisher/library-only-publisher-catalogue-page";

export const Route = createFileRoute("/publisher/catalogue/library")({
  validateSearch: (search: Record<string, unknown>): { edit?: string } => ({
    edit: (search.edit as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Library-Only Publisher — Academic eBook Listing" },
      {
        name: "description",
        content: "Academic institutional eBook listing creation and allocation for Library-Only Publisher logins.",
      },
    ],
  }),
  component: LibraryOnlyPublisherRoutePage,
});

function LibraryOnlyPublisherRoutePage() {
  const search = Route.useSearch();
  return <LibraryOnlyPublisherCataloguePage editBookId={search.edit} />;
}
