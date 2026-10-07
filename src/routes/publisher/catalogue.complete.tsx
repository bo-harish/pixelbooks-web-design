import { createFileRoute } from "@tanstack/react-router";
import { CompletePublisherCataloguePage } from "@/components/publisher/complete-publisher-catalogue-page";

export const Route = createFileRoute("/publisher/catalogue/complete")({
  validateSearch: (search: Record<string, unknown>): { edit?: string } => ({
    edit: (search.edit as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Complete Publisher — eBook Listing" },
      {
        name: "description",
        content: "Commercial retail eBook listing creation and editing for Complete Publisher logins.",
      },
    ],
  }),
  component: CompletePublisherRoutePage,
});

function CompletePublisherRoutePage() {
  const search = Route.useSearch();
  return <CompletePublisherCataloguePage editBookId={search.edit} />;
}
