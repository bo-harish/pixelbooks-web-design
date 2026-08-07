import { authorHeaderProfile } from "@/components/headers/author-header-profile";
import { libraryAdminHeaderProfile } from "@/components/headers/library-admin-header-profile";
import { publisherHeaderProfile } from "@/components/headers/publisher-header-profile";
import { superAdminHeaderProfile } from "@/components/headers/super-admin-header-profile";

export type HeaderProfile = {
  name: string;
  role: string;
  initials: string;
  status: string;
};

export function getHeaderProfile(pathname: string): HeaderProfile {
  if (pathname.startsWith("/pb-admin")) {
    return superAdminHeaderProfile;
  }

  if (pathname.startsWith("/library-admin")) {
    return libraryAdminHeaderProfile;
  }

  if (pathname.startsWith("/author")) {
    return authorHeaderProfile;
  }

  return publisherHeaderProfile;
}
