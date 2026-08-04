import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  notifications as seed,
  groupByDate,
  type NotificationItem,
} from "@/lib/notifications-data";

export const Route = createFileRoute("/pb-admin/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — PixelBooks Admin" },
      {
        name: "description",
        content: "Review platform alerts, publisher submissions, and administrative notifications.",
      },
    ],
  }),
  component: AdminNotificationsPage,
});

function AdminNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(seed);
  const groups = groupByDate(items);

  const clearDate = (date: string) => setItems((prev) => prev.filter((n) => n.date !== date));

  return (
    <AppShell title="Notifications" subtitle="Review platform alerts and system activity notifications.">
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-2xs">
          {groups.length === 0 && (
            <div className="py-16 text-center text-sm text-muted-foreground">
              You're all caught up. No new admin notifications.
            </div>
          )}
          {groups.map((group) => (
            <section key={group.date} className="mb-6 last:mb-0">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-foreground">{group.date}</h2>
                <button
                  type="button"
                  onClick={() => clearDate(group.date)}
                  className="text-sm font-semibold underline-offset-4 hover:underline cursor-pointer"
                  style={{ color: "var(--brand)" }}
                >
                  Clear All
                </button>
              </div>
              <ul className="space-y-2">
                {group.items.map((n) => (
                  <li key={n.id} className="rounded-lg bg-secondary/60 px-4 py-4">
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--brand)" }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-[14px] leading-snug text-foreground">{n.message}</p>
                          <span className="shrink-0 text-[13px] text-muted-foreground">
                            {n.time}
                          </span>
                        </div>
                        <p className="mt-1 text-[12.5px] text-muted-foreground">{n.category}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
