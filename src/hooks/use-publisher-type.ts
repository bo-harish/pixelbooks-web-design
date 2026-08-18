import { useState, useEffect } from "react";

export type PublisherUserType = "Complete Publisher" | "Library-Only Publisher";
const KEY = "pb_publisher_user_type";

export function usePublisherType(): [PublisherUserType, (type: PublisherUserType) => void] {
  const [userType, setUserTypeState] = useState<PublisherUserType>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(KEY);
      if (stored === "Complete Publisher" || stored === "Library-Only Publisher") {
        return stored;
      }
    }
    return "Complete Publisher";
  });

  const setUserType = (newType: PublisherUserType) => {
    setUserTypeState(newType);
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, newType);
      window.dispatchEvent(new CustomEvent("pb-publisher-type-change", { detail: newType }));
    }
  };

  useEffect(() => {
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<PublisherUserType>;
      if (customEvent.detail && (customEvent.detail === "Complete Publisher" || customEvent.detail === "Library-Only Publisher")) {
        setUserTypeState(customEvent.detail);
      }
    };
    window.addEventListener("pb-publisher-type-change", handleCustomEvent);
    return () => window.removeEventListener("pb-publisher-type-change", handleCustomEvent);
  }, []);

  return [userType, setUserType];
}
