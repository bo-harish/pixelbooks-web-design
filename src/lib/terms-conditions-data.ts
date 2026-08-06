export type PolicyRole = "Publisher" | "Customer" | "Author" | "Library" | "Library User";
export type PolicyStatus = "Active" | "Inactive";

export type TermsConditionItem = {
  id: string;
  name: string;
  role: PolicyRole;
  status: PolicyStatus;
  uploadDate: string;
  updatedAt: string;
  content: string;
  version?: string;
};

export const initialTermsConditions: TermsConditionItem[] = [
  {
    id: "tc-101",
    name: "Terms and Conditions",
    role: "Customer",
    status: "Active",
    uploadDate: "12 Feb 2026",
    updatedAt: "12 Feb 2026, 03:20 PM",
    version: "v3.1",
    content: "1. Account Terms\nBy creating a PixelBooks customer account, you agree to comply with all store usage guidelines, payment terms, and digital content access rules.\n\n2. Purchases & License Scope\nCustomer purchases grant a personal, non-transferable license to read purchased eBooks via authorized PixelBooks web and app interfaces.\n\n3. Refund & Cancellation\nDigital purchases are non-refundable once content download or reading session has commenced, unless required by local statutory laws.",
  },
  {
    id: "tc-102",
    name: "Terms and Conditions",
    role: "Publisher",
    status: "Active",
    uploadDate: "18 Oct 2025",
    updatedAt: "18 Oct 2025, 10:15 AM",
    version: "v2.0",
    content: "1. Publishing License Agreement\nPublishers grant PixelBooks digital distribution rights for catalogue titles across registered partner institutions and retail channels.\n\n2. Royalty Accounting & Payouts\nMargin splits and sales royalties are calculated monthly according to the agreed commission schedule and remitted within 30 days of period close.\n\n3. Content Integrity & Copyright\nPublishers warrant that all uploaded digital content does not infringe on third-party intellectual property or copyright agreements.",
  },
  {
    id: "tc-103",
    name: "Terms and Conditions",
    role: "Library",
    status: "Active",
    uploadDate: "15 Oct 2025",
    updatedAt: "15 Oct 2025, 01:45 PM",
    version: "v2.2",
    content: "1. Institutional Subscription Terms\nInstitutional libraries are allocated simultaneous user borrow thresholds based on active platform tier plans and signed procurement orders.\n\n2. Access Restrictions\nAccess is limited to verified faculty, staff, and enrolled students associated with the subscribing institution.\n\n3. Renewal & Expiry\nLicense allocations automatically expire at the conclusion of the term unless renewed prior to the expiration date.",
  },
  {
    id: "tc-104",
    name: "Terms and Conditions",
    role: "Library User",
    status: "Active",
    uploadDate: "10 Jan 2026",
    updatedAt: "10 Jan 2026, 11:50 AM",
    version: "v3.0",
    content: "1. Borrower Responsibilities\nStudents and library patrons must adhere to loan period limits and return digital titles promptly upon due dates.\n\n2. Fair Use & DRM Rules\nUn-encrypted copying, distribution, or reverse-engineering of borrowed digital reader files is strictly prohibited.",
  },
  {
    id: "tc-105",
    name: "Terms and Conditions",
    role: "Author",
    status: "Active",
    uploadDate: "28 Jun 2026",
    updatedAt: "28 Jun 2026, 04:30 PM",
    version: "v1.4",
    content: "1. Author Platform Terms\nAuthors retain copyright ownership of uploaded manuscript works while granting PixelBooks digital lending and store display rights.\n\n2. Royalty Statements\nRoyalty reports and analytics are generated transparently in the Author Portal portal dashboard.",
  },
  {
    id: "tc-106",
    name: "Terms and Conditions",
    role: "Library User",
    status: "Inactive",
    uploadDate: "10 Jan 2026",
    updatedAt: "10 Jan 2026, 08:30 AM",
    version: "v2.8 (Archived)",
    content: "Archived Terms\nThis version of the Library User Terms and Conditions has been archived and replaced by version 3.0.",
  },
  {
    id: "tc-107",
    name: "Terms and Conditions",
    role: "Customer",
    status: "Inactive",
    uploadDate: "05 Dec 2025",
    updatedAt: "05 Dec 2025, 02:10 PM",
    version: "v3.0 (Archived)",
    content: "Archived Terms\nPrevious customer terms and conditions version, retained for historical compliance audit.",
  },
];
