import { useState, useEffect } from "react";

export type LibraryAdminUserType = "Complete Library Admin" | "Standard Library Admin";
const KEY = "pb_library_admin_user_type";

export function useLibraryAdminType(): [LibraryAdminUserType, (type: LibraryAdminUserType) => void] {
  const [userType, setUserTypeState] = useState<LibraryAdminUserType>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(KEY);
      if (stored === "Complete Library Admin" || stored === "Standard Library Admin") {
        return stored;
      }
    }
    return "Complete Library Admin";
  });

  const setUserType = (newType: LibraryAdminUserType) => {
    setUserTypeState(newType);
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, newType);
      window.dispatchEvent(new CustomEvent("pb-library-admin-type-change", { detail: newType }));
    }
  };

  useEffect(() => {
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<LibraryAdminUserType>;
      if (customEvent.detail && (customEvent.detail === "Complete Library Admin" || customEvent.detail === "Standard Library Admin")) {
        setUserTypeState(customEvent.detail);
      }
    };
    window.addEventListener("pb-library-admin-type-change", handleCustomEvent);
    return () => window.removeEventListener("pb-library-admin-type-change", handleCustomEvent);
  }, []);

  return [userType, setUserType];
}
