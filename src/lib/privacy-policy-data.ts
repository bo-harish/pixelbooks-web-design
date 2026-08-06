export type PolicyRole = "Publisher" | "Customer" | "Author" | "Library" | "Library User";
export type PolicyStatus = "Active" | "Inactive";

export type PrivacyPolicyItem = {
  id: string;
  name: string;
  role: PolicyRole;
  status: PolicyStatus;
  uploadDate: string;
  updatedAt: string;
  content: string;
  version?: string;
};

export const initialPrivacyPolicies: PrivacyPolicyItem[] = [
  {
    id: "pp-101",
    name: "Privacy policy",
    role: "Customer",
    status: "Active",
    uploadDate: "09 Feb 2026",
    updatedAt: "09 Feb 2026, 02:45 PM",
    version: "v2.4",
    content: "1. Overview\nPixelBooks is committed to protecting the privacy and security of customer data. This Privacy Policy describes how we collect, use, disclose, and safeguard your personal information when you access our online digital library and store platform.\n\n2. Information We Collect\nWe collect personal information that you voluntarily provide to us when registering, such as your full name, email address, billing details, and digital reading preferences.\n\n3. Use of Information\nYour information is used solely to facilitate eBook purchasing, customize reading recommendations, process orders, and send important service notifications.",
  },
  {
    id: "pp-102",
    name: "Privacy policy",
    role: "Publisher",
    status: "Active",
    uploadDate: "13 Oct 2025",
    updatedAt: "13 Oct 2025, 11:30 AM",
    version: "v1.8",
    content: "1. Publisher Data Security\nThis policy outlines how PixelBooks handles intellectual property, royalty accounting information, title metadata, and catalogue digital rights management (DRM) data provided by publishing partners.\n\n2. Confidentiality\nAll publisher financial statements, margin allocations, and unpublished title files are strictly confidential and protected under enterprise-grade encryption.",
  },
  {
    id: "pp-103",
    name: "Privacy policy",
    role: "Library",
    status: "Active",
    uploadDate: "13 Oct 2025",
    updatedAt: "13 Oct 2025, 05:20 PM",
    version: "v2.1",
    content: "1. Institutional Data Compliance\nInstitutional library data, including license allocation records, IP ranges, and institutional coordinator emails, are processed strictly for digital lending compliance and institutional audit requirements.",
  },
  {
    id: "pp-104",
    name: "Privacy policy",
    role: "Library User",
    status: "Active",
    uploadDate: "06 Jan 2026",
    updatedAt: "06 Jan 2026, 04:15 PM",
    version: "v3.0",
    content: "1. Student & Patron Privacy\nStudent reading activity, loan history, and borrowing metadata are anonymized. PixelBooks does not sell student reading records or personally identifiable student telemetry to third parties.",
  },
  {
    id: "pp-105",
    name: "Privacy policy",
    role: "Author",
    status: "Active",
    uploadDate: "22 Jun 2026",
    updatedAt: "22 Jun 2026, 09:10 AM",
    version: "v1.2",
    content: "1. Author Profile & Royalty Data\nAuthor personal data, tax identification numbers, banking payout info, and publishing royalties are kept secure under international data protection regulations.",
  },
  {
    id: "pp-106",
    name: "Privacy policy",
    role: "Library User",
    status: "Inactive",
    uploadDate: "06 Jan 2026",
    updatedAt: "06 Jan 2026, 10:05 AM",
    version: "v2.9 (Archived)",
    content: "Archived Policy\nThis version of the Library User Privacy Policy has been superseded by version 3.0 effective 06 Jan 2026.",
  },
  {
    id: "pp-107",
    name: "Privacy policy",
    role: "Customer",
    status: "Inactive",
    uploadDate: "28 Nov 2025",
    updatedAt: "28 Nov 2025, 03:40 PM",
    version: "v2.3 (Archived)",
    content: "Archived Policy\nPrevious customer privacy policy version, retained for compliance audit history.",
  },
];
