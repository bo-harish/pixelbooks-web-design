import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pb-web/")({
  beforeLoad: () => {
    throw redirect({ to: "/pb-web/genre" });
  },
});
