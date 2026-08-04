import { Link, useLocation } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notifications, groupByDate } from "@/lib/notifications-data";

export function NotificationsPopover() {
  const location = useLocation();
  const isPBAdmin = location.pathname.startsWith("/pb-admin");
  const viewAllPath = isPBAdmin ? "/pb-admin/notifications" : "/notifications";

  const preview = notifications.slice(0, 3);
  const groups = groupByDate(preview);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "var(--brand)" }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[420px] max-w-[calc(100vw-2rem)] rounded-xl p-0 shadow-xl"
      >
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold tracking-tight">Notifications</h3>
        </div>
        <ScrollArea className="max-h-[460px]">
          <div className="px-5 py-4">
            {groups.map((group) => (
              <div key={group.date} className="mb-4 last:mb-0">
                <div className="pb-2 text-[13px] font-semibold text-foreground">{group.date}</div>
                <ul className="space-y-2">
                  {group.items.map((n) => (
                    <li key={n.id} className="rounded-lg bg-secondary/60 px-3 py-3">
                      <div className="flex items-start gap-3">
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: "var(--brand)" }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-[13.5px] leading-snug text-foreground">
                              {n.message}
                            </p>
                            <span className="shrink-0 text-[12px] text-muted-foreground">
                              {n.time}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] text-muted-foreground">{n.category}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end border-t border-border px-5 py-3">
          <Link
            to={viewAllPath}
            className="text-sm font-semibold"
            style={{ color: "var(--brand)" }}
          >
            View All
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
