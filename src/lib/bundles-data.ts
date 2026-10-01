export type BundleStatus = "Published" | "Unpublished" | "Rejected" | "Pending" | "Approved";
export type EntityRole = "Publisher" | "Author";

export type Bundle = {
  id: string;
  title: string;
  entityName: string;
  entityRole: EntityRole;
  bookCount: number;
  status: BundleStatus;
  pricing: number;
  active: boolean;
  cover: string;
  initials: string;
};

export const gradients = [
  "linear-gradient(135deg, #6366f1, #4f46e5)",
  "linear-gradient(135deg, #0ea5e9, #0284c7)",
  "linear-gradient(135deg, #10b981, #059669)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  "linear-gradient(135deg, #ec4899, #db2777)",
  "linear-gradient(135deg, #f43f5e, #be123c)",
  "linear-gradient(135deg, #14b8a6, #0d9488)",
];

export const seedBundles: Bundle[] = [
  {
    id: "qa-tbh-bundle",
    title: "QA-TBH Publishers - Bundle",
    entityName: "QA-TBH Publishers",
    entityRole: "Publisher",
    bookCount: 4,
    status: "Rejected",
    pricing: 1731.65,
    active: true,
    cover: "linear-gradient(135deg, #f43f5e, #be123c)",
    initials: "QAT",
  },
  {
    id: "werley-nortreus-bundle",
    title: "Werley Nortreus - Bundle",
    entityName: "John Doe",
    entityRole: "Author",
    bookCount: 3,
    status: "Unpublished",
    pricing: 12035.18,
    active: true,
    cover: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    initials: "WNB",
  },
  {
    id: "test-bund",
    title: "Test Bund",
    entityName: "John Doe",
    entityRole: "Author",
    bookCount: 2,
    status: "Published",
    pricing: 733.95,
    active: true,
    cover: "linear-gradient(135deg, #f59e0b, #d97706)",
    initials: "TBD",
  },
  {
    id: "qa-tbh-publishers-bundle-2",
    title: "QA-TBH Publishers-Bundle",
    entityName: "QA-TBH Publishers",
    entityRole: "Publisher",
    bookCount: 2,
    status: "Pending",
    pricing: 1785.0,
    active: true,
    cover: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    initials: "QTB",
  },
  {
    id: "test-bundle",
    title: "Test Bundle",
    entityName: "RJ Authors",
    entityRole: "Author",
    bookCount: 3,
    status: "Published",
    pricing: 1678.51,
    active: true,
    cover: "linear-gradient(135deg, #10b981, #047857)",
    initials: "RJA",
  },
  {
    id: "test-bun-7",
    title: "Test Bun 7",
    entityName: "Business Admin",
    entityRole: "Publisher",
    bookCount: 5,
    status: "Published",
    pricing: 2379.0,
    active: true,
    cover: "linear-gradient(135deg, #ec4899, #be185d)",
    initials: "TB7",
  },
  {
    id: "test-case",
    title: "test case",
    entityName: "sani",
    entityRole: "Publisher",
    bookCount: 2,
    status: "Published",
    pricing: 2257.5,
    active: true,
    cover: "linear-gradient(135deg, #6366f1, #4338ca)",
    initials: "TSC",
  },
];

const LOCAL_STORAGE_KEY = "pixelbooks_bundles";

export function getBundles(): Bundle[] {
  if (typeof window === "undefined") {
    return seedBundles;
  }
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedBundles));
    return seedBundles;
  }
  try {
    const parsed: Bundle[] = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) return seedBundles;
    // Sync seed updates for John Doe rows
    return seedBundles.map((sb) => {
      const existing = parsed.find((p) => p.id === sb.id);
      return existing ? { ...existing, entityName: sb.entityName, entityRole: sb.entityRole } : sb;
    });
  } catch {
    return seedBundles;
  }
}

export function saveBundles(bundles: Bundle[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bundles));
}

export function getBundleById(id: string): Bundle | undefined {
  const list = getBundles();
  return list.find((b) => b.id === id);
}

export function updateBundleStatus(id: string, status: BundleStatus): Bundle[] {
  const list = getBundles();
  const updated = list.map((b) => (b.id === id ? { ...b, status } : b));
  saveBundles(updated);
  return updated;
}
