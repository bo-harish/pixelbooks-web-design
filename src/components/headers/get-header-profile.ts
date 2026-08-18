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
    let role = libraryAdminHeaderProfile.role;
    if (typeof window !== "undefined") {
      const storedType = localStorage.getItem("pb_library_admin_user_type");
      if (storedType) role = storedType;
    }
    return {
      ...libraryAdminHeaderProfile,
      role,
    };
  }

  if (pathname.startsWith("/author")) {
    return authorHeaderProfile;
  }

  let role = publisherHeaderProfile.role;
  if (typeof window !== "undefined") {
    const storedType = localStorage.getItem("pb_publisher_user_type");
    if (storedType) role = storedType;
  }
  return {
    ...publisherHeaderProfile,
    role,
  };
}

export function getProfileRoute(pathname: string): string {
  if (pathname.startsWith("/pb-admin")) {
    return "/pb-admin/profile";
  }
  if (pathname.startsWith("/library-admin")) {
    return "/library-admin/profile";
  }
  if (pathname.startsWith("/author")) {
    return "/author/profile";
  }
  return "/publisher/profile";
}


