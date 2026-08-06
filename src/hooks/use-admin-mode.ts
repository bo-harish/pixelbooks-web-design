import { useState, useEffect } from "react";

const ADMIN_MODE_KEY = "pb_admin_mode";

export type AdminMode = "retail" | "library";

export function useAdminMode(): [AdminMode, (mode: AdminMode) => void] {
  const [mode, setModeState] = useState<AdminMode>(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlMode = searchParams.get("mode");
      if (urlMode === "retail" || urlMode === "library") return urlMode;

      const stored = localStorage.getItem(ADMIN_MODE_KEY);
      if (stored === "retail" || stored === "library") return stored;
    }
    return "retail"; // Defaulting to retail for PB Admin Dashboard view
  });

  const setMode = (newMode: AdminMode) => {
    setModeState(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_MODE_KEY, newMode);
      window.dispatchEvent(new CustomEvent("pb-admin-mode-change", { detail: newMode }));
    }
  };

  useEffect(() => {
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AdminMode>;
      if (customEvent.detail && (customEvent.detail === "retail" || customEvent.detail === "library")) {
        setModeState(customEvent.detail);
      }
    };
    window.addEventListener("pb-admin-mode-change", handleCustomEvent);
    return () => window.removeEventListener("pb-admin-mode-change", handleCustomEvent);
  }, []);

  return [mode, setMode];
}
